"use client";

import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

const AGENTS = [
  { id: "vitals", label: "Vitals", angle: -90 },
  { id: "labs", label: "Labs", angle: -30 },
  { id: "meds", label: "Medications", angle: 30 },
  { id: "notes", label: "Clinical notes", angle: 90 },
  { id: "history", label: "History", angle: 150 },
  { id: "explain", label: "Explainer", angle: 210 },
];

const CENTER = { x: 220, y: 180 };
const RADIUS = 130;

function pointOn(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER.x + RADIUS * Math.cos(rad),
    y: CENTER.y + RADIUS * Math.sin(rad),
  };
}

export function SentinelAgentGraph() {
  const ref = useScrollReveal<HTMLDivElement>((el, tl) => {
    const nodes = el.querySelectorAll<SVGGElement>("[data-agent-node]");
    const edges = el.querySelectorAll<SVGLineElement>("[data-agent-edge]");
    const pulses = el.querySelectorAll<SVGCircleElement>("[data-pulse]");
    const centerNode = el.querySelector<SVGGElement>("[data-center-node]");
    const timelineBar = el.querySelector<SVGGElement>("[data-comparison]");

    tl.from(nodes, {
      opacity: 0,
      scale: 0.6,
      transformOrigin: "center",
      duration: 0.35,
      stagger: 0.08,
      ease: "back.out(2)",
    })
      .from(edges, { opacity: 0, duration: 0.3, stagger: 0.05 }, "-=0.2")
      .from(centerNode, { opacity: 0, scale: 0.7, duration: 0.4, ease: "back.out(2)" }, "-=0.2");

    edges.forEach((edge, i) => {
      const x1 = parseFloat(edge.getAttribute("x1") || "0");
      const y1 = parseFloat(edge.getAttribute("y1") || "0");
      const x2 = parseFloat(edge.getAttribute("x2") || "0");
      const y2 = parseFloat(edge.getAttribute("y2") || "0");
      const pulse = pulses[i];
      if (pulse) {
        tl.fromTo(
          pulse,
          { attr: { cx: x1, cy: y1 }, opacity: 0 },
          {
            attr: { cx: x2, cy: y2 },
            opacity: 1,
            duration: 0.5,
            ease: "power1.inOut",
          },
          i === 0 ? "-=0.3" : "<0.08"
        ).to(pulse, { opacity: 0, duration: 0.2 });
      }
    });

    if (timelineBar) {
      const news2Marker = timelineBar.querySelector<SVGElement>("[data-news2]");
      const sentinelMarker = timelineBar.querySelector<SVGElement>("[data-sentinel]");
      const gapLabel = timelineBar.querySelector<SVGElement>("[data-gap]");
      tl.from(timelineBar, { opacity: 0, y: 10, duration: 0.4 })
        .from(sentinelMarker, { scale: 0, transformOrigin: "center", duration: 0.4, ease: "back.out(2)" }, "-=0.1")
        .from(news2Marker, { scale: 0, transformOrigin: "center", duration: 0.4, ease: "back.out(2)" }, "-=0.2")
        .from(gapLabel, { opacity: 0, duration: 0.3 }, "-=0.1");
    }
  });

  return (
    <div ref={ref} className="flex flex-col items-center gap-10">
      <svg width="440" height="360" viewBox="0 0 440 360" className="max-w-full">
        {AGENTS.map((agent) => {
          const p = pointOn(agent.angle);
          return (
            <line
              key={`edge-${agent.id}`}
              data-agent-edge
              x1={p.x}
              y1={p.y}
              x2={CENTER.x}
              y2={CENTER.y}
              stroke="var(--color-espresso)"
              strokeOpacity="0.15"
              strokeWidth="1.5"
            />
          );
        })}

        {AGENTS.map((agent) => (
          <circle
            key={`pulse-${agent.id}`}
            data-pulse
            cx={CENTER.x}
            cy={CENTER.y}
            r="5"
            fill="var(--color-amber)"
            opacity="0"
          />
        ))}

        {AGENTS.map((agent) => {
          const p = pointOn(agent.angle);
          return (
            <g key={agent.id} data-agent-node transform={`translate(${p.x}, ${p.y})`}>
              <circle r="34" fill="var(--color-sage)" fillOpacity="0.18" stroke="var(--color-sage-dark)" strokeWidth="1.5" />
              <text
                textAnchor="middle"
                dy="5"
                fontSize="11"
                fontWeight="600"
                fill="var(--color-espresso)"
              >
                {agent.label}
              </text>
            </g>
          );
        })}

        <g data-center-node transform={`translate(${CENTER.x}, ${CENTER.y})`}>
          <circle r="46" fill="var(--color-terracotta)" fillOpacity="0.9" />
          <text textAnchor="middle" dy="-4" fontSize="11" fontWeight="700" fill="var(--color-espresso)">
            Patient
          </text>
          <text textAnchor="middle" dy="10" fontSize="11" fontWeight="700" fill="var(--color-espresso)">
            Timeline
          </text>
        </g>
      </svg>

      <svg data-comparison width="440" height="110" viewBox="0 0 440 110" className="max-w-full">
        <line x1="20" y1="60" x2="420" y2="60" stroke="var(--color-espresso)" strokeOpacity="0.2" strokeWidth="2" />
        <text x="20" y="90" fontSize="11" fill="var(--color-espresso-soft)">Deterioration begins</text>

        <g data-sentinel transform="translate(180, 60)">
          <circle r="8" fill="var(--color-terracotta)" />
          <text y="-16" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--color-terracotta-dark)">
            SENTINEL alert
          </text>
        </g>

        <g data-news2 transform="translate(340, 60)">
          <circle r="8" fill="var(--color-espresso)" fillOpacity="0.5" />
          <text y="-16" textAnchor="middle" fontSize="11" fill="var(--color-espresso-soft)">
            NEWS2 alert
          </text>
        </g>

        <g data-gap>
          <line x1="180" y1="60" x2="340" y2="60" stroke="var(--color-terracotta)" strokeWidth="3" strokeDasharray="4 4" />
          <text x="260" y="36" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-terracotta-dark)">
            2.7 hrs earlier
          </text>
        </g>
      </svg>
    </div>
  );
}
