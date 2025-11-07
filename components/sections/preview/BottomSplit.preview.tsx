"use client";

const testimonials = [
  {
    quote: "Cloudegree gave me the skills and confidence to land my dream cloud role. The mentorship was invaluable!",
    author: "Alex Rodriguez",
    role: "Cloud Engineer at AWS",
  },
  {
    quote: "The hands-on projects and community support made all the difference. I went from zero to cloud architect in 8 months.",
    author: "Priya Sharma",
    role: "Solutions Architect at Microsoft",
  },
];

export function BottomSplitPreview() {
  return (
    <section className="relative bg-bg py-24">
      {/* Liquid glass separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: WhatsApp CTA */}
          <div className="bg-gradient-to-br from-accent/10 to-accent-alt/5 rounded-3xl p-8 md:p-10 shadow-lg shadow-accent/10 border border-accent/30 space-y-6">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-full bg-accent/20 border border-accent/30">
                <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                  GET IN TOUCH
                </span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white">
                Have Questions? Let&apos;s Talk!
              </h3>
              <p className="text-base md:text-lg text-fg-muted leading-relaxed">
                Chat with our team on WhatsApp. We&apos;re here to help you find the right path for your cloud career.
              </p>
            </div>

            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-gradient-to-r from-accent to-accent-alt text-bg font-bold text-lg hover:shadow-xl hover:shadow-accent/40 hover:scale-105 transition-all duration-200 w-full sm:w-auto"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              CHAT WITH US
            </a>
          </div>

          {/* Right: Testimonials */}
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-bg-alt/60 to-bg/80 rounded-2xl p-6 md:p-8 shadow-sm border border-border/60 hover:border-accent/50 transition-all duration-200 space-y-4"
              >
                <p className="text-base md:text-lg text-fg-muted leading-relaxed line-clamp-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="pt-2 border-t border-border/40">
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-fg-muted">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
