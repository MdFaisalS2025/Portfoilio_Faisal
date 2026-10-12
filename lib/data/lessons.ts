export type Lesson = {
  project: string;
  href: string;
  wrong: string;
  changed: string;
};

/** Each entry restates a result already stated in the CV or the matching
 * case study / README — nothing here is a new claim. */
export const lessons: Lesson[] = [
  {
    project: "AccessPath",
    href: "/projects/accesspath",
    wrong:
      "My first scoring rule averaged reports, so enough positive reports could outvote one reliable report of no sidewalk.",
    changed:
      "An adversarial test broke it. I replaced it with a dominance-aware risk model that preserves severe hazards.",
  },
  {
    project: "SENTINEL",
    href: "/projects/sentinel",
    wrong: "I compared three LLMs with a rule-based baseline expecting the models to lead.",
    changed:
      "On synthetic patients the rule-based baseline beat the LLMs, and I report that as part of the result.",
  },
  {
    project: "Tracing recommendations across protocol editions",
    href: "/research",
    wrong:
      "My method kept more recommendations connected than identifier matching, but a simpler text matcher did just as well.",
    changed:
      "Recommendations that moved between sections are the open problem, and the one I most want to solve next.",
  },
  {
    project: "EchoTrace",
    href: "/projects#archive",
    wrong:
      "The deployed anomaly model reached a macro ROC-AUC of 0.5598, short of the 0.7084 of the reproduced baseline.",
    changed: "It is labeled experimental in the README rather than presented as a working detector.",
  },
  {
    project: "F-1 Policy Intelligence",
    href: "/projects/f1-policy-intelligence",
    wrong: "The strong-looking percentages come from only 28 questions.",
    changed: "I label them preliminary and show the set size beside each figure.",
  },
  {
    project: "RAEY",
    href: "/projects/raey",
    wrong: "The prototype was tested on synthetic SOPs only and is not clinically validated.",
    changed:
      "I met several times with a Moffitt Cancer Center doctor to learn what would have to change for real physician use.",
  },
];
