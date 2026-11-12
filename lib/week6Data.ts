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

/**
 * /demo shows only the short version of the testing step. The full summary,
 * with its three rows, lives on /dashboard#testing so the two pages do not
 * repeat the same information.
 */
export const DEMO_TESTING_INTRO = "What will be checked before launch.";

export const DEMO_TESTING_STEPS = [
  { title: "5 external users" },
  { title: "Full-site regression test" },
] as const;

export const DEMO_TESTING_CTA = "View testing details";
export const DEMO_TESTING_HREF = "/dashboard#testing";

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

/* =======================================================================
 * Stage 2 — /dashboard
 * ===================================================================== */

/* ----------------------------------------------------------- dashboard */

export const DASHBOARD_HERO = {
  eyebrow: "Dashboard",
  titleLead: "Project overview",
  titleAccent: "& progress.",
  subtitle:
    "Track our product, testing and project milestones in one place.",
  noteItems: ["Product", "Testing", "Impact", "Next steps"],
} as const;

export type ModuleStatus = "Live" | "Planned";

export type ProjectModule = {
  name: string;
  route: string;
  status: ModuleStatus;
};

/**
 * Single source of truth for the project module list. Every route here is a
 * real page in app/, so the count of "Live" below is a fact about the
 * repository rather than a number someone typed.
 */
export const PROJECT_MODULES: ProjectModule[] = [
  { name: "Home", route: "/", status: "Live" },
  { name: "Core", route: "/core", status: "Live" },
  { name: "Research", route: "/research", status: "Live" },
  { name: "Product", route: "/product", status: "Live" },
  { name: "Pricing", route: "/pricing", status: "Live" },
  { name: "Marketing", route: "/marketing", status: "Live" },
  { name: "Chat", route: "/chat", status: "Live" },
  { name: "Docs", route: "/docs", status: "Live" },
  { name: "Demo", route: "/demo", status: "Live" },
  { name: "Dashboard", route: "/dashboard", status: "Live" },
];

export const PROJECT_MODULES_INTRO =
  "Status of each integrated page and feature.";

/**
 * The customer split the /pricing calculator starts from. It is an
 * assumption, not a sale. Every figure derived from it on /dashboard is
 * computed with calculateRevenue() from lib/pricing, never written down.
 */
export const REVENUE_MODEL_CUSTOMERS = {
  basic: 150,
  plus: 100,
  premium: 50,
} as const;

export const REVENUE_MODEL_SCENARIO = "base" as const;

export const REVENUE_MODEL_TITLE = "Revenue model (assumptions, not real sales)";

export const REVENUE_MODEL_NOTE =
  "These figures come from the /pricing calculator running its default customer split on the base scenario. Nothing here has been sold.";

/* ----------------------------------------------- saved records (Supabase) */

export type SavedRecordsTable = {
  /** The Supabase table name. */
  table: string;
  /** How it is shown on the page. */
  label: string;
  /** Which module writes to it. */
  source: string;
};

/**
 * The tables /dashboard is allowed to count. review_requests is deliberately
 * absent: it holds the only personal contact data in the project and is
 * never read here.
 */
export const SAVED_RECORD_TABLES: SavedRecordsTable[] = [
  { table: "core_outputs", label: "Lunch plans", source: "/core" },
  { table: "research_notes", label: "Research notes", source: "/research" },
  { table: "pricing_scenarios", label: "Pricing scenarios", source: "/pricing" },
  { table: "marketing_assets", label: "Marketing assets", source: "/marketing" },
  { table: "ab_events", label: "A/B events", source: "/marketing" },
  { table: "chat_sessions", label: "Chat sessions", source: "/chat" },
];

export const SAVED_RECORDS_TITLE = "Saved records";

export const SAVED_RECORDS_INTRO =
  "Live counts and the most recent entries written by each module.";

/**
 * Shown under the section. The page selects only the columns named in each
 * preview below, so allergies, preferences, contacts and chat messages are
 * never requested from the database in the first place.
 */
export const SAVED_RECORDS_PRIVACY_NOTE = "Personal data is not shown here.";

export const SAVED_RECORDS_COPY = {
  loading: "Loading saved records...",
  empty: "No records saved yet.",
  error: "Could not load the saved records.",
  timeout: "The database took too long to answer. Try again in a moment.",
  countOnly: "Count only — no conversation content is read.",
} as const;

export const SAVED_RECORDS_PREVIEW_COUNT = 3;

/* --------------------------------------------------------- stat tiles */

export const DASHBOARD_TILE_LABELS = {
  externalUsers: "external users tested",
  regression: "site regression test",
  modules: "modules integrated (live)",
  roadmap: "development roadmap",
} as const;

export const DASHBOARD_LINKS = {
  agentMap: "/demo#agent-map",
  versionTwo: "/demo#version-2",
  /** The full testing summary lives on this page, so the tiles stay local. */
  testing: "#testing",
} as const;

export const DASHBOARD_AGENT_MAP_INTRO =
  "The five modules that run in this project today.";

export const DASHBOARD_SEE_FULL = "See the full agent map";
export const DASHBOARD_SEE_ROADMAP = "See the full roadmap";

/* ----------------------------------------------- where the data lives */

/**
 * /dashboard shows counts per module; /demo describes what each module does.
 * The two pages deliberately carry different information about the same five
 * modules.
 */
export const DATA_LIVES_TITLE = "Where the data lives";

export const DATA_LIVES_INTRO =
  "Each module and the rows it has written so far.";

export const DATA_LIVES_NOTE =
  "review_requests is not counted here. It holds the only personal contact data in the project and this page never reads it.";

/** Module name -> the tables counted for it, in the module list order. */
export const DATA_LIVES_ROWS: { module: string; route: string; tables: string[] }[] = [
  { module: "Core planner", route: "/core", tables: ["core_outputs"] },
  { module: "Research", route: "/research", tables: ["research_notes"] },
  { module: "Pricing", route: "/pricing", tables: ["pricing_scenarios"] },
  { module: "Marketing", route: "/marketing", tables: ["marketing_assets", "ab_events"] },
  { module: "Chat assistant", route: "/chat", tables: ["chat_sessions"] },
];

/* --------------------------------------------- version 2 link card */

export const DASHBOARD_V2_TITLE = "Version 2";

export const DASHBOARD_V2_INTRO =
  "The roadmap and the full agent map live on the demo walkthrough.";

export const DASHBOARD_V2_LINKS = [
  { label: "Version 2 roadmap", href: "/demo#version-2" },
  { label: "Agent map", href: "/demo#agent-map" },
] as const;
