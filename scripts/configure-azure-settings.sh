#!/bin/bash
# Script to configure Azure App Service settings for ThinkForward

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}Azure App Service Configuration Script${NC}"
echo -e "${BLUE}======================================${NC}"

# Check for Azure CLI
echo -e "\n${YELLOW}Checking for Azure CLI...${NC}"
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI not found. Please install it:${NC}"
    echo "  macOS: brew install azure-cli"
    echo "  Windows: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows"
    echo "  Linux: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-linux"
    exit 1
fi
echo -e "${GREEN}✓ Azure CLI is installed.${NC}"

# Login to Azure
echo -e "\n${YELLOW}Please log in to your Azure account...${NC}"
az login
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to log in to Azure.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Logged in to Azure.${NC}"

# Set variables
APP_NAME="thinkforward-webapp"
RESOURCE_GROUP=""
SUBSCRIPTION=""

# Get subscription
echo -e "\n${YELLOW}Fetching your Azure subscriptions...${NC}"
az account list --output table
echo -e "\n${YELLOW}Enter the subscription ID or name to use:${NC}"
read SUBSCRIPTION
az account set --subscription "$SUBSCRIPTION"
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to set subscription.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Using subscription: $SUBSCRIPTION${NC}"

# Get resource groups
echo -e "\n${YELLOW}Fetching resource groups...${NC}"
az group list --output table
echo -e "\n${YELLOW}Enter the resource group name where your app service is located:${NC}"
read RESOURCE_GROUP
echo -e "${GREEN}✓ Using resource group: $RESOURCE_GROUP${NC}"

# Check if the app exists
echo -e "\n${YELLOW}Checking if app $APP_NAME exists in resource group $RESOURCE_GROUP...${NC}"
APP_EXISTS=$(az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "name" --output tsv 2>/dev/null)
if [ -z "$APP_EXISTS" ]; then
    echo -e "${RED}App $APP_NAME not found in resource group $RESOURCE_GROUP.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ App $APP_NAME found in resource group $RESOURCE_GROUP.${NC}"

# Configure app settings
echo -e "\n${YELLOW}Configuring app settings for $APP_NAME...${NC}"

# Get app URL
APP_URL=$(az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "defaultHostName" --output tsv)
echo -e "\n${YELLOW}App URL: https://$APP_URL${NC}"

# Generate a random secret
NEXTAUTH_SECRET=$(openssl rand -hex 32)
echo -e "\n${YELLOW}Generated NEXTAUTH_SECRET${NC}"

# Ask for Azure AD credentials
echo -e "\n${YELLOW}Enter your Azure AD Client ID:${NC}"
read AZURE_AD_CLIENT_ID
echo -e "\n${YELLOW}Enter your Azure AD Client Secret:${NC}"
read -s AZURE_AD_CLIENT_SECRET
echo -e "\n${YELLOW}Enter your Azure AD Tenant ID (or press Enter to use 'common'):${NC}"
read AZURE_AD_TENANT_ID
AZURE_AD_TENANT_ID=${AZURE_AD_TENANT_ID:-common}

# Ask for Cosmos DB credentials
echo -e "\n${YELLOW}Enter your Cosmos DB Endpoint URL:${NC}"
read COSMOS_ENDPOINT
echo -e "\n${YELLOW}Enter your Cosmos DB Key:${NC}"
read -s COSMOS_KEY
echo -e "\n${YELLOW}Enter your Cosmos DB Database Name (or press Enter to use 'thinkforward'):${NC}"
read COSMOS_DATABASE
COSMOS_DATABASE=${COSMOS_DATABASE:-thinkforward}

# Update app settings
echo -e "\n${YELLOW}Updating app settings...${NC}"
az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings \
    NODE_ENV="production" \
    NEXTAUTH_URL="https://$APP_URL" \
    NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
    AZURE_AD_CLIENT_ID="$AZURE_AD_CLIENT_ID" \
    AZURE_AD_CLIENT_SECRET="$AZURE_AD_CLIENT_SECRET" \
    AZURE_AD_TENANT_ID="$AZURE_AD_TENANT_ID" \
    COSMOS_ENDPOINT="$COSMOS_ENDPOINT" \
    COSMOS_KEY="$COSMOS_KEY" \
    COSMOS_DATABASE="$COSMOS_DATABASE" \
    WEBSITE_NODE_DEFAULT_VERSION="~20" \
    WEBSITE_RUN_FROM_PACKAGE="1"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to update app settings.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ App settings updated successfully.${NC}"

# Configure startup command
echo -e "\n${YELLOW}Setting startup command...${NC}"
az webapp config set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --startup-file "node server.js"
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to set startup command.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Startup command set.${NC}"

echo -e "\n${GREEN}Configuration complete!${NC}"
echo -e "\n${YELLOW}App URL: https://$APP_URL${NC}"
echo -e "\n${YELLOW}Don't forget to update your GitHub Actions workflow publish profile.${NC}"
echo -e "${YELLOW}Run the generate-azure-publish-profile.sh script to get a new publish profile.${NC}"