#!/bin/bash
set -e

# Remove type:module from package.json
echo "Modifying package.json..."
cp package.json package.json.bak
cat package.json | grep -v '"type": "module"' > package.json.temp
mv package.json.temp package.json

# Make a dummy pages folder with a document file
echo "Creating minimal pages directory..."
mkdir -p pages
cat > pages/_document.js << 'EOL'
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
EOL

# Create a simplified next.config.js that focuses on App Router
echo "Creating app-router focused next.config.js..."
if [ -f "next.config.mjs" ]; then
  mv next.config.mjs next.config.mjs.bak
fi

cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  productionBrowserSourceMaps: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, path: false, os: false, net: false,
        tls: false, child_process: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
EOL

# Build
echo "Building with Next.js..."
NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS="--max-old-space-size=4096" npx next build

# Restore
echo "Restoring original files..."
mv package.json.bak package.json
rm -rf pages
if [ -f "next.config.mjs.bak" ]; then
  mv next.config.mjs.bak next.config.mjs
  rm -f next.config.js
fi

echo "Build completed!"