"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { REQUEST_TIMEOUT_MS, TIMED_OUT, withTimeout } from "@/lib/requestTimeout";
import {
  AB_TESTER_COPY,
  LANDING_COPY,
  type AbTest,
  type AbTestName,
} from "@/lib/marketingData";
import { CARD_MOTION, SECTION_THEME, riseDelay } from "@/components/marketing/theme";
import { Photo, SectionPanel, StickyNote } from "@/components/marketing/pieces";
import { IMAGES } from "@/lib/marketingImages";
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

const VARIANT_PHOTO: Record<string, (typeof IMAGES)[keyof typeof IMAGES]> = {
  "priority-A": IMAGES.freshProduce,
  "priority-B": IMAGES.lunchboxSandwichFruit,
  "time-A": IMAGES.lunchboxRiceVeggies,
  "time-B": IMAGES.bentoTray,
};

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

/** Conversion as a ring, so an empty test reads as an empty ring. */
function Ring({ percent, color }: { percent: number; color: string }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${color} ${percent * 3.6}deg, #e0f3e5 0deg)`,
      }}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[11px] font-bold text-leaf-800">
        {percent.toFixed(0)}%
      </span>
    </span>
  );
}

function ResultsTable({ totals }: { totals: TestTotals }) {
  const ringColor: Record<string, string> = { A: "#2f7d49", B: "#ec6410" };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {VARIANTS.map((variant) => {
        const { views, clicks } = totals[variant];
        const rate = calculateConversion(views, clicks);
        const style = VARIANT_STYLE[variant];
        return (
          <div
            key={variant}
            className="rounded-2xl border border-leaf-100 bg-white p-4"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <Ring percent={rate} color={ringColor[variant]} />
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

function AbTestPanel({ test }: { test: AbTest }) {
  const testName = test.testName;
  const sourceHost = test.source.url.replace(/^https?:\/\//, "").split("/")[0];
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
    <div
      className={`rounded-3xl border border-leaf-100 bg-white p-6 shadow-sm ${CARD_MOTION}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-poppins text-base font-semibold text-leaf-700">
          {test.element}
        </h3>
        <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-600">
          {testName}
        </span>
      </div>
      <div className="mt-4">
        <StickyNote tone="mint" className="text-lg sm:text-xl">
          {test.hypothesis}
        </StickyNote>

        {/* The research sits quietly under the hypothesis, one line only.
            test.note stays in the data and in the export, just not here. */}
        <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-gray-500">
          <BookOpen
            className="mt-0.5 h-3.5 w-3.5 shrink-0"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span className="min-w-0">
            {test.source.text}{" "}
            <a
              href={test.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap font-medium text-gray-600 underline underline-offset-2 transition-colors hover:text-peach-600"
            >
              {sourceHost}
            </a>
          </span>
        </p>
      </div>

      <p className="font-poppins mt-5 text-center text-base font-semibold text-leaf-800">
        {test.question}
      </p>

      <div className="relative mt-4 grid gap-4 sm:grid-cols-2">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-leaf-700 font-poppins text-xs font-extrabold text-white shadow-md sm:flex"
        >
          VS
        </span>
        {test.variants.map((variant) => {
          const style = VARIANT_STYLE[variant.id];
          const isChosen = voted === variant.id && voteConfirmed;
          return (
            <div
              key={variant.id}
              className={`flex flex-col overflow-hidden rounded-3xl border shadow-sm ${style.card} ${
                isChosen ? "ring-2 ring-leaf-500" : ""
              }`}
            >
              <Photo
                image={
                  VARIANT_PHOTO[`${testName}-${variant.id}`] ??
                  IMAGES.lunchboxSandwichFruit
                }
                sizes="(max-width: 640px) 90vw, 320px"
                className="h-32 w-full"
                rounded="rounded-none"
              />

              <div className="flex flex-1 flex-col p-5">
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

              <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-leaf-500">
                {variant.label}
              </p>
              <p className="font-poppins mt-1 text-2xl font-extrabold leading-tight text-leaf-900">
                {variant.text}
              </p>

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
            className="inline-flex items-center gap-1.5 rounded-full border border-leaf-200 px-4 py-2 text-xs font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
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
    <SectionPanel
      tint={SECTION_THEME["ab-testing"].panel}
      className="space-y-6"
    >
      <p className="text-sm text-leaf-700">{AB_TESTER_COPY.intro}</p>
      {LANDING_COPY.tests.map((test, index) => (
        <div key={test.testName} style={riseDelay(index)}>
          <AbTestPanel test={test} />
        </div>
      ))}
    </SectionPanel>
  );
}
