"use client";

import { useEffect, useState } from "react";
import { readMapHash, isValidMapHash } from "./mapHash";

/** Matches the `md` breakpoint the map components already switch on
 * (`hidden md:block` / `md:hidden`) — this dialog only ever renders the
 * desktop grid, so it must never auto-open below that width. */
function isDesktopWidth() {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
}

/**
 * Drives the expanded map dialog's open/closed state, auto-opening it when
 * the page loads (or the hash later changes) with a valid `#node=`/`#path=`
 * — so a shared link restores what it points to without the visitor having
 * to find and click "Expand map" first. Starts closed on every render
 * (including the client's first, pre-hydration one) so server and client
 * markup match; the hash is only ever read after mount.
 *
 * Below the desktop breakpoint this never auto-opens — the dialog only ever
 * shows the desktop grid, which isn't usable at that width. <SystemsMapMobile>
 * has its own, separate hash-restoration for exactly that case.
 */
export function useExpandedMapFromHash() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    function apply() {
      if (isDesktopWidth() && isValidMapHash(readMapHash())) setExpanded(true);
    }
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  return { expanded, open: () => setExpanded(true), close: () => setExpanded(false) };
}
