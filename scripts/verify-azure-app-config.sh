#!/bin/bash
# Script to guide through Azure AD app configuration verification

echo "==================================================="
echo "       Azure AD App Configuration Checker          "
echo "==================================================="

# Load environment variables from .env.local if it exists
ENV_FILE="/Users/kngwa/Desktop/ThinkFoward/thinkForward/.env.local"
if [[ -f "$ENV_FILE" ]]; then
  echo "Loading environment variables from $ENV_FILE"
  source "$ENV_FILE"
else
  echo "❌ Environment file not found: $ENV_FILE"
  echo "Run auto-configure-auth.sh first to set up environment variables"
  exit 1
fi

# Display the configuration
echo
echo "Current Authentication Configuration:"
echo "• Client ID: $AZURE_AD_CLIENT_ID"
echo "• Tenant ID: $AZURE_AD_TENANT_ID"
echo "• Redirect URI: $NEXTAUTH_URL/api/auth/callback/microsoft"
echo

echo "To verify your Azure AD app configuration:"
echo "1. Go to the Azure portal: https://portal.azure.com"
echo "2. Navigate to Azure Active Directory → App registrations"
echo "3. Find your app with Client ID: $AZURE_AD_CLIENT_ID"
echo "4. Click on it to view the app details"
echo
echo "==== Essential Settings to Verify ===="
echo
echo "1. Authentication Tab:"
echo "   ☐ Platform: Web"
echo "   ☐ Redirect URI includes: $NEXTAUTH_URL/api/auth/callback/microsoft"
echo "   ☐ ID tokens are enabled (check 'ID tokens' under 'Implicit grant and hybrid flows')"
echo
echo "2. API permissions Tab:"
echo "   ☐ Microsoft Graph User.Read permission is granted"
echo "   ☐ Admin consent is granted if needed"
echo
echo "3. Certificates & secrets Tab:"
echo "   ☐ Client secret is still valid (not expired)"
echo
echo "4. Manifest Tab:"
echo "   ☐ 'oauth2AllowIdTokenImplicitFlow': true"
echo "   ☐ 'signInAudience' is appropriate ('AzureADMyOrg' for single tenant, 'AzureADandPersonalMicrosoftAccount' or 'AzureADMultipleOrgs' for multi-tenant)"
echo
echo "==== After Verification ===="
echo "If any settings are incorrect, fix them in the Azure portal."
echo "After making changes, restart your Next.js development server."
echo "==================================================="