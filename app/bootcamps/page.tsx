import { events } from '../../data/events';
import { computeStatus } from '../../components/events/StatusBadge';
import { EventCard } from '../../components/events/EventCard';
import { BootcampsClient } from './BootcampsClient';

export const metadata = { title: 'Live Bootcamps' };

export default function BootcampsPage() {
  const bootcamps = events.filter(e => e.type === 'bootcamp').map(e => ({ ...e, status: computeStatus(e) }));
  const certificateTracks = [
    { 
      title: 'AZ-305: Designing Microsoft Azure Infrastructure Solutions',
      provider: 'Microsoft Azure',
      level: 'Expert',
      icon: 'i-lucide-cloud',
      color: 'blue'
    },
    { 
      title: 'AZ-400: Designing and Implementing Microsoft DevOps Solutions',
      provider: 'Microsoft Azure',
      level: 'Expert',
      icon: 'i-lucide-git-branch',
      color: 'blue'
    },
    { 
      title: 'SC-100: Microsoft Certified: Cybersecurity Architect Expert',
      provider: 'Microsoft',
      level: 'Expert',
      icon: 'i-lucide-shield',
      color: 'purple'
    },
    { 
      title: 'AZ-500: Microsoft Certified: Azure Security Engineer Associate',
      provider: 'Microsoft Azure',
      level: 'Associate',
      icon: 'i-lucide-lock',
      color: 'blue'
    },
    { 
      title: 'Google Cloud Professional Cloud Architect',
      provider: 'Google Cloud',
      level: 'Professional',
      icon: 'i-lucide-building-2',
      color: 'orange'
    },
    { 
      title: 'Google Cloud Associate Cloud Engineer',
      provider: 'Google Cloud',
      level: 'Associate',
      icon: 'i-lucide-settings',
      color: 'orange'
    },
    { 
      title: 'AWS Certified Solutions Architect - Associate',
      provider: 'Amazon Web Services',
      level: 'Associate',
      icon: 'i-lucide-layout-grid',
      color: 'amber'
    },
    { 
      title: 'AWS Certified Solutions Architect - Professional',
      provider: 'Amazon Web Services',
      level: 'Professional',
      icon: 'i-lucide-network',
      color: 'amber'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 space-y-20">
      <BootcampsClient />
      
      {/* Certificate Tracks Section */}
      <section className="space-y-10">
        <div className="space-y-4">
          <h2 className="font-display text-3xl font-bold tracking-tight">Bootcamp Certificate Tracks</h2>
          <p className="text-fg-muted text-base leading-relaxed max-w-3xl">
            Prepare for industry-recognized certifications with our structured bootcamp programs. Each track includes hands-on labs, practice exams, and expert guidance.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificateTracks.map((cert, idx) => (
            <div key={idx} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <span className={`h-10 w-10 inline-flex items-center justify-center rounded-xl bg-${cert.color}-500/15 text-${cert.color}-600 ${cert.icon}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center rounded-full bg-${cert.color}-500/15 text-${cert.color}-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-${cert.color}-500/40`}>
                      {cert.level}
                    </span>
                  </div>
                  <h3 className="font-semibold tracking-tight text-base leading-snug">{cert.title}</h3>
                  <p className="text-xs text-fg-muted mt-1">{cert.provider}</p>
                </div>
              </div>
              <div className="mt-auto pt-4 flex items-center gap-4">
                <a 
                  href={`/bootcamps/register?track=${encodeURIComponent(cert.title)}`}
                  className="text-xs font-medium text-accent hover:text-accent-alt transition"
                >
                  Learn more →
                </a>
                <a
                  href={`/bootcamps/register?track=${encodeURIComponent(cert.title)}`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-accent/15 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-accent ring-1 ring-accent/30 hover:bg-accent/25 hover:ring-accent/50 transition"
                >
                  Register
                  <span className="i-lucide-arrow-right text-[12px]" />
                </a>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
            </div>
          ))}
        </div>
      </section>

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
