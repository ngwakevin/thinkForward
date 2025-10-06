#!/bin/bash

# Script to fix potential npm issues and prepare for build

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Fixing npm issues and preparing build ===${NC}"

# Fix deprecated packages
echo -e "${YELLOW}Updating potentially problematic packages...${NC}"

# Clean up node_modules and package-lock.json
echo -e "${YELLOW}Cleaning up node_modules and package-lock.json...${NC}"
rm -rf node_modules package-lock.json

# Install with latest versions
echo -e "${YELLOW}Installing dependencies with latest compatible versions...${NC}"
npm install --no-fund --no-audit

# Create template files if they don't exist
echo -e "${YELLOW}Checking for template files...${NC}"

# Create .env.production.template if it doesn't exist
if [ ! -f ".env.production.template" ]; then
  echo -e "${YELLOW}Creating .env.production.template...${NC}"
  cat > .env.production.template << EOL
# Production environment settings
# This template is used during the build process

# Core App Settings
NODE_ENV=production
PORT=8080

# Authentication - Azure AD
AZURE_AD_CLIENT_ID=your-azure-ad-client-id
AZURE_AD_CLIENT_SECRET=your-azure-ad-client-secret
AZURE_AD_TENANT_ID=your-azure-ad-tenant-id

# Authentication - NextAuth
NEXTAUTH_URL=https://your-app-name.azurewebsites.net
NEXTAUTH_SECRET=your-nextauth-secret-key

# Azure Resources (will be filled in during build)
# COSMOS_DB_ENDPOINT
# COSMOS_DB_KEY
# KEY_VAULT_URI
# APP_INSIGHTS_CONNECTION_STRING
EOL
  echo -e "${GREEN}Created .env.production.template${NC}"
fi

echo -e "${GREEN}Done! You can now run npm run build or deploy to Azure.${NC}"