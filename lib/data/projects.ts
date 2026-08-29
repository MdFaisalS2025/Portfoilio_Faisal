export type ProjectStat = {
  label: string;
  value: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  stack: string[];
  timeframe: string;
  problem: string;
  approach: string;
  architectureNote: string;
  results: string;
  stats: ProjectStat[];
  /** Live demo link, when one exists publicly. */
  demoUrl?: string;
  /** Public source repository, when one exists and is presentable. */
  repoUrl?: string;
  /** Public research writeup/proposal repo, when the project's case-study
   * copy specifically promises one (e.g. RAEY's research log). */
  researchLogUrl?: string;
  /** Thematic capabilities beyond the literal tech stack (e.g. "Trustworthy
   * Retrieval"), for the Systems Map — always evidence-backed by the case
   * study text above, never a bare keyword. */
  capabilities?: string[];
  /** Evidence-based domain tags for the /projects filter — kept separate
   * from `stack` (technology) on purpose. A project may carry up to two. */
  domains?: string[];
};

export const projects: Project[] = [
  {
    slug: "raey",
    name: "RAEY",
    tagline: "Source-cited AI answers for hospital SOPs",
    stack: ["Python", "Next.js", "Docker", "RAG"],
    timeframe: "Aug 2026 – Present",
    problem:
      "Hospital staff need answers from dense SOP documents fast, but a wrong or unsourced answer in a clinical setting is dangerous, not just inconvenient.",
    approach:
      "I founded RAEY and set one hard rule from day one: every answer must cite its source. I led product discovery and built the full stack myself, across retrieval, verification, Next.js, and Docker. RAEY is pre-launch and publishes its own research log, including what worked and what didn't, because a hospital-facing system should be honest before it's impressive.",
    architectureNote:
      "SOP documents flow through a retrieval layer, then a verification layer that checks every claim against its source before an answer is ever shown, and finally out as a cited answer.",
    results:
      "A 218-case evaluation shows the system catches 85% of answers with unsafe errors while still passing 82% of valid ones. Trust measured, not assumed.",
    stats: [
      { label: "Unsafe-error catch rate", value: "85%" },
      { label: "Valid-answer pass rate", value: "82%" },
      { label: "Evaluation cases", value: "218" },
    ],
    capabilities: ["Trustworthy Retrieval"],
    domains: ["Healthcare AI", "Trustworthy Retrieval"],
    researchLogUrl: "https://github.com/MdFaisalS2025/RAEY-SOP-Research",
  },
  {
    slug: "sentinel",
    name: "SENTINEL",
    tagline: "A 6-agent system that catches patient deterioration early",
    stack: ["Python", "Multi-agent", "Healthcare AI"],
    timeframe: "May 2026 – Present",
    problem:
      "Patient deterioration on a hospital floor is often caught too late for early intervention to matter, and existing scores like NEWS2 flag risk without explaining why or what to do next.",
    approach:
      "As a Graduate Teaching Assistant in Healthcare AI at USF, I designed SENTINEL, a 6-agent system that flags deterioration, explains the cause, and suggests next steps. I benchmarked four reasoning approaches on accuracy, lead time, and cost.",
    architectureNote:
      "Six specialized agents watch different signal streams and report into a shared patient timeline; when their evidence converges, SENTINEL raises an explained alert well before a NEWS2 threshold would trip.",
    results:
      "SENTINEL detected deterioration 2.7 hours earlier than NEWS2 on synthetic patient data. The simpler rule-based baseline actually outperformed heavier reasoning approaches, a result I reported honestly rather than the one I expected going in.",
    stats: [
      { label: "Earlier than NEWS2", value: "2.7 hrs" },
      { label: "Agents", value: "6" },
      { label: "Students taught", value: "500+" },
    ],
    domains: ["Healthcare AI", "Multi-Agent Systems"],
  },
  {
    slug: "swiss-legal-rag",
    name: "Swiss Legal RAG",
    tagline: "Agentic legal retrieval with zero fabricated citations",
    stack: ["Python", "BM25", "Neural Reranking", "LLM-as-judge"],
    timeframe: "Dec 2025 – May 2026",
    problem:
      "Legal research over hundreds of thousands of articles and court records is slow, and an AI system that hallucinates even one citation is worse than no system at all.",
    approach:
      "I queried 175K legal articles and 2.4 GB of court records using BM25, neural reranking, and LLM citation checks, then improved retrieval quality further with adaptive top-K retrieval and cross-lingual term mapping for Swiss law's multiple languages.",
    architectureNote:
      "A BM25 shortlist narrows 175K articles down fast, a neural reranker reorders that shortlist for relevance, and a final LLM citation-check gate blocks any answer whose citation doesn't actually check out.",
    results:
      "Zero fabricated citations in evaluation, and a 19% improvement in macro-F1 over the baseline.",
    stats: [
      { label: "Fabricated citations", value: "0" },
      { label: "Macro-F1 improvement", value: "+19%" },
      { label: "Legal articles indexed", value: "175K" },
    ],
    capabilities: ["Trustworthy Retrieval"],
    domains: ["Legal AI", "Trustworthy Retrieval"],
  },
  {
    slug: "ai-control-hub",
    name: "AI Control Hub",
    tagline: "Federated predictive maintenance without pooling raw data",
    stack: ["Python", "Federated Learning", "Cost Modeling"],
    timeframe: "Dec 2025 – May 2026",
    problem:
      "Predicting equipment failure across multiple clients usually means pooling their raw operational data in one place, and most clients won't agree to that.",
    approach:
      "I trained federated failure-prediction models across simulated client datasets without ever pooling raw data, and built a cost model translating failure-detection rates into real projected savings.",
    architectureNote:
      "Each simulated client trains locally on its own data. Only model updates travel to a central aggregator, never raw records, and the aggregator folds them into a shared failure-prediction model.",
    results:
      "The system detected 80% of failures in evaluation, and the cost model projected approximately $400K in annual savings.",
    stats: [
      { label: "Failures detected", value: "80%" },
      { label: "Projected annual savings", value: "$400K" },
    ],
    domains: ["Privacy-Preserving ML", "Industrial AI"],
  },
  {
    slug: "data-explorer",
    name: "Conversational AI Data Explorer",
    tagline: "Plain-English questions over live U.S. state data",
    stack: ["SQL", "ERD", "Chart.js", "Azure"],
    timeframe: "Aug 2025 – Dec 2025",
    problem:
      "Exploring U.S. state-level data usually means already knowing SQL, or waiting on someone who does.",
    approach:
      "I defined the dashboard questions and data model before writing any code, then built a full-stack MVC app that answers plain-English questions through Chart.js dashboards backed by live World Bank data and an ERD-modeled SQL database.",
    architectureNote:
      "A schema-first relational model backs the app; a question layer maps plain-English questions onto that schema and renders the result as a live Chart.js dashboard.",
    results:
      "Shipped and deployed on Azure as a working, full-stack MVC application.",
    stats: [
      { label: "Data source", value: "Live World Bank data" },
      { label: "Deployment", value: "Azure" },
    ],
    domains: ["Data Products", "Analytics"],
    repoUrl: "https://github.com/MdFaisalS2025/ISM-6225_US-states-website",
  },
  {
    slug: "f1-policy-intelligence",
    name: "F-1 Policy Intelligence",
    tagline: "Source-cited answers to F-1 visa questions for USF international students",
    stack: ["Python", "Hybrid Retrieval", "PostgreSQL", "LLM Reranker"],
    timeframe: "Aug 2026 – Present",
    problem:
      "F-1 status, CPT, OPT, grace periods, and work authorization questions are scattered across USF policy pages and federal regulation, and getting a straight, correctly-cited answer is hard even when the information technically exists.",
    approach:
      "I built an independent, unofficial Q&A tool over USF international-services guidance, USF forms, and federal regulation in 8 CFR pulled from the eCFR API. Retrieval combines dense embeddings with PostgreSQL full-text search, fused with Reciprocal Rank Fusion, then reranked by an LLM with an abstention gate and exact-term handling for vocabulary like \"I-765\" and \"60-day grace period\" that dense search alone tends to blur past.",
    architectureNote:
      "A question is retrieved two ways at once, by dense embedding similarity and by PostgreSQL full-text search, and the two result sets are merged with Reciprocal Rank Fusion. An LLM reranker re-orders the fused list and can abstain rather than answer if nothing retrieved actually supports a confident answer; every answer that is returned carries its source citation.",
    results:
      "On a 28-question evaluation set: 100% abstention accuracy (it correctly declines to answer when it should) and 99.3% citation faithfulness. Evaluation is wired into CI, tracking Recall@5, Recall@10, and MRR across retrieval ablations. This is an independent student project, not an official USF service, and it always shows a disclaimer directing students to USF International Services or an immigration attorney for anything that matters.",
    stats: [
      { label: "Abstention accuracy", value: "100%" },
      { label: "Citation faithfulness", value: "99.3%" },
      { label: "Evaluation questions", value: "28" },
    ],
    demoUrl: "https://usf-f1-policy-intelligence.vercel.app/",
    repoUrl: "https://github.com/MdFaisalS2025/USF_F1_policy_intelligence",
    capabilities: ["Trustworthy Retrieval"],
    domains: ["Policy Intelligence", "Trustworthy Retrieval"],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
