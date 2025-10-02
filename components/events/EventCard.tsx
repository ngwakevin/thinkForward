import React from 'react';
import { EventRecord } from '../../data/events';
import { StatusBadge, computeStatus } from './StatusBadge';

export function EventCard({ evt }: { evt: EventRecord }) {
  const status = computeStatus(evt);
  const start = new Date(evt.startDate);
  const end = evt.endDate ? new Date(evt.endDate) : undefined;
  return (
    <div className="flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/50 to-bg-alt/10 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-semibold tracking-tight leading-snug">
          <a href={`/events/${evt.slug}`} className="hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40 rounded-sm">
            {evt.title}
          </a>
        </h3>
        <StatusBadge status={status} />
      </div>
      <p className="mt-3 text-sm text-fg-muted line-clamp-3">{evt.summary}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-fg-muted/80">
        <span>{start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        {end && end.getDate() !== start.getDate() && <span>- {end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}
        <span>• {evt.type}</span>
        {evt.level && <span>• {evt.level}</span>}
        <span>• {evt.price || 'Free'}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1">
        {evt.tags.slice(0, 4).map(t => <span key={t} className="rounded bg-bg-alt/60 px-2 py-0.5 text-[10px]">{t}</span>)}
      </div>
      <div className="mt-5 pt-2">
        <a href={`/events/${evt.slug}`} className="text-xs font-medium text-accent hover:underline">Details →</a>
      </div>
    </div>
  );
}
