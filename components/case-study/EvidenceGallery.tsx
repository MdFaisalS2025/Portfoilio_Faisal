import Image from "next/image";
import type { Project } from "@/lib/data/projects";

const KIND_LABEL: Record<NonNullable<Project["evidenceImages"]>[number]["kind"], string> = {
  "live-screenshot": "Live screenshot",
  // Deliberately generic: this label is shared across every project with a
  // "local-demonstration" image, not just RAEY, so it can't claim anything
  // project-specific (mock provider, SOP data) that wouldn't be true for
  // all of them. Each project's own caption states its specific synthetic
  // or mock details explicitly instead.
  "local-demonstration": "Local demonstration",
};

/** Every image here is either a screenshot of a live public deployment or a
 * locally run instance of the actual application, never a mockup or stock
 * interface. The `kind` prefix on each caption makes the distinction
 * explicit rather than letting a screenshot imply more deployment status
 * than is true. */
export function EvidenceGallery({ images }: { images: NonNullable<Project["evidenceImages"]> }) {
  if (images.length === 0) return null;

  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-wide text-espresso-soft mb-4">
        Evidence
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {images.map((img) => (
          <figure key={img.src} className="border border-espresso/10">
            <div className="relative aspect-[16/10] bg-parchment-dark/30">
              <Image src={img.src} alt={img.alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover object-top" />
            </div>
            <figcaption className="p-3 text-xs text-espresso-soft leading-relaxed">
              <span className="font-mono uppercase tracking-wide text-terracotta-dark">
                {KIND_LABEL[img.kind]}:
              </span>{" "}
              {img.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
