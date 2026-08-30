import Image from "next/image";
import type { Project } from "@/lib/data/projects";

const KIND_LABEL: Record<NonNullable<Project["evidenceImages"]>[number]["kind"], string> = {
  "live-screenshot": "Live screenshot",
  // Exact required phrasing — never implies the mock-provider output is a
  // production deployment or real hospital information.
  "local-demonstration": "Local product demonstration using mock provider and synthetic SOP data",
};

/** Real visual evidence only — every image here is either a screenshot of
 * a live public deployment or a locally run instance of the actual
 * application, never a mockup or stock interface. The `kind` prefix on
 * each caption makes the distinction explicit rather than letting a
 * screenshot imply more deployment status than is true. */
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
                {KIND_LABEL[img.kind]}
              </span>{" "}
              — {img.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
