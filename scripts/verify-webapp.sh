#!/bin/bash
# Script to verify the Azure web app and authentication configuration

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=== ThinkForward Azure Web App Verification ==="

# Get the web app hostname
echo -e "\n${YELLOW}Getting webapp information:${NC}"
HOSTNAME=$(az webapp show --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --query "defaultHostName" -o tsv)
if [ -z "$HOSTNAME" ]; then
    echo -e "${RED}Error: Could not retrieve webapp hostname${NC}"
    exit 1
fi

echo -e "${GREEN}Web App URL:${NC} https://$HOSTNAME"

# Check if the web app is running
echo -e "\n${YELLOW}Checking if the web app is running:${NC}"
STATUS=$(az webapp show --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --query "state" -o tsv)
echo -e "Web App Status: ${GREEN}$STATUS${NC}"

# Check HTTP response
echo -e "\n${YELLOW}Checking HTTP response:${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$HOSTNAME")
if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "HTTP Status: ${GREEN}$HTTP_STATUS OK${NC}"
else
    echo -e "HTTP Status: ${RED}$HTTP_STATUS${NC} (Expected: 200)"
fi

# Test authentication endpoint
echo -e "\n${YELLOW}Testing authentication endpoint:${NC}"
AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$HOSTNAME/api/auth/providers")
if [ "$AUTH_STATUS" = "200" ]; then
    echo -e "Auth Providers Status: ${GREEN}$AUTH_STATUS OK${NC}"
    echo "Auth providers endpoint is accessible."
    
    # Optional: Get the providers list
    echo -e "\n${YELLOW}Available auth providers:${NC}"
    curl -s "https://$HOSTNAME/api/auth/providers" | jq '.'
else
    echo -e "Auth Providers Status: ${RED}$AUTH_STATUS${NC} (Expected: 200)"
    echo "Auth providers endpoint is not accessible. This may indicate an issue with NextAuth configuration."
fi

echo -e "\n${YELLOW}Recommendations:${NC}"
echo "1. Try accessing the website in your browser: https://$HOSTNAME"
echo "2. Use the sign-in button to test authentication"
echo "3. Check application logs for any errors:"
echo "   az webapp log tail --name \"thinkforward-dev\" --resource-group \"thinkforward-dev-rg\""

echo -e "\n=== Verification Complete ==="