"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { PortraitComposition } from "./PortraitComposition";

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

      <div className="w-full md:max-w-[82%] md:ml-auto">
        <PortraitComposition />
      </div>
    </div>
  );
}
