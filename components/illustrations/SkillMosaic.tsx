"use client";
import React from "react";

function hexPath(cx: number, cy: number, r: number) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  return `M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ")} Z`;
}

export function SkillMosaic() {
  // Build a small staggered hex grid
  const r = 16;
  const rows = 6;
  const cols = 10;
  const hStep = r * 1.75; // horizontal spacing
  const vStep = r * 1.52; // vertical spacing
  const startX = 120;
  const startY = 60;

  const tiles: { x: number; y: number; key: string }[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const offsetX = (row % 2 === 0 ? 0 : hStep * 0.5);
      const x = startX + col * hStep + offsetX;
      const y = startY + row * vStep;
      tiles.push({ x, y, key: `${row}-${col}` });
    }
  }

  // Choose a handful of accent tiles to suggest focus areas
  const accentKeys = new Set([
    "1-2", "1-6", "2-4", "3-1", "3-7", "4-3", "4-8"
  ]);
  const accentAltKeys = new Set(["2-2", "2-7", "3-5", "5-4"]);

  return (
    <figure aria-label="Decorative: skill mosaic" className="relative w-full max-w-[620px]">
      <svg viewBox="0 0 600 280" className="w-full h-auto" aria-hidden>
        <defs>
          <clipPath id="sm-clip">
            <rect x="40" y="30" width="520" height="220" rx="18" />
          </clipPath>
          <linearGradient id="sm-scan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ground shadow */}
        <ellipse cx={300} cy={255} rx={230} ry={20} fill="var(--color-fg)" opacity="0.05" />

        {/* mosaic tiles */}
        <g>
          {tiles.map((t, i) => {
            const isA = accentKeys.has(t.key);
            const isB = accentAltKeys.has(t.key);
            const fill = isA
              ? "var(--color-accent)"
              : isB
              ? "var(--color-accent-alt)"
              : "var(--color-bg-alt)";
            const opacity = isA || isB ? 0.9 : 1;
            const cls = isA || isB ? "animate-tile-pulse" : "animate-tile-pop";
            return (
              <path
                key={t.key}
                d={hexPath(t.x, t.y, r)}
                fill={fill}
                opacity={opacity}
                stroke="var(--color-border)"
                strokeOpacity={0.35}
                strokeWidth={1}
                className={cls}
                style={{ animationDelay: `${(i % 10) * 60}ms` }}
              />
            );
          })}
        </g>

        {/* sweeping highlight */}
        <g clipPath="url(#sm-clip)">
          <rect x={-520} y={30} width={520} height={220} fill="url(#sm-scan)" className="animate-scan-sweep" />
        </g>
      </svg>
    </figure>
  );
}

export default SkillMosaic;
