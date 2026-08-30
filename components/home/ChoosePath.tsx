"use client";

import { PATHS } from "./paths";
import type { GraphInteraction } from "@/components/map/useGraphInteraction";
import { cn } from "@/lib/utils";

/**
 * Lives inside the map's own preview panel (its empty state) rather than as
 * a separate section after the map — a visitor deciding how to explore
 * needs this before or during, not after, scrolling past it.
 */
export function ChoosePath({ interaction }: { interaction: GraphInteraction }) {
  const activePathId = interaction.pathHighlight?.id ?? null;

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wide text-espresso-soft mb-2">
        Choose a path
      </p>
      <p className="text-sm text-espresso-soft leading-relaxed mb-4">
        Pick who you are — each highlights the evidence-backed nodes that
        matter most on the map.
      </p>
      <ul className="flex flex-col gap-2">
        {PATHS.map((path) => {
          const isActive = activePathId === path.id;
          return (
            <li key={path.id}>
              <button
                type="button"
                onClick={() =>
                  interaction.setPathHighlight(
                    isActive ? null : { id: path.id, label: path.label, nodeIds: [...path.nodeIds] }
                  )
                }
                aria-pressed={isActive}
                className={cn(
                  "w-full text-left border px-3 py-2.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark",
                  isActive
                    ? "border-terracotta-dark bg-terracotta/10"
                    : "border-espresso/12 hover:border-terracotta/40"
                )}
              >
                <span
                  className={cn(
                    "block text-sm font-medium mb-0.5",
                    isActive ? "text-terracotta-dark" : "text-espresso"
                  )}
                >
                  {path.label}
                </span>
                <span className="block text-xs text-espresso-soft">{path.description}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
