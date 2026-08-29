"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { getNode, neighborsOf, capabilityId, type GraphNode } from "@/lib/data/graph";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const TYPE_LABEL: Record<GraphNode["type"], string> = {
  project: "Project",
  role: "Role",
  capability: "Capability",
};

const QUICK_START = ["Healthcare AI", "Trustworthy Retrieval", "Technical Leadership"];

/**
 * A persistent side panel, not a floating overlay — it sits beside the map
 * (see SystemsMap) so it never covers a node or edge. When nothing is
 * selected it still does something useful: explains how to explore and
 * offers three real starting points instead of an empty box.
 */
export function NodePreviewPanel({
  nodeId,
  onClose,
  onPin,
}: {
  nodeId: string | null;
  onClose: () => void;
  onPin: (id: string) => void;
}) {
  const node = nodeId ? getNode(nodeId) : undefined;
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-live="polite"
      className="border border-espresso/15 bg-parchment px-5 py-4 min-h-[220px]"
    >
      <AnimatePresence mode="wait">
        {node ? (
          <motion.div
            key={node.id}
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="font-mono text-[11px] uppercase tracking-wide text-espresso-soft">
                {TYPE_LABEL[node.type]}
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close preview"
                className="font-mono text-xs text-espresso-soft hover:text-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
              >
                ×
              </button>
            </div>

            <h3 className="font-display text-xl font-medium text-espresso mb-1">
              {node.label}
            </h3>
            {node.sublabel ? (
              <p className="text-sm text-espresso-soft mb-1">{node.sublabel}</p>
            ) : null}
            {node.meta ? (
              <p className="font-mono text-xs text-espresso-soft mb-3">{node.meta}</p>
            ) : null}

            {node.type === "capability" ? <EvidenceList nodeId={node.id} /> : null}
            {node.type === "project" || node.type === "role" ? (
              <CapabilitiesList nodeId={node.id} />
            ) : null}

            {node.stat ? (
              <p className="mb-3">
                <span className="font-display text-2xl font-semibold text-terracotta-dark">
                  {node.stat.value}
                </span>{" "}
                <span className="text-sm text-espresso-soft">{node.stat.label}</span>
              </p>
            ) : null}

            {node.href ? (
              <Link
                href={node.href}
                className="text-sm font-medium text-terracotta-dark hover:underline"
              >
                {node.type === "project" ? "View case study →" : "See details →"}
              </Link>
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
          >
            <p className="font-mono text-[11px] uppercase tracking-wide text-espresso-soft mb-2">
              Explore the map
            </p>
            <p className="text-sm text-espresso-soft leading-relaxed mb-4">
              Hover, focus, or click any node to see what it connects to —
              or start with one of these:
            </p>
            <ul className="flex flex-col gap-2">
              {QUICK_START.map((label) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => onPin(capabilityId(label))}
                    className="text-sm font-medium text-terracotta-dark hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
                  >
                    {label} →
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** For a capability node: every real role or project it was actually used
 * or demonstrated in — the "evidence" behind the skill. */
function EvidenceList({ nodeId }: { nodeId: string }) {
  const evidence = neighborsOf(nodeId)
    .map((id) => getNode(id))
    .filter((n): n is GraphNode => !!n && (n.type === "project" || n.type === "role"));

  if (evidence.length === 0) return null;

  return (
    <div className="mb-3">
      <p className="text-xs text-espresso-soft mb-1.5">Evidenced in</p>
      <ul className="flex flex-col gap-1">
        {evidence.map((n) => (
          <li key={n.id} className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wide text-espresso-soft">
              {TYPE_LABEL[n.type]}
            </span>
            <Link
              href={n.href ?? "/projects"}
              className="text-sm font-medium text-terracotta-dark hover:underline"
            >
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** For a project or role node: the real capabilities it's connected to,
 * shown as plain tags (capabilities have no page of their own). */
function CapabilitiesList({ nodeId }: { nodeId: string }) {
  const capabilities = neighborsOf(nodeId)
    .map((id) => getNode(id))
    .filter((n): n is GraphNode => !!n && n.type === "capability");

  if (capabilities.length === 0) return null;

  return (
    <div className="mb-3">
      <p className="text-xs text-espresso-soft mb-1.5">Capabilities</p>
      <ul className="flex flex-wrap gap-1.5">
        {capabilities.map((c) => (
          <li
            key={c.id}
            className="font-mono text-[11px] border border-sage-dark/40 text-sage-dark px-2 py-0.5"
          >
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
