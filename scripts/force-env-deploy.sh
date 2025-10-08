#!/bin/bash
# Script to force a clean deployment with environment variables

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Performing a clean deployment with environment variables...${NC}"

# Define variables
RESOURCE_GROUP="thinkforward-dev-rg"
WEBAPP_NAME="thinkforward-dev"
CLIENT_ID="3ca9d2ec-a691-4a58-9658-ecd4fb8d6918"
TENANT_ID="438537ce-67d5-4799-837e-aa8ba4ed01eb"

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

# Generate a NEXTAUTH_SECRET if not provided
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Create a .env file for deployment
echo -e "${YELLOW}Creating a .env file for deployment...${NC}"
cat > ./.env << EOF
AZURE_AD_CLIENT_ID=$CLIENT_ID
AZURE_AD_CLIENT_SECRET=$CLIENT_SECRET
AZURE_AD_TENANT_ID=$TENANT_ID
NEXTAUTH_URL=$NEXTAUTH_URL
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NODE_ENV=production
EOF

# First, set the environment variables directly in the Azure Web App
echo -e "${YELLOW}Setting environment variables in Azure Web App...${NC}"
az webapp config appsettings set \
  --name "$WEBAPP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --settings \
  AZURE_AD_CLIENT_ID="$CLIENT_ID" \
  AZURE_AD_CLIENT_SECRET="$CLIENT_SECRET" \
  AZURE_AD_TENANT_ID="$TENANT_ID" \
  NEXTAUTH_URL="$NEXTAUTH_URL" \
  NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  NODE_ENV="production"

echo -e "\n${YELLOW}Restarting web app to apply environment variables...${NC}"
az webapp restart --name "$WEBAPP_NAME" --resource-group "$RESOURCE_GROUP"

echo -e "\n${GREEN}Environment variables set in Azure Web App:${NC}"
echo -e "Client ID: $CLIENT_ID"
echo -e "Tenant ID: $TENANT_ID"
echo -e "NEXTAUTH_URL: $NEXTAUTH_URL"
echo -e "Client Secret: [HIDDEN]"

echo -e "\n${YELLOW}Wait for 60 seconds to allow restart to complete...${NC}"
sleep 60

echo -e "\n${YELLOW}Checking current environment variables...${NC}"
curl -s "https://$HOSTNAME/api/diag"

echo -e "\n\n${GREEN}Deployment complete!${NC}"
echo -e "Please verify authentication now works at: https://$HOSTNAME"