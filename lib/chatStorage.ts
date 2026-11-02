/**
 * Supabase access for the chat assistant.
 *
 * Every call goes through withTimeout, so a stalled request surfaces as a
 * friendly message instead of a spinner that never ends. Nothing here throws:
 * callers get a result object they can render directly.
 *
 * chat_sessions holds no names or contact details. The only personal data in
 * the whole feature is the optional contact in review_requests, which the
 * parent types in on purpose.
 */

import { supabase } from "./supabase";
import { TIMED_OUT, withTimeout } from "./requestTimeout";
import type { AgeGroup, AllergyStatus, Intent, Lang } from "./chatData";

export type ChatRating = "up" | "down";

export type ChatMessage = {
  role: "assistant" | "parent";
  text: string;
  /**
   * The language this message was written in. Kept inside the messages jsonb
   * so the schema does not need a column for it.
   */
  lang?: Lang;
  /** Ingredient ids the parent asked to leave out, when relevant. */
  excluded?: string[];
};

export type ChatSessionInput = {
  ageGroup: AgeGroup | null;
  allergyStatus: AllergyStatus | null;
  allergies: string[];
  preferences: string[];
  intent: Intent | null;
  messages: ChatMessage[];
  flaggedForReview: boolean;
  reviewReason: string | null;
  /** Set by the automated tests so their rows can be cleaned up. */
  isTest?: boolean;
};

export type ReviewRequestInput = {
  sessionId: string | null;
  contact: string;
  note?: string;
  isTest?: boolean;
};

export type SaveResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

type FriendlyMessages = {
  timeout: string;
  saveSession: string;
  saveRating: string;
  saveReview: string;
  missingContact: string;
  invalidContact: string;
};

const FRIENDLY_BY_LANG: Record<Lang, FriendlyMessages> = {
  en: {
    timeout:
      "That is taking longer than usual. Nothing is broken, please try again in a moment.",
    saveSession:
      "We could not save this conversation right now. You can keep chatting, and try again in a moment.",
    saveRating: "We could not record your rating right now. Please try again.",
    saveReview:
      "We could not send your request right now. Nothing was lost, please try again in a moment.",
    missingContact:
      "Please add an email or a phone number so the team can reach you.",
    invalidContact:
      "That does not look like an email address or a phone number. Please check it.",
  },
  es: {
    timeout:
      "Esto está tardando más de lo normal. No se descompuso nada, inténtalo de nuevo en un momento.",
    saveSession:
      "No pudimos guardar esta conversación en este momento. Puedes seguir chateando e intentarlo otra vez en un momento.",
    saveRating:
      "No pudimos registrar tu calificación en este momento. Inténtalo de nuevo.",
    saveReview:
      "No pudimos enviar tu solicitud en este momento. No se perdió nada, inténtalo otra vez en un momento.",
    missingContact:
      "Déjanos un correo o un teléfono para que el equipo pueda contactarte.",
    invalidContact:
      "Eso no parece un correo ni un teléfono. ¿Lo revisas por favor?",
  },
};

/** English stays the default so existing callers keep working. */
const FRIENDLY = FRIENDLY_BY_LANG.en;

/* -------------------------------------------------------------------------- */
/* Contact validation                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Pure check for the contact field: an email address, or a phone number with
 * at least 8 digits. Returns an error message, or null when it is usable.
 */
export function validateContact(
  text: string,
  lang: Lang = "en",
): string | null {
  const messages = FRIENDLY_BY_LANG[lang];
  const value = (text ?? "").trim();
  if (!value) return messages.missingContact;

  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  if (looksLikeEmail) return null;

  const digits = value.replace(/\D/g, "");
  const looksLikePhone = /^[+()\d\s.-]+$/.test(value) && digits.length >= 8;
  if (looksLikePhone) return null;

  return messages.invalidContact;
}

/* -------------------------------------------------------------------------- */
/* Writes                                                                     */
/* -------------------------------------------------------------------------- */

/** Inserts a chat session and returns its id. */
export async function saveChatSession(
  session: ChatSessionInput,
  lang: Lang = "en",
): Promise<SaveResult<string>> {
  const messages = FRIENDLY_BY_LANG[lang];
  const response = await withTimeout(
    supabase
      .from("chat_sessions")
      .insert({
        age_group: session.ageGroup,
        allergy_status: session.allergyStatus,
        allergies: session.allergies,
        preferences: session.preferences,
        intent: session.intent,
        messages: session.messages,
        flagged_for_review: session.flaggedForReview,
        review_reason: session.reviewReason,
        is_test: session.isTest ?? false,
      })
      .select("id")
      .single(),
  );

  if (response === TIMED_OUT) {
    console.error("chat_sessions insert timed out");
    return { ok: false, error: messages.timeout };
  }
  if (response.error || !response.data) {
    console.error("chat_sessions insert error:", response.error);
    return { ok: false, error: messages.saveSession };
  }

  return { ok: true, data: response.data.id as string };
}

/** Records the thumbs up or down for a session. */
export async function saveRating(
  id: string,
  rating: ChatRating,
  lang: Lang = "en",
): Promise<SaveResult> {
  const messages = FRIENDLY_BY_LANG[lang];
  const response = await withTimeout(
    supabase.from("chat_sessions").update({ rating }).eq("id", id),
  );

  if (response === TIMED_OUT) {
    console.error("chat_sessions rating update timed out");
    return { ok: false, error: messages.timeout };
  }
  if (response.error) {
    console.error("chat_sessions rating update error:", response.error);
    return { ok: false, error: messages.saveRating };
  }

  return { ok: true, data: undefined };
}

export type ChatSessionPatch = {
  messages?: ChatMessage[];
  flaggedForReview?: boolean;
  reviewReason?: string | null;
};

/** Updates an existing session as the conversation grows or gets flagged. */
export async function updateChatSession(
  id: string,
  patch: ChatSessionPatch,
  lang: Lang = "en",
): Promise<SaveResult> {
  const messages = FRIENDLY_BY_LANG[lang];
  const row: Record<string, unknown> = {};
  if (patch.messages !== undefined) row.messages = patch.messages;
  if (patch.flaggedForReview !== undefined) {
    row.flagged_for_review = patch.flaggedForReview;
  }
  if (patch.reviewReason !== undefined) row.review_reason = patch.reviewReason;

  if (Object.keys(row).length === 0) return { ok: true, data: undefined };

  const response = await withTimeout(
    supabase.from("chat_sessions").update(row).eq("id", id),
  );

  if (response === TIMED_OUT) {
    console.error("chat_sessions update timed out");
    return { ok: false, error: messages.timeout };
  }
  if (response.error) {
    console.error("chat_sessions update error:", response.error);
    return { ok: false, error: messages.saveSession };
  }

  return { ok: true, data: undefined };
}

/**
 * Stores a request for a person to get in touch. The contact is validated
 * first, so an empty or malformed one never reaches the database.
 */
export async function saveReviewRequest(
  request: ReviewRequestInput,
  lang: Lang = "en",
): Promise<SaveResult> {
  const messages = FRIENDLY_BY_LANG[lang];
  const invalid = validateContact(request.contact, lang);
  if (invalid) return { ok: false, error: invalid };

  const response = await withTimeout(
    supabase.from("review_requests").insert({
      session_id: request.sessionId,
      contact: request.contact.trim(),
      note: request.note?.trim() || null,
      is_test: request.isTest ?? false,
    }),
  );

  if (response === TIMED_OUT) {
    console.error("review_requests insert timed out");
    return { ok: false, error: messages.timeout };
  }
  if (response.error) {
    console.error("review_requests insert error:", response.error);
    return { ok: false, error: messages.saveReview };
  }

  return { ok: true, data: undefined };
}
