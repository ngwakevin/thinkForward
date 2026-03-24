import { CameroonFlyer } from '../../../components/cameroon/CameroonFlyer';
import { CameroonPoster } from '../../../components/cameroon/CameroonPoster';

export const metadata = {
  title: 'Cameroon Go Live — Campaign Flyer & Poster',
  description: 'Download the Cloudegree Cameroon Go Live campaign flyer and poster. Print-ready designs with brand colors for advertising.',
};

export default function FlyerPage() {
  return (
    <div className="min-h-screen py-16">
      {/* Page Header — hidden in print */}
      <div className="print:hidden mx-auto max-w-3xl px-6 text-center mb-12 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Campaign Materials</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Cameroon Go Live — Flyer &amp; Poster</h1>
        <p className="text-fg-muted">Preview the flyer and poster below. Click the download button to save as PDF using your browser&apos;s print dialog.</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="#flyer" className="text-accent hover:text-accent-alt transition">↓ Flyer (A5)</a>
          <a href="#poster" className="text-accent hover:text-accent-alt transition">↓ Poster (A2)</a>
          <a href="/cameroon" className="text-fg-muted hover:text-fg transition">← Back to Cameroon</a>
        </div>
      </div>

      {/* ─── FLYER SECTION ─── */}
      <section id="flyer" className="mb-24">
        <h2 className="print:hidden text-center text-xl font-display font-semibold mb-2">Campaign Flyer <span className="text-fg-muted font-normal text-sm">(A5 / Digital)</span></h2>
        <p className="print:hidden text-center text-xs text-fg-muted mb-6">Ideal for handouts, WhatsApp sharing, social media posts, and email campaigns.</p>
        <CameroonFlyer />
      </section>

      {/* ─── POSTER SECTION ─── */}
      <section id="poster" className="mb-24">
        <h2 className="print:hidden text-center text-xl font-display font-semibold mb-2">Big Poster <span className="text-fg-muted font-normal text-sm">(A2 / A1)</span></h2>
        <p className="print:hidden text-center text-xs text-fg-muted mb-6">Large format poster for wall displays, events, billboards, and physical advertising.</p>
        <CameroonPoster />
      </section>

      {/* Tips — hidden in print */}
      <div className="print:hidden mx-auto max-w-3xl px-6 space-y-6">
        <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8">
          <h3 className="font-display text-lg font-semibold mb-4">📋 Download &amp; Print Tips</h3>
          <ul className="space-y-2 text-sm text-fg-muted">
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> Click &quot;Download as PDF&quot; and select &quot;Save as PDF&quot; in the print dialog</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> For the flyer, select A5 paper size (148 × 210mm)</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> For the poster, select A2 (420 × 594mm) or A1 (594 × 841mm) paper size</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> Enable &quot;Background graphics&quot; in print settings for full color output</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" /> Set margins to &quot;None&quot; for full-bleed printing</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8">
          <h3 className="font-display text-lg font-semibold mb-4">📐 Recommended Export Sizes</h3>
          <div className="grid gap-3 md:grid-cols-2 text-sm text-fg-muted">
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-warning" /> Instagram Post: 1080 × 1080px</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-warning" /> Instagram Story / WhatsApp: 1080 × 1920px</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-warning" /> Facebook Event Cover: 1920 × 1005px</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-warning" /> A5 Flyer (Print): 148 × 210mm at 300dpi</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-warning" /> A2 Poster (Print): 420 × 594mm at 300dpi</div>
            <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-warning" /> A1 Poster (Print): 594 × 841mm at 300dpi</div>
          </div>
        </div>

        <div className="text-center">
          <a href="/cameroon" className="text-sm text-accent hover:text-accent-alt transition">← Back to Cameroon Landing Page</a>
        </div>
      </div>
    </div>
  );
}
