// Enhanced middleware with Azure Application Insights telemetry
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { telemetry } from './lib/azure/telemetry-service';

/**
 * Custom middleware that adds telemetry and enhanced security features
 */
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
    
    // Handle Azure App Service proxy headers for NextAuth compatibility
    // Azure App Service uses a reverse proxy that might not correctly forward the protocol
    if (process.env.WEBSITE_HOSTNAME && !request.headers.get('x-forwarded-proto')) {
      // Force secure protocol flag for NextAuth in Azure App Service
      response.headers.set('x-forwarded-proto', 'https');
    }
    
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
      authorized: ({ token, req }) => {
        // For paths requiring auth, check for token
        if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
          return !!token;
        }
        // For non-protected paths, always proceed
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

// Only run middleware for matching paths
export const config = {
  matcher: [
    '/protected/:path*',
    '/api/community/:path*',
    '/api/profile/:path*',
    '/api/uploads/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
