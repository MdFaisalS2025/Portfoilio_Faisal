"use client";

import { useState } from "react";
import Link from "next/link";
import { experience } from "@/lib/data/experience";
import { roleId } from "@/lib/data/graph";
import { cn } from "@/lib/utils";

/**
 * Clicking a capability chip under one role dims every role that doesn't
 * also demonstrate it, and highlights the matching chip wherever else it
 * appears — a "where else did I use this" cross-reference over data that
 * already exists (role.capabilities), not a decorative filter.
 */
export function ExperienceTimeline() {
  const [activeCapability, setActiveCapability] = useState<string | null>(null);

  return (
    <div className="relative pl-8">
      <div
        className="absolute left-[5px] top-2 bottom-2 w-px bg-espresso/15"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-10">
        {experience.map((role) => {
          const hasActiveCapability =
            !!activeCapability && (role.capabilities ?? []).includes(activeCapability);
          const dimmed = !!activeCapability && !hasActiveCapability;

          return (
            <div
              key={`${role.org}-${role.title}`}
              id={roleId(role)}
              className={cn(
                "relative scroll-mt-24 transition-opacity duration-200",
                dimmed ? "opacity-40" : "opacity-100"
              )}
            >
              <span
                className={cn(
                  "absolute -left-[29px] top-1.5 w-3 h-3 rounded-full",
                  role.projectSlug ? "bg-terracotta" : "bg-graphite"
                )}
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                {role.specialization ? (
                  <div>
                    <h3 className="font-display text-xl font-medium text-espresso">
                      {role.title}
                    </h3>
                    <p className="text-base font-medium text-terracotta-dark">
                      {role.specialization}
                    </p>
                    <p className="text-sm text-espresso-soft">{role.org}</p>
                  </div>
                ) : (
                  <h3 className="font-display text-xl font-medium text-espresso">
                    {role.title} · {role.org}
                  </h3>
                )}
                <span className="font-mono text-xs text-espresso-soft whitespace-nowrap">
                  {role.period}
                </span>
              </div>
              <p className="text-sm text-espresso-soft mb-3 mt-1">{role.location}</p>
              <ul className="list-disc list-inside space-y-1 text-espresso-soft leading-relaxed">
                {role.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              {role.capabilities && role.capabilities.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5 mt-3">
                  {role.capabilities.map((cap) => {
                    const isActive = activeCapability === cap;
                    return (
                      <li key={cap}>
                        <button
                          type="button"
                          onClick={() => setActiveCapability(isActive ? null : cap)}
                          aria-pressed={isActive}
                          className={cn(
                            "font-mono text-[11px] border px-2 py-0.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark",
                            isActive
                              ? "border-terracotta-dark bg-terracotta/15 text-terracotta-dark"
                              : "border-espresso/15 text-espresso-soft hover:border-terracotta/40"
                          )}
                        >
                          {cap}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              {role.projectSlug ? (
                <Link
                  href={`/projects/${role.projectSlug}`}
                  className="inline-block mt-3 text-sm font-medium text-terracotta-dark hover:underline"
                >
                  Read the full case study →
                </Link>
              ) : null}
            </div>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        {activeCapability
          ? `Highlighting roles that also used ${activeCapability}.`
          : ""}
      </p>
    </div>
  );
}
