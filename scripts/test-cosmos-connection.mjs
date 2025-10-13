// Test script to verify environment variables and Cosmos DB connection
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Check environment variables first
console.log('Environment Variables:');
console.log('COSMOS_ENDPOINT:', process.env.COSMOS_ENDPOINT);
console.log('COSMOS_KEY:', process.env.COSMOS_KEY ? '[SET]' : '[NOT SET]');
console.log('COSMOS_DATABASE:', process.env.COSMOS_DATABASE);
console.log('COSMOS_DB_CONTAINER_ID:', process.env.COSMOS_DB_CONTAINER_ID);

// Now try to import the cosmos modules if env vars are set
if (process.env.COSMOS_ENDPOINT && process.env.COSMOS_KEY) {
  import('../lib/azure/cosmos-config').then(({ verifyCosmosDBConnection }) => {
    verifyCosmosDBConnection().then(isConnected => {
      console.log('Connection test result:', isConnected ? 'SUCCESS' : 'FAILED');
      
      if (isConnected) {
        import('../lib/azure/community-service').then(({ communityService }) => {
          communityService.initialize().then(initialized => {
            console.log('Container initialization result:', initialized ? 'SUCCESS' : 'FAILED');
            
            if (initialized) {
              communityService.getAllCategories().then(categories => {
                console.log(`Retrieved ${categories.length} categories`);
                if (categories.length > 0) {
                  console.log('First category:', categories[0]);
                }
                console.log('Cosmos DB connection and community service tests PASSED!');
                process.exit(0);
              }).catch(error => {
                console.error('Error retrieving categories:', error);
                process.exit(1);
              });
            } else {
              console.error('Failed to initialize community containers.');
              process.exit(1);
            }
          }).catch(error => {
            console.error('Error initializing community containers:', error);
            process.exit(1);
          });
        }).catch(error => {
          console.error('Error importing community service:', error);
          process.exit(1);
        });
      } else {
        console.error('Could not connect to Cosmos DB. Please check your environment variables.');
        process.exit(1);
      }
    }).catch(error => {
      console.error('Error verifying Cosmos DB connection:', error);
      process.exit(1);
    });
  }).catch(error => {
    console.error('Error importing cosmos-config:', error);
    process.exit(1);
  });
} else {
  console.error('Required Cosmos DB environment variables are not set. Please check your .env file.');
  process.exit(1);
}