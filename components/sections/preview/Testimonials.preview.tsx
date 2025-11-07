"use client";

const testimonials = [
  {
    name: "Sarah Martinez",
    role: "Cloud Academy Graduate",
    quote:
      "I gained valuable experience during my tenure at Cloud Academy. The unwavering support from both mentors and peers, coupled with constructive group critiques, significantly enriched my overall learning journey.",
  },
  {
    name: "James Chen",
    role: "DevOps Bootcamp Graduate",
    quote:
      "The best part for me was finding an incredible group of friends who turned out to be so much more than just classmates. We connected through common interests, aided each other through challenges, and formed enduring memories.",
  },
  {
    name: "Alex Johnson",
    role: "Foundations Student",
    quote:
      "The course was well structured and the projects throughout were fun and helpful. My favorite aspect was being paired with a mentor who works in the industry where I could get feedback and learn best practices.",
  },
];

const cardPalette = ["#ffeedf", "#e8e7ff", "#dff7f0"];
const badgePalette = ["#ff754c", "#5638ff", "#2f441c"];

export function TestimonialsPreview() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fef6ff] py-24 text-[#2b1e40]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 24%, rgba(86,56,255,0.16), rgba(254,246,255,0))," +
            "radial-gradient(circle at 82% 18%, rgba(0,170,135,0.16), rgba(254,246,255,0))",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.34em] text-[#2b1e40]/65 shadow-[4px_4px_0_0_rgba(43,30,64,0.12)]">
            <span className="h-2 w-2 rounded-full bg-[#2f441c]" />
            Voices
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl font-semibold leading-tight">
            Students love the playful structure.
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#2b1e40]/70">
            The pastel blocks aren’t just pretty—they remind learners that the path is modular, collaborative, and always supported.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="flex h-full flex-col gap-4 rounded-[40px] px-7 py-8 shadow-[12px_12px_0_0_rgba(43,30,64,0.12)]"
              style={{ backgroundColor: cardPalette[index % cardPalette.length] }}
            >
              <span
                className="inline-flex w-fit items-center rounded-[26px] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white shadow-[6px_6px_0_0_rgba(43,30,64,0.12)]"
                style={{ backgroundColor: badgePalette[index % badgePalette.length] }}
              >
                {testimonial.role.split(" ")[0]}
              </span>
              <p className="text-sm leading-relaxed text-[#2b1e40]">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-auto text-xs text-[#2b1e40]/70">
                <p className="font-semibold text-[#2b1e40]">{testimonial.name}</p>
                <p>{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
