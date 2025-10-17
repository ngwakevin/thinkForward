const splits = [
  { heading: 'Integrate rapidly', body: 'Describe core capability with crisp outcome framing and specifics.', align: 'left' },
  { heading: 'Operate confidently', body: 'Resilience, failover, tooling — translate to user peace of mind.', align: 'right' },
  { heading: 'Scale globally', body: 'Latency, geo presence, elasticity translating into market reach.', align: 'left' }
];

export function SplitSections() {
  return (
    <section className="py-28 bg-bg-alt/30">
      <div className="mx-auto max-w-5xl px-6 space-y-28">
        {splits.map((s, i) => (
          <div key={s.heading} className={`grid gap-12 md:grid-cols-2 items-center ${s.align === 'right' ? 'md:[&>div:first-child]:order-2' : ''}`}>
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-4">{s.heading}</h3>
              <p className="text-fg-muted leading-relaxed max-w-prose">{s.body}</p>
              <div className="mt-6 flex gap-4 text-sm">
                <a href="/docs" className="text-accent hover:underline">Learn more →</a>
                <a href="/contact" className="text-fg-muted hover:text-accent transition">Contact sales</a>
              </div>
            </div>
            <div className="h-64 rounded-xl border border-border/60 bg-gradient-to-br from-bg-alt to-bg flex items-center justify-center text-fg-muted text-sm">Replace with illustrative graphic {i+1}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
