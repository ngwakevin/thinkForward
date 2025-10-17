// This file exists only to satisfy Next.js build process
// The actual application uses the App Router in the /app directory

import '../app/globals.css';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;