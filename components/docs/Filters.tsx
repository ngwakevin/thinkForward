'use client';
import { useEffect, useState } from 'react';

const DIFF = ['', 'foundation','intermediate','advanced'];
const CATS = ['', 'Getting Started','Concepts','Guides','Playbooks','FAQ','Other'];

export default function DocsFilters() {
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('[data-difficulty]');
    cards.forEach(c => {
      const d = c.getAttribute('data-difficulty') || '';
      const cat = c.getAttribute('data-category') || '';
      const hideDiff = difficulty && d !== difficulty;
      const hideCat = category && cat !== category;
      c.style.display = hideDiff || hideCat ? 'none' : '';
    });
  }, [difficulty, category]);

  const clear = () => { setDifficulty(''); setCategory(''); };

  return (
    <div className="flex flex-wrap items-center gap-3 justify-center md:justify-between text-[11px]">
      <div className="flex gap-3 items-center">
        <label className="flex items-center gap-1"> <span className="text-fg-muted/60">Difficulty</span>
          <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="rounded-md border border-border/60 bg-bg-alt/60 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent">
            {DIFF.map(v=> <option key={v} value={v}>{v || 'All'}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-1"> <span className="text-fg-muted/60">Category</span>
          <select value={category} onChange={e=>setCategory(e.target.value)} className="rounded-md border border-border/60 bg-bg-alt/60 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent">
            {CATS.map(v=> <option key={v} value={v}>{v || 'All'}</option>)}
          </select>
        </label>
        {(difficulty || category) && (
          <button onClick={clear} className="text-fg-muted hover:text-accent transition">Reset</button>
        )}
      </div>
      <div className="flex gap-2">
        {difficulty && <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 text-accent border border-accent/30 px-2 py-0.5">{difficulty}<button onClick={()=>setDifficulty('')} className="ml-1 text-[10px]">×</button></span>}
        {category && <span className="inline-flex items-center gap-1 rounded-full bg-accent-alt/10 text-accent-alt border border-accent-alt/30 px-2 py-0.5">{category}<button onClick={()=>setCategory('')} className="ml-1 text-[10px]">×</button></span>}
      </div>
    </div>
  );
}
