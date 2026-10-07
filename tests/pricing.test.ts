import { describe, expect, it } from "vitest";
import { calculateRevenue, validateScenarioName } from "@/lib/pricing";
import type { CustomersByPlan } from "@/lib/pricing";

const DEFAULT_TEST_CUSTOMERS: CustomersByPlan = {
  basic: 150,
  plus: 100,
  premium: 50,
};

describe("pricing logic", () => {
  it("Pricing logic 1: base scenario with 150/100/50 customers gives 480000 monthly and 5760000 annual", () => {
    const result = calculateRevenue(DEFAULT_TEST_CUSTOMERS, "base");
    expect(result.monthly).toBe(480000);
    expect(result.annual).toBe(5760000);
  });

  it("Pricing logic 2: conservative gives 288000 monthly and optimistic gives 672000 monthly with 150/100/50", () => {
    const conservative = calculateRevenue(
      DEFAULT_TEST_CUSTOMERS,
      "conservative",
    );
    const optimistic = calculateRevenue(DEFAULT_TEST_CUSTOMERS, "optimistic");
    expect(conservative.monthly).toBe(288000);
    expect(optimistic.monthly).toBe(672000);
  });
});

describe("software", () => {
  it("Software 1: a scenario can be saved to Supabase and loaded back", async () => {
    const { supabase } = await import("@/lib/supabase");

    const payload = {
      name: "__test__",
      scenario: "base",
      billing_period: "monthly",
      customers_basic: 1,
      customers_plus: 2,
      customers_premium: 3,
      monthly_revenue: 123,
      annual_revenue: 1476,
    };

    try {
      const insertResult = await supabase
        .from("pricing_scenarios")
        .insert(payload);
      expect(insertResult.error).toBeNull();

      const selectResult = await supabase
        .from("pricing_scenarios")
        .select("*")
        .eq("name", "__test__")
        .order("created_at", { ascending: false })
        .limit(1);
      expect(selectResult.error).toBeNull();

      const row = selectResult.data?.[0];
      expect(row).toBeDefined();
      expect(row?.customers_basic).toBe(1);
      expect(row?.customers_plus).toBe(2);
      expect(row?.customers_premium).toBe(3);
    } finally {
      await supabase.from("pricing_scenarios").delete().eq("name", "__test__");
    }
  });

  it("Software 2: an empty scenario name is rejected", () => {
    expect(validateScenarioName("")).toBe(false);
    expect(validateScenarioName("   ")).toBe(false);
    expect(validateScenarioName("Base case - CDMX")).toBe(true);
  });

  it("Software 3: annual revenue equals monthly revenue times 12 in all three scenarios, and zero customers gives zero", () => {
    const scenarios = ["conservative", "base", "optimistic"] as const;
    for (const scenario of scenarios) {
      const result = calculateRevenue(DEFAULT_TEST_CUSTOMERS, scenario);
      expect(result.annual).toBe(result.monthly * 12);
    }

    const zeroCustomers: CustomersByPlan = { basic: 0, plus: 0, premium: 0 };
    const zero = calculateRevenue(zeroCustomers, "base");
    expect(zero.monthly).toBe(0);
    expect(zero.annual).toBe(0);
  });

  it("Software 4: revenue values are whole pesos with no decimals (optimistic with 272/269/277 gives 2065560 monthly and 24786720 annual)", () => {
    const customers: CustomersByPlan = { basic: 272, plus: 269, premium: 277 };
    const result = calculateRevenue(customers, "optimistic");
    expect(result.monthly).toBe(2065560);
    expect(result.annual).toBe(24786720);
    expect(Number.isInteger(result.monthly)).toBe(true);
    expect(Number.isInteger(result.annual)).toBe(true);
  });
});
