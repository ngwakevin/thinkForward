import { events } from '../../data/events';
import { computeStatus } from '../../components/events/StatusBadge';
import { EventCard } from '../../components/events/EventCard';
import { BootcampsClient } from './BootcampsClient';

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

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 space-y-20">
      <BootcampsClient />
      
      {/* Certificate Tracks Section */}
      <section id="certificate-tracks" className="space-y-10">
        <div className="space-y-4">
          <h2 className="font-display text-3xl font-bold tracking-tight">Bootcamp Certificate Tracks</h2>
          <p className="text-fg-muted text-base leading-relaxed max-w-3xl">
            Prepare for industry-recognized certifications with our structured bootcamp programs. Each track includes hands-on labs, practice exams, and expert guidance.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificateTracks.map((cert, idx) => {
            const levelColors: Record<string, string> = {
              'Expert': 'bg-danger/15 text-danger',
              'Professional': 'bg-warning/15 text-warning',
              'Associate': 'bg-accent/15 text-accent'
            };
            return (
              <div key={idx} className="relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-bg-alt/60 to-bg-alt/20 p-6 shadow-sm group min-h-[420px]">
                <div className="flex flex-col w-full h-full">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-lg bg-${cert.color}/15 text-${cert.color} grid place-items-center`}>
                        <span className={`i-lucide-${cert.icon.toLowerCase()} h-5 w-5`} />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-semibold tracking-tight leading-snug">{cert.title}</h3>
                        <p className="mt-1 text-[10px] uppercase tracking-wide text-fg-muted">{cert.provider}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`inline-block rounded-md px-2 py-1 text-[10px] font-medium tracking-wide ${levelColors[cert.level]}`}>
                        {cert.level}
                      </span>
                    </div>
                  </div>
                  <p className="text-fg-muted leading-relaxed text-sm line-clamp-3">{cert.description}</p>
                  
                  {/* Curriculum Section */}
                  <div className="mt-4 space-y-2">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-fg">Curriculum</h4>
                    <ul className="space-y-1.5">
                      {cert.curriculum.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-fg-muted">
                          <span className="mt-1 h-1 w-1 rounded-full bg-accent flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cert.tags.map(tag => (
                      <span key={tag} className="rounded-md bg-bg-alt/60 border border-border/50 px-2 py-0.5 text-[10px] tracking-wide text-fg-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between text-xs">
                    <span className="text-fg-muted">≈ {cert.duration}</span>
                    <a 
                      href={`/bootcamps/register?track=${encodeURIComponent(cert.title)}`}
                      className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent ring-1 ring-accent/40 hover:bg-accent/25 transition"
                    >
                      Register Now
                    </a>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-accent/0 group-hover:ring-2 group-hover:ring-accent/30 transition" />
              </div>
            );
          })}
        </div>
      </section>

      <section id="upcoming" className="space-y-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Upcoming Cohorts</h2>
        {bootcamps.length === 0 && (
          <div className="rounded-2xl border border-border/60 bg-bg-alt/40 p-8 text-sm text-fg-muted">No bootcamps open right now. Join the waitlist via any event page.</div>
        )}
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {bootcamps.map(b => <EventCard key={b.slug} evt={b} />)}
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
  );
}
