import Link from "next/link";
import { lessons } from "@/lib/data/lessons";

/** Hides itself entirely if there are no lessons to show. */
export function WhatIGotWrong() {
  if (lessons.length === 0) return null;

  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-wide text-espresso-soft mb-2">
        What I got wrong
      </h2>
      <p className="text-sm text-espresso-soft max-w-2xl mb-6">
        A negative result is still a result. These are the places where my
        first answer fell short, and what I did about it.
      </p>
      <ul className="grid gap-4 md:grid-cols-2 list-none p-0">
        {lessons.map((l) => (
          <li key={l.project} className="border border-espresso/10 p-4">
            <Link
              href={l.href}
              className="font-medium text-espresso hover:text-terracotta-dark"
            >
              {l.project} →
            </Link>
            <p className="text-sm text-espresso-soft mt-2">{l.wrong}</p>
            <p className="text-sm text-espresso mt-2">{l.changed}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
