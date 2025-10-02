import { Reveal, RevealGroup } from "../ui/ScrollReveal";
const pillars = [
	{ title: 'Clarity', desc: 'A simple personal plan. No guesswork.', icon: '🎯' },
	{ title: 'Practice', desc: 'Hands‑on labs and small real projects.', icon: '🧪' },
	{ title: 'Mentorship', desc: 'Direct feedback when you’re stuck.', icon: '🧑‍🏫' },
	{ title: 'Momentum', desc: 'Weekly habits that keep you moving.', icon: '⚡' }
];

export function ValuePillars() {
	return (
		<section aria-labelledby="why-works-heading" className="relative py-20">
			{/* Soft top gradient bar */}
			<div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-accent/40 via-accent-alt/30 to-accent/40 hidden sm:block" />
					<div className="mx-auto max-w-7xl px-6">
				{/* Copy + cards */}
							<div className="space-y-8">
						<Reveal className="space-y-6 max-w-xl">
							<h2 id="why-works-heading" className="font-display text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Why It Works</h2>
							<div className="dotted-divider w-full mt-2" />
							<p className="text-fg-muted text-base leading-relaxed">We mix clear direction with real industry experience so you make steady progress without feeling overwhelmed.</p>
						</Reveal>
								<div className="relative">
											{/* static soft shapes (no animation) */}
											<div aria-hidden className="pointer-events-none absolute -z-10 inset-0">
												<div className="absolute left-[-30px] top-[-20px] h-40 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_60%)] blur-3xl" />
												<div className="absolute right-[10%] top-[10%] h-32 w-52 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07),transparent_60%)] blur-2xl" />
												<div className="absolute left-[30%] bottom-[-10%] h-36 w-60 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_60%)] blur-3xl" />
											</div>

						  <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4" intervalMs={100}>
								{pillars.map(p => (
									<div key={p.title} className="group relative rounded-2xl border border-border/60 bg-gradient-to-b from-bg-alt/40 to-bg-alt/10 p-6 shadow-sm transition hover:shadow-accent/10 hover:border-accent/50">
										<div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-alt text-white text-base font-semibold shadow-sm ring-1 ring-white/10">{p.icon}</div>
										<h3 className="font-semibold text-lg tracking-tight mb-2 group-hover:text-accent transition-colors">{p.title}</h3>
										<p className="text-sm leading-relaxed text-fg-muted pr-1">{p.desc}</p>
										<div className="pointer-events-none absolute inset-x-0 -top-px h-1 rounded-t-2xl bg-gradient-to-r from-accent/35 via-accent-alt/35 to-accent/35 opacity-0 group-hover:opacity-100 transition" />
									</div>
								))}
							  </RevealGroup>
					  </div>
				</div>

					{/* Decorative column removed for minimal look */}
			</div>
		</section>
	);
}
