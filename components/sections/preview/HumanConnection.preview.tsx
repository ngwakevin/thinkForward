"use client";

const features = [
  {
    title: "Real Mentorship",
    description:
      "Rigorously vetted cloud mentors provide personalized feedback, encouragement, and an insider’s perspective on the industry.",
    href: "/mentoring",
    linkLabel: "Learn about mentorship",
    color: "#5638ff",
  },
  {
    title: "Creative Community",
    description:
      "Online cohorts keep collaboration and accountability alive—making room for friendships, pair sessions, and shared wins.",
    href: "/community",
    linkLabel: "Explore our community",
    color: "#2f441c",
  },
];

export function HumanConnectionPreview() {
  return (
    <section className="relative isolate overflow-hidden bg-[#ffeae1] py-24 text-[#2b1e40]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 20%, rgba(86,56,255,0.18), rgba(255,234,225,0))," +
            "radial-gradient(circle at 82% 22%, rgba(0,170,135,0.16), rgba(255,234,225,0))",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.34em] text-[#2b1e40]/65 shadow-[4px_4px_0_0_rgba(43,30,64,0.12)]">
            <span className="h-2 w-2 rounded-full bg-[#2f441c]" />
            Human Layer
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold leading-tight">
            Online learning with a heavy dose of human connection.
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#2b1e40]/70">
            Cloudegree’s famous lego blocks inspired these connection tiles—each one a playful reminder that you are never building alone.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex h-full flex-col gap-4 rounded-[44px] bg-white px-8 py-10 shadow-[12px_12px_0_0_rgba(43,30,64,0.12)]"
            >
              <div
                className="inline-flex w-fit items-center rounded-[26px] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[6px_6px_0_0_rgba(43,30,64,0.12)]"
                style={{ backgroundColor: feature.color }}
              >
                {feature.title}
              </div>
              <p className="text-sm leading-relaxed text-[#2b1e40]/75">{feature.description}</p>
              <a
                href={feature.href}
                className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#2f441c]"
              >
                {feature.linkLabel}
                <span className="i-lucide-arrow-right text-sm" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
