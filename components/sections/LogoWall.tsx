const logos = new Array(9).fill(0).map((_, i) => `Logo ${i+1}`);

export function LogoWall() {
  return (
    <section className="py-20 bg-bg-alt/20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs uppercase tracking-wider font-semibold bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent mb-8">Trusted by forward-thinking teams</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center">
          {logos.map(l => (
            <div key={l} className="h-12 rounded-md border border-border/50 bg-bg-alt/40 text-fg-muted text-xs grid place-items-center relative overflow-hidden group transition hover:border-accent/50">
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-[radial-gradient(circle_at_30%_20%,var(--color-accent)/12%,transparent_60%)]" />
              <span className="relative z-10">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
