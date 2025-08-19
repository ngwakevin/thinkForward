export const metadata = { title: 'Contact Us' };
import { ContactForm } from '../../components/sections/ContactForm';

const steps = [
	{
		title: 'Schedule a Call',
		body: 'After you submit the form, we\'ll reach out to arrange an introductory conversation.',
	},
	{
		title: 'Understand Your Goals',
		body: 'In the first call we\'ll explore your needs, current environment, and how thinkForward can support your outcomes.',
	},
	{
		title: 'Personalized Demo',
		body: 'We\'ll then schedule a tailored follow‑up session to walk through the platform mapped to your context.',
	},
];

export default function ContactPage() {
	return (
		<div className="mx-auto max-w-7xl px-6 py-24 space-y-24">
			<header className="space-y-6">
				<p className="text-[11px] font-medium tracking-[0.25em] text-accent uppercase">Let’s Chat</p>
				<h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Contact Our Team</h1>
				<p className="text-fg-muted max-w-2xl text-sm md:text-base leading-relaxed">
					Discover how thinkForward accelerates cloud & DevOps capability building, reduces ramp time, and creates durable engineering momentum. Share a few details and we\'ll respond within one business day.
				</p>
				<p className="text-fg-muted max-w-xl text-xs md:text-sm leading-relaxed">
					Looking for help? <a href="/docs" className="text-accent hover:underline">Visit our support page</a>.
				</p>
			</header>

			<section className="grid gap-10 lg:gap-16 lg:grid-cols-3 items-start">
				{/* Styled Expectation Card */}
				<div className="rounded-xl border border-accent/30 bg-gradient-to-b from-accent/5 to-accent/10 p-8 relative overflow-hidden">
					<h2 className="font-display text-base font-semibold tracking-tight mb-6">What to Expect</h2>
					<ol className="relative space-y-10 pl-2">
						{/* vertical connector */}
						<span aria-hidden className="pointer-events-none absolute left-[38px] top-10 bottom-8 w-px bg-accent" />
						{steps.map((s, i) => (
							<li key={s.title} className="relative flex gap-6">
								{/* Circle */}
								<div className="relative flex flex-col items-center">
									<div className="h-16 w-16 rounded-full bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center">
										<div className="h-12 w-12 rounded-full bg-accent text-white font-semibold flex items-center justify-center text-sm">{i + 1}</div>
									</div>
								</div>
								<div className="pt-2 pr-4">
									<h3 className="font-medium text-fg mb-1 leading-tight">{s.title}</h3>
									<p className="text-fg-muted text-xs leading-relaxed max-w-xs">{s.body}</p>
								</div>
							</li>
						))}
					</ol>
				</div>

				{/* Form */}
				<div className="lg:col-span-2 rounded-2xl border border-border/60 bg-bg-alt/40 p-8 md:p-10 shadow-sm">
					<h2 className="sr-only">Send a Message</h2>
					<ContactForm />
					<p className="mt-6 text-[11px] text-fg-muted tracking-wide leading-relaxed">
						We respect your inbox. You\'ll only hear from us regarding your inquiry or directly relevant enablement updates.
					</p>
				</div>
			</section>

			{/* Optional bottom info section placeholder (can extend later) */}
		</div>
	);
}
