"use client";

import Image from "next/image";
import { HERO_NOTES, HERO_PHONE } from "@/lib/marketingData";
import { IMAGES } from "@/lib/marketingImages";

/**
 * The hero illustration: a phone showing a Lunchies post, a handwritten note
 * and the floating labels. Built from CSS and emoji, so there is no image.
 */
export default function HeroArt() {
  return (
    <div className="relative mx-auto w-full max-w-[26rem] sm:max-w-[30rem]">
      {/* Mint blob behind everything */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-6 h-[78%] w-[82%] rounded-[45%] bg-leaf-100/70 blur-[2px]"
      />

      {/* Sketch strokes */}
      <span
        aria-hidden="true"
        className="absolute left-[30%] top-0 text-xl font-bold text-peach-400"
      >
        ⁄⁄
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-16 left-0 hidden text-xl font-bold text-leaf-400 sm:block"
      >
        ⁄⁄⁄
      </span>

      <div className="relative flex items-start justify-center gap-2 pt-6">
        {/* Phone */}
        <div className="relative z-10 w-[11rem] shrink-0 rounded-[1.75rem] border-[6px] border-gray-900 bg-white shadow-xl sm:w-[13rem]">
          <div className="flex items-center justify-between px-3 pb-1 pt-2 text-[9px] font-semibold text-gray-700">
            <span>9:41</span>
            <span aria-hidden="true">▂▄ ▮</span>
          </div>

          <div className="flex items-center justify-between px-3 pb-2">
            <span className="flex items-center gap-1 text-[11px] font-bold text-leaf-700">
              <span aria-hidden="true">🍎</span>
              {HERO_PHONE.handle}
            </span>
            <span aria-hidden="true" className="text-xs text-gray-400">
              •••
            </span>
          </div>

          {/* The post */}
          <div className="relative mx-2 aspect-square overflow-hidden rounded-2xl bg-leaf-50">
            <Image
              src={IMAGES.lunchboxSandwichFruit.src}
              alt={IMAGES.lunchboxSandwichFruit.alt}
              fill
              sizes="(max-width: 640px) 45vw, 220px"
              className="object-cover"
            />
          </div>

          <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-500">
            <span aria-hidden="true" className="flex gap-2">
              <span>♥</span>
              <span>💬</span>
              <span>➤</span>
            </span>
            <span aria-hidden="true">🔖</span>
          </div>

          <p className="px-3 pb-3 text-[11px] font-bold leading-snug text-gray-800">
            {HERO_PHONE.caption} <span aria-hidden="true">🍎</span>
          </p>
        </div>

        {/* Floating labels */}
        <ul className="z-10 -ml-2 mt-6 space-y-2 sm:-ml-4 sm:mt-10">
          {HERO_NOTES.map((note, index) => (
            <li
              key={note.label}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 shadow-sm sm:text-sm ${
                ["bg-leaf-100", "bg-peach-100", "bg-rose-100", "bg-leaf-50"][
                  index % 4
                ]
              }`}
            >
              {note.label}
              <span aria-hidden="true">{note.icon}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Handwritten note, tucked over the phone */}
      <div className="absolute -left-1 top-20 z-20 w-32 rotate-[-6deg] rounded-xl bg-rose-100 p-3 shadow-md sm:w-36">
        <span aria-hidden="true" className="text-sm">
          ❤️
        </span>
        <p className="mt-1 text-[11px] font-semibold italic leading-snug text-rose-700">
          {HERO_PHONE.note}
        </p>
      </div>
    </div>
  );
}
