#!/bin/bash
# Script to run Next.js with only Microsoft authentication and no database

echo "==================================================="
echo "     Setting up minimal Microsoft auth config      "
echo "==================================================="

# Set environment variables for Microsoft authentication
export NEXTAUTH_SECRET="minimal-dev-secret-$(date +%s)"
export NEXTAUTH_URL="http://localhost:3000"

# Use Azure credentials from file if available
CREDS_FILE="/Users/kngwa/Desktop/ThinkFoward/thinkForward/azure-credentials.json"
if [ -f "$CREDS_FILE" ]; then
  echo "Loading Azure credentials from $CREDS_FILE"
  if command -v jq &> /dev/null; then
    # Use jq if available
    CLIENT_ID=$(jq -r '.clientId' "$CREDS_FILE")
    CLIENT_SECRET=$(jq -r '.clientSecret' "$CREDS_FILE")
    TENANT_ID=$(jq -r '.tenantId' "$CREDS_FILE")
  else
    # Fallback to grep if jq is not available
    CLIENT_ID=$(grep -o '"clientId": "[^"]*' "$CREDS_FILE" | cut -d'"' -f4)
    CLIENT_SECRET=$(grep -o '"clientSecret": "[^"]*' "$CREDS_FILE" | cut -d'"' -f4)
    TENANT_ID=$(grep -o '"tenantId": "[^"]*' "$CREDS_FILE" | cut -d'"' -f4)
  fi
  
  export AZURE_AD_CLIENT_ID="$CLIENT_ID"
  export AZURE_AD_CLIENT_SECRET="$CLIENT_SECRET"
  export AZURE_AD_TENANT_ID="common"  # Use common for multi-tenant
else
  echo "No Azure credentials file found at $CREDS_FILE"
  echo "Please enter credentials manually:"
  read -p "AZURE_AD_CLIENT_ID: " CLIENT_ID
  read -p "AZURE_AD_CLIENT_SECRET: " CLIENT_SECRET
  
  export AZURE_AD_CLIENT_ID="$CLIENT_ID"
  export AZURE_AD_CLIENT_SECRET="$CLIENT_SECRET"
  export AZURE_AD_TENANT_ID="common"  # Use common for multi-tenant
fi

echo
echo "Running with:"
echo "• NEXTAUTH_URL: $NEXTAUTH_URL"
echo "• AZURE_AD_CLIENT_ID: $AZURE_AD_CLIENT_ID"
echo "• AZURE_AD_TENANT_ID: $AZURE_AD_TENANT_ID"
echo

# Log reminder about redirect URI
echo "Important: Make sure your Azure AD app has the following redirect URI:"
echo "$NEXTAUTH_URL/api/auth/callback/microsoft"
echo

# Change to project directory and run Next.js
cd "$(dirname "$0")/.."
echo "Starting Next.js development server..."
npm run dev