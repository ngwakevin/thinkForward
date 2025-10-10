#!/bin/bash
# Script to generate Azure App Service publish profile

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}Azure App Service Publish Profile Setup${NC}"
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
    echo -e "\n${YELLOW}Would you like to create a new App Service? (y/n)${NC}"
    read CREATE_APP
    if [[ "$CREATE_APP" == "y" || "$CREATE_APP" == "Y" ]]; then
        echo -e "\n${YELLOW}Creating new App Service...${NC}"
        echo -e "\n${YELLOW}Enter the location (e.g., westus2, eastus):${NC}"
        read LOCATION
        
        # Create App Service Plan
        PLAN_NAME="$APP_NAME-plan"
        echo -e "\n${YELLOW}Creating App Service Plan $PLAN_NAME...${NC}"
        az appservice plan create --name "$PLAN_NAME" --resource-group "$RESOURCE_GROUP" --location "$LOCATION" --sku B1 --is-linux
        
        # Create Web App
        echo -e "\n${YELLOW}Creating Web App $APP_NAME...${NC}"
        az webapp create --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --plan "$PLAN_NAME" --runtime "NODE:20-lts"
        
        # Configure for Node.js
        echo -e "\n${YELLOW}Configuring for Node.js...${NC}"
        az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings WEBSITE_NODE_DEFAULT_VERSION=20.x
        az webapp config set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --startup-file "node server.js"
    else
        echo -e "${YELLOW}Exiting script.${NC}"
        exit 0
    fi
else
    echo -e "${GREEN}✓ App $APP_NAME found in resource group $RESOURCE_GROUP.${NC}"
fi

# Generate publish profile
echo -e "\n${YELLOW}Generating publish profile for $APP_NAME...${NC}"
PUBLISH_PROFILE=$(az webapp deployment list-publishing-profiles --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --xml)
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to generate publish profile.${NC}"
    exit 1
fi

# Save publish profile to file
PROFILE_FILE="$APP_NAME-publish-profile.xml"
echo "$PUBLISH_PROFILE" > "$PROFILE_FILE"
echo -e "${GREEN}✓ Publish profile saved to $PROFILE_FILE${NC}"

echo -e "\n${YELLOW}Instructions for GitHub Actions:${NC}"
echo -e "1. Open your GitHub repository"
echo -e "2. Go to Settings > Secrets and variables > Actions"
echo -e "3. Create a new repository secret named 'AZURE_WEBAPP_PUBLISH_PROFILE'"
echo -e "4. Copy and paste the entire content of $PROFILE_FILE as the value"
echo -e "5. Update your GitHub Actions workflow to use this secret\n"

echo -e "${YELLOW}Would you like to display the publish profile content? (y/n)${NC}"
read SHOW_PROFILE
if [[ "$SHOW_PROFILE" == "y" || "$SHOW_PROFILE" == "Y" ]]; then
    echo -e "\n${YELLOW}Publish Profile Content:${NC}"
    echo -e "${BLUE}----------------------------${NC}"
    cat "$PROFILE_FILE"
    echo -e "${BLUE}----------------------------${NC}"
fi

echo -e "\n${GREEN}Setup complete!${NC}"