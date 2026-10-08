import assert from 'node:assert/strict';
import {
  GEMINI_WORKER_MODEL_ORDER,
  withGeminiWorkerModelFallback,
} from '../src/server/workerModelFallback';

const attempts: Array<{ model: string; timeoutMs: number }> = [];
const fallbackResult = await withGeminiWorkerModelFallback(1000, async (model, timeoutMs) => {
  attempts.push({ model, timeoutMs });
  if (model === 'gemini-3.8-flash') throw new Error('simulated primary Worker error');
  return `ok:${model}`;
});

assert.equal(fallbackResult, 'ok:gemini-3.7-flash');
assert.deepEqual(attempts.map(attempt => attempt.model), [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
]);
assert.ok(attempts.every(attempt => attempt.timeoutMs > 0));
assert.equal(GEMINI_WORKER_MODEL_ORDER[0], 'gemini-3.8-flash');
assert.equal(GEMINI_WORKER_MODEL_ORDER[1], 'gemini-3.7-flash');

const successAttempts: string[] = [];
const primaryResult = await withGeminiWorkerModelFallback(1000, async model => {
  successAttempts.push(model);
  return `ok:${model}`;
});
assert.equal(primaryResult, 'ok:gemini-3.8-flash');
assert.deepEqual(successAttempts, ['gemini-3.8-flash'], 'Do not call the fallback after a successful primary response.');

await assert.rejects(
  withGeminiWorkerModelFallback(1000, async model => {
    throw new Error(`simulated failure: ${model}`);
  }),
  /simulated failure: gemini-3\.7-flash/,
  'If both models fail, surface the fallback model error.',
);

console.log('Worker model fallback test passed: gemini-3.8-flash → gemini-3.7-flash');
