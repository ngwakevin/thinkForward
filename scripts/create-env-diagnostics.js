#!/usr/bin/env node
/**
 * Azure App Service Environment Variable Diagnostics Script
 * 
 * This script creates a diagnostic endpoint that reports on the state of
 * environment variables in Azure App Service without revealing sensitive values.
 * It helps diagnose issues with environment variables in production.
 */

const fs = require('fs');
const path = require('path');

// Create a diagnostics file in the API folder
const diagFileName = 'env-diagnostics.js';
const apiFolder = path.join(process.cwd(), 'app', 'api', 'diagnostics');
const diagFilePath = path.join(apiFolder, 'route.js');

// Ensure the directory exists
if (!fs.existsSync(apiFolder)) {
  fs.mkdirSync(apiFolder, { recursive: true });
  console.log(`Created directory: ${apiFolder}`);
}

// Create the diagnostics API endpoint
const diagnosticsCode = `
import { NextResponse } from 'next/server';

/**
 * Environment variable diagnostics endpoint
 * For troubleshooting Azure App Service environment variables
 * This endpoint does NOT expose actual values, only presence/absence and lengths
 */
export async function GET() {
  // List of environment variables to check (add any you need to diagnose)
  const varsToCheck = [
    // Cosmos DB
    'COSMOS_ENDPOINT', 'COSMOS_DB_ENDPOINT',
    'COSMOS_KEY', 'COSMOS_DB_KEY',
    'COSMOS_DATABASE', 'COSMOS_DB_DATABASE_ID',
    
    // Authentication
    'NEXTAUTH_URL', 'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
    'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET',
    
    // Azure specific
    'WEBSITE_SITE_NAME', 'WEBSITE_INSTANCE_ID',
    'WEBSITE_RESOURCE_GROUP', 'WEBSITE_CONTENTSHARE',
    
    // Next.js
    'NODE_ENV', 'NEXT_RUNTIME'
  ];
  
  // Gather diagnostic information
  const diagnosticInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    platform: process.platform,
    nodeVersion: process.version,
    runtimeInfo: {
      isAzure: !!process.env.WEBSITE_SITE_NAME,
      siteName: process.env.WEBSITE_SITE_NAME || 'local',
    },
    filesystemInfo: {
      cwd: process.cwd(),
      tmpDir: {
        exists: fs.existsSync('/tmp'),
        writable: checkDirWritable('/tmp'),
      },
      homeDir: {
        exists: fs.existsSync('/home'),
        writable: checkDirWritable('/home'),
      },
      homeSiteDir: {
        exists: fs.existsSync('/home/site'),
        writable: checkDirWritable('/home/site'),
      },
      nextTempDir: {
        exists: fs.existsSync('/home/site/next-temp'),
        writable: checkDirWritable('/home/site/next-temp'),
      }
    },
    environmentVariables: {}
  };
  
  // Check each environment variable without exposing values
  varsToCheck.forEach(varName => {
    const value = process.env[varName];
    diagnosticInfo.environmentVariables[varName] = {
      exists: value !== undefined,
      length: value ? value.length : 0,
      empty: value === '',
      // For keys, show first/last 3 chars only if value exists and length > 10
      preview: varName.includes('KEY') && value && value.length > 10 
        ? \`\${value.substring(0, 3)}...\${value.substring(value.length - 3)}\` 
        : undefined
    };
  });
  
  // Add Cosmos DB connection status if possible
  try {
    const { isCosmosAvailable, testCosmosConnection } = await import('@/lib/cosmos');
    diagnosticInfo.cosmosDbStatus = {
      isAvailable: isCosmosAvailable(),
      connectionTest: await testCosmosConnection()
        .then(result => ({
          success: result.success,
          message: result.message,
        }))
        .catch(error => ({
          success: false,
          message: \`Test failed: \${error.message}\`,
        }))
    };
  } catch (error) {
    diagnosticInfo.cosmosDbStatus = {
      error: \`Could not import cosmos module: \${error.message}\`
    };
  }

  return NextResponse.json(diagnosticInfo);
}

/**
 * Check if a directory is writable
 */
function checkDirWritable(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      return false;
    }
    
    // Try to write a temporary file
    const testFile = path.join(dirPath, \`.test-write-\${Date.now()}.txt\`);
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    return true;
  } catch (error) {
    return false;
  }
}
`;

// Write the file
fs.writeFileSync(diagFilePath, diagnosticsCode);
console.log(`Created diagnostics endpoint at: ${diagFilePath}`);
console.log('Access this endpoint at: /api/diagnostics');
console.log('WARNING: Only use in development or during troubleshooting as it exposes environment variable metadata');

// Add a quick note about the security implications
console.log('\nSECURITY NOTE: This endpoint does not expose sensitive values,');
console.log('but it does reveal which environment variables are set and their lengths.');
console.log('Remove this endpoint after troubleshooting is complete.');