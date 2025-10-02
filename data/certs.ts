export type CertItem = {
  id: string;
  vendor: 'aws' | 'azure' | 'gcp';
  level: 'foundational' | 'associate' | 'expert' | 'professional' | 'specialty' | 'fundamentals';
  code?: string;
  title: string;
  subtitle?: string;
  courses: number;
  hours: number;
  icon?: string; // icon class, e.g., i-lucide-...
};

export const CERTS: CertItem[] = [
  // AWS Foundational
  { id: 'aws-cloud-practitioner', vendor: 'aws', level: 'foundational', title: 'Cloud Practitioner', subtitle: 'AWS Certified Cloud Practitioner', courses: 5, hours: 35, icon: 'i-lucide-badge-check' },
  // AWS Associate
  { id: 'aws-saa', vendor: 'aws', level: 'associate', code: 'SAA', title: 'Solutions Architect — Associate', courses: 7, hours: 120, icon: 'i-lucide-box' },
  { id: 'aws-dva', vendor: 'aws', level: 'associate', code: 'DVA', title: 'Developer — Associate', courses: 7, hours: 110, icon: 'i-lucide-code' },
  { id: 'aws-soa', vendor: 'aws', level: 'associate', code: 'SysOps', title: 'SysOps Admin — Associate', courses: 7, hours: 110, icon: 'i-lucide-server' },
  // AWS Professional
  { id: 'aws-sap-pro', vendor: 'aws', level: 'professional', code: 'SAP', title: 'Solutions Architect — Professional', courses: 8, hours: 140, icon: 'i-lucide-cpu' },
  { id: 'aws-devops-pro', vendor: 'aws', level: 'professional', code: 'DevOps Pro', title: 'DevOps Engineer — Professional', courses: 8, hours: 140, icon: 'i-lucide-rocket' },
  // AWS Specialty (sample)
  { id: 'aws-ans', vendor: 'aws', level: 'specialty', title: 'Advanced Networking', courses: 6, hours: 90, icon: 'i-lucide-network' },
  { id: 'aws-das', vendor: 'aws', level: 'specialty', title: 'Data Analytics', courses: 6, hours: 90, icon: 'i-lucide-bar-chart-horizontal-big' },
  { id: 'aws-db', vendor: 'aws', level: 'specialty', title: 'Database', courses: 6, hours: 90, icon: 'i-lucide-database' },
  { id: 'aws-ml', vendor: 'aws', level: 'specialty', title: 'Machine Learning', courses: 6, hours: 90, icon: 'i-lucide-brain' },
  { id: 'aws-sec', vendor: 'aws', level: 'specialty', title: 'Security', courses: 6, hours: 90, icon: 'i-lucide-shield-check' },
  { id: 'aws-sap', vendor: 'aws', level: 'specialty', title: 'SAP on AWS', courses: 6, hours: 90, icon: 'i-lucide-building-2' },

  // Azure Fundamentals
  { id: 'az-900', vendor: 'azure', level: 'fundamentals', code: 'AZ-900', title: 'Azure Fundamentals', courses: 4, hours: 35 },
  { id: 'ai-900', vendor: 'azure', level: 'fundamentals', code: 'AI-900', title: 'Azure AI Fundamentals', courses: 4, hours: 35 },
  { id: 'dp-900', vendor: 'azure', level: 'fundamentals', code: 'DP-900', title: 'Azure Data Fundamentals', courses: 4, hours: 35 },
  { id: 'sc-900', vendor: 'azure', level: 'fundamentals', code: 'SC-900', title: 'Security, Compliance & Identity', courses: 4, hours: 35 },
  { id: 'mb-910', vendor: 'azure', level: 'fundamentals', code: 'MB-910', title: 'Dynamics 365 (CRM) Fundamentals', courses: 4, hours: 35 },
  { id: 'mb-920', vendor: 'azure', level: 'fundamentals', code: 'MB-920', title: 'Dynamics 365 (ERP) Fundamentals', courses: 4, hours: 35 },

  // Azure Associate
  { id: 'az-104', vendor: 'azure', level: 'associate', code: 'AZ-104', title: 'Azure Administrator', courses: 7, hours: 100 },
  { id: 'az-204', vendor: 'azure', level: 'associate', code: 'AZ-204', title: 'Azure Developer', courses: 7, hours: 100 },
  { id: 'az-500', vendor: 'azure', level: 'associate', code: 'AZ-500', title: 'Security Engineer', courses: 7, hours: 100 },
  { id: 'az-600', vendor: 'azure', level: 'associate', code: 'AZ-600', title: 'Stack Hub Operator', courses: 7, hours: 100 },
  { id: 'dp-300', vendor: 'azure', level: 'associate', code: 'DP-300', title: 'Database Administrator', courses: 7, hours: 100 },
  { id: 'ai-102', vendor: 'azure', level: 'associate', code: 'AI-102', title: 'AI Engineer', courses: 7, hours: 100 },
  { id: 'pl-300', vendor: 'azure', level: 'associate', code: 'PL-300', title: 'Power BI Data Analyst', courses: 7, hours: 100 },
  { id: 'mb-210', vendor: 'azure', level: 'associate', code: 'MB-210', title: 'Dynamics 365 Sales', courses: 7, hours: 100 },
  { id: 'mb-220', vendor: 'azure', level: 'associate', code: 'MB-220', title: 'Dynamics 365 Marketing', courses: 7, hours: 100 },
  { id: 'mb-230', vendor: 'azure', level: 'associate', code: 'MB-230', title: 'Dynamics 365 Customer Service', courses: 7, hours: 100 },

  // Azure Expert
  { id: 'az-305', vendor: 'azure', level: 'expert', code: 'AZ-305', title: 'Solutions Architect Expert', courses: 8, hours: 120 },
  { id: 'az-400', vendor: 'azure', level: 'expert', code: 'AZ-400', title: 'DevOps Engineer Expert', courses: 8, hours: 120 },
  { id: 'sc-100', vendor: 'azure', level: 'expert', code: 'SC-100', title: 'Cybersecurity Architect Expert', courses: 8, hours: 120 },

  // Azure Specialty (samples)
  { id: 'az-220', vendor: 'azure', level: 'specialty', code: 'AZ-220', title: 'IoT Developer Specialty', courses: 6, hours: 90 },
  { id: 'az-800-801', vendor: 'azure', level: 'associate', code: 'AZ-800/801', title: 'Windows Server Hybrid Admin', courses: 6, hours: 90 },
  { id: 'sap-on-azure', vendor: 'azure', level: 'specialty', code: 'SAP', title: 'SAP on Azure Specialty', courses: 6, hours: 90 },

  // GCP foundational/associate/professional (samples)
  { id: 'gcp-cdl', vendor: 'gcp', level: 'foundational', title: 'Cloud Digital Leader', courses: 4, hours: 32 },
  { id: 'gcp-genai-leader', vendor: 'gcp', level: 'foundational', title: 'Generative AI Leader (new)', courses: 4, hours: 32 },
  { id: 'gcp-ace', vendor: 'gcp', level: 'associate', title: 'Associate Cloud Engineer', courses: 6, hours: 90 },
  { id: 'gcp-workspace-admin', vendor: 'gcp', level: 'associate', title: 'Google Workspace Administrator', courses: 6, hours: 90 },
  { id: 'gcp-data-practitioner', vendor: 'gcp', level: 'associate', title: 'Data Practitioner (new)', courses: 6, hours: 90 },
  // professional list compressed for brevity; we list a few
  { id: 'gcp-pro-arch', vendor: 'gcp', level: 'professional', title: 'Cloud Architect', courses: 8, hours: 140 },
  { id: 'gcp-pro-dev', vendor: 'gcp', level: 'professional', title: 'Cloud Developer', courses: 8, hours: 140 },
  { id: 'gcp-pro-sec', vendor: 'gcp', level: 'professional', title: 'Cloud Security Engineer', courses: 8, hours: 140 },
];

// Cards to hide from listings (kept in data for reference and deep links)
export const HIDDEN_CERT_IDS: string[] = [
  'aws-soa', // SysOps Admin — Associate
  'aws-das', // Data Analytics (AWS Specialty)
  'aws-db', // Database (AWS Specialty)
  'aws-ml', // Machine Learning (AWS Specialty)
  'aws-sec', // Security (AWS Specialty)
  'aws-sap', // SAP on AWS (AWS Specialty)
  'mb-920', // Dynamics 365 (ERP) Fundamentals
  'mb-910', // Dynamics 365 (CRM) Fundamentals
  'az-600', // Stack Hub Operator
  'ai-102', // AI Engineer
  'pl-300', // Power BI Data Analyst
  'mb-210', // Dynamics 365 Sales
  'mb-220', // Dynamics 365 Marketing
  'mb-230', // Dynamics 365 Customer Service
  'az-800-801', // Windows Server Hybrid Admin
  'az-220', // IoT Developer Specialty
  'sap-on-azure', // SAP on Azure Specialty
  'gcp-workspace-admin', // Google Workspace Administrator
];

export function byVendor(v: CertItem['vendor']) {
  return CERTS.filter(c => c.vendor === v && !HIDDEN_CERT_IDS.includes(c.id));
}

export function byVendorLevel(v: CertItem['vendor'], level: CertItem['level']) {
  return CERTS.filter(c => c.vendor === v && c.level === level && !HIDDEN_CERT_IDS.includes(c.id));
}

export function findCert(id?: string | null) {
  if (!id) return undefined;
  return CERTS.find(c => c.id === id);
}
