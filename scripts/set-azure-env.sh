#!/bin/bash

# Script to set Azure App Service environment variables using the Azure CLI

# Set variables
APP_NAME="thinkforward-dev"
RESOURCE_GROUP="your-resource-group-name"  # You'll need to update this

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "Azure CLI is not installed. Please install it first."
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
echo "Checking Azure login status..."
az account show &> /dev/null
if [ $? -ne 0 ]; then
    echo "You are not logged in to Azure. Please login first."
    echo "Run: az login"
    exit 1
fi

# Confirm the resource group name
read -p "Enter your Azure Resource Group name [$RESOURCE_GROUP]: " input
RESOURCE_GROUP=${input:-$RESOURCE_GROUP}

# Confirm the app name
read -p "Enter your Azure Web App name [$APP_NAME]: " input
APP_NAME=${input:-$APP_NAME}

# Check if the app exists
az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null
if [ $? -ne 0 ]; then
    echo "Error: App '$APP_NAME' does not exist in resource group '$RESOURCE_GROUP'."
    exit 1
fi

echo "Setting environment variables for $APP_NAME..."

# Ask for Cosmos DB Endpoint
read -p "Enter your COSMOS_DB_ENDPOINT: " COSMOS_DB_ENDPOINT
if [ -z "$COSMOS_DB_ENDPOINT" ]; then
    echo "COSMOS_DB_ENDPOINT is required."
    exit 1
fi

# Ask for Cosmos DB Key
read -p "Enter your COSMOS_DB_KEY: " COSMOS_DB_KEY
if [ -z "$COSMOS_DB_KEY" ]; then
    echo "COSMOS_DB_KEY is required."
    exit 1
fi

# Ask for Key Vault URI
read -p "Enter your KEY_VAULT_URI: " KEY_VAULT_URI
if [ -z "$KEY_VAULT_URI" ]; then
    echo "KEY_VAULT_URI is required."
    exit 1
fi

# Ask for App Insights Connection String
read -p "Enter your APP_INSIGHTS_CONNECTION_STRING: " APP_INSIGHTS_CONNECTION_STRING
if [ -z "$APP_INSIGHTS_CONNECTION_STRING" ]; then
    echo "APP_INSIGHTS_CONNECTION_STRING is required."
    exit 1
fi

# Set environment variables in Azure App Service
echo "Setting COSMOS_DB_ENDPOINT..."
az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings COSMOS_DB_ENDPOINT="$COSMOS_DB_ENDPOINT"

echo "Setting COSMOS_DB_KEY..."
az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings COSMOS_DB_KEY="$COSMOS_DB_KEY"

echo "Setting KEY_VAULT_URI..."
az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings KEY_VAULT_URI="$KEY_VAULT_URI"

echo "Setting APP_INSIGHTS_CONNECTION_STRING..."
az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings APP_INSIGHTS_CONNECTION_STRING="$APP_INSIGHTS_CONNECTION_STRING"

echo "Environment variables have been set for $APP_NAME"
echo "You can verify them in the Azure Portal under App Service > Configuration > Application settings"