// lib/auth-options.ts
import { NextAuthOptions } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  // Session settings
  session: {
    strategy: "jwt",           // Use JWT sessions for serverless / Azure
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Cookies configuration (important for Azure production)
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production", // required for Azure HTTPS
      },
    },
  },

  // Redirects
  pages: {
    signIn: "/login", // custom login page
    error: "/login",  // redirect on auth errors
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