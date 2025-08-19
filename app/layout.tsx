import './globals.css';
import type { ReactNode } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ThemeProvider } from '../components/theme/ThemeProvider';
import { siteConfig } from '../config/site';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    site: siteConfig.twitter,
    creator: siteConfig.twitter,
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const analyticsKey = process.env.NEXT_PUBLIC_ANALYTICS_KEY;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-bg text-fg antialiased`}>
        {/* Simple lightweight analytics hook */}
        {analyticsKey && (
          <script
            // Basic inline script to capture clicks on data-analytics elements and beacon them.
            dangerouslySetInnerHTML={{ __html: `(()=>{const k='${analyticsKey}';function send(ev,detail){try{navigator.sendBeacon&&navigator.sendBeacon('/__a',JSON.stringify({k,ev,detail,t:Date.now()}));}catch(_){} }document.addEventListener('click',e=>{const el=e.target.closest('[data-analytics]');if(!el) return;send(el.getAttribute('data-analytics'),{href:el.getAttribute('href')});});})();` }} />
        )}
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] rounded-md bg-accent px-4 py-2 text-white text-sm shadow-lg">Skip to content</a>
        <ThemeProvider>
          <Header />
          <main id="main" role="main" className="min-h-[60vh] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
