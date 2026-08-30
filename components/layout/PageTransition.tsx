"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Route-level fade/slide so navigating away from a clicked desk token (or any
 * link) lands on a page that arrives deliberately rather than snapping in.
 *
 * Kept on Framer Motion deliberately, not converted to a CSS `animation` —
 * that conversion was tried and measured: a CSS `animation-fill-mode:
 * backwards` opacity fade wrapping the entire page delayed the homepage's
 * LCP by ~1.3s across repeated production Lighthouse runs (portrait paint
 * waits for the wrapper's own paint-eligibility, whereas Framer Motion
 * applies `initial` as an inline style only after hydration, so the
 * server-rendered first paint is unaffected). Reverted for that reason —
 * this is exactly the "preserve existing behavior where removing a library
 * is risky" case. Framer Motion stays out of every OTHER route's initial
 * bundle regardless, since NavBar's Systems Map toggle (the other global
 * consumer, via the preview panel) is now dynamically imported.
 *
 * Native View Transitions (React's <ViewTransition>) aren't available here:
 * Next's App Router only exposes them through the React canary channel, and
 * this project pins the stable React release rather than switching channels
 * mid-pass. Hand-wiring the raw browser View Transitions API around the App
 * Router's client-side navigation (anchor-intercept + `document.
 * startViewTransition` around `router.push`) was considered and rejected —
 * Next doesn't expose a stable hook for exactly when the RSC payload commits,
 * so that wiring risks double-animating or breaking back/forward navigation,
 * which would look worse than this restrained fade.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={pathname}
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
        transition={{ duration: reducedMotion ? 0 : 0.25, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
