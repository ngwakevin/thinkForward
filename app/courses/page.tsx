import ProductsGrid from '../../components/products/ProductsGrid';
import * as Icons from 'lucide-react';
import { products } from '../../data/products';

export const metadata = { title: 'Courses – Experience Tracks' };

const heroHighlights = [
  {
    label: 'Guided Progression',
    detail: 'Curated modules stacked in deliberate sequences.',
    icon: Icons.Layers
  },
  {
    label: 'Mentor Feedback',
    detail: 'Async reviews, office hours, and checkpoint calibrations.',
    icon: Icons.MessageCircle
  },
  {
    label: 'Portfolio Evidence',
    detail: 'Ship real artifacts that demonstrate capability.',
    icon: Icons.BadgeCheck
  }
];

const journeyPhases = [
  {
    title: 'Foundations',
    description: 'Land core cloud vocabulary, architecture primitives, and platform services with playful repetition.',
    icon: Icons.Sparkles
  },
  {
    title: 'Applied Labs',
    description: 'Build pipelines, provision infra, and wire observability in guided sandboxes tuned to production expectations.',
    icon: Icons.Cpu
  },
  {
    title: 'Career Alignment',
    description: 'Translate progress into evidence, prep for interviews, and plan continuous iteration with mentors.',
    icon: Icons.Map
  }
];

const deliveryOptions: any[] = [];

export default function CoursesPage() {
  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.65),rgba(255,255,255,0)),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.35),rgba(255,255,255,0))]"
        style={{ backgroundColor: '#d9e3d5' }}
        aria-hidden
      />

      <section
        className="relative text-[#233816]"
        style={{ background: 'linear-gradient(140deg, #d9e3d5 0%, #cfe0d2 40%, #bed4c6 100%)' }}
      >
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-28">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#2a3b27] shadow-sm">
                  Courses & Learning Tracks
                </span>
                <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Build cloud mastery with playful structure and mentor energy.
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-[#203421]/80 sm:text-lg">
                  Select a track, layer guided labs, and ship artifacts that prove what you can deliver. Every course
                  mirrors the updated home experience—soft gradients, clear hierarchy, and frictionless navigation.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#2a3b27]/80">
                  <a href="#courses-list" className="inline-flex items-center gap-2 rounded-full bg-[#233816] px-5 py-2 text-[#f5f7f2] transition hover:scale-[1.02]">
                    Browse Tracks
                  </a>
                  <a href="/roadmaps" className="inline-flex items-center gap-2 rounded-full border border-[#233816]/20 px-5 py-2 text-[#233816] transition hover:bg-white/80">
                    View Roadmaps
                  </a>
                </div>
              </div>

              <dl className="grid gap-4 sm:grid-cols-3">
                {heroHighlights.map(({ icon: Icon, label, detail }) => (
                  <div
                    key={label}
                    className="rounded-[28px] bg-white px-6 py-5 text-left shadow-[14px_14px_0_rgba(47,68,40,0.18)]"
                  >
                    <dt className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-[#647461]">
                      <Icon className="h-4 w-4 text-[#233816]/80" />
                      {label}
                    </dt>
                    <dd className="mt-3 text-[0.95rem] leading-relaxed text-[#1f2b20]">{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              <div className="rounded-[34px] bg-white/80 p-6 shadow-[16px_26px_0_rgba(35,56,22,0.16)]">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-[#647461]">
                  Start your journey
                </p>
                <ul className="mt-6 space-y-5 text-sm leading-relaxed text-[#1f2b20]/85">
                  {journeyPhases.map(({ icon: Icon, title, description }) => (
                    <li key={title} className="flex gap-4 rounded-[24px] bg-white/80 px-4 py-4 shadow-[10px_12px_0_rgba(35,56,22,0.12)]">
                      <span className="mt-1 rounded-full bg-[#233816]/10 p-2 text-[#233816]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#1f2b20]">{title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-[#1f2b20]/75">{description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-3xl bg-[#233816] px-5 py-5 text-[#f5f7f2]">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.38em] text-white/70">
                    Download syllabus pack
                  </p>
                  <p className="mt-3 text-sm leading-relaxed">
                    Get all current outlines, skill matrices, and suggested pairings in one tidy bundle.
                  </p>
                  <a
                    href="/docs/quick-start"
                    className="mt-4 inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.32em] text-white"
                  >
                    View quick start →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {deliveryOptions.length > 0 && (
        <section className="relative bg-[#f5f7f2] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {deliveryOptions.map(({ title, description, icon: Icon, cta }) => (
                <a
                  key={title}
                  href={cta.href}
                  className={`group relative overflow-hidden rounded-[36px] border px-8 py-8 shadow-[12px_12px_0_rgba(35,56,22,0.14)] transition hover:-translate-y-1 hover:shadow-[20px_20px_0_rgba(35,56,22,0.12)] ${
                    cta.tone === 'warning'
                      ? 'border-[#f5c48a] bg-[linear-gradient(135deg,#fffdf7_0%,#fff4df_50%,#ffe2b8_100%)]'
                      : 'border-[#a7c4ae] bg-[linear-gradient(135deg,#ffffff_0%,#f6fbf5_55%,#edf7ed_100%)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`rounded-2xl p-3 ${cta.tone === 'warning' ? 'bg-white/70 text-[#8a4d15] shadow-[6px_6px_0_rgba(255,196,138,0.35)]' : 'bg-white/70 text-[#1e3b2a] shadow-[6px_6px_0_rgba(167,196,174,0.35)]'}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className={`text-[0.62rem] font-semibold uppercase tracking-[0.38em] ${cta.tone === 'warning' ? 'text-[#9c5a1f]' : 'text-[#4a6247]'}`}>
                        {title}
                      </p>
                      <p className={`mt-2 text-base font-semibold ${cta.tone === 'warning' ? 'text-[#5a3620]' : 'text-[#1f2b20]'}`}>
                        {description}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`mt-4 inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.32em] ${
                      cta.tone === 'warning' ? 'text-[#b97822]' : 'text-[#1f2b20]'
                    }`}
                  >
                    {cta.label} →
                  </span>
                  <div className="pointer-events-none absolute inset-0 rounded-[36px] ring-0 transition group-hover:ring-2 group-hover:ring-[#233816]/15" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        id="courses-list"
        className="relative isolate overflow-hidden pb-24"
        style={{ background: 'linear-gradient(135deg, #dce9d9 0%, #ccddcf 38%, #b9d0c3 100%)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.7),rgba(255,255,255,0)),radial-gradient(circle_at_82%_22%,rgba(255,255,255,0.5),rgba(255,255,255,0))]" aria-hidden />
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 grid gap-6 lg:grid-cols-2">
            {[
              {
                title: 'Live Bootcamps',
                description: 'Six-week cohort rhythm, mentor cadences, and shipping commitments for high accountability.',
                icon: Icons.Rocket,
                href: '/bootcamps',
                badge: 'Join a bootcamp',
                tone: 'warning' as const
              },
              {
                title: 'Self-Paced Tracks',
                description: 'Modular playlists with async support, ideal for layering core mastery or bridging to bootcamps.',
                icon: Icons.GraduationCap,
                href: '#courses-list',
                badge: 'Explore courses',
                tone: 'accent' as const
              }
            ].map(({ title, description, icon: Icon, href, badge, tone }) => (
              <a
                key={title}
                href={href}
                className={`group relative overflow-hidden rounded-[36px] border px-8 py-8 shadow-[12px_12px_0_rgba(35,56,22,0.14)] transition hover:-translate-y-1 hover:shadow-[20px_20px_0_rgba(35,56,22,0.12)] ${
                  tone === 'warning'
                    ? 'border-[#f5c48a] bg-[linear-gradient(135deg,#fffdf7_0%,#fff4df_50%,#ffe2b8_100%)]'
                    : 'border-[#a7c4ae] bg-[linear-gradient(135deg,#ffffff_0%,#f6fbf5_55%,#edf7ed_100%)]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-2xl p-3 ${
                      tone === 'warning'
                        ? 'bg-white/70 text-[#8a4d15] shadow-[6px_6px_0_rgba(255,196,138,0.35)]'
                        : 'bg-white/70 text-[#1e3b2a] shadow-[6px_6px_0_rgba(167,196,174,0.35)]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p
                      className={`text-[0.62rem] font-semibold uppercase tracking-[0.38em] ${
                        tone === 'warning' ? 'text-[#9c5a1f]' : 'text-[#4a6247]'
                      }`}
                    >
                      {title}
                    </p>
                    <p
                      className={`mt-2 text-base font-semibold ${
                        tone === 'warning' ? 'text-[#5a3620]' : 'text-[#1f2b20]'
                      }`}
                    >
                      {description}
                    </p>
                  </div>
                </div>
                <span
                  className={`mt-4 inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.32em] ${
                    tone === 'warning' ? 'text-[#b97822]' : 'text-[#1f2b20]'
                  }`}
                >
                  {badge} →
                </span>
                <div className="pointer-events-none absolute inset-0 rounded-[36px] ring-0 transition group-hover:ring-2 group-hover:ring-[#233816]/15" />
              </a>
            ))}
          </div>
          <div className="relative rounded-[42px] border border-[#f5c48a] bg-[linear-gradient(135deg,#fff8eb_0%,#ffeccc_45%,#ffd8a8_100%)] p-8 shadow-[0_38px_90px_rgba(242,147,59,0.28)]">
            <span className="pointer-events-none absolute inset-x-6 top-0 h-24 rounded-[36px] bg-gradient-to-b from-white/80 via-white/40 to-transparent blur-[32px]" aria-hidden />
            <div className="flex flex-col gap-4 pb-6">
              <p className="inline-flex w-max items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#5c3415] shadow-[10px_10px_0_rgba(255,188,105,0.35)]">
                Track catalogue
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#4b2c12] sm:text-4xl">
                Choose your next sprint.
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-[#5c3a1b]/90 sm:text-base">
                Filter by difficulty, delivery mode, or scope. Each track inherits the refreshed preview styling—no more
                double borders, just clear outlines and approachable gradients.
              </p>
              <div className="flex flex-wrap gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#6a401d]/90">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-[#5c3616] shadow-[6px_6px_0_rgba(255,188,105,0.35)]">
                  <Icons.Filter className="h-3.5 w-3.5" />
                  Smart filters
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/65 px-4 py-2 text-[#5c3616]/90 shadow-[6px_6px_0_rgba(255,188,105,0.28)]">
                  <Icons.Sparkle className="h-3.5 w-3.5" />
                  Pastel focus
                </span>
              </div>
            </div>
            <ProductsGrid initialProducts={products} formatSelectorPosition="none" />
          </div>
        </div>
      </section>
    </div>
  );
}
