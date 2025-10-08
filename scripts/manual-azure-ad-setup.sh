#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}     Manual Azure AD Settings Configuration      ${NC}"
echo -e "${BLUE}=================================================${NC}"

# Set your Azure Web App and Resource Group names
WEBAPP_NAME="thinkforward-dev"
RESOURCE_GROUP=""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
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

# Ask for resource group name
echo -e "${YELLOW}Enter your Azure Resource Group name:${NC}"
read RESOURCE_GROUP

if [ -z "$RESOURCE_GROUP" ]; then
    echo -e "${RED}Resource Group name is required.${NC}"
    exit 1
fi

# Confirm the webapp name
echo -e "${YELLOW}Enter your Azure Web App name [${WEBAPP_NAME}]:${NC}"
read input
if [ ! -z "$input" ]; then
    WEBAPP_NAME="$input"
fi

# Check if the app exists
echo -e "${GREEN}Checking if webapp ${WEBAPP_NAME} exists in resource group ${RESOURCE_GROUP}...${NC}"
az webapp show --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: App '${WEBAPP_NAME}' does not exist in resource group '${RESOURCE_GROUP}'.${NC}"
    exit 1
fi

echo -e "${GREEN}Setting Azure AD environment variables for ${WEBAPP_NAME}...${NC}"

# Azure AD credentials - prompt for these values instead of hardcoding
echo -e "${YELLOW}Enter Azure AD Client ID:${NC}"
read AZURE_AD_CLIENT_ID

echo -e "${YELLOW}Enter Azure AD Client Secret:${NC}"
read -s AZURE_AD_CLIENT_SECRET
echo ""

# Set tenant ID to "common" for multi-tenant support
AZURE_AD_TENANT_ID="common"
NEXTAUTH_URL="https://${WEBAPP_NAME}.azurewebsites.net"
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Update only the Azure AD settings in the web app
echo -e "${GREEN}Updating app settings...${NC}"
az webapp config appsettings set \
  --resource-group "$RESOURCE_GROUP" \
  --name "$WEBAPP_NAME" \
  --settings \
  AZURE_AD_CLIENT_ID="$AZURE_AD_CLIENT_ID" \
  AZURE_AD_CLIENT_SECRET="$AZURE_AD_CLIENT_SECRET" \
  AZURE_AD_TENANT_ID="$AZURE_AD_TENANT_ID" \
  NEXTAUTH_URL="$NEXTAUTH_URL" \
  NEXTAUTH_SECRET="$NEXTAUTH_SECRET"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Azure AD settings updated successfully for ${WEBAPP_NAME}!${NC}"
  echo -e "${GREEN}Restarting the web app to apply changes...${NC}"
  
  # Restart the web app to ensure changes take effect
  az webapp restart --resource-group "$RESOURCE_GROUP" --name "$WEBAPP_NAME"
  
  echo -e "${GREEN}Done! The application has been updated with new Azure AD settings.${NC}"
  echo -e "After restart, test the Microsoft login functionality."
  echo -e "The callback URI should be: ${NEXTAUTH_URL}/api/auth/callback/microsoft"
  echo -e "${YELLOW}Make sure this callback URL is registered in your Azure AD app registration!${NC}"
else
  echo -e "${RED}Failed to update Azure AD settings. Please check your credentials and try again.${NC}"
fi