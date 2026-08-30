import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { HeroReveal } from "@/components/home/HeroReveal";
import { HomeSystemsMapSection } from "@/components/home/HomeSystemsMapSection";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { CurrentlyBuilding } from "@/components/home/CurrentlyBuilding";
import { ResearchLog } from "@/components/home/ResearchLog";
import { CredentialsPreview } from "@/components/home/CredentialsPreview";
import { ArchivePreview } from "@/components/home/ArchivePreview";

export default function HomePage() {
  return (
    <>
      <Section wide className="pt-10! pb-6! bg-systems-grid">
        <HeroReveal />
      </Section>

      <Section wide className="pt-0! pb-16! bg-systems-grid">
        <h2 className="font-mono text-xs uppercase tracking-wide text-espresso-soft mb-2">
          The systems map
        </h2>
        <p className="text-sm text-espresso-soft max-w-2xl mb-6">
          Every project, role, and capability below is one real, connected
          graph — not a decoration. Hover or click a node to see what it
          connects to, choose a path suited to why you&apos;re here, or expand
          it to explore full-screen.
        </p>
        <HomeSystemsMapSection />
      </Section>

      <Section className="pt-0!">
        <FeaturedWork />
      </Section>

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
