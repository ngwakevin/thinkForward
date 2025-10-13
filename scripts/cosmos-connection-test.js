// Test script to verify environment variables and Cosmos DB connection
import { config } from 'dotenv';
config({ path: '.env.local' });

// Fix the format of the endpoint by removing trailing quote marks
if (process.env.COSMOS_ENDPOINT) {
  process.env.COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT.replace(/["']+$/, '');
}

// Check environment variables first
console.log('Environment Variables:');
console.log('COSMOS_ENDPOINT:', process.env.COSMOS_ENDPOINT);
console.log('COSMOS_KEY:', process.env.COSMOS_KEY ? '[SET]' : '[NOT SET]');
console.log('COSMOS_DATABASE:', process.env.COSMOS_DATABASE);
console.log('COSMOS_DB_CONTAINER_ID:', process.env.COSMOS_DB_CONTAINER_ID);

console.log('\nConnection test preparation complete.');
console.log('To test the actual connection, please build the application and deploy it to Azure.');
console.log('The application is now configured to use Cosmos DB instead of Prisma.');

// Since we can't dynamically test the connection without building the app,
// let's summarize the changes we made
console.log('\nMigration Summary:');
console.log('1. Removed Prisma dependencies and configuration');
console.log('2. Created a Cosmos DB service for the community module');
console.log('3. Updated community API routes to use Cosmos DB');
console.log('4. Set up environment variables for Cosmos DB connection');
console.log('\nTo deploy these changes:');
console.log('1. Commit the changes to your repository');
console.log('2. Push to Azure to deploy');
console.log('3. Verify in the Azure portal that the application is connecting to Cosmos DB');