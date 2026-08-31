import { graphNodes, graphEdges, CAPABILITY_CATEGORIES, type GraphNode } from "@/lib/data/graph";

export type PositionedNode = GraphNode & { x: number; y: number };

// A coordinate-space reference, not an enforced shape: the SVG stretches to
// the container's real box via `preserveAspectRatio="none"`, so only the
// ratios between these constants (not their absolute size) matter for the
// x-axis. The y-axis for role/project nodes is recomputed from the
// container's *real measured pixel height* (see packLane below) rather than
// from this constant, since label-height collisions are a real-pixel
// problem that a fixed viewBox ratio can't see.
export const VIEW_WIDTH = 2000;
export const VIEW_HEIGHT = 1080;

export const CAPABILITY_BAND = { left: 150, right: 950 };
// PROJECT_X and ROLE_X are pulled further apart than a naive proportional
// split: with `w-max` sizing (see MapNode's comment), a wrapped project or
// role label's real width is its actual wrap-width cap, not a fraction of
// the coordinate space — so the real-pixel gap between these two columns'
// centers must exceed roughly (projectLabelWidth + roleLabelWidth) / 2 at
// the narrowest tested graph width, or their boxes overlap regardless of
// how far apart the columns "look" in the coordinate system.
// Widened again after the dot-anchor fix above: a role's box no longer
// shifts left by half its own width (the old `-translate-x-1/2` center
// anchor) but by its *full* width minus a small constant (the new
// `calc(-100% + 18px)`, needed so the dot lands on the anchor) — which
// moves the whole box roughly (boxWidth/2 - 18) further left/toward the
// project column than before. Confirmed empirically (collision checker) at
// 1366px-wide graph areas; re-verify with the same checker if either of
// these, the role max-width, or MapNode's DOT_ANCHOR_OFFSET_PX changes.
export const PROJECT_X = 1080;
export const ROLE_X = 1820;
export const HEADING_Y = 28;
const CAPABILITY_PADDING_Y = 70;

// Single source of truth for dot sizes (MapNode's TYPE_STYLES reads this
// too) and the fixed pixel distance from a node's (x, y) anchor to its
// dot's true center. That distance is constant regardless of label size —
// see MapNode's long comment on why — which is exactly what lets packLane
// below place roles/projects using only the box's total *span*, without
// needing to know where within that span the anchor point falls.
export const DOT_SIZE: Record<GraphNode["type"], number> = {
  project: 26,
  role: 16,
  capability: 9,
};
const NODE_PADDING_PX = 10; // matches MapNode's button p-2.5
export const DOT_ANCHOR_OFFSET_PX: Record<GraphNode["type"], number> = {
  project: NODE_PADDING_PX + DOT_SIZE.project / 2,
  role: NODE_PADDING_PX + DOT_SIZE.role / 2,
  capability: NODE_PADDING_PX + DOT_SIZE.capability / 2,
};

// Fallback line-count heuristic, used only until a real measurement lands
// (see the "measured vs. estimated" note on packLane below) — character
// widths in a monospace font don't perfectly match this guess, which is
// exactly why the real DOM measurement takes over as soon as it's ready.
const ROLE_CHARS_PER_LINE = 21; // matches MapNode's 170px role-label wrap width at text-[13px]
const PROJECT_CHARS_PER_LINE = 22; // matches MapNode's 180px project-label wrap width at text-[13px]
const LABEL_LINE_HEIGHT_PX = 15.6; // 13px font * the real 1.2 line-height (see MapNode's text-[13px]/[1.2])
export const LABEL_VERTICAL_PADDING_PX = 20; // matches MapNode's button p-2.5 (top+bottom)
const MIN_ROW_GAP_PX = 20; // leaves room for the 4px focus-outline offset + 2px outline on each side

function estimateLineCount(label: string, charsPerLine: number): number {
  const words = label.split(" ");
  let lines = 1;
  let lineLen = 0;
  for (const word of words) {
    const wordLen = word.length + (lineLen > 0 ? 1 : 0);
    if (lineLen + wordLen > charsPerLine && lineLen > 0) {
      lines++;
      lineLen = word.length;
    } else {
      lineLen += wordLen;
    }
  }
  return lines;
}

function estimateLabelHeightPx(label: string, charsPerLine: number): number {
  return estimateLineCount(label, charsPerLine) * LABEL_LINE_HEIGHT_PX + LABEL_VERTICAL_PADDING_PX;
}

/**
 * Places a column of role/project nodes using each label's *real rendered
 * height* rather than even index spacing, so a run of long, multi-line
 * titles (e.g. "Research Assistant, Applied Machine Learning") can't
 * collide with its neighbors. Returns y in VIEW_HEIGHT-space so the result
 * plugs into the same coordinate system as the SVG edges and the
 * capability columns.
 *
 * `measuredHeights` comes from an offscreen DOM probe in SystemsMap (see
 * useMeasuredLabelHeights) rendered with the exact same classes as the real
 * label, so it reflects actual font-metric line wrapping rather than a
 * character-count guess. A character-count estimate is used as the
 * fallback for any node missing from that map (before the first
 * measurement effect runs, or a graph height of `null` pre-ResizeObserver).
 *
 * The *packing* (non-overlapping vertical spans via cursor += height + gap)
 * is independent of where within its box a node's anchor sits — collision
 * safety only needs each box's total height. But the returned value is an
 * *anchor*, not a box position, and MapNode places the dot at a fixed
 * offset from one particular edge of the box (bottom edge for a role,
 * top edge for a project — see MapNode's comment and DOT_ANCHOR_OFFSET_PX
 * above), not at the box's center. `type` picks the matching formula so
 * the anchor this function returns is exactly where MapNode will render
 * the dot, keeping the SVG edge endpoint and the visible dot in the same
 * place regardless of label length.
 */
function packLane(
  nodes: GraphNode[],
  type: "role" | "project",
  charsPerLine: number,
  availableHeightPx: number | null,
  measuredHeights: Map<string, number> | null
): number[] {
  if (nodes.length === 0) return [];

  if (!availableHeightPx) {
    const usable = VIEW_HEIGHT - CAPABILITY_PADDING_Y * 2;
    return nodes.length > 1
      ? nodes.map((_, i) => CAPABILITY_PADDING_Y + (usable / (nodes.length - 1)) * i)
      : [VIEW_HEIGHT / 2];
  }

  const heightsPx = nodes.map((n) => {
    const measured = measuredHeights?.get(n.id);
    return measured != null
      ? measured + LABEL_VERTICAL_PADDING_PX
      : estimateLabelHeightPx(n.label, charsPerLine);
  });
  const totalPx = heightsPx.reduce((a, b) => a + b, 0) + MIN_ROW_GAP_PX * Math.max(0, nodes.length - 1);
  const extraPx = Math.max(0, availableHeightPx - totalPx);
  const gapPx = nodes.length > 1 ? MIN_ROW_GAP_PX + extraPx / (nodes.length - 1) : 0;
  const startPx = nodes.length > 1 ? 0 : Math.max(0, (availableHeightPx - heightsPx[0]) / 2);
  const dotOffset = DOT_ANCHOR_OFFSET_PX[type];

  let cursor = startPx;
  return nodes.map((_, i) => {
    const boxTop = cursor;
    const boxHeight = heightsPx[i];
    // Project: dot flush against the box's top edge (flex-col, dot first).
    // Role: dot flush against the box's bottom edge (flex-row-reverse,
    // items-end). Matches the two transform branches in MapNode exactly.
    const anchor = type === "project" ? boxTop + dotOffset : boxTop + boxHeight - dotOffset;
    cursor += boxHeight + gapPx;
    // Convert the real-pixel fraction into VIEW_HEIGHT-space so it composes
    // with the rest of the coordinate system (edges + capability columns).
    return (anchor / availableHeightPx) * VIEW_HEIGHT;
  });
}

/**
 * Deterministic layout (capability clusters | project column | role column)
 * — no physics simulation, so it's stable and testable. Capabilities are
 * laid out one column per evidence-backed category (see
 * CAPABILITY_CATEGORIES); roles and projects are packed vertically by
 * estimated real label height (see packLane) once the graph area's real
 * pixel height is known, so long titles can't collide.
 */
export function computeLayout(
  graphHeightPx: number | null = null,
  measuredHeights: Map<string, number> | null = null
): PositionedNode[] {
  const byType: Record<GraphNode["type"], GraphNode[]> = {
    capability: [],
    project: [],
    role: [],
  };
  for (const node of graphNodes) byType[node.type].push(node);

  const positioned: PositionedNode[] = [];

  const projectYs = packLane(byType.project, "project", PROJECT_CHARS_PER_LINE, graphHeightPx, measuredHeights);
  byType.project.forEach((node, i) => positioned.push({ ...node, x: PROJECT_X, y: projectYs[i] }));

  const roleYs = packLane(byType.role, "role", ROLE_CHARS_PER_LINE, graphHeightPx, measuredHeights);
  byType.role.forEach((node, i) => positioned.push({ ...node, x: ROLE_X, y: roleYs[i] }));

  const categories = CAPABILITY_CATEGORIES;
  const colStep =
    categories.length > 1
      ? (CAPABILITY_BAND.right - CAPABILITY_BAND.left) / (categories.length - 1)
      : 0;
  const usableCapabilityHeight = VIEW_HEIGHT - CAPABILITY_PADDING_Y * 2;
  const maxCategorySize = Math.max(
    ...categories.map(
      (cat) => byType.capability.filter((n) => n.categories?.includes(cat)).length
    )
  );
  const rowStep = maxCategorySize > 1 ? usableCapabilityHeight / (maxCategorySize - 1) : 0;

  categories.forEach((cat, colIndex) => {
    const inCategory = byType.capability.filter((n) => n.categories?.includes(cat));
    inCategory.forEach((node, rowIndex) => {
      positioned.push({
        ...node,
        x: CAPABILITY_BAND.left + colStep * colIndex,
        y: CAPABILITY_PADDING_Y + rowStep * rowIndex,
      });
    });
  });

  return positioned;
}

/** Category label x-positions, matching computeLayout's column math exactly
 * — used to render the capability cluster headings in the reserved header
 * band above the graph. */
export function capabilityColumnPositions(): { category: string; x: number }[] {
  const categories = CAPABILITY_CATEGORIES;
  const colStep =
    categories.length > 1
      ? (CAPABILITY_BAND.right - CAPABILITY_BAND.left) / (categories.length - 1)
      : 0;
  return categories.map((category, i) => ({
    category,
    x: CAPABILITY_BAND.left + colStep * i,
  }));
}

export function edgesWithPositions(positioned: PositionedNode[]) {
  const byId = new Map(positioned.map((n) => [n.id, n]));
  return graphEdges
    .map((e) => {
      const source = byId.get(e.source);
      const target = byId.get(e.target);
      if (!source || !target) return null;
      return { ...e, source, target };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);
}
