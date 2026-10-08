export const GEMINI_WORKER_MODEL_ORDER = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
] as const;

export type GeminiWorkerModel = typeof GEMINI_WORKER_MODEL_ORDER[number];

/**
 * Try Gemini 3.8 Flash first, then Gemini 3.7 Flash if the Worker call fails.
 * Both attempts share one total time budget so fallback cannot double the
 * endpoint's configured deadline.
 */
export async function withGeminiWorkerModelFallback<T>(
  totalTimeoutMs: number,
  attempt: (model: GeminiWorkerModel, timeoutMs: number) => Promise<T>,
): Promise<T> {
  const budgetMs = Number.isFinite(totalTimeoutMs) && totalTimeoutMs > 0
    ? totalTimeoutMs
    : 1;
  const startedAt = Date.now();
  let lastError: unknown;

  for (let index = 0; index < GEMINI_WORKER_MODEL_ORDER.length; index += 1) {
    const remainingMs = budgetMs - (Date.now() - startedAt);
    if (remainingMs <= 0) break;
    const attemptsRemaining = GEMINI_WORKER_MODEL_ORDER.length - index;
    const attemptTimeoutMs = Math.max(1, Math.ceil(remainingMs / attemptsRemaining));

    try {
      return await attempt(GEMINI_WORKER_MODEL_ORDER[index], attemptTimeoutMs);
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError instanceof Error) throw lastError;
  if (lastError !== undefined) throw new Error(String(lastError));
  throw new Error('مهلت مشترک مدل‌های Worker برای دریافت پاسخ تمام شد.');
}
