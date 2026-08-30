"use client";

import { useMemo, useState } from "react";
import { neighborsOf, graphNodes, type NodeType } from "@/lib/data/graph";

/**
 * Hover and focus both "preview" a node (highlight it + its neighbors) —
 * deliberately symmetric so keyboard users get the exact same information
 * mouse users get; nothing is hover-only. Clicking/activating "pins" the
 * preview open so it survives the pointer/focus moving away, which is what
 * keeps the panel's real navigation link on screen long enough to use it.
 *
 * Two more ways to highlight, both dismissed the moment a single node is
 * hovered/focused/clicked (a specific node always wins over a broad one):
 * - `focusType` dims everything except one column (Projects/Roles/
 *   Capabilities) — the expanded map's "focus" controls.
 * - `pathHighlight` lights up a specific, named set of node ids — the
 *   homepage's "Choose a path" journeys.
 */
export function useGraphInteraction() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [focusType, setFocusType] = useState<NodeType | null>(null);
  const [pathHighlight, setPathHighlightState] = useState<{
    id: string;
    label: string;
    nodeIds: string[];
  } | null>(null);

  const activeId = pinnedId ?? hoveredId;

  const highlighted = useMemo(() => {
    if (activeId) return new Set([activeId, ...neighborsOf(activeId)]);
    if (pathHighlight) return new Set(pathHighlight.nodeIds);
    if (focusType) return new Set(graphNodes.filter((n) => n.type === focusType).map((n) => n.id));
    return null;
  }, [activeId, pathHighlight, focusType]);

  function clearBroadHighlights() {
    setFocusType(null);
    setPathHighlightState(null);
  }

  return {
    activeId,
    highlighted,
    focusType,
    pathHighlight,
    onNodeEnter: (id: string) => {
      clearBroadHighlights();
      setHoveredId(id);
    },
    onNodeLeave: () => setHoveredId(null),
    onNodeFocus: (id: string) => {
      clearBroadHighlights();
      setHoveredId(id);
    },
    onNodeBlur: () => setHoveredId(null),
    onNodeSelect: (id: string) => {
      clearBroadHighlights();
      setPinnedId((cur) => (cur === id ? null : id));
    },
    /** Unconditionally pins a node — for the side panel's quick-start
     * links, which should always open that node rather than toggle it. */
    pinNode: (id: string) => {
      clearBroadHighlights();
      setPinnedId(id);
    },
    clearPinned: () => setPinnedId(null),
    /** Dim every node except one column — null clears it. Clears any
     * pinned/hovered node and any path highlight, since only one broad
     * highlight mode makes sense at a time. */
    setFocusType: (type: NodeType | null) => {
      setHoveredId(null);
      setPinnedId(null);
      setPathHighlightState(null);
      setFocusType(type);
    },
    /** Light up a named, evidence-backed set of node ids — null clears it. */
    setPathHighlight: (path: { id: string; label: string; nodeIds: string[] } | null) => {
      setHoveredId(null);
      setPinnedId(null);
      setFocusType(null);
      setPathHighlightState(path);
    },
    /** Full reset — the expanded map's "Reset view" control. */
    reset: () => {
      setHoveredId(null);
      setPinnedId(null);
      setFocusType(null);
      setPathHighlightState(null);
    },
  };
}

export type GraphInteraction = ReturnType<typeof useGraphInteraction>;
