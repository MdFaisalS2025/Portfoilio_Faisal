// Presentation-only mapping (not content) — which arrangement each case
// study's diagram + annotations use, so no two project pages share the
// exact same composition despite sharing one template component.
export type CaseStudyVariant =
  | "pipeline-horizontal"
  | "radial-side"
  | "funnel-stacked"
  | "aggregator-split"
  | "demo-stacked"
  | "fusion-annotated";

export const CASE_STUDY_VARIANTS: Record<string, CaseStudyVariant> = {
  raey: "pipeline-horizontal",
  sentinel: "radial-side",
  "swiss-legal-rag": "funnel-stacked",
  "ai-control-hub": "aggregator-split",
  "data-explorer": "demo-stacked",
  "f1-policy-intelligence": "fusion-annotated",
};
