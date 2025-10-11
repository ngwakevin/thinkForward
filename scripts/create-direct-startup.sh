#!/bin/bash
# This script creates a startup script for Azure App Service
# to start the Next.js application directly without complex build directory handling

cat > startup.sh << 'STARTUPSCRIPT'
#!/bin/bash
cd /home/site/wwwroot

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-8080}
export NEXT_TELEMETRY_DISABLED=1
export NEXT_IGNORE_FILESYSTEM_CHECK=1
export NEXT_MANUAL_SIG_HANDLE=true

# Run diagnostic script if it exists
if [ -f "scripts/diagnose-nextjs.sh" ]; then
  echo "Running Next.js diagnostic script..."
  bash scripts/diagnose-nextjs.sh
else
  echo "Diagnostic script not found, continuing startup..."
fi

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
  echo "WARNING: No valid Next.js build found, creating empty build files..."
  mkdir -p .next/server
  echo "$(date +%s)" > .next/BUILD_ID
  echo "{}" > .next/server/pages-manifest.json
  echo "{}" > .next/build-manifest.json
  export NEXT_DIST_DIR=".next"
fi

# Create the direct start wrapper if it doesn't exist
if [ ! -f "scripts/next-direct-start.js" ]; then
  echo "Creating Next.js direct start wrapper..."
  node scripts/create-nextjs-wrapper.js
fi

# Use the direct start wrapper if available
if [ -f "scripts/next-direct-start.js" ]; then
  echo "Starting Next.js using direct start wrapper..."
  node scripts/next-direct-start.js -p $PORT
else
  echo "Falling back to standard npx approach..."
  npx next start -p $PORT
fi
STARTUPSCRIPT

chmod +x startup.sh
echo "Created startup.sh script"