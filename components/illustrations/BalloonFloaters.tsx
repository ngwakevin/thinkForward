"use client";
import React from "react";

/*
 BalloonFloaters
 ----------------
 A playful, token-colored illustration inspired by the attachment:
 - Groups of people gently floating while holding balloons
 - Small confetti specs
 - Subtle independent float animations with delays
 - Honors prefers-reduced-motion via global utility classes

 Implementation notes:
 - Kept shapes minimal (circles/rects/paths) to fit the site’s line style
 - Uses CSS variables: var(--color-accent), var(--color-accent-alt), var(--color-accent-soft), var(--color-danger), var(--color-fg)
*/

export function BalloonFloaters({ className }: { className?: string }) {
  return (
    <div className={("relative w-full max-w-[720px] mx-auto select-none " + (className ?? "")).trim()}>
      {/* Rounded canvas */}
      <div className="relative rounded-2xl border border-border/60 bg-gradient-to-b from-accent-soft/50 to-bg/40 shadow-sm overflow-hidden">
        {/* Confetti dots (twinkle) */}
        <div aria-hidden className="absolute inset-0">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-fg/50 animate-twinkle-slow"
              style={{
                left: `${(i * 53) % 680 + 12}px`,
                top: `${(i * 29) % 340 + 12}px`,
                animationDelay: `${(i % 6) * 180}ms`,
              }}
            />
          ))}
        </div>

        {/* Scene SVG */}
        <svg viewBox="0 0 720 420" className="block w-full h-auto text-fg">
          <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {/* LEFT: Parent holding child, single balloon */}
            <g className="animate-float-slow" style={{ transformOrigin: "120px 200px" as any }}>
              {/* balloon */}
              <circle cx="120" cy="70" r="28" fill="var(--color-accent-soft)" stroke="var(--color-accent-alt)" />
              <path d="M120 98 V150" stroke="currentColor" />
              {/* parent */}
              <circle cx="90" cy="190" r="16" fill="var(--color-accent-soft)" />
              <rect x="70" y="206" width="40" height="46" rx="10" fill="var(--color-bg-alt)" />
              <path d="M70 218 H40" />
              <path d="M110 218 H140" />
              <path d="M84 252 V292" />
              <path d="M96 252 V292" />
              {/* child */}
              <circle cx="128" cy="212" r="12" fill="var(--color-accent-soft)" />
              <rect x="118" y="224" width="20" height="26" rx="6" fill="var(--color-danger)" opacity="0.12" stroke="var(--color-danger)" />
            </g>

            {/* CENTER-TOP: Striped kid with balloon */}
            <g className="animate-float-slower" style={{ transformOrigin: "350px 160px" as any }}>
              <circle cx="350" cy="60" r="24" fill="var(--color-accent-soft)" stroke="var(--color-accent)" />
              <path d="M350 84 V138" />
              <circle cx="330" cy="170" r="12" fill="var(--color-accent-soft)" />
              <rect x="318" y="182" width="24" height="28" rx="7" fill="var(--color-bg-alt)" />
              <path d="M318 192 H292" />
              <path d="M342 192 H366" />
              <path d="M324 210 V232" />
              <path d="M336 210 V232" />
              {/* shorts */}
              <rect x="316" y="210" width="28" height="14" rx="3" fill="var(--color-danger)" opacity="0.2" stroke="var(--color-danger)" />
            </g>

            {/* CENTER-RIGHT: Couple with multi balloons */}
            <g className="animate-float-slow" style={{ transformOrigin: "520px 210px", animationDelay: "250ms" as any }}>
              {/* balloons cluster */}
              <circle cx="520" cy="70" r="28" fill="var(--color-accent-soft)" stroke="var(--color-accent-alt)" />
              <circle cx="552" cy="84" r="26" fill="var(--color-bg)" stroke="currentColor" />
              <circle cx="492" cy="88" r="24" fill="var(--color-danger)" opacity="0.2" stroke="var(--color-danger)" />
              <path d="M520 98 V148 M552 110 V152 M492 112 V154" />
              {/* green heart balloon overlay */}
              <path d="M574 80c0-8 6-14 14-14 6 0 10 4 12 7 2-3 6-7 12-7 8 0 14 6 14 14 0 16-26 26-26 26s-26-10-26-26Z" fill="var(--color-accent)" stroke="currentColor" />
              <path d="M586 106 V154" />
              {/* couple */}
              {/* person 1 */}
              <circle cx="500" cy="190" r="14" fill="var(--color-accent-soft)" />
              <rect x="486" y="202" width="28" height="38" rx="9" fill="var(--color-bg-alt)" />
              <path d="M486 212 H466" />
              <path d="M514 212 H534" />
              <path d="M494 240 V280" />
              <path d="M506 240 V280" />
              {/* person 2 (red coat) */}
              <circle cx="540" cy="200" r="13" fill="var(--color-accent-soft)" />
              <rect x="526" y="212" width="28" height="58" rx="12" fill="var(--color-danger)" opacity="0.18" stroke="var(--color-danger)" />
            </g>

            {/* FAR-RIGHT: Kid with heart balloon */}
            <g className="animate-float-slowest" style={{ transformOrigin: "660px 190px", animationDelay: "120ms" as any }}>
              {/* heart */}
              <path d="M664 66c0-9 7-16 16-16 6 0 11 4 14 8 3-4 8-8 14-8 9 0 16 7 16 16 0 19-30 31-30 31s-30-12-30-31Z" fill="var(--color-accent)" stroke="currentColor" />
              <path d="M678 98 V144" />
              {/* kid */}
              <circle cx="660" cy="170" r="11" fill="var(--color-accent-soft)" />
              <rect x="650" y="182" width="22" height="26" rx="6" fill="var(--color-danger)" opacity="0.2" stroke="var(--color-danger)" />
              <path d="M650 190 H634" />
              <path d="M672 190 H688" />
              <path d="M654 208 V232" />
              <path d="M666 208 V232" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default BalloonFloaters;
