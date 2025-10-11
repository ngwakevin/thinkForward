#!/bin/bash
# azure-startup.sh - A simplified startup script for Azure App Service

echo "=== ThinkForward Azure App Service Startup Script ==="
echo "Starting at: $(date)"

# Set NODE_ENV to production if not already set
if [ -z "$NODE_ENV" ]; then
  export NODE_ENV="production"
  echo "Set NODE_ENV to production"
fi

# Create necessary directory structure
echo "Creating directory structure..."
NEXT_DIR="/home/site/next-temp/.next"
mkdir -p "$NEXT_DIR"

echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Look for build files in the expected locations
echo "Checking for Next.js build in expected locations..."

# Check if .next exists in current directory
if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
  echo "Found .next directory in current directory with BUILD_ID"
  echo "Copying to $NEXT_DIR..."
  cp -R .next/* "$NEXT_DIR/"
  echo "✅ Copied .next to temp directory"
elif [ -d "/home/site/wwwroot/.next" ] && [ -f "/home/site/wwwroot/.next/BUILD_ID" ]; then
  echo "Found .next directory in /home/site/wwwroot with BUILD_ID"
  echo "Copying to $NEXT_DIR..."
  cp -R /home/site/wwwroot/.next/* "$NEXT_DIR/"
  echo "✅ Copied .next to temp directory"
else
  # If standalone mode, check for standalone directory
  if [ -d ".next/standalone" ]; then
    echo "Found .next/standalone directory"
    echo "This looks like a Next.js standalone build"
    
    # Copy standalone files
    cp -R .next/standalone/* .
    mkdir -p .next/static
    cp -R .next/static .next/
    echo "✅ Copied standalone files"
    
    # Also copy build files to temp directory
    cp -R .next/* "$NEXT_DIR/"
    echo "✅ Copied .next to temp directory"
  elif [ -d "/home/site/wwwroot/.next/standalone" ]; then
    echo "Found .next/standalone in /home/site/wwwroot"
    
    # Copy standalone files
    cp -R /home/site/wwwroot/.next/standalone/* .
    mkdir -p .next/static
    cp -R /home/site/wwwroot/.next/static .next/
    echo "✅ Copied standalone files"
    
    # Also copy build files to temp directory
    cp -R /home/site/wwwroot/.next/* "$NEXT_DIR/"
    echo "✅ Copied .next to temp directory"
  else
    echo "❌ No Next.js build files found!"
    echo "Looking more broadly for .next directory..."
    
    # Search more broadly
    NEXT_DIRS=$(find /home -name ".next" -type d 2>/dev/null)
    if [ -n "$NEXT_DIRS" ]; then
      echo "Found these .next directories:"
      echo "$NEXT_DIRS"
      
      # Try the first one found
      FIRST_DIR=$(echo "$NEXT_DIRS" | head -n 1)
      if [ -f "$FIRST_DIR/BUILD_ID" ]; then
        echo "Using $FIRST_DIR as it has a BUILD_ID file"
        cp -R "$FIRST_DIR/"* "$NEXT_DIR/"
        echo "✅ Copied $FIRST_DIR to temp directory"
      else
        echo "❌ Found .next directories but none have BUILD_ID file"
      fi
    else
      echo "❌ No .next directories found in /home"
    fi
  fi
fi

# Check if we now have a BUILD_ID file
if [ -f "$NEXT_DIR/BUILD_ID" ]; then
  echo "✅ BUILD_ID file exists in $NEXT_DIR"
  echo "Build ID: $(cat "$NEXT_DIR/BUILD_ID")"
else
  echo "❌ No BUILD_ID file found in $NEXT_DIR"
  echo "Let's create a basic Next.js build structure"
  
  # Create minimal structure needed
  echo "Creating minimal Next.js build structure..."
  echo "next-build-id" > "$NEXT_DIR/BUILD_ID"
  echo "{}" > "$NEXT_DIR/build-manifest.json"
  mkdir -p "$NEXT_DIR/server"
  echo "{}" > "$NEXT_DIR/server/pages-manifest.json"
  
  echo "Created basic Next.js build structure in $NEXT_DIR"
fi

# Set environment variables for Next.js
export NEXT_DIST_DIR="$NEXT_DIR"
export NEXT_RUNTIME="nodejs"
echo "Set NEXT_DIST_DIR=$NEXT_DIST_DIR"

# Ensure permissions are set correctly
chmod -R 755 "/home/site/next-temp"
echo "Set permissions on /home/site/next-temp"

# Display environment for debugging
echo "=== Environment Variables ==="
echo "NODE_ENV: $NODE_ENV"
echo "NEXT_DIST_DIR: $NEXT_DIST_DIR"
echo "WEBSITE_SITE_NAME: $WEBSITE_SITE_NAME"

# Start the application
echo "=== Starting Node.js Server ==="
echo "Start time: $(date)"
exec node server.js