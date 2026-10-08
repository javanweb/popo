import {
  CatalogSearchRecord,
  CatalogTextSuggestion,
  searchCatalogByRecognition,
} from './catalogSearch';
import { isReliableVisualCandidate } from './catalogVisualEvidence';
export { isReliableVisualCandidate } from './catalogVisualEvidence';

export interface FastVisualCandidate {
  code: string;
  visualDistance?: number;
  embSim?: number;
}

export interface FastCatalogSuggestion<
  T extends CatalogSearchRecord,
  C extends FastVisualCandidate,
> {
  item: T;
  candidate?: C;
  basis: 'fast_visual' | 'catalog_text';
  reason: string;
}

function normalizeCode(value: unknown): string {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Build honest local suggestions when the recognition Worker exceeds its
 * latency budget. These rows are alternatives only; they never assert an exact
 * image match. Visual neighbours fill first, followed by recognition-text
 * search over any dimensions/application/features already entered by the user.
 */
export function buildFastCatalogSuggestions<
  T extends CatalogSearchRecord,
  C extends FastVisualCandidate,
>(
  visualCandidates: C[],
  query: Record<string, unknown>,
  catalog: T[],
  richProducts: CatalogSearchRecord[] = [],
  limit = 4,
): FastCatalogSuggestion<T, C>[] {
  if (!Array.isArray(catalog) || limit <= 0) return [];

  // Do not fill a fast fallback with arbitrary nearest-neighbours. If the image
  // signal is weak, only sufficiently supported text/spec matches may be shown.
  const localVisuals = visualCandidates.filter(isReliableVisualCandidate);
  const suggestions: FastCatalogSuggestion<T, C>[] = [];
  const excludedCodes = new Set<string>();

  for (const candidate of localVisuals) {
    const item = catalog.find(entry => normalizeCode(entry.code) === normalizeCode(candidate.code));
    const code = normalizeCode(item?.code);
    if (!item || !code || excludedCodes.has(code)) continue;
    excludedCodes.add(code);
    suggestions.push({
      item,
      candidate,
      basis: 'fast_visual',
      reason: 'این گزینه از نزدیک‌ترین تصاویر محلی کاتالوگ آمده است؛ Worker آن را با قطعهٔ شما تأیید نکرده است.',
    });
    if (suggestions.length >= limit) return suggestions;
  }

  if (suggestions.length < limit) {
    const textSuggestions: CatalogTextSuggestion<T>[] = searchCatalogByRecognition(
      query,
      catalog,
      richProducts,
      excludedCodes,
      limit - suggestions.length,
    );
    for (const suggestion of textSuggestions) {
      const code = normalizeCode(suggestion.item.code);
      if (!code || excludedCodes.has(code)) continue;
      excludedCodes.add(code);
      suggestions.push({
        item: suggestion.item,
        basis: 'catalog_text',
        reason: `پیشنهاد موقت بر اساس ${suggestion.matchedFields.join('، ') || 'اطلاعات واردشده'}؛ تطبیق تصویری یا دقیق انجام نشده است.`,
      });
    }
  }

  return suggestions.slice(0, limit);
}
