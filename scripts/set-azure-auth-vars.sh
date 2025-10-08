#!/bin/bash
# Script to directly set Azure AD environment variables

# Check if the client secret is provided as an argument or use the one from azure-credentials.json
if [ -z "$1" ]; then
  if [ -f "./azure-credentials.json" ]; then
    echo "Using client secret from azure-credentials.json"
    CLIENT_SECRET=$(grep -o "\"clientSecret\": \"[^\"]*\"" ./azure-credentials.json | cut -d'"' -f4)
  else
    echo "Error: No client secret provided and azure-credentials.json not found."
    echo "Usage: $0 [client_secret]"
    exit 1
  fi
else
  CLIENT_SECRET="$1"
fi

echo "Setting Azure AD environment variables for thinkforward-dev..."
az webapp config appsettings set \
  --name "thinkforward-dev" \
  --resource-group "thinkforward-dev-rg" \
  --settings \
  AZURE_AD_CLIENT_ID="3ca9d2ec-a691-4a58-9658-ecd4fb8d6918" \
  AZURE_AD_CLIENT_SECRET="$CLIENT_SECRET" \
  AZURE_AD_TENANT_ID="438537ce-67d5-4799-837e-aa8ba4ed01eb"

echo "Restarting the web app..."
az webapp restart --name "thinkforward-dev" --resource-group "thinkforward-dev-rg"

echo "Done. Environment variables should be set now."