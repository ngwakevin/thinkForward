import { CloudegreeWordmark } from '../../components/brand/CloudegreeWordmark';

export const metadata = {
  title: 'Cloudegree — Go Live in Cameroon',
  description: 'Cloudegree launches in Cameroon! Cloud & DevOps training with live bootcamps, 1-on-1 mentoring, hands-on labs, and certification prep. Douala, Yaoundé, and Online.',
};

export default function CameroonPage() {
  return (
    <div className="min-h-screen">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bg to-bg-alt pt-28 pb-24">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-accent-alt/10 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-warning mb-6">🇨🇲 Cameroon Launch 2026</p>

          <CloudegreeWordmark className="text-4xl md:text-5xl justify-center mb-8" as="div" />

          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">
            We Are Live in Cameroon!
          </h1>
          <p className="mt-6 text-lg text-fg-muted max-w-2xl mx-auto">
            Pragmatic acceleration for Cloud &amp; DevOps skills — structured tracks, mentorship, events, and practical guides. Now serving Cameroon with in-person and online programs.
          </p>

          <div className="mt-8">
            <span className="inline-block rounded-full bg-accent/15 px-8 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-accent ring-1 ring-accent/30">
              Train · Build · Elevate
            </span>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row sm:justify-center items-center gap-4">
            <a
              href="/bootcamps/register"
              className="inline-flex items-center justify-center rounded-md bg-accent px-8 py-3.5 font-semibold text-white shadow-md hover:bg-accent-alt transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              Register Now
            </a>
            <a
              href="/cameroon/flyer"
              className="inline-flex items-center justify-center rounded-md border border-border px-8 py-3.5 font-medium text-fg hover:border-accent hover:text-accent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              Download Flyer
            </a>
          </div>
          <p className="mt-4 text-[11px] text-fg-muted uppercase tracking-[0.2em]">Limited spots • Early bird pricing available</p>
        </div>
      </section>

      {/* ─── Training Tracks ─── */}
      <section className="py-24" aria-labelledby="tracks-heading">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl mb-14 space-y-5">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Training Tracks</p>
            <h2 id="tracks-heading" className="font-display text-3xl md:text-4xl font-bold tracking-tight">Choose Your Cloud Path</h2>
            <p className="text-fg-muted text-base leading-relaxed">Three structured tracks designed to take you from zero or fragmented IT experience to a confident cloud practitioner.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: '🌥️', name: 'Cloud Foundation', desc: 'Master Azure, AWS & GCP fundamentals. Build your cloud bedrock with hands-on labs and real-world projects.', certs: 'AZ-900, CLF-C02, Cloud Digital Leader' },
              { icon: '⚙️', name: 'DevOps Engineer', desc: 'CI/CD pipelines, Infrastructure as Code, containers & Kubernetes. Ship with confidence.', certs: 'AZ-400, AWS DevOps Pro, CKA' },
              { icon: '🔐', name: 'Cloud Security', desc: 'Security-first architecture — IAM, compliance, threat modeling, and security automation.', certs: 'AZ-500, AWS Security Specialty, SC-100' },
            ].map(track => (
              <div key={track.name} className="group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/20 p-8 shadow-sm hover:border-accent/30 transition">
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
                <span className="text-4xl mb-4">{track.icon}</span>
                <h3 className="font-display text-xl font-semibold tracking-tight mb-3">{track.name}</h3>
                <p className="text-fg-muted text-sm leading-relaxed flex-1">{track.desc}</p>
                <div className="mt-4 pt-4 border-t border-border/40">
                  <p className="text-[11px] text-fg-muted uppercase tracking-wide">Target Certifications</p>
                  <p className="text-xs font-medium text-accent mt-1">{track.certs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── What We Offer ─── */}
      <section className="py-24 bg-gradient-to-b from-bg-alt/30 to-bg" aria-labelledby="offerings-heading">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl mb-14 space-y-5">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Our Offerings</p>
            <h2 id="offerings-heading" className="font-display text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
            <p className="text-fg-muted text-base leading-relaxed">From structured bootcamps to personalized mentoring — we provide the complete ecosystem for your cloud career acceleration.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '🎓', title: 'Live Bootcamps', desc: 'Immersive, instructor-led cohort sessions with real-time interaction and hands-on exercises.' },
              { icon: '👨‍🏫', title: '1-on-1 Mentoring', desc: 'Personalized career guidance, code review, and acceleration frameworks tailored to your goals.' },
              { icon: '🛠️', title: 'Project-Based Labs', desc: 'Real infrastructure, pipelines & security projects that build your professional portfolio.' },
              { icon: '📜', title: 'Certification Prep', desc: 'Structured preparation paths for industry-recognized cloud certifications.' },
              { icon: '🚀', title: 'Career Acceleration', desc: 'Interview positioning, storytelling clarity, and portfolio alignment for job readiness.' },
              { icon: '🤝', title: 'Community & Support', desc: 'Join a growing network of cloud practitioners across Cameroon and beyond.' },
            ].map(item => (
              <div key={item.title} className="group rounded-2xl border border-border/60 bg-bg-alt/40 p-6 hover:border-accent/30 transition">
                <span className="text-3xl block mb-3">{item.icon}</span>
                <h3 className="font-display text-lg font-semibold tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Event Details ─── */}
      <section className="py-24" aria-labelledby="details-heading">
        <div className="mx-auto max-w-5xl px-6">
          <h2 id="details-heading" className="sr-only">Event Details</h2>
          <div className="rounded-3xl border border-warning/30 bg-gradient-to-r from-warning/5 to-warning/10 p-10 md:p-14">
            <div className="grid gap-10 md:grid-cols-3 text-center">
              <div>
                <span className="block text-sm font-bold uppercase tracking-[0.2em] text-warning">📅 Start Date</span>
                <p className="mt-3 text-2xl font-bold">Coming Soon</p>
                <p className="text-sm text-fg-muted">2026</p>
              </div>
              <div>
                <span className="block text-sm font-bold uppercase tracking-[0.2em] text-warning">📍 Locations</span>
                <p className="mt-3 text-2xl font-bold">Douala · Yaoundé</p>
                <p className="text-sm text-fg-muted">+ Online Available</p>
              </div>
              <div>
                <span className="block text-sm font-bold uppercase tracking-[0.2em] text-warning">💰 Pricing</span>
                <p className="mt-3 text-2xl font-bold">Early Bird</p>
                <p className="text-sm text-fg-muted">Limited Spots Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Registration Info ─── */}
      <section className="py-24 bg-gradient-to-b from-bg to-bg-alt" aria-labelledby="register-heading">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">Get Started</p>
              <h2 id="register-heading" className="font-display text-3xl md:text-4xl font-bold tracking-tight">Register for Cameroon Launch</h2>
              <p className="text-fg-muted leading-relaxed">Complete our simple registration form to secure your spot. We&apos;ll match you with the right track based on your experience and goals.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/bootcamps/register"
                  className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-medium text-white shadow-md hover:bg-accent-alt transition"
                >
                  Complete Registration
                </a>
                <a
                  href="/mentoring"
                  className="inline-flex items-center justify-center rounded-md border border-accent-alt/40 px-6 py-3 font-medium text-accent-alt hover:border-accent-alt transition"
                >
                  Book 1-on-1 Mentoring
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-bg-alt/60 p-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-6">What You&apos;ll Fill Out</h3>
              <div className="space-y-4">
                {[
                  { field: 'Full Name', desc: 'Your full legal name' },
                  { field: 'Email Address', desc: 'Primary contact email' },
                  { field: 'Phone / WhatsApp', desc: 'For local Cameroon contact' },
                  { field: 'Preferred Cloud Provider', desc: 'Azure, AWS, or Google Cloud' },
                  { field: 'Experience Level', desc: '0-1, 1-3, 3-5, or 5+ years' },
                  { field: 'Primary Goal', desc: 'Career change, skill upgrade, certification, or promotion' },
                ].map(item => (
                  <div key={item.field} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />
                    <div>
                      <p className="text-sm font-medium">{item.field}</p>
                      <p className="text-xs text-fg-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Marketing Materials ─── */}
      <section className="py-24" aria-labelledby="materials-heading">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-accent mb-4">Campaign Materials</p>
          <h2 id="materials-heading" className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">Download &amp; Share</h2>
          <p className="text-fg-muted mb-12 max-w-lg mx-auto">Download our campaign materials to help spread the word about Cloudegree in Cameroon.</p>
          <div className="grid gap-8 md:grid-cols-3">
            <a
              href="/cameroon/flyer"
              className="group rounded-2xl border border-border/60 bg-bg-alt/40 p-8 hover:border-accent/40 transition block"
            >
              <span className="text-4xl block mb-4">📄</span>
              <h3 className="font-display text-lg font-semibold mb-2">Campaign Flyer</h3>
              <p className="text-sm text-fg-muted mb-4">A5 printable flyer with all key information — perfect for handouts and social media.</p>
              <span className="text-xs font-semibold text-accent group-hover:text-accent-alt transition">View &amp; Download →</span>
            </a>
            <a
              href="/cameroon/flyer#poster"
              className="group rounded-2xl border border-border/60 bg-bg-alt/40 p-8 hover:border-accent/40 transition block"
            >
              <span className="text-4xl block mb-4">🖼️</span>
              <h3 className="font-display text-lg font-semibold mb-2">Big Poster</h3>
              <p className="text-sm text-fg-muted mb-4">Large format poster for wall displays, events, and billboard advertising.</p>
              <span className="text-xs font-semibold text-accent group-hover:text-accent-alt transition">View &amp; Download →</span>
            </a>
            <a
              href="/cameroon/design-specs"
              className="group rounded-2xl border border-border/60 bg-bg-alt/40 p-8 hover:border-accent/40 transition block"
            >
              <span className="text-4xl block mb-4">🎨</span>
              <h3 className="font-display text-lg font-semibold mb-2">Design Specifications</h3>
              <p className="text-sm text-fg-muted mb-4">Canva-ready brand guidelines — colors, fonts, layouts, and export sizes.</p>
              <span className="text-xs font-semibold text-accent group-hover:text-accent-alt transition">View Specs →</span>
            </a>
          </div>
        </div>
      </section>

      {/* ─── Contact CTA ─── */}
      <section className="py-24 bg-gradient-to-b from-bg-alt/30 to-bg">
        <div className="mx-auto max-w-3xl px-6 text-center space-y-6">
          <CloudegreeWordmark className="text-3xl justify-center" as="div" />
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Ready to Start Your Cloud Journey?</h2>
          <p className="text-fg-muted">Get in touch or register directly — we&apos;re here to help you succeed.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/bootcamps/register" className="inline-flex items-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-alt transition">Register Now</a>
            <a href="/contact" className="inline-flex items-center rounded-md border border-accent/40 px-6 py-3 text-sm font-medium text-accent hover:border-accent transition">Contact Us</a>
            <a href="/mentoring" className="inline-flex items-center rounded-md border border-border px-6 py-3 text-sm font-medium text-fg hover:border-accent hover:text-accent transition">Book Mentoring</a>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-fg-muted pt-4">
            <span>📧 ngwakevin@gmail.com</span>
            <span>🗓️ calendly.com/ngwakevin/mentoring</span>
          </div>
        </div>
      </section>
    </div>
  );
}
