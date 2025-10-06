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

# Create startup command file for Azure App Service
echo -e "${GREEN}Creating startup.sh...${NC}"
cat > startup.sh << 'EOL'
#!/bin/sh
cd /home/site/wwwroot
export NODE_ENV=production
export PORT=8080
node server.js
EOL

chmod +x startup.sh

# Package the application
echo -e "${GREEN}Packaging application...${NC}"
bash scripts/zip-prebuild.sh

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
  --startup-file /home/site/wwwroot/startup.sh \
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
  APPLICATIONINSIGHTS_CONNECTION_STRING="$APP_INSIGHTS_CONNECTION_STRING" \
  APPLICATIONINSIGHTS_ROLE_NAME="thinkforward-web"

echo -e "${GREEN}Deployment to ${WEBAPP_NAME} completed successfully!${NC}"
echo -e "You can access your application at: https://${WEBAPP_NAME}.azurewebsites.net"