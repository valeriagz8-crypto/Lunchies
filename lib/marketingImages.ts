/**
 * The marketing photo library. Every file lives in public/images/marketing/
 * and is credited in CREDITS.md there.
 *
 * Images illustrate food and lunchboxes only. None of them is ever presented
 * as a Lunchies customer, review or result.
 */

export type MarketingImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const IMAGES = {
  lunchboxSandwichFruit: {
    src: "/images/marketing/lunchbox-sandwich-fruit.jpg",
    alt: "A yellow lunchbox packed with sandwiches, apple slices, grapes and berries",
    width: 1200,
    height: 800,
  },
  bentoTray: {
    src: "/images/marketing/bento-tray-colorful.jpg",
    alt: "A compartment lunch tray with chicken, vegetables, rice rolls and fruit",
    width: 1200,
    height: 900,
  },
  lunchboxRiceVeggies: {
    src: "/images/marketing/lunchbox-rice-veggies.jpg",
    alt: "A lunchbox with rice, shredded chicken, broccoli and courgette",
    width: 1200,
    height: 900,
  },
  lunchboxSaladBlue: {
    src: "/images/marketing/lunchbox-salad-blue.jpg",
    alt: "An open blue lunchbox with a fresh salad, beside a tote bag and a notebook",
    width: 1200,
    height: 800,
  },
  freshProduce: {
    src: "/images/marketing/fresh-produce-marble.jpg",
    alt: "Kale, avocado, strawberries, tomatoes and peppers on a marble surface",
    width: 1200,
    height: 1060,
  },
  fruitPlate: {
    src: "/images/marketing/fruit-plate.jpg",
    alt: "A plate of sliced peaches, cherries, banana, kiwi and walnuts",
    width: 1200,
    height: 1600,
  },
  produceFlatlay: {
    src: "/images/marketing/produce-flatlay.jpg",
    alt: "Fruit and vegetables arranged in a flat lay on a wooden floor",
    width: 1200,
    height: 1500,
  },
  vegetablesCloseup: {
    src: "/images/marketing/vegetables-closeup.jpg",
    alt: "Close-up of tomatoes, mushrooms, chillies, peppers and garlic",
    width: 1200,
    height: 800,
  },
} as const satisfies Record<string, MarketingImage>;

export type MarketingImageKey = keyof typeof IMAGES;

/** Photo used for each social post, keyed by post id. */
export const POST_IMAGES: Record<string, MarketingImageKey> = {
  "post-01": "lunchboxSandwichFruit",
  "post-02": "produceFlatlay",
  "post-03": "lunchboxSaladBlue",
  "post-04": "bentoTray",
  "post-05": "lunchboxRiceVeggies",
  "post-06": "vegetablesCloseup",
  "post-07": "freshProduce",
  "post-08": "lunchboxSandwichFruit",
  "post-09": "fruitPlate",
  "post-10": "bentoTray",
};

/** Thumbnail used for each video script, keyed by script id. */
export const SCRIPT_IMAGES: Record<string, MarketingImageKey> = {
  "script-01": "lunchboxSandwichFruit",
  "script-02": "produceFlatlay",
  "script-03": "lunchboxSaladBlue",
};

export function imageFor(
  map: Record<string, MarketingImageKey>,
  id: string,
  fallback: MarketingImageKey = "lunchboxSandwichFruit",
): MarketingImage {
  return IMAGES[map[id] ?? fallback];
}
