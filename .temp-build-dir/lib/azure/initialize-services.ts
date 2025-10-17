// Azure Services Initialization
import { initializeCosmosDB, setupAdditionalContainers } from './cosmos-init';
import { initializeBlobStorage, setupAdditionalContainers as setupBlobContainers } from './storage-init';
import { initializeAppInsights } from './appinsights-config';
import { verifyKeyVaultConnection } from './keyvault-config';
import { keyVaultService } from './keyvault-service';

/**
 * Initialize all Azure services
 */
export async function initializeAzureServices() {
  console.log('Initializing Azure services...');
  const results = {
    appInsights: false,
    keyVault: false,
    cosmosDB: false,
    blobStorage: false
  };

  // Initialize Application Insights first for proper monitoring
  const appInsightsClient = initializeAppInsights();
  results.appInsights = !!appInsightsClient; // Convert to boolean for results object

  // Initialize Key Vault (needed for other services that might use secrets)
  try {
    results.keyVault = await verifyKeyVaultConnection();
  } catch (error) {
    console.error('Error initializing Key Vault:', error);
  }

  // Initialize Cosmos DB
  try {
    const cosmosResult = await initializeCosmosDB();
    if (cosmosResult.success) {
      await setupAdditionalContainers();
      results.cosmosDB = true;
    }
  } catch (error) {
    console.error('Error initializing Cosmos DB:', error);
  }

  // Initialize Blob Storage
  try {
    const blobResult = await initializeBlobStorage();
    if (blobResult.success) {
      await setupBlobContainers();
      results.blobStorage = true;
    }
  } catch (error) {
    console.error('Error initializing Blob Storage:', error);
  }

  // Log initialization results
  console.log('Azure services initialization results:', results);
  
  return {
    success: Object.values(results).some(result => result),
    results
  };
}

export default {
  initializeAzureServices
};