"use client";

import { useMemo, useState } from "react";
import { neighborsOf } from "@/lib/data/graph";

/**
 * Hover and focus both "preview" a node (highlight it + its neighbors) —
 * deliberately symmetric so keyboard users get the exact same information
 * mouse users get; nothing is hover-only. Clicking/activating "pins" the
 * preview open so it survives the pointer/focus moving away, which is what
 * keeps the panel's real navigation link on screen long enough to use it.
 */
export function useGraphInteraction() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  const activeId = pinnedId ?? hoveredId;

  const highlighted = useMemo(() => {
    if (!activeId) return null;
    return new Set([activeId, ...neighborsOf(activeId)]);
  }, [activeId]);

  return {
    activeId,
    highlighted,
    onNodeEnter: (id: string) => setHoveredId(id),
    onNodeLeave: () => setHoveredId(null),
    onNodeFocus: (id: string) => setHoveredId(id),
    onNodeBlur: () => setHoveredId(null),
    onNodeSelect: (id: string) => setPinnedId((cur) => (cur === id ? null : id)),
    /** Unconditionally pins a node — for the side panel's quick-start
     * links, which should always open that node rather than toggle it. */
    pinNode: (id: string) => setPinnedId(id),
    clearPinned: () => setPinnedId(null),
  };
}
