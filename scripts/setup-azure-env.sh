#!/bin/bash
# Script to check and set Azure App Service environment variables

echo "==================================================="
echo "    Azure App Service Environment Variable Check   "
echo "==================================================="

# Check if Azure CLI is installed and logged in
if ! command -v az &> /dev/null; then
  echo "❌ Azure CLI not installed. Please install it first."
  exit 1
fi

# Check if logged in to Azure
echo "Checking Azure login status..."
az account show &> /dev/null
if [ $? -ne 0 ]; then
  echo "❌ Not logged in to Azure. Please run 'az login' first."
  exit 1
fi
echo "✅ Azure CLI is installed and logged in"

# Request App Service details
read -p "Enter your Azure App Service name (e.g., thinkforward-dev): " APP_NAME
read -p "Enter your Azure Resource Group name: " RESOURCE_GROUP

# Check if App Service exists
echo "Checking if App Service exists..."
APP_CHECK=$(az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "name" -o tsv 2>/dev/null)
if [ -z "$APP_CHECK" ]; then
  echo "❌ App Service '$APP_NAME' not found in Resource Group '$RESOURCE_GROUP'"
  exit 1
fi
echo "✅ App Service '$APP_NAME' found"

# Get current settings
echo "Retrieving current environment variables..."
CURRENT_SETTINGS=$(az webapp config appsettings list --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" -o json)

# Function to check if a setting exists and its value
check_setting() {
  local name=$1
  local value=$(echo $CURRENT_SETTINGS | grep -o "\"name\": \"$name\",.*\"value\": \"[^\"]*" | grep -o "\"value\": \"[^\"]*" | cut -d'"' -f4)
  if [ -z "$value" ]; then
    echo "❌ $name is not set"
    return 1
  else
    if [[ "$value" == *"vault-reference"* ]]; then
      echo "✅ $name is set using Key Vault reference"
    else
      echo "✅ $name is set (length: ${#value} characters)"
    fi
    return 0
  fi
}

# Check required environment variables
echo
echo "Checking required environment variables:"
check_setting "NEXTAUTH_SECRET"
check_setting "NEXTAUTH_URL"
check_setting "AZURE_AD_CLIENT_ID"
check_setting "AZURE_AD_CLIENT_SECRET" 
check_setting "AZURE_AD_TENANT_ID"

# Load Azure credentials if available
CREDS_FILE="/Users/kngwa/Desktop/ThinkFoward/thinkForward/azure-credentials.json"
if [ -f "$CREDS_FILE" ]; then
  echo
  echo "Found Azure credentials file: $CREDS_FILE"
  echo "Would you like to use these credentials to update App Service settings? (y/n)"
  read use_creds
  
  if [[ "$use_creds" == "y" ]]; then
    echo "Using credentials from file..."
    if command -v jq &> /dev/null; then
      # Use jq if available
      CLIENT_ID=$(jq -r '.clientId' "$CREDS_FILE")
      CLIENT_SECRET=$(jq -r '.clientSecret' "$CREDS_FILE")
      TENANT_ID="common"
    else
      # Fallback to grep if jq is not available
      CLIENT_ID=$(grep -o '"clientId": "[^"]*' "$CREDS_FILE" | cut -d'"' -f4)
      CLIENT_SECRET=$(grep -o '"clientSecret": "[^"]*' "$CREDS_FILE" | cut -d'"' -f4)
      TENANT_ID="common"
    fi
    
    # Generate a random NEXTAUTH_SECRET if needed
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    # Use App Service URL for NEXTAUTH_URL
    NEXTAUTH_URL="https://$APP_NAME.azurewebsites.net"
    
    # Confirm values before setting
    echo
    echo "Will set the following values:"
    echo "AZURE_AD_CLIENT_ID: $CLIENT_ID"
    echo "AZURE_AD_CLIENT_SECRET: [SECRET - ${#CLIENT_SECRET} characters]"
    echo "AZURE_AD_TENANT_ID: $TENANT_ID"
    echo "NEXTAUTH_SECRET: [GENERATED - ${#NEXTAUTH_SECRET} characters]"
    echo "NEXTAUTH_URL: $NEXTAUTH_URL"
    echo
    echo "Proceed with updating App Service settings? (y/n)"
    read confirm
    
    if [[ "$confirm" == "y" ]]; then
      echo "Updating App Service settings..."
      az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings \
        AZURE_AD_CLIENT_ID="$CLIENT_ID" \
        AZURE_AD_CLIENT_SECRET="$CLIENT_SECRET" \
        AZURE_AD_TENANT_ID="$TENANT_ID" \
        NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
        NEXTAUTH_URL="$NEXTAUTH_URL"
      
      if [ $? -eq 0 ]; then
        echo "✅ App Service settings updated successfully"
        echo
        echo "Important next steps:"
        echo "1. Restart your App Service to apply the new settings:"
        echo "   az webapp restart --name \"$APP_NAME\" --resource-group \"$RESOURCE_GROUP\""
        echo
        echo "2. Make sure your Azure AD app registration has the following redirect URI:"
        echo "   $NEXTAUTH_URL/api/auth/callback/microsoft"
        echo
      else
        echo "❌ Failed to update App Service settings"
      fi
    else
      echo "Operation cancelled"
    fi
  fi
else
  echo
  echo "No Azure credentials file found at: $CREDS_FILE"
  echo "Would you like to manually enter the Azure AD credentials? (y/n)"
  read manual_input
  
  if [[ "$manual_input" == "y" ]]; then
    read -p "Enter AZURE_AD_CLIENT_ID: " CLIENT_ID
    read -p "Enter AZURE_AD_CLIENT_SECRET: " CLIENT_SECRET
    read -p "Enter AZURE_AD_TENANT_ID (leave blank for 'common'): " TENANT_ID
    TENANT_ID=${TENANT_ID:-common}
    
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    NEXTAUTH_URL="https://$APP_NAME.azurewebsites.net"
    
    echo
    echo "Will set the following values:"
    echo "AZURE_AD_CLIENT_ID: $CLIENT_ID"
    echo "AZURE_AD_CLIENT_SECRET: [SECRET - ${#CLIENT_SECRET} characters]"
    echo "AZURE_AD_TENANT_ID: $TENANT_ID"
    echo "NEXTAUTH_SECRET: [GENERATED - ${#NEXTAUTH_SECRET} characters]"
    echo "NEXTAUTH_URL: $NEXTAUTH_URL"
    echo
    echo "Proceed with updating App Service settings? (y/n)"
    read confirm
    
    if [[ "$confirm" == "y" ]]; then
      echo "Updating App Service settings..."
      az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings \
        AZURE_AD_CLIENT_ID="$CLIENT_ID" \
        AZURE_AD_CLIENT_SECRET="$CLIENT_SECRET" \
        AZURE_AD_TENANT_ID="$TENANT_ID" \
        NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
        NEXTAUTH_URL="$NEXTAUTH_URL"
      
      if [ $? -eq 0 ]; then
        echo "✅ App Service settings updated successfully"
        echo
        echo "Important next steps:"
        echo "1. Restart your App Service to apply the new settings:"
        echo "   az webapp restart --name \"$APP_NAME\" --resource-group \"$RESOURCE_GROUP\""
        echo
        echo "2. Make sure your Azure AD app registration has the following redirect URI:"
        echo "   $NEXTAUTH_URL/api/auth/callback/microsoft"
        echo
      else
        echo "❌ Failed to update App Service settings"
      fi
    else
      echo "Operation cancelled"
    fi
  fi
fi

echo "==================================================="