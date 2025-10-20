/**
 * auth.ts - Authentication utilities and configuration
 * This file re-exports from auth-options.ts to maintain backward compatibility
 */

import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { User, Account } from 'next-auth';
import bcrypt from 'bcryptjs';
import { ensureUserFromOidc } from './db/users';

// Import and re-export authOptions from centralized auth config with alias
import { authOptions as authOptionsFromConfig } from './auth-options';
// Re-export with original name for backward compatibility
export const authOptions = authOptionsFromConfig;
export default authOptionsFromConfig;

// Ensure NEXTAUTH_SECRET is set in production
if (!process.env.NEXTAUTH_SECRET) {
  console.error('ERROR: NEXTAUTH_SECRET is not set in environment!');
  console.error('This will cause authentication to fail. Please set NEXTAUTH_SECRET in your environment.');
  console.error('Run `npm run generate:secret` to generate a secure value and add it to:');
  console.error('1. GitHub repository secrets (for CI/CD)');
  console.error('2. Azure App Service application settings');
  console.error('3. .env.production file (for local production testing)');
}

// Check if NEXTAUTH_URL is set for local production testing
if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV !== 'development') {
  console.warn(`[auth] NEXTAUTH_URL not set, using: ${process.env.NEXTAUTH_URL}`);
}

/**
 * Helper function to get JWT token from session
 * @param token - JWT token from NextAuth.js
 */
export function getJwtToken(token: JWT | null): string | null {
  if (!token) return null;
  return token.jwt as string || null;
}

/**
 * Helper function to extract user info from session
 * @param session - NextAuth.js session
 * @returns User info object or null
 */
export function getUserFromSession(session: Session | null): any {
  if (!session || !session.user) return null;
  return session.user;
}

/**
 * Helper function to determine if a user has admin access
 * @param user - User object from NextAuth.js session
 * @returns boolean indicating if user has admin access
 */
export function isAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  const adminEmails = [
    'admin@thinkforward.com',
    'support@thinkforward.com'
  ];
  return adminEmails.includes(user.email) || (user as any).isAdmin === true;
}