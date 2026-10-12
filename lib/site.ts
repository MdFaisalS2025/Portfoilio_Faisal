/** Public origin of the site. Defaults to the live Vercel deployment; set
 * NEXT_PUBLIC_SITE_URL when a custom domain is connected. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoilio-faisal.vercel.app"
).replace(/\/$/, "");

export const SITE_TITLE = "Mohamed Faisal Sindhi · AI Researcher & Engineer";
export const SITE_DESCRIPTION =
  "AI researcher and engineer in Tampa. Three public preprints on evaluating LLM systems, and trustworthy, source-cited retrieval in healthcare and policy. Founder of RAEY; M.S. AI & Business Analytics at USF.";
