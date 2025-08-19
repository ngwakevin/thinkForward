'use client';
import { useEffect, useState } from 'react';
interface Props { categories: string[]; }
export default function DocsSidebar({ categories }: Props) {
  const [active, setActive] = useState<string>('');
  useEffect(() => {
    const headings = document.querySelectorAll<HTMLElement>('.doc-category-section');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.getAttribute('data-category') || ''); });
    }, { rootMargin: '0px 0px -70% 0px' });
    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  }, []);
  return (
    <nav className="sticky top-28 hidden md:flex flex-col gap-2 text-[12px]" aria-label="Doc sections">
      {categories.map(cat => {
        const id = cat.replace(/\s+/g,'-').toLowerCase();
        const current = active === cat;
        return (
          <a key={cat} href={`#${id}`} className={`relative px-3 py-1.5 rounded-md font-medium transition ${current ? 'text-accent bg-accent/10' : 'text-fg-muted hover:text-fg'}`}>{cat}</a>
        );
      })}
    </nav>
  );
}
