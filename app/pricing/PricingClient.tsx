"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, CalendarDays, RefreshCw } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PLANS } from "@/lib/productData";
import {
  calculateRevenue,
  formatMXN,
  formatWeekly,
  validateScenarioName,
} from "@/lib/pricing";
import {
  SCENARIOS,
  SCENARIO_LABELS,
  SCENARIO_MULTIPLIERS,
  WEEKLY_PRICES,
  WEEKS_PER_MONTH,
  type PlanKey,
  type ScenarioKey,
} from "@/lib/pricingAssumptions";
import {
  Card,
  CardHead,
  HeroArt,
  HeroLabel,
  IconBadge,
  PageHero,
  PageShell,
  Sparkle,
  StepArrow,
  StepItem,
  StepStrip,
  TableWrap,
} from "@/components/ui/pieces";
import {
  BTN_SECONDARY,
  CARD_SUBTITLE,
  FIELD,
  TINT,
  type TintName,
} from "@/components/ui/theme";

type CustomersByPlan = Record<PlanKey, number>;
type BillingPeriod = "monthly" | "annual";

type SavedScenario = {
  id: string;
  created_at: string;
  name: string;
  scenario: ScenarioKey;
  billing_period: BillingPeriod;
  customers_basic: number;
  customers_plus: number;
  customers_premium: number;
  monthly_revenue: number;
  annual_revenue: number;
};

const MAX_CUSTOMERS = 500;

const DEFAULT_CUSTOMERS: CustomersByPlan = {
  basic: 150,
  plus: 100,
  premium: 50,
};

const SAVED_SCENARIOS_PREVIEW_COUNT = 3;

function clampCustomers(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(MAX_CUSTOMERS, Math.max(0, Math.round(value)));
}

const PLAN_EMOJI: Record<PlanKey, string> = {
  basic: "🌱",
  plus: "👨‍🍳",
  premium: "👑",
};

const SCENARIO_HEADER_BG: Record<ScenarioKey, string> = {
  conservative: "bg-leaf-100",
  base: "bg-yellow-100",
  optimistic: "bg-blue-100",
};

/** Softer wash behind each scenario column in the assumptions table. */
const SCENARIO_COLUMN_BG: Record<ScenarioKey, string> = {
  conservative: "bg-leaf-50/70",
  base: "bg-yellow-50/70",
  optimistic: "bg-blue-50/70",
};

/** Pastel tint per summary tile beside the revenue panel. */
const SUMMARY_TINTS: TintName[] = ["green", "cream", "pink"];

const STEPS = [
  "Choose period and scenario",
  "Set customers",
  "Read the revenue",
  "Save it",
];

const SCENARIO_DESCRIPTIONS: Record<ScenarioKey, string> = {
  conservative: `Fewer customers than expected (${SCENARIO_MULTIPLIERS.conservative}x)`,
  base: `The expected case (${SCENARIO_MULTIPLIERS.base}x)`,
  optimistic: `Faster growth than expected (${SCENARIO_MULTIPLIERS.optimistic}x)`,
};

export default function PricingClient() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [scenario, setScenario] = useState<ScenarioKey>("base");
  const [customers, setCustomers] = useState<CustomersByPlan>(
    DEFAULT_CUSTOMERS,
  );
  const [customerInputs, setCustomerInputs] = useState<
    Record<PlanKey, string>
  >({
    basic: String(DEFAULT_CUSTOMERS.basic),
    plus: String(DEFAULT_CUSTOMERS.plus),
    premium: String(DEFAULT_CUSTOMERS.premium),
  });

  const revenue = useMemo(
    () => calculateRevenue(customers, scenario),
    [customers, scenario],
  );

  const [scenarioName, setScenarioName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState(false);

  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadErrorDetail, setLoadErrorDetail] = useState<string | null>(null);
  const [showAllSaved, setShowAllSaved] = useState(false);

  const [scenarioInfoOpen, setScenarioInfoOpen] = useState(false);
  const scenarioInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scenarioInfoOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      if (
        scenarioInfoRef.current &&
        !scenarioInfoRef.current.contains(event.target as Node)
      ) {
        setScenarioInfoOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setScenarioInfoOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [scenarioInfoOpen]);

  function updateCustomers(plan: PlanKey, value: number) {
    const clamped = clampCustomers(value);
    setCustomers((prev) => ({ ...prev, [plan]: clamped }));
    setCustomerInputs((prev) => ({ ...prev, [plan]: String(clamped) }));
  }

  function handleCustomerTextChange(plan: PlanKey, raw: string) {
    if (raw === "") {
      setCustomerInputs((prev) => ({ ...prev, [plan]: "" }));
      setCustomers((prev) => ({ ...prev, [plan]: 0 }));
      return;
    }
    const stripped = raw.replace(/^0+(?=\d)/, "");
    updateCustomers(plan, Number(stripped));
  }

  function resetToDefaults() {
    setCustomers(DEFAULT_CUSTOMERS);
    setCustomerInputs({
      basic: String(DEFAULT_CUSTOMERS.basic),
      plus: String(DEFAULT_CUSTOMERS.plus),
      premium: String(DEFAULT_CUSTOMERS.premium),
    });
    setScenario("base");
    setBillingPeriod("monthly");
  }

  async function loadSavedScenarios() {
    setLoadingSaved(true);
    setLoadError(null);
    setLoadErrorDetail(null);

    const { data, error } = await supabase
      .from("pricing_scenarios")
      .select("*")
      .neq("name", "__test__")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("loadSavedScenarios error:", error);
      setLoadError("Could not load saved scenarios.");
      setLoadErrorDetail(error.message);
    } else {
      setSavedScenarios((data ?? []) as SavedScenario[]);
    }
    setLoadingSaved(false);
  }

  useEffect(() => {
    loadSavedScenarios();
  }, []);

  async function handleSave() {
    if (!validateScenarioName(scenarioName)) {
      setNameError(true);
      setSaveMessage(null);
      setSaveError(false);
      return;
    }
    setNameError(false);
    setSaving(true);
    setSaveMessage(null);
    setSaveError(false);

    const { error } = await supabase.from("pricing_scenarios").insert({
      name: scenarioName.trim(),
      scenario,
      billing_period: billingPeriod,
      customers_basic: customers.basic,
      customers_plus: customers.plus,
      customers_premium: customers.premium,
      monthly_revenue: revenue.monthly,
      annual_revenue: revenue.annual,
    });

    if (error) {
      setSaveMessage("Could not save this scenario. Please try again.");
      setSaveError(true);
    } else {
      setSaveMessage("Scenario saved!");
      setSaveError(false);
      setScenarioName("");
      await loadSavedScenarios();
    }
    setSaving(false);
  }

  const visibleSavedScenarios = showAllSaved
    ? savedScenarios
    : savedScenarios.slice(0, SAVED_SCENARIOS_PREVIEW_COUNT);

  const periodRevenue =
    billingPeriod === "monthly" ? revenue.monthly : revenue.annual;
  const otherPeriodRevenue =
    billingPeriod === "monthly" ? revenue.annual : revenue.monthly;
  const otherPeriodLabel = billingPeriod === "monthly" ? "year" : "month";

  const totalCustomers =
    customers.basic + customers.plus + customers.premium;

  const planRevenues = PLANS.map((plan) => ({
    plan,
    monthly: calculateRevenue(
      { basic: 0, plus: 0, premium: 0, [plan.id]: customers[plan.id] },
      scenario,
    ).monthly,
  }));
  const topPlanRevenue = planRevenues.reduce((top, current) =>
    current.monthly > top.monthly ? current : top,
  );
  const topPlanShare =
    revenue.monthly > 0
      ? Math.round((topPlanRevenue.monthly / revenue.monthly) * 100)
      : 0;

  const summaryTiles = [
    {
      icon: "👨‍👩‍👧",
      value: `${totalCustomers}`,
      label: "total customers",
    },
    {
      icon: "💵",
      value:
        totalCustomers > 0
          ? formatMXN(revenue.monthly / totalCustomers)
          : "—",
      label: "avg. revenue / customer / month",
    },
    {
      icon: "🏆",
      value:
        totalCustomers > 0
          ? `${topPlanRevenue.plan.name} (${topPlanShare}%)`
          : "—",
      label: "top plan by revenue",
    },
  ];

  return (
    <PageShell>
      {/* Hero */}
      <PageHero
        label={
          <HeroLabel badge={<IconBadge tint="peach" size="lg">📊</IconBadge>}>
            Pricing
          </HeroLabel>
        }
        title={
          <>
            Estimate your <span className="text-peach-500">impact.</span>
          </>
        }
        subtitle="Play with different scenarios and see the potential revenue for Lunchies."
        actions={
          <Link
            href="/product"
            className="mt-4 inline-block rounded-full bg-peach-50 px-4 py-2 text-sm font-bold text-peach-600 transition-colors hover:bg-peach-100"
          >
            See what each plan includes →
          </Link>
        }
        art={
          <HeroArt
            src="/images/redesign/hero-pricing.webp"
            width={578}
            height={448}
            tone="cream"
            priority
            glyph="🥗"
          />
        }
      />

      {/* Step bar */}
      <StepStrip className="mt-10">
        {STEPS.map((step, index) => (
          <Fragment key={step}>
            {index > 0 && <StepArrow>→</StepArrow>}
            <StepItem index={index + 1}>{step}</StepItem>
          </Fragment>
        ))}
      </StepStrip>

      <div className="mt-10 space-y-6">
        {/* Section 1 + 2: Billing period + Scenario */}
        <div className="grid gap-5 md:grid-cols-2">
          <Card tint="plain" className="p-6 sm:p-8">
            <CardHead
              step="1"
              badge={<IconBadge tint="green" icon={CalendarDays} />}
              title="Billing period"
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {(["monthly", "annual"] as BillingPeriod[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setBillingPeriod(period)}
                  className={`rounded-full border px-6 py-2.5 text-sm font-semibold capitalize shadow-sm transition-colors ${
                    billingPeriod === period
                      ? "border-leaf-600 bg-leaf-600 text-white"
                      : "border-leaf-200 bg-white text-leaf-700 hover:bg-leaf-50"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </Card>
          <Card tint="plain" className="p-6 sm:p-8">
            <CardHead
              step="2"
              badge={<IconBadge tint="blue" icon={BarChart3} />}
              titleClassName="flex items-center gap-1.5"
              title={
                <>
                  Scenario
                  <span ref={scenarioInfoRef} className="relative inline-flex">
                    <button
                      type="button"
                      aria-expanded={scenarioInfoOpen}
                      aria-label="What do the scenarios mean?"
                      onClick={() => setScenarioInfoOpen((open) => !open)}
                      onMouseEnter={() => setScenarioInfoOpen(true)}
                      onFocus={() => setScenarioInfoOpen(true)}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-sm text-leaf-400 transition-colors hover:text-leaf-600"
                    >
                      ⓘ
                    </button>
                    {scenarioInfoOpen && (
                      <div
                        role="dialog"
                        aria-label="What do the scenarios mean?"
                        className="absolute left-0 top-full z-10 mt-2 w-[min(16rem,calc(100vw-2rem))] rounded-2xl border border-leaf-100 bg-white p-4 text-left text-xs font-normal text-leaf-700 shadow-soft-lg"
                      >
                        <p>
                          <strong>Conservative:</strong> fewer customers than
                          expected ({SCENARIO_MULTIPLIERS.conservative}x).
                        </p>
                        <p className="mt-1">
                          <strong>Base:</strong> the expected case (
                          {SCENARIO_MULTIPLIERS.base}x).
                        </p>
                        <p className="mt-1">
                          <strong>Optimistic:</strong> faster growth than
                          expected ({SCENARIO_MULTIPLIERS.optimistic}x).
                        </p>
                        <p className="mt-2 text-leaf-500">
                          Revenue = customers × weekly price ×{" "}
                          {WEEKS_PER_MONTH} weeks × scenario multiplier.
                        </p>
                      </div>
                    )}
                  </span>
                </>
              }
            />
            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {SCENARIOS.map((key) => {
                const scenarioResult = calculateRevenue(customers, key);
                const scenarioPeriodValue =
                  billingPeriod === "monthly"
                    ? scenarioResult.monthly
                    : scenarioResult.annual;
                const isActive = scenario === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setScenario(key)}
                    className={`rounded-2xl border px-4 py-3 text-left shadow-sm transition-colors ${
                      isActive
                        ? "border-leaf-600 bg-leaf-600 text-white"
                        : "border-leaf-100 bg-leaf-50 text-leaf-700 hover:bg-leaf-100"
                    }`}
                  >
                    <span className="block font-poppins text-sm font-bold">
                      {SCENARIO_LABELS[key]}
                    </span>
                    <span
                      className={`block text-xs font-semibold ${
                        isActive ? "text-white/90" : "text-leaf-500"
                      }`}
                    >
                      {formatMXN(scenarioPeriodValue)}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs font-medium text-leaf-600">
              {SCENARIO_DESCRIPTIONS[scenario]}
            </p>
          </Card>
        </div>

        {/* Section 3: Number of customers per plan */}
        <Card tint="green" className="p-6 sm:p-8">
          <CardHead
            step="3"
            badge={<IconBadge tint="green">👨‍👩‍👧</IconBadge>}
            title="Number of customers per plan"
            action={
              <button
                type="button"
                onClick={resetToDefaults}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-leaf-200 bg-white px-4 py-2 text-xs font-bold text-leaf-700 shadow-sm transition-colors hover:bg-leaf-50"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset to defaults
              </button>
            }
          />
          {/* Kept outside CardHead so it stays after the button, as before. */}
          <p className={CARD_SUBTITLE}>
            Adjust the number of active customers in each plan.
          </p>
          <div className="mt-5 space-y-4">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-wrap items-center gap-3 border-b border-leaf-200/50 pb-4 last:border-0 last:pb-0 sm:flex-nowrap sm:gap-4"
              >
                <div className="flex w-full items-center gap-3 sm:contents">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm">
                    {PLAN_EMOJI[plan.id]}
                  </span>
                  <span className="text-[14px] font-bold text-leaf-800 sm:w-44 sm:shrink-0">
                    {plan.name} (${WEEKLY_PRICES[plan.id]} / week)
                  </span>
                </div>
                <div className="flex w-full items-center gap-3 sm:contents">
                  <input
                    aria-label={`${plan.name} customers`}
                    type="range"
                    min={0}
                    max={MAX_CUSTOMERS}
                    value={customers[plan.id]}
                    onChange={(event) =>
                      updateCustomers(plan.id, Number(event.target.value))
                    }
                    className="h-2 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-leaf-100 accent-leaf-600"
                  />
                  <input
                    type="number"
                    min={0}
                    max={MAX_CUSTOMERS}
                    value={customerInputs[plan.id]}
                    onChange={(event) =>
                      handleCustomerTextChange(plan.id, event.target.value)
                    }
                    className="w-20 shrink-0 rounded-2xl border border-leaf-100 bg-white px-3 py-2 text-right text-sm font-semibold text-leaf-900 shadow-sm focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100"
                  />
                  <span className="shrink-0 text-xs font-medium text-leaf-600">
                    customers
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Section 4: Estimated revenue */}
        <Card tint="plain" className="p-6 sm:p-8">
          <CardHead
            step="4"
            badge={<IconBadge tint="cream">💰</IconBadge>}
            titleClassName="flex flex-wrap items-center gap-2"
            title={
              <>
                Estimated revenue{" "}
                <span className="text-sm font-semibold text-leaf-500">
                  ({SCENARIO_LABELS[scenario]} scenario)
                </span>
              </>
            }
            subtitle="Based on the selected number of customers and scenario."
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div
              className={`relative overflow-hidden rounded-3xl border p-8 text-center shadow-sm ${
                billingPeriod === "monthly"
                  ? "border-leaf-100 bg-leaf-50"
                  : "border-rose-100 bg-rose-50"
              }`}
            >
              <Sparkle
                className="absolute right-5 top-5 h-6 w-8 opacity-70"
                color="peach"
              />
              <span className="text-3xl" aria-hidden="true">
                {billingPeriod === "monthly" ? "💰" : "📊"}
              </span>
              <p
                className={`mt-2 text-sm font-bold ${
                  billingPeriod === "monthly"
                    ? "text-leaf-600"
                    : "text-rose-700"
                }`}
              >
                {billingPeriod === "monthly"
                  ? "Monthly revenue"
                  : "Annual revenue"}
              </p>
              <p
                className={`mt-1 font-poppins text-3xl font-extrabold sm:text-4xl ${
                  billingPeriod === "monthly"
                    ? "text-leaf-700"
                    : "text-rose-600"
                }`}
              >
                {formatMXN(periodRevenue)}
              </p>
              <p className="mx-auto mt-3 inline-block rounded-full bg-white/80 px-4 py-1.5 text-xs font-medium text-leaf-600 shadow-sm">
                Equivalent: {formatMXN(otherPeriodRevenue)} per{" "}
                {otherPeriodLabel}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-0 px-1">
              {summaryTiles.map((tile, index) => (
                <div
                  key={tile.label}
                  className={`flex items-center gap-3 py-4 ${
                    index > 0 ? "border-t border-leaf-100" : "pt-0"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                      TINT[SUMMARY_TINTS[index % SUMMARY_TINTS.length]].badge
                    }`}
                    aria-hidden="true"
                  >
                    {tile.icon}
                  </span>
                  <p className="font-poppins text-[15px] font-extrabold text-leaf-900">
                    {tile.value}
                  </p>
                  <p className="text-[13px] text-leaf-600">{tile.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Section 5: Key assumptions */}
        <Card tint="green" className="p-6 sm:p-8">
          <CardHead
            step="5"
            badge={<IconBadge tint="green">📐</IconBadge>}
            title="Key assumptions"
            subtitle="These inputs are used to calculate the revenue."
          />
          <TableWrap className="mt-6">
            <table className="w-full min-w-[420px] border-separate border-spacing-0 text-left text-[14px]">
              <thead>
                <tr>
                  <th className="py-2.5 pr-4 align-bottom text-[13px] font-bold text-leaf-700">
                    Assumption
                  </th>
                  {SCENARIOS.map((key) => (
                    <th
                      key={key}
                      className={`rounded-t-2xl px-3 py-2.5 text-center font-poppins text-[14px] font-extrabold text-leaf-900 ${SCENARIO_HEADER_BG[key]}`}
                    >
                      {SCENARIO_LABELS[key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLANS.map((plan) => (
                  <tr key={plan.id} className="text-leaf-800">
                    <td className="border-b border-leaf-100 py-2.5 pr-4 font-medium">
                      Weekly price — {plan.name}
                    </td>
                    {SCENARIOS.map((key) => (
                      <td
                        key={key}
                        className={`border-b border-white/70 px-3 py-2.5 text-center font-semibold ${SCENARIO_COLUMN_BG[key]}`}
                      >
                        {formatWeekly(WEEKLY_PRICES[plan.id])}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="text-leaf-800">
                  <td className="border-b border-leaf-100 py-2.5 pr-4 font-medium">
                    Weeks per month
                  </td>
                  {SCENARIOS.map((key) => (
                    <td
                      key={key}
                      className={`border-b border-white/70 px-3 py-2.5 text-center font-semibold ${SCENARIO_COLUMN_BG[key]}`}
                    >
                      {WEEKS_PER_MONTH}
                    </td>
                  ))}
                </tr>
                <tr className="text-leaf-800">
                  <td className="py-3 pr-4 font-medium">Scenario multiplier</td>
                  {SCENARIOS.map((key) => (
                    <td
                      key={key}
                      className={`rounded-b-2xl px-3 py-2.5 text-center font-semibold ${SCENARIO_COLUMN_BG[key]}`}
                    >
                      {SCENARIO_MULTIPLIERS[key]}x
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </TableWrap>
          <p className="mt-5 text-xs italic text-leaf-600">
            Prices, customer counts and multipliers are founder assumptions,
            anchored to the sources below.
          </p>
          <div className="mt-4 rounded-2xl bg-white/70 p-5 shadow-sm">
            <p className="font-poppins text-xs font-bold tracking-wider text-leaf-700">
              Sources
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-leaf-600">
              <li>
                <a
                  href="https://www.alcontacto.com.mx/2025/08/31/cuanto-cuesta-hoy-mandar-un-lunch-saludable-a-los-ninos-en-mexico/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-leaf-700 underline decoration-leaf-300 underline-offset-2 hover:text-peach-600"
                >
                  Al Contacto, Aug 2025 (Profeco and SNIIM data)
                </a>{" "}
                — homemade lunch price range
              </li>
              <li>
                <a
                  href="https://www.record.com.mx/historia/cuanto-cuesta-el-regreso-a-clases-esto-es-lo-que-gastan-las-familias-mexicanas-en-transporte-y-comida-2026081902365258129"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-leaf-700 underline decoration-leaf-300 underline-offset-2 hover:text-peach-600"
                >
                  ANPEC via Récord, Aug 2026
                </a>{" "}
                — family school spending
              </li>
              <li>
                <a
                  href="https://www.manyar.com.mx/plan-infantil/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-leaf-700 underline decoration-leaf-300 underline-offset-2 hover:text-peach-600"
                >
                  manyar.com.mx/plan-infantil, Oct 2026
                </a>{" "}
                — full-day meal plan price
              </li>
              <li>
                <a
                  href="https://lunchybox.app/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-leaf-700 underline decoration-leaf-300 underline-offset-2 hover:text-peach-600"
                >
                  lunchybox.app, Oct 2026
                </a>{" "}
                — lunch delivery price
              </li>
            </ul>
          </div>
        </Card>

        {/* Section 6 + 7: Save this scenario + Saved scenarios */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card tint="plain" className="p-6 sm:p-8">
            <CardHead
              step="6"
              badge={<IconBadge tint="peach">🔖</IconBadge>}
              title="Save this scenario"
              subtitle={
                <>
                  Keep a record of your inputs and results to compare different
                  scenarios.
                </>
              }
            />
            <div className="mt-5 space-y-3">
              <div>
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(event) => setScenarioName(event.target.value)}
                  placeholder="Scenario name (e.g. Base case - CDMX)"
                  className={FIELD}
                />
                {nameError && (
                  <p className="mt-2 text-xs font-semibold text-rose-600">
                    Please enter a name for this scenario.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className={BTN_SECONDARY}
                >
                  {saving ? "Saving..." : "Save scenario"}
                </button>
                {saveMessage && (
                  <span
                    className={`text-sm font-semibold ${
                      saveError ? "text-rose-600" : "text-leaf-700"
                    }`}
                  >
                    {saveMessage}
                  </span>
                )}
              </div>
            </div>
          </Card>

          <Card tint="green" className="p-6 sm:p-8">
            <CardHead
              step="7"
              badge={<IconBadge tint="green">📋</IconBadge>}
              title="Saved scenarios"
              action={
                !loadingSaved &&
                !loadError &&
                savedScenarios.length > SAVED_SCENARIOS_PREVIEW_COUNT ? (
                  <button
                    type="button"
                    onClick={() => setShowAllSaved((prev) => !prev)}
                    className="shrink-0 rounded-full bg-peach-50 px-4 py-2 text-sm font-bold text-peach-600 transition-colors hover:bg-peach-100"
                  >
                    {showAllSaved ? "Show less" : "View all →"}
                  </button>
                ) : undefined
              }
            />
            {/* Kept outside CardHead so it stays after the button, as before. */}
            <p className={CARD_SUBTITLE}>
              View and compare your previous scenario analyses.
            </p>
            <div className="mt-5 space-y-3">
              {loadingSaved && (
                <p className="text-sm text-leaf-600">
                  Loading saved scenarios...
                </p>
              )}
              {!loadingSaved && loadError && (
                <div>
                  <p className="text-sm text-rose-600">{loadError}</p>
                  {loadErrorDetail && (
                    <p className="mt-1 text-xs text-leaf-600">
                      {loadErrorDetail}
                    </p>
                  )}
                </div>
              )}
              {!loadingSaved && !loadError && savedScenarios.length === 0 && (
                <p className="text-sm text-leaf-600">
                  No saved scenarios yet. Name this one and press Save to
                  keep it.
                </p>
              )}
              {!loadingSaved &&
                !loadError &&
                visibleSavedScenarios.map((row) => {
                  const rowValue =
                    row.billing_period === "monthly"
                      ? row.monthly_revenue
                      : row.annual_revenue;
                  return (
                    <div
                      key={row.id}
                      className="flex items-center gap-3 rounded-2xl border border-leaf-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-soft"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-leaf-100 text-base">
                        📄
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-poppins text-sm font-bold text-leaf-900">
                          {row.name}
                        </p>
                        <p className="text-sm font-bold text-leaf-700">
                          {formatMXN(rowValue)}{" "}
                          <span className="text-xs font-medium text-leaf-500">
                            (
                            {row.billing_period === "monthly"
                              ? "Monthly"
                              : "Annual"}
                            )
                          </span>
                        </p>
                      </div>
                      <p className="shrink-0 text-xs font-medium text-leaf-600">
                        {new Date(row.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
