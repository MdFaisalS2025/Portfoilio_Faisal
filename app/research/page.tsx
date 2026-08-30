import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, Heading } from "@/components/ui/Section";
import { ReadingProgress } from "@/components/layout/ReadingProgress";
import { researchNotes, researchLinks, researchLogRepoUrl } from "@/lib/data/research";

export const metadata: Metadata = {
  title: "Research · Mohamed Faisal Sindhi",
  description:
    "Readable research notes from RAEY's public research log — research question, method, findings, and limitations, extracted from the source documents.",
  alternates: { canonical: "/research" },
};

function Field({ label, text }: { label: string; text: string }) {
  return (
    <div className="scroll-reveal">
      <h3 className="font-mono text-[11px] uppercase tracking-wide text-terracotta-dark mb-1">
        {label}
      </h3>
      <p className="text-sm text-espresso-soft leading-relaxed">{text}</p>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <Section>
      <ReadingProgress />
      <Eyebrow>Research log</Eyebrow>
      <Heading>Research</Heading>
      <p className="text-lg text-espresso-soft leading-relaxed max-w-2xl mb-4">
        These aren&apos;t peer-reviewed publications — they&apos;re working
        notes from RAEY&apos;s research process, read directly from the
        source documents and paraphrased here for readability. Nothing below
        is quoted or concluded beyond what the source actually says.
      </p>
      <a
        href={researchLogRepoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-terracotta-dark hover:underline"
      >
        See the full public research repository →
      </a>

      <div className="flex flex-col gap-16 mt-12">
        {researchNotes.map((note) => (
          <article key={note.slug} className="border-t border-espresso/10 pt-8">
            <h2 className="font-display text-2xl font-medium text-espresso mb-6">
              {note.title}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Research question" text={note.researchQuestion} />
              <Field label="Motivation" text={note.motivation} />
              <Field label="Hypothesis / design assumption" text={note.hypothesis} />
              <Field label="Method" text={note.method} />
              <Field label="Important finding" text={note.finding} />
              <Field label="Limitation" text={note.limitation} />
              <Field label="Next experiment" text={note.nextExperiment} />
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <a
                href={note.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-terracotta-dark hover:underline"
              >
                {note.sourceLabel} ↗
              </a>
              {note.relatedProjectSlug ? (
                <Link
                  href={`/projects/${note.relatedProjectSlug}`}
                  className="text-sm text-espresso-soft hover:text-terracotta-dark"
                >
                  Related case study →
                </Link>
              ) : null}
            </div>
            {note.relatedCapabilities && note.relatedCapabilities.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {note.relatedCapabilities.map((cap) => (
                  <span
                    key={cap}
                    className="font-mono text-[10px] border border-sage-dark/40 text-sage-dark px-2 py-0.5"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {researchLinks.length > 0 ? (
        <div className="border-t border-espresso/10 pt-8 mt-16">
          <h2 className="font-mono text-xs uppercase tracking-wide text-espresso-soft mb-4">
            Additional source documents
          </h2>
          <p className="text-sm text-espresso-soft mb-4 max-w-xl">
            Verified, real documents from the same research repository —
            linked directly rather than summarized, since a full read-through
            of each is still pending.
          </p>
          <ul className="flex flex-col gap-3">
            {researchLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-espresso hover:text-terracotta-dark transition-colors"
                >
                  {link.title} ↗
                </a>
                <p className="text-sm text-espresso-soft">{link.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
