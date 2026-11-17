import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Clock,
  Database,
  Heart,
  Laptop,
  Leaf,
  LineChart,
  MapPin,
  Megaphone,
  MessageCircle,
  Play,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import {
  Card,
  CardHead,
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
  AGENT_DETAILS_HINT,
  AGENT_DETAILS_TITLE,
  AGENT_MAP_INTRO,
  AGENT_MAP_NOTE,
  AGENT_MODULES,
  CONTEXT_STRIP_NOTE,
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
  TESTER_FEEDBACK,
  TESTING_PENDING_LABEL,
} from "@/lib/week6Data";
import AgentMapDiagram, { type DiagramNode } from "./AgentMapDiagram";

/** Pastel tint, icon and illustration per tour card, in the data's order. */
type Picture = { src: string; width: number; height: number };

const TOUR_STYLE: {
  tint: TintName;
  icon: typeof CalendarDays;
  picture: Picture;
}[] = [
  { tint: "green", icon: CalendarDays, picture: { src: "/images/week6/tour-plan.webp", width: 116, height: 66 } },
  { tint: "peach", icon: SlidersHorizontal, picture: { src: "/images/week6/tour-personalize.webp", width: 100, height: 76 } },
  { tint: "blue", icon: MessageCircle, picture: { src: "/images/week6/rec-chat.webp", width: 74, height: 66 } },
  { tint: "cream", icon: Search, picture: { src: "/images/week6/tour-research.webp", width: 94, height: 72 } },
  { tint: "pink", icon: LineChart, picture: { src: "/images/week6/rec-calc.webp", width: 88, height: 68 } },
  { tint: "green", icon: Megaphone, picture: { src: "/images/week6/tour-market.webp", width: 96, height: 74 } },
];

/** Icon and tint per module, in the order lib/week6Data lists them. */
const MODULE_STYLE: { icon: typeof CalendarDays; tint: TintName }[] = [
  { icon: CalendarDays, tint: "green" },
  { icon: Search, tint: "peach" },
  { icon: LineChart, tint: "blue" },
  { icon: Megaphone, tint: "cream" },
  { icon: MessageCircle, tint: "pink" },
];

/** Node centres in the diagram's 860x540 viewBox, going round the hub. */
const NODE_POSITIONS = [
  { x: 430, y: 56 },
  { x: 172, y: 184 },
  { x: 688, y: 184 },
  { x: 196, y: 408 },
  { x: 664, y: 408 },
];

const IMPACT_STYLE: { tint: TintName; icon: typeof Leaf }[] = [
  { tint: "green", icon: Leaf },
  { tint: "peach", icon: Clock },
  { tint: "pink", icon: Users },
];

const TESTING_STEP_ICONS = [Users, Laptop];

/** Pin colour per roadmap phase, matching the mockup's route markers. */
const ROADMAP_STYLE: { tint: TintName; pin: string }[] = [
  { tint: "green", pin: "text-leaf-600" },
  { tint: "cream", pin: "text-peach-500" },
  { tint: "pink", pin: "text-rose-400" },
];

export default function DemoPage() {
  const videoReady = DEMO_VIDEO_URL !== "";

  const diagramNodes: DiagramNode[] = AGENT_MODULES.map((mod, i) => ({
    name: mod.name,
    short: mod.short,
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
          <span className="block text-[40px] leading-[1.02] sm:text-[50px] lg:text-[64px]">
            {DEMO_HERO.titleLead}
            <span className="block italic text-leaf-600">
              {DEMO_HERO.titleAccent}
            </span>
          </span>
        }
        subtitle={DEMO_HERO.subtitle}
        subtitleWidth="max-w-[27rem] lg:max-w-[30rem]"
        actions={
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={DEMO_HERO.ctaHref}
              className="inline-flex items-center gap-2.5 rounded-full bg-leaf-700 px-7 py-3.5 text-[15px] font-bold text-white shadow-btn transition-colors hover:bg-leaf-800"
            >
              <Play className="h-4 w-4 fill-current" aria-hidden="true" />
              {DEMO_HERO.cta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>

            {/* The walkthrough has not been recorded, so this button stays
                disabled and says so. */}
            {videoReady ? (
              <a
                href={DEMO_VIDEO_URL}
                className="inline-flex items-center gap-2.5 rounded-full border border-leaf-300 bg-white px-6 py-3.5 text-[15px] font-bold text-leaf-700 shadow-sm transition-colors hover:bg-leaf-50"
              >
                <Video className="h-4 w-4" aria-hidden="true" />
                {DEMO_VIDEO_LABEL}
              </a>
            ) : (
              <button
                type="button"
                disabled
                aria-disabled="true"
                title={DEMO_VIDEO_LABEL}
                className="inline-flex cursor-not-allowed items-center gap-2.5 rounded-full border border-leaf-200 bg-white/70 px-6 py-3.5 text-[15px] font-bold text-leaf-400"
              >
                <Video className="h-4 w-4" aria-hidden="true" />
                {DEMO_VIDEO_PENDING_LABEL}
              </button>
            )}
          </div>
        }
        art={
          <div className="relative flex min-h-[210px] items-center justify-center sm:min-h-[250px] lg:min-h-[300px]">
            <Sparkle className="absolute left-2 top-1 h-8 w-10" color="peach" />
            <Sparkle
              className="absolute bottom-2 left-8 hidden h-7 w-9 rotate-[200deg] sm:block"
              color="leaf"
            />
            <Image
              src="/images/week6/demo-hero-lg.webp"
              alt=""
              width={371}
              height={250}
              priority
              aria-hidden="true"
              className="relative w-[86%] max-w-[540px] object-contain drop-shadow-[0_18px_28px_rgba(61,48,34,0.16)] sm:w-[98%] sm:-translate-x-[7%]"
            />
            <div className="absolute right-0 top-1/2 w-[40%] max-w-[158px] -translate-y-[72%] sm:w-[46%] sm:max-w-[232px] sm:-translate-y-[58%] xl:right-[-3%]">
              <StickyNote>
                <span className="flex flex-col gap-1.5">
                  {DEMO_HERO.noteItems.map((item) => (
                    <NoteTick key={item}>{item}</NoteTick>
                  ))}
                </span>
              </StickyNote>
              <Heart
                className="absolute bottom-2 right-3 h-5 w-5 text-rose-300"
                aria-hidden="true"
              />
            </div>
          </div>
        }
      />

      {/* Step bar */}
      <StepStrip className="mt-7">
        {DEMO_STEPS.map((step, index) => (
          <Fragment key={step.href}>
            {index > 0 && <StepArrow>→</StepArrow>}
            <StepItem index={index + 1} href={step.href}>
              {step.label}
            </StepItem>
          </Fragment>
        ))}
      </StepStrip>

      <div className="mt-6 space-y-5">
        {/* 1 — Product tour: one row of six on a desktop, like the mockup. */}
        <Card id="product-tour" tint="plain" className="scroll-mt-24 p-5 sm:p-6">
          <CardHead step="1" title="Product tour" subtitle={PRODUCT_TOUR_INTRO} />

          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {PRODUCT_TOUR.map((card, index) => {
              const style = TOUR_STYLE[index % TOUR_STYLE.length];
              const tint = TINT[style.tint];
              const Icon = style.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className={`relative flex h-full flex-col overflow-hidden rounded-[22px] border p-3.5 shadow-sm transition-transform hover:-translate-y-0.5 ${tint.card}`}
                >
                  <Image
                    src={style.picture.src}
                    alt=""
                    width={style.picture.width}
                    height={style.picture.height}
                    loading="lazy"
                    aria-hidden="true"
                    className="pointer-events-none absolute right-1.5 top-1.5 h-[58px] w-[82px] object-contain object-right-top"
                  />
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-white/85 shadow-sm ${tint.badgeInk}`}
                  >
                    <Icon className="h-[22px] w-[22px]" aria-hidden="true" strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-3.5 font-poppins text-[19px] font-extrabold leading-tight text-leaf-900">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-snug text-leaf-700">
                    {card.description}
                  </p>
                  <span className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <span className="inline-flex items-center rounded-full bg-leaf-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Live
                    </span>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full bg-white/85 shadow-sm ${tint.badgeInk}`}
                    >
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* 2 + 3 — Agent map beside Practical impact */}
        <div className="grid gap-5 lg:grid-cols-[1.06fr_1fr]">
          <Card id="agent-map" tint="green" className="flex scroll-mt-24 flex-col p-5 sm:p-6">
            <CardHead step="2" title="Agent map" subtitle={AGENT_MAP_INTRO} />

            {/* The diagram absorbs whatever slack the shared row height
                leaves, so the card fills without stretching its rows. */}
            <div className="hidden flex-1 items-center justify-center lg:flex">
              <AgentMapDiagram nodes={diagramNodes} />
            </div>

            {/* Below lg the diagram is hidden, so the modules are listed. */}
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:hidden">
              {AGENT_MODULES.map((mod, index) => {
                const style = MODULE_STYLE[index % MODULE_STYLE.length];
                const Icon = style.icon;
                return (
                  <li
                    key={mod.name}
                    className={`flex items-start gap-2.5 rounded-2xl border px-3 py-2.5 ${TINT[style.tint].card}`}
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 ${TINT[style.tint].badgeInk}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" strokeWidth={2.4} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-poppins text-[13px] font-extrabold leading-tight text-leaf-900">
                        {mod.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-leaf-700">
                        {mod.short}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>

            <p className="mt-3 flex items-start gap-2.5 rounded-2xl bg-white/70 px-4 py-2 text-[11px] leading-relaxed text-leaf-700 shadow-sm">
              <Sparkles
                className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600"
                aria-hidden="true"
              />
              {AGENT_MAP_NOTE}
            </p>

            {/* One closed disclosure, so the detail stays available without
                making this card five rows taller. */}
            <details className="group mt-2.5 rounded-2xl border border-leaf-100 bg-white px-4 py-2.5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center gap-3">
                <span className="min-w-0 flex-1">
                  <span className="block font-poppins text-[13.5px] font-extrabold leading-tight text-leaf-900">
                    {AGENT_DETAILS_TITLE}
                  </span>
                  <span className="block text-[11.5px] text-leaf-600">
                    {AGENT_DETAILS_HINT}
                  </span>
                </span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-leaf-400 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>

              <div className="mt-3 space-y-3 border-t border-leaf-100 pt-3">
                {AGENT_MODULES.map((mod) => (
                  <div key={mod.name}>
                    <p className="flex flex-wrap items-baseline gap-2">
                      <span className="font-poppins text-[13px] font-extrabold text-leaf-900">
                        {mod.name}
                      </span>
                      <Link
                        href={mod.route}
                        className="font-mono text-[11px] text-leaf-500 underline decoration-leaf-200 underline-offset-2 hover:text-peach-600"
                      >
                        {mod.route}
                      </Link>
                    </p>
                    <dl className="mt-1 space-y-1 text-[12px] leading-snug">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="shrink-0 font-bold text-leaf-500 sm:w-[72px]">
                          Receives
                        </dt>
                        <dd className="text-leaf-800">{mod.receives}</dd>
                      </div>
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="shrink-0 font-bold text-leaf-500 sm:w-[72px]">
                          Produces
                        </dt>
                        <dd className="text-leaf-800">{mod.produces}</dd>
                      </div>
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                        <dt className="shrink-0 font-bold text-leaf-500 sm:w-[72px]">
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
                        <dt className="shrink-0 font-bold text-peach-600 sm:w-[72px]">
                          Human
                        </dt>
                        <dd className="text-leaf-800">{mod.human}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </details>
          </Card>

          <Card id="impact" tint="plain" className="flex scroll-mt-24 flex-col p-5 sm:p-6">
            <CardHead step="3" title="Practical impact" subtitle={IMPACT_INTRO} />

            <div className="mt-4 flex flex-1 items-center gap-4">
              <ul className="flex min-w-0 flex-1 flex-col justify-around gap-3 self-stretch">
                {IMPACT_CARDS.map((card, index) => {
                  const style = IMPACT_STYLE[index % IMPACT_STYLE.length];
                  const Icon = style.icon;
                  return (
                    <li key={card.title} className="flex items-start gap-3">
                      <IconBadge tint={style.tint} size="sm" icon={Icon} />
                      <div className="min-w-0">
                        <h3 className="font-poppins text-[15px] font-extrabold leading-tight text-leaf-900">
                          {card.title}
                        </h3>
                        <p className="mt-0.5 text-[13px] leading-snug text-leaf-700">
                          {card.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Image
                src="/images/week6/impact-lunchbox-lg.webp"
                alt=""
                width={153}
                height={167}
                loading="lazy"
                aria-hidden="true"
                className="hidden h-auto w-[150px] shrink-0 object-contain drop-shadow-[0_14px_22px_rgba(61,48,34,0.16)] md:block xl:w-[178px]"
              />
            </div>

            <p className="mt-3 rounded-2xl bg-cream-100 px-4 py-2.5 text-[12px] font-medium text-leaf-700">
              {IMPACT_DISCLAIMER}
            </p>

            {/* Context for the problem, with its source. Not a Lunchies
                result — the heading and the limit line both say so. */}
            <div className="mt-3 flex items-start gap-3 rounded-2xl border border-cream-200/80 bg-cream-100 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-peach-500">
                <BarChart3 className="h-5 w-5" aria-hidden="true" strokeWidth={2.4} />
              </span>
              <div className="min-w-0">
                <h3 className="font-poppins text-[14px] font-extrabold leading-snug text-leaf-900">
                  {IMPACT_EVIDENCE.heading}
                </h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-leaf-800">
                  {IMPACT_EVIDENCE.text}
                </p>
                <p className="mt-2 text-[11.5px] leading-relaxed text-leaf-600">
                  <a
                    href={IMPACT_EVIDENCE.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-leaf-700 underline decoration-leaf-300 underline-offset-2 hover:text-peach-600"
                  >
                    {IMPACT_EVIDENCE.sourceLabel}
                  </a>
                </p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-leaf-600">
                  {IMPACT_EVIDENCE.limit}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Context and limits in one quiet strip, so neither block can be
            read as a result of the project. */}
        <div
          id="context-limits"
          className="scroll-mt-24 rounded-[26px] border border-leaf-100 bg-leaf-50/60 p-5"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-leaf-500">
            {CONTEXT_STRIP_NOTE}
          </p>
          <div className="mt-3 grid gap-5 md:grid-cols-2">
            <div>
              <h3 className="font-poppins text-[14px] font-extrabold leading-snug text-leaf-900">
                {TESTER_FEEDBACK.heading}
              </h3>
              <ul className="mt-2 space-y-1">
                {TESTER_FEEDBACK.lines.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2 text-[12.5px] leading-snug text-leaf-800"
                  >
                    <span aria-hidden="true" className="text-leaf-400">
                      •
                    </span>
                    <span className="min-w-0">{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11.5px] leading-snug text-leaf-600">
                {TESTER_FEEDBACK.limits}
              </p>
              <p className="mt-1 text-[11.5px] leading-snug text-leaf-500">
                {TESTER_FEEDBACK.source}
              </p>
            </div>

            <div>
              <h3 className="font-poppins text-[14px] font-extrabold leading-snug text-leaf-900">
                {RISKS_TITLE}
              </h3>
              <ul className="mt-2 space-y-1">
                {RISKS.map((risk) => (
                  <li
                    key={risk}
                    className="flex items-start gap-2 text-[12.5px] leading-snug text-leaf-800"
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
          </div>
        </div>

        {/* 4 + 5 — Testing step beside the roadmap */}
        <div className="grid items-stretch gap-5 lg:grid-cols-[0.76fr_1.24fr]">
          <Card id="testing" tint="plain" className="flex scroll-mt-24 flex-col p-5 sm:p-6">
            <CardHead step="4" title="Testing" subtitle={DEMO_TESTING_INTRO} />

            <div className="mt-4 grid flex-1 items-stretch gap-4 sm:grid-cols-[164px_1fr]">
              <Image
                src="/images/week6/testing-clipboard-lg.webp"
                alt=""
                width={160}
                height={199}
                loading="lazy"
                aria-hidden="true"
                className="hidden h-full w-full object-contain drop-shadow-[0_12px_18px_rgba(61,48,34,0.14)] sm:block"
              />
              <ul className="flex min-w-0 flex-col justify-center gap-3">
                {DEMO_TESTING_STEPS.map((row, index) => {
                  const Icon = TESTING_STEP_ICONS[index % TESTING_STEP_ICONS.length];
                  return (
                    <li
                      key={row.title}
                      className="flex items-start gap-3 rounded-2xl border border-leaf-100 bg-leaf-50/60 p-3.5"
                    >
                      <IconBadge tint="green" size="sm" icon={Icon} />
                      {/* Stacked, so the chip can never sit on top of the
                          title however narrow this card gets. */}
                      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
                        <p className="w-full font-poppins text-[14px] font-extrabold leading-snug text-leaf-900">
                          {row.title}
                        </p>
                        {/* A check mark only where there is a real result. */}
                        <span
                          className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-left text-[12px] font-bold ${
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
            </div>

            <Link
              href={DEMO_TESTING_HREF}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf-100 px-6 py-3 text-[14px] font-bold text-leaf-700 transition-colors hover:bg-leaf-200"
            >
              {DEMO_TESTING_CTA}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Card>

          <Card id="version-2" tint="plain" className="flex scroll-mt-24 flex-col p-5 sm:p-6">
            <CardHead step="5" title="Version 2 roadmap" subtitle={ROADMAP_INTRO} />

            {/* The mockup's green landscape, with a route across the three
                phases. Decoration only: every item on it is still labelled
                an idea that has not been built. */}
            <div className="relative mt-4 flex-1 overflow-hidden rounded-[24px] bg-gradient-to-b from-[#e9f5e1] to-[#d9edcc] px-4 pb-4 pt-4">
              <svg
                viewBox="0 0 1000 220"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full"
                aria-hidden="true"
              >
                <path
                  d="M0 150 C 160 96 300 196 470 150 C 650 100 820 190 1000 136 L1000 220 L0 220 Z"
                  fill="#bcdfa6"
                  opacity="0.9"
                />
                <path
                  d="M0 186 C 200 142 360 224 560 184 C 760 144 880 206 1000 180 L1000 220 L0 220 Z"
                  fill="#9ecd86"
                  opacity="0.85"
                />
              </svg>

              <div className="relative">
                <svg
                  viewBox="0 0 1000 40"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-x-[16%] top-[13px] hidden h-[26px] w-[68%] lg:block"
                  aria-hidden="true"
                >
                  <path
                    d="M0 26 C 180 -6 330 36 500 18 C 670 0 820 34 1000 10"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="15 13"
                  />
                </svg>

                <div className="relative grid gap-3 lg:grid-cols-3">
                  {ROADMAP_PHASES.map((phase, index) => {
                    const style = ROADMAP_STYLE[index % ROADMAP_STYLE.length];
                    return (
                      <div key={phase.id} className="flex flex-col">
                        <MapPin
                          className={`mx-auto h-9 w-9 shrink-0 fill-white ${style.pin}`}
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                        <div
                          className={`mt-1 flex h-full flex-col rounded-[20px] border border-white/70 p-3.5 shadow-sm ${TINT[style.tint].card}`}
                        >
                          <div className="text-center">
                            <h3 className="font-poppins text-[18px] font-extrabold leading-tight text-leaf-900">
                              {phase.id}
                            </h3>
                            <span className="block text-[12.5px] font-semibold text-leaf-600">
                              ({phase.term})
                            </span>
                          </div>
                          <span className="mx-auto mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-leaf-200 bg-white/85 px-2.5 py-0.5 text-[10.5px] font-bold text-leaf-500">
                            <CircleDashed className="h-3 w-3" aria-hidden="true" />
                            {ROADMAP_STATUS_LABEL}
                          </span>
                          <ul className="mt-2.5 space-y-1.5">
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
                                    <span className="mt-0.5 block w-fit max-w-full rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold leading-snug text-peach-600">
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

                <p className="mt-3 rounded-2xl bg-cream-100/90 px-4 py-2.5 text-[12px] font-medium text-leaf-700">
                  {ROADMAP_NOTE}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Final CTA */}
        <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[28px] bg-gradient-to-r from-leaf-800 to-leaf-700 p-6 pt-[92px] text-center shadow-card sm:flex-row sm:justify-between sm:gap-4 sm:p-7 sm:pl-[272px] sm:text-left">
          <Image
            src="/images/week6/straw-lg.webp"
            alt=""
            width={175}
            height={74}
            loading="lazy"
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-3.5 w-[172px] -translate-x-1/2 drop-shadow-[0_10px_14px_rgba(0,0,0,0.28)] sm:left-[-22px] sm:top-1/2 sm:w-[290px] sm:translate-x-0 sm:-translate-y-1/2"
          />
          <div className="relative">
            <p className="font-poppins text-[24px] font-extrabold text-white sm:text-[28px]">
              {DEMO_CTA.title}
            </p>
            <p className="mt-1 text-[15px] text-leaf-100">{DEMO_CTA.subtitle}</p>
          </div>
          <div className="relative flex items-center gap-5">
            <Heart
              className="hidden h-11 w-11 text-white/85 lg:block"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <Link
              href={DEMO_CTA.href}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-peach-500 px-8 py-3.5 text-[15px] font-bold text-white shadow-btn transition-colors hover:bg-peach-600"
            >
              {DEMO_CTA.button}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
