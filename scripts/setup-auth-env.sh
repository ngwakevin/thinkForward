#!/bin/bash
# Script to set up local environment variables for authentication

echo "==================================================="
echo "    Setting Up Local Authentication Environment    "
echo "==================================================="

# Check if .env file exists
ENV_FILE=".env.local"
if [[ -f "$ENV_FILE" ]]; then
  echo "Found existing $ENV_FILE file. Do you want to:"
  echo "1. Update existing file"
  echo "2. Create a new file (backup existing)"
  echo "3. Exit"
  read -p "Choose an option (1-3): " option
  
  if [[ "$option" == "2" ]]; then
    backup_file="${ENV_FILE}.backup.$(date +%Y%m%d%H%M%S)"
    cp "$ENV_FILE" "$backup_file"
    echo "Created backup at $backup_file"
    > "$ENV_FILE" # Clear file
  elif [[ "$option" == "3" ]]; then
    echo "Exiting without changes"
    exit 0
  fi
else
  touch "$ENV_FILE"
fi

echo "Setting up authentication environment variables in $ENV_FILE"

# NextAuth configuration
read -p "Enter NEXTAUTH_SECRET (random string for encryption): " NEXTAUTH_SECRET
if [[ -z "$NEXTAUTH_SECRET" ]]; then
  NEXTAUTH_SECRET=$(openssl rand -base64 32)
  echo "Generated random NEXTAUTH_SECRET"
fi

read -p "Enter NEXTAUTH_URL (local development URL, e.g. http://localhost:3000): " NEXTAUTH_URL
if [[ -z "$NEXTAUTH_URL" ]]; then
  NEXTAUTH_URL="http://localhost:3000"
  echo "Using default NEXTAUTH_URL: $NEXTAUTH_URL"
fi

# Azure AD configuration
read -p "Enter AZURE_AD_CLIENT_ID (from Azure portal): " AZURE_AD_CLIENT_ID
read -p "Enter AZURE_AD_CLIENT_SECRET (from Azure portal): " AZURE_AD_CLIENT_SECRET
read -p "Enter AZURE_AD_TENANT_ID (usually 'common' for multi-tenant): " AZURE_AD_TENANT_ID
if [[ -z "$AZURE_AD_TENANT_ID" ]]; then
  AZURE_AD_TENANT_ID="common"
  echo "Using default AZURE_AD_TENANT_ID: $AZURE_AD_TENANT_ID"
fi

# Write to .env file
{
  echo "# NextAuth configuration"
  echo "NEXTAUTH_SECRET=\"$NEXTAUTH_SECRET\""
  echo "NEXTAUTH_URL=\"$NEXTAUTH_URL\""
  echo ""
  echo "# Azure AD configuration"
  echo "AZURE_AD_CLIENT_ID=\"$AZURE_AD_CLIENT_ID\""
  echo "AZURE_AD_CLIENT_SECRET=\"$AZURE_AD_CLIENT_SECRET\""
  echo "AZURE_AD_TENANT_ID=\"$AZURE_AD_TENANT_ID\""
} >> "$ENV_FILE"

echo
echo "Environment variables have been set in $ENV_FILE"
echo
echo "Important next steps:"
echo "1. Restart your Next.js development server"
echo "2. In the Azure portal (portal.azure.com):"
echo "   • Add the redirect URI: $NEXTAUTH_URL/api/auth/callback/microsoft"
echo "   • Ensure ID tokens are enabled under Authentication settings"
echo "   • Grant the required permissions (Microsoft Graph User.Read)"
echo
echo "The Microsoft sign-in button should now work properly!"
echo "==================================================="