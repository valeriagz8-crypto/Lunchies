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
    weeklyPrice: 400,
    tagline: "Essential meal planning for busy families.",
    bullets: [
      "Personalized meal ideas",
      "Allergy-friendly options",
      "Weekly menu planner",
      "Shopping list",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    weeklyPrice: 600,
    tagline: "More customization and flexibility.",
    bullets: [
      "Everything in Basic",
      "Nutrition information",
      "Recipe customization",
      "Save favorite meals",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    weeklyPrice: 800,
    tagline: "The most complete and personalized experience.",
    bullets: [
      "Everything in Plus",
      "Advanced filters",
      "Multi-child profiles",
      "Priority support",
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
  { name: "Nutrition information (macros)", plans: ["plus", "premium"] },
  { name: "Recipe customization", plans: ["plus", "premium"] },
  { name: "Save favorite meals", plans: ["plus", "premium"] },
  { name: "Advanced filters", plans: ["premium"] },
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
    name: "Busy professionals",
    description:
      "Parents with demanding schedules who want convenient and healthy lunch options for their kids.",
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
      "Parents who are actively involved in their child's nutrition and want variety and personalized options.",
    needs: [
      "Healthy and balanced meals",
      "Kid-approved recipes",
      "Allergy-friendly options",
      "Flexibility",
    ],
  },
];
