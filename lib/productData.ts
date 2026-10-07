import { WEEKLY_PRICES } from "./pricingAssumptions";

export type PlanId = "basic" | "plus" | "premium";

export type Plan = {
  id: PlanId;
  name: string;
  weeklyPrice: number;
  tagline: string;
  bullets: string[];
};

export const PLANS: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    weeklyPrice: WEEKLY_PRICES.basic,
    tagline: "Essential meal planning for busy families.",
    bullets: [
      "Personalized meal ideas",
      "Allergy-friendly options",
      "Weekly menu planner",
      "Shopping list",
      "No artificial preservatives",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    weeklyPrice: WEEKLY_PRICES.plus,
    tagline: "More customization and flexibility.",
    bullets: [
      "Everything in Basic",
      "Nutrition information",
      "Recipe customization",
      "Save favorite meals",
      "Fresh, local ingredients",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    weeklyPrice: WEEKLY_PRICES.premium,
    tagline: "The most complete and personalized experience.",
    bullets: [
      "Everything in Plus",
      "Advanced filters",
      "Multi-child profiles",
      "Priority support",
      "Organic ingredients where available",
    ],
  },
];

export type Feature = {
  name: string;
  plans: PlanId[];
};

export const FEATURES: Feature[] = [
  {
    name: "Personalized meal recommendations",
    plans: ["basic", "plus", "premium"],
  },
  {
    name: "Allergy & dietary preferences",
    plans: ["basic", "plus", "premium"],
  },
  { name: "Weekly menu planner", plans: ["basic", "plus", "premium"] },
  { name: "Shopping list generation", plans: ["basic", "plus", "premium"] },
  {
    name: "No artificial preservatives or colors",
    plans: ["basic", "plus", "premium"],
  },
  {
    name: "Fresh, locally sourced ingredients",
    plans: ["plus", "premium"],
  },
  {
    name: "Organic ingredients where available",
    plans: ["premium"],
  },
  { name: "Nutrition information (macros)", plans: ["plus", "premium"] },
  { name: "Recipe customization", plans: ["plus", "premium"] },
  { name: "Save favorite meals", plans: ["plus", "premium"] },
  {
    name: "Advanced filters (allergens, cuisine, time)",
    plans: ["premium"],
  },
  { name: "Multi-child profiles", plans: ["premium"] },
  { name: "Priority support", plans: ["premium"] },
];

export type Segment = {
  name: string;
  description: string;
  needs: string[];
};

export const SEGMENTS: Segment[] = [
  {
    name: "Busy parents (professionals)",
    description:
      "Parents with demanding schedules who want convenient and healthy lunch options.",
    needs: [
      "Save time",
      "Easy planning",
      "Nutritious options",
      "Trust and convenience",
    ],
  },
  {
    name: "Stay-at-home parents",
    description:
      "Parents who are actively involved in their child's nutrition and want variety and personalization.",
    needs: [
      "Healthy and balanced meals",
      "Kid-approved recipes",
      "Allergy-friendly options",
      "Flexibility",
    ],
  },
];
