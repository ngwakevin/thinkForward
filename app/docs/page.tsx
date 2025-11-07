import type { Metadata } from 'next';
import {
  loadDocs,
  CATEGORY_ORDER,
  CATEGORY_INTROS
} from '../../lib/docs';
import DocsFilters from '../../components/docs/Filters';
import DocsSidebar from '../../components/docs/Sidebar';
import CategorySection from '../../components/docs/CategorySection';
import TrendingDocs from '../../components/docs/Trending';
import { DocsSearch } from '../../components/docs/Search';

const CATEGORY_ICONS: Record<string, string> = {
  'Getting Started': '🚀',
  Concepts: '🧠',
  Guides: '🛠️',
  Playbooks: '📘',
  FAQ: '❓',
  Other: '📎'
};

const FEATURED_SLUGS = [
  'quick-start',
  'guides/build-first-pipeline',
  'concepts/infrastructure-as-code'
] as const;

const HERO_CALLOUTS = [
  {
    label: 'Hands-on labs',
    description: 'Deploy, ship, and automate in guided sandboxes.',
    tint: '#5638ff'
  },
  {
    label: 'Architecture kits',
    description: 'Patterns, diagrams, and IaC snippets ready to drop in.',
    tint: '#ff754c'
  },
  {
    label: 'Leadership briefs',
    description: 'Concise briefings to align stakeholders faster.',
    tint: '#00aa87'
  }
];

const FEATURED_CARD_GRADIENTS = [
  'linear-gradient(135deg, #fef4ff 0%, #e5e8ff 100%)',
  'linear-gradient(135deg, #f3ffe9 0%, #e0fbf0 100%)',
  'linear-gradient(135deg, #fff3e8 0%, #ffe5f1 100%)'
];

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Getting Started': 'linear-gradient(140deg, rgba(255, 231, 245, 0.8), rgba(224, 242, 254, 0.8))',
  Concepts: 'linear-gradient(140deg, rgba(224, 242, 254, 0.8), rgba(237, 233, 254, 0.8))',
  Guides: 'linear-gradient(140deg, rgba(255, 243, 232, 0.85), rgba(254, 226, 226, 0.8))',
  Playbooks: 'linear-gradient(140deg, rgba(236, 252, 203, 0.85), rgba(221, 214, 254, 0.8))',
  FAQ: 'linear-gradient(140deg, rgba(229, 231, 235, 0.8), rgba(219, 234, 254, 0.85))',
  Other: 'linear-gradient(140deg, rgba(224, 231, 255, 0.8), rgba(240, 249, 255, 0.8))'
};

export const metadata: Metadata = { title: 'Resources' };

function difficultyBadge(diff?: string) {
  if (!diff) return null;
  const map: Record<string, string> = {
    foundation: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    intermediate: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    advanced: 'bg-rose-500/15 text-rose-500 border-rose-500/30'
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide ${
        map[diff] || 'bg-fg-muted/10 text-fg-muted border-border/60'
      }`}
    >
      {diff}
    </span>
  );
}

function formatUpdated(updated?: string) {
  if (!updated) return null;
  try {
    const dt = new Date(updated);
    const days = (Date.now() - dt.getTime()) / 86_400_000;
    const label = days <= 21 ? 'NEW' : undefined;
    const dateStr = dt.toISOString().split('T')[0];
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] text-fg-muted/60"
        title={`Updated ${dateStr}`}
      >
        {label && (
          <span className="text-accent font-medium tracking-tight">
            {label}
          </span>
        )}
        <span>{dateStr}</span>
      </span>
    );
  } catch {
    return null;
  }
}

export default function DocsIndex() {
  const docs = loadDocs();
  const grouped = docs.reduce<Record<string, typeof docs>>((acc, doc) => {
    (acc[doc.category || 'Other'] ||= []).push(doc);
    return acc;
  }, {});
  Object.values(grouped).forEach((arr) => arr.sort((a, b) => a.order - b.order));
  const categories = CATEGORY_ORDER.filter(
    (cat) => grouped[cat]?.length || cat === 'Playbooks'
  );

  const docMap = new Map(docs.map((doc) => [doc.slug, doc]));
  const featuredDocs = FEATURED_SLUGS.map((slug) => docMap.get(slug)).filter(
    Boolean
  ) as typeof docs;
  const fallbackDocs = docs.filter(
    (doc) => !featuredDocs.includes(doc)
  );
  while (featuredDocs.length < 3 && fallbackDocs.length) {
    featuredDocs.push(fallbackDocs.shift()!);
  }

  const now = Date.now();
  const thirtyDays = 30 * 86_400_000;
  const freshDocs = docs.filter(
    (doc) => doc.updated && now - new Date(doc.updated).getTime() <= thirtyDays
  ).length;
  const advancedCount = docs.filter((doc) => doc.difficulty === 'advanced').length;
  const foundationCount = docs.filter((doc) => doc.difficulty === 'foundation').length;

  const heroCards = [
    {
      eyebrow: 'Curated library',
      headline: `${docs.length}+ resources`,
      copy: 'Policies, templates, and explainer threads to accelerate every step.',
      icon: 'i-lucide-library',
      gradient: 'linear-gradient(140deg, #fef4ff 0%, #e9d6ff 100%)',
      span: 'sm:col-span-2'
    },
    {
      eyebrow: 'Always current',
      headline: `${freshDocs} updates this month`,
      copy: 'We publish refreshes every sprint so your references never go stale.',
      icon: 'i-lucide-refresh-cw',
      gradient: 'linear-gradient(140deg, #e6fbff 0%, #cdf4ff 100%)',
      span: ''
    },
    {
      eyebrow: 'Depth & runway',
      headline: `${advancedCount} advanced playbooks`,
      copy: 'Tackle production incidents, cost guardrails, and compliance drops.',
      icon: 'i-lucide-rocket',
      gradient: 'linear-gradient(140deg, #fff1e3 0%, #ffd7c7 100%)',
      span: ''
    }
  ];

  return (
    <div className="relative isolate overflow-hidden bg-[#fef6ff]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 24%, rgba(86,56,255,0.12), rgba(254,246,255,0)),' +
            'radial-gradient(circle at 82% 26%, rgba(0,170,135,0.12), rgba(254,246,255,0))'
        }}
        aria-hidden
      />
      <div className="relative space-y-24 pb-28">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: docs.map((doc, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${
                  process.env.NEXT_PUBLIC_SITE_URL || ''
                }/docs/${doc.slug}`,
                name: doc.title
              }))
            })
          }}
        />

        <section className="relative isolate overflow-hidden px-6 pb-20 pt-12 sm:px-10 lg:pt-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 6% 12%, rgba(255,118,192,0.28), rgba(254,246,255,0)),' +
                'radial-gradient(circle at 68% -10%, rgba(86,56,255,0.24), rgba(254,246,255,0)),' +
                'radial-gradient(circle at 92% 78%, rgba(0,170,135,0.22), rgba(254,246,255,0))'
            }}
          />
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[52px] border border-white/40 bg-white/40 p-8 shadow-[0_55px_140px_rgba(49,31,73,0.22)] backdrop-blur">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
              <div className="space-y-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#311f49]/90 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.34em] text-white shadow-[10px_10px_0_rgba(49,31,73,0.22)]">
                  Resource Library
                </span>
                <div className="space-y-4">
                  <h1 className="font-display text-4xl font-bold tracking-tight text-[#27163f] sm:text-5xl lg:text-6xl">
                    A colorful hub for shipping-ready enablement.
                  </h1>
                  <p className="max-w-2xl text-base leading-relaxed text-[#2f1f4b]/80 sm:text-lg">
                    Dive into research-backed explainers, IaC templates, and accelerator playbooks that move teams from idea to production. Search everything in one place, or follow the curated tracks designed for momentum.
                  </p>
                </div>
                <div className="rounded-[32px] border border-white/60 bg-white/70 p-5 shadow-[0_28px_70px_rgba(49,31,73,0.22)] backdrop-blur">
                  <DocsSearch
                    docs={docs.map((doc) => ({
                      slug: doc.slug,
                      title: doc.title,
                      description: doc.description,
                      category: doc.category
                    }))}
                  />
                  <p className="mt-3 text-[11px] uppercase tracking-[0.32em] text-[#3c285c]/70">
                    Try: &ldquo;IaC blueprints&rdquo;, &ldquo;Incident retro&rdquo;, &ldquo;Azure pipelines&rdquo;
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {HERO_CALLOUTS.map((callout) => (
                    <div
                      key={callout.label}
                      className="rounded-[28px] border border-white/50 bg-white/60 p-4 shadow-[0_18px_44px_rgba(49,31,73,0.16)] transition hover:-translate-y-1"
                      style={{
                        background: `linear-gradient(135deg, ${callout.tint}1f, rgba(255,255,255,0.82))`,
                        boxShadow: `0 18px 44px 0 ${callout.tint}25`
                      }}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#2d1c46]/70">
                        {callout.label}
                      </span>
                      <p className="mt-2 text-sm leading-relaxed text-[#2d1c46]/80">
                        {callout.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  {heroCards.map((card) => (
                    <div
                      key={card.eyebrow}
                      className={`relative flex flex-col gap-3 overflow-hidden rounded-[32px] border border-white/55 p-6 text-[#2d1c46] shadow-[0_28px_70px_rgba(49,31,73,0.2)] backdrop-blur ${card.span}`}
                      style={{ background: card.gradient }}
                    >
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#2d1c46]/75">
                        <span className={`${card.icon} text-lg`} />
                        {card.eyebrow}
                      </div>
                      <h3 className="font-display text-2xl font-semibold leading-tight">
                        {card.headline}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#2d1c46]/80">
                        {card.copy}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-[#2d1c46]/60">
                  {foundationCount} foundation-level primers keep new teammates focused and confident.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 sm:px-10">
          <div className="mb-10 flex flex-col items-center gap-4 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#311f49]/80 shadow-[6px_6px_0_rgba(49,31,73,0.14)]">
              Spotlight
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#241639] sm:text-4xl">
              Featured resources for rapid wins
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-[#2f1f4b]/80 sm:text-base">
              Stop guessing where to begin—start with our most actionable docs, hand-picked to give teams measurable lift in under a week.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {featuredDocs.map((doc, index) => {
              const updatedLabel = formatUpdated(doc.updated);
              return (
                <a
                  key={doc.slug}
                  href={`/docs/${doc.slug}`}
                  className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-[32px] border border-white/60 p-6 text-[#241639] shadow-[0_32px_85px_rgba(49,31,73,0.2)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_42px_110px_rgba(49,31,73,0.28)]"
                  style={{ background: FEATURED_CARD_GRADIENTS[index % FEATURED_CARD_GRADIENTS.length] }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
                    style={{ background: 'linear-gradient(140deg, rgba(255,255,255,0.4), rgba(255,255,255,0))' }}
                  />
                  <p className="relative inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#2d1c46]/75">
                    {CATEGORY_ICONS[doc.category || 'Other']} {doc.category}
                  </p>
                  <h3 className="relative font-display text-xl font-semibold leading-tight">
                    {doc.title}
                  </h3>
                  {doc.description && (
                    <p className="relative text-sm leading-relaxed text-[#2f1f4b]/80">
                      {doc.description}
                    </p>
                  )}
                  <div className="relative mt-auto flex items-center justify-between pt-4 text-[11px] text-[#2f1f4b]/70">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#311f49]" />
                      {doc.readingTime}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#311f49] transition group-hover:text-[#5638ff]">
                      Open
                      <span className="i-lucide-arrow-right" />
                    </span>
                  </div>
                  {updatedLabel && (
                    <div className="relative flex justify-end text-[10px] font-medium tracking-wide text-[#2f1f4b]/65">
                      {updatedLabel}
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-10 px-6 sm:px-10">
          <div
            className="rounded-[32px] border border-white/50 bg-white/65 p-6 shadow-[0_32px_85px_rgba(49,31,73,0.16)] backdrop-blur"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,244,255,0.85), rgba(230,248,255,0.85))'
            }}
          >
            <DocsFilters />
          </div>
          <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
            <DocsSidebar categories={categories} />
            <div className="space-y-20" id="docs-content">
              {categories.map((cat, idx) => (
                <div key={cat} className={idx === 0 ? '' : 'pt-4'}>
                  <CategorySection
                    category={cat}
                    count={grouped[cat]?.length || 0}
                    intro={CATEGORY_INTROS[cat]}
                    icon={CATEGORY_ICONS[cat]}
                  >
                    {grouped[cat]?.map((doc) => {
                      const cardGradient =
                        CATEGORY_GRADIENTS[doc.category || 'Other'] || CATEGORY_GRADIENTS.Other;
                      return (
                        <a
                          key={doc.slug}
                          aria-label={`Open ${doc.title} (${cat})`}
                          href={`/docs/${doc.slug}`}
                          className="group relative flex min-h-[170px] flex-col gap-4 overflow-hidden rounded-[28px] border border-white/55 bg-white/70 p-5 text-[#261942] shadow-[0_22px_55px_rgba(49,31,73,0.14)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_28px_72px_rgba(49,31,73,0.2)]"
                          data-difficulty={doc.difficulty}
                          data-category={doc.category}
                        >
                          <div
                            className="pointer-events-none absolute inset-0 opacity-[0.65] transition group-hover:opacity-100"
                            style={{ background: cardGradient }}
                          />
                          <div className="relative flex items-start justify-between gap-4">
                            <div className="flex flex-col gap-2">
                              <h3 className="font-semibold tracking-tight text-sm text-[#281742] transition group-hover:text-[#5638ff] sm:text-[15px]">
                                {doc.title}
                              </h3>
                              {doc.description && (
                                <p className="text-[12px] leading-relaxed text-[#2d1c46]/80 line-clamp-2">
                                  {doc.description}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1 text-[#2d1c46]/75">
                              {formatUpdated(doc.updated)}
                              {difficultyBadge(doc.difficulty)}
                            </div>
                          </div>
                          <div className="relative mt-auto flex items-center justify-between pt-1 text-[11px] text-[#2f1f4b]/75">
                            <span className="flex items-center gap-2">
                              <span className="i-lucide-file-text" />
                              {doc.readingTime}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[#311f49] transition group-hover:text-[#5638ff]">
                              Open
                              <span className="i-lucide-arrow-right text-[11px]" />
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </CategorySection>
                </div>
              ))}
              <TrendingDocs
                docs={docs.map((doc) => ({
                  slug: doc.slug,
                  title: doc.title
                }))}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 sm:px-10">
          <div
            className="overflow-hidden rounded-[40px] border border-white/55 bg-white/70 p-10 text-center shadow-[0_38px_110px_rgba(49,31,73,0.22)] backdrop-blur sm:text-left lg:p-12"
            style={{
              background:
                'linear-gradient(135deg, rgba(237,233,254,0.85) 0%, rgba(254,242,248,0.9) 60%, rgba(229,245,255,0.88) 100%)'
            }}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#311f49]/80 shadow-[6px_6px_0_rgba(49,31,73,0.16)]">
                  Stay in the momentum loop
                </span>
                <h2 className="font-display text-3xl font-bold tracking-tight text-[#261942] sm:text-4xl">
                  Ship smarter, not harder.
                </h2>
                <p className="text-sm leading-relaxed text-[#2d1c46]/80 sm:text-base">
                  Get roadmap updates, field-tested playbooks, and live workshop invites. One email a month—just the insights that keep your teams moving.
                </p>
              </div>
              <form className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:max-w-md">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 rounded-full border border-white/60 bg-white/80 px-4 py-3 text-sm text-[#2d1c46] placeholder:text-[#2d1c46]/50 focus:outline-none focus:ring-2 focus:ring-[#5638ff]/40"
                />
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-[#5638ff] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white shadow-[0_16px_36px_rgba(86,56,255,0.35)] transition hover:bg-[#452cd2]"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
