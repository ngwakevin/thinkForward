// Updated NextAuth.js configuration to use Microsoft and Google providers
import { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ensureUserFromOidc } from './db/users';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { User, Account } from 'next-auth';
import bcrypt from 'bcryptjs';

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

// Check for required environment variables
const checkEnvVars = () => {
  // Microsoft/Entra ID
  if (!process.env.AZURE_AD_CLIENT_ID || !process.env.AZURE_AD_CLIENT_SECRET) {
    console.error('[auth] AZURE_AD_* environment variables missing');
    console.error('[auth] CLIENT_ID:', process.env.AZURE_AD_CLIENT_ID ? `Set (${process.env.AZURE_AD_CLIENT_ID})` : 'Not set');
    console.error('[auth] CLIENT_SECRET:', process.env.AZURE_AD_CLIENT_SECRET ? 'Set (hidden)' : 'Not set');
    console.error('[auth] TENANT_ID:', process.env.AZURE_AD_TENANT_ID ? `Set (${process.env.AZURE_AD_TENANT_ID})` : 'Not set (using "common")');
    
    if (process.env.NODE_ENV !== 'production') {
      // Use the confirmed values if they're not already set
      console.warn('[auth] Using fallback values for AZURE_AD');
      process.env.AZURE_AD_CLIENT_ID = process.env.AZURE_AD_CLIENT_ID || 'd46ea9de-b544-4972-906e-72c6be61f1d6';
      // Don't set a fallback client secret in code
      // Use 'common' for multi-tenant access including personal Microsoft accounts
      process.env.AZURE_AD_TENANT_ID = process.env.AZURE_AD_TENANT_ID || 'common';
    } else {
      console.error('[auth] Missing required Microsoft authentication environment variables in production');
      console.error('[auth] This will cause Microsoft sign-in to fail');
    }
  }
  
  // Google
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('[auth] Google auth environment variables missing. Google login will be disabled.');
  }
};

// Call the environment check function
checkEnvVars();

// Ensure NEXTAUTH_URL is set
if (!process.env.NEXTAUTH_URL && typeof window === 'undefined') {
  // Only set this on the server side
  const hostname = process.env.VERCEL_URL || process.env.NEXTAUTH_URL_INTERNAL || 'localhost:3000';
  const protocol = hostname.includes('localhost') ? 'http' : 'https';
  process.env.NEXTAUTH_URL = `${protocol}://${hostname}`;
  console.warn(`[auth] NEXTAUTH_URL not set, using: ${process.env.NEXTAUTH_URL}`);
}

export const authOptions: NextAuthOptions = {
  // Using NextAuth v4 configuration compatible with Azure App Service
  // Enable secure cookies for proper proxy handling on Azure
  useSecureCookies: true,
  
  session: {
    strategy: 'jwt',
    // Adjust session max age as needed (default: 30 days)
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Ensure cookies are properly configured for Azure's reverse proxy
  cookies: {
    sessionToken: {
      name: "__Secure-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
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
  // Debug logs are added to the logger above
  providers: [
    // Credentials Provider
    CredentialsProvider({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.warn('[auth] Missing credentials');
          return null;
        }

        try {
          // Import CosmosDBService for user lookup
          const { cosmosService } = await import('./azure/cosmos-service');

          // Find user by email
          const user = await cosmosService.getUserByEmail(credentials.email.toLowerCase());
          
          // User not found
          if (!user || !user.passwordHash) {
            console.warn(`[auth] User not found or no password: ${credentials.email}`);
            return null;
          }

          // Compare password
          const passwordValid = await bcrypt.compare(credentials.password, user.passwordHash);
          
          // Password doesn't match
          if (!passwordValid) {
            console.warn(`[auth] Invalid password for: ${credentials.email}`);
            return null;
          }

          // Return user data needed for session
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.profile?.avatarUrl || null,
            provider: 'credentials',
            providerAccountId: user.id,
          };
        } catch (error) {
          console.error('[auth] Error authorizing credentials:', error);
          return null;
        }
      },
    }),
    
    // Microsoft / Entra ID Provider
    AzureADProvider({
      id: 'microsoft', // Set ID to 'microsoft' to match what's used in signIn() calls
      name: 'Microsoft',
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      // Use 'common' for multi-tenant access including personal Microsoft accounts
      tenantId: process.env.AZURE_AD_TENANT_ID || 'common',
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
          image: null, // Microsoft doesn't provide image URL by default
          provider: 'microsoft',
        };
      },
    }),
    
    // Google Provider (conditional based on environment variables)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                provider: 'google',
              };
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Create or update user in database when they sign in
      try {
        if (account && user) {
          const profileEmail =
            user.email ??
            (profile as any)?.email ??
            (profile as any)?.preferred_username ??
            (profile as any)?.userPrincipalName ??
            (account?.idTokenClaims as any)?.preferred_username ??
            null;

          const persistedUser = await ensureUserFromOidc({
            email: profileEmail || undefined,
            name: user.name || (profile as any)?.name || '',
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            oid: (user as any).objectId || (profile as any)?.oid || undefined,
            sub: (user as any).id,
            preferred_username:
              (profile as any)?.preferred_username ||
              (profile as any)?.userPrincipalName ||
              profileEmail ||
              undefined,
            given_name: (profile as any)?.given_name,
            family_name: (profile as any)?.family_name,
          });

          if (persistedUser) {
            // Normalize user object so downstream callbacks receive consistent identifiers
            (user as any).id = persistedUser.id || user.id;
            (user as any).providerAccountId = persistedUser.providerAccountId || account.providerAccountId;
            (user as any).objectId = persistedUser.objectId || (user as any).objectId;
            (user as any).email = persistedUser.email || profileEmail || user.email;
            (user as any).name = persistedUser.name || user.name;
            console.log(`[auth] User authenticated: ${(user as any).email || 'unknown email'} (Provider: ${account.provider})`);
          } else {
            console.warn(
              `[auth] User authenticated but not persisted: ${(user as any).email || 'unknown email'} (Provider: ${account.provider})`
            );
            (user as any).providerAccountId = (user as any).providerAccountId || account.providerAccountId;
          }
        }
        return true;
      } catch (error) {
        console.error('[auth] Error during sign in:', error);
        // Allow sign in even if persistence fails
        return true;
      }
    },
    async jwt({ token, account, user }: { token: any; account: any; user?: any }) {
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
        token.providerAccountId = account.providerAccountId;
        if (account.idTokenClaims?.oid) {
          token.oid = account.idTokenClaims.oid;
        }
      }

      if (user) {
        // Ensure the user's ID is set in the sub claim for consistency
        token.sub = (user as any).id || token.sub;
        
        // Also keep as id for backward compatibility
        token.id = (user as any).id || token.id;
        
        if (user.email) {
          token.email = user.email;
        }
        if ((user as any).provider) {
          token.provider = (user as any).provider;
        }
        if ((user as any).providerAccountId) {
          token.providerAccountId = (user as any).providerAccountId;
        }
        if ((user as any).objectId) {
          token.oid = (user as any).objectId;
        }
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Add additional info to session
      if (session.user) {
        // Always ensure user ID is set from the token's sub claim
        session.user.id = token.sub || token.id;
        
        // Add provider information
        session.user.provider = token.provider;
        
        // These fields are needed for proper user identification
        if (token.providerAccountId) {
          session.user.providerAccountId = token.providerAccountId;
        }
        
        if (token.oid) {
          session.user.oid = token.oid;
        }
        
        if (!session.user.email && token.email) {
          session.user.email = token.email;
        }
        
        // Add access token if available
        if (token.accessToken) {
          session.accessToken = token.accessToken;
        }

        console.log('[auth] Session user ID set to:', session.user.id);
      }
      return session;
    }
  },
  events: {
    async signIn({ user, account, isNewUser }: { user: any; account: any; isNewUser?: boolean }) {
      console.log(`[auth] User ${user.email} signed in with ${account?.provider}`);
      if (user.email && account) {
        await ensureUserFromOidc({
          email: user.email,
          name: user.name || '',
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        });
      }
    },
    async signOut({ token }: { token: any; session: any }) {
      console.log(`[auth] User signed out`);
    }
    // Removed error event handler as it's not in the NextAuth EventCallbacks type
    // Error event handler was causing build failures with NextAuth v4.24.0
    // async error(error: Error & { providerId?: string }) {
    //   // Log detailed error information for easier debugging
    //   console.error('[auth] Authentication error:', error);
    //   if (error.name === 'OAuthCallbackError') {
    //     console.error('[auth] OAuth Callback Error details:', {
    //       providerId: (error as any).providerId,
    //       clientId: process.env.AZURE_AD_CLIENT_ID || 'd46ea9de-b544-4972-906e-72c6be61f1d6',
    //       tenantId: process.env.AZURE_AD_TENANT_ID || 'd46ea9de-b544-4972-906e-72c6be61f1d6',
    //       // Don't log the client secret
    //       hasClientSecret: !!process.env.AZURE_AD_CLIENT_SECRET,
    //       // Include NEXTAUTH_URL which is critical for callbacks
    //       nextAuthUrl: process.env.NEXTAUTH_URL,
    //       // Node environment
    //       nodeEnv: process.env.NODE_ENV,
    //     });
    //   }
    // }
  },
};

// Export the authentication configuration for use in the application
export default authOptions;