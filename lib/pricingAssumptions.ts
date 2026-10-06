export type PlanKey = "basic" | "plus" | "premium";
export type ScenarioKey = "conservative" | "base" | "optimistic";

export const WEEKLY_PRICES: Record<PlanKey, number> = {
  basic: 400,
  plus: 600,
  premium: 800,
};

export const WEEKS_PER_MONTH = 4;

export const SCENARIOS: ScenarioKey[] = ["conservative", "base", "optimistic"];

export const SCENARIO_LABELS: Record<ScenarioKey, string> = {
  conservative: "Conservative",
  base: "Base",
  optimistic: "Optimistic",
};

export const SCENARIO_MULTIPLIERS: Record<ScenarioKey, number> = {
  conservative: 0.6,
  base: 1.0,
  optimistic: 1.4,
};
