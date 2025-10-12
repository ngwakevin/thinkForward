#!/bin/bash
# This script specifically fixes the Next.js build directory issue in Azure App Service
# It handles the build directory in writable locations like /home/site/temp

echo "=== Next.js Azure Build Directory Fix Script ==="
echo "Date: $(date)"
echo "Current directory: $(pwd)"

# Use /home/site/temp directory which is writable even in read-only environments
TEMP_DIR="/home/site/temp"
NEXT_DIR="$TEMP_DIR/.next"

# Create the directory structure if it doesn't exist
echo "Creating $NEXT_DIR directory structure..."
mkdir -p $NEXT_DIR/server

# Create minimal required files
echo "Creating minimal required files in $NEXT_DIR..."
echo "$(date +%s)" > $NEXT_DIR/BUILD_ID
echo "{}" > $NEXT_DIR/server/pages-manifest.json
echo "{}" > $NEXT_DIR/build-manifest.json

# Copy files from .next if it exists
if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
  echo "Found valid .next directory, copying files to $NEXT_DIR..."
  cp -r .next/* $NEXT_DIR/
  echo "✅ Copied build files from .next to $NEXT_DIR"
fi

# Also create the old path as well for backward compatibility
mkdir -p /home/site/next-temp/.next/server || true
echo "$(date +%s)" > /home/site/next-temp/.next/BUILD_ID || true
echo "{}" > /home/site/next-temp/.next/server/pages-manifest.json || true
echo "{}" > /home/site/next-temp/.next/build-manifest.json || true

# Create a symlink to ensure proper file access
echo "Creating symlink from .next to $NEXT_DIR..."
rm -f .next
ln -sf $NEXT_DIR .next

# Also link the old path to our new location for backward compatibility
ln -sf $NEXT_DIR /home/site/next-temp/.next || true

# Set permissions
chmod -R 755 $NEXT_DIR

# Print directory contents
echo "=== Contents of $NEXT_DIR ==="
ls -la $NEXT_DIR/

echo "=== Next.js build directory fix complete ==="