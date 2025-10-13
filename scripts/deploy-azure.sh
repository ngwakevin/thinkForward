#!/bin/bash
set -euo pipefail

# Build and deploy the ThinkForward app (Option 1: ship .next directly)
# Usage: bash scripts/deploy-azure.sh

RESOURCE_GROUP=${AZURE_RESOURCE_GROUP:-thinkforward-dev-rg}
APP_NAME=${AZURE_WEBAPP_NAME:-thinkforward-dev}

echo "=== Option 1: build & deploy to Azure App Service ==="
echo "Resource group : ${RESOURCE_GROUP}"
echo "App Service    : ${APP_NAME}"

# Ensure we are starting from clean artifacts
rm -f deploy.zip

echo "Installing dependencies (npm ci)..."
npm ci

echo "Running production build (npm run build)..."
npm run build

echo "Packaging deployment artifact (scripts/zip-prebuild.sh)..."
bash scripts/zip-prebuild.sh

echo "Setting App Service startup command to 'startup.sh'..."
az webapp config set \
	--resource-group "${RESOURCE_GROUP}" \
	--name "${APP_NAME}" \
	--startup-file "startup.sh"

echo "Deploying deploy.zip to Azure App Service..."
az webapp deployment source config-zip \
	--resource-group "${RESOURCE_GROUP}" \
	--name "${APP_NAME}" \
	--src deploy.zip

echo "Restarting App Service to pick up new startup script..."
az webapp restart --resource-group "${RESOURCE_GROUP}" --name "${APP_NAME}"

echo "=== Deployment completed ==="
echo "Check: https://${APP_NAME}.azurewebsites.net/"