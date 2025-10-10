#!/bin/bash
# Script to automate Azure App Service configuration for ThinkForward
# This script requires minimal user input and handles errors gracefully

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default values
APP_NAME="thinkforward-dev"
DEFAULT_COSMOS_DB="thinkforward"
DEFAULT_TENANT_ID="common"
ENV_FILE=".env.local"
SAVED_SETTINGS_FILE=".azure-settings.json"

# Function to print step headers
print_step() {
    echo -e "\n${BLUE}==== $1 ====${NC}"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages and exit
print_error() {
    echo -e "${RED}ERROR: $1${NC}"
    exit 1
}

# Function to print warning messages
print_warning() {
    echo -e "${YELLOW}WARNING: $1${NC}"
}

# Function to print info messages
print_info() {
    echo -e "${CYAN}INFO: $1${NC}"
}

# Function to ask for confirmation
confirm() {
    read -p "$1 (y/n): " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# Function to load values from .env files
load_env_values() {
    print_step "Looking for environment variables"
    
    # Files to check in priority order
    local ENV_FILES=(".env.local" ".env.development" ".env.production" ".env" "azure-resources.env")
    local found_file=false

    for file in "${ENV_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            print_info "Found $file, extracting values..."
            found_file=true
            
            # Extract values from the file
            if grep -q "COSMOS_ENDPOINT" "$file"; then
                COSMOS_ENDPOINT=$(grep "COSMOS_ENDPOINT" "$file" | cut -d '=' -f2-)
                print_info "Found COSMOS_ENDPOINT in $file"
            elif grep -q "COSMOS_DB_ENDPOINT" "$file"; then
                COSMOS_ENDPOINT=$(grep "COSMOS_DB_ENDPOINT" "$file" | cut -d '=' -f2-)
                print_info "Found COSMOS_DB_ENDPOINT in $file"
            fi
            
            if grep -q "COSMOS_KEY" "$file"; then
                COSMOS_KEY=$(grep "COSMOS_KEY" "$file" | cut -d '=' -f2-)
                print_info "Found COSMOS_KEY in $file"
            elif grep -q "COSMOS_DB_KEY" "$file"; then
                COSMOS_KEY=$(grep "COSMOS_DB_KEY" "$file" | cut -d '=' -f2-)
                print_info "Found COSMOS_DB_KEY in $file"
            fi
            
            if grep -q "COSMOS_DATABASE" "$file"; then
                COSMOS_DATABASE=$(grep "COSMOS_DATABASE" "$file" | cut -d '=' -f2-)
                print_info "Found COSMOS_DATABASE in $file"
            elif grep -q "COSMOS_DB_DATABASE_ID" "$file"; then
                COSMOS_DATABASE=$(grep "COSMOS_DB_DATABASE_ID" "$file" | cut -d '=' -f2-)
                print_info "Found COSMOS_DB_DATABASE_ID in $file"
            fi
            
            if grep -q "AZURE_AD_CLIENT_ID" "$file"; then
                AZURE_AD_CLIENT_ID=$(grep "AZURE_AD_CLIENT_ID" "$file" | cut -d '=' -f2-)
                print_info "Found AZURE_AD_CLIENT_ID in $file"
            fi
            
            if grep -q "AZURE_AD_CLIENT_SECRET" "$file"; then
                AZURE_AD_CLIENT_SECRET=$(grep "AZURE_AD_CLIENT_SECRET" "$file" | cut -d '=' -f2-)
                print_info "Found AZURE_AD_CLIENT_SECRET in $file"
            fi
            
            if grep -q "AZURE_AD_TENANT_ID" "$file"; then
                AZURE_AD_TENANT_ID=$(grep "AZURE_AD_TENANT_ID" "$file" | cut -d '=' -f2-)
                print_info "Found AZURE_AD_TENANT_ID in $file"
            fi
        fi
    done
    
    if [[ "$found_file" == false ]]; then
        print_warning "No environment files found. You'll need to enter all values manually."
    fi

    # Check if we have saved settings
    if [[ -f "$SAVED_SETTINGS_FILE" ]]; then
        print_info "Found saved Azure settings from previous run."
        if confirm "Would you like to use these saved settings?"; then
            # Parse JSON file and extract values
            if command -v jq &> /dev/null; then
                SUBSCRIPTION=$(jq -r '.subscription // empty' "$SAVED_SETTINGS_FILE")
                RESOURCE_GROUP=$(jq -r '.resourceGroup // empty' "$SAVED_SETTINGS_FILE")
                APP_NAME=$(jq -r '.appName // empty' "$SAVED_SETTINGS_FILE")
                AZURE_AD_CLIENT_ID=$(jq -r '.azureAdClientId // empty' "$SAVED_SETTINGS_FILE")
                AZURE_AD_TENANT_ID=$(jq -r '.azureAdTenantId // empty' "$SAVED_SETTINGS_FILE")
                COSMOS_ENDPOINT=$(jq -r '.cosmosEndpoint // empty' "$SAVED_SETTINGS_FILE")
                COSMOS_DATABASE=$(jq -r '.cosmosDatabase // empty' "$SAVED_SETTINGS_FILE")
                print_info "Loaded settings from saved file."
            else
                print_warning "jq tool not found, cannot parse saved settings JSON."
            fi
        fi
    fi
}

# Function to save settings for future use
save_settings() {
    print_step "Saving settings for future use"
    
    # Create JSON with settings, but don't include secrets
    cat > "$SAVED_SETTINGS_FILE" << EOL
{
    "subscription": "$SUBSCRIPTION",
    "resourceGroup": "$RESOURCE_GROUP",
    "appName": "$APP_NAME",
    "azureAdClientId": "$AZURE_AD_CLIENT_ID",
    "azureAdTenantId": "$AZURE_AD_TENANT_ID", 
    "cosmosEndpoint": "$COSMOS_ENDPOINT",
    "cosmosDatabase": "$COSMOS_DATABASE"
}
EOL
    print_success "Settings saved to $SAVED_SETTINGS_FILE"
}

# Function to check if Azure CLI is installed
check_prerequisites() {
    print_step "Checking prerequisites"
    
    # Check for Azure CLI
    if ! command -v az &> /dev/null; then
        print_error "Azure CLI not found. Please install it:
  macOS: brew install azure-cli
  Windows: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows
  Linux: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-linux"
    fi
    print_success "Azure CLI is installed"
    
    # Check Azure CLI logged in status
    if ! az account show &> /dev/null; then
        print_info "Not logged in to Azure CLI, logging in now..."
        if ! az login; then
            print_error "Failed to log in to Azure. Please try again."
        fi
    fi
    print_success "Logged in to Azure CLI"
}

# Function to select Azure subscription
select_subscription() {
    print_step "Selecting Azure subscription"
    
    # Use saved subscription or list available ones
    if [[ -n "$SUBSCRIPTION" ]]; then
        print_info "Using saved subscription: $SUBSCRIPTION"
        if ! az account set --subscription "$SUBSCRIPTION"; then
            print_warning "Failed to set saved subscription. Please select from list."
            SUBSCRIPTION=""
        else
            print_success "Using subscription: $SUBSCRIPTION"
            return
        fi
    fi
    
    # List subscriptions
    echo "Available subscriptions:"
    az account list --query "[].{Name:name, Id:id, Default:isDefault}" --output table
    
    # Ask for subscription
    read -p "Enter subscription ID or name: " SUBSCRIPTION
    if [[ -z "$SUBSCRIPTION" ]]; then
        print_error "No subscription specified."
    fi
    
    # Try to set the subscription
    if ! az account set --subscription "$SUBSCRIPTION"; then
        print_error "Failed to set subscription. Please check the ID or name and try again."
    fi
    print_success "Using subscription: $SUBSCRIPTION"
}

# Function to select or create resource group
select_resource_group() {
    print_step "Selecting resource group"
    
    # Use saved resource group or list available ones
    if [[ -n "$RESOURCE_GROUP" ]]; then
        print_info "Using saved resource group: $RESOURCE_GROUP"
        if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
            print_warning "Resource group $RESOURCE_GROUP does not exist."
            RESOURCE_GROUP=""
        else
            print_success "Using resource group: $RESOURCE_GROUP"
            return
        fi
    fi
    
    # List resource groups
    echo "Available resource groups:"
    az group list --query "[].{Name:name, Location:location}" --output table
    
    # Ask if the user wants to create a new resource group or use an existing one
    echo
    options=("Use existing resource group" "Create a new resource group")
    select opt in "${options[@]}"; do
        case $REPLY in
            1)
                read -p "Enter resource group name: " RESOURCE_GROUP
                if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
                    print_error "Resource group $RESOURCE_GROUP does not exist."
                fi
                break
                ;;
            2)
                read -p "Enter new resource group name: " RESOURCE_GROUP
                echo "Available locations:"
                az account list-locations --query "[].{Name:name}" --output table | head -n 20
                echo "... (more locations available)"
                read -p "Enter location (e.g., eastus, westus2): " LOCATION
                
                if ! az group create --name "$RESOURCE_GROUP" --location "$LOCATION"; then
                    print_error "Failed to create resource group."
                fi
                break
                ;;
            *) echo "Invalid option $REPLY" ;;
        esac
    done
    
    print_success "Using resource group: $RESOURCE_GROUP"
}

# Function to handle Azure App Service
setup_app_service() {
    print_step "Setting up Azure App Service"
    
    # Check if app service exists
    if az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
        print_success "App service $APP_NAME exists in resource group $RESOURCE_GROUP"
    else
        print_warning "App service $APP_NAME does not exist in resource group $RESOURCE_GROUP"
        
        # Ask if we should create it
        if confirm "Would you like to create a new App Service?"; then
            # List available locations
            echo "Available locations:"
            az appservice list-locations --sku B1 --linux-workers-enabled --query "[].name" --output table
            read -p "Enter location (e.g., eastus, westus2): " LOCATION
            
            # Create App Service Plan
            PLAN_NAME="${APP_NAME}-plan"
            print_info "Creating App Service Plan $PLAN_NAME..."
            if ! az appservice plan create --name "$PLAN_NAME" --resource-group "$RESOURCE_GROUP" --location "$LOCATION" --sku B1 --is-linux; then
                print_error "Failed to create App Service Plan."
            fi
            
            # Create Web App
            print_info "Creating Web App $APP_NAME..."
            if ! az webapp create --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --plan "$PLAN_NAME" --runtime "NODE:20-lts"; then
                print_error "Failed to create Web App."
            fi
        else
            print_error "Cannot continue without an App Service."
        fi
    fi
    
    # Get the app URL
    APP_URL=$(az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "defaultHostName" --output tsv)
    print_info "App URL: https://$APP_URL"
}

# Function to collect environment variables
collect_env_variables() {
    print_step "Collecting environment variables"
    
    # Generate a random secret if none exists
    if [[ -z "$NEXTAUTH_SECRET" ]]; then
        NEXTAUTH_SECRET=$(openssl rand -hex 32)
        print_info "Generated a new NEXTAUTH_SECRET"
    fi
    
    # Get Azure AD credentials
    if [[ -z "$AZURE_AD_CLIENT_ID" ]]; then
        read -p "Enter your Azure AD Client ID: " AZURE_AD_CLIENT_ID
        if [[ -z "$AZURE_AD_CLIENT_ID" ]]; then
            print_warning "Azure AD Client ID not provided. Authentication may not work properly."
        fi
    else
        print_info "Using existing Azure AD Client ID"
    fi
    
    if [[ -z "$AZURE_AD_CLIENT_SECRET" ]]; then
        read -p "Enter your Azure AD Client Secret: " -s AZURE_AD_CLIENT_SECRET
        echo
        if [[ -z "$AZURE_AD_CLIENT_SECRET" ]]; then
            print_warning "Azure AD Client Secret not provided. Authentication may not work properly."
        fi
    else
        print_info "Using existing Azure AD Client Secret"
    fi
    
    if [[ -z "$AZURE_AD_TENANT_ID" ]]; then
        read -p "Enter your Azure AD Tenant ID (press Enter to use 'common'): " AZURE_AD_TENANT_ID
        AZURE_AD_TENANT_ID=${AZURE_AD_TENANT_ID:-$DEFAULT_TENANT_ID}
    fi
    print_info "Using Azure AD Tenant ID: $AZURE_AD_TENANT_ID"
    
    # Get Cosmos DB credentials
    if [[ -z "$COSMOS_ENDPOINT" ]]; then
        read -p "Enter your Cosmos DB Endpoint URL: " COSMOS_ENDPOINT
        if [[ -z "$COSMOS_ENDPOINT" ]]; then
            print_warning "Cosmos DB Endpoint not provided. Database operations may not work."
        fi
    else
        print_info "Using existing Cosmos DB Endpoint"
    fi
    
    if [[ -z "$COSMOS_KEY" ]]; then
        read -p "Enter your Cosmos DB Key: " -s COSMOS_KEY
        echo
        if [[ -z "$COSMOS_KEY" ]]; then
            print_warning "Cosmos DB Key not provided. Database operations may not work."
        fi
    else
        print_info "Using existing Cosmos DB Key"
    fi
    
    if [[ -z "$COSMOS_DATABASE" ]]; then
        read -p "Enter your Cosmos DB Database Name (press Enter to use 'thinkforward'): " COSMOS_DATABASE
        COSMOS_DATABASE=${COSMOS_DATABASE:-$DEFAULT_COSMOS_DB}
    fi
    print_info "Using Cosmos DB Database: $COSMOS_DATABASE"
}

# Function to update Azure App Service settings
update_app_settings() {
    print_step "Updating Azure App Service settings"
    
    print_info "Applying configuration to $APP_NAME..."
    if ! az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings \
        NODE_ENV="production" \
        NEXTAUTH_URL="https://$APP_URL" \
        NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
        AZURE_AD_CLIENT_ID="$AZURE_AD_CLIENT_ID" \
        AZURE_AD_CLIENT_SECRET="$AZURE_AD_CLIENT_SECRET" \
        AZURE_AD_TENANT_ID="$AZURE_AD_TENANT_ID" \
        COSMOS_ENDPOINT="$COSMOS_ENDPOINT" \
        COSMOS_KEY="$COSMOS_KEY" \
        COSMOS_DATABASE="$COSMOS_DATABASE" \
        WEBSITE_NODE_DEFAULT_VERSION="~20" \
        WEBSITE_RUN_FROM_PACKAGE="1"; then
        print_error "Failed to update app settings."
    fi
    print_success "App settings updated successfully."
    
    # Set startup command
    print_info "Setting startup command..."
    if ! az webapp config set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --startup-file "node server.js"; then
        print_error "Failed to set startup command."
    fi
    print_success "Startup command set to 'node server.js'"
    
    # Ensure environment variables are consistently named (both COSMOS_ENDPOINT and COSMOS_DB_ENDPOINT)
    print_info "Ensuring environment variable naming consistency..."
    if [[ -n "$COSMOS_ENDPOINT" ]]; then
        az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings \
            COSMOS_DB_ENDPOINT="$COSMOS_ENDPOINT"
    elif [[ -n "$COSMOS_DB_ENDPOINT" ]]; then
        az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings \
            COSMOS_ENDPOINT="$COSMOS_DB_ENDPOINT"
    fi
    
    if [[ -n "$COSMOS_KEY" ]]; then
        az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings \
            COSMOS_DB_KEY="$COSMOS_KEY"
    elif [[ -n "$COSMOS_DB_KEY" ]]; then
        az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings \
            COSMOS_KEY="$COSMOS_DB_KEY"
    fi
    
    if [[ -n "$COSMOS_DATABASE" ]]; then
        az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings \
            COSMOS_DB_DATABASE_ID="$COSMOS_DATABASE"
    elif [[ -n "$COSMOS_DB_DATABASE_ID" ]]; then
        az webapp config appsettings set --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --settings \
            COSMOS_DATABASE="$COSMOS_DB_DATABASE_ID"
    fi
    print_success "Environment variables synchronized for compatibility"
}

# Function to generate or update publish profile
update_publish_profile() {
    print_step "Generating publish profile"
    
    PROFILE_FILE="$APP_NAME-publish-profile.xml"
    
    # Generate publish profile
    print_info "Generating publish profile for $APP_NAME..."
    PUBLISH_PROFILE=$(az webapp deployment list-publishing-profiles --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --xml)
    if [ $? -ne 0 ]; then
        print_error "Failed to generate publish profile."
    fi
    
    # Save publish profile to file
    echo "$PUBLISH_PROFILE" > "$PROFILE_FILE"
    print_success "Publish profile saved to $PROFILE_FILE"
    
    print_info "You can now update your GitHub repository secret AZURE_WEBAPP_PUBLISH_PROFILE with this file content."
}

# Main script execution
print_step "Azure App Service Automated Configuration"
check_prerequisites
load_env_values
select_subscription
select_resource_group
setup_app_service
collect_env_variables
update_app_settings
update_publish_profile
save_settings

print_step "Configuration complete!"
print_success "Your ThinkForward app is now configured on Azure."
print_info "App URL: https://$APP_URL"
print_info "Publish profile saved to: $PROFILE_FILE"
print_info "GitHub Actions should now be able to deploy to this App Service."
print_info "You can update your GitHub repository secret AZURE_WEBAPP_PUBLISH_PROFILE with the content of $PROFILE_FILE."