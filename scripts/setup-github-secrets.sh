#!/bin/bash

# This script helps configure the GitHub secrets needed for Azure deployment
# You'll need the GitHub CLI (gh) installed and authenticated

echo "Setting up GitHub secrets for Azure deployment..."

# Load Azure resource values from file
if [ -f "./azure-resources.env" ]; then
  source ./azure-resources.env
else
  echo "Error: azure-resources.env file not found!"
  exit 1
fi

# Check for required values
if [ -z "$COSMOS_DB_ENDPOINT" ] || [ -z "$COSMOS_DB_KEY" ] || [ -z "$KEY_VAULT_URI" ]; then
  echo "Error: Missing required Azure resource values in azure-resources.env"
  exit 1
fi

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo "GitHub CLI (gh) is not installed. Please install it first:"
  echo "  brew install gh"
  echo "Then authenticate with: gh auth login"
  exit 1
fi

# Check if user is authenticated with GitHub
if ! gh auth status &> /dev/null; then
  echo "Please authenticate with GitHub first:"
  echo "  gh auth login"
  exit 1
fi

# Set the GitHub repository
# Extract from git remote if possible, otherwise ask the user
REPO=$(git config --get remote.origin.url | sed -n 's/.*github.com[:\/]\(.*\)\.git/\1/p')
if [ -z "$REPO" ]; then
  read -p "Enter your GitHub repository (format: username/repo): " REPO
fi

echo "Setting secrets for repository: $REPO"

# Add the secrets
echo "Adding COSMOS_DB_ENDPOINT..."
gh secret set COSMOS_DB_ENDPOINT --body "$COSMOS_DB_ENDPOINT" --repo "$REPO"

echo "Adding COSMOS_DB_KEY..."
gh secret set COSMOS_DB_KEY --body "$COSMOS_DB_KEY" --repo "$REPO"

echo "Adding KEY_VAULT_URI..."
gh secret set KEY_VAULT_URI --body "$KEY_VAULT_URI" --repo "$REPO"

echo "Adding APP_INSIGHTS_CONNECTION_STRING..."
if [ -n "$APP_INSIGHTS_CONNECTION_STRING" ] && [ "$APP_INSIGHTS_CONNECTION_STRING" != "Not found" ]; then
  gh secret set APP_INSIGHTS_CONNECTION_STRING --body "$APP_INSIGHTS_CONNECTION_STRING" --repo "$REPO"
else
  echo "Warning: APP_INSIGHTS_CONNECTION_STRING not found or invalid"
  echo "You'll need to set this manually once you have the connection string"
fi

# Ask for Azure resource group
read -p "Enter your Azure Resource Group name: " RESOURCE_GROUP
if [ -n "$RESOURCE_GROUP" ]; then
  gh secret set AZURE_RESOURCE_GROUP --body "$RESOURCE_GROUP" --repo "$REPO"
fi

echo "Done setting up GitHub secrets!"
echo ""
echo "IMPORTANT: You still need to manually add these secrets:"
echo "1. AZURE_CREDENTIALS - JSON credentials for Azure service principal"
echo "2. AZURE_WEBAPP_PUBLISH_PROFILE - Publish profile from your Azure Web App"
echo ""
echo "To get AZURE_CREDENTIALS, run:"
echo "  az ad sp create-for-rbac --name \"ThinkForwardDeployment\" --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} --sdk-auth"
echo ""
echo "To get AZURE_WEBAPP_PUBLISH_PROFILE:"
echo "1. Go to Azure Portal > your Web App > Overview > Get publish profile"
echo "2. Download the file and add its contents as the secret value"