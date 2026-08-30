"use client";

import { useEffect, useRef, useState } from "react";
import { SystemsMap } from "./SystemsMap";
import { MapSearch } from "./MapSearch";
import { useGraphInteraction } from "./useGraphInteraction";
import { PATHS } from "@/components/home/paths";
import { readMapHash, isValidMapHash, clearMapHash } from "./mapHash";

/** Applies a hash's node/path to `interaction` — only if it validates.
 * A malformed or unknown value is silently ignored rather than pinning a
 * phantom node with no real graph data behind it. */
function applyMapHash(
  interaction: ReturnType<typeof useGraphInteraction>,
  hash: ReturnType<typeof readMapHash>
) {
  if (!isValidMapHash(hash)) return;
  if (hash.node) {
    interaction.pinNode(hash.node);
  } else if (hash.path) {
    const found = PATHS.find((p) => p.id === hash.path);
    if (found) interaction.setPathHighlight({ ...found, nodeIds: [...found.nodeIds] });
  }
}

/**
 * Viewport-filling map mode, built on the native <dialog> element for its
 * built-in focus trapping. Escape and focus-restoration are still handled
 * explicitly (rather than trusting the browser's default <dialog> behavior
 * alone) so both work the same way everywhere this runs.
 *
 * Owns its own interaction (rather than letting SystemsMap create one)
 * specifically so it can sync the current selection to the URL hash —
 * opening a shared link restores the same node or journey.
 */
export function ExpandedMapView({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const interaction = useGraphInteraction();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      // `document.activeElement` defaults to `<body>` when the dialog was
      // opened automatically from a shared URL rather than a click — a
      // real, safe focus-restoration target, not a "missing trigger" case.
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      applyMapHash(interaction, readMapHash());
    }
    if (!open && dialog.open) {
      dialog.close();
      previouslyFocused.current?.focus();
      clearMapHash();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // While open, react to the hash changing underneath us — a user pasting a
  // different valid #node=/#path= URL, or using browser back/forward —
  // without requiring a reload.
  useEffect(() => {
    if (!open) return;
    function onHashChange() {
      applyMapHash(interaction, readMapHash());
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the URL hash in sync with the current selection while open, so
  // "Copy link" always reflects what's on screen.
  useEffect(() => {
    if (!open) return;
    const params = new URLSearchParams();
    if (interaction.activeId) params.set("node", interaction.activeId);
    else if (interaction.pathHighlight) params.set("path", interaction.pathHighlight.id);
    const next = params.toString() ? `#${params.toString()}` : " ";
    history.replaceState(null, "", next.trim() === "" ? window.location.pathname : next);
  }, [open, interaction.activeId, interaction.pathHighlight]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the URL is still correct in the address
      // bar, so there's nothing else to fall back to here.
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
        }
      }}
      aria-label="Expanded systems map"
      className="m-0 h-screen max-h-none w-screen max-w-none bg-parchment p-0 backdrop:bg-espresso/70"
    >
      {open ? (
        <div className="h-full w-full overflow-y-auto">
          <div className="mx-auto flex max-w-[var(--container-wide)] flex-wrap items-center justify-between gap-4 px-[var(--gutter)] py-6">
            <h2 className="font-display text-2xl font-medium text-espresso">
              Systems map
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <MapSearch interaction={interaction} />
              <button
                type="button"
                onClick={handleCopyLink}
                className="font-mono text-xs border border-espresso/20 px-3 py-1.5 text-espresso-soft hover:border-terracotta-dark hover:text-terracotta-dark transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark whitespace-nowrap"
              >
                {copied ? "Link copied" : "Copy link"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="font-mono text-xs border border-espresso/20 px-3 py-1.5 text-espresso-soft hover:border-terracotta-dark hover:text-terracotta-dark transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
              >
                Close (Esc)
              </button>
            </div>
          </div>
          <div className="mx-auto max-w-[var(--container-wide)] px-[var(--gutter)] pb-10">
            <SystemsMap showControls interaction={interaction} />
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
