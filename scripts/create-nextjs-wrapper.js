#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// This script creates a direct Next.js start wrapper without patching
// It creates a simple script that can be used to start Next.js in Azure App Service

console.log('Creating Next.js direct start wrapper for Azure...');

// Create the direct start wrapper script
const wrapperScript = `#!/usr/bin/env node
/**
 * Next.js direct start wrapper for Azure App Service
 * This script bypasses the build directory check that fails in Azure's read-only filesystem
 */

// Force environment variables to bypass checks
process.env.NEXT_IGNORE_FILESYSTEM_CHECK = "1";
process.env.NEXT_MANUAL_SIG_HANDLE = "true";
process.env.NEXT_TELEMETRY_DISABLED = "1";

// Use the actual Next.js start command
process.argv[1] = require.resolve('next/dist/bin/next');
process.argv.splice(2, 0, 'start');

// Log the command
console.log(\`Starting Next.js with command: next \${process.argv.slice(2).join(' ')}\`);

// Run Next.js start
require('next/dist/bin/next');
`;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Write the wrapper script
const wrapperPath = path.join(__dirname, 'next-direct-start.js');
try {
  fs.writeFileSync(wrapperPath, wrapperScript, 'utf8');
  fs.chmodSync(wrapperPath, '755'); // Make executable
  console.log(`Created Next.js direct start wrapper at ${wrapperPath}`);
  console.log('You can use this script with: node scripts/next-direct-start.js -p $PORT');
} catch (err) {
  console.error('Failed to create wrapper script:', err.message);
  process.exit(1);
}

console.log('Next.js direct start wrapper created successfully.');