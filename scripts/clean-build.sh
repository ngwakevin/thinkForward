#!/bin/bash

# Set up error handling
set -e

echo "🧹 Cleaning build artifacts..."
rm -rf .next out

echo "🔄 Resetting build environment..."
# Remove package-lock.json to avoid npm dependency conflicts
rm -f package-lock.json

echo "📦 Installing dependencies with a clean state..."
npm install

echo "🛠️ Configuring build environment..."
# Ensure we're using the right environment
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

echo "🔨 Building Next.js application..."
# Try building with legacy output format first, which is more reliable for apps with both App Router and Pages Router
npx next build

echo "✅ Build completed successfully!"