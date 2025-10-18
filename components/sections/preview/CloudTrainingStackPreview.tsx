"use client";
import React from 'react';

export function CloudTrainingStackPreview() {
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
    <section className="relative py-12 md:py-16" aria-labelledby="cloud-stack-hero-preview">
      <div className="mx-auto max-w-7xl px-6 grid gap-10 md:grid-cols-2 items-center">
        {/* Left copy */}
        <div className="space-y-6">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Preview • Cloud Training</p>
          <h2 id="cloud-stack-hero-preview" className="font-display text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">
            Master the Modern Cloud Stack
          </h2>
          <div className="w-full mt-2" />
          <p className="text-fg-muted text-base md:text-lg leading-relaxed max-w-2xl mb-2">
            This preview shows the outline-based styling, simplified elevation, and refined chip states without changing the live site.
          </p>

          <ul className="mt-2 space-y-3 text-base">
            {[
              'Single crisp outlines (no double borders)',
              'Consistent chip sizes and selected state',
              'Cleaner spacing rhythm and hierarchy',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-fg">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent outline outline-1 outline-accent/30">
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3.5 8.5l3 3 6-6" />
                  </svg>
                </span>
                <span className="leading-relaxed text-fg/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right illustrative card with outline system */}
  <div className="relative">
          <div className="rounded-[28px] bg-gradient-to-b from-bg-alt/60 to-bg p-6 md:p-8 outline outline-1 -outline-offset-1 outline-border/60">
            {/* provider chips */}
            <div role="tablist" aria-label="Cloud providers" className="mb-5 grid grid-cols-3 gap-3 text-center">
              {[
                { key: 'aws', label: 'AWS' },
                { key: 'azure', label: 'Azure' },
                { key: 'gcp', label: 'GCP' }
              ].map((p) => {
                const active = topic === p.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls={`panel-${p.key}`}
                    data-active={active}
                    onClick={() => setTopic((t) => (t === p.key ? null : p.key))}
                    className="rounded-2xl px-4 py-2 text-sm font-semibold bg-bg outline outline-1 -outline-offset-1 outline-border/50 transition data-[active=true]:bg-accent/10 data-[active=true]:text-accent data-[active=true]:outline-accent/30"
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {(['aws','azure','gcp'] as const).includes(topic as any) && (
              <div id={`panel-${topic}`} role="tabpanel" aria-labelledby={`tab-${topic}`} className="mb-6 rounded-2xl bg-bg-alt/50 p-4 text-sm leading-relaxed text-fg-muted outline outline-1 -outline-offset-1 outline-border/40">
                <strong className="text-fg">{providerBlurb[topic!].label}</strong> — {providerBlurb[topic!].blurb}
                <div className="mt-3">
                  <a href={providerBlurb[topic!].href} className="inline-flex items-center rounded-md px-3 py-1.5 text-[11px] font-semibold tracking-wide outline outline-1 -outline-offset-1 outline-border/50 hover:outline-accent/40 hover:text-accent transition">
                    See training
                  </a>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div className="relative rounded-2xl bg-bg/60 p-4 outline outline-1 -outline-offset-1 outline-border/50">
                <h3 className="text-base font-semibold mb-2">Compute & Containers</h3>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {['EC2/ECS','AKS','GKE','Kubernetes'].map((x)=> (
                    <span key={x} className="rounded-full bg-accent/10 text-accent px-3.5 py-1.5 outline outline-1 -outline-offset-1 outline-accent/30">{x}</span>
                  ))}
                </div>
              </div>

              <div className="relative rounded-2xl bg-bg/60 p-4 outline outline-1 -outline-offset-1 outline-border/50">
                <h3 className="text-base font-semibold mb-2">IaC & Policy</h3>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {['Terraform','Bicep','CloudFormation','OPA/Policy'].map((x)=> (
                    <span key={x} className="rounded-full bg-accent-alt/10 text-accent-alt px-3.5 py-1.5 outline outline-1 -outline-offset-1 outline-accent-alt/30">{x}</span>
                  ))}
                </div>
              </div>

              <div className="relative rounded-2xl bg-bg/60 p-4 outline outline-1 -outline-offset-1 outline-border/50">
                <h3 className="text-base font-semibold mb-2">CI/CD & Observability</h3>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {['GitHub Actions','Azure DevOps','Cloud Build','Prometheus','Grafana'].map((x)=> (
                    <span key={x} className="rounded-full bg-accent/10 text-accent px-3.5 py-1.5 outline outline-1 -outline-offset-1 outline-accent/30">{x}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center opacity-90">
              {[
                { key: 'networking', label: 'Networking' },
                { key: 'security', label: 'Security' },
                { key: 'data', label: 'Data' }
              ].map((c) => {
                const active = topic === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    data-active={active}
                    onClick={() => setTopic((t) => (t === c.key ? null : c.key))}
                    className="rounded-2xl px-4 py-2 text-xs font-semibold bg-bg outline outline-1 -outline-offset-1 outline-border/50 transition data-[active=true]:bg-accent/10 data-[active=true]:text-accent data-[active=true]:outline-accent/30"
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CloudTrainingStackPreview;
