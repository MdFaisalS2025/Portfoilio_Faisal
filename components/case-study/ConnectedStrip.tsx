import Link from "next/link";
import { neighborsOf, getNode } from "@/lib/data/graph";

/** The case-study page's "you are here" wayfinding — the project's real
 * neighbors in the systems map (its role and its capabilities), not a
 * decorative breadcrumb. */
export function ConnectedStrip({ projectSlug }: { projectSlug: string }) {
  const neighbors = neighborsOf(projectSlug)
    .map((id) => getNode(id))
    .filter((n): n is NonNullable<typeof n> => !!n);

  if (neighbors.length === 0) return null;

  return (
    <p className="font-mono text-xs text-espresso-soft mb-6 flex flex-wrap items-baseline gap-x-1.5 gap-y-2.5">
      <span className="uppercase tracking-wide text-espresso-soft">Connected</span>
      {neighbors.map((n, i) => (
        <span key={n.id}>
          <Link
            href={n.href ?? "/projects"}
            className="hover:text-terracotta-dark hover:underline py-1 inline-block"
          >
            {n.label}
          </Link>
          {i < neighbors.length - 1 ? " ·" : ""}
        </span>
      ))}
    </p>
  );
}
