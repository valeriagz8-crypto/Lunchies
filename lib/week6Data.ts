/**
 * Week 6 content for /demo and, from Stage 2, /dashboard.
 *
 * Plain exported constants only — no logic, no fetching, no components.
 *
 * Honesty rules applied throughout:
 * - A tour step is "Live" only when the feature really runs in this
 *   repository today. Everything else is "Planned".
 * - The agent map lists only modules that exist as routes in this app.
 * - The impact section describes intended benefits. It carries no measured
 *   percentages, no hours saved and no claimed outcomes.
 * - Every testing result is null and renders as "Pending".
 * - Every Version 2 item is an idea that has not been built.
 */

/* --------------------------------------------------------------- hero */

export const DEMO_HERO = {
  eyebrow: "Demo",
  titleLead: "Lunchies in",
  titleAccent: "action.",
  subtitle:
    "A guided walkthrough of the full product, our agent system, impact, testing and what's next.",
  cta: "Start demo",
  ctaHref: "#product-tour",
  /** The taped note beside the hero illustration. Decorative. */
  noteItems: ["Plan", "Personalize", "Shop", "Cook"],
} as const;

export const DEMO_STEPS = [
  { label: "Product tour", href: "#product-tour" },
  { label: "Agent map", href: "#agent-map" },
  { label: "Impact", href: "#impact" },
  { label: "Testing", href: "#testing" },
  { label: "Version 2", href: "#version-2" },
] as const;

/* --------------------------------------------------------- product tour */

/**
 * The walkthrough video has not been recorded. While this is an empty
 * string the page shows a disabled button reading "Video coming soon".
 */
export const DEMO_VIDEO_URL = "";

export const DEMO_VIDEO_LABEL = "Watch full walkthrough (5 min)";
export const DEMO_VIDEO_PENDING_LABEL = "Video coming soon";

export type TourStatus = "Live" | "Planned";

export type TourCard = {
  title: string;
  description: string;
  status: TourStatus;
  /** Only set when the step is Live and has a route a visitor can open. */
  href: string | null;
  /** Why this status was given, shown on the page. */
  evidence: string;
};

export const PRODUCT_TOUR: TourCard[] = [
  {
    title: "Plan",
    description: "Create a 5-day lunch plan, Monday to Friday.",
    status: "Live",
    href: "/core",
    evidence: "Runs today on /core and saves to core_outputs.",
  },
  {
    title: "Personalize",
    description: "Adjust for a child's age, allergies and food preferences.",
    status: "Live",
    href: "/core",
    evidence:
      "The /core planner filters the allergens you mark, and /chat answers from the same rules.",
  },
  {
    title: "Shop",
    description: "Get an automatic shopping list with local options.",
    status: "Planned",
    href: null,
    evidence: "No shopping list exists in the code yet.",
  },
  {
    title: "Cook",
    description: "Access kid-friendly, balanced recipes.",
    status: "Planned",
    href: null,
    evidence: "No recipe feature exists in the code yet.",
  },
  {
    title: "Track",
    description: "Save favorites and manage several child profiles.",
    status: "Planned",
    href: null,
    evidence:
      "Saved plans already live on /core, but favorites and child profiles are not built.",
  },
];

export const PRODUCT_TOUR_INTRO = "Explore the main features of Lunchies.";

/* ------------------------------------------------------------ agent map */

export type AgentModule = {
  name: string;
  route: string;
  receives: string;
  produces: string;
  /** Supabase tables this module writes to. */
  tables: string[];
  /** Where a person is required in the loop. */
  human: string;
};

export const AGENT_MAP_INTRO =
  "The five modules that run in this project today.";

/**
 * Every module below is a real route in this repository. Nutrition, Shopping,
 * Recipe and Profile modules are not listed here: they are Version 2 ideas,
 * not code.
 */
export const AGENT_MODULES: AgentModule[] = [
  {
    name: "Core planner",
    route: "/core",
    receives: "A child's age, allergies and food preferences.",
    produces: "A 5-day lunch plan with a protein, a side and a fruit per day.",
    tables: ["core_outputs"],
    human: "A parent reads the plan, regenerates it and decides whether to save it.",
  },
  {
    name: "Research",
    route: "/research",
    receives: "A research topic, the problem to validate, a target user and a market.",
    produces:
      "A written research focus, an insight drawn from the competitor data, and a filtered competitor view.",
    tables: ["research_notes"],
    human: "The founder reads the competitor table and decides what is worth saving.",
  },
  {
    name: "Pricing",
    route: "/pricing",
    receives: "Customers per plan, a scenario multiplier and a billing period.",
    produces: "Monthly and annual revenue, plus the assumptions behind them.",
    tables: ["pricing_scenarios"],
    human: "The owner sets the prices and chooses which scenario to trust.",
  },
  {
    name: "Marketing",
    route: "/marketing",
    receives: "The brand system, the target persona and the campaign data in the repository.",
    produces:
      "Landing copy, social posts, video scripts, a campaign calendar and A/B variants.",
    tables: ["marketing_assets", "ab_events"],
    human: "The owner copies, exports and picks which variant to keep.",
  },
  {
    name: "Chat assistant",
    route: "/chat",
    receives: "Three intake answers and whatever the parent types.",
    produces:
      "A lunchbox idea, an answer about the service, or an honest handover.",
    tables: ["chat_sessions", "review_requests"],
    human:
      "The medical guardrail refuses and points to a professional, and a flagged conversation is passed to a person.",
  },
];

export const AGENT_MAP_NOTE =
  "These modules run on fixed rules and the data in this repository. There is no external AI API, so the same input always produces the same output.";

/* --------------------------------------------------------------- impact */

export const IMPACT_INTRO = "What Lunchies is trying to do for families.";

/** Intended benefits. No measured numbers, because none have been measured. */
export const IMPACT_CARDS = [
  {
    title: "Healthier habits",
    description: "Balanced, age-appropriate lunches instead of a last-minute choice.",
  },
  {
    title: "Time savings",
    description: "One planning pass instead of deciding again every morning.",
  },
  {
    title: "More personalization",
    description: "Plans that take a child's allergies and preferences into account.",
  },
] as const;

export const IMPACT_DISCLAIMER =
  "These are intended benefits. Nothing here has been measured yet.";

export const RISKS_TITLE = "Risks and limits";

export const RISKS: string[] = [
  "An allergy mistake is the most serious risk. A generated plan is never confirmed as safe for an allergy; a Lunchies team member has to check it.",
  "Children's data deserves care. The chat stores conversations without names, and a contact left for a callback is the only personal data the project holds.",
  "No medical or nutritional advice. Medical questions are refused and sent to a pediatrician or a registered nutritionist.",
  "Plans are suggestions. A parent has to review every plan before using it.",
  "No real orders and no payments. Nothing on this site charges money or delivers food.",
];

/* -------------------------------------------------------------- testing */

export type TestingRow = {
  title: string;
  description: string;
  /** null until the work is actually done. Renders as "Pending". */
  result: string | null;
};

export const TESTING_INTRO = "External user tests and a full-site regression test.";

export const TESTING_ROWS: TestingRow[] = [
  {
    title: "5 external users",
    description: "Parents with different family needs.",
    result: null,
  },
  {
    title: "Full-site regression test",
    description: "All pages and key flows verified.",
    result: null,
  },
  {
    title: "Main findings",
    description: "Usability, value and improvement areas.",
    result: null,
  },
];

export const TESTING_PENDING_LABEL = "Pending";

export const TESTING_NOTE =
  "Nothing in this section has results yet. The fields stay empty until the tests are run.";

/* ------------------------------------------------------------ version 2 */

export type RoadmapItem = {
  label: string;
  /** Shown under the item when there is something to add. */
  note?: string;
};

export type RoadmapPhase = {
  id: string;
  term: string;
  items: RoadmapItem[];
};

export const ROADMAP_INTRO = "Next features to expand value and scale Lunchies.";

export const ROADMAP_STATUS_LABEL = "Idea, not built";

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: "V2.1",
    term: "Short term",
    items: [
      { label: "Inventory at home" },
      { label: "More recipe filters" },
      { label: "Export grocery list" },
      { label: "Downloadable weekly menu as PDF", note: "Requested by a tester" },
    ],
  },
  {
    id: "V2.2",
    term: "Mid term",
    items: [
      { label: "Integration with retailers" },
      { label: "Nutrition insights and recommendations" },
    ],
  },
  {
    id: "V2.3",
    term: "Long term",
    items: [
      { label: "Mobile app" },
      { label: "Family meal goals" },
      { label: "Community recipes" },
    ],
  },
];

export const ROADMAP_NOTE =
  "Every item on this roadmap is an idea. None of it is built.";

/* ------------------------------------------------------------ final CTA */

export const DEMO_CTA = {
  title: "Ready to try Lunchies?",
  subtitle: "Plan a week of lunches for your family.",
  button: "Go to the product",
  href: "/product",
} as const;
