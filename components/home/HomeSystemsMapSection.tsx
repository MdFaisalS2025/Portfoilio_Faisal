"use client";

import { SystemsMap } from "@/components/map/SystemsMap";
import { SystemsMapMobile } from "@/components/map/SystemsMapMobile";
import { ExpandedMapView } from "@/components/map/ExpandedMapView";
import { useGraphInteraction } from "@/components/map/useGraphInteraction";
import { useExpandedMapFromHash } from "@/components/map/useExpandedMapFromHash";

/**
 * The homepage's map instance owns one shared interaction so its preview
 * panel's "Choose a path" empty state can highlight nodes on the same map a
 * visitor is already looking at. Below `lg`, SystemsMapMobile is a
 * different, tab/search/accordion-based experience without hover/dim
 * state, so journeys aren't offered there — the mobile map's own
 * search+category filters cover the same discovery need.
 *
 * The switch is `lg` (1024px), not `md` (768px): the desktop graph's six
 * capability columns plus a project and a role column need real horizontal
 * room for readable, non-overlapping labels — confirmed empirically, since
 * cramming that many columns into a 768px-wide tablet viewport produces
 * exactly the label collisions this whole layout exists to avoid. Tablet
 * widths get the mobile accordion instead, same as phones.
 */
export function HomeSystemsMapSection() {
  const interaction = useGraphInteraction();
  const map = useExpandedMapFromHash();

  return (
    <div className="flex flex-col gap-10 lg:h-full lg:min-h-0">
      <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:min-h-0">
        <SystemsMap interaction={interaction} onExpand={map.open} fillHeight />
      </div>
      <div className="lg:hidden">
        <SystemsMapMobile />
      </div>

      <ExpandedMapView open={map.expanded} onClose={map.close} />
    </div>
  );
}
