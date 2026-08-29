"use client";

import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

const CLIENTS = [
  { x: 60, y: 40 },
  { x: 60, y: 160 },
  { x: 60, y: 280 },
];
const HUB = { x: 300, y: 160 };

export function ControlHubFederatedDiagram() {
  const ref = useScrollReveal<HTMLDivElement>((el, tl) => {
    const clientNodes = el.querySelectorAll<SVGGElement>("[data-client]");
    const rings = el.querySelectorAll<SVGCircleElement>("[data-ring]");
    const packets = el.querySelectorAll<SVGRectElement>("[data-packet]");
    const hub = el.querySelector<SVGGElement>("[data-hub]");
    const counterText = el.querySelector<HTMLElement>("[data-counter]");

    tl.from(clientNodes, { opacity: 0, x: -20, duration: 0.4, stagger: 0.15, ease: "power2.out" })
      .to(rings, { scale: 1.6, opacity: 0, transformOrigin: "center", duration: 0.9, stagger: 0.15, ease: "power1.out" }, "-=0.1")
      .from(hub, { opacity: 0, scale: 0.7, duration: 0.4, ease: "back.out(2)" }, "-=0.4");

    CLIENTS.forEach((c, i) => {
      const packet = packets[i];
      if (!packet) return;
      tl.fromTo(
        packet,
        { attr: { x: c.x - 6, y: c.y - 6 }, opacity: 0 },
        {
          attr: { x: HUB.x - 6, y: HUB.y - 6 },
          opacity: 1,
          duration: 0.6,
          ease: "power1.inOut",
        },
        i === 0 ? "-=0.2" : "<0.1"
      ).to(packet, { opacity: 0, duration: 0.2 });
    });

    if (counterText) {
      const counter = { v: 0 };
      tl.to(counter, {
        v: 400,
        duration: 1,
        ease: "power2.out",
        onUpdate: () => {
          counterText.textContent = `$${Math.round(counter.v)}K`;
        },
      });
    }
  });

  return (
    <div ref={ref} className="flex flex-col md:flex-row items-center gap-10">
      <svg width="380" height="320" viewBox="0 0 380 320" className="max-w-full">
        {CLIENTS.map((c, i) => (
          <g key={`client-${i}`} data-client transform={`translate(${c.x}, ${c.y})`}>
            <circle data-ring r="22" fill="none" stroke="var(--color-sage)" strokeWidth="2" opacity="0" />
            <circle r="22" fill="var(--color-sage)" fillOpacity="0.2" stroke="var(--color-sage-dark)" strokeWidth="1.5" />
            <g
              transform="translate(-9, -8)"
              fill="none"
              stroke="var(--color-espresso)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 16V8l4 3V8l4 3V6l5 3.5V16H1Z" />
              <path d="M4 16v-3M8 16v-3M12 16v-3" />
            </g>
          </g>
        ))}

        {CLIENTS.map((c, i) => (
          <line
            key={`edge-${i}`}
            x1={c.x + 22}
            y1={c.y}
            x2={HUB.x - 30}
            y2={HUB.y}
            stroke="var(--color-espresso)"
            strokeOpacity="0.12"
            strokeWidth="1.5"
          />
        ))}

        {CLIENTS.map((c, i) => (
          <rect
            key={`packet-${i}`}
            data-packet
            x={c.x - 6}
            y={c.y - 6}
            width="12"
            height="12"
            rx="3"
            fill="var(--color-amber)"
            opacity="0"
          />
        ))}

        <g data-hub transform={`translate(${HUB.x}, ${HUB.y})`}>
          <circle r="34" fill="var(--color-terracotta)" />
          <text textAnchor="middle" dy="5" fontSize="11" fontWeight="700" fill="var(--color-espresso)">
            Aggregator
          </text>
        </g>
      </svg>

      <div className="flex flex-col gap-4 max-w-xs">
        <div className="flex items-center gap-2 text-sm text-espresso-soft">
          <span className="text-terracotta-dark">✕</span>
          <span className="line-through">Raw client data</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-espresso-soft">
          <span className="text-sage-dark">✓</span>
          <span>Model weight updates only</span>
        </div>
        <div className="pt-4 border-t border-espresso/10">
          <div className="font-display text-4xl font-semibold text-terracotta-dark" data-counter>
            $0K
          </div>
          <p className="text-sm text-espresso-soft mt-1">Projected annual savings</p>
        </div>
      </div>
    </div>
  );
}
