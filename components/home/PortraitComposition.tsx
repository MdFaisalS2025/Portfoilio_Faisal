"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

// Real pixel dimensions of public/images/portrait-cutout.png (trimmed to the
// subject's own bounding box, not the original 2048x1152 canvas) — kept in
// sync so the container reserves the exact right space and never shifts
// layout while the image loads.
const PORTRAIT_WIDTH = 1264;
const PORTRAIT_HEIGHT = 1090;

const MAX_TILT_DEG = 2.5;
const LERP_RATE = 0.12;

/**
 * A small, decorative echo of the Systems Map's own visual language (dots +
 * thin connecting lines, sage/graphite/one terracotta), not a second real
 * graph and not a set of invented project relationships — purely an
 * introduction to the map the visitor reaches a few seconds later. Kept
 * low-contrast and behind the subject so it never competes with the real
 * map's own legibility requirements.
 */
function DecorativeTraces() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-[0.32]"
    >
      <g stroke="currentColor" className="text-espresso-soft" strokeWidth="0.35" fill="none">
        <path d="M 18 78 L 40 60 L 62 68 L 86 40" />
        <path d="M 40 60 L 46 34" />
      </g>
      <circle cx="18" cy="78" r="1.8" className="fill-sage-dark" />
      <circle cx="40" cy="60" r="1.8" className="fill-graphite" />
      <circle cx="62" cy="68" r="1.8" className="fill-sage-dark" />
      <circle cx="46" cy="34" r="1.8" className="fill-sage-dark" />
      <circle cx="86" cy="40" r="2.4" className="fill-terracotta" />
    </svg>
  );
}

/**
 * Replaces the old bordered photo card: the transparent cutout sits
 * directly over the page's existing grid background (see the hero
 * Section's `bg-systems-grid`, unchanged), with a soft drop-shadow that
 * follows the subject's own silhouette (CSS `filter: drop-shadow`, which
 * reads the PNG's alpha channel) instead of a boxed card shadow. A small
 * pointer-driven 2.5D tilt (CSS `perspective` + `rotateX`/`rotateY` +
 * `translateZ`, no WebGL/canvas/3D library) is layered on for pointer-fine
 * desktops only; everything else renders the identical static composition.
 */
export function PortraitComposition() {
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = stageRef.current;
    if (!el) return;

    const target = { rx: 0, ry: 0 };
    const current = { rx: 0, ry: 0 };
    let raf = 0;
    let running = false;
    const SETTLE_EPSILON = 0.01; // degrees — below this, treat as converged

    function tick() {
      current.rx += (target.rx - current.rx) * LERP_RATE;
      current.ry += (target.ry - current.ry) * LERP_RATE;
      el!.style.setProperty("--rx", `${current.rx.toFixed(3)}deg`);
      el!.style.setProperty("--ry", `${current.ry.toFixed(3)}deg`);
      // The shadow drifts a few px opposite the tilt, so it reads as one
      // light source rather than a fixed decal sitting under the cutout.
      el!.style.setProperty("--shadow-x", `${(current.ry * -1.4).toFixed(2)}px`);
      el!.style.setProperty("--shadow-y", `${(10 - current.rx * 1.4).toFixed(2)}px`);

      const settled =
        Math.abs(target.rx - current.rx) < SETTLE_EPSILON &&
        Math.abs(target.ry - current.ry) < SETTLE_EPSILON;
      if (settled) {
        // No sustained per-frame work while the visitor isn't interacting —
        // the loop only restarts from onMove/onLeave, not on every frame.
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    }
    function ensureRunning() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    }

    function onMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      // Clamp: a pointer that's briefly outside the box mid-move (fast
      // mouse travel) shouldn't fling the tilt past MAX_TILT_DEG.
      const nx = Math.min(1, Math.max(0, px));
      const ny = Math.min(1, Math.max(0, py));
      target.ry = (nx - 0.5) * MAX_TILT_DEG * 2;
      target.rx = -(ny - 0.5) * MAX_TILT_DEG * 2;
      ensureRunning();
    }
    function onLeave() {
      target.rx = 0;
      target.ry = 0;
      ensureRunning();
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    // No initial tick: at rest (target === current === 0) there is nothing
    // to animate, so the loop stays off until the first pointermove.
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.16 }}
      className="relative w-full"
      style={{ perspective: reducedMotion ? undefined : "1400px" }}
    >
      <div
        ref={stageRef}
        className="relative w-full"
        style={
          reducedMotion
            ? undefined
            : {
                transformStyle: "preserve-3d",
                transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
              }
        }
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 text-espresso-soft"
          style={reducedMotion ? undefined : { transform: "translateZ(-36px) scale(1.1)" }}
        >
          <DecorativeTraces />
        </div>

        <div
          className="relative z-10"
          style={{
            aspectRatio: `${PORTRAIT_WIDTH} / ${PORTRAIT_HEIGHT}`,
            transform: reducedMotion ? undefined : "translateZ(24px)",
          }}
        >
          <Image
            src="/images/portrait-cutout.png"
            alt="Mohamed Faisal Sindhi"
            fill
            // Matches the actual rendered width of this column (82% of the
            // grid column per HeroReveal's `md:max-w-[82%]`), same
            // reasoning as before: a plain vw guess ignores
            // --container-wide's cap and over-requests at very wide
            // viewports.
            sizes="(max-width: 767px) 80vw, (max-width: 1799px) 38vw, 672px"
            className="object-contain"
            style={{
              filter: reducedMotion
                ? "drop-shadow(0 14px 22px rgba(17, 17, 17, 0.22))"
                : "drop-shadow(var(--shadow-x, 0px) var(--shadow-y, 10px) 22px rgba(17, 17, 17, 0.22))",
            }}
            priority
          />
        </div>
      </div>
    </motion.div>
  );
}
