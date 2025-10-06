// Cosmos DB initialization
import { PartitionKeyDefinition } from '@azure/cosmos';
import { client, database, container } from './cosmos-config';
import { cosmosConfig } from './cosmos-config';

/**
 * Initialize Cosmos DB database and container
 */
export async function initializeCosmosDB() {
  try {
    console.log('Initializing Cosmos DB connection...');

    // Create database if it doesn't exist
    const { database: db } = await client.databases.createIfNotExists({
      id: cosmosConfig.databaseId
    });
    console.log(`Database '${db.id}' initialized`);

    // Create container if it doesn't exist
    const { container: cont } = await db.containers.createIfNotExists({
      id: cosmosConfig.containerId,
      partitionKey: cosmosConfig.partitionKey
    });
    console.log(`Container '${cont.id}' initialized with partition key '${JSON.stringify(cosmosConfig.partitionKey)}'`);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to initialize Cosmos DB:', error);
    return { success: false, error };
  }
}

/**
 * Setup additional containers for the application
 */
export async function setupAdditionalContainers() {
  try {
    const containersToCreate = [
      { id: 'profiles', partitionKey: { kind: 'Hash', paths: ['/userId'] } as PartitionKeyDefinition },
      { id: 'communities', partitionKey: { kind: 'Hash', paths: ['/id'] } as PartitionKeyDefinition },
      { id: 'posts', partitionKey: { kind: 'Hash', paths: ['/id'] } as PartitionKeyDefinition },
      { id: 'events', partitionKey: { kind: 'Hash', paths: ['/id'] } as PartitionKeyDefinition }
    ];

    for (const containerDef of containersToCreate) {
      await database.containers.createIfNotExists({
        id: containerDef.id,
        partitionKey: containerDef.partitionKey
      });
      console.log(`Container '${containerDef.id}' initialized`);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to setup additional containers:', error);
    return { success: false, error };
  }
}

export default {
  initializeCosmosDB,
  setupAdditionalContainers
};