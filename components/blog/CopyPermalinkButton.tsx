'use client';
import { useState } from 'react';

export function CopyPermalinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    try {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className="hover:text-accent relative"
      aria-label={copied ? 'Permalink copied' : 'Copy permalink'}
      data-analytics="copy_permalink"
    >
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
}
