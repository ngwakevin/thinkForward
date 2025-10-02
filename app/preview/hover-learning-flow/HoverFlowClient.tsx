"use client";
import React, { useEffect } from "react";
import Script from "next/script";

export default function HoverFlowClient() {
  useEffect(() => {
    function wire() {
      const w = window as any;
      const gsap = w.gsap as any;
      if (!gsap) return;

      const signup = document.getElementById("signup");
      const course = document.getElementById("course");
      const learn = document.getElementById("learn");
      const achieve = document.getElementById("achieve");

      if (signup) {
        signup.addEventListener("mouseenter", () => {
          gsap.to("#signup", { scale: 1.3, duration: 0.3, transformOrigin: "center" });
        });
        signup.addEventListener("mouseleave", () => {
          gsap.to("#signup", { scale: 1, duration: 0.3 });
        });
      }

      if (course) {
        course.addEventListener("mouseenter", () => {
          gsap.to("#course", { scale: 1.3, duration: 0.3, transformOrigin: "center" });
        });
        course.addEventListener("mouseleave", () => {
          gsap.to("#course", { scale: 1, duration: 0.3 });
        });
      }

      if (learn) {
        learn.addEventListener("mouseenter", () => {
          gsap.to("#learn", { strokeDashoffset: 0, duration: 0.8 });
        });
        learn.addEventListener("mouseleave", () => {
          gsap.to("#learn", { strokeDashoffset: 120, duration: 0.4 });
        });
      }

      if (achieve) {
        achieve.addEventListener("mouseenter", () => {
          gsap.to("#achieve", { strokeDashoffset: 0, duration: 1 });
        });
        achieve.addEventListener("mouseleave", () => {
          gsap.to("#achieve", { strokeDashoffset: 60, duration: 0.4 });
        });
      }
    }

    const t = setTimeout(wire, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* GSAP CDN, only for this preview */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" strategy="afterInteractive" />

      <div className="p-4">
        <svg className="flow" viewBox="0 0 420 420" width={420} height={420} role="img" aria-label="Interactive learning journey: Sign up, pick course, learn, achieve">
          {/* Circle guide */}
          <circle cx="210" cy="210" r="150" stroke="#3ae68b33" strokeDasharray="8,10" fill="none" />

          {/* Step 1 */}
          <circle className="icon" id="signup" cx="210" cy="60" r="18" />
          <text x="210" y="40" textAnchor="middle">Sign up</text>

          {/* Step 2 */}
          <rect className="icon" id="course" x="190" y="325" width="40" height="25" rx="5" />
          <text x="210" y="370" textAnchor="middle">Pick course</text>

          {/* Step 3 */}
          <line className="progress" id="learn" x1="340" y1="210" x2="380" y2="210" />
          <text x="360" y="195" textAnchor="middle">Learn</text>

          {/* Step 4 */}
          <polyline className="check" id="achieve" points="80,220 100,240 140,200" />
          <text x="110" y="270" textAnchor="middle">Achieve</text>
        </svg>
      </div>

      <style jsx>{`
        .flow { width: 420px; height: 420px; }
        text { font-size: 16px; fill: #ffffff; pointer-events: none; font-family: Inter, ui-sans-serif, system-ui, -apple-system; }
        .icon { stroke: #3ae68b; stroke-width: 3; fill: none; cursor: pointer; transition: transform 0.3s ease; }
        .icon:hover { transform: scale(1.2); }
        .progress { stroke: #3ae68b; stroke-width: 6; stroke-linecap: round; stroke-dasharray: 120; stroke-dashoffset: 120; cursor: pointer; }
        .check { stroke: #3ae68b; stroke-width: 3; fill: none; stroke-dasharray: 60; stroke-dashoffset: 60; cursor: pointer; }
      `}</style>
    </>
  );
}
