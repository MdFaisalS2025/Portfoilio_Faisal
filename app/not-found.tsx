import { Section, Eyebrow, Heading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section className="max-w-2xl text-center">
      <Eyebrow>404</Eyebrow>
      <Heading>This page wandered off the desk.</Heading>
      <p className="text-lg text-espresso-soft leading-relaxed mb-8">
        Whatever you were looking for isn&apos;t here. It might have moved, or
        the link might just be wrong.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/" variant="primary">
          Back home
        </Button>
        <Button href="/projects" variant="secondary">
          See the projects
        </Button>
      </div>
    </Section>
  );
}
