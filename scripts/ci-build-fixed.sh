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

# Completely remove Pages Router during build
echo "📁 CI Build: Temporarily removing pages directory to avoid conflicts..."
if [ -d "pages" ]; then
  mv pages pages.bak
fi

# Remove next.config.mjs to avoid confusion
if [ -f "next.config.mjs" ]; then
  mv next.config.mjs next.config.mjs.bak
fi

echo "🛠️ CI Build: Building Next.js application (App Router only)..."
# Run the build with increased memory and simplified settings
NODE_OPTIONS="--max_old_space_size=4096" NEXT_TELEMETRY_DISABLED=1 npx next build

# Restore pages directory after build
echo "📁 CI Build: Restoring project files..."
# Restore package.json
mv package.json.bak package.json

# Restore pages directory
if [ -d "pages.bak" ]; then
  mv pages.bak pages
fi

# Restore next.config.mjs
if [ -f "next.config.mjs.bak" ]; then
  mv next.config.mjs.bak next.config.mjs
fi

# Clean up temporary files
rm -f next.config.js

echo "✅ CI Build: Build completed successfully!"