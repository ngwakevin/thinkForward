"use client";

import React from "react";

const providers = [
  { key: "aws", label: "AWS", color: "#2f441c" },
  { key: "azure", label: "Azure", color: "#5638ff" },
  { key: "gcp", label: "GCP", color: "#ff754c" },
];

const featureStacks = [
  { title: "Compute & Containers", items: ["EC2 / ECS", "AKS", "GKE", "Kubernetes"] },
  { title: "IaC & Policy", items: ["Terraform", "Bicep", "CloudFormation", "OPA"] },
  { title: "CI/CD & Observability", items: ["GitHub Actions", "Azure DevOps", "Prometheus", "Grafana"] },
];

const providerBlurb: Record<string, { label: string; blurb: string; href: string; tint: string }> = {
  aws: {
    label: "AWS",
    blurb:
      "Labs on IAM, VPC, EKS, and CI/CD with IaC patterns. Build deployable foundations that mirror real environments.",
    href: "/courses",
    tint: "#edf8e8",
  },
  azure: {
    label: "Azure",
    blurb:
      "AKS, Bicep, and Azure DevOps pipelines with security-first defaults for platform engineering paths.",
    href: "/courses",
    tint: "#ede9ff",
  },
  gcp: {
    label: "GCP",
    blurb:
      "GKE, Cloud Build, and policy guardrails with Terraform. Ship reliable workflows and observability.",
    href: "/courses",
    tint: "#ffeae1",
  },
  networking: {
    label: "Networking",
    blurb:
      "VPC/VNet design, subnets, gateways, and private connectivity patterns you will use in production.",
    href: "/docs",
    tint: "#edf8e8",
  },
  security: {
    label: "Security",
    blurb:
      "Identity, secrets, and policy-as-code. Practical guardrails to keep shipping without surprises.",
    href: "/docs",
    tint: "#ede9ff",
  },
  data: {
    label: "Data",
    blurb:
      "Managed data stores, backup/restore, and pipelines to support app and analytics workloads.",
    href: "/docs",
    tint: "#ffeae1",
  },
};

type ProviderKey = keyof typeof providerBlurb;

export function CloudTrainingStackPreview() {
  const [topic, setTopic] = React.useState<ProviderKey>("aws");

  return (
    <section className="relative isolate overflow-hidden bg-[#fef6ff] py-24 text-[#311f49]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 24%, rgba(86,56,255,0.12), rgba(254,246,255,0))," +
            "radial-gradient(circle at 82% 26%, rgba(0,170,135,0.12), rgba(254,246,255,0))",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#311f49]/65 shadow-[4px_4px_0_0_rgba(49,31,73,0.12)]">
            <span className="h-2 w-2 rounded-full bg-[#2f441c]" />
            Cloud Stack
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold leading-tight">
            Choose your provider, keep the playful structure.
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#311f49]/70">
            Tap a provider chip to see lab focus and outcomes. Mix-and-match for the exact career track you need.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {providers.map((provider) => (
                <button
                  key={provider.key}
                  type="button"
                  onClick={() => setTopic(provider.key as ProviderKey)}
                  className="rounded-[32px] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-[6px_6px_0_0_rgba(49,31,73,0.12)] transition"
                  style={{
                    backgroundColor: provider.color,
                    opacity: topic === provider.key ? 1 : 0.75,
                  }}
                  aria-pressed={topic === provider.key}
                >
                  {provider.label}
                </button>
              ))}
            </div>

            <div
              className="rounded-[36px] px-8 py-10 text-left shadow-[12px_12px_0_0_rgba(49,31,73,0.12)]"
              style={{ backgroundColor: providerBlurb[topic].tint }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#311f49]/60">Track focus</p>
              <h3 className="mt-4 text-2xl font-semibold text-[#311f49]">{providerBlurb[topic].label}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#311f49]/70">{providerBlurb[topic].blurb}</p>
              <a
                href={providerBlurb[topic].href}
                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#2f441c]"
              >
                See training
                <span className="i-lucide-arrow-right text-sm" />
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              {(["networking", "security", "data"] as ProviderKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTopic(key)}
                  className="rounded-[28px] bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#311f49]/70 shadow-[4px_4px_0_0_rgba(49,31,73,0.1)] transition hover:bg-[#f3eeff]"
                  aria-pressed={topic === key}
                >
                  {providerBlurb[key].label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#2f441c] bg-[#2f441c] px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-white hover:text-[#2f441c]"
              >
                Start training
                <span className="i-lucide-arrow-up-right text-base" />
              </a>
              <a
                href="/solutions"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#2f441c] px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#2f441c] transition hover:bg-[#e8e7ff]"
              >
                Success stories
                <span className="i-lucide-arrow-right text-base" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            {featureStacks.map((stack, index) => (
              <div
                key={stack.title}
                className="rounded-[36px] bg-white px-8 py-8 shadow-[12px_12px_0_0_rgba(49,31,73,0.12)]"
                style={{ transform: `translateY(${index * 8}px)` }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#311f49]">{stack.title}</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#311f49]/50">Core labs</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#311f49]/70">
                  {stack.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-[24px] bg-[#efe8ff] px-3 py-2 shadow-[4px_4px_0_0_rgba(49,31,73,0.08)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
