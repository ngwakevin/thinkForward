#!/bin/bash
# Script to redeploy the application to ensure environment variables are applied

echo "Restarting and syncing the web app..."
az webapp restart --name "thinkforward-dev" --resource-group "thinkforward-dev-rg"
echo "Waiting for the webapp to fully restart (30 seconds)..."
sleep 30

echo "Checking if environment variables are applied..."
az webapp config appsettings list --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --query "[?name.contains(@, 'AZURE_AD')].{name:name,value:value}" -o table

echo "Running sync-triggers to ensure latest configuration is applied..."
az webapp deployment source sync --name "thinkforward-dev" --resource-group "thinkforward-dev-rg"

echo "Checking application logs for environment variable errors..."
az webapp log tail --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --filter "error" --lines 10