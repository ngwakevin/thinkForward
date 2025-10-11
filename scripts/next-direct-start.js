#!/usr/bin/env node
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
console.log(`Starting Next.js with command: next ${process.argv.slice(2).join(' ')}`);

// Run Next.js start
require('next/dist/bin/next');
