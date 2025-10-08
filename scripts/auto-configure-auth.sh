#!/bin/bash
# Script to automatically set up auth environment variables from existing credentials

echo "==================================================="
echo "    Automatic Auth Environment Configuration      "
echo "==================================================="

# Define file paths
CREDS_FILE="/Users/kngwa/Desktop/ThinkFoward/thinkForward/azure-credentials.json"
ENV_FILE="/Users/kngwa/Desktop/ThinkFoward/thinkForward/.env.local"

# Check if credentials file exists
if [[ ! -f "$CREDS_FILE" ]]; then
  echo "❌ Azure credentials file not found at: $CREDS_FILE"
  exit 1
fi

# Extract values from the JSON file
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

# Generate a random NEXTAUTH_SECRET
NEXTAUTH_SECRET=$(openssl rand -base64 32)
# Use localhost:3000 as default NEXTAUTH_URL for local development
NEXTAUTH_URL="http://localhost:3000"

# Create or update the .env.local file
if [[ -f "$ENV_FILE" ]]; then
  # Backup existing file
  BACKUP_FILE="${ENV_FILE}.backup.$(date +%Y%m%d%H%M%S)"
  cp "$ENV_FILE" "$BACKUP_FILE"
  echo "✅ Created backup of existing .env.local at: $BACKUP_FILE"
fi

# Write the new environment variables
cat > "$ENV_FILE" << EOL
# NextAuth configuration
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL="${NEXTAUTH_URL}"

# Azure AD configuration 
AZURE_AD_CLIENT_ID="${CLIENT_ID}"
AZURE_AD_CLIENT_SECRET="${CLIENT_SECRET}"
# Using 'common' instead of specific tenant ID for multi-tenant support
AZURE_AD_TENANT_ID="common"
EOL

echo "✅ Created .env.local with authentication configuration"
echo
echo "Microsoft Authentication is now configured with:"
echo "  • Client ID: ${CLIENT_ID}"
echo "  • Tenant ID: 'common' (for multi-tenant support)"
echo "  • Redirect URI: ${NEXTAUTH_URL}/api/auth/callback/microsoft"
echo
echo "Important next steps:"
echo "1. Restart your Next.js development server"
echo "2. In the Azure portal (portal.azure.com):"
echo "   • Add the redirect URI: ${NEXTAUTH_URL}/api/auth/callback/microsoft"
echo "   • Ensure ID tokens are enabled under Authentication settings"
echo "   • Verify API permissions include Microsoft Graph User.Read"
echo
echo "The Microsoft sign-in button should now work properly!"
echo "==================================================="