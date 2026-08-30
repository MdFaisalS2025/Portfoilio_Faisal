"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { projects } from "@/lib/data/projects";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const ALL_DOMAINS = Array.from(new Set(projects.flatMap((p) => p.domains ?? []))).sort();

/**
 * Evidence-first: each row leads with its strongest verified result, not a
 * tech-stack tag wall. Filters are by real domain tags (healthcare AI,
 * trustworthy retrieval, etc.), kept separate from the technology stack.
 */
export function ProjectsList() {
  const [domain, setDomain] = useState<string | "All">("All");

  const filtered = useMemo(
    () => (domain === "All" ? projects : projects.filter((p) => p.domains?.includes(domain))),
    [domain]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDomain("All")}
          aria-pressed={domain === "All"}
          className={cn(
            "font-mono text-[11px] border px-2.5 py-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark",
            domain === "All"
              ? "border-terracotta-dark bg-terracotta/15 text-terracotta-dark"
              : "border-espresso/15 text-espresso-soft hover:border-terracotta/40"
          )}
        >
          All
        </button>
        {ALL_DOMAINS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDomain(d)}
            aria-pressed={domain === d}
            className={cn(
              "font-mono text-[11px] border px-2.5 py-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark",
              domain === d
                ? "border-terracotta-dark bg-terracotta/15 text-terracotta-dark"
                : "border-espresso/15 text-espresso-soft hover:border-terracotta/40"
            )}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((project) => {
          const headline = project.stats[0];
          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block border border-espresso/10 bg-parchment-dark/30 p-6 hover:border-terracotta/50 hover:bg-parchment-dark/60 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex-1 min-w-[220px]">
                  {project.domains && project.domains.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.domains.map((d) => (
                        <Badge key={d}>{d}</Badge>
                      ))}
                    </div>
                  ) : null}
                  <h2 className="font-display text-2xl font-medium text-espresso group-hover:text-terracotta-dark transition-colors mb-1">
                    {project.name}
                  </h2>
                  <p className="text-sm text-espresso-soft mb-2 max-w-lg">{project.tagline}</p>
                  <p className="font-mono text-xs text-espresso-soft">{project.timeframe}</p>
                </div>
                {headline ? (
                  <div className="flex-shrink-0 text-right">
                    <p className="font-display text-3xl font-semibold text-terracotta-dark leading-none mb-1">
                      {headline.value}
                    </p>
                    <p className="text-xs text-espresso-soft max-w-[11rem]">{headline.label}</p>
                  </div>
                ) : null}
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 ? (
          <p className="text-sm text-espresso-soft text-center py-8">
            No projects match &quot;{domain}&quot;.
          </p>
        ) : null}
      </div>
    </div>
  );
}
