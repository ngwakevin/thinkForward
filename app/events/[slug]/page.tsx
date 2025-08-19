import { events, EventRecord } from '../../../data/events';
import { computeStatus, StatusBadge } from '../../../components/events/StatusBadge';

export function generateStaticParams() {
  return events.map(e => ({ slug: e.slug }));
}

function getEvent(slug: string): EventRecord | undefined {
  return events.find(e => e.slug === slug);
}

function formatRange(startIso: string, endIso?: string) {
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : undefined;
  if (!end) return start.toLocaleString();
  const sameDay = start.toDateString() === end.toDateString();
  if (sameDay) return `${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return `${start.toLocaleString()} – ${end.toLocaleString()}`;
}

export default function EventDetail({ params }: { params: { slug: string } }) {
  const evt = getEvent(params.slug);
  if (!evt) return <div className="px-6 py-24">Not found.</div>;
  const status = computeStatus(evt);
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 space-y-16">
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight flex-1 min-w-0">{evt.title}</h1>
          <StatusBadge status={status} />
        </div>
        <p className="text-fg-muted text-base leading-relaxed max-w-prose">{evt.summary}</p>
        <div className="flex flex-wrap gap-4 text-xs text-fg-muted">
          <span>{formatRange(evt.startDate, evt.endDate)}</span>
          <span>• {evt.type}</span>
          {evt.level && <span>• {evt.level}</span>}
          {evt.price && <span>• {evt.price}</span>}
          <span>• {evt.location}</span>
        </div>
        {evt.registrationUrl && (
          <div className="pt-2">
            <a href={evt.registrationUrl} className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-alt transition">
              {status === 'full' && evt.waitlistEnabled ? 'Join Waitlist' : status === 'replay' ? 'Watch Replay' : 'Register'}
            </a>
          </div>
        )}
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold tracking-tight">Overview</h2>
        <p className="text-sm leading-relaxed text-fg-muted whitespace-pre-line">{evt.description}</p>
      </section>

      {evt.sessions && evt.sessions.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight">Live Session Agenda</h2>
          <ul className="space-y-3 text-sm">
            {evt.sessions.map(s => (
              <li key={s.title} className="rounded-lg border border-border/60 bg-bg-alt/40 p-3 flex flex-col gap-1">
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-fg-muted">{formatRange(s.start, s.end)}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {evt.modules && evt.modules.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight">Curriculum</h2>
          <div className="space-y-3">
            {evt.modules.map(m => (
              <details key={m.title} className="rounded-xl border border-border/60 bg-bg-alt/40 p-4 group">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <span className="font-medium text-sm">Week {m.week}: {m.title}</span>
                  <span className="text-accent text-xs group-open:rotate-45 transition">+</span>
                </summary>
                <ul className="mt-3 list-disc pl-5 text-xs text-fg-muted space-y-1">
                  {m.outcomes.map(o => <li key={o}>{o}</li>)}
                </ul>
              </details>
            ))}
          </div>
        </section>
      )}

      {evt.resources && evt.resources.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight">Resources</h2>
          <ul className="space-y-2 text-sm">
            {evt.resources.map(r => (
              <li key={r.url}>
                <a href={r.url} className="text-accent hover:underline">{r.label}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {evt.prerequisites && evt.prerequisites.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight">Prerequisites</h2>
          <ul className="flex flex-wrap gap-2 text-[11px]">
            {evt.prerequisites.map(p => <li key={p} className="rounded bg-bg-alt/60 px-2 py-1">{p}</li>)}
          </ul>
        </section>
      )}

      {evt.tags && evt.tags.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold tracking-tight">Tags</h2>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {evt.tags.map(t => <span key={t} className="rounded bg-bg-alt/60 px-2 py-1">{t}</span>)}
          </div>
        </section>
      )}

      {(evt.capacity || evt.registered) && (
        <section className="space-y-2 text-xs text-fg-muted">
          {evt.capacity && <div>Capacity: {evt.capacity}</div>}
          {evt.registered != null && <div>Registered: {evt.registered}</div>}
        </section>
      )}
    </div>
  );
}
