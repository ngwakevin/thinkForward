'use client';

import { useState } from 'react';

export function ShareCopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    try {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button className="hover:text-accent" onClick={onCopy} type="button">
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
}
