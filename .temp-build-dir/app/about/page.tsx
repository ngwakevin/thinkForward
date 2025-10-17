import { siteConfig } from '../../config/site';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24 space-y-24">
      <section className="space-y-8 text-center max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">Accelerating Cloud Careers</h1>
        <p className="text-fg-muted text-base md:text-lg leading-relaxed">We design custom, outcomes‑driven training for individuals and organizations—taking learners from zero or fragmented IT experience to confident practitioners in cloud engineering, cloud security, and DevOps.</p>
      </section>

      <section className="grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Who We Are</h2>
          <p className="text-sm leading-relaxed text-fg-muted">{siteConfig.name} is a specialist training company with decades of combined industry experience across architecture, security, operations, and platform engineering. We blend real production patterns with structured learning paths and consistent accountability.</p>
          <div className="space-y-3 text-sm">
            <h3 className="font-medium text-fg">What We Do</h3>
            <ul className="list-disc pl-5 space-y-1 text-fg-muted">
              <li>Custom upskilling programs</li>
              <li>Cohort bootcamps (cloud, DevOps, security)</li>
              <li>Mentorship & career acceleration frameworks</li>
              <li>Organizational enablement & adoption</li>
              <li>Project-based labs & portfolio development</li>
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Our Approach</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-fg-muted">
            <li><strong>Clarity:</strong> Focused paths—no resource overload.</li>
            <li><strong>Practice:</strong> Hands‑on labs, pipelines, infrastructure, security scaffolds.</li>
            <li><strong>Feedback:</strong> Continuous mentor and code review loops.</li>
            <li><strong>Momentum:</strong> Weekly execution rhythm, progress metrics, adaptive adjustments.</li>
          </ul>
          <div className="space-y-3 text-sm">
            <h3 className="font-medium text-fg">Who We Serve</h3>
            <ul className="list-disc pl-5 space-y-1 text-fg-muted">
              <li>Career changers with no prior IT background</li>
              <li>Early professionals needing structure & depth</li>
              <li>Teams modernizing delivery & security</li>
              <li>Organizations building internal cloud capability</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Differentiators</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { title: 'Real-World Patterns', desc: 'Not toy demos—production-informed architecture & trade-offs.' },
            { title: 'Integrated Security Early', desc: 'Security & observability woven into the first iterations.' },
            { title: 'Adaptive Pacing', desc: 'Data-driven adjustments to learner velocity & retention.' },
            { title: 'Mentorship + Accountability', desc: 'Not passive content—guided execution & feedback loops.' },
            { title: 'Portfolio Alignment', desc: 'Artifacts that map to hiring signals & interview narratives.' },
            { title: 'Execution Systems', desc: 'Weekly cadence & cognitive load reduction practices.' },
          ].map(f => (
            <div key={f.title} className="rounded-2xl border border-border/60 bg-bg-alt/40 p-6">
              <h3 className="font-medium tracking-tight mb-2">{f.title}</h3>
              <p className="text-sm text-fg-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Outcomes</h2>
        <ul className="grid gap-3 md:grid-cols-2 text-sm text-fg-muted">
          <li>Role readiness (Cloud / DevOps / Security tracks)</li>
          <li>Deployable projects showing breadth + depth</li>
          <li>Interview positioning & storytelling clarity</li>
          <li>Confidence operating delivery pipelines</li>
        </ul>
      </section>

      <section className="text-center space-y-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Ready to Start?</h2>
        <p className="text-sm text-fg-muted">Run the Solutions Wizard or book a custom discovery call.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/solutions" className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-alt">Explore Solutions</a>
          <a href="/contact" className="inline-flex items-center rounded-md border border-accent/40 px-6 py-3 text-sm font-medium text-accent hover:border-accent">Request Program</a>
        </div>
      </section>
    </div>
  );
}
