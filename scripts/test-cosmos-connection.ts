// Test script to verify Cosmos DB connection
import { verifyCosmosDBConnection } from '../lib/azure/cosmos-config';
import { communityService } from '../lib/azure/community-service';

async function main() {
  console.log('Testing Cosmos DB connection...');
  
  // Verify connection
  const isConnected = await verifyCosmosDBConnection();
  console.log('Connection test result:', isConnected ? 'SUCCESS' : 'FAILED');
  
  if (!isConnected) {
    console.error('Could not connect to Cosmos DB. Please check your environment variables.');
    process.exit(1);
  }
  
  // Initialize community containers
  console.log('Initializing community containers...');
  const initialized = await communityService.initialize();
  console.log('Container initialization result:', initialized ? 'SUCCESS' : 'FAILED');
  
  if (!initialized) {
    console.error('Failed to initialize community containers.');
    process.exit(1);
  }
  
  // Test retrieving categories
  try {
    console.log('Testing category retrieval...');
    const categories = await communityService.getAllCategories();
    console.log(`Retrieved ${categories.length} categories`);
    if (categories.length > 0) {
      console.log('First category:', categories[0]);
    }
  } catch (error) {
    console.error('Error retrieving categories:', error);
    process.exit(1);
  }
  
  console.log('Cosmos DB connection and community service tests PASSED!');
  process.exit(0);
}

main().catch(error => {
  console.error('Unhandled error during test:', error);
  process.exit(1);
});