'use client';
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { ProductDefinition } from '../../data/products';
import { slugify } from '../../lib/slugify';

interface ProductsGridProps { initialProducts: ProductDefinition[]; }

function DifficultyBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    beginner: 'bg-accent/15 text-accent',
    intermediate: 'bg-warning/15 text-warning',
    advanced: 'bg-danger/15 text-danger'
  };
  return <span className={`inline-block rounded-md px-2 py-1 text-[10px] font-medium tracking-wide ${colors[level] || 'bg-fg-muted/10 text-fg-muted'}`}>{level}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: 'text-accent',
    'waitlist': 'text-warning',
    'coming-soon': 'text-fg-muted'
  };
  return <span className={`text-[10px] font-semibold uppercase ${map[status]}`}>{status.replace('-', ' ')}</span>;
}

function DeliveryBadge({ delivery }: { delivery: 'live' | 'self-paced' }) {
  const isLive = delivery === 'live';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${isLive ? 'bg-warning/15 text-warning ring-warning/40' : 'bg-fg-muted/10 text-fg-muted ring-border/40'}`}>
      {isLive && (
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
        </span>
      )}
      {isLive ? 'Live Bootcamp' : 'Self-Paced'}
    </span>
  );
}

function Card({ p, onOpenSyllabus, onWaitlist }: { p: ProductDefinition; onOpenSyllabus: (p: ProductDefinition) => void; onWaitlist: (p: ProductDefinition, email: string) => void }) {
  const base = 'relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br p-6 shadow-sm';
  const variants: Record<string, string> = {
    primary: `${base} from-bg-alt/60 to-bg-alt/20`,
    secondary: `${base} from-bg-alt/40 to-bg-alt/10`,
    tertiary: `${base} from-bg-alt/30 to-bg-alt/5`
  };
  const IconComp = (Icons as any)[p.icon] || Icons.Box;
  return (
    <div className={variants[p.variant || 'secondary'] + ' group min-h-[300px] flex'} aria-label={`${p.title} ${p.difficulty} track`}>
      <div className="flex flex-col w-full">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent grid place-items-center"><IconComp className="h-5 w-5" /></div>
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight flex items-center gap-2">{p.title}</h3>
              {p.subtitle && <p className="mt-1 text-[10px] uppercase tracking-wide text-fg-muted">{p.subtitle}</p>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <DifficultyBadge level={p.difficulty} />
            <StatusBadge status={p.enrollmentStatus} />
          </div>
        </div>
        <p className="text-fg-muted leading-relaxed text-sm line-clamp-4">{p.body}</p>
        <ul className="mt-4 space-y-1 text-[11px] text-fg-muted/90">
          {p.outcomes.slice(0,3).map(o => <li key={o} className="flex gap-1"><span className="text-accent">•</span><span>{o}</span></li>)}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags.map(t => <span key={t} className="rounded-md bg-bg-alt/60 border border-border/50 px-2 py-0.5 text-[10px] tracking-wide text-fg-muted">{t}</span>)}
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between text-xs">
          <span className="text-fg-muted">≈ {p.durationHours}h</span>
          {p.delivery === 'live' && p.enrollmentStatus === 'open' ? (
            <a href={`/bootcamps/register?track=${encodeURIComponent(p.title)}`} className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-warning ring-1 ring-warning/40 hover:bg-warning/25 transition">Register →</a>
          ) : p.enrollmentStatus === 'coming-soon' ? (
            <button onClick={() => onOpenSyllabus(p)} className="inline-flex items-center gap-1 text-accent font-medium hover:underline">View syllabus →</button>
          ) : (
            <button onClick={() => onOpenSyllabus(p)} className="inline-flex items-center gap-1 text-accent font-medium hover:underline">View syllabus →</button>
          )}
        </div>
        {p.enrollmentStatus === 'coming-soon' && (
          <form
            onSubmit={(e) => { e.preventDefault(); const email = (e.currentTarget.elements.namedItem('waitlist-email') as HTMLInputElement).value; onWaitlist(p, email); e.currentTarget.reset(); }}
            className="mt-3 flex items-center gap-2"
          >
            <input name="waitlist-email" type="email" required placeholder="Email for updates" className="flex-1 rounded-md border border-border/60 bg-bg-alt/60 px-2 py-1 text-[11px] focus:outline-none focus:ring-2 focus:ring-accent" />
            <button type="submit" className="rounded-md bg-accent/80 hover:bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              Join
            </button>
          </form>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
    </div>
  );
}

export default function ProductsGrid({ initialProducts }: ProductsGridProps) {
  const pathname = usePathname();
  const [difficulty, setDifficulty] = useState<string>('all');
  const [delivery, setDelivery] = useState<'all' | 'live' | 'self-paced'>('all');
  const [query, setQuery] = useState('');
  const [syllabusProduct, setSyllabusProduct] = useState<ProductDefinition | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const diffs = ['all','beginner','intermediate','advanced'];
  const deliveries: ('all' | 'live' | 'self-paced')[] = ['all','live','self-paced'];

  const shown = initialProducts.filter(p => (difficulty === 'all' || p.difficulty === difficulty) && (delivery === 'all' || p.delivery === delivery) && (
    p.title.toLowerCase().includes(query) || p.tags.some(t => t.toLowerCase().includes(query))
  ));

  const handleWaitlist = async (p: ProductDefinition, email: string) => {
    try {
      await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product: p.key, email }) });
      setMessage(`Added to waitlist for ${p.title}`);
      setTimeout(() => setMessage(null), 4000);
    } catch (e) { setMessage('Failed to join waitlist'); setTimeout(() => setMessage(null), 4000); }
  };

  // Large format selector buttons (Live Bootcamps -> /bootcamps, Self-Paced -> /platform)
  const FormatSelector = () => (
    <div className="w-full flex flex-col md:flex-row gap-4">
      <a href="/bootcamps" className={`group flex-1 relative overflow-hidden rounded-2xl border px-6 py-5 text-left transition shadow-sm ${pathname === '/bootcamps' ? 'border-warning/60' : 'border-border/60 hover:border-warning/50'} bg-gradient-to-br from-warning/10 via-warning/5 to-bg-alt/40`}>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-warning/20 text-warning grid place-items-center">
            <Icons.Rocket className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2 text-warning font-semibold tracking-tight text-lg">
            <span className="relative inline-flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning/40" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-warning" />
            </span>
            Live Bootcamps
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-warning/80 max-w-sm">Cohort-based acceleration, feedback loops, accountability cadence.</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-warning/90">Explore →</span>
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-warning/40 transition" />
      </a>
      <a href="/platform" className={`group flex-1 relative overflow-hidden rounded-2xl border px-6 py-5 text-left transition shadow-sm ${pathname === '/platform' ? 'border-accent/60' : 'border-border/60 hover:border-accent/50'} bg-gradient-to-br from-accent/10 via-accent/5 to-bg-alt/40`}>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-accent/20 text-accent grid place-items-center">
            <Icons.GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2 text-accent font-semibold tracking-tight text-lg">
            Self-Paced Learning
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-accent/80 max-w-sm">Flexible module progression, retention loops, layerable with live.</p>
        <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-accent/90">Go to Platform →</span>
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-accent/40 transition" />
      </a>
    </div>
  );

  return (
    <div className="space-y-10">
      <FormatSelector />
      {/* existing filter + search UI (difficulty + search only) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {diffs.map(d => (
              <button key={d} onClick={() => setDifficulty(d)} className={`px-3 py-1.5 rounded-md text-xs font-medium border transition ${difficulty===d ? 'bg-accent text-white border-accent' : 'border-border/60 hover:border-accent/60 text-fg-muted'}`}>{d}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {deliveries.map(dv => (
              <button key={dv} onClick={() => setDelivery(dv)} className={`px-3 py-1.5 rounded-md text-xs font-medium border transition ${delivery===dv ? 'bg-warning text-fg border-warning' : 'border-border/60 hover:border-warning/60 text-fg-muted'}`}>{dv}</button>
            ))}
            <input
              placeholder="Search tracks"
              className="rounded-md border border-border bg-bg-alt/60 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-accent"
              value={query}
              onChange={e => setQuery(e.target.value.toLowerCase())}
            />
          </div>
        </div>
        {message && <div className="text-[11px] text-accent">{message}</div>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shown.map(p => <Card key={p.key} p={p} onOpenSyllabus={setSyllabusProduct} onWaitlist={handleWaitlist} />)}
        {shown.length === 0 && <div className="text-fg-muted text-sm">No tracks found.</div>}
      </div>
      {syllabusProduct && (
        <SyllabusModal product={syllabusProduct} onClose={() => setSyllabusProduct(null)} />
      )}
    </div>
  );
}

function SyllabusModal({ product, onClose }: { product: ProductDefinition; onClose: () => void }) {
  const isFoundation = product.key === 'cloud-foundation';
  const certs = isFoundation
    ? [
        'Microsoft Azure Fundamentals Path',
        'Amazon Web Services Fundamentals Path',
        'Google Cloud Fundamentals Path'
      ]
    : (product.certifications || (product.certificationAlign ? [product.certificationAlign] : []));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-lg w-full rounded-2xl border border-border/60 bg-bg-alt/95 backdrop-blur p-6 shadow-xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight">{product.title} – Syllabus</h2>
            <p className="mt-1 text-xs uppercase tracking-wide text-fg-muted">Certification Mapping</p>
          </div>
          <button onClick={onClose} className="text-fg-muted hover:text-fg" aria-label="Close">✕</button>
        </div>
        <div className="mt-6 space-y-4">
          {certs.map(c => (
            <a key={c} href={`/syllabus/${slugify(c)}`} className="block rounded-lg border border-border/60 bg-bg/60 px-4 py-3 hover:border-accent hover:bg-bg-alt/60 transition group">
              <span className="font-medium text-sm text-fg group-hover:text-accent">{c}</span>
              <span className="mt-1 block text-[11px] text-fg-muted/80">{isFoundation ? 'Explore provider-specific fundamentals' : 'View mapped modules & focus areas'}</span>
            </a>
          ))}
          {certs.length === 0 && <div className="text-sm text-fg-muted">No certification mappings defined.</div>}
        </div>
        <div className="mt-8 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border border-border hover:border-accent hover:text-accent transition">Close</button>
        </div>
      </div>
    </div>
  );
}
