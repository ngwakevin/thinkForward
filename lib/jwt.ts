import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

// Define a fallback secret for development only
const FALLBACK_SECRET = 'development-secret-key';

// Get the secret from environment variables or use fallback in development
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  
  // In production, we require the secret to be set
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production.');
  }
  
  // Return the secret or fallback for development
  return secret || FALLBACK_SECRET;
};

/**
 * Sign a JWT token with the given payload and options
 */
export function signJwt(payload: object, expiresIn: string = '1h'): string {
  const secret = getJwtSecret();
  
  return jwt.sign(payload, secret, { expiresIn: expiresIn });
}

/**
 * Verify a JWT token and return the decoded payload or null if invalid
 */
export function verifyJwt(token: string): JwtPayload | null {
  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret);
    return typeof decoded === 'object' ? decoded as JwtPayload : null;
  } catch (error) {
    console.error('[jwt] Token verification failed:', error);
    return null;
  }
}

// For backwards compatibility
export const generateToken = signJwt;
export const verifyToken = verifyJwt;