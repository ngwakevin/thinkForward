// Utility to track API route performance with Application Insights
import { NextRequest, NextResponse } from 'next/server';
import { telemetry } from './telemetry-service';

/**
 * Higher-order function to wrap API route handlers with Application Insights tracking
 * @param handler The API route handler function
 */
export function withTelemetry(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async (request: NextRequest) => {
    const startTime = Date.now(); // Edge Runtime compatible timestamp
    let response: NextResponse;
    
    try {
      // Call the original handler
      response = await handler(request);
      
      // Track the API request with telemetry
      telemetry.trackApiRequest(request, response, startTime);
      
      return response;
    } catch (error) {
      // Create an error response
      response = NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
      
      // Track the exception
      telemetry.trackException(error as Error, {
        path: request.url ? new URL(request.url).pathname : 'unknown',
        method: request.method || 'unknown'
      });
      
      // Track the API request (failed)
      telemetry.trackApiRequest(request, response, startTime, { 
        error: (error as Error).message 
      });
      
      return response;
    }
  };
}

export default withTelemetry;