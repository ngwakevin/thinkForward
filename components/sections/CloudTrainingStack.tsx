"use client";
import React from 'react';
import { Reveal, RevealGroup } from "../ui/ScrollReveal";

export function CloudTrainingStack() {
  const [topic, setTopic] = React.useState<string | null>(null);

  const providerBlurb: Record<string, { label: string; blurb: string; href: string }> = {
    aws: {
      label: 'AWS',
      blurb: 'Labs on IAM, VPC, EKS, and CI/CD with IaC patterns. Build deployable foundations that mirror real environments.',
      href: '/courses'
    },
    azure: {
      label: 'Azure',
      blurb: 'AKS, Bicep, and Azure DevOps pipelines with security-first defaults for platform engineering paths.',
      href: '/courses'
    },
    gcp: {
      label: 'GCP',
      blurb: 'GKE, Cloud Build, and policy guardrails with Terraform. Ship reliable workflows and observability.',
      href: '/courses'
    },
    networking: {
      label: 'Networking',
      blurb: 'VPC/VNet design, subnets, gateways, and private connectivity patterns you’ll use in production.',
      href: '/docs'
    },
    security: {
      label: 'Security',
      blurb: 'Identity, secrets, and policy-as-code. Practical guardrails to keep shipping without surprises.',
      href: '/docs'
    },
    data: {
      label: 'Data',
      blurb: 'Managed data stores, backup/restore, and pipelines to support app and analytics workloads.',
      href: '/docs'
    }
  };

  return (
  <section className="relative py-16 md:py-24" aria-labelledby="cloud-stack-hero">
  <div className="mx-auto max-w-7xl px-6 grid gap-10 md:grid-cols-2 items-center">
        {/* Left: copy */}
        <div className="space-y-6">
          <Reveal>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Cloud Training</p>
          </Reveal>
          <Reveal>
            <h2 id="cloud-stack-hero" className="font-display text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">
              Master the Modern Cloud Stack
            </h2>
          </Reveal>
          <div className="dotted-divider w-full mt-2" />
          <Reveal>
            <p className="text-fg-muted text-base md:text-lg leading-relaxed max-w-2xl mb-2">
              Hands-on DevOps, Platform Engineering, and Cloud Security across AWS, Azure, and GCP.
              Build real projects, earn cert-ready skills, and assemble a job-focused portfolio.
            </p>
          </Reveal>

          <RevealGroup as="ul" className="mt-2 space-y-3 text-base" intervalMs={80}>
            {[
              'Real projects with production-style scenarios',
              'Role-aligned roadmaps and certification readiness',
              'Security-by-default patterns and guardrails',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-fg">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent ring-1 ring-accent/30">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3.5 8.5l3 3 6-6" />
                  </svg>
                </span>
                <span className="leading-relaxed text-fg/90">{item}</span>
              </li>
            ))}
          </RevealGroup>

          <Reveal className="pt-2">
            <div className="flex flex-wrap gap-4">
              <a href="/products" className="inline-flex items-center rounded-full bg-gradient-to-r from-accent to-accent-alt px-6 py-3 text-sm font-semibold tracking-wide text-white shadow hover:opacity-95 transition">
                Start Training
              </a>
              <a href="/solutions" className="inline-flex items-center rounded-full border border-border/70 px-6 py-3 text-sm font-semibold tracking-wide text-fg hover:border-accent hover:text-accent transition">
                Learn More
              </a>
            </div>
          </Reveal>
        </div>

        {/* Right: illustrative stack card */}
        <div className="relative">
          <div className="rounded-3xl border border-border/70 bg-gradient-to-b from-bg-alt/70 to-bg p-6 md:p-8 shadow-sm corner-notches">
            {/* provider chips using site colors */}
            <Reveal className="mb-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { key: 'aws', label: 'AWS', cls: 'bg-accent/10 text-accent ring-accent/30' },
                { key: 'azure', label: 'Azure', cls: 'bg-accent-alt/10 text-accent-alt ring-accent-alt/30' },
                { key: 'gcp', label: 'GCP', cls: 'bg-accent-soft/30 text-accent ring-accent/30' }
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setTopic((t) => (t === p.key ? null : p.key))}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold ring-1 transition ${p.cls} ${topic === p.key ? 'outline outline-2 outline-accent/40' : ''}`}
                  aria-pressed={topic === p.key}
                >
                  {p.label}
                </button>
              ))}
            </div>
            </Reveal>
            {(['aws','azure','gcp'] as const).includes(topic as any) && (
              <Reveal className="mb-6">
              <div className="rounded-2xl border border-border/70 bg-bg-alt/50 p-4 text-sm leading-relaxed text-fg-muted">
                <strong className="text-fg">{providerBlurb[topic!].label}</strong> — {providerBlurb[topic!].blurb}
                <div className="mt-3">
                  <a href={providerBlurb[topic!].href} className="inline-flex items-center rounded-md border border-border/70 px-3 py-1.5 text-[11px] font-semibold tracking-wide hover:border-accent hover:text-accent transition">See training</a>
                </div>
              </div>
              </Reveal>
            )}

            <RevealGroup className="space-y-5" intervalMs={120}>
              <div className="relative rounded-2xl bg-bg/60 p-4 ring-1 ring-accent/30 corner-notches">
                <div className="pointer-events-none absolute inset-x-0 -top-px h-1 rounded-t-2xl bg-gradient-to-r from-accent/50 via-accent-alt/50 to-accent/50" />
                <h3 className="text-sm font-semibold mb-2">Compute & Containers</h3>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {['EC2/ECS','AKS','GKE','Kubernetes'].map((x)=> (
                    <span key={x} className="rounded-full bg-accent/10 text-accent px-3 py-1 ring-1 ring-accent/30">{x}</span>
                  ))}
                </div>
              </div>

              <div className="relative rounded-2xl bg-bg/60 p-4 ring-1 ring-accent-alt/30 corner-notches">
                <div className="pointer-events-none absolute inset-x-0 -top-px h-1 rounded-t-2xl bg-gradient-to-r from-accent-alt/50 via-accent/50 to-accent-alt/50" />
                <h3 className="text-sm font-semibold mb-2">IaC & Policy</h3>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {['Terraform','Bicep','CloudFormation','OPA/Policy'].map((x)=> (
                    <span key={x} className="rounded-full bg-accent-alt/10 text-accent-alt px-3 py-1 ring-1 ring-accent-alt/30">{x}</span>
                  ))}
                </div>
              </div>

              <div className="relative rounded-2xl bg-bg/60 p-4 ring-1 ring-accent/30 corner-notches">
                <div className="pointer-events-none absolute inset-x-0 -top-px h-1 rounded-t-2xl bg-gradient-to-r from-accent/50 via-accent-alt/50 to-accent/50" />
                <h3 className="text-sm font-semibold mb-2">CI/CD & Observability</h3>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {['GitHub Actions','Azure DevOps','Cloud Build','Prometheus','Grafana'].map((x)=> (
                    <span key={x} className="rounded-full bg-accent/10 text-accent px-3 py-1 ring-1 ring-accent/30">{x}</span>
                  ))}
                </div>
              </div>
            </RevealGroup>

            <Reveal className="mt-6">
            <div className="grid grid-cols-3 gap-3 text-center opacity-90">
              {[
                { key: 'networking', label: 'Networking', cls: 'bg-accent/10 text-accent ring-accent/30' },
                { key: 'security', label: 'Security', cls: 'bg-accent-alt/10 text-accent-alt ring-accent-alt/30' },
                { key: 'data', label: 'Data', cls: 'bg-accent-soft/30 text-accent ring-accent/30' }
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setTopic((t) => (t === c.key ? null : c.key))}
                  className={`rounded-xl px-4 py-3 text-xs font-semibold ring-1 transition ${c.cls} ${topic === c.key ? 'outline outline-2 outline-accent/40' : ''}`}
                  aria-pressed={topic === c.key}
                >
                  {c.label}
                </button>
              ))}
            </div>
            </Reveal>
            {(['networking','security','data'] as const).includes(topic as any) && (
              <Reveal className="mt-4">
              <div className="rounded-2xl border border-border/70 bg-bg-alt/50 p-4 text-sm leading-relaxed text-fg-muted">
                <strong className="text-fg">{providerBlurb[topic!].label}</strong> — {providerBlurb[topic!].blurb}
                <div className="mt-3">
                  <a href={providerBlurb[topic!].href} className="inline-flex items-center rounded-md border border-border/70 px-3 py-1.5 text-[11px] font-semibold tracking-wide hover:border-accent hover:text-accent transition">Learn more</a>
                </div>
              </div>
              </Reveal>
            )}
          </div>
          {/* removed outer glow to avoid double outline */}
        </div>
      </div>
    </section>
  );
}
