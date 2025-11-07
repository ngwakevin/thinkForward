"use client";

const pillars = [
  { title: "Real Mentorship", desc: "Direct feedback loops that unblock real work.", color: "#5638ff" },
  { title: "Creative Community", desc: "Cohorts that share progress weekly and keep things fun.", color: "#2f441c" },
  { title: "Hands-on Practice", desc: "Cloud labs that feel like real-world briefs.", color: "#ff754c" },
  { title: "Career Momentum", desc: "Evidence, storytelling, and interview support.", color: "#00aa87" },
];

const cardPalette = ["#ffeedf", "#e8e7ff", "#dff7f0"];

export function ValuePillarsPreview() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fff7ef] py-24 text-[#231c3c]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 20%, rgba(86,56,255,0.12), rgba(255,247,239,0))," +
            "radial-gradient(circle at 82% 26%, rgba(255,117,76,0.12), rgba(255,247,239,0))",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.34em] text-[#231c3c]/65 shadow-[4px_4px_0_0_rgba(35,28,60,0.12)]">
            <span className="h-2 w-2 rounded-full bg-[#2f441c]" />
            Our Approach
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold leading-tight">
            Built with playful structure so progress feels inevitable.
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#231c3c]/70">
            We borrowed Cloudegree’s energy—bold blocks, soft gradients, and crisp typography—to highlight
            the pillars that keep our learners shipping.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="relative flex flex-col gap-4 rounded-[40px] px-8 py-10 shadow-[12px_12px_0_0_rgba(35,28,60,0.12)]"
              style={{ backgroundColor: cardPalette[index % cardPalette.length] }}
            >
              <div
                className="inline-flex w-fit items-center rounded-[28px] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white shadow-[6px_6px_0_0_rgba(35,28,60,0.12)]"
                style={{ backgroundColor: pillar.color }}
              >
                {pillar.title.split(" ")[0]}
              </div>
              <h3 className="text-2xl font-semibold text-[#231c3c]">{pillar.title}</h3>
              <p className="text-sm leading-relaxed text-[#231c3c]/75">{pillar.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[40px] bg-white px-10 py-12 shadow-[14px_14px_0_0_rgba(35,28,60,0.12)]">
          <div className="grid gap-8 md:grid-cols-3 md:items-center">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e8e7ff] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#231c3c]/70">
                Sample week
                <span className="i-lucide-sparkles text-sm" />
              </span>
              <p className="text-sm leading-relaxed text-[#231c3c]/70">
                Every sprint mixes clarity, play, and proof so learners never float without direction.
              </p>
            </div>

            <div className="space-y-4">
              {["Plan Monday", "Ship Midweek", "Showcase Friday"].map((item, idx) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-[28px] bg-[#dff7f0] px-5 py-3 text-sm font-semibold text-[#065a48] shadow-[6px_6px_0_0_rgba(35,28,60,0.1)]"
                >
                  {item}
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#065a48]/65">
                    {`0${idx + 1}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-[32px] bg-[#2f441c] px-6 py-7 text-[#f6f8ff] shadow-[8px_8px_0_0_rgba(35,28,60,0.12)]">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#f6f8ff]/70">
                Mentor pulse
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                “These blocks make progress feel like art—we know exactly what to tackle next, but it
                still feels playful.”
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#f6f8ff]/70">
                Senior Cloud Mentor
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
