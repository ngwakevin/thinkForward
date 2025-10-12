#!/bin/bash
# This script ensures critical files exist in the Azure App Service environment
# It will be called directly from the Azure App Service startup command

set -e

echo "=== Ensuring Critical Files Exist in Azure App Service ==="
echo "Date: $(date)"
echo "Current directory: $(pwd)"

# Define critical files that must be present
CRITICAL_FILES=(
  "scripts/minimal-next-starter.js"
  "scripts/emergency-server.js"
  "scripts/comprehensive-nextjs-diagnostics.js"
  "scripts/copy-critical-files-to-temp.sh"
  "scripts/resolve-next-modules.js"
  "scripts/fix-nextjs-build-dir.sh"
)

# Create /home/site/temp directory if it doesn't exist
TEMP_DIR="/home/site/temp"
mkdir -p "$TEMP_DIR"
mkdir -p "$TEMP_DIR/scripts"

echo "Creating critical files in $TEMP_DIR..."

# Create minimal-next-starter.js if it doesn't exist
if [ ! -f "$TEMP_DIR/minimal-next-starter.js" ]; then
  echo "Creating minimal-next-starter.js in $TEMP_DIR..."
  cat > "$TEMP_DIR/minimal-next-starter.js" << 'EOF'
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
  console.log(`Starting emergency server on port ${port}...`);
  const server = http.createServer(createBasicHandler());
  server.listen(port, () => {
    console.log(`Minimal server running at http://localhost:${port}`);
  });
}

// Main execution
async function main() {
  const port = parseInt(process.env.PORT, 10) || 3000;
  
  try {
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
EOF
  chmod +x "$TEMP_DIR/minimal-next-starter.js"
  echo "Created minimal-next-starter.js"
fi

# Create emergency-server.js if it doesn't exist
if [ ! -f "$TEMP_DIR/emergency-server.js" ]; then
  echo "Creating emergency-server.js in $TEMP_DIR..."
  cat > "$TEMP_DIR/emergency-server.js" << 'EOF'
#!/usr/bin/env node
/**
 * ThinkForward Emergency Server
 * 
 * This is a standalone emergency HTTP server that will serve the application
 * when all other startup methods fail. It provides basic diagnostic information.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Constants
const PORT = process.env.PORT || 3000;
const TEMP_DIR = '/home/site/temp';

console.log('=== ThinkForward Emergency Server ===');
console.log(`Starting at: ${new Date().toISOString()}`);
console.log(`Node version: ${process.version}`);
console.log(`OS: ${os.type()} ${os.release()}`);
console.log(`Current directory: ${process.cwd()}`);

// Create a simple server
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Set CORS headers to allow requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Main page - Show emergency UI
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ThinkForward - Emergency Mode</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 700px; margin: 0 auto; padding: 2rem; line-height: 1.5; }
          h1 { border-bottom: 1px solid #eee; padding-bottom: 1rem; color: #d32f2f; }
          .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin: 1rem 0; background: #f9f9f9; }
          .warning { background: #fff8e1; border-color: #ffecb3; }
          .error { background: #ffeef0; border-color: #ffcdd2; }
          .info { background: #e3f2fd; border-color: #bbdefb; }
          pre { background: #f5f5f5; padding: 15px; overflow-x: auto; border-radius: 4px; }
          #timer { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>ThinkForward - Emergency Mode</h1>
        <div class="card error">
          <h2>Application Startup Issue</h2>
          <p>The application is running in emergency mode because normal startup methods failed.</p>
          <p>This is a simplified emergency server to provide basic functionality.</p>
        </div>
        <div class="card info">
          <h3>Server Information</h3>
          <p>Node version: ${process.version}</p>
          <p>Server time: ${new Date().toISOString()}</p>
          <p>Working directory: ${process.cwd()}</p>
          <p>The page will refresh every 30 seconds to check if the main application has started.</p>
        </div>
        <script>setTimeout(() => { window.location.reload(); }, 30000);</script>
      </body>
    </html>
  `);
});

// Start the server
server.listen(PORT, () => {
  console.log(`Emergency server running at http://localhost:${PORT}`);
});
EOF
  chmod +x "$TEMP_DIR/emergency-server.js"
  echo "Created emergency-server.js"
fi

# Create comprehensive-nextjs-diagnostics.js if it doesn't exist
if [ ! -f "$TEMP_DIR/comprehensive-nextjs-diagnostics.js" ]; then
  echo "Creating comprehensive-nextjs-diagnostics.js in $TEMP_DIR..."
  cat > "$TEMP_DIR/comprehensive-nextjs-diagnostics.js" << 'EOF'
#!/usr/bin/env node
/**
 * Comprehensive Next.js Diagnostics for Azure App Service
 */

console.log("=== Next.js Azure App Service Diagnostics ===");
console.log("Running diagnostics at:", new Date().toISOString());

const fs = require('fs');
const path = require('path');
const os = require('os');

// Basic environment information
console.log("\n=== Environment Information ===");
console.log("Node version:", process.version);
console.log("OS:", os.type(), os.release());
console.log("Current directory:", process.cwd());
console.log("Hostname:", os.hostname());
console.log("Memory (free/total):", Math.round(os.freemem() / (1024 * 1024)), "MB /", Math.round(os.totalmem() / (1024 * 1024)), "MB");

// Detect Next.js version
try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log("Next.js version:", packageJson.dependencies?.next || "unknown");
  }
} catch (err) {
  console.error("Error reading package.json:", err.message);
}

// Check environment variables
console.log("\n=== Environment Variables ===");
const criticalVars = [
  'NODE_ENV', 'PORT', 'NEXT_TELEMETRY_DISABLED', 'NEXT_MANUAL_SIG_HANDLE',
  'NEXT_IGNORE_FILESYSTEM_CHECK', 'NEXT_TEMP_DIR', 'NEXT_DIST_DIR'
];

criticalVars.forEach(varName => {
  console.log(`${varName}:`, process.env[varName] || "not set");
});

// Check for critical directories and files
console.log("\n=== Critical Paths ===");
const criticalPaths = [
  '.next',
  '.next/BUILD_ID',
  '.next/server/pages-manifest.json',
  'node_modules/next',
  'node_modules/next/dist/server/next.js',
  'server.js',
  'scripts/minimal-next-starter.js',
  'scripts/emergency-server.js',
  '/home/site/temp',
  '/home/site/temp/minimal-next-starter.js'
];

criticalPaths.forEach(pathToCheck => {
  try {
    if (fs.existsSync(pathToCheck)) {
      const stats = fs.statSync(pathToCheck);
      console.log(`✓ ${pathToCheck} - ${stats.isDirectory() ? 'Directory' : 'File'} - ${stats.size} bytes`);
    } else {
      console.log(`✗ ${pathToCheck} - Not found`);
    }
  } catch (err) {
    console.log(`! ${pathToCheck} - Error: ${err.message}`);
  }
});

// Check for Next.js build ID
try {
  const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID');
  if (fs.existsSync(buildIdPath)) {
    const buildId = fs.readFileSync(buildIdPath, 'utf8').trim();
    console.log("\n=== Next.js Build Information ===");
    console.log("Build ID:", buildId);
  }
} catch (err) {
  console.error("Error reading BUILD_ID:", err.message);
}

console.log("\n=== Diagnostics completed ===");
EOF
  chmod +x "$TEMP_DIR/comprehensive-nextjs-diagnostics.js"
  echo "Created comprehensive-nextjs-diagnostics.js"
fi

# Create symlinks or copy files to ensure they're accessible from the standard locations
for file in minimal-next-starter.js emergency-server.js comprehensive-nextjs-diagnostics.js; do
  # Try to create a symlink first
  ln -sf "$TEMP_DIR/$file" "$TEMP_DIR/scripts/$file" 2>/dev/null || \
    cp "$TEMP_DIR/$file" "$TEMP_DIR/scripts/$file" 2>/dev/null || \
    echo "Failed to link or copy $file to scripts directory"
done

echo "=== Critical files creation complete ==="
ls -la "$TEMP_DIR" | grep -E "js$|sh$"
echo "=== Critical scripts in scripts directory ==="
ls -la "$TEMP_DIR/scripts" | grep -E "js$|sh$"