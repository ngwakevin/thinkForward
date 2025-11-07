import Link from "next/link";

const items: { title: string; blurb: string; href: string; color: string }[] = [
  {
    title: "Support",
    blurb: "Async updates and quick check-ins to maintain momentum.",
    href: "/support",
    color: "#5638ff",
  },
  {
    title: "Success Services",
    blurb: "Guided integration and reviews that accelerate outcomes.",
    href: "/contact",
    color: "#2f441c",
  },
  {
    title: "Learning",
    blurb: "Roadmaps, deep-dive guides, and labs that build proof.",
    href: "/docs",
    color: "#ff754c",
  },
  {
    title: "Community",
    blurb: "Peer cohorts plus micro-accountability loops.",
    href: "/events",
    color: "#00aa87",
  },
];

export function SupportEcosystemPreview() {
  return (
    <section className="relative isolate overflow-hidden bg-[#e8e7ff] py-24 text-[#2b1e40]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,117,76,0.16), rgba(232,231,255,0))," +
            "radial-gradient(circle at 82% 24%, rgba(0,170,135,0.16), rgba(232,231,255,0))",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <span className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#2b1e40]/65 shadow-[4px_4px_0_0_rgba(43,30,64,0.12)]">
            <span className="h-2 w-2 rounded-full bg-[#2f441c]" />
            Ecosystem
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
            A playful grid of help when you need it.
          </h2>
          <p className="text-base md:text-lg text-[#2b1e40]/70">
            Each block mirrors Cloudegree’s rounded lego silhouette, translating to support that feels both structured and fun.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex h-full flex-col gap-3 rounded-[44px] bg-white px-6 py-8 shadow-[10px_10px_0_0_rgba(43,30,64,0.12)]"
            >
              <div
                className="inline-flex w-fit items-center rounded-[26px] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[6px_6px_0_0_rgba(43,30,64,0.12)]"
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
