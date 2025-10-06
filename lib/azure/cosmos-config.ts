// Azure Cosmos DB configuration
import { CosmosClient, PartitionKeyDefinition } from '@azure/cosmos';

// Configuration details for Cosmos DB
export const cosmosConfig = {
  endpoint: process.env.COSMOS_DB_ENDPOINT || '',
  key: process.env.COSMOS_DB_KEY || '',
  databaseId: process.env.COSMOS_DB_DATABASE_ID || 'thinkforward',
  containerId: process.env.COSMOS_DB_CONTAINER_ID || 'users',
  partitionKey: { kind: 'Hash', paths: ['/id'] } as PartitionKeyDefinition
};

// Create the Cosmos DB client
export const client = new CosmosClient({
  endpoint: cosmosConfig.endpoint,
  key: cosmosConfig.key,
});

// Initialize database and container
export const database = client.database(cosmosConfig.databaseId);
export const container = database.container(cosmosConfig.containerId);

// Verify Cosmos DB connection
export const verifyCosmosDBConnection = async () => {
  try {
    // Check if we can query the database
    await database.read();
    console.log('Connected to Cosmos DB database:', cosmosConfig.databaseId);
    return true;
  } catch (error) {
    console.error('Error connecting to Cosmos DB:', error);
    return false;
  }
};

export default {
  client,
  database,
  container,
  config: cosmosConfig,
  verifyCosmosDBConnection
};