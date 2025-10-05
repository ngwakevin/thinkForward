import { NextRequest, NextResponse } from 'next/server';
import { securityConfig } from '../config/security';
import { logSecurityEvent, SecurityEventType, SecurityEventSeverity } from '../lib/security-audit';
import { getRequestMetadata } from '../lib/security-audit';

// Simple in-memory rate limiter (replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

/**
 * Rate limiting middleware for API routes
 * @param req The Next.js request object
 * @param endpoint The API endpoint path
 * @returns A response object if rate limit is exceeded, null otherwise
 */
async function checkRateLimit(req: NextRequest, endpoint: string): Promise<NextResponse | null> {
  const { ipAddress } = getRequestMetadata(req);
  const now = Date.now();
  
  // Get endpoint-specific rate limit or fallback to default
  const endpointConfig = securityConfig.api.rateLimit.endpoints as Record<string, typeof securityConfig.api.rateLimit>;
  const endpointSettings = (endpoint in endpointConfig) ? endpointConfig[endpoint] : securityConfig.api.rateLimit;
  const { windowMs, maxRequestsPerWindow } = endpointSettings;
  
  // Create rate limit key from IP + endpoint
  const key = `${ipAddress}:${endpoint}`;
  const entry = rateLimitMap.get(key);
  
  // Create new entry if doesn't exist or window has passed
  if (!entry || (now - entry.timestamp > windowMs)) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return null;
  }
  
  // Increment count for existing entry
  entry.count += 1;
  
  // Check if rate limit exceeded
  if (entry.count > maxRequestsPerWindow) {
    // Log rate limit event
    await logSecurityEvent({
      eventType: SecurityEventType.SUSPICIOUS_ACTIVITY,
      eventDetails: `Rate limit exceeded for endpoint ${endpoint}`,
      ipAddress,
      userAgent: req.headers.get('user-agent') || 'unknown',
      severity: SecurityEventSeverity.WARNING,
      metadata: { endpoint, requestCount: entry.count },
    });
    
    // Return 429 Too Many Requests
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests, please try again later' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil(windowMs / 1000)),
        },
      }
    );
  }
  
  return null;
}

/**
 * Type for the API route handler
 */
export type ApiRouteHandler = (
  req: NextRequest,
  context: { params: Record<string, string | string[]> }
) => Promise<NextResponse> | NextResponse;

/**
 * Higher-order function that wraps API routes with security measures
 * @param handler The API route handler function
 * @returns A wrapped handler with security measures applied
 */
export function withApiSecurity(handler: ApiRouteHandler): ApiRouteHandler {
  return async (req: NextRequest, context) => {
    try {
      // Get request path for rate limiting and logging
      const path = new URL(req.url).pathname;
      
      // Check rate limits
      const rateLimitResponse = await checkRateLimit(req, path);
      if (rateLimitResponse) {
        return rateLimitResponse;
      }
      
      // Call the original handler
      const response = await handler(req, context);
      
      // Add security headers to the response
      const secureHeaders = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
      };
      
      Object.entries(secureHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    } catch (error) {
      // Log the error
      console.error('API error:', error);
      
      // Log security event for server errors
      const { ipAddress, userAgent } = getRequestMetadata(req);
      await logSecurityEvent({
        eventType: SecurityEventType.SUSPICIOUS_ACTIVITY,
        eventDetails: `API error: ${(error as Error).message || 'Unknown error'}`,
        ipAddress,
        userAgent,
        severity: SecurityEventSeverity.ERROR,
        metadata: { path: new URL(req.url).pathname },
      });
      
      // Return a generic error to avoid leaking implementation details
      return NextResponse.json(
        { error: 'An error occurred processing your request' },
        { status: 500 }
      );
    }
  };
}

/**
 * Creates an authenticated API route handler that requires a valid session
 * @param handler The API route handler function
 * @returns A wrapped handler that requires authentication
 */
export function withAuthApiSecurity(handler: ApiRouteHandler): ApiRouteHandler {
  return async (req: NextRequest, context) => {
    // First apply basic API security
    const securedHandler = withApiSecurity(async (req, context) => {
      // Check for valid session or token
      // This would be implemented based on your authentication method
      const sessionToken = req.cookies.get('next-auth.session-token')?.value;
      
      // If no session token, return 401 Unauthorized
      if (!sessionToken) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      // TODO: Add session validation here
      // For now, we're just checking if the token exists
      
      // Call the original handler
      return handler(req, context);
    });
    
    return securedHandler(req, context);
  };
}