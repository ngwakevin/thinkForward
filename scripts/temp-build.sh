#!/bin/bash
set -e

# Remove type:module from package.json
echo "Modifying package.json..."
cp package.json package.json.bak
cat package.json | grep -v '"type": "module"' > package.json.temp
mv package.json.temp package.json

# Make a dummy pages folder with a document file
echo "Creating minimal pages directory..."
PAGES_DIR_CREATED=0
if [ ! -d "pages" ]; then
  mkdir -p pages
  PAGES_DIR_CREATED=1
fi

DOCUMENT_CREATED=0
if [ ! -f "pages/_document.js" ] && [ ! -f "pages/_document.tsx" ]; then
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
  DOCUMENT_CREATED=1
fi

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

if [ "$DOCUMENT_CREATED" -eq 1 ]; then
  rm -f pages/_document.js
fi

if [ "$PAGES_DIR_CREATED" -eq 1 ]; then
  rmdir pages 2>/dev/null || true
fi
if [ -f "next.config.mjs.bak" ]; then
  mv next.config.mjs.bak next.config.mjs
  rm -f next.config.js
fi

echo "Build completed!"