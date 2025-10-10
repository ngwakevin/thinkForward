import { CosmosClient, Database, Container } from "@azure/cosmos";

// Environment variables should be set in the .env.local file and on Azure
const endpoint = process.env.COSMOS_ENDPOINT || "";
const key = process.env.COSMOS_KEY || "";
const databaseId = process.env.COSMOS_DATABASE || "thinkforward";

// Containers
const USERS_CONTAINER = "users";
const PROFILES_CONTAINER = "profiles";

// Initialize the Cosmos client
const client = new CosmosClient({ 
  endpoint, 
  key,
  connectionPolicy: {
    requestTimeout: 10000, // 10 seconds
    retryOptions: {
      maxRetryAttemptCount: 3,
      maxWaitTimeInSeconds: 5
    }
  }
});

// Initialize database
let database: Database | null = null;
let containers: Record<string, Container> = {};

/**
 * Initialize the database and containers
 */
export async function initializeDatabase() {
  try {
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
    return true;
  } catch (error) {
    console.error("Error initializing Cosmos DB:", error);
    return false;
  }
}

/**
 * Get a container by name, initializing the database if needed
 */
export async function getContainer(containerName: string): Promise<Container> {
  if (!database || !containers[containerName]) {
    await initializeDatabase();
  }
  return containers[containerName] as Container;
}

/**
 * Get the users container
 */
export async function getUsersContainer(): Promise<Container> {
  return getContainer(USERS_CONTAINER);
}

/**
 * Get the profiles container
 */
export async function getProfilesContainer(): Promise<Container> {
  return getContainer(PROFILES_CONTAINER);
}

// Initialize the database on module import
initializeDatabase().catch(error => {
  console.error("Failed to initialize Cosmos DB on startup:", error);
});