"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Runs a GSAP timeline builder once when the returned ref scrolls into view.
 * Uses a plain IntersectionObserver (rather than GSAP's ScrollTrigger) to decide
 * *when* to play: IntersectionObserver evaluates live against actual layout, so
 * it can't go stale the way ScrollTrigger's cached start/end offsets can when a
 * web font swaps in and shifts everything below the fold after the trigger's
 * position was first computed.
 * Respects prefers-reduced-motion by jumping straight to the animation's end state.
 */
export function useScrollReveal<T extends HTMLElement>(
  build: (el: T, tl: gsap.core.Timeline) => void
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let observer: IntersectionObserver | undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      build(el, tl);

      if (reduced) {
        tl.progress(1);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            tl.play();
            observer?.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      observer.observe(el);
    }, el);

    return () => {
      observer?.disconnect();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
