/**
 * A blocked or stalled request never rejects on its own, so every Supabase
 * call on the marketing page races this cap.
 */
export const REQUEST_TIMEOUT_MS = 8000;

export const TIMED_OUT = Symbol("timed-out");

export async function withTimeout<T>(
  work: PromiseLike<T>,
  budgetMs: number = REQUEST_TIMEOUT_MS,
): Promise<T | typeof TIMED_OUT> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const expiry = new Promise<typeof TIMED_OUT>((resolve) => {
    timer = setTimeout(() => resolve(TIMED_OUT), Math.max(budgetMs, 1000));
  });

  try {
    return await Promise.race([work, expiry]);
  } finally {
    clearTimeout(timer);
  }
}
