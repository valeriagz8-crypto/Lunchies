/**
 * Pure rules for the chat assistant. No network, no AI model, no randomness,
 * so every answer is reproducible and testable.
 *
 * Two safety rules shape this file:
 * - A lunchbox is never described as safe for an allergy. When allergies are
 *   in play the answer says a Lunchies team member has to confirm it.
 * - Medical and dietary-treatment questions are refused and sent to a
 *   pediatrician or registered nutritionist.
 */

import {
  CHAT_NOTES,
  HUMAN_CHECKPOINT_KEYWORDS,
  LUNCHBOX_IDEAS,
  MEDICAL_KEYWORDS,
  MEDICAL_RESPONSE,
  SERVICE_ANSWERS,
  SERVICE_FALLBACK,
  type AgeGroup,
  type AllergyStatus,
  type Intent,
  type LunchboxIdea,
} from "./chatData";

/** Lower-cases and strips accents so "alérgeno" matches "alergeno". */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function containsKeyword(text: string, keywords: string[]): string | null {
  const haystack = normalize(text);
  if (!haystack) return null;

  for (const keyword of keywords) {
    const needle = normalize(keyword);
    // Whole-word match, so "er" does not fire inside "dinner".
    const pattern = new RegExp(
      `(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`,
    );
    if (pattern.test(haystack)) return keyword;
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Lunchbox ideas                                                             */
/* -------------------------------------------------------------------------- */

export type LunchboxResult = {
  idea: LunchboxIdea | null;
  /** Always present: the idea is general guidance, never a safety guarantee. */
  note: string;
  /** True when allergies were given, so a person must confirm the idea. */
  needsHumanConfirmation: boolean;
  /** Set when no idea survived the filters. */
  noMatchReason: string | null;
};

/**
 * Picks one lunchbox idea for an age group, excluding every listed allergen
 * and respecting the preferences. Selection is deterministic: the best-scoring
 * idea wins, ties go to the first one defined.
 */
export function getLunchboxIdea(
  age: AgeGroup,
  allergies: string[] = [],
  preferences: string[] = [],
): LunchboxResult {
  const hasAllergies = allergies.length > 0;
  const note = hasAllergies
    ? `${CHAT_NOTES.generalGuidance} ${CHAT_NOTES.allergyConfirmation}`
    : CHAT_NOTES.generalGuidance;

  const vegetarian = preferences.includes("Vegetarian");
  const noRedMeat = preferences.includes("No red meat");
  const lovesFruits = preferences.includes("Loves fruits");
  const lovesVeggies = preferences.includes("Loves veggies");

  const candidates = LUNCHBOX_IDEAS.filter((idea) => {
    if (idea.ageGroup !== age) return false;
    // Exclude an idea if it carries any allergen the parent listed.
    if (idea.allergens.some((allergen) => allergies.includes(allergen))) {
      return false;
    }
    if (vegetarian && !idea.vegetarian) return false;
    if ((noRedMeat || vegetarian) && idea.redMeat) return false;
    return true;
  });

  if (candidates.length === 0) {
    return {
      idea: null,
      note,
      needsHumanConfirmation: hasAllergies,
      noMatchReason:
        "I don't have an idea that fits all of those at once. A Lunchies team member can put something together for you.",
    };
  }

  const score = (idea: LunchboxIdea) =>
    (lovesFruits && idea.fruitForward ? 1 : 0) +
    (lovesVeggies && idea.veggieForward ? 1 : 0);

  const best = candidates.reduce((winner, idea) =>
    score(idea) > score(winner) ? idea : winner,
  );

  return {
    idea: best,
    note,
    needsHumanConfirmation: hasAllergies,
    noMatchReason: null,
  };
}

/* -------------------------------------------------------------------------- */
/* Service questions                                                          */
/* -------------------------------------------------------------------------- */

export type ServiceResult = {
  answer: string;
  /** False when nothing matched, or when the topic has no answer yet. */
  matched: boolean;
  topic: string | null;
  /** True when the reply should offer to bring in a person. */
  offerHuman: boolean;
};

/**
 * Matches a question against the fixed service answers. The entry with the
 * most keyword hits wins; nothing matching returns the fallback rather than a
 * guess about the business.
 */
export function answerServiceQuestion(text: string): ServiceResult {
  const haystack = normalize(text);

  let bestEntry = null as (typeof SERVICE_ANSWERS)[number] | null;
  let bestHits = 0;

  for (const entry of SERVICE_ANSWERS) {
    const hits = entry.keywords.filter((keyword) =>
      haystack.includes(normalize(keyword)),
    ).length;
    if (hits > bestHits) {
      bestHits = hits;
      bestEntry = entry;
    }
  }

  if (!bestEntry) {
    return {
      answer: SERVICE_FALLBACK,
      matched: false,
      topic: null,
      offerHuman: true,
    };
  }

  return {
    answer: bestEntry.answer,
    matched: bestEntry.available,
    topic: bestEntry.id,
    offerHuman: !bestEntry.available,
  };
}

/* -------------------------------------------------------------------------- */
/* Guardrail                                                                  */
/* -------------------------------------------------------------------------- */

export type GuardrailResult = {
  triggered: boolean;
  /** The reply to show instead of answering the question. */
  response: string | null;
  matchedKeyword: string | null;
};

/** Catches medical and dietary-treatment requests before anything else runs. */
export function checkGuardrail(text: string): GuardrailResult {
  const matched = containsKeyword(text, MEDICAL_KEYWORDS);
  if (!matched) {
    return { triggered: false, response: null, matchedKeyword: null };
  }
  return {
    triggered: true,
    response: MEDICAL_RESPONSE,
    matchedKeyword: matched,
  };
}

/* -------------------------------------------------------------------------- */
/* Human review                                                               */
/* -------------------------------------------------------------------------- */

export type ChatState = {
  allergyStatus?: AllergyStatus | null;
  allergies?: string[];
  intent?: Intent | null;
  /** Anything the parent typed in their own words. */
  freeText?: string;
  /** True when the assistant could not answer the question. */
  unanswered?: boolean;
};

export type HumanReviewResult = {
  needed: boolean;
  reason: string | null;
};

/** Decides whether a session should be handed to a person, and says why. */
export function needsHumanReview(state: ChatState): HumanReviewResult {
  if (state.intent === "Talk to a person") {
    return { needed: true, reason: "The parent asked to talk to a person." };
  }

  if (state.allergyStatus === "Has allergies") {
    return {
      needed: true,
      reason:
        "The parent reported allergies, so a team member must confirm any lunchbox idea.",
    };
  }

  if ((state.allergies?.length ?? 0) > 0) {
    return {
      needed: true,
      reason:
        "Allergies were listed, so a team member must confirm any lunchbox idea.",
    };
  }

  const keyword = state.freeText
    ? containsKeyword(state.freeText, HUMAN_CHECKPOINT_KEYWORDS)
    : null;
  if (keyword) {
    return {
      needed: true,
      reason: `The parent mentioned "${keyword}", which needs a person.`,
    };
  }

  if (state.unanswered) {
    return {
      needed: true,
      reason: "The assistant could not answer the question.",
    };
  }

  return { needed: false, reason: null };
}
