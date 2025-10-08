#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}     Configure Public Site with Optional Login     ${NC}"
echo -e "${BLUE}=================================================${NC}"

echo -e "${YELLOW}Issue:${NC} Your site currently requires authentication before users can access any content."
echo -e "${GREEN}Goal:${NC} Make the site publicly accessible while keeping Microsoft login as an optional feature."

echo -e "\n${BLUE}The solution is to:${NC}"
echo -e "1. Disable Azure App Service Authentication (Easy Auth)"
echo -e "2. Rely only on NextAuth.js for optional authentication"

echo -e "\n${YELLOW}Here's how to fix this:${NC}"

echo -e "\n${GREEN}Step 1: Disable Azure App Service Authentication${NC}"
echo -e "1. Go to the Azure Portal: https://portal.azure.com"
echo -e "2. Navigate to your App Service (thinkforward-dev)"
echo -e "3. In the left menu, click on 'Authentication / Authorization'"
echo -e "4. Set 'App Service Authentication' to 'Off'"
echo -e "5. Click 'Save' at the top of the page"

echo -e "\n${GREEN}Step 2: Ensure NextAuth.js is configured for optional authentication${NC}"
echo -e "This is already done in your auth.ts file. NextAuth.js doesn't force users to log in."

echo -e "\n${GREEN}Step 3: Add login buttons to your site${NC}"
echo -e "You already have this implemented with your signin components."

echo -e "\n${YELLOW}After completing these steps:${NC}"
echo -e "✅ Your site will be publicly accessible without requiring authentication"
echo -e "✅ Users can browse the site anonymously"
echo -e "✅ Users can optionally sign in with Microsoft when they choose to"
echo -e "✅ Your NextAuth.js configuration will handle the authentication when users click the sign-in button"

echo -e "\n${RED}Important:${NC} After disabling App Service Authentication, wait a few minutes for the changes to take effect."
echo -e "You may need to clear your browser cache or try in a private/incognito window to see the changes immediately."

echo -e "\n${BLUE}=================================================${NC}"