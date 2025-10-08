#!/bin/bash
# Script to set environment variables using direct ARM API call with explicit values

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting Azure AD environment variables directly with explicit values...${NC}"

# Define the environment variables with explicit values
# These are the values you provided
CLIENT_ID="3ca9d2ec-a691-4a58-9658-ecd4fb8d6918"
TENANT_ID="438537ce-67d5-4799-837e-aa8ba4ed01eb"

# Get client secret from file or ask for it
if [ -f "./azure-credentials.json" ]; then
  echo "Using client secret from azure-credentials.json"
  CLIENT_SECRET=$(grep -o "\"clientSecret\": \"[^\"]*\"" ./azure-credentials.json | cut -d'"' -f4)
  if [ -z "$CLIENT_SECRET" ]; then
    echo -e "${RED}Error: Could not extract client secret from azure-credentials.json${NC}"
    echo "Please provide the client secret as a parameter:"
    echo "./scripts/set-explicit-env-vars.sh <client_secret>"
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

# Get the current host name to use for NEXTAUTH_URL
HOSTNAME=$(az webapp show --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --query "defaultHostName" -o tsv)
if [ -z "$HOSTNAME" ]; then
  echo -e "${RED}Error: Could not retrieve webapp hostname${NC}"
  exit 1
fi

NEXTAUTH_URL="https://$HOSTNAME"

# Use the explicit values with az webapp config appsettings set
echo -e "${YELLOW}Setting environment variables with explicit values...${NC}"
az webapp config appsettings set \
  --name "thinkforward-dev" \
  --resource-group "thinkforward-dev-rg" \
  --settings \
  "AZURE_AD_CLIENT_ID=$CLIENT_ID" \
  "AZURE_AD_CLIENT_SECRET=$CLIENT_SECRET" \
  "AZURE_AD_TENANT_ID=$TENANT_ID" \
  "NEXTAUTH_URL=$NEXTAUTH_URL"

echo -e "\n${GREEN}Environment variables set with explicit values.${NC}"
echo -e "Client ID: $CLIENT_ID"
echo -e "Tenant ID: $TENANT_ID"
echo -e "NEXTAUTH_URL: $NEXTAUTH_URL"
echo -e "Client Secret: [HIDDEN]"

echo -e "\n${YELLOW}Restarting webapp to apply changes...${NC}"
az webapp restart --name "thinkforward-dev" --resource-group "thinkforward-dev-rg"

echo -e "\n${GREEN}Done. Environment variables should now be properly set.${NC}"
echo "To verify, use: ./scripts/check-auth-config.sh"