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
import type { AgeGroup, AllergyStatus, Intent } from "./chatData";

export type ChatRating = "up" | "down";

export type ChatMessage = {
  role: "assistant" | "parent";
  text: string;
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

const FRIENDLY = {
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
} as const;

/* -------------------------------------------------------------------------- */
/* Contact validation                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Pure check for the contact field: an email address, or a phone number with
 * at least 8 digits. Returns an error message, or null when it is usable.
 */
export function validateContact(text: string): string | null {
  const value = (text ?? "").trim();
  if (!value) return FRIENDLY.missingContact;

  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  if (looksLikeEmail) return null;

  const digits = value.replace(/\D/g, "");
  const looksLikePhone = /^[+()\d\s.-]+$/.test(value) && digits.length >= 8;
  if (looksLikePhone) return null;

  return FRIENDLY.invalidContact;
}

/* -------------------------------------------------------------------------- */
/* Writes                                                                     */
/* -------------------------------------------------------------------------- */

/** Inserts a chat session and returns its id. */
export async function saveChatSession(
  session: ChatSessionInput,
): Promise<SaveResult<string>> {
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
    return { ok: false, error: FRIENDLY.timeout };
  }
  if (response.error || !response.data) {
    console.error("chat_sessions insert error:", response.error);
    return { ok: false, error: FRIENDLY.saveSession };
  }

  return { ok: true, data: response.data.id as string };
}

/** Records the thumbs up or down for a session. */
export async function saveRating(
  id: string,
  rating: ChatRating,
): Promise<SaveResult> {
  const response = await withTimeout(
    supabase.from("chat_sessions").update({ rating }).eq("id", id),
  );

  if (response === TIMED_OUT) {
    console.error("chat_sessions rating update timed out");
    return { ok: false, error: FRIENDLY.timeout };
  }
  if (response.error) {
    console.error("chat_sessions rating update error:", response.error);
    return { ok: false, error: FRIENDLY.saveRating };
  }

  return { ok: true, data: undefined };
}

/**
 * Stores a request for a person to get in touch. The contact is validated
 * first, so an empty or malformed one never reaches the database.
 */
export async function saveReviewRequest(
  request: ReviewRequestInput,
): Promise<SaveResult> {
  const invalid = validateContact(request.contact);
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
    return { ok: false, error: FRIENDLY.timeout };
  }
  if (response.error) {
    console.error("review_requests insert error:", response.error);
    return { ok: false, error: FRIENDLY.saveReview };
  }

  return { ok: true, data: undefined };
}
