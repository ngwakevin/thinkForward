#!/bin/bash
# Script to update Azure Web App settings with correct authentication variables

# Set the expected values
CLIENT_ID="d46ea9de-b544-4972-906e-72c6be61f1d6"
TENANT_ID="d46ea9de-b544-4972-906e-72c6be61f1d6"

# Define the web app name and resource group
# Replace these with your actual web app and resource group names
WEBAPP_NAME="thinkforward-dev"
RESOURCE_GROUP="thinkforward-rg"

echo "Updating Azure Web App settings for $WEBAPP_NAME"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in
echo "Checking Azure login status..."
az account show &> /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Not logged into Azure. Please run 'az login' first."
    exit 1
fi

echo "Setting Microsoft authentication environment variables..."

# Update the web app settings
az webapp config appsettings set --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP --settings \
  AZURE_AD_CLIENT_ID="$CLIENT_ID" \
  AZURE_AD_TENANT_ID="$TENANT_ID"

if [ $? -eq 0 ]; then
    echo "✅ Successfully updated app settings"
else
    echo "❌ Failed to update app settings"
    exit 1
fi

# Note: We don't set the client secret here as it should be done securely
echo "⚠️ IMPORTANT: You must set AZURE_AD_CLIENT_SECRET separately using the Azure portal for security reasons."
echo ""
echo "To set the client secret:"
echo "1. Go to the Azure portal: https://portal.azure.com"
echo "2. Navigate to your web app: $WEBAPP_NAME"
echo "3. Go to Configuration > Application settings"
echo "4. Add or update AZURE_AD_CLIENT_SECRET with the correct value"
echo "5. Save changes"

echo ""
echo "Restart the web app for changes to take effect:"
echo "az webapp restart --name $WEBAPP_NAME --resource-group $RESOURCE_GROUP"