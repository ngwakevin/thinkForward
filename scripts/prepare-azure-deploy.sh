#!/bin/bash
# prepare-azure-deploy.sh - Prepares a clean deployment package for Azure App Service

set -e # Exit immediately if any command fails
echo "Starting deployment preparation for Azure App Service..."

# Set variables
DEPLOY_DIR="azure-deploy"
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
DEPLOY_ZIP="deploy-${TIMESTAMP}.zip"

# Clean up any previous deployment directory
if [ -d "$DEPLOY_DIR" ]; then
  echo "Removing previous deployment directory..."
  rm -rf "$DEPLOY_DIR"
fi

# Create a fresh deployment directory
echo "Creating deployment directory..."
mkdir -p "$DEPLOY_DIR"

# Copy essential files (exclude development/source files)
echo "Copying deployment files..."
rsync -av --progress \
  --exclude='.git/' \
  --exclude='.github/' \
  --exclude='node_modules/' \
  --exclude='terraform/' \
  --exclude='infra/' \
  --exclude='.next/cache/' \
  --exclude='*.zip' \
  --exclude='*.tar.gz' \
  --exclude='.env.local' \
  --exclude='dev-auto.log' \
  . "$DEPLOY_DIR/"

# Add Azure specific files if they don't exist
echo "Ensuring Azure configuration files exist..."
if [ ! -f "$DEPLOY_DIR/web.config" ]; then
  cp web.config "$DEPLOY_DIR/"
fi

if [ ! -f "$DEPLOY_DIR/.deployment" ]; then
  cp .deployment "$DEPLOY_DIR/"
fi

if [ ! -f "$DEPLOY_DIR/iisnode.yml" ]; then
  cp iisnode.yml "$DEPLOY_DIR/"
fi

# Create a minimal package.json with only production dependencies
echo "Creating optimized package.json..."
node -e "
  const pkg = require('./package.json');
  const minPkg = {
    name: pkg.name,
    version: pkg.version,
    private: pkg.private,
    type: pkg.type,
    engines: pkg.engines,
    scripts: {
      start: 'node server.js',
      postinstall: pkg.scripts.postinstall
    },
    dependencies: pkg.dependencies
  };
  require('fs').writeFileSync('$DEPLOY_DIR/package.json', JSON.stringify(minPkg, null, 2));
"

# Create a .env.production file with safe placeholders
echo "Creating safe .env.production file..."
cat > "$DEPLOY_DIR/.env.production" << EOL
# Production environment for Azure App Service - SAFE PLACEHOLDERS
# These values are overridden by Application Settings in Azure

# Core settings
NODE_ENV=production
PORT=8080

# Authentication
NEXTAUTH_URL=https://placeholder.azurewebsites.net
NEXTAUTH_SECRET=placeholder-for-build

# Azure AD
AZURE_AD_CLIENT_ID=placeholder-client-id
AZURE_AD_TENANT_ID=common
AZURE_AD_CLIENT_SECRET=placeholder-for-build

# Cosmos DB
COSMOS_ENDPOINT=https://placeholder.documents.azure.com:443/
COSMOS_KEY=placeholder-key-for-build
COSMOS_DATABASE=thinkforward

# Site URL
NEXT_PUBLIC_SITE_URL=https://placeholder.azurewebsites.net
EOL

# Create package deployment script
echo "Creating deployment package..."
cd "$DEPLOY_DIR"
zip -r "../$DEPLOY_ZIP" . -x "*.git*" -x "node_modules/*" -x ".next/cache/*"
cd ..

echo "Deployment package created: $DEPLOY_ZIP"
echo "Size: $(du -h "$DEPLOY_ZIP" | cut -f1)"
echo ""
echo "To deploy this package to Azure App Service:"
echo "1. Go to Azure Portal > App Service > Your App > Deployment Center"
echo "2. Choose 'Manual Deploy' and upload the $DEPLOY_ZIP file"
echo "3. Or use Azure CLI: az webapp deployment source config-zip --resource-group YOUR_GROUP --name YOUR_APP --src $DEPLOY_ZIP"
echo ""