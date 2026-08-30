"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";

// Natural pixel dimensions of public/images/portrait.jpg — kept in sync with
// the source file so the container reserves the exact right space (no
// layout shift) and object-contain never needs to letterbox or crop.
const PORTRAIT_WIDTH = 2048;
const PORTRAIT_HEIGHT = 1152;

/**
 * Two-column intro: positioning on the left, the complete uncropped
 * portrait on the right at its real aspect ratio. Sized to stay within one
 * viewport so the Systems Map intro starts near the fold, not several
 * screens down. Stacks vertically below `md` (image under text), unchanged
 * from the prior mobile presentation.
 */
export function HeroReveal() {
  const reducedMotion = useReducedMotion();
  const initial = reducedMotion ? false : { opacity: 0, y: 10 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_1.15fr] gap-8 md:gap-10 items-center">
      <div className="max-w-2xl">
        <motion.p
          initial={initial}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display italic text-base md:text-lg mb-3 text-terracotta-dark"
        >
          Tampa, Florida
        </motion.p>
        <motion.h1
          initial={initial}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.08 }}
          className="font-display text-4xl md:text-5xl font-medium mb-3 leading-tight text-espresso"
        >
          Mohamed Faisal Sindhi
        </motion.h1>
        <motion.p
          initial={initial}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.16 }}
          className="text-lg leading-relaxed text-espresso-soft mb-6"
        >
          Founder of{" "}
          <span className="font-medium text-terracotta-dark">RAEY</span>. AI
          engineer building trustworthy, source-cited systems.
        </motion.p>
        <motion.div
          initial={initial}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.22 }}
          className="flex flex-wrap gap-3"
        >
          <Button href="/projects" variant="primary">
            See the work
          </Button>
          <Button href="/resume.pdf" variant="secondary">
            Résumé
          </Button>
          <Button href="/contact" variant="secondary">
            Contact
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: reducedMotion ? 0 : 0.22 }}
        className="relative w-full border border-espresso/10 bg-parchment-dark/20"
        style={{ aspectRatio: `${PORTRAIT_WIDTH} / ${PORTRAIT_HEIGHT}` }}
      >
        <Image
          src="/images/portrait.jpg"
          alt="Mohamed Faisal Sindhi taking a mirror selfie"
          fill
          // Matches the actual rendered width of this column at each
          // breakpoint (measured: ~310px at 375px viewport, ~677px at
          // 1440px, ~871px at 1920px — the grid column's real share of
          // `--container-wide`'s 1800px cap, not a flat vw guess that
          // ignores the cap and over-requests at wide viewports). Plain vw
          // percentages, not calc()-with-rem: measured that combination
          // failing to parse in Chromium, silently selecting a far larger
          // srcset candidate (w=1080 for a 310px box) instead of erroring.
          sizes="(max-width: 767px) 85vw, (max-width: 1799px) 48vw, 900px"
          className="object-contain"
          priority
        />
      </motion.div>
    </div>
  );
}
