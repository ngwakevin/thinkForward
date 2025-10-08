#!/bin/bash

# Script to update NextAuth Secret in Azure App Service
# Run this script after logging into Azure CLI (az login)

# Check if webapp name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <webapp-name> [resource-group]"
  echo "Example: $0 thinkforward-app myResourceGroup"
  exit 1
fi

WEBAPP_NAME=$1
RESOURCE_GROUP=${2:-$(az webapp list --query "[?name=='$WEBAPP_NAME'].resourceGroup" -o tsv)}

if [ -z "$RESOURCE_GROUP" ]; then
  echo "Error: Could not determine resource group for webapp $WEBAPP_NAME"
  echo "Please provide the resource group as the second parameter"
  exit 1
fi

# Load the NextAuth secret from .env.local or use the one from the script
NEXTAUTH_SECRET=$(grep NEXTAUTH_SECRET .env.local | cut -d'=' -f2)

if [ -z "$NEXTAUTH_SECRET" ]; then
  # Use the secret from .env.local
  NEXTAUTH_SECRET="2f1d4a3e5e7c9b1d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6"
  echo "Using hardcoded NextAuth secret"
else
  echo "Using NextAuth secret from .env.local"
fi

echo "Updating Azure App Service settings..."

# Update the app settings
az webapp config appsettings set \
  --name "$WEBAPP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --settings "NEXTAUTH_SECRET=$NEXTAUTH_SECRET" \
  --output table

echo "Done! NEXTAUTH_SECRET has been updated in Azure App Service settings."