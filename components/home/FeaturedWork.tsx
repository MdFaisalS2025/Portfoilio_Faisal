import Link from "next/link";
import { projects } from "@/lib/data/projects";

const FEATURED_SLUGS = ["raey", "sentinel", "f1-policy-intelligence"];

/** Three flagship case studies, evidence-first — the map shows how
 * everything connects, this shows the strongest individual results. */
export function FeaturedWork() {
  const featured = FEATURED_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => !!p
  );

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-6">
        <h2 className="font-mono text-xs uppercase tracking-wide text-espresso-soft">
          Featured work
        </h2>
        <Link href="/projects" className="text-sm font-medium text-terracotta-dark hover:underline">
          All projects →
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {featured.map((project) => {
          const headline = project.stats[0];
          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block border border-espresso/10 bg-parchment-dark/30 p-5 hover:border-terracotta/50 hover:bg-parchment-dark/60 transition-colors"
            >
              <h3 className="font-display text-lg font-medium text-espresso group-hover:text-terracotta-dark transition-colors mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-espresso-soft mb-4">{project.tagline}</p>
              {headline ? (
                <p>
                  <span className="font-display text-2xl font-semibold text-terracotta-dark">
                    {headline.value}
                  </span>{" "}
                  <span className="text-xs text-espresso-soft">{headline.label}</span>
                </p>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
