"use client";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Cloud Solutions Architect at Microsoft",
    content: "Cloudegree's bootcamp transformed my career. The mentorship and hands-on projects gave me the confidence to land my dream role.",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "DevOps Engineer at AWS",
    content: "The practical approach and real-world scenarios prepared me for the challenges I face daily. Best investment I've made in my career.",
    avatar: "MJ",
  },
  {
    name: "Priya Patel",
    role: "Cloud Architect at Google",
    content: "The community support and expert mentors made all the difference. I went from zero cloud knowledge to a senior position in 18 months.",
    avatar: "PP",
  },
];

export function TestimonialsPreview() {
  return (
    <section className="relative bg-gradient-to-b from-bg to-bg-alt py-24">
      {/* Liquid glass separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Success Stories
          </h2>
          <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
            Hear from our graduates who have transformed their careers through cloud certification.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-bg-alt/80 to-bg rounded-2xl p-8 shadow-sm border border-border/60 hover:border-accent/50 transition-all duration-200 hover:shadow-lg hover:shadow-accent/10 space-y-6"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-alt flex items-center justify-center text-bg font-bold text-sm shadow-lg shadow-accent/20">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-fg-muted">{testimonial.role}</div>
                </div>
              </div>

              {/* Content */}
              <p className="text-base text-fg-muted leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
