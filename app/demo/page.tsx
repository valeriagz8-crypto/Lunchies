import { Fragment } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  CircleDashed,
  ClipboardList,
  Clock,
  Database,
  Laptop,
  Leaf,
  LineChart,
  MessageCircle,
  Play,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import {
  Card,
  CardHead,
  HeroArt,
  HeroLabel,
  IconBadge,
  NoteTick,
  PageHero,
  PageShell,
  Sparkle,
  StepArrow,
  StepItem,
  StepStrip,
  StickyNote,
} from "@/components/ui/pieces";
import { TINT, type TintName } from "@/components/ui/theme";
import {
  AGENT_MAP_INTRO,
  AGENT_MAP_NOTE,
  AGENT_MODULES,
  DEMO_CTA,
  DEMO_HERO,
  DEMO_STEPS,
  DEMO_VIDEO_LABEL,
  DEMO_VIDEO_PENDING_LABEL,
  DEMO_VIDEO_URL,
  IMPACT_CARDS,
  IMPACT_DISCLAIMER,
  IMPACT_INTRO,
  PRODUCT_TOUR,
  PRODUCT_TOUR_INTRO,
  RISKS,
  RISKS_TITLE,
  ROADMAP_INTRO,
  ROADMAP_NOTE,
  ROADMAP_PHASES,
  ROADMAP_STATUS_LABEL,
  TESTING_INTRO,
  TESTING_NOTE,
  TESTING_PENDING_LABEL,
  TESTING_ROWS,
} from "@/lib/week6Data";

/** Pastel tint and icon per product-tour card, in the mockup's order. */
const TOUR_STYLE: { tint: TintName; icon: typeof CalendarDays }[] = [
  { tint: "green", icon: CalendarDays },
  { tint: "peach", icon: SlidersHorizontal },
  { tint: "blue", icon: ShoppingCart },
  { tint: "cream", icon: ChefHat },
  { tint: "pink", icon: LineChart },
];

/** Icon per module in the agent map, in the order the data lists them. */
const MODULE_ICONS = [
  CalendarDays,
  Sparkles,
  LineChart,
  UserRound,
  MessageCircle,
];

const IMPACT_STYLE: { tint: TintName; icon: typeof Leaf }[] = [
  { tint: "green", icon: Leaf },
  { tint: "peach", icon: Clock },
  { tint: "pink", icon: Users },
];

const TESTING_ICONS = [Users, Laptop, ClipboardList];

const ROADMAP_STYLE: { tint: TintName; dot: string }[] = [
  { tint: "green", dot: "bg-leaf-500" },
  { tint: "cream", dot: "bg-peach-400" },
  { tint: "blue", dot: "bg-sky-400" },
];

export default function DemoPage() {
  const videoReady = DEMO_VIDEO_URL !== "";

  return (
    <PageShell>
      {/* Hero */}
      <PageHero
        label={
          <HeroLabel badge={<IconBadge tint="green" size="sm" icon={Play} />}>
            {DEMO_HERO.eyebrow}
          </HeroLabel>
        }
        title={
          <>
            {DEMO_HERO.titleLead}{" "}
            <span className="text-peach-500">{DEMO_HERO.titleAccent}</span>
          </>
        }
        subtitle={DEMO_HERO.subtitle}
        actions={
          <a
            href={DEMO_HERO.ctaHref}
            className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-leaf-700 px-7 py-3.5 text-[15px] font-bold text-white shadow-btn transition-colors hover:bg-leaf-800"
          >
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
            {DEMO_HERO.cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        }
        art={
          <HeroArt
            src="/images/redesign/hero-core.webp"
            width={592}
            height={488}
            tone="leaf"
            priority
            note={
              <StickyNote>
                <span className="flex flex-col gap-1.5">
                  {DEMO_HERO.noteItems.map((item) => (
                    <NoteTick key={item}>{item}</NoteTick>
                  ))}
                </span>
              </StickyNote>
            }
          />
        }
      />

      {/* Step bar — anchors into the five sections below */}
      <StepStrip className="mt-8">
        {DEMO_STEPS.map((step, index) => (
          <Fragment key={step.href}>
            {index > 0 && <StepArrow>→</StepArrow>}
            <StepItem index={index + 1} href={step.href}>
              {step.label}
            </StepItem>
          </Fragment>
        ))}
      </StepStrip>

      <div className="mt-8 space-y-6">
        {/* 1 — Product tour */}
        <Card id="product-tour" tint="plain" className="scroll-mt-24 p-6 sm:p-8">
          <CardHead
            step="1"
            title="Product tour"
            subtitle={PRODUCT_TOUR_INTRO}
            action={
              videoReady ? (
                <a
                  href={DEMO_VIDEO_URL}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-leaf-200 bg-white px-5 py-2.5 text-[13px] font-bold text-leaf-700 shadow-sm transition-colors hover:bg-leaf-50"
                >
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  {DEMO_VIDEO_LABEL}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  title={DEMO_VIDEO_LABEL}
                  className="inline-flex shrink-0 cursor-not-allowed items-center gap-2 rounded-full border border-leaf-100 bg-leaf-50/70 px-5 py-2.5 text-[13px] font-bold text-leaf-400"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  {DEMO_VIDEO_PENDING_LABEL}
                </button>
              )
            }
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PRODUCT_TOUR.map((card, index) => {
              const style = TOUR_STYLE[index % TOUR_STYLE.length];
              const tint = TINT[style.tint];
              const Icon = style.icon;
              const live = card.status === "Live";
              const body = (
                <>
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm ${tint.badgeInk}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={2.2} />
                  </span>
                  <span
                    className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      live
                        ? "bg-leaf-600 text-white"
                        : "border border-leaf-200 bg-white/80 text-leaf-500"
                    }`}
                  >
                    {live ? (
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <CircleDashed className="h-3 w-3" aria-hidden="true" />
                    )}
                    {card.status}
                  </span>
                  <h3 className="mt-2.5 font-poppins text-lg font-extrabold text-leaf-900">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[14px] leading-snug text-leaf-700">
                    {card.description}
                  </p>
                  <p className="mt-3 text-[12px] leading-snug text-leaf-500">
                    {card.evidence}
                  </p>
                  {live && card.href && (
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-leaf-700">
                      Open {card.href}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  )}
                </>
              );

              const shell = `flex h-full flex-col rounded-3xl border p-5 ${tint.card}`;

              return live && card.href ? (
                <Link
                  key={card.title}
                  href={card.href}
                  className={`${shell} shadow-sm transition-transform hover:-translate-y-0.5`}
                >
                  {body}
                </Link>
              ) : (
                <div key={card.title} className={shell}>
                  {body}
                </div>
              );
            })}
          </div>
        </Card>

        {/* 2 — Agent map */}
        <Card id="agent-map" tint="green" className="scroll-mt-24 p-6 sm:p-8">
          <CardHead
            step="2"
            title="Agent map"
            subtitle={AGENT_MAP_INTRO}
          />

          <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-white/70 px-4 py-3 text-[13px] leading-relaxed text-leaf-700 shadow-sm">
            <Sparkles
              className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600"
              aria-hidden="true"
            />
            {AGENT_MAP_NOTE}
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {AGENT_MODULES.map((mod, index) => {
              const Icon = MODULE_ICONS[index % MODULE_ICONS.length];
              return (
                <div
                  key={mod.name}
                  className="flex flex-col rounded-3xl border border-leaf-100/70 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <IconBadge tint="green" size="sm" icon={Icon} />
                    <div className="min-w-0">
                      <h3 className="font-poppins text-[17px] font-extrabold leading-tight text-leaf-900">
                        {mod.name}
                      </h3>
                      <Link
                        href={mod.route}
                        className="text-[13px] font-bold text-leaf-600 underline decoration-leaf-200 underline-offset-2 hover:text-peach-600"
                      >
                        {mod.route}
                      </Link>
                    </div>
                  </div>

                  <dl className="mt-4 space-y-2.5 text-[13px] leading-snug">
                    <div className="flex gap-2">
                      <dt className="w-[86px] shrink-0 font-bold text-leaf-500">
                        Receives
                      </dt>
                      <dd className="text-leaf-800">{mod.receives}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-[86px] shrink-0 font-bold text-leaf-500">
                        Produces
                      </dt>
                      <dd className="text-leaf-800">{mod.produces}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-[86px] shrink-0 font-bold text-leaf-500">
                        Writes to
                      </dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {mod.tables.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 rounded-full bg-leaf-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-leaf-700 ring-1 ring-leaf-100"
                          >
                            <Database className="h-3 w-3" aria-hidden="true" />
                            {t}
                          </span>
                        ))}
                      </dd>
                    </div>
                    <div className="flex gap-2 border-t border-leaf-100 pt-2.5">
                      <dt className="w-[86px] shrink-0 font-bold text-peach-600">
                        Human
                      </dt>
                      <dd className="text-leaf-800">{mod.human}</dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 3 — Practical impact */}
        <Card id="impact" tint="plain" className="scroll-mt-24 p-6 sm:p-8">
          <CardHead step="3" title="Practical impact" subtitle={IMPACT_INTRO} />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {IMPACT_CARDS.map((card, index) => {
              const style = IMPACT_STYLE[index % IMPACT_STYLE.length];
              const Icon = style.icon;
              return (
                <div
                  key={card.title}
                  className={`rounded-3xl border p-5 ${TINT[style.tint].card}`}
                >
                  <IconBadge tint={style.tint} size="sm" icon={Icon} />
                  <h3 className="mt-3 font-poppins text-[17px] font-extrabold text-leaf-900">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-snug text-leaf-700">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-4 rounded-2xl bg-cream-100 px-4 py-3 text-[13px] font-medium text-leaf-700">
            {IMPACT_DISCLAIMER}
          </p>

          <div className="mt-5 rounded-3xl border border-rose-100/70 bg-gradient-to-b from-[#fdeff1] to-[#fbe4e8] p-5 sm:p-6">
            <h3 className="font-poppins text-[19px] font-extrabold text-leaf-900">
              {RISKS_TITLE}
            </h3>
            <ul className="mt-3.5 space-y-2.5">
              {RISKS.map((risk) => (
                <li
                  key={risk}
                  className="flex items-start gap-2.5 text-[14px] leading-snug text-leaf-800"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400"
                  />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* 4 + 5 — Testing and roadmap */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card id="testing" tint="plain" className="scroll-mt-24 p-6 sm:p-8">
            <CardHead step="4" title="Testing summary" subtitle={TESTING_INTRO} />

            <ul className="mt-6 space-y-3">
              {TESTING_ROWS.map((row, index) => {
                const Icon = TESTING_ICONS[index % TESTING_ICONS.length];
                return (
                  <li
                    key={row.title}
                    className="flex items-center gap-3.5 rounded-2xl border border-leaf-100 bg-leaf-50/60 p-4"
                  >
                    <IconBadge tint="green" size="sm" icon={Icon} />
                    <div className="min-w-0 flex-1">
                      <p className="font-poppins text-[15px] font-extrabold text-leaf-900">
                        {row.title}
                      </p>
                      <p className="text-[13px] leading-snug text-leaf-600">
                        {row.description}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-leaf-200 bg-white px-3 py-1.5 text-[12px] font-bold text-leaf-500">
                      <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
                      {row.result ?? TESTING_PENDING_LABEL}
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-4 rounded-2xl bg-cream-100 px-4 py-3 text-[13px] font-medium text-leaf-700">
              {TESTING_NOTE}
            </p>
          </Card>

          <Card id="version-2" tint="plain" className="scroll-mt-24 p-6 sm:p-8">
            <CardHead step="5" title="Version 2 roadmap" subtitle={ROADMAP_INTRO} />

            <div className="mt-6 space-y-4">
              {ROADMAP_PHASES.map((phase, index) => {
                const style = ROADMAP_STYLE[index % ROADMAP_STYLE.length];
                return (
                  <div
                    key={phase.id}
                    className={`rounded-3xl border p-5 ${TINT[style.tint].card}`}
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={`h-2.5 w-2.5 rounded-full ${style.dot}`}
                      />
                      <h3 className="font-poppins text-[18px] font-extrabold text-leaf-900">
                        {phase.id}
                      </h3>
                      <span className="text-[13px] font-semibold text-leaf-600">
                        ({phase.term})
                      </span>
                      <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-leaf-200 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-leaf-500">
                        <CircleDashed className="h-3 w-3" aria-hidden="true" />
                        {ROADMAP_STATUS_LABEL}
                      </span>
                    </div>
                    <ul className="mt-3.5 space-y-2">
                      {phase.items.map((item) => (
                        <li
                          key={item.label}
                          className="flex items-start gap-2.5 text-[14px] leading-snug text-leaf-800"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-400"
                          />
                          <span>
                            {item.label}
                            {item.note && (
                              <span className="ml-2 inline-flex rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-bold text-peach-600">
                                {item.note}
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 rounded-2xl bg-cream-100 px-4 py-3 text-[13px] font-medium text-leaf-700">
              {ROADMAP_NOTE}
            </p>
          </Card>
        </div>

        {/* Final CTA */}
        <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[28px] border border-rose-100/70 bg-gradient-to-r from-[#fdeff1] to-[#fde9ec] p-6 text-center shadow-card sm:flex-row sm:justify-between sm:p-8 sm:text-left">
          <Sparkle
            className="absolute right-4 top-4 h-6 w-8 opacity-70"
            color="peach"
          />
          <div>
            <p className="font-poppins text-[22px] font-extrabold text-leaf-900">
              {DEMO_CTA.title}
            </p>
            <p className="mt-1 text-[15px] text-leaf-700">{DEMO_CTA.subtitle}</p>
          </div>
          <Link
            href={DEMO_CTA.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-peach-500 px-8 py-3.5 text-[15px] font-bold text-white shadow-btn transition-colors hover:bg-peach-600"
          >
            {DEMO_CTA.button}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
