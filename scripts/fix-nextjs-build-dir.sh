#!/bin/bash
# This script specifically fixes the Next.js build directory issue in Azure App Service
# It handles the /home/site/next-temp/.next path specifically mentioned in error logs

echo "=== Next.js Azure Build Directory Fix Script ==="
echo "Date: $(date)"
echo "Current directory: $(pwd)"

# Create the directory structure if it doesn't exist
echo "Creating /home/site/next-temp/.next directory structure..."
mkdir -p /home/site/next-temp/.next/server

# Create minimal required files
echo "Creating minimal required files in /home/site/next-temp/.next..."
echo "$(date +%s)" > /home/site/next-temp/.next/BUILD_ID
echo "{}" > /home/site/next-temp/.next/server/pages-manifest.json
echo "{}" > /home/site/next-temp/.next/build-manifest.json

# Copy files from .next if it exists
if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
  echo "Found valid .next directory, copying files to /home/site/next-temp/.next..."
  cp -r .next/* /home/site/next-temp/.next/
  echo "✅ Copied build files from .next to /home/site/next-temp/.next"
fi

# Create a symlink to ensure proper file access
echo "Creating symlink from .next to /home/site/next-temp/.next..."
rm -f .next
ln -sf /home/site/next-temp/.next .next

# Set permissions
chmod -R 755 /home/site/next-temp/.next

# Print directory contents
echo "=== Contents of /home/site/next-temp/.next ==="
ls -la /home/site/next-temp/.next/

echo "=== Next.js build directory fix complete ==="