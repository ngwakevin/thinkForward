'use client';
import { useState } from 'react';
import Giscus from './Giscus';

export default function LazyComments() {
  const [open, setOpen] = useState(false);
  if (!open) return (
    <div className="mx-auto max-w-3xl px-6 mt-16">
      <button onClick={()=>setOpen(true)} className="rounded-md border border-border/60 bg-bg-alt/40 px-4 py-2 text-xs font-medium hover:bg-bg-alt/60">Load Comments</button>
    </div>
  );
  return (
    <section className="mt-16" id="comments">
      <Giscus />
    </section>
  );
}
