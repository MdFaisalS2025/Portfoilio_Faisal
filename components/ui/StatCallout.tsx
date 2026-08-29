export function StatCallout({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-none border border-espresso/10 bg-parchment-dark/60 px-5 py-4">
      <span className="font-display text-3xl md:text-4xl font-semibold text-terracotta-dark">
        {value}
      </span>
      <span className="text-sm text-espresso-soft">{label}</span>
    </div>
  );
}
