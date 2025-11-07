'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { HeaderPreview } from './Header.preview';

/**
 * Chooses the correct header variant based on the current route.
 * We render the preview header on the marketing homepage to match
 * the new design, and fall back to the standard header everywhere else.
 */
export function HeaderSwitcher() {
  const pathname = usePathname() ?? '/';

  const marketingPrefixes = [
    '/courses',
    '/solutions',
    '/docs',
    '/community',
    '/bootcamps',
    '/mentoring',
    '/events',
    '/support',
    '/products',
    '/about',
    '/contact',
    '/platform',
    '/roadmaps',
    '/activities',
    '/brand',
    '/preview',
  ];

  const shouldUsePreview =
    pathname === '/' ||
    marketingPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

  if (shouldUsePreview) {
    return <HeaderPreview />;
  }

  return <Header />;
}
