'use client';

import { useCallback } from 'react';
import { CloudegreeWordmark } from '../brand/CloudegreeWordmark';

export function CameroonPoster() {
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
          Download Poster as PDF
        </button>
        <p className="text-xs text-fg-muted">Use your browser&apos;s print dialog → Save as PDF (select A2/A1 paper size)</p>
      </div>

      {/* ───────────── BIG POSTER ───────────── */}
      <div
        id="cameroon-poster"
        className="mx-auto max-w-[840px] bg-[#071621] text-[#F5FAFC] font-sans shadow-2xl print:shadow-none print:max-w-none"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {/* Top Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-[#00C48C] via-[#00A977] to-[#FFB347]" />

        {/* Header */}
        <div className="px-12 pt-12 pb-6 flex items-center justify-between">
          <CloudegreeWordmark className="text-4xl md:text-5xl" pulseDot={false} />
          <div className="text-right">
            <span className="block text-xs font-bold uppercase tracking-[0.3em] text-[#FFB347]">Go Live 2026</span>
            <span className="block text-[10px] text-[#B5C9D3] mt-1">Cloud &amp; DevOps Training</span>
          </div>
        </div>

        {/* Hero Block */}
        <div className="relative overflow-hidden px-12 py-16 text-center">
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#00C48C]/8 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-[300px] w-[300px] rounded-full bg-[#00A977]/10 blur-3xl" aria-hidden="true" />

          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#FFB347] mb-6">🇨🇲 Cameroon Launch</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-none bg-gradient-to-r from-[#00C48C] to-[#00A977] bg-clip-text text-transparent">
              NOW LIVE IN
              <br />
              CAMEROON
            </h1>
            <p className="mt-6 text-lg text-[#B5C9D3] max-w-xl mx-auto leading-relaxed">
              Pragmatic acceleration for Cloud &amp; DevOps skills — structured tracks, mentorship, events, and practical guides.
            </p>
            <div className="mt-8">
              <span className="inline-block rounded-full bg-[#00C48C]/15 px-8 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-[#00C48C] ring-1 ring-[#00C48C]/30">
                Train · Build · Elevate
              </span>
            </div>
          </div>
        </div>

        {/* Three Pillars */}
        <div className="px-12 pb-12">
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: '🌥️', name: 'Cloud Foundation', desc: 'Azure, AWS & GCP fundamentals — build your cloud bedrock' },
              { icon: '⚙️', name: 'DevOps Engineer', desc: 'CI/CD pipelines, IaC, containers & orchestration mastery' },
              { icon: '🔐', name: 'Cloud Security', desc: 'Security-first mindset — IAM, compliance & threat models' },
            ].map(track => (
              <div key={track.name} className="rounded-2xl border border-[#163544] bg-[#0E2533]/70 p-6 text-center hover:border-[#00C48C]/40 transition">
                <span className="text-4xl block mb-3">{track.icon}</span>
                <h3 className="text-base font-bold tracking-tight">{track.name}</h3>
                <p className="mt-2 text-xs text-[#B5C9D3] leading-relaxed">{track.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What We Offer */}
        <div className="px-12 pb-12">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#00C48C] mb-6">What We Offer</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🎓', title: 'Live Bootcamps', desc: 'Immersive, instructor-led cohort sessions with real-time interaction' },
              { icon: '👨‍🏫', title: '1-on-1 Mentoring', desc: 'Personalized guidance and career acceleration frameworks' },
              { icon: '🛠️', title: 'Project-Based Labs', desc: 'Real infrastructure, pipelines & security projects for your portfolio' },
              { icon: '📜', title: 'Certification Prep', desc: 'Structured paths for AZ-900, AZ-104, AWS SAA, and more' },
              { icon: '🚀', title: 'Career Acceleration', desc: 'Interview positioning, storytelling clarity & portfolio alignment' },
              { icon: '🤝', title: 'Community & Support', desc: 'Join a network of cloud practitioners across Cameroon' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 rounded-xl border border-[#163544]/60 bg-[#0E2533]/40 p-4">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="text-[11px] text-[#B5C9D3] leading-snug mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Details */}
        <div className="mx-12 rounded-2xl border border-[#FFB347]/30 bg-gradient-to-r from-[#FFB347]/5 to-[#FFB347]/10 p-8 mb-12">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#FFB347]">📅 Start Date</span>
              <p className="mt-2 text-lg font-bold">Coming Soon</p>
              <p className="text-xs text-[#B5C9D3]">2026</p>
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#FFB347]">📍 Locations</span>
              <p className="mt-2 text-lg font-bold">Douala · Yaoundé</p>
              <p className="text-xs text-[#B5C9D3]">+ Online Available</p>
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#FFB347]">💰 Pricing</span>
              <p className="mt-2 text-lg font-bold">Early Bird</p>
              <p className="text-xs text-[#B5C9D3]">Limited Spots</p>
            </div>
          </div>
        </div>

        {/* CTA + Registration */}
        <div className="px-12 pb-12">
          <div className="grid grid-cols-2 gap-8 items-center">
            {/* Left: CTA */}
            <div className="text-center">
              <div className="inline-block rounded-xl bg-[#00C48C] px-10 py-4 text-lg font-bold text-[#071621] uppercase tracking-wider shadow-xl">
                Register Now →
              </div>
              <p className="mt-3 text-sm text-[#B5C9D3]">cloudegree.com/cameroon</p>
              <p className="mt-1 text-xs text-[#B5C9D3]/70">Scan QR code or visit the link above</p>
            </div>
            {/* Right: Registration Fields */}
            <div className="rounded-xl border border-[#163544] bg-[#0E2533]/60 p-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#00C48C] mb-4">Registration Form</h3>
              <div className="space-y-2">
                {[
                  'Full Name',
                  'Email Address',
                  'Phone / WhatsApp',
                  'Preferred Cloud Provider (Azure / AWS / GCP)',
                  'Experience Level (0-1 / 1-3 / 3-5 / 5+ years)',
                  'Primary Goal (Career Change / Certification / Skill Upgrade)',
                ].map(field => (
                  <div key={field} className="flex items-center gap-2 text-xs text-[#B5C9D3]">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00C48C]" />
                    {field}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="px-12 pb-8">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-[#B5C9D3]">
            <span>📧 ngwakevin@gmail.com</span>
            <span>🗓️ calendly.com/ngwakevin/mentoring</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0E2533] px-12 py-6 flex items-center justify-between">
          <CloudegreeWordmark className="text-2xl" pulseDot={false} compact />
          <span className="text-xs text-[#B5C9D3]">Built for sustained velocity</span>
        </div>

        {/* Bottom Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-[#FFB347] via-[#00A977] to-[#00C48C]" />
      </div>
    </>
  );
}
