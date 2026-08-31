"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
import { roleNodes, projectNodes, type NodeType } from "@/lib/data/graph";

/**
 * Measures each role/project label's *real* rendered height by rendering an
 * identical, offscreen copy of the label span (same classes: font, size,
 * wrap width) and reading its height back — rather than guessing from a
 * character-count heuristic, which drifts from a monospace font's actual
 * metrics enough to under-count wrapped lines for some titles (confirmed
 * empirically: "Research Assistant, Applied Machine Learning" measured
 * ~10px taller than the heuristic predicted). Returns null until mounted;
 * layout.ts falls back to the heuristic for any id missing from the map.
 */
function useMeasuredLabelHeights() {
  const roleRefs = useRef(new Map<string, HTMLSpanElement>());
  const projectRefs = useRef(new Map<string, HTMLSpanElement>());
  const [heights, setHeights] = useState<Map<string, number> | null>(null);

  useLayoutEffect(() => {
    function measure() {
      const next = new Map<string, number>();
      roleRefs.current.forEach((el, id) => next.set(id, el.getBoundingClientRect().height));
      projectRefs.current.forEach((el, id) => next.set(id, el.getBoundingClientRect().height));
      setHeights(next);
    }
    measure();
    // Web fonts loading after first paint can change wrap points; the
    // font-mono stack here is a system stack with no @font-face today, but
    // this keeps the measurement correct if that ever changes.
    document.fonts?.ready?.then(measure).catch(() => {});
  }, []);

  const probe = (
    <div aria-hidden="true" className="absolute -top-[9999px] -left-[9999px] pointer-events-none">
      {roleNodes.map((n) => (
        <span
          key={n.id}
          ref={(el) => {
            if (el) roleRefs.current.set(n.id, el);
          }}
          // Must match MapNode's real role label classes exactly (including
          // the fused `text-[13px]/[1.2]`, not a separate leading-* class —
          // see MapNode's comment on why that distinction matters) or this
          // measurement silently drifts from what actually renders.
          className="block font-mono text-[13px]/[1.2] max-w-[170px] whitespace-normal text-espresso-soft"
        >
          {n.label}
        </span>
      ))}
      {projectNodes.map((n) => (
        <span
          key={n.id}
          ref={(el) => {
            if (el) projectRefs.current.set(n.id, el);
          }}
          className="block font-mono text-[13px]/[1.2] max-w-[180px] whitespace-normal font-semibold text-espresso"
        >
          {n.label}
        </span>
      ))}
    </div>
  );

  return { heights, probe };
}

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
 * connected to it) is the active/hovered/focused node. Project and role
 * nodes and the edges between them are always visible, since there are only
 * ~13 of those and they're the primary content. Capability *clusters*
 * (category headings, in the reserved header band above the graph) are
 * visible from the start, though, so the resting state reads as six labeled
 * groups rather than an unexplained grid.
 *
 * Accepts an optional shared `interaction` so a parent (the expanded map
 * view) can drive the same map state from outside, falling back to owning
 * its own state otherwise.
 */
export function SystemsMap({
  interaction: externalInteraction,
  onExpand,
  showControls = true,
  fillHeight = false,
}: {
  interaction?: GraphInteraction;
  onExpand?: () => void;
  showControls?: boolean;
  /** The default homepage map fills its parent's height (see
   * HomeSystemsMapSection) instead of deriving its height from a fixed
   * aspect ratio. The expanded dialog and the nav's compact toggle keep the
   * aspect-ratio-locked default. */
  fillHeight?: boolean;
} = {}) {
  // The graph area's real, measured pixel height — role/project vertical
  // spacing is computed from this (see layout.ts's packLane), not from the
  // abstract VIEW_HEIGHT constant, because label-height collisions are a
  // real-pixel problem a fixed viewBox ratio can't see. Null until the first
  // ResizeObserver callback lands, in which case layout falls back to even
  // spacing for one frame.
  const graphAreaRef = useRef<HTMLDivElement>(null);
  const [graphHeightPx, setGraphHeightPx] = useState<number | null>(null);
  const { heights: measuredLabelHeights, probe: labelMeasurementProbe } = useMeasuredLabelHeights();

  useEffect(() => {
    const el = graphAreaRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height;
      if (height) setGraphHeightPx(height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const positioned = useMemo(
    () => computeLayout(graphHeightPx, measuredLabelHeights),
    [graphHeightPx, measuredLabelHeights]
  );
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
    <div className={cn("flex flex-col gap-3", fillHeight && "h-full")}>
      {labelMeasurementProbe}
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

      <div
        className={cn(
          "flex flex-col lg:flex-row gap-6",
          fillHeight ? "lg:flex-1 lg:min-h-0" : "items-start"
        )}
      >
        <div
          className={cn(
            "relative w-full flex flex-col gap-2 lg:flex-1 lg:min-w-0",
            fillHeight && "lg:h-full"
          )}
          style={fillHeight ? undefined : { aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}` }}
        >
          {/* Reserved header band: a real DOM element with its own height,
           * not an overlay inside the node area — so no node can ever be
           * positioned underneath it, structurally, regardless of viewport
           * size. "Capabilities / Projects / Roles" plus each capability
           * cluster's category label live here, so a visitor can read the
           * map's structure before touching anything. */}
          <div className="relative flex-none min-h-[3.25rem] md:min-h-[3.75rem]" aria-hidden="true">
            <span
              className="absolute -translate-x-1/2 top-0 font-mono text-sm uppercase tracking-wide text-espresso font-semibold"
              style={{
                left: `${((capabilityHeadings[Math.floor(capabilityHeadings.length / 2)]?.x ?? 0) / VIEW_WIDTH) * 100}%`,
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
              const widthPct = ((gap === Infinity ? 160 : gap) / VIEW_WIDTH) * 100 * 0.94;
              return (
                <span
                  key={category}
                  className="absolute -translate-x-1/2 top-5 md:top-6 font-mono text-[11px] uppercase tracking-tight text-espresso-soft leading-[1.25] text-center"
                  style={{ left: `${(x / VIEW_WIDTH) * 100}%`, width: `${widthPct}%` }}
                >
                  {category}
                </span>
              );
            })}
            <span
              className="absolute -translate-x-1/2 top-0 font-mono text-sm uppercase tracking-wide text-espresso font-semibold"
              style={{ left: `${(PROJECT_X / VIEW_WIDTH) * 100}%` }}
            >
              Projects
            </span>
            <span
              className="absolute -translate-x-1/2 top-0 font-mono text-sm uppercase tracking-wide text-espresso font-semibold"
              style={{ left: `${(ROLE_X / VIEW_WIDTH) * 100}%` }}
            >
              Roles
            </span>
          </div>

          <div ref={graphAreaRef} className="relative flex-1 min-h-0">
            {/* `preserveAspectRatio="none"` stretches the viewBox to
             * exactly fill this element's own box, non-uniformly in x/y if
             * needed: the same box the HTML node layer below fills via
             * percentage positioning. That keeps both layers on the
             * identical coordinate transform at any container aspect
             * ratio, so edges stay anchored to their nodes; the default
             * "meet" behavior would letterbox the SVG's content inside its
             * box and desync the two layers instead. */}
            <svg
              viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
              preserveAspectRatio="none"
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
        </div>

        <div
          className={cn(
            "w-full lg:w-[clamp(18rem,24vw,26rem)] lg:flex-shrink-0",
            fillHeight && "lg:h-full lg:overflow-y-auto"
          )}
        >
          <NodePreviewPanel
            nodeId={activeId}
            onClose={reset}
            onPin={pinNode}
            pathHighlight={pathHighlight}
            emptyState={<ChoosePath interaction={interaction} />}
          />
          <MapLegend className="mt-4" />
          <div className="mt-4 flex justify-center lg:justify-start">
            <Link
              href="/projects"
              className="font-mono text-xs text-espresso-soft hover:text-terracotta-dark underline underline-offset-4"
            >
              Skip the map: browse projects as a list
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
