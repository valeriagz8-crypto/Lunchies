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

export type HeroBenefit = {
  icon: string;
  label: string;
};

/** One compartment of the CSS and emoji lunchbox illustration. */
export type LunchboxItem = {
  emoji: string;
  label: string;
};

export type Hero = {
  badge: string;
  headlineLead: string;
  headlineAccent: string;
  subheadline: string;
  primaryCta: LinkTarget;
  secondaryCta: LinkTarget;
  benefits: HeroBenefit[];
  lunchbox: {
    caption: string;
    items: LunchboxItem[];
  };
};

export const HERO: Hero = {
  badge: "Healthy habits, happier days",
  headlineLead: "Healthy lunches for",
  headlineAccent: "happier kids.",
  subheadline:
    "Personalized, nutritious and convenient lunches based on your child's preferences, allergies and busy schedule.",
  primaryCta: { label: "Create my plan", href: "/core" },
  secondaryCta: { label: "See how it works", href: "#how-it-works" },
  benefits: [
    { icon: "🥗", label: "Nutritious and balanced" },
    { icon: "⏱️", label: "Saves you time" },
    { icon: "😋", label: "Kids love it" },
    { icon: "🎒", label: "Delivered at school" },
  ],
  lunchbox: {
    caption:
      "A Lunchies lunchbox: a sandwich, fruit, vegetables, cheese, grapes and a drink.",
    items: [
      { emoji: "🥪", label: "Sandwich" },
      { emoji: "🍎", label: "Apple" },
      { emoji: "🥕", label: "Carrots" },
      { emoji: "🧀", label: "Cheese" },
      { emoji: "🍇", label: "Grapes" },
      { emoji: "🧃", label: "Drink" },
    ],
  },
};

export type Step = {
  number: number;
  icon: string;
  title: string;
  description: string;
};

export const HOW_IT_WORKS = {
  id: "how-it-works",
  heading: "How it works",
  intro: "Three steps, and the week is planned.",
  steps: [
    {
      number: 1,
      icon: "📝",
      title: "Tell us about your child",
      description: "Preferences, allergies and goals, filled in once.",
    },
    {
      number: 2,
      icon: "🍱",
      title: "We create personalized options",
      description: "Balanced lunches tailored to your child.",
    },
    {
      number: 3,
      icon: "📅",
      title: "You get a plan",
      description: "A weekly menu ready to use.",
    },
  ] as Step[],
};

export type LunchStyle = {
  icon: string;
  name: string;
  description: string;
};

export const LUNCH_STYLES = {
  heading: "Lunches made for every child",
  intro:
    "Every child eats differently, so every plan is built around the one you are packing for.",
  cta: { label: "Explore our plans", href: "/product" } as LinkTarget,
  styles: [
    {
      icon: "🥪",
      name: "Classic",
      description:
        "The familiar favourites: a sandwich, fruit and something to drink.",
    },
    {
      icon: "💪",
      name: "High-protein",
      description:
        "Eggs, cheese, chicken or beans for the days that run long.",
    },
    {
      icon: "🛡️",
      name: "Allergy-friendly",
      description:
        "Built around what your child cannot eat, checked every single day.",
    },
    {
      icon: "🌈",
      name: "Fun and creative",
      description:
        "Colours, shapes and small surprises for the pickier eaters.",
    },
  ] as LunchStyle[],
};

export type Benefit = {
  icon: string;
  title: string;
  description: string;
};

export const WHY_LUNCHIES = {
  heading: "Why families choose Lunchies",
  intro: "What the app actually does for your week.",
  benefits: [
    {
      icon: "👧",
      title: "Built around your child",
      description:
        "Preferences, allergies and goals live in one profile, so every plan starts from your child instead of a generic menu.",
    },
    {
      icon: "🗓️",
      title: "A full week in one go",
      description:
        "You get five days of lunches at once, so there is no decision left to make on a weekday morning.",
    },
    {
      icon: "🛡️",
      title: "Allergies set once",
      description:
        "Tell us what your child cannot eat and every lunch we suggest respects it, without you checking twice.",
    },
    {
      icon: "🧾",
      title: "Clear, simple plans",
      description:
        "Each lunch names what goes in it, so you know exactly what to buy and what your child is eating.",
    },
  ] as Benefit[],
};

export const CLOSING_CTA = {
  heading: "Ready to make lunchtime easier?",
  description: "Build your first weekly plan and see what it looks like.",
  cta: { label: "Get started", href: "/core" } as LinkTarget,
};

export type FooterColumn = {
  title: string;
  links: LinkTarget[];
};

export const FOOTER = {
  brand: "Lunchies 🍎",
  tagline: "Better lunches, brighter days.",
  badge: "Made with care for families ♥",
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
