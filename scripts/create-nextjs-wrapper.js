#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// This script creates a direct Next.js start wrapper without patching
// It creates a script that can be used to start Next.js in Azure App Service

console.log('Creating Next.js direct start wrapper for Azure...');

// Create the direct start wrapper script with enhanced error handling
const wrapperScript = `#!/usr/bin/env node
/**
 * Next.js direct start wrapper for Azure App Service
 * This script bypasses the Next.js CLI and starts the server directly,
 * avoiding the build directory check that fails in Azure's read-only filesystem
 */

// Force environment variables to bypass checks
process.env.NEXT_IGNORE_FILESYSTEM_CHECK = "1";
process.env.NEXT_MANUAL_SIG_HANDLE = "true";
process.env.NEXT_TELEMETRY_DISABLED = "1";

/**
 * DIRECT START METHOD:
 * This approach bypasses the Next.js CLI completely and starts the server directly.
 * This is more reliable in Azure App Service's read-only filesystem.
 */
try {
  const { default: Server } = require('next/dist/server/next-server');
  const { PHASE_PRODUCTION_SERVER } = require('next/dist/shared/lib/constants');
  const { parse } = require('url');
  const http = require('http');
  const path = require('path');
  const fs = require('fs');

  console.log('Starting Next.js using direct server instantiation method');

  // Parse arguments
  const args = process.argv.slice(2);
  let port = process.env.PORT || 3000;
  const portArgIndex = args.indexOf('-p');
  if (portArgIndex !== -1 && args[portArgIndex + 1]) {
    port = parseInt(args[portArgIndex + 1], 10);
  }

  // Check possible build directory locations
  const possibleDirs = [
    '.next',
    '/home/site/wwwroot/.next', 
    '/home/site/next-temp/.next'
  ];

  // Use NEXT_DIST_DIR if set
  let distDir = process.env.NEXT_DIST_DIR || '.next';
  
  // Find a valid build directory
  for (const dir of possibleDirs) {
    try {
      if (fs.existsSync(path.join(dir, 'BUILD_ID'))) {
        distDir = dir;
        console.log(\`Found valid build directory at \${dir}\`);
        break;
      }
    } catch (err) {
      // Ignore errors
    }
  }
  
  console.log(\`Using Next.js build directory: \${distDir}\`);

  // Ensure required files exist
  const requiredFiles = [
    path.join(distDir, 'BUILD_ID'),
    path.join(distDir, 'build-manifest.json'),
    path.join(distDir, 'server', 'pages-manifest.json')
  ];

  for (const file of requiredFiles) {
    try {
      if (!fs.existsSync(file)) {
        console.log(\`Required file not found: \${file}, creating minimal version\`);
        const dir = path.dirname(file);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        if (file.endsWith('BUILD_ID')) {
          fs.writeFileSync(file, Date.now().toString());
        } else {
          fs.writeFileSync(file, '{}');
        }
      }
    } catch (err) {
      console.warn(\`Could not create or verify \${file}: \${err.message}\`);
    }
  }

  // Create symbolic links to help Next.js find the build
  try {
    // If we're not using the default .next directory, create a symlink
    if (distDir !== '.next') {
      try {
        fs.symlinkSync(distDir, '.next');
        console.log(\`Created symlink from \${distDir} to .next\`);
      } catch (err) {
        if (!err.code === 'EEXIST') {
          console.warn(\`Could not create symlink: \${err.message}\`);
        }
      }
    }
    
    // Special handling for the path in the error message
    if (distDir !== '/home/site/next-temp/.next') {
      try {
        fs.mkdirSync('/home/site/next-temp', { recursive: true });
        fs.symlinkSync(distDir, '/home/site/next-temp/.next');
        console.log(\`Created symlink from \${distDir} to /home/site/next-temp/.next\`);
      } catch (err) {
        if (!err.code === 'EEXIST') {
          console.warn(\`Could not create symlink to /home/site/next-temp/.next: \${err.message}\`);
        }
      }
    }
  } catch (err) {
    console.warn(\`Error while creating symlinks: \${err.message}\`);
  }

  // Create Next.js server instance
  const nextApp = new Server({
    dir: process.cwd(),
    dev: false,
    quiet: false,
    conf: {
      distDir,
      experimental: {},
    },
  });

  // Prepare the server
  const handle = nextApp.getRequestHandler();

  // Create the HTTP server
  const server = http.createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Start listening
  nextApp.prepare().then(() => {
    server.listen(port, (err) => {
      if (err) throw err;
      const addr = server.address();
      const actualPort = typeof addr === 'object' ? addr.port : port;
      console.log(\`> Ready on http://localhost:\${actualPort}\`);
    });
  }).catch(err => {
    console.error('Failed to prepare Next.js server using direct method:', err);
    console.log('Falling back to CLI approach...');
    
    // Fallback to CLI approach
    process.argv[1] = require.resolve('next/dist/bin/next');
    process.argv.splice(2, 0, 'start');
    console.log(\`Starting Next.js with fallback CLI command: next \${process.argv.slice(2).join(' ')}\`);
    require('next/dist/bin/next');
  });

  // Handle termination signals
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received, closing server');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received, closing server');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
} catch (error) {
  console.error('Error in direct start approach:', error);
  console.log('Falling back to CLI approach...');
  
  // Fallback to CLI approach
  process.argv[1] = require.resolve('next/dist/bin/next');
  process.argv.splice(2, 0, 'start');
  console.log(\`Starting Next.js with fallback CLI command: next \${process.argv.slice(2).join(' ')}\`);
  require('next/dist/bin/next');
}`;

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