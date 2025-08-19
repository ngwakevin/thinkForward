import clsx from 'clsx';
import React from 'react';
import { EventRecord } from '../../data/events';

export function computeStatus(evt: EventRecord) {
  const now = Date.now();
  const start = Date.parse(evt.startDate);
  const end = evt.endDate ? Date.parse(evt.endDate) : start;
  if (evt.capacity && evt.registered && evt.registered >= evt.capacity) return 'full';
  if (now >= start && now <= end) return 'live';
  if (now < start) return 'upcoming';
  if (evt.replayVideoUrl) return 'replay';
  return 'past';
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    live: 'bg-red-500/15 text-red-400 ring-red-500/30 animate-pulse',
    upcoming: 'bg-accent/15 text-accent ring-accent/30',
    replay: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
    past: 'bg-fg-muted/10 text-fg-muted ring-fg-muted/20',
    waitlist: 'bg-amber-500/15 text-amber-400 ring-amber-500/30',
    full: 'bg-amber-600/15 text-amber-500 ring-amber-600/30',
  };
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset', styles[status] || styles.upcoming)}>
      {status.toUpperCase()}
    </span>
  );
}
