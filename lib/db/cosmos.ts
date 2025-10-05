import { CosmosClient } from '@azure/cosmos';

/**
 * Azure Cosmos DB Client configuration
 * Used for database operations across the application
 */

// Cosmos DB connection settings
const cosmosConfig = {
  endpoint: process.env.COSMOS_ENDPOINT || '',
  key: process.env.COSMOS_KEY || '',
  databaseId: process.env.COSMOS_DATABASE_ID || 'thinkforward',
  partitionKey: { kind: 'Hash', paths: ['/id'] },
};

// Container names for different data types
export const containers = {
  users: 'users',
  progress: 'progress',
  content: 'content',
  security: 'security-audit',
};

// Create a singleton instance of the Cosmos DB client
class CosmosClientInstance {
  private static instance: CosmosClient;
  private static initialized = false;

  /**
   * Get the singleton instance of the Cosmos DB client
   * @returns Cosmos DB client instance
   */
  public static getInstance(): CosmosClient {
    if (!CosmosClientInstance.instance) {
      if (!cosmosConfig.endpoint || !cosmosConfig.key) {
        throw new Error('Cosmos DB endpoint and key must be provided in environment variables');
      }
      
      CosmosClientInstance.instance = new CosmosClient({
        endpoint: cosmosConfig.endpoint,
        key: cosmosConfig.key,
        connectionPolicy: {
          // Default retry options
          retryOptions: {
            maxRetryAttemptCount: 10,
            fixedRetryIntervalInMilliseconds: 1000,
            maxWaitTimeInSeconds: 60
          }
        }
      });
      
      CosmosClientInstance.initialized = true;
    }
    
    return CosmosClientInstance.instance;
  }
  
  /**
   * Initialize the database and containers if they don't exist
   */
  public static async initialize(): Promise<void> {
    if (CosmosClientInstance.initialized) {
      return;
    }
    
    const client = CosmosClientInstance.getInstance();
    
    // Create database if it doesn't exist
    const { database } = await client.databases.createIfNotExists({
      id: cosmosConfig.databaseId
    });
    
    console.log(`Database '${cosmosConfig.databaseId}' initialized`);
    
    // Create containers if they don't exist
    for (const [name, containerId] of Object.entries(containers)) {
      const { container } = await database.containers.createIfNotExists({
        id: containerId,
        partitionKey: cosmosConfig.partitionKey
      });
      
      console.log(`Container '${containerId}' initialized`);
    }
  }
}

export default CosmosClientInstance;