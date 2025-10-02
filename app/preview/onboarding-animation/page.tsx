import React from "react";
import dynamic from "next/dynamic";

// Lottie JSON would usually be imported (e.g., import animation from '../../../public/animations/onboarding.json')
// We'll pass no src to demonstrate the static fallback, and leave a commented example for wiring.
const OnboardingAnimation = dynamic(() => import("../../../components/sections/OnboardingAnimation"), { ssr: false });

export const metadata = {
  title: "Preview – Onboarding Animation",
  description: "10–15s loop: Sign up → Pick course → Learn → Achieve. Plays on view, once by default.",
};

export default function Page() {
  // Example if you had the JSON:
  // const animationData = require("@/public/animations/onboarding.json");
  return (
    <main className="min-h-screen bg-bg text-fg">
      <div className="pt-10 pb-6 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-base font-semibold tracking-wide text-accent">Preview</h1>
          <p className="mt-1 text-2xl font-medium">Onboarding Animation</p>
          <p className="mt-2 text-sm text-fg-muted">Plays when in view, once by default (loop=false). Static fallback if reduced-motion or missing JSON.</p>
        </div>
      </div>

      <div className="h-[30vh] grid place-items-center text-fg-muted">
        <p>Scroll down…</p>
      </div>

      {/* Without src to show fallback; replace with src={animationData} or src="/animations/onboarding.json" */}
      <OnboardingAnimation height={360} loop={false} />

      <div className="h-[40vh]" />
    </main>
  );
}
