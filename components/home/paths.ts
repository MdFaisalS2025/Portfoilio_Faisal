import { experience } from "@/lib/data/experience";
import { roleId, capabilityId } from "@/lib/data/graph";

function role(org: string) {
  const r = experience.find((e) => e.org === org);
  if (!r) throw new Error(`paths: no role found for org "${org}"`);
  return roleId(r);
}

const RAEY_FOUNDER = role("RAEY");
const GRAD_TA = role("University of South Florida, Muma College of Business");
const MICROSOFT = role("USF Information Technology (USF IT)");
const RESEARCH_ASSISTANT = role("University of South Florida");
const VEE4 = role("Vee4 Software");
const TECHRESX = role("TechResx Technologies");
const BAHRAIN = role("United National Dairy Company (Rayan)");

export type Path = {
  id: string;
  label: string;
  description: string;
  nodeIds: string[];
};

/**
 * Five audience-oriented journeys through the same evidence the Systems Map
 * already shows. Every id here is a real node (project slug, role, or
 * capability) already present in the graph. Selecting one drives the map's
 * `pathHighlight` state; nothing here is a separate claim, and none of
 * these relationships are invented for the sake of having five options.
 */
export const PATHS: Path[] = [
  {
    id: "recruiter",
    label: "Recruiter",
    description: "The strongest measured outcomes, plus the roles that produced them.",
    nodeIds: [
      "raey",
      "sentinel",
      "f1-policy-intelligence",
      RAEY_FOUNDER,
      GRAD_TA,
      capabilityId("Technical Leadership"),
    ],
  },
  {
    id: "technical-reviewer",
    label: "Technical reviewer",
    description: "How the retrieval systems are built and evaluated, including the trade-offs.",
    nodeIds: [
      capabilityId("Evaluation"),
      capabilityId("Verification"),
      capabilityId("Trustworthy Retrieval"),
      capabilityId("Neural Reranking"),
      capabilityId("LLM-as-judge"),
      "raey",
      "swiss-legal-rag",
      "f1-policy-intelligence",
    ],
  },
  {
    id: "healthcare-ai",
    label: "Healthcare AI",
    description: "SENTINEL and RAEY, plus the teaching and research that shaped both.",
    nodeIds: [
      capabilityId("Healthcare AI"),
      capabilityId("Hospital Information Systems"),
      capabilityId("Hospital SOP Intelligence Platform"),
      capabilityId("University Teaching"),
      "sentinel",
      "raey",
      GRAD_TA,
      RAEY_FOUNDER,
    ],
  },
  {
    id: "researcher",
    label: "Researcher",
    description: "Methodology, evaluation, and limitations, including what didn't work.",
    nodeIds: [
      capabilityId("Evaluation"),
      capabilityId("Cross-Validation"),
      capabilityId("Applied Machine Learning"),
      capabilityId("PCA"),
      "raey",
      "sentinel",
      RESEARCH_ASSISTANT,
    ],
  },
  {
    id: "founder-journey",
    label: "Founder journey",
    description: "From operations to engineering to founding RAEY, roughly in that order.",
    nodeIds: [
      BAHRAIN,
      TECHRESX,
      VEE4,
      MICROSOFT,
      capabilityId("Product Discovery"),
      capabilityId("Startup Leadership"),
      RAEY_FOUNDER,
      "raey",
    ],
  },
];
