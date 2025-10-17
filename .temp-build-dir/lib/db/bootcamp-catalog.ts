import { CosmosClient, Container } from "@azure/cosmos";
import { isCosmosAvailable } from "../cosmos";

// Static bootcamp data for fallback when database is not available
const fallbackBootcamps = [
  {
    "id": "cloud-foundation",
    "name": "Cloud Foundation",
    "track": "Foundation",
    "startDate": "2025-11-01T08:00:00Z",
    "level": "Beginner",
    "description": "Learn the fundamentals of cloud computing and prepare for a career in the cloud.",
    "price": 999,
    "duration": "4 weeks"
  },
  {
    "id": "cloud-engineering",
    "name": "Cloud Engineering",
    "track": "Engineering",
    "startDate": "2025-12-01T08:00:00Z",
    "level": "Intermediate",
    "description": "Dive deeper into cloud infrastructure with hands-on engineering practices.",
    "price": 1499,
    "duration": "6 weeks"
  },
  {
    "id": "cloud-solution-architect",
    "name": "Cloud Solution Architect",
    "track": "Architect",
    "startDate": "2026-01-10T08:00:00Z",
    "level": "Advanced",
    "description": "Learn to design complex cloud solutions and architectures for enterprise needs.",
    "price": 1999,
    "duration": "8 weeks"
  },
  {
    "id": "cloud-networking",
    "name": "Cloud Networking",
    "track": "Networking",
    "startDate": "2026-02-15T08:00:00Z",
    "level": "Intermediate",
    "description": "Specialize in cloud networking concepts and implementation.",
    "price": 1299,
    "duration": "5 weeks"
  },
  {
    "id": "devops-foundations",
    "name": "DevOps Foundations",
    "track": "DevOps",
    "startDate": "2026-03-05T08:00:00Z",
    "level": "Beginner",
    "description": "Get started with DevOps practices and tools for modern application delivery.",
    "price": 1099,
    "duration": "4 weeks"
  }
];

// Define bootcamp type
export type Bootcamp = {
  id: string;
  name: string;
  track: string;
  startDate: string;
  level: string;
  description?: string;
  price?: number;
  duration?: string;
  curriculum?: string[];
  prerequisites?: string[];
  instructor?: string;
  imageUrl?: string;
  status?: 'Open' | 'Closed' | 'Full';
};

// Get the bootcamps container
async function getBootcampsContainer(): Promise<Container> {
  const endpoint = process.env.COSMOS_ENDPOINT || process.env.COSMOS_DB_ENDPOINT || "";
  const key = process.env.COSMOS_KEY || process.env.COSMOS_DB_KEY || "";
  const databaseId = process.env.COSMOS_DATABASE || process.env.COSMOS_DB_DATABASE_ID || "thinkforward";
  const containerId = "bootcamps"; // This should match your container name for bootcamps

  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  return database.container(containerId);
}

// Get all bootcamps
export async function getAllBootcamps(): Promise<Bootcamp[]> {
  // If Cosmos DB is not available, return static data
  if (!isCosmosAvailable()) {
    console.log("Cosmos DB not available, returning fallback bootcamp data");
    return fallbackBootcamps;
  }

  try {
    const container = await getBootcampsContainer();
    const query = "SELECT * FROM c";
    const { resources } = await container.items.query(query).fetchAll();
    
    if (resources && resources.length > 0) {
      console.log(`Retrieved ${resources.length} bootcamps from database`);
      return resources as Bootcamp[];
    } else {
      console.log("No bootcamps found in database, returning fallback data");
      return fallbackBootcamps;
    }
  } catch (error) {
    console.error("Error fetching bootcamps:", error);
    return fallbackBootcamps;
  }
}

// Get bootcamp by ID
export async function getBootcampById(id: string): Promise<Bootcamp | null> {
  if (!isCosmosAvailable()) {
    const bootcamp = fallbackBootcamps.find(b => b.id === id);
    return bootcamp || null;
  }

  try {
    const container = await getBootcampsContainer();
    const { resource } = await container.item(id, id).read();
    return resource as Bootcamp || null;
  } catch (error) {
    console.error(`Error fetching bootcamp with ID ${id}:`, error);
    return fallbackBootcamps.find(b => b.id === id) || null;
  }
}