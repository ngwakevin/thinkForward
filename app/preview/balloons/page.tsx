"use client";
import React from "react";
import BalloonFloaters from "../../../components/illustrations/BalloonFloaters";

export default function BalloonsPreviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-bg to-bg-alt text-fg">
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Balloon Floaters Preview</h1>
          <p className="text-sm text-fg-muted mt-1">A playful floating scene matching your attachment’s vibe; subtle motion with token colors.</p>
        </header>
        <section className="rounded-xl border border-border/60 bg-bg p-6 corner-notches shadow-sm">
          <BalloonFloaters />
        </section>
      </div>
    </main>
  );
}
