import { Fragment } from "react";
import Link from "next/link";
import { FEATURES, PLANS, SEGMENTS, type PlanId } from "@/lib/productData";
import { formatWeekly } from "@/lib/pricing";

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
  },
  plus: {
    headerBg: "bg-peach-100",
    headerText: "text-peach-700",
    cardBg: "bg-peach-50",
    cardBorder: "border-peach-100",
    text: "text-peach-600",
    button: "bg-peach-500 hover:bg-peach-600",
    emoji: "👨‍🍳",
  },
  premium: {
    headerBg: "bg-blue-100",
    headerText: "text-blue-700",
    cardBg: "bg-blue-50",
    cardBorder: "border-blue-100",
    text: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    emoji: "👑",
  },
};

const SEGMENT_EMOJI = ["👩", "🏠"];

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
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-peach-100 text-3xl"
              aria-hidden="true"
            >
              🛍️
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-peach-500">
              Product
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">
            A smarter way to plan{" "}
            <span className="text-peach-500">healthy lunches.</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-gray-600">
            See what Lunchies offers, our plans and who it&apos;s for.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <span className="text-6xl leading-none" aria-hidden="true">
            🍱
          </span>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_TILES.map((tile) => (
          <div
            key={tile.label}
            className="rounded-2xl border border-leaf-100 bg-leaf-50 p-4 text-center shadow-sm"
          >
            <span className="text-2xl" aria-hidden="true">
              {tile.icon}
            </span>
            <p className="mt-1 text-xl font-extrabold text-leaf-800">
              {tile.value}
            </p>
            <p className="text-xs text-leaf-600">{tile.label}</p>
          </div>
        ))}
      </div>

      {/* Step bar */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 rounded-full border border-leaf-100 bg-leaf-50 px-4 py-3 text-center text-xs font-medium text-leaf-700 sm:text-sm">
        {STEPS.map((step, index) => (
          <Fragment key={step}>
            {index > 0 && (
              <span aria-hidden="true" className="text-leaf-400">
                →
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-[10px] font-bold text-white">
                {index + 1}
              </span>
              {step}
            </span>
          </Fragment>
        ))}
      </div>

      <div className="mt-12 space-y-8">
        {/* Section 1: Feature map */}
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
              1
            </span>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
              <span aria-hidden="true">✨</span> Product feature map
            </h2>
          </div>
          <p className="mt-2 text-sm text-leaf-600">
            Compare what&apos;s included in each plan.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            This is the planned product. Today, the live feature is the
            personalized 5-day lunch plan on Core.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full table-fixed text-left text-xs sm:table-auto sm:min-w-[560px] sm:text-sm">
              <thead>
                <tr>
                  <th className="w-2/5 py-2 pr-2 font-medium text-leaf-600 sm:w-auto sm:pr-4">
                    Feature
                  </th>
                  {PLANS.map((plan) => {
                    const style = PLAN_STYLE[plan.id];
                    return (
                      <th
                        key={plan.id}
                        className={`w-1/5 rounded-t-lg px-1.5 py-2 text-center sm:w-auto sm:px-4 sm:py-3 ${style.headerBg} ${style.headerText}`}
                      >
                        <div className="font-bold">{plan.name}</div>
                        <div className="text-[10px] font-normal sm:text-xs">
                          {formatWeekly(plan.weeklyPrice)}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature) => (
                  <tr
                    key={feature.name}
                    className="border-b border-leaf-50 text-leaf-800"
                  >
                    <td className="py-2.5 pr-2 sm:pr-4">{feature.name}</td>
                    {PLANS.map((plan) => (
                      <td
                        key={plan.id}
                        className="py-2.5 pr-1 text-center sm:pr-4"
                      >
                        {includesPlan(feature.plans, plan.id) ? (
                          <span
                            className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-leaf-600 text-xs text-white"
                            aria-label="Included"
                          >
                            ✓
                          </span>
                        ) : (
                          <span
                            className="text-gray-400"
                            aria-label="Not included"
                          >
                            —
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Our plans */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
              2
            </span>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
              <span aria-hidden="true">🏷️</span> Our plans
            </h2>
          </div>
          <p className="mt-2 text-sm text-leaf-600">
            Choose the plan that fits your family&apos;s needs.
          </p>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {PLANS.map((plan) => {
              const style = PLAN_STYLE[plan.id];
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-2xl border p-5 ${style.cardBg} ${style.cardBorder}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                    {style.emoji}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-gray-800">
                    {plan.name}
                  </h3>
                  <p className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-gray-800">
                      ${plan.weeklyPrice}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      / week
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    about ${Math.round(plan.weeklyPrice / 5)} per day
                  </p>
                  <p className={`mt-2 text-sm font-medium ${style.text}`}>
                    {plan.tagline}
                  </p>
                  <p className="mt-2 text-xs text-leaf-600">
                    <span className="font-semibold">Best for:</span>{" "}
                    {BEST_FOR[plan.id]}
                  </p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-leaf-800">
                    {plan.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className={`${style.text} font-bold`}>✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/core"
                    className={`mt-6 rounded-full py-2.5 text-center text-sm font-bold text-white shadow-sm transition-colors ${style.button}`}
                  >
                    Get {plan.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Customer segments */}
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
              3
            </span>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
              <span aria-hidden="true">👥</span> Our customer segments
            </h2>
          </div>
          <p className="mt-2 text-sm text-leaf-600">
            We focus on two main groups of families.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {SEGMENTS.map((segment, index) => (
              <div
                key={segment.name}
                className="rounded-xl border border-leaf-100 bg-white p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-leaf-100 text-xl">
                  {SEGMENT_EMOJI[index] ?? "👥"}
                </span>
                <h3 className="mt-3 font-semibold text-leaf-800">
                  {segment.name}
                </h3>
                <p className="mt-1 text-sm text-leaf-700">
                  {segment.description}
                </p>
                <div className="mt-4 flex items-start justify-between gap-3 border-t border-leaf-100 pt-4">
                  <span className="shrink-0 text-sm font-medium text-leaf-800">
                    Key needs
                  </span>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-leaf-800">
                    {segment.needs.map((need) => (
                      <div key={need} className="flex items-start gap-1.5">
                        <span className="font-bold text-leaf-600">✓</span>
                        <span>{need}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-peach-100 bg-peach-50 p-6 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm font-semibold text-peach-700">
            Want to see what these plans could earn?
          </p>
          <Link
            href="/pricing"
            className="shrink-0 rounded-full bg-peach-500 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-peach-600"
          >
            Go to Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
