import type { LucideIcon } from "lucide-react";

/**
 * Shared visual language for the project pages (/core, /product, /research,
 * /pricing, /docs), taken from the mockups in mockups/redesign.
 *
 * Purely presentational: every token here is a class name, never copy or data.
 */
export type TintName = "green" | "peach" | "pink" | "blue" | "cream" | "plain";

export type Tint = {
  /** Card surface. The mockup cards carry a soft top-to-bottom wash. */
  card: string;
  /** Pale circle behind an icon or emoji. */
  badge: string;
  /** Icon colour inside that circle. */
  badgeInk: string;
  /** Accent text colour for headings and small highlights. */
  accent: string;
  /** Flat tint with no border, for table headers and inner strips. */
  strip: string;
  /** Hairline used for row separators inside a card of this tint. */
  rule: string;
};

export const TINT: Record<TintName, Tint> = {
  green: {
    card: "border-leaf-100/70 bg-gradient-to-b from-[#eff8f1] to-[#e3f1e7]",
    badge: "bg-leaf-100",
    badgeInk: "text-leaf-700",
    accent: "text-leaf-700",
    strip: "bg-leaf-100/70",
    rule: "border-leaf-200/60",
  },
  peach: {
    card: "border-peach-100/70 bg-gradient-to-b from-[#fdf1e6] to-[#fce7d6]",
    badge: "bg-peach-100",
    badgeInk: "text-peach-500",
    accent: "text-peach-700",
    strip: "bg-peach-100/70",
    rule: "border-peach-200/60",
  },
  pink: {
    card: "border-rose-100/70 bg-gradient-to-b from-[#fdeff1] to-[#fbe4e8]",
    badge: "bg-rose-100",
    badgeInk: "text-rose-500",
    accent: "text-rose-700",
    strip: "bg-rose-100/70",
    rule: "border-rose-200/60",
  },
  blue: {
    card: "border-sky-100/70 bg-gradient-to-b from-[#eef5fd] to-[#e2edfb]",
    badge: "bg-sky-100",
    badgeInk: "text-sky-600",
    accent: "text-sky-700",
    strip: "bg-sky-100/70",
    rule: "border-sky-200/60",
  },
  cream: {
    card: "border-cream-200/70 bg-gradient-to-b from-[#fdf6ea] to-[#fbeeda]",
    badge: "bg-cream-200",
    badgeInk: "text-amber-600",
    accent: "text-amber-800",
    strip: "bg-cream-200/80",
    rule: "border-cream-300/60",
  },
  plain: {
    card: "border-white bg-white",
    badge: "bg-leaf-50",
    badgeInk: "text-leaf-600",
    accent: "text-leaf-700",
    strip: "bg-leaf-50",
    rule: "border-leaf-100",
  },
};

/** The warm cream page background, matched to the mockups. */
export const PAGE_BG = "bg-cream-50";

/**
 * The big soft card from the mockups: a generous radius, a hairline border and
 * a wide, very low-contrast shadow. min-w-0 matters because these are grid
 * items and a wide table would otherwise push the page sideways.
 */
export const CARD =
  "min-w-0 rounded-[28px] border shadow-card transition-shadow duration-200";

/** Primary action: deep green, fully rounded, generous padding. */
export const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2.5 rounded-full bg-leaf-700 px-8 py-3.5 text-[15px] font-bold text-white shadow-btn transition-colors hover:bg-leaf-800 disabled:cursor-not-allowed disabled:opacity-60";

/** Secondary action: orange, same shape. */
export const BTN_SECONDARY =
  "inline-flex items-center justify-center gap-2.5 rounded-full bg-peach-500 px-7 py-3 text-[15px] font-bold text-white shadow-btn transition-colors hover:bg-peach-600 disabled:cursor-not-allowed disabled:opacity-60";

/** Quiet action: white pill with a hairline. */
export const BTN_GHOST =
  "inline-flex items-center justify-center gap-2 rounded-full border border-leaf-200 bg-white px-6 py-3 text-sm font-bold text-leaf-700 shadow-sm transition-colors hover:bg-leaf-50 disabled:cursor-not-allowed disabled:opacity-50";

/** Small pale-green pill used for row actions, like View. */
export const BTN_ROW =
  "inline-flex items-center justify-center rounded-full bg-leaf-100 px-4 py-1.5 text-xs font-bold text-leaf-700 transition-colors hover:bg-leaf-200";

/** Small pale-red square-ish button used for destructive row actions. */
export const BTN_ROW_DANGER =
  "inline-flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs text-rose-500 transition-colors hover:bg-rose-100";

/** Unselected chip: white with a coloured hairline and coloured ink. */
export const CHIP_GREEN =
  "rounded-full border border-leaf-200 bg-white px-3.5 py-1.5 text-[13px] font-bold text-leaf-700 shadow-sm transition-colors hover:bg-leaf-50";
export const CHIP_GREEN_ON =
  "rounded-full border border-leaf-700 bg-leaf-700 px-3.5 py-1.5 text-[13px] font-bold text-white shadow-sm transition-colors";
export const CHIP_PEACH =
  "rounded-full border border-peach-200 bg-white px-3.5 py-1.5 text-[13px] font-bold text-peach-500 shadow-sm transition-colors hover:bg-peach-50";
export const CHIP_PEACH_ON =
  "rounded-full border border-peach-500 bg-peach-500 px-3.5 py-1.5 text-[13px] font-bold text-white shadow-sm transition-colors";

/** Text inputs, selects and the like. */
export const FIELD =
  "w-full rounded-2xl border border-leaf-100 bg-white px-5 py-3 text-[15px] text-leaf-900 shadow-sm transition-colors focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100";

/** Label above a field or a group of chips. */
export const FIELD_LABEL = "block text-[15px] font-bold text-leaf-900";

/** Section heading inside a card. */
export const CARD_TITLE =
  "font-poppins text-[26px] font-extrabold leading-tight tracking-tight text-leaf-900 sm:text-[30px]";

export const CARD_SUBTITLE = "mt-1.5 text-[15px] text-leaf-600";

export type StepIcon = LucideIcon;
