import ProfessionalDeco from '../../../components/brand/ProfessionalDeco';
import AttachedLogo from '../../../components/brand/AttachedLogo';

export const metadata = {
  title: 'Cloudegree — Subtle Deco Preview',
};

export default function SubtlePreviewPage() {
  return (
    <main className="min-h-screen bg-bg p-6">
      <header className="mx-auto max-w-6xl py-24 flex flex-col items-center text-center">
        <div className="flex items-center justify-center">
          {/* Large wordmark for hero preview */}
          <AttachedLogo className="text-6xl md:text-7xl leading-none font-semibold" text="Cloudegree" />
        </div>
        <div className="mt-6 text-warning tracking-widest uppercase font-semibold text-sm md:text-base">Cloud Training &middot; Mentoring</div>
      </header>

      <section className="mx-auto max-w-5xl bg-bg-alt rounded-2xl p-8 mt-8">
        <h1 className="text-3xl font-bold">Subtle Deco Preview</h1>
  <p className="mt-4 text-fg-muted">This page demonstrates the selected &quot;Subtle&quot; decoration applied to a header for review. It does not replace the live header.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border/60 p-6">
            <h3 className="font-semibold">How it looks (small)</h3>
            <div className="mt-4 flex items-center gap-4">
              <div className="w-12 h-12">
                <ProfessionalDeco variant="subtle" />
              </div>
              <div className="text-lg font-medium">Cloudegree</div>
            </div>
          </div>

          <div className="rounded-lg border border-border/60 p-6">
            <h3 className="font-semibold">How it looks (brand lockup)</h3>
            <div className="mt-4 flex items-center gap-6">
              <div className="w-16 h-16">
                <ProfessionalDeco variant="subtle" />
              </div>
              <div>
                <div className="text-2xl font-semibold">Cloudegree</div>
                <div className="text-fg-muted text-sm">Learning & Career Programs</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
