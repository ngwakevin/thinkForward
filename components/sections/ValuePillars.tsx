const pillars = [
	{ title: 'Clarity', desc: 'A simple personal plan. No guesswork.' },
	{ title: 'Practice', desc: 'Hands‑on labs and small real projects.' },
	{ title: 'Mentorship', desc: 'Direct feedback when you’re stuck.' },
	{ title: 'Momentum', desc: 'Weekly habits that keep you moving.' }
];

export function ValuePillars() {
	return (
		<section className="py-28">
			<div className="mx-auto max-w-6xl px-6 space-y-12">
				<div className="max-w-2xl">
					<h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">
						Why It Works
					</h2>
					<p className="mt-4 text-fg-muted text-sm md:text-base leading-relaxed">
						We mix clear direction with real industry experience so you make steady progress without feeling overwhelmed.
					</p>
				</div>
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{pillars.map(p => (
						<div
							key={p.title}
							className="relative rounded-2xl border border-border/60 bg-bg-alt/40 p-6 overflow-hidden group transition hover:border-accent/50"
						>
							<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-accent/10 to-accent-alt/10" />
							<h3 className="font-medium mb-2 tracking-tight text-fg group-hover:text-accent transition">
								{p.title}
							</h3>
							<p className="text-sm text-fg-muted leading-relaxed">
								{p.desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
