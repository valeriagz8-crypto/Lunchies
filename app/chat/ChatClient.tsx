"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Headphones,
  Info,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";
import Spark from "@/components/home/Spark";
import {
  AGE_GROUPS,
  ALLERGEN_LABELS,
  ALLERGY_STATUSES,
  ALLERGY_STATUS_LABELS,
  CHAT_ALLERGENS,
  CHAT_IMAGES,
  CHAT_PREFERENCES,
  INTENTS,
  INTENT_LABELS,
  LANGS,
  PREFERENCE_LABELS,
  SERVICE_REVIEW_REASON,
  type AgeGroup,
  type AllergyStatus,
  type Intent,
  type Lang,
} from "@/lib/chatData";
import {
  answerServiceQuestion,
  checkGuardrail,
  detectExclusion,
  getLunchboxIdea,
  ideaHasIngredient,
  needsHumanReview,
  type LunchboxResult,
} from "@/lib/chatLogic";
import {
  saveChatSession,
  saveRating,
  saveReviewRequest,
  updateChatSession,
  validateContact,
  type ChatMessage,
  type ChatRating,
} from "@/lib/chatStorage";
import { CHAT_PAGE_COPY } from "./chatCopy";

/* -------------------------------------------------------------------------- */
/* Conversation model                                                         */
/* -------------------------------------------------------------------------- */

type Step =
  | "age"
  | "allergy"
  | "allergy-list"
  | "preference-list"
  | "intent"
  | "await-question"
  | "open";

type Bubble = {
  id: number;
  role: "assistant" | "parent";
  text: string;
  /** The language this bubble was written in. Past bubbles never change. */
  lang?: Lang;
  /** A lunchbox idea rendered as a card instead of plain text. */
  idea?: LunchboxResult;
  /** Thumbs are offered under answers, not under questions. */
  rateable?: boolean;
  rating?: ChatRating | null;
  /** Shows the "needs a review" banner under this bubble. */
  review?: boolean;
  /** Ingredient ids excluded at the time this bubble was written. */
  excluded?: string[];
  /** Shows the "things I can answer" quick replies under this bubble. */
  suggestions?: boolean;
};

let bubbleId = 0;
const nextId = () => (bubbleId += 1);

function assistant(text: string, extra: Partial<Bubble> = {}): Bubble {
  return { id: nextId(), role: "assistant", text, ...extra };
}

function parent(text: string, extra: Partial<Bubble> = {}): Bubble {
  return { id: nextId(), role: "parent", text, ...extra };
}

/**
 * The plain transcript stored in Supabase: no names, no contact details. Each
 * message carries the language it was written in, which is how the language is
 * recorded without touching the schema.
 */
function toTranscript(bubbles: Bubble[], lang: Lang): ChatMessage[] {
  return bubbles.map((bubble) => ({
    role: bubble.role,
    text: bubble.idea
      ? `${bubble.text} ${ideaToText(bubble.idea)}`
      : bubble.text,
    lang: bubble.lang ?? lang,
    ...(bubble.excluded?.length ? { excluded: bubble.excluded } : {}),
  }));
}

function ideaToText(result: LunchboxResult): string {
  if (!result.idea) return result.noMatchReason ?? "";
  const { main, side, fruit, extra } = result.idea;
  return `Main: ${main}. Side: ${side}. Fruit: ${fruit}. Extra: ${extra}.`;
}

/* -------------------------------------------------------------------------- */
/* Small pieces                                                               */
/* -------------------------------------------------------------------------- */

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-600 focus-visible:ring-offset-2";

function QuickReply({
  label,
  onClick,
  selected = false,
}: {
  label: string;
  onClick: () => void;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-colors ${FOCUS} ${
        selected
          ? "bg-leaf-700 text-white"
          : "bg-white text-leaf-800 hover:bg-leaf-50"
      }`}
    >
      {label}
    </button>
  );
}

const IDEA_LABELS: Record<Lang, [string, string, string, string]> = {
  en: ["Main", "Side", "Fruit", "Extra"],
  es: ["Principal", "Acompañamiento", "Fruta", "Extra"],
};

function IdeaCard({ result, lang }: { result: LunchboxResult; lang: Lang }) {
  if (!result.idea) {
    return (
      <p className="mt-2 text-sm text-leaf-800">{result.noMatchReason}</p>
    );
  }

  const [mainLabel, sideLabel, fruitLabel, extraLabel] = IDEA_LABELS[lang];
  const rows = [
    [mainLabel, result.idea.main],
    [sideLabel, result.idea.side],
    [fruitLabel, result.idea.fruit],
    [extraLabel, result.idea.extra],
  ];

  return (
    <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem]">
      <ul className="space-y-1.5">
        {rows.map(([label, value]) => (
          <li key={label} className="flex items-start gap-2 text-sm">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span className="min-w-0 text-leaf-800">
              <span className="font-semibold">{label}:</span> {value}
            </span>
          </li>
        ))}
      </ul>

      <div className="relative hidden h-32 overflow-hidden rounded-2xl bg-leaf-100 sm:block">
        <Image
          src={CHAT_IMAGES.hero.src}
          alt={CHAT_IMAGES.hero.alt}
          fill
          sizes="9rem"
          className="object-cover"
        />
      </div>

      <p className="text-xs leading-relaxed text-leaf-600 sm:col-span-2">
        {result.note}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ChatClient() {
  // /chat?test=1 marks rows as test data so automated checks can delete them.
  // It only sets the is_test flag; the conversation behaves identically.
  const searchParams = useSearchParams();
  const isTest = searchParams.get("test") === "1";

  // Always opens in English. The language changes only when the visitor taps
  // ES or EN, and the choice is not remembered between visits.
  const [lang, setLang] = useState<Lang>("en");
  const COPY = CHAT_PAGE_COPY[lang];

  const [bubbles, setBubbles] = useState<Bubble[]>(() => [
    assistant(CHAT_PAGE_COPY.en.greeting, { lang: "en" }),
    assistant(CHAT_PAGE_COPY.en.questions.age, { lang: "en" }),
  ]);
  const [step, setStep] = useState<Step>("age");

  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [allergyStatus, setAllergyStatus] = useState<AllergyStatus | null>(
    null,
  );
  const [allergies, setAllergies] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [intent, setIntent] = useState<Intent | null>(null);

  // Ingredient ids the child has turned down, kept for the whole chat.
  const [excluded, setExcluded] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSending, setReviewSending] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);

  const sessionIdRef = useRef<string | null>(null);
  const reviewReasonRef = useRef<string | null>(null);
  const savedCountRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const push = useCallback((...next: Bubble[]) => {
    setBubbles((current) => [...current, ...next]);
  }, []);


  /* ---- persistence ---------------------------------------------------- */

  const persist = useCallback(
    async (current: Bubble[]) => {
      const flagged = current.some((bubble) => bubble.review);
      const transcript = toTranscript(current, lang);

      if (!sessionIdRef.current) {
        const result = await saveChatSession({
          ageGroup,
          allergyStatus,
          allergies,
          preferences,
          intent,
          messages: transcript,
          flaggedForReview: flagged,
          reviewReason: reviewReasonRef.current,
          isTest,
        }, lang);
        if (result.ok) {
          sessionIdRef.current = result.data;
          setSaveError(null);
        } else {
          setSaveError(result.error);
        }
        return;
      }

      const result = await updateChatSession(
        sessionIdRef.current,
        {
          messages: transcript,
          flaggedForReview: flagged,
          reviewReason: reviewReasonRef.current,
        },
        lang,
      );
      setSaveError(result.ok ? null : result.error);
    },
    [ageGroup, allergyStatus, allergies, preferences, intent, isTest, lang],
  );

  // The conversation is stored once the assistant has given a real answer,
  // then kept up to date as it grows.
  useEffect(() => {
    const hasAnswer = bubbles.some(
      (bubble) => bubble.rateable || bubble.review,
    );
    if (!hasAnswer || bubbles.length === savedCountRef.current) return;

    savedCountRef.current = bubbles.length;
    void persist(bubbles);
  }, [bubbles, persist]);

  // Keep the newest message in view inside the panel, not the whole page.
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [bubbles, step]);

  /* ---- intake --------------------------------------------------------- */

  function answerIntent(choice: Intent) {
    setIntent(choice);
    push(parent(INTENT_LABELS[lang][choice], { lang }));

    if (choice === "Lunchbox ideas") {
      const result = getLunchboxIdea(
        ageGroup ?? "7-9",
        allergies,
        preferences,
        lang,
        excluded,
      );
      const review = needsHumanReview({ allergyStatus, allergies, intent: choice });
      if (review.needed) reviewReasonRef.current = review.reason;

      push(
        assistant(COPY.ideaIntro(ageGroup ?? "7-9"), {
          lang,
          idea: result,
          rateable: true,
          rating: null,
          review: review.needed,
        }),
      );
      setStep("open");
      return;
    }

    if (choice === "Questions about the service") {
      push(assistant(COPY.askQuestion, { lang }));
      setStep("await-question");
      return;
    }

    const review = needsHumanReview({ allergyStatus, allergies, intent: choice });
    reviewReasonRef.current = review.reason;
    push(assistant(COPY.review.title, { lang, review: true }));
    setStep("open");
  }

  function answerAllergy(choice: AllergyStatus) {
    setAllergyStatus(choice);
    push(parent(ALLERGY_STATUS_LABELS[lang][choice], { lang }));

    if (choice === "Has allergies") {
      push(assistant(COPY.questions.allergyList, { lang }));
      setStep("allergy-list");
      return;
    }
    if (choice === "Preferences") {
      push(assistant(COPY.questions.preferenceList, { lang }));
      setStep("preference-list");
      return;
    }

    push(assistant(COPY.questions.intent, { lang }));
    setStep("intent");
  }

  function finishList(kind: "allergy" | "preference") {
    const chosen = kind === "allergy" ? allergies : preferences;
    const labels = kind === "allergy" ? ALLERGEN_LABELS : PREFERENCE_LABELS;
    const shown =
      chosen.length > 0
        ? chosen.map((value) => labels[lang][value] ?? value).join(", ")
        : lang === "es"
          ? "Ninguna"
          : "None selected";

    push(parent(shown, { lang }));
    push(assistant(COPY.questions.intent, { lang }));
    setStep("intent");
  }

  function toggle(list: string[], value: string, set: (next: string[]) => void) {
    set(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value],
    );
  }

  /* ---- typed messages -------------------------------------------------- */

  function handleSend(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");

    const next: Bubble[] = [parent(text, { lang })];

    // 1. Guardrail first: medical and dietary-treatment requests are refused.
    // The keyword lists cover both languages whatever the interface shows.
    const guardrail = checkGuardrail(text, lang);
    if (guardrail.triggered && guardrail.response) {
      next.push(assistant(guardrail.response, { lang }));
    }

    // 2. "He doesn't like sweet potato": swap the idea rather than fall back.
    const shownIdea = bubbles.some((bubble) => bubble.idea);
    const exclusion = guardrail.triggered
      ? { isExclusion: false, ingredient: null }
      : detectExclusion(text);

    if (shownIdea && exclusion.isExclusion && exclusion.ingredient) {
      handleExclusion(text, exclusion.ingredient, next);
      push(...next);
      return;
    }

    // 3. Does this need a person?
    const review = needsHumanReview({
      allergyStatus,
      allergies,
      intent,
      freeText: text,
    });

    // 4. Answer from the fixed service answers, unless the guardrail fired.
    if (!guardrail.triggered) {
      const result = answerServiceQuestion(text, lang);
      const reviewForAnswer = !result.matched
        ? needsHumanReview({
            allergyStatus,
            allergies,
            intent,
            freeText: text,
            unanswered: true,
          })
        : review;

      // Some topics are answered and still need a person, because the site
      // only covers part of them (delivery at school, anything allergy
      // related). offerHuman carries that, so the banner follows it too.
      const showBanner = reviewForAnswer.needed || result.offerHuman;

      if (reviewForAnswer.needed) {
        reviewReasonRef.current = reviewForAnswer.reason;
      } else if (result.offerHuman) {
        reviewReasonRef.current = SERVICE_REVIEW_REASON;
      }

      next.push(
        assistant(result.answer, {
          lang,
          rateable: true,
          rating: null,
          review: showBanner,
          // A dead end always offers a way forward.
          suggestions: result.topic === null,
        }),
      );
    } else if (review.needed) {
      reviewReasonRef.current = review.reason;
      next.push(assistant(COPY.review.title, { lang, review: true }));
    }

    // A question asked mid-intake is answered, then the pending question is
    // repeated so the parent does not lose their place.
    const pending = pendingQuestion();
    if (pending) next.push(assistant(pending, { lang }));
    if (step === "await-question") setStep("open");

    push(...next);
  }

  /**
   * Swaps the idea for one without the ingredient. Only one swap per
   * conversation: a second request, or nothing left to suggest, goes to a
   * person instead of guessing.
   */
  function handleExclusion(
    text: string,
    ingredient: NonNullable<ReturnType<typeof detectExclusion>["ingredient"]>,
    next: Bubble[],
  ) {
    const alreadySwapped = excluded.length > 0;
    if (alreadySwapped) {
      reviewReasonRef.current = `The parent asked for more than one change (${[...excluded, ingredient.id].join(", ")}).`;
      next.push(
        assistant(COPY.exclusion.tooMany, { lang, review: true }),
      );
      return;
    }

    const currentIdea = [...bubbles].reverse().find((bubble) => bubble.idea)
      ?.idea?.idea;
    const wasInIdea = currentIdea
      ? ideaHasIngredient(currentIdea, ingredient)
      : false;

    const nextExcluded = [...excluded, ingredient.id];
    setExcluded(nextExcluded);

    const result = getLunchboxIdea(
      ageGroup ?? "7-9",
      allergies,
      preferences,
      lang,
      nextExcluded,
    );

    if (!result.idea) {
      reviewReasonRef.current = `No idea left after excluding ${nextExcluded.join(", ")}.`;
      next.push(assistant(COPY.exclusion.noneLeft, { lang, review: true }));
      return;
    }

    const label = ingredient.label[lang];
    const intro = wasInIdea
      ? COPY.exclusion.replaced(label)
      : COPY.exclusion.notInIdea(label);

    // Allergies still need a person, exactly as on the first idea.
    const review = needsHumanReview({ allergyStatus, allergies, intent });
    if (review.needed) reviewReasonRef.current = review.reason;

    next.push(
      assistant(intro, {
        lang,
        idea: result,
        rateable: true,
        rating: null,
        review: review.needed,
        excluded: nextExcluded,
      }),
    );
  }

  /** Runs one of the suggested questions, or shows an idea for "a lunchbox idea". */
  function handleSuggestion(id: string, query?: string) {
    if (id === "idea" || !query) {
      const result = getLunchboxIdea(
        ageGroup ?? "7-9",
        allergies,
        preferences,
        lang,
        excluded,
      );
      const review = needsHumanReview({ allergyStatus, allergies, intent });
      if (review.needed) reviewReasonRef.current = review.reason;

      push(
        assistant(COPY.ideaIntro(ageGroup ?? "7-9"), {
          lang,
          idea: result,
          rateable: true,
          rating: null,
          review: review.needed,
        }),
      );
      return;
    }

    const result = answerServiceQuestion(query, lang);
    const showBanner = result.offerHuman;
    if (showBanner) reviewReasonRef.current = SERVICE_REVIEW_REASON;

    push(
      parent(query, { lang }),
      assistant(result.answer, {
        lang,
        rateable: true,
        rating: null,
        review: showBanner,
      }),
    );
  }

  function pendingQuestion(): string | null {
    if (step === "age") return COPY.questions.age;
    if (step === "allergy") return COPY.questions.allergy;
    if (step === "allergy-list") return COPY.questions.allergyList;
    if (step === "preference-list") return COPY.questions.preferenceList;
    if (step === "intent") return COPY.questions.intent;
    return null;
  }

  /* ---- rating ---------------------------------------------------------- */

  async function handleRate(bubbleIdValue: number, rating: ChatRating) {
    setBubbles((current) =>
      current.map((bubble) =>
        bubble.id === bubbleIdValue ? { ...bubble, rating } : bubble,
      ),
    );

    if (!sessionIdRef.current) return;
    const result = await saveRating(sessionIdRef.current, rating, lang);
    if (!result.ok) setSaveError(result.error);
  }

  /* ---- review request -------------------------------------------------- */

  async function handleReviewSubmit(event: React.FormEvent) {
    event.preventDefault();
    const invalid = validateContact(contact, lang);
    if (invalid) {
      setReviewError(invalid);
      return;
    }

    setReviewError(null);
    setReviewSending(true);
    const result = await saveReviewRequest(
      { sessionId: sessionIdRef.current, contact, note, isTest },
      lang,
    );
    setReviewSending(false);

    if (!result.ok) {
      setReviewError(result.error);
      return;
    }

    setReviewSent(true);
    setReviewOpen(false);
    setContact("");
    setNote("");
  }

  /* ---- reset ----------------------------------------------------------- */

  function handleReset() {
    sessionIdRef.current = null;
    reviewReasonRef.current = null;
    savedCountRef.current = 0;
    setBubbles([
      assistant(COPY.greeting, { lang }),
      assistant(COPY.questions.age, { lang }),
    ]);
    setStep("age");
    setAgeGroup(null);
    setAllergyStatus(null);
    setAllergies([]);
    setPreferences([]);
    setIntent(null);
    setExcluded([]);
    setDraft("");
    setSaveError(null);
    setReviewOpen(false);
    setReviewSent(false);
    setReviewError(null);
    setContact("");
    setNote("");
  }

  /* ---- render ---------------------------------------------------------- */

  const listStep = step === "allergy-list" || step === "preference-list";
  const listOptions = step === "allergy-list" ? CHAT_ALLERGENS : CHAT_PREFERENCES;
  const listSelected = step === "allergy-list" ? allergies : preferences;
  const listLabels =
    step === "allergy-list" ? ALLERGEN_LABELS : PREFERENCE_LABELS;

  return (
    <div className="font-inter bg-[#FDF7EE]">
      {/* Hero: deliberately short, so the chat is usable without scrolling. */}
      <section className="bg-gradient-to-br from-[#FDF7EE] via-[#FCF0E4] to-leaf-50">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6">
          <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-leaf-600">
                {COPY.eyebrow}
              </span>
              <h1 className="font-poppins mt-1 text-2xl font-extrabold leading-tight tracking-tight text-leaf-900 sm:text-3xl lg:whitespace-nowrap lg:text-4xl">
                {COPY.titleLead}{" "}
                <span className="text-peach-500">{COPY.titleAccent}</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm text-leaf-800 sm:text-base">
                {COPY.description}
              </p>
            </div>

            {/* Photo with the three cards over it */}
            <div className="relative h-[150px] w-full overflow-hidden rounded-2xl bg-leaf-100 shadow-md sm:h-[190px] lg:h-[240px]">
              <Image
                src={CHAT_IMAGES.care.src}
                alt={CHAT_IMAGES.care.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 24rem"
                className="object-cover"
              />
            </div>
          </div>

          <p className="mt-3 flex items-center gap-2 rounded-xl bg-leaf-50 px-3 py-2 text-xs text-leaf-700">
            <Info
              className="h-3.5 w-3.5 shrink-0 text-leaf-600"
              aria-hidden="true"
            />
            <span className="min-w-0">{COPY.medicalNote}</span>
          </p>
        </div>
      </section>

      {/* Chat + sidebar */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-12 pt-1 sm:px-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Chat panel */}
        <div className="flex min-w-0 flex-col rounded-[2rem] bg-white p-4 shadow-sm sm:p-6">
          {/* Language toggle. Switching changes the interface and every
              message from here on; what was already said stays as it was. */}
          <div className="mb-3 flex items-center justify-end gap-2">
            <span className="text-xs font-medium text-leaf-600">
              {COPY.languageLabel}
            </span>
            <div
              role="group"
              aria-label={COPY.languageLabel}
              className="flex items-center gap-0.5 rounded-full bg-leaf-50 p-0.5"
            >
              {LANGS.map((option) => {
                const active = option === lang;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setLang(option)}
                    aria-pressed={active}
                    aria-label={
                      option === "es" ? "Cambiar a español" : "Switch to English"
                    }
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase transition-colors ${FOCUS} ${
                      active
                        ? "bg-leaf-700 text-white"
                        : "text-leaf-700 hover:bg-white"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            ref={scrollRef}
            className="max-h-[32rem] min-h-[22rem] flex-1 space-y-4 overflow-y-auto pr-1"
            role="log"
            aria-live="polite"
            aria-label="Conversation"
          >
            {bubbles.map((bubble) => (
              <div key={bubble.id}>
                <div
                  className={`flex items-start gap-2 ${
                    bubble.role === "parent" ? "justify-end" : ""
                  }`}
                >
                  {bubble.role === "assistant" && (
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-base"
                    >
                      🍎
                    </span>
                  )}

                  <div
                    className={`min-w-0 max-w-[min(100%,34rem)] rounded-2xl px-4 py-3 text-sm ${
                      bubble.role === "parent"
                        ? "bg-leaf-100 text-leaf-900"
                        : "bg-[#F6FAF5] text-leaf-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words font-medium">
                      {bubble.text}
                    </p>
                    {bubble.idea && (
                      <IdeaCard
                        result={bubble.idea}
                        lang={bubble.lang ?? lang}
                      />
                    )}
                  </div>

                  {bubble.role === "parent" && (
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-700"
                    >
                      <User className="h-4 w-4" />
                    </span>
                  )}
                </div>

                {/* Rating */}
                {bubble.rateable && (
                  <div className="ml-11 mt-2 flex flex-wrap items-center gap-2">
                    {bubble.rating ? (
                      <p className="text-xs font-medium text-leaf-700">
                        {COPY.rating.thanks}
                      </p>
                    ) : (
                      <>
                        <span className="text-xs text-leaf-600">
                          {COPY.rating.prompt}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRate(bubble.id, "up")}
                          aria-label={COPY.rating.up}
                          className={`rounded-full border border-leaf-200 p-2 text-leaf-700 transition-colors hover:bg-leaf-50 ${FOCUS}`}
                        >
                          <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRate(bubble.id, "down")}
                          aria-label={COPY.rating.down}
                          className={`rounded-full border border-leaf-200 p-2 text-leaf-700 transition-colors hover:bg-leaf-50 ${FOCUS}`}
                        >
                          <ThumbsDown className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Things the chat can answer, offered after a dead end */}
                {bubble.suggestions && (
                  <div className="ml-11 mt-3">
                    <p className="text-xs text-leaf-600">
                      {COPY.fallbackSuggestions.intro}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {COPY.fallbackSuggestions.options.map((option) => (
                        <QuickReply
                          key={option.id}
                          label={option.label}
                          onClick={() =>
                            handleSuggestion(
                              option.id,
                              "query" in option ? option.query : undefined,
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Human review banner */}
                {bubble.review && (
                  <div className="ml-11 mt-3 rounded-2xl bg-peach-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 gap-3">
                        <Headphones
                          className="mt-0.5 h-5 w-5 shrink-0 text-peach-600"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="font-poppins text-sm font-bold text-leaf-900">
                            {COPY.review.title}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-leaf-700">
                            {COPY.review.body}
                          </p>
                        </div>
                      </div>

                      {!reviewSent && !reviewOpen && (
                        <button
                          type="button"
                          onClick={() => setReviewOpen(true)}
                          aria-label={COPY.review.cta}
                          className={`shrink-0 rounded-full bg-leaf-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-leaf-800 ${FOCUS}`}
                        >
                          {COPY.review.cta}
                        </button>
                      )}
                    </div>

                    {reviewSent && (
                      <p
                        role="status"
                        className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-medium text-leaf-700"
                      >
                        <span aria-hidden="true">✓</span> {COPY.review.sent}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Quick replies */}
            <div className="flex flex-wrap gap-2">
              {step === "age" &&
                AGE_GROUPS.map((group) => (
                  <QuickReply
                    key={group}
                    label={group}
                    onClick={() => {
                      setAgeGroup(group);
                      push(
                        parent(group, { lang }),
                        assistant(COPY.questions.allergy, { lang }),
                      );
                      setStep("allergy");
                    }}
                  />
                ))}

              {step === "allergy" &&
                ALLERGY_STATUSES.map((status) => (
                  <QuickReply
                    key={status}
                    label={ALLERGY_STATUS_LABELS[lang][status]}
                    onClick={() => answerAllergy(status)}
                  />
                ))}

              {listStep && (
                <div className="w-full">
                  <div className="flex flex-wrap gap-2">
                    {listOptions.map((option) => (
                      <QuickReply
                        key={option}
                        label={listLabels[lang][option] ?? option}
                        selected={listSelected.includes(option)}
                        onClick={() =>
                          step === "allergy-list"
                            ? toggle(allergies, option, setAllergies)
                            : toggle(preferences, option, setPreferences)
                        }
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      finishList(
                        step === "allergy-list" ? "allergy" : "preference",
                      )
                    }
                    aria-label={COPY.continue}
                    className={`mt-3 rounded-full bg-leaf-700 px-5 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-leaf-800 ${FOCUS}`}
                  >
                    {COPY.continue}
                  </button>
                </div>
              )}

              {step === "intent" &&
                INTENTS.map((option) => (
                  <QuickReply
                    key={option}
                    label={INTENT_LABELS[lang][option]}
                    onClick={() => answerIntent(option)}
                  />
                ))}
            </div>

            {/* Contact form */}
            {reviewOpen && (
              <form
                onSubmit={handleReviewSubmit}
                noValidate
                className="rounded-2xl border border-leaf-100 bg-leaf-50 p-4"
              >
                <label className="block text-sm">
                  <span className="font-semibold text-leaf-800">
                    {COPY.review.contactLabel}
                  </span>
                  <input
                    type="text"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder={COPY.review.contactPlaceholder}
                    className={`mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-800 outline-none ${FOCUS}`}
                  />
                </label>

                <label className="mt-3 block text-sm">
                  <span className="font-semibold text-leaf-800">
                    {COPY.review.noteLabel}
                  </span>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder={COPY.review.notePlaceholder}
                    rows={3}
                    className={`mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 text-sm text-leaf-800 outline-none ${FOCUS}`}
                  />
                </label>

                {reviewError && (
                  <p
                    role="alert"
                    className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
                  >
                    <span aria-hidden="true">⚠️</span> {reviewError}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={reviewSending}
                    aria-label={COPY.review.submit}
                    className={`rounded-full bg-leaf-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-leaf-800 disabled:opacity-60 ${FOCUS}`}
                  >
                    {reviewSending ? COPY.review.sending : COPY.review.submit}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReviewOpen(false);
                      setReviewError(null);
                    }}
                    aria-label={COPY.review.cancel}
                    className={`rounded-full border border-leaf-200 px-5 py-2.5 text-sm font-semibold text-leaf-700 transition-colors hover:bg-white ${FOCUS}`}
                  >
                    {COPY.review.cancel}
                  </button>
                </div>
              </form>
            )}
          </div>

          {saveError && (
            <p
              role="status"
              className="mt-3 rounded-xl bg-peach-50 px-3 py-2 text-xs text-peach-800"
            >
              <span aria-hidden="true">⚠️</span> {saveError}
            </p>
          )}

          {/* Composer */}
          <form
            onSubmit={handleSend}
            className="mt-4 flex items-center gap-2 rounded-full border border-leaf-100 bg-[#FDF7EE] px-3 py-2"
          >
            <label htmlFor="chat-input" className="sr-only">
              {COPY.composer.placeholder}
            </label>
            <input
              id="chat-input"
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={COPY.composer.placeholder}
              className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm text-leaf-900 outline-none"
            />
            <button
              type="submit"
              aria-label={COPY.composer.send}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-leaf-700 text-white transition-colors hover:bg-leaf-800 ${FOCUS}`}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <button
            type="button"
            onClick={handleReset}
            aria-label={COPY.reset}
            className={`mt-3 inline-flex items-center gap-2 self-start rounded-full border border-leaf-200 px-4 py-2 text-xs font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 ${FOCUS}`}
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {COPY.reset}
          </button>
        </div>

        {/* Sidebar */}
        <aside className="min-w-0 space-y-5">
          <div className="rounded-[1.75rem] bg-leaf-50 p-6 shadow-sm">
            <h2 className="font-poppins flex items-center gap-2 text-lg font-extrabold text-leaf-900">
              <Target className="h-5 w-5 text-leaf-700" aria-hidden="true" />
              {COPY.sidebar.doHere.title}
              <Spark />
            </h2>
            <ul className="mt-4 space-y-2.5">
              {COPY.sidebar.doHere.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-leaf-800">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.75rem] bg-rose-50 p-6 shadow-sm">
            <h2 className="font-poppins text-lg font-extrabold text-leaf-900">
              {COPY.sidebar.howItWorks.title}
            </h2>
            <ol className="mt-4 space-y-3">
              {COPY.sidebar.howItWorks.steps.map((item, index) => (
                <li key={item} className="flex items-start gap-3 text-sm text-leaf-800">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-poppins text-xs font-bold text-rose-600">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] bg-peach-50 shadow-sm">
            <div className="p-6">
              <h2 className="font-poppins flex items-center gap-2 text-lg font-extrabold text-leaf-900">
                <Sparkles className="h-5 w-5 text-peach-500" aria-hidden="true" />
                {COPY.sidebar.care.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-leaf-800">
                {COPY.sidebar.care.body}
              </p>
              <p className="mt-3 flex items-start gap-2 text-xs text-leaf-600">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600"
                  aria-hidden="true"
                />
                {COPY.medicalNote}
              </p>
            </div>
            <div className="relative h-40 w-full">
              <Image
                src={CHAT_IMAGES.hero.src}
                alt={CHAT_IMAGES.hero.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 22rem"
                className="object-cover"
              />
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
