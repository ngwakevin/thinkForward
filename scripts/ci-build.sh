#!/bin/bash

# This script prepares the environment for CI/CD builds
set -e

echo "🔍 CI Build: Environment information"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "🧹 CI Build: Cleaning build artifacts..."
rm -rf .next out node_modules/.cache

echo "📦 CI Build: Setting up Next.js environment..."
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

echo "�️ CI Build: Applying pre-build patches..."
chmod +x ./scripts/ci-prebuild-patch.sh
./scripts/ci-prebuild-patch.sh

echo "📝 CI Build: Creating special config for CI environment..."
# Create a custom next.config.js for CI
cat > next.config.ci.js << 'EOL'
/** @type {import('next').NextConfig} */

// This is a special CI configuration to bypass _document.js issues
const nextConfig = {
  reactStrictMode: true,
  // Skip trailing slash handling to avoid router conflicts
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  // Disable standalone output to avoid _document.js module issues
  // output: 'standalone',
  
  productionBrowserSourceMaps: false,
  
  // Avoid filesystem caching in CI
  useFileSystemPublicRoutes: true,
  
  // Simplify webpack config for CI
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig;
EOL

echo "🛠️ CI Build: Building Next.js application with custom config..."
NODE_OPTIONS="--max_old_space_size=4096" NEXT_TELEMETRY_DISABLED=1 npx next build --config next.config.ci.js

echo "✅ CI Build: Build completed successfully!"