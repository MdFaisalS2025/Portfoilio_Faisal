"use client";

import { useState } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

const STAGES = [
  { label: "175K legal articles", width: 100, color: "var(--color-espresso)" },
  { label: "BM25 shortlist", width: 70, color: "var(--color-sage)" },
  { label: "Neural reranking", width: 45, color: "var(--color-amber)" },
  { label: "LLM citation-check gate", width: 25, color: "var(--color-terracotta)" },
];

export function SwissLegalFunnel() {
  const [showGateLogic, setShowGateLogic] = useState(false);
  const ref = useScrollReveal<HTMLDivElement>((el, tl) => {
    const bars = el.querySelectorAll<HTMLElement>("[data-funnel-bar]");
    const badge = el.querySelector<HTMLElement>("[data-badge]");
    const f1Before = el.querySelector<HTMLElement>("[data-f1-before]");
    const f1After = el.querySelector<HTMLElement>("[data-f1-after]");

    tl.from(bars, {
      scaleX: 0,
      transformOrigin: "left",
      duration: 0.5,
      stagger: 0.2,
      ease: "power2.out",
    })
      .fromTo(
        badge,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
        "-=0.1"
      )
      .from(f1Before, { scaleY: 0, transformOrigin: "bottom", duration: 0.5 }, "-=0.2")
      .from(f1After, { scaleY: 0, transformOrigin: "bottom", duration: 0.5 }, "-=0.35");
  });

  return (
    <div ref={ref} className="flex flex-col md:flex-row gap-12">
      <div className="flex-1 flex flex-col gap-3">
        {STAGES.map((stage) => (
          <div key={stage.label} className="flex items-center gap-3">
            <div className="flex-1">
              <div
                data-funnel-bar
                className="h-9 rounded-none flex items-center px-3 text-xs font-medium text-parchment"
                style={{ width: `${stage.width}%`, backgroundColor: stage.color }}
              >
                {stage.label}
              </div>
            </div>
          </div>
        ))}
        <div
          data-badge
          className="mt-2 inline-flex w-fit items-center gap-2 rounded-sm border border-sage/40 text-sage-dark px-4 py-2 text-sm font-semibold"
        >
          ✓ Zero fabricated citations in evaluation
        </div>

        <button
          type="button"
          onClick={() => setShowGateLogic((v) => !v)}
          aria-expanded={showGateLogic}
          className="mt-2 text-left text-sm font-medium text-terracotta-dark hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark w-fit"
        >
          {showGateLogic ? "Hide" : "See"} why a citation is accepted or rejected →
        </button>
        {showGateLogic ? (
          <div className="mt-1 flex flex-col gap-2 text-sm text-espresso-soft max-w-md">
            <p>
              <span className="font-medium text-sage-dark">Accepted:</span> the
              cited article&apos;s retrieved text actually contains the specific
              rule or figure the answer states — the LLM gate checks the
              claim against the exact passage, not just the article title.
            </p>
            <p>
              <span className="font-medium text-terracotta-dark">Rejected:</span>{" "}
              the cited article is topically related but doesn&apos;t contain the
              specific claim, or no retrieved passage supports it — the gate
              blocks the answer rather than let a plausible-sounding citation
              through. &quot;Zero fabricated citations&quot; is this gate&apos;s measured
              result on the evaluation set, not a guarantee for every
              possible question.
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col items-center gap-3">
        <span className="text-sm text-espresso-soft">Macro-F1</span>
        <div className="flex items-end gap-4 h-32">
          <div className="flex flex-col items-center gap-1">
            <div
              data-f1-before
              className="w-10 bg-espresso/20 rounded-t"
              style={{ height: "60%" }}
            />
            <span className="text-xs text-espresso-soft">Baseline</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div
              data-f1-after
              className="w-10 bg-terracotta rounded-t"
              style={{ height: "100%" }}
            />
            <span className="text-xs font-semibold text-terracotta-dark">+19%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
