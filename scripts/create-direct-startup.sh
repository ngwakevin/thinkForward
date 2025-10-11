#!/bin/bash

# This script creates a standalone startup script for Azure App Service
# to start the Next.js application directly without complex build directory handling

cat > startup.sh << 'STARTUPSCRIPT'
#!/bin/bash
cd /home/site/wwwroot

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-8080}
export NEXT_TELEMETRY_DISABLED=1
export NEXT_IGNORE_FILESYSTEM_CHECK=1

# Log startup information
echo "Starting Next.js in production mode"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Verify build directory exists in multiple locations
if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
  echo "Found valid Next.js build directory at ./.next"
  echo "Build ID: $(cat .next/BUILD_ID)"
  echo "Using built-in .next directory"
  export NEXT_DIST_DIR=".next"
elif [ -d "/home/site/wwwroot/.next" ] && [ -f "/home/site/wwwroot/.next/BUILD_ID" ]; then
  echo "Found valid Next.js build directory at /home/site/wwwroot/.next"
  echo "Build ID: $(cat /home/site/wwwroot/.next/BUILD_ID)"
  export NEXT_DIST_DIR="/home/site/wwwroot/.next"
else
  echo "ERROR: No valid Next.js build found!"
  echo "Contents of current directory:"
  ls -la
  exit 1
fi

# Start using npx to ensure the correct binary is used
echo "Starting Next.js using npx..."
npx next start -p $PORT
STARTUPSCRIPT

chmod +x startup.sh
echo "Created startup.sh script"