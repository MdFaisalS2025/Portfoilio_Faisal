import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  as: As = "section",
  wide = false,
}: {
  className?: string;
  children: React.ReactNode;
  as?: "section" | "div";
  /** Prose pages (About, Experience, case studies) stay at the original
   * ~1024px reading width. Visual/interactive sections (the map, the
   * project explorer, the hero) can use the wider canvas instead. */
  wide?: boolean;
}) {
  return (
    <As
      className={cn(
        "mx-auto w-full px-[var(--gutter)] py-16 md:py-24",
        wide ? "max-w-[var(--container-wide)]" : "max-w-[var(--container-prose)]",
        className
      )}
    >
      {children}
    </As>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display italic text-terracotta-dark text-sm md:text-base mb-3 tracking-wide">
      {children}
    </p>
  );
}

/** The page's single <h1> — every current usage is a page title, never a
 * subsection, so this always renders h1 rather than taking a level prop. */
export function Heading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "font-display text-3xl md:text-5xl font-medium text-espresso mb-6",
        className
      )}
    >
      {children}
    </h1>
  );
}
