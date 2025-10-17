#!/bin/bash

# Ultra-radical CI build script that modifies package.json temporarily
# to avoid ESM/CJS conflicts during build
set -e

echo "🔍 CI Build: Environment information"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "🧹 CI Build: Cleaning build artifacts..."
rm -rf .next out node_modules/.cache

echo "📦 CI Build: Setting up Next.js environment..."
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Save original package.json and create a CI-specific version
echo "📝 CI Build: Temporarily modifying package.json..."
cp package.json package.json.bak

# Remove "type": "module" from package.json
node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  // Remove type:module which causes ESM/CJS conflicts
  delete pkg.type;
  // Save modified package.json
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# Create a CI-specific next.config.js
echo "📝 CI Build: Creating temporary Next.js configuration..."
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */

// Ultra-simplified CI configuration 
const nextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  // Always use standalone output for Azure App Service deployment
  output: 'standalone',
  
  // Effectively disable Pages Router by using non-standard extension
  pageExtensions: ['nonexistent'],
  
  // Disable source maps in CI for faster builds
  productionBrowserSourceMaps: false,
  
  // Avoid webpack extensions to reduce complexity
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
EOL

# No need to handle Pages Router since it's removed
echo "🛠️ CI Build: Building Next.js application (App Router only)..."

# Extra cleanup to ensure no Pages Router artifacts exist
echo "🧹 CI Build: Extra cleanup of Pages Router artifacts..."
rm -rf .next/server/pages
rm -rf .next/server/tic/chunks/pages

# Run the build with increased memory and simplified settings
# Set environment variables to ensure App Router only mode
export NEXT_PRIVATE_PREBUNDLED_REACT="next"
export NEXT_PRIVATE_STANDALONE="1"
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=production
NODE_OPTIONS="--max_old_space_size=4096" npx next build

# Restore project files
echo "📁 CI Build: Restoring project files..."
# Restore package.json
mv package.json.bak package.json

# Remove next.config.mjs to avoid confusion
if [ -f "next.config.mjs.bak" ]; then
  mv next.config.mjs.bak next.config.mjs
fi

# Clean up temporary files
rm -f next.config.js

echo "✅ CI Build: Build completed successfully!"