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
import { PLANS } from "./productData";
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
  /** Lower-case keywords in English and Spanish, matched as whole words. */
  keywords: string[];
  answer: string;
  /** false means the site has no answer yet, so the reply says so. */
  available: boolean;
  /**
   * true keeps the human-review banner even when the question was answered,
   * for topics where the site can only answer part of it.
   */
  needsHuman?: boolean;
};

const PLAN_LINE = PLANS.map(
  (plan) => `${plan.name} ${formatWeekly(plan.weeklyPrice)}`,
).join(", ");

/**
 * Order matters: entries are scored by how many keywords they match, and the
 * first entry wins a tie. Ordering and payment sits first so an explicit
 * schedule or payment question beats the more general delivery entry.
 */
export const SERVICE_ANSWERS: ServiceAnswer[] = [
  {
    id: "ordering-and-payment",
    keywords: [
      // English
      "order",
      "orders",
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
      "schedules",
      "what time",
      "delivery time",
      "delivery times",
      "delivery days",
      "when do you deliver",
      // Spanish
      "pedido",
      "pedidos",
      "ordenar",
      "comprar",
      "pagar",
      "pago",
      "tarjeta",
      "factura",
      "facturacion",
      "contrato",
      "cancelar",
      "reembolso",
      "horario",
      "horarios",
      "a que hora",
      "cuando entregan",
    ],
    answer:
      "Ordering, payment, contracts, refunds and exact delivery schedules are not defined yet, so I do not have that information. I can connect you with someone from the Lunchies team who can help.",
    available: false,
  },
  {
    id: "delivery",
    keywords: [
      "deliver",
      "delivers",
      "delivery",
      "delivered",
      "school",
      "schools",
      "entrega",
      "entregan",
      "entregar",
      "escuela",
      "colegio",
    ],
    answer:
      "Lunchies lunches are delivered at your child's school. Delivery days, times and zones are not defined yet. I can connect you with someone from the team.",
    available: true,
    // Only half of this is settled, so a person still picks it up.
    needsHuman: true,
  },
  {
    id: "plans-and-prices",
    keywords: [
      "price",
      "prices",
      "pricing",
      "cost",
      "costs",
      "how much",
      "plan",
      "plans",
      "subscription",
      "precio",
      "precios",
      "costo",
      "cuesta",
      "cuanto cuesta",
      "planes",
      "suscripcion",
    ],
    answer: `We have three plans: ${PLAN_LINE}. You can compare what each one includes on the Product and Pricing pages.`,
    available: true,
  },
  {
    id: "allergies-and-preferences",
    keywords: [
      "allergy",
      "allergies",
      "allergic",
      "allergen",
      "allergens",
      "gluten",
      "dairy",
      "lactose",
      "peanut",
      "peanuts",
      "egg",
      "eggs",
      "shellfish",
      "soy",
      "preference",
      "preferences",
      "vegetarian",
      "alergia",
      "alergias",
      "alergico",
      "alergeno",
      "alergenos",
      "lacteos",
      "cacahuate",
      "huevo",
      "preferencia",
      "preferencias",
      "vegetariano",
    ],
    answer:
      "In the Core planner you mark the allergens your child cannot eat, from peanuts, dairy, gluten, eggs, shellfish and soy, and meals containing them are filtered out. Food preferences work the same way. I can never call a lunch safe for an allergy, so a Lunchies team member confirms anything allergy related before you rely on it.",
    available: true,
    needsHuman: true,
  },
  {
    id: "personalization",
    keywords: [
      "personalized",
      "personalised",
      "personalize",
      "customize",
      "customise",
      "customized",
      "tailored",
      "picky",
      "personalizado",
      "personalizada",
      "personalizar",
      "a la medida",
      "adaptado",
    ],
    answer:
      "Every plan is built around your child: you give their age, their allergies and their food preferences, and the lunches are chosen to match.",
    available: true,
  },
  {
    id: "what-is-lunchies",
    keywords: [
      "what is lunchies",
      "what does lunchies do",
      "what do you do",
      "who are you",
      "how does it work",
      "how it works",
      "how does this work",
      "get started",
      "sign up",
      "que es lunchies",
      "que hacen",
      "como funciona",
      "empezar",
      "registrarme",
    ],
    answer:
      "Lunchies plans personalized, healthy lunches for school-age children. You tell us your child's age, allergies and food preferences, and the Core planner builds a 5-day lunch plan from that.",
    available: true,
  },
];

/** Used when nothing matches, so the chat never guesses about the business. */
/** Reason recorded when an answered question still needs a person. */
export const SERVICE_REVIEW_REASON =
  "The question touches something that is not defined yet, so a team member should follow up.";

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

/* -------------------------------------------------------------------------- */
/* Page images                                                                */
/* -------------------------------------------------------------------------- */

/** Photos used on /chat. Credited in public/images/chat/CREDITS.md. */
export const CHAT_IMAGES = {
  hero: {
    src: "/images/chat/lunchbox-hero.jpg",
    alt: "A packed lunchbox with sandwiches, apple slices, grapes and berries",
    width: 1200,
    height: 800,
  },
  care: {
    src: "/images/chat/veggie-bowl.jpg",
    alt: "A bowl of quinoa with roasted vegetables, surrounded by fresh produce",
    width: 1200,
    height: 800,
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Languages                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The chat is bilingual. Stored values stay canonical English (age_group,
 * allergy_status, allergies, preferences, intent) so filtering, the rules and
 * the database do not change with the interface language; only what the parent
 * reads is translated.
 */
export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const ALLERGY_STATUS_LABELS: Record<
  Lang,
  Record<AllergyStatus, string>
> = {
  en: {
    "No allergies": "No allergies",
    "Has allergies": "Has allergies",
    Preferences: "Preferences",
  },
  es: {
    "No allergies": "Sin alergias",
    "Has allergies": "Tiene alergias",
    Preferences: "Preferencias",
  },
};

export const INTENT_LABELS: Record<Lang, Record<Intent, string>> = {
  en: {
    "Lunchbox ideas": "Lunchbox ideas",
    "Questions about the service": "Questions about the service",
    "Talk to a person": "Talk to a person",
  },
  es: {
    "Lunchbox ideas": "Ideas para la lonchera",
    "Questions about the service": "Dudas sobre el servicio",
    "Talk to a person": "Hablar con una persona",
  },
};

export const ALLERGEN_LABELS: Record<Lang, Record<string, string>> = {
  en: {
    Peanuts: "Peanuts",
    Dairy: "Dairy",
    Gluten: "Gluten",
    Eggs: "Eggs",
    Shellfish: "Shellfish",
    Soy: "Soy",
  },
  es: {
    Peanuts: "Cacahuate",
    Dairy: "Lácteos",
    Gluten: "Gluten",
    Eggs: "Huevo",
    Shellfish: "Mariscos",
    Soy: "Soya",
  },
};

export const PREFERENCE_LABELS: Record<Lang, Record<string, string>> = {
  en: {
    "No red meat": "No red meat",
    "Loves fruits": "Loves fruits",
    "Loves veggies": "Loves veggies",
    Vegetarian: "Vegetarian",
  },
  es: {
    "No red meat": "Sin carne roja",
    "Loves fruits": "Le encanta la fruta",
    "Loves veggies": "Le encantan las verduras",
    Vegetarian: "Vegetariano",
  },
};

/** Spanish names for each idea, keyed by the idea id. */
export const IDEA_ES: Record<
  string,
  { main: string; side: string; fruit: string; extra: string }
> = {
  "idea-56-1": {
    main: "Wrap de pavo y queso en tortilla integral",
    side: "Bastones de zanahoria y pepino",
    fruit: "Fresas",
    extra: "Yogurt natural",
  },
  "idea-56-2": {
    main: "Pollo deshebrado con arroz",
    side: "Ejotes al vapor",
    fruit: "Plátano",
    extra: "Galletas de arroz",
  },
  "idea-56-3": {
    main: "Taco de frijoles negros en tortilla de maíz",
    side: "Jitomates cherry",
    fruit: "Rebanadas de manzana",
    extra: "Pepitas",
  },
  "idea-56-4": {
    main: "Mitades de huevo cocido",
    side: "Bastones de pepino",
    fruit: "Uvas",
    extra: "Totopos",
  },
  "idea-56-5": {
    main: "Sopa de pollo y verduras en termo",
    side: "Zanahorias al vapor",
    fruit: "Cubos de melón",
    extra: "Palomitas naturales",
  },
  "idea-79-1": {
    main: "Tiras de pollo a la plancha",
    side: "Camote al horno",
    fruit: "Gajos de naranja",
    extra: "Pepitas",
  },
  "idea-79-2": {
    main: "Quesadilla de frijoles en tortilla de maíz",
    side: "Bastones de jícama con limón",
    fruit: "Trozos de piña",
    extra: "Yogurt natural",
  },
  "idea-79-3": {
    main: "Sándwich de pavo y aguacate en pan integral",
    side: "Bastones de zanahoria",
    fruit: "Manzana",
    extra: "Palomitas naturales",
  },
  "idea-79-4": {
    main: "Arroz salteado con verduras y tofu",
    side: "Rodajas de pepino",
    fruit: "Mango",
    extra: "Galletas de arroz",
  },
  "idea-79-5": {
    main: "Picadillo de res con arroz",
    side: "Zanahoria y chícharos al vapor",
    fruit: "Plátano",
    extra: "Tortilla de maíz",
  },
  "idea-1012-1": {
    main: "Ensalada de pollo con quinoa",
    side: "Jitomates cherry y pepino",
    fruit: "Uvas",
    extra: "Galletas integrales",
  },
  "idea-1012-2": {
    main: "Tacos de huevo con papa en tortilla de maíz",
    side: "Ensalada de nopales",
    fruit: "Naranja",
    extra: "Semillas de girasol",
  },
  "idea-1012-3": {
    main: "Bowl de lentejas con arroz",
    side: "Calabacita al horno",
    fruit: "Manzana",
    extra: "Totopos",
  },
  "idea-1012-4": {
    main: "Torta de pollo a la plancha en bolillo integral",
    side: "Bastones de zanahoria y jícama",
    fruit: "Melón",
    extra: "Barrita de queso",
  },
  "idea-1012-5": {
    main: "Bowl de arroz con pollo y verduras",
    side: "Brócoli al vapor",
    fruit: "Fresas y plátano",
    extra: "Palomitas naturales",
  },
};

/** Returns the idea with its food names in the requested language. */
export function localizedIdea(
  idea: LunchboxIdea,
  lang: Lang,
): LunchboxIdea {
  if (lang === "en") return idea;
  const translated = IDEA_ES[idea.id];
  return translated ? { ...idea, ...translated } : idea;
}

/** Spanish answer for each service topic, keyed by the entry id. */
export const SERVICE_ANSWERS_ES: Record<string, string> = {
  "ordering-and-payment":
    "Los pedidos, los pagos, los contratos, los reembolsos y los horarios exactos de entrega todavía no están definidos, así que no tengo esa información. Puedo ponerte en contacto con alguien del equipo de Lunchies.",
  delivery:
    "Las loncheras de Lunchies se entregan en la escuela de tu hijo. Los días, los horarios y las zonas de entrega todavía no están definidos. Puedo ponerte en contacto con alguien del equipo.",
  "plans-and-prices": `Tenemos tres planes: ${PLANS.map(
    (plan) => `${plan.name} $${plan.weeklyPrice}/semana`,
  ).join(", ")}. Puedes comparar qué incluye cada uno en las páginas de Producto y Precios.`,
  "allergies-and-preferences":
    "En el planeador de Core marcas los alérgenos que tu hijo no puede comer, entre cacahuate, lácteos, gluten, huevo, mariscos y soya, y las comidas que los contienen se filtran. Las preferencias funcionan igual. Nunca puedo decirte que una lonchera sea segura para una alergia, así que alguien del equipo de Lunchies confirma todo lo relacionado con alergias antes de que te confíes.",
  personalization:
    "Cada plan se arma alrededor de tu hijo: nos dices su edad, sus alergias y sus preferencias de comida, y elegimos las loncheras según eso.",
  "what-is-lunchies":
    "Lunchies planea loncheras saludables y personalizadas para niños en edad escolar. Nos dices la edad de tu hijo, sus alergias y sus preferencias, y el planeador de Core arma un plan de 5 días con eso.",
};

export const SERVICE_FALLBACK_BY_LANG: Record<Lang, string> = {
  en: SERVICE_FALLBACK,
  es: "Esa no te la puedo responder. Puedo ponerte en contacto con alguien del equipo de Lunchies que sí sepa.",
};

export const MEDICAL_RESPONSE_BY_LANG: Record<Lang, string> = {
  en: MEDICAL_RESPONSE,
  es: "No puedo ayudarte con temas médicos ni con tratamientos alimenticios, incluyendo diagnósticos, medicamentos, suplementos o dietas para bajar de peso. Para algo así, consulta al pediatra de tu hijo o a un nutriólogo certificado. Con gusto te sigo ayudando con ideas generales para la lonchera y con dudas sobre Lunchies.",
};

export type ChatNotes = {
  generalGuidance: string;
  allergyConfirmation: string;
  notMedicalAdvice: string;
};

export const CHAT_NOTES_BY_LANG: Record<Lang, ChatNotes> = {
  en: CHAT_NOTES,
  es: {
    generalGuidance:
      "Esto es una guía general para una lonchera balanceada, no una garantía de seguridad. Revisa siempre las etiquetas y lo que permite la escuela.",
    allergyConfirmation:
      "Me dijiste que tu hijo tiene alergias, así que no puedo decirte que alguna lonchera sea segura. Alguien del equipo de Lunchies necesita confirmar esta idea con las alergias específicas de tu hijo antes de que la uses.",
    notMedicalAdvice:
      "No doy consejos médicos, ni tratamientos alimenticios ni diagnósticos.",
  },
};

/* -------------------------------------------------------------------------- */
/* Ingredients, for "my child doesn't like X"                                 */
/* -------------------------------------------------------------------------- */

export type IngredientEntry = {
  id: string;
  /** Shown back to the parent. */
  label: Record<Lang, string>;
  /** Words to look for, in both languages. Accents and plurals are handled. */
  words: string[];
};

/**
 * Vocabulary drawn from the food names used by LUNCHBOX_IDEAS and IDEA_ES.
 * Both languages are always searched, because a parent may type Spanish while
 * the interface is in English.
 */
export const INGREDIENTS: IngredientEntry[] = [
  { id: "turkey", label: { en: "turkey", es: "pavo" }, words: ["turkey", "pavo"] },
  { id: "cheese", label: { en: "cheese", es: "queso" }, words: ["cheese", "queso"] },
  { id: "chicken", label: { en: "chicken", es: "pollo" }, words: ["chicken", "pollo"] },
  { id: "beef", label: { en: "beef", es: "carne de res" }, words: ["beef", "res", "picadillo"] },
  { id: "tofu", label: { en: "tofu", es: "tofu" }, words: ["tofu"] },
  { id: "egg", label: { en: "egg", es: "huevo" }, words: ["egg", "huevo"] },
  { id: "yogurt", label: { en: "yogurt", es: "yogurt" }, words: ["yogurt", "yoghurt"] },
  { id: "rice", label: { en: "rice", es: "arroz" }, words: ["rice", "arroz"] },
  { id: "quinoa", label: { en: "quinoa", es: "quinoa" }, words: ["quinoa"] },
  { id: "lentils", label: { en: "lentils", es: "lentejas" }, words: ["lentil", "lentils", "lenteja", "lentejas"] },
  { id: "beans", label: { en: "beans", es: "frijoles" }, words: ["bean", "beans", "frijol", "frijoles"] },
  { id: "tortilla", label: { en: "tortilla", es: "tortilla" }, words: ["tortilla", "tortillas"] },
  { id: "bread", label: { en: "bread", es: "pan" }, words: ["bread", "pan", "bolillo"] },
  { id: "sandwich", label: { en: "sandwich", es: "sándwich" }, words: ["sandwich", "sandwiches"] },
  { id: "wrap", label: { en: "wrap", es: "wrap" }, words: ["wrap", "wraps"] },
  { id: "quesadilla", label: { en: "quesadilla", es: "quesadilla" }, words: ["quesadilla", "quesadillas"] },
  { id: "torta", label: { en: "torta", es: "torta" }, words: ["torta", "tortas"] },
  { id: "taco", label: { en: "taco", es: "taco" }, words: ["taco", "tacos"] },
  { id: "soup", label: { en: "soup", es: "sopa" }, words: ["soup", "sopa"] },
  { id: "sweet-potato", label: { en: "sweet potato", es: "camote" }, words: ["sweet potato", "sweet potatoes", "camote", "camotes"] },
  { id: "potato", label: { en: "potato", es: "papa" }, words: ["potato", "potatoes", "papa", "papas"] },
  { id: "carrot", label: { en: "carrot", es: "zanahoria" }, words: ["carrot", "carrots", "zanahoria", "zanahorias"] },
  { id: "cucumber", label: { en: "cucumber", es: "pepino" }, words: ["cucumber", "cucumbers", "pepino", "pepinos"] },
  { id: "green-beans", label: { en: "green beans", es: "ejotes" }, words: ["green bean", "green beans", "ejote", "ejotes"] },
  { id: "broccoli", label: { en: "broccoli", es: "brócoli" }, words: ["broccoli", "brocoli"] },
  { id: "zucchini", label: { en: "zucchini", es: "calabacita" }, words: ["zucchini", "calabacita", "calabacitas"] },
  { id: "tomato", label: { en: "tomatoes", es: "jitomate" }, words: ["tomato", "tomatoes", "jitomate", "jitomates", "tomate", "tomates"] },
  { id: "peas", label: { en: "peas", es: "chícharos" }, words: ["pea", "peas", "chicharo", "chicharos"] },
  { id: "nopales", label: { en: "nopales", es: "nopales" }, words: ["nopal", "nopales"] },
  { id: "jicama", label: { en: "jicama", es: "jícama" }, words: ["jicama", "jicamas"] },
  { id: "avocado", label: { en: "avocado", es: "aguacate" }, words: ["avocado", "avocados", "aguacate", "aguacates"] },
  { id: "apple", label: { en: "apple", es: "manzana" }, words: ["apple", "apples", "manzana", "manzanas"] },
  { id: "banana", label: { en: "banana", es: "plátano" }, words: ["banana", "bananas", "platano", "platanos"] },
  { id: "grapes", label: { en: "grapes", es: "uvas" }, words: ["grape", "grapes", "uva", "uvas"] },
  { id: "strawberries", label: { en: "strawberries", es: "fresas" }, words: ["strawberry", "strawberries", "fresa", "fresas"] },
  { id: "orange", label: { en: "orange", es: "naranja" }, words: ["orange", "oranges", "naranja", "naranjas"] },
  { id: "melon", label: { en: "melon", es: "melón" }, words: ["melon", "melones"] },
  { id: "mango", label: { en: "mango", es: "mango" }, words: ["mango", "mangos"] },
  { id: "pineapple", label: { en: "pineapple", es: "piña" }, words: ["pineapple", "pina", "pinas"] },
  { id: "popcorn", label: { en: "popcorn", es: "palomitas" }, words: ["popcorn", "palomita", "palomitas"] },
  { id: "crackers", label: { en: "crackers", es: "galletas" }, words: ["cracker", "crackers", "galleta", "galletas"] },
  { id: "tortilla-chips", label: { en: "tortilla chips", es: "totopos" }, words: ["tortilla chip", "tortilla chips", "totopo", "totopos"] },
  { id: "pumpkin-seeds", label: { en: "pumpkin seeds", es: "pepitas" }, words: ["pumpkin seed", "pumpkin seeds", "pepita", "pepitas"] },
  { id: "sunflower-seeds", label: { en: "sunflower seeds", es: "semillas de girasol" }, words: ["sunflower seed", "sunflower seeds", "semillas de girasol", "girasol"] },
];

/** Phrases that mean "leave this out", in both languages. */
export const EXCLUSION_MARKERS = [
  // English
  "doesn't like",
  "does not like",
  "don't like",
  "do not like",
  "dislikes",
  "hates",
  "won't eat",
  "will not eat",
  "doesn't want",
  "does not want",
  "no more",
  "without",
  "no ",
  "not a fan of",
  "can't stand",
  // Spanish
  "no le gusta",
  "no le gustan",
  "no le agrada",
  "no quiere",
  "no come",
  "odia",
  "detesta",
  "sin ",
  // "tampoco le gusta el pollo" is how a second exclusion actually gets typed.
  "tampoco",
  "ya no",
  "otra idea",
  "another idea",
  "something else",
  "quita",
  "quitale",
  "cambia",
];
