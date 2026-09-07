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
   * Retrieval"), for the Systems Map: always evidence-backed by the case
   * study text above, never a bare keyword. */
  capabilities?: string[];
  /** Evidence-based domain tags for the /projects filter, kept separate
   * from `stack` (technology) on purpose. A project may carry up to two. */
  domains?: string[];
  /** A screenshot of the actual deployed or locally
   * run application, never a stock image or invented interface. `kind`
   * controls the caption prefix so nothing is ever implied to be more
   * (or less) real than it is. */
  evidenceImages?: {
    src: string;
    alt: string;
    caption: string;
    kind: "live-screenshot" | "local-demonstration";
  }[];
};

export const projects: Project[] = [
  {
    slug: "accesspath",
    name: "AccessPath",
    tagline: "Pedestrian routing that separates missing evidence from accessible streets",
    stack: ["Python", "FastAPI", "PostGIS", "React", "MapLibre"],
    timeframe: "Sep 2026",
    problem:
      "Most route planners optimize distance and quietly treat streets with no accessibility data as if they were known to be usable. For someone navigating curb ramps, missing sidewalks, obstacles, or damaged surfaces, that uncertainty matters.",
    approach:
      "I built a Seattle routing prototype over 213K OpenStreetMap pedestrian segments and 262K Project Sidewalk labels. It compares shortest, accessibility-optimized, and confidence-aware routes while keeping unknown, low-confidence, and disputed evidence separate. Adversarial testing exposed a flaw in my first weighted-average score: enough positive reports could outvote one reliable report of no sidewalk. I replaced it with a dominance-aware risk model that preserves severe hazards instead of averaging them away.",
    architectureNote:
      "An offline spatial pipeline matches crowdsourced labels to the pedestrian graph in PostGIS. Reliability and hazard-dominance rules score each segment, FastAPI runs three A* searches with different edge costs, and React with MapLibre shows the routes and the uncertainty behind each one.",
    results:
      "In a frozen set of eight curated examples, five of seven connected pairs produced different route choices. Confidence-aware routing reduced exposure to completely unknown segments whenever an alternative existed, but increased exposure to low-confidence evidence in three of those five cases. This is a research prototype, not a safety-certified navigation tool, and the small evaluation does not establish citywide effectiveness.",
    stats: [
      { label: "Crowdsourced labels", value: "262K" },
      { label: "Pedestrian segments", value: "213K" },
      { label: "Connected pairs with route divergence", value: "5 of 7" },
    ],
    demoUrl: "https://accesspath-silk.vercel.app/",
    repoUrl: "https://github.com/MdFaisalS2025/accesspath",
    capabilities: ["Geospatial Routing", "Evaluation"],
    domains: ["Data Products", "Accessibility"],
    evidenceImages: [
      {
        src: "/images/case-studies/accesspath-route-comparison.png",
        alt: "AccessPath live map comparing shortest, accessibility-optimized, and confidence-aware pedestrian routes in Seattle",
        caption: "The public demo comparing three real routes. It exposes documented hazards, unknown coverage, confidence, and any graph-snap adjustment instead of presenting one route as universally safe.",
        kind: "live-screenshot",
      },
    ],
  },
  {
    slug: "raey",
    name: "RAEY",
    tagline: "Source-cited AI answers for hospital SOPs",
    stack: ["Python", "Next.js", "Docker", "RAG"],
    timeframe: "Aug 2026 – Present",
    problem:
      "Hospital staff need answers from dense SOP documents fast, and a wrong or unsourced answer in a clinical setting can hurt someone.",
    approach:
      "Every RAEY answer has to point back to the exact line in the source SOP it came from; if it can't, the system won't show it. I founded RAEY, led product discovery, and built the full stack myself: retrieval, verification, Next.js, and Docker. It's pre-launch, and the research log is public, including what hasn't worked yet.",
    architectureNote:
      "SOP documents flow through a retrieval layer, then a verification layer that checks every claim against its source before an answer is ever shown, and finally out as a cited answer.",
    results:
      "A 218-case evaluation shows the system catches 85% of answers with unsafe errors while still passing 82% of valid ones.",
    stats: [
      { label: "Unsafe-error catch rate", value: "85%" },
      { label: "Valid-answer pass rate", value: "82%" },
      { label: "Evaluation cases", value: "218" },
    ],
    capabilities: ["Trustworthy Retrieval"],
    domains: ["Healthcare AI", "Trustworthy Retrieval"],
    researchLogUrl: "https://github.com/MdFaisalS2025/RAEY-SOP-Research",
    evidenceImages: [
      {
        src: "/images/case-studies/raey-ask-empty.png",
        alt: "The 'Ask RAEY' question interface, empty state, with example questions",
        caption: "The retrieval interface, running against a 22-SOP synthetic corpus with the LLM provider set to mock/self-hosted mode. No hospital information is involved.",
        kind: "local-demonstration",
      },
      {
        src: "/images/case-studies/raey-answer-citations.png",
        alt: "A stored RAEY conversation showing a numbered, cited sepsis-management answer with a source SOP citation card",
        caption: "A previously stored answer (not a fresh model call), generated by the mock provider against synthetic SOP data: the numbered answer, inline citation markers, and a source citation card with SOP version and review status.",
        kind: "local-demonstration",
      },
      {
        src: "/images/case-studies/raey-architecture.png",
        alt: "RAEY's public architecture page showing its six-stage query pipeline and technology stack",
        caption: "The app's own architecture page: the six-stage pipeline (intake, retrieval, reasoning, verification, confidence gate, output) and technology stack, with a worked example trace using synthetic data. RAEY has no public deployment yet.",
        kind: "local-demonstration",
      },
      {
        src: "/images/case-studies/raey-dashboard.png",
        alt: "RAEY's clinical dashboard showing SOP library entries, an evidence-watch alert, and open governance proposals",
        caption: "The dashboard's SOP library, evidence-watch, and governance/proposal workflow, shown with synthetic data. The app itself labels this illustrative, not a live feed.",
        kind: "local-demonstration",
      },
    ],
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
      { label: "Earlier than NEWS2, evaluation only", value: "2.7 hrs" },
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
      "I trained federated failure-prediction models across simulated client datasets without ever pooling raw data, and built a cost model translating failure-detection rates into projected savings.",
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
      "A three-person team built this full-stack MVC app together, answering plain-English questions through Chart.js dashboards backed by live World Bank data and an ERD-modeled SQL database. My contribution focused on frontend development, deployment, and the conversational chatbot integration; one teammate led UI/UX design, the ERD, and documentation, and another teammate built the controllers, charts, and data services (per the repository's own team-credits page).",
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
    evidenceImages: [
      {
        src: "/images/case-studies/data-explorer-dashboard.png",
        alt: "The dashboard homepage showing aggregate state statistics alongside live GDP and population figures pulled from the World Bank API",
        caption: "The World Bank figures shown ($30.7T GDP, 341.8M population, year 2025) were fetched live from the public API at capture time, not hardcoded.",
        kind: "local-demonstration",
      },
      {
        src: "/images/case-studies/data-explorer-charts.png",
        alt: "Bar and line Chart.js visualizations ranking the top 10 states by population and by GDP",
        caption: "The Chart.js views, generated from the same dataset shown on the dashboard.",
        kind: "local-demonstration",
      },
      {
        src: "/images/case-studies/data-explorer-erd.png",
        alt: "Entity-relationship diagram showing Region, State, and City tables with primary and foreign key relationships",
        caption: "The project's own documented entity-relationship diagram (Region → State → City), from its About/Documentation page.",
        kind: "local-demonstration",
      },
    ],
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
    evidenceImages: [
      {
        src: "/images/case-studies/f1-live-empty.png",
        alt: "The live, publicly deployed F-1 Policy Intelligence homepage, showing the question box, example questions, and the unofficial-project disclaimer",
        caption: "From the public deployment: the question interface and the required disclaimer. A live answer isn't captured here, since generating one calls the (free-tier) Gemini API, which this audit didn't trigger.",
        kind: "live-screenshot",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
