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

APP_ROOT="$(pwd)"

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

# Backfill Next compiled internals if missing (fixes 'next/dist/compiled/cookie' not found)
TARGET_COMPILED_DIR="$RUNTIME_DIR/standalone/node_modules/next/dist/compiled"
SOURCE_COMPILED_DIR="$APP_ROOT/node_modules/next/dist/compiled"

if [ ! -d "$TARGET_COMPILED_DIR/cookie" ]; then
  echo "Compiled 'cookie' module missing from standalone bundle; attempting backfill from root node_modules..."
  if [ -d "$SOURCE_COMPILED_DIR" ]; then
    mkdir -p "$TARGET_COMPILED_DIR"
    # Copy entire compiled folder to ensure all vendored modules are present
    cp -R "$SOURCE_COMPILED_DIR/"* "$TARGET_COMPILED_DIR/" 2>/dev/null || true
  else
    echo "WARNING: Source compiled directory not found at $SOURCE_COMPILED_DIR"
  fi
fi

if [ -d "$TARGET_COMPILED_DIR/cookie" ]; then
  echo "Verified: next/dist/compiled/cookie present in runtime standalone."
else
  echo "WARNING: next/dist/compiled/cookie still missing after backfill. Server may fail to start."
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

# Allow opting out of standalone mode via env flag
if [ "${RUN_NEXT_NON_STANDALONE:-0}" = "1" ]; then
  echo "RUN_NEXT_NON_STANDALONE=1 set; starting 'next start' from app root as a fallback..."
  cd "$APP_ROOT"
  npx --yes next start || npm run start
  exit $?
fi

# Try standalone; if it fails, fallback to next start (non-standalone)
node server.js
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo "Standalone server exited with code $EXIT_CODE; attempting fallback to 'next start' from app root..."
  cd "$APP_ROOT"
  npx --yes next start || npm run start
  exit $?
fi

exit 0