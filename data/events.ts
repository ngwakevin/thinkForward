export type EventType = 'live' | 'bootcamp' | 'workshop' | 'ama';
export type EventStatus = 'upcoming' | 'live' | 'replay' | 'past' | 'waitlist' | 'full';

export interface EventSession {
  title: string;
  start: string; // ISO datetime
  end?: string;  // ISO datetime
  speaker?: string;
  link?: string; // livestream / zoom
}

export interface BootcampModule {
  title: string;
  outcomes: string[];
  week?: number;
  hours?: number; // estimated hours this module
}

export interface EventRecord {
  slug: string;
  title: string;
  summary: string;
  description: string;
  type: EventType;
  category: string;
  startDate: string; // ISO date or datetime
  endDate?: string;  // ISO date or datetime
  level?: 'beginner' | 'intermediate' | 'advanced';
  capacity?: number;
  registered?: number;
  price?: string; // 'Free' or '$499'
  location: string; // 'Online' or city
  timezone?: string; // e.g. 'UTC'
  tags: string[];
  coverImage?: string;
  registrationUrl?: string;
  replayVideoUrl?: string;
  resources?: { label: string; url: string }[];
  sessions?: EventSession[];
  modules?: BootcampModule[]; // bootcamp curriculum
  commitmentHoursPerWeek?: number;
  cohort?: number;
  prerequisites?: string[];
  waitlistEnabled?: boolean;
}

// Sample seed events
export const events: EventRecord[] = [
  {
    slug: 'cloud-career-kickoff-live',
    title: 'Cloud Career Kickoff (Live Session)',
    summary: 'A 90‑minute live strategy session to map your next 30 days in cloud & DevOps.',
    description: 'Interactive live session covering skill focus, project selection, and execution rhythm. Includes live Q&A and downloadable action sheet.',
    type: 'live',
    category: 'career',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 90).toISOString(), // +90m
    level: 'beginner',
    capacity: 200,
    registered: 132,
    price: 'Free',
    location: 'Online',
    timezone: 'UTC',
    tags: ['cloud', 'devops', 'career'],
    registrationUrl: '#',
    sessions: [
      { title: 'Strategic Foundations', start: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 45).toISOString() },
      { title: 'Execution & Q&A', start: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 45).toISOString(), end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 90).toISOString() }
    ],
    resources: [ { label: 'Action Sheet (PDF coming soon)', url: '#' } ],
    waitlistEnabled: true,
  },
  {
    slug: 'ai-foundation-bootcamp-cohort-1',
    title: 'AI Foundation (Cohort 1)',
    summary: '4‑week beginner cohort covering AI/ML fundamentals, Python, and practical cloud AI workflows.',
    description:
      'A beginner-friendly cohort to build core AI literacy: Python for data, essential ML concepts, prompt engineering, and deploying simple AI workflows in the cloud with accountability and feedback.',
    type: 'bootcamp',
    category: 'ai',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString(), // 3 weeks from now
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21 + 1000 * 60 * 60 * 24 * 28).toISOString(), // +4w
    level: 'beginner',
    capacity: 50,
    registered: 12,
    price: '$399',
    location: 'Online',
    timezone: 'UTC',
    tags: ['ai', 'ml', 'python', 'cloud'],
    registrationUrl: '#',
    modules: [
      { week: 1, title: 'Python & Data Fundamentals', outcomes: ['Python basics', 'Data wrangling'], hours: 5 },
      { week: 2, title: 'Core ML Concepts', outcomes: ['Supervised vs unsupervised', 'Model evaluation'], hours: 6 },
      { week: 3, title: 'Prompt Engineering & LLM Basics', outcomes: ['Prompt patterns', 'Evaluation basics'], hours: 6 },
      { week: 4, title: 'Cloud AI Workflow', outcomes: ['Deploy simple AI app', 'Measure and iterate'], hours: 6 },
    ],
    commitmentHoursPerWeek: 6,
    cohort: 1,
    prerequisites: ['Basic computer literacy'],
    waitlistEnabled: true,
  },
  {
    slug: 'devops-foundations-bootcamp-cohort-1',
    title: 'DevOps Foundations Bootcamp (Cohort 1)',
    summary: '4‑week intensive cohort building CI/CD, Infra as Code, and monitoring foundation.',
    description: 'A structured cohort experience with weekly live sessions, project milestones, and peer accountability focused on essential DevOps competencies.',
    type: 'bootcamp',
    category: 'devops',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(), // 2 weeks out
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60 * 24 * 28).toISOString(), // +4w
    level: 'intermediate',
    capacity: 40,
    registered: 38,
    price: '$499',
    location: 'Online',
    timezone: 'UTC',
    tags: ['devops', 'cicd', 'infrastructure', 'observability'],
    registrationUrl: '#',
    modules: [
      { week: 1, title: 'Versioned Infrastructure & Environments', outcomes: ['IaC workflow', 'State mgmt basics'], hours: 6 },
      { week: 2, title: 'CI/CD Pipelines', outcomes: ['Build pipeline', 'Deployment strategies'], hours: 7 },
      { week: 3, title: 'Containers & Orchestration', outcomes: ['Dockerization', 'Basic orchestration'], hours: 6 },
      { week: 4, title: 'Monitoring & Reliability', outcomes: ['Observability basics', 'Incident loop'], hours: 5 },
    ],
    commitmentHoursPerWeek: 6,
    cohort: 1,
    prerequisites: ['Basic Git', 'Command line', 'Linux fundamentals'],
    waitlistEnabled: true,
  },
  {
    slug: 'cloud-networking-bootcamp-cohort-1',
    title: 'Cloud Networking Bootcamp (Cohort 1)',
    summary: '4‑week practical cohort on VPC/VNet design, routing, connectivity, and security baselines.',
    description:
      'Hands-on cohort focused on cloud networking fundamentals across major providers: build and secure VPC/VNet topologies, connect environments, and instrument traffic for reliability.',
    type: 'bootcamp',
    category: 'networking',
    startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week out
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 24 * 28).toISOString(), // +4w
    level: 'intermediate',
    capacity: 40,
    registered: 22,
    price: '$449',
    location: 'Online',
    timezone: 'UTC',
    tags: ['networking', 'vpc', 'security', 'connectivity'],
    registrationUrl: '#',
    modules: [
      { week: 1, title: 'VPC/VNet Foundations', outcomes: ['Subnetting', 'Routing tables'], hours: 6 },
      { week: 2, title: 'Connectivity Patterns', outcomes: ['Peering', 'Site-to-site VPN'], hours: 6 },
      { week: 3, title: 'Network Security', outcomes: ['NACLs/Security Groups', 'Zero-trust basics'], hours: 6 },
      { week: 4, title: 'Observability & HA', outcomes: ['Flow logs', 'HA design patterns'], hours: 5 },
    ],
    commitmentHoursPerWeek: 6,
    cohort: 1,
    prerequisites: ['Basic cloud networking concepts'],
    waitlistEnabled: true,
  },
  {
    slug: 'infra-as-code-lab-replay',
    title: 'Infrastructure as Code Lab (Replay)',
    summary: 'Hands-on lab walking through provisioning repeatable environments.',
    description: 'Replay of a practical lab session with code walkthrough and deployment demo.',
    type: 'workshop',
    category: 'infrastructure',
    startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14 + 1000 * 60 * 60 * 2).toISOString(),
    level: 'beginner',
    price: 'Free',
    location: 'Online',
    tags: ['iac', 'terraform', 'cloud'],
    replayVideoUrl: 'https://example.com/video',
    resources: [ { label: 'Lab Repo', url: '#' } ],
    registrationUrl: '#',
  }
];
