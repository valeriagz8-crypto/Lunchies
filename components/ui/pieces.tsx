import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import {
  CARD,
  CARD_SUBTITLE,
  CARD_TITLE,
  PAGE_BG,
  TINT,
  type TintName,
} from "./theme";

/**
 * Presentational building blocks shared by the redesigned project pages.
 *
 * None of these components own copy or data: every word comes in from the page
 * that renders them. They only decide how things look.
 */

/* ------------------------------------------------------------------ page */

/** Warm cream page background plus the shared content width and rhythm. */
export function PageShell({
  children,
  className = "",
  width = "max-w-5xl",
}: {
  children: ReactNode;
  className?: string;
  /** Content width. Long-form pages read better a little narrower. */
  width?: string;
}) {
  return (
    <div className={`${PAGE_BG} ${className}`}>
      <div className={`mx-auto ${width} px-5 py-8 sm:px-6 sm:py-11`}>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ decoration */

/**
 * The little hand-drawn dash bursts from the mockups. Pure decoration, so it
 * is hidden from assistive tech.
 */
export function Sparkle({
  className = "",
  color = "peach",
}: {
  className?: string;
  color?: "peach" | "leaf";
}) {
  const stroke = color === "peach" ? "#fb7d1c" : "#1f6b3a";
  return (
    <svg
      viewBox="0 0 44 34"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none select-none ${className}`}
    >
      <g stroke={stroke} strokeWidth="3.6" strokeLinecap="round" fill="none">
        <path d="M5 23 L13 7" />
        <path d="M19 18 L25 4" />
        <path d="M31 19 L41 9" />
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
    tone === "peach" ? "#fbe6d3" : tone === "cream" ? "#f7ecda" : "#dcecdf";
  return (
    <svg
      viewBox="0 0 220 190"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute select-none ${className}`}
    >
      <path
        fill={fill}
        d="M40 32C66 7 116 0 152 12c36 12 59 43 62 78 3 35-17 70-50 83-33 13-80 8-108-16C28 134 14 101 17 72c2-17 10-29 23-40Z"
      />
    </svg>
  );
}

/* ----------------------------------------------------------- icon badges */

/**
 * The round icon badge from the mockups: a pale tinted circle holding either a
 * lucide icon or the emoji the page already shows in that spot.
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
        ? "h-10 w-10 text-base"
        : "h-12 w-12 text-xl";
  const glyph =
    size === "lg" ? "h-7 w-7" : size === "sm" ? "h-[18px] w-[18px]" : "h-6 w-6";

  return (
    <span
      className={`flex ${box} shrink-0 items-center justify-center rounded-full ${TINT[tint].badge} ${TINT[tint].badgeInk} ${className}`}
    >
      {Icon ? <Icon className={glyph} aria-hidden="true" strokeWidth={2.2} /> : children}
    </span>
  );
}

/** Solid numbered circle, used for section numbers. */
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
  const box =
    size === "sm" ? "h-6 w-6 text-[11px] lg:h-7 lg:w-7 lg:text-[13px]" : "h-7 w-7 text-xs";
  const colour =
    tone === "peach" ? "bg-peach-500 text-white" : "bg-leaf-700 text-white";
  return (
    <span
      className={`flex ${box} shrink-0 items-center justify-center rounded-full font-extrabold ${colour} ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Outlined numbered circle — the ringed orange number the mockups use in
 * "how it works" style lists.
 */
export function StepRing({
  children,
  tone = "peach",
}: {
  children: ReactNode;
  tone?: "peach" | "leaf";
}) {
  const colour =
    tone === "leaf"
      ? "border-leaf-500 text-leaf-700"
      : "border-peach-400 text-peach-500";
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-white/70 font-poppins text-sm font-bold ${colour}`}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------- cards */

/** Large rounded card with a soft shadow and a pastel wash. */
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
 * Card header: optional step pill, a round icon badge, the title and a
 * subtitle, with room for an action on the right.
 */
export function CardHead({
  step,
  stepTone,
  badge,
  title,
  subtitle,
  action,
  className = "",
  titleClassName = "",
}: {
  step?: ReactNode;
  stepTone?: "leaf" | "peach";
  badge?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  /** Extra classes on the <h2>, for headings that hold more than a title. */
  titleClassName?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-start justify-between gap-x-4 gap-y-3 ${className}`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
        {step !== undefined && (
          <span className="mt-1.5 shrink-0">
            <StepPill tone={stepTone}>{step}</StepPill>
          </span>
        )}
        {badge !== undefined && <span className="shrink-0">{badge}</span>}
        <div className="min-w-0">
          <h2 className={`${CARD_TITLE} ${titleClassName}`}>{title}</h2>
          {subtitle !== undefined && (
            <p className={CARD_SUBTITLE}>{subtitle}</p>
          )}
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
  subtitleWidth = "max-w-[30rem]",
  actions,
  art,
}: {
  label?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Set so the subtitle wraps where the page's mockup wraps it. */
  subtitleWidth?: string;
  actions?: ReactNode;
  art?: ReactNode;
}) {
  return (
    <div className="grid items-center gap-5 md:grid-cols-[1.25fr_1fr] md:gap-3 lg:grid-cols-[1.08fr_1fr]">
      <div className="relative">
        {label}
        <h1 className="mt-3 font-poppins text-[36px] font-extrabold leading-[1.06] tracking-[-0.02em] text-leaf-900 sm:text-[44px] lg:text-[56px]">
          {title}
        </h1>
        {subtitle !== undefined && (
          <p className={`mt-4 text-[17px] leading-relaxed text-leaf-700 lg:text-[19px] ${subtitleWidth}`}>
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
    <div className="flex items-center gap-2.5">
      {badge}
      <span className="font-poppins text-[13px] font-extrabold uppercase tracking-[0.2em] text-leaf-700">
        {children}
      </span>
    </div>
  );
}

/**
 * A decorative glyph the page already renders that the redesign no longer
 * shows: it stays in the DOM, transparent and out of flow, so the page's text
 * content is exactly what it was before. These glyphs are always ones the page
 * already marked aria-hidden, so nothing is hidden from assistive tech that
 * was not hidden already.
 */
export function KeptGlyph({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 select-none text-[10px] leading-none opacity-0"
    >
      {children}
    </span>
  );
}

/**
 * Hero art slot: a decorative illustration floated on a soft blob with a
 * couple of hand-drawn dashes, exactly as the mockups stage it.
 *
 * `glyph` is the emoji the page used to show here; it is kept in the DOM by
 * KeptGlyph so the page text does not change.
 */
export function HeroArt({
  src,
  width,
  height,
  tone = "leaf",
  priority = false,
  className = "",
  glyph,
  note,
}: {
  src: string;
  width: number;
  height: number;
  tone?: "leaf" | "peach" | "cream";
  priority?: boolean;
  className?: string;
  glyph?: ReactNode;
  /** The taped sticky note the mockups pin beside the illustration. */
  note?: ReactNode;
}) {
  return (
    <div
      className={`relative flex min-h-[190px] items-center justify-center sm:min-h-[235px] lg:min-h-[290px] ${className}`}
    >
      <Blob
        tone={tone}
        className="left-1/2 top-1/2 h-[230px] w-full max-w-[520px] -translate-x-1/2 -translate-y-[52%] sm:h-[300px] lg:h-[380px]"
      />
      <Sparkle
        className="absolute left-1 top-3 h-8 w-10 sm:left-0 sm:top-2"
        color="peach"
      />
      <Sparkle
        className="absolute bottom-4 left-6 h-7 w-9 rotate-[200deg]"
        color="leaf"
      />
      <Sparkle
        className="absolute right-2 top-6 hidden h-7 w-9 sm:block"
        color="leaf"
      />
      {glyph !== undefined && <KeptGlyph>{glyph}</KeptGlyph>}
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        priority={priority}
        aria-hidden="true"
        className={`relative max-h-[230px] object-contain drop-shadow-[0_18px_28px_rgba(61,48,34,0.18)] sm:max-h-[260px] lg:max-h-[330px] ${
          note ? "w-[70%] max-w-[420px] -translate-x-[18%]" : "w-[88%] max-w-[430px]"
        }`}
      />
      {note && (
        <div className="absolute right-0 top-1/2 w-[44%] max-w-[240px] -translate-y-[54%] sm:right-[-2%]">
          {note}
        </div>
      )}
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
      className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-3 rounded-full border border-leaf-100/70 bg-gradient-to-b from-[#eff8f1] to-[#e6f2ea] px-5 py-4 text-center text-[13px] font-bold text-leaf-800 sm:px-7 sm:text-[15px] lg:py-[18px] lg:text-[17px] ${className}`}
    >
      {children}
    </div>
  );
}

/** One step inside a StepStrip. */
export function StepItem({
  index,
  children,
  href,
}: {
  index: ReactNode;
  children: ReactNode;
  /** When given, the step scrolls to a section already on the page. */
  href?: string;
}) {
  // The children sit directly in the flex row, exactly as they did before
  // the redesign, so each one keeps its own line box.
  const inner = (
    <>
      <StepPill size="sm">{index}</StepPill>
      {children}
    </>
  );
  return href ? (
    <a
      href={href}
      className="flex items-center gap-2 rounded-full transition-colors hover:text-leaf-600"
    >
      {inner}
    </a>
  ) : (
    <span className="flex items-center gap-2">{inner}</span>
  );
}

/** The arrow between two steps. Decorative, so the page still passes it in. */
export function StepArrow({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden="true" className="px-0.5 text-peach-400">
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
      className={`${CARD} ${TINT[tint].card} flex flex-col items-center justify-center gap-0 px-3 py-4 text-center`}
    >
      <span className="text-[22px] leading-none" aria-hidden="true">
        {icon}
      </span>
      <p className="mt-1 font-poppins text-[24px] font-extrabold leading-tight text-leaf-900">
        {value}
      </p>
      <p className="text-[13px] font-medium text-leaf-600">{label}</p>
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
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------- sticky note */

/**
 * The taped sticky note the mockups pin beside each hero illustration.
 * Decorative framing for a short line of copy; it carries no claim and no
 * data. Drawn entirely in CSS — the mockup crop could not be used because it
 * contains text.
 */
export function StickyNote({
  children,
  tone = "pink",
  className = "",
}: {
  children: ReactNode;
  tone?: "pink" | "cream";
  className?: string;
}) {
  const skin =
    tone === "cream"
      ? "bg-[#fdf3e3] text-amber-800"
      : "bg-[#fde6e6] text-rose-500";
  return (
    <div
      className={`pointer-events-none relative rotate-[4deg] rounded-2xl px-4 py-5 shadow-[0_14px_30px_-16px_rgba(61,48,34,0.45)] ${skin} ${className}`}
    >
      {/* washi tape */}
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-3 rounded-[3px] bg-amber-200/70"
      />
      <div className="font-caveat text-[20px] font-semibold leading-tight sm:text-[23px] lg:text-[27px]">
        {children}
      </div>
    </div>
  );
}

/** One ticked line inside a sticky note. */
export function NoteTick({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <Check className="h-4 w-4 shrink-0" aria-hidden="true" strokeWidth={3} />
      {children}
    </span>
  );
}

/* ------------------------------------------------------ in-page anchors */

/**
 * A pill that scrolls to a section already on the page. Navigation only: it
 * never reveals anything the page was not already showing.
 */
export function AnchorButton({
  href,
  children,
  tone = "primary",
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "quiet";
}) {
  const skin =
    tone === "quiet"
      ? "border border-leaf-200 bg-white text-leaf-700 hover:bg-leaf-50"
      : "bg-leaf-700 text-white shadow-btn hover:bg-leaf-800";
  return (
    <a
      href={href}
      className={`mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold transition-colors ${skin}`}
    >
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

/** Row of tinted chips that scroll to sections already on the page. */
export function ChipNav({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <nav className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-5 ${className}`}>
      {children}
    </nav>
  );
}

export function NavChip({
  href,
  tint = "green",
  icon: Icon,
  children,
}: {
  href: string;
  tint?: TintName;
  icon?: LucideIcon;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-[13px] font-bold leading-tight text-leaf-900 shadow-card transition-transform hover:-translate-y-0.5 ${TINT[tint].card}`}
    >
      {Icon && (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${TINT[tint].badge} ${TINT[tint].badgeInk}`}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" strokeWidth={2.2} />
        </span>
      )}
      <span className="min-w-0 flex-1">{children}</span>
      <ArrowRight className="h-4 w-4 shrink-0 text-leaf-500" aria-hidden="true" />
    </a>
  );
}
