#!/bin/bash
# Script to check authentication configuration

echo "==================================================="
echo "      Authentication Configuration Checker         "
echo "==================================================="

# Check required environment variables
echo "Checking environment variables..."

# Function to check if env var exists
check_env() {
  local var_name="$1"
  local value="${!var_name}"
  
  if [[ -z "$value" ]]; then
    echo "❌ $var_name is missing"
    return 1
  else
    echo "✅ $var_name is set (length: ${#value} chars)"
    return 0
  fi
}

# Check NextAuth environment variables
echo "NextAuth Environment Variables:"
check_env "NEXTAUTH_SECRET"
check_env "NEXTAUTH_URL" 
if [[ -n "$NEXTAUTH_URL" ]]; then
  echo "   Redirect URI: ${NEXTAUTH_URL}/api/auth/callback/microsoft"
fi

# Check Azure AD environment variables
echo
echo "Azure AD Environment Variables:"
check_env "AZURE_AD_CLIENT_ID"
check_env "AZURE_AD_CLIENT_SECRET"
check_env "AZURE_AD_TENANT_ID"

echo
echo "Additional Authentication Checks:"
echo "1. Verify your Azure AD app registration in portal.azure.com:"
echo "   • Client ID matches AZURE_AD_CLIENT_ID"
echo "   • Redirect URI includes ${NEXTAUTH_URL}/api/auth/callback/microsoft"
echo "   • ID tokens are enabled (Authentication -> Enable ID tokens)"
echo "   • Required permissions are granted"
echo "   • Implicit flow is enabled if needed"
echo
echo "2. Browser console may provide more detailed error information."
echo "   Use the updated sign-in component to see more details."
echo
echo "3. Check App Service Authentication settings:"
echo "   • If App Service Authentication is enabled, it might interfere with NextAuth"
echo "==================================================="