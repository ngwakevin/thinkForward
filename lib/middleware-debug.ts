// middleware-debug.ts
// A utility file to help debug NextAuth authentication issues with middleware

import { NextRequest, NextResponse } from 'next/server';

/**
 * Debug authentication issues by checking headers and cookies in middleware
 * @param request The NextRequest object from middleware
 * @returns Response with debug information or null to continue normal processing
 */
export function debugAuth(request: NextRequest, enableDebug = false): NextResponse | null {
  // Only enable this debug utility when needed
  if (!enableDebug) return null;

  // Extract path and headers for inspection
  const path = request.nextUrl.pathname;
  const headers = Object.fromEntries(request.headers.entries());
  const cookies = request.cookies.getAll();

  // Skip debugging for static assets
  if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
    return null;
  }

  // Generate debug information
  const debugInfo = {
    timestamp: new Date().toISOString(),
    url: request.nextUrl.toString(),
    path,
    method: request.method,
    headers: {
      ...headers,
      // Add specific headers we care about for debugging
      'x-forwarded-for': request.headers.get('x-forwarded-for'),
      'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
      'x-forwarded-host': request.headers.get('x-forwarded-host'),
      'host': request.headers.get('host'),
      'referer': request.headers.get('referer'),
      'user-agent': request.headers.get('user-agent'),
    },
    cookies: cookies.map(c => ({ 
      name: c.name,
      // Don't show full cookie values for security
      value: c.name.includes('next-auth') ? `${c.value.substring(0, 10)}...` : '[hidden]',
      secure: headers['cookie']?.includes(`${c.name}=`) || false,
    })),
    // Check for session cookie specifically
    hasSessionCookie: cookies.some(c => c.name.includes('next-auth.session-token')),
    // Environment checks
    environment: {
      isAzure: !!process.env.WEBSITE_HOSTNAME,
      hostname: process.env.WEBSITE_HOSTNAME || process.env.VERCEL_URL || 'local',
      nextAuthUrl: process.env.NEXTAUTH_URL,
    }
  };

  // Log debug information on the server
  console.log('[Auth Debug]', JSON.stringify(debugInfo, null, 2));

  // For API endpoints that handle auth, continue normal flow
  if (path.startsWith('/api/auth')) {
    return null;
  }

  // For specific debug endpoint, return debug info
  if (path === '/debug-auth') {
    return new NextResponse(JSON.stringify(debugInfo, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  // For all other routes, continue normal flow
  return null;
}

/**
 * A middleware wrapper with enhanced debugging
 * @param middleware Your actual middleware function
 * @param enableDebug Whether to enable debug mode
 */
export function withDebugAuth(middleware: (req: NextRequest) => NextResponse | Promise<NextResponse>, enableDebug = false) {
  return async (request: NextRequest) => {
    // Run debug checks first
    const debugResponse = debugAuth(request, enableDebug);
    if (debugResponse) {
      return debugResponse;
    }
    
    // Continue with normal middleware processing
    return middleware(request);
  };
}