// This is a placeholder for Application Insights configuration
// It ensures the server can start even if the actual configuration is missing
console.log('Using placeholder Application Insights configuration');

// Export an empty configuration
export const appInsightsClient = null;
export const setup = () => console.log('Application Insights setup skipped (placeholder)');
export default { 
  appInsightsClient: null,
  setup: () => console.log('Application Insights setup skipped (placeholder)')
};