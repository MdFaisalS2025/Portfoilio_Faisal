"use client";

import { useEffect, useRef, useState } from "react";
import type { PositionedNode } from "./layout";

/** Draws each edge in with a stroke-dashoffset sweep — pure CSS
 * (`@keyframes map-edge-draw` in globals.css), not GSAP. The per-edge delay
 * still needs measuring `getTotalLength()` in JS (path length depends on
 * the two nodes' positions), but the animation itself is a CSS animation
 * so this map no longer pulls GSAP into every route that renders it. */
export function MapEdge({
  source,
  target,
  emphasized,
  dimmed,
  reducedMotion,
  delay,
}: {
  source: PositionedNode;
  target: PositionedNode;
  emphasized: boolean;
  dimmed: boolean;
  reducedMotion: boolean;
  delay: number;
}) {
  const ref = useRef<SVGPathElement>(null);
  const [length, setLength] = useState<number | null>(null);
  const d = `M ${source.x} ${source.y} C ${(source.x + target.x) / 2} ${source.y}, ${(source.x + target.x) / 2} ${target.y}, ${target.x} ${target.y}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setLength(el.getTotalLength());
  }, [d]);

  const drawStyle: React.CSSProperties =
    length === null || reducedMotion
      ? {}
      : {
          strokeDasharray: length,
          strokeDashoffset: length,
          animation: `map-edge-draw 0.8s ${delay}s ease-out forwards`,
        };

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke={emphasized ? "var(--color-terracotta)" : "var(--color-espresso)"}
      strokeOpacity={dimmed ? 0.08 : emphasized ? 0.85 : 0.18}
      strokeWidth={emphasized ? 1.6 : 1}
      className="transition-[stroke-opacity,stroke] duration-200"
      style={drawStyle}
    />
  );
}
