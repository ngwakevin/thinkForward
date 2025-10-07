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

# Remove unnecessary files to reduce zip size
echo "Removing unnecessary files to reduce package size..."
find ./node_modules -type d -name "test" -o -name "tests" | xargs rm -rf
find ./node_modules -type d -name ".git" | xargs rm -rf
find ./node_modules -type f -name ".gitignore" -o -name "*.md" -o -name "LICENSE" | xargs rm -f

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

# Use the custom server.js instead of the next binary with ESM support
echo \"Starting with custom server: node server.js\"
node --experimental-specifier-resolution=node server.js

# Log successful startup
echo \"App started successfully at: \$(date)\"
echo \"Health check available at: http://localhost:\$PORT/api/health\"" > startup.sh
chmod +x startup.sh

# Add a note about the deployment package
echo "Creating deployment zip..."
chmod +x startup.sh

# Create deployment package including all necessary files with maximum compression
# Make sure to include next.js specific directories (.next, public) and our custom server
echo "Creating optimized deployment package with maximum compression..."
zip -9 -r deploy.zip package.json package-lock.json next.config.mjs node_modules .next public scripts config lib app components data content startup.sh server.js

# Check the size of the deployment package
PACKAGE_SIZE=$(du -h deploy.zip | cut -f1)
echo "Created deploy.zip (${PACKAGE_SIZE}) for GitHub Actions deployment"
