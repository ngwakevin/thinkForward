#!/bin/bash

# Deep clean script to reset the project to a clean state
# Use this when experiencing persistent build issues

set -e
echo "🧹 Starting deep clean process..."

# Kill any running Next.js processes
echo "Stopping any running Next.js processes..."
pkill -f "node.*next" || true

echo "Removing build artifacts..."
rm -rf .next
rm -rf out
rm -rf standalone
rm -rf node_modules/.cache
rm -rf .vercel/output
rm -rf .vercel/cache

echo "Cleaning npm cache..."
npm cache clean --force

echo "Would you like to remove node_modules and reinstall packages? (y/n)"
read -r REMOVE_MODULES

if [[ "$REMOVE_MODULES" =~ ^[Yy]$ ]]; then
  echo "Removing node_modules..."
  rm -rf node_modules

  echo "Removing package-lock.json..."
  rm -f package-lock.json
  
  echo "Reinstalling dependencies..."
  npm install
fi

echo "Removing any temporary files..."
find . -name "*.bak" -type f -delete
find . -name "*.tmp" -type f -delete
find . -name "*.log" -type f -delete

echo "✅ Deep clean complete!"
echo "You can now run 'npm run dev' or 'npm run build' to start fresh."