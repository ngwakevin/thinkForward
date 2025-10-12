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

# Check location from error message
if [ -d "/home/site/next-temp/.next" ]; then
  echo "✅ Found .next directory in /home/site/next-temp/.next"
  echo "Contents:"
  ls -la /home/site/next-temp/.next/
  
  if [ -f "/home/site/next-temp/.next/BUILD_ID" ]; then
    echo "✅ Found BUILD_ID: $(cat /home/site/next-temp/.next/BUILD_ID)"
  else
    echo "❌ BUILD_ID not found in /home/site/next-temp/.next"
  fi
else
  echo "❌ No .next directory in /home/site/next-temp/.next"
fi

# Check temp directory (our new approach)
if [ -d "/home/site/temp/.next" ]; then
  echo "✅ Found .next directory in /home/site/temp/.next (new approach)"
  echo "Contents:"
  ls -la /home/site/temp/.next/
  
  if [ -f "/home/site/temp/.next/BUILD_ID" ]; then
    echo "✅ Found BUILD_ID: $(cat /home/site/temp/.next/BUILD_ID)"
  else
    echo "❌ BUILD_ID not found in /home/site/temp/.next"
  fi
else
  echo "❌ No .next directory in /home/site/temp/.next (new approach)"
fi

# Check for required server files
echo "======= Critical Next.js Files ======="
# Look for pages-manifest.json
for location in ".next/server" "/home/site/wwwroot/.next/server" "/home/site/temp/.next/server" "/home/site/next-temp/.next/server" "$NEXT_DIST_DIR/server"; do
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

# Check for direct start wrapper
echo "======= Direct Start Wrapper ======="
if [ -f "/home/site/temp/next-direct-start.js" ]; then
  echo "✅ Found /home/site/temp/next-direct-start.js (new approach)"
  echo "File permissions: $(ls -la /home/site/temp/next-direct-start.js | awk '{print $1}')"
  echo "File size: $(wc -c < /home/site/temp/next-direct-start.js) bytes"
elif [ -f "scripts/next-direct-start.js" ]; then
  echo "✅ Found scripts/next-direct-start.js"
  echo "File permissions: $(ls -la scripts/next-direct-start.js | awk '{print $1}')"
  echo "File size: $(wc -c < scripts/next-direct-start.js) bytes"
else
  echo "❌ next-direct-start.js not found in either location"
  echo "Will attempt to create it during startup"
fi

# Check for wrapper generator
if [ -f "scripts/create-nextjs-wrapper.js" ]; then
  echo "✅ Found scripts/create-nextjs-wrapper.js"
else
  echo "❌ scripts/create-nextjs-wrapper.js not found"
  echo "This file is required to create the direct start wrapper"
fi

# Check filesystem permissions
echo "======= Filesystem Permissions ======="
echo "Testing write permissions in key directories..."

for dir in "/home/site/wwwroot" "/home/site/temp" "/home/site/next-temp"; do
  if [ -d "$dir" ]; then
    echo "Testing write access to $dir..."
    if touch "$dir/test_permissions" 2>/dev/null; then
      echo "✅ $dir is writable"
      rm -f "$dir/test_permissions"
    else
      echo "❌ $dir is NOT writable (read-only filesystem)"
    fi
  else
    echo "Directory $dir does not exist"
  fi
done

echo "======= Diagnostic Complete ======="
echo "If you're experiencing 'Could not find a production build' errors:"
echo "1. Make sure your deployment package includes the .next directory"
echo "2. Check that BUILD_ID exists in your .next directory"
echo "3. Verify pages-manifest.json exists in .next/server"
echo "4. Try setting NEXT_IGNORE_FILESYSTEM_CHECK=1 environment variable"
echo "5. Use the direct start wrapper (/home/site/temp/next-direct-start.js) from writable temp directory"
echo "6. If all else fails, empty build files will be created automatically during startup"
echo ""
echo "Our new approach uses /home/site/temp/.next which should be writable even in read-only environments"