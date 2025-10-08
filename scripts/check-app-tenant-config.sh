#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}     Azure AD App Registration Tenant Check       ${NC}"
echo -e "${BLUE}=================================================${NC}"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
echo "Checking Azure login status..."
az account show &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}You are not logged in to Azure. Please login first.${NC}"
    echo "Run: az login"
    exit 1
fi

# Ask for App Registration Client ID
echo -e "${YELLOW}Enter your App Registration Client ID:${NC}"
read CLIENT_ID

if [ -z "$CLIENT_ID" ]; then
    echo -e "${RED}Error: Client ID is required.${NC}"
    exit 1
fi

echo -e "${GREEN}Checking Azure AD app registration (Client ID: ${CLIENT_ID})...${NC}"

# Get app registration details
APP_INFO=$(az ad app show --id "$CLIENT_ID" 2>/dev/null)

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Could not find app registration with Client ID: ${CLIENT_ID}${NC}"
    echo -e "${YELLOW}Possible reasons:${NC}"
    echo -e "1. You're not logged in to the tenant where the app is registered"
    echo -e "2. The Client ID is incorrect"
    echo -e "3. You don't have permissions to view this app registration"
    
    echo -e "\n${YELLOW}To verify your current tenant:${NC}"
    az account show --query "tenantId" -o tsv
    
    exit 1
fi

# Check if the app is multi-tenant
SUPPORTED_ACCOUNT_TYPES=$(echo "$APP_INFO" | grep -o '"signInAudience": "[^"]*"' | cut -d'"' -f4)

echo -e "\n${GREEN}App Registration Details:${NC}"
echo -e "${YELLOW}Client ID:${NC} $CLIENT_ID"
echo -e "${YELLOW}Supported Account Types:${NC} $SUPPORTED_ACCOUNT_TYPES"

if [[ "$SUPPORTED_ACCOUNT_TYPES" == "AzureADMultipleOrgs" ]] || [[ "$SUPPORTED_ACCOUNT_TYPES" == "AzureADandPersonalMicrosoftAccount" ]]; then
    echo -e "\n${GREEN}✅ This app is already configured for multi-tenant support.${NC}"
    echo -e "The app can accept sign-ins from users in any Azure AD tenant."
else
    echo -e "\n${RED}⚠️ This app is configured as single-tenant only.${NC}"
    echo -e "The app can only accept sign-ins from users in the tenant where it was registered."
    echo -e "\n${YELLOW}To enable multi-tenant support, you need to:${NC}"
    echo -e "1. Go to Azure Portal: https://portal.azure.com"
    echo -e "2. Navigate to 'App registrations' and select your app"
    echo -e "3. Go to 'Authentication' > 'Supported account types'"
    echo -e "4. Select 'Accounts in any organizational directory (Any Azure AD directory - Multitenant)'"
    echo -e "5. Click 'Save'"
    
    echo -e "\n${YELLOW}After making this change, update your .env.local file and Azure App Service settings:${NC}"
    echo -e "AZURE_AD_TENANT_ID=\"common\""
fi

# Check redirect URIs
REDIRECT_URIS=$(echo "$APP_INFO" | grep -o '"replyUrls": \[[^]]*\]' | grep -o '"[^"]*"' | grep -v "replyUrls" | tr -d '"' | grep -v "^$")

echo -e "\n${GREEN}Configured Redirect URIs:${NC}"
if [ -z "$REDIRECT_URIS" ]; then
    echo -e "${RED}No redirect URIs found!${NC}"
    echo -e "${YELLOW}You need to add your application's callback URL to the app registration.${NC}"
else
    echo "$REDIRECT_URIS" | while read -r uri; do
        echo -e "- $uri"
    done
fi

echo -e "\n${YELLOW}Your application's callback URL should be:${NC}"
echo -e "https://thinkforward-dev.azurewebsites.net/api/auth/callback/microsoft"
echo -e "\n${YELLOW}If this URL is not in the list above, add it in the Azure Portal under App registrations > Authentication.${NC}"

echo -e "\n${BLUE}=================================================${NC}"