import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { caveat } from "@/lib/fonts";
import { FEATURES, PLANS, SEGMENTS, type PlanId } from "@/lib/productData";
import { formatWeekly } from "@/lib/pricing";
import {
  ChefHatIcon,
  CheckIcon,
  CreditCardIcon,
  CrownIcon,
  HeartIcon,
  HouseIcon,
  LeafIcon,
  PeopleIcon,
  TableIcon,
} from "@/components/icons";

function includesPlan(plans: PlanId[], plan: PlanId): boolean {
  return plans.includes(plan);
}

const PLAN_STYLES: Record<
  PlanId,
  {
    headerBg: string;
    cardBg: string;
    cardBorder: string;
    iconBg: string;
    iconColor: string;
    button: string;
    Icon: typeof LeafIcon;
  }
> = {
  basic: {
    headerBg: "bg-leaf-100",
    cardBg: "bg-leaf-50",
    cardBorder: "border-leaf-200",
    iconBg: "bg-leaf-100",
    iconColor: "text-leaf-700",
    button: "bg-leaf-600 hover:bg-leaf-700",
    Icon: LeafIcon,
  },
  plus: {
    headerBg: "bg-peach-100",
    cardBg: "bg-peach-50",
    cardBorder: "border-peach-200",
    iconBg: "bg-peach-100",
    iconColor: "text-peach-600",
    button: "bg-peach-500 hover:bg-peach-600",
    Icon: ChefHatIcon,
  },
  premium: {
    headerBg: "bg-blue-100",
    cardBg: "bg-blue-50",
    cardBorder: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
    Icon: CrownIcon,
  },
};

const SEGMENT_ICONS = [PeopleIcon, HouseIcon];

export default function ProductPage() {
  const hasLunchboxImage = fs.existsSync(
    path.join(process.cwd(), "public/images/lunchbox.png"),
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-peach-100 text-peach-600">
              <LeafIcon className="h-7 w-7" />
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
            Personalized, nutritious and convenient lunches for kids, built
            for busy families.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end">
          {hasLunchboxImage ? (
            <Image
              src="/images/lunchbox.png"
              alt="Lunchbox illustration"
              width={320}
              height={320}
              className="h-auto w-full max-w-xs"
            />
          ) : (
            <div className="aspect-square w-full max-w-xs rounded-3xl border border-dashed border-leaf-200 bg-white/60" />
          )}
          <p
            className={`mt-4 flex items-center gap-2 text-2xl text-leaf-700 ${caveat.className}`}
          >
            Good food, brighter futures
            <HeartIcon className="h-5 w-5 text-peach-500" />
          </p>
        </div>
      </div>

      <div className="mt-12 space-y-8">
        {/* Feature map */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
            <TableIcon className="h-5 w-5 text-leaf-600" />
            Product feature map
          </h2>
          <p className="mt-1 text-sm text-leaf-600">
            See what&apos;s included in each plan.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr>
                  <th className="py-2 pr-4 font-medium text-leaf-600">
                    Feature
                  </th>
                  {PLANS.map((plan) => (
                    <th
                      key={plan.id}
                      className={`rounded-t-xl py-3 px-4 text-center font-semibold text-gray-800 ${PLAN_STYLES[plan.id].headerBg}`}
                    >
                      {plan.name}
                      <div className="mt-0.5 text-xs font-normal text-gray-600">
                        {formatWeekly(plan.weeklyPrice)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature) => (
                  <tr
                    key={feature.name}
                    className="border-b border-leaf-50 text-leaf-800"
                  >
                    <td className="py-3 pr-4">{feature.name}</td>
                    {PLANS.map((plan) => (
                      <td key={plan.id} className="py-3 pr-4 text-center">
                        {includesPlan(feature.plans, plan.id) ? (
                          <span
                            className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-leaf-600 text-white"
                            aria-label="Included"
                          >
                            <CheckIcon className="h-3.5 w-3.5" />
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

        {/* Pricing plans */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
            <CreditCardIcon className="h-5 w-5 text-leaf-600" />
            Pricing plans
          </h2>
          <p className="mt-1 text-sm text-leaf-600">
            Simple plans for every family.
          </p>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => {
              const style = PLAN_STYLES[plan.id];
              return (
                <div
                  key={plan.id}
                  className={`flex flex-col rounded-2xl border p-6 shadow-sm ${style.cardBg} ${style.cardBorder}`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${style.iconBg} ${style.iconColor}`}
                  >
                    <style.Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-gray-800">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-2xl font-extrabold text-gray-800">
                    {formatWeekly(plan.weeklyPrice)}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">{plan.tagline}</p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-gray-700">
                    {plan.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <CheckIcon
                          className={`mt-0.5 h-4 w-4 shrink-0 ${style.iconColor}`}
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/core"
                    className={`mt-6 rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors ${style.button}`}
                  >
                    Get {plan.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer segments */}
        <div className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
            <PeopleIcon className="h-5 w-5 text-leaf-600" />
            Our customer segments
          </h2>
          <p className="mt-1 text-sm text-leaf-600">
            We focus on two main groups of families.
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {SEGMENTS.map((segment, index) => {
              const SegmentIcon = SEGMENT_ICONS[index] ?? PeopleIcon;
              return (
                <div
                  key={segment.name}
                  className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                    <SegmentIcon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-gray-800">
                    {segment.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-700">
                    {segment.description}
                  </p>
                  <div className="mt-4 rounded-xl border border-leaf-100 bg-white p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-leaf-600">
                      Key needs
                    </h4>
                    <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-gray-700">
                      {segment.needs.map((need) => (
                        <div key={need} className="flex items-start gap-1.5">
                          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                          <span>{need}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
