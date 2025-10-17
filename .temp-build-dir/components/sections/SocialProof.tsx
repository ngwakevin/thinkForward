import Link from 'next/link';
import type { Route } from 'next';

type Role = {
  title: string;
  blurb: string;
  href: Route;
};

const roles: Role[] = [
  {
    title: 'Cloud Engineer',
    blurb: 'Build, deploy, and operate cloud workloads across AWS & Azure.',
    href: '/roadmaps',
  },
  {
    title: 'DevOps Engineer',
    blurb: 'CI/CD, IaC, containers and automation to ship faster with confidence.',
    href: '/roadmaps',
  },
  {
    title: 'Site Reliability Engineer (SRE)',
    blurb: 'Reliability, observability, incident response, performance at scale.',
    href: '/roadmaps',
  },
  {
    title: 'Cloud Architect',
    blurb: 'Design secure, scalable platforms and guide cloud adoption.',
    href: '/roadmaps',
  },
  {
    title: 'Platform Engineer',
    blurb: 'Build golden paths and internal platforms for developer velocity.',
    href: '/roadmaps',
  },
  {
    title: 'Data Engineer',
    blurb: 'Create data pipelines, lakes and warehouses on the cloud.',
    href: '/roadmaps',
  },
];

export function SocialProof() {
  return (
    <section className="py-20 bg-gradient-to-b from-bg-alt/30 to-transparent">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center space-y-3 mb-10">
          <p className="text-[11px] tracking-widest font-semibold uppercase bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">Profession suggestions</p>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Pick your cloud path</h2>
          <p className="text-fg-muted text-sm">Choose a role to see the roadmap and how we can help you get there.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {roles.map((role) => (
            <Link
              key={role.title}
              href={role.href}
              className="group relative flex flex-col rounded-xl border border-border/60 bg-gradient-to-br from-bg-alt/60 to-bg-alt/10 p-5 shadow-sm transition hover:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
              <h3 className="font-display text-lg font-semibold tracking-tight mb-1.5">{role.title}</h3>
              <p className="text-fg-muted text-sm leading-relaxed flex-1">{role.blurb}</p>
              <span className="mt-4 inline-flex items-center text-[12px] font-semibold tracking-wide text-accent group-hover:text-accent-alt">
                Explore roadmaps
                <span className="ml-1.5 i-lucide-arrow-right text-[14px]" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-fg-muted">
            Not sure where to start? <Link href="/mentoring" className="text-accent hover:text-accent-alt font-semibold">Talk to a mentor</Link> for a quick plan.
          </p>
        </div>
      </div>
    </section>
  );
}
