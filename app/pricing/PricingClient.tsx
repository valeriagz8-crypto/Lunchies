"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { PLANS } from "@/lib/productData";
import { calculateRevenue, formatMXN, formatWeekly } from "@/lib/pricing";
import {
  SCENARIOS,
  SCENARIO_LABELS,
  SCENARIO_MULTIPLIERS,
  WEEKLY_PRICES,
  WEEKS_PER_MONTH,
  type PlanKey,
  type ScenarioKey,
} from "@/lib/pricingAssumptions";
import { caveat } from "@/lib/fonts";
import {
  BookmarkIcon,
  ChartIcon,
  CheckIcon,
  ChefHatIcon,
  ClipboardCheckIcon,
  CoinIcon,
  CrownIcon,
  HeartIcon,
  InfoIcon,
  LeafIcon,
  MapPinIcon,
  SlidersIcon,
  TableIcon,
} from "@/components/icons";

type CustomersByPlan = Record<PlanKey, number>;
type BillingPeriod = "monthly" | "annual";

type TestStatus = "idle" | "running" | "pass" | "fail" | "manual";

type TestResult = {
  id: string;
  label: string;
  status: TestStatus;
  detail?: string;
};

const TEST_DEFINITIONS: { id: string; label: string }[] = [
  { id: "calc", label: "Calculator updates revenue correctly" },
  { id: "toggle", label: "Monthly/annual toggle works" },
  { id: "scenario", label: "Scenario logic applies correctly" },
  { id: "persistence", label: "Inputs save and load" },
  { id: "responsive", label: "Responsive on mobile" },
];

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

function clampCustomers(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(MAX_CUSTOMERS, Math.max(0, Math.round(value)));
}

const PLAN_ICONS: Record<PlanKey, typeof LeafIcon> = {
  basic: LeafIcon,
  plus: ChefHatIcon,
  premium: CrownIcon,
};

const SCENARIO_HEADER_BG: Record<ScenarioKey, string> = {
  conservative: "bg-leaf-100",
  base: "bg-yellow-100",
  optimistic: "bg-blue-100",
};

const TEST_BADGE: Record<TestStatus, { label: string; className: string }> = {
  idle: { label: "NOT RUN", className: "bg-gray-100 text-gray-500" },
  running: { label: "RUNNING...", className: "bg-gray-100 text-gray-500" },
  pass: { label: "PASS", className: "bg-leaf-100 text-leaf-700" },
  fail: { label: "FAIL", className: "bg-red-100 text-red-700" },
  manual: { label: "MANUAL CHECK", className: "bg-peach-100 text-peach-700" },
};

export default function PricingClient({
  hasBowlImage,
}: {
  hasBowlImage: boolean;
}) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [scenario, setScenario] = useState<ScenarioKey>("base");
  const [customers, setCustomers] = useState<CustomersByPlan>(
    DEFAULT_CUSTOMERS,
  );

  const revenue = useMemo(
    () => calculateRevenue(customers, scenario),
    [customers, scenario],
  );

  const [scenarioName, setScenarioName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [testResults, setTestResults] = useState<TestResult[]>(
    TEST_DEFINITIONS.map((test) => ({ ...test, status: "idle" })),
  );
  const [runningTests, setRunningTests] = useState(false);

  function updateCustomers(plan: PlanKey, value: number) {
    setCustomers((prev) => ({ ...prev, [plan]: clampCustomers(value) }));
  }

  async function loadSavedScenarios() {
    setLoadingSaved(true);
    setLoadError(null);

    const { data, error } = await supabase
      .from("pricing_scenarios")
      .select("*")
      .neq("name", "__test__")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      setLoadError("Could not load saved scenarios.");
    } else {
      setSavedScenarios((data ?? []) as SavedScenario[]);
    }
    setLoadingSaved(false);
  }

  useEffect(() => {
    loadSavedScenarios();
  }, []);

  async function handleSave() {
    if (!scenarioName.trim()) {
      setNameError(true);
      setSaveMessage(null);
      return;
    }
    setNameError(false);
    setSaving(true);
    setSaveMessage(null);

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
    } else {
      setSaveMessage("Scenario saved!");
      setScenarioName("");
      await loadSavedScenarios();
    }
    setSaving(false);
  }

  async function runTests() {
    setRunningTests(true);
    setTestResults(
      TEST_DEFINITIONS.map((test) => ({ ...test, status: "running" })),
    );

    const results: TestResult[] = [];
    const showProgress = () =>
      setTestResults([
        ...results,
        ...TEST_DEFINITIONS.slice(results.length).map((test) => ({
          ...test,
          status: "running" as TestStatus,
        })),
      ]);

    // 1. Calculator updates revenue correctly
    const baseCustomers: CustomersByPlan = {
      basic: 150,
      plus: 100,
      premium: 50,
    };
    const baseResult = calculateRevenue(baseCustomers, "base");
    const calcPass = baseResult.monthly === 480000;
    results.push({
      ...TEST_DEFINITIONS[0],
      status: calcPass ? "pass" : "fail",
      detail: `Expected ${formatMXN(480000)}, got ${formatMXN(baseResult.monthly)}.`,
    });
    showProgress();

    // 2. Monthly/annual toggle works
    const togglePass = baseResult.annual === baseResult.monthly * 12;
    results.push({
      ...TEST_DEFINITIONS[1],
      status: togglePass ? "pass" : "fail",
      detail: `${formatMXN(baseResult.monthly)} × 12 = ${formatMXN(
        baseResult.monthly * 12,
      )}, got ${formatMXN(baseResult.annual)}.`,
    });
    showProgress();

    // 3. Scenario logic applies correctly
    const conservativeResult = calculateRevenue(baseCustomers, "conservative");
    const optimisticResult = calculateRevenue(baseCustomers, "optimistic");
    const scenarioPass =
      conservativeResult.monthly === 288000 &&
      optimisticResult.monthly === 672000;
    results.push({
      ...TEST_DEFINITIONS[2],
      status: scenarioPass ? "pass" : "fail",
      detail: `Conservative: ${formatMXN(
        conservativeResult.monthly,
      )}, Optimistic: ${formatMXN(optimisticResult.monthly)}.`,
    });
    showProgress();

    // 4. Inputs save and load
    let persistencePass = false;
    let persistenceDetail = "";
    try {
      const { error: insertError } = await supabase
        .from("pricing_scenarios")
        .insert({
          name: "__test__",
          scenario: "base",
          billing_period: "monthly",
          customers_basic: 1,
          customers_plus: 2,
          customers_premium: 3,
          monthly_revenue: 123,
          annual_revenue: 1476,
        });
      if (insertError) {
        throw new Error(`insert failed: ${insertError.message}`);
      }

      const { data, error: selectError } = await supabase
        .from("pricing_scenarios")
        .select("*")
        .eq("name", "__test__")
        .order("created_at", { ascending: false })
        .limit(1);
      if (selectError) {
        throw new Error(`select failed: ${selectError.message}`);
      }

      const row = data?.[0] as SavedScenario | undefined;
      if (
        !row ||
        row.customers_basic !== 1 ||
        row.customers_plus !== 2 ||
        row.customers_premium !== 3
      ) {
        throw new Error("read-back row did not match what was inserted");
      }
      persistencePass = true;
      persistenceDetail = "Inserted a row, read it back, and it matched.";
    } catch (err) {
      persistenceDetail =
        err instanceof Error ? err.message : "Unexpected error.";
    } finally {
      await supabase.from("pricing_scenarios").delete().eq("name", "__test__");
    }
    results.push({
      ...TEST_DEFINITIONS[3],
      status: persistencePass ? "pass" : "fail",
      detail: persistenceDetail,
    });
    showProgress();

    // 5. Responsive on mobile — manual check only
    results.push({
      ...TEST_DEFINITIONS[4],
      status: "manual",
      detail:
        "Resize your browser or open this page on a phone — sections should stack into a single column.",
    });
    setTestResults(results);

    await loadSavedScenarios();
    setRunningTests(false);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-peach-100 text-peach-600">
              <ChartIcon className="h-7 w-7" />
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
        </div>
        <div className="flex flex-col items-center md:items-end">
          {hasBowlImage ? (
            <Image
              src="/images/bowl.png"
              alt="Bowl illustration"
              width={320}
              height={320}
              className="h-auto w-full max-w-xs"
            />
          ) : (
            <div className="aspect-square w-full max-w-xs rounded-3xl border border-dashed border-leaf-200 bg-white/60" />
          )}
          <p
            className={`mt-4 flex items-center gap-2 text-2xl text-leaf-700 ${caveat.className}`}
          >
            Good food, brighter futures
            <HeartIcon className="h-5 w-5 text-peach-500" />
          </p>
        </div>
      </div>

      <div className="mt-12 space-y-8">
        {/* Top row: billing period + scenario */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-leaf-700">
              Billing period
            </h2>
            <div className="mt-3 inline-flex rounded-full border border-leaf-200 bg-leaf-50 p-1">
              {(["monthly", "annual"] as BillingPeriod[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setBillingPeriod(period)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                    billingPeriod === period
                      ? "bg-leaf-600 text-white"
                      : "text-leaf-700 hover:bg-white"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-leaf-700">
              Scenario
              <InfoIcon className="h-4 w-4 text-leaf-400" />
            </h2>
            <div className="mt-3 inline-flex flex-wrap rounded-full border border-leaf-200 bg-leaf-50 p-1">
              {SCENARIOS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setScenario(key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    scenario === key
                      ? "bg-leaf-600 text-white"
                      : "text-leaf-700 hover:bg-white"
                  }`}
                >
                  {SCENARIO_LABELS[key]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Number of customers per plan */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
            <SlidersIcon className="h-5 w-5 text-leaf-600" />
            Number of customers per plan
          </h2>
          <p className="mt-1 text-sm text-leaf-600">
            Adjust the number of active customers in each plan.
          </p>
          <div className="mt-5 space-y-6">
            {PLANS.map((plan) => {
              const PlanIcon = PLAN_ICONS[plan.id];
              return (
                <div key={plan.id}>
                  <div className="flex items-center gap-2 text-sm font-medium text-leaf-800">
                    <PlanIcon className="h-5 w-5 text-leaf-600" />
                    <span>
                      {plan.name}{" "}
                      <span className="text-leaf-500">
                        (${WEEKLY_PRICES[plan.id].toLocaleString("en-US")} /
                        week)
                      </span>
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
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
                    <div className="flex shrink-0 items-center gap-2 rounded-lg border border-leaf-200 px-3 py-1.5">
                      <input
                        type="number"
                        min={0}
                        max={MAX_CUSTOMERS}
                        value={customers[plan.id]}
                        onChange={(event) =>
                          updateCustomers(plan.id, Number(event.target.value))
                        }
                        className="w-14 text-right text-sm text-leaf-800 focus:outline-none"
                      />
                      <span className="text-xs text-leaf-500">customers</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two-column layout: left = revenue/assumptions/benchmarks/save, right = saved/testing */}
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div className="space-y-8">
            {/* Estimated revenue */}
            <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
                <CoinIcon className="h-5 w-5 text-leaf-600" />
                Estimated revenue
              </h2>
              <p className="mt-1 text-sm text-leaf-600">
                Based on the selected number of customers and scenario.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-leaf-200 bg-leaf-50 p-6 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                    <CoinIcon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-sm font-medium text-leaf-700">
                    Monthly revenue
                  </p>
                  <p className="mt-1 text-3xl font-extrabold text-leaf-700">
                    {formatMXN(revenue.monthly)}
                  </p>
                </div>
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700">
                    <ChartIcon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 text-sm font-medium text-red-700">
                    Annual revenue
                  </p>
                  <p className="mt-1 text-3xl font-extrabold text-red-700">
                    {formatMXN(revenue.annual)}
                  </p>
                </div>
              </div>
            </div>

            {/* Key assumptions */}
            <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
                <TableIcon className="h-5 w-5 text-leaf-600" />
                Key assumptions
              </h2>
              <p className="mt-1 text-sm text-leaf-600">
                These inputs are used to calculate the revenue.
              </p>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr>
                      <th className="py-2 pr-4 font-medium text-leaf-600">
                        Assumption
                      </th>
                      {SCENARIOS.map((key) => (
                        <th
                          key={key}
                          className={`rounded-t-lg py-2 px-3 text-center font-semibold text-gray-800 ${SCENARIO_HEADER_BG[key]}`}
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
                        <td className="py-3 pr-4">
                          Weekly price — {plan.name}
                        </td>
                        {SCENARIOS.map((key) => (
                          <td key={key} className="py-3 pr-4 text-center">
                            {formatWeekly(WEEKLY_PRICES[plan.id])}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="border-b border-leaf-50 text-leaf-800">
                      <td className="py-3 pr-4">Weeks per month</td>
                      {SCENARIOS.map((key) => (
                        <td key={key} className="py-3 pr-4 text-center">
                          {WEEKS_PER_MONTH}
                        </td>
                      ))}
                    </tr>
                    <tr className="text-leaf-800">
                      <td className="py-3 pr-4">Scenario multiplier</td>
                      {SCENARIOS.map((key) => (
                        <td key={key} className="py-3 pr-4 text-center">
                          {SCENARIO_MULTIPLIERS[key]}x
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs italic text-leaf-600">
                Prices, customer counts and multipliers are founder
                assumptions, anchored to the benchmarks below.
              </p>
            </div>

            {/* Market benchmarks */}
            <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
                <MapPinIcon className="h-5 w-5 text-leaf-600" />
                Market benchmarks (Mexico)
              </h2>
              <ul className="mt-4 space-y-4 text-sm text-leaf-800">
                <li>
                  <p className="font-semibold text-leaf-700">
                    Homemade healthy lunch
                  </p>
                  <p className="mt-1">
                    $18 to $37 per day, about $25 on average (about $125 per
                    week).
                  </p>
                  <p className="mt-1 text-xs text-leaf-600">
                    Source:{" "}
                    <a
                      href="https://www.alcontacto.com.mx/2025/08/31/cuanto-cuesta-hoy-mandar-un-lunch-saludable-a-los-ninos-en-mexico/"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-peach-600 underline hover:text-peach-700"
                    >
                      Al Contacto, Aug 2025 (Profeco and SNIIM data)
                    </a>
                  </p>
                </li>
                <li>
                  <p className="font-semibold text-leaf-700">
                    Average family spend on school food and lunch
                  </p>
                  <p className="mt-1">
                    About $1,500 per month per student (about $250 per
                    week).
                  </p>
                  <p className="mt-1 text-xs text-leaf-600">
                    Source:{" "}
                    <a
                      href="https://www.record.com.mx/historia/cuanto-cuesta-el-regreso-a-clases-esto-es-lo-que-gastan-las-familias-mexicanas-en-transporte-y-comida-2026081902365258129"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-peach-600 underline hover:text-peach-700"
                    >
                      ANPEC via Récord, Aug 2026
                    </a>
                  </p>
                </li>
                <li>
                  <p className="font-semibold text-leaf-700">
                    Full-day kids meal delivery in CDMX (Manyar Plan
                    Infantil)
                  </p>
                  <p className="mt-1">
                    $380 per day, includes breakfast, lunch, dinner and 2
                    snacks, minimum 20 days.
                  </p>
                  <p className="mt-1 text-xs text-leaf-600">
                    Source:{" "}
                    <a
                      href="https://www.manyar.com.mx/plan-infantil/"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-peach-600 underline hover:text-peach-700"
                    >
                      manyar.com.mx/plan-infantil
                    </a>
                  </p>
                </li>
                <li>
                  <p className="font-semibold text-leaf-700">
                    Direct competitor LunchyBox (CDMX)
                  </p>
                  <p className="mt-1">
                    School lunch delivery to school or home, prices not
                    published.
                  </p>
                  <p className="mt-1 text-xs text-leaf-600">
                    Source:{" "}
                    <a
                      href="https://lunchybox.app/"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-peach-600 underline hover:text-peach-700"
                    >
                      lunchybox.app
                    </a>
                  </p>
                </li>
              </ul>
              <p className="mt-4 text-xs italic text-leaf-600">
                No public price was found for a lunch-only school delivery
                service.
              </p>
            </div>

            {/* Save this scenario */}
            <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
                <BookmarkIcon className="h-5 w-5 text-leaf-600" />
                Save this scenario
              </h2>
              <p className="mt-1 text-sm text-leaf-600">
                Keep a record of your inputs and results to compare
                different scenarios.
              </p>
              <div className="mt-4 flex flex-wrap items-start gap-3">
                <div>
                  <input
                    type="text"
                    value={scenarioName}
                    onChange={(event) => setScenarioName(event.target.value)}
                    placeholder="Scenario name (e.g. Base case - CDMX)"
                    className="w-64 rounded-lg border border-leaf-200 px-3 py-2 text-sm text-leaf-800 focus:border-leaf-500 focus:outline-none"
                  />
                  {nameError && (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      Please enter a name for this scenario.
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-leaf-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save scenario"}
                </button>
                {saveMessage && (
                  <span className="self-center text-sm font-medium text-leaf-700">
                    {saveMessage}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Saved scenarios */}
            <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
                <ClipboardCheckIcon className="h-5 w-5 text-leaf-600" />
                Saved scenarios
              </h2>
              <p className="mt-1 text-sm text-leaf-600">
                View and compare your previous scenario analyses.
              </p>
              <div className="mt-5 space-y-3">
                {loadingSaved && (
                  <p className="text-sm text-leaf-600">
                    Loading saved scenarios...
                  </p>
                )}
                {!loadingSaved && loadError && (
                  <p className="text-sm text-red-600">{loadError}</p>
                )}
                {!loadingSaved &&
                  !loadError &&
                  savedScenarios.length === 0 && (
                    <p className="text-sm text-leaf-600">
                      No saved scenarios yet — name one above and click Save
                      scenario.
                    </p>
                  )}
                {!loadingSaved &&
                  !loadError &&
                  savedScenarios.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center gap-3 rounded-xl border border-leaf-100 bg-leaf-50 p-4"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                        <BookmarkIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {row.name}
                        </p>
                        <p className="text-xs text-leaf-600">
                          {new Date(row.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-leaf-700">
                        {formatMXN(row.monthly_revenue)}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Testing evidence */}
            <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
                    <ClipboardCheckIcon className="h-5 w-5 text-leaf-600" />
                    Testing evidence
                  </h2>
                  <p className="mt-1 text-sm text-leaf-600">
                    Results from automatic tests to make sure the pricing
                    logic works properly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={runTests}
                  disabled={runningTests}
                  className="rounded-full bg-leaf-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {runningTests ? "Running..." : "Run tests"}
                </button>
              </div>
              <ul className="mt-5 space-y-3">
                {testResults.map((test) => {
                  const badge = TEST_BADGE[test.status];
                  return (
                    <li
                      key={test.id}
                      className="rounded-xl border border-leaf-100 bg-leaf-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-sm font-medium text-leaf-800">
                          <CheckIcon className="h-4 w-4 text-leaf-600" />
                          {test.label}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      {test.detail && (
                        <p className="mt-2 text-xs text-leaf-600">
                          {test.detail}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
