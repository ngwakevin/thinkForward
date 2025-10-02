"use client";
import React from "react";
import { AnimatedLearningTriptych } from "../../../components/illustrations/LearningScenes";

export default function AnimationPreviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-bg to-bg-alt/60 text-fg">
      <div className="mx-auto max-w-5xl px-6 pt-10 pb-24">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Animated Triptych Preview</h1>
          <p className="text-sm text-fg-muted mt-1">Subtle motion matching the reference layout: morphing blobs, gentle floats, and small pulse accents. Respects reduced-motion settings.</p>
        </header>
        <section className="rounded-xl border border-border/60 bg-bg p-6 corner-notches shadow-sm">
          <AnimatedLearningTriptych />
        </section>
      </div>
    </main>
  );
}
