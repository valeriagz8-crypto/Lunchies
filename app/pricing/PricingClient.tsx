"use client";

import { useMemo, useState } from "react";
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

type CustomersByPlan = Record<PlanKey, number>;
type BillingPeriod = "monthly" | "annual";

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

export default function PricingClient() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [scenario, setScenario] = useState<ScenarioKey>("base");
  const [customers, setCustomers] = useState<CustomersByPlan>(
    DEFAULT_CUSTOMERS,
  );

  const revenue = useMemo(
    () => calculateRevenue(customers, scenario),
    [customers, scenario],
  );

  function updateCustomers(plan: PlanKey, value: number) {
    setCustomers((prev) => ({ ...prev, [plan]: clampCustomers(value) }));
  }

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
              🧮
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-peach-500">
              Pricing
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">
            Estimate your <span className="text-leaf-600">impact</span>.
          </h1>
          <p className="mt-4 max-w-md text-lg text-gray-600">
            Play with different scenarios and see the potential revenue for
            Lunchies.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <span className="text-6xl leading-none" aria-hidden="true">
            📊
          </span>
        </div>
      </div>

      <div className="mt-12 space-y-8">
        {/* Scenario + billing toggles */}
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
            <span aria-hidden="true">🎛️</span> Scenario
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-leaf-700">
                Billing period
              </p>
              <div className="mt-2 inline-flex rounded-full border border-leaf-200 bg-white p-1">
                {(["monthly", "annual"] as BillingPeriod[]).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setBillingPeriod(period)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors ${
                      billingPeriod === period
                        ? "bg-leaf-600 text-white"
                        : "text-leaf-700 hover:bg-leaf-50"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-leaf-700">
                Growth scenario
              </p>
              <div className="mt-2 inline-flex flex-wrap rounded-full border border-leaf-200 bg-white p-1">
                {SCENARIOS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setScenario(key)}
                    className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                      scenario === key
                        ? "bg-leaf-600 text-white"
                        : "text-leaf-700 hover:bg-leaf-50"
                    }`}
                  >
                    {SCENARIO_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customers per plan */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
            <span aria-hidden="true">👨‍👩‍👧</span> Customers per plan
          </h2>
          <div className="mt-5 space-y-6">
            {PLANS.map((plan) => (
              <div key={plan.id}>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`customers-${plan.id}`}
                    className="text-sm font-medium text-leaf-800"
                  >
                    {plan.name}{" "}
                    <span className="text-leaf-500">
                      ({formatWeekly(WEEKLY_PRICES[plan.id])})
                    </span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={MAX_CUSTOMERS}
                    value={customers[plan.id]}
                    onChange={(event) =>
                      updateCustomers(plan.id, Number(event.target.value))
                    }
                    className="w-20 rounded-lg border border-leaf-200 px-2 py-1 text-right text-sm text-leaf-800 focus:border-leaf-500 focus:outline-none"
                  />
                </div>
                <input
                  id={`customers-${plan.id}`}
                  type="range"
                  min={0}
                  max={MAX_CUSTOMERS}
                  value={customers[plan.id]}
                  onChange={(event) =>
                    updateCustomers(plan.id, Number(event.target.value))
                  }
                  className="mt-2 w-full accent-leaf-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Estimated revenue */}
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
            <span aria-hidden="true">💰</span> Estimated revenue
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div
              className={`rounded-2xl border bg-white p-6 text-center shadow-sm transition-colors ${
                billingPeriod === "monthly"
                  ? "border-leaf-500 ring-2 ring-leaf-200"
                  : "border-leaf-100"
              }`}
            >
              <p className="text-sm font-medium text-leaf-600">
                Monthly revenue
              </p>
              <p className="mt-2 text-3xl font-extrabold text-leaf-700">
                {formatMXN(revenue.monthly)}
              </p>
            </div>
            <div
              className={`rounded-2xl border bg-white p-6 text-center shadow-sm transition-colors ${
                billingPeriod === "annual"
                  ? "border-leaf-500 ring-2 ring-leaf-200"
                  : "border-leaf-100"
              }`}
            >
              <p className="text-sm font-medium text-leaf-600">
                Annual revenue
              </p>
              <p className="mt-2 text-3xl font-extrabold text-leaf-700">
                {formatMXN(revenue.annual)}
              </p>
            </div>
          </div>
        </div>

        {/* Key assumptions */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
            <span aria-hidden="true">📐</span> Key assumptions
          </h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-leaf-100 text-leaf-600">
                  <th className="py-2 pr-4 font-medium">Assumption</th>
                  {SCENARIOS.map((key) => (
                    <th
                      key={key}
                      className="py-2 pr-4 text-center font-medium"
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
        </div>
      </div>
    </section>
  );
}
