#!/bin/bash
# Script to set environment variables using the portal format (appsettings.json approach)

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting Azure AD environment variables using a JSON file approach...${NC}"

# Check if the client secret is provided as an argument or use the one from azure-credentials.json
if [ -z "$1" ]; then
  if [ -f "./azure-credentials.json" ]; then
    echo "Using client secret from azure-credentials.json"
    CLIENT_SECRET=$(grep -o "\"clientSecret\": \"[^\"]*\"" ./azure-credentials.json | cut -d'"' -f4)
    if [ -z "$CLIENT_SECRET" ]; then
      echo -e "${RED}Error: Could not extract client secret from azure-credentials.json${NC}"
      exit 1
    fi
  else
    echo -e "${RED}Error: No client secret provided and azure-credentials.json not found.${NC}"
    echo "Usage: $0 [client_secret]"
    exit 1
  fi
else
  CLIENT_SECRET="$1"
fi

# Get the current host name to use for NEXTAUTH_URL
HOSTNAME=$(az webapp show --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --query "defaultHostName" -o tsv)
if [ -z "$HOSTNAME" ]; then
  echo -e "${RED}Error: Could not retrieve webapp hostname${NC}"
  exit 1
fi

# Create a temporary JSON file with the settings
TEMP_FILE=$(mktemp)
cat > "$TEMP_FILE" << EOF
[
  {
    "name": "AZURE_AD_CLIENT_ID",
    "value": "3ca9d2ec-a691-4a58-9658-ecd4fb8d6918",
    "slotSetting": false
  },
  {
    "name": "AZURE_AD_CLIENT_SECRET",
    "value": "$CLIENT_SECRET",
    "slotSetting": false
  },
  {
    "name": "AZURE_AD_TENANT_ID",
    "value": "438537ce-67d5-4799-837e-aa8ba4ed01eb",
    "slotSetting": false
  },
  {
    "name": "NEXTAUTH_URL",
    "value": "https://$HOSTNAME",
    "slotSetting": false
  }
]
EOF

# Upload the JSON file to update settings
echo -e "${YELLOW}Uploading settings using JSON file...${NC}"
az webapp config appsettings set --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --settings @"$TEMP_FILE"

# Remove the temporary file
rm "$TEMP_FILE"

echo -e "\n${GREEN}Environment variables set using JSON file approach.${NC}"
echo -e "Client ID: 3ca9d2ec-a691-4a58-9658-ecd4fb8d6918"
echo -e "Tenant ID: 438537ce-67d5-4799-837e-aa8ba4ed01eb"
echo -e "NEXTAUTH_URL: https://$HOSTNAME"
echo -e "Client Secret: [HIDDEN]"

echo -e "\n${YELLOW}Restarting webapp to apply changes...${NC}"
az webapp restart --name "thinkforward-dev" --resource-group "thinkforward-dev-rg"

echo -e "\n${GREEN}Done. Environment variables should now be properly set.${NC}"
echo "To verify, after the app restarts, check: https://$HOSTNAME/api/diag"