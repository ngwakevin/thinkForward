export const metadata = { title: 'Bootcamp Registration' };

export default function RegisterPage({ searchParams }: { searchParams: { track?: string } }) {
  const track = searchParams?.track || '';
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 space-y-12">
      <header className="space-y-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Register for a Bootcamp</h1>
        {track && <p className="text-sm text-fg-muted">Selected Track: <span className="font-medium text-fg">{track}</span></p>}
        <p className="text-fg-muted text-base leading-relaxed max-w-prose">Fill out the form below to express interest. We will review your submission and follow up with next steps, cohort availability, and preparation resources.</p>
      </header>
      <form className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Full Name</label>
            <input required name="name" className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Email Address</label>
            <input required type="email" name="email" className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Phone Number</label>
            <input name="phone" className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="+1 555 123 4567" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Preferred Cloud Provider</label>
            <select name="provider" className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="">Select one</option>
              <option value="azure">Microsoft Azure</option>
              <option value="aws">Amazon Web Services (AWS)</option>
              <option value="gcp">Google Cloud</option>
              <option value="multi">Multi-Cloud / No Preference</option>
            </select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Currently in IT Industry?</label>
            <select name="in_it" className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted">If Yes, Current Role / Focus</label>
            <input name="current_role" className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="e.g. Support Engineer, SysAdmin" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Years of Experience</label>
            <select name="experience" className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="">Select</option>
              <option value="0-1">0-1</option>
              <option value="1-3">1-3</option>
              <option value="3-5">3-5</option>
              <option value="5+">5+</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Primary Goal</label>
            <select name="goal" className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30">
              <option value="">Select</option>
              <option value="career-change">Career Change</option>
              <option value="skill-upgrade">Skill Upgrade</option>
              <option value="certification">Certification Prep</option>
              <option value="promotion">Promotion</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Describe Your Current Cloud / DevOps Exposure</label>
            <textarea name="exposure" rows={4} className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Briefly describe tools, platforms, or scenarios you've worked with." />
        </div>
        <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-fg-muted">Anything Else We Should Know?</label>
            <textarea name="notes" rows={3} className="w-full rounded-lg border border-border/60 bg-bg-alt/60 px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30" placeholder="Scheduling constraints, certification targets, learning preferences, etc." />
        </div>
        <input type="hidden" name="track" value={track} />
        <div className="flex items-center gap-4 pt-4">
          <button type="submit" className="inline-flex items-center rounded-md bg-accent px-6 py-2.5 text-sm font-semibold tracking-wide text-white shadow hover:bg-accent-alt focus:outline-none focus:ring-2 focus:ring-accent/40">Submit Registration</button>
          <a href="/bootcamps" className="text-xs font-medium text-fg-muted hover:text-fg transition">Back to Bootcamps</a>
        </div>
      </form>
    </div>
  );
}
