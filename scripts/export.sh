#!/bin/bash

# Exit on error
set -e

echo "🧹 Cleaning up previous build artifacts..."
rm -rf .next out

echo "🔧 Setting up environment..."
export NODE_ENV=production

echo "🛠️ Building Next.js app with 'next build'..."
npx next build

echo "📦 Exporting static files with 'next export'..."
npx next export -o out

echo "✅ Build and export completed successfully!"
echo "Static output is available in the 'out' directory."