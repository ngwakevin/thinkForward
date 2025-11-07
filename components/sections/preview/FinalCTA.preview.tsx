"use client";

export function FinalCTAPreview() {
  return (
    <section className="relative isolate overflow-hidden bg-[#2f441c] py-24 text-[#f6f8ff]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 20%, rgba(255,215,170,0.18), rgba(47,68,28,0))," +
            "radial-gradient(circle at 82% 24%, rgba(86,56,255,0.14), rgba(47,68,28,0))",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="inline-flex flex-col items-center gap-3 rounded-[44px] bg-white/10 px-10 py-8 shadow-[12px_12px_0_0_rgba(0,0,0,0.15)] backdrop-blur">
          <div className="inline-flex items-center gap-3 rounded-[26px] bg-[#ff754c] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[6px_6px_0_0_rgba(0,0,0,0.15)]">
            Open house
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold leading-tight">
            Attend an open house and feel the blocks in motion.
          </h2>
          <p className="max-w-2xl text-sm md:text-base leading-relaxed text-[#f6f8ff]/80">
            Learn how Cloud Academy, mentorship, and the new playful design come together. Bring questions for the live Q&A and leave with your next steps.
          </p>
          <a
            href="/events"
            className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#2f441c] transition hover:bg-[#ffeae1]"
          >
            Register for an open house
            <span className="i-lucide-arrow-up-right text-base" />
          </a>
        </div>
      </div>
    </section>
  );
}
