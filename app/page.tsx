import { Fragment } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroArt from "@/components/home/HeroArt";
import LunchStylesCarousel from "@/components/home/LunchStylesCarousel";
import Spark from "@/components/home/Spark";
import StepArt from "@/components/home/StepArt";
import { ICONS, ICON_COLORS } from "@/components/home/icons";
import {
  CLOSING_CTA,
  HERO,
  HOW_IT_WORKS,
  LUNCH_STYLES,
  WHY_LUNCHIES,
} from "@/lib/homepageData";

/** Soft wave divider between the coloured bands. */
function Wave({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full sm:h-14 ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path
        fill="currentColor"
        d="M0 48c180-40 360-40 540-8s360 40 540 8 300-40 360-48v80H0z"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-gradient-to-br from-[#FDF7EE] via-[#FCF0E4] to-[#F9E5D6]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-peach-100 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-peach-700 sm:text-xs">
              {HERO.badge}
              <span aria-hidden="true">🌟</span>
            </span>

            <h1 className="font-poppins mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-leaf-900 sm:text-5xl lg:text-6xl">
              {HERO.headlineLine1}
              <br />
              {HERO.headlineLine2Lead}{" "}
              <span className="text-peach-500">{HERO.headlineAccent}</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-leaf-800 sm:text-lg">
              {HERO.subheadline}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={HERO.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-leaf-700 px-7 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-leaf-800"
              >
                {HERO.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={HERO.secondaryCta.href}
                className="inline-flex items-center rounded-full border-2 border-leaf-600 px-7 py-3 font-semibold text-leaf-700 transition-colors hover:bg-leaf-50"
              >
                {HERO.secondaryCta.label}
              </a>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {HERO.benefits.map((benefit) => {
                const Icon = ICONS[benefit.icon];
                return (
                  <li key={benefit.label} className="flex items-start gap-2">
                    <Icon
                      className={`mt-0.5 h-5 w-5 shrink-0 ${ICON_COLORS[benefit.icon]}`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 text-sm leading-tight text-leaf-800">
                      {benefit.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroArt />
          </div>
        </div>
      </section>

      {/* 2. How it works */}
      <section
        id={HOW_IT_WORKS.id}
        className="scroll-mt-20 bg-[#FDF7EE] px-4 py-10 sm:px-6"
      >
        <div className="mx-auto max-w-6xl rounded-[2.5rem] bg-[#EDF6EC] p-6 sm:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-poppins flex items-center gap-1 text-2xl font-extrabold text-leaf-900 sm:text-3xl">
                {HOW_IT_WORKS.heading}
                <Spark />
              </h2>
              <p className="mt-1.5 text-sm text-leaf-700 sm:text-base">
                {HOW_IT_WORKS.intro}
              </p>
            </div>
            <Link
              href={HOW_IT_WORKS.link.href}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-700 transition-colors hover:text-peach-600"
            >
              {HOW_IT_WORKS.link.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-7 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
            {HOW_IT_WORKS.steps.map((step, index) => (
              <Fragment key={step.number}>
                <div
                  className={`flex min-w-0 gap-4 rounded-3xl p-5 ${step.tint}`}
                >
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/70">
                    <StepArt art={step.art} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-poppins font-bold text-leaf-900">
                      {step.number}. {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-snug text-leaf-700">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < HOW_IT_WORKS.steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden items-center justify-center text-leaf-600 md:flex"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Lunches made for every child */}
      <div className="bg-[#FDF7EE] text-[#FBEADF]">
        <Wave />
      </div>
      <section className="bg-[#FBEADF]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-8 pt-2 sm:px-6 sm:pb-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-peach-600 sm:text-xs">
              {LUNCH_STYLES.label}
            </span>
            <h2 className="font-poppins mt-3 text-3xl font-extrabold leading-tight text-leaf-900 sm:text-4xl">
              {LUNCH_STYLES.headingLead}{" "}
              <span className="text-peach-500">
                {LUNCH_STYLES.headingAccent}
              </span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-leaf-800 sm:text-base">
              {LUNCH_STYLES.intro}
            </p>
            <Link
              href={LUNCH_STYLES.cta.href}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-leaf-700 px-7 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-leaf-800"
            >
              {LUNCH_STYLES.cta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <LunchStylesCarousel />
        </div>
      </section>

      {/* 4. Why families choose Lunchies */}
      <div className="bg-[#FBEADF] text-[#EDF6EC]">
        <Wave />
      </div>
      <section className="bg-[#EDF6EC]">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-2 sm:px-6">
          <h2 className="font-poppins flex items-center gap-1 text-2xl font-extrabold text-leaf-900 sm:text-3xl">
            {WHY_LUNCHIES.heading}
            <Spark />
          </h2>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {WHY_LUNCHIES.benefits.map((benefit, index) => {
              const Icon = ICONS[benefit.icon];
              return (
                <li
                  key={benefit.title}
                  className={`min-w-0 lg:px-6 ${
                    index > 0 ? "lg:border-l lg:border-leaf-200" : ""
                  }`}
                >
                  <Icon
                    className={`h-7 w-7 ${ICON_COLORS[benefit.icon]}`}
                    aria-hidden="true"
                    strokeWidth={1.75}
                  />
                  <h3 className="font-poppins mt-3 font-bold text-leaf-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-snug text-leaf-700">
                    {benefit.description}
                  </p>
                </li>
              );
            })}
          </ul>

          {/* 5. Closing band */}
          <div className="mt-10 flex flex-col items-center gap-5 rounded-[2rem] bg-[#FBEADF] px-6 py-7 text-center sm:px-10 md:flex-row md:justify-between md:text-left">
            <div className="flex items-center gap-5">
              <span aria-hidden="true" className="hidden text-5xl sm:block">
                🥕
              </span>
              <div>
                <h2 className="font-poppins text-xl font-extrabold text-leaf-900 sm:text-2xl">
                  {CLOSING_CTA.headingLead}{" "}
                  <span className="text-peach-500">
                    {CLOSING_CTA.headingAccent}
                  </span>
                  {CLOSING_CTA.headingTail}
                </h2>
                <p className="mt-1.5 text-sm text-leaf-700 sm:text-base">
                  {CLOSING_CTA.description}
                </p>
              </div>
            </div>
            <Link
              href={CLOSING_CTA.cta.href}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-leaf-700 px-7 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-leaf-800"
            >
              {CLOSING_CTA.cta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
