"use client";

import { useMemo, useState } from "react";
import { archiveEntries } from "@/lib/data/archive";
import { cn } from "@/lib/utils";

const DOMAINS = Array.from(new Set(archiveEntries.map((e) => e.domain))).sort();

/** Hides itself entirely if there's nothing verified to show — no
 * placeholder or "coming soon" state. */
export function ProjectArchive() {
  const [domain, setDomain] = useState<string | "All">("All");

  const filtered = useMemo(
    () => (domain === "All" ? archiveEntries : archiveEntries.filter((e) => e.domain === domain)),
    [domain]
  );

  if (archiveEntries.length === 0) return null;

  return (
    <div id="archive" className="scroll-mt-24">
      <h2 className="font-mono text-xs uppercase tracking-wide text-espresso-soft mb-1">
        Project archive
      </h2>
      <p className="text-sm text-espresso-soft mb-4 max-w-xl">
        Smaller and older projects that don&apos;t justify a full case study,
        each verified against its own public repository.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
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
        {DOMAINS.map((d) => (
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

      <ul className="flex flex-col divide-y divide-espresso/10 border-y border-espresso/10">
        {filtered.map((entry) => (
          <li key={entry.name} className="py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-1.5">
              <a
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-display text-lg font-medium text-espresso hover:text-terracotta-dark transition-colors"
              >
                {entry.name} ↗
              </a>
              <span className="font-mono text-xs text-espresso-soft">{entry.year}</span>
            </div>
            <p className="text-xs text-espresso-soft mb-2">
              {entry.domain} · {entry.role}
            </p>
            <p className="text-sm text-espresso-soft leading-relaxed mb-2 max-w-2xl">
              {entry.outcome}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {entry.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="font-mono text-[10px] border border-espresso/15 px-1.5 py-0.5 text-espresso-soft"
                >
                  {cap}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
