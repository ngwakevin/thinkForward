#!/bin/bash

# Script to debug NextAuth authentication in Azure
# Save this file to scripts/debug-nextauth.sh

echo "🔍 NextAuth Debug Script"
echo "----------------------"
echo "Date: $(date)"
echo "Hostname: $(hostname)"

# Check if running in Azure
if [ -n "$WEBSITE_HOSTNAME" ]; then
    echo "✅ Running in Azure App Service: $WEBSITE_HOSTNAME"
else
    echo "❓ Not running in Azure environment"
fi

echo ""
echo "Environment Variables:"
echo "--------------------"
echo "NODE_ENV: $NODE_ENV"
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo "NEXTAUTH_URL_INTERNAL: $NEXTAUTH_URL_INTERNAL"
echo "NEXTAUTH_SECRET set: $(if [ -n "$NEXTAUTH_SECRET" ]; then echo "Yes"; else echo "No"; fi)"
echo "AZURE_AD_CLIENT_ID set: $(if [ -n "$AZURE_AD_CLIENT_ID" ]; then echo "Yes"; else echo "No"; fi)"
echo "AZURE_AD_CLIENT_SECRET set: $(if [ -n "$AZURE_AD_CLIENT_SECRET" ]; then echo "Yes"; else echo "No"; fi)"
echo "AZURE_AD_TENANT_ID: $AZURE_AD_TENANT_ID"

echo ""
echo "Authentication Test:"
echo "-----------------"
echo "Testing if NextAuth endpoints are reachable..."

# Function to make a curl request and check response
test_endpoint() {
    local url=$1
    local description=$2
    
    echo "Testing $description: $url"
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" -ge 200 ] && [ "$status" -lt 400 ]; then
        echo "✅ Success: HTTP $status"
    else
        echo "❌ Failed: HTTP $status"
    fi
}

# Only run these tests if we're in Azure or have a valid NEXTAUTH_URL
if [ -n "$WEBSITE_HOSTNAME" ] || [ -n "$NEXTAUTH_URL" ]; then
    base_url=${NEXTAUTH_URL:-"https://$WEBSITE_HOSTNAME"}
    
    # Test the main NextAuth endpoint
    test_endpoint "$base_url/api/auth/session" "NextAuth session endpoint"
    test_endpoint "$base_url/api/auth/csrf" "CSRF token endpoint"
    
    echo ""
    echo "Checking for cookies in a test request..."
    curl -s -I "$base_url/api/auth/session" | grep -i "set-cookie"
else
    echo "Skipping endpoint tests - not running in a recognized environment"
fi

echo ""
echo "💡 Debug Recommendations:"
echo "1. Ensure NEXTAUTH_SECRET is identical across environments"
echo "2. Check that cookies are being set with the secure flag"
echo "3. Verify the callback URL matches your configuration"
echo "4. Look for CSRF token mismatches in the logs"