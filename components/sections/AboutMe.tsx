export function AboutMe() {
  return (
    <section className="relative py-28 bg-bg-alt/20">
      <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-plus-lighter" aria-hidden>
        <div className="absolute left-1/2 top-0 h-64 w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-r from-accent/10 to-accent-alt/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-4xl px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">About Me</h2>
        <p className="mt-6 text-fg-muted leading-relaxed max-w-prose">Replace this with your personal or founder story. Highlight mission, experience, and what motivates this platform. Keep it concise—2–3 short paragraphs that build trust and credibility.</p>
      </div>
    </section>
  );
}
