import {
  SCENARIO_MULTIPLIERS,
  WEEKLY_PRICES,
  WEEKS_PER_MONTH,
  type PlanKey,
  type ScenarioKey,
} from "./pricingAssumptions";

export type CustomersByPlan = Record<PlanKey, number>;

export type RevenueResult = {
  monthly: number;
  annual: number;
};

export function calculateRevenue(
  customers: CustomersByPlan,
  scenario: ScenarioKey,
): RevenueResult {
  const weeklyRevenue =
    customers.basic * WEEKLY_PRICES.basic +
    customers.plus * WEEKLY_PRICES.plus +
    customers.premium * WEEKLY_PRICES.premium;

  const monthly =
    weeklyRevenue * WEEKS_PER_MONTH * SCENARIO_MULTIPLIERS[scenario];
  const annual = monthly * 12;

  return { monthly, annual };
}

export function formatMXN(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")} MXN`;
}
