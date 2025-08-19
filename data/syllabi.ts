import { slugify } from '../lib/slugify';

export interface SyllabusDomainSection { heading: string; items: string[] }
export interface SyllabusDomain { name: string; weight?: string; sections: SyllabusDomainSection[] }
export interface CertificationSyllabus {
  title: string;
  slug: string;
  summary: string;
  responsibilities?: string[];
  preModules?: SyllabusDomain[];
  learningModules?: SyllabusDomain[]; // learner-focused modules (non exam wording)
  domains: SyllabusDomain[]; // optional exam blueprint (may be empty when not emphasized)
  audience?: string[];
  experience?: string[];
  certificationsAwarded?: string[]; // certificates / exams at outcome
  status?: 'live' | 'coming-soon';
}

function makeSlug(title: string) { return slugify(title); }

export const syllabi: CertificationSyllabus[] = [
  {
    title: 'Microsoft Certified: Azure Solutions Architect Expert',
    slug: makeSlug('Microsoft Certified Azure Solutions Architect Expert'),
    summary: 'End-to-end architecture capability development: translate business drivers into resilient, secure, observable, cost-optimized Azure solutions.',
    responsibilities: [
      'Advise stakeholders & translate business requirements into Azure solution designs',
      'Align implementations with Azure Well-Architected & Cloud Adoption Framework',
      'Collaborate with identity, security, data, infra, and DevOps roles to realize designs'
    ],
    preModules: [
      {
        name: 'Cost Management & Optimization (Foundational Module)',
        weight: 'Pre-Module',
        sections: [
          {
            heading: 'Cost Governance & Accountability',
            items: [
              'Tagging strategy for chargeback / showback',
              'Management group & subscription cost scoping',
              'Budgets & alert thresholds structure'
            ]
          },
          {
            heading: 'Cost Architecture Principles',
            items: [
              'Right‑sizing & elasticity design patterns',
              'Consumption vs reserved capacity decision matrix',
              'Multi‑region & redundancy cost trade‑offs'
            ]
          },
          {
            heading: 'Cost Monitoring & Telemetry',
            items: [
              'Azure Cost Management + Advisor integration',
              'Custom dashboards for unit economics / KPIs',
              'Anomaly & drift detection thresholds'
            ]
          },
          {
            heading: 'Optimization Strategies',
            items: [
              'Reserved Instances & Savings Plans strategy',
              'Spot / ephemeral compute adoption boundaries',
              'Storage tiering & lifecycle management policies'
            ]
          },
          {
            heading: 'Estimating & Forecasting',
            items: [
              'Early stage cost modeling & assumptions log',
              'Pricing calculator workflow & validation',
              'Forecast refinement cadence'
            ]
          },
          {
            heading: 'Trade‑off Analysis',
            items: [
              'Performance vs cost (burstable vs dedicated)',
              'Resilience vs cost (active‑active vs active‑passive)',
              'Data redundancy tier selection'
            ]
          }
        ]
      }
    ],
    learningModules: [
      {
        name: 'Architecture Foundations & Governance',
        sections: [
          { heading: 'Core Outcomes', items: [
            'Map business drivers to architecture characteristics',
            'Design management group / subscription topology',
            'Establish tagging, policy & RBAC guardrails'
          ]},
          { heading: 'Practices', items: [
            'Landing zone mental model',
            'Platform vs workload separation',
            'Environment strategy (dev/test/stage/prod)'
          ]}
        ]
      },
      {
        name: 'Identity, Security & Secrets',
        sections: [
          { heading: 'Core Outcomes', items: [
            'Design Entra ID tenant integration',
            'Zero-trust segmentation & perimeter reduction',
            'Secrets & key lifecycle strategy'
          ]},
          { heading: 'Practices', items: [
            'Workload identity vs managed identity selection',
            'Privileged access boundaries',
            'Key Vault reference patterns'
          ]}
        ]
      },
      {
        name: 'Data & Storage Architecture',
        sections: [
          { heading: 'Core Outcomes', items: [
            'Relational vs NoSQL vs analytical store selection',
            'Tiered storage cost & performance alignment',
            'Backup / retention & lifecycle policies'
          ]},
          { heading: 'Practices', items: [
            'Throughput & partition strategy',
            'Hot / cool / archive tier movement',
            'DR & geo-redundancy trade-offs'
          ]}
        ]
      },
      {
        name: 'Compute & Application Platform',
        sections: [
          { heading: 'Core Outcomes', items: [
            'Choose VM / container / PaaS / serverless mix',
            'Design deployment & configuration strategy',
            'Implement blue/green & canary pathways'
          ]},
          { heading: 'Practices', items: [
            'Autoscale heuristics & right-sizing',
            'Image / container supply chain hardening',
            'Edge & CDN integration patterns'
          ]}
        ]
      },
      {
        name: 'Networking & Connectivity',
        sections: [
          { heading: 'Core Outcomes', items: [
            'Hybrid connectivity pattern selection',
            'Design secure ingress / egress & routing',
            'Load balancing & traffic distribution strategy'
          ]},
          { heading: 'Practices', items: [
            'Private endpoints & service endpoints',
            'DNS & name resolution design',
            'Latency & throughput optimization'
          ]}
        ]
      },
      {
        name: 'Observability & Reliability',
        sections: [
          { heading: 'Core Outcomes', items: [
            'Unified logging & metrics strategy',
            'SLO / error budget definition & dashboards',
            'Resilience test & failure mode validation'
          ]},
          { heading: 'Practices', items: [
            'Log routing & cost control',
            'Distributed tracing enrichment',
            'Incident response runbooks'
          ]}
        ]
      },
      {
        name: 'Business Continuity & DR',
        sections: [
          { heading: 'Core Outcomes', items: [
            'Align RTO/RPO with architecture layers',
            'Multi-region deployment decision matrix',
            'Backup validation & recovery drills'
          ]},
          { heading: 'Practices', items: [
            'Failover orchestration patterns',
            'Data consistency strategies',
            'Chaos injection for DR readiness'
          ]}
        ]
      },
      {
        name: 'Cost Optimization & FinOps Deep Dive',
        sections: [
          { heading: 'Core Outcomes', items: [
            'Unit economics instrumentation',
            'Reserved capacity vs on-demand strategy',
            'Continuous optimization workflow'
          ]},
          { heading: 'Practices', items: [
            'Cost anomaly detection loop',
            'Performance vs cost trade-off analysis',
            'Lifecycle & tiering automation'
          ]}
        ]
      },
      {
        name: 'Modernization & Migration',
        sections: [
          { heading: 'Core Outcomes', items: [
            'Assess & prioritize workloads for modernization',
            'Refactor vs rehost vs replatform decisioning',
            'Migration sequencing & risk reduction'
          ]},
          { heading: 'Practices', items: [
            'Inventory & dependency mapping',
            'Cutover playbooks & rollback',
            'Post-migration optimization checkpoints'
          ]}
        ]
      }
    ],
    domains: [],
    audience: ['Developers','Administrators','Security engineers','Data engineers'],
    experience: [
      'Advanced experience in IT operations (networking, virtualization, identity, security, BC/DR, data platforms, governance)',
      'Experience with Azure administration',
      'Experience with Azure development',
      'Experience with DevOps processes'
    ],
    certificationsAwarded: ['Microsoft Certified: Azure Solutions Architect Expert'],
    status: 'live'
  },
  {
    title: 'AWS Certified Solutions Architect – Associate',
    slug: makeSlug('AWS Certified Solutions Architect Associate'),
    summary: 'Associate-level blueprint (details coming soon).',
    domains: [],
    audience: [],
    experience: [],
    certificationsAwarded: ['AWS Certified Solutions Architect – Associate'],
    status: 'coming-soon'
  },
  {
    title: 'Google Professional Cloud Architect',
    slug: makeSlug('Google Professional Cloud Architect'),
    summary: 'Google Cloud architecture blueprint (details coming soon).',
    domains: [],
    audience: [],
    experience: [],
    certificationsAwarded: ['Google Professional Cloud Architect'],
    status: 'coming-soon'
  }
];

export function getSyllabusBySlug(slug: string) { return syllabi.find(s => s.slug === slug); }
