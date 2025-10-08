#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}     Fix AADSTS700054 ID Token Error Guide       ${NC}"
echo -e "${BLUE}=================================================${NC}"

echo -e "${YELLOW}You're encountering the error:${NC}"
echo -e "${RED}AADSTS700054: response_type 'id_token' is not enabled for the application.${NC}"

echo -e "\n${GREEN}This error occurs because your app is trying to use the ID token response type,${NC}"
echo -e "${GREEN}but this is not enabled in your Azure AD app registration.${NC}"

echo -e "\n${YELLOW}To fix this issue, follow these steps:${NC}"
echo -e "\n${BLUE}1. Go to the Azure Portal:${NC} https://portal.azure.com"
echo -e "\n${BLUE}2. Navigate to Azure Active Directory → App registrations${NC}"
echo -e "\n${BLUE}3. Select your app registration:${NC} (Client ID: 3ca9d2ec-a691-4a58-9658-ecd4fb8d6918)"
echo -e "\n${BLUE}4. Go to Authentication in the left menu${NC}"
echo -e "\n${BLUE}5. In the 'Implicit grant and hybrid flows' section, check BOTH:${NC}"
echo -e "   ☑ ${GREEN}Access tokens (used for implicit flows)${NC}"
echo -e "   ☑ ${GREEN}ID tokens (used for implicit and hybrid flows)${NC}"
echo -e "\n${BLUE}6. Click Save at the top of the page${NC}"

echo -e "\n${YELLOW}After making these changes, wait a few minutes for the changes to propagate,${NC}"
echo -e "${YELLOW}then try signing in again.${NC}"

echo -e "\n${GREEN}Additional information:${NC}"
echo -e "NextAuth.js with Azure AD provider uses the PKCE authorization code flow with ID tokens,"
echo -e "which requires the 'ID tokens' option to be enabled in your app registration."

echo -e "\n${BLUE}=================================================${NC}"