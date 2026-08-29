import Link from "next/link";
import type { Project } from "@/lib/data/projects";
import { Section, Eyebrow, Heading } from "@/components/ui/Section";
import { StatCallout } from "@/components/ui/StatCallout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConnectedStrip } from "./ConnectedStrip";
import type { CaseStudyVariant } from "./layoutVariants";

function Annotation({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-wide mb-2 text-terracotta-dark">
        {title}
      </h3>
      <p className="text-espresso-soft leading-relaxed">{text}</p>
    </div>
  );
}

function DiagramFrame({
  architectureNote,
  children,
}: {
  architectureNote: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wide text-espresso-soft mb-2">
        How it works
      </p>
      <p className="text-sm text-espresso-soft leading-relaxed mb-4 max-w-2xl">
        {architectureNote}
      </p>
      <div className="border border-espresso/10 bg-parchment-dark/40 p-6 md:p-10">
        {children}
      </div>
    </div>
  );
}

export function CaseStudyTemplate({
  project,
  diagram,
  variant,
}: {
  project: Project;
  diagram?: React.ReactNode;
  variant: CaseStudyVariant;
}) {
  return (
    <>
      <Section className="pb-8">
        <Link
          href="/projects"
          className="text-sm text-espresso-soft hover:text-terracotta-dark"
        >
          ← All projects
        </Link>
        <ConnectedStrip projectSlug={project.slug} />
        <Eyebrow>{project.timeframe}</Eyebrow>
        <Heading>{project.name}</Heading>
        <p className="text-lg text-espresso-soft max-w-2xl">{project.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
        {project.demoUrl || project.repoUrl || project.researchLogUrl ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demoUrl ? (
              <Button href={project.demoUrl} variant="primary">
                Try it live →
              </Button>
            ) : null}
            {project.repoUrl ? (
              <Button href={project.repoUrl} variant="secondary">
                View source
              </Button>
            ) : null}
            {project.researchLogUrl ? (
              <Button href={project.researchLogUrl} variant="secondary">
                Research log
              </Button>
            ) : null}
          </div>
        ) : null}
      </Section>

      <Body project={project} diagram={diagram} variant={variant} />

      <Section className="pt-16">
        <div className="flex flex-wrap gap-3">
          <Button href="/projects" variant="secondary">
            Back to all projects
          </Button>
          <Button href="/contact" variant="primary">
            Get in touch
          </Button>
        </div>
      </Section>
    </>
  );
}

function Body({
  project,
  diagram,
  variant,
}: {
  project: Project;
  diagram?: React.ReactNode;
  variant: CaseStudyVariant;
}) {
  const results = <Annotation title="Results" text={project.results} />;
  const stats = (
    <div className="grid gap-4 sm:grid-cols-3">
      {project.stats.map((stat) => (
        <StatCallout key={stat.label} value={stat.value} label={stat.label} />
      ))}
    </div>
  );

  if (variant === "pipeline-horizontal") {
    // Setup first, then the mechanism, then the payoff — reads like the
    // pipeline itself: text before diagram before results.
    return (
      <Section className="pt-0 flex flex-col gap-12">
        <div className="grid gap-10 md:grid-cols-2">
          <Annotation title="Problem" text={project.problem} />
          <Annotation title="Approach" text={project.approach} />
        </div>
        {diagram ? <DiagramFrame architectureNote={project.architectureNote}>{diagram}</DiagramFrame> : null}
        <div className="grid gap-10 md:grid-cols-[2fr_3fr] items-start">
          {results}
          {stats}
        </div>
      </Section>
    );
  }

  if (variant === "radial-side") {
    // Diagram is the centerpiece; Problem/Approach flank it as marginal
    // notes on either side rather than sitting above it.
    return (
      <Section className="pt-0 flex flex-col gap-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr_1fr] items-start">
          <Annotation title="Problem" text={project.problem} />
          {diagram ? <DiagramFrame architectureNote={project.architectureNote}>{diagram}</DiagramFrame> : null}
          <Annotation title="Approach" text={project.approach} />
        </div>
        <div className="grid gap-10 md:grid-cols-[2fr_3fr] items-start">
          {results}
          {stats}
        </div>
      </Section>
    );
  }

  if (variant === "funnel-stacked") {
    // The diagram itself tapers vertically, so the annotations run down a
    // narrow sidebar beside it instead of a two-column block above it.
    return (
      <Section className="pt-0 flex flex-col gap-12">
        <div className="grid gap-8 lg:grid-cols-[3fr_1fr] items-start">
          {diagram ? <DiagramFrame architectureNote={project.architectureNote}>{diagram}</DiagramFrame> : null}
          <div className="flex flex-col gap-8">
            <Annotation title="Problem" text={project.problem} />
            <Annotation title="Approach" text={project.approach} />
          </div>
        </div>
        <div className="grid gap-10 md:grid-cols-[2fr_3fr] items-start">
          {results}
          {stats}
        </div>
      </Section>
    );
  }

  if (variant === "aggregator-split") {
    // A quadrant split: problem/approach stacked on the left, the
    // aggregator diagram large on the right.
    return (
      <Section className="pt-0 flex flex-col gap-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] items-start">
          <div className="flex flex-col gap-8">
            <Annotation title="Problem" text={project.problem} />
            <Annotation title="Approach" text={project.approach} />
          </div>
          {diagram ? <DiagramFrame architectureNote={project.architectureNote}>{diagram}</DiagramFrame> : null}
        </div>
        <div className="grid gap-10 md:grid-cols-[2fr_3fr] items-start">
          {results}
          {stats}
        </div>
      </Section>
    );
  }

  if (variant === "demo-stacked") {
    // The diagram is an interactive, try-it-yourself widget, so it leads
    // full-width, with Problem/Approach/Results as three equal columns
    // underneath rather than an aside.
    return (
      <Section className="pt-0 flex flex-col gap-12">
        {diagram ? <DiagramFrame architectureNote={project.architectureNote}>{diagram}</DiagramFrame> : null}
        <div className="grid gap-10 md:grid-cols-3">
          <Annotation title="Problem" text={project.problem} />
          <Annotation title="Approach" text={project.approach} />
          {results}
        </div>
        {stats}
      </Section>
    );
  }

  // fusion-annotated: two retrieval paths converge into one diagram, so it
  // leads full-width on its own, with Problem/Approach as a single wide
  // two-column band beneath — the diagram itself carries the compliance
  // disclaimer, so no separate annotation is needed for that.
  return (
    <Section className="pt-0 flex flex-col gap-12">
      {diagram ? <DiagramFrame architectureNote={project.architectureNote}>{diagram}</DiagramFrame> : null}
      <div className="grid gap-10 md:grid-cols-2">
        <Annotation title="Problem" text={project.problem} />
        <Annotation title="Approach" text={project.approach} />
      </div>
      <div className="grid gap-10 md:grid-cols-[2fr_3fr] items-start">
        {results}
        {stats}
      </div>
    </Section>
  );
}
