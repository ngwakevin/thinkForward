// MomentumSignalsSection removed per request. File retained as placeholder to avoid import errors during incremental builds.
// Restored MomentumSignalsSection (not currently used on home page)
export function MomentumSignalsSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-bg-alt to-bg">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">Momentum Signals</h2>
          <p className="mt-4 text-fg-muted text-lg">Lightweight telemetry that quietly protects execution quality: identifying drift early, reinforcing streak integrity, and adapting learning focus before momentum decays.</p>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 items-start">
          <Panel title="Skill Retention" badge="Live" items={[
            'Timed recall checkpoints',
            'Concept spaced repetition',
            'Confidence decay tracking'
          ]} />
          <Panel title="Adaptive Pathing" badge="Live" items={[
            'Roadmap auto‑rebalancing',
            'Strength / gap surfacing',
            'Next focus recommendation'
          ]} />
          <Panel title="Momentum Health" badge="Live" items={[
            'Streak recovery logic',
            'Idle risk alerts',
            'Artifact cadence pacing'
          ]} />
          <Panel title="Progress Signals" badge="Beta" items={[
            'Milestone density index',
            'Velocity trend graph',
            'Portfolio asset coverage'
          ]} />
          <Panel title="Engagement Loops" badge="Beta" items={[
            'Peer micro‑cohort boosts',
            'Win reinforcement feed',
            'Session priming nudges'
          ]} />
          <Panel title="Readiness Scoring" badge="Coming" items={[
            'Weighted competency map',
            'Scenario gap heatmap',
            'Offer probability model'
          ]} />
        </div>
      </div>
    </section>
  );
}

function Panel({ title, items, badge }: { title: string; items: string[]; badge: string }) {
  return (
    <div className="group relative rounded-2xl border border-border/60 bg-gradient-to-br from-bg/90 to-bg-alt/80 backdrop-blur-sm p-6 shadow-sm shadow-accent/5 hover:shadow-accent/20 transition">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold tracking-tight text-fg flex items-center gap-2">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/30" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          {title}
        </h3>
        <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border border-border/40 ${badgeColor(badge)}`}>{badge}</span>
      </div>
      <ul className="space-y-2 text-sm text-fg-muted">
        {items.map(i => (
          <li key={i} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_0_3px] shadow-accent/15" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
    </div>
  );
}

function badgeColor(badge: string) {
  if (badge === 'Live') return 'bg-accent/10 text-accent';
  if (badge === 'Beta') return 'bg-warning/15 text-warning';
  return 'bg-fg-muted/10 text-fg-muted';
}
