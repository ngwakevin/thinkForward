const techs = ['AWS','Azure','Docker','Kubernetes','Terraform','GitHub'];
export function SocialProof() {
  return (
    <section className="py-20 bg-gradient-to-b from-bg-alt/30 to-transparent">
      <div className="mx-auto max-w-6xl px-6 text-center space-y-10">
        <p className="text-xs tracking-widest font-semibold uppercase bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">Trusted Skills & Stacks</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 md:gap-8">
          {techs.map(name => (
            <div key={name} className="relative group h-16 rounded-xl border border-border/60 bg-gradient-to-br from-bg-alt/40 to-bg-alt/5 flex items-center justify-center overflow-hidden transition hover:border-accent/60">
              {/* accent sweep */}
              <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_30%_20%,var(--color-accent)/18%,transparent_60%)]" />
              <span className="text-sm font-semibold tracking-wide bg-gradient-to-r from-fg to-fg-muted/70 bg-clip-text text-transparent group-hover:from-accent group-hover:to-accent-alt transition">
                {name}
              </span>
              <span className="pointer-events-none absolute inset-px rounded-xl ring-1 ring-transparent group-hover:ring-accent/40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
