/**
 * Security utilities for ThinkForward platform
 * This module contains security helper functions and constants
 * Used for implementing best practices and hardening the application
 */

/**
 * Content Security Policy (CSP) configuration
 * Defines allowed sources for various resource types
 */
export const contentSecurityPolicy = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "*.googleapis.com", "*.gstatic.com"],
  styleSrc: ["'self'", "'unsafe-inline'", "*.googleapis.com", "*.gstatic.com"],
  imgSrc: ["'self'", "data:", "blob:", "*.githubusercontent.com", "*.googleusercontent.com"],
  fontSrc: ["'self'", "*.googleapis.com", "*.gstatic.com"],
  connectSrc: ["'self'", "*.googleapis.com", "*.gstatic.com", "https://*.vercel.app"],
  mediaSrc: ["'self'"],
  frameSrc: ["'self'", "https://giscus.app"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
};

/**
 * Security headers to be applied to all responses
 * Implements best practices for web security
 */
export const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': Object.entries(contentSecurityPolicy)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; '),
  
  // Prevent browsers from incorrectly detecting non-scripts as scripts
  'X-Content-Type-Options': 'nosniff',
  
  // Disable browser features that could be security risks
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  
  // Prevents clickjacking
  'X-Frame-Options': 'DENY',
  
  // Set referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Cross-Origin Resource Policy
  'Cross-Origin-Resource-Policy': 'same-origin',
  
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
};

/**
 * Rate limiting options
 */
export const rateLimiting = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequestsPerWindow: 100, // Limit each IP to 100 requests per window
};

/**
 * Password policy configuration
 */
export const passwordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  passwordHistoryCount: 5,
};

/**
 * Session security configuration
 */
export const sessionSecurity = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax' as const,
};

/**
 * Validates if a password meets the password policy requirements
 * @param password The password to validate
 * @returns An object with isValid flag and any validation messages
 */
export function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  if (!password || password.length < passwordPolicy.minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${passwordPolicy.minLength} characters long`,
    };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  if (passwordPolicy.requireUppercase && !hasUpperCase) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (passwordPolicy.requireLowercase && !hasLowerCase) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (passwordPolicy.requireNumbers && !hasNumbers) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (passwordPolicy.requireSymbols && !hasSymbols) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true };
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input User input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}