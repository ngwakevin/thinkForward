import { notFound } from 'next/navigation';
import { getSyllabusBySlug } from '../../../data/syllabi';

export default function SyllabusPage({ params }: { params: { slug: string } }) {
  const syllabus = getSyllabusBySlug(params.slug);
  if (!syllabus) return notFound();
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-12">
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-accent to-accent-alt bg-clip-text text-transparent">{syllabus.title}</h1>
        <p className="mt-4 text-lg text-fg-muted max-w-3xl">{syllabus.summary}</p>
        {syllabus.status === 'coming-soon' && <p className="mt-4 inline-block rounded-md border border-border/60 bg-bg-alt/60 px-3 py-1 text-xs uppercase tracking-wide text-fg-muted">Details coming soon</p>}
      </div>

      {syllabus.responsibilities && (
        <section className="mb-14">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Role Responsibilities</h2>
          <ul className="space-y-2 text-sm text-fg-muted">
            {syllabus.responsibilities.map(r => <li key={r} className="flex gap-2"><span className="text-accent">•</span><span>{r}</span></li>)}
          </ul>
        </section>
      )}

      {syllabus.preModules && syllabus.preModules.length > 0 && (
        <SectionBlocks title="Foundational Preparation Modules" blocks={syllabus.preModules} />
      )}

      {syllabus.learningModules && syllabus.learningModules.length > 0 && (
        <SectionBlocks title="Learning Modules" blocks={syllabus.learningModules} />
      )}

      {syllabus.domains && syllabus.domains.length > 0 && (
        <SectionBlocks title="Exam Blueprint" blocks={syllabus.domains} />
      )}

      {(syllabus.audience || syllabus.experience) && (
        <section className="mb-20">
          <div className="grid gap-10 md:grid-cols-2">
            {syllabus.audience && syllabus.audience.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold tracking-tight mb-4">Audience</h2>
                <ul className="space-y-2 text-sm text-fg-muted">
                  {syllabus.audience.map(a => <li key={a} className="flex gap-2"><span className="text-accent">•</span><span>{a}</span></li>)}
                </ul>
              </div>
            )}
            {syllabus.experience && syllabus.experience.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold tracking-tight mb-4">Experience & Prerequisites</h2>
                <ul className="space-y-2 text-sm text-fg-muted">
                  {syllabus.experience.map(e => <li key={e} className="flex gap-2"><span className="text-accent">•</span><span>{e}</span></li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {syllabus.certificationsAwarded && syllabus.certificationsAwarded.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-semibold tracking-tight mb-4">Certification Outcome</h2>
          <ul className="space-y-2 text-sm text-fg-muted">
            {syllabus.certificationsAwarded.map(c => <li key={c} className="flex gap-2"><span className="text-accent">•</span><span>{c}</span></li>)}
          </ul>
        </section>
      )}

      <div className="pt-10 border-t border-border/60 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <a href="/contact" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-medium text-white shadow-md hover:bg-accent-alt transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">Start Track</a>
        <a href="/products" className="text-sm text-fg-muted hover:text-accent transition">Back to all tracks →</a>
      </div>
    </div>
  );
}

function SectionBlocks({ title, blocks }: { title: string; blocks: any[] }) {
  return (
    <section className="mb-16">
      <h2 className="text-xl font-semibold tracking-tight mb-6">{title}</h2>
      <div className="space-y-10">
        {blocks.map(d => (
          <div key={d.name} className="rounded-2xl border border-border/60 bg-bg-alt/40 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-5">
              <h3 className="font-semibold tracking-tight text-fg">{d.name}</h3>
              {d.weight && <span className="text-xs rounded-md bg-accent/10 text-accent px-2 py-1 font-medium">{d.weight}</span>}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {d.sections.map((s: any) => (
                <div key={s.heading} className="space-y-2">
                  <h4 className="font-medium text-sm text-fg/90">{s.heading}</h4>
                  <ul className="space-y-1 text-[13px] text-fg-muted">
                    {s.items.map((i: string) => <li key={i} className="flex gap-1"><span className="text-accent">•</span><span>{i}</span></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
