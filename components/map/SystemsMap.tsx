"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  computeLayout,
  edgesWithPositions,
  capabilityColumnPositions,
  VIEW_WIDTH,
  VIEW_HEIGHT,
  PROJECT_X,
  ROLE_X,
} from "./layout";
import { MapNode } from "./MapNode";
import { MapEdge } from "./MapEdge";
import { NodePreviewPanel } from "./NodePreviewPanel";
import { MapLegend } from "./MapLegend";
import { ChoosePath } from "@/components/home/ChoosePath";
import { useGraphInteraction, type GraphInteraction } from "./useGraphInteraction";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import type { NodeType } from "@/lib/data/graph";

const FOCUS_OPTIONS: { type: NodeType; label: string }[] = [
  { type: "project", label: "Projects" },
  { type: "role", label: "Roles" },
  { type: "capability", label: "Capabilities" },
];

/**
 * Desktop/tablet Systems Map: a real, keyboard-navigable graph of every
 * project, role, and capability. Hidden below the `md` breakpoint in favor
 * of <SystemsMapMobile>; see SystemsMapSection.
 *
 * Progressive disclosure: with ~50 capability nodes now in the graph (every
 * role and project's real evidenced skills, not just literal tech stacks),
 * always rendering all of them with labels and all their edges would turn
 * "calm default state" into a wall of text. So capability labels and any
 * edge touching a capability only render once that capability (or something
 * connected to it) is the active/hovered/focused node — project and role
 * nodes and the edges between them are always visible, since there are only
 * ~13 of those and they're the primary content. Capability *clusters*
 * (category headings) are visible from the start, though, so the resting
 * state reads as five labeled groups rather than an unexplained grid.
 *
 * Accepts an optional shared `interaction` so a parent (the expanded map
 * view) can drive the same map state from outside — falls back to owning
 * its own state otherwise.
 */
export function SystemsMap({
  interaction: externalInteraction,
  onExpand,
  showControls = true,
}: {
  interaction?: GraphInteraction;
  onExpand?: () => void;
  showControls?: boolean;
} = {}) {
  const positioned = useMemo(() => computeLayout(), []);
  const edges = useMemo(() => edgesWithPositions(positioned), [positioned]);
  const capabilityHeadings = useMemo(() => capabilityColumnPositions(), []);
  const reducedMotion = useReducedMotion();
  const ownInteraction = useGraphInteraction();
  const interaction = externalInteraction ?? ownInteraction;
  const {
    activeId,
    highlighted,
    focusType,
    pathHighlight,
    onNodeEnter,
    onNodeLeave,
    onNodeFocus,
    onNodeBlur,
    onNodeSelect,
    pinNode,
    setFocusType,
    reset,
  } = interaction;

  const hasActiveHighlight = !!highlighted;

  return (
    <div className="flex flex-col gap-3">
      {showControls ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wide text-espresso-soft mr-1">
              Focus
            </span>
            {FOCUS_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setFocusType(focusType === opt.type ? null : opt.type)}
                aria-pressed={focusType === opt.type}
                className={cn(
                  "font-mono text-[11px] border px-2.5 py-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark",
                  focusType === opt.type
                    ? "border-terracotta-dark bg-terracotta/15 text-terracotta-dark"
                    : "border-espresso/15 text-espresso-soft hover:border-terracotta/40"
                )}
              >
                {opt.label}
              </button>
            ))}
            {hasActiveHighlight ? (
              <button
                type="button"
                onClick={reset}
                className="font-mono text-[11px] text-espresso-soft hover:text-terracotta-dark underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark ml-1"
              >
                Reset view
              </button>
            ) : null}
          </div>
          {onExpand ? (
            <button
              type="button"
              onClick={onExpand}
              className="font-mono text-[11px] border border-espresso/20 px-3 py-1.5 text-espresso-soft hover:border-terracotta-dark hover:text-terracotta-dark transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
            >
              Expand map ⤢
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div
          className="relative w-full md:flex-1 md:min-w-0"
          style={{ aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}` }}
        >
          {/* Column headings — an overview visitor should be able to read
           * "Capabilities / Projects / Roles" (plus each capability
           * cluster's category) before touching anything. */}
          <div className="absolute inset-x-0 top-0 h-0" aria-hidden="true">
            <span
              className="absolute -translate-x-1/2 font-mono text-[11px] uppercase tracking-wide text-espresso font-semibold"
              style={{
                left: `${(capabilityHeadings[Math.floor(capabilityHeadings.length / 2)]?.x ?? 0) / VIEW_WIDTH * 100}%`,
                top: 2,
              }}
            >
              Capabilities
            </span>
            {capabilityHeadings.map(({ category, x }, i) => {
              const nextX = capabilityHeadings[i + 1]?.x;
              const prevX = capabilityHeadings[i - 1]?.x;
              const gap = Math.min(
                nextX !== undefined ? nextX - x : Infinity,
                prevX !== undefined ? x - prevX : Infinity
              );
              const widthPct = ((gap === Infinity ? 160 : gap) / VIEW_WIDTH) * 100 * 0.92;
              return (
                <span
                  key={category}
                  className="absolute -translate-x-1/2 font-mono text-[8px] uppercase tracking-tight text-espresso-soft leading-[1.15] text-center"
                  style={{ left: `${(x / VIEW_WIDTH) * 100}%`, top: 20, width: `${widthPct}%` }}
                >
                  {category}
                </span>
              );
            })}
            <span
              className="absolute -translate-x-1/2 font-mono text-[11px] uppercase tracking-wide text-espresso font-semibold"
              style={{ left: `${(PROJECT_X / VIEW_WIDTH) * 100}%`, top: 2 }}
            >
              Projects
            </span>
            <span
              className="absolute -translate-x-1/2 font-mono text-[11px] uppercase tracking-wide text-espresso font-semibold"
              style={{ left: `${(ROLE_X / VIEW_WIDTH) * 100}%`, top: 2 }}
            >
              Roles
            </span>
          </div>

          <svg
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {edges.map((e, i) => {
              const touchesCapability =
                e.source.type === "capability" || e.target.type === "capability";
              const connectedToActive =
                !!highlighted &&
                highlighted.has(e.source.id) &&
                highlighted.has(e.target.id);
              if (touchesCapability && !connectedToActive) return null;

              return (
                <MapEdge
                  key={`${e.source.id}-${e.target.id}`}
                  source={e.source}
                  target={e.target}
                  reducedMotion={reducedMotion}
                  delay={reducedMotion ? 0 : i * 0.015}
                  emphasized={connectedToActive}
                  dimmed={!!highlighted && !connectedToActive}
                />
              );
            })}
          </svg>

          <div className="absolute inset-0">
            {positioned.map((node) => {
              const isConnectedToActive = !!highlighted && highlighted.has(node.id);
              return (
                <MapNode
                  key={node.id}
                  node={node}
                  viewWidth={VIEW_WIDTH}
                  viewHeight={VIEW_HEIGHT}
                  emphasized={activeId === node.id}
                  dimmed={!!highlighted && !highlighted.has(node.id)}
                  labelVisible={node.type !== "capability" || isConnectedToActive}
                  onEnter={() => onNodeEnter(node.id)}
                  onLeave={onNodeLeave}
                  onFocus={() => onNodeFocus(node.id)}
                  onBlur={onNodeBlur}
                  onSelect={() => onNodeSelect(node.id)}
                />
              );
            })}
          </div>
        </div>

        <div className="w-full md:w-96 md:flex-shrink-0">
          <NodePreviewPanel
            nodeId={activeId}
            onClose={reset}
            onPin={pinNode}
            pathHighlight={pathHighlight}
            emptyState={<ChoosePath interaction={interaction} />}
          />
          <MapLegend className="mt-4" />
          <div className="mt-4 flex justify-center md:justify-start">
            <Link
              href="/projects"
              className="font-mono text-xs text-espresso-soft hover:text-terracotta-dark underline underline-offset-4"
            >
              Skip the map — browse projects as a list
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
