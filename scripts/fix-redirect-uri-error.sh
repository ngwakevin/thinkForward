#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}    Fix Redirect URI Mismatch Error (AADSTS50011)  ${NC}"
echo -e "${BLUE}=================================================${NC}"

echo -e "${YELLOW}You're encountering the error:${NC}"
echo -e "${RED}AADSTS50011: The redirect URI 'https://thinkforward-dev.azurewebsites.net/.auth/login/aad/callback' does not match${NC}"
echo -e "${RED}the redirect URIs configured for the application.${NC}"

echo -e "\n${GREEN}This error occurs because you appear to be using App Service Authentication (Easy Auth)${NC}"
echo -e "${GREEN}alongside NextAuth.js, and the App Service Authentication redirect URI is not registered.${NC}"

echo -e "\n${YELLOW}To fix this issue, follow these steps:${NC}"
echo -e "\n${BLUE}1. Go to the Azure Portal:${NC} https://portal.azure.com"
echo -e "\n${BLUE}2. Navigate to Azure Active Directory → App registrations${NC}"
echo -e "\n${BLUE}3. Select your app registration:${NC} (Client ID: 3ca9d2ec-a691-4a58-9658-ecd4fb8d6918)"
echo -e "\n${BLUE}4. Go to Authentication in the left menu${NC}"
echo -e "\n${BLUE}5. In the 'Platform configurations' section under 'Web', add these redirect URIs:${NC}"

echo -e "   ☑ ${GREEN}https://thinkforward-dev.azurewebsites.net/.auth/login/aad/callback${NC}"
echo -e "   ☑ ${GREEN}https://thinkforward-dev.azurewebsites.net/api/auth/callback/microsoft${NC}"

echo -e "\n${BLUE}6. If you're using Easy Auth in App Service, also configure:${NC}"
echo -e "   - Go to your App Service in Azure Portal"
echo -e "   - Navigate to 'Authentication / Authorization'"
echo -e "   - Make sure settings are properly configured for Microsoft authentication"

echo -e "\n${BLUE}7. Click Save at the top of the page${NC}"

echo -e "\n${YELLOW}Additional considerations:${NC}"
echo -e "1. You appear to be using both App Service Authentication and NextAuth.js for Microsoft authentication."
echo -e "2. This can cause conflicts - consider using only one of these authentication methods."
echo -e "3. If you want to use NextAuth.js (recommended for your app), you may want to disable App Service Authentication."

echo -e "\n${GREEN}To disable App Service Authentication and rely solely on NextAuth.js:${NC}"
echo -e "1. Go to your App Service in Azure Portal"
echo -e "2. Navigate to Authentication / Authorization"
echo -e "3. Set 'App Service Authentication' to 'Off'"
echo -e "4. Click Save"

echo -e "\n${BLUE}=================================================${NC}"