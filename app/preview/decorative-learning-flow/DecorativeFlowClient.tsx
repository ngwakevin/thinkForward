"use client";
import React, { useEffect } from "react";
import Script from "next/script";

export default function DecorativeFlowClient() {
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mql.matches;
    // If GSAP is loaded and user doesn't prefer reduced motion, animate
    const tryAnimate = () => {
      const gsap = (window as any).gsap;
      if (!gsap || reduced) return;
      gsap.utils.toArray(".arrow").forEach((arrow: any, i: any) => {
        gsap.fromTo(
          arrow,
          { strokeDashoffset: 200 },
          { strokeDashoffset: 0, duration: 1, delay: i * 0.8, ease: "power2.out" }
        );
      });

      gsap.fromTo(
        ".icon-bg",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, transformOrigin: "center", duration: 0.6, stagger: 0.5, ease: "back.out(1.7)" }
      );

      gsap.from(".card", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.4,
        ease: "power2.out",
      });
    };

    // Run after script is loaded
    const onReady = () => tryAnimate();
    window.addEventListener("gsap-ready", onReady);
    // If the script was already loaded, run once
    setTimeout(tryAnimate, 0);
    return () => window.removeEventListener("gsap-ready", onReady);
  }, []);

  return (
    <div className="min-h-screen w-full grid place-items-center px-4" style={{ background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" }}>
      {/* Load GSAP from CDN in a safe way */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Signal that gsap is ready
          window.dispatchEvent(new Event("gsap-ready"));
        }}
      />

      <style jsx>{`
        .flow-container { width: 900px; max-width: 95%; }
        svg { width: 100%; height: auto; }
        .card { fill: rgba(255,255,255,0.06); stroke: rgba(255,255,255,0.2); stroke-width: 1; rx: 20; ry: 20; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25)); cursor: pointer; transition: transform 0.3s ease; }
        .card:hover { filter: drop-shadow(0 8px 20px rgba(58,230,139,0.4)); }
  .icon-bg { fill: url(#grad); stroke: none; opacity: 1; }
        text { font-size: 16px; fill: #ffffff; font-weight: 500; pointer-events: none; font-family: ui-sans-serif, system-ui, -apple-system; }
  .arrow { stroke: #3ae68b; stroke-width: 3; fill: none; stroke-dasharray: 200; stroke-dashoffset: 0; }
      `}</style>

      <div className="flow-container">
        <svg viewBox="0 0 900 300" role="img" aria-label="Decorative learning flow">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "var(--color-accent, #3ae68b)", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "var(--color-accent-alt, #00c6ff)", stopOpacity: 1 }} />
            </linearGradient>
            {/* Small arrowhead marker */}
            <marker id="smallArrowHead" orient="auto" markerWidth="8" markerHeight="8" refX="6" refY="4">
              <path d="M0,0 L0,8 L7,4 z" fill="#3ae68b" />
            </marker>
          </defs>

          {/* Step 1 */}
          <rect className="card" x="50" y="80" width="180" height="140" />
          <circle className="icon-bg" cx="140" cy="120" r="25" />
          <text x="140" y="180" textAnchor="middle">Sign up</text>

          {/* Arrow 1 */}
          <path className="arrow" d="M230,150 H320" markerEnd="url(#smallArrowHead)" />

          {/* Step 2 */}
          <rect className="card" x="340" y="80" width="180" height="140" />
          <circle className="icon-bg" cx="430" cy="120" r="25" />
          <text x="430" y="180" textAnchor="middle">Pick course</text>

          {/* Arrow 2 */}
          <path className="arrow" d="M520,150 H610" markerEnd="url(#smallArrowHead)" />

          {/* Step 3 */}
          <rect className="card" x="630" y="80" width="180" height="140" />
          <circle className="icon-bg" cx="720" cy="120" r="25" />
          <text x="720" y="180" textAnchor="middle">Learn</text>

          {/* Arrow 3 */}
          <path className="arrow" d="M810,150 h40 v-40" markerEnd="url(#smallArrowHead)" />

          {/* Step 4 */}
          <rect className="card" x="750" y="20" width="120" height="60" />
          <circle className="icon-bg" cx="810" cy="50" r="18" />
          <text x="810" y="80" textAnchor="middle">Achieve</text>
        </svg>
      </div>
    </div>
  );
}
