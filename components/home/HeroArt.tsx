import { Check, Heart } from "lucide-react";
import Lunchbox from "./Lunchbox";
import { HERO } from "@/lib/homepageData";

/**
 * The hero scene: a lunchbox on a checkered cloth, the handwritten note, the
 * checklist card and the phone. All CSS and emoji, no image files.
 */
export default function HeroArt() {
  return (
    <div className="relative mx-auto w-full max-w-[38rem]">
      {/* Checkered cloth */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-4 top-10 rotate-[-3deg] rounded-3xl opacity-80"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(228,164,106,0.3) 0 22px, transparent 22px 44px), repeating-linear-gradient(90deg, rgba(228,164,106,0.3) 0 22px, transparent 22px 44px)",
          backgroundColor: "#fdf1e3",
        }}
      />

      {/* Handwritten line */}
      <p className="font-caveat relative z-10 ml-2 max-w-[12rem] -rotate-3 text-2xl leading-tight text-leaf-700 sm:text-3xl">
        {HERO.note.handwritten}
        <Heart
          className="ml-1 inline h-4 w-4 text-leaf-600"
          aria-hidden="true"
        />
      </p>

      <div className="relative z-10 mt-2 flex items-start justify-center">
        {/* Lunchbox */}
        <div className="relative z-10 w-[64%] max-w-[22rem] shrink-0 rotate-[-2deg]">
          <Lunchbox
            size="large"
            items={["🥪", "🥒", "🍓", "🥕"]}
            boxTint="bg-leaf-300"
            innerTint="bg-leaf-100"
          />
        </div>

        <div className="relative z-20 -ml-4 mt-4 w-[42%] max-w-[13rem] space-y-3">
          {/* Checklist note */}
          <div className="rotate-[2deg] rounded-2xl bg-[#fdf6e3] p-3 shadow-md">
            <ul className="space-y-1.5">
              {HERO.note.checks.map((check) => (
                <li
                  key={check}
                  className="flex items-start gap-1.5 text-[11px] font-semibold text-leaf-800 sm:text-xs"
                >
                  <Check
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf-600"
                    aria-hidden="true"
                  />
                  <span className="font-caveat text-sm leading-tight sm:text-base">
                    {check}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phone */}
          <div className="rounded-2xl border-4 border-gray-900 bg-white p-2 shadow-lg">
            <p className="font-poppins text-[11px] font-bold text-leaf-900 sm:text-xs">
              {HERO.phone.title}
            </p>
            <ul className="mt-1.5 space-y-1">
              {HERO.phone.items.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-1.5 text-[10px] text-leaf-800 sm:text-[11px]"
                >
                  <span aria-hidden="true">{item.emoji}</span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Small orange stars */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-24 text-2xl text-peach-400"
      >
        ⭐
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-6 left-6 text-xl text-peach-300"
      >
        ⭐
      </span>
    </div>
  );
}
