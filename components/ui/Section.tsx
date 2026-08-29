import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  as: As = "section",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "section" | "div";
}) {
  return (
    <As className={cn("mx-auto w-full max-w-5xl px-6 py-16 md:py-24", className)}>
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

export function Heading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display text-3xl md:text-5xl font-medium text-espresso mb-6",
        className
      )}
    >
      {children}
    </h2>
  );
}
