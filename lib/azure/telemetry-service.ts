// Azure Application Insights telemetry service
import { appInsightsClient } from './appinsights-config';
import type { NextRequest, NextResponse } from 'next/server';

export interface CustomProperties {
  [key: string]: string | number | boolean | undefined;
}

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
   * Track a dependency call
   * @param name Dependency name
   * @param data Command or query executed
   * @param duration Duration in milliseconds
   * @param success Whether the call was successful
   * @param dependencyType Type of dependency (e.g., 'HTTP', 'SQL', etc.)
   * @param properties Custom properties
   */
  trackDependency(
    name: string,
    data: string,
    duration: number,
    success: boolean,
    dependencyType: string = 'Other',
    properties?: CustomProperties
  ): void {
    if (!appInsightsClient) return;
    
    appInsightsClient.trackDependency({
      name,
      data,
      duration,
      success,
      dependencyTypeName: dependencyType,
      properties
    });
  }

  /**
   * Track an API route request timing
   * @param request The Next.js request object
   * @param response The Next.js response object
   * @param startTime The request start time
   * @param additionalProperties Additional custom properties
   */
  trackApiRequest(
    request: NextRequest,
    response: NextResponse,
    startTime: [number, number], // hrtime tuple
    additionalProperties?: CustomProperties
  ): void {
    if (!appInsightsClient) return;
    
    const endTime = process.hrtime(startTime);
    const duration = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds
    
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const statusCode = response.status;
    
    this.trackEvent('ApiRequest', {
      path,
      method,
      statusCode,
      duration,
      ...additionalProperties
    });
    
    // Track as a request for proper display in Application Insights
    appInsightsClient.trackRequest({
      name: `${method} ${path}`,
      url: request.url,
      duration,
      resultCode: statusCode.toString(),
      success: statusCode >= 200 && statusCode < 400,
      properties: additionalProperties
    });
  }

  /**
   * Track server-side rendering (SSR) timing
   * @param pagePath The page path being rendered
   * @param duration Duration in milliseconds
   * @param success Whether rendering was successful
   * @param properties Custom properties
   */
  trackSsrTiming(
    pagePath: string,
    duration: number,
    success: boolean = true,
    properties?: CustomProperties
  ): void {
    if (!appInsightsClient) return;
    
    appInsightsClient.trackMetric({
      name: 'SSR_Timing',
      value: duration,
      properties: {
        pagePath,
        success: success.toString(),
        ...properties
      }
    });
  }

  /**
   * Flush telemetry immediately
   * Useful before process exits to ensure data is sent
   */
  flush(): void {
    if (!appInsightsClient) return;
    appInsightsClient.flush();
  }
}

// Export a singleton instance
export const telemetry = new TelemetryService();
export default telemetry;