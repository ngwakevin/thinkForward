#!/bin/bash

# This script runs directly before the Next.js build in CI environments
# It modifies the Next.js configuration to handle the _document.js issue

echo "🩹 CI Patch: Applying fixes for Next.js build issues..."

# Create a JavaScript version of our critical files
echo "Creating compatibility versions of essential Next.js files..."

# Create a plain JavaScript _document.js file 
mkdir -p pages
cat > pages/_document.js << 'EOL'
// Force CommonJS format for Next.js compatibility
const NextDocument = require('next/document');
const Html = NextDocument.Html;
const Head = NextDocument.Head;
const Main = NextDocument.Main;
const NextScript = NextDocument.NextScript;

function Document() {
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

module.exports = Document;
EOL

# Create a plain JavaScript _app.js file
cat > pages/_app.js << 'EOL'
// Force CommonJS format for Next.js compatibility
require('../app/globals.css');

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

module.exports = MyApp;
EOL

# Create an empty index.js to satisfy Next.js Pages Router requirements
cat > pages/index.js << 'EOL'
// This is a placeholder to satisfy Next.js Pages Router requirements
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function LegacyIndexPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the App Router homepage
    router.replace('/');
  }, [router]);
  
  return <div>Redirecting...</div>;
}
EOL

echo "✅ CI Patch: Successfully applied fixes for Next.js build"