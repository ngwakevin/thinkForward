import { CosmosClient, Database, Container } from "@azure/cosmos";

// Environment variables should be set in the .env.local file and on Azure
// When running in Azure App Service, these may be set in the app settings
const endpoint = process.env.COSMOS_ENDPOINT || process.env.COSMOS_DB_ENDPOINT || "";
const key = process.env.COSMOS_KEY || process.env.COSMOS_DB_KEY || "";
const databaseId = process.env.COSMOS_DATABASE || process.env.COSMOS_DB_DATABASE_ID || "thinkforward";

// Log environment context for debugging
console.log(`Node environment: ${process.env.NODE_ENV}`);
console.log(`Running in Azure: ${!!process.env.WEBSITE_SITE_NAME ? 'Yes' : 'No'}`);
if (process.env.WEBSITE_SITE_NAME) {
  console.log(`Azure Website: ${process.env.WEBSITE_SITE_NAME}`);
}

// Log environment variable states for debugging
console.log("Cosmos DB Environment Variables:");
console.log("COSMOS_ENDPOINT:", process.env.COSMOS_ENDPOINT ? "Set (length: " + process.env.COSMOS_ENDPOINT.length + ")" : "Not set");
console.log("COSMOS_DB_ENDPOINT:", process.env.COSMOS_DB_ENDPOINT ? "Set (length: " + process.env.COSMOS_DB_ENDPOINT.length + ")" : "Not set");
console.log("COSMOS_KEY:", process.env.COSMOS_KEY ? "Set (length: " + process.env.COSMOS_KEY.length + ")" : "Not set");
console.log("COSMOS_DB_KEY:", process.env.COSMOS_DB_KEY ? "Set (length: " + process.env.COSMOS_DB_KEY.length + ")" : "Not set");
console.log("Final endpoint:", endpoint ? "Set (length: " + endpoint.length + ")" : "Not set");
console.log("Final key:", key ? "Set (length: " + key.length + ")" : "Not set");

// Check if configuration is valid
const isValidCosmosConfig = (
  endpoint && 
  key && 
  endpoint.length > 10 && // Make sure it's a meaningful value
  key.length > 10 && // Make sure it's a meaningful value
  !endpoint.includes('example.cosmos.azure.com') && 
  !endpoint.includes('placeholder')
);

// Track Cosmos DB availability
let cosmosAvailable = false;

// Containers
const USERS_CONTAINER = "users";
const PROFILES_CONTAINER = "profiles";
const BOOTCAMP_REGISTRATIONS_CONTAINER = "bootcampRegistrations";

// Initialize the Cosmos client if configuration is valid
let client: CosmosClient | null = null;
if (isValidCosmosConfig) {
  try {
    console.log("Attempting to create Cosmos client with:");
    console.log(`- Endpoint: ${endpoint.substring(0, 15)}...`); // Only log the beginning for security
    console.log(`- Key length: ${key.length}`);
    console.log(`- First/last chars of key: ${key.substring(0, 3)}...${key.substring(key.length-3)}`);
    
    client = new CosmosClient({ 
      endpoint, 
      key,
      connectionPolicy: {
        requestTimeout: 15000, // 15 seconds for more tolerance
        retryOptions: {
          maxRetryAttemptCount: 5,
          maxWaitTimeInSeconds: 10
        }
      }
    });
    console.log("Cosmos client created successfully");
  } catch (initError) {
    console.error("Failed to create Cosmos client:", initError);
    client = null;
  }
} else {
  console.warn("Invalid Cosmos configuration, client not initialized");
}

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
    containers[BOOTCAMP_REGISTRATIONS_CONTAINER] = new MockContainer(BOOTCAMP_REGISTRATIONS_CONTAINER);
      
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

    const { container: bootcampRegistrationsContainer } = await database.containers.createIfNotExists({
      id: BOOTCAMP_REGISTRATIONS_CONTAINER,
      partitionKey: { paths: ["/id"] }
    });
    containers[BOOTCAMP_REGISTRATIONS_CONTAINER] = bootcampRegistrationsContainer;

    console.log("Database and containers initialized successfully");
    cosmosAvailable = true;
    return true;
  } catch (error) {
    console.error("Error initializing Cosmos DB:", error);
    cosmosAvailable = false;
    
    // Create mock containers for fallback
    containers[USERS_CONTAINER] = new MockContainer(USERS_CONTAINER);
    containers[PROFILES_CONTAINER] = new MockContainer(PROFILES_CONTAINER);
    containers[BOOTCAMP_REGISTRATIONS_CONTAINER] = new MockContainer(BOOTCAMP_REGISTRATIONS_CONTAINER);
    
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
 * Get the bootcamp registrations container
 */
export async function getBootcampRegistrationsContainer(): Promise<Container | MockContainer> {
  return getContainer(BOOTCAMP_REGISTRATIONS_CONTAINER);
}

/**
 * Check if Cosmos DB is available
 */
export function isCosmosAvailable(): boolean {
  return cosmosAvailable;
}

/**
 * Test the Cosmos DB connection explicitly
 */
export async function testCosmosConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  if (!client) {
    return { 
      success: false, 
      message: "Cosmos client not initialized. Check endpoint and key." 
    };
  }

  try {
    console.log("Testing Cosmos DB connection...");
    // Try to read database info as a simple connectivity test
    const { resource: databaseInfo } = await client.database(databaseId).read();
    
    console.log("Connection test successful!");
    
    if (databaseInfo) {
      console.log("Connected to database:", databaseInfo.id);
      
      return {
        success: true,
        message: `Successfully connected to database: ${databaseInfo.id}`,
        details: {
          databaseId: databaseInfo.id,
          rid: databaseInfo._rid,
          timestamp: new Date().toISOString()
        }
      };
    } else {
      console.log("Connected to database, but no database info returned");
      
      return {
        success: true,
        message: "Connected to database, but no database info returned",
        details: {
          timestamp: new Date().toISOString()
        }
      };
    }
  } catch (error: any) {
    console.error("Connection test failed:", error);
    
    // Detailed error information
    const errorDetails = {
      name: error.name,
      code: error.code,
      body: error.body,
      statusCode: error.statusCode,
      message: error.message,
      endpoint: endpoint.substring(0, 20) + '...' // Only show beginning for security
    };
    
    return {
      success: false,
      message: `Connection test failed: ${error.message}`,
      details: errorDetails
    };
  }
}

// Initialize the database on module import
initializeDatabase()
  .then(success => {
    if (success) {
      console.log("Cosmos DB initialized successfully on startup");
      // Test the connection after initialization
      return testCosmosConnection();
    } else {
      console.warn("Cosmos DB initialization skipped or failed");
      return { success: false, message: "Initialization skipped or failed" };
    }
  })
  .then(testResult => {
    console.log("Connection test result:", testResult.message);
  })
  .catch(error => {
    console.error("Failed to initialize Cosmos DB on startup:", error);
  });