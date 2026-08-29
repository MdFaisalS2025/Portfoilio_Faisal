"use client";

import Link from "next/link";
import { useMemo } from "react";
import { computeLayout, edgesWithPositions, VIEW_WIDTH, VIEW_HEIGHT } from "./layout";
import { MapNode } from "./MapNode";
import { MapEdge } from "./MapEdge";
import { NodePreviewPanel } from "./NodePreviewPanel";
import { useGraphInteraction } from "./useGraphInteraction";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Desktop/tablet Systems Map: a real, keyboard-navigable graph of every
 * project, role, and capability, laid out in three columns. Hidden below
 * the `md` breakpoint in favor of <SystemsMapMobile>; see SystemsMapSection.
 *
 * Progressive disclosure: with ~50 capability nodes now in the graph (every
 * role and project's real evidenced skills, not just literal tech stacks),
 * always rendering all of them with labels and all their edges would turn
 * "calm default state" into a wall of text. So capability labels and any
 * edge touching a capability only render once that capability (or something
 * connected to it) is the active/hovered/focused node — project and role
 * nodes and the edges between them are always visible, since there are only
 * ~13 of those and they're the primary content.
 */
export function SystemsMap() {
  const positioned = useMemo(() => computeLayout(), []);
  const edges = useMemo(() => edgesWithPositions(positioned), [positioned]);
  const reducedMotion = useReducedMotion();
  const {
    activeId,
    highlighted,
    onNodeEnter,
    onNodeLeave,
    onNodeFocus,
    onNodeBlur,
    onNodeSelect,
    pinNode,
    clearPinned,
  } = useGraphInteraction();

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div
        className="relative w-full md:flex-1 md:min-w-0"
        style={{ aspectRatio: `${VIEW_WIDTH} / ${VIEW_HEIGHT}` }}
      >
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

      <div className="w-full md:w-80 md:flex-shrink-0">
        <NodePreviewPanel nodeId={activeId} onClose={clearPinned} onPin={pinNode} />
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
  );
}
