import Link from 'next/link';
import { products } from '../../data/products';

interface ProductCardProps {
  title: string;
  subtitle?: string;
  body: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  href?: string;
  difficulty?: string;
}

function ProductCard({ title, subtitle, body, variant = 'secondary', href = '/contact', difficulty }: ProductCardProps) {
  const base = 'relative flex flex-col rounded-3xl border border-border/60 bg-gradient-to-br p-8 shadow-sm';
  const variants: Record<string, string> = {
    primary: `${base} from-bg-alt/70 to-bg-alt/30 md:row-span-2 md:col-span-2`,
    secondary: `${base} from-bg-alt/50 to-bg-alt/20`,
    tertiary: `${base} from-bg-alt/40 to-bg-alt/10`
  };
  return (
    <div className={variants[variant] + ' group min-h-[260px]'}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">{title}</h3>
          {subtitle && <p className="mt-2 text-[11px] uppercase tracking-wide text-fg-muted">{subtitle}</p>}
        </div>
        {difficulty && <span className="rounded-md bg-accent/15 text-accent px-2 py-1 text-[11px] font-medium tracking-wide">{difficulty}</span>}
      </div>
      <p className="text-fg-muted leading-relaxed text-sm md:text-[15px] flex-1">{body}</p>
      <div className="mt-6 pt-2">
        <Link href={href as any} className="inline-flex items-center gap-1 text-accent text-sm font-medium hover:text-accent-alt transition">Learn more <span className="i-lucide-arrow-right text-[14px]" /></Link>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
    </div>
  );
}

export function ProductShowcase() {
  const pillars: { key: string; title: string; stage: string; description: string; points: string[]; status: 'live' | 'beta' | 'coming'; }[] = [
    { key: 'retention', title: 'Retention & Recall', stage: 'Live', description: 'Ensure knowledge sticks so depth compounds instead of leaking away.', points: ['Timed micro‑reviews', 'Spaced repetition nudges', 'Confidence decay tracking'], status: 'live' },
    { key: 'pathing', title: 'Adaptive Pathing', stage: 'Live', description: 'Your roadmap reshapes as strengths emerge and gaps surface.', points: ['Auto focus rebalancing', 'Strength / gap surfacing', 'Next step recommendations'], status: 'live' },
    { key: 'momentum', title: 'Momentum Health', stage: 'Live', description: 'Protect consistency—spot drift before it becomes disengagement.', points: ['Streak recovery logic', 'Idle risk alerts', 'Artifact cadence pacing'], status: 'live' },
    { key: 'progress', title: 'Progress Signals', stage: 'Beta', description: 'Make invisible progress visible so motivation stays funded.', points: ['Milestone density index', 'Velocity trend visuals', 'Portfolio coverage mapping'], status: 'beta' },
    { key: 'engagement', title: 'Engagement Loops', stage: 'Beta', description: 'Light social reinforcement—enough to sustain output, never noisy.', points: ['Peer micro‑cohort boosts', 'Win reinforcement feed', 'Session priming nudges'], status: 'beta' },
    { key: 'readiness', title: 'Readiness Scoring', stage: 'Coming', description: 'Evidence-based confidence before interviews or role transitions.', points: ['Competency coverage map', 'Scenario gap heatmap', 'Offer probability model'], status: 'coming' }
  ];
  function badge(status: 'live' | 'beta' | 'coming') { return status==='live' ? 'bg-accent/15 text-accent' : status==='beta' ? 'bg-warning/15 text-warning' : 'bg-fg-muted/15 text-fg-muted'; }
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 max-w-3xl space-y-5">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Learning Engine</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">How We Accelerate Your Cloud Career</h2>
            <p className="text-fg-muted leading-relaxed text-base md:text-lg">Retain what matters, adapt focus, protect weekly cadence, surface meaningful progress, reinforce momentum, and quantify readiness—each pillar compounding skill depth while reducing waste.</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="/products" className="rounded-md bg-accent px-5 py-3 text-sm font-medium text-white shadow hover:bg-accent-alt transition">Explore Tracks</a>
              <a href="/contact" className="rounded-md border border-border/60 px-5 py-3 text-sm font-medium text-fg hover:border-accent hover:text-accent transition">Talk to Us</a>
            </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map(p => (
            <div key={p.key} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg/50 p-6 shadow-sm hover:shadow-accent/20 transition">
              <div className="flex items-start justify-between mb-4 gap-4">
                <h3 className="font-semibold tracking-tight text-lg group-hover:text-accent transition-colors">{p.title}</h3>
                <span className={`text-[10px] px-2 py-1 rounded-md font-medium uppercase tracking-wide ${badge(p.status)}`}>{p.stage}</span>
              </div>
              <p className="text-sm leading-relaxed text-fg-muted mb-4 flex-1">{p.description}</p>
              <ul className="space-y-1.5 text-[12px] text-fg-muted/90 mb-4">
                {p.points.map(pt => (<li key={pt} className="flex gap-1"><span className="text-accent">•</span><span>{pt}</span></li>))}
              </ul>
              <div className="mt-auto pt-2 text-right">
                <a href="/roadmaps" className="text-xs font-medium text-accent hover:text-accent-alt transition">See how it applies →</a>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
            </div>
          ))}
        </div>
        <div className="mt-24 grid gap-12 md:grid-cols-3">
          <div className="space-y-4"><h3 className="font-semibold tracking-tight text-fg">Reduce Waste</h3><p className="text-sm text-fg-muted leading-relaxed">Adaptive focus & retention loops strip out low‑impact material so your hours compound toward role‑ready outcomes.</p></div>
          <div className="space-y-4"><h3 className="font-semibold tracking-tight text-fg">Preserve Momentum</h3><p className="text-sm text-fg-muted leading-relaxed">Health signals surface drift early—consistency stays intact, and recovery actions trigger before motivation collapses.</p></div>
          <div className="space-y-4"><h3 className="font-semibold tracking-tight text-fg">Prove Readiness</h3><p className="text-sm text-fg-muted leading-relaxed">Quantified coverage + artifact cadence + scenario depth give hiring managers credible evidence—not just claims.</p></div>
        </div>
      </div>
    </section>
  );
}
