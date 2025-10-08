#!/bin/bash
# Script to clean up redundant environment variables on Azure Web App

set -e

# Configuration
APP_NAME="thinkforward-dev"
RESOURCE_GROUP="thinkforward-dev-rg"
VARIABLES_TO_DELETE=(
  "COSMOS_ENDPOINT"        # Redundant with COSMOS_DB_ENDPOINT
  "AZURE_KEY_VAULT_URL"    # Redundant with KEY_VAULT_URI
)

echo "Cleaning up redundant environment variables on Azure Web App: $APP_NAME"
echo "---------------------------------------------------------------------"

# Delete each variable
for var in "${VARIABLES_TO_DELETE[@]}"; do
  echo "Removing $var..."
  az webapp config appsettings delete --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --setting-names "$var"
done

echo "---------------------------------------------------------------------"
echo "Variable cleanup complete. Current settings:"
az webapp config appsettings list --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --output table