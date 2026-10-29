"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import Lunchbox from "./Lunchbox";
import { LUNCH_STYLES } from "@/lib/homepageData";

export default function LunchStylesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollNext(emblaApi.canScrollNext() || emblaApi.canScrollPrev());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  /** Wraps back to the start once the last card is reached. */
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    if (emblaApi.canScrollNext()) emblaApi.scrollNext();
    else emblaApi.scrollTo(0);
  }, [emblaApi]);

  return (
    <div className="relative min-w-0">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {LUNCH_STYLES.styles.map((style) => (
            <article
              key={style.name}
              className={`flex min-w-0 flex-[0_0_72%] flex-col rounded-3xl p-4 sm:flex-[0_0_47%] lg:flex-[0_0_31%] ${style.tint}`}
            >
              <Lunchbox
                items={style.items}
                boxTint={style.boxTint}
                innerTint="bg-white/70"
              />
              <h3 className="font-poppins mt-4 font-bold text-leaf-900">
                {style.name}
              </h3>
              <p className="mt-1 text-sm leading-snug text-leaf-700">
                {style.description}
              </p>
            </article>
          ))}
        </div>
      </div>

      {canScrollNext && (
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Show more lunch styles"
          className="absolute -right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-leaf-700 shadow-lg transition-colors hover:bg-leaf-600 hover:text-white sm:-right-4"
        >
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
