#!/bin/bash

# This script creates a standalone startup script for Azure App Service
# to start the Next.js application directly without complex build directory handling

cat > startup.sh << 'STARTUPSCRIPT'
#!/bin/bash
cd /home/site/wwwroot

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-8080}

# Log startup information
echo "Starting Next.js in production mode"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Direct start approach
if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
  echo "Found valid Next.js build directory (.next)"
  echo "Build ID: $(cat .next/BUILD_ID)"
  echo "Starting Next.js server..."
  node_modules/.bin/next start -p $PORT
else
  echo "ERROR: No valid Next.js build found!"
  exit 1
fi
STARTUPSCRIPT

chmod +x startup.sh
echo "Created startup.sh script"