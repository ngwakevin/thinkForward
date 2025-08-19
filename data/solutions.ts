/**
 * Solutions, testimonials, and FAQs data layer.
 * Centralizes product/solution marketing copy and related helpers so UI components stay lean.
 */

export type SolutionStatus = 'live' | 'beta' | 'coming-soon';

export interface SolutionFeature { label: string; detail: string }

export interface Solution {
  /** Stable key used for routing / lookups */
  key: string;
  /** Short marketable name */
  title: string;
  /** One-line positioning (benefit oriented) */
  tagline: string;
  /** Expanded narrative value prop */
  description: string;
  /** Promised customer / learner outcomes (evidence oriented) */
  outcomes: readonly string[];
  /** Capability slices clarifying how value is delivered */
  features: readonly SolutionFeature[];
  /** Lifecycle stage */
  status: SolutionStatus;
  /** Primary call-to-action */
  cta: { label: string; href: string };
  /** Optional symbolic icon (emoji or icon name) */
  icon?: string;
  /** Optional short highlight / ribbon copy */
  highlight?: string;
  /** Optional ordering weight (lower first) */
  order?: number;
}

/** Visual / semantic metadata per status for UI consumption */
export const SOLUTION_STATUS_META: Record<SolutionStatus, { label: string; tone: 'positive' | 'info' | 'pending'; badgeClass: string } > = {
  live: { label: 'Live', tone: 'positive', badgeClass: 'bg-accent/15 text-accent ring-accent/30' },
  beta: { label: 'Beta', tone: 'info', badgeClass: 'bg-warning/15 text-warning ring-warning/30' },
  'coming-soon': { label: 'Coming Soon', tone: 'pending', badgeClass: 'bg-fg-muted/10 text-fg-muted ring-fg-muted/30' }
};

// Core catalogue (ordered intentionally – highest leverage first)
export const solutions: readonly Solution[] = [
  {
    key: 'mentorship',
    title: 'Career Mentorship',
    tagline: 'Accelerate role readiness with targeted 1:1 guidance',
    description: 'Structured senior-level guidance, calibrated quarterly goals, and rapid feedback loops so progression is intentional, visible, and compounding.',
    outcomes: [
      '90‑day execution plan with measurable checkpoints',
      'Faster skill depth through focused correction',
      'Reduced stall time via rapid unblock support'
    ],
    features: [
      { label: 'Strategic Alignment', detail: 'Quarterly deep‑dive to define focus, risks, and success metrics.' },
      { label: 'Async Reviews', detail: 'Code / architecture feedback turnaround under 48h.' },
      { label: 'Weekly Momentum', detail: 'Light cadence check‑ins to de‑risk drift early.' }
    ],
    status: 'live',
    cta: { label: 'Start Mentorship', href: '/contact' },
    icon: '🧭',
    highlight: '1:1 Guidance',
    order: 10
  },
  {
    key: 'roadmaps',
    title: 'Guided Learning Roadmaps',
    tagline: 'Role‑aligned paths that adapt as you progress',
    description: 'Adaptive learning sequences that rebalance depth and delivery based on assessment signals—eliminating noise while accelerating portfolio credibility.',
    outcomes: [
      'Remove unfocused curriculum overhead',
      'Concentrate on high‑leverage repetitions',
      'Maintain consistent forward velocity'
    ],
    features: [
      { label: 'Adaptive Sequencing', detail: 'Path reshapes using completion + retention signal checkpoints.' },
      { label: 'Milestone Validation', detail: 'Retention & application gates before unlocking next phase.' },
      { label: 'Deliverable Artifacts', detail: 'Each phase produces a tangible portfolio asset.' }
    ],
    status: 'live',
    cta: { label: 'View Roadmaps', href: '/roadmaps' },
    icon: '🛣️',
    highlight: 'Adaptive',
    order: 20
  },
  {
    key: 'motivation',
    title: 'Motivation & Accountability',
    tagline: 'Behavior systems that sustain momentum',
    description: 'Lightweight gamification, peer micro‑cohorts, and progress surfacing that convert intention into durable execution habits.',
    outcomes: [
      'Protect learning streak integrity',
      'Lower disengagement & dropout risk',
      'Continuous reinforcement via visible progress'
    ],
    features: [
      { label: 'Streak Intelligence', detail: 'Grace buffers + recovery logic to prevent momentum collapse.' },
      { label: 'Peer Squads', detail: 'Small cohort loops for accountability & morale lift.' },
      { label: 'Progress Feed', detail: 'Milestones surfaced to reinforce identity & cadence.' }
    ],
    status: 'beta',
    cta: { label: 'Join Beta', href: '/waitlist' },
    icon: '🔥',
    order: 30
  },
  {
    key: 'interview-prep',
    title: 'Interview & Certification Prep',
    tagline: 'Assessment-grade practice that mirrors reality',
    description: 'Scenario drills, rubric‑based mock sessions, and readiness scoring that expose gaps early—so performance on the day is a calibrated repeat, not a first attempt.',
    outcomes: [
      'Surface competency gaps earlier',
      'Increase narrative clarity & depth',
      'Improve pass & offer probability'
    ],
    features: [
      { label: 'Scenario Bank', detail: 'Architecture, incident, behavioral, and systems prompts.' },
      { label: 'Structured Mocks', detail: 'Rubric scoring + actionable debrief with priority fixes.' },
      { label: 'Readiness Index', detail: 'Weighted coverage & confidence scoring model.' }
    ],
    status: 'coming-soon',
    cta: { label: 'Join Waitlist', href: '/waitlist' },
    icon: '🎯',
    order: 40
  }
] as const;

/** Sorted copy (by order then title) for UI loops */
export const orderedSolutions = [...solutions].sort((a,b)=> (a.order??999) - (b.order??999) || a.title.localeCompare(b.title));

/** Quick access subsets */
export const liveSolutions = orderedSolutions.filter(s => s.status === 'live');
export const betaSolutions = orderedSolutions.filter(s => s.status === 'beta');
export const upcomingSolutions = orderedSolutions.filter(s => s.status === 'coming-soon');

/** Lookup helper */
export function getSolution(key: string) { return solutions.find(s => s.key === key); }

export interface Testimonial { name: string; role: string; quote: string; avatar?: string }
export const testimonials: readonly Testimonial[] = [
  { name: 'Amina K.', role: 'Cloud Engineer (Offer)', quote: 'Targeted roadmap + fast feedback compressed what felt like a year of wandering into a few decisive months.' },
  { name: 'Luis R.', role: 'DevOps Transition', quote: 'Peer squad accountability made weekly shipping non‑negotiable. Confidence followed consistent output.' },
  { name: 'Chen W.', role: 'Aspiring Architect', quote: 'Structured scenario debriefs turned high‑stakes interview loops into familiar calibrated reps.' }
] as const;

export interface FAQ { q: string; a: string }
export const faqs: readonly FAQ[] = [
  { q: 'Who is this for?', a: 'Early or transitioning professionals targeting cloud, platform, DevOps, or architecture roles seeking structured acceleration.' },
  { q: 'How does mentorship work?', a: 'You are matched to a mentor by goals & current strengths, align quarterly on strategy, and receive structured async feedback between sessions.' },
  { q: 'Can I pause?', a: 'Yes. You can pause any time; roadmap state and history are preserved for seamless resume.' }
] as const;
