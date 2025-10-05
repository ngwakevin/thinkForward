#!/bin/bash

# Script to fetch Azure resource values using the Azure CLI

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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

# Get subscription information
echo -e "${YELLOW}Available subscriptions:${NC}"
az account list --query "[].{Name:name, Id:id, Default:isDefault}" -o table

# Ask for subscription
echo ""
echo -e "${YELLOW}Enter the subscription name or ID (press Enter to use the default):${NC}"
read SUBSCRIPTION_ID

if [ -n "$SUBSCRIPTION_ID" ]; then
    # Set the subscription
    az account set --subscription "$SUBSCRIPTION_ID"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to set subscription. Exiting.${NC}"
        exit 1
    fi
fi

# Show current subscription
CURRENT_SUB=$(az account show --query "name" -o tsv)
echo -e "${GREEN}Using subscription: $CURRENT_SUB${NC}"

# List resource groups
echo -e "\n${YELLOW}Available resource groups:${NC}"
az group list --query "[].name" -o table

# Ask for resource group
echo ""
echo -e "${YELLOW}Enter the resource group name:${NC}"
read RESOURCE_GROUP

if [ -z "$RESOURCE_GROUP" ]; then
    echo -e "${RED}Resource group name is required. Exiting.${NC}"
    exit 1
fi

# Check if the resource group exists
az group show --name "$RESOURCE_GROUP" &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${RED}Resource group '$RESOURCE_GROUP' not found. Exiting.${NC}"
    exit 1
fi

echo -e "${GREEN}Using resource group: $RESOURCE_GROUP${NC}"

# Fetch Cosmos DB accounts
echo -e "\n${YELLOW}Looking for Cosmos DB accounts...${NC}"
COSMOS_ACCOUNTS=$(az cosmosdb list --resource-group "$RESOURCE_GROUP" --query "[].name" -o tsv)

if [ -z "$COSMOS_ACCOUNTS" ]; then
    echo -e "${RED}No Cosmos DB accounts found in resource group $RESOURCE_GROUP.${NC}"
    COSMOS_ENDPOINT="Not found"
    COSMOS_KEY="Not found"
else
    echo -e "${GREEN}Found Cosmos DB accounts:${NC}"
    echo "$COSMOS_ACCOUNTS"
    
    # If multiple accounts, ask which one to use
    if [ $(echo "$COSMOS_ACCOUNTS" | wc -l) -gt 1 ]; then
        echo ""
        echo -e "${YELLOW}Enter the Cosmos DB account name to use:${NC}"
        read COSMOS_NAME
        
        if [ -z "$COSMOS_NAME" ]; then
            echo -e "${RED}Cosmos DB account name is required. Using the first one.${NC}"
            COSMOS_NAME=$(echo "$COSMOS_ACCOUNTS" | head -n 1)
        fi
    else
        COSMOS_NAME=$COSMOS_ACCOUNTS
    fi
    
    # Fetch Cosmos DB endpoint and key
    echo -e "${YELLOW}Fetching Cosmos DB endpoint and key for $COSMOS_NAME...${NC}"
    COSMOS_ENDPOINT=$(az cosmosdb show --name "$COSMOS_NAME" --resource-group "$RESOURCE_GROUP" --query "documentEndpoint" -o tsv)
    COSMOS_KEY=$(az cosmosdb keys list --name "$COSMOS_NAME" --resource-group "$RESOURCE_GROUP" --query "primaryMasterKey" -o tsv)
    
    echo -e "${GREEN}COSMOS_DB_ENDPOINT:${NC} $COSMOS_ENDPOINT"
    echo -e "${GREEN}COSMOS_DB_KEY:${NC} $COSMOS_KEY"
fi

# Fetch Key Vault
echo -e "\n${YELLOW}Looking for Key Vault...${NC}"
KEY_VAULTS=$(az keyvault list --resource-group "$RESOURCE_GROUP" --query "[].name" -o tsv)

if [ -z "$KEY_VAULTS" ]; then
    echo -e "${RED}No Key Vaults found in resource group $RESOURCE_GROUP.${NC}"
    KEY_VAULT_URI="Not found"
else
    echo -e "${GREEN}Found Key Vaults:${NC}"
    echo "$KEY_VAULTS"
    
    # If multiple vaults, ask which one to use
    if [ $(echo "$KEY_VAULTS" | wc -l) -gt 1 ]; then
        echo ""
        echo -e "${YELLOW}Enter the Key Vault name to use:${NC}"
        read VAULT_NAME
        
        if [ -z "$VAULT_NAME" ]; then
            echo -e "${RED}Key Vault name is required. Using the first one.${NC}"
            VAULT_NAME=$(echo "$KEY_VAULTS" | head -n 1)
        fi
    else
        VAULT_NAME=$KEY_VAULTS
    fi
    
    # Fetch Key Vault URI
    echo -e "${YELLOW}Fetching Key Vault URI for $VAULT_NAME...${NC}"
    KEY_VAULT_URI=$(az keyvault show --name "$VAULT_NAME" --resource-group "$RESOURCE_GROUP" --query "properties.vaultUri" -o tsv)
    
    echo -e "${GREEN}KEY_VAULT_URI:${NC} $KEY_VAULT_URI"
fi

# Fetch Application Insights
echo -e "\n${YELLOW}Looking for Application Insights...${NC}"
APP_INSIGHTS=$(az monitor app-insights component list --resource-group "$RESOURCE_GROUP" --query "[].name" -o tsv 2>/dev/null)

if [ -z "$APP_INSIGHTS" ]; then
    echo -e "${RED}No Application Insights found in resource group $RESOURCE_GROUP.${NC}"
    APP_INSIGHTS_CONNECTION_STRING="Not found"
else
    echo -e "${GREEN}Found Application Insights:${NC}"
    echo "$APP_INSIGHTS"
    
    # If multiple app insights, ask which one to use
    if [ $(echo "$APP_INSIGHTS" | wc -l) -gt 1 ]; then
        echo ""
        echo -e "${YELLOW}Enter the Application Insights name to use:${NC}"
        read INSIGHTS_NAME
        
        if [ -z "$INSIGHTS_NAME" ]; then
            echo -e "${RED}Application Insights name is required. Using the first one.${NC}"
            INSIGHTS_NAME=$(echo "$APP_INSIGHTS" | head -n 1)
        fi
    else
        INSIGHTS_NAME=$APP_INSIGHTS
    fi
    
    # Fetch Application Insights connection string
    echo -e "${YELLOW}Fetching Application Insights connection string for $INSIGHTS_NAME...${NC}"
    APP_INSIGHTS_CONNECTION_STRING=$(az monitor app-insights component show --name "$INSIGHTS_NAME" --resource-group "$RESOURCE_GROUP" --query "connectionString" -o tsv 2>/dev/null)
    
    # If the above command fails, try getting it from the web app if it exists
    if [ -z "$APP_INSIGHTS_CONNECTION_STRING" ]; then
        echo -e "${YELLOW}Trying alternative method to get Application Insights connection string...${NC}"
        WEBAPP_NAME="thinkforward-dev"
        
        # Check if the web app exists
        az webapp show --name "$WEBAPP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null
        if [ $? -eq 0 ]; then
            echo -e "${YELLOW}Checking Web App $WEBAPP_NAME settings for Application Insights...${NC}"
            APP_INSIGHTS_CONNECTION_STRING=$(az webapp config appsettings list --name "$WEBAPP_NAME" --resource-group "$RESOURCE_GROUP" --query "[?name=='APPLICATIONINSIGHTS_CONNECTION_STRING'].value" -o tsv)
        fi
    fi
    
    if [ -z "$APP_INSIGHTS_CONNECTION_STRING" ]; then
        APP_INSIGHTS_CONNECTION_STRING="Not found - you may need to create a connection string manually"
    fi
    
    echo -e "${GREEN}APP_INSIGHTS_CONNECTION_STRING:${NC} $APP_INSIGHTS_CONNECTION_STRING"
fi

# Summary
echo -e "\n${YELLOW}======== SUMMARY ========${NC}"
echo -e "${GREEN}COSMOS_DB_ENDPOINT:${NC} $COSMOS_ENDPOINT"
echo -e "${GREEN}COSMOS_DB_KEY:${NC} $COSMOS_KEY"
echo -e "${GREEN}KEY_VAULT_URI:${NC} $KEY_VAULT_URI"
echo -e "${GREEN}APP_INSIGHTS_CONNECTION_STRING:${NC} $APP_INSIGHTS_CONNECTION_STRING"
echo -e "${YELLOW}=========================${NC}"

# Ask if user wants to save to a local file
echo ""
echo -e "${YELLOW}Do you want to save these values to a local .env file? (y/n):${NC}"
read SAVE_TO_FILE

if [[ "$SAVE_TO_FILE" == "y" || "$SAVE_TO_FILE" == "Y" ]]; then
    ENV_FILE="./azure-resources.env"
    
    echo "COSMOS_DB_ENDPOINT=\"$COSMOS_ENDPOINT\"" > "$ENV_FILE"
    echo "COSMOS_DB_KEY=\"$COSMOS_KEY\"" >> "$ENV_FILE"
    echo "KEY_VAULT_URI=\"$KEY_VAULT_URI\"" >> "$ENV_FILE"
    echo "APP_INSIGHTS_CONNECTION_STRING=\"$APP_INSIGHTS_CONNECTION_STRING\"" >> "$ENV_FILE"
    
    echo -e "${GREEN}Values saved to $ENV_FILE${NC}"
    echo -e "${YELLOW}NOTE: This file contains sensitive information. Do not commit it to your repository.${NC}"
fi

# Ask if user wants to update the web app settings
echo ""
echo -e "${YELLOW}Do you want to update the Azure Web App settings with these values? (y/n):${NC}"
read UPDATE_WEBAPP

if [[ "$UPDATE_WEBAPP" == "y" || "$UPDATE_WEBAPP" == "Y" ]]; then
    # Ask for web app name
    echo ""
    echo -e "${YELLOW}Enter the Web App name [thinkforward-dev]:${NC}"
    read WEBAPP_NAME
    
    if [ -z "$WEBAPP_NAME" ]; then
        WEBAPP_NAME="thinkforward-dev"
    fi
    
    # Check if the web app exists
    az webapp show --name "$WEBAPP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null
    if [ $? -ne 0 ]; then
        echo -e "${RED}Web App '$WEBAPP_NAME' not found in resource group '$RESOURCE_GROUP'. Skipping update.${NC}"
    else
        echo -e "${YELLOW}Updating Web App $WEBAPP_NAME settings...${NC}"
        
        # Only update settings that were found
        SETTINGS=""
        if [ "$COSMOS_ENDPOINT" != "Not found" ]; then
            SETTINGS="$SETTINGS COSMOS_DB_ENDPOINT=\"$COSMOS_ENDPOINT\""
        fi
        
        if [ "$COSMOS_KEY" != "Not found" ]; then
            SETTINGS="$SETTINGS COSMOS_DB_KEY=\"$COSMOS_KEY\""
        fi
        
        if [ "$KEY_VAULT_URI" != "Not found" ]; then
            SETTINGS="$SETTINGS KEY_VAULT_URI=\"$KEY_VAULT_URI\""
        fi
        
        if [ "$APP_INSIGHTS_CONNECTION_STRING" != "Not found" ] && [ "$APP_INSIGHTS_CONNECTION_STRING" != "Not found - you may need to create a connection string manually" ]; then
            SETTINGS="$SETTINGS APP_INSIGHTS_CONNECTION_STRING=\"$APP_INSIGHTS_CONNECTION_STRING\""
        fi
        
        if [ -n "$SETTINGS" ]; then
            # Use eval to handle the dynamic command
            eval "az webapp config appsettings set --name \"$WEBAPP_NAME\" --resource-group \"$RESOURCE_GROUP\" --settings $SETTINGS"
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}Web App settings updated successfully.${NC}"
            else
                echo -e "${RED}Failed to update Web App settings.${NC}"
            fi
        else
            echo -e "${RED}No valid settings found to update.${NC}"
        fi
    fi
fi

echo -e "${GREEN}Done!${NC}"