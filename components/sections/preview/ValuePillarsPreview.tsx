const pillars = [
  { title: 'Clarity', desc: 'A simple personal plan. No guesswork.', icon: '🎯' },
  { title: 'Practice', desc: 'Hands‑on labs and small real projects.', icon: '🧪' },
  { title: 'Mentorship', desc: 'Direct feedback when you’re stuck.', icon: '🧑‍🏫' },
  { title: 'Momentum', desc: 'Weekly habits that keep you moving.', icon: '⚡' }
];

export function ValuePillarsPreview() {
  return (
    <section aria-labelledby="why-works-heading-preview" className="relative py-12">
      <div className="mx-auto max-w-7xl px-0">
        <div className="space-y-8">
          <div className="space-y-6 max-w-xl">
            <h2 id="why-works-heading-preview" className="font-display text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Why It Works</h2>
            <p className="text-fg-muted text-base leading-relaxed">We mix clear direction with real industry experience so you make steady progress without feeling overwhelmed.</p>
          </div>
          <div className="relative">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map(p => (
                <div key={p.title} className="group relative rounded-2xl bg-bg/60 p-6 transition outline outline-1 -outline-offset-1 outline-border/50 hover:outline-accent/40">
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-alt text-white text-base font-semibold shadow-sm ring-1 ring-white/10">{p.icon}</div>
                  <h3 className="font-semibold text-lg tracking-tight mb-2 group-hover:text-accent transition-colors">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-fg-muted pr-1">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ValuePillarsPreview;
