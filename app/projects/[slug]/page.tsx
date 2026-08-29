import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/data/projects";
import { CaseStudyTemplate } from "@/components/case-study/CaseStudyTemplate";
import { RaeyTrustPipeline } from "@/components/diagrams/RaeyTrustPipeline";
import { SentinelAgentGraph } from "@/components/diagrams/SentinelAgentGraph";
import { SwissLegalFunnel } from "@/components/diagrams/SwissLegalFunnel";
import { ControlHubFederatedDiagram } from "@/components/diagrams/ControlHubFederatedDiagram";
import { DataExplorerDemo } from "@/components/diagrams/DataExplorerDemo";
import { F1PolicyRetrieval } from "@/components/diagrams/F1PolicyRetrieval";
import { CASE_STUDY_VARIANTS } from "@/components/case-study/layoutVariants";

const diagrams: Record<string, React.ReactNode> = {
  raey: <RaeyTrustPipeline />,
  sentinel: <SentinelAgentGraph />,
  "swiss-legal-rag": <SwissLegalFunnel />,
  "ai-control-hub": <ControlHubFederatedDiagram />,
  "data-explorer": <DataExplorerDemo />,
  "f1-policy-intelligence": <F1PolicyRetrieval />,
};

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} · Mohamed Faisal Sindhi`,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <CaseStudyTemplate
      project={project}
      diagram={diagrams[project.slug]}
      variant={CASE_STUDY_VARIANTS[project.slug]}
    />
  );
}
