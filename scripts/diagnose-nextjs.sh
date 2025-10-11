#!/bin/bash
# This script helps diagnose Next.js build directory issues in Azure App Service

# Log environment information
echo "======= Azure App Service Next.js Build Directory Diagnostic ======="
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "Next.js version from package.json: $(cat package.json | grep '"next":')"
echo "Time and date: $(date)"
echo "Hostname: $(hostname)"

# Check for environment variables
echo "======= Environment Variables ======="
echo "NODE_ENV: $NODE_ENV"
echo "NEXT_DIST_DIR: $NEXT_DIST_DIR"
echo "NEXT_TELEMETRY_DISABLED: $NEXT_TELEMETRY_DISABLED"
echo "NEXT_IGNORE_FILESYSTEM_CHECK: $NEXT_IGNORE_FILESYSTEM_CHECK"

# Check for .next directory in various locations
echo "======= Directory Structure ======="
echo "Looking for .next directory in common locations..."

# Check current directory
if [ -d ".next" ]; then
  echo "✅ Found .next directory in current directory"
  echo "Contents of .next directory:"
  ls -la .next/
  
  if [ -f ".next/BUILD_ID" ]; then
    echo "✅ Found BUILD_ID: $(cat .next/BUILD_ID)"
  else
    echo "❌ BUILD_ID not found in ./.next"
  fi
else
  echo "❌ No .next directory in current directory"
fi

# Check wwwroot
if [ -d "/home/site/wwwroot/.next" ]; then
  echo "✅ Found .next directory in /home/site/wwwroot/.next"
  echo "Contents:"
  ls -la /home/site/wwwroot/.next/
  
  if [ -f "/home/site/wwwroot/.next/BUILD_ID" ]; then
    echo "✅ Found BUILD_ID: $(cat /home/site/wwwroot/.next/BUILD_ID)"
  else
    echo "❌ BUILD_ID not found in /home/site/wwwroot/.next"
  fi
else
  echo "❌ No .next directory in /home/site/wwwroot/.next"
fi

# Check NEXT_DIST_DIR if set
if [ ! -z "$NEXT_DIST_DIR" ] && [ -d "$NEXT_DIST_DIR" ]; then
  echo "✅ Found .next directory in NEXT_DIST_DIR: $NEXT_DIST_DIR"
  echo "Contents:"
  ls -la "$NEXT_DIST_DIR"/
  
  if [ -f "$NEXT_DIST_DIR/BUILD_ID" ]; then
    echo "✅ Found BUILD_ID: $(cat $NEXT_DIST_DIR/BUILD_ID)"
  else
    echo "❌ BUILD_ID not found in $NEXT_DIST_DIR"
  fi
elif [ ! -z "$NEXT_DIST_DIR" ]; then
  echo "❌ NEXT_DIST_DIR is set to $NEXT_DIST_DIR but directory doesn't exist"
fi

# Check for required server files
echo "======= Critical Next.js Files ======="
# Look for pages-manifest.json
for location in ".next/server" "/home/site/wwwroot/.next/server" "$NEXT_DIST_DIR/server"; do
  if [ -d "$location" ]; then
    echo "Checking $location for critical files..."
    if [ -f "$location/pages-manifest.json" ]; then
      echo "✅ Found pages-manifest.json in $location"
    else
      echo "❌ pages-manifest.json not found in $location"
    fi
  fi
done

# Fix attempt - if we don't have a pages-manifest.json anywhere, create one
echo "======= Attempting Fix for Missing Files ======="
if [ -d ".next/server" ] && [ ! -f ".next/server/pages-manifest.json" ]; then
  echo "Creating minimal pages-manifest.json in .next/server"
  echo "{}" > .next/server/pages-manifest.json
  echo "✅ Created pages-manifest.json"
fi

# Check for node_modules/.bin/next
echo "======= Next.js Binary ======="
if [ -f "node_modules/.bin/next" ]; then
  echo "✅ Found node_modules/.bin/next executable"
else
  echo "❌ node_modules/.bin/next not found"
fi

# Print full npm list for debugging
echo "======= NPM Packages (abbreviated) ======="
npm list next react react-dom --depth=0

echo "======= Diagnostic Complete ======="
echo "If you're experiencing 'Could not find a production build' errors:"
echo "1. Make sure your deployment package includes the .next directory"
echo "2. Check that BUILD_ID exists in your .next directory"
echo "3. Verify pages-manifest.json exists in .next/server"
echo "4. Try setting NEXT_IGNORE_FILESYSTEM_CHECK=1 environment variable"
echo "5. Consider using 'npx next start' instead of node_modules/.bin/next"