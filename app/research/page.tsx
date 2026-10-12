import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, Heading } from "@/components/ui/Section";
import { ReadingProgress } from "@/components/layout/ReadingProgress";
import { researchNotes, researchLinks, researchLogRepoUrl, publications, orcid } from "@/lib/data/research";

export const metadata: Metadata = {
  title: "Research · Mohamed Faisal Sindhi",
  description:
    "Preprints, submitted manuscripts and working research notes.",
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
      <Eyebrow>Research</Eyebrow>
      <Heading>Research</Heading>
      <p className="text-lg text-espresso-soft leading-relaxed max-w-2xl mb-4">
        Three public preprints, two manuscripts under submission, and the
        working notes behind them. Preprints are not peer reviewed. I report
        what didn&apos;t work next to what did.
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <a
          href={orcid.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-terracotta-dark hover:underline"
        >
          ORCID {orcid.id} ↗
        </a>
        <a
          href={researchLogRepoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-terracotta-dark hover:underline"
        >
          See the full public research repository →
        </a>
      </div>

      <h2 className="font-mono text-xs uppercase tracking-wide text-terracotta-dark mt-12 mb-4">
        Preprints and manuscripts
      </h2>
      <ol className="flex flex-col gap-5 list-none p-0">
        {publications.map((p) => (
          <li key={p.id} className="border-t border-espresso/10 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-wide text-espresso-soft mb-1">
              {p.id} · {p.status === "submitted" ? "Submitted, public record pending" : "Preprint"}
            </p>
            <p className="font-medium text-espresso">{p.title}</p>
            <p className="text-sm text-espresso-soft">
              {p.authors} · {p.venue}, {p.year}
            </p>
            <div className="flex gap-4 mt-1">
              {p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-terracotta-dark hover:underline"
                >
                  Read preprint ↗
                </a>
              ) : null}
              {p.altHref ? (
                <a
                  href={p.altHref.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-espresso-soft hover:text-terracotta-dark"
                >
                  {p.altHref.label} ↗
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      <h2 className="font-mono text-xs uppercase tracking-wide text-terracotta-dark mt-16 mb-2">
        Working notes
      </h2>

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
            Documents from the same research repository, linked directly
            rather than summarized since a full read-through of each is
            still pending.
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
