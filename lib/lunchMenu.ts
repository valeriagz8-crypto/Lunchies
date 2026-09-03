export type MenuItem = {
  name: string;
  allergens: string[];
  emoji: string;
};

type MealGroup = "classic" | "breakfast" | "mediterranean" | "asian" | "plant";

type ProteinItem = MenuItem & {
  redMeat?: boolean;
  vegetarian?: boolean;
  group: MealGroup;
};
type SideItem = MenuItem & { type: "veggie" | "carb"; groups: MealGroup[] };
type FruitItem = MenuItem & { groups: MealGroup[] };

export const ALLERGY_OPTIONS = [
  "Peanuts",
  "Dairy",
  "Gluten",
  "Eggs",
  "Shellfish",
  "Soy",
];

export const PREFERENCE_OPTIONS = [
  "No red meat",
  "Loves fruits",
  "Loves veggies",
  "Vegetarian",
];

export const CHILD_AGE_OPTIONS = Array.from(
  { length: 8 },
  (_, i) => `${i + 5} years old`,
);

const PROTEINS: ProteinItem[] = [
  { name: "Grilled chicken", allergens: [], emoji: "🍗", group: "classic" },
  { name: "Turkey slices", allergens: [], emoji: "🦃", group: "classic" },
  {
    name: "Beef strips",
    allergens: [],
    redMeat: true,
    emoji: "🥩",
    group: "classic",
  },
  {
    name: "Scrambled eggs",
    allergens: ["Eggs"],
    vegetarian: true,
    emoji: "🍳",
    group: "breakfast",
  },
  {
    name: "Cheese cubes",
    allergens: ["Dairy"],
    vegetarian: true,
    emoji: "🧀",
    group: "mediterranean",
  },
  {
    name: "Black beans",
    allergens: [],
    vegetarian: true,
    emoji: "🫘",
    group: "plant",
  },
  {
    name: "Tofu bites",
    allergens: ["Soy"],
    vegetarian: true,
    emoji: "🍢",
    group: "asian",
  },
  { name: "Shrimp bites", allergens: ["Shellfish"], emoji: "🍤", group: "asian" },
];

const SIDES: SideItem[] = [
  {
    name: "Steamed broccoli",
    allergens: [],
    type: "veggie",
    emoji: "🥦",
    groups: ["classic", "asian", "plant"],
  },
  {
    name: "Carrot sticks",
    allergens: [],
    type: "veggie",
    emoji: "🥕",
    groups: ["classic", "plant"],
  },
  {
    name: "Green beans",
    allergens: [],
    type: "veggie",
    emoji: "🫛",
    groups: ["classic", "mediterranean", "plant"],
  },
  {
    name: "Corn",
    allergens: [],
    type: "veggie",
    emoji: "🌽",
    groups: ["classic", "plant"],
  },
  {
    name: "Hummus & cucumber",
    allergens: [],
    type: "veggie",
    emoji: "🥒",
    groups: ["mediterranean", "plant"],
  },
  {
    name: "Brown rice",
    allergens: [],
    type: "carb",
    emoji: "🍚",
    groups: ["asian", "classic", "plant"],
  },
  {
    name: "Quinoa",
    allergens: [],
    type: "carb",
    emoji: "🌾",
    groups: ["mediterranean", "plant", "classic"],
  },
  {
    name: "Sweet potato mash",
    allergens: [],
    type: "carb",
    emoji: "🍠",
    groups: ["classic", "breakfast", "plant"],
  },
  {
    name: "Whole wheat pasta",
    allergens: ["Gluten"],
    type: "carb",
    emoji: "🍝",
    groups: ["mediterranean", "classic"],
  },
  {
    name: "Whole grain toast",
    allergens: ["Gluten"],
    type: "carb",
    emoji: "🍞",
    groups: ["breakfast", "classic"],
  },
];

const FRUITS: FruitItem[] = [
  {
    name: "Apple slices",
    allergens: [],
    emoji: "🍎",
    groups: ["classic", "breakfast", "plant"],
  },
  {
    name: "Banana",
    allergens: [],
    emoji: "🍌",
    groups: ["breakfast", "classic", "plant"],
  },
  {
    name: "Orange segments",
    allergens: [],
    emoji: "🍊",
    groups: ["breakfast", "mediterranean", "classic"],
  },
  {
    name: "Grapes",
    allergens: [],
    emoji: "🍇",
    groups: ["mediterranean", "classic"],
  },
  {
    name: "Strawberries",
    allergens: [],
    emoji: "🍓",
    groups: ["breakfast", "classic"],
  },
  {
    name: "Mango chunks",
    allergens: [],
    emoji: "🥭",
    groups: ["asian", "plant"],
  },
  {
    name: "Pineapple chunks",
    allergens: [],
    emoji: "🍍",
    groups: ["asian", "plant"],
  },
  {
    name: "Watermelon cubes",
    allergens: [],
    emoji: "🍉",
    groups: ["classic", "asian", "plant"],
  },
];

const ALL_ITEMS: MenuItem[] = [...PROTEINS, ...SIDES, ...FRUITS];

export function getEmoji(name: string): string {
  return ALL_ITEMS.find((item) => item.name === name)?.emoji ?? "🍽️";
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export type DayMeal = {
  day: string;
  protein: string;
  side: string;
  fruit: string;
};

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function excludesAllergies(item: MenuItem, allergies: string[]) {
  return !item.allergens.some((allergen) => allergies.includes(allergen));
}

export function generateWeekPlan(
  allergies: string[],
  preferences: string[],
): DayMeal[] {
  const isVegetarian = preferences.includes("Vegetarian");
  const noRedMeat = preferences.includes("No red meat");
  const lovesVeggies = preferences.includes("Loves veggies");

  let proteinPool = PROTEINS.filter((item) =>
    excludesAllergies(item, allergies),
  );
  if (isVegetarian) proteinPool = proteinPool.filter((item) => item.vegetarian);
  if (noRedMeat) proteinPool = proteinPool.filter((item) => !item.redMeat);
  if (proteinPool.length === 0) {
    proteinPool = [PROTEINS.find((item) => item.name === "Black beans")!];
  }

  let sidePool = SIDES.filter((item) => excludesAllergies(item, allergies));
  if (lovesVeggies) {
    const veggiesOnly = sidePool.filter((item) => item.type === "veggie");
    if (veggiesOnly.length > 0) sidePool = veggiesOnly;
  }
  if (sidePool.length === 0) {
    sidePool = SIDES.filter((item) => item.allergens.length === 0);
  }

  let fruitPool = FRUITS.filter((item) => excludesAllergies(item, allergies));
  if (fruitPool.length === 0) fruitPool = FRUITS;

  let lastProtein = "";
  let lastSide = "";
  let lastFruit = "";
  return DAYS.map((day) => {
    const proteinCandidates = proteinPool.filter(
      (item) => item.name !== lastProtein,
    );
    const protein = pickRandom(
      proteinCandidates.length > 0 ? proteinCandidates : proteinPool,
    );
    lastProtein = protein.name;

    const themedSides = sidePool.filter((item) =>
      item.groups.includes(protein.group),
    );
    const sideBasePool = themedSides.length > 0 ? themedSides : sidePool;
    const sideCandidates = sideBasePool.filter(
      (item) => item.name !== lastSide,
    );
    const side = pickRandom(
      sideCandidates.length > 0 ? sideCandidates : sideBasePool,
    );
    lastSide = side.name;

    const themedFruits = fruitPool.filter((item) =>
      item.groups.includes(protein.group),
    );
    const fruitBasePool = themedFruits.length > 0 ? themedFruits : fruitPool;
    const fruitCandidates = fruitBasePool.filter(
      (item) => item.name !== lastFruit,
    );
    const fruit = pickRandom(
      fruitCandidates.length > 0 ? fruitCandidates : fruitBasePool,
    );
    lastFruit = fruit.name;

    return {
      day,
      protein: protein.name,
      side: side.name,
      fruit: fruit.name,
    };
  });
}
