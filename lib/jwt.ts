import jwt from "jsonwebtoken";

const FALLBACK_SECRET = "development-secret-key";
const JWT_SECRET = process.env.JWT_SECRET ?? (process.env.NODE_ENV === "production" ? undefined : FALLBACK_SECRET);

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required.");
}

export function signJwt(payload: object, expiresIn = "1h") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// For backwards compatibility
export const generateToken = signJwt;
export const verifyToken = verifyJwt;