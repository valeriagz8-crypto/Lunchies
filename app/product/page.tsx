import Link from "next/link";
import { FEATURES, PLANS, SEGMENTS, type PlanId } from "@/lib/productData";

function formatWeekly(price: number): string {
  return `$${price.toLocaleString("en-US")}/week`;
}

function includesPlan(plans: PlanId[], plan: PlanId): boolean {
  return plans.includes(plan);
}

export default function ProductPage() {
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
              🧺
            </span>
            <span className="text-sm font-bold uppercase tracking-wide text-peach-500">
              Product
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-800 sm:text-4xl">
            A smarter way to plan{" "}
            <span className="text-leaf-600">healthy lunches</span>.
          </h1>
          <p className="mt-4 max-w-md text-lg text-gray-600">
            Personalized, nutritious and convenient lunches for kids, built
            for busy families.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <span className="text-6xl leading-none" aria-hidden="true">
            🥪
          </span>
        </div>
      </div>

      <div className="mt-12 space-y-8">
        {/* Feature map */}
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
            <span aria-hidden="true">🗺️</span> Product feature map
          </h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-leaf-100 text-leaf-600">
                  <th className="py-2 pr-4 font-medium">Feature</th>
                  {PLANS.map((plan) => (
                    <th
                      key={plan.id}
                      className="py-2 pr-4 text-center font-medium"
                    >
                      {plan.name}
                      <div className="font-normal text-leaf-500">
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
                      <td
                        key={plan.id}
                        className="py-3 pr-4 text-center text-lg"
                      >
                        {includesPlan(feature.plans, plan.id) ? (
                          <span className="text-leaf-600" aria-label="Included">
                            ✓
                          </span>
                        ) : (
                          <span className="text-gray-300" aria-label="Not included">
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
            <span aria-hidden="true">💳</span> Pricing plans
          </h2>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-leaf-700">
                  {plan.name}
                </h3>
                <p className="mt-1 text-2xl font-extrabold text-gray-800">
                  {formatWeekly(plan.weeklyPrice)}
                </p>
                <p className="mt-2 text-sm text-leaf-600">{plan.tagline}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-leaf-800">
                  {plan.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="text-leaf-600" aria-hidden="true">
                        ✓
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/core"
                  className="mt-6 rounded-full bg-leaf-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-leaf-700"
                >
                  Get {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Customer segments */}
        <div className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-leaf-700">
            <span aria-hidden="true">👪</span> Customer segments
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {SEGMENTS.map((segment) => (
              <div
                key={segment.name}
                className="rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-leaf-700">
                  {segment.name}
                </h3>
                <p className="mt-2 text-sm text-leaf-800">
                  {segment.description}
                </p>
                <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-leaf-500">
                  Key needs
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-leaf-800">
                  {segment.needs.map((need) => (
                    <li key={need} className="flex items-start gap-2">
                      <span className="text-peach-500" aria-hidden="true">
                        •
                      </span>
                      <span>{need}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
