#!/bin/bash

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}     GitHub Secrets Setup for Azure Deployment   ${NC}"
echo -e "${BLUE}=================================================${NC}"

echo -e "${YELLOW}This script will help you set up the required GitHub secrets for Azure deployment.${NC}"
echo -e "${YELLOW}Please follow these steps to set up your GitHub secrets:${NC}"
echo

echo -e "${GREEN}1. Go to your GitHub repository: https://github.com/ngwakevin/InBe${NC}"
echo -e "${GREEN}2. Navigate to Settings > Secrets and variables > Actions${NC}"
echo -e "${GREEN}3. Click on 'New repository secret' and add the following secrets:${NC}"
echo

echo -e "${YELLOW}Secret Name: ${NC}${BLUE}AZURE_WEBAPP_PUBLISH_PROFILE${NC}"
echo -e "${YELLOW}Value: ${NC}The publish profile from your Azure Web App (download from Azure Portal)"
echo

echo -e "${YELLOW}Secret Name: ${NC}${BLUE}AZURE_RESOURCE_GROUP${NC}"
echo -e "${YELLOW}Value: ${NC}Your Azure Resource Group name (e.g., thinkforward-rg)"
echo

echo -e "${YELLOW}Secret Name: ${NC}${BLUE}AZURE_AD_CLIENT_ID${NC}"
echo -e "${YELLOW}Value: ${NC}Your Azure AD Client ID from the app registration"
echo

echo -e "${YELLOW}Secret Name: ${NC}${BLUE}AZURE_AD_CLIENT_SECRET${NC}"
echo -e "${YELLOW}Value: ${NC}Your Azure AD Client Secret from the app registration"
echo

echo -e "${YELLOW}Secret Name: ${NC}${BLUE}AZURE_AD_TENANT_ID${NC}"
echo -e "${YELLOW}Value: ${NC}\"common\" (for multi-tenant support)"
echo

echo -e "${YELLOW}Secret Name: ${NC}${BLUE}NEXTAUTH_SECRET${NC}"
echo -e "${YELLOW}Value: ${NC}$(openssl rand -base64 32)"
echo

echo -e "${GREEN}After adding these secrets, the GitHub Actions workflow will deploy your app${NC}"
echo -e "${GREEN}and configure the Azure Web App with the correct authentication settings.${NC}"
echo
echo -e "${BLUE}=================================================${NC}"