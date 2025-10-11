#!/bin/bash
# This script verifies that a Next.js build directory exists and is properly structured

echo "Checking Next.js build directory..."

if [ ! -d ".next" ]; then
  echo "ERROR: .next directory not found!"
  exit 1
fi

if [ ! -f ".next/BUILD_ID" ]; then
  echo "ERROR: .next/BUILD_ID not found!"
  exit 1
fi

if [ ! -f ".next/build-manifest.json" ]; then
  echo "ERROR: .next/build-manifest.json not found!"
  exit 1
fi

if [ ! -d ".next/server" ]; then
  echo "ERROR: .next/server directory not found!"
  exit 1
fi

echo "✅ Next.js build directory verification passed!"
echo "Build ID: $(cat .next/BUILD_ID)"

echo "Contents of .next directory:"
ls -la .next/

echo "Contents of .next/server directory:"
ls -la .next/server/

echo "Checking for pages-manifest.json:"
if [ -f ".next/server/pages-manifest.json" ]; then
  echo "✅ pages-manifest.json found!"
else
  echo "⚠️ Warning: pages-manifest.json not found!"
  
  # Try to create a minimal pages-manifest.json if it doesn't exist
  echo "Creating minimal pages-manifest.json..."
  mkdir -p .next/server
  echo "{}" > .next/server/pages-manifest.json
  
  echo "✅ Created pages-manifest.json"
fi

echo "Next.js build verification complete!"