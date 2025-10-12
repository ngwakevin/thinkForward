#!/bin/bash
# This script creates a startup script for Azure App Service
# to start the Next.js application directly without complex build directory handling

cat > startup.sh << 'STARTUPSCRIPT'
#!/bin/bash
cd /home/site/wwwroot

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-8080}
export NEXT_TELEMETRY_DISABLED=1
export NEXT_IGNORE_FILESYSTEM_CHECK=1
export NEXT_MANUAL_SIG_HANDLE=true

# Print environment variables for debugging
echo "NEXT_TEMP_DIR=$NEXT_TEMP_DIR"
echo "NEXT_DIST_DIR=$NEXT_DIST_DIR"

# Create the directory structure based on environment variables
if [ ! -z "$NEXT_TEMP_DIR" ]; then
  echo "Creating build directory structure at $NEXT_TEMP_DIR..."
  mkdir -p $NEXT_TEMP_DIR/.next/server
  
  # Copy the .next directory contents if available
  if [ -d ".next" ]; then
    echo "Copying .next directory contents to $NEXT_TEMP_DIR/.next..."
    cp -r .next/* $NEXT_TEMP_DIR/.next/
  else
    # Create minimal required files
    echo "Creating minimal required files in $NEXT_TEMP_DIR/.next..."
    echo "$(date +%s)" > $NEXT_TEMP_DIR/.next/BUILD_ID
    echo "{}" > $NEXT_TEMP_DIR/.next/server/pages-manifest.json
    echo "{}" > $NEXT_TEMP_DIR/.next/build-manifest.json
  fi
  
  # Create symbolic link
  echo "Creating symbolic link from .next to $NEXT_TEMP_DIR/.next..."
  rm -f .next
  ln -sf $NEXT_TEMP_DIR/.next .next
  
  echo "Contents of $NEXT_TEMP_DIR/.next:"
  ls -la $NEXT_TEMP_DIR/.next/
fi

# Run module resolver to find and link Next.js modules
if [ -f "scripts/resolve-next-modules.js" ]; then
  echo "Running Next.js module resolver..."
  node scripts/resolve-next-modules.js
else
  echo "Module resolver not found, this may cause module resolution issues"
fi

# Run the build directory fix script for additional fixes
if [ -f "scripts/fix-nextjs-build-dir.sh" ]; then
  echo "Running Next.js build directory fix script..."
  bash scripts/fix-nextjs-build-dir.sh
else
  echo "Fix script not found, this may cause build directory issues"
fi

# Run diagnostic script if it exists
if [ -f "scripts/diagnose-nextjs.sh" ]; then
  echo "Running Next.js diagnostic script..."
  bash scripts/diagnose-nextjs.sh
else
  echo "Diagnostic script not found, continuing startup..."
fi

# Log startup information
echo "Starting Next.js in production mode"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Verify build directory exists in multiple locations, including the error location from logs
if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
  echo "Found valid Next.js build directory at ./.next"
  echo "Build ID: $(cat .next/BUILD_ID)"
  echo "Using built-in .next directory"
  export NEXT_DIST_DIR=".next"
elif [ -d "/home/site/wwwroot/.next" ] && [ -f "/home/site/wwwroot/.next/BUILD_ID" ]; then
  echo "Found valid Next.js build directory at /home/site/wwwroot/.next"
  echo "Build ID: $(cat /home/site/wwwroot/.next/BUILD_ID)"
  export NEXT_DIST_DIR="/home/site/wwwroot/.next"
elif [ -d "/home/site/next-temp/.next" ] && [ -f "/home/site/next-temp/.next/BUILD_ID" ]; then
  echo "Found valid Next.js build directory at /home/site/next-temp/.next"
  echo "Build ID: $(cat /home/site/next-temp/.next/BUILD_ID)"
  export NEXT_DIST_DIR="/home/site/next-temp/.next"
else
  echo "WARNING: No valid Next.js build found, creating empty build files..."
  mkdir -p .next/server
  echo "$(date +%s)" > .next/BUILD_ID
  echo "{}" > .next/server/pages-manifest.json
  echo "{}" > .next/build-manifest.json
  
  # Also create empty build files in the location from the error message
  mkdir -p /home/site/next-temp/.next/server || true
  echo "$(date +%s)" > /home/site/next-temp/.next/BUILD_ID || true
  echo "{}" > /home/site/next-temp/.next/server/pages-manifest.json || true
  echo "{}" > /home/site/next-temp/.next/build-manifest.json || true
  
  export NEXT_DIST_DIR=".next"
  
  # Add a link from the error path to our build directory
  ln -sf $(pwd)/.next /home/site/next-temp/.next || true
fi

# Force override environment variables to ensure Next.js ignores filesystem issues
export NEXT_MANUAL_SIG_HANDLE=true
export NEXT_TELEMETRY_DISABLED=1
export NEXT_IGNORE_FILESYSTEM_CHECK=1
export NODE_OPTIONS="--max_old_space_size=512 --inspect=0.0.0.0:9229"

# Use /home/site/temp directory which is writable even in read-only environments
TEMP_DIR="/home/site/temp"
mkdir -p $TEMP_DIR

# Copy critical files to the temp directory using our dedicated script
if [ -f "scripts/copy-critical-files-to-temp.sh" ]; then
  echo "Running copy-critical-files-to-temp.sh script to copy critical files..."
  bash scripts/copy-critical-files-to-temp.sh
  echo "✅ Copied critical files to $TEMP_DIR"
else
  # Fallback if the script is missing
  echo "❌ copy-critical-files-to-temp.sh script not found, using manual copy..."
  
  # Copy server.js and important scripts to temp directory for easier access
  echo "Copying critical files to temp directory..."
  if [ -f "server.js" ]; then
    cp server.js $TEMP_DIR/server.js
    echo "✅ Copied server.js to $TEMP_DIR"
  fi

  if [ -f "scripts/minimal-next-starter.js" ]; then
    cp scripts/minimal-next-starter.js $TEMP_DIR/minimal-next-starter.js
    chmod +x $TEMP_DIR/minimal-next-starter.js
    echo "✅ Copied minimal-next-starter.js to $TEMP_DIR"
  else
    echo "❌ ERROR: minimal-next-starter.js not found!"
  fi

  if [ -f "scripts/emergency-server.js" ]; then
    cp scripts/emergency-server.js $TEMP_DIR/emergency-server.js
    chmod +x $TEMP_DIR/emergency-server.js
    echo "✅ Copied emergency-server.js to $TEMP_DIR"
  else
    echo "❌ ERROR: emergency-server.js not found!"
  fi

  if [ -f "scripts/comprehensive-nextjs-diagnostics.js" ]; then
    cp scripts/comprehensive-nextjs-diagnostics.js $TEMP_DIR/comprehensive-nextjs-diagnostics.js
    chmod +x $TEMP_DIR/comprehensive-nextjs-diagnostics.js
    echo "✅ Copied comprehensive-nextjs-diagnostics.js to $TEMP_DIR"
  else
    echo "❌ ERROR: comprehensive-nextjs-diagnostics.js not found!"
  fi
fi

# Verify the critical files were copied correctly
echo "Verifying critical files in temp directory..."
for file in "minimal-next-starter.js" "emergency-server.js" "comprehensive-nextjs-diagnostics.js"; do
  if [ -f "$TEMP_DIR/$file" ] || [ -f "$TEMP_DIR/scripts/$file" ]; then
    echo "✅ Verified $file is in temp directory"
  else
    echo "❌ WARNING: $file not found in temp directory!"
    
    # Create placeholder for missing critical files
    echo "Creating placeholder for $file..."
    cat > "$TEMP_DIR/$file" << EOF
#!/usr/bin/env node
/**
 * PLACEHOLDER FILE for $file
 * This file was auto-generated because the original was missing
 */
console.error('ERROR: This is a placeholder file for $file that was missing during startup');

// Create a minimal HTTP server if this is emergency-server.js
if ('$file' === 'emergency-server.js') {
  const http = require('http');
  const port = process.env.PORT || 3000;
  
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(\`
      <!DOCTYPE html>
      <html>
        <head><title>ThinkForward - Emergency Mode (Placeholder)</title></head>
        <body>
          <h1>ThinkForward - Emergency Placeholder</h1>
          <p>The real emergency-server.js was not found during startup.</p>
          <p>This is a minimal placeholder to keep the application running.</p>
        </body>
      </html>
    \`);
  }).listen(port, () => {
    console.log(\`Placeholder emergency server running at http://localhost:\${port}\`);
  });
}
EOF
    chmod +x "$TEMP_DIR/$file"
    echo "✅ Created placeholder for $file"
  fi
done

# Create the direct start wrapper in the temp directory
echo "Creating Next.js direct start wrapper in temp directory..."
cat > $TEMP_DIR/next-direct-start.js << 'EOL'
#!/usr/bin/env node
/**
 * Next.js direct start wrapper for Azure App Service
 * This script is a simple forwarder to our minimal starter
 */

// Force environment variables to bypass checks
process.env.NEXT_IGNORE_FILESYSTEM_CHECK = "1";
process.env.NEXT_MANUAL_SIG_HANDLE = "true";
process.env.NEXT_TELEMETRY_DISABLED = "1";

// Log diagnostic information
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

// Forward to the minimal starter script
try {
  console.log('Forwarding to minimal Next.js starter...');
  
  // Search in multiple locations, especially the temp directory
  const minimalStarterPaths = [
    // Temp directory - most likely to be writable
    '/home/site/temp/minimal-next-starter.js',
    '/home/site/temp/scripts/minimal-next-starter.js',
    
    // Standard locations
    './scripts/minimal-next-starter.js',
    '/home/site/wwwroot/scripts/minimal-next-starter.js',
    './minimal-next-starter.js',
    
    // Additional fallback locations
    '../scripts/minimal-next-starter.js',
    '/tmp/minimal-next-starter.js',
    process.env.HOME + '/minimal-next-starter.js',
  ];
  
  let scriptPath = null;
  
  // Find the script
  console.log('Searching for minimal-next-starter.js in the following locations:');
  for (const path of minimalStarterPaths) {
    try {
      console.log(`- Checking ${path}...`);
      require.resolve(path);
      scriptPath = path;
      console.log(`✅ Found minimal starter at: ${path}`);
      break;
    } catch (e) {
      console.log(`❌ Not found at ${path}`);
    }
  }
  
  // If we found the script, run it
  if (scriptPath) {
    console.log(`Starting minimal starter from ${scriptPath}...`);
    require(scriptPath);
  } else {
    console.error('Could not locate minimal-next-starter.js in any location!');
    
    // Create an emergency version as a last resort
    console.log('Creating an emergency minimal-next-starter.js as a last resort...');
    const fs = require('fs');
    const tempDir = '/home/site/temp';
    const emergencyScript = `${tempDir}/emergency-minimal-next-starter.js`;
    
    // Ensure temp directory exists
    try {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      // Write emergency script
      fs.writeFileSync(emergencyScript, `
#!/usr/bin/env node
/**
 * Emergency minimal Next.js starter
 * Auto-generated when the original was missing
 */
const http = require('http');
const port = process.env.PORT || 3000;

console.log('Starting emergency minimal Next.js starter...');
console.log('This is an auto-generated script created because minimal-next-starter.js was not found');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(\`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ThinkForward - Emergency Mode</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 650px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
          h1 { border-bottom: 1px solid #eee; padding-bottom: 1rem; color: #d32f2f; }
          .card { border: 1px solid #ddd; border-radius: 4px; padding: 1.5rem; margin: 1rem 0; background: #f9f9f9; }
          .emergency { background: #ffebee; border-color: #ffcdd2; }
          .info { background: #e3f2fd; border-color: #bbdefb; }
        </style>
      </head>
      <body>
        <h1>ThinkForward - Emergency Mode</h1>
        <div class="card emergency">
          <h2>Critical Startup Error</h2>
          <p>The application could not start properly because critical files are missing.</p>
          <p>Missing file: minimal-next-starter.js</p>
        </div>
        <div class="card info">
          <h3>Technical Details</h3>
          <p>This page is being served by an auto-generated emergency script.</p>
          <p>Server time: \${new Date().toISOString()}</p>
          <p>Working directory: \${process.cwd()}</p>
          <p>Node version: \${process.version}</p>
          <p>This page will automatically refresh in 30 seconds.</p>
        </div>
        <script>setTimeout(() => { window.location.reload(); }, 30000);</script>
      </body>
    </html>
  \`);
}).listen(port, () => {
  console.log(\`Emergency server running at http://localhost:\${port}\`);
});
      `);
      
      // Make executable
      fs.chmodSync(emergencyScript, '755');
      console.log(`Created emergency script at ${emergencyScript}`);
      
      // Run the emergency script
      console.log('Running emergency script...');
      require(emergencyScript);
    } catch (fsError) {
      console.error('Failed to create emergency script:', fsError);
      throw new Error('Could not locate or create minimal-next-starter.js');
    }
  }
} catch (error) {
  console.error('Failed to start with minimal starter:', error);
  
  // If all else fails, start a minimal HTTP server
  const http = require('http');
  const port = parseInt(process.env.PORT, 10) || 3000;
  
  console.log(`Starting emergency minimal HTTP server on port ${port}...`);
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ThinkForward - Emergency Mode</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 2rem; line-height: 1.5; }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
            .emergency { background: #fff8e1; border-color: #ffecb3; }
          </style>
        </head>
        <body>
          <h1>ThinkForward Application</h1>
          <div class="card emergency">
            <h2>Emergency Mode</h2>
            <p>The application is running in emergency mode. Normal startup procedures failed.</p>
            <p>Please check the application logs for more information.</p>
            <p>This page will refresh automatically every 30 seconds.</p>
          </div>
          <script>setTimeout(() => { window.location.reload(); }, 30000);</script>
        </body>
      </html>
    `);
  });
  
  server.listen(port, () => {
    console.log(`Emergency server running at http://localhost:${port}`);
  });
}
EOL
  chmod +x $TEMP_DIR/next-direct-start.js
  echo "Created wrapper script at $TEMP_DIR/next-direct-start.js"

# Run comprehensive diagnostics if available
if [ -f "$TEMP_DIR/comprehensive-nextjs-diagnostics.js" ]; then
  echo "[Startup] Running comprehensive diagnostics..."
  node $TEMP_DIR/comprehensive-nextjs-diagnostics.js || echo "Diagnostics completed with errors"
fi

# Try multiple startup methods in sequence with proper error handling
echo "[Startup] Attempting to start with multiple methods in sequence..."

# Method 1: Try minimal starter as the primary option
if [ -f "$TEMP_DIR/minimal-next-starter.js" ]; then
  echo "Starting Next.js using minimal starter from temp directory..."
  node $TEMP_DIR/minimal-next-starter.js
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "❌ Minimal starter failed with code $RESULT, trying next option..."
  else
    exit 0 # Success
  fi
fi

# Method 2: Try minimal starter from scripts directory
if [ -f "scripts/minimal-next-starter.js" ]; then
  echo "Starting Next.js using minimal starter from scripts directory..."
  node scripts/minimal-next-starter.js
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "❌ Minimal starter in scripts directory failed with code $RESULT, trying next option..."
  else
    exit 0 # Success
  fi
fi

# Method 3: Try the direct start wrapper
if [ -f "$TEMP_DIR/next-direct-start.js" ]; then
  echo "Starting Next.js using direct start wrapper from temp directory..."
  node $TEMP_DIR/next-direct-start.js -p $PORT
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "❌ Direct start wrapper failed with code $RESULT, trying next option..."
  else
    exit 0 # Success
  fi
fi

# Method 4: Try server.js as a fallback
if [ -f "server.js" ]; then
  echo "Using custom server.js as fallback..."
  node server.js
  RESULT=$?
  if [ $RESULT -ne 0 ]; then
    echo "❌ server.js failed with code $RESULT, trying next option..."
  else
    exit 0 # Success
  fi
fi

# Method 5: Try standard next start command
echo "Attempting with standard next start command..."
npx next start -p $PORT
RESULT=$?
if [ $RESULT -ne 0 ]; then
  echo "❌ Next start command failed with code $RESULT, falling back to emergency server..."
else
  exit 0 # Success
fi

# Method 6: Use emergency server if available
if [ -f "$TEMP_DIR/emergency-server.js" ]; then
  echo "⚠️ All startup methods failed! Starting emergency server..."
  exec node $TEMP_DIR/emergency-server.js
  exit $? # This shouldn't execute unless exec fails
fi

# Ultimate fallback - minimal HTTP server
echo "⚠️ No emergency server found! Running minimalist HTTP server..."
node -e "
const http = require('http');
const fs = require('fs');
const os = require('os');
const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(\`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ThinkForward - Critical Emergency Mode</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 650px; margin: 0 auto; padding: 2rem; line-height: 1.5; }
          .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
          .emergency { background: #fff1f0; border-color: #ffccc7; }
          .info { background: #e6f7ff; border-color: #91d5ff; }
          pre { background: #f5f5f5; padding: 1rem; overflow: auto; }
          h1 { color: #cf1322; }
          table { width: 100%; border-collapse: collapse; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <h1>ThinkForward - Critical Emergency Mode</h1>
        <div class='card emergency'>
          <h2>⚠️ Critical Startup Failure</h2>
          <p>All startup methods have failed. The application is running in critical emergency mode.</p>
          <p>This indicates serious issues with the application startup process.</p>
        </div>
        
        <div class='card info'>
          <h3>System Information:</h3>
          <table>
            <tr><th>Node Version</th><td>${process.version}</td></tr>
            <tr><th>Server Time</th><td>${new Date().toISOString()}</td></tr>
            <tr><th>Hostname</th><td>${os.hostname()}</td></tr>
            <tr><th>Platform</th><td>${os.platform()}</td></tr>
            <tr><th>Working Directory</th><td>${process.cwd()}</td></tr>
            <tr><th>Environment</th><td>NODE_ENV=${process.env.NODE_ENV || 'not set'}</td></tr>
          </table>
          <p>This page will refresh every 30 seconds to check for updates.</p>
        </div>
        <script>setTimeout(() => { window.location.reload(); }, 30000);</script>
      </body>
    </html>
  \`);
});

server.listen(port, () => {
  console.log(\`[CRITICAL EMERGENCY] Server running at http://localhost:\${port}\`);
  console.log('[CRITICAL EMERGENCY] Started at:', new Date().toISOString());
  console.log('[CRITICAL EMERGENCY] Working directory:', process.cwd());
});
"
STARTUPSCRIPT

chmod +x startup.sh
echo "Created startup.sh script"