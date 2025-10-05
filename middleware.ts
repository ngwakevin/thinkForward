import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isEnabled } from './lib/flags';
import { securityHeaders } from './lib/security';

// Protected paths that require authentication
const PROTECTED_PREFIXES = ['/protected', '/mentoring', '/platform'];

/**
 * ThinkForward middleware for handling:
 * 1. Security headers
 * 2. Authentication redirects
 * 3. Rate limiting (implemented at edge)
 */
export function middleware(req: NextRequest) {
  // Create base response for adding headers
  const response = isProtectedRoute(req)
    ? handleProtectedRoute(req) 
    : NextResponse.next();
  
  // Apply security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Set Strict Transport Security header in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  return response;
}

/**
 * Check if the current route requires authentication
 */
function isProtectedRoute(req: NextRequest): boolean {
  const { pathname } = req.nextUrl;
  return PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
}

/**
 * Handle requests to protected routes
 */
function handleProtectedRoute(req: NextRequest): NextResponse {
  // Skip auth check if MSAL auth is not enabled
  if (!isEnabled('authMsal')) return NextResponse.next();
  
  const { pathname } = req.nextUrl;
  
  // Check for session cookie
  const hasSessionCookie = req.cookies.has('id_token') || req.cookies.has('next-auth.session-token');
  
  if (!hasSessionCookie) {
    // Redirect to sign-in page with return URL
    const login = new URL('/auth/signin', req.url);
    login.searchParams.set('redirect', pathname);
    return NextResponse.redirect(login);
  }
  
  return NextResponse.next();
}

// Route matcher – extend as additional protected surfaces emerge.
export const config = { 
  matcher: [
    // Protected routes requiring authentication
    '/protected/:path*',
    '/mentoring/:path*',
    '/platform/:path*',
    
    // Apply security headers to all routes
    '/(.*)'
  ] 
};
