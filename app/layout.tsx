import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { PageTransition } from "@/components/layout/PageTransition";

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mohamed Faisal Sindhi · Founder & AI Engineer",
  description:
    "Lifelong learner, founder, and builder at heart. Founder of RAEY, designer of SENTINEL, and AI engineer working across healthcare AI, legal retrieval, and federated learning.",
  metadataBase: new URL("https://mohamedfaisalsindhi.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mohamed Faisal Sindhi · Founder & AI Engineer",
    description:
      "Lifelong learner, founder, and builder at heart. Founder of RAEY, designer of SENTINEL, and AI engineer working across healthcare AI, legal retrieval, and federated learning.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-parchment text-espresso">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-espresso focus:text-parchment focus:px-4 focus:py-2 focus:rounded-md"
        >
          Skip to content
        </a>
        <NavBar />
        <main id="main-content" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
