"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  AB_TESTER_COPY,
  AB_TEST_NAMES,
  LANDING_COPY,
  type AbTest,
  type AbTestName,
} from "@/lib/marketingData";
import {
  VARIANTS,
  calculateConversion,
  emptyTotals,
  getLeader,
  hasAnyData,
  tallyEvents,
  voteStorageKey,
  type AbEvent,
  type TestTotals,
  type Variant,
} from "@/lib/abTest";

/**
 * Views are recorded once per page load. Switching tabs remounts the panel,
 * so the guard lives outside the component.
 */
const viewedTests = new Set<AbTestName>();

/**
 * A blocked request (ad blocker, blocked domain) stalls instead of failing,
 * so every Supabase call gets a hard cap rather than spinning forever.
 */
const REQUEST_TIMEOUT_MS = 8000;

const TIMED_OUT = Symbol("timed-out");

async function withTimeout<T>(
  work: PromiseLike<T>,
  budgetMs: number = REQUEST_TIMEOUT_MS,
): Promise<T | typeof TIMED_OUT> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const expiry = new Promise<typeof TIMED_OUT>((resolve) => {
    timer = setTimeout(() => resolve(TIMED_OUT), Math.max(budgetMs, 1000));
  });

  try {
    return await Promise.race([work, expiry]);
  } finally {
    clearTimeout(timer);
  }
}

const VARIANT_STYLE: Record<
  Variant,
  { card: string; badge: string; bar: string; button: string }
> = {
  A: {
    card: "border-leaf-100 bg-leaf-50",
    badge: "bg-leaf-600",
    bar: "bg-leaf-500",
    button: "bg-leaf-600 hover:bg-leaf-700",
  },
  B: {
    card: "border-peach-100 bg-peach-50",
    badge: "bg-peach-500",
    bar: "bg-peach-400",
    button: "bg-peach-500 hover:bg-peach-600",
  },
};

function readStoredVote(testName: AbTestName): Variant | null {
  try {
    const stored = window.localStorage.getItem(voteStorageKey(testName));
    return stored === "A" || stored === "B" ? stored : null;
  } catch {
    // localStorage can be unavailable (private mode, blocked cookies).
    return null;
  }
}

function storeVote(testName: AbTestName, variant: Variant) {
  try {
    window.localStorage.setItem(voteStorageKey(testName), variant);
  } catch {
    // Voting still works for this page load, it just is not remembered.
  }
}

function ResultsTable({ totals }: { totals: TestTotals }) {
  return (
    <div className="space-y-3">
      {VARIANTS.map((variant) => {
        const { views, clicks } = totals[variant];
        const rate = calculateConversion(views, clicks);
        const style = VARIANT_STYLE[variant];
        return (
          <div
            key={variant}
            className="rounded-xl border border-leaf-100 bg-white p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${style.badge}`}
              >
                {variant}
              </span>
              <dl className="flex flex-1 flex-wrap items-baseline justify-end gap-x-5 gap-y-1 text-sm">
                <div className="flex items-baseline gap-1.5">
                  <dt className="text-xs text-leaf-500">Views</dt>
                  <dd className="font-semibold text-leaf-800">{views}</dd>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <dt className="text-xs text-leaf-500">Clicks</dt>
                  <dd className="font-semibold text-leaf-800">{clicks}</dd>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <dt className="text-xs text-leaf-500">Conversion</dt>
                  <dd className="font-bold text-leaf-800">
                    {rate.toFixed(1)}%
                  </dd>
                </div>
              </dl>
            </div>
            <div
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-leaf-100"
              role="img"
              aria-label={`Variant ${variant} conversion ${rate.toFixed(1)} percent`}
            >
              <div
                className={`h-full rounded-full ${style.bar}`}
                style={{ width: `${Math.min(rate, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AbTestPanel({
  testName,
  test,
  asButton = false,
}: {
  testName: AbTestName;
  test: AbTest;
  asButton?: boolean;
}) {
  const [totals, setTotals] = useState<TestTotals>(emptyTotals());
  const [voted, setVoted] = useState<Variant | null>(null);
  const [justVoted, setJustVoted] = useState(false);
  // A timed-out vote may or may not have landed, so it is never "confirmed".
  const [voteConfirmed, setVoteConfirmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const startedRef = useRef(false);

  const loadResults = useCallback(async (budgetMs?: number) => {
    const response = await withTimeout(
      supabase
        .from("ab_events")
        .select("test_name, variant, event_type")
        .eq("test_name", testName),
      budgetMs,
    );

    if (response === TIMED_OUT) {
      console.error(`ab_events load timed out (${testName})`);
      setError(AB_TESTER_COPY.timeout);
      setErrorDetail(null);
      return;
    }

    const { data, error: loadError } = response;

    if (loadError) {
      console.error(`ab_events load error (${testName}):`, loadError);
      setError(AB_TESTER_COPY.error);
      setErrorDetail(loadError.message);
      return;
    }

    setError(null);
    setErrorDetail(null);
    setTotals(tallyEvents((data ?? []) as AbEvent[]));
  }, [testName]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const stored = readStoredVote(testName);
    setVoted(stored);
    setVoteConfirmed(true);

    async function start() {
      const startedAt = Date.now();

      if (!viewedTests.has(testName)) {
        viewedTests.add(testName);

        const views = VARIANTS.map((variant) => ({
          test_name: testName,
          variant,
          event_type: "view" as const,
        }));

        const response = await withTimeout(
          supabase.from("ab_events").insert(views),
        );

        // A failed or slow view insert should not stop the results loading.
        if (response === TIMED_OUT) {
          console.error(`ab_events view insert timed out (${testName})`);
          viewedTests.delete(testName);
        } else if (response.error) {
          console.error(
            `ab_events view insert error (${testName}):`,
            response.error,
          );
          viewedTests.delete(testName);
        }
      }

      // The insert and the load share one budget, so a stalled connection
      // surfaces in about REQUEST_TIMEOUT_MS instead of twice that.
      await loadResults(REQUEST_TIMEOUT_MS - (Date.now() - startedAt));
      setLoading(false);
    }

    void start();
  }, [testName, loadResults]);

  async function handleVote(variant: Variant) {
    if (voted) return;

    // Optimistic lock so a double click cannot send two votes.
    setVoted(variant);

    const response = await withTimeout(
      supabase.from("ab_events").insert({
        test_name: testName,
        variant,
        event_type: "click",
      }),
    );

    if (response === TIMED_OUT) {
      // The insert may still land, so the buttons stay locked and the vote is
      // not remembered. Saying "thanks" here would be claiming more than we
      // know.
      console.error(`ab_events click insert timed out (${testName})`);
      setVoteConfirmed(false);
      setError(AB_TESTER_COPY.voteTimeout);
      setErrorDetail(null);
      return;
    }

    const { error: voteError } = response;

    if (voteError) {
      console.error(`ab_events click insert error (${testName}):`, voteError);
      setVoted(null);
      setError(AB_TESTER_COPY.voteError);
      setErrorDetail(voteError.message);
      return;
    }

    storeVote(testName, variant);
    setVoteConfirmed(true);
    setJustVoted(true);
    await loadResults();
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadResults();
    setRefreshing(false);
  }

  const leader = getLeader(totals.A, totals.B);
  const showData = hasAnyData(totals);

  return (
    <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-poppins text-base font-semibold text-leaf-700">
          {test.element}
        </h3>
        <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-600">
          {testName}
        </span>
      </div>
      <p className="mt-2 text-sm text-leaf-600">{test.hypothesis}</p>

      <p className="font-poppins mt-5 text-center text-base font-semibold text-leaf-800">
        {AB_TESTER_COPY.question}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {test.variants.map((variant) => {
          const style = VARIANT_STYLE[variant.id];
          const isChosen = voted === variant.id && voteConfirmed;
          return (
            <div
              key={variant.id}
              className={`flex flex-col rounded-2xl border p-5 shadow-sm ${style.card} ${
                isChosen ? "ring-2 ring-leaf-500" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${style.badge}`}
                >
                  {variant.id}
                </span>
                {isChosen && (
                  <span className="text-xs font-semibold text-leaf-700">
                    {AB_TESTER_COPY.thanks}
                  </span>
                )}
              </div>

              {asButton ? (
                <p className="mt-4">
                  <span
                    className={`inline-block rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm ${style.button}`}
                  >
                    {variant.text}
                  </span>
                </p>
              ) : (
                <p className="font-poppins mt-3 text-xl font-bold text-leaf-800">
                  {variant.text}
                </p>
              )}

              <p className="mt-2 flex-1 text-xs text-leaf-600">
                {variant.rationale}
              </p>

              <button
                type="button"
                onClick={() => handleVote(variant.id)}
                disabled={voted !== null}
                aria-label={`Vote for variant ${variant.id}: ${variant.text}`}
                className={`mt-4 rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors ${
                  voted !== null
                    ? "cursor-not-allowed bg-gray-300"
                    : style.button
                }`}
              >
                {isChosen
                  ? AB_TESTER_COPY.yourPick
                  : `${AB_TESTER_COPY.pick} ${variant.id}`}
              </button>
            </div>
          );
        })}
      </div>

      {voted && voteConfirmed && (
        <p className="mt-4 rounded-xl border border-leaf-100 bg-leaf-50 px-4 py-3 text-center text-sm font-medium text-leaf-700">
          <span aria-hidden="true">✅</span> {AB_TESTER_COPY.thanks}.{" "}
          <span className="font-normal text-leaf-600">
            {justVoted ? AB_TESTER_COPY.privacyNote : AB_TESTER_COPY.alreadyVoted}
          </span>
        </p>
      )}

      <div className="mt-6 border-t border-leaf-100 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-poppins text-sm font-semibold text-leaf-700">
            Results
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="rounded-full border border-leaf-200 px-4 py-2 text-xs font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? AB_TESTER_COPY.refreshing : AB_TESTER_COPY.refresh}
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-peach-200 bg-peach-50 p-4">
            <p className="text-sm font-medium text-peach-800">
              <span aria-hidden="true">⚠️</span> {error}
            </p>
            {errorDetail && (
              <p className="mt-1 break-words text-xs text-peach-700">
                {errorDetail}
              </p>
            )}
          </div>
        ) : loading ? (
          <p className="mt-4 text-sm text-leaf-600">
            {AB_TESTER_COPY.loading}
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            <ResultsTable totals={totals} />
            <p className="text-sm text-leaf-700">
              {!showData ? (
                <span className="text-leaf-600">{AB_TESTER_COPY.noData}</span>
              ) : leader ? (
                <>
                  <span className="font-semibold">Variant {leader}</span>{" "}
                  {AB_TESTER_COPY.leading}
                </>
              ) : (
                <span className="text-leaf-600">
                  {AB_TESTER_COPY.tooEarly}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AbTester() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-leaf-700">{AB_TESTER_COPY.intro}</p>
      <AbTestPanel
        testName={AB_TEST_NAMES.headline}
        test={LANDING_COPY.headlineTest}
      />
      <AbTestPanel
        testName={AB_TEST_NAMES.button}
        test={LANDING_COPY.buttonTest}
        asButton
      />
    </div>
  );
}
