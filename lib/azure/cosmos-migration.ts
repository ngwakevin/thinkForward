// Migration utility for transferring data from Prisma (SQLite) to Cosmos DB
import prisma from '../prisma';
import { cosmosService } from './cosmos-service';
import { verifyCosmosDBConnection } from './cosmos-config';

/**
 * Migrate users from Prisma to Cosmos DB
 * @returns Number of users migrated
 */
export async function migrateUsersToCosmos(): Promise<number> {
  try {
    // Verify connection to Cosmos DB
    const isConnected = await verifyCosmosDBConnection();
    if (!isConnected) {
      throw new Error('Could not connect to Cosmos DB');
    }

    // Get all users from Prisma
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users to migrate`);

    // Migrate users to Cosmos DB
    let migratedCount = 0;
    for (const user of users) {
      try {
        // Check if user already exists in Cosmos DB
        const existingUser = await cosmosService.getUserById(user.id);
        if (existingUser) {
          console.log(`User ${user.id} already exists in Cosmos DB, updating...`);
          await cosmosService.updateUser(user.id, user);
        } else {
          // Create user in Cosmos DB (without the id as it will be generated)
          const { id, ...userData } = user;
          // @ts-ignore - Type mismatch between Prisma User and Cosmos User
          await cosmosService.createUser({ ...userData, id });
        }
        migratedCount++;
      } catch (error) {
        console.error(`Error migrating user ${user.id}:`, error);
      }
    }

    console.log(`Successfully migrated ${migratedCount} users to Cosmos DB`);
    return migratedCount;
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}

/**
 * Run the migration process
 */
export async function runMigration() {
  try {
    console.log('Starting migration to Cosmos DB...');
    const count = await migrateUsersToCosmos();
    console.log(`Migration completed. ${count} records migrated.`);
    return { success: true, count };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
}

// Add more migration functions for other data types as needed

export default {
  migrateUsersToCosmos,
  runMigration,
};