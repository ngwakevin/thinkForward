"use client";
import React, { useEffect, useRef, useState } from "react";

// Helper type to allow CSS custom properties like --reveal-x/--reveal-y/--reveal-delay
type CSSVars<T extends string = string> = React.CSSProperties & Record<`--${T}` | string, string | number>;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  once?: boolean;
  delayMs?: number;
  distancePx?: number; // overrides default 32px
  direction?: "up" | "down" | "left" | "right"; // default up
};

export function Reveal({ children, className = "", as = "div", once = true, delayMs = 0, distancePx, direction = "up" }: RevealProps) {
  const Tag: any = as;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: reveal immediately
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { root: null, threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const style: CSSVars<"reveal-delay" | "reveal-x" | "reveal-y"> = {
    // configure distance and delay via CSS vars
    ["--reveal-delay"]: `${delayMs}ms`,
  };
  if (distancePx != null) {
    if (direction === "up" || direction === "down") {
      // up: positive y start, down: negative y start
      style["--reveal-y"] = `${direction === "up" ? distancePx : -distancePx}px`;
      style["--reveal-x"] = `0px`;
    } else {
      style["--reveal-x"] = `${direction === "right" ? distancePx : -distancePx}px`;
      style["--reveal-y"] = `0px`;
    }
  }

  const dirClass = directionClass(direction);
  return (
    <Tag
      ref={ref}
      style={style}
      className={`reveal ${dirClass} ${visible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

function directionClass(d: RevealProps["direction"]) {
  switch (d) {
    case "down": return "reveal-down";
    case "left": return "reveal-left";
    case "right": return "reveal-right";
    case "up":
    default: return "reveal-up";
  }
}

type RevealGroupProps = {
  children: React.ReactNode[] | React.ReactNode;
  intervalMs?: number; // per-child stagger
  startDelayMs?: number;
  distancePx?: number;
  direction?: RevealProps["direction"];
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  once?: boolean;
};

export function RevealGroup({ children, intervalMs = 80, startDelayMs = 0, distancePx, direction = "up", className = "", as = "div", once = true }: RevealGroupProps) {
  const Tag: any = as;
  const items = React.Children.toArray(children);
  return (
    <Tag className={className}>
      {items.map((child, i) => (
        <Reveal key={i} delayMs={startDelayMs + i * intervalMs} distancePx={distancePx} direction={direction} once={once}>
          {child}
        </Reveal>
      ))}
    </Tag>
  );
}
