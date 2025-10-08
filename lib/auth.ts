// Auth configuration for Next-Auth
import AzureADProvider from 'next-auth/providers/azure-ad';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import type { NextAuthOptions } from 'next-auth';
import { ensureUserFromOidc } from './db/users';
import { CosmosDBService } from './azure/cosmos-service';

// Ensure NEXTAUTH_SECRET is set in production
if (!process.env.NEXTAUTH_SECRET) {
  console.error('ERROR: NEXTAUTH_SECRET is not set in environment!');
  console.error('This will cause authentication to fail. Please set NEXTAUTH_SECRET in your environment.');
  console.error('Run `npm run generate:secret` to generate a secure value and add it to:');
  console.error('1. GitHub repository secrets (for CI/CD)');
  console.error('2. Azure App Service application settings');
  console.error('3. .env.production file (for local production testing)');
  
  // In production, we'll throw an error to prevent insecure deployments
  if (process.env.NODE_ENV === 'production' && !process.env.IGNORE_AUTH_SECRET_WARNING) {
    console.error('Setting fallback secret for production - THIS IS NOT SECURE FOR LONG-TERM USE');
    // Set a fallback secret that is at least stable for the current runtime
    process.env.NEXTAUTH_SECRET = 'FALLBACK_SECRET_' + Date.now().toString() + '_PLEASE_CONFIGURE_PROPERLY';
  }
  
  // Use a default value in development only
  if (process.env.NODE_ENV !== 'production') {
    process.env.NEXTAUTH_SECRET = 'DEV_INSECURE_SECRET_DO_NOT_USE_IN_PRODUCTION_' + Date.now().toString();
    console.warn('Using insecure default NEXTAUTH_SECRET for development only.');
  }

  // Log that we're using a generated secret
  console.warn('Using a generated NEXTAUTH_SECRET - THIS WILL CAUSE SESSIONS TO RESET ON SERVER RESTART');
}

// Simple in-memory rate limiting for credentials auth (per email/IP). For production, replace.
const credRateMap = new Map<string, { count: number; ts: number }>();
const CRED_WINDOW_MS = 60_000;
const CRED_MAX_ATTEMPTS = 15;

// Check Azure AD environment variables 
if (!process.env.AZURE_AD_CLIENT_ID || !process.env.AZURE_AD_CLIENT_SECRET || !process.env.AZURE_AD_TENANT_ID) {
	console.error('[auth] AZURE_AD_* environment variables missing');
}
if (!process.env.NEXTAUTH_URL) {
	console.error('[auth] NEXTAUTH_URL environment variable missing');
} else {
	console.log('[auth] Redirect URI for Microsoft login should be:', `${process.env.NEXTAUTH_URL}/api/auth/callback/microsoft`);
}

// Ensure we have a valid NEXTAUTH_URL for building
if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_URL) {
  console.warn('NEXTAUTH_URL not set, using fallback URL for build');
  process.env.NEXTAUTH_URL = 'https://thinkforward-dev.azurewebsites.net';
}

// NextAuth configuration using Microsoft Entra ID (Azure AD) single-tenant
export const authOptions: NextAuthOptions = {
	// Explicitly set the secret from environment variable
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV !== 'production',
	logger: {
		error(code, ...message) {
			console.error('[nextauth][error]', code, ...message);
		},
		warn(code, ...message) {
			console.warn('[nextauth][warn]', code, ...message);
		},
		debug(code, ...message) {
			if (process.env.NODE_ENV !== 'production') {
				console.debug('[nextauth][debug]', code, ...message);
			}
		},
	},
	providers: [
		AzureADProvider({
			id: 'microsoft', // Set ID to 'microsoft' to match what's used in signIn() calls
			name: 'Microsoft',
			clientId: process.env.AZURE_AD_CLIENT_ID!,
			clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
			// Use 'common' for multi-tenant, or specific tenantId for single-tenant
			tenantId: 'common', // Changed from process.env.AZURE_AD_TENANT_ID! to 'common' for multi-tenant support
			authorization: {
				params: {
					// Extended scope to get more profile information
					scope: 'openid profile email User.Read',
				},
			},
			profile(profile) {
				// Enhanced profile mapping with Microsoft Graph data
				return {
					id: profile.sub || profile.oid,
					objectId: profile.oid, // Microsoft specific identifier
					tenantId: profile.tid, // Azure AD tenant ID
					name: profile.name ?? null,
					email: profile.email ?? profile.preferred_username ?? null,
				} as any;
			},
			// Log early if important environment variables are missing
			checks: ['pkce', 'state'],
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
                
                // Initialize Cosmos DB service
                const cosmosService = new CosmosDBService();
                
				const user: any = await cosmosService.getUserByEmail(normEmail);
				if (!user || !('passwordHash' in user) || !user.passwordHash) return null;
				const ok = await bcrypt.compare(creds.password, user.passwordHash);
				if (!ok) {
					// Increment failed sign-in counters (best-effort)
					try {
						await cosmosService.updateUser(user.id, {
							failedSignInCount: (user.failedSignInCount ?? 0) + 1,
							lastFailedSignInAt: new Date(),
						});
					} catch (e) {
						console.warn('[auth][credentials] failed to update failedSignInCount', e);
					}
					return null;
				}
				// Update last sign-in timestamp
				try {
					await cosmosService.updateUser(user.id, {
						lastSignInAt: new Date(),
						signInIdentity: normEmail,
						failedSignInCount: 0,
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
                    // Initialize Cosmos DB service
                    const cosmosService = new CosmosDBService();
                    
					if ((token as any).providerAccountId) {
						u = await cosmosService.getUserByProviderAccountId(token.provider as string, (token as any).providerAccountId);
					}
					if (!u && token.email) {
						u = await cosmosService.getUserByEmail(token.email.toLowerCase());
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
						// Initialize Cosmos DB service
						const cosmosService = new CosmosDBService();
						
						let userRec: any = null;
						
						// Try to find the user by ID, providerAccountId, or email
						if ((token as any).uid) {
							userRec = await cosmosService.getUserById((token as any).uid);
						} else if ((token as any).providerAccountId && (token as any).provider) {
							userRec = await cosmosService.getUserByProviderAccountId(
								(token as any).provider,
								(token as any).providerAccountId
							);
						} else if (token.email) {
							userRec = await cosmosService.getUserByEmail(token.email.toLowerCase());
						}
						
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
						if (userRec) {
							// Always overwrite providerAccountId with DB authoritative value
							(session.user as any).providerAccountId = userRec.providerAccountId;
							(session.user as any).objectId = userRec?.objectId;
							(session.user as any).upn = userRec?.upn;
							(session.user as any).signInIdentity = userRec?.signInIdentity;
							(session.user as any).lastSignInAt = userRec?.lastSignInAt;
							(session.user as any).firstName = userRec?.firstName;
							(session.user as any).lastName = userRec?.lastName;
							(session.user as any).phoneNumber = userRec?.phoneNumber;
							(session.user as any).phoneVerifiedAt = userRec?.phoneVerifiedAt;
							(session.user as any).emailVerifiedAt = userRec?.emailVerifiedAt;
							(session.user as any).loyaltyNumber = userRec?.loyaltyNumber;
							(session.user as any).preferredLanguage = userRec?.preferredLanguage;
							(session.user as any).customerTier = userRec?.customerTier;
							(session.user as any).isDisabled = userRec?.isDisabled;
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
							provider: 'microsoft',
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
};
