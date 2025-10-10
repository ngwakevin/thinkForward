#!/bin/bash
# Azure App Service Startup Script - run before server.js

echo "Running startup script for Azure App Service..."
echo "Current working directory: $(pwd)"
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Process environment: $NODE_ENV"

# Check for critical files
echo "Checking for critical files..."
if [ -f "server.js" ]; then
    echo "Found server.js"
else
    echo "ERROR: server.js not found!"
fi

if [ -f "web.config" ]; then
    echo "Found web.config"
else
    echo "ERROR: web.config not found!"
fi

if [ -f "next.config.mjs" ]; then
    echo "Found next.config.mjs"
else
    echo "ERROR: next.config.mjs not found!"
fi

# Check for .next directory (built app)
if [ -d ".next" ]; then
    echo "Found .next directory"
else
    echo "WARNING: .next directory not found. The app may not be built properly."
fi

# Check memory
free_memory=$(free -m | awk 'NR==2{print $4}')
echo "Free memory: ${free_memory}MB"

# List environment variables (excluding secrets)
echo "Environment variables:"
env | grep -v -e SECRET -e KEY -e PASSWORD | sort

echo "Startup script completed"