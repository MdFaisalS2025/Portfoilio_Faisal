import type { Metadata } from "next";
import { Section, Eyebrow, Heading } from "@/components/ui/Section";
import { credentials, CREDENTIAL_GROUPS, CREDENTIAL_TYPE_LABEL } from "@/lib/data/credentials";

export const metadata: Metadata = {
  title: "Credentials · Mohamed Faisal Sindhi",
  description:
    "Certifications, courses, job simulations, and program completions, grouped by AI & Data, Cloud & Platforms, Business & Operations, and Academic Foundations.",
  alternates: { canonical: "/credentials" },
};

export default function CredentialsPage() {
  return (
    <Section>
      <Eyebrow>By domain</Eyebrow>
      <Heading>Credentials</Heading>
      <p className="text-lg text-espresso-soft leading-relaxed max-w-2xl mb-12">
        Grouped by domain, not chronology. Each entry shows the issuer, what
        kind of credential it is, and when it was issued. Credential IDs
        are kept private.
      </p>

      <div className="flex flex-col gap-12">
        {CREDENTIAL_GROUPS.map((group) => {
          const items = credentials.filter((c) => c.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group}>
              <h2 className="font-display text-xl font-medium text-espresso mb-4">
                {group}
              </h2>
              <ul className="flex flex-col divide-y divide-espresso/10 border-y border-espresso/10">
                {items.map((c) => (
                  <li
                    key={c.name}
                    className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                  >
                    <div className="min-w-[220px]">
                      <p className="font-medium text-espresso">{c.name}</p>
                      <p className="text-sm text-espresso-soft">{c.issuer}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-[11px] uppercase tracking-wide border border-espresso/15 px-2 py-0.5 text-espresso-soft">
                        {CREDENTIAL_TYPE_LABEL[c.type]}
                      </span>
                      <span className="font-mono text-xs text-espresso-soft whitespace-nowrap">
                        {c.issued}
                        {c.expires ? ` – ${c.expires}` : ""}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
