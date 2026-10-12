# Portfolio Research Record and Voice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the CV's research record, PlateProof/Solely Active, a "What I got wrong" section and a personal-voice pass to the existing Next.js portfolio.

**Architecture:** All content is data in `lib/data/*.ts`; pages and the Systems Map derive from it. New data (`publications`, `lessons`, PlateProof, Solely Active) feeds existing pages plus two small new components. No new dependencies.

**Tech Stack:** Next.js 16 (App Router, read `node_modules/next/dist/docs/` before touching routing/metadata APIs, per AGENTS.md), React 19, TypeScript, Tailwind 4. No test runner exists; verification is `npx tsc --noEmit`, `npm run lint`, `npm run build`, and browser checks.

**Spec:** `docs/superpowers/specs/2026-10-12-portfolio-research-and-voice-design.md`

## Global Constraints

- Source of truth is `C:\Users\Faisal\Desktop\resume\Mohamed_Faisal_Sindhi_USF_PhD_CV_v26.pdf`; never invent facts, metrics, deployments or links.
- RAEY stays pre-launch; F-1 Policy Intelligence stays "independent, unofficial"; results on small sets stay labelled preliminary with set size beside each percentage.
- Submitted manuscripts S1/S2: title, authors and "Submitted, 2026" only, no link.
- Credential IDs are never displayed.
- Existing style: Tailwind tokens `text-espresso`, `text-espresso-soft`, `text-terracotta-dark`, `font-mono text-xs uppercase tracking-wide` eyebrows, `Section`/`Eyebrow`/`Heading` from `@/components/ui/Section`.
- Commits end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- A submitted manuscript must never render a link or DOI (Task 1 `Publication.href` is optional and the page renders nothing for a missing one).
- A role with no `projectSlug` must still appear in the graph (Task 2 reuses existing handling; verify Solely Active node appears).
- New capability names without a category must not crash the mobile map (categories is optional; verify `/` at 375px).
- Homepage/About must hide "What I got wrong" gracefully if `lessons` were empty (Task 4 returns null).
- Search index must contain no duplicate entries for new items (Task 1/2 check by searching "PlateProof").

---

### Task 1: Publications and protocol-tracing note on /research

**Files:**
- Modify: `lib/data/research.ts` (append types/data)
- Modify: `app/research/page.tsx` (intro copy + publications block above the notes)
- Modify: `components/ui/NavBar.tsx:22-26` (add Research link)
- Modify: `app/sitemap.ts` (already lists /research; no change)
- Modify: `lib/data/searchIndex.ts` (index publications)

**Interfaces:**
- Produces: `export type Publication`, `export const publications: Publication[]`, `export const orcid = { id, url }` from `lib/data/research.ts`.

- [ ] **Step 1: Read the Next docs note** for metadata in `node_modules/next/dist/docs/` only if changing metadata shape (not required; existing `metadata` export stays).

- [ ] **Step 2: Append to `lib/data/research.ts`**

```ts
export type Publication = {
  id: "P1" | "P2" | "P3" | "S1" | "S2";
  title: string;
  authors: string;
  venue: string;
  year: string;
  status: "preprint" | "submitted";
  /** DOI URL; omitted for submitted manuscripts (no public record yet). */
  href?: string;
  /** Earlier version, when the CV lists one. */
  altHref?: { label: string; href: string };
};

export const orcid = {
  id: "0009-0000-1348-0566",
  url: "https://orcid.org/0009-0000-1348-0566",
};

export const publications: Publication[] = [
  {
    id: "P3",
    title:
      "When Verification Passes the Wrong Calculator: A Human-Adjudicated Study of a Guarded Local LLM Pipeline",
    authors: "M.F. Sindhi, N. Uddin",
    venue: "Research Square",
    year: "2026",
    status: "preprint",
    href: "https://doi.org/10.21203/rs.3.rs-11311266/v1",
  },
  {
    id: "P2",
    title:
      "Do Artificial Masks Represent Natural Missingness? External-Reference Evaluation in County-Level Power-Outage Records",
    authors: "M.F. Sindhi",
    venue: "Zenodo",
    year: "2026",
    status: "preprint",
    href: "https://doi.org/10.5281/zenodo.23092741",
  },
  {
    id: "P1",
    title:
      "Validation of a Frozen LLM-Based Screening Instrument for Clinical Guideline Literature Screening",
    authors: "M.F. Sindhi",
    venue: "Zenodo",
    year: "2026",
    status: "preprint",
    href: "https://doi.org/10.5281/zenodo.22896495",
    altHref: { label: "Earlier version on SSRN", href: "https://doi.org/10.2139/ssrn.7490218" },
  },
  {
    id: "S2",
    title: "Approximate Sampling for Randomization Tests: A Total-Variation Certification Framework",
    authors: "M.F. Sindhi, H. Buksh",
    venue: "Submitted",
    year: "2026",
    status: "submitted",
  },
  {
    id: "S1",
    title:
      "Bandwidth, Representation Loss, and Temporal Drift in Quantum Kernel Fraud Detection: A Pre-Specified Falsification Study",
    authors: "M.F. Sindhi, H. Buksh",
    venue: "Submitted",
    year: "2026",
    status: "submitted",
  },
];
```

Then add a second `ResearchNote` to the `researchNotes` array (before `];` that closes it), keeping the existing one first:

```ts
  {
    slug: "tracing-recommendations-across-protocol-editions",
    title: "Can each recommendation in a clinical protocol be traced to the next edition?",
    researchQuestion:
      "Can each recommendation in a state EMS clinical protocol be traced to its counterpart in the next edition?",
    motivation:
      "Protocol editions are revised, reordered and renumbered. Matching by identifier alone loses recommendations that move.",
    hypothesis:
      "Hypotheses and analyses were prespecified and the method was frozen before any test documents were retrieved.",
    method:
      "A frozen matching method compared against matching by identifier alone and against a simpler text matcher, evaluated on the held-out protocol editions. Analysis plan, full results and a reproducibility package are public.",
    finding:
      "The method kept more recommendations connected across editions than identifier matching alone, but a simpler text matcher did just as well.",
    limitation:
      "Recommendations that moved between sections remained unsolved. This is the problem I most want to solve next.",
    nextExperiment:
      "Target the moved-recommendation cases directly rather than improving overall match rate.",
    sourceUrl:
      "https://github.com/MdFaisalS2025/RAEY-SOP-Research/tree/master/reproducibility_artifact",
    sourceLabel: "Reproducibility package",
    relatedProjectSlug: "raey",
    relatedCapabilities: ["Evaluation", "Verification"],
  },
```

- [ ] **Step 3: Rewrite the `/research` intro and add publications.** In `app/research/page.tsx`, import `publications, orcid`, change the `Heading`/intro paragraph to:

```tsx
      <Eyebrow>Research</Eyebrow>
      <Heading>Research</Heading>
      <p className="text-lg text-espresso-soft leading-relaxed max-w-2xl mb-4">
        Three public preprints, two manuscripts under submission, and the
        working notes behind them. Preprints are not peer reviewed. I report
        what didn&apos;t work next to what did.
      </p>
      <a href={orcid.url} target="_blank" rel="noopener noreferrer"
        className="text-sm font-medium text-terracotta-dark hover:underline mr-4">
        ORCID {orcid.id} ↗
      </a>
```

Keep the existing repo link, and insert before the `researchNotes.map` block:

```tsx
      <h2 className="font-mono text-xs uppercase tracking-wide text-terracotta-dark mt-12 mb-4">
        Preprints and manuscripts
      </h2>
      <ol className="flex flex-col gap-5 list-none p-0">
        {publications.map((p) => (
          <li key={p.id} className="border-t border-espresso/10 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-wide text-espresso-soft mb-1">
              {p.id} · {p.status === "submitted" ? "Submitted, public record pending" : "Preprint"}
            </p>
            <p className="font-medium text-espresso">{p.title}</p>
            <p className="text-sm text-espresso-soft">
              {p.authors} · {p.venue}, {p.year}
            </p>
            <div className="flex gap-4 mt-1">
              {p.href ? (
                <a href={p.href} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-terracotta-dark hover:underline">
                  Read preprint ↗
                </a>
              ) : null}
              {p.altHref ? (
                <a href={p.altHref.href} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-espresso-soft hover:text-terracotta-dark">
                  {p.altHref.label} ↗
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      <h2 className="font-mono text-xs uppercase tracking-wide text-terracotta-dark mt-16 mb-2">
        Working notes
      </h2>
```

Also update `metadata.description` to "Preprints, submitted manuscripts and working research notes."

- [ ] **Step 4: Nav + search.** In `NavBar.tsx` add `{ href: "/research", label: "Research" },` after Experience. In `searchIndex.ts` import `publications` and add after the research-notes loop:

```ts
  for (const p of publications) {
    items.push({ type: "Research note", title: p.title, subtitle: `${p.id} · ${p.venue}`, href: "/research" });
  }
```

(import: `import { researchNotes, publications } from "./research";`)

- [ ] **Step 5: Verify.** Run `npx tsc --noEmit && npm run lint`. Expected: no errors. Start the dev server via `preview_start`, open `/research`: five publications render, S1/S2 have no link, nav shows Research at desktop and mobile widths.

- [ ] **Step 6: Commit** `git add lib app components && git commit -m "feat: research page as publication record with ORCID"`.

---

### Task 2: PlateProof case study and Solely Active role

**Files:**
- Modify: `lib/data/projects.ts` (append project before `];`)
- Modify: `lib/data/experience.ts` (insert role after RAEY entry)
- Modify: `lib/data/graph.ts` (`CATEGORY_BY_CAPABILITY`)

**Interfaces:**
- Consumes: `Project`, `Role` types as they exist.
- Produces: project slug `"plateproof"`; role referencing it via `projectSlug`.

- [ ] **Step 1: Append project** (facts from the CV and the public README; no numeric accuracy claims exist in either, so none are shown):

```ts
  {
    slug: "plateproof",
    name: "PlateProof",
    tagline: "Restaurant inspection history and a calibrated risk estimate that respects each jurisdiction's grading",
    stack: ["Python", "FastAPI", "DuckDB", "scikit-learn", "Streamlit"],
    timeframe: "2026",
    problem:
      "Inspection results are published by each jurisdiction under its own grading system. Collapsing them into one universal score would misrepresent what the records actually say.",
    approach:
      "I built a lookup tool for New York City and Florida restaurants that shows each restaurant's official inspection history and a calibrated risk estimate for its next inspection. Each jurisdiction keeps its own grading system and its own model, and a model ships only if it beats baselines. A citation-grounded assistant answers from a fixed set of intents, with an optional local model used only to classify the question.",
    architectureNote:
      "Offline stages download the public records, build tables, train and calibrate one model per jurisdiction, and score predictions. The running service reads only precomputed Parquet tables through DuckDB, behind a read-only FastAPI service and a Streamlit interface; it never loads model files. Owner-document extraction runs in short-lived isolated worker processes and does not store uploads.",
    results:
      "A working local release covering two jurisdictions. It is not publicly deployed, forecasts are statistical estimates rather than guarantees, and Michelin recognition, where used, is context only and not evidence of food safety. The project was later taken up by Solely Active, where I now lead technology and product direction for its Active Twin concept.",
    stats: [
      { label: "Jurisdictions", value: "2" },
      { label: "Assistant intents", value: "9" },
    ],
    repoUrl: "https://github.com/MdFaisalS2025/PlateProof",
    capabilities: ["Calibration", "Evaluation", "Citation Grounding"],
    domains: ["Data Products", "Trustworthy Retrieval"],
  },
```

- [ ] **Step 2: Insert role** in `experience.ts` directly after the RAEY object:

```ts
  {
    org: "Solely Active",
    title: "Technical Product Lead",
    specialization: "Prelaunch venture",
    location: "Remote",
    period: "Sep 2026 – Present",
    bullets: [
      "PlateProof, my independent project, was taken up by Solely Active, a sports and wellness venture.",
      "Lead technology and product direction for its Active Twin concept and coordinate an international team of three exploring food recognition, recommendations, and careful handling of personal data.",
    ],
    projectSlug: "plateproof",
    capabilities: ["Technical Leadership", "Product Discovery", "Team Coordination"],
  },
```

- [ ] **Step 3: Categories** in `graph.ts` add entries: `Calibration: ["Data & Modeling"], "Citation Grounding": ["AI & Retrieval"], DuckDB: ["Data & Modeling"], "scikit-learn": ["Data & Modeling"], Streamlit: ["Systems & Engineering"], "Team Coordination": ["Leadership & Operations"],`.

- [ ] **Step 4: Verify.** `npx tsc --noEmit && npm run lint`; browser: `/projects/plateproof` renders (check `app/projects/[slug]/page.tsx` handles a project with no `demoUrl`/`evidenceImages`; if it does not, make those optional renders conditional); `/experience` shows Solely Active; map on `/` shows PlateProof and Solely Active nodes with an edge between them; resize to 375px and confirm mobile map still renders.

- [ ] **Step 5: Commit** `feat: add PlateProof case study and Solely Active role`.

---

### Task 3: Archive entries for signalforge and EchoTrace

**Files:** Modify `lib/data/archive.ts`.

- [ ] **Step 1:** WebFetch `https://github.com/MdFaisalS2025/signalforge` and `.../EchoTrace`; read each README fully.
- [ ] **Step 2:** Append one `ArchiveEntry` per repo whose README states what it does and what was verified. Shape: `{ name, year: "2026", domain, role: "Solo builder", outcome: <one sentence from README, no unstated metrics>, evidenceSource: "Public GitHub repository, README", href: <repo url>, capabilities: [...] }`. If a README gives no checkable outcome, skip that repo and say so in the commit message.
- [ ] **Step 3:** `npx tsc --noEmit`; check `/projects#archive` renders the new cards.
- [ ] **Step 4: Commit** `feat: archive signalforge and EchoTrace`.

---

### Task 4: "What I got wrong" section

**Files:**
- Create: `lib/data/lessons.ts`
- Create: `components/home/WhatIGotWrong.tsx`
- Modify: `app/page.tsx` (insert after the "Now" section)
- Modify: `app/about/page.tsx` (link)

**Interfaces:**
- Produces: `type Lesson`, `lessons: Lesson[]`, component `WhatIGotWrong` (no props).

- [ ] **Step 1: Create `lib/data/lessons.ts`** (every line restates CV/case-study text):

```ts
export type Lesson = {
  project: string;
  href: string;
  wrong: string;
  changed: string;
};

export const lessons: Lesson[] = [
  {
    project: "AccessPath",
    href: "/projects/accesspath",
    wrong: "My first scoring rule averaged reports, so enough positive reports could outvote one reliable report of no sidewalk.",
    changed: "An adversarial test broke it. I replaced it with a dominance-aware risk model that preserves severe hazards.",
  },
  {
    project: "SENTINEL",
    href: "/projects/sentinel",
    wrong: "I expected the LLM agents to beat a rule-based baseline.",
    changed: "On synthetic patients the rule-based baseline beat the LLMs. I report that result as the headline.",
  },
  {
    project: "Tracing recommendations across protocol editions",
    href: "/research",
    wrong: "My method kept more recommendations connected than identifier matching, but a simpler text matcher did just as well.",
    changed: "Recommendations that moved between sections are the open problem. I am targeting those next.",
  },
  {
    project: "F-1 Policy Intelligence",
    href: "/projects/f1-policy-intelligence",
    wrong: "My strong-looking percentages come from only 28 questions.",
    changed: "I label them preliminary everywhere, with the set size beside each figure.",
  },
  {
    project: "RAEY",
    href: "/projects/raey",
    wrong: "The prototype has only been tested on synthetic SOPs and is not clinically validated.",
    changed: "I met with a Moffitt Cancer Center doctor several times to learn what would have to change for real physician use.",
  },
];
```

- [ ] **Step 2: Create component**

```tsx
import Link from "next/link";
import { lessons } from "@/lib/data/lessons";

export function WhatIGotWrong() {
  if (lessons.length === 0) return null;
  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-wide text-espresso-soft mb-2">
        What I got wrong
      </h2>
      <p className="text-sm text-espresso-soft max-w-2xl mb-6">
        A negative result is still a result. These are the places where my
        first answer failed, and what I did about it.
      </p>
      <ul className="grid gap-6 md:grid-cols-2 list-none p-0">
        {lessons.map((l) => (
          <li key={l.project} className="border border-espresso/10 p-4">
            <Link href={l.href} className="font-medium text-espresso hover:text-terracotta-dark">
              {l.project} →
            </Link>
            <p className="text-sm text-espresso-soft mt-2">{l.wrong}</p>
            <p className="text-sm text-espresso mt-2">{l.changed}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3:** In `app/page.tsx` import it and add after the "Now" `<Section>`: `<Section className="pt-0!"><WhatIGotWrong /></Section>`. In `app/about/page.tsx` add the same component in a final `<Section className="pt-0!">`.
- [ ] **Step 4: Verify** `npx tsc --noEmit && npm run lint`; browser: `/` and `/about` at desktop and 375px, all five cards and links work.
- [ ] **Step 5: Commit** `feat: add What I got wrong section`.

---

### Task 5: Personal voice, CV facts, links, credentials

**Files:**
- Modify: `lib/data/experience.ts` (TA bullets, RA role, education)
- Modify: `lib/data/credentials.ts`
- Modify: `components/ui/Footer.tsx`
- Modify: `app/about/page.tsx` (hero paragraph, timeline)
- Modify: `app/page.tsx` closing block
- Replace: `public/resume.pdf`

- [ ] **Step 1: Experience data.** In the Graduate Teaching Assistant role replace the second bullet with: `"Support instruction for AI & Analytics (CAI 3801; one section Summer 2026, three in Fall 2026) and Data Analytics for Business (QMB 3302; Summer 2026): instruction, grading, and helping students with Power BI and Tableau across sections with combined enrollment above 500."`. In the RAEY role add bullet: `"Met several times with a doctor at Moffitt Cancer Center to explain the problem and use case and to discuss what RAEY would need to change for real physician use. Tested on synthetic SOPs only; not clinically validated."`. Change RA role period to `"Jan 2025 – Jan 2026; Aug 2026 – Present"` and append bullet `"Since Aug 2026: exploring DOpO2 and dissolved oxygen measurement using spectrometers (early stage). Advisors: Dr. Ehsan Sheybani and Dr. Arash Takshi."`. Update `education`: USF `period: "Expected Dec 2026 · GPA 3.86/4.00"`; Anna University `period: "Aug 2015 – Nov 2020"`.
- [ ] **Step 2: Credentials.** Add `{ name: "AI Engineer for Data Scientists Associate", issuer: "DataCamp", type: "certification", issued: "Sep 2026", group: "AI & Data", featured: true }`, and two course entries with `issued: "In progress"`: "Probability for AI" (Stanford University, group "Academic Foundations") and "GCI World 2026" (Matsuo-Iwasawa Lab, University of Tokyo, group "AI & Data"). Check `app/credentials/page.tsx` renders a string `issued` of "In progress" without date parsing; fix if it parses.
- [ ] **Step 3: Footer.** Add ORCID link after GitHub: `<a href="https://orcid.org/0009-0000-1348-0566" target="_blank" rel="noopener noreferrer" className="hover:text-terracotta-dark transition-colors">ORCID</a>` and a CV link `<a href="/resume.pdf" ...>CV</a>`.
- [ ] **Step 4: Voice.** About hero paragraph (replace): `"I grew up in Bahrain, started in web work in Chennai, spent two years as a blockchain engineer in the UAE, and now study and build trustworthy AI in Tampa. I treat a wrong answer in a hospital or a visa question as an engineering problem, so I publish the evaluations that didn't go my way as readily as the ones that did."` Timeline Tampa entry: add `"Research now includes three public preprints."` and a `Link` to `/research`. Homepage closing paragraph: `"From a dairy company in Bahrain to SEO in Chennai to blockchain in the UAE to founding RAEY in Tampa, I learn each stack by shipping in it, and I write down what broke."`
- [ ] **Step 5: CV.** `cp "C:/Users/Faisal/Desktop/resume/Mohamed_Faisal_Sindhi_USF_PhD_CV_v26.pdf" public/resume.pdf` (confirm the existing file is the older CV before overwriting by comparing `pdftotext` heads).
- [ ] **Step 6: Verify** `npx tsc --noEmit && npm run lint`; check `/about`, `/experience`, `/credentials`, footer links in browser.
- [ ] **Step 7: Commit** `feat: personal voice, CV facts, ORCID and credentials`.

---

### Task 6: Full verification

- [ ] **Step 1:** `npm run build`. Expected: build succeeds, `/projects/plateproof` generated.
- [ ] **Step 2:** In the browser pane, visit `/`, `/research`, `/projects/plateproof`, `/experience`, `/about`, `/credentials`, `/projects`, then repeat `/` and `/research` at 375px width (`resize_window` mobile). Check `read_console_messages` is empty of errors and open the command palette to search "PlateProof", "Solely", and "Verification Passes".
- [ ] **Step 3:** Click every new external link (preprint DOIs, GitHub, ORCID) via `read_network_requests` or fetch to confirm none 404.
- [ ] **Step 4:** Take screenshots of `/` and `/research`; report anything failing honestly.
- [ ] **Step 5:** Reset viewport to desktop; final commit if fixes were needed.
