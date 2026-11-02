import { afterAll, describe, expect, it } from "vitest";
import {
  answerServiceQuestion,
  checkGuardrail,
  detectExclusion,
  findIngredient,
  getLunchboxIdea,
  ideaHasIngredient,
  needsHumanReview,
  rewindBubbles,
  rewindTo,
  type RewindableState,
} from "@/lib/chatLogic";
import {
  saveChatSession,
  saveRating,
  saveReviewRequest,
  updateChatSession,
  validateContact,
  type ChatMessage,
} from "@/lib/chatStorage";
import {
  AGE_GROUPS,
  ALLERGEN_LABELS,
  ALLERGY_STATUS_LABELS,
  CHAT_ALLERGENS,
  CHAT_PREFERENCES,
  IDEA_ES,
  INTENT_LABELS,
  LANGS,
  LUNCHBOX_IDEAS,
  PREFERENCE_LABELS,
  SERVICE_ANSWERS,
  SERVICE_ANSWERS_ES,
  SERVICE_FALLBACK,
  INGREDIENTS,
} from "@/lib/chatData";
import { CHAT_PAGE_COPY } from "@/app/chat/chatCopy";
import { CHILD_AGE_OPTIONS } from "@/lib/lunchMenu";
import { PLANS } from "@/lib/productData";

/**
 * Every row these tests write sets is_test = true, which is the only thing the
 * anon delete policies allow them to remove. Cleanup runs in afterAll as well
 * as inline, so rows go away even when an expectation fails.
 */
async function cleanUpTestRows() {
  const { supabase } = await import("@/lib/supabase");
  // review_requests first: it has a foreign key to chat_sessions.
  await supabase.from("review_requests").delete().eq("is_test", true);
  await supabase.from("chat_sessions").delete().eq("is_test", true);
}

afterAll(cleanUpTestRows);

describe("software", () => {
  it("Software Test 1: chat session storage round trip", async () => {
    const { supabase } = await import("@/lib/supabase");

    const firstMessages: ChatMessage[] = [
      { role: "assistant", text: "1. What is your child's age?" },
      { role: "parent", text: "7-9" },
    ];

    try {
      const created = await saveChatSession({
        ageGroup: "7-9",
        allergyStatus: "No allergies",
        allergies: [],
        preferences: [],
        intent: "Lunchbox ideas",
        messages: firstMessages,
        flaggedForReview: false,
        reviewReason: null,
        isTest: true,
      });
      expect(created.ok).toBe(true);
      if (!created.ok) return;

      const id = created.data;
      expect(id).toBeTruthy();

      const grownMessages: ChatMessage[] = [
        ...firstMessages,
        { role: "parent", text: "Lunchbox ideas" },
        { role: "assistant", text: "Main: Grilled chicken strips." },
      ];

      const updated = await updateChatSession(id, {
        messages: grownMessages,
        flaggedForReview: true,
        reviewReason: "The parent asked to talk to a person.",
      });
      expect(updated.ok).toBe(true);

      const rated = await saveRating(id, "up");
      expect(rated.ok).toBe(true);

      const loaded = await supabase
        .from("chat_sessions")
        .select(
          "age_group, intent, messages, flagged_for_review, review_reason, rating, is_test",
        )
        .eq("id", id)
        .single();

      expect(loaded.error).toBeNull();
      const row = loaded.data;
      expect(row).toBeDefined();
      expect(row?.age_group).toBe("7-9");
      expect(row?.intent).toBe("Lunchbox ideas");
      expect(row?.messages).toHaveLength(4);
      expect(row?.messages?.[3]?.text).toContain("Grilled chicken");
      expect(row?.flagged_for_review).toBe(true);
      expect(row?.review_reason).toContain("talk to a person");
      expect(row?.rating).toBe("up");
      expect(row?.is_test).toBe(true);

      await supabase.from("chat_sessions").delete().eq("id", id);

      const afterDelete = await supabase
        .from("chat_sessions")
        .select("id")
        .eq("id", id);
      expect(afterDelete.data).toHaveLength(0);
    } finally {
      await cleanUpTestRows();
    }
  });

  it("Software Test 2: guardrail refuses medical requests", () => {
    const medical = [
      "my daughter has diabetes, what diet should I give her?",
      "mi hijo tiene gastritis, que dieta le pongo?",
      "what medication for obesity",
    ];

    for (const text of medical) {
      const result = checkGuardrail(text);
      expect(result.triggered).toBe(true);
      expect(result.response).not.toBeNull();

      // The refusal points at a professional and gives no advice of its own.
      expect(result.response!.toLowerCase()).toMatch(
        /pediatrician|registered nutritionist/,
      );
      expect(result.response!).not.toMatch(
        /you should (eat|give|try|avoid)|we recommend|try (eating|giving)|grams of|portion of/i,
      );
    }

    const ordinary = [
      "what is the price of the Plus plan?",
      "do you deliver at school?",
    ];
    for (const text of ordinary) {
      expect(checkGuardrail(text).triggered).toBe(false);
    }
  });

  it("Software Test 3: human checkpoint and contact validation", async () => {
    // --- needsHumanReview -------------------------------------------------
    const allergies = needsHumanReview({ allergyStatus: "Has allergies" });
    expect(allergies.needed).toBe(true);
    expect(allergies.reason).toBeTruthy();

    const englishKeyword = needsHumanReview({
      allergyStatus: "No allergies",
      freeText: "she had a reaction to peanuts last week",
    });
    expect(englishKeyword.needed).toBe(true);
    expect(englishKeyword.reason).toBeTruthy();

    const spanishKeyword = needsHumanReview({
      allergyStatus: "No allergies",
      freeText: "tuvo una alergia y ronchas",
    });
    expect(spanishKeyword.needed).toBe(true);
    expect(spanishKeyword.reason).toBeTruthy();

    const person = needsHumanReview({ intent: "Talk to a person" });
    expect(person.needed).toBe(true);
    expect(person.reason).toBeTruthy();

    const unanswerable = needsHumanReview({
      allergyStatus: "No allergies",
      intent: "Questions about the service",
      unanswered: true,
    });
    expect(unanswerable.needed).toBe(true);
    expect(unanswerable.reason).toBeTruthy();

    const ordinary = needsHumanReview({
      allergyStatus: "No allergies",
      intent: "Questions about the service",
      freeText: "what is the price of the Basic plan?",
    });
    expect(ordinary.needed).toBe(false);
    expect(ordinary.reason).toBeNull();

    // --- validateContact --------------------------------------------------
    expect(validateContact("")).not.toBeNull();
    expect(validateContact("   ")).not.toBeNull();
    expect(validateContact("ana@")).not.toBeNull();
    expect(validateContact("not a contact")).not.toBeNull();
    expect(validateContact("12345")).not.toBeNull();
    expect(validateContact("ana@example.com")).toBeNull();
    expect(validateContact("+52 55 1234 5678")).toBeNull();

    // --- one real insert into review_requests ------------------------------
    try {
      const session = await saveChatSession({
        ageGroup: "5-6",
        allergyStatus: "Has allergies",
        allergies: ["Peanuts"],
        preferences: [],
        intent: "Talk to a person",
        messages: [{ role: "parent", text: "__test__" }],
        flaggedForReview: true,
        reviewReason: "The parent asked to talk to a person.",
        isTest: true,
      });
      expect(session.ok).toBe(true);

      const saved = await saveReviewRequest({
        sessionId: session.ok ? session.data : null,
        contact: "test.parent@example.com",
        note: "__test__ automated check",
        isTest: true,
      });

      // review_requests has no anon SELECT policy on purpose, so the row can
      // never be read back. A result with ok === true is the only available
      // evidence that the insert succeeded.
      expect(saved.ok).toBe(true);

      const rejected = await saveReviewRequest({
        sessionId: null,
        contact: "   ",
        isTest: true,
      });
      expect(rejected.ok).toBe(false);
    } finally {
      await cleanUpTestRows();
    }
  });
});

describe("Extra unit checks", () => {
  it("a lunchbox idea never contains a selected allergen, for every allergen and age group", () => {
    for (const age of AGE_GROUPS) {
      for (const allergen of CHAT_ALLERGENS) {
        const result = getLunchboxIdea(age, [allergen], []);
        expect(result.idea).not.toBeNull();
        expect(result.idea!.allergens).not.toContain(allergen);
      }

      // All six at once still must not leak an allergen if an idea is returned.
      const strict = getLunchboxIdea(age, [...CHAT_ALLERGENS], []);
      if (strict.idea) {
        for (const allergen of CHAT_ALLERGENS) {
          expect(strict.idea.allergens).not.toContain(allergen);
        }
      }
    }
  });

  it("a vegetarian preference always returns a vegetarian idea", () => {
    for (const age of AGE_GROUPS) {
      const result = getLunchboxIdea(age, [], ["Vegetarian"]);
      expect(result.idea).not.toBeNull();
      expect(result.idea!.vegetarian).toBe(true);
      expect(result.idea!.redMeat).toBe(false);
    }
  });

  it("service answers quote the plan prices and fall back when they cannot help", () => {
    const prices = answerServiceQuestion("how much does it cost?");
    expect(prices.matched).toBe(true);
    for (const plan of PLANS) {
      expect(prices.answer).toContain(`$${plan.weeklyPrice}`);
    }
    // Guards the figures named in the brief against a silent data change.
    expect(PLANS.map((plan) => plan.weeklyPrice)).toEqual([300, 450, 600]);

    // An unknown question returns the fallback rather than a guess.
    const unknown = answerServiceQuestion("what is the capital of France?");
    expect(unknown.matched).toBe(false);
    expect(unknown.answer).toBe(SERVICE_FALLBACK);
    expect(unknown.offerHuman).toBe(true);

    // Payment and delivery schedules are known-unavailable topics: still not
    // answered, and still routed to a person.
    for (const text of [
      "can I pay with a credit card?",
      "what time do you deliver?",
    ]) {
      const result = answerServiceQuestion(text);
      expect(result.matched).toBe(false);
      expect(result.offerHuman).toBe(true);
      expect(result.answer).toContain("not defined yet");
    }

    // The schedule keywords must not swallow the part the site can answer.
    const atSchool = answerServiceQuestion("do you deliver at school?");
    expect(atSchool.matched).toBe(true);
    expect(atSchool.topic).toBe("delivery");
  });

  it("answers common delivery questions with the school fact and still flags a person", () => {
    const phrasings = [
      "how do they deliver the lunchbox",
      "where is the lunch delivered?",
      "do you deliver to my daughter's school?",
      "como entregan la lonchera?",
      "la entrega es en la escuela?",
    ];

    for (const text of phrasings) {
      const result = answerServiceQuestion(text);
      expect(result.topic).toBe("delivery");
      expect(result.matched).toBe(true);
      expect(result.answer).toContain("delivered at your child's school");
      // The half that is not settled is stated plainly, not guessed at.
      expect(result.answer).toContain("not defined yet");
      // Answered, but a person still picks it up.
      expect(result.offerHuman).toBe(true);
    }
  });

  it("keeps ordering, payment and exact schedules on the not-defined-yet reply", () => {
    const phrasings = [
      "can I pay with a credit card?",
      "how do I order?",
      "what time do you deliver?",
      "what is the delivery schedule?",
      "quiero cancelar mi pedido",
      "a que hora entregan?",
    ];

    for (const text of phrasings) {
      const result = answerServiceQuestion(text);
      expect(result.topic).toBe("ordering-and-payment");
      expect(result.matched).toBe(false);
      expect(result.offerHuman).toBe(true);
      expect(result.answer).toContain("not defined yet");
    }
  });

  it("answers what Lunchies is, personalization and allergy handling from site facts", () => {
    for (const text of ["what is Lunchies?", "how does it work?", "como funciona?"]) {
      const result = answerServiceQuestion(text);
      expect(result.topic).toBe("what-is-lunchies");
      expect(result.answer).toMatch(/5-day lunch plan/);
      expect(result.answer).toMatch(/age, allergies and food preferences/);
    }

    const personal = answerServiceQuestion("are the lunches personalized?");
    expect(personal.topic).toBe("personalization");
    expect(personal.answer).toMatch(/age/);
    expect(personal.answer).toMatch(/allergies/);
    expect(personal.answer).toMatch(/preferences/);

    const allergies = answerServiceQuestion("can you handle a gluten allergy?");
    expect(allergies.topic).toBe("allergies-and-preferences");
    expect(allergies.answer).toContain("filtered out");
    // Never a safety claim, always a human confirmation.
    expect(allergies.answer).toMatch(/never call a lunch safe/i);
    expect(allergies.answer).not.toMatch(
      /\bis safe\b|\bcompletely safe\b|allergy[- ]free|guaranteed/i,
    );
    expect(allergies.offerHuman).toBe(true);
  });

  it("still falls back rather than guessing when nothing matches", () => {
    const unknown = answerServiceQuestion("what is the capital of France?");
    expect(unknown.matched).toBe(false);
    expect(unknown.topic).toBeNull();
    expect(unknown.answer).toBe(SERVICE_FALLBACK);
    expect(unknown.offerHuman).toBe(true);
  });

  it("an idea for a child with allergies asks for confirmation and never claims it is safe", () => {
    const result = getLunchboxIdea("7-9", ["Peanuts", "Dairy"], []);
    expect(result.needsHumanConfirmation).toBe(true);
    expect(result.note).toContain("team member needs to confirm");

    const everythingShown = `${result.note} ${result.idea?.main ?? ""} ${
      result.idea?.side ?? ""
    } ${result.idea?.extra ?? ""}`;
    expect(everythingShown).not.toMatch(
      /\bis safe\b|\bsafe for\b|\bcompletely safe\b|allergy[- ]free|free from/i,
    );
    // The wording must actively deny safety rather than stay silent about it.
    expect(result.note).toMatch(/can't call any lunchbox safe/i);

    // Without allergies there is nothing to confirm, but the guidance note stays.
    const plain = getLunchboxIdea("7-9", [], []);
    expect(plain.needsHumanConfirmation).toBe(false);
    expect(plain.note).toContain("not a safety guarantee");
  });
});

describe("Spanish support", () => {
  it("every translation key exists in both languages with no empty value", () => {
    // Walks both copy trees together: same shape, same keys, nothing blank.
    const walk = (en: unknown, es: unknown, path: string) => {
      if (typeof en === "function") {
        expect(typeof es, `${path} should also be a function`).toBe("function");
        const enText = (en as (value: string) => string)("7-9");
        const esText = (es as (value: string) => string)("7-9");
        expect(enText.trim().length, `${path} en`).toBeGreaterThan(0);
        expect(esText.trim().length, `${path} es`).toBeGreaterThan(0);
        expect(esText, `${path} should be translated`).not.toBe(enText);
        return;
      }

      if (Array.isArray(en)) {
        expect(Array.isArray(es), `${path} should be an array`).toBe(true);
        expect((es as unknown[]).length, `${path} length`).toBe(en.length);
        en.forEach((item, index) =>
          walk(item, (es as unknown[])[index], `${path}[${index}]`),
        );
        return;
      }

      if (en && typeof en === "object") {
        expect(es && typeof es === "object", `${path} should be an object`).toBe(
          true,
        );
        const enKeys = Object.keys(en as object).sort();
        const esKeys = Object.keys(es as object).sort();
        expect(esKeys, `${path} keys`).toEqual(enKeys);
        for (const key of enKeys) {
          walk(
            (en as Record<string, unknown>)[key],
            (es as Record<string, unknown>)[key],
            `${path}.${key}`,
          );
        }
        return;
      }

      expect(typeof es, `${path} type`).toBe(typeof en);
      if (typeof en === "string") {
        expect(en.trim().length, `${path} en is empty`).toBeGreaterThan(0);
        expect((es as string).trim().length, `${path} es is empty`).toBeGreaterThan(0);
      }
    };

    walk(CHAT_PAGE_COPY.en, CHAT_PAGE_COPY.es, "copy");

    // The data-layer maps must cover every option and every idea.
    for (const lang of LANGS) {
      for (const allergen of CHAT_ALLERGENS) {
        expect(ALLERGEN_LABELS[lang][allergen]?.trim()).toBeTruthy();
      }
      for (const preference of CHAT_PREFERENCES) {
        expect(PREFERENCE_LABELS[lang][preference]?.trim()).toBeTruthy();
      }
      expect(Object.values(ALLERGY_STATUS_LABELS[lang]).every((v) => v.trim())).toBe(true);
      expect(Object.values(INTENT_LABELS[lang]).every((v) => v.trim())).toBe(true);
    }

    for (const idea of LUNCHBOX_IDEAS) {
      const translated = IDEA_ES[idea.id];
      expect(translated, `missing Spanish for ${idea.id}`).toBeDefined();
      for (const field of ["main", "side", "fruit", "extra"] as const) {
        expect(translated[field].trim().length).toBeGreaterThan(0);
      }
    }

    for (const entry of SERVICE_ANSWERS) {
      expect(
        SERVICE_ANSWERS_ES[entry.id]?.trim(),
        `missing Spanish answer for ${entry.id}`,
      ).toBeTruthy();
    }
  });

  it("Spanish lunchbox ideas still exclude every selected allergen", () => {
    for (const age of AGE_GROUPS) {
      for (const allergen of CHAT_ALLERGENS) {
        const result = getLunchboxIdea(age, [allergen], [], "es");
        expect(result.idea).not.toBeNull();
        // Filtering runs on the canonical English tags, not the shown names.
        expect(result.idea!.allergens).not.toContain(allergen);
        // The names really are translated.
        expect(result.idea!.main).toBe(IDEA_ES[result.idea!.id].main);
        expect(result.note).toMatch(/guía general/);
        expect(result.note).toMatch(/equipo de Lunchies necesita confirmar/);
      }

      const vegetarian = getLunchboxIdea(age, [], ["Vegetarian"], "es");
      expect(vegetarian.idea!.vegetarian).toBe(true);
    }
  });

  it("Spanish service answers quote the same prices and never claim a lunch is safe", () => {
    const prices = answerServiceQuestion("cuanto cuesta?", "es");
    expect(prices.topic).toBe("plans-and-prices");
    for (const plan of PLANS) {
      expect(prices.answer).toContain(`$${plan.weeklyPrice}`);
    }

    const allergies = answerServiceQuestion("tiene alergia al gluten", "es");
    expect(allergies.topic).toBe("allergies-and-preferences");
    expect(allergies.answer).toMatch(/nunca puedo decirte que una lonchera sea segura/i);
    expect(allergies.answer).toMatch(/equipo de Lunchies confirma/i);
    expect(allergies.offerHuman).toBe(true);

    // The honesty wording carries over to Spanish.
    const delivery = answerServiceQuestion("como entregan la lonchera?", "es");
    expect(delivery.answer).toMatch(/se entregan en la escuela/i);
    expect(delivery.answer).toMatch(/no están definidos/i);
    expect(delivery.offerHuman).toBe(true);

    const payment = answerServiceQuestion("puedo pagar con tarjeta?", "es");
    expect(payment.matched).toBe(false);
    expect(payment.answer).toMatch(/no están definidos/i);
  });

  it("keyword matching works across languages whatever the interface shows", () => {
    // Spanish medical question, English interface.
    const esMedical = checkGuardrail("mi hijo tiene gastritis, que dieta le doy?", "en");
    expect(esMedical.triggered).toBe(true);
    expect(esMedical.response).toMatch(/pediatrician|registered nutritionist/);

    // English medical question, Spanish interface.
    const enMedical = checkGuardrail("what medication for obesity?", "es");
    expect(enMedical.triggered).toBe(true);
    expect(enMedical.response).toMatch(/pediatra|nutriólogo/);

    // Spanish allergy mention flags a person regardless of interface language.
    const esAllergy = needsHumanReview({
      allergyStatus: "No allergies",
      freeText: "le salieron ronchas, creo que es una alergia",
    });
    expect(esAllergy.needed).toBe(true);

    const enAllergy = needsHumanReview({
      allergyStatus: "No allergies",
      freeText: "she had an allergic reaction",
    });
    expect(enAllergy.needed).toBe(true);

    // And an ordinary Spanish question still does not flag anyone.
    const ordinary = needsHumanReview({
      allergyStatus: "No allergies",
      freeText: "cuanto cuesta el plan basico?",
    });
    expect(ordinary.needed).toBe(false);
  });
});

describe("Ingredient exclusion", () => {
  const sweetPotato = INGREDIENTS.find((entry) => entry.id === "sweet-potato")!;

  it("reads an exclusion in English and Spanish, for camote and sweet potato", () => {
    const phrasings = [
      "my child doesn't like sweet potato",
      "he doesn't like sweet potato",
      "without sweet potato please",
      "no le gusta el camote",
      "sin camote",
      "mi hija no quiere camote",
    ];

    for (const text of phrasings) {
      const result = detectExclusion(text);
      expect(result.isExclusion, text).toBe(true);
      expect(result.ingredient?.id, text).toBe("sweet-potato");
    }

    // An ordinary question is never read as an exclusion.
    for (const text of [
      "what is the price of the Plus plan?",
      "do you have sweet potato in the menu?",
      "cuanto cuesta el plan basico?",
    ]) {
      expect(detectExclusion(text).isExclusion, text).toBe(false);
    }
  });

  it("returns a new idea without the excluded ingredient or any selected allergen", () => {
    // 7-9 is the age group whose first idea carries sweet potato.
    const first = getLunchboxIdea("7-9", [], [], "en");
    expect(ideaHasIngredient(first.idea!, sweetPotato)).toBe(true);

    for (const lang of ["en", "es"] as const) {
      const swapped = getLunchboxIdea("7-9", ["Dairy"], [], lang, [
        "sweet-potato",
      ]);
      expect(swapped.idea).not.toBeNull();
      expect(ideaHasIngredient(swapped.idea!, sweetPotato)).toBe(false);
      expect(swapped.idea!.allergens).not.toContain("Dairy");
      // The allergy wording is unchanged by the swap.
      expect(swapped.needsHumanConfirmation).toBe(true);
      expect(swapped.note).toMatch(
        lang === "es" ? /necesita confirmar/ : /team member needs to confirm/,
      );
      expect(swapped.note).not.toMatch(
        /\bis safe\b|\bsafe for\b|allergy[- ]free|es segura/i,
      );
    }
  });

  it("matches the excluded ingredient whichever language it was typed in", () => {
    // Typed in Spanish, filtered against the English food names and back.
    expect(findIngredient("no le gusta el camote")?.id).toBe("sweet-potato");
    expect(findIngredient("he doesn't like chicken")?.id).toBe("chicken");
    expect(findIngredient("sin pollo")?.id).toBe("chicken");
    expect(findIngredient("without zanahorias")?.id).toBe("carrot");

    const esExcluded = getLunchboxIdea("7-9", [], [], "es", ["sweet-potato"]);
    expect(ideaHasIngredient(esExcluded.idea!, sweetPotato)).toBe(false);
  });

  it("runs out of ideas rather than ignoring an exclusion", () => {
    // Excluding everything the 5-6 ideas are built from leaves nothing, which
    // is what sends the parent to a person instead of a wrong suggestion.
    const everything = INGREDIENTS.map((entry) => entry.id);
    const impossible = getLunchboxIdea("5-6", [], [], "en", everything);
    expect(impossible.idea).toBeNull();
    expect(impossible.noMatchReason).toBeTruthy();
  });

  it("still finds an ingredient that is not in the current idea", () => {
    // "mango" is only in one 7-9 idea, so a 5-6 parent naming it still gets
    // a valid idea back rather than an error.
    const mango = INGREDIENTS.find((entry) => entry.id === "mango")!;
    const result = getLunchboxIdea("5-6", [], [], "en", ["mango"]);
    expect(result.idea).not.toBeNull();
    expect(ideaHasIngredient(result.idea!, mango)).toBe(false);
    expect(detectExclusion("no le gusta el mango").ingredient?.id).toBe("mango");
  });
});

describe("Step 1: phrasings the testers actually used must not hit the fallback", () => {
  // Taken verbatim from the external tester sessions on 2026-11-01, plus the
  // variations asked for. None of these may fall through to "I can't answer".
  const exclusionPhrasings: Array<[string, string]> = [
    ["Menús sin jitomate", "tomato"],
    ["Y si a mi hijo no le gusta el camote", "sweet-potato"],
    ["menu sin jitomate", "tomato"],
    ["sin tomate", "tomato"],
    ["no le gusta el brócoli", "broccoli"],
    ["my son doesn't like carrots", "carrot"],
    ["no tomato please", "tomato"],
    ["no come pollo", "chicken"],
    ["without chicken", "chicken"],
  ];

  it("reads each one as an ingredient exclusion with the right ingredient", () => {
    for (const [text, expectedId] of exclusionPhrasings) {
      const result = detectExclusion(text);
      expect(result.isExclusion, `not read as an exclusion: "${text}"`).toBe(true);
      expect(result.ingredient?.id, `wrong ingredient for: "${text}"`).toBe(
        expectedId,
      );
    }
  });

  it("finds a replacement idea for each one, never the fallback", () => {
    for (const [text] of exclusionPhrasings) {
      const ingredient = findIngredient(text);
      expect(ingredient, text).not.toBeNull();
      const result = getLunchboxIdea("7-9", [], [], "es", [ingredient!.id]);
      // Either a real idea without it, or an honest "no idea left" reason.
      if (result.idea) {
        expect(ideaHasIngredient(result.idea, ingredient!), text).toBe(false);
      } else {
        expect(result.noMatchReason, text).toBeTruthy();
      }
    }
  });
});

describe("Step 3: wider question coverage, site facts only", () => {
  const cases: Array<{
    topic: string;
    en: string[];
    es: string[];
    expect: RegExp;
    expectEs: RegExp;
    available: boolean;
  }> = [
    {
      topic: "plan-differences",
      en: ["what's the difference between the plans?", "which plan should I pick?"],
      es: ["cual es la diferencia entre los planes?", "que incluye el plan premium?"],
      expect: /Basic:[\s\S]*Plus:[\s\S]*Premium:/,
      expectEs: /Basic:[\s\S]*Plus:[\s\S]*Premium:/,
      available: true,
    },
    {
      topic: "nutrition-information",
      en: ["do you give nutrition information?", "are there macros?"],
      es: ["dan informacion nutricional?", "traen macronutrientes?"],
      expect: /Plus and Premium/,
      expectEs: /Plus y Premium/,
      available: true,
    },
    {
      topic: "ingredients-quality",
      en: ["what ingredients do you use?", "are they organic?"],
      es: ["que ingredientes usan?", "son organicos?"],
      expect: /no artificial preservatives/,
      expectEs: /sin conservadores/,
      available: true,
    },
    {
      topic: "ages-covered",
      en: ["what ages do you cover?", "how old does my child need to be?"],
      es: ["que edades cubren?", "para que edad es?"],
      expect: /5 to 12 years old/,
      expectEs: /5 a 12 anos|5 a 12 años/,
      available: true,
    },
    {
      topic: "core-planner",
      en: ["what does the planner do?", "do I get a shopping list?"],
      es: ["que hace el planeador?", "me dan lista de compras?"],
      expect: /5-day lunch plan/,
      expectEs: /plan de 5 dias|plan de 5 días/,
      available: true,
    },
    {
      topic: "multi-child",
      en: ["I have two children", "can I add siblings?"],
      es: ["tengo dos hijos", "puedo agregar hermanos?"],
      expect: /Premium/,
      expectEs: /Premium/,
      available: true,
    },
    {
      topic: "not-defined-portions",
      en: ["what are the portion sizes?", "how many calories?"],
      es: ["de que tamano son las porciones?", "cuantas calorias trae?"],
      expect: /not defined yet/,
      expectEs: /no están definidos/,
      available: false,
    },
  ];

  it("answers each topic from facts already on the site, in both languages", () => {
    for (const row of cases) {
      for (const text of row.en) {
        const result = answerServiceQuestion(text, "en");
        expect(result.topic, `EN "${text}"`).toBe(row.topic);
        expect(result.answer, `EN "${text}"`).toMatch(row.expect);
        expect(result.matched, `EN "${text}"`).toBe(row.available);
      }
      for (const text of row.es) {
        const result = answerServiceQuestion(text, "es");
        expect(result.topic, `ES "${text}"`).toBe(row.topic);
        expect(result.answer, `ES "${text}"`).toMatch(row.expectEs);
      }
    }
  });

  it("the quoted facts match their source files", () => {
    // Ages come from /core's own option list, not a number typed by hand.
    expect(CHILD_AGE_OPTIONS[0]).toBe("5 years old");
    expect(CHILD_AGE_OPTIONS[CHILD_AGE_OPTIONS.length - 1]).toBe("12 years old");

    // Plan bullets are quoted from PLANS.
    const differences = answerServiceQuestion("what is the difference?", "en");
    for (const plan of PLANS) {
      expect(differences.answer).toContain(plan.name);
      expect(differences.answer.toLowerCase()).toContain(
        plan.bullets[1].toLowerCase(),
      );
    }
  });

  it("still refuses what the site does not define, with a person offered", () => {
    for (const text of [
      "how do I cancel?",
      "can I get a refund?",
      "what are the portion sizes?",
      "como cancelo mi plan?",
      "cuantas calorias trae?",
    ]) {
      const result = answerServiceQuestion(text, text.startsWith("c") && !text.startsWith("can") ? "es" : "en");
      expect(result.matched, text).toBe(false);
      expect(result.offerHuman, text).toBe(true);
    }
  });

  it("never claims a lunch is safe and never gives medical advice", () => {
    for (const row of cases) {
      for (const text of [...row.en, ...row.es]) {
        for (const lang of ["en", "es"] as const) {
          const answer = answerServiceQuestion(text, lang).answer;
          expect(answer, text).not.toMatch(
            /\bis safe\b|\bsafe for\b|allergy[- ]free|es segura|libre de alergenos/i,
          );
          expect(answer, text).not.toMatch(
            /you should eat|we recommend you|dosage|diagnos/i,
          );
        }
      }
    }
  });
});

describe("Step 4: the fallback offers things the chat can answer", () => {
  it("keeps the honest message and offers a person", () => {
    const unknown = answerServiceQuestion("what is the capital of France?", "en");
    expect(unknown.topic).toBeNull();
    expect(unknown.answer).toBe(SERVICE_FALLBACK);
    expect(unknown.offerHuman).toBe(true);
  });

  it("every suggested button leads to a real answer, in both languages", () => {
    for (const lang of ["en", "es"] as const) {
      const suggestions = CHAT_PAGE_COPY[lang].fallbackSuggestions;
      expect(suggestions.intro.trim().length).toBeGreaterThan(0);
      expect(suggestions.options.length).toBeGreaterThanOrEqual(3);
      expect(suggestions.options.length).toBeLessThanOrEqual(4);

      for (const option of suggestions.options) {
        expect(option.label.trim().length, option.id).toBeGreaterThan(0);

        const query = "query" in option ? option.query : undefined;
        if (!query) {
          // The only option without a canned question is the lunchbox idea,
          // which the page answers directly.
          expect(option.id).toBe("idea");
          continue;
        }

        const result = answerServiceQuestion(query, lang);
        // A suggested button must never land on the fallback.
        expect(result.topic, `${lang} ${option.id}`).not.toBeNull();
      }
    }
  });
});

describe("Step 7: changing an intake answer", () => {
  // A conversation where all three questions were answered, an idea was shown,
  // it was rated, and the allergy answer flagged it for review.
  const answered: RewindableState = {
    ageGroup: "7-9",
    allergyStatus: "Has allergies",
    allergies: ["Dairy", "Gluten"],
    preferences: [],
    intent: "Lunchbox ideas",
    excluded: ["sweet-potato"],
    flaggedForReview: true,
    reviewReason: "The parent reported allergies.",
    rating: "up",
  };

  it("changing the age clears every later answer", () => {
    const { state, step } = rewindTo(answered, "age");
    expect(step).toBe("age");
    expect(state.ageGroup).toBeNull();
    expect(state.allergyStatus).toBeNull();
    expect(state.allergies).toEqual([]);
    expect(state.preferences).toEqual([]);
    expect(state.intent).toBeNull();
    expect(state.excluded).toEqual([]);
  });

  it("changing the allergy answer keeps the age and clears the rest", () => {
    const { state, step } = rewindTo(answered, "allergy");
    expect(step).toBe("allergy");
    expect(state.ageGroup).toBe("7-9");
    // Mid-list picks go too, so the parent chooses from scratch.
    expect(state.allergyStatus).toBeNull();
    expect(state.allergies).toEqual([]);
    expect(state.preferences).toEqual([]);
    expect(state.intent).toBeNull();
  });

  it("changing the intent keeps the age and the allergy answers", () => {
    const withPreferences: RewindableState = {
      ...answered,
      allergyStatus: "Preferences",
      allergies: [],
      preferences: ["Vegetarian"],
    };
    const { state, step } = rewindTo(withPreferences, "intent");
    expect(step).toBe("intent");
    expect(state.ageGroup).toBe("7-9");
    expect(state.allergyStatus).toBe("Preferences");
    expect(state.preferences).toEqual(["Vegetarian"]);
    expect(state.intent).toBeNull();
  });

  it("every rewind clears the review flag, its reason and the rating", () => {
    for (const target of ["age", "allergy", "intent"] as const) {
      const { state } = rewindTo(answered, target);
      expect(state.flaggedForReview, target).toBe(false);
      expect(state.reviewReason, target).toBeNull();
      expect(state.rating, target).toBeNull();
      // Ingredient exclusions came from the discarded part as well.
      expect(state.excluded, target).toEqual([]);
    }
  });

  it("drops the changed answer and everything after it from the transcript", () => {
    const bubbles = [
      { id: 1, text: "greeting" },
      { id: 2, text: "1. age?" },
      { id: 3, text: "7-9" },
      { id: 4, text: "2. allergies?" },
      { id: 5, text: "Has allergies" },
      { id: 6, text: "idea" },
    ];

    // Changing the age keeps the greeting and the question, drops the answer on.
    expect(rewindBubbles(bubbles, 3).map((b) => b.id)).toEqual([1, 2]);
    // Changing the allergy answer keeps everything up to its question.
    expect(rewindBubbles(bubbles, 5).map((b) => b.id)).toEqual([1, 2, 3, 4]);
    // An id that is not there leaves the conversation alone.
    expect(rewindBubbles(bubbles, 99)).toHaveLength(bubbles.length);
  });

  it("what is stored matches what is left on screen", () => {
    const bubbles = [
      { id: 1, text: "greeting" },
      { id: 2, text: "1. age?" },
      { id: 3, text: "7-9", intake: "age" as const },
      { id: 4, text: "2. allergies?" },
      { id: 5, text: "Has allergies", intake: "allergy" as const },
      { id: 6, text: "idea", review: true },
    ];

    const trimmed = rewindBubbles(bubbles, 5);
    const { state } = rewindTo(
      { ...answered, flaggedForReview: trimmed.some((b) => "review" in b && b.review) },
      "allergy",
    );

    // Nothing flagged survives, because the flagged message was discarded.
    expect(trimmed.some((b) => "review" in b && b.review)).toBe(false);
    expect(state.flaggedForReview).toBe(false);
    // The answer still visible is the one still in state.
    expect(trimmed.filter((b) => "intake" in b).map((b) => b.text)).toEqual(["7-9"]);
    expect(state.ageGroup).toBe("7-9");
    expect(state.allergyStatus).toBeNull();
  });
});
