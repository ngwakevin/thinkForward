// Enhanced middleware with Azure Application Insights telemetry
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { telemetry } from './lib/azure/telemetry-service';
import { jwtVerify } from 'jose'; // Import directly from jose for Edge compatibility

/**
 * Custom middleware that adds telemetry, JWT authentication and enhanced security features
 * Edge Runtime compatible implementation
 */

// Secret key for JWT verification - same as in jwt.ts
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key';
const secretEncoded = new TextEncoder().encode(JWT_SECRET);

// Helper function to verify JWT token in Edge Runtime
async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretEncoded);
    return payload;
  } catch (error) {
    console.error('[middleware] JWT verification failed:', error);
    return null;
  }
}

export default withAuth(
  // `withAuth` augments your Request with the user's token
  function middleware(request) {
    const startTime = Date.now(); // Edge Runtime compatible timestamp
    const path = request.nextUrl.pathname;
    
    // Record telemetry for the request
    if (telemetry) {
      telemetry.trackEvent('MiddlewareRequest', {
        path,
        method: request.method,
        referrer: request.headers.get('referer') || '',
        userAgent: request.headers.get('user-agent') || ''
      });
    }
    
    // Create a response object that can be modified
    const response = NextResponse.next();

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Add Content-Security-Policy header for production
    if (process.env.NODE_ENV === 'production') {
      response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https://*.blob.core.windows.net; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.documents.azure.com https://*.blob.core.windows.net https://*.applicationinsights.azure.com;"
      );
    }
    
    // Record the timing in telemetry
    if (telemetry) {
      const duration = Date.now() - startTime; // Calculate duration in milliseconds
      
      telemetry.trackMetric('MiddlewareResponseTime', duration, {
        path,
        method: request.method
      });
    }
    
    return response;
  },
  {
    callbacks: {
      // Only run middleware for paths in the matcher
      authorized: async ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Check JWT protected paths first
        if (jwtProtectedPaths.some(path => pathname.startsWith(path))) {
          // Check Authorization header for Bearer token
          const authHeader = req.headers.get('authorization');
          const bearerToken = authHeader?.toLowerCase().startsWith('bearer ')
            ? authHeader.slice(7)
            : null;

          // If Bearer token exists, verify it
          if (bearerToken) {
            const decoded = await verifyJwtToken(bearerToken);
            if (decoded && decoded.userId) {
              return true;
            }
          }

          // Fallback: check for auth token in cookies (for refresh token)
          const cookies = req.cookies;
          const refreshToken = cookies.get('refresh_token')?.value;
          
          if (refreshToken) {
            const decoded = await verifyJwtToken(refreshToken);
            if (decoded && decoded.userId) {
              return true;
            }
          }

          return false;
        }

        // Check NextAuth protected paths
        if (protectedPaths.some(path => pathname.startsWith(path))) {
          return !!token;
        }

        // Public paths
        return true;
      }
    }
  }
);

// Define paths that require authentication
const protectedPaths = [
  '/protected',
  '/api/community',
  '/api/profile',
  '/api/uploads'
];

const jwtProtectedPaths = ['/api/protected'];

// Only run middleware for matching paths
export const config = {
  matcher: [
    '/protected/:path*',
    '/api/community/:path*',
    '/api/profile/:path*',
    '/api/uploads/:path*',
    '/api/protected/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
