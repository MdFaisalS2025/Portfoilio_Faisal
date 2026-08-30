import Link from "next/link";

const ITEMS = [
  {
    title: "RAEY",
    status: "Pre-launch",
    description:
      "Source-cited AI answers for hospital SOPs. Publishes its own research log, including what hasn't worked yet.",
    href: "/projects/raey",
  },
  {
    title: "Healthcare AI research & instruction",
    status: "Ongoing",
    description:
      "Graduate Teaching Assistant at USF, building the Hospital SOP Intelligence Platform and teaching two graduate courses.",
    href: "/experience",
  },
  {
    title: "F-1 Policy Intelligence",
    status: "Live, independent project",
    description:
      "An unofficial, citation-grounded Q&A tool for USF international-student visa questions.",
    href: "/projects/f1-policy-intelligence",
  },
];

/** Verified present-tense work only — no status here implies more than
 * what's confirmed (RAEY is explicitly pre-launch, not deployed). */
export function CurrentlyBuilding() {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wide text-espresso-soft mb-4">
        Currently building
      </p>
      <ul className="flex flex-col gap-4">
        {ITEMS.map((item) => (
          <li key={item.title} className="border-l-2 border-terracotta/40 pl-4">
            <Link
              href={item.href}
              className="font-display text-lg font-medium text-espresso hover:text-terracotta-dark transition-colors"
            >
              {item.title}
            </Link>
            <span className="ml-2 font-mono text-[10px] uppercase tracking-wide text-espresso-soft align-middle">
              {item.status}
            </span>
            <p className="text-sm text-espresso-soft mt-1 leading-relaxed">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
