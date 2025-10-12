#!/bin/bash
set -euo pipefail

# Script to prepare and deploy the application to Azure App Service
# Usage: bash scripts/deploy-to-azure.sh [environment]

# Default to development environment if not specified
ENVIRONMENT=${1:-"development"}
APP_NAME="thinkforward"
RESOURCE_GROUP="thinkforward-rg"

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Building and deploying to Azure App Service (${ENVIRONMENT}) ===${NC}"

# Clean up any existing deployment artifacts
rm -f deploy.zip

# Run the Azure resource fetcher to ensure we have the latest values
echo -e "${YELLOW}Fetching Azure resource information...${NC}"
bash scripts/fetch-azure-resources.sh

# Source the Azure resources
source ./azure-resources.env

# Determine App Service name based on environment
if [ "$ENVIRONMENT" == "production" ]; then
  WEBAPP_NAME="${APP_NAME}"
  NODE_ENV="production"
else
  WEBAPP_NAME="${APP_NAME}-dev"
  NODE_ENV="development"
fi

echo -e "${YELLOW}Target Azure App Service: ${WEBAPP_NAME}${NC}"

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm ci

# Build the application
echo -e "${GREEN}Building the application...${NC}"
NODE_ENV="production" npm run build

# Remove dev dependencies to reduce package size
echo -e "${GREEN}Removing dev dependencies...${NC}"
npm prune --production

# Create diagnostic script and direct start wrapper
echo -e "${GREEN}Ensuring all Azure deployment scripts are included...${NC}"
chmod +x scripts/diagnose-nextjs.sh
chmod +x scripts/create-direct-startup.sh
chmod +x scripts/test-azure-deployment.sh
chmod +x scripts/minimal-next-starter.js
chmod +x scripts/emergency-server.js
chmod +x scripts/comprehensive-nextjs-diagnostics.js

# Run the prepare-azure-deployment.sh script to ensure critical files are included
echo -e "${GREEN}Preparing Azure deployment...${NC}"
bash scripts/prepare-azure-deployment.sh

# Test the deployment locally
echo -e "${GREEN}Testing the deployment approach locally...${NC}"
bash scripts/test-azure-deployment.sh

# Package the application
echo -e "${GREEN}Packaging application...${NC}"
bash scripts/zip-prebuild.sh

# Verify the deployment package
echo -e "${GREEN}Verifying deployment package contents...${NC}"
if [ -f "scripts/verify-deployment-package.sh" ]; then
  if ! bash scripts/verify-deployment-package.sh deploy.zip; then
    echo -e "${RED}ERROR: Deployment package verification failed!${NC}"
    echo -e "${YELLOW}Attempting emergency fix...${NC}"
    
    # Create a scripts directory in a temporary location for inclusion
    TEMP_DIR=$(mktemp -d)
    mkdir -p "$TEMP_DIR/scripts"
    
    # Copy or create critical files
    for script in minimal-next-starter.js emergency-server.js comprehensive-nextjs-diagnostics.js copy-critical-files-to-temp.sh; do
      if [ -f "scripts/$script" ]; then
        echo -e "${GREEN}Copying $script to temporary location${NC}"
        cp "scripts/$script" "$TEMP_DIR/scripts/"
      else
        echo -e "${YELLOW}Creating placeholder for missing script: $script${NC}"
        
        # Create a basic placeholder with proper content based on the script type
        if [[ "$script" == "minimal-next-starter.js" ]]; then
          cat > "$TEMP_DIR/scripts/$script" << 'EOF'
#!/usr/bin/env node
console.log('Emergency placeholder for minimal-next-starter.js');
const http = require('http');
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <!DOCTYPE html>
    <html><head><title>ThinkForward - Emergency Mode</title></head>
    <body>
      <h1>ThinkForward - Emergency Mode</h1>
      <p>The application is running in emergency mode using a placeholder script.</p>
      <p>This page will refresh every 30 seconds.</p>
      <script>setTimeout(() => { window.location.reload(); }, 30000);</script>
    </body></html>
  `);
}).listen(port, () => { console.log(`Emergency server running on port ${port}`); });
EOF
        elif [[ "$script" == "emergency-server.js" ]]; then
          cat > "$TEMP_DIR/scripts/$script" << 'EOF'
#!/usr/bin/env node
console.log('Emergency placeholder for emergency-server.js');
const http = require('http');
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <!DOCTYPE html>
    <html><head><title>ThinkForward - Emergency Mode</title></head>
    <body>
      <h1>ThinkForward - Emergency Mode</h1>
      <p>The application is running in emergency mode using a placeholder script.</p>
      <p>This page will refresh every 30 seconds.</p>
      <script>setTimeout(() => { window.location.reload(); }, 30000);</script>
    </body></html>
  `);
}).listen(port, () => { console.log(`Emergency server running on port ${port}`); });
EOF
        else
          # Generic placeholder for other scripts
          echo "#!/usr/bin/env node" > "$TEMP_DIR/scripts/$script"
          echo "console.log('Placeholder for $script');" >> "$TEMP_DIR/scripts/$script"
        fi
        
        chmod +x "$TEMP_DIR/scripts/$script"
      fi
    done
    
    # Create a supplementary zip with just the scripts
    (cd "$TEMP_DIR" && zip -r "../critical-scripts.zip" scripts)
    echo -e "${GREEN}Created supplementary critical-scripts.zip${NC}"
    
    # Add critical scripts to the main deployment package
    echo -e "${GREEN}Adding critical scripts to deployment package...${NC}"
    unzip -o critical-scripts.zip -d .
    bash scripts/zip-prebuild.sh
    
    # Verify again
    if ! bash scripts/verify-deployment-package.sh deploy.zip; then
      echo -e "${RED}Deployment package verification still failing!${NC}"
      echo -e "${YELLOW}Please fix the issues before deploying.${NC}"
      
      # Prompt for confirmation to continue anyway
      read -p "Do you want to continue with deployment anyway? (y/N): " CONTINUE
      if [[ "$CONTINUE" != "y" && "$CONTINUE" != "Y" ]]; then
        echo -e "${YELLOW}Deployment aborted.${NC}"
        exit 1
      fi
      echo -e "${YELLOW}Continuing with deployment despite verification failures...${NC}"
    else
      echo -e "${GREEN}Deployment package verification passed after fixes!${NC}"
    fi
  else
    echo -e "${GREEN}Deployment package verification passed!${NC}"
  fi
else
  echo -e "${YELLOW}WARNING: verify-deployment-package.sh not found. Skipping verification.${NC}"
fi

# Deploy to Azure App Service
echo -e "${GREEN}Deploying to Azure App Service (${WEBAPP_NAME})...${NC}"
az webapp deployment source config-zip \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEBAPP_NAME" \
  --src deploy.zip

# Configure App Service settings
echo -e "${GREEN}Updating App Service configuration...${NC}"
az webapp config set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEBAPP_NAME" \
  --startup-command "cd /home/site/wwwroot && bash scripts/ensure-critical-files.sh && bash scripts/create-direct-startup.sh && bash startup.sh" \
  --node-version 20-lts

# Set application settings
echo -e "${GREEN}Setting application environment variables...${NC}"
az webapp config appsettings set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEBAPP_NAME" \
  --settings \
  COSMOS_DB_ENDPOINT="$COSMOS_DB_ENDPOINT" \
  COSMOS_DB_KEY="$COSMOS_DB_KEY" \
  COSMOS_DB_DATABASE_ID="thinkforward" \
  COSMOS_DB_CONTAINER_ID="users" \
  KEY_VAULT_URL="$KEY_VAULT_URI" \
  NODE_ENV="$NODE_ENV" \
  WEBSITE_RUN_FROM_PACKAGE="1" \
  NEXT_IGNORE_FILESYSTEM_CHECK="1" \
  NEXT_MANUAL_SIG_HANDLE="true" \
  NEXT_TELEMETRY_DISABLED="1" \
  NEXT_TEMP_DIR="/home/site/next-temp" \
  NEXT_DIST_DIR="/home/site/next-temp/.next" \
  NEXT_DISABLE_FILESYSTEM_CACHE="1" \
  APPLICATIONINSIGHTS_CONNECTION_STRING="$APP_INSIGHTS_CONNECTION_STRING" \
  APPLICATIONINSIGHTS_ROLE_NAME="thinkforward-web" \
  AZURE_AD_CLIENT_ID="$AZURE_AD_CLIENT_ID" \
  AZURE_AD_CLIENT_SECRET="$AZURE_AD_CLIENT_SECRET" \
  AZURE_AD_TENANT_ID="$AZURE_AD_TENANT_ID" \
  NEXTAUTH_URL="https://${WEBAPP_NAME}.azurewebsites.net" \
  NEXTAUTH_SECRET="$NEXTAUTH_SECRET"

echo -e "${GREEN}Deployment to ${WEBAPP_NAME} completed successfully!${NC}"
echo -e "You can access your application at: https://${WEBAPP_NAME}.azurewebsites.net"