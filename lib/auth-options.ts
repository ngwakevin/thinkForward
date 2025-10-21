import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { fetchUserByEmail } from "@/lib/db/users";

/**
 * ==========================
 *  NEXTAUTH OPTIONS
 * ==========================
 */
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 15 * 60 },
  cookies: {
    sessionToken: {
      name: "__Host-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: process.env.COOKIE_DOMAIN,
      },
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await fetchUserByEmail(credentials.email);
        if (!user) throw new Error("User not found");

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid password");

        const accessToken = await signAccessToken({ userId: user.id, email: user.email });
        const refreshToken = await signRefreshToken({ userId: user.id, email: user.email });

        return { id: user.id, email: user.email, accessToken, refreshToken } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Attach user basics for session consumption
      if (user) {
        (token as any).user = {
          id: (user as any).id,
          name: (user as any).name,
          email: (user as any).email,
          image: (user as any).image,
        };
      }

      // Propagate issued tokens from credentials sign-in
      if ((user as any)?.accessToken) (token as any).accessToken = (user as any).accessToken;
      if ((user as any)?.refreshToken) (token as any).refreshToken = (user as any).refreshToken;
      return token;
    },
    async session({ session, token }) {
      // Prefer token.user (populated during jwt callback)
      if ((token as any).user) {
        session.user = {
          ...session.user,
          ...(token as any).user,
        } as any;
      }

      (session as any).accessToken = (token as any).accessToken;
      (session as any).refreshToken = (token as any).refreshToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};