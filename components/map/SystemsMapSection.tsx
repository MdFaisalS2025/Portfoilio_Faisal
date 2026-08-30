"use client";

import { SystemsMap } from "./SystemsMap";
import { SystemsMapMobile } from "./SystemsMapMobile";
import { ExpandedMapView } from "./ExpandedMapView";
import { useExpandedMapFromHash } from "./useExpandedMapFromHash";

/**
 * Renders both layouts and toggles visibility with CSS breakpoints rather
 * than a JS viewport check — avoids any SSR/hydration mismatch and means
 * there's no "capability gate" to get wrong (unlike the old WebGL scene,
 * this is plain DOM/SVG, so there's nothing to fail on low-end hardware).
 */
export function SystemsMapSection() {
  const map = useExpandedMapFromHash();

  return (
    <>
      <div className="hidden md:block">
        <SystemsMap onExpand={map.open} />
      </div>
      <div className="md:hidden">
        <SystemsMapMobile />
      </div>
      <ExpandedMapView open={map.expanded} onClose={map.close} />
    </>
  );
}
