// lib/auth-options.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authCosmosService } from "./azure/auth-cosmos-service";

// Local alias to satisfy consumers that expect AuthOptions
export type AuthOptions = NextAuthOptions;

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
    // Optional Google Sign-In (only active when env vars are set)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    // Enable email/password sign-in
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email?.trim().toLowerCase();
          const password = credentials?.password ?? "";
          if (!email || !password) return null;

          const user = await authCosmosService.getUserByEmail(email);
          if (!user || !user.passwordHash) {
            return null;
          }

          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok) return null;

          // Return minimal user object for NextAuth
          return {
            id: user.id,
            email: user.email || email,
            name: user.name || user.profile?.displayName || email,
            image: user.profile?.avatarUrl || undefined,
          } as any;
        } catch (err) {
          console.error("[auth] Credentials authorize error:", err);
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  // Session settings
  session: {
    strategy: "jwt",           // Use JWT sessions for serverless / Azure
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Cookies configuration (ensure dev works without __Secure- prefix)
  cookies: (() => {
    const isProd = process.env.NODE_ENV === "production";
    return {
      sessionToken: {
        name: isProd ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: isProd, // must be true in production (HTTPS)
        },
      },
    } as NextAuthOptions["cookies"]; 
  })(),

  // Redirects
  pages: {
    signIn: "/login", // custom login page
    error: "/login",  // redirect on auth errors
    newUser: "/profile", // onboard new users
  },

  // Callbacks for controlling session content
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to token
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      // Add token info to session
      if (token.user) session.user = token.user;
      return session;
    },
  },

  debug: process.env.NODE_ENV !== "production", // debug logs in dev only
};