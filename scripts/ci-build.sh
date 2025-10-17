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

echo "🔧 CI Build: Verifying pages directory structure..."
# Check if the pages directory exists and has the required files
if [ ! -d "pages" ]; then
  echo "Creating pages directory..."
  mkdir -p pages
fi

# Create class-based _document.js which is more compatible with older Next.js builds
echo "Creating standard _document.js for compatibility..."
cat > pages/_document.js << 'EOL'
import Document, { Html, Head, Main, NextScript } from 'next/document';

// This custom Document component is needed for both App Router and Pages Router support
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
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
}

export default MyDocument;
EOL

# Create standard _app.js file
echo "Creating standard _app.js for compatibility..."
cat > pages/_app.js << 'EOL'
import '../app/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
EOL

echo "🛠️ CI Build: Building Next.js application..."
NODE_OPTIONS="--max_old_space_size=4096" npx next build

echo "✅ CI Build: Build completed successfully!"