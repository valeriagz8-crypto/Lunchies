"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { Database, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TIMED_OUT, withTimeout } from "@/lib/requestTimeout";
import {
  DATA_LIVES_INTRO,
  DATA_LIVES_NOTE,
  DATA_LIVES_ROWS,
  DATA_LIVES_TITLE,
  SAVED_RECORDS_COPY,
  SAVED_RECORDS_INTRO,
  SAVED_RECORDS_PREVIEW_COUNT,
  SAVED_RECORDS_PRIVACY_NOTE,
  SAVED_RECORDS_TITLE,
  SAVED_RECORD_TABLES,
} from "@/lib/week6Data";
import { Card, CardHead, IconBadge, TableWrap } from "@/components/ui/pieces";
import { TINT, type TintName } from "@/components/ui/theme";

/**
 * Live counts and recent entries for the tables the project writes to.
 *
 * Privacy is enforced by the queries themselves, not by the markup: each
 * preview selects only the columns shown below, so allergies, preferences,
 * chat messages and contacts never leave the database. review_requests is
 * never queried at all.
 */

type Counts = Record<string, number | null>;

type CorePreview = { id: string; created_at: string; child_age: string };
type ResearchPreview = { id: string; topic: string; location: string };
type PricingPreview = {
  id: string;
  name: string;
  scenario: string;
  monthly_revenue: number;
};
type AssetPreview = { id: string; title: string; asset_type: string };

const TILE_TINTS: TintName[] = [
  "green",
  "cream",
  "pink",
  "blue",
  "peach",
  "green",
];

function formatInt(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function SavedRecords({
  metricsCard,
  versionCard,
}: {
  metricsCard: ReactNode;
  versionCard: ReactNode;
}) {
  const [counts, setCounts] = useState<Counts>({});
  const [core, setCore] = useState<CorePreview[]>([]);
  const [research, setResearch] = useState<ResearchPreview[]>([]);
  const [pricing, setPricing] = useState<PricingPreview[]>([]);
  const [assets, setAssets] = useState<AssetPreview[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const started = useRef(false);

  const load = useCallback(async () => {
    // Counts first. head:true asks for the count without returning any row,
    // so no record content travels over the wire.
    const countResults = await Promise.all(
      SAVED_RECORD_TABLES.map(async (t) => {
        const response = await withTimeout(
          supabase.from(t.table).select("id", { count: "exact", head: true }),
        );
        if (response === TIMED_OUT || response.error) return [t.table, null] as const;
        return [t.table, response.count ?? 0] as const;
      }),
    );

    const nextCounts: Counts = {};
    countResults.forEach(([table, value]) => {
      nextCounts[table] = value;
    });
    setCounts(nextCounts);

    if (countResults.every(([, value]) => value === null)) {
      setError(SAVED_RECORDS_COPY.error);
      setErrorDetail(SAVED_RECORDS_COPY.timeout);
      return;
    }

    // Previews. Only the columns rendered below are requested.
    const [coreRes, researchRes, pricingRes, assetRes] = await Promise.all([
      withTimeout(
        supabase
          .from("core_outputs")
          .select("id, created_at, child_age")
          .order("created_at", { ascending: false })
          .limit(SAVED_RECORDS_PREVIEW_COUNT),
      ),
      withTimeout(
        supabase
          .from("research_notes")
          .select("id, topic, location")
          .order("created_at", { ascending: false })
          .limit(SAVED_RECORDS_PREVIEW_COUNT),
      ),
      withTimeout(
        supabase
          .from("pricing_scenarios")
          .select("id, name, scenario, monthly_revenue")
          .order("created_at", { ascending: false })
          .limit(SAVED_RECORDS_PREVIEW_COUNT),
      ),
      withTimeout(
        supabase
          .from("marketing_assets")
          .select("id, title, asset_type")
          .order("created_at", { ascending: false })
          .limit(SAVED_RECORDS_PREVIEW_COUNT),
      ),
    ]);

    let failed = false;
    if (coreRes !== TIMED_OUT && !coreRes.error) {
      setCore((coreRes.data ?? []) as CorePreview[]);
    } else failed = true;
    if (researchRes !== TIMED_OUT && !researchRes.error) {
      setResearch((researchRes.data ?? []) as ResearchPreview[]);
    } else failed = true;
    if (pricingRes !== TIMED_OUT && !pricingRes.error) {
      setPricing((pricingRes.data ?? []) as PricingPreview[]);
    } else failed = true;
    if (assetRes !== TIMED_OUT && !assetRes.error) {
      setAssets((assetRes.data ?? []) as AssetPreview[]);
    } else failed = true;

    if (failed) {
      setError(SAVED_RECORDS_COPY.error);
      setErrorDetail(SAVED_RECORDS_COPY.timeout);
    } else {
      setError(null);
      setErrorDetail(null);
    }
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      await load();
      setLoading(false);
    })();
  }, [load]);

  const previews: {
    label: string;
    table: string;
    headers: string[];
    rows: string[][];
  }[] = [
    {
      label: "Lunch plans",
      table: "core_outputs",
      headers: ["Date", "Child's age"],
      rows: core.map((r) => [
        new Date(r.created_at).toLocaleDateString(),
        r.child_age,
      ]),
    },
    {
      label: "Research notes",
      table: "research_notes",
      headers: ["Topic", "Location"],
      rows: research.map((r) => [r.topic, r.location]),
    },
    {
      label: "Pricing scenarios",
      table: "pricing_scenarios",
      headers: ["Name", "Scenario", "Monthly"],
      rows: pricing.map((r) => [
        r.name,
        r.scenario,
        `$${formatInt(r.monthly_revenue)} MXN`,
      ]),
    },
    {
      label: "Marketing assets",
      table: "marketing_assets",
      headers: ["Title", "Type"],
      rows: assets.map((r) => [r.title, r.asset_type]),
    },
  ];

  const liveRows = DATA_LIVES_ROWS.map((row) => {
    const values = row.tables.map((t) => counts[t]);
    const known = values.filter((v): v is number => typeof v === "number");
    return {
      ...row,
      total: known.length === values.length ? known.reduce((a, b) => a + b, 0) : null,
    };
  });

  return (
    <>
    <div className="grid items-start gap-6 lg:grid-cols-2">
      {metricsCard}

      <Card tint="green" className="p-6 sm:p-8">
        <CardHead
          badge={<IconBadge tint="green" icon={Database} />}
          title={DATA_LIVES_TITLE}
          subtitle={DATA_LIVES_INTRO}
        />
        <ul className="mt-5 space-y-2.5">
          {liveRows.map((row) => (
            <li key={row.module}>
              <Link
                href={row.route}
                className="flex items-center gap-3 rounded-2xl border border-leaf-100 bg-white p-3.5 transition-transform hover:-translate-y-0.5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-poppins text-[14px] font-extrabold leading-tight text-leaf-900">
                    {row.module}
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1.5">
                    {row.tables.map((t) => (
                      <span
                        key={t}
                        className="inline-flex max-w-full items-center rounded-full bg-leaf-50 px-2 py-0.5 font-mono text-[10.5px] font-semibold text-leaf-700 ring-1 ring-leaf-100"
                      >
                        {t}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-poppins text-[20px] font-extrabold leading-none text-leaf-900">
                    {loading ? "…" : row.total === null ? "—" : formatInt(row.total)}
                  </span>
                  <span className="block text-[11px] font-medium text-leaf-500">
                    rows
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-[12px] leading-relaxed text-leaf-600">
          {DATA_LIVES_NOTE}
        </p>
      </Card>
    </div>

    <Card tint="plain" className="scroll-mt-24 p-6 sm:p-8" id="saved-records">
      <CardHead
        badge={<IconBadge tint="green" icon={Database} />}
        title={SAVED_RECORDS_TITLE}
        subtitle={SAVED_RECORDS_INTRO}
      />

      <p className="mt-4 flex items-center gap-2.5 rounded-2xl bg-leaf-50 px-4 py-3 text-[13px] font-semibold text-leaf-700">
        <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
        {SAVED_RECORDS_PRIVACY_NOTE}
      </p>

      {loading && (
        <p className="mt-5 text-[15px] text-leaf-600">
          {SAVED_RECORDS_COPY.loading}
        </p>
      )}

      {!loading && error && (
        <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
          <p className="text-[14px] font-semibold text-rose-600">{error}</p>
          {errorDetail && (
            <p className="mt-1 text-[13px] text-leaf-600">{errorDetail}</p>
          )}
        </div>
      )}

      {!loading && (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {SAVED_RECORD_TABLES.map((t, index) => {
              const value = counts[t.table];
              const tint = TINT[TILE_TINTS[index % TILE_TINTS.length]];
              return (
                <div
                  key={t.table}
                  className={`rounded-2xl border p-4 text-center ${tint.card}`}
                >
                  <p className="font-poppins text-[24px] font-extrabold leading-tight text-leaf-900">
                    {value === null || value === undefined ? "—" : formatInt(value)}
                  </p>
                  <p className="mt-0.5 text-[13px] font-bold text-leaf-800">
                    {t.label}
                  </p>
                  <p className="mt-1 font-mono text-[10px] leading-tight text-leaf-500">
                    {t.table}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-[12px] text-leaf-500">
            Chat sessions: {SAVED_RECORDS_COPY.countOnly}
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {previews.map((preview) => (
              <div
                key={preview.table}
                className="rounded-3xl border border-leaf-100 bg-leaf-50/50 p-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-poppins text-[16px] font-extrabold text-leaf-900">
                    {preview.label}
                  </h3>
                  <span className="font-mono text-[11px] text-leaf-500">
                    {preview.table}
                  </span>
                </div>

                {preview.rows.length === 0 ? (
                  <p className="mt-3 text-[13px] text-leaf-600">
                    {SAVED_RECORDS_COPY.empty}
                  </p>
                ) : (
                  <TableWrap className="mt-3">
                    <table className="w-full min-w-[260px] text-left text-[13px]">
                      <thead>
                        <tr className="border-b border-leaf-100 text-[12px] text-leaf-500">
                          {preview.headers.map((h) => (
                            <th key={h} className="pb-2 pr-3 font-bold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.rows.map((row, i) => (
                          <tr
                            key={i}
                            className="border-b border-leaf-100/70 text-leaf-800 last:border-0"
                          >
                            {row.map((cell, j) => (
                              <td key={j} className="py-2.5 pr-3">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableWrap>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </Card>

    {versionCard}
    </>
  );
}
