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
  HeroArt,
  HeroLabel,
  IconBadge,
  NoteTick,
  PageHero,
  PageShell,
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
  PROJECT_MODULES,
  PROJECT_MODULES_INTRO,
  REVENUE_MODEL_CUSTOMERS,
  REVENUE_MODEL_NOTE,
  REVENUE_MODEL_SCENARIO,
  REVENUE_MODEL_TITLE,
  ROADMAP_PHASES,
  TESTING_INTRO,
  TESTING_NOTE,
  TESTING_PENDING_LABEL,
  TESTING_ROWS,
} from "@/lib/week6Data";
import SavedRecords from "./SavedRecords";

const TESTING_ICONS = [Users, Laptop, ClipboardList];

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
  const topPlan = planRevenues.reduce((top, current) =>
    current.monthly > top.monthly ? current : top,
  );
  const topPlanShare =
    revenue.monthly > 0
      ? Math.round((topPlan.monthly / revenue.monthly) * 100)
      : 0;

  const statTiles: {
    tint: TintName;
    icon: typeof Users;
    value: string;
    label: string;
    href?: string;
    pending?: boolean;
  }[] = [
    {
      tint: "green",
      icon: Users,
      value: externalUsersResult ?? TESTING_PENDING_LABEL,
      label: DASHBOARD_TILE_LABELS.externalUsers,
      pending: externalUsersResult === null,
      href: DASHBOARD_LINKS.testing,
    },
    {
      tint: "peach",
      icon: Laptop,
      value: regressionResult ?? TESTING_PENDING_LABEL,
      label: DASHBOARD_TILE_LABELS.regression,
      pending: regressionResult === null,
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
      value: `${roadmapIdeas} ideas`,
      label: DASHBOARD_TILE_LABELS.roadmap,
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
      value: formatMXN(revenue.monthly),
      label: `monthly revenue (${SCENARIO_LABELS[REVENUE_MODEL_SCENARIO].toLowerCase()} scenario)`,
    },
    {
      tint: "peach" as TintName,
      icon: Trophy,
      value: `${topPlan.plan.name} (${topPlanShare}%)`,
      label: "top plan by revenue",
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
        art={
          <HeroArt
            src="/images/redesign/hero-product.webp"
            width={560}
            height={510}
            tone="leaf"
            priority
            note={
              <StickyNote tone="cream">
                <span className="flex flex-col gap-1.5">
                  {DASHBOARD_HERO.noteItems.map((item) => (
                    <NoteTick key={item}>{item}</NoteTick>
                  ))}
                </span>
              </StickyNote>
            }
          />
        }
      />

      {/* Stat tiles */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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
                  className={`font-poppins font-extrabold leading-tight text-leaf-900 ${
                    tile.pending
                      ? "text-[19px] sm:text-[26px]"
                      : tile.value.length > 9
                        ? "text-[17px] sm:text-[24px]"
                        : "text-[30px] sm:text-[40px]"
                  }`}
                >
                  {tile.pending ? (
                    <span className="inline-flex items-center gap-1.5 text-leaf-500">
                      <CircleDashed className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {tile.value}
                    </span>
                  ) : (
                    tile.value
                  )}
                </p>
                <p className="mt-1 text-[13px] font-medium leading-snug text-leaf-600 sm:text-[16px]">
                  {tile.label}
                </p>
              </div>
            </div>
          );
          const shell = `flex h-[132px] items-center rounded-[28px] border px-4 shadow-card sm:h-[150px] sm:px-7 ${TINT[tile.tint].card}`;
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
        <div className="grid gap-6 lg:grid-cols-2">
          <Card tint="plain" className="flex flex-col p-6 sm:p-8">
            <CardHead
              badge={<IconBadge tint="green" icon={BarChart3} />}
              title="Project modules"
              subtitle={PROJECT_MODULES_INTRO}
            />
            <ul className="mt-5 divide-y divide-leaf-100">
              {PROJECT_MODULES.map((mod, index) => {
                const ModIcon =
                  PROJECT_MODULE_ICONS[index % PROJECT_MODULE_ICONS.length];
                return (
                <li key={mod.route}>
                  <Link
                    href={mod.route}
                    title={mod.route}
                    className="flex items-center gap-3.5 py-[11px] transition-colors hover:text-leaf-600"
                  >
                    <ModIcon
                      className="h-[22px] w-[22px] shrink-0 text-leaf-600"
                      aria-hidden="true"
                      strokeWidth={2.1}
                    />
                    <span className="min-w-0 flex-1 font-poppins text-[17px] font-extrabold text-leaf-900">
                      {mod.name}
                    </span>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-bold ${
                        mod.status === "Live"
                          ? "border-leaf-200 bg-white text-leaf-700"
                          : "border-leaf-200 bg-white text-leaf-400"
                      }`}
                    >
                      {mod.status === "Live" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-leaf-600" aria-hidden="true" />
                      ) : (
                        <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {mod.status}
                    </span>
                  </Link>
                </li>
                );
              })}
            </ul>
          </Card>

          <Card id="testing" tint="plain" className="flex scroll-mt-24 flex-col p-6 sm:p-8">
            <CardHead
              badge={<IconBadge tint="green" icon={Users} />}
              title="Testing summary"
              subtitle={TESTING_INTRO}
            />
            <ul className="mb-5 mt-5 flex flex-1 flex-col justify-between gap-3">
              {TESTING_ROWS.map((row, index) => {
                const Icon = TESTING_ICONS[index % TESTING_ICONS.length];
                return (
                  <li
                    key={row.title}
                    className="flex items-center gap-3.5 rounded-2xl border border-leaf-100 bg-leaf-50/60 p-4"
                  >
                    <IconBadge tint="green" size="sm" icon={Icon} />
                    <div className="min-w-0 flex-1">
                      <p className="font-poppins text-[16px] font-extrabold text-leaf-900">
                        {row.title}
                      </p>
                      <p className="text-[14px] leading-snug text-leaf-600">
                        {row.description}
                      </p>
                    </div>
                    {/* A check mark only where there is a real result. */}
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold ${
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
            <p className="mt-auto rounded-2xl bg-cream-100 px-4 py-3 text-[13px] font-medium text-leaf-700">
              {TESTING_NOTE}
            </p>
          </Card>
        </div>

        {/* Key metrics beside Where the data lives, then Saved records and
            the Version 2 links. The counts are fetched once, in the client
            component, so the metrics card is handed to it as a prop. */}
        <SavedRecords
          metricsCard={
            <Card tint="plain" className="p-6 sm:p-8">
              <CardHead
                badge={<IconBadge tint="cream" icon={LineChart} />}
                titleClassName="text-[20px] sm:text-[22px]"
                title={REVENUE_MODEL_TITLE}
                subtitle="Main project indicators."
              />
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {metricTiles.map((tile) => {
                  const Icon = tile.icon;
                  return (
                    <div
                      key={tile.label}
                      className={`rounded-2xl border p-4 text-center ${TINT[tile.tint].card}`}
                    >
                      <span
                        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white/80 ${TINT[tile.tint].badgeInk}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={2.2} />
                      </span>
                      <p className="mt-2 whitespace-nowrap font-poppins text-[18px] font-extrabold leading-tight text-leaf-900">
                        {tile.value}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-snug text-leaf-600">
                        {tile.label}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 rounded-2xl bg-cream-100 px-4 py-3 text-[13px] font-medium text-leaf-700">
                {REVENUE_MODEL_NOTE}
              </p>
              <Link
                href="/pricing"
                className="mt-4 inline-flex items-center gap-2 text-[14px] font-bold text-leaf-700 hover:text-peach-600"
              >
                Open the calculator
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Card>
          }
          versionCard={
            <Card tint="plain" className="p-6 sm:p-8">
              <CardHead
                badge={<IconBadge tint="blue" icon={Flag} />}
                title={DASHBOARD_V2_TITLE}
                subtitle={DASHBOARD_V2_INTRO}
              />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {DASHBOARD_V2_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-leaf-100 bg-leaf-50/60 px-5 py-4 font-poppins text-[15px] font-extrabold text-leaf-900 transition-transform hover:-translate-y-0.5"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4 shrink-0 text-leaf-500" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </Card>
          }
        />

      </div>
    </PageShell>
  );
}
