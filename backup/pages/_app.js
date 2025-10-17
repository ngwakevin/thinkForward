// Use CommonJS require to avoid ESM/CJS conflicts
require('../app/globals.css');

// Simple App component
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// Use CommonJS exports
module.exports = MyApp;
