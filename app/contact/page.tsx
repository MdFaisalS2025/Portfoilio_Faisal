import type { Metadata } from "next";
import { Section, Eyebrow, Heading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CopyEmailButton } from "@/components/contact/CopyEmailButton";

export const metadata: Metadata = {
  title: "Contact · Mohamed Faisal Sindhi",
  description: "Get in touch about RAEY, collaborations, or opportunities.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section className="max-w-2xl">
      <Eyebrow>Let&apos;s talk</Eyebrow>
      <Heading>Leave a note</Heading>
      <p className="text-lg text-espresso-soft leading-relaxed mb-4">
        Open to AI engineering opportunities, research collaborations, and
        thoughtfully scoped product work involving trustworthy retrieval,
        healthcare AI, multi-agent systems, and applied machine learning.
      </p>
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Button href="mailto:faisalmd543@gmail.com" variant="primary">
          faisalmd543@gmail.com
        </Button>
        <CopyEmailButton />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button href="https://linkedin.com/in/mdfaisalsindhi" variant="secondary">
          LinkedIn
        </Button>
        <Button href="https://github.com/MdFaisalS2025" variant="secondary">
          GitHub
        </Button>
      </div>
    </Section>
  );
}
