// Force CommonJS format for Next.js compatibility
require('../app/globals.css');

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

module.exports = MyApp;
