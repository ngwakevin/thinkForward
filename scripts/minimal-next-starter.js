#!/usr/bin/env node
/**
 * Minimal Next.js Starter for Azure
 * 
 * This is a simplified direct starter script for Next.js in Azure
 * that avoids the import approach that's causing errors.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

// Force critical environment variables
process.env.NEXT_IGNORE_FILESYSTEM_CHECK = '1';
process.env.NEXT_MANUAL_SIG_HANDLE = 'true'; 
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Log environment for debugging
console.log('=== Next.js Azure Direct Starter ===');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// Define a simple handler for when everything else fails
function createBasicHandler() {
  return function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ThinkForward - Server Starting</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #333; max-width: 650px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
            h1 { border-bottom: 1px solid #eee; padding-bottom: 1rem; }
            .card { border: 1px solid #ddd; border-radius: 4px; padding: 1.5rem; margin: 1rem 0; background: #f9f9f9; }
            .warning { background: #fff8e1; border-color: #ffecb3; }
            .refresh { margin-top: 2rem; }
          </style>
        </head>
        <body>
          <h1>ThinkForward Application</h1>
          <div class="card">
            <h2>Application is Starting</h2>
            <p>The Next.js application is currently initializing. This page is being served by a fallback handler.</p>
            <p>This typically happens during the first request after deployment when the application is still warming up.</p>
          </div>
          <div class="card warning">
            <h3>Next.js Server Status</h3>
            <p>The Next.js server is starting in minimal mode. Your application will be available shortly.</p>
          </div>
          <div class="refresh">
            <p>The page will automatically refresh in 10 seconds, or you can <a href="/">refresh manually</a>.</p>
          </div>
          <script>
            setTimeout(() => { window.location.reload(); }, 10000);
          </script>
        </body>
      </html>
    `);
  };
}

// Try to find the server.js file
function findServerJs() {
  const possiblePaths = [
    './server.js',
    '/home/site/wwwroot/server.js',
    path.join(process.cwd(), 'server.js')
  ];
  
  for (const serverPath of possiblePaths) {
    try {
      if (fs.existsSync(serverPath)) {
        console.log(`Found server.js at ${serverPath}`);
        return serverPath;
      }
    } catch (err) {
      console.log(`Error checking ${serverPath}:`, err.message);
    }
  }
  
  return null;
}

// Try to start a minimal server when everything else fails
function startMinimalServer(port) {
  console.log(`Starting minimal HTTP server on port ${port}...`);
  const server = http.createServer(createBasicHandler());
  server.listen(port, () => {
    console.log(`Minimal server running at http://localhost:${port}`);
  });
}

// Main execution
async function main() {
  const port = parseInt(process.env.PORT, 10) || 3000;
  
  try {
    // First try loading the server directly
    console.log('Attempting to load Next.js...');
    
    try {
      // Try to determine the Next.js version by checking package.json
      let nextVersion = 'unknown';
      try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          nextVersion = packageJson.dependencies?.next || 'unknown';
          console.log(`Detected Next.js version: ${nextVersion}`);
        }
      } catch (err) {
        console.error('Error reading package.json:', err.message);
      }
      
      // Try with explicit paths based on Next.js version
      let nextServerModule;
      let NextServer;
      let nextServerPath;
      
      // Try different module paths based on Next.js version
      const possibleServerPaths = [
        '/home/site/wwwroot/node_modules/next/dist/server/next-server',
        '/home/site/wwwroot/node_modules/next/dist/server/next',
        'next/dist/server/next-server',
        'next/dist/server/next'
      ];
      
      for (const modulePath of possibleServerPaths) {
        try {
          nextServerPath = require.resolve(modulePath);
          console.log(`Found Next.js server at: ${nextServerPath}`);
          nextServerModule = require(nextServerPath);
          break;
        } catch (e) {
          console.log(`Not found at ${modulePath}`);
        }
      }
      
      if (!nextServerModule) {
        throw new Error('Could not find Next.js server module');
      }
      
      // Next.js exports the server differently in different versions
      if (nextServerModule.default) {
        NextServer = nextServerModule.default;
        console.log('Using default export from Next.js server module');
      } else {
        NextServer = nextServerModule;
        console.log('Using direct export from Next.js server module');
      }
      
      console.log('Successfully loaded Next.js server module');
      
      if (typeof NextServer !== 'function') {
        console.error('NextServer is not a constructor function:', typeof NextServer);
        
        // If we have the createServer function directly
        if (typeof nextServerModule.createServer === 'function') {
          console.log('Found createServer function directly on module');
          const app = nextServerModule.createServer({
            dir: process.cwd(),
            dev: false,
            quiet: false
          });
          
          await app.prepare();
          const handler = app.getRequestHandler();
          
          // Create and start HTTP server
          const server = http.createServer(handler);
          server.listen(port, () => {
            console.log(`Next.js server running at http://localhost:${port} (using createServer)`);
          });
          
          return;
        }
        
        throw new Error('NextServer is not a constructor function and no createServer function found');
      }
      
      // Create the server instance
      const app = new NextServer({
        dir: process.cwd(),
        dev: false,
        conf: {
          distDir: '.next',
          experimental: {}
        }
      });
      
      await app.prepare();
      const handler = app.getRequestHandler();
      
      // Create and start HTTP server
      const server = http.createServer(handler);
      server.listen(port, () => {
        console.log(`Next.js server running at http://localhost:${port}`);
      });
      
      return;
    } catch (nextError) {
      console.error('Failed to start Next.js server:', nextError);
      
      // Try using custom server.js
      const serverJsPath = findServerJs();
      if (serverJsPath) {
        console.log(`Attempting to use ${serverJsPath}...`);
        try {
          require(serverJsPath);
          return;
        } catch (serverError) {
          console.error('Failed to use server.js:', serverError);
        }
      } else {
        console.log('No server.js found');
      }
    }
    
    // As a last resort, start a minimal HTTP server
    startMinimalServer(port);
    
  } catch (err) {
    console.error('Fatal error in starter script:', err);
    startMinimalServer(port);
  }
}

// Start the application
main().catch(err => {
  console.error('Unhandled error in main:', err);
  process.exit(1);
});