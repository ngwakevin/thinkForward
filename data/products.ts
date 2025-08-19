export interface ProductDefinition {
  key: string;
  title: string;
  subtitle?: string;
  body: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationHours: number; // estimated total guided hours
  tags: string[];
  outcomes: string[]; // 2-4 concise outcome bullets
  prerequisites?: string[];
  certificationAlign?: string;
  certifications?: string[]; // added list of mapped external certifications
  enrollmentStatus: 'open' | 'waitlist' | 'coming-soon';
  icon: string; // lucide icon name reference
  variant?: 'primary' | 'secondary' | 'tertiary';
  delivery: 'live' | 'self-paced'; // added delivery mode
}

// Edit / extend this list with your real product / track offerings.
export const products: ProductDefinition[] = [
  {
    key: 'cloud-foundation',
    title: 'Cloud Foundation',
    subtitle: 'Starter Track',
    body: 'Unified fundamentals of AWS, Azure, and Google Cloud: core services, shared architecture primitives, identity, networking, security & cost basics.',
    difficulty: 'beginner',
    durationHours: 28,
    tags: ['AWS', 'Azure', 'GCP', 'Fundamentals'],
    outcomes: [
      'Grasp core compute, storage, network building blocks',
      'Map equivalent services across AWS / Azure / GCP',
      'Establish identity, security & cost guardrails'
    ],
    prerequisites: ['General IT basics'],
    certificationAlign: 'Foundational multi-cloud readiness',
    enrollmentStatus: 'open',
    icon: 'Layers',
    variant: 'primary',
    delivery: 'live'
  },
  {
    key: 'cloud-architect',
    title: 'Cloud Architect',
    subtitle: 'Core Track',
    body: 'Design scalable, secure, cost‑efficient architectures mapping business goals to cloud services.',
    difficulty: 'intermediate',
    durationHours: 40,
    tags: ['Architecture', 'AWS', 'Azure', 'GCP', 'Design'],
    outcomes: ['Model enterprise architectures', 'Optimize cost & resilience', 'Select cloud services strategically'],
    prerequisites: ['Cloud fundamentals'],
    certificationAlign: 'Multi-cloud architect path',
    certifications: [
      'Microsoft Certified: Azure Solutions Architect Expert',
      'AWS Certified Solutions Architect – Associate',
      'Google Professional Cloud Architect'
    ],
    enrollmentStatus: 'coming-soon',
    icon: 'Boxes',
    variant: 'secondary',
    delivery: 'live'
  },
  {
    key: 'cloud-engineer',
    title: 'Cloud Engineer',
    body: 'Implement infrastructure, automation, and deployments using IaC, containers, and managed services.',
    difficulty: 'beginner',
    durationHours: 32,
    tags: ['Terraform', 'Containers', 'Networking'],
    outcomes: ['Provision infra with IaC', 'Deploy container workloads', 'Implement secure networking'],
    prerequisites: ['Basic scripting'],
    enrollmentStatus: 'coming-soon',
    icon: 'CloudCog',
    variant: 'secondary',
    delivery: 'live'
  },
  {
    key: 'devops-engineer',
    title: 'Cloud DevOps',
    body: 'Enable continuous delivery and reliability with CI/CD pipelines, observability, and platform tooling.',
    difficulty: 'intermediate',
    durationHours: 36,
    tags: ['CI/CD', 'Observability', 'Automation'],
    outcomes: ['Build secure pipelines', 'Instrument services', 'Automate releases safely'],
    prerequisites: ['Git basics', 'Cloud fundamentals'],
    enrollmentStatus: 'coming-soon',
    icon: 'GitBranch',
    variant: 'secondary',
    delivery: 'live'
  },
  {
    key: 'cloud-networking',
    title: 'Cloud Networking',
    subtitle: 'Network Track',
    body: 'Design and implement secure, resilient, and cost‑efficient network architectures across cloud platforms (VPC/VNet design, routing, load balancing, connectivity, segmentation).',
    difficulty: 'intermediate',
    durationHours: 34,
    tags: ['Networking', 'Security', 'VPC', 'Load Balancing'],
    outcomes: [
      'Design segmented, scalable virtual networks',
      'Implement resilient traffic & routing patterns',
      'Apply security controls & observability to network paths'
    ],
    prerequisites: ['Cloud fundamentals'],
    enrollmentStatus: 'coming-soon',
    icon: 'Network',
    variant: 'secondary',
    delivery: 'live'
  },
  {
    key: 'course-info',
    title: 'Course Info',
    body: 'Hands-on labs, real projects, architecture challenges, guided feedback – build job-ready skill depth.',
    difficulty: 'beginner',
    durationHours: 4,
    tags: ['Overview'],
    outcomes: ['Understand platform flow', 'Plan your path'],
    enrollmentStatus: 'coming-soon',
    icon: 'Info',
    variant: 'secondary',
    delivery: 'self-paced'
  },
  {
    key: 'coming-soon',
    title: 'Coming Soon',
    body: 'Teaser for the next specialization. Capture early interest and waitlist signups.',
    difficulty: 'advanced',
    durationHours: 0,
    tags: ['Upcoming'],
    outcomes: ['Early access updates'],
    enrollmentStatus: 'coming-soon',
    icon: 'Hourglass',
    variant: 'secondary',
    delivery: 'self-paced'
  },
  {
    key: 'cloud-foundation-self',
    title: 'Cloud Foundation',
    subtitle: 'Starter Track',
    body: 'Unified fundamentals of AWS, Azure, and Google Cloud: core services, shared architecture primitives, identity, networking, security & cost basics.',
    difficulty: 'beginner',
    durationHours: 28,
    tags: ['AWS', 'Azure', 'GCP', 'Fundamentals'],
    outcomes: [
      'Grasp core compute, storage, network building blocks',
      'Map equivalent services across AWS / Azure / GCP',
      'Establish identity, security & cost guardrails'
    ],
    enrollmentStatus: 'coming-soon',
    icon: 'Layers',
    variant: 'primary',
    delivery: 'self-paced'
  }
];
