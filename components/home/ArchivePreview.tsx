import Link from "next/link";
import { archiveEntries } from "@/lib/data/archive";

/** Three of the five verified archive entries — the rest live on
 * /projects#archive, not duplicated here. Hides itself if the underlying
 * archive is ever empty. */
export function ArchivePreview() {
  if (archiveEntries.length === 0) return null;
  const preview = archiveEntries.slice(0, 3);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="font-mono text-xs uppercase tracking-wide text-espresso-soft">
          From the archive
        </h2>
        <Link
          href="/projects#archive"
          className="text-sm font-medium text-terracotta-dark hover:underline"
        >
          See all {archiveEntries.length} →
        </Link>
      </div>
      <ul className="flex flex-col divide-y divide-espresso/10 border-y border-espresso/10">
        {preview.map((entry) => (
          <li key={entry.name} className="py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <a
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-espresso hover:text-terracotta-dark transition-colors"
              >
                {entry.name} ↗
              </a>
              <span className="font-mono text-xs text-espresso-soft">{entry.year}</span>
            </div>
            <p className="text-xs text-espresso-soft">{entry.domain}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
