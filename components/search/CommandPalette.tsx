"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CommandPaletteDialog = dynamic(
  () => import("./CommandPaletteDialog").then((m) => m.CommandPaletteDialog),
  { ssr: false }
);

/**
 * Always-mounted trigger only. The actual dialog — and the search index it
 * builds from projects/archive/experience/credentials/research data — loads
 * on first real intent: a click, the ⌘K/Ctrl+K shortcut, or the mobile
 * nav's "Search" menu item (via the `open-command-palette` event) — not as
 * part of every route's initial JS.
 */
export function CommandPalette() {
  const [active, setActive] = useState(false);
  const [pendingTrigger, setPendingTrigger] = useState<HTMLElement | null>(null);

  function trigger(el?: HTMLElement) {
    setPendingTrigger(el ?? (document.activeElement as HTMLElement | null));
    setActive(true);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isShortcut) {
        e.preventDefault();
        trigger();
      }
    }
    // Lets the mobile nav's plain "Search" menu item open this same
    // palette without prop-drilling state through NavBar.
    function onExternalOpen(e: Event) {
      trigger((e as CustomEvent<HTMLElement | undefined>).detail);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", onExternalOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", onExternalOpen);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={(e) => trigger(e.currentTarget)}
        className="hidden sm:flex items-center gap-2 font-mono text-xs text-espresso-soft hover:text-terracotta-dark transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark border border-espresso/15 px-2.5 py-1.5"
        aria-label="Search the site"
      >
        Search
        <span className="text-espresso-soft/70 border-l border-espresso/15 pl-2">⌘K</span>
      </button>

      {active ? (
        <CommandPaletteDialog
          initialTrigger={pendingTrigger}
          onRequestClose={() => setActive(false)}
        />
      ) : null}
    </>
  );
}
