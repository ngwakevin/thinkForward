#!/bin/bash
# create-run-from-package.sh - Sets up Azure App Service for run-from-package mode

# This script configures Azure App Service to run from a package
# This approach is more reliable than ZIP deploy for Node.js applications

# Replace these variables with your actual resource names
RESOURCE_GROUP="your-resource-group"
APP_NAME="your-app-name"

echo "Configuring Azure App Service for run-from-package mode..."

# Set WEBSITE_RUN_FROM_PACKAGE=1
az webapp config appsettings set --resource-group "$RESOURCE_GROUP" --name "$APP_NAME" --settings WEBSITE_RUN_FROM_PACKAGE=1

# Optional: Set Node.js version
az webapp config set --resource-group "$RESOURCE_GROUP" --name "$APP_NAME" --node-version "20-lts"

# Optional: Set startup command
az webapp config set --resource-group "$RESOURCE_GROUP" --name "$APP_NAME" --startup-file "server.js"

# Optional: Set logging
az webapp log config --resource-group "$RESOURCE_GROUP" --name "$APP_NAME" --application-logging filesystem --detailed-error-messages true --web-server-logging filesystem

echo "App Service configured for run-from-package mode."
echo "Next steps:"
echo "1. Run scripts/prepare-azure-deploy.sh to create deployment package"
echo "2. Upload the package to Azure App Service"
echo ""