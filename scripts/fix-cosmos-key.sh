#!/bin/bash
# fix-cosmos-key.sh - Script to fix Cosmos DB key in Azure App Service
# Created by GitHub Copilot

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Fixing Cosmos DB Authentication Issues ===${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI not found. Please install it first.${NC}"
    exit 1
fi

# Check if logged in
echo -e "${YELLOW}Checking Azure login status...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Azure. Please log in.${NC}"
    az login
fi

# Check resource group and app service
RESOURCE_GROUP="thinkforward-dev-rg"
APP_NAME="thinkforward-dev"

echo -e "${YELLOW}Checking if App Service $APP_NAME exists in resource group $RESOURCE_GROUP...${NC}"
if ! az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${RED}Error: App Service $APP_NAME not found in resource group $RESOURCE_GROUP.${NC}"
    exit 1
fi

# Get current Cosmos DB key settings
echo -e "${YELLOW}Checking current Cosmos DB key settings...${NC}"
SETTINGS=$(az webapp config appsettings list --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "[?name=='COSMOS_DB_KEY' || name=='COSMOS_KEY']" -o json)

# Parse Cosmos DB keys
COSMOS_DB_KEY=$(echo "$SETTINGS" | grep -o '"COSMOS_DB_KEY".*"value": "[^"]*"' | grep -o '"value": "[^"]*"' | cut -d'"' -f4)
COSMOS_KEY=$(echo "$SETTINGS" | grep -o '"COSMOS_KEY".*"value": "[^"]*"' | grep -o '"value": "[^"]*"' | cut -d'"' -f4)

echo -e "${YELLOW}COSMOS_DB_KEY: ${COSMOS_DB_KEY:0:10}...${NC}"
echo -e "${YELLOW}COSMOS_KEY: ${COSMOS_KEY:0:10}...${NC}"

# Check if keys match or if one is empty
if [[ -z "$COSMOS_KEY" ]]; then
    echo -e "${RED}COSMOS_KEY is empty. Setting it to match COSMOS_DB_KEY...${NC}"
    az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings COSMOS_KEY="$COSMOS_DB_KEY" > /dev/null
    echo -e "${GREEN}Successfully set COSMOS_KEY.${NC}"
elif [[ -z "$COSMOS_DB_KEY" ]]; then
    echo -e "${RED}COSMOS_DB_KEY is empty. Setting it to match COSMOS_KEY...${NC}"
    az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings COSMOS_DB_KEY="$COSMOS_KEY" > /dev/null
    echo -e "${GREEN}Successfully set COSMOS_DB_KEY.${NC}"
elif [[ "$COSMOS_KEY" != "$COSMOS_DB_KEY" ]]; then
    echo -e "${RED}Keys don't match. Synchronizing both keys...${NC}"
    # Use COSMOS_DB_KEY as the source of truth
    az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings COSMOS_KEY="$COSMOS_DB_KEY" > /dev/null
    echo -e "${GREEN}Successfully synchronized keys.${NC}"
else
    echo -e "${GREEN}Keys are already synchronized.${NC}"
fi

# Restart the app service
echo -e "${YELLOW}Restarting the App Service to apply changes...${NC}"
az webapp restart --name "$APP_NAME" --resource-group "$RESOURCE_GROUP"
echo -e "${GREEN}App Service restarted.${NC}"

# Check for the "read-only file system" error
echo -e "${YELLOW}Checking for read-only file system issues...${NC}"
DEPLOYMENT_METHOD=$(az webapp deployment source show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query scmType -o tsv 2>/dev/null)

if [[ "$DEPLOYMENT_METHOD" == "LocalGit" ]] || [[ "$WEBSITE_RUN_FROM_PACKAGE" == "1" ]]; then
    echo -e "${YELLOW}App is using $DEPLOYMENT_METHOD deployment or WEBSITE_RUN_FROM_PACKAGE=1.${NC}"
    echo -e "${YELLOW}This is expected to have a read-only file system for the app content.${NC}"
    echo -e "${YELLOW}The EROFS errors in the logs are normal and can be ignored.${NC}"
fi

echo -e "${GREEN}Cosmos DB authentication fix completed.${NC}"
echo -e "${BLUE}=== Check the app logs for any remaining issues ===${NC}"

exit 0