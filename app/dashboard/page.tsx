import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CalendarDays,
  DollarSign,
  FileText,
  Home,
  Megaphone,
  MessageCircle,
  Package,
  Play,
  Search,
  BarChart3,
  CircleDashed,
  ClipboardList,
  Flag,
  Laptop,
  LineChart,
  Rocket,
  Sparkles,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import {
  Card,
  CardHead,
  HeroLabel,
  IconBadge,
  NoteTick,
  PageHero,
  PageShell,
  Sparkle,
  StickyNote,
} from "@/components/ui/pieces";
import { TINT, type TintName } from "@/components/ui/theme";
import { calculateRevenue, formatMXN } from "@/lib/pricing";
import { PLANS } from "@/lib/productData";
import { SCENARIO_LABELS } from "@/lib/pricingAssumptions";
import {
  DASHBOARD_HERO,
  DASHBOARD_LINKS,
  DASHBOARD_TILE_LABELS,
  DASHBOARD_V2_INTRO,
  DASHBOARD_V2_LINKS,
  DASHBOARD_V2_TITLE,
  DATA_LIVES_SOURCE,
  FINDINGS_INTRO,
  FINDINGS_TITLE,
  PROJECT_MODULES,
  PROJECT_MODULES_INTRO,
  PROJECT_PAGES_TITLE,
  REVENUE_MODEL_CUSTOMERS,
  REVENUE_MODEL_NOTE,
  REVENUE_MODEL_SAVED_NOTE,
  REVENUE_MODEL_SCENARIO,
  REGRESSION_SHORT,
  REVENUE_MODEL_BADGE,
  REVENUE_MODEL_TITLE,
  ROADMAP_PHASES,
  TESTING_INTRO,
  TESTING_NOTE,
  USER_TEST_RESULTS,
  USER_TEST_TILE_VALUE,
  TESTING_PENDING_LABEL,
  TESTING_ROWS,
} from "@/lib/week6Data";
import SavedRecords from "./SavedRecords";

const TESTING_ICONS = [Users, Laptop, ClipboardList];

/** One tint per project module tile, cycled in the mockup's order. */
const PROJECT_MODULE_TINTS: TintName[] = [
  "green",
  "peach",
  "blue",
  "green",
  "cream",
  "cream",
  "pink",
  "blue",
  "green",
  "pink",
];

/** One icon per project module, in the order lib/week6Data lists them. */
const PROJECT_MODULE_ICONS = [
  Home,
  CalendarDays,
  Search,
  Package,
  DollarSign,
  Megaphone,
  MessageCircle,
  FileText,
  Play,
  BarChart3,
];

export default function DashboardPage() {
  /* ----- everything below is computed, never written down ----- */

  // Live module count comes from the module list itself.
  const liveModules = PROJECT_MODULES.filter((m) => m.status === "Live").length;

  // Roadmap idea count comes from the roadmap itself.
  const roadmapIdeas = ROADMAP_PHASES.reduce(
    (total, phase) => total + phase.items.length,
    0,
  );

  // The two testing tiles read the same null fields /demo renders.
  const externalUsersResult = TESTING_ROWS[0]?.result ?? null;
  const regressionResult = TESTING_ROWS[1]?.result ?? null;

  // Revenue model: the same function /pricing calls, on the same default
  // customer split and the base scenario.
  const revenue = calculateRevenue(
    { ...REVENUE_MODEL_CUSTOMERS },
    REVENUE_MODEL_SCENARIO,
  );
  const totalCustomers =
    REVENUE_MODEL_CUSTOMERS.basic +
    REVENUE_MODEL_CUSTOMERS.plus +
    REVENUE_MODEL_CUSTOMERS.premium;

  const planRevenues = PLANS.map((plan) => ({
    plan,
    monthly: calculateRevenue(
      {
        basic: 0,
        plus: 0,
        premium: 0,
        [plan.id]: REVENUE_MODEL_CUSTOMERS[plan.id],
      },
      REVENUE_MODEL_SCENARIO,
    ).monthly,
  }));
  // Plans can tie for the top: Basic and Plus both bring in the same
  // monthly revenue on the default split. Saying one of them is "the top
  // plan" would be false, so a tie is shown as a tie.
  const topMonthly = Math.max(...planRevenues.map((p) => p.monthly));
  const topPlans = planRevenues.filter(
    (p) => Math.abs(p.monthly - topMonthly) < 0.01,
  );
  const topPlanShare =
    revenue.monthly > 0 ? Math.round((topMonthly / revenue.monthly) * 100) : 0;
  const topPlanValue =
    topPlans.length > 1
      ? topPlans.map((p) => p.plan.name).join(" = ")
      : `${topPlans[0].plan.name} (${topPlanShare}%)`;
  const topPlanLabel =
    topPlans.length > 1
      ? `tied for top plan by revenue, ${topPlanShare}% each`
      : "top plan by revenue";

  const statTiles: {
    tint: TintName;
    icon: typeof Users;
    value: string;
    label: string;
    href?: string;
    pending?: boolean;
    /** A check beside the number, where the run itself passed. */
    check?: boolean;
  }[] = [
    {
      tint: "green",
      icon: Users,
      value: externalUsersResult ? USER_TEST_TILE_VALUE : TESTING_PENDING_LABEL,
      label: DASHBOARD_TILE_LABELS.externalUsers,
      pending: externalUsersResult === null,
      href: DASHBOARD_LINKS.testing,
    },
    {
      tint: "peach",
      icon: Laptop,
      value: regressionResult ? REGRESSION_SHORT : TESTING_PENDING_LABEL,
      label: DASHBOARD_TILE_LABELS.regression,
      pending: regressionResult === null,
      check: regressionResult !== null,
      href: DASHBOARD_LINKS.testing,
    },
    {
      tint: "blue",
      icon: BarChart3,
      value: String(liveModules),
      label: DASHBOARD_TILE_LABELS.modules,
    },
    {
      tint: "cream",
      icon: Rocket,
      value: "V2",
      label: `${DASHBOARD_TILE_LABELS.roadmap}, ${roadmapIdeas} ideas`,
      href: DASHBOARD_LINKS.versionTwo,
    },
  ];

  const metricTiles = [
    {
      tint: "green" as TintName,
      icon: Users,
      value: String(totalCustomers),
      label: "total customers (model)",
    },
    {
      tint: "cream" as TintName,
      icon: Wallet,
      // formatMXN is the source of the figure; only the unit moves to the label
      value: formatMXN(revenue.monthly).replace(/\s*MXN$/, ""),
      label: `MXN monthly revenue (${SCENARIO_LABELS[REVENUE_MODEL_SCENARIO].toLowerCase()} scenario)`,
    },
    {
      tint: "peach" as TintName,
      icon: Trophy,
      value: topPlanValue,
      label: topPlanLabel,
    },
  ];

  return (
    <PageShell width="max-w-[1280px]">
      {/* Hero */}
      <PageHero
        label={
          <HeroLabel badge={<IconBadge tint="green" size="sm" icon={BarChart3} />}>
            {DASHBOARD_HERO.eyebrow}
          </HeroLabel>
        }
        title={
          <>
            {DASHBOARD_HERO.titleLead}{" "}
            <span className="block text-peach-500">
              {DASHBOARD_HERO.titleAccent}
            </span>
          </>
        }
        subtitle={DASHBOARD_HERO.subtitle}
        subtitleWidth="max-w-[23rem] lg:max-w-[26rem]"
        actions={
          <>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href={DASHBOARD_HERO.primary.href}
                className="inline-flex items-center gap-2.5 rounded-full bg-leaf-700 px-7 py-3.5 text-[15px] font-bold text-white shadow-btn transition-colors hover:bg-leaf-800"
              >
                {DASHBOARD_HERO.primary.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={DASHBOARD_HERO.secondary.href}
                className="inline-flex items-center gap-2.5 rounded-full border border-leaf-300 bg-white px-6 py-3.5 text-[15px] font-bold text-leaf-700 shadow-sm transition-colors hover:bg-leaf-50"
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                {DASHBOARD_HERO.secondary.label}
              </Link>
            </div>

            {/* Added after the user test: testers read this page as being
                about how the site was built, so it says plainly what it is. */}
            <p className="mt-3.5 max-w-[30rem] text-[13px] leading-relaxed text-leaf-600">
              {DASHBOARD_HERO.scopeNote}
            </p>
          </>
        }
        art={
          <div className="relative flex min-h-[210px] items-center justify-center sm:min-h-[250px] lg:min-h-[300px]">
            <Sparkle className="absolute left-2 top-1 h-8 w-10" color="peach" />
            <Sparkle
              className="absolute bottom-2 left-8 hidden h-7 w-9 rotate-[200deg] sm:block"
              color="leaf"
            />
            <Image
              src="/images/week6/dash-hero-lg.webp"
              alt=""
              width={440}
              height={286}
              priority
              aria-hidden="true"
              className="relative w-[98%] max-w-[550px] -translate-x-[7%] object-contain drop-shadow-[0_18px_28px_rgba(61,48,34,0.16)]"
            />
            <div className="absolute right-0 top-1/2 w-[40%] max-w-[158px] -translate-y-[58%] sm:w-[46%] sm:max-w-[232px] xl:right-[-3%]">
              <StickyNote tone="cream">
                <span className="flex flex-col gap-1.5">
                  {DASHBOARD_HERO.noteItems.map((item) => (
                    <NoteTick key={item}>{item}</NoteTick>
                  ))}
                </span>
              </StickyNote>
            </div>
          </div>
        }
      />

      {/* Stat tiles */}
      <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statTiles.map((tile) => {
          const Icon = tile.icon;
          const body = (
            <div className="flex w-full min-w-0 items-center gap-2.5 sm:gap-4">
              <Icon
                className={`h-7 w-7 shrink-0 sm:h-9 sm:w-9 ${TINT[tile.tint].badgeInk}`}
                aria-hidden="true"
                strokeWidth={2.1}
              />
              <div className="min-w-0">
                <p
                  className={`flex items-center gap-1.5 whitespace-nowrap font-poppins font-extrabold leading-none text-leaf-900 ${
                    tile.pending
                      ? "text-[20px] sm:text-[26px]"
                      : "text-[27px] sm:text-[36px]"
                  }`}
                >
                  {tile.pending ? (
                    <span className="inline-flex items-center gap-1.5 text-leaf-500">
                      <CircleDashed className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {tile.value}
                    </span>
                  ) : (
                    <>
                      {tile.value}
                      {tile.check && (
                        <CheckCircle2
                          className="h-5 w-5 shrink-0 text-leaf-600"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                </p>
                <p className="mt-1.5 text-[12.5px] font-medium leading-snug text-leaf-600 sm:text-[14px]">
                  {tile.label}
                </p>
              </div>
            </div>
          );
          const shell = `flex h-[104px] items-center rounded-[26px] border px-4 shadow-card sm:h-[116px] sm:px-5 ${TINT[tile.tint].card}`;
          return tile.href ? (
            <Link
              key={tile.label}
              href={tile.href}
              className={`${shell} transition-transform hover:-translate-y-0.5`}
            >
              {body}
            </Link>
          ) : (
            <div key={tile.label} className={shell}>
              {body}
            </div>
          );
        })}
      </div>

      <div className="mt-6 space-y-6">
        {/* Project modules + Testing summary */}
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <Card tint="plain" className="flex flex-col p-6 sm:p-8">
            <CardHead
              badge={<IconBadge tint="green" icon={BarChart3} />}
              title={PROJECT_PAGES_TITLE}
              subtitle={PROJECT_MODULES_INTRO}
            />
            {/* A tile per module, five across, as the mockup lays them out. */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              {PROJECT_MODULES.map((mod, index) => {
                const ModIcon =
                  PROJECT_MODULE_ICONS[index % PROJECT_MODULE_ICONS.length];
                const tint = TINT[PROJECT_MODULE_TINTS[index % PROJECT_MODULE_TINTS.length]];
                return (
                  <Link
                    key={mod.route}
                    href={mod.route}
                    title={mod.route}
                    className={`flex h-[116px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-1.5 text-center transition-transform hover:-translate-y-0.5 ${tint.card}`}
                  >
                    <ModIcon
                      className={`h-6 w-6 shrink-0 ${tint.badgeInk}`}
                      aria-hidden="true"
                      strokeWidth={2.1}
                    />
                    <span className="min-w-0 font-poppins text-[14px] font-extrabold leading-tight text-leaf-900">
                      {mod.name}
                    </span>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-leaf-200 bg-white px-2 py-0.5 text-[11px] font-bold ${
                        mod.status === "Live" ? "text-leaf-700" : "text-leaf-400"
                      }`}
                    >
                      {mod.status === "Live" ? (
                        <CheckCircle2 className="h-3 w-3 text-leaf-600" aria-hidden="true" />
                      ) : (
                        <CircleDashed className="h-3 w-3" aria-hidden="true" />
                      )}
                      {mod.status}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card id="testing" tint="plain" className="flex scroll-mt-24 flex-col p-6 sm:p-8">
            <CardHead
              badge={<IconBadge tint="green" icon={Users} />}
              title="Testing summary"
              subtitle={TESTING_INTRO}
            />

            {/* The notepad stands beside the rows, as tall as all three. */}
            <div className="mt-5 grid flex-1 items-stretch gap-3.5 md:grid-cols-[150px_1fr]">
              <Image
                src="/images/week6/dash-notepad-lg.webp"
                alt=""
                width={184}
                height={228}
                loading="lazy"
                aria-hidden="true"
                className="pointer-events-none hidden h-full w-full object-contain drop-shadow-[0_10px_16px_rgba(61,48,34,0.16)] md:block"
              />

              <ul className="flex min-w-0 flex-col justify-center gap-2.5">
                {TESTING_ROWS.map((row, index) => {
                  const Icon = TESTING_ICONS[index % TESTING_ICONS.length];
                  return (
                    <li
                      key={row.title}
                      className="flex flex-wrap items-center gap-x-2.5 gap-y-2 rounded-2xl border border-leaf-100 bg-leaf-50/60 px-3 py-2.5"
                    >
                      <IconBadge tint="green" size="sm" icon={Icon} />
                      <div className="min-w-0 flex-1 basis-[190px]">
                        <p className="font-poppins text-[14px] font-extrabold leading-tight text-leaf-900">
                          {row.title}
                        </p>
                        <p className="mt-0.5 text-[12px] leading-snug text-leaf-600">
                          {row.description}
                        </p>
                      </div>
                      {/* A check mark only where there is a real result. */}
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                          row.result
                            ? "border-leaf-600 bg-leaf-600 text-white"
                            : "border-leaf-200 bg-white text-leaf-500"
                        }`}
                      >
                        {row.result ? (
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {row.result ?? TESTING_PENDING_LABEL}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-4 rounded-2xl bg-cream-100 px-4 py-2.5 text-[12.5px] font-medium text-leaf-700">
              {TESTING_NOTE}
            </p>
          </Card>
        </div>

        {/* The six findings in full, lifted out of the testing summary so
            that card stays as compact as the mockup's. */}
        <Card id="findings" tint="plain" className="scroll-mt-24 p-6 sm:p-8">
          <CardHead
            badge={<IconBadge tint="green" icon={ClipboardList} />}
            title={FINDINGS_TITLE}
            subtitle={FINDINGS_INTRO}
            action={
              <span className="w-full sm:w-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf-600 bg-leaf-600 px-3 py-1.5 text-[12px] font-bold text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {TESTING_ROWS[2]?.result}
                </span>
              </span>
            }
          />
          <ul className="mt-4 gap-x-8 md:columns-2 [&>li]:mb-2 [&>li]:break-inside-avoid">
            {USER_TEST_RESULTS.findings.map((finding) => (
              <li
                key={finding}
                className="flex gap-2 text-[13px] leading-snug text-leaf-800"
              >
                <span
                  aria-hidden="true"
                  className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-400"
                />
                <span className="min-w-0">{finding}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Key metrics beside Where the data lives, then Saved records and
            the Version 2 links. The counts are fetched once, in the client
            component, so the metrics card is handed to it as a prop. */}
        <SavedRecords
          metricsCard={
            <Card tint="plain" className="flex h-full flex-col p-6 sm:p-8">
              <CardHead
                badge={<IconBadge tint="cream" icon={LineChart} />}
                title={REVENUE_MODEL_TITLE}
                subtitle={
                  <span className="mt-1 inline-flex rounded-full bg-cream-200/70 px-3 py-1 text-[12px] font-bold text-amber-800">
                    {REVENUE_MODEL_BADGE}
                  </span>
                }
                action={
                  <span className="w-full sm:w-auto">
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1.5 text-[13px] font-bold text-leaf-700 hover:text-peach-600"
                    >
                      Open the calculator
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </span>
                }
              />
              <div className="mt-5 grid flex-1 gap-3 sm:grid-cols-3">
                {metricTiles.map((tile) => {
                  const Icon = tile.icon;
                  return (
                    <div
                      key={tile.label}
                      className={`flex flex-col items-center justify-center rounded-2xl border px-2.5 py-6 text-center ${TINT[tile.tint].card}`}
                    >
                      <span
                        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/80 ${TINT[tile.tint].badgeInk}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={2.2} />
                      </span>
                      <p className="mt-2.5 font-poppins text-[24px] font-extrabold leading-tight text-leaf-900">
                        {tile.value}
                      </p>
                      <p className="mt-1.5 text-[11px] leading-[1.35] text-leaf-600">
                        {tile.label}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 rounded-2xl bg-cream-100 px-4 py-2.5 text-[12.5px] font-medium text-leaf-700">
                {REVENUE_MODEL_NOTE} {REVENUE_MODEL_SAVED_NOTE}
              </p>
            </Card>
          }
          versionCard={
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-leaf-800 to-leaf-700 p-6 shadow-card sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-[24rem]">
                  <h2 className="font-poppins text-[30px] font-extrabold leading-tight text-white sm:text-[36px]">
                    {DASHBOARD_V2_TITLE}
                  </h2>
                  <p className="mt-1 text-[15px] leading-snug text-leaf-100">
                    {DASHBOARD_V2_INTRO}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:w-[62%]">
                  {DASHBOARD_V2_LINKS.map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center justify-between gap-3 rounded-full py-3 pl-6 pr-3 text-left shadow-btn transition-transform hover:-translate-y-0.5 ${
                        index === 0 ? "bg-white" : "bg-peach-100"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block font-poppins text-[16px] font-extrabold leading-tight text-leaf-900">
                          {link.label}
                        </span>
                        <span className="mt-0.5 block text-[12.5px] leading-snug text-leaf-600">
                          {link.note}
                        </span>
                      </span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-peach-500 shadow-sm">
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          }
        />

      </div>
    </PageShell>
  );
}
