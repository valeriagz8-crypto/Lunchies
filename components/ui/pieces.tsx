import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CARD,
  CARD_SUBTITLE,
  CARD_TITLE,
  PAGE_BG,
  TINT,
  type TintName,
} from "./theme";

/**
 * Small presentational building blocks shared by the redesigned project pages.
 *
 * None of these components own copy or data: every word comes in from the page
 * that renders them. They only decide how things look.
 */

/* ------------------------------------------------------------------ page */

/** Warm cream page background plus the shared content width and rhythm. */
export function PageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${PAGE_BG} ${className}`}>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ decoration */

/**
 * The little hand-drawn dash bursts from the mockups. Pure CSS/SVG decoration,
 * never carries meaning, so it is hidden from assistive tech.
 */
export function Sparkle({
  className = "",
  color = "peach",
}: {
  className?: string;
  color?: "peach" | "leaf";
}) {
  const stroke = color === "peach" ? "#fb7d1c" : "#2f7d49";
  return (
    <svg
      viewBox="0 0 40 32"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none select-none ${className}`}
    >
      <g
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      >
        <path d="M6 20 L14 6" />
        <path d="M18 16 L24 3" />
        <path d="M29 17 L37 7" />
      </g>
    </svg>
  );
}

/** Soft pastel blob used behind hero art. Decorative only. */
export function Blob({
  className = "",
  tone = "leaf",
}: {
  className?: string;
  tone?: "leaf" | "peach" | "cream";
}) {
  const fill =
    tone === "peach" ? "#ffedd9" : tone === "cream" ? "#faf0e2" : "#e0f3e5";
  return (
    <svg
      viewBox="0 0 200 180"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute select-none ${className}`}
    >
      <path
        fill={fill}
        d="M43 18c26-18 70-22 103-6 33 16 50 52 48 85-3 33-25 62-57 71-32 9-74 1-97-23C17 121 10 83 19 55c5-15 11-27 24-37Z"
      />
    </svg>
  );
}

/* ----------------------------------------------------------- icon badges */

/**
 * A consistent icon badge: a tinted circle holding either a lucide icon or the
 * emoji the page already shows in that spot.
 */
export function IconBadge({
  tint = "green",
  size = "md",
  icon: Icon,
  children,
  className = "",
}: {
  tint?: TintName;
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  children?: ReactNode;
  className?: string;
}) {
  const box =
    size === "lg"
      ? "h-14 w-14 text-2xl"
      : size === "sm"
        ? "h-9 w-9 text-base"
        : "h-11 w-11 text-xl";
  const glyph = size === "lg" ? "h-6 w-6" : size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <span
      className={`flex ${box} shrink-0 items-center justify-center rounded-2xl ${TINT[tint].badge} ${className}`}
    >
      {Icon ? <Icon className={glyph} aria-hidden="true" /> : children}
    </span>
  );
}

/** The round numbered pill used for ordered steps. */
export function StepPill({
  children,
  tone = "leaf",
  size = "md",
  className = "",
}: {
  children: ReactNode;
  tone?: "leaf" | "peach";
  size?: "sm" | "md";
  className?: string;
}) {
  const box = size === "sm" ? "h-6 w-6 text-[11px]" : "h-8 w-8 text-sm";
  const colour =
    tone === "peach"
      ? "bg-peach-500 text-white"
      : "bg-leaf-600 text-white";
  return (
    <span
      className={`flex ${box} shrink-0 items-center justify-center rounded-full font-bold shadow-sm ${colour} ${className}`}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------- cards */

/** Large rounded card with a soft shadow and a pastel tint. */
export function Card({
  tint = "plain",
  children,
  className = "",
  id,
}: {
  tint?: TintName;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={`${CARD} ${TINT[tint].card} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card header: optional step pill, an icon badge, the title and a subtitle,
 * with room for an action on the right.
 */
export function CardHead({
  step,
  stepTone,
  badge,
  title,
  subtitle,
  action,
  className = "",
}: {
  step?: ReactNode;
  stepTone?: "leaf" | "peach";
  badge?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-start justify-between gap-x-4 gap-y-3 ${className}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
        {step !== undefined && <StepPill tone={stepTone}>{step}</StepPill>}
        {badge}
        <div className="min-w-0">
          <h2 className={CARD_TITLE}>{title}</h2>
          {subtitle !== undefined && <p className={CARD_SUBTITLE}>{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ hero */

/**
 * Page hero: a small uppercase label, a big bold heading, a short subtitle and
 * whatever the page already shows on the right.
 */
export function PageHero({
  label,
  title,
  subtitle,
  actions,
  art,
}: {
  label?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  art?: ReactNode;
}) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-[1.15fr_1fr]">
      <div className="relative">
        {label}
        <h1 className="mt-4 font-poppins text-4xl font-extrabold leading-[1.08] tracking-tight text-leaf-900 sm:text-5xl">
          {title}
        </h1>
        {subtitle !== undefined && (
          <p className="mt-4 max-w-md text-base text-leaf-700 sm:text-lg">
            {subtitle}
          </p>
        )}
        {actions}
      </div>
      {art}
    </div>
  );
}

/** The uppercase eyebrow above a hero heading. */
export function HeroLabel({
  badge,
  children,
}: {
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      {badge}
      <span className="font-poppins text-xs font-extrabold uppercase tracking-[0.18em] text-leaf-700">
        {children}
      </span>
    </div>
  );
}

/**
 * The hero art slot: the page's existing emoji, floated on a pastel blob with
 * a couple of decorative dashes.
 */
export function HeroArt({
  children,
  tone = "leaf",
  size = "text-[5.5rem] sm:text-[7rem]",
}: {
  children: ReactNode;
  tone?: "leaf" | "peach" | "cream";
  size?: string;
}) {
  return (
    <div className="relative flex min-h-[180px] items-center justify-center sm:min-h-[230px]">
      <Blob
        tone={tone}
        className="left-1/2 top-1/2 h-[200px] w-[230px] -translate-x-1/2 -translate-y-1/2 sm:h-[250px] sm:w-[290px]"
      />
      <Sparkle className="absolute left-2 top-4 h-7 w-9 sm:left-0" color="peach" />
      <Sparkle
        className="absolute bottom-5 right-3 h-6 w-8 rotate-180 sm:right-0"
        color="leaf"
      />
      <span className={`relative ${size} leading-none`} aria-hidden="true">
        {children}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------ step strip */

/** The rounded strip of numbered steps shown under a hero. */
export function StepStrip({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-3 rounded-full border border-leaf-100/80 bg-white px-4 py-3 text-center text-xs font-semibold text-leaf-800 shadow-soft sm:px-6 sm:text-sm ${className}`}
    >
      {children}
    </div>
  );
}

/** One step inside a StepStrip. */
export function StepItem({
  index,
  children,
}: {
  index: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="flex items-center gap-2">
      <StepPill size="sm">{index}</StepPill>
      <span className="flex flex-wrap items-center gap-1">{children}</span>
    </span>
  );
}

/** The arrow between two steps. Decorative, so the page still passes it in. */
export function StepArrow({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden="true" className="text-peach-400">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------ stat tiles */

/** A pastel stat tile: a tinted icon, a big number and a small label. */
export function StatTile({
  tint = "green",
  icon,
  value,
  label,
}: {
  tint?: TintName;
  icon: ReactNode;
  value: ReactNode;
  label: ReactNode;
}) {
  return (
    <div
      className={`${CARD} ${TINT[tint].card} flex flex-col items-center gap-1 p-4 text-center sm:p-5`}
    >
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>
      <p className="font-poppins text-xl font-extrabold text-leaf-900 sm:text-2xl">
        {value}
      </p>
      <p className="text-xs font-medium text-leaf-600">{label}</p>
    </div>
  );
}

/* --------------------------------------------------------------- tables */

/** Shared table shell: scrolls on its own so the page never scrolls sideways. */
export function TableWrap({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`-mx-2 overflow-x-auto px-2 ${className}`}>{children}</div>
  );
}

/** Rounded pill used for a type/tag value inside a table row. */
export function TagPill({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={style}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  );
}
