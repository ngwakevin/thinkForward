/**
 * Enhanced JWT utilities for token generation and verification
 * Edge Runtime compatible implementation
 */
import * as jose from 'jose'; // Use jose instead of jsonwebtoken for Edge compatibility
import { JWTPayload } from 'jose';

// Secret key for JWT tokens - fallback to a development secret if not provided
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';
// Convert the secret to the format jose expects
const secretEncoded = new TextEncoder().encode(JWT_SECRET);

// Define interface for token payload
export interface TokenPayload {
  userId: string;
  email: string;
  name?: string | undefined;
  [key: string]: any; // Allow additional properties
}

/**
 * Sign an access token (short-lived)
 * @param payload The data to be encoded in the token
 * @returns JWT access token string
 */
export async function signAccessToken(payload: TokenPayload): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secretEncoded);
}

/**
 * Sign a refresh token (longer-lived)
 * @param payload The data to be encoded in the token
 * @returns JWT refresh token string
 */
export async function signRefreshToken(payload: TokenPayload): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretEncoded);
}

/**
 * Verify a JWT token and return the decoded payload
 * @param token JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export async function verifyJwt<T = any>(token: string): Promise<T | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secretEncoded);
    return payload as unknown as T;
  } catch (error) {
    console.error('[jwt] Token verification failed:', error);
    return null;
  }
}

/**
 * For backwards compatibility - now also async but keeps the same name
 * These are safe to use in both Edge and Node.js environments
 */
export async function generateToken(payload: jose.JWTPayload, expiresIn: string = '1h'): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretEncoded);
}

export async function verifyToken(token: string): Promise<jose.JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secretEncoded);
    return payload;
  } catch (error) {
    console.error('[jwt] Token verification failed:', error);
    return null;
  }
}

// For backwards compatibility
export const signJwt = signAccessToken;