import Link from "next/link";
import {
  CLOSING_CTA,
  HERO,
  HOW_IT_WORKS,
  LUNCH_STYLES,
  WHY_LUNCHIES,
} from "@/lib/homepageData";

/** The lunchbox is drawn with CSS and emoji, so there is no image to load. */
function LunchboxIllustration() {
  return (
    <div
      className="relative mx-auto w-full max-w-[22rem]"
      role="img"
      aria-label={HERO.lunchbox.caption}
    >
      <span
        aria-hidden="true"
        className="absolute -left-1 -top-2 text-2xl sm:-left-3 sm:text-3xl"
      >
        🍓
      </span>
      <span
        aria-hidden="true"
        className="absolute -right-1 top-10 text-2xl sm:-right-3 sm:text-3xl"
      >
        🥦
      </span>

      {/* Handle */}
      <div className="mx-auto h-7 w-24 rounded-t-full border-4 border-b-0 border-leaf-600" />

      {/* Box */}
      <div className="rounded-3xl border-4 border-leaf-600 bg-peach-100 p-3 shadow-lg">
        {/* Lid strip */}
        <div className="mx-auto mb-3 h-2 w-2/3 rounded-full bg-leaf-600/30" />

        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white/70 p-2">
          {HERO.lunchbox.items.map((item) => (
            <div
              key={item.label}
              className="flex aspect-square items-center justify-center rounded-xl bg-leaf-50 text-3xl shadow-sm sm:text-4xl"
            >
              <span aria-hidden="true">{item.emoji}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shadow under the box */}
      <div className="mx-auto mt-4 h-3 w-3/4 rounded-full bg-leaf-200/60 blur-sm" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-peach-50">
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-leaf-700 shadow-sm sm:text-sm">
              <span aria-hidden="true">🌿</span>
              {HERO.badge}
            </span>

            <h1 className="font-poppins mt-5 text-4xl font-extrabold tracking-tight text-gray-800 sm:text-5xl">
              {HERO.headlineLead}{" "}
              <span className="text-peach-500">{HERO.headlineAccent}</span>
            </h1>

            <p className="mt-5 max-w-md text-lg text-gray-600">
              {HERO.subheadline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={HERO.primaryCta.href}
                className="rounded-full bg-leaf-600 px-7 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-leaf-700"
              >
                {HERO.primaryCta.label}
              </Link>
              <a
                href={HERO.secondaryCta.href}
                className="rounded-full border-2 border-leaf-600 px-7 py-3 font-semibold text-leaf-700 transition-colors hover:bg-leaf-50"
              >
                {HERO.secondaryCta.label}
              </a>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-leaf-800 sm:grid-cols-4 md:grid-cols-2">
              {HERO.benefits.map((benefit) => (
                <li key={benefit.label} className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-lg">
                    {benefit.icon}
                  </span>
                  <span className="min-w-0">{benefit.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center md:justify-end">
            <LunchboxIllustration />
          </div>
        </div>
      </section>

      {/* 2. How it works */}
      <section id={HOW_IT_WORKS.id} className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="font-poppins text-center text-2xl font-extrabold text-leaf-800 sm:text-3xl">
            {HOW_IT_WORKS.heading}
          </h2>
          <p className="mt-2 text-center text-leaf-600">
            {HOW_IT_WORKS.intro}
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {HOW_IT_WORKS.steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                    <span aria-hidden="true">{step.icon}</span>
                  </span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-poppins mt-4 font-semibold text-leaf-800">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-leaf-700">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Lunch styles */}
      <section className="bg-leaf-50">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="font-poppins text-center text-2xl font-extrabold text-leaf-800 sm:text-3xl">
            {LUNCH_STYLES.heading}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-leaf-600">
            {LUNCH_STYLES.intro}
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {LUNCH_STYLES.styles.map((style) => (
              <div
                key={style.name}
                className="flex flex-col rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-peach-100 text-3xl">
                  <span aria-hidden="true">{style.icon}</span>
                </span>
                <h3 className="font-poppins mt-4 font-semibold text-leaf-800">
                  {style.name}
                </h3>
                <p className="mt-1.5 text-sm text-leaf-700">
                  {style.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={LUNCH_STYLES.cta.href}
              className="inline-block rounded-full bg-peach-500 px-7 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-peach-600"
            >
              {LUNCH_STYLES.cta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Why families choose Lunchies */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="font-poppins text-center text-2xl font-extrabold text-leaf-800 sm:text-3xl">
            {WHY_LUNCHIES.heading}
          </h2>
          <p className="mt-2 text-center text-leaf-600">
            {WHY_LUNCHIES.intro}
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {WHY_LUNCHIES.benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex gap-4 rounded-2xl border border-leaf-100 bg-leaf-50 p-6 shadow-sm"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                  <span aria-hidden="true">{benefit.icon}</span>
                </span>
                <div className="min-w-0">
                  <h3 className="font-poppins font-semibold text-leaf-800">
                    {benefit.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-leaf-700">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Closing call to action */}
      <section className="bg-leaf-100">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-poppins text-2xl font-extrabold text-leaf-800 sm:text-3xl">
              {CLOSING_CTA.heading}
            </h2>
            <p className="mt-2 text-leaf-700">{CLOSING_CTA.description}</p>
          </div>
          <Link
            href={CLOSING_CTA.cta.href}
            className="shrink-0 rounded-full bg-leaf-600 px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-leaf-700"
          >
            {CLOSING_CTA.cta.label}
          </Link>
        </div>
      </section>
    </>
  );
}
