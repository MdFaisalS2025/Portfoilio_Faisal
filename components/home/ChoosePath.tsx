"use client";

import { PATHS } from "./paths";
import type { GraphInteraction } from "@/components/map/useGraphInteraction";
import { cn } from "@/lib/utils";

/**
 * Lives inside the map's own preview panel (its empty state) rather than as
 * a separate section after the map — a visitor deciding how to explore
 * needs this before or during, not after, scrolling past it.
 *
 * A compact pill row, not five stacked cards: the panel shares its column
 * with the legend and (at fillHeight) is height-constrained, and five full
 * cards with descriptions reliably forced a second, nested scrollbar inside
 * the page's own. One path's description shows at a time, below the row.
 */
export function ChoosePath({ interaction }: { interaction: GraphInteraction }) {
  const activePathId = interaction.pathHighlight?.id ?? null;
  const active = PATHS.find((p) => p.id === activePathId) ?? null;

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wide text-espresso-soft mb-2">
        Choose a path
      </p>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {PATHS.map((path) => {
          const isActive = activePathId === path.id;
          return (
            <button
              key={path.id}
              type="button"
              onClick={() =>
                interaction.setPathHighlight(
                  isActive ? null : { id: path.id, label: path.label, nodeIds: [...path.nodeIds] }
                )
              }
              aria-pressed={isActive}
              className={cn(
                "font-mono text-[11px] border px-2.5 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark",
                isActive
                  ? "border-terracotta-dark bg-terracotta/10 text-terracotta-dark"
                  : "border-espresso/15 text-espresso-soft hover:border-terracotta/40"
              )}
            >
              {path.label}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-espresso-soft leading-relaxed">
        {active
          ? active.description
          : "Pick who you are. Each one highlights the nodes that matter most for that view."}
      </p>
    </div>
  );
}
