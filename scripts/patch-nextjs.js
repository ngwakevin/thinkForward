#!/usr/bin/env node
/**
 * This script patches the Next.js filesystem check to work in Azure App Service
 * It modifies the node_modules/next/dist/server/lib/router-utils/filesystem.js file
 * to bypass the BUILD_ID check that fails in Azure's read-only environment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('Patching Next.js for Azure App Service compatibility...');

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the Next.js filesystem.js file
let filesystemPath;
try {
  // In ESM, we don't have require.resolve, so we'll find it relative to node_modules
  filesystemPath = path.resolve(__dirname, '../node_modules/next/dist/server/lib/router-utils/filesystem.js');
  
  // Check if the file exists
  if (!fs.existsSync(filesystemPath)) {
    throw new Error(`File not found at ${filesystemPath}`);
  }
  
  console.log(`Found Next.js filesystem module at: ${filesystemPath}`);
} catch (err) {
  console.error('Failed to locate Next.js filesystem module:', err.message);
  process.exit(1);
}

// Read the original file
let content;
try {
  content = fs.readFileSync(filesystemPath, 'utf8');
  console.log(`Read ${content.length} bytes from filesystem.js`);
} catch (err) {
  console.error('Failed to read filesystem.js:', err.message);
  process.exit(1);
}

// Create a backup of the original file
try {
  fs.writeFileSync(`${filesystemPath}.bak`, content, 'utf8');
  console.log(`Created backup at ${filesystemPath}.bak`);
} catch (err) {
  console.error('Failed to create backup:', err.message);
}

// Find the setupFsCheck function
const functionStart = content.indexOf('function setupFsCheck');
if (functionStart === -1) {
  console.error('Could not find setupFsCheck function in filesystem.js');
  process.exit(1);
}

// Find the code that checks for BUILD_ID
const buildIdCheckStart = content.indexOf('buildIdPath', functionStart);
let buildIdCheckEnd = content.indexOf('throw new Error', buildIdCheckStart);

if (buildIdCheckStart === -1 || buildIdCheckEnd === -1) {
  console.error('Could not find BUILD_ID check code in setupFsCheck function');
  process.exit(1);
}

// Find the closing bracket of the if statement
buildIdCheckEnd = content.indexOf('}', buildIdCheckEnd);

// Extract the code that checks for BUILD_ID
const originalCode = content.substring(buildIdCheckStart, buildIdCheckEnd + 1);
console.log('Found BUILD_ID check code:');
console.log(originalCode);

// Create the patched code
const patchedCode = `
buildIdPath = buildIdPath || join(distDir, 'BUILD_ID');
// Azure App Service patch - Skip BUILD_ID check in Azure
if (process.env.WEBSITE_SITE_NAME) {
  console.log('Azure App Service detected, skipping BUILD_ID check');
  
  // Ensure BUILD_ID exists for Azure
  if (!await fileExists(buildIdPath)) {
    console.log('Creating dummy BUILD_ID for Azure App Service');
    await promises.writeFile(buildIdPath, \`azure-\${Date.now()}\`, 'utf8');
  }
  
  // Skip the check
  ctx.buildId = await promises.readFile(buildIdPath, 'utf8').then((text)=>text.trim());
} else if (!await fileExists(buildIdPath)) {
  throw new Error(
    'Could not find a production build in the \\'' + distDir + '\\' directory. Try building your app with \\'next build\\' before starting the production server. https://nextjs.org/docs/messages/production-start-no-build-id'
  )
}
`;

// Replace the original code with the patched code
const patchedContent = content.replace(originalCode, patchedCode);

// Write the patched file
try {
  fs.writeFileSync(filesystemPath, patchedContent, 'utf8');
  console.log('Successfully patched filesystem.js!');
  console.log(`Modified ${filesystemPath}`);
} catch (err) {
  console.error('Failed to write patched file:', err.message);
  process.exit(1);
}

console.log('Next.js patching complete. BUILD_ID check will now be bypassed in Azure App Service.');