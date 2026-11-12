import { Fragment } from "react";
import Link from "next/link";
import { FEATURES, PLANS, SEGMENTS, type PlanId } from "@/lib/productData";
import { formatWeekly } from "@/lib/pricing";
import {
  Card,
  CardHead,
  HeroArt,
  HeroLabel,
  IconBadge,
  PageHero,
  PageShell,
  Sparkle,
  StatTile,
  StepArrow,
  StepItem,
  StepStrip,
  TableWrap,
} from "@/components/ui/pieces";
import { CARD_SUBTITLE, TINT, type TintName } from "@/components/ui/theme";

function includesPlan(plans: PlanId[], plan: PlanId): boolean {
  return plans.includes(plan);
}

const PLAN_STYLE: Record<
  PlanId,
  {
    headerBg: string;
    headerText: string;
    cardBg: string;
    cardBorder: string;
    text: string;
    button: string;
    emoji: string;
    /** Column tint behind that plan's cells in the feature map. */
    columnBg: string;
    badge: string;
  }
> = {
  basic: {
    headerBg: "bg-leaf-100",
    headerText: "text-leaf-700",
    cardBg: "bg-leaf-50",
    cardBorder: "border-leaf-100",
    text: "text-leaf-700",
    button: "bg-leaf-600 hover:bg-leaf-700",
    emoji: "🌱",
    columnBg: "bg-leaf-50/70",
    badge: "bg-leaf-100 text-leaf-700",
  },
  plus: {
    headerBg: "bg-peach-100",
    headerText: "text-peach-700",
    cardBg: "bg-peach-50",
    cardBorder: "border-peach-100",
    text: "text-peach-600",
    button: "bg-peach-500 hover:bg-peach-600",
    emoji: "👨‍🍳",
    columnBg: "bg-peach-50/70",
    badge: "bg-peach-100 text-peach-700",
  },
  premium: {
    headerBg: "bg-blue-100",
    headerText: "text-blue-700",
    cardBg: "bg-blue-50",
    cardBorder: "border-blue-100",
    text: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    emoji: "👑",
    columnBg: "bg-sky-50/70",
    badge: "bg-sky-100 text-sky-700",
  },
};

const SEGMENT_EMOJI = ["👩", "🏠"];

/** Pastel tint per segment card, matching the mockup's green / pink pair. */
const SEGMENT_TINTS: TintName[] = ["green", "pink"];

const BEST_FOR: Record<PlanId, string> = {
  basic: "Families who want simple, healthy planning",
  plus: "Families who want more control over meals",
  premium: "Families who want the full experience",
};

const STEPS = [
  "Compare features",
  "Pick a plan",
  "See who it's for",
  "Estimate revenue",
];

/** Pastel tint per stat tile, left to right. */
const STAT_TINTS: TintName[] = ["green", "cream", "pink", "blue"];

export default function ProductPage() {
  const minWeeklyPrice = Math.min(...PLANS.map((plan) => plan.weeklyPrice));
  const maxWeeklyPrice = Math.max(...PLANS.map((plan) => plan.weeklyPrice));

  const STAT_TILES = [
    { icon: "🏷️", value: `${PLANS.length}`, label: "plans" },
    { icon: "✨", value: `${FEATURES.length}`, label: "features" },
    { icon: "👥", value: `${SEGMENTS.length}`, label: "customer segments" },
    {
      icon: "💲",
      value: `$${minWeeklyPrice} to $${maxWeeklyPrice}`,
      label: "per week",
    },
  ];

  return (
    <PageShell>
      {/* Hero */}
      <PageHero
        label={
          <HeroLabel badge={<IconBadge tint="peach" size="sm">🛍️</IconBadge>}>
            Product
          </HeroLabel>
        }
        title={
          <>
            A smarter way to plan{" "}
            <span className="text-peach-500">healthy lunches.</span>
          </>
        }
        subtitle="See what Lunchies offers, our plans and who it's for."
        art={
          <HeroArt
            src="/images/redesign/hero-product.webp"
            width={560}
            height={510}
            tone="peach"
            priority
            glyph="🍱"
          />
        }
      />

      {/* Stat tiles */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {STAT_TILES.map((tile, index) => (
          <StatTile
            key={tile.label}
            tint={STAT_TINTS[index % STAT_TINTS.length]}
            icon={tile.icon}
            value={tile.value}
            label={tile.label}
          />
        ))}
      </div>

      {/* Step bar */}
      <StepStrip className="mt-6">
        {STEPS.map((step, index) => (
          <Fragment key={step}>
            {index > 0 && <StepArrow>→</StepArrow>}
            <StepItem index={index + 1}>{step}</StepItem>
          </Fragment>
        ))}
      </StepStrip>

      <div className="mt-10 space-y-6">
        {/* Section 1: Feature map */}
        <Card tint="plain" className="p-6 sm:p-8">
          <CardHead
            step="1"
            badge={<IconBadge tint="green">✨</IconBadge>}
            title="Product feature map"
            subtitle="Compare what's included in each plan."
          />
          <p className="mt-2 text-xs text-leaf-500">
            This is the planned product. Today, the live feature is the
            personalized 5-day lunch plan on Core.
          </p>

          <TableWrap className="mt-6">
            <table className="w-full table-fixed border-separate border-spacing-0 text-left text-xs sm:table-auto sm:min-w-[560px] sm:text-[14px]">
              <thead>
                <tr>
                  <th className="w-2/5 py-2.5 pr-2 align-bottom text-[13px] font-bold text-leaf-700 sm:w-auto sm:pr-4">
                    Feature
                  </th>
                  {PLANS.map((plan) => {
                    const style = PLAN_STYLE[plan.id];
                    return (
                      <th
                        key={plan.id}
                        className={`w-1/5 rounded-t-2xl px-1.5 py-3 text-center sm:w-auto sm:px-4 sm:py-4 ${style.headerBg} ${style.headerText}`}
                      >
                        <div className="font-poppins text-sm font-extrabold sm:text-base">
                          {plan.name}
                        </div>
                        <div className="text-[10px] font-semibold opacity-80 sm:text-xs">
                          {formatWeekly(plan.weeklyPrice)}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature, rowIndex) => {
                  const isLast = rowIndex === FEATURES.length - 1;
                  return (
                    <tr key={feature.name} className="text-leaf-800">
                      <td
                        className={`py-2.5 pr-2 font-medium sm:pr-4 ${
                          isLast ? "" : "border-b border-leaf-100"
                        }`}
                      >
                        {feature.name}
                      </td>
                      {PLANS.map((plan) => {
                        const style = PLAN_STYLE[plan.id];
                        return (
                          <td
                            key={plan.id}
                            className={`px-1.5 py-2.5 text-center sm:px-4 ${style.columnBg} ${
                              isLast
                                ? "rounded-b-2xl"
                                : "border-b border-white/80"
                            }`}
                          >
                            {includesPlan(feature.plans, plan.id) ? (
                              <span
                                className="mx-auto flex h-[22px] w-[22px] items-center justify-center rounded-full bg-leaf-600 text-[11px] font-bold text-white shadow-sm"
                                aria-label="Included"
                              >
                                ✓
                              </span>
                            ) : (
                              <span
                                className="text-leaf-300"
                                aria-label="Not included"
                              >
                                —
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrap>
        </Card>

        {/* Section 2: Our plans */}
        <Card tint="plain" className="p-6 sm:p-8">
          <CardHead
            step="2"
            badge={<IconBadge tint="peach">🏷️</IconBadge>}
            title="Our plans"
            subtitle="Choose the plan that fits your family's needs."
          />

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {PLANS.map((plan) => {
              const style = PLAN_STYLE[plan.id];
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-3xl border p-6 shadow-soft ${style.cardBg} ${style.cardBorder}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    {style.emoji}
                  </span>
                  <h3 className="mt-4 font-poppins text-lg font-extrabold text-leaf-900">
                    {plan.name}
                  </h3>
                  <p className="mt-1 flex items-baseline gap-1">
                    <span className="font-poppins text-3xl font-extrabold text-leaf-900">
                      ${plan.weeklyPrice}
                    </span>
                    <span className="text-sm font-semibold text-leaf-500">
                      / week
                    </span>
                  </p>
                  <p className="text-xs text-leaf-500">
                    about ${Math.round(plan.weeklyPrice / 5)} per day
                  </p>
                  <p className={`mt-3 text-sm font-semibold ${style.text}`}>
                    {plan.tagline}
                  </p>
                  <p className="mt-3 rounded-2xl bg-white/70 px-3 py-2 text-xs text-leaf-700">
                    <span className="font-bold">Best for:</span>{" "}
                    {BEST_FOR[plan.id]}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5 text-sm text-leaf-800">
                    {plan.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className={`${style.text} font-bold`}>✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/core"
                    className={`mt-6 rounded-full py-3 text-center text-sm font-bold text-white shadow-soft transition-colors ${style.button}`}
                  >
                    Get {plan.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Section 3: Customer segments */}
        <Card tint="green" className="p-6 sm:p-8">
          <CardHead
            step="3"
            badge={<IconBadge tint="green">👥</IconBadge>}
            title="Our customer segments"
            subtitle="We focus on two main groups of families."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {SEGMENTS.map((segment, index) => {
              const tint = TINT[SEGMENT_TINTS[index % SEGMENT_TINTS.length]];
              return (
                <div
                  key={segment.name}
                  className={`rounded-3xl border p-6 shadow-sm ${tint.card}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                    {SEGMENT_EMOJI[index] ?? "👥"}
                  </span>
                  <h3 className="mt-4 font-poppins text-base font-extrabold text-leaf-900">
                    {segment.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-leaf-700">
                    {segment.description}
                  </p>
                  <div className={`mt-5 border-t pt-4 ${tint.rule}`}>
                    <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-leaf-700 shadow-sm">
                      Key needs
                    </span>
                    <div className="mt-3 grid gap-2 text-sm text-leaf-800 sm:grid-cols-1">
                      {segment.needs.map((need) => (
                        <div key={need} className="flex items-start gap-2">
                          <span className="font-bold text-leaf-600">✓</span>
                          <span>{need}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* CTA */}
        <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[28px] border border-rose-100/70 bg-gradient-to-r from-[#fdeff1] to-[#fde9ec] p-6 text-center shadow-card sm:flex-row sm:justify-between sm:p-8 sm:text-left">
          <Sparkle
            className="absolute right-4 top-4 h-6 w-8 opacity-70"
            color="peach"
          />
          <p className="font-poppins text-lg font-extrabold text-leaf-900 sm:text-xl">
            Want to see what these plans could earn?
          </p>
          <Link
            href="/pricing"
            className="shrink-0 rounded-full bg-peach-500 px-8 py-3.5 text-[15px] font-bold text-white shadow-btn transition-colors hover:bg-peach-600"
          >
            Go to Pricing
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
