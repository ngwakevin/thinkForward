#!/bin/bash
# This script tests the Azure App Service deployment locally

echo "=== Testing Azure App Service Deployment Locally ==="
echo "Date: $(date)"

# Check that required scripts exist
echo "=== Checking Required Scripts ==="
if [ ! -f "scripts/create-nextjs-wrapper.js" ]; then
  echo "ERROR: scripts/create-nextjs-wrapper.js not found"
  exit 1
fi
echo "✅ scripts/create-nextjs-wrapper.js exists"

if [ ! -f "scripts/diagnose-nextjs.sh" ]; then
  echo "ERROR: scripts/diagnose-nextjs.sh not found"
  exit 1
fi
echo "✅ scripts/diagnose-nextjs.sh exists"

if [ ! -f "scripts/create-direct-startup.sh" ]; then
  echo "ERROR: scripts/create-direct-startup.sh not found"
  exit 1
fi
echo "✅ scripts/create-direct-startup.sh exists"

# Generate the direct start wrapper
echo "=== Generating Direct Start Wrapper ==="
node scripts/create-nextjs-wrapper.js

if [ ! -f "scripts/next-direct-start.js" ]; then
  echo "ERROR: Failed to generate scripts/next-direct-start.js"
  exit 1
fi
echo "✅ scripts/next-direct-start.js generated successfully"

# Generate the startup script
echo "=== Generating Startup Script ==="
bash scripts/create-direct-startup.sh

if [ ! -f "startup.sh" ]; then
  echo "ERROR: Failed to generate startup.sh"
  exit 1
fi
echo "✅ startup.sh generated successfully"

# Test that the next.js build directory exists
echo "=== Checking Next.js Build Directory ==="
if [ ! -d ".next" ]; then
  echo "WARNING: .next directory does not exist - will create minimal structure"
  mkdir -p .next/server
  echo "$(date +%s)" > .next/BUILD_ID
  echo "{}" > .next/server/pages-manifest.json
  echo "{}" > .next/build-manifest.json
  echo "✅ Created minimal .next directory structure"
else
  echo "✅ .next directory exists"
fi

# Run the diagnostic script
echo "=== Running Diagnostic Script ==="
bash scripts/diagnose-nextjs.sh

# Test running the app with direct start wrapper
echo "=== Testing Direct Start Wrapper ==="
echo "Starting Next.js for 5 seconds using direct start wrapper..."
PORT=3456
node scripts/next-direct-start.js -p $PORT &
NEXT_PID=$!

# Give it time to start
sleep 5

# Check if the process is still running
if kill -0 $NEXT_PID 2>/dev/null; then
  echo "✅ Next.js server started successfully with direct start wrapper"
  echo "Terminating test server..."
  kill $NEXT_PID
else
  echo "❌ Next.js server failed to start with direct start wrapper"
fi

echo "=== Test Complete ==="
echo "If all checks passed, your deployment should work in Azure App Service."
echo "Make sure to include all required files in your deployment package:"
echo "1. .next directory (with BUILD_ID and server/pages-manifest.json)"
echo "2. scripts/create-nextjs-wrapper.js"
echo "3. scripts/diagnose-nextjs.sh"
echo "4. scripts/create-direct-startup.sh"
echo "Deployment startup command should be: bash scripts/create-direct-startup.sh && bash startup.sh"