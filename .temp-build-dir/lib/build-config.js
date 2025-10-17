// This file is used to configure the build process for NextAuth.js
const { NEXTAUTH_URL, VERCEL_URL } = process.env;

// Ensure NEXTAUTH_URL is set for the build
if (!NEXTAUTH_URL && VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${VERCEL_URL}`;
  console.log(`NEXTAUTH_URL not set, using VERCEL_URL: ${process.env.NEXTAUTH_URL}`);
}

if (!process.env.NEXTAUTH_URL) {
  console.warn('NEXTAUTH_URL is not set, this may cause authentication issues');
  // Default value for local development
  process.env.NEXTAUTH_URL = 'http://localhost:3000';
}

// Default Cosmos DB values for build (will be overridden by real values in production)
if (!process.env.COSMOS_ENDPOINT || !process.env.COSMOS_KEY) {
  console.log('Setting empty Cosmos DB values for build');
  process.env.COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT || 'https://example.cosmos.azure.com:443/';
  process.env.COSMOS_KEY = process.env.COSMOS_KEY || 'dummy-key-for-build';
  process.env.COSMOS_DATABASE = process.env.COSMOS_DATABASE || 'thinkforward';
}

// Debug build info
console.log('--- Build Configuration ---');
console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log('---------------------------');