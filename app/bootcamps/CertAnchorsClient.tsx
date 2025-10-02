"use client";

import { useEffect } from 'react';

export function CertAnchorsClient() {
  useEffect(() => {
    const apply = () => {
      if (typeof window === 'undefined') return;
      const raw = window.location.hash;
      if (!raw) return;
      const id = decodeURIComponent(raw.replace(/^#/, ''));
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      // If the target is a <details>, open it; otherwise open the nearest details parent
      const details = (el.tagName.toLowerCase() === 'details' ? (el as HTMLDetailsElement) : el.closest('details')) as HTMLDetailsElement | null;
      if (details && !details.open) details.open = true;
      // Smooth scroll and a brief highlight
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-2', 'ring-accent/40', 'rounded-md');
      window.setTimeout(() => el.classList.remove('ring-2', 'ring-accent/40', 'rounded-md'), 1200);
    };

    apply();
    const onHashChange = () => apply();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return null;
}
