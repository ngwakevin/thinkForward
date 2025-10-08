#!/bin/bash
# Script to set environment variables using Azure REST API

# Azure credentials from file
if [ ! -f "./azure-credentials.json" ]; then
    echo "Error: azure-credentials.json file not found"
    exit 1
fi

# Extract credentials
SUBSCRIPTION_ID=$(grep -o "\"subscriptionId\": \"[^\"]*\"" ./azure-credentials.json | cut -d'"' -f4)
CLIENT_ID=$(grep -o "\"clientId\": \"[^\"]*\"" ./azure-credentials.json | cut -d'"' -f4)
CLIENT_SECRET=$(grep -o "\"clientSecret\": \"[^\"]*\"" ./azure-credentials.json | cut -d'"' -f4)

if [ -z "$SUBSCRIPTION_ID" ] || [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
    echo "Error: Could not extract required credentials from azure-credentials.json"
    exit 1
fi

echo "Using credentials from azure-credentials.json..."
echo "- Subscription ID: ${SUBSCRIPTION_ID:0:8}..."
echo "- Client ID: ${CLIENT_ID:0:8}..."
echo "- Client Secret: [HIDDEN]"

# Set resource details
RESOURCE_GROUP="thinkforward-dev-rg"
WEBAPP_NAME="thinkforward-dev"

# Get access token
echo "Authenticating with Azure..."
ACCESS_TOKEN=$(az account get-access-token --query accessToken -o tsv)

if [ -z "$ACCESS_TOKEN" ]; then
    echo "Error: Failed to get Azure access token"
    exit 1
fi

echo "✅ Authentication successful"

# Define payload for app settings update
APP_SETTINGS_PAYLOAD=$(cat <<EOF
{
  "properties": {
    "AZURE_AD_CLIENT_ID": "$CLIENT_ID",
    "AZURE_AD_CLIENT_SECRET": "$CLIENT_SECRET",
    "AZURE_AD_TENANT_ID": "common"
  }
}
EOF
)

# Update app settings using REST API
echo "Updating app settings via REST API..."
RESPONSE=$(curl -s -X PATCH \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$APP_SETTINGS_PAYLOAD" \
  "https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$WEBAPP_NAME/config/appsettings?api-version=2021-02-01")

if [[ $RESPONSE == *"error"* ]]; then
    echo "Error updating app settings:"
    echo $RESPONSE | grep -o "\"message\":\"[^\"]*\"" | cut -d'"' -f4
    exit 1
fi

echo "✅ App settings updated successfully"

# Restart the web app to apply changes
echo "Restarting web app..."
az webapp restart --name "$WEBAPP_NAME" --resource-group "$RESOURCE_GROUP"

echo "✅ Web app restarted"
echo "Done! Environment variables have been set via the Azure REST API."
echo "Please check the application logs after a few minutes to verify."