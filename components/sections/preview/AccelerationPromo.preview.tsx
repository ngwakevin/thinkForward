"use client";

import Link from "next/link";

const items: { title: string; blurb: string; href: string; color: string }[] = [
  {
    title: "Bootcamps",
    blurb: "Live, instructor-led experiences with weekly momentum checks.",
    href: "/bootcamps",
    color: "#ff754c",
  },
  {
    title: "Role Roadmaps",
    blurb: "Curated milestones that make senior cloud roles feel reachable.",
    href: "/roadmaps",
    color: "#5638ff",
  },
  {
    title: "Hands-on Labs",
    blurb: "Real scenarios mapped to AWS, Azure, and GCP deployments.",
    href: "/courses",
    color: "#2f441c",
  },
  {
    title: "1:1 Mentorship",
    blurb: "Feedback in under 24 hours so practice never stalls.",
    href: "/mentoring",
    color: "#00aa87",
  },
];

export function AccelerationPromoPreview() {
  return (
    <section className="relative isolate overflow-hidden bg-[#ffeae1] py-24 text-[#2b1e40]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 24%, rgba(86,56,255,0.18), rgba(255,234,225,0))," +
            "radial-gradient(circle at 82% 16%, rgba(0,170,135,0.16), rgba(255,234,225,0))",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#2b1e40]/65 shadow-[4px_4px_0_0_rgba(43,30,64,0.12)]">
            <span className="h-2 w-2 rounded-full bg-[#2f441c]" />
            Services
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold leading-tight">
            Pick your support system, remix your career.
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#2b1e40]/70">
            We kept Cloudegree’s chip language: playful blocks, high-contrast type, and pastel gradients that make the roadmap feel approachable.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex h-full flex-col gap-4 rounded-[44px] bg-white px-8 py-10 shadow-[12px_12px_0_0_rgba(43,30,64,0.12)]"
            >
              <div
                className="inline-flex w-fit items-center rounded-[28px] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white shadow-[6px_6px_0_0_rgba(43,30,64,0.12)]"
                style={{ backgroundColor: item.color }}
              >
                {item.title}
              </div>
              <p className="text-sm leading-relaxed text-[#2b1e40]/75">{item.blurb}</p>
              <Link
                href={item.href as any}
                className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#2f441c]"
              >
                Learn more
                <span className="i-lucide-arrow-right text-sm" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
