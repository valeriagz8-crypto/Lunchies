import type { LucideIcon } from "lucide-react";

/**
 * Shared visual language for the project pages (/core, /product, /research,
 * /pricing, /docs). Purely presentational: every token here is a class name,
 * never copy or data.
 *
 * The look is taken from the redesign mockups: large rounded cards with soft
 * shadows and pastel tints on a warm cream page.
 */
export type TintName = "green" | "peach" | "pink" | "blue" | "cream" | "plain";

export type Tint = {
  /** Card surface + border. */
  card: string;
  /** Tinted circle behind an icon or emoji. */
  badge: string;
  /** Accent text colour used for headings and small highlights. */
  accent: string;
  /** Flat tint with no border, for table headers and inner strips. */
  strip: string;
  /** Hairline used for row separators inside a card of this tint. */
  rule: string;
};

export const TINT: Record<TintName, Tint> = {
  green: {
    card: "border-leaf-100/80 bg-leaf-50",
    badge: "bg-leaf-100 text-leaf-700",
    accent: "text-leaf-700",
    strip: "bg-leaf-100/70",
    rule: "border-leaf-100",
  },
  peach: {
    card: "border-peach-100/80 bg-peach-50",
    badge: "bg-peach-100 text-peach-600",
    accent: "text-peach-700",
    strip: "bg-peach-100/70",
    rule: "border-peach-100",
  },
  pink: {
    card: "border-rose-100/80 bg-rose-50",
    badge: "bg-rose-100 text-rose-600",
    accent: "text-rose-700",
    strip: "bg-rose-100/70",
    rule: "border-rose-100",
  },
  blue: {
    card: "border-sky-100/80 bg-sky-50",
    badge: "bg-sky-100 text-sky-600",
    accent: "text-sky-700",
    strip: "bg-sky-100/70",
    rule: "border-sky-100",
  },
  cream: {
    card: "border-cream-200/80 bg-cream-100",
    badge: "bg-cream-200 text-amber-700",
    accent: "text-amber-800",
    strip: "bg-cream-200/80",
    rule: "border-cream-200",
  },
  plain: {
    card: "border-leaf-100/70 bg-white",
    badge: "bg-leaf-50 text-leaf-600",
    accent: "text-leaf-700",
    strip: "bg-leaf-50",
    rule: "border-leaf-100",
  },
};

/** The warm cream page background every redesigned page sits on. */
export const PAGE_BG = "bg-cream-50";

/** Large rounded card with the soft shadow used across the redesign. */
export const CARD =
  "rounded-3xl border shadow-soft transition-shadow duration-200";

/** Rounded pill buttons. Green is primary, orange is secondary. */
export const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-leaf-600 px-7 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60";

export const BTN_SECONDARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-peach-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-peach-600 disabled:cursor-not-allowed disabled:opacity-60";

export const BTN_GHOST =
  "inline-flex items-center justify-center gap-2 rounded-full border border-leaf-200 bg-white px-5 py-2.5 text-sm font-semibold text-leaf-700 shadow-sm transition-colors hover:bg-leaf-50 disabled:cursor-not-allowed disabled:opacity-50";

/** Small rounded action button used inside table rows. */
export const BTN_ROW =
  "inline-flex items-center justify-center rounded-full border border-leaf-200 bg-white px-4 py-1.5 text-xs font-semibold text-leaf-700 shadow-sm transition-colors hover:bg-leaf-50";

export const BTN_ROW_DANGER =
  "inline-flex items-center justify-center rounded-full border border-rose-200 bg-white px-2.5 py-1.5 text-xs text-rose-500 shadow-sm transition-colors hover:bg-rose-50";

/** Text inputs, selects and the like. */
export const FIELD =
  "w-full rounded-2xl border border-leaf-100 bg-white px-4 py-2.5 text-sm text-leaf-900 shadow-sm transition-colors focus:border-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-100";

/** Soft label above a field or a group of chips. */
export const FIELD_LABEL =
  "block text-sm font-semibold text-leaf-800";

/** Section heading inside a card. */
export const CARD_TITLE =
  "font-poppins text-xl font-bold tracking-tight text-leaf-900 sm:text-2xl";

export const CARD_SUBTITLE = "mt-1 text-sm text-leaf-600";

export type StepIcon = LucideIcon;
