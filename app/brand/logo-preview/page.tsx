import AttachedLogo from '../../../components/brand/AttachedLogo';
import SignatureLogo from '../../../components/brand/SignatureLogo';
import BubbleBackground from '../../../components/brand/BubbleBackground';
import ProfessionalDeco from '../../../components/brand/ProfessionalDeco';

export default function LogoPreviewPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
  <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">Cloudegree Logo Preview</h1>
      <p className="mt-2 text-fg-muted">Compare logo concepts side-by-side. These do not replace the live header until you approve.</p>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 p-6 bg-bg-alt">
          <h2 className="text-sm font-semibold text-fg-muted">Attached Style (as provided)</h2>
          <div className="mt-6 flex flex-col gap-6">
            <AttachedLogo className="text-4xl" text="Cloudegree" />
            <AttachedLogo className="text-5xl" text="Cloudegree" />
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 p-6 bg-bg-alt">
          <h2 className="text-sm font-semibold text-fg-muted">Simplified Bubble Cluster Preview</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 items-center">
            <div className="h-44 rounded-lg bg-[#062a3a] p-4">
              <p className="text-xs text-fg-muted mb-2">Fewer accents</p>
              <BubbleBackground accentCount={3} />
            </div>
            <div className="h-44 rounded-lg bg-[#062a3a] p-4">
              <p className="text-xs text-fg-muted mb-2">More accents</p>
              <BubbleBackground accentCount={8} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 p-6 bg-bg-alt">
          <h2 className="text-sm font-semibold text-fg-muted">Professional Deco (New)</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 items-center">
            <div className="h-44 rounded-lg bg-[#062a3a] p-4 flex items-center justify-center">
              <div className="w-28 h-20">
                <p className="text-xs text-fg-muted mb-2">Subtle</p>
                <ProfessionalDeco variant="subtle" />
              </div>
            </div>
            <div className="h-44 rounded-lg bg-[#062a3a] p-4 flex items-center justify-center">
              <div className="w-28 h-20">
                <p className="text-xs text-fg-muted mb-2">Distinct</p>
                <ProfessionalDeco variant="distinct" />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 p-6 bg-bg-alt">
          <h2 className="text-sm font-semibold text-fg-muted">On Dark</h2>
          <div className="mt-6 rounded-lg bg-[#062a3a] p-6">
            <div className="flex flex-col gap-6">
              <AttachedLogo className="text-4xl" text="Cloudegree" />
              <AttachedLogo className="text-5xl" text="Cloudegree" />
            </div>
          </div>
        </div>
      </section>

      {/* SignatureLogo variants focusing on dot inside C placement */}
      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 p-6 bg-bg-alt">
          <h2 className="text-sm font-semibold text-fg-muted">Signature Logo (Dot above C + Underline)</h2>
          <div className="mt-6 flex flex-col gap-6">
            <SignatureLogo className="text-4xl" showDotAboveC cloudPosition="none" />
            <SignatureLogo className="text-5xl" showDotAboveC cloudPosition="none" />
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 p-6 bg-bg-alt">
          <h2 className="text-sm font-semibold text-fg-muted">On Dark</h2>
          <div className="mt-6 rounded-lg bg-[#062a3a] p-6">
            <div className="flex flex-col gap-6">
              <SignatureLogo className="text-4xl" showDotAboveC cloudPosition="none" />
              <SignatureLogo className="text-5xl" showDotAboveC cloudPosition="none" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 p-6 bg-bg-alt">
          <h2 className="text-sm font-semibold text-fg-muted">Dot above C + Integrated Cloud</h2>
          <div className="mt-6 flex flex-col gap-6">
            <SignatureLogo className="text-4xl" showDotAboveC cloudPosition="integratedC" />
            <SignatureLogo className="text-5xl" showDotAboveC cloudPosition="integratedC" />
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 p-6 bg-bg-alt">
          <h2 className="text-sm font-semibold text-fg-muted">No Underline</h2>
          <div className="mt-6 flex flex-col gap-6">
            <SignatureLogo className="text-4xl" showDotAboveC cloudPosition="none" showUnderline={false} />
            <SignatureLogo className="text-5xl" showDotAboveC cloudPosition="none" showUnderline={false} />
          </div>
        </div>
      </section>
    </main>
  );
}

// Old concept sections removed to show only the unified professional design
