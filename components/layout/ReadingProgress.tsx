/**
 * A thin top-of-viewport bar that fills as the reader scrolls through a long
 * page. Driven entirely by CSS scroll-driven animations (`animation-timeline:
 * scroll()`) — no scroll listener, no dependency. Browsers without support
 * (Safari, older Firefox) get `@supports` fallback: the bar never renders,
 * rather than showing a broken or static one.
 *
 * Purely a visual echo of native scroll position — it asserts nothing a
 * screen reader user doesn't already have, so it's hidden from the
 * accessibility tree entirely.
 */
export function ReadingProgress() {
  return <div className="reading-progress" aria-hidden="true" />;
}
