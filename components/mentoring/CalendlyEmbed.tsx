"use client";
import { useEffect, useState } from 'react';

interface CalendlyEmbedProps { url?: string | null; height?: number; }

export function CalendlyEmbed({ url, height = 760 }: CalendlyEmbedProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    try {
      const u = new URL(url);
      // Append embed params if missing
      if (!u.searchParams.has('embed_type')) u.searchParams.set('embed_type', 'Inline');
      // Use current host for embed_domain
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        u.searchParams.set('embed_domain', host);
      }
      setSrc(u.toString());
    } catch (e: any) {
      setError('Invalid Calendly URL');
    }
  }, [url]);

  if (!url) {
    return (
      <div className="text-xs text-fg-muted rounded-md border border-border/60 bg-bg-alt/40 p-4">
        Set <code className="font-mono">NEXT_PUBLIC_CALENDLY_URL</code> to enable direct scheduling.
      </div>
    );
  }
  if (error) {
    return <div className="text-xs text-danger">{error}</div>;
  }
  if (!src) {
    return <div className="h-40 grid place-items-center text-xs text-fg-muted">Loading scheduler…</div>;
  }
  return (
    <iframe
      src={src}
      title="Mentoring scheduling"
      className="w-full rounded-xl border border-border/60 bg-bg-alt"
      style={{ height }}
      loading="lazy"
    />
  );
}
