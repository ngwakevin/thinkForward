#!/bin/bash

# Create temp directories in a location the app can write to
export NEXT_TEMP_DIR="/home/site/next-temp"
mkdir -p "$NEXT_TEMP_DIR" || echo "Could not create temp directory at $NEXT_TEMP_DIR"
export NEXT_CACHE_DIR="$NEXT_TEMP_DIR/cache"
mkdir -p "$NEXT_CACHE_DIR" || echo "Could not create cache directory at $NEXT_CACHE_DIR"

# Set environment variables for Next.js
export NEXT_DISABLE_FILESYSTEM_CACHE=1
export NEXT_TELEMETRY_DISABLED=1

# Log the current directory and files for debugging
echo "Current directory: $(pwd)"
echo "Files in current directory: $(ls -la)"

# Log environment variables (excluding sensitive ones)
echo "NODE_ENV: $NODE_ENV"
echo "COSMOS_ENDPOINT is set: $(if [ -n "$COSMOS_ENDPOINT" ]; then echo "Yes"; else echo "No"; fi)"
echo "COSMOS_DB_ENDPOINT is set: $(if [ -n "$COSMOS_DB_ENDPOINT" ]; then echo "Yes"; else echo "No"; fi)"
echo "COSMOS_KEY is set: $(if [ -n "$COSMOS_KEY" ]; then echo "Yes"; else echo "No"; fi)"
echo "COSMOS_DB_KEY is set: $(if [ -n "$COSMOS_DB_KEY" ]; then echo "Yes"; else echo "No"; fi)"
echo "COSMOS_DATABASE is set: $(if [ -n "$COSMOS_DATABASE" ]; then echo "Yes"; else echo "No"; fi)"
echo "COSMOS_DB_DATABASE_ID is set: $(if [ -n "$COSMOS_DB_DATABASE_ID" ]; then echo "Yes"; else echo "No"; fi)"

# If COSMOS_KEY is not set but COSMOS_DB_KEY is, copy the value
if [ -z "$COSMOS_KEY" ] && [ -n "$COSMOS_DB_KEY" ]; then
  echo "Setting COSMOS_KEY from COSMOS_DB_KEY"
  export COSMOS_KEY="$COSMOS_DB_KEY"
fi

# If COSMOS_ENDPOINT is not set but COSMOS_DB_ENDPOINT is, copy the value
if [ -z "$COSMOS_ENDPOINT" ] && [ -n "$COSMOS_DB_ENDPOINT" ]; then
  echo "Setting COSMOS_ENDPOINT from COSMOS_DB_ENDPOINT"
  export COSMOS_ENDPOINT="$COSMOS_DB_ENDPOINT"
fi

# If COSMOS_DATABASE is not set but COSMOS_DB_DATABASE_ID is, copy the value
if [ -z "$COSMOS_DATABASE" ] && [ -n "$COSMOS_DB_DATABASE_ID" ]; then
  echo "Setting COSMOS_DATABASE from COSMOS_DB_DATABASE_ID"
  export COSMOS_DATABASE="$COSMOS_DB_DATABASE_ID"
fi

# Start the Node.js server
echo "Starting Node.js server with custom environment..."
exec node server.js
