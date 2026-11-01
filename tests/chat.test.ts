import { afterAll, describe, expect, it } from "vitest";
import {
  answerServiceQuestion,
  checkGuardrail,
  getLunchboxIdea,
  needsHumanReview,
} from "@/lib/chatLogic";
import {
  saveChatSession,
  saveRating,
  saveReviewRequest,
  updateChatSession,
  validateContact,
  type ChatMessage,
} from "@/lib/chatStorage";
import { AGE_GROUPS, CHAT_ALLERGENS, SERVICE_FALLBACK } from "@/lib/chatData";
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
      expect(result.answer).toContain("not available yet");
    }

    // The delivery keywords above must not swallow the question the site can
    // answer: delivery at school is a fact already on the site.
    const atSchool = answerServiceQuestion("do you deliver at school?");
    expect(atSchool.matched).toBe(true);
    expect(atSchool.topic).toBe("school-delivery");
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
