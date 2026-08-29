import { graphNodes, graphEdges, type GraphNode } from "@/lib/data/graph";

export type PositionedNode = GraphNode & { x: number; y: number };

export const VIEW_WIDTH = 1200;
export const VIEW_HEIGHT = 760;

const COLUMN_X: Record<GraphNode["type"], number> = {
  capability: 150,
  project: 600,
  role: 1050,
};

const PADDING_Y = 60;

// The capability list is long enough (50+ real skills, one per role/project
// evidence) that a single vertical column packs nodes too close together to
// meet a real touch/click target size — so capabilities lay out as a grid
// (a handful of columns spanning a band) instead of one dense line. Project
// and role counts stay small enough for a single column to have plenty of
// room on its own.
const CAPABILITY_BAND = { left: 60, right: 340 };
const CAPABILITY_MAX_ROWS = 13;

/**
 * Deterministic layout (capability grid | project column | role column) —
 * no physics simulation, so it's stable, testable, and identical every
 * render (important for SSR/hydration and for keyboard-nav order to make
 * visual sense).
 */
export function computeLayout(): PositionedNode[] {
  const byType: Record<GraphNode["type"], GraphNode[]> = {
    capability: [],
    project: [],
    role: [],
  };
  for (const node of graphNodes) byType[node.type].push(node);

  const positioned: PositionedNode[] = [];

  for (const type of ["project", "role"] as const) {
    const nodes = byType[type];
    const usableHeight = VIEW_HEIGHT - PADDING_Y * 2;
    const step = nodes.length > 1 ? usableHeight / (nodes.length - 1) : 0;
    const startY = nodes.length > 1 ? PADDING_Y : VIEW_HEIGHT / 2;
    nodes.forEach((node, i) => {
      positioned.push({ ...node, x: COLUMN_X[type], y: startY + step * i });
    });
  }

  const capabilities = byType.capability;
  const columns = Math.max(1, Math.ceil(capabilities.length / CAPABILITY_MAX_ROWS));
  const rows = Math.ceil(capabilities.length / columns);
  const usableHeight = VIEW_HEIGHT - PADDING_Y * 2;
  const rowStep = rows > 1 ? usableHeight / (rows - 1) : 0;
  const colStep =
    columns > 1 ? (CAPABILITY_BAND.right - CAPABILITY_BAND.left) / (columns - 1) : 0;
  const startY = rows > 1 ? PADDING_Y : VIEW_HEIGHT / 2;

  capabilities.forEach((node, i) => {
    const col = Math.floor(i / rows);
    const row = i % rows;
    positioned.push({
      ...node,
      x: CAPABILITY_BAND.left + colStep * col,
      y: startY + rowStep * row,
    });
  });

  return positioned;
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
