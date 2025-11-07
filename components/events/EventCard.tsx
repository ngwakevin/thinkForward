import React from 'react';
import { EventRecord } from '../../data/events';
import { StatusBadge, computeStatus } from './StatusBadge';

type CardVariant = 'default' | 'pastel';

interface EventCardProps {
  evt: EventRecord;
  variant?: CardVariant;
  toneIndex?: number;
}

const pastelGradients = [
  'linear-gradient(140deg, #fef4ff 0%, #e9d6ff 100%)',
  'linear-gradient(140deg, #e6fbff 0%, #cdf4ff 100%)',
  'linear-gradient(140deg, #fff3e8 0%, #ffe5f1 100%)',
  'linear-gradient(140deg, #f1f5ff 0%, #e7f6f1 100%)',
  'linear-gradient(140deg, #fff4ea 0%, #ffe2f2 100%)',
  'linear-gradient(140deg, #fef4ff 0%, #e6f9ff 100%)'
];

const pastelPalettes = [
  { tint: '#5638ff', text: '#5638ff' },
  { tint: '#0ea5e9', text: '#0ea5e9' },
  { tint: '#f97316', text: '#f97316' },
  { tint: '#14b8a6', text: '#14b8a6' },
  { tint: '#ec4899', text: '#ec4899' },
  { tint: '#6366f1', text: '#6366f1' }
];

export function EventCard({ evt, variant = 'default', toneIndex = 0 }: EventCardProps) {
  const status = computeStatus(evt);
  const start = new Date(evt.startDate);
  const end = evt.endDate ? new Date(evt.endDate) : undefined;
  const isPastel = variant === 'pastel';

  const palette = pastelPalettes[toneIndex % pastelPalettes.length];
  const gradient = pastelGradients[toneIndex % pastelGradients.length];

  const typeIcons: Record<string, string> = {
    bootcamp: 'GraduationCap',
    live: 'Video',
    workshop: 'Wrench',
    ama: 'MessageCircle'
  };

  const levelColors: Record<string, string> = {
    advanced: 'bg-danger/15 text-danger',
    intermediate: 'bg-warning/15 text-warning',
    beginner: 'bg-accent/15 text-accent'
  };

  const getDuration = () => {
    if (evt.commitmentHoursPerWeek && evt.endDate) {
      const weeks = Math.ceil((new Date(evt.endDate).getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
      return `${evt.commitmentHoursPerWeek}h/week • ${weeks} weeks`;
    }
    return evt.commitmentHoursPerWeek ? `${evt.commitmentHoursPerWeek}h/week` : null;
  };

  const containerClass = isPastel
    ? 'relative flex min-h-[420px] flex-col overflow-hidden rounded-[32px] border border-white/60 p-6 text-[#241639] shadow-[0_32px_85px_rgba(49,31,73,0.18)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_40px_110px_rgba(49,31,73,0.26)]'
    : 'relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/60 to-bg-alt/20 p-6 shadow-sm group min-h-[420px]';

  const titleLinkClass = isPastel
    ? 'rounded-sm text-[#241639] transition hover:text-[#5638ff]'
    : 'hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40 rounded-sm';

  const descriptionClass = isPastel
    ? 'text-sm leading-relaxed text-[#2f1f4b]/80 line-clamp-3'
    : 'text-fg-muted leading-relaxed text-sm line-clamp-3';

  const curriculumHeadingClass = isPastel
    ? 'text-[11px] font-semibold uppercase tracking-wide text-[#311f49]'
    : 'text-[11px] font-semibold uppercase tracking-wide text-fg';

  const durationClass = isPastel ? 'text-[#2f1f4b]/65' : 'text-fg-muted';

  const primaryButtonClass = isPastel
    ? 'inline-flex items-center gap-1 rounded-full bg-[#311f49] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-white shadow-[0_14px_36px_rgba(49,31,73,0.28)] transition hover:bg-[#5638ff]'
    : 'inline-flex items-center gap-1 rounded-md bg-accent/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent ring-1 ring-accent/40 hover:bg-accent/25 transition';

  const tagClass = isPastel
    ? (tag: string) => ({
        className: 'rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide',
        style: {
          borderColor: `${palette.tint}33`,
          backgroundColor: `${palette.tint}12`,
          color: palette.text
        }
      })
    : () => ({
        className: 'rounded-md bg-bg-alt/60 border border-border/50 px-2 py-0.5 text-[10px] tracking-wide text-fg-muted',
        style: undefined
      });

  return (
    <div className={containerClass} style={isPastel ? { background: gradient } : undefined}>
      <div className="flex h-full w-full flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={isPastel ? 'grid h-11 w-11 place-items-center rounded-2xl' : 'grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent'}
              style={isPastel ? { backgroundColor: `${palette.tint}1a`, color: palette.tint } : undefined}
            >
              <span className={`i-lucide-${typeIcons[evt.type]?.toLowerCase() || 'calendar'} h-5 w-5`} />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold leading-snug tracking-tight">
                <a href={`/events/${evt.slug}`} className={titleLinkClass}>
                  {evt.title}
                </a>
              </h3>
              <p className={isPastel ? 'mt-1 text-[10px] uppercase tracking-wide text-[#2f1f4b]/65' : 'mt-1 text-[10px] uppercase tracking-wide text-fg-muted'}>
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

        <p className={descriptionClass}>{evt.summary}</p>

        {evt.modules && evt.modules.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className={curriculumHeadingClass}>Curriculum</h4>
            <ul className="space-y-1.5">
              {evt.modules.slice(0, 3).map((module, i) => (
                <li
                  key={i}
                  className={isPastel ? 'flex items-start gap-2 text-[11px] text-[#2f1f4b]/70' : 'flex items-start gap-2 text-[11px] text-fg-muted'}
                >
                  <span
                    className="mt-1 h-1 w-1 flex-shrink-0 rounded-full"
                    style={isPastel ? { backgroundColor: palette.tint } : undefined}
                  />
                  <span>{module.title}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {evt.tags.slice(0, 5).map((tag) => {
            const { className, style } = tagClass(tag);
            return (
              <span key={tag} className={className} style={style as React.CSSProperties | undefined}>
                {tag}
              </span>
            );
          })}
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between text-xs">
          <span className={durationClass}>{getDuration() || evt.price || 'Free'}</span>
          <a href={`/events/${evt.slug}`} className={primaryButtonClass}>
            Register Now
          </a>
        </div>
      </div>
      {!isPastel && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 transition group-hover:ring-2 group-hover:ring-accent/30" />
      )}
    </div>
  );
}
