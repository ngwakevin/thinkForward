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

# Use the existing next.config.mjs file
echo "Using existing next.config.mjs for build..."
# We'll make a backup just in case
if [ -f "next.config.mjs" ]; then
  cp next.config.mjs next.config.mjs.bak
fi

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
  # Restore the backup if needed
  mv next.config.mjs.bak next.config.mjs
fi

echo "Build completed!"