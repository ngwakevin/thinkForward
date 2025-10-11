#!/bin/bash
# fix-azure-fs-issues.sh - Script to configure Next.js for Azure App Service's read-only file system
# Created by GitHub Copilot

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Fixing Azure App Service Read-Only File System Issues ===${NC}"

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

# Configure Azure App Service settings for read-only file system
echo -e "${YELLOW}Configuring App Service for read-only file system...${NC}"

# Set environment variables
echo -e "${YELLOW}Setting environment variables for Next.js...${NC}"
az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" \
  --settings \
  "NEXT_TELEMETRY_DISABLED=1" \
  "NEXT_DISABLE_FILESYSTEM_CACHE=1" \
  "NODE_ENV=production" > /dev/null

echo -e "${GREEN}Environment variables set successfully.${NC}"

# Check if WEBSITE_RUN_FROM_PACKAGE is enabled (this creates a read-only file system)
WEBSITE_RUN_FROM_PACKAGE=$(az webapp config appsettings list --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "[?name=='WEBSITE_RUN_FROM_PACKAGE'].value" -o tsv)

if [[ "$WEBSITE_RUN_FROM_PACKAGE" == "1" ]]; then
    echo -e "${YELLOW}WEBSITE_RUN_FROM_PACKAGE is enabled, which creates a read-only file system.${NC}"
    echo -e "${YELLOW}This is normal for Azure App Service.${NC}"
    
    # Check if there's a writable directory
    echo -e "${YELLOW}Creating a custom startup script to handle the read-only file system...${NC}"
    
    # Create a startup.sh file
    cat > startup.sh << 'EOL'
#!/bin/bash

# Create a temp directory for Next.js cache in a writable location
# Use the home directory which is writable by the app
export NEXT_TEMP_DIR="/home/site/next-temp"
mkdir -p "$NEXT_TEMP_DIR"
export NEXT_CACHE_DIR="$NEXT_TEMP_DIR/cache"
mkdir -p "$NEXT_CACHE_DIR"

# Set environment variables for Next.js
export NEXT_DISABLE_FILESYSTEM_CACHE=1
export NEXT_TELEMETRY_DISABLED=1

# Start the Node.js server
echo "Starting Node.js server with custom temp directories..."
exec node server.js
EOL
    
    chmod +x startup.sh
    
    # Update Azure App Service to use our custom startup script
    echo -e "${YELLOW}Updating App Service to use custom startup script...${NC}"
    az webapp config set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --startup-file "./startup.sh" > /dev/null
    
    echo -e "${GREEN}Custom startup script configured.${NC}"
fi

# Restart the app service
echo -e "${YELLOW}Restarting the App Service to apply changes...${NC}"
az webapp restart --name "$APP_NAME" --resource-group "$RESOURCE_GROUP"
echo -e "${GREEN}App Service restarted.${NC}"

echo -e "${GREEN}File system issue fixes completed.${NC}"
echo -e "${BLUE}=== Your Next.js application should now work properly with Azure App Service's read-only file system ===${NC}"

exit 0