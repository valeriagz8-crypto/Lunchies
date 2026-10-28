/**
 * Pure A/B test math, kept free of React and Supabase so it can be unit
 * tested on its own.
 */

export type Variant = "A" | "B";

export type AbEventType = "view" | "click";

/** One row of the Supabase ab_events table. */
export type AbEvent = {
  test_name: string;
  variant: Variant;
  event_type: AbEventType;
};

export type VariantTotals = {
  views: number;
  clicks: number;
};

export type TestTotals = Record<Variant, VariantTotals>;

export const VARIANTS: Variant[] = ["A", "B"];

/**
 * Conversion rate as a percentage with one decimal.
 * Returns 0 when there are no views, so an empty test never divides by zero.
 */
export function calculateConversion(views: number, clicks: number): number {
  if (views <= 0) return 0;
  return Math.round((clicks / views) * 1000) / 10;
}

/**
 * Which variant is ahead, or null when it is too early to say: no clicks at
 * all, or both variants converting at the same rate.
 */
export function getLeader(a: VariantTotals, b: VariantTotals): Variant | null {
  if (a.clicks + b.clicks < 1) return null;

  const rateA = calculateConversion(a.views, a.clicks);
  const rateB = calculateConversion(b.views, b.clicks);
  if (rateA === rateB) return null;

  return rateA > rateB ? "A" : "B";
}

export function emptyTotals(): TestTotals {
  return {
    A: { views: 0, clicks: 0 },
    B: { views: 0, clicks: 0 },
  };
}

/** Counts raw ab_events rows into per-variant view and click totals. */
export function tallyEvents(events: AbEvent[]): TestTotals {
  const totals = emptyTotals();

  for (const event of events) {
    const variant = totals[event.variant];
    if (!variant) continue;

    if (event.event_type === "view") variant.views += 1;
    if (event.event_type === "click") variant.clicks += 1;
  }

  return totals;
}

export function hasAnyData(totals: TestTotals): boolean {
  return VARIANTS.some(
    (variant) => totals[variant].views > 0 || totals[variant].clicks > 0,
  );
}

/** localStorage key holding this browser's vote for one test. */
export function voteStorageKey(testName: string): string {
  return `lunchies.ab.${testName}`;
}
