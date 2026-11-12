import { Fragment } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  CircleDashed,
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
  DEMO_TESTING_CTA,
  DEMO_TESTING_HREF,
  DEMO_TESTING_INTRO,
  DEMO_TESTING_STEPS,
  DEMO_VIDEO_LABEL,
  DEMO_VIDEO_PENDING_LABEL,
  DEMO_VIDEO_URL,
  IMPACT_CARDS,
  IMPACT_DISCLAIMER,
  IMPACT_EVIDENCE,
  IMPACT_INTRO,
  PRODUCT_TOUR,
  PRODUCT_TOUR_INTRO,
  RISKS,
  RISKS_TITLE,
  ROADMAP_INTRO,
  ROADMAP_NOTE,
  ROADMAP_PHASES,
  ROADMAP_STATUS_LABEL,
  TESTING_PENDING_LABEL,
} from "@/lib/week6Data";
import AgentMapDiagram, { type DiagramNode } from "./AgentMapDiagram";

/** Pastel tint and icon per product-tour card, in the mockup's order. */
const TOUR_STYLE: { tint: TintName; icon: typeof CalendarDays }[] = [
  { tint: "green", icon: CalendarDays },
  { tint: "peach", icon: SlidersHorizontal },
  { tint: "blue", icon: ShoppingCart },
  { tint: "cream", icon: ChefHat },
  { tint: "pink", icon: LineChart },
];

/** Icon and tint per module, in the order lib/week6Data lists them. */
const MODULE_STYLE: { icon: typeof CalendarDays; tint: TintName }[] = [
  { icon: CalendarDays, tint: "green" },
  { icon: Sparkles, tint: "peach" },
  { icon: LineChart, tint: "blue" },
  { icon: UserRound, tint: "cream" },
  { icon: MessageCircle, tint: "pink" },
];

/** Node positions for the radial diagram, in its 800x520 viewBox. */
const NODE_POSITIONS = [
  { x: 400, y: 58 },
  { x: 108, y: 212 },
  { x: 692, y: 212 },
  { x: 142, y: 486 },
  { x: 658, y: 486 },
];

const IMPACT_STYLE: { tint: TintName; icon: typeof Leaf }[] = [
  { tint: "green", icon: Leaf },
  { tint: "peach", icon: Clock },
  { tint: "pink", icon: Users },
];

const TESTING_STEP_ICONS = [Users, Laptop];

const ROADMAP_STYLE: { tint: TintName; dot: string; ring: string }[] = [
  { tint: "green", dot: "bg-leaf-500", ring: "ring-leaf-200" },
  { tint: "cream", dot: "bg-peach-400", ring: "ring-peach-200" },
  { tint: "blue", dot: "bg-sky-400", ring: "ring-sky-200" },
];

export default function DemoPage() {
  const videoReady = DEMO_VIDEO_URL !== "";

  const diagramNodes: DiagramNode[] = AGENT_MODULES.map((mod, i) => ({
    name: mod.name,
    icon: MODULE_STYLE[i % MODULE_STYLE.length].icon,
    tint: MODULE_STYLE[i % MODULE_STYLE.length].tint,
    x: NODE_POSITIONS[i % NODE_POSITIONS.length].x,
    y: NODE_POSITIONS[i % NODE_POSITIONS.length].y,
  }));

  return (
    <PageShell width="max-w-[1280px]">
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
        subtitleWidth="max-w-[26rem] lg:max-w-[31rem]"
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

      {/* Step bar */}
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
                  className="inline-flex basis-full items-center justify-center gap-2 rounded-full border border-leaf-200 bg-white px-5 py-2.5 text-[13px] font-bold text-leaf-700 shadow-sm transition-colors hover:bg-leaf-50 sm:basis-auto sm:shrink-0"
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
                  className="inline-flex basis-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-leaf-100 bg-leaf-50/70 px-5 py-2.5 text-[13px] font-bold text-leaf-400 sm:basis-auto sm:shrink-0"
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
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/85 shadow-sm lg:h-14 lg:w-14 ${tint.badgeInk}`}
                  >
                    <Icon className="h-6 w-6 lg:h-7 lg:w-7" aria-hidden="true" strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-4 font-poppins text-[19px] font-extrabold leading-tight text-leaf-900 lg:text-[24px]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-snug text-leaf-700 lg:text-[16px]">
                    {card.description}
                  </p>
                  <span className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        live
                          ? "bg-leaf-600 text-white"
                          : "border border-leaf-200 bg-white/80 text-leaf-500"
                      }`}
                    >
                      {card.status}
                    </span>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/85 shadow-sm ${tint.badgeInk}`}
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </span>
                </>
              );

              const shell = `flex h-full flex-col rounded-3xl border p-5 lg:p-6 ${tint.card}`;

              return live && card.href ? (
                <Link
                  key={card.title}
                  href={card.href}
                  title={card.evidence}
                  className={`${shell} shadow-sm transition-transform hover:-translate-y-0.5`}
                >
                  {body}
                </Link>
              ) : (
                <div key={card.title} title={card.evidence} className={shell}>
                  {body}
                </div>
              );
            })}
          </div>

          {/* The evidence for every badge, kept out of the cards so they all
              share one height. */}
          <dl className="mt-5 grid gap-x-6 gap-y-1.5 rounded-2xl bg-cream-100 px-4 py-3.5 text-[12px] leading-snug text-leaf-600 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_TOUR.map((card) => (
              <div key={card.title} className="flex gap-1.5">
                <dt className="shrink-0 font-bold text-leaf-700">
                  {card.title}:
                </dt>
                <dd>{card.evidence}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* 2 + 3 — Agent map beside Practical impact */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card id="agent-map" tint="green" className="flex scroll-mt-24 flex-col p-6 sm:p-8">
            <CardHead step="2" title="Agent map" subtitle={AGENT_MAP_INTRO} />

            {/* The diagram takes whatever slack the shared row height leaves,
                so the card fills without stretching the rows apart. */}
            <div className="hidden flex-1 items-center justify-center lg:flex">
              <AgentMapDiagram nodes={diagramNodes} />
            </div>

            <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-white/70 px-4 py-3 text-[12px] leading-relaxed text-leaf-700 shadow-sm">
              <Sparkles
                className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600"
                aria-hidden="true"
              />
              {AGENT_MAP_NOTE}
            </p>

            <h3 className="mt-5 font-poppins text-[15px] font-extrabold text-leaf-800">
              Module details
            </h3>
            <div className="mt-2.5 space-y-2">
              {AGENT_MODULES.map((mod, index) => {
                const style = MODULE_STYLE[index % MODULE_STYLE.length];
                const Icon = style.icon;
                return (
                  <details
                    key={mod.name}
                    className="group rounded-2xl border border-leaf-100 bg-white px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-3">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${TINT[style.tint].badge} ${TINT[style.tint].badgeInk}`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={2.3} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-poppins text-[14px] font-extrabold leading-tight text-leaf-900">
                          {mod.name}
                        </span>
                        <span className="block font-mono text-[11px] text-leaf-500">
                          {mod.route}
                        </span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-leaf-400 transition-transform group-open:rotate-90"
                        aria-hidden="true"
                      />
                    </summary>

                    <dl className="mt-3 space-y-2 border-t border-leaf-100 pt-3 text-[12.5px] leading-snug">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="shrink-0 font-bold text-leaf-500 sm:w-[76px]">
                          Receives
                        </dt>
                        <dd className="text-leaf-800">{mod.receives}</dd>
                      </div>
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="shrink-0 font-bold text-leaf-500 sm:w-[76px]">
                          Produces
                        </dt>
                        <dd className="text-leaf-800">{mod.produces}</dd>
                      </div>
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="shrink-0 font-bold text-leaf-500 sm:w-[76px]">
                          Writes to
                        </dt>
                        <dd className="flex flex-wrap gap-1.5">
                          {mod.tables.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center gap-1 rounded-full bg-leaf-50 px-2 py-0.5 font-mono text-[10.5px] font-semibold text-leaf-700 ring-1 ring-leaf-100"
                            >
                              <Database className="h-3 w-3" aria-hidden="true" />
                              {t}
                            </span>
                          ))}
                        </dd>
                      </div>
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="shrink-0 font-bold text-peach-600 sm:w-[76px]">
                          Human
                        </dt>
                        <dd className="text-leaf-800">{mod.human}</dd>
                      </div>
                    </dl>
                  </details>
                );
              })}
            </div>
          </Card>

          <Card id="impact" tint="plain" className="flex scroll-mt-24 flex-col p-6 sm:p-8">
            <CardHead step="3" title="Practical impact" subtitle={IMPACT_INTRO} />

            <ul className="mt-5 flex flex-1 flex-col justify-around divide-y divide-leaf-100">
              {IMPACT_CARDS.map((card, index) => {
                const style = IMPACT_STYLE[index % IMPACT_STYLE.length];
                const Icon = style.icon;
                return (
                  <li key={card.title} className="flex items-start gap-3.5 py-4">
                    <IconBadge tint={style.tint} size="sm" icon={Icon} />
                    <div className="min-w-0">
                      <h3 className="font-poppins text-[16px] font-extrabold text-leaf-900">
                        {card.title}
                      </h3>
                      <p className="mt-0.5 text-[14px] leading-snug text-leaf-700">
                        {card.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mb-4 mt-2 rounded-2xl bg-cream-100 px-4 py-3 text-[12.5px] font-medium text-leaf-700">
              {IMPACT_DISCLAIMER}
            </p>

            {/* Context for the problem, with its source. Not a Lunchies
                result — the limit line says so on the page. */}
            <div className="mt-4 rounded-3xl border border-cream-200/80 bg-cream-100 p-5">
              <h3 className="font-poppins text-[15px] font-extrabold leading-snug text-leaf-900">
                {IMPACT_EVIDENCE.heading}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-leaf-800">
                {IMPACT_EVIDENCE.text}
              </p>
              <p className="mt-2.5 text-[12px] leading-relaxed text-leaf-600">
                <a
                  href={IMPACT_EVIDENCE.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-leaf-700 underline decoration-leaf-300 underline-offset-2 hover:text-peach-600"
                >
                  {IMPACT_EVIDENCE.sourceLabel}
                </a>
              </p>
              <p className="mt-2.5 text-[12px] leading-relaxed text-leaf-600">
                {IMPACT_EVIDENCE.limit}
              </p>
            </div>

            <div className="mt-4 rounded-3xl border border-rose-100/70 bg-gradient-to-b from-[#fdeff1] to-[#fbe4e8] p-5">
              <h3 className="font-poppins text-[17px] font-extrabold text-leaf-900">
                {RISKS_TITLE}
              </h3>
              <ul className="mt-3 space-y-2">
                {RISKS.map((risk) => (
                  <li
                    key={risk}
                    className="flex items-start gap-2.5 text-[13px] leading-snug text-leaf-800"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400"
                    />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* 4 + 5 — Testing step beside the roadmap */}
        <div className="grid items-start gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <Card id="testing" tint="plain" className="scroll-mt-24 p-6 sm:p-8">
            <CardHead step="4" title="Testing" subtitle={DEMO_TESTING_INTRO} />

            <ul className="mt-5 space-y-3">
              {DEMO_TESTING_STEPS.map((row, index) => {
                const Icon = TESTING_STEP_ICONS[index % TESTING_STEP_ICONS.length];
                return (
                  <li
                    key={row.title}
                    className="flex items-start gap-3 rounded-2xl border border-leaf-100 bg-leaf-50/60 p-4"
                  >
                    <IconBadge tint="green" size="sm" icon={Icon} />
                    {/* Stacked, so the chip can never sit on top of the title
                        however narrow this card gets. */}
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                      <p className="w-full font-poppins text-[14px] font-extrabold leading-snug text-leaf-900">
                        {row.title}
                      </p>
                    {/* A check mark only where there is a real result. */}
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-bold ${
                          row.result
                            ? "border-leaf-600 bg-leaf-600 text-white"
                            : "border-leaf-200 bg-white text-leaf-500"
                        }`}
                      >
                        {row.result ? (
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {row.result ?? TESTING_PENDING_LABEL}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link
              href={DEMO_TESTING_HREF}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf-100 px-6 py-3 text-[14px] font-bold text-leaf-700 transition-colors hover:bg-leaf-200"
            >
              {DEMO_TESTING_CTA}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Card>

          <Card id="version-2" tint="plain" className="scroll-mt-24 p-6 sm:p-8">
            <CardHead step="5" title="Version 2 roadmap" subtitle={ROADMAP_INTRO} />

            {/* Horizontal timeline: a rule with one dot per phase. */}
            <div className="relative mt-7">
              <div
                aria-hidden="true"
                className="absolute left-[16.6%] right-[16.6%] top-[7px] hidden h-[2px] bg-leaf-200 lg:block"
              />
              <div className="grid gap-4 lg:grid-cols-3">
                {ROADMAP_PHASES.map((phase, index) => {
                  const style = ROADMAP_STYLE[index % ROADMAP_STYLE.length];
                  return (
                    <div key={phase.id} className="relative flex flex-col">
                      <span
                        aria-hidden="true"
                        className={`relative z-10 mx-auto mb-4 hidden h-4 w-4 rounded-full ring-4 ring-cream-50 lg:block ${style.dot}`}
                      />
                      <div
                        className={`flex h-full flex-col rounded-3xl border p-4 ${TINT[style.tint].card}`}
                      >
                        <div className="flex flex-wrap items-baseline justify-center gap-x-2 lg:justify-start">
                          <h3 className="font-poppins text-[17px] font-extrabold text-leaf-900">
                            {phase.id}
                          </h3>
                          <span className="text-[13px] font-semibold text-leaf-600">
                            ({phase.term})
                          </span>
                        </div>
                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-leaf-200 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-leaf-500">
                          <CircleDashed className="h-3 w-3" aria-hidden="true" />
                          {ROADMAP_STATUS_LABEL}
                        </span>
                        <ul className="mt-3 space-y-2">
                          {phase.items.map((item) => (
                            <li
                              key={item.label}
                              className="flex items-start gap-2 text-[12.5px] leading-snug text-leaf-800"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-leaf-400"
                              />
                              <span>
                                {item.label}
                                {item.note && (
                                  <span className="mt-1 block w-fit max-w-full rounded-full bg-white/80 px-2 py-0.5 text-[10.5px] font-bold leading-snug text-peach-600">
                                    {item.note}
                                  </span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="mt-4 rounded-2xl bg-cream-100 px-4 py-3 text-[12.5px] font-medium text-leaf-700">
              {ROADMAP_NOTE}
            </p>
          </Card>
        </div>

        {/* Final CTA */}
        <div className="relative flex flex-col items-center gap-5 overflow-hidden rounded-[28px] border border-rose-100/70 bg-gradient-to-r from-[#fdeff1] to-[#fde9ec] p-6 text-center shadow-card sm:flex-row sm:justify-between sm:gap-4 sm:p-8 sm:text-left">
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
