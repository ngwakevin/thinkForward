'use client';
import React, { useState } from 'react';

interface CopyButtonProps { code: string }

export function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    try {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button
      onClick={onCopy}
      className="absolute top-2 right-2 rounded bg-bg-alt/80 border border-border/60 px-2 py-1 text-[10px] text-fg-muted hover:text-fg focus:outline-none focus:ring-2 focus:ring-accent/50"
      aria-label={copied ? 'Code copied' : 'Copy code'}
      type="button"
    >{copied ? 'Copied' : 'Copy'}</button>
  );
}
