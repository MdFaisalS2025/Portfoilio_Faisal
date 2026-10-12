# Portfolio: research record, new work, and personal voice

Date: 2026-10-12. Source of truth: `Mohamed_Faisal_Sindhi_USF_PhD_CV_v26.pdf` (confirmed correct and fully usable by Faisal), his GitHub (MdFaisalS2025) and `CLAUDE_LINKEDIN_HANDOFF.md`.

## Goal and audience

Make the site credible to a PhD admissions committee and to AI-engineering employers, and more personal. The CV's voice (reports negative results plainly, labels everything preliminary) is the site's voice. Content rules from the LinkedIn handoff still apply: never invent facts, metrics or deployments; RAEY is pre-launch and F-1 Policy Intelligence is unofficial.

## Gaps found (CV vs site)

Missing entirely: preprints P1–P3 (DOIs), submitted manuscripts S1–S2, ORCID, GPA 3.86, protocol-tracing study, PlateProof, Solely Active, DOpO2 research, CAI 3801 / QMB 3302 teaching detail, Moffitt meetings, signalforge, EchoTrace, DataCamp AI Engineer Associate (Sep 2026), in-progress Stanford and Tokyo coursework. Site's `/research` page currently says its notes "aren't peer-reviewed publications" and holds only one note.

## Changes

1. **Research page becomes a publication record** (`lib/data/research.ts`, `app/research/page.tsx`).
   - New `publications` data: P1–P3 (title, authors, venue, year, DOI link), S1–S2 as "Submitted, public record pending" with titles and no links, ORCID link.
   - Protocol-tracing study as a research note: question, prespecified design, result (method beat identifier matching, a simple text matcher did equally well, moved recommendations unsolved), reproducibility link.
   - Intro copy rewritten to separate preprints, submitted work and working notes.
   - Reproducibility DOIs/links come only from the CV's embedded URLs.
2. **PlateProof case study** added to `lib/data/projects.ts` (repo `github.com/MdFaisalS2025/PlateProof`; stack Python, FastAPI, DuckDB, scikit-learn). Solely Active appears inside it as an outcome ("taken up by a venture; Faisal leads technology and product direction, team of three, prelaunch"). Also a Solely Active role in `experience.ts` (Sep 2026 – Present, Technical Product Lead, prelaunch). signalforge and EchoTrace go in `archive.ts` only after reading their READMEs; no outcome claims beyond what they state.
3. **"What I got wrong" section** (new component, shown on the homepage and linked from About). Entries come only from existing CV/case-study text: AccessPath first scoring rule broken by adversarial test; SENTINEL rule-based baseline beat the LLMs; protocol tracing simple matcher tied; F-1 results preliminary on 28 questions; RAEY tested on synthetic SOPs only.
4. **Personal pass**: About page and homepage closing block use the Bahrain → Chennai → UAE → Tampa thread; Experience page updated to CV wording (TA courses, Moffitt conversations, DOpO2 research, GPA, Anna University Nov 2020, USF IT role as "Microsoft Student Ambassador Intern").
5. **Links and facts**: ORCID, GitHub and CV links in footer/contact; `public/resume.pdf` replaced with the v26 CV; credentials gain DataCamp AI Engineer Associate and the two in-progress items (marked in progress).
6. **Systems Map**: new nodes for PlateProof, Solely Active and the Research publications, wired through `graph.ts` capabilities (Trustworthy Retrieval, Calibration, Evaluation); search index regenerated from data.

## Out of scope

Redesigning the visual system, new animations, copying LinkedIn text verbatim, any claim not in the CV, GitHub README, or existing site data.

## Verification

`npm run lint` and `npm run build` pass; every new route/node renders; manual browser check of /research, a PlateProof page, the homepage map and mobile width; every external link taken from the CV or repo.
