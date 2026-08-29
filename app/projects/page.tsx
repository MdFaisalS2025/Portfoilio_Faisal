import type { Metadata } from "next";
import { Section, Eyebrow, Heading } from "@/components/ui/Section";
import { ProjectsList } from "@/components/projects/ProjectsList";

export const metadata: Metadata = {
  title: "Projects · Mohamed Faisal Sindhi",
  description:
    "Case studies in healthcare AI, legal retrieval, federated learning, and full-stack data apps.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <Section>
      <Eyebrow>Selected work</Eyebrow>
      <Heading>Projects</Heading>
      <ProjectsList />
    </Section>
  );
}
