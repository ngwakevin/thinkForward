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
fi

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
  
  // First, try to find the script in the scripts directory
  const minimalStarterPaths = [
    './scripts/minimal-next-starter.js',
    '/home/site/wwwroot/scripts/minimal-next-starter.js',
    './minimal-next-starter.js',
  ];
  
  let scriptPath = null;
  
  // Find the script
  for (const path of minimalStarterPaths) {
    try {
      require.resolve(path);
      scriptPath = path;
      console.log(`Found minimal starter at: ${path}`);
      break;
    } catch (e) {
      console.log(`Not found at ${path}`);
    }
  }
  
  // If we found the script, run it
  if (scriptPath) {
    require(scriptPath);
  } else {
    throw new Error('Could not locate minimal-next-starter.js');
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

# Use our minimal starter as the primary option
if [ -f "$TEMP_DIR/minimal-next-starter.js" ]; then
  echo "Starting Next.js using minimal starter from temp directory..."
  node $TEMP_DIR/minimal-next-starter.js
elif [ -f "scripts/minimal-next-starter.js" ]; then
  echo "Starting Next.js using minimal starter from scripts directory..."
  node scripts/minimal-next-starter.js
elif [ -f "$TEMP_DIR/next-direct-start.js" ]; then
  echo "Starting Next.js using direct start wrapper from temp directory..."
  node $TEMP_DIR/next-direct-start.js -p $PORT
elif [ -f "server.js" ]; then
  echo "Using custom server.js as fallback..."
  node server.js
else
  echo "Falling back to standard npx approach..."
  npx next start -p $PORT
fi
STARTUPSCRIPT

chmod +x startup.sh
echo "Created startup.sh script"