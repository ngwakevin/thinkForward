import React from "react";
import HeroFirstImpression from "../../../components/sections/HeroFirstImpression";

export const metadata = {
  title: "Preview – First Impression Hero",
  description: "Animated gradient background with floating icons and synced headline fade-in.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-bg text-fg">
      <div className="pt-10 pb-6 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-base font-semibold tracking-wide text-accent">Preview</h1>
          <p className="mt-1 text-2xl font-medium">First Impression Hero</p>
          <p className="mt-2 text-sm text-fg-muted">This route showcases the gradient background + floating icons concept. Motion respects reduced motion preferences.</p>
        </div>
      </div>
      <HeroFirstImpression />
    </main>
  );
}
