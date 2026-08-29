"use client";

import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { SearchIcon, DocumentIcon, ShieldCheckIcon } from "@/components/ui/icons";

const GAUGE_RADIUS = 36;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

function Gauge({ id, percent, label }: { id: string; percent: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
        <circle cx="48" cy="48" r={GAUGE_RADIUS} fill="none" stroke="var(--color-espresso)" strokeOpacity="0.1" strokeWidth="9" />
        <circle
          id={id}
          cx="48"
          cy="48"
          r={GAUGE_RADIUS}
          fill="none"
          stroke="var(--color-terracotta)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={GAUGE_CIRCUMFERENCE}
          strokeDashoffset={GAUGE_CIRCUMFERENCE}
          transform="rotate(-90 48 48)"
        />
        <text x="48" y="53" textAnchor="middle" className="font-display" fontSize="17" fill="var(--color-espresso)" data-gauge-text={id}>
          0%
        </text>
      </svg>
      <span className="text-sm text-espresso-soft text-center max-w-[9rem]">{label}</span>
      <span className="sr-only">{percent}%</span>
    </div>
  );
}

export function F1PolicyRetrieval() {
  const ref = useScrollReveal<HTMLDivElement>((el, tl) => {
    const branches = el.querySelectorAll<HTMLElement>("[data-branch]");
    const fusion = el.querySelector<HTMLElement>("[data-fusion]");
    const reranker = el.querySelector<HTMLElement>("[data-reranker]");
    const outcomes = el.querySelectorAll<HTMLElement>("[data-outcome]");

    tl.from(branches, { opacity: 0, x: -16, duration: 0.4, stagger: 0.15, ease: "power2.out" })
      .from(fusion, { opacity: 0, scale: 0.8, duration: 0.35, ease: "back.out(2)" }, "-=0.1")
      .from(reranker, { opacity: 0, scale: 0.8, duration: 0.35, ease: "back.out(2)" }, "-=0.15")
      .from(outcomes, { opacity: 0, x: 16, duration: 0.35, stagger: 0.1, ease: "power2.out" }, "-=0.1");

    const g1 = el.querySelector<SVGCircleElement>("#gauge-abstention");
    const g2 = el.querySelector<SVGCircleElement>("#gauge-faithfulness");
    const t1 = el.querySelector<SVGTextElement>('[data-gauge-text="gauge-abstention"]');
    const t2 = el.querySelector<SVGTextElement>('[data-gauge-text="gauge-faithfulness"]');
    const counter = { a: 0, b: 0 };

    tl.to(g1, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" }, "-=0.1")
      .to(counter, { a: 100, duration: 0.45, ease: "power2.out", onUpdate: () => { if (t1) t1.textContent = `${Math.round(counter.a)}%`; } }, "<")
      .to(g2, { strokeDashoffset: GAUGE_CIRCUMFERENCE * 0.007, duration: 0.45, ease: "power2.out" }, "<")
      .to(counter, { b: 99.3, duration: 0.45, ease: "power2.out", onUpdate: () => { if (t2) t2.textContent = `${counter.b.toFixed(1)}%`; } }, "<");
  });

  return (
    <div ref={ref} className="flex flex-col gap-10">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center flex-shrink-0">
          <div className="w-16 h-16 bg-espresso/10 flex items-center justify-center">
            <DocumentIcon className="w-7 h-7 text-espresso-soft" />
          </div>
          <span className="text-sm text-espresso-soft">Student question</span>
        </div>

        <div className="flex flex-col gap-4 flex-1 w-full">
          <div data-branch className="flex items-center gap-3 border border-espresso/10 px-4 py-3">
            <SearchIcon className="w-5 h-5 text-sage-dark flex-shrink-0" />
            <span className="text-sm text-espresso-soft">Dense embeddings over USF policy + 8 CFR</span>
          </div>
          <div data-branch className="flex items-center gap-3 border border-espresso/10 px-4 py-3">
            <SearchIcon className="w-5 h-5 text-sage-dark flex-shrink-0" />
            <span className="text-sm text-espresso-soft">PostgreSQL full-text search (exact terms like I-765)</span>
          </div>
        </div>

        <div data-fusion className="flex flex-col items-center gap-2 text-center flex-shrink-0">
          <div className="w-16 h-16 bg-amber/25 flex items-center justify-center font-mono text-xs font-semibold text-espresso">
            RRF
          </div>
          <span className="text-sm text-espresso-soft">Fusion</span>
        </div>

        <div data-reranker className="flex flex-col items-center gap-2 text-center flex-shrink-0">
          <div className="w-16 h-16 bg-terracotta/20 flex items-center justify-center">
            <ShieldCheckIcon className="w-7 h-7 text-terracotta-dark" />
          </div>
          <span className="text-sm text-espresso-soft">LLM reranker + abstention gate</span>
        </div>

        <div className="flex flex-col gap-3 flex-shrink-0">
          <div data-outcome className="text-sm font-medium text-terracotta-dark border border-terracotta/40 px-3 py-2 text-center">
            Cited answer
          </div>
          <div data-outcome className="text-sm text-espresso-soft border border-espresso/15 px-3 py-2 text-center">
            Abstains, no answer
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-10 pt-6 border-t border-espresso/10">
        <Gauge id="gauge-abstention" percent={100} label="Abstention accuracy on 28 held-out questions" />
        <Gauge id="gauge-faithfulness" percent={99.3} label="Citation faithfulness" />
      </div>

      <p className="text-xs text-espresso-soft border-t border-espresso/10 pt-4">
        Independent student project, not an official USF service. Always confirm anything that matters with USF
        International Services or an immigration attorney.
      </p>
    </div>
  );
}
