#!/bin/bash
# Script to check the webapp configuration and status

echo "Checking thinkforward-dev webapp status..."
az webapp show --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --query "{name:name,state:state,hostNames:hostNames}" -o json

echo -e "\nChecking current application settings..."
az webapp config appsettings list --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --query "[?name.contains(@, 'AZURE_AD')].{name:name,value:value}" -o table

echo -e "\nChecking if the webapp is accessible..."
HOSTNAME=$(az webapp show --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --query "defaultHostName" -o tsv)
if [ -n "$HOSTNAME" ]; then
  echo "Testing connection to https://$HOSTNAME"
  curl -I "https://$HOSTNAME" 2>/dev/null | head -n 1
else
  echo "Could not retrieve hostname"
fi