"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-peach-100 text-3xl"
              aria-hidden="true"
            >
              📊
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-peach-500">
              Pricing
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">
            Estimate your <span className="text-peach-500">impact.</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-gray-600">
            Play with different scenarios and see the potential revenue for
            Lunchies.
          </p>
          <Link
            href="/product"
            className="mt-2 inline-block text-sm font-semibold text-peach-600 transition-colors hover:text-peach-700"
          >
            See what each plan includes →
          </Link>
        </div>
        <div className="flex justify-center md:justify-end">
          <span className="text-6xl leading-none" aria-hidden="true">
            🥗
          </span>
        </div>
      </div>

      {/* Step bar */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 rounded-full border border-leaf-100 bg-leaf-50 px-4 py-3 text-center text-xs font-medium text-leaf-700 sm:text-sm">
        {STEPS.map((step, index) => (
          <Fragment key={step}>
            {index > 0 && (
              <span aria-hidden="true" className="text-leaf-400">
                →
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-[10px] font-bold text-white">
                {index + 1}
              </span>
              {step}
            </span>
          </Fragment>
        ))}
      </div>

      <div className="mt-12 space-y-8">
        {/* Section 1 + 2: Billing period + Scenario */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
                1
              </span>
              <h2 className="text-lg font-semibold text-leaf-700">
                Billing period
              </h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(["monthly", "annual"] as BillingPeriod[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setBillingPeriod(period)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                    billingPeriod === period
                      ? "border-leaf-600 bg-leaf-600 text-white"
                      : "border-leaf-200 bg-white text-leaf-700 hover:bg-leaf-50"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
                2
              </span>
              <h2 className="flex items-center gap-1.5 text-lg font-semibold text-leaf-700">
                Scenario
                <span ref={scenarioInfoRef} className="relative inline-flex">
                  <button
                    type="button"
                    aria-expanded={scenarioInfoOpen}
                    aria-label="What do the scenarios mean?"
                    title={SCENARIO_DESCRIPTIONS[scenario]}
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
                      className="absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-xl border border-leaf-100 bg-white p-4 text-left text-xs font-normal text-leaf-700 shadow-sm"
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
                        Revenue = customers × weekly price × {WEEKS_PER_MONTH}{" "}
                        weeks × scenario multiplier.
                      </p>
                    </div>
                  )}
                </span>
              </h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {SCENARIOS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setScenario(key)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    scenario === key
                      ? "border-leaf-600 bg-leaf-600 text-white"
                      : "border-leaf-200 bg-white text-leaf-700 hover:bg-leaf-50"
                  }`}
                >
                  {SCENARIO_LABELS[key]}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-leaf-600">
              {SCENARIO_DESCRIPTIONS[scenario]}
            </p>
          </div>
        </div>

        {/* Section 3: Number of customers per plan */}
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
                3
              </span>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
                <span aria-hidden="true">👨‍👩‍👧</span> Number of customers per
                plan
              </h2>
            </div>
            <button
              type="button"
              onClick={resetToDefaults}
              className="rounded-full border border-leaf-200 px-4 py-1.5 text-xs font-semibold text-leaf-700 transition-colors hover:bg-white"
            >
              Reset to defaults
            </button>
          </div>
          <p className="mt-2 text-sm text-leaf-600">
            Adjust the number of active customers in each plan.
          </p>
          <div className="mt-5 space-y-5">
            {PLANS.map((plan) => (
              <div key={plan.id} className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-xl">
                  {PLAN_EMOJI[plan.id]}
                </span>
                <span className="w-40 shrink-0 text-sm font-medium text-leaf-800">
                  {plan.name} (${WEEKLY_PRICES[plan.id]} / week)
                </span>
                <input
                  aria-label={`${plan.name} customers`}
                  type="range"
                  min={0}
                  max={MAX_CUSTOMERS}
                  value={customers[plan.id]}
                  onChange={(event) =>
                    updateCustomers(plan.id, Number(event.target.value))
                  }
                  className="flex-1 accent-leaf-600"
                />
                <input
                  type="number"
                  min={0}
                  max={MAX_CUSTOMERS}
                  value={customerInputs[plan.id]}
                  onChange={(event) =>
                    handleCustomerTextChange(plan.id, event.target.value)
                  }
                  className="w-20 rounded-lg border border-leaf-200 bg-white px-3 py-2 text-right text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none"
                />
                <span className="shrink-0 text-xs text-leaf-600">
                  customers
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Estimated revenue */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
              4
            </span>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
              <span aria-hidden="true">💰</span> Estimated revenue{" "}
              <span className="text-sm font-normal text-leaf-500">
                ({SCENARIO_LABELS[scenario]} scenario)
              </span>
            </h2>
          </div>
          <p className="mt-2 text-sm text-leaf-600">
            Based on the selected number of customers and scenario.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div
              className={`rounded-xl border border-leaf-100 bg-leaf-50 p-6 text-center ${
                billingPeriod === "monthly" ? "ring-2 ring-leaf-500" : ""
              }`}
            >
              <span className="text-3xl" aria-hidden="true">
                💰
              </span>
              <p className="mt-2 text-sm font-medium text-leaf-600">
                Monthly revenue
              </p>
              <p className="mt-1 text-3xl font-extrabold text-leaf-700">
                {formatMXN(revenue.monthly)}
              </p>
            </div>
            <div
              className={`rounded-xl border border-red-100 bg-red-50 p-6 text-center ${
                billingPeriod === "annual" ? "ring-2 ring-leaf-500" : ""
              }`}
            >
              <span className="text-3xl" aria-hidden="true">
                📊
              </span>
              <p className="mt-2 text-sm font-medium text-red-700">
                Annual revenue
              </p>
              <p className="mt-1 text-3xl font-extrabold text-red-600">
                {formatMXN(revenue.annual)}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {summaryTiles.map((tile) => (
              <div
                key={tile.label}
                className="rounded-xl border border-leaf-100 bg-leaf-50 p-3 text-center"
              >
                <span className="text-xl" aria-hidden="true">
                  {tile.icon}
                </span>
                <p className="mt-1 text-sm font-extrabold text-leaf-800">
                  {tile.value}
                </p>
                <p className="text-xs text-leaf-600">{tile.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Key assumptions */}
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
              5
            </span>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
              <span aria-hidden="true">📐</span> Key assumptions
            </h2>
          </div>
          <p className="mt-2 text-sm text-leaf-600">
            These inputs are used to calculate the revenue.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr>
                  <th className="py-2 pr-4 font-medium text-leaf-600">
                    Assumption
                  </th>
                  {SCENARIOS.map((key) => (
                    <th
                      key={key}
                      className={`rounded-t-lg px-3 py-2 text-center font-semibold text-gray-800 ${SCENARIO_HEADER_BG[key]}`}
                    >
                      {SCENARIO_LABELS[key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLANS.map((plan) => (
                  <tr
                    key={plan.id}
                    className="border-b border-leaf-50 text-leaf-800"
                  >
                    <td className="py-2.5 pr-4">
                      Weekly price — {plan.name}
                    </td>
                    {SCENARIOS.map((key) => (
                      <td key={key} className="py-2.5 pr-4 text-center">
                        {formatWeekly(WEEKLY_PRICES[plan.id])}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-b border-leaf-50 text-leaf-800">
                  <td className="py-2.5 pr-4">Weeks per month</td>
                  {SCENARIOS.map((key) => (
                    <td key={key} className="py-2.5 pr-4 text-center">
                      {WEEKS_PER_MONTH}
                    </td>
                  ))}
                </tr>
                <tr className="text-leaf-800">
                  <td className="py-2.5 pr-4">Scenario multiplier</td>
                  {SCENARIOS.map((key) => (
                    <td key={key} className="py-2.5 pr-4 text-center">
                      {SCENARIO_MULTIPLIERS[key]}x
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs italic text-leaf-600">
            Prices, customer counts and multipliers are founder assumptions,
            anchored to the benchmarks below.
          </p>
        </div>

        {/* Section 6: Market benchmarks */}
        <div className="rounded-2xl border border-peach-100 bg-peach-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-peach-500 text-sm font-bold text-white">
              6
            </span>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-peach-700">
              <span aria-hidden="true">🇲🇽</span> Market benchmarks (Mexico)
            </h2>
          </div>
          <ul className="mt-4 space-y-4 text-sm text-peach-800">
            <li>
              <p className="font-semibold text-peach-700">
                Homemade healthy lunch
              </p>
              <p className="mt-1">
                $18 to $37 per day, about $25 on average (about $125 per
                week).
              </p>
              <p className="mt-1 text-xs text-peach-600">
                Source:{" "}
                <a
                  href="https://www.alcontacto.com.mx/2025/08/31/cuanto-cuesta-hoy-mandar-un-lunch-saludable-a-los-ninos-en-mexico/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline hover:text-peach-700"
                >
                  Al Contacto, Aug 2025 (Profeco and SNIIM data)
                </a>
              </p>
            </li>
            <li>
              <p className="font-semibold text-peach-700">
                Average family spend on school food and lunch
              </p>
              <p className="mt-1">
                About $1,500 per month per student (about $250 per week).
              </p>
              <p className="mt-1 text-xs text-peach-600">
                Source:{" "}
                <a
                  href="https://www.record.com.mx/historia/cuanto-cuesta-el-regreso-a-clases-esto-es-lo-que-gastan-las-familias-mexicanas-en-transporte-y-comida-2026081902365258129"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline hover:text-peach-700"
                >
                  ANPEC via Récord, Aug 2026
                </a>
              </p>
            </li>
            <li>
              <p className="font-semibold text-peach-700">
                Full-day kids meal delivery in CDMX (Manyar Plan Infantil)
              </p>
              <p className="mt-1">
                $380 per day, includes breakfast, lunch, dinner and 2 snacks,
                minimum 20 days.
              </p>
              <p className="mt-1 text-xs text-peach-600">
                Source:{" "}
                <a
                  href="https://www.manyar.com.mx/plan-infantil/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline hover:text-peach-700"
                >
                  manyar.com.mx/plan-infantil
                </a>
              </p>
            </li>
            <li>
              <p className="font-semibold text-peach-700">
                Direct competitor LunchyBox (CDMX)
              </p>
              <p className="mt-1">
                School lunch delivery to school or home, prices not
                published.
              </p>
              <p className="mt-1 text-xs text-peach-600">
                Source:{" "}
                <a
                  href="https://lunchybox.app/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline hover:text-peach-700"
                >
                  lunchybox.app
                </a>
              </p>
            </li>
          </ul>
          <p className="mt-4 text-xs text-peach-600">
            No public price was found for a lunch-only school delivery
            service.
          </p>
        </div>

        {/* Section 7 + 8: Save this scenario + Saved scenarios */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
                7
              </span>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
                <span aria-hidden="true">🔖</span> Save this scenario
              </h2>
            </div>
            <p className="mt-2 text-sm text-leaf-600">
              Keep a record of your inputs and results to compare different
              scenarios.
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(event) => setScenarioName(event.target.value)}
                  placeholder="Scenario name (e.g. Base case - CDMX)"
                  className="w-full rounded-lg border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-900 focus:border-leaf-500 focus:outline-none"
                />
                {nameError && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    Please enter a name for this scenario.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-peach-500 px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-peach-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save scenario"}
                </button>
                {saveMessage && (
                  <span
                    className={`text-sm font-medium ${
                      saveError ? "text-red-600" : "text-leaf-700"
                    }`}
                  >
                    {saveMessage}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
                  8
                </span>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
                  <span aria-hidden="true">📋</span> Saved scenarios
                </h2>
              </div>
              {!loadingSaved &&
                !loadError &&
                savedScenarios.length > SAVED_SCENARIOS_PREVIEW_COUNT && (
                  <button
                    type="button"
                    onClick={() => setShowAllSaved((prev) => !prev)}
                    className="text-sm font-semibold text-peach-600 transition-colors hover:text-peach-700"
                  >
                    {showAllSaved ? "Show less" : "View all →"}
                  </button>
                )}
            </div>
            <p className="mt-2 text-sm text-leaf-600">
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
                  <p className="text-sm text-red-600">{loadError}</p>
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
                visibleSavedScenarios.map((row) => (
                  <div
                    key={row.id}
                    className="flex items-center gap-3 rounded-xl border border-leaf-100 bg-white p-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-sm">
                      📄
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-leaf-800">
                        {row.name}
                      </p>
                      <p className="text-sm font-semibold text-leaf-700">
                        {formatMXN(row.monthly_revenue)}
                      </p>
                    </div>
                    <p className="shrink-0 text-xs text-leaf-600">
                      {new Date(row.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
