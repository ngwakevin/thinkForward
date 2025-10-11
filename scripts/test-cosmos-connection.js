#!/usr/bin/env node
/**
 * Test Cosmos DB connection script
 * 
 * This script tests the connection to Azure Cosmos DB using the environment variables
 * and reports detailed information about any issues.
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { CosmosClient } = require('@azure/cosmos');

// Get configuration from environment variables
const endpoint = process.env.COSMOS_ENDPOINT || process.env.COSMOS_DB_ENDPOINT || '';
const key = process.env.COSMOS_KEY || process.env.COSMOS_DB_KEY || '';
const databaseId = process.env.COSMOS_DATABASE || process.env.COSMOS_DB_DATABASE_ID || 'thinkforward';

console.log('\n=== Cosmos DB Connection Test ===\n');

// Print environment variable status
console.log('Environment Variables:');
console.log(`- COSMOS_ENDPOINT: ${process.env.COSMOS_ENDPOINT ? '✓' : '✗'} ${process.env.COSMOS_ENDPOINT ? `(${process.env.COSMOS_ENDPOINT.length} chars)` : ''}`);
console.log(`- COSMOS_DB_ENDPOINT: ${process.env.COSMOS_DB_ENDPOINT ? '✓' : '✗'} ${process.env.COSMOS_DB_ENDPOINT ? `(${process.env.COSMOS_DB_ENDPOINT.length} chars)` : ''}`);
console.log(`- COSMOS_KEY: ${process.env.COSMOS_KEY ? '✓' : '✗'} ${process.env.COSMOS_KEY ? `(${process.env.COSMOS_KEY.length} chars)` : ''}`);
console.log(`- COSMOS_DB_KEY: ${process.env.COSMOS_DB_KEY ? '✓' : '✗'} ${process.env.COSMOS_DB_KEY ? `(${process.env.COSMOS_DB_KEY.length} chars)` : ''}`);
console.log(`- COSMOS_DATABASE: ${process.env.COSMOS_DATABASE ? '✓' : '✗'} ${process.env.COSMOS_DATABASE || ''}`);
console.log(`- COSMOS_DB_DATABASE_ID: ${process.env.COSMOS_DB_DATABASE_ID ? '✓' : '✗'} ${process.env.COSMOS_DB_DATABASE_ID || ''}`);

// Check if variables have values
const effective = {
  endpoint,
  key,
  databaseId
};

console.log('\nEffective Configuration:');
console.log(`- Endpoint: ${effective.endpoint ? '✓' : '✗'} ${effective.endpoint ? `(${effective.endpoint.length} chars)` : ''}`);
console.log(`- Key: ${effective.key ? '✓' : '✗'} ${effective.key ? `(${effective.key.length} chars)` : ''}`);
console.log(`- Database ID: ${effective.databaseId}`);

if (!effective.endpoint || !effective.key) {
  console.error('\n❌ ERROR: Missing required Cosmos DB configuration.');
  console.error('Make sure COSMOS_ENDPOINT/COSMOS_DB_ENDPOINT and COSMOS_KEY/COSMOS_DB_KEY are set in your environment.');
  process.exit(1);
}

// If we have the required values, test the connection
console.log('\nTesting connection to Cosmos DB...');

// Create the client
const client = new CosmosClient({
  endpoint: effective.endpoint,
  key: effective.key,
  connectionPolicy: {
    requestTimeout: 10000,
    retryOptions: {
      maxRetryAttemptCount: 3,
      maxWaitTimeInSeconds: 5
    }
  }
});

// Helper function to sanitize key for logging
function sanitizeKey(key) {
  if (!key) return '';
  if (key.length <= 6) return '***';
  return `${key.substring(0, 3)}...${key.substring(key.length - 3)}`;
}

async function testCosmosConnection() {
  try {
    // First, try to get database info
    console.log(`\nAttempting to read database: ${databaseId}`);
    
    // Detailed connection info for debugging
    console.log('\nConnection Details:');
    console.log(`- Endpoint: ${effective.endpoint}`);
    console.log(`- Key: ${sanitizeKey(effective.key)}`);
    console.log(`- Database ID: ${effective.databaseId}`);
    
    const { resource: databaseInfo } = await client.database(databaseId).read();
    
    console.log('\n✅ Successfully connected to database!');
    console.log('Database details:');
    console.log(`- ID: ${databaseInfo.id}`);
    console.log(`- RID: ${databaseInfo._rid}`);
    console.log(`- Self Link: ${databaseInfo._self}`);
    
    // List containers
    console.log('\nListing containers in the database:');
    const { resources: containers } = await client.database(databaseId).containers.readAll().fetchAll();
    
    if (containers.length === 0) {
      console.log('- No containers found in the database');
    } else {
      containers.forEach(container => {
        console.log(`- ${container.id} (partition key: ${JSON.stringify(container.partitionKey.paths)})`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error(`- Name: ${error.name}`);
    console.error(`- Code: ${error.code}`);
    console.error(`- Status Code: ${error.statusCode || 'N/A'}`);
    console.error(`- Message: ${error.message}`);
    
    if (error.body) {
      try {
        console.error('- Body:', JSON.stringify(error.body, null, 2));
      } catch (e) {
        console.error('- Body:', error.body);
      }
    }
    
    // Provide recommendations based on common errors
    console.log('\nTroubleshooting recommendations:');
    
    if (error.code === 'Unauthorized' || error.statusCode === 401) {
      console.log('- The key appears to be invalid or has incorrect permissions');
      console.log('- Check that the key is correct and has not been rotated');
      console.log('- Verify that you\'re using the PRIMARY key from the Azure portal');
    }
    
    if (error.code === 'NotFound' || error.statusCode === 404) {
      console.log('- The database or container does not exist');
      console.log('- Check if the database ID is correct');
      console.log('- You might need to create the database and containers first');
    }
    
    if (error.code === 'Forbidden' || error.statusCode === 403) {
      console.log('- The request was forbidden due to authorization issues');
      console.log('- Check IP restrictions on your Cosmos DB account');
      console.log('- Verify network settings in the Azure portal');
    }
    
    return false;
  }
}

// Run the test
testCosmosConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ Cosmos DB connection test passed successfully!\n');
      process.exit(0);
    } else {
      console.error('\n❌ Cosmos DB connection test failed. See errors above.\n');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n❌ Unexpected error during test:', error);
    process.exit(1);
  });