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
 *
 * The switch is `lg`, not `md`: the desktop graph's six capability columns
 * plus a project and a role column need real horizontal room for readable,
 * non-overlapping labels (confirmed empirically — at 768px-wide tablet
 * widths, cramming that many columns into the space produces the exact
 * label collisions this component exists to avoid). Below `lg`, the
 * tab/search/accordion mobile map handles both phone and tablet widths.
 */
export function SystemsMapSection() {
  const map = useExpandedMapFromHash();

  return (
    <>
      <div className="hidden lg:block">
        <SystemsMap onExpand={map.open} />
      </div>
      <div className="lg:hidden">
        <SystemsMapMobile />
      </div>
      <ExpandedMapView open={map.expanded} onClose={map.close} />
    </>
  );
}
