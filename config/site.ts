export const siteConfig = {
  name: 'CloudAcers',
  tagline: 'Train. Build. Elevate.',
  // Ensure we always have a valid URL for metadataBase - Next.js requires this during build
  url: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://thinkforward-dev.azurewebsites.net',
  description: 'Structured cloud & DevOps momentum: tracks, mentorship, events, and practical guides.',
  locale: 'en_US',
  twitter: '@cloudacers',
  author: 'CloudAcers',
  calendly: 'https://calendly.com/ngwakevin/mentoring',
};
