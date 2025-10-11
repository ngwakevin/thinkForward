#!/bin/bash

echo "=== ThinkForward Startup Script ==="
echo "Starting time: $(date)"

# Create temp directories in a location the app can write to
export NEXT_TEMP_DIR="/home/site/next-temp"
echo "Creating temp directory: $NEXT_TEMP_DIR"
mkdir -p "$NEXT_TEMP_DIR" || echo "ERROR: Could not create temp directory at $NEXT_TEMP_DIR"

export NEXT_CACHE_DIR="$NEXT_TEMP_DIR/cache"
echo "Creating cache directory: $NEXT_CACHE_DIR"
mkdir -p "$NEXT_CACHE_DIR" || echo "ERROR: Could not create cache directory at $NEXT_CACHE_DIR"

# Set environment variables for Next.js
export NEXT_DISABLE_FILESYSTEM_CACHE=1
export NEXT_TELEMETRY_DISABLED=1

# Clear any existing temp .next directory to avoid conflicts
if [ -d "$NEXT_TEMP_DIR/.next" ]; then
  echo "Cleaning existing temp .next directory"
  rm -rf "$NEXT_TEMP_DIR/.next"
fi

# Create fresh .next directory in the temp directory
mkdir -p "$NEXT_TEMP_DIR/.next"
echo "Created directory: $NEXT_TEMP_DIR/.next"

# Function to log directory contents
log_dir_contents() {
  local dir=$1
  echo "Contents of $dir:"
  ls -la "$dir" || echo "ERROR: Could not list directory contents"
}

# Locate the build files - try multiple locations
FOUND_BUILD=false

# Array of possible .next locations to check
NEXT_DIRS=(
  "./.next"
  "/home/site/wwwroot/.next"
  "/home/site/.next"
  "./standalone/.next"
  "/home/site/wwwroot/standalone/.next"
)

# Check each location
for dir in "${NEXT_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "Found .next directory at: $dir"
    log_dir_contents "$dir"
    
    # Check if this is a valid Next.js build (has build-manifest.json)
    if [ -f "$dir/build-manifest.json" ]; then
      echo "Valid Next.js build found at $dir (has build-manifest.json)"
      echo "Copying build files to $NEXT_TEMP_DIR/.next..."
      
      # Ensure we have a clean target directory
      rm -rf "$NEXT_TEMP_DIR/.next"
      mkdir -p "$NEXT_TEMP_DIR/.next"
      
      # Copy all files, preserving permissions
      cp -Rp "$dir/"* "$NEXT_TEMP_DIR/.next/" || {
        echo "ERROR: Failed to copy .next directory contents"
        log_dir_contents "$dir"
      }
      
      # Verify the copy succeeded
      if [ -f "$NEXT_TEMP_DIR/.next/build-manifest.json" ]; then
        echo "✅ Successfully copied Next.js build files"
        FOUND_BUILD=true
        break
      else
        echo "❌ Failed to copy build-manifest.json, build files may be incomplete"
      fi
    else
      echo "Directory $dir exists but does not appear to be a valid Next.js build (missing build-manifest.json)"
    fi
  fi
done

# If we couldn't find an existing build, try to create one
if [ "$FOUND_BUILD" = false ]; then
  echo "WARNING: Could not find valid Next.js build in any expected location"
  echo "Attempting to run next build..."
  
  # Check if next is available in node_modules
  if [ -f "./node_modules/.bin/next" ]; then
    echo "Found next command in node_modules, running build..."
    ./node_modules/.bin/next build || echo "ERROR: next build failed"
    
    # Check if build was created
    if [ -d "./.next" ] && [ -f "./.next/build-manifest.json" ]; then
      echo "Build succeeded, copying to temp directory..."
      cp -Rp ./.next/* "$NEXT_TEMP_DIR/.next/" || echo "ERROR: Failed to copy new build files"
      FOUND_BUILD=true
    else
      echo "Build appears to have failed, no valid .next directory found"
    fi
  else
    echo "next command not found in node_modules, cannot build"
  fi
fi

# Show final status of Next.js temp directory
echo "=== Next.js Build Status ==="
if [ "$FOUND_BUILD" = true ]; then
  echo "✅ Next.js build files ready in $NEXT_TEMP_DIR/.next"
else
  echo "❌ WARNING: Could not find or create a valid Next.js build"
  echo "The application may fail to start"
fi

# List contents of temp directory to verify
echo "Contents of $NEXT_TEMP_DIR/.next:"
ls -la "$NEXT_TEMP_DIR/.next" || echo "ERROR: Failed to list directory contents"

# Check for critical build files
for file in "build-manifest.json" "server/pages-manifest.json" "BUILD_ID"; do
  if [ -f "$NEXT_TEMP_DIR/.next/$file" ]; then
    echo "✅ Found critical file: $file"
  else
    echo "❌ Missing critical file: $file"
  fi
done

# Set permissions to ensure files are accessible
echo "Setting permissions on Next.js directories..."
chmod -R 755 "$NEXT_TEMP_DIR" || echo "WARNING: Could not set permissions on $NEXT_TEMP_DIR"

# Log system information
echo "=== System Information ==="
echo "Current directory: $(pwd)"
echo "Hostname: $(hostname)"
echo "Operating system: $(uname -a)"
echo "Disk space:"
df -h || echo "Could not check disk space"
echo "Available memory:"
free -m || echo "Could not check memory"

# Log environment variables (excluding sensitive ones)
echo "=== Environment Variables ==="
echo "NODE_ENV: $NODE_ENV"
echo "NODE_VERSION: $NODE_VERSION"
echo "WEBSITE_NODE_DEFAULT_VERSION: $WEBSITE_NODE_DEFAULT_VERSION"
echo "COSMOS_ENDPOINT is set: $(if [ -n "$COSMOS_ENDPOINT" ]; then echo "Yes (${#COSMOS_ENDPOINT} chars)"; else echo "No"; fi)"
echo "COSMOS_DB_ENDPOINT is set: $(if [ -n "$COSMOS_DB_ENDPOINT" ]; then echo "Yes (${#COSMOS_DB_ENDPOINT} chars)"; else echo "No"; fi)"
echo "COSMOS_KEY is set: $(if [ -n "$COSMOS_KEY" ]; then echo "Yes (${#COSMOS_KEY} chars)"; else echo "No"; fi)"
echo "COSMOS_DB_KEY is set: $(if [ -n "$COSMOS_DB_KEY" ]; then echo "Yes (${#COSMOS_DB_KEY} chars)"; else echo "No"; fi)"
echo "COSMOS_DATABASE is set: $(if [ -n "$COSMOS_DATABASE" ]; then echo "Yes ($COSMOS_DATABASE)"; else echo "No"; fi)"
echo "COSMOS_DB_DATABASE_ID is set: $(if [ -n "$COSMOS_DB_DATABASE_ID" ]; then echo "Yes ($COSMOS_DB_DATABASE_ID)"; else echo "No"; fi)"
echo "PORT is set: $(if [ -n "$PORT" ]; then echo "Yes ($PORT)"; else echo "No"; fi)"
echo "WEBSITE_SITE_NAME: $WEBSITE_SITE_NAME"

# Standardize environment variables
# If COSMOS_KEY is not set but COSMOS_DB_KEY is, copy the value
if [ -z "$COSMOS_KEY" ] && [ -n "$COSMOS_DB_KEY" ]; then
  echo "Setting COSMOS_KEY from COSMOS_DB_KEY"
  export COSMOS_KEY="$COSMOS_DB_KEY"
fi

# If COSMOS_ENDPOINT is not set but COSMOS_DB_ENDPOINT is, copy the value
if [ -z "$COSMOS_ENDPOINT" ] && [ -n "$COSMOS_DB_ENDPOINT" ]; then
  echo "Setting COSMOS_ENDPOINT from COSMOS_DB_ENDPOINT"
  export COSMOS_ENDPOINT="$COSMOS_DB_ENDPOINT"
fi

# If COSMOS_DATABASE is not set but COSMOS_DB_DATABASE_ID is, copy the value
if [ -z "$COSMOS_DATABASE" ] && [ -n "$COSMOS_DB_DATABASE_ID" ]; then
  echo "Setting COSMOS_DATABASE from COSMOS_DB_DATABASE_ID"
  export COSMOS_DATABASE="$COSMOS_DB_DATABASE_ID"
fi

# Tell the server where to find the Next.js build
echo "=== Starting Server ==="
echo "Setting NEXT_DIST_DIR to $NEXT_TEMP_DIR/.next"
export NEXT_DIST_DIR="$NEXT_TEMP_DIR/.next"

# Check if server.js exists
if [ ! -f "server.js" ]; then
  echo "❌ ERROR: server.js not found in current directory"
  echo "Files in current directory:"
  ls -la
  exit 1
fi

# Start the Node.js server
echo "Starting Node.js server with custom environment..."
echo "Server start time: $(date)"
exec node server.js
