#!/bin/bash

# Clean rebuild script for ThinkForward

echo "🧹 Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache

echo "🔄 Reinstalling dependencies..."
npm ci

echo "🛠️ Building Next.js application..."
npx next build --no-lint

echo "✅ Build process completed!"