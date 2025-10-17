#!/bin/bash

# Script to check for NEXTAUTH_SECRET in Azure App Service
# Save this file to scripts/check-nextauth-secret.sh

echo "🔐 Checking NEXTAUTH_SECRET configuration"
echo "-----------------------------------------"

# Check if running in Azure
if [ -n "$WEBSITE_HOSTNAME" ]; then
    echo "✅ Running in Azure App Service: $WEBSITE_HOSTNAME"
    
    # Check if NEXTAUTH_SECRET is set
    if [ -n "$NEXTAUTH_SECRET" ]; then
        # Don't show the actual secret, just that it's set and its length
        SECRET_LENGTH=${#NEXTAUTH_SECRET}
        echo "✅ NEXTAUTH_SECRET is set (length: $SECRET_LENGTH)"
        
        # Show the first and last few characters to help verify it's the right value
        # without exposing the full secret
        FIRST_CHARS=$(echo "$NEXTAUTH_SECRET" | cut -c1-3)
        LAST_CHARS=$(echo "$NEXTAUTH_SECRET" | rev | cut -c1-3 | rev)
        echo "   First 3 chars: $FIRST_CHARS..."
        echo "   Last 3 chars: ...$LAST_CHARS"
    else
        echo "❌ NEXTAUTH_SECRET is NOT set in environment"
        echo "   This will cause authentication to fail"
        echo "   Please set NEXTAUTH_SECRET in Azure App Service Configuration"
    fi
else
    echo "❓ Not running in Azure environment"
    echo "   WEBSITE_HOSTNAME is not set"
fi

echo ""
echo "NextAuth URL Configuration:"
echo "--------------------------"
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo "NEXTAUTH_URL_INTERNAL: $NEXTAUTH_URL_INTERNAL"
echo ""

# Additional checks for other environment variables that might affect authentication
echo "Other Authentication Environment Variables:"
echo "----------------------------------------"
echo "NODE_ENV: $NODE_ENV"
echo "VERCEL_URL: $VERCEL_URL"
echo "AZURE_AD_CLIENT_ID: ${AZURE_AD_CLIENT_ID:0:6}... (truncated for security)"
echo "AZURE_AD_CLIENT_SECRET: ${AZURE_AD_CLIENT_SECRET:+Set (hidden)}"
echo "AZURE_AD_TENANT_ID: $AZURE_AD_TENANT_ID"

echo ""
echo "💡 Recommendation:"
echo "If auto-login is still not working, make sure to:"
echo "1. Set NEXTAUTH_SECRET in Azure App Service Configuration"
echo "2. Restart the App Service after updating the settings"
echo "3. Check browser developer tools for any cookie-related errors"