/**
 * Typed copy for the homepage and the site footer.
 *
 * Credibility rules baked in: no review counts, star ratings, customer
 * numbers or testimonials, and no claimed results. Every link points at a
 * page or a section that actually exists.
 */

export type LinkTarget = {
  label: string;
  href: string;
};

/** Key into the icon map in components/home/icons.tsx. */
export type IconName =
  | "leaf"
  | "clock"
  | "heart"
  | "bus"
  | "users"
  | "sparkles"
  | "check";

export type HeroBenefit = {
  icon: IconName;
  label: string;
};

export type Hero = {
  badge: string;
  headlineLine1: string;
  headlineLine2Lead: string;
  headlineAccent: string;
  subheadline: string;
  primaryCta: LinkTarget;
  secondaryCta: LinkTarget;
  benefits: HeroBenefit[];
  /** The handwritten note sitting over the lunchbox. */
  note: {
    handwritten: string;
    checks: string[];
  };
  /** The phone card beside the lunchbox. */
  phone: {
    title: string;
    items: { emoji: string; label: string }[];
  };
};

export const HERO: Hero = {
  badge: "Healthy habits, happier days",
  headlineLine1: "Healthy lunches",
  headlineLine2Lead: "for",
  headlineAccent: "happier kids.",
  subheadline:
    "Personalized, nutritious and convenient lunches based on your child's preferences, allergies and busy schedule.",
  primaryCta: { label: "Create my plan", href: "/core" },
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  benefits: [
    { icon: "leaf", label: "Nutritious and balanced" },
    { icon: "clock", label: "Saves you time" },
    { icon: "heart", label: "Kids love it" },
    { icon: "bus", label: "Delivered at school" },
  ],
  note: {
    handwritten: "Good food, brighter futures",
    checks: ["Real ingredients", "Kid-approved", "Made for busy families"],
  },
  phone: {
    title: "Today's lunch",
    items: [
      { emoji: "🍞", label: "Sandwich" },
      { emoji: "🍎", label: "Fruits" },
      { emoji: "🥒", label: "Vegetables" },
      { emoji: "🥨", label: "Snack" },
    ],
  },
};

export type Step = {
  number: number;
  art: "phone" | "bowl" | "school";
  tint: string;
  title: string;
  description: string;
};

export const HOW_IT_WORKS = {
  id: "how-it-works",
  heading: "How it works",
  intro: "Healthy school lunches in 3 simple steps.",
  link: { label: "Learn more", href: "/product" } as LinkTarget,
  steps: [
    {
      number: 1,
      art: "phone",
      tint: "bg-rose-50",
      title: "Tell us about your child",
      description: "Add preferences, allergies and goals.",
    },
    {
      number: 2,
      art: "bowl",
      tint: "bg-leaf-50",
      title: "We create personalized options",
      description: "Balanced, delicious lunches tailored to your child.",
    },
    {
      number: 3,
      art: "school",
      tint: "bg-peach-50",
      title: "You get a plan",
      description: "A weekly menu and shopping list, ready to use.",
    },
  ] as Step[],
};

export type LunchStyle = {
  name: string;
  description: string;
  /** Tints and fillings for the CSS lunchbox illustration on each card. */
  tint: string;
  boxTint: string;
  items: string[];
};

export const LUNCH_STYLES = {
  label: "Delicious, nutritious, personalized",
  headingLead: "Lunches made for",
  headingAccent: "every child.",
  intro:
    "We combine nutrition, flavor and variety to create lunches that fit your child's needs and your family's lifestyle.",
  cta: { label: "Explore our plans", href: "/product" } as LinkTarget,
  styles: [
    {
      name: "Classic",
      description: "Balanced and delicious for everyday.",
      tint: "bg-rose-100",
      boxTint: "bg-rose-200",
      items: ["🥪", "🍅", "🥒", "⭐"],
    },
    {
      name: "High-protein",
      description: "More energy for busy days.",
      tint: "bg-leaf-100",
      boxTint: "bg-leaf-200",
      items: ["🍗", "🥚", "🫐", "🧀"],
    },
    {
      name: "Allergy-friendly",
      description: "Options for specific needs.",
      tint: "bg-amber-100",
      boxTint: "bg-amber-200",
      items: ["🍈", "🫐", "🥕", "🍚"],
    },
    {
      name: "Fun and creative",
      description: "Meals that make lunch exciting.",
      tint: "bg-sky-100",
      boxTint: "bg-sky-200",
      items: ["🐻", "🍓", "⭐", "🥒"],
    },
  ] as LunchStyle[],
};

export type Benefit = {
  icon: IconName;
  title: string;
  description: string;
};

export const WHY_LUNCHIES = {
  heading: "Why families choose Lunchies",
  benefits: [
    {
      icon: "leaf",
      title: "Real ingredients",
      description: "Nutritious meals for growing minds and bodies.",
    },
    {
      icon: "heart",
      title: "Kid-approved",
      description: "Recipes built around what your child actually likes.",
    },
    {
      icon: "clock",
      title: "Save time",
      description: "Plan once and we help you all week long.",
    },
    {
      icon: "users",
      title: "Made for busy families",
      description: "Allergies, preferences and schedules, handled.",
    },
  ] as Benefit[],
};

export const CLOSING_CTA = {
  headingLead: "Ready to make lunchtime",
  headingAccent: "easier",
  headingTail: "?",
  description: "Join Lunchies and start planning better lunches today.",
  cta: { label: "Get started", href: "/core" } as LinkTarget,
};

export type FooterColumn = {
  title: string;
  links: LinkTarget[];
};

export const FOOTER = {
  brand: "Lunchies 🍎",
  tagline: "Better lunches, brighter days.",
  badge: "Made with care for families",
  copyright: "© 2026 Lunchies · Made by Valeria Gómez Zamudio",
  columns: [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "/#how-it-works" },
        { label: "Plans", href: "/product" },
        { label: "Docs", href: "/docs" },
      ],
    },
    {
      title: "Explore",
      links: [
        { label: "Pricing", href: "/pricing" },
        { label: "Research", href: "/research" },
        { label: "Marketing", href: "/marketing" },
      ],
    },
  ] as FooterColumn[],
};
