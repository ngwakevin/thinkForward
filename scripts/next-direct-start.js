#!/usr/bin/env node
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

  // Determine Next.js dist directory
  const distDir = process.env.NEXT_DIST_DIR || '.next';
  console.log(`Using Next.js build directory: ${distDir}`);

  // Ensure required files exist
  const requiredFiles = [
    path.join(distDir, 'BUILD_ID'),
    path.join(distDir, 'build-manifest.json'),
    path.join(distDir, 'server', 'pages-manifest.json')
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      console.log(`Required file not found: ${file}, creating minimal version`);
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
      console.log(`> Ready on http://localhost:${actualPort}`);
    });
  }).catch(err => {
    console.error('Failed to prepare Next.js server using direct method:', err);
    console.log('Falling back to CLI approach...');
    
    // Fallback to CLI approach
    process.argv[1] = require.resolve('next/dist/bin/next');
    process.argv.splice(2, 0, 'start');
    console.log(`Starting Next.js with fallback CLI command: next ${process.argv.slice(2).join(' ')}`);
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
  console.log(`Starting Next.js with fallback CLI command: next ${process.argv.slice(2).join(' ')}`);
  require('next/dist/bin/next');
}
