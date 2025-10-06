#!/usr/bin/env bash
set -euo pipefail

# This script is used by GitHub Actions for Azure Web App deployment
# It builds the application and creates the deployment package

# Clean up any existing deployment artifacts
rm -f deploy.zip
rm -f startup.sh

# Clean installation to avoid any corrupted modules
echo "Cleaning node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

# Fresh install of dependencies
echo "Installing dependencies with a clean npm install..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Verify that critical Next.js files exist
if [ ! -d "node_modules/next/dist/server" ]; then
  echo "ERROR: Next.js server directory is missing. Build may be corrupted."
  exit 1
fi

# Remove dev dependencies to reduce package size
npm prune --production

# Create startup command file for Azure App Service
echo "#!/bin/sh
cd /home/site/wwwroot
export NODE_ENV=production
# Default to port 8080 if PORT is not set by Azure
export PORT=\${PORT:-8080}

# Debug information to help troubleshoot
echo \"Starting app with:\"
echo \"- NODE_ENV: \$NODE_ENV\"
echo \"- PORT: \$PORT\"
echo \"- PWD: \$(pwd)\"
echo \"- Node version: \$(node -v)\"
echo \"- Next.js version: \$(cat package.json | grep \\\"next\\\":)\"
echo \"- Files in .next/server: \$(ls -la .next/server 2>/dev/null || echo '.next/server not found')\"

# Use the custom server.js instead of the next binary
echo \"Starting with custom server: node server.js\"
node server.js" > startup.sh
chmod +x startup.sh

# Create deployment package including all necessary files
# Make sure to include next.js specific directories (.next, public) and our custom server
zip -r deploy.zip package.json package-lock.json next.config.mjs node_modules .next public scripts config lib app components data content startup.sh server.js

echo "Created deploy.zip for GitHub Actions deployment"
