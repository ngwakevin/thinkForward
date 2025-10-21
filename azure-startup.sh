#!/bin/bash
# azure-startup.sh - Optimized startup script for Azure App Service with Next.js standalone mode

echo "=== ThinkForward Azure App Service Startup Script ==="
echo "Starting at: $(date)"

# Set NODE_ENV to production if not already set
if [ -z "$NODE_ENV" ]; then
  export NODE_ENV="production"
  echo "Set NODE_ENV to production"
fi

RUNTIME_DIR="/home/site/temp/thinkforward-runtime"
STANDALONE_SRC=".next/standalone"
STATIC_SRC=".next/static"
SERVER_SRC=".next/server"

echo "Creating runtime directories at $RUNTIME_DIR..."
mkdir -p "$RUNTIME_DIR/standalone/.next"

if [ ! -d "$STANDALONE_SRC" ]; then
  echo "❌ Missing $STANDALONE_SRC. Was Next built with output=standalone?"
  echo "Aborting startup."; exit 1
fi

echo "Copying standalone server files..."
cp -R "$STANDALONE_SRC/"* "$RUNTIME_DIR/standalone/"

echo "Copying .next/static..."
mkdir -p "$RUNTIME_DIR/standalone/.next/static"
cp -R "$STATIC_SRC" "$RUNTIME_DIR/standalone/.next/" 2>/dev/null || true

echo "Copying .next/server (app routes, pages, manifests)..."
mkdir -p "$RUNTIME_DIR/standalone/.next/server"
cp -R "$SERVER_SRC" "$RUNTIME_DIR/standalone/.next/" 2>/dev/null || true

if [ -d "public" ]; then
  echo "Copying public assets..."
  cp -R public "$RUNTIME_DIR/standalone/" 2>/dev/null || true
fi

echo "Listing runtime standalone directory:"
ls -la "$RUNTIME_DIR/standalone"
echo "Listing runtime .next contents:"
ls -la "$RUNTIME_DIR/standalone/.next" || true

echo "Checking for Next.js build in expected locations..."

# Check if .next exists in current directory
BUILD_ID_SRC=".next/BUILD_ID"
if [ -f "$BUILD_ID_SRC" ]; then
  echo "Found BUILD_ID: $(cat "$BUILD_ID_SRC")"
else
  echo "⚠️ No BUILD_ID found at $BUILD_ID_SRC"
fi

chmod -R 755 "$RUNTIME_DIR" || true

# Display environment for debugging
echo "=== Environment Variables ==="
echo "NODE_ENV: $NODE_ENV"
echo "NEXT_DIST_DIR: $NEXT_DIST_DIR"
echo "WEBSITE_SITE_NAME: $WEBSITE_SITE_NAME"

# Start the application from runtime standalone directory
echo "=== Starting Node.js Server in Standalone Mode ==="
echo "Start time: $(date)"
cd "$RUNTIME_DIR/standalone"
exec node server.js