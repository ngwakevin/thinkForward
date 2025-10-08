#!/bin/bash
# Script to update Azure AD environment variables in Azure Web App
# Usage: bash scripts/update-azure-ad-settings.sh [environment]

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default to development environment if not specified
ENVIRONMENT=${1:-"development"}
APP_NAME="thinkforward"
RESOURCE_GROUP="thinkforward-rg"

# Allow user to override resource group
echo -e "${YELLOW}Enter Azure Resource Group name [${RESOURCE_GROUP}]:${NC}"
read RG_INPUT
if [ ! -z "$RG_INPUT" ]; then
  RESOURCE_GROUP="$RG_INPUT"
fi

# Determine App Service name based on environment
if [ "$ENVIRONMENT" == "production" ]; then
  WEBAPP_NAME="${APP_NAME}"
else
  WEBAPP_NAME="${APP_NAME}-dev"
fi

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if logged in to Azure
echo "Checking Azure login status..."
az account show &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}You are not logged in to Azure. Please login first.${NC}"
    echo "Run: az login"
    exit 1
fi

# Prompt for Azure AD values
if [ -z "$AZURE_AD_CLIENT_ID" ]; then
  echo -e "${YELLOW}Enter Azure AD Client ID (Application ID):${NC}"
  read AZURE_AD_CLIENT_ID
fi

if [ -z "$AZURE_AD_TENANT_ID" ]; then
  # Using "common" for multi-tenant support
  AZURE_AD_TENANT_ID="common"
  echo -e "${GREEN}Using Azure AD Tenant ID: ${AZURE_AD_TENANT_ID} (for multi-tenant support)${NC}"
fi

if [ -z "$AZURE_AD_CLIENT_SECRET" ]; then
  echo -e "${YELLOW}Enter Azure AD Client Secret (Application Secret):${NC}"
  read -s AZURE_AD_CLIENT_SECRET
  echo ""
fi

# Validate inputs
if [ -z "$AZURE_AD_CLIENT_ID" ] || [ -z "$AZURE_AD_TENANT_ID" ] || [ -z "$AZURE_AD_CLIENT_SECRET" ]; then
  echo -e "${RED}Missing required Azure AD credentials. All values must be provided.${NC}"
  exit 1
fi

echo -e "${GREEN}Updating Azure AD settings for ${WEBAPP_NAME}...${NC}"

# Update only the Azure AD settings in the web app
az webapp config appsettings set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEBAPP_NAME" \
  --settings \
  AZURE_AD_CLIENT_ID="$AZURE_AD_CLIENT_ID" \
  AZURE_AD_TENANT_ID="$AZURE_AD_TENANT_ID" \
  AZURE_AD_CLIENT_SECRET="$AZURE_AD_CLIENT_SECRET" \
  NEXTAUTH_URL="https://${WEBAPP_NAME}.azurewebsites.net"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Azure AD settings updated successfully for ${WEBAPP_NAME}!${NC}"
  echo -e "${GREEN}Restarting the web app to apply changes...${NC}"
  
  # Restart the web app to ensure changes take effect
  az webapp restart --resource-group "$RESOURCE_GROUP" --name "$WEBAPP_NAME"
  
  echo -e "${GREEN}Done! The application has been updated with new Azure AD settings.${NC}"
  echo -e "After restart, test the Microsoft login functionality."
  echo -e "The callback URI should be: https://${WEBAPP_NAME}.azurewebsites.net/api/auth/callback/microsoft"
else
  echo -e "${RED}Failed to update Azure AD settings. Please check your credentials and try again.${NC}"
fi