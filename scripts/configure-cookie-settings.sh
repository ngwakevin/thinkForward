#!/bin/bash
# Script to manage cookie domain settings for Azure Web App

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Cookie Domain Configuration Tool ===${NC}"

# Check if required environment variables are set
if [ -z "$APP_NAME" ]; then
  echo -e "${YELLOW}APP_NAME not set. Using default from environment or prompt.${NC}"
  # Try to get from environment or prompt
  APP_NAME=${APP_NAME:-$(az webapp list --query "[].name" -o tsv | head -n 1)}
  
  if [ -z "$APP_NAME" ]; then
    read -p "Enter your Azure App Service name: " APP_NAME
  fi
fi

if [ -z "$RESOURCE_GROUP" ]; then
  echo -e "${YELLOW}RESOURCE_GROUP not set. Using default from environment or prompt.${NC}"
  # Try to get from environment or prompt
  RESOURCE_GROUP=${RESOURCE_GROUP:-$(az group list --query "[].name" -o tsv | head -n 1)}
  
  if [ -z "$RESOURCE_GROUP" ]; then
    read -p "Enter your Azure Resource Group name: " RESOURCE_GROUP
  fi
fi

echo "Using App Service: $APP_NAME"
echo "Using Resource Group: $RESOURCE_GROUP"

# Get the current URL from NEXTAUTH_URL
NEXTAUTH_URL=$(az webapp config appsettings list --name $APP_NAME --resource-group $RESOURCE_GROUP --query "[?name=='NEXTAUTH_URL'].value" -o tsv)
CURRENT_COOKIE_DOMAIN=$(az webapp config appsettings list --name $APP_NAME --resource-group $RESOURCE_GROUP --query "[?name=='COOKIE_DOMAIN'].value" -o tsv)

echo -e "${BLUE}Current settings:${NC}"
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo "COOKIE_DOMAIN: $CURRENT_COOKIE_DOMAIN"

# Extract domain from URL
if [ -n "$NEXTAUTH_URL" ]; then
  DOMAIN=$(echo $NEXTAUTH_URL | sed -e 's|^[^/]*//||' -e 's|/.*$||' -e 's|^www\.||')
  echo -e "${GREEN}Extracted domain from NEXTAUTH_URL: $DOMAIN${NC}"
else
  echo -e "${YELLOW}NEXTAUTH_URL not set. Please enter domain manually.${NC}"
  read -p "Enter domain (e.g., yourdomain.com): " DOMAIN
fi

# Determine cookie domain options
echo -e "${BLUE}Available cookie domain options:${NC}"
echo "1) .$DOMAIN (recommended for subdomains)"
echo "2) $DOMAIN (specific domain only)"
echo "3) Enter custom domain"

read -p "Select option (1-3): " DOMAIN_OPTION

case $DOMAIN_OPTION in
  1)
    COOKIE_DOMAIN=".$DOMAIN"
    ;;
  2)
    COOKIE_DOMAIN="$DOMAIN"
    ;;
  3)
    read -p "Enter custom cookie domain: " COOKIE_DOMAIN
    ;;
  *)
    echo -e "${RED}Invalid option. Using .$DOMAIN as default.${NC}"
    COOKIE_DOMAIN=".$DOMAIN"
    ;;
esac

echo -e "${GREEN}Setting COOKIE_DOMAIN to: $COOKIE_DOMAIN${NC}"

# Set the cookie domain in Azure
az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings COOKIE_DOMAIN="$COOKIE_DOMAIN"

echo -e "${GREEN}✅ COOKIE_DOMAIN has been updated.${NC}"

# Additional cookie settings you might want to configure
echo -e "${BLUE}Do you want to configure additional cookie settings?${NC}"
echo "1) Yes"
echo "2) No"

read -p "Select option (1-2): " ADDITIONAL_OPTION

if [ "$ADDITIONAL_OPTION" == "1" ]; then
  # Cookie secure flag
  echo -e "${BLUE}Set COOKIE_SECURE? (Cookies will only be sent over HTTPS)${NC}"
  echo "1) true (recommended for production)"
  echo "2) false"
  
  read -p "Select option (1-2): " SECURE_OPTION
  
  if [ "$SECURE_OPTION" == "1" ]; then
    COOKIE_SECURE="true"
  else
    COOKIE_SECURE="false"
  fi
  
  # Cookie same site setting
  echo -e "${BLUE}Set COOKIE_SAME_SITE policy:${NC}"
  echo "1) lax (recommended - allows cookies to be sent when navigating to your site from external links)"
  echo "2) strict (most secure but may break some functionality)"
  echo "3) none (least restrictive - requires secure=true)"
  
  read -p "Select option (1-3): " SAME_SITE_OPTION
  
  case $SAME_SITE_OPTION in
    1)
      COOKIE_SAME_SITE="lax"
      ;;
    2)
      COOKIE_SAME_SITE="strict"
      ;;
    3)
      COOKIE_SAME_SITE="none"
      COOKIE_SECURE="true" # Force secure for 'none' same site
      echo -e "${YELLOW}Setting COOKIE_SECURE=true as it's required for COOKIE_SAME_SITE=none${NC}"
      ;;
    *)
      echo -e "${RED}Invalid option. Using 'lax' as default.${NC}"
      COOKIE_SAME_SITE="lax"
      ;;
  esac
  
  # Set the additional cookie settings
  echo -e "${GREEN}Setting additional cookie configuration:${NC}"
  echo "COOKIE_SECURE: $COOKIE_SECURE"
  echo "COOKIE_SAME_SITE: $COOKIE_SAME_SITE"
  
  az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings \
    COOKIE_SECURE="$COOKIE_SECURE" \
    COOKIE_SAME_SITE="$COOKIE_SAME_SITE"
  
  echo -e "${GREEN}✅ Additional cookie settings have been updated.${NC}"
fi

echo -e "${BLUE}=== Cookie configuration complete ===${NC}"
echo -e "${GREEN}Your application's cookie settings have been updated.${NC}"
echo -e "${YELLOW}Note: You may need to restart your app or redeploy for settings to take effect.${NC}"

# Option to restart the app
echo -e "${BLUE}Do you want to restart the app now?${NC}"
echo "1) Yes"
echo "2) No"

read -p "Select option (1-2): " RESTART_OPTION

if [ "$RESTART_OPTION" == "1" ]; then
  echo -e "${YELLOW}Restarting app...${NC}"
  az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP
  echo -e "${GREEN}✅ App has been restarted.${NC}"
else
  echo -e "${YELLOW}Remember to restart your app for settings to take effect.${NC}"
fi