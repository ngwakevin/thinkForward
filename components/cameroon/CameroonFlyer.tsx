'use client';

import { useRef, useCallback } from 'react';
import { CloudegreeWordmark } from '../brand/CloudegreeWordmark';

export function CameroonFlyer() {
  const flyerRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      {/* Download Controls — hidden in print */}
      <div className="print:hidden flex flex-wrap items-center justify-center gap-4 py-8">
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white shadow hover:bg-accent-alt transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download as PDF
        </button>
        <p className="text-xs text-fg-muted">Use your browser&apos;s print dialog → Save as PDF</p>
      </div>

      {/* ───────────── FLYER ───────────── */}
      <div
        ref={flyerRef}
        id="cameroon-flyer"
        className="mx-auto max-w-[595px] bg-[#071621] text-[#F5FAFC] font-sans shadow-2xl print:shadow-none print:max-w-none"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0E2533] to-[#071621] px-8 pt-8 pb-4 flex items-center justify-between">
          <CloudegreeWordmark className="text-3xl" pulseDot={false} />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#00C48C]">Go Live 2026</span>
        </div>

        {/* Hero */}
        <div className="relative overflow-hidden px-8 py-10 text-center">
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[500px] rounded-full bg-[#00C48C]/10 blur-3xl" aria-hidden="true" />
          <p className="relative text-xs font-bold uppercase tracking-[0.25em] text-[#FFB347] mb-3">🇨🇲 Cameroon Launch</p>
          <h1 className="relative font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight bg-gradient-to-r from-[#00C48C] to-[#00A977] bg-clip-text text-transparent">
            We Are Live in Cameroon!
          </h1>
          <p className="relative mt-3 text-sm text-[#B5C9D3] max-w-md mx-auto">
            Pragmatic acceleration for Cloud &amp; DevOps skills — now available in Cameroon with live bootcamps, 1-on-1 mentoring, and hands-on labs.
          </p>
        </div>

        {/* Tagline */}
        <div className="text-center pb-6">
          <span className="inline-block rounded-full bg-[#00C48C]/15 px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#00C48C]">
            Train · Build · Elevate
          </span>
        </div>

        {/* What We Offer — 2×2 grid */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🎓', title: 'Cloud Bootcamps', desc: 'Azure, AWS & GCP — live instructor-led cohorts' },
              { icon: '👨‍🏫', title: '1-on-1 Mentoring', desc: 'Personalized guidance & career acceleration' },
              { icon: '🛠️', title: 'Hands-On Labs', desc: 'Real infrastructure, pipelines & security projects' },
              { icon: '📜', title: 'Certification Prep', desc: 'Structured paths for AZ-900, AZ-104, AWS SAA & more' },
            ].map(item => (
              <div key={item.title} className="rounded-xl border border-[#163544] bg-[#0E2533]/70 p-4">
                <span className="text-xl">{item.icon}</span>
                <h3 className="mt-2 text-sm font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-1 text-[11px] text-[#B5C9D3] leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Training Tracks */}
        <div className="px-8 pb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#00C48C] mb-4">Training Tracks</h2>
          <div className="flex gap-3">
            {[
              { name: 'Cloud Foundation', icon: '🌥️' },
              { name: 'DevOps Engineer', icon: '⚙️' },
              { name: 'Cloud Security', icon: '🔐' },
            ].map(track => (
              <div key={track.name} className="flex-1 rounded-lg border border-[#163544] bg-[#0E2533]/50 p-3 text-center">
                <span className="text-2xl">{track.icon}</span>
                <p className="mt-1 text-[11px] font-semibold">{track.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Event Info */}
        <div className="mx-8 rounded-xl border border-[#FFB347]/30 bg-[#FFB347]/5 p-5 mb-8">
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFB347]">📅 Start Date</span>
              <p className="mt-0.5 font-semibold">Coming Soon — 2026</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFB347]">📍 Locations</span>
              <p className="mt-0.5 font-semibold">Douala · Yaoundé · Online</p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFB347]">💰 Pricing</span>
              <p className="mt-0.5 font-semibold">Early Bird Available</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-8 pb-6 text-center">
          <div className="inline-block rounded-lg bg-[#00C48C] px-8 py-3 text-sm font-bold text-[#071621] uppercase tracking-wider shadow-lg">
            Register Now →
          </div>
          <p className="mt-2 text-xs text-[#B5C9D3]">cloudegree.com/cameroon</p>
        </div>

        {/* Registration Form Preview */}
        <div className="mx-8 mb-8 rounded-xl border border-[#163544] bg-[#0E2533]/60 p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#00C48C] mb-3">Quick Registration</h3>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {['Full Name', 'Email Address', 'Phone / WhatsApp', 'Cloud Provider Preference', 'Experience Level', 'Primary Goal'].map(field => (
              <div key={field} className="flex items-center gap-1.5 text-[#B5C9D3]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00C48C]" />
                {field}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-[#B5C9D3]/70">Visit cloudegree.com/bootcamps/register to complete your registration</p>
        </div>

        {/* Contact */}
        <div className="px-8 pb-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#B5C9D3]">
            <span>📧 ngwakevin@gmail.com</span>
            <span>🗓️ calendly.com/ngwakevin</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0E2533] px-8 py-4 flex items-center justify-between">
          <CloudegreeWordmark className="text-lg" pulseDot={false} compact />
          <span className="text-[10px] text-[#B5C9D3]">Built for sustained velocity</span>
        </div>
      </div>
    </>
  );
}
