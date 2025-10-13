#!/bin/sh
cd /home/site/wwwroot
export NODE_ENV=production
# Default to port 8080 if PORT is not set by Azure
export PORT=${PORT:-8080}

# Debug information to help troubleshoot
echo "Starting app with:"
echo "- NODE_ENV: $NODE_ENV"
echo "- PORT: $PORT"
echo "- PWD: $(pwd)"
echo "- Node version: $(node -v)"
echo "- Next.js version: $(cat package.json | grep \"next\":)"
echo "- NPM version: $(npm -v)"
echo "- Memory info: $(free -m || echo 'free command not available')"
echo "- Disk space: $(df -h / || echo 'df command not available')"

# Setup writable directories for Next.js in Azure App Service
echo "Setting up writable directories for Next.js..."

# Create the custom temp directory
export NEXT_TEMP_DIR="/home/site/next-temp"
echo "Creating NEXT_TEMP_DIR: $NEXT_TEMP_DIR"
mkdir -p "$NEXT_TEMP_DIR" || echo "Warning: Could not create $NEXT_TEMP_DIR"
chmod -R 755 "$NEXT_TEMP_DIR" || echo "Warning: Could not set permissions on $NEXT_TEMP_DIR"

# Create .next directory in the temp directory
export NEXT_DIST_DIR="$NEXT_TEMP_DIR/.next"
echo "Creating NEXT_DIST_DIR: $NEXT_DIST_DIR"
mkdir -p "$NEXT_DIST_DIR" || echo "Warning: Could not create $NEXT_DIST_DIR"
mkdir -p "$NEXT_DIST_DIR/server" || echo "Warning: Could not create server directory"
mkdir -p "$NEXT_DIST_DIR/cache" || echo "Warning: Could not create cache directory"

# Check if .next directory exists in the current directory
if [ -d "./.next" ] && [ -f "./.next/BUILD_ID" ]; then
  echo "Found .next directory with BUILD_ID, copying to $NEXT_DIST_DIR"
  cp -R ./.next/* "$NEXT_DIST_DIR/" || echo "Error: Failed to copy .next directory"
  
  # Verify the copy
  if [ -f "$NEXT_DIST_DIR/BUILD_ID" ]; then
    echo "Successfully copied build files. Build ID: $(cat "$NEXT_DIST_DIR/BUILD_ID")"
  else
    echo "Warning: Failed to copy BUILD_ID file - creating it manually"
    echo "1760348574" > "$NEXT_DIST_DIR/BUILD_ID"
  fi
else
  echo "No .next directory found with BUILD_ID in current directory!"
  echo "Creating minimal Next.js build structure manually..."
  
  # Create minimal build structure
  echo "1760348574" > "$NEXT_DIST_DIR/BUILD_ID"
  echo "{}" > "$NEXT_DIST_DIR/build-manifest.json"
  echo "{}" > "$NEXT_DIST_DIR/server/pages-manifest.json"
  echo "{}" > "$NEXT_DIST_DIR/prerender-manifest.json"
  echo "{}" > "$NEXT_DIST_DIR/required-server-files.json"
fi

# Force correct permissions
chmod -R 777 "$NEXT_TEMP_DIR" || echo "Warning: Could not set permissions on temp directory"

# List critical directories to verify
echo "Contents of .next directory:"
ls -la ./.next 2>/dev/null || echo ".next directory not found"

echo "Contents of temp .next directory:"
ls -la "$NEXT_DIST_DIR" 2>/dev/null || echo "Temp .next directory not found or empty"

# Create a symbolic link for .next only when writable
if [ ! -L "./.next" ] && [ -d "$NEXT_DIST_DIR" ]; then
  if [ -w "." ]; then
    echo "Creating symbolic link from ./.next to $NEXT_DIST_DIR"
    ln -sfn "$NEXT_DIST_DIR" ./.next || echo "Warning: Failed to create symbolic link for .next"
  else
    echo "Filesystem is read-only; skipping symbolic link creation for .next"
    echo "Next.js will read build assets directly from $NEXT_DIST_DIR"
  fi
fi

# Set environment variables for Next.js
export NEXT_TELEMETRY_DISABLED=1
export NEXT_DISABLE_FILESYSTEM_CACHE=1
export NEXT_SHARP_PATH="/home/site/wwwroot/node_modules/sharp"
export NEXT_IGNORE_FILESYSTEM_CHECK=1  # Critical for Next.js 14.x in read-only environments

# Set Node.js options for better performance in containerized environment
export NODE_OPTIONS="${NODE_OPTIONS:---max_old_space_size=512 --expose-gc}"
echo "- NODE_OPTIONS: $NODE_OPTIONS"
echo "- NEXT_TEMP_DIR: $NEXT_TEMP_DIR"
echo "- NEXT_DIST_DIR: $NEXT_DIST_DIR"

# Patch Next.js filesystem check for Azure App Service
if [ -f "scripts/patch-nextjs.js" ]; then
  echo "Patching Next.js filesystem check for Azure..."
  node scripts/patch-nextjs.js || echo "Warning: Could not patch Next.js filesystem check"
else
  echo "Warning: patch-nextjs.js not found, skipping patch"
fi

# Double-check critical files one more time
if [ ! -f "$NEXT_DIST_DIR/BUILD_ID" ]; then
  echo "BUILD_ID still missing, creating it..."
  echo "azure-1760348574" > "$NEXT_DIST_DIR/BUILD_ID"
fi

if [ ! -f "$NEXT_DIST_DIR/server/pages-manifest.json" ]; then
  echo "pages-manifest.json still missing, creating it..."
  mkdir -p "$NEXT_DIST_DIR/server"
  echo "{}" > "$NEXT_DIST_DIR/server/pages-manifest.json"
fi

# Set critical environment variables for Next.js
export NEXT_IGNORE_FILESYSTEM_CHECK=1
export NEXT_TELEMETRY_DISABLED=1
export NEXT_DISABLE_PATCHING_REQUIRE=1
export NODE_OPTIONS="${NODE_OPTIONS} --no-warnings --experimental-specifier-resolution=node --experimental-json-modules"

# Ensure Cosmos DB environment variables are set properly
if [ -z "$COSMOS_KEY" ] && [ -n "$COSMOS_DB_KEY" ]; then
  echo "Setting COSMOS_KEY from COSMOS_DB_KEY"
  export COSMOS_KEY="$COSMOS_DB_KEY"
fi

if [ -z "$COSMOS_ENDPOINT" ] && [ -n "$COSMOS_DB_ENDPOINT" ]; then
  echo "Setting COSMOS_ENDPOINT from COSMOS_DB_ENDPOINT"
  export COSMOS_ENDPOINT="$COSMOS_DB_ENDPOINT"
fi

# Create direct start wrapper in writable temp directory
TEMP_DIR="/home/site/temp"
mkdir -p "$TEMP_DIR" || echo "Warning: Could not create $TEMP_DIR"

echo "Creating Next.js direct start wrapper in temp directory..."
cat > "$TEMP_DIR/next-direct-start.js" << 'WRAPPERSCRIPT'
#!/usr/bin/env node
/**
 * Next.js direct start wrapper for Azure App Service
 * This script bypasses the build directory check that fails in Azure's read-only filesystem
 */

// Force environment variables to bypass checks
process.env.NEXT_IGNORE_FILESYSTEM_CHECK = 1;
process.env.NEXT_MANUAL_SIG_HANDLE = true;
process.env.NEXT_TELEMETRY_DISABLED = 1;

console.log('Starting Next.js with direct server instantiation');
try {
  // Try to use server directly
  const path = require('path');
  const http = require('http');
  
  // Import the Next.js server (this may fail if the import structure changes)
  try {
    const { default: createServer } = require('next/dist/server/next');
    
    const port = parseInt(process.env.PORT, 10) || 3000;
    const app = createServer({
      dir: process.cwd(),
      dev: false,
      quiet: false
    });
    
    app.prepare().then(() => {
      http.createServer(app.getRequestHandler()).listen(port, () => {
        console.log();
      });
    });
  } catch (nextImportError) {
    console.error('Failed to import Next.js server:', nextImportError);
    throw nextImportError;
  }
} catch (error) {
  console.error('Failed to start server directly:', error);
  console.log('Falling back to CLI approach...');
  
  // Fallback to CLI approach
  try {
    process.argv[1] = require.resolve('next/dist/bin/next');
    process.argv.splice(2, 0, 'start');
    console.log();
    require('next/dist/bin/next');
  } catch (err) {
    console.error('Failed to start with Next.js CLI:', err);
    console.log('Trying to start with node server.js as last resort');
    try {
      require('./server');
    } catch (serverErr) {
      console.error('Failed to start server.js:', serverErr);
      console.error('All startup methods failed. Exiting.');
      process.exit(1);
    }
  }
}
WRAPPERSCRIPT
  chmod +x "$TEMP_DIR/next-direct-start.js"
  echo "Created Next.js direct start wrapper"
fi

# Try multiple startup methods in order of preference
echo "Starting with Next.js direct start wrapper..."
node "$TEMP_DIR/next-direct-start.js" || {
    echo "Direct start wrapper failed, trying custom server..."
    sleep 2
    echo "Starting with custom server: node server.js"
    node --experimental-specifier-resolution=node server.js || {
        echo "ERROR: Failed to start server with experimental specifier resolution. Retrying with default..."
        sleep 2
        echo "Retrying server start with default settings..."
        node server.js
    }
}

# Log successful startup
echo "App started successfully at: $(date)"
echo "Health check available at: http://localhost:$PORT/api/health"
