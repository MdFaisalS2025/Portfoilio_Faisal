import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { StatCallout } from "@/components/ui/StatCallout";
import { HeroReveal } from "@/components/home/HeroReveal";
import { SystemsMapSection } from "@/components/map/SystemsMapSection";

export default function HomePage() {
  return (
    <>
      <Section className="pt-10 pb-6">
        <HeroReveal />
      </Section>

      <Section className="pt-0 pb-16">
        <p className="font-mono text-xs uppercase tracking-wide text-espresso-soft mb-4">
          The systems map — projects, roles, and capabilities, connected
        </p>
        <SystemsMapSection />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCallout value="2.7 hrs" label="Earlier deterioration detection than NEWS2" />
          <StatCallout value="0" label="Fabricated citations across 175K legal articles" />
          <StatCallout value="$400K" label="Projected annual savings from federated maintenance model" />
        </div>
      </Section>

      <Section className="pt-0 flex flex-col items-start gap-4">
        <h2 className="font-display text-2xl md:text-3xl font-medium text-espresso">
          Founder. Builder. Still shipping.
        </h2>
        <p className="text-espresso-soft max-w-xl leading-relaxed">
          From SEO work in Chennai to blockchain engineering in the UAE to
          founding RAEY in Tampa, I learn by building the real thing.
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
