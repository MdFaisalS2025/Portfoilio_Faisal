import Link from "next/link";
import { researchNotes } from "@/lib/data/research";

/** "Inside the build" — points to the readable /research notes rather than
 * raw PDF/DOCX links directly. Hides itself entirely if there's ever
 * nothing verified to show. */
export function ResearchLog() {
  if (researchNotes.length === 0) return null;
  const featured = researchNotes[0];

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wide text-espresso-soft mb-1">
        Inside the build
      </p>
      <p className="text-sm text-espresso-soft mb-4 max-w-xl">
        RAEY publishes its own research log — what worked, what didn&apos;t,
        and why.
      </p>
      <p className="font-medium text-espresso mb-1">{featured.title}</p>
      <p className="text-sm text-espresso-soft mb-4">{featured.finding}</p>
      <Link href="/research" className="text-sm font-medium text-terracotta-dark hover:underline">
        Read the research notes →
      </Link>
    </div>
  );
}
