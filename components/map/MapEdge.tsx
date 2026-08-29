"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { PositionedNode } from "./layout";

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
  const d = `M ${source.x} ${source.y} C ${(source.x + target.x) / 2} ${source.y}, ${(source.x + target.x) / 2} ${target.y}, ${target.x} ${target.y}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const length = el.getTotalLength();
    if (reducedMotion) {
      el.style.strokeDasharray = "";
      el.style.strokeDashoffset = "0";
      return;
    }
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;
    const tween = gsap.to(el, {
      strokeDashoffset: 0,
      duration: 0.8,
      delay,
      ease: "power2.out",
    });
    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <path
      ref={ref}
      d={d}
      fill="none"
      stroke={emphasized ? "var(--color-terracotta)" : "var(--color-espresso)"}
      strokeOpacity={dimmed ? 0.08 : emphasized ? 0.85 : 0.18}
      strokeWidth={emphasized ? 1.6 : 1}
      className="transition-[stroke-opacity,stroke] duration-200"
    />
  );
}
