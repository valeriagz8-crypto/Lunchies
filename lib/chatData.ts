/**
 * Static data for the guided chat assistant at /chat.
 *
 * Everything here is fixed content: there is no AI model and no external API.
 * The service answers repeat only facts that already exist elsewhere on the
 * site (plans, prices, the feature list, allergen filtering in /core). Nothing
 * about the business is invented here, and anything we cannot answer is routed
 * to a person instead.
 */

import { ALLERGY_OPTIONS, PREFERENCE_OPTIONS } from "./lunchMenu";
import { FEATURES, PLANS } from "./productData";
import { formatWeekly } from "./pricing";

/* -------------------------------------------------------------------------- */
/* Intake options                                                             */
/* -------------------------------------------------------------------------- */

export const AGE_GROUPS = ["5-6", "7-9", "10-12"] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export const ALLERGY_STATUSES = [
  "No allergies",
  "Has allergies",
  "Preferences",
] as const;
export type AllergyStatus = (typeof ALLERGY_STATUSES)[number];

export const INTENTS = [
  "Lunchbox ideas",
  "Questions about the service",
  "Talk to a person",
] as const;
export type Intent = (typeof INTENTS)[number];

/** The same six allergens offered in /core, so the two tools agree. */
export const CHAT_ALLERGENS = ALLERGY_OPTIONS;
export type Allergen = (typeof ALLERGY_OPTIONS)[number];

/** The same four preferences offered in /core. */
export const CHAT_PREFERENCES = PREFERENCE_OPTIONS;
export type Preference = (typeof PREFERENCE_OPTIONS)[number];

/* -------------------------------------------------------------------------- */
/* Lunchbox ideas                                                             */
/* -------------------------------------------------------------------------- */

export type LunchboxIdea = {
  id: string;
  ageGroup: AgeGroup;
  main: string;
  side: string;
  fruit: string;
  extra: string;
  /** Allergens present in the idea, named exactly as in CHAT_ALLERGENS. */
  allergens: string[];
  vegetarian: boolean;
  redMeat: boolean;
  /** Used to favour an idea when the child loves fruit or vegetables. */
  fruitForward: boolean;
  veggieForward: boolean;
};

export const LUNCHBOX_IDEAS: LunchboxIdea[] = [
  // ---------------------------------------------------------------- 5 to 6 --
  {
    id: "idea-56-1",
    ageGroup: "5-6",
    main: "Turkey and cheese wrap on a whole-grain tortilla",
    side: "Carrot sticks and cucumber",
    fruit: "Strawberries",
    extra: "Plain yogurt",
    allergens: ["Dairy", "Gluten"],
    vegetarian: false,
    redMeat: false,
    fruitForward: true,
    veggieForward: true,
  },
  {
    id: "idea-56-2",
    ageGroup: "5-6",
    main: "Shredded chicken with rice",
    side: "Steamed green beans",
    fruit: "Banana",
    extra: "Plain rice cakes",
    allergens: [],
    vegetarian: false,
    redMeat: false,
    fruitForward: false,
    veggieForward: true,
  },
  {
    id: "idea-56-3",
    ageGroup: "5-6",
    main: "Black bean roll on a corn tortilla",
    side: "Cherry tomatoes",
    fruit: "Apple slices",
    extra: "Pumpkin seeds",
    allergens: [],
    vegetarian: true,
    redMeat: false,
    fruitForward: true,
    veggieForward: true,
  },
  {
    id: "idea-56-4",
    ageGroup: "5-6",
    main: "Hard-boiled egg halves",
    side: "Cucumber sticks",
    fruit: "Grapes",
    extra: "Corn tortilla chips",
    allergens: ["Eggs"],
    vegetarian: true,
    redMeat: false,
    fruitForward: true,
    veggieForward: true,
  },
  {
    id: "idea-56-5",
    ageGroup: "5-6",
    main: "Chicken and vegetable soup in a thermos",
    side: "Steamed carrots",
    fruit: "Melon cubes",
    extra: "Plain popcorn",
    allergens: [],
    vegetarian: false,
    redMeat: false,
    fruitForward: true,
    veggieForward: true,
  },

  // ---------------------------------------------------------------- 7 to 9 --
  {
    id: "idea-79-1",
    ageGroup: "7-9",
    main: "Grilled chicken strips",
    side: "Roasted sweet potato",
    fruit: "Orange segments",
    extra: "Pumpkin seeds",
    allergens: [],
    vegetarian: false,
    redMeat: false,
    fruitForward: true,
    veggieForward: true,
  },
  {
    id: "idea-79-2",
    ageGroup: "7-9",
    main: "Black bean quesadilla on a corn tortilla",
    side: "Jicama sticks with lime",
    fruit: "Pineapple chunks",
    extra: "Plain yogurt",
    allergens: ["Dairy"],
    vegetarian: true,
    redMeat: false,
    fruitForward: true,
    veggieForward: true,
  },
  {
    id: "idea-79-3",
    ageGroup: "7-9",
    main: "Turkey and avocado sandwich on whole-grain bread",
    side: "Carrot sticks",
    fruit: "Apple",
    extra: "Plain popcorn",
    allergens: ["Gluten"],
    vegetarian: false,
    redMeat: false,
    fruitForward: false,
    veggieForward: true,
  },
  {
    id: "idea-79-4",
    ageGroup: "7-9",
    main: "Rice and vegetable stir-fry with tofu",
    side: "Cucumber slices",
    fruit: "Mango",
    extra: "Rice crackers",
    allergens: ["Soy"],
    vegetarian: true,
    redMeat: false,
    fruitForward: true,
    veggieForward: true,
  },
  {
    id: "idea-79-5",
    ageGroup: "7-9",
    main: "Beef picadillo with rice",
    side: "Steamed carrots and peas",
    fruit: "Banana",
    extra: "Corn tortilla",
    allergens: [],
    vegetarian: false,
    redMeat: true,
    fruitForward: false,
    veggieForward: true,
  },

  // -------------------------------------------------------------- 10 to 12 --
  {
    id: "idea-1012-1",
    ageGroup: "10-12",
    main: "Chicken and quinoa salad",
    side: "Cherry tomatoes and cucumber",
    fruit: "Grapes",
    extra: "Whole-grain crackers",
    allergens: ["Gluten"],
    vegetarian: false,
    redMeat: false,
    fruitForward: true,
    veggieForward: true,
  },
  {
    id: "idea-1012-2",
    ageGroup: "10-12",
    main: "Egg and potato tacos on corn tortillas",
    side: "Nopales salad",
    fruit: "Orange",
    extra: "Sunflower seeds",
    allergens: ["Eggs"],
    vegetarian: true,
    redMeat: false,
    fruitForward: false,
    veggieForward: true,
  },
  {
    id: "idea-1012-3",
    ageGroup: "10-12",
    main: "Lentil and rice bowl",
    side: "Roasted zucchini",
    fruit: "Apple",
    extra: "Corn tortilla chips",
    allergens: [],
    vegetarian: true,
    redMeat: false,
    fruitForward: false,
    veggieForward: true,
  },
  {
    id: "idea-1012-4",
    ageGroup: "10-12",
    main: "Grilled chicken torta on a whole-grain bolillo",
    side: "Carrot and jicama sticks",
    fruit: "Melon",
    extra: "Cheese stick",
    allergens: ["Gluten", "Dairy"],
    vegetarian: false,
    redMeat: false,
    fruitForward: true,
    veggieForward: true,
  },
  {
    id: "idea-1012-5",
    ageGroup: "10-12",
    main: "Chicken and vegetable rice bowl",
    side: "Steamed broccoli",
    fruit: "Strawberries and banana",
    extra: "Plain popcorn",
    allergens: [],
    vegetarian: false,
    redMeat: false,
    fruitForward: true,
    veggieForward: true,
  },
];

/* -------------------------------------------------------------------------- */
/* Service answers                                                            */
/* -------------------------------------------------------------------------- */

export type ServiceAnswer = {
  id: string;
  /** Lower-case keywords in English and Spanish. */
  keywords: string[];
  answer: string;
  /**
   * false means the site has no answer yet, so the reply says so and offers a
   * person instead of guessing.
   */
  available: boolean;
};

const PLAN_LINE = PLANS.map(
  (plan) => `${plan.name} ${formatWeekly(plan.weeklyPrice)}`,
).join(", ");

const BASIC_FEATURES = FEATURES.filter((feature) =>
  feature.plans.includes("basic"),
)
  .map((feature) => feature.name.toLowerCase())
  .join(", ");

export const SERVICE_ANSWERS: ServiceAnswer[] = [
  {
    id: "plans-and-prices",
    keywords: [
      "price",
      "prices",
      "pricing",
      "cost",
      "how much",
      "plan",
      "plans",
      "subscription",
      "precio",
      "precios",
      "costo",
      "cuanto cuesta",
      "cuánto cuesta",
      "plan",
      "planes",
      "suscripcion",
      "suscripción",
    ],
    answer: `We have three plans: ${PLAN_LINE}. You can compare what each one includes on the Product and Pricing pages.`,
    available: true,
  },
  {
    id: "whats-included",
    keywords: [
      "include",
      "included",
      "features",
      "what do i get",
      "offer",
      "incluye",
      "incluido",
      "caracteristicas",
      "características",
      "que ofrecen",
      "qué ofrecen",
    ],
    answer: `Every plan includes ${BASIC_FEATURES}. Plus and Premium add more, such as nutrition information, recipe customization and multi-child profiles.`,
    available: true,
  },
  {
    id: "personalized",
    keywords: [
      "personalized",
      "personalised",
      "customize",
      "tailored",
      "preferences",
      "picky",
      "personalizado",
      "personalizada",
      "a la medida",
      "preferencias",
    ],
    answer:
      "Lunches are personalized: you set your child's preferences, allergies and goals once, and the weekly plan is built around them.",
    available: true,
  },
  {
    id: "allergies-handling",
    keywords: [
      "allergen",
      "allergens",
      "allergy filter",
      "gluten",
      "dairy",
      "peanut",
      "nut free",
      "alergeno",
      "alérgeno",
      "alergenos",
      "alérgenos",
      "sin gluten",
      "sin lacteos",
      "sin lácteos",
      "cacahuate",
    ],
    answer:
      "In Core you can mark allergies such as peanuts, dairy, gluten, eggs, shellfish and soy, and the planner filters meals that contain them. A Lunchies team member still confirms anything allergy related before it is used.",
    available: true,
  },
  {
    id: "school-delivery",
    keywords: [
      "school",
      "delivered",
      "delivery at school",
      "escuela",
      "colegio",
      "entrega en la escuela",
    ],
    answer:
      "Lunchies is built around lunches delivered at school, so the plan fits a normal school day.",
    available: true,
  },
  {
    id: "how-it-works",
    keywords: [
      "how does it work",
      "how it works",
      "get started",
      "start",
      "sign up",
      "como funciona",
      "cómo funciona",
      "empezar",
      "registrarme",
    ],
    answer:
      "Three steps: you tell us about your child, we create personalized options, and you get a weekly menu you can use. You can try the planner on the Core page.",
    available: true,
  },
  {
    id: "ordering-and-payment",
    keywords: [
      "order",
      "ordering",
      "buy",
      "checkout",
      "pay",
      "payment",
      "card",
      "invoice",
      "billing",
      "contract",
      "cancel",
      "refund",
      "schedule",
      "when do you deliver",
      "delivery time",
      "pedido",
      "ordenar",
      "comprar",
      "pagar",
      "pago",
      "tarjeta",
      "factura",
      "facturacion",
      "facturación",
      "contrato",
      "cancelar",
      "reembolso",
      "horario",
      "cuando entregan",
      "cuándo entregan",
    ],
    answer:
      "Ordering, delivery schedules, payment and contracts are not available yet, so I do not have that information. I can connect you with someone from the Lunchies team who can help.",
    available: false,
  },
];

/** Used when nothing matches, so the chat never guesses about the business. */
export const SERVICE_FALLBACK =
  "I can't answer that one. I can connect you with someone from the Lunchies team who can.";

/* -------------------------------------------------------------------------- */
/* Guardrail: medical and dietary-treatment topics                            */
/* -------------------------------------------------------------------------- */

/** Lower-case, accent-free keywords in English and Spanish. */
export const MEDICAL_KEYWORDS = [
  // English
  "diagnosis",
  "diagnose",
  "disease",
  "illness",
  "medication",
  "medicine",
  "prescription",
  "treatment",
  "therapy",
  "symptom",
  "weight loss",
  "lose weight",
  "obesity",
  "overweight",
  "diabetes",
  "diabetic",
  "celiac",
  "coeliac",
  "gastritis",
  "colitis",
  "anemia",
  "cholesterol",
  "supplement",
  "supplements",
  "vitamin dose",
  "vitamin dosage",
  "vitamins dosage",
  "dosage",
  "eating disorder",
  "malnutrition",
  "diet plan",
  "medical diet",
  // Spanish
  "diagnostico",
  "diagnosticar",
  "enfermedad",
  "medicamento",
  "medicina",
  "receta medica",
  "tratamiento",
  "terapia",
  "sintoma",
  "sintomas",
  "bajar de peso",
  "perder peso",
  "obesidad",
  "sobrepeso",
  "celiaco",
  "celiaca",
  "colitis",
  "anemia",
  "colesterol",
  "suplemento",
  "suplementos",
  "dosis de vitaminas",
  "dosis",
  "desnutricion",
  "trastorno alimenticio",
  "dieta medica",
  "plan de dieta",
];

export const MEDICAL_RESPONSE =
  "I can't help with medical or dietary-treatment questions, including diagnoses, medication, supplements or weight-loss diets. For anything like that, please talk to your child's pediatrician or a registered nutritionist. I can still help with general lunchbox ideas and questions about Lunchies.";

/* -------------------------------------------------------------------------- */
/* Human checkpoint: allergy and reaction topics                              */
/* -------------------------------------------------------------------------- */

export const HUMAN_CHECKPOINT_KEYWORDS = [
  // English
  "allergy",
  "allergies",
  "allergic",
  "reaction",
  "anaphylaxis",
  "anaphylactic",
  "epipen",
  "rash",
  "hives",
  "swelling",
  "hospital",
  "emergency",
  "er",
  // Spanish
  "alergia",
  "alergias",
  "alergico",
  "alergica",
  "reaccion",
  "anafilaxia",
  "anafilactico",
  "sarpullido",
  "ronchas",
  "urticaria",
  "hinchazon",
  "inflamacion",
  "hospital",
  "emergencia",
  "urgencias",
];

/* -------------------------------------------------------------------------- */
/* Shared notes                                                               */
/* -------------------------------------------------------------------------- */

export const CHAT_NOTES = {
  generalGuidance:
    "This is general guidance for a balanced school lunch, not a safety guarantee. Always check labels and what your school allows.",
  allergyConfirmation:
    "You told me your child has allergies, so I can't call any lunchbox safe. A Lunchies team member needs to confirm this idea against your child's specific allergies before you use it.",
  notMedicalAdvice:
    "I don't provide medical advice, including dietary treatments or diagnoses.",
} as const;
