"use client";

import { useMemo, useState } from "react";
import { graphNodes, type GraphNode } from "@/lib/data/graph";
import type { GraphInteraction } from "./useGraphInteraction";

const TYPE_LABEL: Record<GraphNode["type"], string> = {
  project: "Project",
  role: "Role",
  capability: "Capability",
};

/** Plain substring search over the same static graph data everything else
 * on the map already uses — no fuzzy-matching library, no network call. */
export function MapSearch({ interaction }: { interaction: GraphInteraction }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return graphNodes.filter((n) => n.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  return (
    <div className="relative w-full max-w-sm">
      <label htmlFor="map-search" className="sr-only">
        Search projects, roles, and capabilities
      </label>
      <input
        id="map-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the map…"
        className="w-full border border-espresso/20 bg-parchment px-3 py-1.5 text-sm text-espresso placeholder:text-espresso-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
      />
      {results.length > 0 ? (
        <ul className="absolute z-10 mt-1 w-full border border-espresso/15 bg-parchment shadow-sm max-h-64 overflow-y-auto">
          {results.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => {
                  interaction.pinNode(n.id);
                  setQuery("");
                }}
                className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-parchment-dark/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark focus-visible:outline-offset-[-2px]"
              >
                <span className="text-espresso">{n.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-espresso-soft">
                  {TYPE_LABEL[n.type]}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
