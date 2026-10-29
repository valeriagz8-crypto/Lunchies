import Image from "next/image";
import type { MarketingImage } from "@/lib/marketingImages";

/** A pastel body wrapper, so each section sits on its own colour. */
export function SectionPanel({
  tint,
  className = "",
  children,
}: {
  tint: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-[2rem] p-5 sm:p-7 ${tint} ${className}`}>
      {children}
    </div>
  );
}

/** Handwritten note on a rotated pastel card. */
export function StickyNote({
  children,
  tone = "peach",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "peach" | "mint" | "rose" | "cream";
  className?: string;
}) {
  const tones = {
    peach: "bg-peach-100",
    mint: "bg-leaf-100",
    rose: "bg-rose-100",
    cream: "bg-[#fdf6e3]",
  };
  return (
    <div
      className={`font-caveat -rotate-2 rounded-2xl px-5 py-4 text-xl leading-snug text-leaf-800 shadow-sm sm:text-2xl ${tones[tone]} ${className}`}
    >
      {children}
    </div>
  );
}

/** A rounded photo, used for accents and tile headers. */
export function Photo({
  image,
  sizes,
  className = "",
  rounded = "rounded-2xl",
}: {
  image: MarketingImage;
  sizes: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-leaf-100 ${rounded} ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

/**
 * The persona avatar, drawn as SVG so no real person stands in for a
 * made-up customer.
 */
export function PersonaAvatar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Illustrated avatar of a parent"
    >
      <circle cx="60" cy="60" r="60" fill="#ffedd9" />
      <path d="M22 120a38 38 0 0 1 76 0z" fill="#2f7d49" />
      <path d="M38 118c0-14 10-24 22-24s22 10 22 24z" fill="#f2faf4" />
      <circle cx="60" cy="56" r="26" fill="#f8d9bd" />
      <path
        d="M34 54c0-18 12-30 26-30s26 12 26 30c0-10-10-14-26-14S34 44 34 54z"
        fill="#5b3a21"
      />
      <path d="M34 52c-4 10-2 22 2 28-6-4-10-18-2-28z" fill="#5b3a21" />
      <path d="M86 52c4 10 2 22-2 28 6-4 10-18 2-28z" fill="#5b3a21" />
      <circle cx="50" cy="58" r="3" fill="#27633c" />
      <circle cx="70" cy="58" r="3" fill="#27633c" />
      <path
        d="M52 70c3 3 13 3 16 0"
        stroke="#27633c"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="42" cy="66" r="4" fill="#f9b8a6" opacity="0.7" />
      <circle cx="78" cy="66" r="4" fill="#f9b8a6" opacity="0.7" />
    </svg>
  );
}
