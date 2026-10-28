"use client";

import { useRef, useState } from "react";
import AbTester from "./AbTester";
import {
  BRAND,
  CAMPAIGN_CALENDAR,
  COMING_SOON,
  LANDING_COPY,
  MARKETING_PAGE_COPY,
  MARKETING_TABS,
  PERSONA,
  SOCIAL_POSTS,
  VIDEO_SCRIPTS,
  type AbTest,
  type BrandFont,
  type CampaignDay,
  type ContentReference,
  type MarketingTabId,
  type SocialChannel,
  type SocialPost,
  type VideoScript,
} from "@/lib/marketingData";

/* -------------------------------------------------------------------------- */
/* Shared styles                                                              */
/* -------------------------------------------------------------------------- */

const CHANNEL_STYLE: Record<
  SocialChannel,
  { icon: string; pill: string; border: string }
> = {
  Instagram: {
    icon: "📸",
    pill: "bg-peach-100 text-peach-700",
    border: "border-peach-100",
  },
  TikTok: {
    icon: "🎵",
    pill: "bg-leaf-100 text-leaf-700",
    border: "border-leaf-100",
  },
};

const FONT_CLASS: Record<BrandFont["role"], string> = {
  headings: "font-poppins",
  text: "font-inter",
};

const VOICE_ICON: Record<string, string> = {
  Friendly: "🤝",
  Trustworthy: "🛡️",
  Modern: "✨",
  Nutritious: "🥗",
};

/* -------------------------------------------------------------------------- */
/* Small building blocks                                                      */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  icon,
  title,
  help,
}: {
  icon: string;
  title: string;
  help: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-lg"
          aria-hidden="true"
        >
          {icon}
        </span>
        <h2 className="font-poppins text-lg font-semibold text-leaf-700">
          {title}
        </h2>
      </div>
      <p className="mt-2 text-sm text-leaf-600">{help}</p>
    </div>
  );
}

function Chip({
  children,
  tone = "leaf",
}: {
  children: React.ReactNode;
  tone?: "leaf" | "peach" | "muted";
}) {
  const tones = {
    leaf: "bg-leaf-100 text-leaf-700",
    peach: "bg-peach-100 text-peach-700",
    muted: "bg-gray-100 text-gray-600",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function ChannelPill({ channel }: { channel: SocialChannel }) {
  const style = CHANNEL_STYLE[channel];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.pill}`}
    >
      <span aria-hidden="true">{style.icon}</span>
      {channel}
    </span>
  );
}

function Beat({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl border border-leaf-100 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-leaf-500">
        {label}
      </p>
      <p className="mt-1.5 break-words text-sm text-leaf-800">{text}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Panels                                                                     */
/* -------------------------------------------------------------------------- */

function BrandPanel() {
  const colors = Object.values(BRAND.colors);
  const fonts = [BRAND.fonts.headings, BRAND.fonts.text];

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-peach-100 bg-peach-50 p-6 text-center shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-peach-600">
          Tagline
        </p>
        <p className="font-poppins mt-2 text-2xl font-bold text-leaf-700 sm:text-3xl">
          {BRAND.tagline}
        </p>
      </div>

      <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
        <h3 className="font-poppins text-base font-semibold text-leaf-700">
          Colors
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {colors.map((color) => (
            <div
              key={color.hex}
              className="overflow-hidden rounded-xl border border-leaf-100 bg-white shadow-sm"
            >
              <div
                className="h-20 w-full"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              />
              <div className="p-3">
                <p className="text-sm font-semibold text-leaf-800">
                  {color.name}
                </p>
                <p className="mt-0.5 font-mono text-xs uppercase text-leaf-600">
                  {color.hex}
                </p>
                <p className="mt-2 text-[11px] text-gray-500">
                  {color.tailwind}
                </p>
                <p className="mt-2 text-xs text-leaf-700">{color.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
        <h3 className="font-poppins text-base font-semibold text-leaf-700">
          Fonts
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {fonts.map((font) => (
            <div
              key={font.family}
              className="rounded-xl border border-leaf-100 bg-leaf-50 p-5"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-leaf-500">
                {font.role}
              </p>
              <p
                className={`${FONT_CLASS[font.role]} mt-1 text-2xl font-semibold text-leaf-800`}
              >
                {font.family}
              </p>
              <p
                className={`${FONT_CLASS[font.role]} mt-2 text-sm text-leaf-700`}
              >
                {BRAND.tagline}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {font.weights.map((weight) => (
                  <Chip key={weight}>{weight}</Chip>
                ))}
              </div>
              <p className="mt-3 break-words text-[11px] text-gray-500">
                {font.fallback}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
        <h3 className="font-poppins text-base font-semibold text-leaf-700">
          Brand voice
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {BRAND.voice.map((voice) => (
            <div
              key={voice.word}
              className="rounded-xl border border-leaf-100 bg-white p-5"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">
                  {VOICE_ICON[voice.word] ?? "💬"}
                </span>
                <p className="font-poppins font-semibold text-leaf-800">
                  {voice.word}
                </p>
              </div>
              <p className="mt-2 text-sm text-leaf-700">{voice.meaning}</p>
              <p className="mt-2 text-xs text-leaf-600">{voice.soundsLike}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonaPanel() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm"
            aria-hidden="true"
          >
            👩‍👧
          </span>
          <div>
            <h3 className="font-poppins text-lg font-bold text-leaf-800">
              {PERSONA.name}
            </h3>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Chip>{PERSONA.ageRange}</Chip>
              <Chip tone="peach">{PERSONA.location}</Chip>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-leaf-700">
          {PERSONA.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PERSONA.insights.map((insight, index) => (
          <div
            key={insight.title}
            className="rounded-2xl border border-leaf-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
                {index + 1}
              </span>
              <p className="font-poppins font-semibold text-leaf-800">
                {insight.title}
              </p>
            </div>
            <p className="mt-2 text-sm text-leaf-700">{insight.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function VariantCard({
  letter,
  text,
  rationale,
  asButton = false,
}: {
  letter: string;
  text: string;
  rationale: string;
  asButton?: boolean;
}) {
  const isA = letter === "A";
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        isA ? "border-leaf-100 bg-leaf-50" : "border-peach-100 bg-peach-50"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
          isA ? "bg-leaf-600" : "bg-peach-500"
        }`}
      >
        {letter}
      </span>
      {asButton ? (
        <p className="mt-4">
          <span
            className={`inline-block rounded-full px-6 py-2.5 text-sm font-bold text-white shadow-sm ${
              isA ? "bg-leaf-600" : "bg-peach-500"
            }`}
          >
            {text}
          </span>
        </p>
      ) : (
        <p className="font-poppins mt-3 text-xl font-bold text-leaf-800">
          {text}
        </p>
      )}
      <p className="mt-3 text-xs text-leaf-600">{rationale}</p>
    </div>
  );
}

function AbTestBlock({
  test,
  asButton = false,
}: {
  test: AbTest;
  asButton?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-poppins text-base font-semibold text-leaf-700">
          {test.element}
        </h3>
        <Chip tone="muted">{test.id}</Chip>
      </div>
      <p className="mt-2 text-sm text-leaf-600">{test.hypothesis}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {test.variants.map((variant) => (
          <VariantCard
            key={variant.id}
            letter={variant.id}
            text={variant.text}
            rationale={variant.rationale}
            asButton={asButton}
          />
        ))}
      </div>
    </div>
  );
}

function LandingPanel() {
  return (
    <div className="space-y-8">
      <AbTestBlock test={LANDING_COPY.headlineTest} />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-leaf-500">
            Subheadline
          </p>
          <p className="mt-2 text-base leading-relaxed text-leaf-800">
            {LANDING_COPY.subheadline}
          </p>
        </div>
        <div className="rounded-2xl border border-peach-100 bg-peach-50 p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-peach-600">
            Call to action
          </p>
          <p className="mt-2 text-base leading-relaxed text-leaf-800">
            {LANDING_COPY.callToAction}
          </p>
        </div>
      </div>

      <AbTestBlock test={LANDING_COPY.buttonTest} asButton />
    </div>
  );
}

function PostCard({ post }: { post: SocialPost }) {
  return (
    <article
      className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm ${CHANNEL_STYLE[post.channel].border}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ChannelPill channel={post.channel} />
        <span className="font-mono text-[11px] text-gray-400">{post.id}</span>
      </div>
      <h3 className="font-poppins mt-3 font-semibold text-leaf-800">
        {post.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-leaf-700">
        {post.caption}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-leaf-50 pt-3">
        {post.hashtags.map((hashtag) => (
          <span
            key={hashtag}
            className="break-all text-xs font-medium text-peach-600"
          >
            {hashtag}
          </span>
        ))}
      </div>
    </article>
  );
}

function PostsPanel() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {SOCIAL_POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

function ScriptCard({ script }: { script: VideoScript }) {
  return (
    <article className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-poppins font-semibold text-leaf-800">
          {script.title}
        </h3>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-leaf-600 px-3 py-1 text-xs font-bold text-white">
          <span aria-hidden="true">⏱</span>
          {script.duration}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Beat label="Hook" text={script.hook} />
        <Beat label="Problem" text={script.problem} />
        <Beat label="Solution" text={script.solution} />
        <Beat label="Call to action" text={script.callToAction} />
      </div>

      {script.productionNote && (
        <div className="mt-4 rounded-xl border border-peach-200 bg-peach-50 p-4">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-peach-700">
            <span aria-hidden="true">⚠️</span> Production note
          </p>
          <p className="mt-2 text-sm leading-relaxed text-peach-800">
            {script.productionNote}
          </p>
        </div>
      )}
    </article>
  );
}

function ScriptsPanel() {
  return (
    <div className="space-y-6">
      {VIDEO_SCRIPTS.map((script) => (
        <ScriptCard key={script.id} script={script} />
      ))}
    </div>
  );
}

const REFERENCE_TITLES: Record<ContentReference, string> = {
  ...Object.fromEntries(SOCIAL_POSTS.map((post) => [post.id, post.title])),
  ...Object.fromEntries(
    VIDEO_SCRIPTS.map((script) => [script.id, script.title]),
  ),
} as Record<ContentReference, string>;

function CalendarCard({ day }: { day: CampaignDay }) {
  return (
    <div className="flex flex-col rounded-2xl border border-leaf-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
            {day.day}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-leaf-800">
              {day.weekday}
            </p>
            <p className="text-xs text-leaf-600">{day.contentType}</p>
          </div>
        </div>
        <ChannelPill channel={day.channel} />
      </div>
      <p className="mt-3 flex-1 text-sm text-leaf-700">{day.topic}</p>
      <p className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-leaf-50 pt-3 text-xs text-leaf-600">
        <span aria-hidden="true">🔗</span>
        <span className="font-mono text-[11px] text-gray-400">
          {day.reference}
        </span>
        <span className="min-w-0 break-words">
          {REFERENCE_TITLES[day.reference]}
        </span>
      </p>
    </div>
  );
}

function CalendarPanel() {
  const weeks = [
    CAMPAIGN_CALENDAR.filter((day) => day.day <= 7),
    CAMPAIGN_CALENDAR.filter((day) => day.day > 7),
  ];

  return (
    <div className="space-y-8">
      {weeks.map((days, index) => (
        <div key={index}>
          <p className="font-poppins text-sm font-semibold text-leaf-700">
            Week {index + 1}
            <span className="ml-2 font-inter text-xs font-normal text-leaf-500">
              days {days[0].day} to {days[days.length - 1].day}
            </span>
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {days.map((day) => (
              <CalendarCard key={day.day} day={day} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ComingSoonPanel({ tabId }: { tabId: "saved" }) {
  const copy = COMING_SOON[tabId];
  return (
    <div className="rounded-2xl border border-dashed border-leaf-200 bg-leaf-50 p-8 text-center shadow-sm">
      <span className="text-4xl" aria-hidden="true">
        🚧
      </span>
      <p className="mt-3 inline-block rounded-full bg-peach-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-peach-700">
        {MARKETING_PAGE_COPY.comingSoonBadge}
      </p>
      <h3 className="font-poppins mt-3 text-lg font-bold text-leaf-800">
        {copy.title}
      </h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-leaf-700">
        {copy.description}
      </p>
      <ul className="mx-auto mt-5 max-w-md space-y-2 text-left text-sm text-leaf-800">
        {copy.nextSteps.map((step) => (
          <li
            key={step}
            className="flex items-start gap-2 rounded-xl border border-leaf-100 bg-white p-3"
          >
            <span className="font-bold text-leaf-600" aria-hidden="true">
              →
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Overview                                                                   */
/* -------------------------------------------------------------------------- */

function summaryChips(tabId: MarketingTabId): string[] {
  switch (tabId) {
    case "brand":
      return [
        `${Object.keys(BRAND.colors).length} colors`,
        `${Object.keys(BRAND.fonts).length} fonts`,
        `${BRAND.voice.length} voice words`,
      ];
    case "persona":
      return [
        PERSONA.ageRange,
        PERSONA.location,
        `${PERSONA.insights.length} insights`,
      ];
    case "landing":
      return [
        `${LANDING_COPY.headlineTest.variants.length} headline options`,
        `${LANDING_COPY.buttonTest.variants.length} button options`,
      ];
    case "posts":
      return [
        `${SOCIAL_POSTS.length} posts`,
        ...Object.keys(CHANNEL_STYLE).map(
          (channel) =>
            `${
              SOCIAL_POSTS.filter((post) => post.channel === channel).length
            } ${channel}`,
        ),
      ];
    case "scripts":
      return [
        `${VIDEO_SCRIPTS.length} scripts`,
        VIDEO_SCRIPTS.map((script) => script.duration).join(" · "),
      ];
    case "calendar":
      return [
        `${CAMPAIGN_CALENDAR.length} days`,
        `${new Set(CAMPAIGN_CALENDAR.map((day) => day.contentType)).size} content types`,
      ];
    default:
      return [];
  }
}

function OverviewPanel({
  onSelect,
}: {
  onSelect: (tabId: MarketingTabId) => void;
}) {
  const sections = MARKETING_TABS.filter((tab) => tab.id !== "overview");

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((tab) => {
        const chips = summaryChips(tab.id);
        const isComingSoon = tab.status === "coming-soon";
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelect(tab.id)}
            className={`flex h-full flex-col rounded-2xl border p-5 text-left shadow-sm transition-colors ${
              isComingSoon
                ? "border-dashed border-leaf-200 bg-white hover:bg-leaf-50"
                : "border-leaf-100 bg-leaf-50 hover:bg-leaf-100"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm"
                aria-hidden="true"
              >
                {tab.icon}
              </span>
              <span aria-hidden="true" className="text-leaf-400">
                →
              </span>
            </div>
            <h3 className="font-poppins mt-3 font-semibold text-leaf-800">
              {tab.label}
            </h3>
            <p className="mt-1 flex-1 text-sm text-leaf-700">{tab.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {isComingSoon ? (
                <Chip tone="peach">{MARKETING_PAGE_COPY.comingSoonBadge}</Chip>
              ) : (
                chips.map((chip) => <Chip key={chip}>{chip}</Chip>)
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function MarketingClient() {
  const [activeTab, setActiveTab] = useState<MarketingTabId>("overview");
  const tabsRef = useRef<HTMLDivElement>(null);

  const activeIndex = MARKETING_TABS.findIndex((tab) => tab.id === activeTab);
  const active = MARKETING_TABS[activeIndex];

  function goToTab(tabId: MarketingTabId) {
    setActiveTab(tabId);
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleTabKeys(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const next =
      (activeIndex + offset + MARKETING_TABS.length) % MARKETING_TABS.length;
    setActiveTab(MARKETING_TABS[next].id);
  }

  return (
    <section className="font-inter mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-peach-100 text-3xl"
              aria-hidden="true"
            >
              📣
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-peach-500">
              {MARKETING_PAGE_COPY.eyebrow}
            </span>
          </div>
          <h1 className="font-poppins mt-3 text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">
            {MARKETING_PAGE_COPY.heroTitleLead}{" "}
            <span className="text-peach-500">
              {MARKETING_PAGE_COPY.heroTitleAccent}
            </span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-gray-600">
            {MARKETING_PAGE_COPY.heroDescription}
          </p>
          <button
            type="button"
            onClick={() => goToTab("posts")}
            className="mt-6 rounded-full bg-peach-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-peach-600"
          >
            {MARKETING_PAGE_COPY.primaryCta}
          </button>
        </div>
        <div className="flex justify-center md:justify-end">
          <span className="text-6xl leading-none" aria-hidden="true">
            🎨
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div
        ref={tabsRef}
        role="tablist"
        aria-label={MARKETING_PAGE_COPY.eyebrow}
        onKeyDown={handleTabKeys}
        className="mt-10 flex flex-wrap gap-2 rounded-2xl border border-leaf-100 bg-leaf-50 p-2"
      >
        {MARKETING_TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                isActive
                  ? "bg-leaf-600 text-white shadow-sm"
                  : "text-leaf-700 hover:bg-leaf-100"
              }`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="mt-8"
      >
        <SectionHeader
          icon={active.icon}
          title={
            activeTab === "overview"
              ? MARKETING_PAGE_COPY.overviewHeading
              : active.label
          }
          help={
            activeTab === "overview"
              ? MARKETING_PAGE_COPY.overviewHelp
              : active.summary
          }
        />

        <div className="mt-6">
          {activeTab === "overview" && <OverviewPanel onSelect={goToTab} />}
          {activeTab === "brand" && <BrandPanel />}
          {activeTab === "persona" && <PersonaPanel />}
          {activeTab === "landing" && <LandingPanel />}
          {activeTab === "posts" && <PostsPanel />}
          {activeTab === "scripts" && <ScriptsPanel />}
          {activeTab === "calendar" && <CalendarPanel />}
          {activeTab === "ab-testing" && <AbTester />}
          {activeTab === "saved" && <ComingSoonPanel tabId={activeTab} />}
        </div>
      </div>
    </section>
  );
}
