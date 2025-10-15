export const metadata = { title: 'Bootcamp Registration' };

import { RegisterFormClient } from './RegisterFormClient';

export default function RegisterPage({ searchParams }: { searchParams: { track?: string } }) {
  const track = searchParams?.track || '';
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 space-y-12">
      <header className="space-y-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Register for a Bootcamp</h1>
        {track && <p className="text-sm text-fg-muted">Selected Track: <span className="font-medium text-fg">{track}</span></p>}
        <p className="text-fg-muted text-base leading-relaxed max-w-prose">Fill out the form below to express interest. We will review your submission and follow up with next steps, cohort availability, and preparation resources.</p>
      </header>
      <RegisterFormClient track={track} />
    </div>
  );
}
