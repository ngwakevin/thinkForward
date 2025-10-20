/**
 * Enhanced JWT utilities for token generation and verification
 * Edge Runtime compatible implementation (using jose)
 */
import * as jose from 'jose';
import { JWTPayload } from 'jose';

// Ensure environment secret exists
if (!process.env.JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable');
}

// Encode secret for jose
const secretEncoded = new TextEncoder().encode(process.env.JWT_SECRET);

// Interface for JWT payload
export interface TokenPayload {
  userId: string;
  email: string;
  name?: string;
  [key: string]: any;
}

/** Sign a short-lived access token */
export async function signAccessToken(payload: TokenPayload): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secretEncoded);
}

/** Sign a longer-lived refresh token */
export async function signRefreshToken(payload: TokenPayload): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretEncoded);
}

/** Verify and decode JWT safely */
export async function verifyJwt<T = JWTPayload>(token: string): Promise<T | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secretEncoded, { clockTolerance: '5s' });
    return payload as T;
  } catch (error) {
    console.error('[jwt] Token verification failed:', error);
    return null;
  }
}

/** Generate arbitrary token (for testing or legacy support) */
export async function generateToken(payload: JWTPayload, expiresIn: string = '1h'): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretEncoded);
}

/** Legacy verify wrapper */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  return verifyJwt<JWTPayload>(token);
}

// Alias for compatibility
export const signJwt = signAccessToken;