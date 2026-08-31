import { projects } from "./projects";
import { archiveEntries } from "./archive";
import { experience } from "./experience";
import { credentials } from "./credentials";
import { researchNotes } from "./research";
import { roleId, capabilityNodes } from "./graph";

export type SearchResultType =
  | "Project"
  | "Archive project"
  | "Role"
  | "Credential"
  | "Research note"
  | "Capability";

export type SearchItem = {
  type: SearchResultType;
  title: string;
  subtitle?: string;
  href: string;
};

/** One flat, static index built from the same data every other page
 * already renders from — no separate content model, no network call. */
export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const p of projects) {
    items.push({ type: "Project", title: p.name, subtitle: p.tagline, href: `/projects/${p.slug}` });
  }

  for (const e of archiveEntries) {
    items.push({ type: "Archive project", title: e.name, subtitle: e.domain, href: "/projects#archive" });
  }

  for (const r of experience) {
    items.push({
      type: "Role",
      title: r.title,
      subtitle: r.org,
      href: `/experience#${roleId(r)}`,
    });
  }

  for (const c of credentials) {
    items.push({ type: "Credential", title: c.name, subtitle: c.issuer, href: "/credentials" });
  }

  for (const note of researchNotes) {
    items.push({ type: "Research note", title: note.title, href: "/research" });
  }

  // Sourced from the graph's own capability nodes, not a second list — a
  // capability here always traces back to a real role/project field.
  for (const node of capabilityNodes) {
    items.push({
      type: "Capability",
      title: node.label,
      subtitle: node.categories?.[0],
      href: `/#node=${node.id}`,
    });
  }

  return items;
}
