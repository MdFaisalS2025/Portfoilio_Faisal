export type CredentialType = "certification" | "course" | "simulation" | "program";

export const CREDENTIAL_TYPE_LABEL: Record<CredentialType, string> = {
  certification: "Professional certification",
  course: "Course",
  simulation: "Job simulation",
  program: "Program completion",
};

export type CredentialGroup =
  | "AI & Data"
  | "Cloud & Platforms"
  | "Business & Operations"
  | "Academic Foundations";

export const CREDENTIAL_GROUPS: CredentialGroup[] = [
  "AI & Data",
  "Cloud & Platforms",
  "Business & Operations",
  "Academic Foundations",
];

export type Credential = {
  name: string;
  issuer: string;
  type: CredentialType;
  issued: string;
  expires?: string;
  group: CredentialGroup;
  /** Public verification URL, when one exists — omitted rather than
   * guessed. Credential IDs are never displayed. */
  verifyUrl?: string;
  featured?: boolean;
};

export const credentials: Credential[] = [
  {
    name: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
    issuer: "Oracle",
    type: "certification",
    issued: "Aug 2025",
    expires: "Aug 2027",
    group: "AI & Data",
    featured: true,
  },
  {
    name: "SnowPro Associate: Platform Certification",
    issuer: "Snowflake",
    type: "certification",
    issued: "Dec 2025",
    expires: "Dec 2027",
    group: "Cloud & Platforms",
    featured: true,
  },
  {
    name: "Career Essentials in Data Analysis",
    issuer: "Microsoft and LinkedIn",
    type: "course",
    issued: "Feb 2026",
    group: "AI & Data",
    featured: true,
  },
  {
    name: "2026 USF–Microsoft Student Ambassador Program Completion",
    issuer: "Microsoft",
    type: "program",
    issued: "Apr 2026",
    group: "Business & Operations",
    featured: true,
  },
  {
    name: "Data Analytics Job Simulation",
    issuer: "Deloitte Australia (via Forage)",
    type: "simulation",
    issued: "Aug 2026",
    group: "AI & Data",
  },
  {
    name: "Developing AI Applications on Azure",
    issuer: "Coursera",
    type: "course",
    issued: "Jan 2020",
    group: "AI & Data",
  },
  {
    name: "Microeconomics: The Power of Markets",
    issuer: "University of Pennsylvania",
    type: "course",
    issued: "Dec 2024",
    group: "Academic Foundations",
  },
  {
    name: "AC105x: Financial Accounting and Analysis",
    issuer: "IIM Bangalore (edX)",
    type: "course",
    issued: "Dec 2024",
    group: "Academic Foundations",
  },
  {
    name: "Lean Six Sigma White Belt Certification",
    issuer: "Management & Strategy Institute",
    type: "certification",
    issued: "Oct 2020",
    group: "Business & Operations",
  },
  {
    name: "Project Management Essentials",
    issuer: "Management & Strategy Institute",
    type: "course",
    issued: "Oct 2020",
    group: "Business & Operations",
  },
];

export const featuredCredentials = credentials.filter((c) => c.featured);
