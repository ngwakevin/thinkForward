#!/bin/bash
set -euo pipefail

# Test script to verify the build process locally before deploying to Azure
# Usage: bash scripts/test-build.sh

echo "=== Testing the build process locally ==="

# Clean up any existing deployment artifacts
rm -f deploy.zip
rm -rf node_modules
rm -f package-lock.json
rm -rf .next

# Fresh install of dependencies
echo "Installing dependencies with a clean npm install..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Check that critical Next.js files exist
echo "Checking for critical Next.js files..."

if [ ! -d "node_modules/next/dist/server" ]; then
  echo "ERROR: next/dist/server directory is missing. Build is corrupted."
  exit 1
else
  echo "✅ next/dist/server directory exists"
  ls -la node_modules/next/dist/server
fi

if [ ! -f "node_modules/.bin/next" ]; then
  echo "ERROR: next binary is missing. Build is corrupted."
  exit 1
else
  echo "✅ next binary exists"
fi

# Test that the startup script works
echo "#!/bin/sh
export NODE_ENV=production
export PORT=3000
node_modules/.bin/next start -p \$PORT" > test-startup.sh
chmod +x test-startup.sh

echo "=== Build verification completed successfully ==="
echo "You can now run ./test-startup.sh to verify that the app starts correctly"
echo "Press Ctrl+C to stop the server after verifying"
echo ""
echo "Ready to deploy to Azure!"