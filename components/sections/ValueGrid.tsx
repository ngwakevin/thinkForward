const features = [
  { title: 'Declarative APIs', body: 'Replace with your feature copy focusing on user benefit and differentiator.' },
  { title: 'Real-time Events', body: 'Explain latency, scale, reliability in user-value framing.' },
  { title: 'Unified Governance', body: 'Compliance, auditing, policy – expressed in outcomes.' },
  { title: 'Developer Velocity', body: 'Tooling, SDKs, quickstarts accelerating integration.' },
  { title: 'Observability', body: 'Metrics, tracing, contextual insights enabling fast resolution.' },
  { title: 'Scalable Core', body: 'Architected for horizontal scale and global presence.' }
];

export function ValueGrid() {
  return (
    <section className="py-28 bg-bg">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Value pillars</h2>
        <p className="mt-4 text-fg-muted max-w-2xl">Swap content to match your strategic pillars. Keep consistent length and parallel grammar.</p>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(f => (
            <div key={f.title} className="group relative rounded-xl border border-border/60 bg-gradient-to-b from-bg-alt/40 to-bg-alt/10 p-6 shadow-sm hover:shadow-md transition">
              <div className="mb-4 h-10 w-10 rounded-md bg-accent/15 text-accent grid place-items-center font-semibold">{f.title[0]}</div>
              <h3 className="font-semibold mb-2 tracking-tight">{f.title}</h3>
              <p className="text-sm text-fg-muted leading-relaxed">{f.body}</p>
              <div className="absolute inset-0 rounded-xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
