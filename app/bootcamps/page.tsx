import { events } from '../../data/events';
import { computeStatus } from '../../components/events/StatusBadge';
import { EventCard } from '../../components/events/EventCard';
import { BootcampsClient } from './BootcampsClient';
import { CertAnchorsClient } from './CertAnchorsClient';
import { CERTS, byVendorLevel, type CertItem } from '../../data/certs';

export const metadata = { title: 'Live Bootcamps' };

export default function BootcampsPage() {
  const levelLabel = (lvl: CertItem['level']) => {
    switch (lvl) {
      case 'fundamentals':
      case 'foundational':
        return 'Foundational';
      case 'associate':
        return 'Associate';
      case 'professional':
        return 'Professional';
      case 'specialty':
        return 'Specialty';
      case 'expert':
        return 'Expert';
      default:
        return lvl;
    }
  };

  const vendorStyle = (v: CertItem['vendor']) => {
    if (v === 'aws') {
      return {
        logo: 'i-lucide-badge-check',
        bg: 'bg-warning/20',
        text: 'text-warning',
        ring: 'ring-warning/40',
        hoverRing: 'group-hover:ring-warning/25',
        levelBg: 'bg-warning/10',
        levelRing: 'ring-warning/30',
      };
    }
    if (v === 'azure') {
      return {
        logo: 'i-lucide-badge',
        bg: 'bg-accent/20',
        text: 'text-accent',
        ring: 'ring-accent/40',
        hoverRing: 'group-hover:ring-accent/25',
        levelBg: 'bg-accent/10',
        levelRing: 'ring-accent/30',
      };
    }
    return {
      logo: 'i-lucide-badge-help',
      bg: 'bg-accent-alt/20',
      text: 'text-accent-alt',
      ring: 'ring-accent-alt/40',
      hoverRing: 'group-hover:ring-accent-alt/25',
      levelBg: 'bg-accent-alt/10',
      levelRing: 'ring-accent-alt/30',
    } as const;
  };

  const weeksRange = (hours: number) => {
    if (hours <= 40) return '3–4 weeks';
    if (hours <= 70) return '4–6 weeks';
    if (hours <= 100) return '6–8 weeks';
    if (hours <= 130) return '8–10 weeks';
    return '10–12 weeks';
  };

  const summary = (item: CertItem) => {
    const vendorName = item.vendor === 'aws' ? 'AWS' : item.vendor === 'azure' ? 'Azure' : 'Google Cloud';
    const lvl = levelLabel(item.level);
    if (item.level === 'specialty') {
      return `Deep‑dive ${vendorName} ${item.title} with hands‑on labs and exam‑style practice.`;
    }
    if (item.level === 'fundamentals' || item.level === 'foundational') {
      return `Build a strong ${vendorName} foundation and get exam‑ready.`;
    }
    if (item.level === 'professional' || item.level === 'expert') {
      return `Design and optimize ${vendorName} solutions with real scenarios and practice exams.`;
    }
    // associate and others
    return `Hands‑on ${vendorName} ${lvl} prep with real labs and exam practice.`;
  };
  const bootcamps = events.filter(e => e.type === 'bootcamp').map(e => ({ ...e, status: computeStatus(e) }));
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 space-y-20">
      {/* Enables deep-linking to specific certificate groups and auto-opens target <details> */}
      <CertAnchorsClient />
      <BootcampsClient />
      {/* Training by Certificate */}
      <section id="cert-training" className="space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Training by Certificate</h2>
          <p className="text-sm text-fg-muted">Targeted prep tracks aligned to vendor exams. Hands‑on labs + exam‑style practice.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <a href="#aws-associate" className="inline-flex items-center rounded-md border border-border/60 px-2.5 py-1.5 hover:border-accent hover:text-accent transition">AWS Associate</a>
          <a href="#azure-associate" className="inline-flex items-center rounded-md border border-border/60 px-2.5 py-1.5 hover:border-accent hover:text-accent transition">Azure Associate</a>
          <a href="#gcp-associate" className="inline-flex items-center rounded-md border border-border/60 px-2.5 py-1.5 hover:border-accent hover:text-accent transition">Google Cloud Associate</a>
        </div>
        {/* Cards layout per certificate, grouped by vendor + level to preserve anchors */}
        <div className="space-y-10">
          {/* AWS */}
          <section id="aws" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold tracking-tight">AWS Certifications</h3>
              </div>
              <a href="#upcoming" className="text-xs font-medium text-accent hover:text-accent-alt transition">Start AWS prep →</a>
            </div>
            {/* Foundational */}
            <div>
              <h4 id="aws-foundational" className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Foundational</h4>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {byVendorLevel('aws', 'foundational').map(item => {
                  const v = vendorStyle(item.vendor);
                  return (
                    <li key={item.id} id={item.id} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center">
                        <h5 className="font-semibold tracking-tight text-lg">{item.title}</h5>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${v.levelBg} ${v.text} ring-1 ${v.levelRing}`}>{levelLabel(item.level)}</span>
                        <span className="text-[11px] text-fg-muted">• {weeksRange(item.hours)}</span>
                      </div>
                      <p className="mt-3 text-sm text-fg-muted leading-relaxed">{summary(item)}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] text-fg-muted">
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-layers-3 h-3.5 w-3.5" /> {item.courses} Courses</span>
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-clock h-3.5 w-3.5" /> {item.hours}h total</span>
                      </div>
                      <div className="mt-5 pt-1">
                        <a href={`/bootcamps/register?intent=cert&cert=${item.id}`} aria-label={`Enroll in ${item.title}`} className="relative inline-flex items-center gap-2 rounded-full bg-warning/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/60 shadow shadow-warning/20 hover:bg-warning/30 hover:shadow-warning/40 focus:outline-none focus:ring-4 focus:ring-warning/40 transition">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                          </span>
                          <span>Enroll</span>
                          <span className="i-lucide-arrow-right text-[14px] -mr-0.5" />
                        </a>
                      </div>
                      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition ${v.hoverRing}`} />
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Associate */}
            <div>
              <h4 id="aws-associate" className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Associate</h4>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {byVendorLevel('aws', 'associate').map(item => {
                  const v = vendorStyle(item.vendor);
                  return (
                    <li key={item.id} id={item.id} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center">
                        <h5 className="font-semibold tracking-tight text-lg">{item.title}</h5>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${v.levelBg} ${v.text} ring-1 ${v.levelRing}`}>{levelLabel(item.level)}</span>
                        <span className="text-[11px] text-fg-muted">• {weeksRange(item.hours)}</span>
                      </div>
                      <p className="mt-3 text-sm text-fg-muted leading-relaxed">{summary(item)}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] text-fg-muted">
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-layers-3 h-3.5 w-3.5" /> {item.courses} Courses</span>
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-clock h-3.5 w-3.5" /> {item.hours}h total</span>
                      </div>
                      <div className="mt-5 pt-1">
                        <a href={`/bootcamps/register?intent=cert&cert=${item.id}`} aria-label={`Enroll in ${item.title}`} className="relative inline-flex items-center gap-2 rounded-full bg-warning/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/60 shadow shadow-warning/20 hover:bg-warning/30 hover:shadow-warning/40 focus:outline-none focus:ring-4 focus:ring-warning/40 transition">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                          </span>
                          <span>Enroll</span>
                          <span className="i-lucide-arrow-right text-[14px] -mr-0.5" />
                        </a>
                      </div>
                      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition ${v.hoverRing}`} />
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Professional */}
            <div>
              <h4 id="aws-professional" className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Professional</h4>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {byVendorLevel('aws', 'professional').map(item => {
                  const v = vendorStyle(item.vendor);
                  return (
                    <li key={item.id} id={item.id} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center">
                        <h5 className="font-semibold tracking-tight text-lg">{item.title}</h5>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${v.levelBg} ${v.text} ring-1 ${v.levelRing}`}>{levelLabel(item.level)}</span>
                        <span className="text-[11px] text-fg-muted">• {weeksRange(item.hours)}</span>
                      </div>
                      <p className="mt-3 text-sm text-fg-muted leading-relaxed">{summary(item)}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] text-fg-muted">
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-layers-3 h-3.5 w-3.5" /> {item.courses} Courses</span>
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-clock h-3.5 w-3.5" /> {item.hours}h total</span>
                      </div>
                      <div className="mt-5 pt-1">
                        <a href={`/bootcamps/register?intent=cert&cert=${item.id}`} aria-label={`Enroll in ${item.title}`} className="relative inline-flex items-center gap-2 rounded-full bg-warning/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/60 shadow shadow-warning/20 hover:bg-warning/30 hover:shadow-warning/40 focus:outline-none focus:ring-4 focus:ring-warning/40 transition">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                          </span>
                          <span>Enroll</span>
                          <span className="i-lucide-arrow-right text-[14px] -mr-0.5" />
                        </a>
                      </div>
                      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition ${v.hoverRing}`} />
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Specialty */}
            <div>
              <h4 id="aws-specialty" className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Specialty</h4>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {byVendorLevel('aws', 'specialty').map(item => {
                  const v = vendorStyle(item.vendor);
                  return (
                    <li key={item.id} id={item.id} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center">
                        <h5 className="font-semibold tracking-tight text-lg">{item.title}</h5>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${v.levelBg} ${v.text} ring-1 ${v.levelRing}`}>{levelLabel(item.level)}</span>
                        <span className="text-[11px] text-fg-muted">• {weeksRange(item.hours)}</span>
                      </div>
                      <p className="mt-3 text-sm text-fg-muted leading-relaxed">{summary(item)}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] text-fg-muted">
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-layers-3 h-3.5 w-3.5" /> {item.courses} Courses</span>
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-clock h-3.5 w-3.5" /> {item.hours}h total</span>
                      </div>
                      <div className="mt-5 pt-1">
                        <a href={`/bootcamps/register?intent=cert&cert=${item.id}`} aria-label={`Enroll in ${item.title}`} className="relative inline-flex items-center gap-2 rounded-full bg-warning/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/60 shadow shadow-warning/20 hover:bg-warning/30 hover:shadow-warning/40 focus:outline-none focus:ring-4 focus:ring-warning/40 transition">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                          </span>
                          <span>Enroll</span>
                          <span className="i-lucide-arrow-right text-[14px] -mr-0.5" />
                        </a>
                      </div>
                      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition ${v.hoverRing}`} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* Azure */}
          <section id="azure" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold tracking-tight">Microsoft Azure Certifications</h3>
              </div>
              <a href="#upcoming" className="text-xs font-medium text-accent hover:text-accent-alt transition">Start Azure prep →</a>
            </div>
            <div>
              <h4 id="azure-fundamentals" className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Fundamentals</h4>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {byVendorLevel('azure', 'fundamentals').map(item => {
                  const v = vendorStyle(item.vendor);
                  return (
                    <li key={item.id} id={item.id} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center">
                        <h5 className="font-semibold tracking-tight text-lg">{item.title}</h5>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${v.levelBg} ${v.text} ring-1 ${v.levelRing}`}>{levelLabel(item.level)}</span>
                        <span className="text-[11px] text-fg-muted">• {weeksRange(item.hours)}</span>
                      </div>
                      <p className="mt-3 text-sm text-fg-muted leading-relaxed">{summary(item)}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] text-fg-muted">
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-layers-3 h-3.5 w-3.5" /> {item.courses} Courses</span>
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-clock h-3.5 w-3.5" /> {item.hours}h total</span>
                      </div>
                      <div className="mt-5 pt-1">
                        <a href={`/bootcamps/register?intent=cert&cert=${item.id}`} aria-label={`Enroll in ${item.title}`} className="relative inline-flex items-center gap-2 rounded-full bg-warning/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/60 shadow shadow-warning/20 hover:bg-warning/30 hover:shadow-warning/40 focus:outline-none focus:ring-4 focus:ring-warning/40 transition">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                          </span>
                          <span>Enroll</span>
                          <span className="i-lucide-arrow-right text-[14px] -mr-0.5" />
                        </a>
                      </div>
                      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition ${v.hoverRing}`} />
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h4 id="azure-associate" className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Associate</h4>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {byVendorLevel('azure', 'associate').map(item => {
                  const v = vendorStyle(item.vendor);
                  return (
                    <li key={item.id} id={item.id} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center">
                        <h5 className="font-semibold tracking-tight text-lg">{item.title}</h5>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${v.levelBg} ${v.text} ring-1 ${v.levelRing}`}>{levelLabel(item.level)}</span>
                        <span className="text-[11px] text-fg-muted">• {weeksRange(item.hours)}</span>
                      </div>
                      <p className="mt-3 text-sm text-fg-muted leading-relaxed">{summary(item)}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] text-fg-muted">
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-layers-3 h-3.5 w-3.5" /> {item.courses} Courses</span>
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-clock h-3.5 w-3.5" /> {item.hours}h total</span>
                      </div>
                      <div className="mt-5 pt-1">
                        <a href={`/bootcamps/register?intent=cert&cert=${item.id}`} aria-label={`Enroll in ${item.title}`} className="relative inline-flex items-center gap-2 rounded-full bg-warning/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/60 shadow shadow-warning/20 hover:bg-warning/30 hover:shadow-warning/40 focus:outline-none focus:ring-4 focus:ring-warning/40 transition">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                          </span>
                          <span>Enroll</span>
                          <span className="i-lucide-arrow-right text-[14px] -mr-0.5" />
                        </a>
                      </div>
                      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition ${v.hoverRing}`} />
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h4 id="azure-expert" className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Expert</h4>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {byVendorLevel('azure', 'expert').map(item => {
                  const v = vendorStyle(item.vendor);
                  return (
                    <li key={item.id} id={item.id} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center">
                        <h5 className="font-semibold tracking-tight text-lg">{item.title}</h5>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${v.levelBg} ${v.text} ring-1 ${v.levelRing}`}>{levelLabel(item.level)}</span>
                        <span className="text-[11px] text-fg-muted">• {weeksRange(item.hours)}</span>
                      </div>
                      <p className="mt-3 text-sm text-fg-muted leading-relaxed">{summary(item)}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] text-fg-muted">
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-layers-3 h-3.5 w-3.5" /> {item.courses} Courses</span>
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-clock h-3.5 w-3.5" /> {item.hours}h total</span>
                      </div>
                      <div className="mt-5 pt-1">
                        <a href={`/bootcamps/register?intent=cert&cert=${item.id}`} aria-label={`Enroll in ${item.title}`} className="relative inline-flex items-center gap-2 rounded-full bg-warning/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/60 shadow shadow-warning/20 hover:bg-warning/30 hover:shadow-warning/40 focus:outline-none focus:ring-4 focus:ring-warning/40 transition">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                          </span>
                          <span>Enroll</span>
                          <span className="i-lucide-arrow-right text-[14px] -mr-0.5" />
                        </a>
                      </div>
                      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition ${v.hoverRing}`} />
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h4 id="azure-specialty" className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Specialty</h4>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {byVendorLevel('azure', 'specialty').map(item => {
                  const v = vendorStyle(item.vendor);
                  return (
                    <li key={item.id} id={item.id} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center">
                        <h5 className="font-semibold tracking-tight text-lg">{item.title}</h5>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${v.levelBg} ${v.text} ring-1 ${v.levelRing}`}>{levelLabel(item.level)}</span>
                        <span className="text-[11px] text-fg-muted">• {weeksRange(item.hours)}</span>
                      </div>
                      <p className="mt-3 text-sm text-fg-muted leading-relaxed">{summary(item)}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] text-fg-muted">
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-layers-3 h-3.5 w-3.5" /> {item.courses} Courses</span>
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-clock h-3.5 w-3.5" /> {item.hours}h total</span>
                      </div>
                      <div className="mt-5 pt-1">
                        <a href={`/bootcamps/register?intent=cert&cert=${item.id}`} aria-label={`Enroll in ${item.title}`} className="relative inline-flex items-center gap-2 rounded-full bg-warning/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/60 shadow shadow-warning/20 hover:bg-warning/30 hover:shadow-warning/40 focus:outline-none focus:ring-4 focus:ring-warning/40 transition">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                          </span>
                          <span>Enroll</span>
                          <span className="i-lucide-arrow-right text-[14px] -mr-0.5" />
                        </a>
                      </div>
                      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition ${v.hoverRing}`} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* Google Cloud */}
          <section id="gcp" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold tracking-tight">Google Cloud Certifications</h3>
              </div>
              <a href="#upcoming" className="text-xs font-medium text-accent hover:text-accent-alt transition">Start Google Cloud prep →</a>
            </div>
            <div>
              <h4 id="gcp-foundational" className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Foundational</h4>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {byVendorLevel('gcp', 'foundational').map(item => {
                  const v = vendorStyle(item.vendor);
                  return (
                    <li key={item.id} id={item.id} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center">
                        <h5 className="font-semibold tracking-tight text-lg">{item.title}</h5>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${v.levelBg} ${v.text} ring-1 ${v.levelRing}`}>{levelLabel(item.level)}</span>
                        <span className="text-[11px] text-fg-muted">• {weeksRange(item.hours)}</span>
                      </div>
                      <p className="mt-3 text-sm text-fg-muted leading-relaxed">{summary(item)}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] text-fg-muted">
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-layers-3 h-3.5 w-3.5" /> {item.courses} Courses</span>
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-clock h-3.5 w-3.5" /> {item.hours}h total</span>
                      </div>
                      <div className="mt-5 pt-1">
                        <a href={`/bootcamps/register?intent=cert&cert=${item.id}`} aria-label={`Enroll in ${item.title}`} className="relative inline-flex items-center gap-2 rounded-full bg-warning/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/60 shadow shadow-warning/20 hover:bg-warning/30 hover:shadow-warning/40 focus:outline-none focus:ring-4 focus:ring-warning/40 transition">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                          </span>
                          <span>Enroll</span>
                          <span className="i-lucide-arrow-right text-[14px] -mr-0.5" />
                        </a>
                      </div>
                      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition ${v.hoverRing}`} />
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h4 id="gcp-associate" className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Associate</h4>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {byVendorLevel('gcp', 'associate').map(item => {
                  const v = vendorStyle(item.vendor);
                  return (
                    <li key={item.id} id={item.id} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center">
                        <h5 className="font-semibold tracking-tight text-lg">{item.title}</h5>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${v.levelBg} ${v.text} ring-1 ${v.levelRing}`}>{levelLabel(item.level)}</span>
                        <span className="text-[11px] text-fg-muted">• {weeksRange(item.hours)}</span>
                      </div>
                      <p className="mt-3 text-sm text-fg-muted leading-relaxed">{summary(item)}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] text-fg-muted">
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-layers-3 h-3.5 w-3.5" /> {item.courses} Courses</span>
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-clock h-3.5 w-3.5" /> {item.hours}h total</span>
                      </div>
                      <div className="mt-5 pt-1">
                        <a href={`/bootcamps/register?intent=cert&cert=${item.id}`} aria-label={`Enroll in ${item.title}`} className="relative inline-flex items-center gap-2 rounded-full bg-warning/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/60 shadow shadow-warning/20 hover:bg-warning/30 hover:shadow-warning/40 focus:outline-none focus:ring-4 focus:ring-warning/40 transition">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                          </span>
                          <span>Enroll</span>
                          <span className="i-lucide-arrow-right text-[14px] -mr-0.5" />
                        </a>
                      </div>
                      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition ${v.hoverRing}`} />
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h4 id="gcp-professional" className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-muted">Professional</h4>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {byVendorLevel('gcp', 'professional').map(item => {
                  const v = vendorStyle(item.vendor);
                  return (
                    <li key={item.id} id={item.id} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-6 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center">
                        <h5 className="font-semibold tracking-tight text-lg">{item.title}</h5>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${v.levelBg} ${v.text} ring-1 ${v.levelRing}`}>{levelLabel(item.level)}</span>
                        <span className="text-[11px] text-fg-muted">• {weeksRange(item.hours)}</span>
                      </div>
                      <p className="mt-3 text-sm text-fg-muted leading-relaxed">{summary(item)}</p>
                      <div className="mt-4 flex items-center gap-4 text-[11px] text-fg-muted">
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-layers-3 h-3.5 w-3.5" /> {item.courses} Courses</span>
                        <span className="inline-flex items-center gap-1"><span className="i-lucide-clock h-3.5 w-3.5" /> {item.hours}h total</span>
                      </div>
                      <div className="mt-5 pt-1">
                        <a href={`/bootcamps/register?intent=cert&cert=${item.id}`} aria-label={`Enroll in ${item.title}`} className="relative inline-flex items-center gap-2 rounded-full bg-warning/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/60 shadow shadow-warning/20 hover:bg-warning/30 hover:shadow-warning/40 focus:outline-none focus:ring-4 focus:ring-warning/40 transition">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning" />
                          </span>
                          <span>Enroll</span>
                          <span className="i-lucide-arrow-right text-[14px] -mr-0.5" />
                        </a>
                      </div>
                      <div className={`pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition ${v.hoverRing}`} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
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
