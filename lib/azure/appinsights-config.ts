// Azure Application Insights configuration - Next.js compatible
// Simplified version that works with Next.js bundling

// Configuration for Application Insights
export const appInsightsConfig = {
  connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APP_INSIGHTS_CONNECTION_STRING || '',
  roleName: process.env.APPLICATIONINSIGHTS_ROLE_NAME || 'thinkforward-web',
  enableAutoCollectConsole: true,
  enableAutoCollectExceptions: true,
  enableAutoCollectPerformance: true,
  enableAutoCollectRequests: true,
  enableAutoCollectDependencies: true,
  enableSendLiveMetrics: true,
  enableAutoCollectHeartbeat: true
};

// This is a dummy client that will be used in development or when App Insights is not configured
const dummyClient = {
  trackEvent: () => {},
  trackException: () => {},
  trackMetric: () => {},
  trackTrace: () => {},
  trackRequest: () => {},
  trackDependency: () => {},
  flush: () => {}
};

// Export a simple client interface that can be used in both client and server components
export const appInsightsClient = dummyClient;

// Initialize function that can be called server-side
export const initializeAppInsights = () => {
  // Skip if we're in the browser
  if (typeof window !== 'undefined') {
    return dummyClient;
  }

  if (!appInsightsConfig.connectionString) {
    console.warn('Application Insights connection string not configured, monitoring disabled');
    return dummyClient;
  }

  // We'll just return the dummy client for now
  // In production, you could set up a more robust solution using a different package
  console.log('Application Insights would be initialized in production environment');
  return dummyClient;
};