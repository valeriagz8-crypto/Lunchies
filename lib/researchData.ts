export type GlobalExample = {
  name: string;
  description: string;
  country: string;
};

export const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸",
  UK: "🇬🇧",
  CA: "🇨🇦",
  AUS: "🇦🇺",
};

export const GLOBAL_EXAMPLES: GlobalExample[] = [
  {
    name: "Yumble",
    description: "Personalized kids meals delivered at home",
    country: "US",
  },
  {
    name: "Little Spoon",
    description: "Nutritious meals and snacks for every stage",
    country: "US",
  },
  {
    name: "Chefs for Kids",
    description: "Chef-prepared meals for schools and families",
    country: "UK",
  },
  {
    name: "Foodini",
    description: "Customizable lunches with a focus on allergies",
    country: "CA",
  },
  {
    name: "Kiddos",
    description: "Healthy, ready-to-eat meals for busy parents",
    country: "AUS",
  },
];

export const MEXICO_STAT = {
  value: "36.6%",
  label:
    "de niños en edad escolar (5-11 años) en México tienen sobrepeso u obesidad",
  source: "ENSANUT 2020-2024, Instituto Nacional de Salud Pública",
};

export type CompetitorType = "Direct" | "Indirect" | "Substitute";

export const TYPE_COLORS: Record<CompetitorType, string> = {
  Direct: "#ec6410",
  Indirect: "#419c5f",
  Substitute: "#65b87e",
};

export const COMPETITOR_EMOJIS: Record<string, string> = {
  Lunchies: "🍱",
  NutriKids: "🥗",
  KidzLunch: "🍽️",
  Colebox: "🌿",
  "Lunch & Go": "🚀",
  Superama: "🏪",
  Homemade: "🏠",
  "School cafeteria": "🏫",
};

export type Competitor = {
  name: string;
  type: CompetitorType;
  country: string;
  price: string;
  strength: string;
  weakness: string;
  // Risk map position, 0-100 on each axis.
  // saturation: how established/common this option already is in the market.
  // threat: how much overlap it has with Lunchies' value prop (personalized, allergy-friendly).
  saturation: number;
  threat: number;
};

export const COMPETITORS: Competitor[] = [
  {
    name: "Lunchies",
    type: "Direct",
    country: "MX",
    price: "$600-800",
    strength: "Personalized + allergy friendly",
    weakness: "New brand",
    saturation: 15,
    threat: 20,
  },
  {
    name: "NutriKids",
    type: "Direct",
    country: "MX",
    price: "$550-750",
    strength: "Balanced meals",
    weakness: "Limited customization",
    saturation: 35,
    threat: 75,
  },
  {
    name: "KidzLunch",
    type: "Direct",
    country: "MX",
    price: "$500-700",
    strength: "Affordable",
    weakness: "Basic menu",
    saturation: 45,
    threat: 55,
  },
  {
    name: "Colebox",
    type: "Direct",
    country: "MX",
    price: "$450-650",
    strength: "Organic ingredients",
    weakness: "Higher price",
    saturation: 25,
    threat: 50,
  },
  {
    name: "Lunch & Go",
    type: "Direct",
    country: "MX",
    price: "$400-600",
    strength: "Widely available",
    weakness: "Not personalized",
    saturation: 70,
    threat: 60,
  },
  {
    name: "Superama",
    type: "Indirect",
    country: "MX",
    price: "$300-500",
    strength: "Convenient",
    weakness: "Not kid-specific",
    saturation: 85,
    threat: 35,
  },
  {
    name: "Homemade",
    type: "Substitute",
    country: "MX",
    price: "$200-400",
    strength: "Full control",
    weakness: "Time consuming",
    saturation: 95,
    threat: 55,
  },
  {
    name: "School cafeteria",
    type: "Substitute",
    country: "MX",
    price: "$150-350",
    strength: "Accessible",
    weakness: "Limited nutrition",
    saturation: 80,
    threat: 30,
  },
];

export const LEARNING_TAGS = [
  "Problem validation",
  "Pricing",
  "Competitors",
  "User needs",
  "Allergies",
  "Distribution",
  "Retention",
  "Market size",
];
