"use client";
import { useEffect, useRef, useState } from 'react';
import { stats } from '../../data/stats';
import { useCountUp } from '../../lib/hooks/useCountUp';

function StatItem({ label, value, suffix, active, prefersReduced }: { label: string; value: number; suffix?: string; active: boolean; prefersReduced: boolean; }) {
	const val = useCountUp(value, 1200, active && !prefersReduced);
	return (
		<div className="transition-opacity" style={{ opacity: active ? 1 : 0.4 }}>
			<div className="font-display text-3xl font-semibold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text tabular-nums">
				{val}{suffix || ''}
			</div>
			<div className="mt-2 text-[11px] uppercase tracking-[0.15em] text-fg-muted">{label}</div>
		</div>
	);
}

export function StatsBar() {
	const ref = useRef<HTMLElement | null>(null);
	const [active, setActive] = useState(false);

	// Observe visibility to trigger animation once
	useEffect(() => {
		if (!ref.current) return;
		const el = ref.current;
		const observer = new IntersectionObserver(
			entries => {
				entries.forEach(e => {
					if (e.isIntersecting) {
						setActive(true);
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.3 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	return (
		<section ref={ref} className="bg-bg-alt/40 py-12 border-y border-border/60">
			<div className="mx-auto max-w-6xl px-6 grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-center">
				{stats.map(s => (
					<StatItem key={s.label} label={s.label} value={s.value} suffix={s.suffix} active={active} prefersReduced={prefersReduced} />
				))}
			</div>
		</section>
	);
}
