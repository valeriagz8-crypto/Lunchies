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

/* ------------------------------------------------------- build log */

/**
 * Generated from `git log --reverse --date=short`. Every hash, subject and
 * date below is taken from the repository history, not written by hand.
 */
export type BuildLogCommit = { hash: string; subject: string; date: string };

export type BuildLogWeek = {
  week: string;
  title: string;
  range: string;
  commits: BuildLogCommit[];
};

export const BUILD_LOG: BuildLogWeek[] = [
  {
    week: "Week 0",
    title: "Project setup",
    range: "2026-08-20",
    commits: [
      {
        hash: "01ff2f6",
        subject: "Initial commit",
        date: "2026-08-20"
      },
      {
        hash: "62dedb7",
        subject: "Setup inicial del proyecto Next.js con TypeScript y Tailwind",
        date: "2026-08-20"
      },
      {
        hash: "02b0c32",
        subject: "Agrega navbar y footer al layout base",
        date: "2026-08-20"
      },
      {
        hash: "cb18d6a",
        subject: "Crea homepage con hero y tagline",
        date: "2026-08-20"
      },
      {
        hash: "46ee449",
        subject: "Agrega páginas de Docs y Roadmap",
        date: "2026-08-20"
      },
      {
        hash: "fe8623a",
        subject: "Inicializa cliente de Supabase y variables de entorno",
        date: "2026-08-20"
      },
      {
        hash: "dc6f072",
        subject: "Documenta el proyecto en el README",
        date: "2026-08-20"
      },
      {
        hash: "d29110d",
        subject: "Agrega URL de producción y actualiza .gitignore para Vercel",
        date: "2026-08-20"
      },
      {
        hash: "33077cf",
        subject: "Documenta el auto-deploy vía Git integration de Vercel",
        date: "2026-08-20"
      },
      {
        hash: "73144bb",
        subject: "Rediseña navbar, homepage y footer según Build Discipline Packet",
        date: "2026-08-20"
      },
      {
        hash: "cc8957b",
        subject: "Actualiza URL de producción a lunchies-valeria.vercel.app",
        date: "2026-08-20"
      }
    ]
  },
  {
    week: "Week 1",
    title: "Generative Core Agent (/core)",
    range: "2026-09-01 to 2026-09-03",
    commits: [
      {
        hash: "29ecf30",
        subject: "Rediseña /core con estilo y corrige emojis",
        date: "2026-09-01"
      },
      {
        hash: "d59b9be",
        subject: "Apunta el link Plans del navbar a /core",
        date: "2026-09-01"
      },
      {
        hash: "76b06c3",
        subject: "Implementa el botón de borrar planes guardados en /core",
        date: "2026-09-01"
      },
      {
        hash: "4257e1b",
        subject: "Evita repetir fruta y guarnición en días consecutivos del menú",
        date: "2026-09-03"
      },
      {
        hash: "c579915",
        subject: "Agrupa proteínas/guarniciones/frutas por tema y corrige emoji de tofu",
        date: "2026-09-03"
      },
      {
        hash: "41b7638",
        subject: "Documenta los prompts de Week 1 del Generative Core Agent en /docs",
        date: "2026-09-03"
      },
      {
        hash: "0fd2ce8",
        subject: "Documenta /core en el README",
        date: "2026-09-03"
      },
      {
        hash: "74a3cbb",
        subject: "Rediseña el hero y detalles visuales de /core según el mockup",
        date: "2026-09-03"
      }
    ]
  },
  {
    week: "Week 2",
    title: "Research + Benchmarking (/research)",
    range: "2026-09-17",
    commits: [
      {
        hash: "85ffd5e",
        subject: "Agrega /research: dashboard de research y benchmarking de competidores",
        date: "2026-09-17"
      },
      {
        hash: "a88ed82",
        subject: "Agrega guía de lectura, sección \"the gap\" y ajustes visuales al hero de /research",
        date: "2026-09-17"
      },
      {
        hash: "02d938d",
        subject: "Convierte los campos del intake de /research a dropdowns con opción \"Other\"",
        date: "2026-09-17"
      },
      {
        hash: "2f28791",
        subject: "Conecta \"Start research\" con un resumen narrativo y resaltado de la tabla",
        date: "2026-09-17"
      },
      {
        hash: "471c87f",
        subject: "Agrega insight calculado localmente al hacer clic en \"Start research\"",
        date: "2026-09-17"
      },
      {
        hash: "cd39707",
        subject: "Agrega widget de KPIs a /research con estadísticas calculadas de COMPETITORS",
        date: "2026-09-17"
      },
      {
        hash: "7c832a2",
        subject: "Actualiza el subtítulo de /docs, ya no está \"próximamente\"",
        date: "2026-09-17"
      },
      {
        hash: "1c5faa5",
        subject: "Documenta Week 2 en /docs y el README, agrega Reset filters a /research",
        date: "2026-09-17"
      },
      {
        hash: "d56d801",
        subject: "Agrega botón \"Reset form\" al intake de /research",
        date: "2026-09-17"
      },
      {
        hash: "56f09b0",
        subject: "Agrega orden por encabezado y mejora el mensaje sin resultados en la tabla",
        date: "2026-09-17"
      },
      {
        hash: "3437ea9",
        subject: "Agrega más color y emojis a /research, sin tocar lógica",
        date: "2026-09-17"
      }
    ]
  },
  {
    week: "Week 3",
    title: "Product & Pricing (/product, /pricing)",
    range: "2026-10-06",
    commits: [
      {
        hash: "5cacf8f",
        subject: "Reestructura el navbar con todas las secciones y agrega páginas \"coming soon\"",
        date: "2026-10-06"
      },
      {
        hash: "69b4c98",
        subject: "Rediseña /docs con tech stack, prompt library por semana y tablas de Supabase",
        date: "2026-10-06"
      },
      {
        hash: "6a24050",
        subject: "Agrega lib de producto y pricing para Week 3",
        date: "2026-10-06"
      },
      {
        hash: "4488dcf",
        subject: "Construye /product con feature map, planes y segmentos",
        date: "2026-10-06"
      },
      {
        hash: "473db12",
        subject: "Agrega la calculadora de /pricing con toggles y tabla de assumptions",
        date: "2026-10-06"
      },
      {
        hash: "6464ddd",
        subject: "Agrega guardado de escenarios y lista de saved scenarios en /pricing",
        date: "2026-10-06"
      },
      {
        hash: "f9064cb",
        subject: "Agrega la sección de Testing evidence a /pricing",
        date: "2026-10-06"
      },
      {
        hash: "a63272c",
        subject: "Update pricing with researched Mexico benchmarks",
        date: "2026-10-06"
      },
      {
        hash: "1ad439d",
        subject: "Match Week 3 pages to approved mockup",
        date: "2026-10-06"
      },
      {
        hash: "b398ff6",
        subject: "Rebuild Week 3 layout to match approved design",
        date: "2026-10-06"
      },
      {
        hash: "8837e10",
        subject: "Rebuild Week 3 layout and content to match approved design",
        date: "2026-10-06"
      },
      {
        hash: "c74f581",
        subject: "Align Week 3 pages with the Week 1 and 2 design",
        date: "2026-10-06"
      },
      {
        hash: "b68d12d",
        subject: "Add helper elements to product and pricing pages",
        date: "2026-10-06"
      },
      {
        hash: "8dbc163",
        subject: "Remove testing panel from pricing, fix scenario info popover, add food quality to plans",
        date: "2026-10-06"
      },
      {
        hash: "e69dcef",
        subject: "Extract scenario name validation",
        date: "2026-10-06"
      },
      {
        hash: "b4cbe7d",
        subject: "Add automated pricing and software tests",
        date: "2026-10-06"
      },
      {
        hash: "dcde866",
        subject: "Fix floating point rounding in revenue calculation",
        date: "2026-10-06"
      },
      {
        hash: "2a0fae4",
        subject: "Fix leading zeros in customer inputs and widen scenario name field",
        date: "2026-10-06"
      },
      {
        hash: "a2d6e24",
        subject: "Remove duplicate tooltip and clean up language",
        date: "2026-10-06"
      },
      {
        hash: "9293105",
        subject: "Fix mobile layout overflow on pricing and product pages",
        date: "2026-10-06"
      },
      {
        hash: "ac90353",
        subject: "Move market benchmark sources into the assumptions table and remove the standalone box",
        date: "2026-10-06"
      },
      {
        hash: "4f8b4f0",
        subject: "Make Monthly/Annual toggle actually change the displayed revenue, scenario cards and saved list",
        date: "2026-10-06"
      },
      {
        hash: "78c5731",
        subject: "Fix sources wording and add missing dates/descriptions on pricing page",
        date: "2026-10-06"
      }
    ]
  },
  {
    week: "Week 4",
    title: "Marketing Engine (/marketing)",
    range: "2026-10-28 to 2026-10-29",
    commits: [
      {
        hash: "aff4ab2",
        subject: "Add marketing content and data layer in lib/marketingData.ts",
        date: "2026-10-28"
      },
      {
        hash: "20f7579",
        subject: "Build the /marketing page with tabbed content cards",
        date: "2026-10-28"
      },
      {
        hash: "da3eebc",
        subject: "Add the live A/B tester to the Marketing A/B Testing tab",
        date: "2026-10-28"
      },
      {
        hash: "9e7e62f",
        subject: "Cap A/B tester Supabase calls with an 8s timeout",
        date: "2026-10-28"
      },
      {
        hash: "842ee6c",
        subject: "Add Copy, Export all and Save asset to /marketing",
        date: "2026-10-28"
      },
      {
        hash: "4892580",
        subject: "Rebuild the homepage as a credible product landing page",
        date: "2026-10-28"
      },
      {
        hash: "b60caee",
        subject: "Add tests/marketing.test.ts with the marketing software tests",
        date: "2026-10-28"
      },
      {
        hash: "71f3e99",
        subject: "Rebuild /marketing to match the approved mockup",
        date: "2026-10-28"
      },
      {
        hash: "8f1568f",
        subject: "Rebuild the homepage to match the approved mockup",
        date: "2026-10-28"
      },
      {
        hash: "9102c1e",
        subject: "Replace the A/B tests with research-backed ones",
        date: "2026-10-28"
      },
      {
        hash: "00b2be4",
        subject: "Upgrade the visual design of the whole /marketing section",
        date: "2026-10-28"
      },
      {
        hash: "c7be2a4",
        subject: "Rebuild the five plain marketing tabs to match the mockup",
        date: "2026-10-28"
      },
      {
        hash: "c59d4fe",
        subject: "Make the A/B research source discreet and drop the on-page notes",
        date: "2026-10-29"
      }
    ]
  },
  {
    week: "Week 5",
    title: "Public Chatbot (/chat)",
    range: "2026-11-01",
    commits: [
      {
        hash: "3d7ce9f",
        subject: "Show A/B results as votes and vote share instead of views",
        date: "2026-11-01"
      },
      {
        hash: "329af37",
        subject: "Apply the winning A/B headline to the homepage",
        date: "2026-11-01"
      },
      {
        hash: "568c4a8",
        subject: "Point the marketing phone mock caption at the live headline",
        date: "2026-11-01"
      },
      {
        hash: "8f1e559",
        subject: "Add the chat data, logic and storage layer",
        date: "2026-11-01"
      },
      {
        hash: "87b3008",
        subject: "Build the guided chat page at /chat",
        date: "2026-11-01"
      },
      {
        hash: "9597696",
        subject: "Compact the /chat hero so the chat starts above the fold",
        date: "2026-11-01"
      },
      {
        hash: "609a380",
        subject: "Add tests/chat.test.ts and fix a delivery-question routing gap",
        date: "2026-11-01"
      },
      {
        hash: "0795c29",
        subject: "Answer common service questions honestly instead of falling back",
        date: "2026-11-01"
      },
      {
        hash: "47086cc",
        subject: "Add Spanish to /chat with an ES | EN toggle",
        date: "2026-11-01"
      },
      {
        hash: "c66f003",
        subject: "Let parents swap an ingredient they do not want, and drop the hero cards",
        date: "2026-11-01"
      },
      {
        hash: "b6a3437",
        subject: "Always open /chat in English",
        date: "2026-11-01"
      },
      {
        hash: "a5580a4",
        subject: "Cover the tester phrasings for ingredient exclusion",
        date: "2026-11-01"
      },
      {
        hash: "df5e1ec",
        subject: "Answer more questions from facts the site already states",
        date: "2026-11-01"
      },
      {
        hash: "af99ea5",
        subject: "Offer things the chat can answer after a dead end",
        date: "2026-11-01"
      },
      {
        hash: "e12eaaf",
        subject: "Test the wider coverage and the fallback suggestions",
        date: "2026-11-01"
      },
      {
        hash: "9382959",
        subject: "Add a pure rewind helper for the intake answers",
        date: "2026-11-01"
      },
      {
        hash: "1b17a62",
        subject: "Let a parent change any of the three intake answers",
        date: "2026-11-01"
      },
      {
        hash: "9db75e7",
        subject: "Test the intake rewind",
        date: "2026-11-01"
      },
      {
        hash: "da44dba",
        subject: "Bring the docs week list and tech stack up to date",
        date: "2026-11-01"
      },
      {
        hash: "508ebac",
        subject: "Add a route list and a data flow section to the docs",
        date: "2026-11-01"
      },
      {
        hash: "a19a030",
        subject: "Document Week 5, the four newer tables and their RLS",
        date: "2026-11-01"
      }
    ]
  },
  {
    week: "Week 6",
    title: "Redesign, /demo, /dashboard, regression test",
    range: "2026-11-11",
    commits: [
      {
        hash: "dee1dde",
        subject: "Add the shared redesign design language",
        date: "2026-11-11"
      },
      {
        hash: "14a6ef3",
        subject: "Redesign /core on the shared design language",
        date: "2026-11-11"
      },
      {
        hash: "d21240c",
        subject: "Redesign /product on the shared design language",
        date: "2026-11-11"
      },
      {
        hash: "3e77d18",
        subject: "Redesign /research on the shared design language",
        date: "2026-11-11"
      },
      {
        hash: "8feb43b",
        subject: "Redesign /pricing on the shared design language",
        date: "2026-11-11"
      },
      {
        hash: "da8db60",
        subject: "Redesign /docs on the shared design language",
        date: "2026-11-11"
      },
      {
        hash: "405bfd3",
        subject: "Make the navbar cream across the site",
        date: "2026-11-11"
      },
      {
        hash: "bf35778",
        subject: "Round 2: rebuild the shared design language and cut the mockup illustrations",
        date: "2026-11-11"
      },
      {
        hash: "eb99fb5",
        subject: "Round 2: rebuild /core to match its mockup",
        date: "2026-11-11"
      },
      {
        hash: "5747a42",
        subject: "Round 2: rebuild /product to match its mockup",
        date: "2026-11-11"
      },
      {
        hash: "20cf101",
        subject: "Round 2: rebuild /research to match its mockup",
        date: "2026-11-11"
      },
      {
        hash: "bdc6845",
        subject: "Round 2: rebuild /pricing to match its mockup",
        date: "2026-11-11"
      },
      {
        hash: "1cd48f3",
        subject: "Round 2: rebuild /docs to match its mockup",
        date: "2026-11-11"
      },
      {
        hash: "7129a73",
        subject: "Drop the weekday lunchbox illustrations from /core",
        date: "2026-11-11"
      },
      {
        hash: "63d2d1e",
        subject: "Round 3: shared pieces for the mockup replication",
        date: "2026-11-11"
      },
      {
        hash: "a3c8b07",
        subject: "Round 3: /core to the mockup",
        date: "2026-11-11"
      },
      {
        hash: "b607468",
        subject: "Round 3: /product to the mockup",
        date: "2026-11-11"
      },
      {
        hash: "186d324",
        subject: "Round 3: /research to the mockup",
        date: "2026-11-11"
      },
      {
        hash: "4a7ae66",
        subject: "Round 3: /pricing to the mockup",
        date: "2026-11-11"
      },
      {
        hash: "cd238c7",
        subject: "Round 3: /docs to the mockup",
        date: "2026-11-11"
      },
      {
        hash: "9d864ec",
        subject: "Add lib/week6Data.ts with the Week 6 content",
        date: "2026-11-11"
      },
      {
        hash: "eb1170c",
        subject: "Build the /demo page on the shared design language",
        date: "2026-11-11"
      },
      {
        hash: "aca91a8",
        subject: "Polish /demo for small screens",
        date: "2026-11-11"
      },
      {
        hash: "9f1b3bb",
        subject: "Add the /dashboard data to lib/week6Data.ts",
        date: "2026-11-11"
      },
      {
        hash: "7fc757d",
        subject: "Build the /dashboard page on the shared design language",
        date: "2026-11-11"
      },
      {
        hash: "88989be",
        subject: "Polish /dashboard for small screens",
        date: "2026-11-11"
      },
      {
        hash: "f4b2fc2",
        subject: "Rebuild /demo to match its mockup and stop repeating /dashboard",
        date: "2026-11-11"
      },
      {
        hash: "f4c7b0e",
        subject: "Rebuild /dashboard to match its mockup and hold only project status",
        date: "2026-11-11"
      },
      {
        hash: "20859fa",
        subject: "Wire the testing anchor between the two pages",
        date: "2026-11-11"
      },
      {
        hash: "c3ad395",
        subject: "Add a full-site Playwright regression suite",
        date: "2026-11-11"
      },
      {
        hash: "7eba3dc",
        subject: "Redirect the four orphan routes and drop their placeholders",
        date: "2026-11-11"
      }
    ]
  }
];

export const BUILD_LOG_TOTAL = 118;
