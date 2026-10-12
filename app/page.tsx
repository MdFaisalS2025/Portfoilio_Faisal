import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { HeroReveal } from "@/components/home/HeroReveal";
import { HomeSystemsMapSection } from "@/components/home/HomeSystemsMapSection";
import { CurrentlyBuilding } from "@/components/home/CurrentlyBuilding";
import { ResearchLog } from "@/components/home/ResearchLog";
import { CredentialsPreview } from "@/components/home/CredentialsPreview";
import { ArchivePreview } from "@/components/home/ArchivePreview";
import { WhatIGotWrong } from "@/components/home/WhatIGotWrong";

export default function HomePage() {
  return (
    <>
      <Section wide className="pt-10! pb-6! bg-systems-grid">
        <HeroReveal />
      </Section>

      {/* Full-bleed, not <Section wide> (which caps at --container-wide):
       * the map is the site's thesis, so it gets the whole browser width.
       * Its height is not fixed here: SystemsMap sizes itself to roughly one
       * viewport at md+ but never less than the project and role columns
       * need, so adding nodes grows the map instead of overlapping the
       * content below. The mobile map is a different, naturally-scrolling
       * tab/accordion design. */}
      <section className="w-full px-[var(--gutter)] pb-16 md:pb-10 bg-systems-grid flex flex-col">
        <div className="flex-none pt-2 pb-6">
          <h2 className="font-mono text-xs uppercase tracking-wide text-espresso-soft mb-2">
            The systems map
          </h2>
          <p className="text-sm text-espresso-soft max-w-2xl">
            Every project, role, and capability below is one connected graph,
            not a decoration. Hover or click a node to see what it connects
            to, choose a path suited to why you&apos;re here, or expand it to
            explore full-screen.
          </p>
        </div>
        <div className="flex-1 min-h-0">
          <HomeSystemsMapSection />
        </div>
      </section>

      <Section className="pt-0!">
        <h2 className="font-mono text-xs uppercase tracking-wide text-espresso-soft mb-6">
          Now
        </h2>
        <div className="grid gap-12 md:grid-cols-2">
          <CurrentlyBuilding />
          <ResearchLog />
        </div>
      </Section>

      <Section className="pt-0!">
        <WhatIGotWrong />
      </Section>

      <Section className="pt-0!">
        <CredentialsPreview />
      </Section>

      <Section className="pt-0!">
        <ArchivePreview />
      </Section>

      <Section className="pt-0! flex flex-col items-start gap-4">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-espresso">
          Founder. Builder. Still shipping.
        </h2>
        <p className="text-espresso-soft max-w-xl leading-relaxed">
          From a dairy company in Bahrain to SEO in Chennai to blockchain in
          the UAE to founding RAEY in Tampa, I learn each stack by shipping in
          it, and I write down what broke.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/about" variant="secondary">
            My story
          </Button>
          <Button href="/contact" variant="primary">
            Get in touch
          </Button>
        </div>
      </Section>
    </>
  );
}
