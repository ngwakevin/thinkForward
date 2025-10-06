#!/bin/bash
set -euo pipefail

# Script to build and deploy the application to Azure App Service
# Usage: bash scripts/deploy-azure.sh

echo "=== Building and deploying to Azure App Service ==="

# Clean up any existing deployment artifacts
rm -f deploy.zip
rm -f startup.sh

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build the application
echo "Building the application..."
npm run build

# Remove dev dependencies to reduce package size
echo "Removing dev dependencies..."
npm prune --production

# Create startup command file for Azure App Service
echo "Creating startup.sh..."
cat > startup.sh << 'EOL'
#!/bin/sh
cd /home/site/wwwroot
export NODE_ENV=production
# Default to port 8080 if PORT is not set by Azure
export PORT=${PORT:-8080}
# Use the npm start script which uses the PORT environment variable
npm start
EOL
chmod +x startup.sh

# Create deployment package
echo "Creating deployment package..."
zip -r deploy.zip package.json package-lock.json next.config.mjs node_modules .next public scripts config lib app components data content startup.sh

# Deploy to Azure
echo "Deploying to Azure App Service..."
az webapp deployment source config-zip --resource-group thinkforward-dev-rg --name thinkforward-dev --src deploy.zip

echo "=== Deployment completed ==="
echo "Your application has been deployed to: https://thinkforward-dev.azurewebsites.net"