#!/usr/bin/env node

/**
 * Generate a secure random string for use as NEXTAUTH_SECRET
 * Run this script to generate a secure secret key for NextAuth.js
 * 
 * Usage:
 *   node generate-secret.js
 *   or
 *   npm run generate:secret
 */

const crypto = require('crypto');

// Generate a random 32-byte string (base64 is shorter but still secure)
const secret = crypto.randomBytes(32).toString('base64');

console.log('\n=== NextAuth Secret Generator for Azure Deployment ===\n');
console.log(`Generated NEXTAUTH_SECRET: ${secret}\n`);
console.log('For local development, add this to your .env.local file:');
console.log(`NEXTAUTH_SECRET=${secret}\n`);
console.log('For GitHub Actions or Azure DevOps, add this as a repository secret named NEXTAUTH_SECRET');
console.log('For Azure App Service, add this as an application setting:\n');
console.log(`az webapp config appsettings set --name YOUR_APP_NAME \\
  --resource-group YOUR_RESOURCE_GROUP \\
  --settings NEXTAUTH_SECRET="${secret}"\n`);
console.log('IMPORTANT: Without this secret, authentication will fail in production!');