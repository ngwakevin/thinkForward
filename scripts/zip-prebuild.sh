#!/usr/bin/env bash
set -euo pipefail

# This script is used by GitHub Actions for Azure Web App deployment
# It builds the application and creates the deployment package

# Clean up any existing deployment artifacts
rm -f deploy.zip
rm -f startup.sh

# Use npm ci for consistent installs when running in GitHub Actions
# Otherwise use npm install for local development
if [ "${CI:-false}" = "true" ]; then
  echo "Running in CI environment, using npm ci..."
  npm ci
else
  echo "Running in local environment, using npm install..."
  npm install
fi

# Build the application
npm run build

# Remove dev dependencies to reduce package size
npm prune --production

# Create startup command file for Azure App Service
echo "#!/bin/sh
cd /home/site/wwwroot
NODE_ENV=production node_modules/.bin/next start -p \${PORT:-8080}" > startup.sh
chmod +x startup.sh

# Create deployment package including all necessary files
# Make sure to include next.js specific directories (.next, public)
zip -r deploy.zip package.json package-lock.json next.config.mjs node_modules .next public scripts config lib app components data content startup.sh

echo "Created deploy.zip for GitHub Actions deployment"
