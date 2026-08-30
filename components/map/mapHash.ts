import { getNode } from "@/lib/data/graph";
import { PATHS } from "@/components/home/paths";

export type MapHashState = { node?: string; path?: string };

/** Parses `#node=...` / `#path=...` off the current URL. Returns an empty
 * object for an empty or absent hash — never guesses a default selection. */
export function readMapHash(): MapHashState {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return {
    node: params.get("node") ?? undefined,
    path: params.get("path") ?? undefined,
  };
}

/** A hash is only ever acted on if it names a real node or journey — an
 * empty, malformed, or unrecognized value is treated as no selection at
 * all, never as an error. */
export function isValidMapHash({ node, path }: MapHashState): boolean {
  if (node) return !!getNode(node);
  if (path) return PATHS.some((p) => p.id === path);
  return false;
}

/** Removes `#node=...` / `#path=...` from the URL via `replaceState` — no
 * navigation, no new history entry, no reload. */
export function clearMapHash() {
  if (typeof window === "undefined") return;
  if (window.location.hash === "") return;
  history.replaceState(null, "", window.location.pathname + window.location.search);
}
