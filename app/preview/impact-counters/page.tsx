import React from "react";
import ImpactCounters from "../../../components/sections/ImpactCounters";

export const metadata = {
  title: "Preview – Impact Counters",
  description: "Scroll-triggered count-up stats with subtle icon fade-ins.",
};

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M20 22H6.5A2.5 2.5 0 0 1 4 19.5V6A2 2 0 0 1 6 4h14z"/>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      <div className="pt-10 pb-6 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-base font-semibold tracking-wide text-accent">Preview</h1>
          <p className="mt-1 text-2xl font-medium">Impact Counters</p>
          <p className="mt-2 text-sm text-fg-muted">Scroll to the section to trigger the count-up animations. Prefers-reduced-motion renders final values without animation.</p>
        </div>
      </div>

      <div className="h-[60vh] grid place-items-center text-fg-muted">
        <p>Scroll down to see counters…</p>
      </div>

      <ImpactCounters
        title="Our impact in numbers"
        subtitle="Signals of trust and outcomes we care about"
        stats={[
          { label: "Learners", value: 50000, suffix: "+", icon: <IconUsers/> },
          { label: "Courses & Labs", value: 200, suffix: "+", icon: <IconBook/> },
          { label: "Completion rate", value: 95, suffix: "%", icon: <IconCheck/>, durationMs: 1400 },
          { label: "Countries", value: 35, suffix: "+", icon: <IconGlobe/> },
        ]}
      />

      <div className="h-[40vh]" />
    </main>
  );
}
