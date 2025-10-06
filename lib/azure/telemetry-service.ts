// Azure Application Insights telemetry service - Next.js compatible
import { appInsightsClient } from './appinsights-config';
import type { NextRequest, NextResponse } from 'next/server';

export interface CustomProperties {
  [key: string]: string | number | boolean | undefined;
}

// Simplified telemetry service compatible with Next.js
export class TelemetryService {
  /**
   * Track a custom event
   * @param name Event name
   * @param properties Custom properties
   */
  trackEvent(name: string, properties?: CustomProperties): void {
    if (!appInsightsClient) return;
    
    appInsightsClient.trackEvent({
      name,
      properties
    });
  }

  /**
   * Track an exception
   * @param error The error object
   * @param properties Custom properties
   */
  trackException(error: Error, properties?: CustomProperties): void {
    if (!appInsightsClient) return;
    
    appInsightsClient.trackException({
      exception: error,
      properties
    });
  }

  /**
   * Track a metric
   * @param name Metric name
   * @param value Metric value
   * @param properties Custom properties
   */
  trackMetric(name: string, value: number, properties?: CustomProperties): void {
    if (!appInsightsClient) return;
    
    appInsightsClient.trackMetric({
      name,
      value,
      properties
    });
  }

  /**
   * Track a trace message
   * @param message Trace message
   * @param properties Custom properties
   */
  trackTrace(message: string, properties?: CustomProperties): void {
    if (!appInsightsClient) return;
    
    appInsightsClient.trackTrace({
      message,
      properties
    });
  }

  /**
   * Track an API request
   * @param request Next.js request object
   * @param response Next.js response object
   * @param startTime Timestamp when request started
   */
  trackApiRequest(
    request: NextRequest, 
    response: NextResponse, 
    startTime: number
  ): void {
    if (!appInsightsClient) return;

    try {
      // Calculate duration in milliseconds using Date.now() which is Edge compatible
      const duration = Date.now() - startTime;
      
      // Get request details
      const url = new URL(request.url);
      const path = url.pathname;
      const method = request.method;
      const status = response.status;
      
      // Log simplified request info instead of using trackRequest
      this.trackEvent('ApiRequest', {
        path,
        method,
        status: status.toString(),
        duration: duration.toFixed(2),
        success: (status < 400).toString()
      });
    } catch (error) {
      console.error('Failed to track API request:', error);
    }
  }
}

// Export singleton instance
export const telemetry = new TelemetryService();