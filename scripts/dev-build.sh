#!/bin/bash

# Exit on error
set -e

echo "🧹 Cleaning up previous build artifacts..."
rm -rf .next

echo "🔧 Setting up development environment..."
export NODE_ENV=development

echo "🛠️ Building Next.js app in development mode..."
npx next build

echo "✅ Development build completed!"