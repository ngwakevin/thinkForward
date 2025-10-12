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

# Make sure scripts directory exists
mkdir -p scripts

# Create the direct start wrapper if it doesn't exist
if [ ! -f "next-direct-start.js" ]; then
  echo "Creating Next.js direct start wrapper directly in current directory..."
  # Create the script inline instead of using a separate generator
  cat > next-direct-start.js << 'EOL'
#!/usr/bin/env node
/**
 * Next.js direct start wrapper for Azure App Service
 * This script bypasses the build directory check that fails in Azure's read-only filesystem
 */

// Force environment variables to bypass checks
process.env.NEXT_IGNORE_FILESYSTEM_CHECK = "1";
process.env.NEXT_MANUAL_SIG_HANDLE = "true";
process.env.NEXT_TELEMETRY_DISABLED = "1";

console.log('Starting Next.js with direct server instantiation');
try {
  // Try to use server directly
  const path = require('path');
  const http = require('http');
  
  // Import the Next.js server (this may fail if the import structure changes)
  const { default: createServer } = require('next/dist/server/next');
  
  const port = parseInt(process.env.PORT, 10) || 3000;
  const app = createServer({
    dir: process.cwd(),
    dev: false,
    quiet: false
  });
  
  app.prepare().then(() => {
    http.createServer(app.getRequestHandler()).listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  });
} catch (error) {
  console.error('Failed to start server directly:', error);
  console.log('Falling back to CLI approach...');
  
  // Fallback to CLI approach
  process.argv[1] = require.resolve('next/dist/bin/next');
  process.argv.splice(2, 0, 'start');
  console.log(`Starting Next.js with fallback CLI command: next ${process.argv.slice(2).join(' ')}`);
  try {
    require('next/dist/bin/next');
  } catch (err) {
    console.error('Failed to start with Next.js CLI:', err);
    console.log('Trying to start with node server.js as last resort');
    require('../server');
  }
}
EOL
  chmod +x next-direct-start.js
elif [ -f "scripts/create-nextjs-wrapper.js" ]; then
  echo "Creating Next.js direct start wrapper using generator script..."
  node scripts/create-nextjs-wrapper.js || echo "Failed to run create-nextjs-wrapper.js"
fi

# Use the direct start wrapper if available
if [ -f "next-direct-start.js" ]; then
  echo "Starting Next.js using direct start wrapper..."
  node next-direct-start.js -p $PORT
elif [ -f "scripts/next-direct-start.js" ]; then
  echo "Starting Next.js using direct start wrapper from scripts directory..."
  node scripts/next-direct-start.js -p $PORT
else
  echo "Falling back to standard npx approach..."
  npx next start -p $PORT
fi
STARTUPSCRIPT

chmod +x startup.sh
echo "Created startup.sh script"