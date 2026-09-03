export type MenuItem = {
  name: string;
  allergens: string[];
  emoji: string;
};

type ProteinItem = MenuItem & { redMeat?: boolean; vegetarian?: boolean };
type SideItem = MenuItem & { type: "veggie" | "carb" };

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
  { name: "Grilled chicken", allergens: [], emoji: "🍗" },
  { name: "Turkey slices", allergens: [], emoji: "🦃" },
  { name: "Beef strips", allergens: [], redMeat: true, emoji: "🥩" },
  { name: "Scrambled eggs", allergens: ["Eggs"], vegetarian: true, emoji: "🍳" },
  { name: "Cheese cubes", allergens: ["Dairy"], vegetarian: true, emoji: "🧀" },
  { name: "Black beans", allergens: [], vegetarian: true, emoji: "🫘" },
  { name: "Tofu bites", allergens: ["Soy"], vegetarian: true, emoji: "⬜" },
  { name: "Shrimp bites", allergens: ["Shellfish"], emoji: "🍤" },
];

const SIDES: SideItem[] = [
  { name: "Steamed broccoli", allergens: [], type: "veggie", emoji: "🥦" },
  { name: "Carrot sticks", allergens: [], type: "veggie", emoji: "🥕" },
  { name: "Green beans", allergens: [], type: "veggie", emoji: "🫛" },
  { name: "Corn", allergens: [], type: "veggie", emoji: "🌽" },
  { name: "Hummus & cucumber", allergens: [], type: "veggie", emoji: "🥒" },
  { name: "Brown rice", allergens: [], type: "carb", emoji: "🍚" },
  { name: "Quinoa", allergens: [], type: "carb", emoji: "🌾" },
  { name: "Sweet potato mash", allergens: [], type: "carb", emoji: "🍠" },
  { name: "Whole wheat pasta", allergens: ["Gluten"], type: "carb", emoji: "🍝" },
  { name: "Whole grain toast", allergens: ["Gluten"], type: "carb", emoji: "🍞" },
];

const FRUITS: MenuItem[] = [
  { name: "Apple slices", allergens: [], emoji: "🍎" },
  { name: "Banana", allergens: [], emoji: "🍌" },
  { name: "Orange segments", allergens: [], emoji: "🍊" },
  { name: "Grapes", allergens: [], emoji: "🍇" },
  { name: "Strawberries", allergens: [], emoji: "🍓" },
  { name: "Mango chunks", allergens: [], emoji: "🥭" },
  { name: "Pineapple chunks", allergens: [], emoji: "🍍" },
  { name: "Watermelon cubes", allergens: [], emoji: "🍉" },
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

    const sideCandidates = sidePool.filter((item) => item.name !== lastSide);
    const side = pickRandom(sideCandidates.length > 0 ? sideCandidates : sidePool);
    lastSide = side.name;

    const fruitCandidates = fruitPool.filter((item) => item.name !== lastFruit);
    const fruit = pickRandom(
      fruitCandidates.length > 0 ? fruitCandidates : fruitPool,
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
