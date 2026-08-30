export type ArchiveEntry = {
  name: string;
  year: string;
  domain: string;
  role: string;
  outcome: string;
  evidenceSource: string;
  href: string;
  capabilities: string[];
};

/**
 * Smaller, credible entries that don't justify a full case study — each one
 * verified against its own public repository README before being added
 * here. Curated deliberately small: several other public repos exist but
 * were excluded as coursework wrapper apps too thin to add real signal (see
 * the redesign handoff for the full candidate inventory). Hide this
 * component entirely if this array is ever empty.
 */
export const archiveEntries: ArchiveEntry[] = [
  {
    name: "Speed Racer RL",
    year: "2026",
    domain: "Reinforcement learning / simulation",
    role: "Solo builder",
    outcome:
      "Custom C++ 2D racing simulator with LIDAR-style raycasting perception, training a DQN agent via LibTorch in a headless loop with a separate Raylib replay tool for visual evaluation.",
    evidenceSource: "Public GitHub repository, README",
    href: "https://github.com/MdFaisalS2025/Racing_Car_DQN",
    capabilities: ["Reinforcement Learning", "C++", "Simulation"],
  },
  {
    name: "SignalDesk Weekly Health Check",
    year: "2026",
    domain: "Applied analytics / data quality",
    role: "Solo, coursework track",
    outcome:
      "A dependency-light health-check script over a messy 41-row product-usage export; found that confidence tracked rating well overall (Spearman ~+0.72) but flipped to ~0 inside one flagged sub-series, catching a repeat pattern a naive pandas dedup would have missed.",
    evidenceSource: "Public GitHub repository, README",
    href: "https://github.com/MdFaisalS2025/signaldesk-health-check",
    capabilities: ["Data Quality", "Python", "Applied Analytics"],
  },
  {
    name: "AI Competitor Intelligence Agent Team",
    year: "2026",
    domain: "Multi-agent systems / market research",
    role: "Solo builder",
    outcome:
      "A coordinated multi-agent Streamlit app that discovers competitors, crawls their sites, and produces structured comparisons and market-gap insights.",
    evidenceSource: "Public GitHub repository, README",
    href: "https://github.com/MdFaisalS2025/competitor_agent_team",
    capabilities: ["Multi-agent", "Python"],
  },
  {
    name: "Chat with arXiv Research Papers",
    year: "2026",
    domain: "Retrieval-augmented generation / research tooling",
    role: "Solo builder",
    outcome:
      "A conversational RAG application for querying arXiv papers in natural language, built on GPT-4o with a Streamlit interface.",
    evidenceSource: "Public GitHub repository, README",
    href: "https://github.com/MdFaisalS2025/research_paper_chat_ai",
    capabilities: ["RAG", "Python"],
  },
  {
    name: "Predicting Building Energy Efficiency",
    year: "2025",
    domain: "Applied ML / sustainability",
    role: "Coursework project (ISM 6136)",
    outcome:
      "An ML workflow — cleaning, feature engineering, and modeling — predicting NYC buildings' Energy Star Score from Local Law 84 disclosure data, aimed at flagging buildings for energy audits.",
    evidenceSource: "Public GitHub repository, README",
    href: "https://github.com/MdFaisalS2025/ISM-6136_ML-Project",
    capabilities: ["Applied Machine Learning", "Python"],
  },
];
