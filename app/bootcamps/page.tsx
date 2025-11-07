import { events } from '../../data/events';
import { computeStatus } from '../../components/events/StatusBadge';
import { EventCard } from '../../components/events/EventCard';
import { BootcampsClient } from './BootcampsClient';
import { MentorExperiencePills } from '../../components/bootcamps/MentorExperiencePills';

export const metadata = { title: 'Live Bootcamps' };

export default function BootcampsPage() {
  const bootcamps = events.filter(e => e.type === 'bootcamp').map(e => ({ ...e, status: computeStatus(e) }));
  const certificateTracks = [
    { 
      title: 'AZ-305: Designing Microsoft Azure Infrastructure Solutions',
      provider: 'Microsoft Azure',
      level: 'Expert',
      icon: 'Cloud',
      description: 'Design identity, governance, and monitoring solutions. Design data storage solutions. Design business continuity solutions. Design infrastructure solutions.',
      duration: '120-160h',
      tags: ['Azure', 'Architecture', 'Design'],
      color: 'accent',
      curriculum: [
        'Identity, governance, and monitoring solutions',
        'Data storage and business continuity',
        'Infrastructure and network architecture'
      ]
    },
    { 
      title: 'AZ-400: Designing and Implementing Microsoft DevOps Solutions',
      provider: 'Microsoft Azure',
      level: 'Expert',
      icon: 'GitBranch',
      description: 'Design and implement processes and communications. Design and implement a source control strategy. Design and implement build and release pipelines. Develop a security and compliance plan. Implement an instrumentation strategy.',
      duration: '100-140h',
      tags: ['DevOps', 'CI/CD', 'Azure'],
      color: 'accent',
      curriculum: [
        'Source control and processes',
        'Build and release pipelines',
        'Security, compliance, and instrumentation'
      ]
    },
    { 
      title: 'SC-100: Microsoft Certified: Cybersecurity Architect Expert',
      provider: 'Microsoft',
      level: 'Expert',
      icon: 'Shield',
      description: 'Design solutions that align with security best practices and priorities. Design security operations, identity, and compliance capabilities. Design security solutions for infrastructure. Design security solutions for applications and data.',
      duration: '80-120h',
      tags: ['Security', 'Architecture', 'Compliance'],
      color: 'danger',
      curriculum: [
        'Security best practices and priorities',
        'Identity and compliance capabilities',
        'Infrastructure and application security'
      ]
    },
    { 
      title: 'AZ-500: Microsoft Certified: Azure Security Engineer Associate',
      provider: 'Microsoft Azure',
      level: 'Associate',
      icon: 'Lock',
      description: 'Secure identity and access. Secure networking. Secure compute, storage, and databases. Secure Azure using Microsoft Defender for Cloud and Microsoft Sentinel.',
      duration: '60-90h',
      tags: ['Security', 'Azure', 'Identity'],
      color: 'accent',
      curriculum: [
        'Identity, access, and networking security',
        'Compute, storage, and database protection',
        'Microsoft Defender and Sentinel'
      ]
    },
    { 
      title: 'Google Cloud Professional Cloud Architect',
      provider: 'Google Cloud',
      level: 'Professional',
      icon: 'Building2',
      description: 'Design and plan a cloud solution architecture. Manage and provision the cloud solution infrastructure. Design for security and compliance. Analyze and optimize technical and business processes. Manage implementations of cloud architecture. Ensure solution and operations reliability.',
      duration: '100-140h',
      tags: ['GCP', 'Architecture', 'Design'],
      color: 'warning',
      curriculum: [
        'Cloud solution architecture and planning',
        'Infrastructure and security design',
        'Implementation and reliability'
      ]
    },
    { 
      title: 'Google Cloud Associate Cloud Engineer',
      provider: 'Google Cloud',
      level: 'Associate',
      icon: 'Settings',
      description: 'Set up a cloud solution environment. Plan and implement a cloud solution. Ensure successful operation of a cloud solution. Configure access and security.',
      duration: '60-90h',
      tags: ['GCP', 'Operations', 'Engineering'],
      color: 'warning',
      curriculum: [
        'Cloud environment setup',
        'Solution planning and implementation',
        'Operations and security configuration'
      ]
    },
    { 
      title: 'AWS Certified Solutions Architect - Associate',
      provider: 'Amazon Web Services',
      level: 'Associate',
      icon: 'LayoutGrid',
      description: 'Design Secure Architectures. Design Resilient Architectures. Design High-Performing Architectures. Design Cost-Optimized Architectures.',
      duration: '60-90h',
      tags: ['AWS', 'Architecture', 'Cloud'],
      color: 'warning',
      curriculum: [
        'Secure and resilient architectures',
        'High-performing solutions',
        'Cost optimization strategies'
      ]
    },
    { 
      title: 'AWS Certified Solutions Architect - Professional',
      provider: 'Amazon Web Services',
      level: 'Professional',
      icon: 'Network',
      description: 'Design for organizational complexity. Design for new solutions. Continuously improve existing solutions. Accelerate workload migration and modernization.',
      duration: '120-160h',
      tags: ['AWS', 'Architecture', 'Advanced'],
      color: 'warning',
      curriculum: [
        'Organizational complexity design',
        'New solutions and improvements',
        'Migration and modernization'
      ]
    }
  ];
  const certificateGradients = [
    'linear-gradient(140deg, #fef4ff 0%, #e9d6ff 100%)',
    'linear-gradient(140deg, #e6fbff 0%, #cdf4ff 100%)',
    'linear-gradient(140deg, #fff3e8 0%, #ffe5f1 100%)',
    'linear-gradient(140deg, #f1f5ff 0%, #e7f6f1 100%)',
    'linear-gradient(140deg, #fff4ea 0%, #ffe2f2 100%)',
    'linear-gradient(140deg, #fef4ff 0%, #e6f9ff 100%)'
  ];
  const colorTokens: Record<string, { tint: string; text: string; ring: string }> = {
    accent: { tint: '#5638ff', text: '#5638ff', ring: 'rgba(86,56,255,0.32)' },
    danger: { tint: '#f43f5e', text: '#b91c1c', ring: 'rgba(244,63,94,0.28)' },
    warning: { tint: '#f97316', text: '#c2410c', ring: 'rgba(249,115,22,0.28)' }
  };

  return (
    <div className="relative isolate overflow-hidden bg-[#fef6ff]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 12% -4%, rgba(255,118,192,0.18), rgba(254,246,255,0)),' +
            'radial-gradient(circle at 82% 8%, rgba(86,56,255,0.18), rgba(254,246,255,0)),' +
            'radial-gradient(circle at 50% 92%, rgba(0,170,135,0.18), rgba(254,246,255,0))'
        }}
      />
      <div className="relative">
        <MentorExperiencePills />
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 space-y-20">
          <BootcampsClient />
      
        {/* Certificate Tracks Section */}
      <section
        id="certificate-tracks"
        className="space-y-10 rounded-[48px] border border-white/40 bg-white/40 p-8 shadow-[0_55px_140px_rgba(49,31,73,0.22)] backdrop-blur"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#311f49]/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-white shadow-[0_18px_40px_rgba(49,31,73,0.3)]">
              Certification pathways
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#241639] sm:text-4xl">
              Bootcamp Certificate Tracks
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-[#2f1f4b]/80 sm:text-base">
              Prepare for industry-recognized certifications with our structured bootcamp programs. Each track includes
              hands-on labs, practice exams, and expert guidance.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#0ea5e9]/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#0f6290] ring-1 ring-[#0ea5e9]/30 shadow-[0_12px_32px_rgba(14,165,233,0.2)]">
            Multi-cloud coverage
          </span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificateTracks.map((cert, idx) => {
            const levelColors: Record<string, string> = {
              'Expert': 'bg-danger/15 text-danger',
              'Professional': 'bg-warning/15 text-warning',
              'Associate': 'bg-accent/15 text-accent'
            };
            const palette = colorTokens[cert.color] || colorTokens.accent;
            const cardBackground = certificateGradients[idx % certificateGradients.length];
            return (
              <div
                key={idx}
                className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[32px] border border-white/60 p-6 text-[#241639] shadow-[0_32px_85px_rgba(49,31,73,0.18)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_40px_110px_rgba(49,31,73,0.26)]"
                style={{ background: cardBackground }}
              >
                <div className="flex h-full w-full flex-col">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className="grid h-11 w-11 place-items-center rounded-2xl"
                        style={{ backgroundColor: `${palette.tint}1a`, color: palette.tint }}
                      >
                        <span className={`i-lucide-${cert.icon.toLowerCase()} h-5 w-5`} />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-[#241639]">
                          {cert.title}
                        </h3>
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-[#2f1f4b]/65">{cert.provider}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-block rounded-md px-2 py-1 text-[10px] font-medium tracking-wide ${levelColors[cert.level]}`}>
                        {cert.level}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[#2f1f4b]/80 line-clamp-3">{cert.description}</p>

                  <div className="mt-4 space-y-2">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[#311f49]">Curriculum</h4>
                    <ul className="space-y-1.5">
                      {cert.curriculum.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-[#2f1f4b]/70">
                          <span
                            className="mt-1 h-1 w-1 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: palette.tint }}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {cert.tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-wide"
                        style={{
                          borderColor: `${palette.tint}33`,
                          backgroundColor: `${palette.tint}12`,
                          color: palette.text
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between text-xs">
                    <span className="text-[#2f1f4b]/65">≈ {cert.duration}</span>
                    <a 
                      href={`/bootcamps/register?track=${encodeURIComponent(cert.title)}`}
                      className="inline-flex items-center gap-1 rounded-full bg-[#311f49] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-white shadow-[0_14px_36px_rgba(49,31,73,0.28)] transition hover:bg-[#5638ff]"
                    >
                      Register Now
                      <span className="i-lucide-arrow-up-right text-[12px]" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section
        id="upcoming"
        className="space-y-10 rounded-[48px] border border-white/40 bg-white/40 p-8 shadow-[0_55px_140px_rgba(49,31,73,0.22)] backdrop-blur"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#311f49]/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-white shadow-[0_18px_40px_rgba(49,31,73,0.3)]">
              Cohort schedule
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#241639] sm:text-4xl">
              Upcoming Cohorts
            </h2>
            <p className="max-w-3xl text-sm leading-relaxed text-[#2f1f4b]/80 sm:text-base">
              Reserve your seat in the next live rotation. Every cohort includes weekly labs, mentor checkpoints,
              and personalized feedback loops to keep you shipping.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-[#f97316]/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c2410c] ring-1 ring-[#f97316]/30 shadow-[0_12px_32px_rgba(249,115,22,0.22)]">
            Rolling admissions
          </span>
        </div>
        {bootcamps.length === 0 && (
          <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 text-sm text-fg-muted">No bootcamps open right now. Join the waitlist via any event page.</div>
        )}
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {bootcamps.map((b, idx) => (
            <EventCard key={b.slug} evt={b} variant="pastel" toneIndex={idx} />
          ))}
        </div>
      </section>
      <section className="space-y-8">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-bg-alt/70 to-bg-alt/30 p-10 flex flex-col md:flex-row md:items-center gap-10">
          <div className="md:flex-1 space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-tight">Need a different focus?</h2>
            <p className="text-sm text-fg-muted leading-relaxed">Explore live sessions, workshops, and strategy events to complement your cohort experience or warm up before applying.</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="/events" className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-xs font-semibold tracking-wide text-white shadow hover:bg-accent-alt transition">Browse Events</a>
              <a href="/contact" className="inline-flex items-center rounded-md border border-border/70 px-5 py-2.5 text-xs font-semibold tracking-wide hover:border-accent hover:text-accent transition">Ask a Question</a>
            </div>
          </div>
          <ul className="grid gap-4 text-xs md:w-72">
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Small cohort sizes for focused feedback</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Structured weekly execution rhythm</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Portfolio and scenario based assessment</li>
            <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" /> Accountability & momentum reinforcement</li>
          </ul>
        </div>
      </section>
        </div>
      </div>
    </div>
  );
}
