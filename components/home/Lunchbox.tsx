/**
 * The lunchbox illustration, drawn with CSS and emoji. Used large in the hero
 * and small on the lunch style cards, so there are no image files to ship.
 */
export default function Lunchbox({
  items,
  boxTint = "bg-leaf-300",
  innerTint = "bg-leaf-100",
  size = "small",
}: {
  items: string[];
  boxTint?: string;
  innerTint?: string;
  size?: "small" | "large";
}) {
  const isLarge = size === "large";

  return (
    <div
      className={`rounded-[1.75rem] ${boxTint} ${
        isLarge ? "p-3 shadow-xl" : "p-2 shadow-md"
      }`}
    >
      <div
        className={`grid grid-cols-2 gap-2 rounded-[1.25rem] ${innerTint} ${
          isLarge ? "p-2.5" : "p-1.5"
        }`}
      >
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            aria-hidden="true"
            className={`flex aspect-square items-center justify-center rounded-2xl bg-white/80 ${
              isLarge ? "text-5xl sm:text-6xl" : "text-xl"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
