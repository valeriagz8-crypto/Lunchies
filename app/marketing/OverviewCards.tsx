"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TIMED_OUT, withTimeout } from "@/lib/requestTimeout";
import {
  ADD_NEW_ASSET_LABEL,
  AB_TEST_NAMES,
  BRAND,
  CAMPAIGN_CALENDAR,
  LANDING_COPY,
  OVERVIEW_PREVIEW_COPY,
  PERSONA,
  SAVED_ASSET_TILES,
  SOCIAL_POSTS,
  VIDEO_SCRIPTS,
  MARKETING_TABS,
  type MarketingTabId,
} from "@/lib/marketingData";
import {
  calculateConversion,
  emptyTotals,
  tallyEvents,
  type AbEvent,
  type TestTotals,
} from "@/lib/abTest";

const CALENDAR_PREVIEW_DAYS = 5;
const POST_PREVIEW_COUNT = 3;

const CHANNEL_EMOJI: Record<string, string> = {
  Instagram: "📸",
  TikTok: "🎵",
};

const POST_TILE_TINTS = [
  "from-leaf-200 to-leaf-100",
  "from-rose-200 to-rose-100",
  "from-peach-200 to-peach-100",
];

type CardTint = {
  card: string;
  icon: string;
};

const TINTS: Record<string, CardTint> = {
  mint: { card: "border-leaf-100 bg-leaf-50", icon: "bg-leaf-100" },
  rose: { card: "border-rose-100 bg-rose-50", icon: "bg-rose-100" },
  cream: { card: "border-peach-100 bg-peach-50", icon: "bg-peach-100" },
  sky: { card: "border-sky-100 bg-sky-50", icon: "bg-sky-100" },
};

function OverviewCard({
  tabId,
  tint,
  className = "",
  onSelect,
  children,
}: {
  tabId: MarketingTabId;
  tint: CardTint;
  className?: string;
  onSelect: (tabId: MarketingTabId) => void;
  children: React.ReactNode;
}) {
  const tab = MARKETING_TABS.find((entry) => entry.id === tabId);
  if (!tab) return null;

  const { icon, cardTitle: title, summary: description } = tab;

  return (
    <article
      className={`flex min-w-0 flex-col overflow-hidden rounded-3xl border p-5 shadow-sm transition-shadow hover:shadow-md ${tint.card} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl ${tint.icon}`}
          >
            {icon}
          </span>
          <div className="min-w-0">
            <h3 className="font-poppins font-bold text-leaf-900">{title}</h3>
            <p className="mt-0.5 text-sm leading-snug text-leaf-700">
              {description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect(tabId)}
          aria-label={`Open ${title}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-leaf-700 shadow-sm transition-colors hover:bg-leaf-600 hover:text-white"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </article>
  );
}

function Panel({
  label,
  className = "",
  children,
}: {
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl bg-white p-3 shadow-sm ${className}`}>
      {label && (
        <p className="text-[11px] font-semibold text-leaf-600">{label}</p>
      )}
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Previews                                                                   */
/* -------------------------------------------------------------------------- */

function BrandPreview() {
  const colors = Object.values(BRAND.colors);
  return (
    <div className="grid grid-cols-2 gap-2">
      <Panel label={OVERVIEW_PREVIEW_COPY.logo}>
        <span className="mt-1.5 flex items-center justify-center gap-1 rounded-xl bg-peach-50 px-2 py-2.5 font-poppins text-sm font-bold text-leaf-800">
          {BRAND.name} <span aria-hidden="true">🍎</span>
        </span>
      </Panel>

      <Panel label={OVERVIEW_PREVIEW_COPY.colors}>
        <div className="mt-2 flex items-center gap-1.5">
          {colors.map((color) => (
            <span
              key={color.hex}
              title={color.hex}
              aria-hidden="true"
              className="h-7 w-7 shrink-0 rounded-full"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </Panel>

      <Panel label={OVERVIEW_PREVIEW_COPY.typography}>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-poppins text-2xl font-bold text-leaf-900">
            Aa
          </span>
          <span className="min-w-0 text-[11px] leading-tight text-leaf-700">
            {BRAND.fonts.text.family}
            <br />
            {BRAND.fonts.headings.family}
          </span>
        </div>
      </Panel>

      <Panel label={OVERVIEW_PREVIEW_COPY.brandVoice}>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {BRAND.voice.map((voice) => (
            <span
              key={voice.word}
              className="rounded-full bg-leaf-50 px-2 py-1 text-[10px] font-medium text-leaf-700"
            >
              {voice.word}
            </span>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function PersonaPreview() {
  return (
    <Panel label={OVERVIEW_PREVIEW_COPY.primaryPersona}>
      <div className="mt-2 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-2xl"
        >
          👩
        </span>
        <div className="min-w-0">
          <p className="font-poppins text-sm font-bold text-leaf-900">
            {PERSONA.name.replace(/\s*\(.*\)$/, "")}
          </p>
          <p className="text-xs text-leaf-600">{PERSONA.ageRange} years old</p>
        </div>
      </div>
      <ul className="mt-3 space-y-1.5">
        {PERSONA.insights.map((insight) => (
          <li
            key={insight.title}
            className="flex items-start gap-2 text-xs text-leaf-800"
          >
            <span aria-hidden="true" className="text-leaf-500">
              •
            </span>
            <span className="min-w-0">{insight.title}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function LandingPreview() {
  const headline = LANDING_COPY.headlineTest.variants[0].text;
  const splitAt = headline.indexOf(". ");
  const lead = splitAt > -1 ? headline.slice(0, splitAt + 1) : headline;
  const accent = splitAt > -1 ? headline.slice(splitAt + 2) : "";

  return (
    <Panel label={OVERVIEW_PREVIEW_COPY.mainHeadline}>
      <p className="font-poppins mt-1 text-lg font-bold leading-tight text-leaf-900">
        {lead} {accent && <span className="text-peach-500">{accent}</span>}
      </p>

      <p className="mt-3 text-[11px] font-semibold text-leaf-600">
        {OVERVIEW_PREVIEW_COPY.subheadline}
      </p>
      <p className="mt-1 text-xs leading-snug text-leaf-800">
        {LANDING_COPY.subheadline}
      </p>

      <p className="mt-3 text-[11px] font-semibold text-leaf-600">
        {OVERVIEW_PREVIEW_COPY.cta}
      </p>
      <span className="mt-1.5 inline-block rounded-full bg-leaf-600 px-4 py-2 text-xs font-bold text-white">
        {LANDING_COPY.buttonTest.variants[0].text}
      </span>
    </Panel>
  );
}

function PostsPreview() {
  return (
    <div className="grid flex-1 grid-cols-3 gap-2">
      {SOCIAL_POSTS.slice(0, POST_PREVIEW_COUNT).map((post, index) => (
        <div
          key={post.id}
          className={`flex min-h-[8rem] flex-col justify-between rounded-2xl bg-gradient-to-br p-2 shadow-sm ${POST_TILE_TINTS[index % POST_TILE_TINTS.length]}`}
        >
          <span
            aria-hidden="true"
            className="text-sm"
            title={post.channel}
          >
            {CHANNEL_EMOJI[post.channel]}
          </span>
          <span className="rounded-lg bg-white/90 px-1.5 py-1 text-[10px] font-bold leading-tight text-leaf-900">
            {post.title}
          </span>
        </div>
      ))}
    </div>
  );
}

function ScriptsPreview() {
  const script = VIDEO_SCRIPTS[0];
  return (
    <Panel className="flex flex-1 flex-col p-2">
      <div className="flex min-h-[6rem] flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-leaf-200 to-peach-100">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-sm text-leaf-700 shadow-sm"
        >
          ▶
        </span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2 px-1 pb-1">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-leaf-600">Script 1</p>
          <p className="truncate text-xs font-bold text-leaf-900">
            {script.title}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-leaf-100 px-2 py-1 text-[10px] font-bold text-leaf-700">
          {script.duration}
        </span>
      </div>
    </Panel>
  );
}

function CalendarPreview({
  onSelect,
}: {
  onSelect: (tabId: MarketingTabId) => void;
}) {
  return (
    <Panel className="flex min-w-0 flex-1 flex-col p-2">
      <ul className="min-w-0 flex-1">
        {CAMPAIGN_CALENDAR.slice(0, CALENDAR_PREVIEW_DAYS).map((day) => (
          <li
            key={day.day}
            className="flex items-center gap-2 border-b border-leaf-50 px-1 py-2 last:border-0"
          >
            <span className="w-12 shrink-0 text-[11px] font-bold text-leaf-900">
              Day {day.day}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs text-leaf-800">
              {day.topic}
            </span>
            <span
              aria-hidden="true"
              title={day.channel}
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-[10px]"
            >
              {CHANNEL_EMOJI[day.channel]}
            </span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onSelect("calendar")}
        className="mt-1 flex w-full items-center justify-end gap-1 px-1 py-1 text-[11px] font-semibold text-leaf-700 transition-colors hover:text-peach-600"
      >
        {OVERVIEW_PREVIEW_COPY.viewFullCalendar}
        <span aria-hidden="true">→</span>
      </button>
    </Panel>
  );
}

/** Donut showing one variant's real conversion rate. */
function Donut({ percent, color }: { percent: number; color: string }) {
  return (
    <span
      aria-hidden="true"
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
      style={{
        background: `conic-gradient(${color} ${percent * 3.6}deg, #e0f3e5 0deg)`,
      }}
    >
      <span className="h-5 w-5 rounded-full bg-white" />
    </span>
  );
}

function AbPreview({ totals, hasData }: { totals: TestTotals; hasData: boolean }) {
  const colors: Record<string, string> = { A: "#2f7d49", B: "#ec6410" };

  return (
    <div className="grid flex-1 gap-2 sm:grid-cols-2">
      {LANDING_COPY.headlineTest.variants.map((variant) => {
        const { views, clicks } = totals[variant.id];
        const rate = calculateConversion(views, clicks);
        return (
          <Panel key={variant.id}>
            <div className="flex items-start gap-2">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white ${
                  variant.id === "A" ? "bg-leaf-600" : "bg-peach-500"
                }`}
              >
                {variant.id}
              </span>
              <p className="min-w-0 text-xs font-bold leading-snug text-leaf-900">
                {variant.text}
              </p>
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <Donut percent={rate} color={colors[variant.id]} />
              <div className="min-w-0">
                {hasData ? (
                  <>
                    <p className="font-poppins text-base font-bold text-leaf-900">
                      {rate.toFixed(1)}%
                    </p>
                    <p className="text-[10px] leading-tight text-leaf-600">
                      {OVERVIEW_PREVIEW_COPY.conversion}
                    </p>
                  </>
                ) : (
                  <p className="text-[11px] leading-tight text-leaf-600">
                    {OVERVIEW_PREVIEW_COPY.noVotesYet}
                  </p>
                )}
              </div>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}

function SavedPreview({
  onSelect,
}: {
  onSelect: (tabId: MarketingTabId) => void;
}) {
  return (
    <div className="grid flex-1 grid-cols-3 items-stretch gap-2 sm:grid-cols-6">
      {SAVED_ASSET_TILES.map((tile) => (
        <div
          key={tile.label}
          className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-2 text-center shadow-sm"
        >
          <span aria-hidden="true" className="text-xl">
            {tile.icon}
          </span>
          <span className="text-[10px] font-medium leading-tight text-leaf-700">
            {tile.label}
          </span>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onSelect("saved")}
        className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-leaf-200 p-2 text-center transition-colors hover:bg-white"
      >
        <span aria-hidden="true" className="text-xl text-leaf-500">
          +
        </span>
        <span className="text-[10px] font-medium leading-tight text-leaf-700">
          {ADD_NEW_ASSET_LABEL}
        </span>
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Grid                                                                       */
/* -------------------------------------------------------------------------- */

export default function OverviewCards({
  onSelect,
}: {
  onSelect: (tabId: MarketingTabId) => void;
}) {
  const [totals, setTotals] = useState<TestTotals>(emptyTotals());
  const [hasData, setHasData] = useState(false);
  const startedRef = useRef(false);

  // The A/B card shows the real numbers, so an empty test reads as empty.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    void (async () => {
      const response = await withTimeout(
        supabase
          .from("ab_events")
          .select("test_name, variant, event_type")
          .eq("test_name", AB_TEST_NAMES.headline),
      );

      if (response === TIMED_OUT || response.error) {
        console.error("ab_events overview load failed:", response);
        return;
      }

      const rows = (response.data ?? []) as AbEvent[];
      setTotals(tallyEvents(rows));
      setHasData(rows.length > 0);
    })();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
      <OverviewCard
        tabId="brand"
        tint={TINTS.mint}
        className="lg:col-span-4"
        onSelect={onSelect}
      >
        <BrandPreview />
      </OverviewCard>

      <OverviewCard
        tabId="persona"
        tint={TINTS.rose}
        className="lg:col-span-4"
        onSelect={onSelect}
      >
        <PersonaPreview />
      </OverviewCard>

      <OverviewCard
        tabId="landing"
        tint={TINTS.mint}
        className="lg:col-span-4"
        onSelect={onSelect}
      >
        <LandingPreview />
      </OverviewCard>

      <OverviewCard
        tabId="posts"
        tint={TINTS.cream}
        className="lg:col-span-5"
        onSelect={onSelect}
      >
        <PostsPreview />
      </OverviewCard>

      <OverviewCard
        tabId="scripts"
        tint={TINTS.sky}
        className="lg:col-span-3"
        onSelect={onSelect}
      >
        <ScriptsPreview />
      </OverviewCard>

      <OverviewCard
        tabId="calendar"
        tint={TINTS.rose}
        className="lg:col-span-4"
        onSelect={onSelect}
      >
        <CalendarPreview onSelect={onSelect} />
      </OverviewCard>

      <OverviewCard
        tabId="ab-testing"
        tint={TINTS.mint}
        className="lg:col-span-5"
        onSelect={onSelect}
      >
        <AbPreview totals={totals} hasData={hasData} />
      </OverviewCard>

      <OverviewCard
        tabId="saved"
        tint={TINTS.cream}
        className="lg:col-span-7"
        onSelect={onSelect}
      >
        <SavedPreview onSelect={onSelect} />
      </OverviewCard>
    </div>
  );
}
