import { projects } from "./projects";
import { experience, type Role } from "./experience";

export type NodeType = "project" | "role" | "capability";

export type GraphNode = {
  id: string;
  type: NodeType;
  label: string;
  /** Org for a role, tagline for a project, undefined for a capability. */
  sublabel?: string;
  /** Period/timeframe, shown as small metadata text. */
  meta?: string;
  /** Where selecting this node's "view" action should go. */
  href?: string;
  /** One headline number, for project nodes' preview panel. */
  stat?: { value: string; label: string };
  /** Category tags for capability nodes only, used by the mobile map's
   * search/filter UI. A capability carries one category unless splitting
   * it across two genuinely helps someone find it. */
  categories?: string[];
};

export const CAPABILITY_CATEGORIES = [
  "AI & Retrieval",
  "Data & Modeling",
  "Systems & Engineering",
  "Healthcare & Teaching",
  "Leadership & Operations",
  "Web & Growth",
] as const;

export type CapabilityCategory = (typeof CAPABILITY_CATEGORIES)[number];

// Every real capability name in the graph, grouped for discovery — grouping
// only, never a source of new claims (the categories add no capabilities
// that aren't already backed by a role or project field elsewhere).
const CATEGORY_BY_CAPABILITY: Record<string, CapabilityCategory[]> = {
  RAG: ["AI & Retrieval"],
  "Trustworthy Retrieval": ["AI & Retrieval"],
  "Hybrid Retrieval": ["AI & Retrieval"],
  BM25: ["AI & Retrieval"],
  "Neural Reranking": ["AI & Retrieval"],
  "LLM Reranker": ["AI & Retrieval"],
  "LLM-as-judge": ["AI & Retrieval"],
  "Multi-agent": ["AI & Retrieval"],
  "Healthcare AI": ["AI & Retrieval"],

  SQL: ["Data & Modeling"],
  PostgreSQL: ["Data & Modeling"],
  ERD: ["Data & Modeling"],
  "Chart.js": ["Data & Modeling"],
  PCA: ["Data & Modeling"],
  "Random Forest": ["Data & Modeling"],
  ANOVA: ["Data & Modeling"],
  "Cross-Validation": ["Data & Modeling"],
  "Applied Machine Learning": ["Data & Modeling"],
  "Spectral Analysis": ["Data & Modeling"],
  "Cost Modeling": ["Data & Modeling"],

  Python: ["Systems & Engineering"],
  "C++": ["Systems & Engineering"],
  "Next.js": ["Systems & Engineering"],
  Docker: ["Systems & Engineering"],
  Azure: ["Systems & Engineering"],
  "Federated Learning": ["Systems & Engineering"],
  "Blockchain Architecture": ["Systems & Engineering"],
  "Smart Contracts": ["Systems & Engineering"],
  "Wallet Integrations": ["Systems & Engineering"],
  "Distributed Systems": ["Systems & Engineering"],
  FHE: ["Systems & Engineering"],
  Reliability: ["Systems & Engineering"],
  Latency: ["Systems & Engineering"],

  "Hospital Information Systems": ["Healthcare & Teaching"],
  "Hospital SOP Intelligence Platform": ["Healthcare & Teaching"],
  "University Teaching": ["Healthcare & Teaching"],
  "Student Development": ["Healthcare & Teaching"],

  "Startup Leadership": ["Leadership & Operations"],
  "Technical Leadership": ["Leadership & Operations"],
  "Product Discovery": ["Leadership & Operations"],
  Evaluation: ["Leadership & Operations"],
  Verification: ["Leadership & Operations"],
  "Stakeholder Discovery": ["Leadership & Operations"],
  "Requirements Gathering": ["Leadership & Operations"],
  "Microsoft 365": ["Leadership & Operations"],
  "Copilot Studio": ["Leadership & Operations"],
  "Business Analysis": ["Leadership & Operations"],
  "Workflow Design": ["Leadership & Operations"],
  "Supply-Chain Analysis": ["Leadership & Operations"],
  "Process Improvement": ["Leadership & Operations"],
  "Customer Behavior": ["Leadership & Operations"],
  "Retail Operations": ["Leadership & Operations"],

  SEO: ["Web & Growth"],
  WordPress: ["Web & Growth"],
};

export type GraphEdge = {
  source: string;
  target: string;
};

function slugify(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function roleId(role: Role) {
  return `role-${slugify(`${role.org}-${role.title}`)}`;
}

export function capabilityId(name: string) {
  return `capability-${slugify(name)}`;
}

export const projectNodes: GraphNode[] = projects.map((p) => ({
  id: p.slug,
  type: "project",
  label: p.name,
  sublabel: p.tagline,
  meta: p.timeframe,
  href: `/projects/${p.slug}`,
  stat: p.stats[0],
}));

export const roleNodes: GraphNode[] = experience.map((r) => ({
  id: roleId(r),
  type: "role",
  label: r.title,
  sublabel: r.org,
  meta: r.period,
  href: r.projectSlug ? `/projects/${r.projectSlug}` : "/experience",
}));

// Deduplicated union of every project's real `stack` + `capabilities`, and
// every role's real `capabilities` — every name here traces back to an
// explicit field on real content, never invented independently.
const capabilityNames = Array.from(
  new Set([
    ...projects.flatMap((p) => [...p.stack, ...(p.capabilities ?? [])]),
    ...experience.flatMap((r) => r.capabilities ?? []),
  ])
);

export const capabilityNodes: GraphNode[] = capabilityNames.map((name) => ({
  id: capabilityId(name),
  type: "capability",
  label: name,
  categories: CATEGORY_BY_CAPABILITY[name],
}));

export const graphNodes: GraphNode[] = [
  ...capabilityNodes,
  ...projectNodes,
  ...roleNodes,
];

export const graphEdges: GraphEdge[] = [
  // Role -> project, only for roles that actually produced a case study.
  ...experience
    .filter((r): r is Role & { projectSlug: string } => !!r.projectSlug)
    .map((r) => ({ source: roleId(r), target: r.projectSlug })),
  // Project -> capability, one edge per real stack entry or tagged capability.
  ...projects.flatMap((p) =>
    [...p.stack, ...(p.capabilities ?? [])].map((s) => ({
      source: p.slug,
      target: capabilityId(s),
    }))
  ),
  // Role -> capability, one edge per capability actually evidenced in that
  // role's bullets.
  ...experience.flatMap((r) =>
    (r.capabilities ?? []).map((c) => ({
      source: roleId(r),
      target: capabilityId(c),
    }))
  ),
];

export function getNode(id: string): GraphNode | undefined {
  return graphNodes.find((n) => n.id === id);
}

/** All node ids directly connected to `nodeId`, either direction. */
export function neighborsOf(nodeId: string): string[] {
  const ids = new Set<string>();
  for (const e of graphEdges) {
    if (e.source === nodeId) ids.add(e.target);
    if (e.target === nodeId) ids.add(e.source);
  }
  return Array.from(ids);
}
