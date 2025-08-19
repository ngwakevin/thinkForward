import { events } from '../../data/events';
import { computeStatus } from '../../components/events/StatusBadge';
import { FilterBar } from '../../components/events/FilterBar';

export const metadata = { title: 'Events' };

export default function EventsPage() {
  const now = Date.now();
  const enriched = events.map(e => ({ ...e, status: computeStatus(e) }));
  const upcoming = enriched.filter(e => ['upcoming', 'live', 'full', 'waitlist'].includes(e.status));
  const replay = enriched.filter(e => e.status === 'replay');
  const past = enriched.filter(e => e.status === 'past');
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 space-y-24">
      <section className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Events & Cohorts</h1>
        <p className="mt-6 text-fg-muted text-base md:text-lg">Live sessions, focused bootcamps, and hands‑on workshops to accelerate your cloud & DevOps growth.</p>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold mb-6 tracking-tight">Upcoming & Live</h2>
        <FilterBar events={upcoming} />
      </section>

      {replay.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-semibold mb-6 tracking-tight">Replays</h2>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {replay.map(e => (
              <a key={e.slug} href={`/events/${e.slug}`} className="p-5 rounded-2xl border border-border/60 bg-bg-alt/40 hover:border-accent/50 transition">
                <h3 className="font-medium">{e.title}</h3>
                <p className="mt-2 text-sm text-fg-muted line-clamp-2">{e.summary}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-semibold mb-6 tracking-tight">Past</h2>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {past.map(e => (
              <a key={e.slug} href={`/events/${e.slug}`} className="p-5 rounded-2xl border border-border/60 bg-bg-alt/40 hover:border-accent/50 transition">
                <h3 className="font-medium">{e.title}</h3>
                <p className="mt-2 text-sm text-fg-muted line-clamp-2">{e.summary}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
