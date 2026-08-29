import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-espresso/15 text-espresso-soft px-3 py-1 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}
