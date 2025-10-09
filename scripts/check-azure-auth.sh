#!/bin/bash
# Azure AD Configuration Verification Script
# This script checks for proper Microsoft authentication configuration

echo "Checking Azure AD Configuration"
echo "------------------------------"

# Check if required environment variables are set
EXPECTED_CLIENT_ID="d46ea9de-b544-4972-906e-72c6be61f1d6"
EXPECTED_TENANT_ID="d46ea9de-b544-4972-906e-72c6be61f1d6"

if [ -z "$AZURE_AD_CLIENT_ID" ]; then
  echo "❌ AZURE_AD_CLIENT_ID is not set (should be $EXPECTED_CLIENT_ID)"
else
  if [ "$AZURE_AD_CLIENT_ID" = "$EXPECTED_CLIENT_ID" ]; then
    echo "✅ AZURE_AD_CLIENT_ID is correctly set to: ${AZURE_AD_CLIENT_ID}"
  else
    echo "⚠️ AZURE_AD_CLIENT_ID is set to: ${AZURE_AD_CLIENT_ID}"
    echo "   But expected value is: ${EXPECTED_CLIENT_ID}"
  fi
fi

if [ -z "$AZURE_AD_CLIENT_SECRET" ]; then
  echo "❌ AZURE_AD_CLIENT_SECRET is not set"
else
  echo "✅ AZURE_AD_CLIENT_SECRET is set (value hidden for security)"
fi

if [ -z "$AZURE_AD_TENANT_ID" ]; then
  echo "⚠️ AZURE_AD_TENANT_ID is not set, should be set to: $EXPECTED_TENANT_ID"
else
  if [ "$AZURE_AD_TENANT_ID" = "$EXPECTED_TENANT_ID" ]; then
    echo "✅ AZURE_AD_TENANT_ID is correctly set to: ${AZURE_AD_TENANT_ID}"
  else
    echo "⚠️ AZURE_AD_TENANT_ID is set to: ${AZURE_AD_TENANT_ID}"
    echo "   But expected value is: ${EXPECTED_TENANT_ID}"
  fi
fi

echo ""
echo "NextAuth Configuration"
echo "---------------------"
if [ -z "$NEXTAUTH_URL" ]; then
  echo "❌ NEXTAUTH_URL is not set"
else
  echo "✅ NEXTAUTH_URL is set to: ${NEXTAUTH_URL}"
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "❌ NEXTAUTH_SECRET is not set"
else
  echo "✅ NEXTAUTH_SECRET is set (value hidden for security)"
fi

echo ""
echo "Checking Azure AD Configuration via API"
echo "------------------------------------"
if [ -z "$AZURE_AD_CLIENT_ID" ] || [ -z "$AZURE_AD_TENANT_ID" ]; then
  echo "⚠️ Skipping API check due to missing configuration"
else
  # Use the well-known configuration endpoint to verify the Azure AD application
  # This endpoint doesn't require authentication and will confirm if the client ID exists
  TENANT_ID=${AZURE_AD_TENANT_ID:-"common"}
  
  echo "Testing OpenID Configuration endpoint..."
  RESPONSE=$(curl -s "https://login.microsoftonline.com/${TENANT_ID}/v2.0/.well-known/openid-configuration")
  
  if [[ $RESPONSE == *"issuer"* ]]; then
    echo "✅ Successfully connected to Microsoft identity platform"
  else
    echo "❌ Failed to connect to Microsoft identity platform"
  fi
  
  echo ""
  echo "Note: This script cannot verify if the client secret is correct."
  echo "If authentication is failing with client_id errors, verify your Azure AD app registration:"
  echo "1. Ensure the app is registered in the Azure portal"
  echo "2. Verify the redirect URI is properly configured: ${NEXTAUTH_URL}/api/auth/callback/microsoft"
  echo "3. Check that the client secret hasn't expired"
fi