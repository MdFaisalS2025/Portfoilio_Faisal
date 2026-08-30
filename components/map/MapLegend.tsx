import { cn } from "@/lib/utils";

const ITEMS: { label: string; className: string }[] = [
  { label: "Project", className: "bg-terracotta" },
  { label: "Role", className: "bg-graphite" },
  { label: "Capability", className: "bg-sage-dark" },
];

/** A concise legend, not a caption nobody reads — three dot colors and
 * what a line between them means, so the map doesn't require prior
 * knowledge of this site's conventions to parse. */
export function MapLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      {ITEMS.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-xs text-espresso-soft">
          <span className={cn("inline-block w-2.5 h-2.5 rounded-full", item.className)} aria-hidden="true" />
          {item.label}
        </span>
      ))}
      <span className="flex items-center gap-1.5 text-xs text-espresso-soft">
        <span className="inline-block w-4 h-px bg-espresso/40" aria-hidden="true" />
        Real connection
      </span>
    </div>
  );
}
