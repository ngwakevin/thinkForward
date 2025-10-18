import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { DefaultSession, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";

type ExtendedToken = JWT & {
  user?: Pick<User, "id" | "name" | "email" | "image">;
};

type ExtendedSession = DefaultSession & {
  user?: Pick<User, "id" | "name" | "email" | "image">;
};

/**
 * ==========================
 *  NEXTAUTH CONFIGURATION
 * ==========================
 */
const handler = NextAuth({
  // 🔐 List of supported authentication providers
  providers: [
    /**
     * Google OAuth 2.0
     * Make sure your credentials match the redirect URI:
     *   https://<your-domain>/api/auth/callback/google
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    /**
     * Microsoft Entra ID (Azure AD) / Outlook Login
     * Ensure redirect URI:
     *   https://<your-domain>/api/auth/callback/azure-ad
     */
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!, // "common" works for multi-tenant apps
    }),

    /**
     * Manual Email + Password Login (Credentials Provider)
     */
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};

        // ✅ Replace this block with your actual user lookup (DB/API)
        if (
          email === process.env.TEST_USER_EMAIL &&
          password === process.env.TEST_USER_PASSWORD
        ) {
          return { id: "1", name: "Admin User", email };
        }

        // ❌ If invalid, return null
        return null;
      },
    }),
  ],

  // 🔄 Use JWT-based sessions (no DB adapter needed)
  session: { strategy: "jwt" },

  // 🔁 Callback functions to customize JWT/session data
  callbacks: {
    async jwt({ token, user }) {
      const mutableToken = token as ExtendedToken;

      if (user) {
        mutableToken.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }

      return mutableToken;
    },
    async session({ session, token }) {
      const extendedSession = session as ExtendedSession;
      const extendedToken = token as ExtendedToken;

      if (extendedToken.user) {
        extendedSession.user = {
          ...extendedSession.user,
          ...extendedToken.user,
        };
      }

      return extendedSession;
    },
  },

  // 🧭 Custom Pages
  pages: {
    signIn: "/auth/signin", // your custom sign-in page
  },

  // 🧱 Debug mode for local dev
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
