'use client';

import { testimonials } from '../../../data/solutions';

export function BottomSplitPreview() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const prefill =
    process.env.NEXT_PUBLIC_WHATSAPP_PREFILL || 'Hi – I would like to learn more about CloudAcers.';
  const waHref = number ? `https://wa.me/${number}?text=${encodeURIComponent(prefill)}` : '/contact';

  const customFirst =
    'A clear roadmap and quick feedback turned a year of wandering into just a few months of real progress. Thank you, CloudAcers team!';
  const customSecond =
    'Just one session was all I needed to focus on what truly matters and get a perfect roadmap. Thank you, CloudAcers team!';

  return (
    <section className="relative isolate overflow-hidden bg-[#fff5fa] py-24 text-[#2b1e40]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 18% 16%, rgba(255,117,76,0.15), rgba(255,245,250,0)),' +
            'radial-gradient(circle at 80% 28%, rgba(86,56,255,0.14), rgba(255,245,250,0))',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex h-full flex-col gap-6 rounded-[48px] bg-white px-8 py-10 shadow-[12px_12px_0_0_rgba(43,30,64,0.12)]">
            <span className="inline-flex items-center gap-2 rounded-[28px] bg-[#5638ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[6px_6px_0_0_rgba(43,30,64,0.12)]">
              Chat with us
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight">
              Need clarity? Get answers instantly.
            </h2>
            <p className="text-sm leading-relaxed text-[#2b1e40]/75">
              Schedule time or drop a note—no pressure, just a fast breakdown of how we can tailor the
              playful block system to your goals.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#2f441c] bg-[#2f441c] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-[#2f441c]"
              >
                WhatsApp
                <span className="i-lucide-arrow-up-right text-base" />
              </a>
              <a
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#2f441c] px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#2f441c] transition hover:bg-[#e8e7ff]"
              >
                Contact form
                <span className="i-lucide-arrow-right text-base" />
              </a>
            </div>

            <div className="rounded-[40px] bg-[#ffeae1] px-6 py-5 text-sm text-[#2b1e40]/75 shadow-[8px_8px_0_0_rgba(43,30,64,0.12)]">
              <p className="font-semibold uppercase tracking-[0.3em] text-[#2b1e40]/60">Mini strategy session</p>
              <p className="mt-2">
                Get a 20-minute run-through of your current evidence and the next playful blocks to add.
              </p>
            </div>
          </div>

          <div className="flex h-full flex-col gap-6 rounded-[48px] bg-white px-8 py-10 shadow-[12px_12px_0_0_rgba(43,30,64,0.12)]">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-2 rounded-[28px] bg-[#2f441c] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-[6px_6px_0_0_rgba(43,30,64,0.12)]">
                  Results
                </span>
                <h3 className="mt-4 text-2xl font-semibold text-[#2b1e40]">Proof from playful structure.</h3>
              </div>
              <a
                href="/solutions"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#2f441c]"
              >
                See more
                <span className="i-lucide-arrow-right text-sm" />
              </a>
            </div>

            <div className="grid gap-5">
              {testimonials.slice(0, 2).map((t, index) => (
                <div
                  key={t.name}
                  className="rounded-[36px] bg-[#f5f1ff] px-6 py-6 text-sm leading-relaxed text-[#2b1e40]/75 shadow-[8px_8px_0_0_rgba(43,30,64,0.12)]"
                >
                  <p className="text-[#2b1e40]">
                    &ldquo;{index === 0 ? customFirst : customSecond}&rdquo;
                  </p>
                  <div className="mt-4 text-xs text-[#2b1e40]/60">
                    <p className="font-semibold text-[#2b1e40]/75">{t.name}</p>
                    <p>{t.role}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#2b1e40]/60">
              Explore more wins inside the{' '}
              <a href="/solutions" className="font-semibold text-[#2f441c]">
                Solutions
              </a>{' '}
              hub.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
