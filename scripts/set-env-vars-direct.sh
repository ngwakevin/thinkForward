#!/bin/bash
# Script to directly apply environment variables to the Azure Web App using the Azure REST API
# This bypasses any intermediary processes that might be interfering with our variables

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting environment variables directly with Azure REST API...${NC}"

# Define the variables
CLIENT_ID="3ca9d2ec-a691-4a58-9658-ecd4fb8d6918"
TENANT_ID="438537ce-67d5-4799-837e-aa8ba4ed01eb"
RESOURCE_GROUP="thinkforward-dev-rg"
WEBAPP_NAME="thinkforward-dev"

# Get client secret from file
if [ -f "./azure-credentials.json" ]; then
  echo "Using client secret from azure-credentials.json"
  CLIENT_SECRET=$(grep -o "\"clientSecret\": \"[^\"]*\"" ./azure-credentials.json | cut -d'"' -f4)
  if [ -z "$CLIENT_SECRET" ]; then
    echo -e "${RED}Error: Could not extract client secret from azure-credentials.json${NC}"
    exit 1
  fi
else
  if [ -z "$1" ]; then
    echo -e "${RED}Error: No client secret provided and azure-credentials.json not found.${NC}"
    echo "Usage: $0 [client_secret]"
    exit 1
  fi
  CLIENT_SECRET="$1"
fi

# Get hostname for NEXTAUTH_URL
HOSTNAME=$(az webapp show --name "$WEBAPP_NAME" --resource-group "$RESOURCE_GROUP" --query "defaultHostName" -o tsv)
if [ -z "$HOSTNAME" ]; then
  echo -e "${RED}Error: Could not retrieve webapp hostname${NC}"
  exit 1
fi
NEXTAUTH_URL="https://$HOSTNAME"

# Generate a random NEXTAUTH_SECRET if not provided
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Get current settings first
echo -e "${YELLOW}Getting current app settings...${NC}"
CURRENT_SETTINGS=$(az webapp config appsettings list --name "$WEBAPP_NAME" --resource-group "$RESOURCE_GROUP" -o json)

# Create a JSON file with all the settings, including the ones we're updating
TEMP_FILE=$(mktemp)

echo "{" > "$TEMP_FILE"
echo "  \"properties\": {" >> "$TEMP_FILE"
echo "    \"AZURE_AD_CLIENT_ID\": \"$CLIENT_ID\"," >> "$TEMP_FILE"
echo "    \"AZURE_AD_CLIENT_SECRET\": \"$CLIENT_SECRET\"," >> "$TEMP_FILE"
echo "    \"AZURE_AD_TENANT_ID\": \"$TENANT_ID\"," >> "$TEMP_FILE"
echo "    \"NEXTAUTH_URL\": \"$NEXTAUTH_URL\"," >> "$TEMP_FILE"
echo "    \"NEXTAUTH_SECRET\": \"$NEXTAUTH_SECRET\"," >> "$TEMP_FILE"
echo "    \"NODE_ENV\": \"production\"" >> "$TEMP_FILE"
echo "  }" >> "$TEMP_FILE"
echo "}" >> "$TEMP_FILE"

# Use az rest command to directly update the settings via REST API
echo -e "${YELLOW}Updating environment variables via REST API...${NC}"
az rest --method PUT \
  --url "https://management.azure.com/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$WEBAPP_NAME/config/appsettings?api-version=2021-02-01" \
  --body @"$TEMP_FILE"

# Clean up the temp file
rm "$TEMP_FILE"

echo -e "\n${GREEN}Environment variables set via REST API:${NC}"
echo -e "Client ID: $CLIENT_ID"
echo -e "Tenant ID: $TENANT_ID"
echo -e "NEXTAUTH_URL: $NEXTAUTH_URL"
echo -e "NEXTAUTH_SECRET: [NEWLY GENERATED]"
echo -e "Client Secret: [HIDDEN]"
echo -e "NODE_ENV: production"

echo -e "\n${YELLOW}Restarting webapp to apply changes...${NC}"
az webapp restart --name "$WEBAPP_NAME" --resource-group "$RESOURCE_GROUP"

echo -e "\n${GREEN}Done. Environment variables should now be properly set.${NC}"
echo "Please wait 1-2 minutes for the web app to restart and then check:"
echo "Diagnostic endpoint: https://$HOSTNAME/api/diag"