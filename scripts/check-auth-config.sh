#!/bin/bash
# Script to check authentication configuration

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "==================================================="
echo "      Azure Authentication Configuration Checker   "
echo "==================================================="

# Get web app hostname
echo -e "${YELLOW}Fetching web app information...${NC}"
HOSTNAME=$(az webapp show --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --query "defaultHostName" -o tsv)
if [ -z "$HOSTNAME" ]; then
    echo -e "${RED}Error: Could not retrieve webapp hostname${NC}"
fi

echo -e "\n${YELLOW}Web App URL:${NC} https://$HOSTNAME"
echo -e "${YELLOW}Expected Redirect URI:${NC} https://$HOSTNAME/api/auth/callback/microsoft\n"

# Check environment variables on the Azure Web App
echo -e "${YELLOW}Checking Azure Web App environment variables...${NC}"
echo "Getting settings from Azure App Service:"

# Get Azure AD settings from the web app
WEBAPP_SETTINGS=$(az webapp config appsettings list --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --query "[?name.contains(@, 'AZURE_AD') || name.contains(@, 'NEXTAUTH')].{name:name,value:value}" -o json)

# Process and display the settings
echo "$WEBAPP_SETTINGS" | jq -r '.[] | "\(.name): \(.value)"' | while read -r line; do
    name=$(echo "$line" | cut -d':' -f1)
    value=$(echo "$line" | cut -d':' -f2- | sed 's/^ //')
    
    # Hide actual secrets but show if they're set
    if [[ "$name" == *"SECRET"* ]]; then
        if [ -z "$value" ] || [ "$value" = "null" ]; then
            echo -e "❌ $name: ${RED}not set${NC}"
        else
            echo -e "✅ $name: ${GREEN}set (hidden)${NC}"
        fi
    else
        if [ -z "$value" ] || [ "$value" = "null" ]; then
            echo -e "❌ $name: ${RED}not set${NC}"
        else
            echo -e "✅ $name: ${GREEN}$value${NC}"
        fi
    fi
done

echo -e "\n${YELLOW}Additional Authentication Checks:${NC}"
echo "1. Verify your Azure AD app registration in portal.azure.com:"
echo "   • Client ID matches AZURE_AD_CLIENT_ID (should be 3ca9d2ec-a691-4a58-9658-ecd4fb8d6918)"
echo "   • Application name: learnapp"
echo "   • Redirect URI includes https://$HOSTNAME/api/auth/callback/microsoft"
echo "   • ID tokens are enabled (Authentication -> Enable ID tokens)"
echo "   • Required permissions are granted (User.Read)"
echo "   • Supported account types is set to 'Multiple organizations'"

echo -e "\n2. Check for common issues:"
echo "   • If you see 'client_id is required', environment variables aren't being loaded correctly"
echo "   • If you see 'AADSTS...' errors, there's an issue with your Azure AD configuration"
echo "   • Browser console may provide more detailed error information"

echo -e "\n3. Check App Service Authentication settings:"
echo "   • If App Service Authentication is enabled, it might interfere with NextAuth"
echo "   • Make sure the app restart has completed after setting variables"

echo -e "\n${GREEN}Current Configuration:${NC}"
echo "• Client ID: 3ca9d2ec-a691-4a58-9658-ecd4fb8d6918"
echo "• Tenant ID: 438537ce-67d5-4799-837e-aa8ba4ed01eb"
echo "• Display name: learnapp"
echo "• Supported account types: Multiple organizations"
echo "==================================================="