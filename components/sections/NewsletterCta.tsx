export function NewsletterCta() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/40 to-bg-alt/10 py-20">
        <h3 className="font-display text-3xl font-semibold tracking-tight">Stay in the loop</h3>
        <p className="mt-4 text-fg-muted max-w-xl mx-auto">Short value statement for your newsletter or updates feed. Emphasize actionable insights.</p>
        <form className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <input type="email" required placeholder="you@example.com" className="w-full sm:w-72 rounded-md border border-border bg-bg-alt/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-fg-muted" />
          <button className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-medium text-white shadow-md hover:bg-accent-alt transition">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
