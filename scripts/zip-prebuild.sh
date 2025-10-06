#!/usr/bin/env bash
set -euo pipefail

# This script is used by GitHub Actions for Azure Web App deployment
# It builds the application and creates the deployment package

# Clean up any existing deployment artifacts
rm -f deploy.zip
rm -f startup.sh

# In CI environments or when package-lock.json is out of sync, we need to ensure they're in sync
# before proceeding with the build process
if [ "${CI:-false}" = "true" ]; then
  echo "Running in CI environment, ensuring package-lock.json is in sync..."
  # First update package-lock.json to match package.json
  npm install --package-lock-only --no-audit
  # Then install all dependencies using the updated lock file
  npm ci
else
  echo "Installing dependencies and updating package-lock.json if needed..."
  npm install
fi

# Build the application
npm run build

# Remove dev dependencies to reduce package size
npm prune --production

# Create startup command file for Azure App Service
echo "#!/bin/sh
cd /home/site/wwwroot
export NODE_ENV=production
# Default to port 8080 if PORT is not set by Azure
export PORT=\${PORT:-8080}
# Use the npm start script which now uses the PORT environment variable
npm start" > startup.sh
chmod +x startup.sh

# Create deployment package including all necessary files
# Make sure to include next.js specific directories (.next, public)
zip -r deploy.zip package.json package-lock.json next.config.mjs node_modules .next public scripts config lib app components data content startup.sh

echo "Created deploy.zip for GitHub Actions deployment"
