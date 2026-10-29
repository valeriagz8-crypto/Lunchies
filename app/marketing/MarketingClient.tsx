"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import AbTester from "./AbTester";
import CardActions from "./CardActions";
import HeroArt from "./HeroArt";
import OverviewCards from "./OverviewCards";
import SavedAssets from "./SavedAssets";
import SectionBanner from "@/components/marketing/SectionBanner";
import {
  PersonaAvatar,
  Photo,
  SectionPanel,
  StickyNote,
} from "@/components/marketing/pieces";
import { CARD_MOTION, SECTION_THEME, riseDelay } from "@/components/marketing/theme";
import { IMAGES, POST_IMAGES, SCRIPT_IMAGES, imageFor } from "@/lib/marketingImages";
import {
  AB_TEST_NAMES,
  BRAND,
  CAMPAIGN_CALENDAR,
  LANDING_COPY,
  MARKETING_PAGE_COPY,
  MARKETING_CLOSING_CTA,
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
import {
  ASSET_TYPES,
  EXPORT_FILENAME,
  brandCardAsset,
  buildExportText,
  calendarDayCardAsset,
  landingCardAsset,
  personaCardAsset,
  postCardAsset,
  scriptCardAsset,
  type CardAsset,
} from "@/lib/marketingExport";

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
  const strip = [
    IMAGES.lunchboxSandwichFruit,
    IMAGES.freshProduce,
    IMAGES.fruitPlate,
    IMAGES.vegetablesCloseup,
  ];

  return (
    <SectionPanel tint={SECTION_THEME.brand.panel} className="space-y-5">
      {/* Logo showcase */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div
          className={`flex flex-col items-center justify-center rounded-3xl bg-white px-6 py-10 text-center shadow-sm ${CARD_MOTION}`}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-leaf-500">
            Primary logo
          </p>
          <p className="font-poppins mt-4 flex items-center gap-3 text-4xl font-extrabold text-leaf-700 sm:text-5xl">
            {BRAND.name}
            <span aria-hidden="true">🍎</span>
          </p>
          <p className="mt-2 text-sm text-leaf-600">{BRAND.tagline}</p>

          <div className="mt-7 grid w-full grid-cols-3 gap-3">
            <span className="font-poppins rounded-2xl bg-leaf-50 py-3 text-sm font-bold text-leaf-700">
              Lunchies
            </span>
            <span className="font-poppins rounded-2xl bg-leaf-700 py-3 text-sm font-bold text-white">
              Lunchies
            </span>
            <span className="font-poppins rounded-2xl bg-peach-100 py-3 text-sm font-bold text-peach-700">
              Lunchies
            </span>
          </div>
          <p className="mt-2 text-[11px] text-leaf-500">Logo variations</p>
        </div>

        <div className="flex flex-col gap-5">
          <StickyNote tone="cream" className={CARD_MOTION}>
            {BRAND.tagline}
            <span aria-hidden="true"> 🍏</span>
          </StickyNote>

          {/* Food photo collage */}
          <div className="grid flex-1 grid-cols-2 gap-3">
            {strip.map((image, index) => (
              <Photo
                key={image.src}
                image={image}
                sizes="(max-width: 1024px) 45vw, 200px"
                className={`min-h-[6.5rem] ${CARD_MOTION}`}
                rounded={index % 3 === 0 ? "rounded-[1.75rem]" : "rounded-2xl"}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className={`rounded-3xl bg-white p-6 shadow-sm ${CARD_MOTION}`}>
        <h3 className="font-poppins text-base font-bold text-leaf-900">
          Color palette
        </h3>
        <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {colors.map((color, index) => (
            <div
              key={color.hex}
              style={riseDelay(index)}
              className="animate-rise flex flex-col items-center text-center"
            >
              <span
                aria-hidden="true"
                className="h-20 w-20 rounded-full shadow-md ring-4 ring-white"
                style={{ backgroundColor: color.hex }}
              />
              <p className="mt-3 text-sm font-bold text-leaf-800">
                {color.name}
              </p>
              <p className="font-mono text-xs uppercase text-leaf-600">
                {color.hex}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">{color.tailwind}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="grid gap-5 sm:grid-cols-2">
        {fonts.map((font, index) => (
          <div
            key={font.family}
            style={riseDelay(index)}
            className={`rounded-3xl bg-white p-6 shadow-sm ${CARD_MOTION}`}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-leaf-500">
              {font.role}
            </p>
            <p
              className={`${FONT_CLASS[font.role]} mt-2 text-6xl font-bold leading-none text-leaf-800`}
            >
              Aa
            </p>
            <p className="font-poppins mt-3 text-lg font-bold text-leaf-900">
              {font.family}
            </p>
            <p className={`${FONT_CLASS[font.role]} mt-1 text-sm text-leaf-700`}>
              {BRAND.tagline}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {font.weights.map((weight) => (
                <Chip key={weight}>{weight}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Brand voice */}
      <div className={`rounded-3xl bg-white p-6 shadow-sm ${CARD_MOTION}`}>
        <h3 className="font-poppins text-base font-bold text-leaf-900">
          Brand voice
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {BRAND.voice.map((voice, index) => (
            <span
              key={voice.word}
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                [
                  "bg-leaf-100 text-leaf-700",
                  "bg-peach-100 text-peach-700",
                  "bg-rose-100 text-rose-700",
                  "bg-sky-100 text-sky-700",
                ][index % 4]
              }`}
            >
              {VOICE_ICON[voice.word] ?? "💬"} {voice.word}
            </span>
          ))}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {BRAND.voice.map((voice, index) => (
            <div
              key={voice.word}
              style={riseDelay(index)}
              className="animate-rise rounded-2xl bg-leaf-50 p-4"
            >
              <p className="font-poppins font-semibold text-leaf-800">
                {voice.word}
              </p>
              <p className="mt-1.5 text-sm text-leaf-700">{voice.meaning}</p>
              <p className="mt-1 text-xs text-leaf-600">{voice.soundsLike}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionPanel>
  );
}

const INSIGHT_ICON = ["🥗", "⏱️", "✨", "🌈"];

function PersonaPanel() {
  return (
    <SectionPanel tint={SECTION_THEME.persona.panel} className="space-y-5">
      {/* Persona card */}
      <div
        className={`grid gap-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] ${CARD_MOTION}`}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <PersonaAvatar className="h-28 w-28 shrink-0 rounded-full shadow-sm" />

          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-500">
              Primary persona
            </p>
            <h3 className="font-poppins mt-2 text-2xl font-extrabold text-leaf-900 sm:text-3xl">
              {PERSONA.name}
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                {PERSONA.ageRange} years old
              </span>
              <span className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-semibold text-leaf-700">
                {PERSONA.location}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-leaf-700">
              {PERSONA.description}
            </p>
          </div>
        </div>

        {/* Food accent */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <Photo
            image={IMAGES.lunchboxSaladBlue}
            sizes="(max-width: 1024px) 45vw, 260px"
            className="min-h-[8rem]"
          />
          <Photo
            image={IMAGES.fruitPlate}
            sizes="(max-width: 1024px) 45vw, 260px"
            className="min-h-[8rem]"
          />
        </div>
      </div>

      {/* What matters to them */}
      <div>
        <h3 className="font-poppins px-1 text-base font-bold text-leaf-900">
          What matters to them
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {PERSONA.insights.map((insight, index) => (
            <div
              key={insight.title}
              style={riseDelay(index)}
              className={`flex gap-4 rounded-3xl bg-white p-5 shadow-sm ${CARD_MOTION}`}
            >
              <span
                aria-hidden="true"
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                  [
                    "bg-leaf-100",
                    "bg-peach-100",
                    "bg-rose-100",
                    "bg-sky-100",
                  ][index % 4]
                }`}
              >
                {INSIGHT_ICON[index % INSIGHT_ICON.length]}
              </span>
              <div className="min-w-0">
                <p className="font-poppins font-bold text-leaf-900">
                  {insight.title}
                </p>
                <p className="mt-1.5 text-sm text-leaf-700">{insight.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <StickyNote tone="rose" className={`max-w-md ${CARD_MOTION}`}>
        Write for the parent packing lunch at 7am, not for the brand.
      </StickyNote>
    </SectionPanel>
  );
}

function VariantCard({
  letter,
  label,
  text,
  rationale,
}: {
  letter: string;
  label: string;
  text: string;
  rationale: string;
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
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-leaf-500">
        {label}
      </p>
      <p className="font-poppins mt-1 text-xl font-bold text-leaf-800">
        {text}
      </p>
      <p className="mt-3 text-xs text-leaf-600">{rationale}</p>
    </div>
  );
}

function AbTestBlock({ test }: { test: AbTest }) {
  return (
    <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-poppins text-base font-semibold text-leaf-700">
          {test.element}
        </h3>
        <Chip tone="muted">{test.id}</Chip>
      </div>
      <p className="mt-2 text-sm text-leaf-600">{test.hypothesis}</p>

      <p className="mt-3 rounded-xl border border-leaf-100 bg-leaf-50 p-3 text-xs leading-relaxed text-leaf-700">
        <span className="font-semibold">Source:</span> {test.source.text}{" "}
        <a
          href={test.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-words font-semibold underline underline-offset-2 transition-colors hover:text-peach-600"
        >
          {test.source.url}
        </a>
        {test.note && (
          <>
            <br />
            <span className="font-semibold">Note:</span> {test.note}
          </>
        )}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {test.variants.map((variant) => (
          <VariantCard
            key={variant.id}
            letter={variant.id}
            label={variant.label}
            text={variant.text}
            rationale={variant.rationale}
          />
        ))}
      </div>
    </div>
  );
}

function LandingPanel() {
  const splitAt = LANDING_COPY.headline.indexOf(". ");
  const heroLead =
    splitAt > -1
      ? LANDING_COPY.headline.slice(0, splitAt + 1)
      : LANDING_COPY.headline;
  const heroAccent =
    splitAt > -1 ? LANDING_COPY.headline.slice(splitAt + 2) : "";

  return (
    <div className="space-y-8">
      <div
        className={`grid overflow-hidden rounded-3xl border border-leaf-100 bg-white shadow-sm md:grid-cols-2 ${CARD_MOTION}`}
      >
        <div className="p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wide text-leaf-500">
            Hero copy
          </p>
          <p className="font-poppins mt-3 text-3xl font-extrabold leading-tight text-leaf-900">
            {heroLead}{" "}
            {heroAccent && (
              <span className="text-peach-500">{heroAccent}</span>
            )}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-leaf-700">
            {LANDING_COPY.subheadline}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-leaf-700 px-5 py-2.5 text-sm font-bold text-white">
              {LANDING_COPY.ctaButton}
            </span>
            <span className="rounded-full border-2 border-leaf-600 px-5 py-2 text-sm font-bold text-leaf-700">
              See how it works
            </span>
          </div>
        </div>

        <div className="relative min-h-[14rem] bg-leaf-50">
          <Image
            src={IMAGES.lunchboxSandwichFruit.src}
            alt={IMAGES.lunchboxSandwichFruit.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <p
            aria-hidden="true"
            className="font-caveat absolute left-4 top-4 max-w-[9rem] -rotate-6 rounded-xl bg-white/85 px-3 py-2 text-lg leading-tight text-leaf-700 shadow-sm"
          >
            Real ingredients. Real smiles.
          </p>
        </div>
      </div>

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

      {LANDING_COPY.tests.map((test) => (
        <AbTestBlock key={test.testName} test={test} />
      ))}
    </div>
  );
}

function PostCard({ post, index = 0 }: { post: SocialPost; index?: number }) {
  const image = imageFor(POST_IMAGES, post.id);

  return (
    <article
      style={riseDelay(index)}
      className={`flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm ${CARD_MOTION} ${CHANNEL_STYLE[post.channel].border}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-leaf-50">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3">
          <ChannelPill channel={post.channel} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-gray-400">{post.id}</span>
      </div>
      <h3 className="font-poppins mt-1 font-semibold text-leaf-800">
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
        <CardActions asset={postCardAsset(post)} className="mt-3" />
      </div>
    </article>
  );
}

function PostsPanel() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {SOCIAL_POSTS.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}

function ScriptCard({
  script,
  index = 0,
}: {
  script: VideoScript;
  index?: number;
}) {
  const image = imageFor(SCRIPT_IMAGES, script.id);

  return (
    <article
      style={riseDelay(index)}
      className={`overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm ${CARD_MOTION}`}
    >
      <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-leaf-50 md:aspect-auto md:min-h-[12rem]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 18rem"
            className="object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-base text-leaf-700 shadow-md"
            >
              ▶
            </span>
          </span>
          <span className="absolute bottom-3 right-3 rounded-full bg-gray-900/80 px-2.5 py-1 text-xs font-bold text-white">
            {script.duration}
          </span>
        </div>

        <div className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-poppins font-semibold text-leaf-800">
          {script.title}
        </h3>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
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

          <CardActions asset={scriptCardAsset(script)} className="mt-4" />
        </div>
      </div>
    </article>
  );
}

function ScriptsPanel() {
  return (
    <div className="space-y-6">
      {VIDEO_SCRIPTS.map((script, index) => (
        <ScriptCard key={script.id} script={script} index={index} />
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

const CONTENT_TYPE_ICON: Record<string, string> = {
  Carousel: "🖼️",
  Reel: "🎞️",
  Story: "⚡",
  "Short video": "🎬",
  "Static post": "📌",
  Poll: "📊",
  "Q&A": "💬",
};

// Every card gets a photo so the rows line up; the set rotates for variety.
const CALENDAR_PHOTOS = [
  IMAGES.lunchboxSandwichFruit,
  IMAGES.produceFlatlay,
  IMAGES.bentoTray,
  IMAGES.vegetablesCloseup,
  IMAGES.lunchboxRiceVeggies,
  IMAGES.freshProduce,
  IMAGES.lunchboxSaladBlue,
];

function CalendarCard({ day }: { day: CampaignDay }) {
  const photo = CALENDAR_PHOTOS[(day.day - 1) % CALENDAR_PHOTOS.length];

  return (
    <div
      style={riseDelay(day.day - 1)}
      className={`flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ${CARD_MOTION}`}
    >
      <div className="relative">
        <Photo
          image={photo}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 260px"
          className="h-24 w-full"
          rounded="rounded-none"
        />
        <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/95 font-poppins text-sm font-extrabold text-rose-600 shadow-sm">
          {day.day}
        </span>
        <span className="absolute right-3 top-3">
          <ChannelPill channel={day.channel} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-poppins text-sm font-bold text-leaf-900">
            {day.weekday}
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700">
            <span aria-hidden="true">
              {CONTENT_TYPE_ICON[day.contentType] ?? "📄"}
            </span>
            {day.contentType}
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm text-leaf-800">{day.topic}</p>

        <p className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-leaf-50 pt-3 text-xs text-leaf-600">
          <span aria-hidden="true">🔗</span>
          <span className="font-mono text-[11px] text-gray-400">
            {day.reference}
          </span>
          <span className="min-w-0 break-words">
            {REFERENCE_TITLES[day.reference]}
          </span>
        </p>

        <CardActions asset={calendarDayCardAsset(day)} className="mt-3" />
      </div>
    </div>
  );
}

function CalendarPanel() {
  const weeks = [
    CAMPAIGN_CALENDAR.filter((day) => day.day <= 7),
    CAMPAIGN_CALENDAR.filter((day) => day.day > 7),
  ];

  return (
    <SectionPanel tint={SECTION_THEME.calendar.panel} className="space-y-7">
      {weeks.map((days, index) => (
        <div key={index}>
          <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            <h3 className="font-poppins flex items-center gap-2 text-lg font-extrabold text-leaf-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm shadow-sm">
                <span aria-hidden="true">📅</span>
              </span>
              Week {index + 1}
            </h3>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-leaf-700 shadow-sm">
              Days {days[0].day} to {days[days.length - 1].day}
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {days.map((day) => (
              <CalendarCard key={day.day} day={day} />
            ))}
          </div>
        </div>
      ))}

      <StickyNote tone="peach" className={`max-w-md ${CARD_MOTION}`}>
        Two weeks planned. Nothing is published yet.
      </StickyNote>
    </SectionPanel>
  );
}

/* -------------------------------------------------------------------------- */
/* Overview                                                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

/** Sections that are one card as a whole, so their actions sit in the header. */
const PANEL_ASSETS: Partial<Record<MarketingTabId, () => CardAsset>> = {
  brand: brandCardAsset,
  persona: personaCardAsset,
  landing: landingCardAsset,
};

export default function MarketingClient() {
  const [activeTab, setActiveTab] = useState<MarketingTabId>("overview");
  const [exportState, setExportState] = useState<"idle" | "done" | "failed">(
    "idle",
  );
  const tabsRef = useRef<HTMLDivElement>(null);
  const exportTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(exportTimer.current), []);

  /** Builds the kit in the browser and hands it to the download. */
  function handleExport() {
    try {
      const blob = new Blob([buildExportText()], {
        type: "text/markdown;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = EXPORT_FILENAME;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportState("done");
      exportTimer.current = setTimeout(() => setExportState("idle"), 2000);
    } catch (error) {
      console.error("marketing kit export failed:", error);
      setExportState("failed");
    }
  }

  const activeIndex = MARKETING_TABS.findIndex((tab) => tab.id === activeTab);
  const active = MARKETING_TABS[activeIndex];
  const panelAsset = PANEL_ASSETS[activeTab]?.();

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
    <div className="font-inter bg-[#FDFBF6]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-peach-50 via-white to-leaf-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-600">
              {MARKETING_PAGE_COPY.eyebrow}
            </span>

            <h1 className="font-poppins mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-leaf-900 sm:text-5xl lg:text-6xl">
              {MARKETING_PAGE_COPY.heroTitleLead}
              <br />
              <span className="text-peach-500">
                {MARKETING_PAGE_COPY.heroTitleAccent}
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
              {MARKETING_PAGE_COPY.heroDescription}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => goToTab("posts")}
                className="inline-flex items-center gap-2 rounded-full bg-leaf-700 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-leaf-800"
              >
                {MARKETING_PAGE_COPY.primaryCta}
                <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                onClick={handleExport}
                className={`inline-flex items-center gap-2 rounded-full border px-6 py-3.5 text-sm font-bold transition-colors ${
                  exportState === "done"
                    ? "border-leaf-700 bg-leaf-700 text-white"
                    : "border-leaf-200 bg-white text-leaf-700 hover:bg-leaf-50"
                }`}
              >
                <span aria-hidden="true">
                  {exportState === "done" ? "✓" : "⬇"}
                </span>
                {exportState === "done"
                  ? MARKETING_PAGE_COPY.exportDone
                  : MARKETING_PAGE_COPY.exportAll}
              </button>
            </div>

            {exportState === "failed" && (
              <p role="alert" className="mt-3 text-xs text-peach-700">
                <span aria-hidden="true">⚠️</span>{" "}
                {MARKETING_PAGE_COPY.exportFailed}
              </p>
            )}
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroArt />
          </div>
        </div>
      </section>

      {/* Tab bar */}
      <div ref={tabsRef} className="border-y border-leaf-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div
            role="tablist"
            aria-label={MARKETING_PAGE_COPY.eyebrow}
            onKeyDown={handleTabKeys}
            className="flex gap-6 overflow-x-auto whitespace-nowrap"
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
                  className={`relative shrink-0 py-4 text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-leaf-700"
                      : "text-gray-500 hover:text-leaf-700"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-leaf-700"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panels */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          <SectionBanner
            key={activeTab}
            tabId={activeTab}
            title={
              activeTab === "overview"
                ? MARKETING_PAGE_COPY.overviewHeading
                : active.cardTitle
            }
            subtitle={
              activeTab === "overview"
                ? MARKETING_PAGE_COPY.overviewHelp
                : active.summary
            }
            note={BRAND.tagline}
            actions={panelAsset ? <CardActions asset={panelAsset} /> : null}
          />

          <div className="mt-6">
            {activeTab === "overview" && <OverviewCards onSelect={goToTab} />}
            {activeTab === "brand" && <BrandPanel />}
            {activeTab === "persona" && <PersonaPanel />}
            {activeTab === "landing" && <LandingPanel />}
            {activeTab === "posts" && <PostsPanel />}
            {activeTab === "scripts" && <ScriptsPanel />}
            {activeTab === "calendar" && <CalendarPanel />}
            {activeTab === "ab-testing" && <AbTester />}
            {activeTab === "saved" && <SavedAssets />}
          </div>
        </div>

        {/* Closing call to action */}
        <div className="mt-12 flex flex-col items-center gap-5 rounded-3xl bg-gradient-to-r from-peach-100 to-rose-100 px-6 py-8 text-center sm:px-10 md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-5">
            <span
              aria-hidden="true"
              className="hidden text-5xl leading-none text-leaf-600 sm:block"
            >
              ♡
            </span>
            <div>
              <h2 className="font-poppins text-xl font-extrabold text-leaf-900 sm:text-2xl">
                {MARKETING_CLOSING_CTA.headingLead}{" "}
                <span className="text-peach-500">
                  {MARKETING_CLOSING_CTA.headingAccent}
                </span>
                {MARKETING_CLOSING_CTA.headingTail}
              </h2>
              <p className="mt-1.5 text-sm text-leaf-700 sm:text-base">
                {MARKETING_CLOSING_CTA.description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => goToTab("posts")}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-leaf-700 px-7 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-leaf-800"
          >
            {MARKETING_CLOSING_CTA.cta}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
