"use client";

import { cn } from "@/lib/utils";
import type { PositionedNode } from "./layout";

const TYPE_STYLES: Record<
  PositionedNode["type"],
  { size: number; bg: string; ring: string }
> = {
  project: { size: 14, bg: "bg-terracotta", ring: "ring-terracotta" },
  role: { size: 11, bg: "bg-graphite", ring: "ring-graphite" },
  capability: { size: 6, bg: "bg-sage-dark", ring: "ring-sage-dark" },
};

export function MapNode({
  node,
  dimmed,
  emphasized,
  labelVisible,
  viewWidth,
  viewHeight,
  onEnter,
  onLeave,
  onFocus,
  onBlur,
  onSelect,
}: {
  node: PositionedNode;
  dimmed: boolean;
  emphasized: boolean;
  /** Capability nodes stay label-less at rest (progressive disclosure, so
   * ~50 capabilities don't turn the map into a wall of text) — but the name
   * is always in the DOM for screen readers, just visually hidden until
   * this is true. Project/role labels are always visible. */
  labelVisible: boolean;
  viewWidth: number;
  viewHeight: number;
  onEnter: () => void;
  onLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onSelect: () => void;
}) {
  const style = TYPE_STYLES[node.type];
  const leftPct = (node.x / viewWidth) * 100;
  const topPct = (node.y / viewHeight) * 100;
  const align =
    node.type === "role"
      ? "items-end text-right flex-row-reverse"
      : "items-center text-center flex-col";

  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onSelect}
      aria-pressed={emphasized}
      className={cn(
        "group absolute -translate-x-1/2 -translate-y-1/2 flex gap-2 p-2.5 pointer-events-auto",
        "rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta-dark transition-opacity duration-200",
        align,
        dimmed ? "opacity-45" : "opacity-100"
      )}
      style={{ left: `${leftPct}%`, top: `${topPct}%` }}
    >
      <span
        className={cn(
          "block rounded-full transition-transform duration-200",
          style.bg,
          emphasized && "scale-125 ring-2 ring-offset-2 ring-offset-parchment",
          emphasized && style.ring
        )}
        style={{ width: style.size, height: style.size }}
        aria-hidden="true"
      />
      <span
        className={cn(
          "font-mono text-[11px] leading-tight",
          node.type === "role" ? "max-w-[150px] whitespace-normal" : "whitespace-nowrap",
          node.type === "project" ? "font-semibold text-espresso" : "text-espresso-soft",
          !labelVisible && "sr-only"
        )}
      >
        {node.label}
      </span>
    </button>
  );
}
