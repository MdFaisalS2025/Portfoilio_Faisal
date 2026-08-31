export type Role = {
  org: string;
  title: string;
  /** Optional sub-line under `title` for a role whose full title would
   * otherwise crowd the Experience timeline heading and the Systems Map's
   * role column (e.g. "Graduate Teaching Assistant" + this specialization,
   * rather than one long compound title). The canonical full meaning stays
   * available to assistive tech via aria-label on the heading. */
  specialization?: string;
  location: string;
  period: string;
  bullets: string[];
  projectSlug?: string;
  /** Real capabilities demonstrated in this role, evidenced by the bullets
   * above — connected as Systems Map edges, never decorative additions. */
  capabilities?: string[];
};

export const experience: Role[] = [
  {
    org: "RAEY",
    title: "Founder & AI Engineer",
    location: "Tampa, Florida",
    period: "Aug 2026 – Present",
    bullets: [
      "Founded RAEY to make hospital SOPs searchable through source-cited AI answers. Led product discovery and built the full stack across retrieval, verification, Next.js, and Docker.",
      "Made trust the product requirement: every answer cites its source, while a 218-case evaluation catches 85% of answers with unsafe errors and passes 82% of valid answers.",
    ],
    projectSlug: "raey",
    capabilities: [
      "Startup Leadership",
      "Technical Leadership",
      "Product Discovery",
      "Trustworthy Retrieval",
      "Evaluation",
      "Verification",
      "Next.js",
      "Python",
      "Docker",
      "RAG",
    ],
  },
  {
    org: "University of South Florida, Muma College of Business",
    title: "Graduate Teaching Assistant",
    specialization: "Healthcare AI Research & Instruction",
    location: "Tampa, Florida",
    period: "May 2026 – Present",
    bullets: [
      "Leading development of a Hospital SOP Intelligence Platform using generative AI and intelligent retrieval, and engineered SENTINEL, a 6-agent system that flags patient deterioration, explains the cause, and suggests next steps. Detected deterioration 2.7 hours earlier than NEWS2 on synthetic patient data.",
      "Benchmarked four reasoning approaches on accuracy, lead time, and cost; the rule-based baseline performed best. Supported instruction, grading, and student engagement across two graduate courses with 500+ students, including Power BI and Tableau.",
    ],
    projectSlug: "sentinel",
    capabilities: [
      "Healthcare AI",
      "Hospital Information Systems",
      "University Teaching",
      "Student Development",
      "Hospital SOP Intelligence Platform",
    ],
  },
  {
    org: "Microsoft",
    title: "Microsoft Student Ambassador",
    location: "Tampa, Florida",
    period: "Jan 2026 – Present",
    bullets: [
      "Led discovery with USF Graduate Advising, documented the requirements, and delivered a Microsoft 365 workflow the team could operate independently.",
      "Consolidated manual records into one system covering 100% of recruiting events, reducing duplicate entry and saving 3 to 4 staff hours per month.",
    ],
    capabilities: [
      "Stakeholder Discovery",
      "Requirements Gathering",
      "Microsoft 365",
      "Copilot Studio",
      "Business Analysis",
      "Workflow Design",
      "Technical Leadership",
    ],
  },
  {
    org: "University of South Florida",
    title: "Research Assistant - Applied Machine Learning",
    location: "Tampa, Florida",
    period: "Jan 2025 – Jan 2026",
    bullets: [
      "Classified Mg-doped ZnO samples from photoluminescence spectra using PCA and Random Forest in Python. Two components captured over 95% of the variance.",
      "Established the lab's first automated baseline at 0.72 mean accuracy under cross-validation, replacing manual interpretation of spectra.",
    ],
    capabilities: [
      "Spectral Analysis",
      "PCA",
      "Random Forest",
      "ANOVA",
      "Python",
      "Cross-Validation",
      "Applied Machine Learning",
    ],
  },
  {
    org: "Vee4 Software",
    title: "Blockchain Engineer (C++ / Python)",
    location: "United Arab Emirates",
    period: "Sep 2022 – Nov 2024",
    bullets: [
      "Launched a Blockchain Name Service that mapped readable names to wallet addresses, simplifying transfers and contributing to a 40% increase in active users.",
      "Implemented Fully Homomorphic Encryption and federated learning so models could learn from client data without centralizing the raw records.",
    ],
    capabilities: [
      "C++",
      "Python",
      "Blockchain Architecture",
      "Smart Contracts",
      "Wallet Integrations",
      "Distributed Systems",
      "FHE",
      "Federated Learning",
      "Reliability",
      "Latency",
    ],
  },
  {
    org: "TechResx Technologies",
    title: "SEO Analyst & WordPress Developer",
    location: "Chennai, India",
    period: "Mar 2021 – Mar 2022",
    bullets: [
      "Increased site traffic 20% and average session duration 25% within three months through SEO and Google Ads analysis.",
      "Developed and customized WordPress sites in PHP with third-party API integrations.",
    ],
    capabilities: ["SEO", "WordPress"],
  },
  {
    org: "United National Dairy Company (Rayan)",
    title: "Sales Operations Analyst Intern",
    location: "Manama, Bahrain",
    period: "May 2019 – Jul 2019",
    bullets: [
      "Analyzed supply-chain workflows from manufacturing to retail and identified process gaps, recommending improvements to branch operations.",
      "Supported branch operations and customer interactions, building early experience in retail management, customer behavior, and product flow.",
    ],
    capabilities: [
      "Supply-Chain Analysis",
      "Process Improvement",
      "Customer Behavior",
      "Retail Operations",
      "Business Analysis",
    ],
  },
];

export const education = [
  {
    school: "University of South Florida",
    degree: "M.S., Artificial Intelligence and Business Analytics",
    period: "2025 – 2027",
  },
  {
    school: "College of Engineering, Anna University",
    degree: "B.E., Computer Science and Engineering",
    period: "Aug 2015 – 2020",
  },
  {
    school: "Besant Technologies, Chennai",
    degree: "Python and C++ programming coursework",
    period: "2020 – 2021",
  },
  {
    school: "The New Indian School",
    degree: "High School Diploma, Mathematics and Computer Science",
    period: "2003 – 2015",
  },
];

// Certifications now live in lib/data/credentials.ts (grouped, typed, with
// a dedicated /credentials page) — see that file instead of this one.
