import * as jwt from 'jsonwebtoken';

/**
 * Simple JWT utilities for token generation and verification
 */

// Secret key for JWT tokens - fallback to a development secret if not provided
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';

/**
 * Sign a JWT token with the given payload
 * @param payload The data to be encoded in the token
 * @param expiresIn Token expiration time (default: 1 hour)
 * @returns JWT token string
 */
export function signJwt(payload: object, expiresIn: string = '1h'): string {
  // Use type assertion to handle typing issues
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn });
}

/**
 * Verify a JWT token and return the decoded payload
 * @param token JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyJwt(token: string): jwt.JwtPayload | string | null {
  try {
    return jwt.verify(token, JWT_SECRET as jwt.Secret);
  } catch (error) {
    console.error('[jwt] Token verification failed:', error);
    return null;
  }
}

// For backwards compatibility
export const generateToken = signJwt;
export const verifyToken = verifyJwt;