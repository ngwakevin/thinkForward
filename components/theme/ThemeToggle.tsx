'use client';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (dark) root.classList.add('dark'); else root.classList.remove('dark');
    }
  }, [dark]);
  return (
    <button
      onClick={() => setDark(d => !d)}
      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-bg-alt transition"
      aria-label="Toggle dark mode"
    >
      <span className="h-4 w-4 rounded-full bg-accent" /> {dark ? 'Dark' : 'Light'}
    </button>
  );
}
