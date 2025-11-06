import { BootcampPaths } from '../../components/bootcamps/BootcampPaths';
import { events } from '../../data/events';
import { computeStatus } from '../../components/events/StatusBadge';
import { EventCard } from '../../components/events/EventCard';
import { BootcampsClient } from '../bootcamps/BootcampsClient';

export default function PreviewBootcampPathsPage() {
  const preferredOrder = [
    'cloud-networking-bootcamp-cohort-1',
    'ai-foundation-bootcamp-cohort-1',
  ];
  const orderIndex = (slug: string) => {
    const i = preferredOrder.indexOf(slug);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  const bootcamps = events
    .filter((e) => e.type === 'bootcamp')
    .sort((a, b) => orderIndex(a.slug) - orderIndex(b.slug))
    .map((e) => ({ ...e, status: computeStatus(e) }));
  return (
    <main className="mx-auto max-w-7xl px-6 py-24 space-y-20">
      {/* Live Bootcamps hero + track cards */}
      <BootcampsClient />

      <BootcampPaths />

      <section id="upcoming" className="space-y-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Upcoming Cohorts</h2>
        {bootcamps.length === 0 && (
          <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 text-sm text-fg-muted">
            No bootcamps open right now. Join the waitlist via any event page.
          </div>
        )}
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {bootcamps.map((b: any) => (
            <EventCard key={b.slug} evt={b} />
          ))}
        </div>
      </section>
    </main>
  );
}
