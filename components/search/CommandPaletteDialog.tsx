"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildSearchIndex, type SearchItem } from "@/lib/data/searchIndex";

const INDEX = buildSearchIndex();

/**
 * The actual ⌘K / Ctrl+K search dialog — plain substring filtering over the
 * site's own static data, no fuzzy-match library, no backend. Split out
 * from the always-mounted trigger button (see `CommandPalette.tsx`) so this
 * — and the search index it builds on module load — is only fetched once a
 * visitor actually shows intent to search, not on every route's initial
 * load.
 */
export function CommandPaletteDialog({
  initialTrigger,
  onRequestClose,
}: {
  /** Element to restore focus to on close — captured by the trigger shim
   * before this component's chunk even finished loading. */
  initialTrigger: HTMLElement | null;
  /** Tells the shim this dialog has closed, so it can unmount it. */
  onRequestClose: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(initialTrigger);
  const router = useRouter();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return INDEX.slice(0, 8);
    return INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  function closePalette() {
    setOpen(false);
  }

  function navigateTo(item: SearchItem) {
    closePalette();
    router.push(item.href);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    }
    if (!open && dialog.open) {
      dialog.close();
      triggerRef.current?.focus();
      onRequestClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={closePalette}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          closePalette();
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
        }
        if (e.key === "Enter" && results[activeIndex]) {
          e.preventDefault();
          navigateTo(results[activeIndex]);
        }
      }}
      aria-label="Site search"
      className="m-0 mt-24 w-full max-w-lg bg-parchment p-0 backdrop:bg-espresso/50"
    >
      {open ? (
        <div className="flex flex-col">
          <label htmlFor="command-palette-input" className="sr-only">
            Search projects, roles, credentials, and research notes
          </label>
          <input
            ref={inputRef}
            id="command-palette-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search projects, roles, credentials, research…"
            className="w-full border-b border-espresso/15 px-4 py-3 text-base text-espresso placeholder:text-espresso-soft focus:outline-none"
          />
          <ul role="listbox" aria-label="Search results" className="max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <li className="px-4 py-6 text-sm text-espresso-soft text-center">
                No matches for &quot;{query}&quot;.
              </li>
            ) : (
              results.map((item, i) => (
                <li key={`${item.type}-${item.title}`} role="option" aria-selected={i === activeIndex}>
                  <button
                    type="button"
                    onClick={() => navigateTo(item)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left ${
                      i === activeIndex ? "bg-parchment-dark/60" : ""
                    }`}
                  >
                    <span>
                      <span className="block text-sm text-espresso">{item.title}</span>
                      {item.subtitle ? (
                        <span className="block text-xs text-espresso-soft">{item.subtitle}</span>
                      ) : null}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wide text-espresso-soft whitespace-nowrap">
                      {item.type}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className="border-t border-espresso/10 px-4 py-2 flex justify-end">
            <button
              type="button"
              onClick={closePalette}
              className="font-mono text-[11px] text-espresso-soft hover:text-terracotta-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
            >
              Close (Esc)
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
