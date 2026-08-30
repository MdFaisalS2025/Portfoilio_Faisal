import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow, Heading } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { education, experience } from "@/lib/data/experience";
import { roleId } from "@/lib/data/graph";

export const metadata: Metadata = {
  title: "About · Mohamed Faisal Sindhi",
  description:
    "From SEO and WordPress work in Chennai, to blockchain engineering in the UAE, to founding an AI company in Tampa.",
  alternates: { canonical: "/about" },
};

/** Each milestone links to the real role or project it maps to — the same
 * underlying data as the Systems Map and Experience page, not a decorative
 * timeline disconnected from the rest of the site. */
const timeline = [
  {
    place: "Manama, Bahrain",
    text: "Started out as a sales operations intern, tracing supply-chain workflows from manufacturing to retail and learning to find the real gap before proposing a fix.",
    org: "United National Dairy Company (Rayan)",
  },
  {
    place: "Chennai, India",
    text: "Started in SEO and WordPress development, learning how real users actually behave on the web one Google Ads report at a time.",
    org: "TechResx Technologies",
  },
  {
    place: "United Arab Emirates",
    text: "Moved into blockchain engineering, building a name service used by thousands of wallets and implementing privacy-preserving federated learning with Fully Homomorphic Encryption.",
    org: "Vee4 Software",
  },
  {
    place: "Tampa, Florida",
    text: "Pivoted into an M.S. in AI & Business Analytics at USF, then into healthcare AI research, building SENTINEL and teaching 500+ students along the way.",
    projectSlug: "sentinel",
  },
  {
    place: "RAEY",
    text: "Founded RAEY to put a hard rule into production AI: every answer cites its source. Still building it today.",
    projectSlug: "raey",
  },
];

function timelineHref(item: (typeof timeline)[number]) {
  if (item.projectSlug) return `/projects/${item.projectSlug}`;
  const role = item.org ? experience.find((r) => r.org === item.org) : undefined;
  return role ? `/experience#${roleId(role)}` : undefined;
}

export default function AboutPage() {
  return (
    <>
      <Section className="pb-8!">
        <Eyebrow>About</Eyebrow>
        <Heading>Lifelong learner. Founder. Builder at heart.</Heading>
        <p className="text-lg text-espresso-soft max-w-2xl leading-relaxed">
          I keep shipping across very different domains: web, blockchain,
          healthcare AI, applied machine learning, because I&apos;d rather learn by
          building the real thing than by staying in one lane. Curiosity stays
          constant while the stack keeps changing.
        </p>
      </Section>

      <Section className="pt-0!">
        <h2 className="font-mono text-xs uppercase tracking-wide mb-8 text-terracotta-dark">
          The path here
        </h2>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 relative">
          {/* connecting line: horizontal on desktop, vertical on mobile */}
          <div
            className="hidden lg:block absolute top-1.5 left-0 right-0 h-px bg-espresso/15"
            aria-hidden="true"
          />
          <div
            className="lg:hidden absolute top-0 bottom-0 left-1.5 w-px bg-espresso/15"
            aria-hidden="true"
          />
          {timeline.map((item) => {
            const href = timelineHref(item);
            return (
              <div
                key={item.place}
                className="relative flex-1 pl-6 lg:pl-0 lg:pr-6"
              >
                <span
                  className="absolute left-0 top-1.5 lg:top-0 w-3 h-3 rounded-full bg-terracotta"
                  aria-hidden="true"
                />
                <p className="font-mono text-xs uppercase tracking-wide text-espresso-soft mb-1 lg:mt-4">
                  {item.place}
                </p>
                <p className="text-espresso-soft leading-relaxed text-sm mb-2">{item.text}</p>
                {href ? (
                  <Link
                    href={href}
                    className="text-sm font-medium text-terracotta-dark hover:underline"
                  >
                    {item.projectSlug ? "View case study →" : "See this role →"}
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="pt-0!">
        <h2 className="font-mono text-xs uppercase tracking-wide mb-4 text-terracotta-dark">
          Education
        </h2>
        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          {education.map((e) => (
            <div key={e.school} className="border border-espresso/10 p-4">
              <p className="font-medium text-espresso text-sm">{e.school}</p>
              <p className="text-espresso-soft text-sm">{e.degree}</p>
              <p className="font-mono text-espresso-soft text-xs mt-1">{e.period}</p>
            </div>
          ))}
        </div>

        <h2 className="font-mono text-xs uppercase tracking-wide mb-4 text-terracotta-dark">
          Credentials &amp; community
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge>Microsoft Student Ambassador</Badge>
          <Badge>Taught 500+ students</Badge>
        </div>
        <Link
          href="/credentials"
          className="text-sm font-medium text-terracotta-dark hover:underline"
        >
          See all certifications, courses, and program completions →
        </Link>
      </Section>
    </>
  );
}
