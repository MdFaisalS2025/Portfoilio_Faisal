"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  projectNodes,
  roleNodes,
  capabilityNodes,
  neighborsOf,
  getNode,
  CAPABILITY_CATEGORIES,
  type GraphNode,
  type CapabilityCategory,
  type NodeType,
} from "@/lib/data/graph";
import { PATHS, type Path } from "@/components/home/paths";
import { readMapHash, isValidMapHash } from "./mapHash";
import { cn } from "@/lib/utils";

const TABS = ["Projects", "Roles", "Capabilities"] as const;
type Tab = (typeof TABS)[number];

const TAB_FOR_TYPE: Record<NodeType, Tab> = {
  project: "Projects",
  role: "Roles",
  capability: "Capabilities",
};

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "font-mono text-[11px] border px-2.5 py-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark",
        active
          ? "border-terracotta-dark bg-terracotta/15 text-terracotta-dark"
          : "border-espresso/15 text-espresso-soft hover:border-terracotta/40"
      )}
    >
      {children}
    </button>
  );
}

/** Which tab (if any) has at least one node in this journey, used to jump
 * to a tab that actually shows something the moment a journey is picked. */
function firstTabWithMatches(journey: Path): Tab | null {
  for (const t of TABS) {
    const pool = t === "Projects" ? projectNodes : t === "Roles" ? roleNodes : capabilityNodes;
    if (pool.some((n) => journey.nodeIds.includes(n.id))) return t;
  }
  return null;
}

/**
 * Mobile can't rely on hover, and a shrunk-down version of the desktop
 * three-column graph would be illegible at this width, so this is a
 * different interaction entirely: three tabs (default Projects) instead of
 * one endless Projects → Roles → 52-Capabilities scroll. Capabilities gets
 * its own search + category filter since it's the only group large enough
 * to need one, and a tapped row's connections still render only once opened.
 *
 * The five homepage "Choose a path" journeys are offered here too, as a
 * compact <select> rather than the desktop's five-button row (which would
 * either overflow or wrap awkwardly at this width). Picking one filters
 * the current tab down to that journey's nodes instead of animating a
 * graph, since there's no graph here to animate.
 */
export function SystemsMapMobile() {
  const [tab, setTab] = useState<Tab>("Projects");
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CapabilityCategory | "All">("All");
  const [journeyId, setJourneyId] = useState<string | null>(null);

  const journey = useMemo(() => PATHS.find((p) => p.id === journeyId) ?? null, [journeyId]);

  // Restores a shared #node=/#path= link into this mobile UI directly,
  // deliberately never opening the desktop-only expanded map dialog.
  useEffect(() => {
    function apply() {
      const hash = readMapHash();
      if (!isValidMapHash(hash)) return;
      if (hash.node) {
        const node = getNode(hash.node);
        if (!node) return;
        setTab(TAB_FOR_TYPE[node.type]);
        setOpenId(node.id);
        setJourneyId(null);
      } else if (hash.path) {
        const found = PATHS.find((p) => p.id === hash.path);
        if (!found) return;
        setJourneyId(found.id);
        setOpenId(null);
        const target = firstTabWithMatches(found);
        if (target) setTab(target);
      }
    }
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const nodes = tab === "Projects" ? projectNodes : tab === "Roles" ? roleNodes : capabilityNodes;

  const visibleNodes = useMemo(() => {
    let pool = nodes;
    if (journey) pool = pool.filter((n) => journey.nodeIds.includes(n.id));
    if (tab !== "Capabilities") return pool;
    const q = query.trim().toLowerCase();
    return pool.filter((node) => {
      const matchesCategory = category === "All" || node.categories?.includes(category);
      const matchesQuery = q === "" || node.label.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [nodes, tab, query, category, journey]);

  function selectTab(next: Tab) {
    setTab(next);
    setOpenId(null);
  }

  function selectJourney(id: string) {
    setOpenId(null);
    if (!id) {
      setJourneyId(null);
      return;
    }
    setJourneyId(id);
    const found = PATHS.find((p) => p.id === id);
    if (found) {
      const target = firstTabWithMatches(found);
      if (target) setTab(target);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="mobile-map-journey"
          className="font-mono text-[11px] uppercase tracking-wide text-espresso-soft"
        >
          Choose a path
        </label>
        <div className="flex items-center gap-2">
          <select
            id="mobile-map-journey"
            value={journeyId ?? ""}
            onChange={(e) => selectJourney(e.target.value)}
            className="flex-1 min-h-11 border border-espresso/15 bg-parchment px-3 text-sm text-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
          >
            <option value="">Pick who you are…</option>
            {PATHS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          {journey ? (
            <button
              type="button"
              onClick={() => selectJourney("")}
              className="min-h-11 min-w-11 font-mono text-xs border border-espresso/15 px-3 text-espresso-soft hover:border-terracotta-dark hover:text-terracotta-dark transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
            >
              Clear
            </button>
          ) : null}
        </div>
        {journey ? (
          <p className="text-sm text-espresso-soft leading-relaxed">{journey.description}</p>
        ) : null}
      </div>

      <div role="tablist" aria-label="Systems map view" className="flex gap-1 border-b border-espresso/10">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`map-tab-${t}`}
            aria-selected={tab === t}
            aria-controls="map-tabpanel"
            onClick={() => selectTab(t)}
            className={cn(
              "px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark",
              tab === t
                ? "border-terracotta-dark text-espresso"
                : "border-transparent text-espresso-soft"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Capabilities" ? (
        <div className="flex flex-col gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search capabilities…"
            aria-label="Search capabilities"
            className="w-full border border-espresso/15 bg-parchment px-3 py-2 text-sm text-espresso placeholder:text-espresso-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
          />
          <div className="flex flex-wrap gap-2">
            <FilterChip active={category === "All"} onClick={() => setCategory("All")}>
              All
            </FilterChip>
            {CAPABILITY_CATEGORIES.map((c) => (
              <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
                {c}
              </FilterChip>
            ))}
          </div>
        </div>
      ) : null}

      <div role="tabpanel" id="map-tabpanel" aria-labelledby={`map-tab-${tab}`}>
        <ul className="flex flex-col divide-y divide-espresso/10 border-y border-espresso/10">
          {visibleNodes.map((node) => {
            const open = openId === node.id;
            const connections = neighborsOf(node.id)
              .map((id) => getNode(id))
              .filter((n): n is GraphNode => !!n);

            return (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : node.id)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-3 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
                >
                  <span className="font-medium text-espresso">{node.label}</span>
                  <span className="font-mono text-xs text-espresso-soft">
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open ? (
                  <div className="pb-4">
                    {node.sublabel ? (
                      <p className="text-sm text-espresso-soft mb-1">{node.sublabel}</p>
                    ) : null}
                    {node.meta ? (
                      <p className="font-mono text-xs text-espresso-soft mb-2">{node.meta}</p>
                    ) : null}
                    {connections.length > 0 ? (
                      <ul className="flex flex-wrap gap-2 mb-2">
                        {connections.map((c) => (
                          <li
                            key={c.id}
                            className="font-mono text-[11px] border border-espresso/15 px-2 py-0.5 text-espresso-soft"
                          >
                            {c.label}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {node.href ? (
                      <Link
                        href={node.href}
                        className="text-sm font-medium text-terracotta-dark hover:underline"
                      >
                        {node.type === "project" ? "View case study →" : "See details →"}
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
          {visibleNodes.length === 0 && journey ? (
            <li className="py-6 text-sm text-espresso-soft text-center">
              No {tab.toLowerCase()} in the {journey.label} path. Try another tab.
            </li>
          ) : tab === "Capabilities" && visibleNodes.length === 0 ? (
            <li className="py-6 text-sm text-espresso-soft text-center">
              No capabilities match &quot;{query}&quot;.
            </li>
          ) : null}
        </ul>
      </div>

      <Link
        href="/projects"
        className="font-mono text-xs text-espresso-soft hover:text-terracotta-dark underline underline-offset-4 self-center"
      >
        Skip the map: browse projects as a list
      </Link>
    </div>
  );
}
