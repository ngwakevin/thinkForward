import { CosmosClient, Database, Container } from "@azure/cosmos";

// Environment variables should be set in the .env.local file and on Azure
const endpoint = process.env.COSMOS_ENDPOINT || "";
const key = process.env.COSMOS_KEY || "";
const databaseId = process.env.COSMOS_DATABASE || "thinkforward";

// Check if configuration is valid
const isValidCosmosConfig = (
  endpoint && 
  key && 
  !endpoint.includes('example.cosmos.azure.com') && 
  !endpoint.includes('placeholder')
);

// Track Cosmos DB availability
let cosmosAvailable = false;

// Containers
const USERS_CONTAINER = "users";
const PROFILES_CONTAINER = "profiles";

// Initialize the Cosmos client if configuration is valid
const client = isValidCosmosConfig ? new CosmosClient({ 
  endpoint, 
  key,
  connectionPolicy: {
    requestTimeout: 10000, // 10 seconds
    retryOptions: {
      maxRetryAttemptCount: 3,
      maxWaitTimeInSeconds: 5
    }
  }
}) : null;

// Log Cosmos DB status
console.log(`Cosmos DB configuration status: ${isValidCosmosConfig ? 'VALID' : 'INVALID'}`);
if (!isValidCosmosConfig) {
  console.warn("Cosmos DB is not properly configured. User data will not be persisted.");
  console.warn("Endpoint:", endpoint ? (endpoint.includes('example') ? 'Contains placeholder value' : 'Set') : 'Not set');
  console.warn("Key:", key ? 'Set (hidden)' : 'Not set');
  console.warn("Database:", databaseId);
}

// Mock container for fallback when Cosmos DB is not available
class MockContainer {
  private containerName: string;

  constructor(containerName: string) {
    this.containerName = containerName;
    console.log(`Created mock container: ${containerName}`);
  }

  get items() {
    return {
      create: async () => ({ resource: {} }),
      upsert: async (item: any) => ({ resource: item }),
      query: () => ({
        fetchAll: async () => ({ resources: [] })
      }),
      read: async () => ({ resource: {} })
    };
  }
}

// Initialize database
let database: Database | null = null;
let containers: Record<string, Container | MockContainer> = {};

/**
 * Initialize the database and containers
 */
export async function initializeDatabase() {
  try {
    if (!client) {
      console.warn("Cosmos DB client is not initialized. Using mock containers.");
      cosmosAvailable = false;
      
      // Create mock containers for fallback
      containers[USERS_CONTAINER] = new MockContainer(USERS_CONTAINER);
      containers[PROFILES_CONTAINER] = new MockContainer(PROFILES_CONTAINER);
      
      return false;
    }

    // Get or create database
    const { database: db } = await client.databases.createIfNotExists({
      id: databaseId
    });
    database = db;

    // Get or create containers
    const { container: usersContainer } = await database.containers.createIfNotExists({
      id: USERS_CONTAINER,
      partitionKey: { paths: ["/id"] }
    });
    containers[USERS_CONTAINER] = usersContainer;

    const { container: profilesContainer } = await database.containers.createIfNotExists({
      id: PROFILES_CONTAINER,
      partitionKey: { paths: ["/userId"] }
    });
    containers[PROFILES_CONTAINER] = profilesContainer;

    console.log("Database and containers initialized successfully");
    cosmosAvailable = true;
    return true;
  } catch (error) {
    console.error("Error initializing Cosmos DB:", error);
    cosmosAvailable = false;
    
    // Create mock containers for fallback
    containers[USERS_CONTAINER] = new MockContainer(USERS_CONTAINER);
    containers[PROFILES_CONTAINER] = new MockContainer(PROFILES_CONTAINER);
    
    return false;
  }
}

/**
 * Get a container by name, initializing the database if needed
 */
export async function getContainer(containerName: string): Promise<Container | MockContainer> {
  if (!containers[containerName]) {
    await initializeDatabase();
  }
  return containers[containerName];
}

/**
 * Get the users container
 */
export async function getUsersContainer(): Promise<Container | MockContainer> {
  return getContainer(USERS_CONTAINER);
}

/**
 * Get the profiles container
 */
export async function getProfilesContainer(): Promise<Container | MockContainer> {
  return getContainer(PROFILES_CONTAINER);
}

/**
 * Check if Cosmos DB is available
 */
export function isCosmosAvailable(): boolean {
  return cosmosAvailable;
}

// Initialize the database on module import
initializeDatabase().catch(error => {
  console.error("Failed to initialize Cosmos DB on startup:", error);
});