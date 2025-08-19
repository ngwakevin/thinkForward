import { testimonials } from '../../data/solutions';

export function TestimonialsSlice() {
  const customFirst = 'A clear roadmap and quick feedback turned a year of wandering into just a few months of real progress. Thank you, thinkForward team!';
  const customSecond = 'Just one session was all I needed to focus on what truly matters and get a perfect roadmap. Thank you, thinkForward team!';
  const customThird = 'Thanks to the one-on-one session, I stayed focused and on track. Thank you, thinkForward team!';
  return (
    <section className="py-24 bg-gradient-to-b from-bg-alt/20 to-transparent">
      <div className="mx-auto max-w-6xl px-6 space-y-12">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Results</h2>
            <p className="mt-4 text-fg-muted text-sm md:text-base max-w-xl">Simple wins from people using focused practice and clear weekly goals.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.slice(0,3).map((t,i) => (
            <div key={t.name} className="relative rounded-2xl border border-border/60 bg-bg-alt/40 p-6 group overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-accent/10 to-accent-alt/10" />
              <p className="relative text-sm leading-relaxed text-fg-muted">“{i===0 ? customFirst : i===1 ? customSecond : i===2 ? customThird : t.quote}”</p>
              <div className="relative mt-4 text-xs font-medium text-fg">{t.name} · <span className="text-fg-muted">{t.role}</span></div>
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
