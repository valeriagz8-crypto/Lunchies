import Link from "next/link";
import { caveat } from "@/lib/fonts";
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
    text: string;
    button: string;
    emoji: string;
  }
> = {
  basic: {
    headerBg: "bg-[#EAF4EC]",
    headerText: "text-[#2F6B3F]",
    cardBg: "bg-[#EAF4EC]",
    text: "text-[#2F6B3F]",
    button: "bg-[#2F6B3F]",
    emoji: "🌱",
  },
  plus: {
    headerBg: "bg-[#FFF1E4]",
    headerText: "text-[#F08A3C]",
    cardBg: "bg-[#FFF1E4]",
    text: "text-[#F08A3C]",
    button: "bg-[#F08A3C]",
    emoji: "👨‍🍳",
  },
  premium: {
    headerBg: "bg-[#E8F1FD]",
    headerText: "text-[#2F7BE6]",
    cardBg: "bg-[#E8F1FD]",
    text: "text-[#2F7BE6]",
    button: "bg-[#2F7BE6]",
    emoji: "👑",
  },
};

const SEGMENT_EMOJI = ["👩", "🏠"];

export default function ProductPage() {
  return (
    <div className="bg-[#FBF8F1]">
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        {/* Hero */}
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-[#2F6B3F]">
              Product
            </span>
            <h1 className="mt-3 text-5xl font-extrabold text-[#1F2A24]">
              A smarter way to plan{" "}
              <span className="text-[#F08A3C]">healthy lunches.</span>
            </h1>
            <p className="mt-4 text-gray-600">
              See what Lunchies offers, our plans and who it&apos;s for.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-56 w-56 shrink-0 items-center justify-center rounded-3xl bg-[#EAF4EC] text-[120px] leading-none">
              🍱
            </div>
            <p
              className={`-rotate-6 text-2xl text-[#2F6B3F] ${caveat.className}`}
            >
              Good food, brighter futures ♡
            </p>
          </div>
        </div>

        {/* Feature map */}
        <div className="rounded-2xl border border-[#E6EDE3] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1F2A24]">
            ✨ Product feature map
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Compare what&apos;s included in each plan.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr>
                  <th className="py-2 pr-4 font-medium text-gray-500">
                    Feature
                  </th>
                  {PLANS.map((plan) => {
                    const style = PLAN_STYLE[plan.id];
                    return (
                      <th
                        key={plan.id}
                        className={`rounded-t-lg px-4 py-3 text-center ${style.headerBg} ${style.headerText}`}
                      >
                        <div className="font-bold">{plan.name}</div>
                        <div className="text-xs font-normal">
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
                    className="border-b border-gray-100 text-[#1F2A24]"
                  >
                    <td className="py-2.5 pr-4">{feature.name}</td>
                    {PLANS.map((plan) => (
                      <td key={plan.id} className="py-2.5 pr-4 text-center">
                        {includesPlan(feature.plans, plan.id) ? (
                          <span
                            className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#2F6B3F] text-xs text-white"
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

        {/* Our plans */}
        <div className="rounded-2xl border border-[#E6EDE3] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1F2A24]">🏷️ Our plans</h2>
          <p className="mt-1 text-sm text-gray-600">
            Choose the plan that fits your family&apos;s needs.
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {PLANS.map((plan) => {
              const style = PLAN_STYLE[plan.id];
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-2xl border border-[#E6EDE3] p-5 ${style.cardBg}`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                    {style.emoji}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-[#1F2A24]">
                    {plan.name}
                  </h3>
                  <p className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#1F2A24]">
                      ${plan.weeklyPrice}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                      / week
                    </span>
                  </p>
                  <p className={`mt-2 text-sm font-medium ${style.text}`}>
                    {plan.tagline}
                  </p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-[#1F2A24]">
                    {plan.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className={`${style.text} font-bold`}>✓</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/core"
                    className={`mt-6 rounded-lg py-2.5 text-center text-sm font-bold text-white ${style.button}`}
                  >
                    Get {plan.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer segments */}
        <div className="rounded-2xl border border-[#E6EDE3] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-[#1F2A24]">
            👥 Our customer segments
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            We focus on two main groups of families.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {SEGMENTS.map((segment, index) => (
              <div
                key={segment.name}
                className="rounded-2xl border border-[#E6EDE3] bg-white p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF4EC] text-xl">
                  {SEGMENT_EMOJI[index] ?? "👥"}
                </span>
                <h3 className="mt-3 text-base font-bold text-[#1F2A24]">
                  {segment.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {segment.description}
                </p>
                <div className="mt-4 flex items-start justify-between gap-3 border-t border-[#E6EDE3] pt-4">
                  <span className="shrink-0 text-sm font-semibold text-[#1F2A24]">
                    Key needs
                  </span>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-[#1F2A24]">
                    {segment.needs.map((need) => (
                      <div key={need} className="flex items-start gap-1.5">
                        <span className="font-bold text-[#2F6B3F]">✓</span>
                        <span>{need}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
