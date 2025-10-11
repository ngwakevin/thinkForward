#!/bin/bash
# prepare-azure-deployment.sh - Complete script for preparing and fixing Azure deployment issues
# Created by GitHub Copilot

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== ThinkForward Azure Deployment Preparation ===${NC}"

# Check working directory
if [[ ! -f "next.config.mjs" || ! -f "package.json" ]]; then
    echo -e "${RED}Error: This script must be run from the project root directory.${NC}"
    exit 1
fi

# Run all the fix scripts in sequence
echo -e "${YELLOW}Step 1: Standardizing environment variables...${NC}"
if [[ -f "scripts/standardize-env-vars.sh" ]]; then
    chmod +x scripts/standardize-env-vars.sh
    ./scripts/standardize-env-vars.sh
else
    echo -e "${RED}Error: standardize-env-vars.sh script not found.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 2: Fixing Cosmos DB key issues...${NC}"
if [[ -f "scripts/fix-cosmos-key.sh" ]]; then
    chmod +x scripts/fix-cosmos-key.sh
    ./scripts/fix-cosmos-key.sh
else
    echo -e "${RED}Error: fix-cosmos-key.sh script not found.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 3: Fixing Azure App Service file system issues...${NC}"
if [[ -f "scripts/fix-azure-fs-issues.sh" ]]; then
    chmod +x scripts/fix-azure-fs-issues.sh
    ./scripts/fix-azure-fs-issues.sh
else
    echo -e "${RED}Error: fix-azure-fs-issues.sh script not found.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 4: Setting up the automated Azure environment...${NC}"
if [[ -f "scripts/automate-azure-setup.sh" ]]; then
    chmod +x scripts/automate-azure-setup.sh
    ./scripts/automate-azure-setup.sh
else
    echo -e "${RED}Error: automate-azure-setup.sh script not found.${NC}"
    exit 1
fi

echo -e "${BLUE}=== All preparation scripts completed! ===${NC}"
echo -e "${GREEN}Your Azure environment is now set up and fixed for deployment.${NC}"
echo -e "${GREEN}You can now deploy using GitHub Actions or manually.${NC}"

exit 0