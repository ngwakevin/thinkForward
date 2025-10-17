// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AzureADProvider from "next-auth/providers/azure-ad";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { ensureUserFromOidc } from "../db/users";

// Import your Cosmos DB service dynamically for CredentialsProvider
const getCosmosService = async () => {
  const { cosmosService } = await import("../azure/cosmos-service");
  return cosmosService;
};

// Ensure NEXTAUTH_SECRET is set
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET =
    process.env.NODE_ENV === "production"
      ? "FALLBACK_SECRET_" + Date.now()
      : "DEV_SECRET_" + Date.now();
  console.warn(`[auth] Using fallback NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET}`);
}

// Providers configuration
const providers = [
  // Credentials (email/password)
  CredentialsProvider({
    id: "credentials",
    name: "Email & Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      const cosmosService = await getCosmosService();
      const user = await cosmosService.getUserByEmail(credentials.email.toLowerCase());
      if (!user || !user.passwordHash) return null;
      const passwordValid = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!passwordValid) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.profile?.avatarUrl || null,
      };
    },
  }),

  // Azure AD / Microsoft
  AzureADProvider({
    id: "microsoft",
    clientId: process.env.AZURE_AD_CLIENT_ID!,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
    tenantId: process.env.AZURE_AD_TENANT_ID ?? "common",
    authorization: { params: { scope: "openid profile email User.Read" } },
  }),

  // Google
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          profile(profile) {
            return {
              id: profile.sub,
              name: profile.name,
              email: profile.email,
              image: profile.picture,
              provider: "google",
            };
          },
        }),
      ]
    : []),
];

// NextAuth options
const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  useSecureCookies: true,
  cookies: {
    sessionToken: {
      name: "__Secure-next-auth.session-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: true },
    },
  },
  debug: process.env.NODE_ENV !== "production",
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account && user) {
          const profileEmail =
            user.email ??
            (profile as any)?.email ??
            (profile as any)?.preferred_username ??
            null;

          const persistedUser = await ensureUserFromOidc({
            email: profileEmail || undefined,
            name: user.name || (profile as any)?.name || "",
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            oid: (user as any).objectId || (profile as any)?.oid || undefined,
            sub: (user as any).id,
          });

          if (persistedUser) {
            (user as any).id = persistedUser.id || user.id;
            (user as any).providerAccountId = persistedUser.providerAccountId || account.providerAccountId;
            (user as any).email = persistedUser.email || profileEmail || user.email;
            (user as any).name = persistedUser.name || user.name;
          }
        }
        return true;
      } catch (error) {
        console.error("[auth] signIn callback error:", error);
        return true;
      }
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
        token.providerAccountId = account.providerAccountId;
        // Type casting for Azure AD specific claims
        const azureAccount = account as any;
        if (azureAccount.idTokenClaims?.oid) token.oid = azureAccount.idTokenClaims.oid;
      }
      if (user) {
        token.sub = (user as any).id || token.sub;
        token.id = (user as any).id || token.id;
        token.email = user.email || token.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Type cast to allow for custom properties
      const extendedSession = session as any;
      const extendedToken = token as any;
      
      if (extendedSession.user) {
        extendedSession.user.id = extendedToken.sub || extendedToken.id;
        extendedSession.user.email = extendedToken.email || extendedSession.user.email;
        extendedSession.user.provider = extendedToken.provider;
        extendedSession.user.providerAccountId = extendedToken.providerAccountId;
        extendedSession.user.oid = extendedToken.oid;
        extendedSession.accessToken = extendedToken.accessToken;
      }
      
      if (extendedSession.user?.id) {
        console.log("[auth] Session user ID set to:", extendedSession.user.id);
      }
      
      return extendedSession;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`[auth] User ${user.email} signed in with ${account?.provider}`);
      if (user.email && account) {
        await ensureUserFromOidc({
          email: user.email,
          name: user.name || "",
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        });
      }
    },
    async signOut() {
      console.log("[auth] User signed out");
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
