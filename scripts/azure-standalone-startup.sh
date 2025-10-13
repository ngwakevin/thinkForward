#!/bin/bash
# Azure App Service startup script for Next.js standalone mode

echo "Starting Next.js application in standalone mode"
echo "Node version: $(node --version)"
echo "Current directory: $(pwd)"

# Set PORT from environment or use default
PORT=${PORT:-8080}
echo "Using PORT: $PORT"

# Set the host binding to 0.0.0.0 to listen on all interfaces
export HOSTNAME="0.0.0.0"

# Run the standalone server
exec node .next/standalone/server.js