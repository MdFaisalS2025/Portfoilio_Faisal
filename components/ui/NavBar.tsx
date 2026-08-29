"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SystemsMapSection } from "@/components/map/SystemsMapSection";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-espresso/10 bg-parchment/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold text-espresso"
        >
          Faisal Sindhi
        </Link>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setMapOpen((v) => !v)}
            aria-expanded={mapOpen}
            aria-controls="nav-systems-map"
            className="hidden sm:flex items-center gap-2 font-mono text-xs text-espresso-soft hover:text-terracotta-dark transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
          >
            <span
              className={cn(
                "inline-block w-2 h-2 rounded-full bg-terracotta transition-transform",
                mapOpen && "scale-125"
              )}
              aria-hidden="true"
            />
            {mapOpen ? "Close map" : "Systems map"}
          </button>

          <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-espresso-soft hover:text-terracotta-dark transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden text-sm font-medium text-espresso"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary mobile"
        className={cn(
          "md:hidden overflow-hidden border-t border-espresso/10 transition-[max-height]",
          open ? "max-h-64" : "max-h-0"
        )}
      >
        <div className="flex flex-col gap-1 px-6 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-sm text-espresso-soft hover:text-terracotta-dark"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <div
        id="nav-systems-map"
        className={cn(
          "overflow-hidden border-t border-espresso/10 bg-parchment transition-[max-height] duration-300",
          mapOpen ? "max-h-[900px]" : "max-h-0"
        )}
      >
        {mapOpen ? (
          <div className="mx-auto max-w-5xl px-6 py-8">
            <SystemsMapSection />
          </div>
        ) : null}
      </div>
    </header>
  );
}
