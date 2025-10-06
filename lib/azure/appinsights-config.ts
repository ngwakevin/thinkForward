// Azure Application Insights configuration
import * as appInsights from 'applicationinsights';

// Configuration for Application Insights
export const appInsightsConfig = {
  connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || '',
  roleName: process.env.APPLICATIONINSIGHTS_ROLE_NAME || 'thinkforward-web',
  enableAutoCollectConsole: true,
  enableAutoCollectExceptions: true,
  enableAutoCollectPerformance: true,
  enableAutoCollectRequests: true,
  enableAutoCollectDependencies: true,
  enableSendLiveMetrics: true,
  enableAutoCollectHeartbeat: true
};

// Initialize Application Insights
export const initializeAppInsights = () => {
  if (!appInsightsConfig.connectionString) {
    console.warn('Application Insights connection string not configured, monitoring disabled');
    return false;
  }

  try {
    appInsights.setup(appInsightsConfig.connectionString)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(appInsightsConfig.enableAutoCollectRequests)
      .setAutoCollectPerformance(appInsightsConfig.enableAutoCollectPerformance, true)
      .setAutoCollectExceptions(appInsightsConfig.enableAutoCollectExceptions)
      .setAutoCollectDependencies(appInsightsConfig.enableAutoCollectDependencies)
      .setAutoCollectConsole(appInsightsConfig.enableAutoCollectConsole, true)
      .setSendLiveMetrics(appInsightsConfig.enableSendLiveMetrics)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
      .start();
    
    // Set cloud role name to identify this component in Application Insights
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = appInsightsConfig.roleName;
    
    // Enable auto-collection of heartbeat
    if (appInsightsConfig.enableAutoCollectHeartbeat) {
      appInsights.defaultClient.config.enableAutoCollectHeartbeat = true;
    }
    
    console.log('Application Insights initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Application Insights:', error);
    return false;
  }
};

// Export the Application Insights client
export const appInsightsClient = appInsights.defaultClient;

export default {
  appInsightsClient,
  initializeAppInsights,
  appInsightsConfig
};