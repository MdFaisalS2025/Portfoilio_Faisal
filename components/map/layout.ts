import { graphNodes, graphEdges, CAPABILITY_CATEGORIES, type GraphNode } from "@/lib/data/graph";

export type PositionedNode = GraphNode & { x: number; y: number };

// Sized for a near-full-bleed desktop map (see SystemsMap) — wide and tall
// enough that rebalancing the node grid, not a CSS scale transform, is what
// makes labels legible at the larger rendered size.
export const VIEW_WIDTH = 1760;
export const VIEW_HEIGHT = 820;

// Tightened from the previous pass: less dead space between the three
// groups, and project nodes get their own effective "lane" width even
// though they're a single column, so their (larger, see MapNode) dots and
// always-visible labels have room without crowding the role column.
export const CAPABILITY_BAND = { left: 70, right: 720 };
export const PROJECT_X = 1000;
export const ROLE_X = 1560;
export const HEADING_Y = 28;
const PADDING_Y = 90;

/**
 * Deterministic layout (capability clusters | project column | role column)
 * — no physics simulation, so it's stable, testable, and identical every
 * render (important for SSR/hydration and for keyboard-nav order to make
 * visual sense).
 *
 * Capabilities are laid out one column per evidence-backed category (see
 * CAPABILITY_CATEGORIES), not just packed row-major — so the resting state
 * already reads as five labeled clusters instead of an unexplained grid of
 * dots. See the column headings rendered in SystemsMap for the labels.
 */
export function computeLayout(): PositionedNode[] {
  const byType: Record<GraphNode["type"], GraphNode[]> = {
    capability: [],
    project: [],
    role: [],
  };
  for (const node of graphNodes) byType[node.type].push(node);

  const positioned: PositionedNode[] = [];
  const usableHeight = VIEW_HEIGHT - PADDING_Y * 2;

  for (const [type, x] of [
    ["project", PROJECT_X],
    ["role", ROLE_X],
  ] as const) {
    const nodes = byType[type];
    const step = nodes.length > 1 ? usableHeight / (nodes.length - 1) : 0;
    const startY = nodes.length > 1 ? PADDING_Y : VIEW_HEIGHT / 2;
    nodes.forEach((node, i) => {
      positioned.push({ ...node, x, y: startY + step * i });
    });
  }

  const categories = CAPABILITY_CATEGORIES;
  const colStep =
    categories.length > 1
      ? (CAPABILITY_BAND.right - CAPABILITY_BAND.left) / (categories.length - 1)
      : 0;
  const maxCategorySize = Math.max(
    ...categories.map(
      (cat) => byType.capability.filter((n) => n.categories?.includes(cat)).length
    )
  );
  const rowStep = maxCategorySize > 1 ? usableHeight / (maxCategorySize - 1) : 0;

  categories.forEach((cat, colIndex) => {
    const inCategory = byType.capability.filter((n) => n.categories?.includes(cat));
    inCategory.forEach((node, rowIndex) => {
      positioned.push({
        ...node,
        x: CAPABILITY_BAND.left + colStep * colIndex,
        y: PADDING_Y + rowStep * rowIndex,
      });
    });
  });

  return positioned;
}

/** Category label x-positions, matching computeLayout's column math exactly
 * — used to render the capability cluster headings above the grid. */
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
