import type { Metadata } from "next";
import { Section, Eyebrow, Heading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";

export const metadata: Metadata = {
  title: "Experience · Mohamed Faisal Sindhi",
  description: "Roles across founding an AI company, healthcare AI research, and blockchain engineering.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <Section>
      <Eyebrow>The fast scan</Eyebrow>
      <Heading>Experience</Heading>
      <p className="text-sm text-espresso-soft max-w-xl mb-6">
        Click a capability tag on any role to see where else it shows up.
      </p>
      <div className="mb-10">
        <div className="flex flex-wrap gap-3">
          <Button href="/resume.pdf" variant="primary">
            Résumé (PDF)
          </Button>
          <Button href="/cv.pdf" variant="secondary">
            Research CV (PDF)
          </Button>
        </div>
      </div>

      <ExperienceTimeline />
    </Section>
  );
}
