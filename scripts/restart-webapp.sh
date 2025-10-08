#!/bin/bash
# Script to restart the web app

echo "Restarting thinkforward-dev webapp..."
az webapp restart --name "thinkforward-dev" --resource-group "thinkforward-dev-rg"

echo "Checking webapp status after restart..."
az webapp show --name "thinkforward-dev" --resource-group "thinkforward-dev-rg" --query "{name:name,state:state}" -o table

echo "Webapp restart initiated. It may take a few moments to fully restart."