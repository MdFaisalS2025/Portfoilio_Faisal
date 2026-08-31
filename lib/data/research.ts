export type ResearchNote = {
  slug: string;
  title: string;
  researchQuestion: string;
  motivation: string;
  hypothesis: string;
  method: string;
  finding: string;
  limitation: string;
  nextExperiment: string;
  sourceUrl: string;
  sourceLabel: string;
  relatedProjectSlug?: string;
  relatedCapabilities?: string[];
};

/**
 * Full structured notes exist only for documents this pass actually read
 * and can accurately paraphrase — see `researchLinks` below for the other
 * two verified RAEY documents, which are linked without inventing the
 * fields below for content that wasn't reviewed in full.
 */
export const researchNotes: ResearchNote[] = [
  {
    slug: "sop-guard-procedural-faithfulness",
    title: "Can a RAG system verify its own answer is procedurally correct?",
    researchQuestion:
      "Retrieval-augmented generation systems can find relevant text, but can a system also verify that its generated answer is procedurally correct against the source, not just topically supported?",
    motivation:
      "A standard RAG pipeline retrieves relevant passages and generates an answer, but has no mechanism to check whether that answer got a dosage, a step order, or a contraindication wrong. In a hospital-SOP context, that gap is the difference between a citation and a clinical error.",
    hypothesis:
      "A dedicated verification stage, checking a generated answer against its source SOP for three specific, enumerable error types (wrong numeric thresholds, missing or reversed procedure steps, omitted contraindications), combined with SOP-aware typed chunking instead of generic fixed-size text blocks, would catch procedural errors a retrieval-only pipeline would miss.",
    method:
      "A six-stage agentic pipeline: query understanding (classifies question type, expands clinical abbreviations), hybrid TF-IDF + clinical-synonym retrieval with chunk-type boosting, multi-hop retrieval for cross-referenced SOPs, an evidence-sufficiency check that can refuse to answer, answer generation (LLM or local extractive mock mode), and a Procedural Faithfulness Verifier as a final gate. Evaluated three ways: retrieval metrics, adversarial testing (17 deliberately incorrect answers), and refusal testing on unsupported queries.",
    finding:
      "100% adversarial-violation detection (17/17 deliberately wrong answers caught), 87.5% retrieval precision, and 100% refusal accuracy on unsupported queries, measured on a 10-SOP synthetic demo dataset.",
    limitation:
      "The demo dataset is 10 synthetic clinical protocols, not real hospital SOPs, and the project is explicitly labeled a research prototype, not for clinical use. Moving to a real deployment would need PostgreSQL in place of SQLite, semantic embedding models in place of the current TF-IDF-based retriever, and hospital SSO authentication.",
    nextExperiment:
      "Partner with a hospital to ingest their actual SOPs and re-run the same three evaluations against them, and replace TF-IDF retrieval with sentence-transformer embeddings to test whether semantic retrieval changes the precision/verifier results.",
    sourceUrl:
      "https://github.com/MdFaisalS2025/RAEY-SOP-Research/blob/master/sop-guard/SOP-Guard_Project_Summary.pdf",
    sourceLabel: "SOP-Guard: Project Summary (PDF)",
    relatedProjectSlug: "raey",
    relatedCapabilities: ["Trustworthy Retrieval", "Verification", "Evaluation"],
  },
];

export type ResearchLink = {
  title: string;
  description: string;
  href: string;
};

/** Two more verified RAEY documents exist in the same public repository,
 * linked directly rather than given the full structured treatment above,
 * since this pass read the summary PDF in full but not these two, and
 * inventing their research-question/method/finding fields without having
 * read them would violate the same no-fabrication rule this section
 * exists to uphold. */
export const researchLinks: ResearchLink[] = [
  {
    title: "Clinical SOP RAG Research Proposal",
    description: "The research proposal behind RAEY's clinical retrieval-augmented generation approach.",
    href: "https://github.com/MdFaisalS2025/RAEY-SOP-Research/blob/master/ClinicalSOP_RAG_Research_Proposal.docx",
  },
  {
    title: "Hospital SOP Research Analysis",
    description: "Supporting analysis for the hospital SOP retrieval and verification approach.",
    href: "https://github.com/MdFaisalS2025/RAEY-SOP-Research/blob/master/Hospital_SOP_Research_Analysis.docx",
  },
];

export const researchLogRepoUrl = "https://github.com/MdFaisalS2025/RAEY-SOP-Research";
