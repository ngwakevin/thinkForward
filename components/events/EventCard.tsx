import React from 'react';
import { EventRecord } from '../../data/events';
import { StatusBadge, computeStatus } from './StatusBadge';

export function EventCard({ evt }: { evt: EventRecord }) {
  const status = computeStatus(evt);
  const start = new Date(evt.startDate);
  const end = evt.endDate ? new Date(evt.endDate) : undefined;
  
  // Map event type to icon
  const typeIcons: Record<string, string> = {
    'bootcamp': 'GraduationCap',
    'live': 'Video',
    'workshop': 'Wrench',
    'ama': 'MessageCircle'
  };
  
  // Map level to colors
  const levelColors: Record<string, string> = {
    'advanced': 'bg-danger/15 text-danger',
    'intermediate': 'bg-warning/15 text-warning',
    'beginner': 'bg-accent/15 text-accent'
  };
  
  // Get duration text
  const getDuration = () => {
    if (evt.commitmentHoursPerWeek && evt.endDate) {
      const weeks = Math.ceil((new Date(evt.endDate).getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
      return `${evt.commitmentHoursPerWeek}h/week • ${weeks} weeks`;
    }
    return evt.commitmentHoursPerWeek ? `${evt.commitmentHoursPerWeek}h/week` : null;
  };
  
  return (
    <div className="relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/60 to-bg-alt/20 p-6 shadow-sm group min-h-[320px]">
      <div className="flex flex-col w-full">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent grid place-items-center">
              <span className={`i-lucide-${typeIcons[evt.type]?.toLowerCase() || 'calendar'} h-5 w-5`} />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold tracking-tight leading-snug">
                <a href={`/events/${evt.slug}`} className="hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40 rounded-sm">
                  {evt.title}
                </a>
              </h3>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-fg-muted">
                {start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                {end && end.getDate() !== start.getDate() && ` - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            {evt.level && (
              <span className={`inline-block rounded-md px-2 py-1 text-[10px] font-medium tracking-wide ${levelColors[evt.level]}`}>
                {evt.level}
              </span>
            )}
            <StatusBadge status={status} />
          </div>
        </div>
        <p className="text-fg-muted leading-relaxed text-sm line-clamp-3">{evt.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {evt.tags.slice(0, 5).map(tag => (
            <span key={tag} className="rounded-md bg-bg-alt/60 border border-border/50 px-2 py-0.5 text-[10px] tracking-wide text-fg-muted">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between text-xs">
          <span className="text-fg-muted">{getDuration() || evt.price || 'Free'}</span>
          <a 
            href={`/events/${evt.slug}`}
            className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent ring-1 ring-accent/40 hover:bg-accent/25 transition"
          >
            View Details →
          </a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
    </div>
  );
}
