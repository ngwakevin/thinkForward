// Migration utility for data migration to Cosmos DB
// Note: Prisma functionality has been removed
import { cosmosService } from './cosmos-service';
import { verifyCosmosDBConnection } from './cosmos-config';

/**
 * This function previously migrated users from Prisma to Cosmos DB.
 * It has been updated to support alternate data sources for migration.
 * @param users An array of user objects to migrate to Cosmos DB
 * @returns Number of users migrated
 */
export async function migrateDataToCosmos(users: any[]): Promise<number> {
  try {
    // Verify connection to Cosmos DB
    const isConnected = await verifyCosmosDBConnection();
    if (!isConnected) {
      throw new Error('Could not connect to Cosmos DB');
    }

    console.log(`Preparing to migrate ${users.length} users`);

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
          // Create user in Cosmos DB
          await cosmosService.createUser(user);
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
 * Run the migration process with provided data
 * @param users User data to migrate
 */
export async function runMigration(users: any[]) {
  try {
    console.log('Starting migration to Cosmos DB...');
    const count = await migrateDataToCosmos(users);
    console.log(`Migration completed. ${count} records migrated.`);
    return { success: true, count };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error };
  }
}

// Add more migration functions for other data types as needed

export default {
  migrateDataToCosmos,
  runMigration,
};