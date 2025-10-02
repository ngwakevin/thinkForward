"use client";
import { useEffect, useState } from 'react';

interface Heading { id: string; text: string; level: number; }
export function Toc({ headings }: { headings: Heading[] | undefined }) {
  const [active, setActive] = useState<string>('');
  useEffect(() => {
    if (!headings?.length) return;
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 1] }
    );
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!headings?.length) return null;
  return (
    <nav aria-label="Table of contents" className="hidden lg:block absolute left-full ml-16 top-0 pt-2 w-56 text-xs">
      <p className="mb-2 font-semibold text-fg-muted tracking-wide uppercase">On this page</p>
      <ul className="space-y-1">
        {headings.map(h => (
          <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
            <a href={`#${h.id}`} className={`block truncate rounded px-2 py-1 hover:text-accent ${active===h.id ? 'text-accent bg-accent/10' : 'text-fg-muted'}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
