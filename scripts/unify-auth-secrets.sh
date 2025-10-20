#!/bin/bash
# Script to ensure JWT_SECRET and NEXTAUTH_SECRET use the same value

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Unifying JWT_SECRET and NEXTAUTH_SECRET ===${NC}"

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

# Check current values
echo -e "${BLUE}Checking current secret values...${NC}"
NEXTAUTH_SECRET=$(az webapp config appsettings list --name $APP_NAME --resource-group $RESOURCE_GROUP --query "[?name=='NEXTAUTH_SECRET'].value" -o tsv)
JWT_SECRET=$(az webapp config appsettings list --name $APP_NAME --resource-group $RESOURCE_GROUP --query "[?name=='JWT_SECRET'].value" -o tsv)

# Check if secrets exist and match
if [ -z "$NEXTAUTH_SECRET" ] && [ -z "$JWT_SECRET" ]; then
  echo -e "${YELLOW}Neither NEXTAUTH_SECRET nor JWT_SECRET is set. Generating a new secret...${NC}"
  # Generate a new secret
  GENERATED_SECRET=$(openssl rand -base64 32)
  
  # Set both secrets to the same value
  echo -e "${GREEN}Setting both secrets to the same new value...${NC}"
  az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings NEXTAUTH_SECRET="$GENERATED_SECRET" JWT_SECRET="$GENERATED_SECRET"
  
  echo -e "${GREEN}✅ Both secrets have been set to the same value.${NC}"
elif [ -n "$NEXTAUTH_SECRET" ] && [ -z "$JWT_SECRET" ]; then
  echo -e "${YELLOW}NEXTAUTH_SECRET exists but JWT_SECRET does not.${NC}"
  echo -e "${GREEN}Setting JWT_SECRET to match NEXTAUTH_SECRET...${NC}"
  
  az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings JWT_SECRET="$NEXTAUTH_SECRET"
  
  echo -e "${GREEN}✅ JWT_SECRET now matches NEXTAUTH_SECRET.${NC}"
elif [ -z "$NEXTAUTH_SECRET" ] && [ -n "$JWT_SECRET" ]; then
  echo -e "${YELLOW}JWT_SECRET exists but NEXTAUTH_SECRET does not.${NC}"
  echo -e "${GREEN}Setting NEXTAUTH_SECRET to match JWT_SECRET...${NC}"
  
  az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings NEXTAUTH_SECRET="$JWT_SECRET"
  
  echo -e "${GREEN}✅ NEXTAUTH_SECRET now matches JWT_SECRET.${NC}"
elif [ "$NEXTAUTH_SECRET" == "$JWT_SECRET" ]; then
  echo -e "${GREEN}✅ Both secrets are already set to the same value.${NC}"
else
  echo -e "${RED}⚠️ The secrets are set to different values!${NC}"
  
  # Prompt user for which secret to use
  echo -e "${YELLOW}Choose which secret to keep:${NC}"
  echo "1) Use NEXTAUTH_SECRET for both"
  echo "2) Use JWT_SECRET for both"
  echo "3) Generate a new secret for both"
  
  read -p "Enter your choice (1-3): " CHOICE
  
  case $CHOICE in
    1)
      echo -e "${GREEN}Setting JWT_SECRET to match NEXTAUTH_SECRET...${NC}"
      az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings JWT_SECRET="$NEXTAUTH_SECRET"
      echo -e "${GREEN}✅ JWT_SECRET now matches NEXTAUTH_SECRET.${NC}"
      ;;
    2)
      echo -e "${GREEN}Setting NEXTAUTH_SECRET to match JWT_SECRET...${NC}"
      az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings NEXTAUTH_SECRET="$JWT_SECRET"
      echo -e "${GREEN}✅ NEXTAUTH_SECRET now matches JWT_SECRET.${NC}"
      ;;
    3)
      echo -e "${YELLOW}Generating a new secret for both...${NC}"
      GENERATED_SECRET=$(openssl rand -base64 32)
      
      echo -e "${GREEN}Setting both secrets to the new value...${NC}"
      az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP --settings NEXTAUTH_SECRET="$GENERATED_SECRET" JWT_SECRET="$GENERATED_SECRET"
      
      echo -e "${GREEN}✅ Both secrets have been set to the same new value.${NC}"
      ;;
    *)
      echo -e "${RED}Invalid choice. No changes were made.${NC}"
      exit 1
      ;;
  esac
fi

echo -e "${BLUE}=== Secret unification complete ===${NC}"
echo -e "${GREEN}Your application now uses the same secret for both NextAuth and JWT authentication.${NC}"