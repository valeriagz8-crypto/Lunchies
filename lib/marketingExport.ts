/**
 * Pure builders for the marketing kit export, the per-card text and the
 * marketing_assets payloads. No React, no Supabase, no browser APIs, so all
 * of it can be unit tested with Vitest.
 */

import {
  BRAND,
  CAMPAIGN_CALENDAR,
  LANDING_COPY,
  PERSONA,
  SOCIAL_POSTS,
  VIDEO_SCRIPTS,
  type AbTest,
  type CampaignDay,
  type SocialPost,
  type VideoScript,
} from "./marketingData";

export type AssetType =
  | "Social post"
  | "Video script"
  | "Calendar"
  | "Copy"
  | "Brand asset";

export const ASSET_TYPES: AssetType[] = [
  "Social post",
  "Video script",
  "Calendar",
  "Copy",
  "Brand asset",
];

/** A card's copyable text plus the title and type it is saved under. */
export type CardAsset = {
  title: string;
  assetType: AssetType;
  text: string;
};

export type AssetInput = {
  title: string;
  assetType: AssetType;
  content: string;
};

/** A row as it is inserted into marketing_assets. */
export type AssetPayload = {
  title: string;
  asset_type: AssetType;
  content: string;
};

export const EXPORT_FILENAME = "lunchies-marketing-kit.md";

function joinBlocks(blocks: string[]): string {
  return blocks.filter(Boolean).join("\n\n");
}

/* -------------------------------------------------------------------------- */
/* Per-card text                                                              */
/* -------------------------------------------------------------------------- */

export function brandCardAsset(): CardAsset {
  const colors = Object.values(BRAND.colors)
    .map((color) => `- ${color.name}: ${color.hex} (${color.tailwind}) — ${color.usage}`)
    .join("\n");

  const fonts = [BRAND.fonts.headings, BRAND.fonts.text]
    .map((font) => `- ${font.role}: ${font.family} (${font.weights.join(", ")})`)
    .join("\n");

  const voice = BRAND.voice
    .map((item) => `- ${item.word}: ${item.meaning} ${item.soundsLike}`)
    .join("\n");

  return {
    title: `Brand system: ${BRAND.name}`,
    assetType: "Brand asset",
    text: joinBlocks([
      `Brand system: ${BRAND.name}`,
      `Tagline: ${BRAND.tagline}`,
      `Colors:\n${colors}`,
      `Fonts:\n${fonts}`,
      `Brand voice:\n${voice}`,
    ]),
  };
}

export function personaCardAsset(): CardAsset {
  const insights = PERSONA.insights
    .map((insight) => `- ${insight.title}: ${insight.detail}`)
    .join("\n");

  return {
    title: `Target persona: ${PERSONA.name}`,
    assetType: "Brand asset",
    text: joinBlocks([
      `Target persona: ${PERSONA.name}`,
      `Age: ${PERSONA.ageRange}`,
      `Location: ${PERSONA.location}`,
      PERSONA.description,
      `Insights:\n${insights}`,
    ]),
  };
}

function abTestText(test: AbTest): string {
  const variants = test.variants
    .map(
      (variant) =>
        `- ${variant.id} (${variant.label}): ${variant.text} — ${variant.rationale}`,
    )
    .join("\n");

  return [
    `A/B test: ${test.element} [${test.testName}]`,
    `Question: ${test.question}`,
    `Hypothesis: ${test.hypothesis}`,
    variants,
    `Source: ${test.source.text} ${test.source.url}`,
    test.note ? `Note: ${test.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function landingCardAsset(): CardAsset {
  return {
    title: "Landing copy: hero and call to action",
    assetType: "Copy",
    text: joinBlocks([
      "Landing copy",
      `Headline: ${LANDING_COPY.headline}`,
      `Subheadline: ${LANDING_COPY.subheadline}`,
      `Call to action: ${LANDING_COPY.callToAction}`,
      `Button: ${LANDING_COPY.ctaButton}`,
      ...LANDING_COPY.tests.map(abTestText),
    ]),
  };
}

export function postCardAsset(post: SocialPost): CardAsset {
  return {
    title: `Social post: ${post.title}`,
    assetType: "Social post",
    text: joinBlocks([
      `${post.channel} — ${post.title}`,
      post.caption,
      post.hashtags.join(" "),
    ]),
  };
}

export function scriptCardAsset(script: VideoScript): CardAsset {
  return {
    title: `Video script: ${script.title}`,
    assetType: "Video script",
    text: joinBlocks([
      `${script.title} (${script.duration})`,
      `Hook: ${script.hook}`,
      `Problem: ${script.problem}`,
      `Solution: ${script.solution}`,
      `Call to action: ${script.callToAction}`,
      script.productionNote ? `Production note: ${script.productionNote}` : "",
    ]),
  };
}

export function calendarDayCardAsset(day: CampaignDay): CardAsset {
  return {
    title: `Calendar day ${day.day}: ${day.topic}`,
    assetType: "Calendar",
    text: joinBlocks([
      `Day ${day.day} — ${day.weekday}`,
      `Channel: ${day.channel}`,
      `Content type: ${day.contentType}`,
      `Topic: ${day.topic}`,
      `Asset: ${day.reference}`,
    ]),
  };
}

/* -------------------------------------------------------------------------- */
/* Full kit export                                                            */
/* -------------------------------------------------------------------------- */

/**
 * The whole marketing kit as Markdown, in a fixed order: brand, persona,
 * landing copy, social posts, video scripts, campaign calendar.
 */
export function buildExportText(): string {
  const sections: string[] = [];

  sections.push(`# ${BRAND.name} marketing kit`);
  sections.push(`_${BRAND.tagline}_`);

  // 1. Brand
  sections.push("## Brand system");
  sections.push(`**Tagline:** ${BRAND.tagline}`);
  sections.push("### Colors");
  sections.push(
    Object.values(BRAND.colors)
      .map(
        (color) =>
          `- **${color.name}** \`${color.hex}\` (${color.tailwind}) — ${color.usage}`,
      )
      .join("\n"),
  );
  sections.push("### Fonts");
  sections.push(
    [BRAND.fonts.headings, BRAND.fonts.text]
      .map(
        (font) =>
          `- **${font.family}** for ${font.role} — weights ${font.weights.join(", ")}, fallback ${font.fallback}`,
      )
      .join("\n"),
  );
  sections.push("### Brand voice");
  sections.push(
    BRAND.voice
      .map((item) => `- **${item.word}** — ${item.meaning} ${item.soundsLike}`)
      .join("\n"),
  );

  // 2. Persona
  sections.push("## Target persona");
  sections.push(`**${PERSONA.name}** · ${PERSONA.ageRange} · ${PERSONA.location}`);
  sections.push(PERSONA.description);
  sections.push(
    PERSONA.insights
      .map((insight) => `- **${insight.title}** — ${insight.detail}`)
      .join("\n"),
  );

  // 3. Landing copy
  sections.push("## Landing copy");
  sections.push(`**Headline:** ${LANDING_COPY.headline}`);
  sections.push(`**Subheadline:** ${LANDING_COPY.subheadline}`);
  sections.push(`**Call to action:** ${LANDING_COPY.callToAction}`);
  sections.push(`**Button:** ${LANDING_COPY.ctaButton}`);

  sections.push("## A/B tests");
  for (const test of LANDING_COPY.tests) {
    sections.push(`### ${test.element} \`${test.testName}\``);
    sections.push(`**Question:** ${test.question}`);
    sections.push(`_${test.hypothesis}_`);
    sections.push(
      test.variants
        .map(
          (variant) =>
            `- **${variant.id} (${variant.label}):** ${variant.text} — ${variant.rationale}`,
        )
        .join("\n"),
    );
    sections.push(`**Source:** ${test.source.text} <${test.source.url}>`);
    if (test.note) sections.push(`**Note:** ${test.note}`);
  }

  // 4. Social posts
  sections.push(`## Social posts (${SOCIAL_POSTS.length})`);
  for (const post of SOCIAL_POSTS) {
    sections.push(`### ${post.title}`);
    sections.push(`**Channel:** ${post.channel} · \`${post.id}\``);
    sections.push(post.caption);
    sections.push(post.hashtags.join(" "));
  }

  // 5. Video scripts
  sections.push(`## Video scripts (${VIDEO_SCRIPTS.length})`);
  for (const script of VIDEO_SCRIPTS) {
    sections.push(`### ${script.title} (${script.duration})`);
    sections.push(`**Hook:** ${script.hook}`);
    sections.push(`**Problem:** ${script.problem}`);
    sections.push(`**Solution:** ${script.solution}`);
    sections.push(`**Call to action:** ${script.callToAction}`);
    if (script.productionNote) {
      sections.push(`> **Production note:** ${script.productionNote}`);
    }
  }

  // 6. Calendar
  sections.push(`## Campaign calendar (${CAMPAIGN_CALENDAR.length} days)`);
  sections.push("| Day | Weekday | Channel | Content type | Topic | Asset |");
  sections.push("| --- | --- | --- | --- | --- | --- |");
  for (const day of CAMPAIGN_CALENDAR) {
    sections.push(
      `| ${day.day} | ${day.weekday} | ${day.channel} | ${day.contentType} | ${day.topic} | ${day.reference} |`,
    );
  }

  return `${sections.join("\n\n")}\n`;
}

/* -------------------------------------------------------------------------- */
/* Saving assets                                                              */
/* -------------------------------------------------------------------------- */

export const ASSET_ERRORS = {
  title: "Please add a title before saving.",
  content: "Please add some content before saving.",
} as const;

/** Returns an error message, or null when the asset is good to save. */
export function validateAsset(input: {
  title: string;
  content: string;
}): string | null {
  if (!input.title.trim()) return ASSET_ERRORS.title;
  if (!input.content.trim()) return ASSET_ERRORS.content;
  return null;
}

/** Shapes a marketing_assets row. Trims so stray whitespace never gets saved. */
export function buildAssetPayload(input: AssetInput): AssetPayload {
  return {
    title: input.title.trim(),
    asset_type: input.assetType,
    content: input.content.trim(),
  };
}
