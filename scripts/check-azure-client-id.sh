#!/bin/bash
# Script to check if Azure AD client ID is correctly configured

echo "==================================================="
echo "   Azure AD Client ID Configuration Checker       "
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

# Get App Service URL
APP_URL=$(az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "defaultHostName" -o tsv)
EXPECTED_NEXTAUTH_URL="https://$APP_URL"

# Get current settings
echo "Retrieving current environment variables..."
CURRENT_SETTINGS=$(az webapp config appsettings list --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" -o json)

# Extract ClientID and NEXTAUTH_URL from settings
CLIENT_ID=$(echo $CURRENT_SETTINGS | grep -o "\"name\": \"AZURE_AD_CLIENT_ID\",.*\"value\": \"[^\"]*" | grep -o "\"value\": \"[^\"]*" | cut -d'"' -f4)
CURRENT_NEXTAUTH_URL=$(echo $CURRENT_SETTINGS | grep -o "\"name\": \"NEXTAUTH_URL\",.*\"value\": \"[^\"]*" | grep -o "\"value\": \"[^\"]*" | cut -d'"' -f4)

echo
echo "Current configuration:"
if [ -z "$CLIENT_ID" ]; then
  echo "❌ AZURE_AD_CLIENT_ID is not set in App Service settings"
else
  echo "✅ AZURE_AD_CLIENT_ID is set to: $CLIENT_ID"
fi

if [ -z "$CURRENT_NEXTAUTH_URL" ]; then
  echo "❌ NEXTAUTH_URL is not set in App Service settings"
else
  echo "✅ NEXTAUTH_URL is set to: $CURRENT_NEXTAUTH_URL"
  
  if [ "$CURRENT_NEXTAUTH_URL" != "$EXPECTED_NEXTAUTH_URL" ]; then
    echo "⚠️  Warning: NEXTAUTH_URL ($CURRENT_NEXTAUTH_URL) doesn't match App Service URL ($EXPECTED_NEXTAUTH_URL)"
  fi
fi

# Check if we can query Azure AD app registrations
echo
echo "Checking Azure AD app registrations..."
if [ -n "$CLIENT_ID" ]; then
  APP_INFO=$(az ad app show --id "$CLIENT_ID" --query "{displayName:displayName, redirectUris:web.redirectUris}" -o json 2>/dev/null)
  if [ $? -ne 0 ]; then
    echo "❌ Could not find Azure AD app with client ID: $CLIENT_ID"
    echo "   This could mean the app doesn't exist or you don't have permission to view it."
  else
    DISPLAY_NAME=$(echo $APP_INFO | grep -o "\"displayName\":[ ]*\"[^\"]*" | cut -d'"' -f3)
    echo "✅ Found Azure AD app: $DISPLAY_NAME"
    
    REDIRECT_URIS=$(echo $APP_INFO | grep -o "\"redirectUris\":[ ]*\[[^\]]*" | sed 's/.*\[//g' | tr -d ' ' | tr ',' '\n')
    EXPECTED_REDIRECT_URI="$CURRENT_NEXTAUTH_URL/api/auth/callback/microsoft"
    
    echo "   Redirect URIs configured:"
    FOUND_EXPECTED=false
    for uri in $REDIRECT_URIS; do
      uri=$(echo $uri | tr -d '"')
      echo "   - $uri"
      if [ "$uri" = "$EXPECTED_REDIRECT_URI" ]; then
        FOUND_EXPECTED=true
      fi
    done
    
    if [ "$FOUND_EXPECTED" = false ]; then
      echo "❌ Expected redirect URI not found: $EXPECTED_REDIRECT_URI"
      echo "   Please add this redirect URI to your Azure AD app registration."
    else
      echo "✅ Expected redirect URI found: $EXPECTED_REDIRECT_URI"
    fi
  fi
fi

echo
echo "Diagnostic information:"
echo "1. The error 'client_id is required' occurs when AZURE_AD_CLIENT_ID environment variable is:"
echo "   - Not set in App Service settings"
echo "   - Set incorrectly (wrong value)"
echo "   - Not being properly loaded by the application"
echo
echo "2. To fix this issue:"
echo "   - Ensure AZURE_AD_CLIENT_ID is properly set in App Service settings"
echo "   - Make sure the App Service has been restarted after updating settings"
echo "   - Verify that the Azure AD app registration exists and is correctly configured"
echo "   - Check that the redirect URI in Azure AD matches your NEXTAUTH_URL/api/auth/callback/microsoft"
echo
echo "3. Run the setup-azure-env.sh script to configure all required environment variables"
echo "==================================================="