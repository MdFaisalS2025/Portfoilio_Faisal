"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  projectNodes,
  roleNodes,
  capabilityNodes,
  neighborsOf,
  getNode,
  CAPABILITY_CATEGORIES,
  type GraphNode,
  type CapabilityCategory,
} from "@/lib/data/graph";
import { cn } from "@/lib/utils";

const TABS = ["Projects", "Roles", "Capabilities"] as const;
type Tab = (typeof TABS)[number];

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

/**
 * Mobile can't rely on hover, and a shrunk-down version of the desktop
 * three-column graph would be illegible at this width, so this is a
 * different interaction entirely: three tabs (default Projects) instead of
 * one endless Projects → Roles → 52-Capabilities scroll. Capabilities gets
 * its own search + category filter since it's the only group large enough
 * to need one — a tapped row's connections still render only once opened.
 */
export function SystemsMapMobile() {
  const [tab, setTab] = useState<Tab>("Projects");
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CapabilityCategory | "All">("All");

  const nodes = tab === "Projects" ? projectNodes : tab === "Roles" ? roleNodes : capabilityNodes;

  const visibleNodes = useMemo(() => {
    if (tab !== "Capabilities") return nodes;
    const q = query.trim().toLowerCase();
    return nodes.filter((node) => {
      const matchesCategory = category === "All" || node.categories?.includes(category);
      const matchesQuery = q === "" || node.label.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [nodes, tab, query, category]);

  function selectTab(next: Tab) {
    setTab(next);
    setOpenId(null);
  }

  return (
    <div className="flex flex-col gap-4">
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
          {tab === "Capabilities" && visibleNodes.length === 0 ? (
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
        Skip the map — browse projects as a list
      </Link>
    </div>
  );
}
