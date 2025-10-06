"use client";
import { useState } from 'react';

export function CopyButton({ value, className, label }: { value: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex items-center gap-1 rounded-md border border-border bg-bg-alt px-2 py-1 text-[11px] font-medium hover:bg-bg-alt/70 transition ${className || ''}`}
      aria-label={label || 'Copy'}
    >
      <span className="truncate max-w-[120px]">{copied ? 'Copied!' : (label || 'Copy')}</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    </button>
  );
}
