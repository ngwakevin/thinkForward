#!/bin/bash

# Deploy-Auto-Login-Fix.sh
# Script to deploy the auto-login fixes to Azure App Service

echo "===== Deploying Auto-Login Fix to Azure App Service ====="
echo "This script will deploy the latest auto-login fixes."

# Ensure we're logged into Azure
echo "Checking Azure login status..."
az account show > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Not logged into Azure. Please login first."
  az login
else
  echo "Already logged into Azure."
fi

# Set resource details
RESOURCE_GROUP="thinkforward-dev-rg"
APP_NAME="thinkforward-dev"

# Check that JWT_SECRET is set
echo "Checking JWT_SECRET environment variable..."
JWT_SECRET=$(az webapp config appsettings list --name $APP_NAME --resource-group $RESOURCE_GROUP --query "[?name=='JWT_SECRET'].value" -o tsv)

if [ -z "$JWT_SECRET" ]; then
  echo "JWT_SECRET is not set. Setting it now..."
  JWT_SECRET=$(openssl rand -hex 32)
  az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings JWT_SECRET="$JWT_SECRET"
  echo "JWT_SECRET has been set."
else
  echo "JWT_SECRET is already set."
fi

# Check for NextAuth URL
echo "Checking NEXTAUTH_URL environment variable..."
NEXTAUTH_URL=$(az webapp config appsettings list --name $APP_NAME --resource-group $RESOURCE_GROUP --query "[?name=='NEXTAUTH_URL'].value" -o tsv)

if [ -z "$NEXTAUTH_URL" ]; then
  echo "NEXTAUTH_URL is not set. Setting it now..."
  az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings NEXTAUTH_URL="https://$APP_NAME.azurewebsites.net"
  echo "NEXTAUTH_URL has been set."
else
  echo "NEXTAUTH_URL is set to: $NEXTAUTH_URL"
fi

# Build the project
echo "Building the project..."
npm run build

# Deploy to Azure
echo "Deploying to Azure App Service..."
az webapp deployment source config-zip --resource-group $RESOURCE_GROUP --name $APP_NAME --src ./deployment.zip

echo "Deployment complete!"
echo "Please test the auto-login functionality now."
echo "For debugging help, see the docs/auto-login-debug.md file."