"use client";

import { SystemsMap } from "@/components/map/SystemsMap";
import { SystemsMapMobile } from "@/components/map/SystemsMapMobile";
import { ExpandedMapView } from "@/components/map/ExpandedMapView";
import { useGraphInteraction } from "@/components/map/useGraphInteraction";
import { useExpandedMapFromHash } from "@/components/map/useExpandedMapFromHash";

/**
 * The homepage's map instance owns one shared interaction so its preview
 * panel's "Choose a path" empty state can highlight nodes on the same map a
 * visitor is already looking at. On mobile, SystemsMapMobile is a
 * different, tab/search/accordion-based experience without hover/dim
 * state, so journeys aren't offered there — the mobile map's own
 * search+category filters cover the same discovery need.
 */
export function HomeSystemsMapSection() {
  const interaction = useGraphInteraction();
  const map = useExpandedMapFromHash();

  return (
    <div className="flex flex-col gap-10">
      <div className="hidden md:block">
        <SystemsMap interaction={interaction} onExpand={map.open} />
      </div>
      <div className="md:hidden">
        <SystemsMapMobile />
      </div>

      <ExpandedMapView open={map.expanded} onClose={map.close} />
    </div>
  );
}
