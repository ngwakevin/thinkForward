import { events } from '../../data/events';
import { computeStatus } from '../../components/events/StatusBadge';
import { EventCard } from '../../components/events/EventCard';
import { BootcampsClient } from './BootcampsClient';

export const metadata = { title: 'Live Bootcamps' };

export default function BootcampsPage() {
  const bootcamps = events.filter(e => e.type === 'bootcamp').map(e => ({ ...e, status: computeStatus(e) }));
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 space-y-20">
      <BootcampsClient />
      <section id="upcoming" className="space-y-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Upcoming Cohorts</h2>
        {bootcamps.length === 0 && (
          <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 text-sm text-fg-muted">No bootcamps open right now. Join the waitlist via any event page.</div>
        )}
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {bootcamps.map(b => <EventCard key={b.slug} evt={b} />)}
        </div>
      </section>
      <section className="space-y-8">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/30 p-10 flex flex-col md:flex-row md:items-center gap-10">
          <div className="md:flex-1 space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-tight">Need a different focus?</h2>
            <p className="text-sm text-fg-muted leading-relaxed">Explore live sessions, workshops, and strategy events to complement your cohort experience or warm up before applying.</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="/events" className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-xs font-semibold tracking-wide text-white shadow hover:bg-accent-alt transition">Browse Events</a>
              <a href="/contact" className="inline-flex items-center rounded-md border border-border/70 px-5 py-2.5 text-xs font-semibold tracking-wide hover:border-accent hover:text-accent transition">Ask a Question</a>
            </div>
          </div>
          <ul className="grid gap-4 text-xs md:w-72">
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Small cohort sizes for focused feedback</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Structured weekly execution rhythm</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Portfolio and scenario based assessment</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Accountability & momentum reinforcement</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
