"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { readMapHash, isValidMapHash } from "@/components/map/mapHash";
import { CommandPalette } from "@/components/search/CommandPalette";

// Only ever rendered once this nav toggle is expanded (by a click, or a
// shared #node=/#path= URL) — dynamically imported so its own dependencies
// (including Framer Motion, via the map's preview panel) aren't part of
// every route's initial bundle, the same way the homepage's own
// always-visible map instance still statically imports it directly.
const SystemsMapSection = dynamic(
  () => import("@/components/map/SystemsMapSection").then((m) => m.SystemsMapSection),
  { ssr: false, loading: () => <p className="py-8 text-sm text-espresso-soft">Loading map…</p> }
);

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/credentials", label: "Credentials" },
  { href: "/contact", label: "Contact" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const pathname = usePathname();

  // On routes other than the homepage, this nav toggle is the only way
  // <SystemsMapSection> (and its own hash-driven auto-open) ever mounts —
  // so a shared #node=/#path= link needs to expand it here first. Skipped
  // on the homepage itself, which already has its own always-mounted
  // <HomeSystemsMapSection> handling the same hash — auto-opening both
  // would try to show two native <dialog> modals from the same URL.
  useEffect(() => {
    if (pathname === "/") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isValidMapHash(readMapHash())) setMapOpen(true);

    function onHashChange() {
      if (pathname === "/") return;
      if (isValidMapHash(readMapHash())) setMapOpen(true);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-espresso/10 bg-parchment/85 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[var(--container-wide)] items-center justify-between px-[var(--gutter)] py-4">
        <Link
          href="/"
          aria-label="MFS, home"
          className="font-display text-xl font-semibold tracking-wide text-espresso hover:text-terracotta-dark transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta-dark rounded-sm"
        >
          MFS
        </Link>

        <div className="flex items-center gap-6">
          <CommandPalette />

          <button
            type="button"
            onClick={() => setMapOpen((v) => !v)}
            aria-expanded={mapOpen}
            aria-controls="nav-systems-map"
            className="hidden sm:flex items-center gap-2 -my-3 py-3 font-mono text-xs text-espresso-soft hover:text-terracotta-dark transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
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
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-sm transition-colors relative py-1",
                    isActive
                      ? "text-espresso font-medium"
                      : "text-espresso-soft hover:text-terracotta-dark"
                  )}
                >
                  {link.label}
                  {isActive ? (
                    <span
                      className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-terracotta-dark"
                      aria-hidden="true"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="md:hidden -m-3 p-3 text-sm font-medium text-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-dark"
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
          <button
            type="button"
            onClick={(e) => {
              setOpen(false);
              window.dispatchEvent(
                new CustomEvent("open-command-palette", { detail: e.currentTarget })
              );
            }}
            className="py-2 text-sm text-left text-espresso-soft hover:text-terracotta-dark"
          >
            Search
          </button>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={cn(
                "py-2 text-sm hover:text-terracotta-dark",
                pathname === link.href ? "text-espresso font-medium" : "text-espresso-soft"
              )}
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
          <div className="mx-auto max-w-[var(--container-wide)] px-[var(--gutter)] py-8">
            <SystemsMapSection />
          </div>
        ) : null}
      </div>
    </header>
  );
}
