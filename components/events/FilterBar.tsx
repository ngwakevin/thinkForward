"use client";
import React, { useMemo, useState } from 'react';
import { EventRecord } from '../../data/events';

interface Props { events: EventRecord[]; }

export function FilterBar({ events }: Props) {
  const [q, setQ] = useState('');
  const [type, setType] = useState<string>('all');
  const [tag, setTag] = useState<string>('all');

  const tags = useMemo(() => Array.from(new Set(events.flatMap(e => e.tags))).sort(), [events]);
  const filtered = events.filter(e => {
    if (type !== 'all' && e.type !== type) return false;
    if (tag !== 'all' && !e.tags.includes(tag)) return false;
    if (q && !e.title.toLowerCase().includes(q.toLowerCase()) && !e.summary.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 items-center">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search events" className="w-56 rounded-md bg-bg-alt/60 border border-border/60 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/40" />
        <select value={type} onChange={e => setType(e.target.value)} className="rounded-md bg-bg-alt/60 border border-border/60 px-3 py-2 text-sm focus:ring-2 focus:ring-accent/40">
          <option value="all">All Types</option>
          <option value="live">Live</option>
          <option value="bootcamp">Bootcamps</option>
          <option value="workshop">Workshops</option>
          <option value="ama">AMA</option>
        </select>
        <select value={tag} onChange={e => setTag(e.target.value)} className="rounded-md bg-bg-alt/60 border border-border/60 px-3 py-2 text-sm focus:ring-2 focus:ring-accent/40">
          <option value="all">All Tags</option>
          {tags.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="text-xs text-fg-muted ml-auto">{filtered.length} shown</div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map(e => <div key={e.slug}><a href={`/events/${e.slug}`}><div className="sr-only">Open event</div></a><div><a href={`/events/${e.slug}`}><EventCard evt={e} /></a></div></div>)}
        {filtered.length === 0 && <div className="col-span-full text-sm text-fg-muted">No events match.</div>}
      </div>
    </div>
  );
}

function EventCard({ evt }: { evt: EventRecord }) {
  const start = new Date(evt.startDate);
  return (
    <div className="flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/50 to-bg-alt/10 p-5 shadow-sm hover:border-accent/50 transition">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-semibold tracking-tight leading-snug">{evt.title}</h3>
      </div>
      <p className="mt-3 text-sm text-fg-muted line-clamp-3">{evt.summary}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-fg-muted/80">
        <span>{start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        <span>• {evt.type}</span>
        {evt.level && <span>• {evt.level}</span>}
        <span>• {evt.price || 'Free'}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1">
        {evt.tags.slice(0, 4).map(t => <span key={t} className="rounded bg-bg-alt/60 px-2 py-0.5 text-[10px]">{t}</span>)}
      </div>
    </div>
  );
}
