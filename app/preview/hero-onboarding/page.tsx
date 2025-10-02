import React from "react";
import dynamic from "next/dynamic";
import { Hero } from "../../../components/sections/Hero";

const OnboardingClip = dynamic(() => import("../../../components/sections/OnboardingClip"), { ssr: false });

export const metadata = {
  title: "Preview – Hero with Onboarding",
  description: "Home hero with compact onboarding animation opposite the text.",
};

export default function Page() {
  // Replace with your JSON path or import when ready
  const lottieSrc = undefined; // e.g., "/animations/onboarding.json"

  return (
    <main className="min-h-screen bg-bg text-fg">
      <div className="pt-10 pb-6 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-base font-semibold tracking-wide text-accent">Preview</h1>
          <p className="mt-1 text-2xl font-medium">Hero + Onboarding (Right)</p>
          <p className="mt-2 text-sm text-fg-muted">Mirrors the homepage hero; the right column shows the onboarding clip. Scroll a bit to trigger playback.</p>
        </div>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-bg to-bg-alt py-16">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Left: same hero copy */}
            <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight bg-gradient-to-r from-accent to-accent-alt text-transparent bg-clip-text">Train. Build. Elevate.</h2>
              <p className="mt-6 text-lg text-fg-muted">Accelerate practical cloud & DevOps mastery with deliberate learning paths, hands‑on labs, and mentor feedback loops.</p>
              <div className="mt-8 flex flex-col sm:flex-row sm:justify-start items-center gap-4 lg:justify-start">
                <a href="/products" className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-medium text-white shadow-md hover:bg-accent-alt transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">Get Started</a>
                <a href="/roadmaps" className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 font-medium text-fg hover:border-accent hover:text-accent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60">View Roadmaps</a>
              </div>
              <p className="mt-4 text-[11px] text-fg-muted uppercase tracking-[0.2em]">No spam • Cancel anytime</p>
            </div>

            {/* Right: onboarding clip */}
            <div className="relative pl-4 pr-2 md:pl-8 w-full max-w-[880px] xl:max-w-[960px] ml-auto">
              <OnboardingClip src={lottieSrc} layout="radial" glowIntensity="strong" height={520} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
