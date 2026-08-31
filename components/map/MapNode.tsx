"use client";

import { cn } from "@/lib/utils";
import { DOT_SIZE, DOT_ANCHOR_OFFSET_PX, type PositionedNode } from "./layout";

const TYPE_STYLES: Record<PositionedNode["type"], { bg: string; ring: string }> = {
  // Projects are the primary content of the map, so their dot is
  // noticeably larger than roles/capabilities — a deliberate size
  // hierarchy, not just three arbitrary values (sizes live in layout.ts's
  // DOT_SIZE, shared with the anchor-offset math below).
  project: { bg: "bg-terracotta", ring: "ring-terracotta" },
  role: { bg: "bg-graphite", ring: "ring-graphite" },
  capability: { bg: "bg-sage-dark", ring: "ring-sage-dark" },
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
  const dotSize = DOT_SIZE[node.type];
  const leftPct = (node.x / viewWidth) * 100;
  const topPct = (node.y / viewHeight) * 100;
  const align =
    node.type === "role"
      ? "items-end text-right flex-row-reverse"
      : "items-center text-center flex-col";

  // The SVG edges terminate at (node.x, node.y) — the same point used for
  // `left`/`top` below — so that point must be the DOT's true center, not
  // this button's overall bounding-box center. A generic `-translate-1/2`
  // (box-center) only coincides with the dot's center when the label is
  // exactly as tall as the dot; once labels wrap to 2-3 lines (long role
  // and project titles routinely do), the box grows around the dot and the
  // two centers diverge — confirmed visually: edges were terminating deep
  // inside the label text, 60-90px from the actual dot they connect to.
  //
  // Fixed instead: DOT_ANCHOR_OFFSET_PX (padding + half the dot's own size,
  // see layout.ts) is a *constant* pixel distance from the dot to the edge
  // of the button it's flush against — the right edge for a role
  // (flex-row-reverse, dot last/rightmost, items-end/bottom-aligned) or the
  // top edge for a project/capability (flex-col, dot first/top).
  // Translating by exactly that distance from the button's un-transformed
  // position (which `left`/`top` place at this anchor) lands the dot
  // precisely on the anchor regardless of how many lines the label wraps
  // to. Horizontally, project/capability still center normally (`-50%`)
  // since `items-center` keeps the dot's x-center equal to the box's
  // x-center no matter the label's height. layout.ts's packLane uses this
  // exact same offset to compute the anchor in the first place, so the two
  // stay in lockstep by construction rather than by convention.
  const dotOffset = DOT_ANCHOR_OFFSET_PX[node.type];
  const transform =
    node.type === "role"
      ? `translate(calc(-100% + ${dotOffset}px), calc(-100% + ${dotOffset}px))`
      : `translate(-50%, -${dotOffset}px)`;

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
        // `w-max` (width: max-content) matters here, not just tidiness: an
        // absolutely-positioned box with an auto width and no `right` uses
        // a "shrink-to-fit" algorithm whose available width is derived from
        // its `left` offset (roughly containerWidth * (1 - leftPercent)).
        // For a node anchored near the right edge (e.g. ROLE_X at 85%),
        // that starves the label to a sliver and forces far more wrapped
        // lines than its max-width was meant to allow. `w-max` sizes the
        // box from its content instead, ignoring that positional squeeze.
        "group absolute flex gap-2 p-2.5 pointer-events-auto w-max",
        "rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta-dark transition-opacity duration-200",
        align,
        dimmed ? "opacity-45" : "opacity-100"
      )}
      style={{ left: `${leftPct}%`, top: `${topPct}%`, transform }}
    >
      <span
        className={cn(
          "block rounded-full transition-transform duration-200",
          style.bg,
          emphasized && "scale-125 ring-2 ring-offset-2 ring-offset-parchment",
          emphasized && style.ring
        )}
        style={{ width: dotSize, height: dotSize }}
        aria-hidden="true"
      />
      <span
        className={cn(
          // `text-[13px]/[1.2]` fuses font-size and line-height into one
          // utility deliberately: a separate `leading-tight` class was
          // being silently dropped by tailwind-merge (it treats any
          // `text-[...]` class as conflicting with `leading-*`, keeping
          // only the last one), which left every label at the browser's
          // default 1.5 line-height instead — confirmed via computed
          // style (19.5px/line at a 13px font, not the intended ~15.6px)
          // and the real cause of labels measuring taller than expected.
          "font-mono",
          node.type === "capability" ? "text-[12px]/[1.2]" : "text-[13px]/[1.2]",
          node.type === "role" && "max-w-[170px] whitespace-normal",
          // A revealed capability label can be as long as "Hospital SOP
          // Intelligence Platform" — nowrap would let it bleed sideways
          // into the neighboring capability column. Wrapping it instead
          // keeps it anchored under its own dot regardless of length.
          node.type === "capability" && "max-w-[132px] whitespace-normal",
          // Project labels used to be nowrap, which was only safe because a
          // pre-existing sizing bug (see the button's `w-max` comment) was
          // silently truncating their available width. With that fixed, an
          // unwrapped "Conversational AI Data Explorer" is wide enough to
          // reach into the role column, so it wraps too — still visually
          // heavier than a role label via font-semibold, just not nowrap.
          node.type === "project" && "max-w-[180px] whitespace-normal",
          node.type === "project" ? "font-semibold text-espresso" : "text-espresso-soft",
          !labelVisible && "sr-only"
        )}
      >
        {node.label}
      </span>
    </button>
  );
}
