// Auth is disabled. Export a placeholder to satisfy imports.
import AzureADProvider from 'next-auth/providers/azure-ad';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import { ensureUserFromOidc } from './db/users';
import prisma from './prisma';

// Simple in-memory rate limiting for credentials auth (per email/IP). For production, replace.
const credRateMap = new Map<string, { count: number; ts: number }>();
const CRED_WINDOW_MS = 60_000;
const CRED_MAX_ATTEMPTS = 15;

// NextAuth configuration using Microsoft Entra ID (Azure AD) single-tenant
export const authOptions: NextAuthOptions = {
	providers: [
		AzureADProvider({
			name: 'Microsoft',
			clientId: process.env.AZURE_AD_CLIENT_ID!,
			clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
			tenantId: process.env.AZURE_AD_TENANT_ID!,
			authorization: {
				params: {
					// standard OIDC scopes; add offline_access if you need refresh tokens
					scope: 'openid profile email',
				},
			},
			// If you need custom profile mapping you can map here
			profile(profile) {
				// profile.oid is object ID; sub is subject
				return {
					id: profile.sub || profile.oid,
					name: profile.name ?? null,
					email: profile.email ?? profile.preferred_username ?? null,
				} as any;
			},
		}),
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(creds) {
				if (!creds?.email || !creds.password) return null;
				const normEmail = creds.email.trim().toLowerCase();
				// Rate limit key combines email + ip (ip best-effort from headers in API routes; here we only have email)
				const key = normEmail;
				const now = Date.now();
				const ent = credRateMap.get(key);
				if (!ent || now - ent.ts > CRED_WINDOW_MS) {
					credRateMap.set(key, { count: 1, ts: now });
				} else {
					ent.count += 1;
					if (ent.count > CRED_MAX_ATTEMPTS) return null; // silent throttle
				}
				const user: any = await prisma.user.findFirst({ where: { email: normEmail } });
				if (!user || !('passwordHash' in user) || !user.passwordHash) return null;
				const ok = await bcrypt.compare(creds.password, user.passwordHash);
				if (!ok) {
					// Increment failed sign-in counters (best-effort)
					try {
						await prisma.user.update({
							where: { id: user.id },
							data: ({
								failedSignInCount: (user.failedSignInCount ?? 0) + 1,
								lastFailedSignInAt: new Date(),
							}) as any,
						});
					} catch (e) {
						console.warn('[auth][credentials] failed to update failedSignInCount', e);
					}
					return null;
				}
				// Update last sign-in timestamp
				try {
					await prisma.user.update({
						where: { id: user.id },
						data: ({
							lastSignInAt: new Date(),
							signInIdentity: normEmail,
							failedSignInCount: 0,
						}) as any,
					});
				} catch (e) {
					console.warn('[auth][credentials] failed to update lastSignInAt', e);
				}
				return {
					id: user.id,
					name: user.name || user.email || 'User',
					email: user.email,
					provider: 'credentials',
					// Use persisted providerAccountId from DB so session lookups succeed
					providerAccountId: user.providerAccountId,
				};
			},
		}),
	],
	session: { strategy: 'jwt' },
	callbacks: {
		async jwt({ token, account, profile, user }) {
			// Persist provider/account identifiers
			if (account) {
				// Distinguish credentials vs azure-ad
				token.provider = account.provider;
				token.providerAccountId = account.providerAccountId || (user as any)?.id || account.sub || account.userId || account.accountId;
			}
				// Persist internal user.id when we have a user object
				if (user && (user as any).id) {
					(token as any).uid = (user as any).id;
				}
			// Repair token if later executions lack account but we have user
			if (!token.providerAccountId && user && (user as any).providerAccountId) {
				(token as any).providerAccountId = (user as any).providerAccountId;
			}
			// For credentials sign in ensure email stays normalized lower
			if (user && (user as any).email) {
				token.email = (user as any).email.toLowerCase();
			}
			// Basic profile props
			if (profile) {
				token.name = profile.name ?? token.name;
				// Azure AD often surfaces preferred_username as the UPN
				// Keep existing email if already present
				const email = (profile as any).email || (profile as any).preferred_username;
				if (email) token.email = email;
				// oid/sub can be used for stable id
				const oid = (profile as any).oid || (profile as any).sub;
				if (oid) (token as any).oid = oid;
			}
			// If we still don't have an internal uid (typical for OAuth without an adapter),
			// resolve it from our own User table using providerAccountId or email.
			try {
				if (!(token as any).uid) {
					let u: any = null;
					if ((token as any).providerAccountId) {
						u = await prisma.user.findUnique({ where: { providerAccountId: (token as any).providerAccountId } });
					}
					if (!u && token.email) {
						u = await prisma.user.findFirst({ where: { email: token.email.toLowerCase() } });
					}
					if (u) {
						(token as any).uid = u.id;
						// Normalize providerAccountId from DB (authoritative)
						(token as any).providerAccountId = u.providerAccountId;
						// Attach directory ids for convenience
						(token as any).oid = (token as any).oid || u.objectId;
					}
				}
			} catch (e) {
				// Non-fatal. Leave token as-is.
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				// Basic identity
				session.user.name = token.name as string | undefined;
				session.user.email = token.email as string | undefined;
				(session.user as any).provider = (token as any).provider;
				(session.user as any).providerAccountId = (token as any).providerAccountId;
				(session.user as any).oid = (token as any).oid;
				if ((token as any).uid) {
					(session.user as any).id = (token as any).uid;
				}
				// Hydrate profile fields if available
				try {
						if ((token as any).uid || (token as any).providerAccountId || token.email) {
							const userRec = await prisma.user.findFirst({
								where: (token as any).uid
									? { id: (token as any).uid }
									: ( (token as any).providerAccountId
										? { providerAccountId: (token as any).providerAccountId }
										: { email: token.email?.toLowerCase() }
								),
								include: { profile: true },
							});
						if (userRec?.profile) {
							if (userRec.profile.displayName) {
								(session.user as any).displayName = userRec.profile.displayName;
								session.user.name = userRec.profile.displayName;
							}
							if (userRec.profile.avatarUrl) {
								(session.user as any).avatarUrl = userRec.profile.avatarUrl;
								(session.user as any).image = userRec.profile.avatarUrl;
							}
							(session.user as any).needsProfile = !userRec.profile.displayName;
						} else {
							(session.user as any).needsProfile = true;
						}
						// Attach identity & custom fields (cast to any to avoid client drift)
						const u: any = userRec;
						if (u) {
							// Always overwrite providerAccountId with DB authoritative value
							(session.user as any).providerAccountId = u.providerAccountId;
							(session.user as any).objectId = u?.objectId;
							(session.user as any).upn = u?.upn;
							(session.user as any).signInIdentity = u?.signInIdentity;
							(session.user as any).lastSignInAt = u?.lastSignInAt;
							(session.user as any).firstName = u?.firstName;
							(session.user as any).lastName = u?.lastName;
							(session.user as any).phoneNumber = u?.phoneNumber;
							(session.user as any).phoneVerifiedAt = u?.phoneVerifiedAt;
							(session.user as any).emailVerifiedAt = u?.emailVerifiedAt;
							(session.user as any).loyaltyNumber = u?.loyaltyNumber;
							(session.user as any).preferredLanguage = u?.preferredLanguage;
							(session.user as any).customerTier = u?.customerTier;
							(session.user as any).isDisabled = u?.isDisabled;
						}
					}
				} catch (e) {
					// Silent fail; do not break session
					console.warn('[auth][session] profile hydration failed', e);
				}
			}
			return session;
		},
				async signIn({ profile, account }) {
					try {
						await ensureUserFromOidc({
							sub: (profile as any)?.sub || (profile as any)?.oid,
							oid: (profile as any)?.oid,
							email: (profile as any)?.email || (profile as any)?.preferred_username,
							preferred_username: (profile as any)?.preferred_username,
							name: (profile as any)?.name,
							given_name: (profile as any)?.given_name,
							family_name: (profile as any)?.family_name,
							provider: 'azure-ad',
							providerAccountId: account?.providerAccountId || (account as any)?.sub,
						});
					} catch (e) {
						console.error('[auth] ensureUserFromOidc failed', e);
					}
					return true;
				},
	},
	pages: {
		signIn: '/auth/signin',
	},
	debug: false,
};
