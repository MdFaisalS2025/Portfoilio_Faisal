import { SystemsMap } from "./SystemsMap";
import { SystemsMapMobile } from "./SystemsMapMobile";

/**
 * Renders both layouts and toggles visibility with CSS breakpoints rather
 * than a JS viewport check — avoids any SSR/hydration mismatch and means
 * there's no "capability gate" to get wrong (unlike the old WebGL scene,
 * this is plain DOM/SVG, so there's nothing to fail on low-end hardware).
 */
export function SystemsMapSection() {
  return (
    <>
      <div className="hidden md:block">
        <SystemsMap />
      </div>
      <div className="md:hidden">
        <SystemsMapMobile />
      </div>
    </>
  );
}
