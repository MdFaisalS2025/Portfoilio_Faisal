"use client";

import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { DocumentIcon, SearchIcon, ShieldCheckIcon, StampIcon } from "@/components/ui/icons";

const GAUGE_RADIUS = 42;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS;

function Gauge({
  id,
  percent,
  label,
  color,
}: {
  id: string;
  percent: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle
          cx="55"
          cy="55"
          r={GAUGE_RADIUS}
          fill="none"
          stroke="var(--color-espresso)"
          strokeOpacity="0.1"
          strokeWidth="10"
        />
        <circle
          id={id}
          cx="55"
          cy="55"
          r={GAUGE_RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={GAUGE_CIRCUMFERENCE}
          strokeDashoffset={GAUGE_CIRCUMFERENCE}
          transform="rotate(-90 55 55)"
        />
        <text
          x="55"
          y="60"
          textAnchor="middle"
          className="font-display"
          fontSize="20"
          fill="var(--color-espresso)"
          data-gauge-text={id}
        >
          0%
        </text>
      </svg>
      <span className="text-sm text-espresso-soft text-center max-w-[9rem]">
        {label}
      </span>
      <span className="sr-only">{percent}%</span>
    </div>
  );
}

export function RaeyTrustPipeline() {
  const ref = useScrollReveal<HTMLDivElement>((el, tl) => {
    const stages = el.querySelectorAll<HTMLElement>("[data-stage]");
    const stamp = el.querySelector<SVGElement>("[data-stamp]");

    tl.from(stages, {
      opacity: 0,
      y: 12,
      duration: 0.4,
      stagger: 0.15,
      ease: "power2.out",
    });

    if (stamp) {
      tl.fromTo(
        stamp,
        { opacity: 0, scale: 1.6, rotate: -20 },
        { opacity: 1, scale: 1, rotate: -8, duration: 0.4, ease: "back.out(2)" },
        "-=0.2"
      );
    }

    const gauge85 = el.querySelector<SVGCircleElement>("#gauge-85");
    const gauge82 = el.querySelector<SVGCircleElement>("#gauge-82");
    const text85 = el.querySelector<SVGTextElement>('[data-gauge-text="gauge-85"]');
    const text82 = el.querySelector<SVGTextElement>('[data-gauge-text="gauge-82"]');
    const counter = { v85: 0, v82: 0 };

    tl.to(
      gauge85,
      { strokeDashoffset: GAUGE_CIRCUMFERENCE * 0.15, duration: 1, ease: "power2.out" },
      "-=0.1"
    )
      .to(
        counter,
        {
          v85: 85,
          duration: 1,
          ease: "power2.out",
          onUpdate: () => {
            if (text85) text85.textContent = `${Math.round(counter.v85)}%`;
          },
        },
        "<"
      )
      .to(
        gauge82,
        { strokeDashoffset: GAUGE_CIRCUMFERENCE * 0.18, duration: 1, ease: "power2.out" },
        "<"
      )
      .to(
        counter,
        {
          v82: 82,
          duration: 1,
          ease: "power2.out",
          onUpdate: () => {
            if (text82) text82.textContent = `${Math.round(counter.v82)}%`;
          },
        },
        "<"
      );
  });

  return (
    <div ref={ref} className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div data-stage className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-none bg-espresso/10 flex items-center justify-center">
            <DocumentIcon className="w-7 h-7 text-espresso-soft" />
          </div>
          <span className="text-sm text-espresso-soft">Hospital SOP docs</span>
        </div>
        <Arrow />
        <div data-stage className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-none bg-sage/15 flex items-center justify-center">
            <SearchIcon className="w-7 h-7 text-sage-dark" />
          </div>
          <span className="text-sm text-espresso-soft">Retrieval</span>
        </div>
        <Arrow />
        <div data-stage className="relative flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-none bg-amber/25 flex items-center justify-center">
            <ShieldCheckIcon className="w-7 h-7 text-terracotta-dark" />
          </div>
          <span className="text-sm text-espresso-soft">Verification</span>
          <svg
            data-stamp
            className="absolute -top-4 -right-6 opacity-0"
            width="52"
            height="52"
            viewBox="0 0 52 52"
          >
            <circle cx="26" cy="26" r="24" fill="none" stroke="var(--color-terracotta)" strokeWidth="3" />
            <text
              x="26"
              y="24"
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="var(--color-terracotta-dark)"
            >
              CITED
            </text>
            <text x="26" y="34" textAnchor="middle" fontSize="7" fill="var(--color-terracotta-dark)">
              SOURCE
            </text>
          </svg>
        </div>
        <Arrow />
        <div data-stage className="flex flex-col items-center gap-2 text-center">
          <div className="w-16 h-16 rounded-none bg-terracotta/20 flex items-center justify-center">
            <StampIcon className="w-7 h-7 text-terracotta-dark" />
          </div>
          <span className="text-sm text-espresso-soft">Cited answer</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-10 pt-4 border-t border-espresso/10">
        <Gauge id="gauge-85" percent={85} color="var(--color-terracotta)" label="Unsafe-error answers caught" />
        <Gauge id="gauge-82" percent={82} color="var(--color-sage)" label="Valid answers passed" />
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="40" height="16" viewBox="0 0 40 16" className="hidden md:block text-espresso/30 flex-shrink-0">
      <line x1="0" y1="8" x2="32" y2="8" stroke="currentColor" strokeWidth="2" />
      <polygon points="32,3 40,8 32,13" fill="currentColor" />
    </svg>
  );
}
