#!/bin/bash
set -e

echo "🚀 Running custom build script for App Router only..."

# Clean previous builds
rm -rf .next

# Set environment variables
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export NEXT_PRIVATE_PREBUNDLED_REACT=next
export NODE_OPTIONS="--max_old_space_size=4096"

# Create a temporary directory for Next.js to use
mkdir -p .temp-build-dir

# Create a temporary next.config.mjs (ESM format) that only uses App Router
cat > .temp-build-dir/next.config.mjs << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  productionBrowserSourceMaps: false,
  experimental: {
    ppr: false,
    taint: false,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Use non-standard extension to effectively disable Pages Router
  pageExtensions: ['nonexistent'],
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

export default nextConfig;
EOL

# Copy only App Router files to the temporary directory
cp -r app components lib config public .temp-build-dir/
# Copy styles directory if it exists
if [ -d "styles" ]; then
  cp -r styles .temp-build-dir/
fi
cp package.json tsconfig.json .temp-build-dir/

# Run Next.js build in the temporary directory
cd .temp-build-dir
echo "📦 Building Next.js App Router application..."
../node_modules/.bin/next build

# Create a modified package.json without ESM type
cat package.json | grep -v '"type": "module"' > package.json.temp
mv package.json.temp package.json

# Create a CJS next.config.js file
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  productionBrowserSourceMaps: false,
  // Use non-standard extension to effectively disable Pages Router
  pageExtensions: ['nonexistent'],
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

# Run Next.js build directly in this directory
echo "📦 Building Next.js App Router application..."
../node_modules/.bin/next build

# Copy built files back to main directory
cd ..
echo "📋 Copying built files back to main directory..."
cp -r .temp-build-dir/.next .
cp -r .temp-build-dir/public .

# Clean up
echo "🧹 Cleaning up temporary files..."
rm -rf .temp-build-dir

echo "✅ App Router build completed successfully!"