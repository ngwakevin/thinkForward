/**
 * Enhanced JWT utilities for token generation and verification
 * Supports both async and sync operations with access and refresh tokens
 */
import type { JwtPayload } from 'jsonwebtoken';

// Secret key for JWT tokens - fallback to a development secret if not provided
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';

// Define interface for token payload
export interface TokenPayload {
  userId: string;
  email: string;
  name?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Sign an access token (short-lived)
 * @param payload The data to be encoded in the token
 * @returns JWT access token string
 */
export async function signAccessToken(payload: TokenPayload): Promise<string> {
  const jwt = await import('jsonwebtoken');
  return jwt.default.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

/**
 * Sign a refresh token (longer-lived)
 * @param payload The data to be encoded in the token
 * @returns JWT refresh token string
 */
export async function signRefreshToken(payload: TokenPayload): Promise<string> {
  const jwt = await import('jsonwebtoken');
  return jwt.default.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify a JWT token and return the decoded payload
 * @param token JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export async function verifyJwt<T = any>(token: string): Promise<T | null> {
  try {
    const jwt = await import('jsonwebtoken');
    return jwt.default.verify(token, JWT_SECRET) as T;
  } catch (error) {
    console.error('[jwt] Token verification failed:', error);
    return null;
  }
}

/**
 * For backwards compatibility - synchronous versions
 * These should only be used in server components/api routes
 */
export function generateToken(payload: object, expiresIn: string = '1h'): string {
  // This is a synchronous version that will throw if used in Edge Runtime
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string): any {
  try {
    // This is a synchronous version that will throw if used in Edge Runtime
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jwt = require('jsonwebtoken');
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('[jwt] Token verification failed:', error);
    return null;
  }
}

// For backwards compatibility
export const signJwt = signAccessToken;