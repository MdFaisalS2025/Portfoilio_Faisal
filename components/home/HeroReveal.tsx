"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Deliberately brief: name + one line, nothing else. The Systems Map right
 * below this is the page's actual thesis, not a footnote after a full
 * conventional hero — see SystemsMapSection on the home page.
 */
export function HeroReveal() {
  const reducedMotion = useReducedMotion();
  const initial = reducedMotion ? false : { opacity: 0, y: 10 };

  return (
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
        className="text-lg leading-relaxed text-espresso-soft"
      >
        Founder of{" "}
        <span className="font-medium text-terracotta-dark">RAEY</span>. AI
        engineer building trustworthy, source-cited systems.
      </motion.p>
    </div>
  );
}
