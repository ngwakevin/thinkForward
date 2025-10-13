#!/usr/bin/env node
/**
 * ThinkForward Minimal Next.js Starter
 * 
 * This is a simplified starter script for Next.js in Azure
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

// Force critical environment variables
process.env.NEXT_IGNORE_FILESYSTEM_CHECK = '1';
process.env.NEXT_MANUAL_SIG_HANDLE = 'true'; 
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Log environment for debugging
console.log('=== ThinkForward Next.js Starter ===');
console.log('Starting at:', new Date().toISOString());
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// Helper to find server.js
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
    } catch (err) {}
  }
  return null;
}

// Create a basic HTTP server for fallback
function createBasicServer(port) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ThinkForward - Starting Up</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 2rem; }
            h1 { color: #0070f3; }
            .card { border: 1px solid #ddd; padding: 1rem; margin: 1rem 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <h1>ThinkForward Application</h1>
          <div class="card">
            <h2>Application is Starting</h2>
            <p>The server is currently initializing. This page will refresh automatically.</p>
            <p>Server time: ${new Date().toISOString()}</p>
          </div>
          <script>setTimeout(() => window.location.reload(), 5000);</script>
        </body>
      </html>
    `);
  });
  
  server.listen(port, () => {
    console.log(`Minimal server running at http://localhost:${port}`);
  });
}

// Main function
async function main() {
  const port = parseInt(process.env.PORT, 10) || 3000;
  
  try {
    // Try to use server.js first
    const serverJsPath = findServerJs();
    if (serverJsPath) {
      console.log(`Starting with server.js at ${serverJsPath}`);
      try {
        require(serverJsPath);
        return;
      } catch (err) {
        console.error('Error starting server.js:', err);
      }
    }
    
    // Fallback to Next.js direct start
    try {
      console.log('Starting Next.js directly...');
      const next = require('next');
      const nextApp = next({ dev: false });
      
      await nextApp.prepare();
      const handler = nextApp.getRequestHandler();
      
      const server = http.createServer(handler);
      server.listen(port, () => {
        console.log(`Next.js server running at http://localhost:${port}`);
      });
    } catch (nextErr) {
      console.error('Failed to start Next.js:', nextErr);
      createBasicServer(port);
    }
  } catch (err) {
    console.error('Fatal error:', err);
    createBasicServer(port);
  }
}

// Start the application
main().catch(err => {
  console.error('Unhandled error:', err);
  const port = parseInt(process.env.PORT, 10) || 3000;
  createBasicServer(port);
});