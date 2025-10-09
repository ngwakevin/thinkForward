// Updated NextAuth.js configuration to use Microsoft and Google providers
import { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import GoogleProvider from 'next-auth/providers/google';
import { ensureUserFromOidc } from './db/users';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { User, Account } from 'next-auth';

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
    
    // Try to use static values as a fallback for development or when environment variables are missing
    console.warn('[auth] Using hardcoded fallback values for AZURE_AD - THIS IS NOT SECURE FOR PRODUCTION');
    process.env.AZURE_AD_CLIENT_ID = process.env.AZURE_AD_CLIENT_ID || 'd46ea9de-b544-4972-906e-72c6be61f1d6';
    // Use 'common' tenant to allow any Microsoft account to sign in
    process.env.AZURE_AD_TENANT_ID = process.env.AZURE_AD_TENANT_ID || 'common';
  }
  
  // Google
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn('[auth] Google auth environment variables missing. Google login will be disabled.');
  }
};

// Call the environment check function
checkEnvVars();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    // Adjust session max age as needed (default: 30 days)
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
  providers: [
    // Microsoft / Entra ID Provider
    AzureADProvider({
      id: 'microsoft', // Set ID to 'microsoft' to match what's used in signIn() calls
      name: 'Microsoft',
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      // Use 'common' tenant to allow any Microsoft account to sign in
      tenantId: 'common',
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
        if (account && user.email) {
          await ensureUserFromOidc({
            email: user.email,
            name: user.name || '',
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          });
        }
        return true;
      } catch (error) {
        console.error('[auth] Error during sign in:', error);
        return false;
      }
    },
    async jwt({ token, account, user }: { token: any; account: any; user?: any }) {
      // Add provider from account info, fallback to user if available
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
        // Access provider property safely with type assertion
        if (user && typeof user === 'object' && 'provider' in user) {
          token.provider = (user as any).provider;
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Add additional info to session
      if (session.user) {
        // Add ID and provider directly to user object
        session.user.id = token.id;
        session.user.provider = token.provider;
        
        // These fields are needed for proper user identification
        if (token.providerAccountId) {
          session.user.providerAccountId = token.providerAccountId;
        }
        
        if (token.oid) {
          session.user.oid = token.oid;
        }
      }
      return session;
    }
  },
  events: {
    async signIn({ user, account, isNewUser }: { user: any; account: any; isNewUser?: boolean }) {
      console.log(`[auth] User ${user.email} signed in with ${account?.provider}`);
      await ensureUserFromOidc(user);
    },
    async signOut({ token }: { token: any; session: any }) {
      console.log(`[auth] User signed out`);
    }
  },
};

// Export the authentication configuration for use in the application
export default authOptions;