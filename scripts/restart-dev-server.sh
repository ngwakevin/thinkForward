#!/bin/bash
# Script to restart Next.js development server

echo "==================================================="
echo "     Restarting Next.js Development Server        "
echo "==================================================="

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "❌ npm is not installed"
  exit 1
fi

# Kill any existing Next.js development servers
echo "Stopping any existing Next.js development servers..."
pkill -f "node.*next"

# Go to project directory
cd "$(dirname "$0")/.."
echo "Project directory: $(pwd)"

# Check if package.json exists
if [[ ! -f "package.json" ]]; then
  echo "❌ package.json not found in $(pwd)"
  exit 1
fi

# Install dependencies if node_modules doesn't exist
if [[ ! -d "node_modules" ]]; then
  echo "Installing dependencies..."
  npm install
fi

# Start development server
echo "Starting Next.js development server..."
npm run dev