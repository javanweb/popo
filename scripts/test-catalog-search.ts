import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { USER_PRODUCTS } from '../src/data/userProducts';
import { searchCatalogByRecognition } from '../src/server/catalogSearch';
import { buildFastCatalogSuggestions } from '../src/server/fastCatalogFallback';
import { hasExactVisualEvidence, isReliableVisualCandidate } from '../src/server/catalogVisualEvidence';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(scriptDir, '../src/data/catalogSummary.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const analyzedProducts = JSON.parse(
  fs.readFileSync(path.resolve(scriptDir, '../src/data/analyzedProducts.json'), 'utf8')
);

assert.ok(isReliableVisualCandidate({ visualDistance: 0.22 }), 'The documented visual-candidate threshold should be inclusive.');
assert.equal(isReliableVisualCandidate({ visualDistance: 0.221 }), false, 'Weak hash neighbours must be excluded.');
assert.ok(isReliableVisualCandidate({ embSim: 0.9 }), 'The documented embedding-candidate threshold should be inclusive.');
assert.equal(isReliableVisualCandidate({ embSim: 0.899 }), false, 'Weak embedding neighbours must be excluded.');
assert.ok(hasExactVisualEvidence({ visualDistance: 0.07 }), 'Only the exact-image distance boundary should qualify as exact.');
assert.equal(hasExactVisualEvidence({ visualDistance: 0.071, embSim: 0.9 }), false,
  'A plausible but non-exact alternative must not be upgraded by the Worker exact label.');
assert.ok(hasExactVisualEvidence({ embSim: 0.97 }), 'Only the strict embedding threshold should qualify as exact.');
assert.equal(hasExactVisualEvidence({ embSim: 0.969 }), false, 'Embedding similarity below the strict threshold is not exact.');

// Mirrors the visible part description in the user's report: the model may call
// it a PU bushing/ring while the catalog names related parts as coated wheels.
const recognizedPart = {
  product_name: 'بوش یا ضربه گیر الاستومری نارنجی رنگ با مقطع حلقوی و شیار در بدنه خارجی',
  what_you_see: 'قطعه نارنجی حلقوی شبیه بوش صنعتی',
  detected_part_type: 'بوش الاستومری',
  type: 'مقطع حلقوی',
  material: 'پلی یورتان (PU)',
  visual_analysis: 'یک قطعه الاستومری حلقه‌ای به رنگ نارنجی؛ احتمالاً پلی یورتان',
  search_keywords: ['بوش', 'حلقه', 'الاستومر', 'PU', 'نارنجی'],
};

const matches = searchCatalogByRecognition(
  recognizedPart,
  catalog,
  [...USER_PRODUCTS, ...analyzedProducts],
  new Set(),
  4,
);
const codes = matches.map(match => match.item.code);

assert.ok(matches.length > 0, 'Expected relevant catalog alternatives for the recognized PU ring/bushing.');
assert.ok(codes.includes('AT-E012') || codes.includes('AT-E013'), `Expected a coupling-pin/elastomer-bushing option; got ${codes.join(', ')}`);
assert.ok(codes.includes('AT-E001') || codes.includes('AT-E002'), `Expected a bushing/coupling option; got ${codes.join(', ')}`);
assert.ok(matches.every(match => match.score > 0), 'Every suggestion should have positive catalog evidence.');
const storefrontCodes = new Set(USER_PRODUCTS.map(product => product.code));
assert.ok(matches.every(match => storefrontCodes.has(match.item.code)), 'Every suggestion must resolve to a storefront product page.');
assert.ok(new Set(matches.map(match => match.item.forzaCode)).size === matches.length, 'Duplicate Forza codes should be suppressed.');

const fastFallback = buildFastCatalogSuggestions(
  [
    { code: 'AT-E001', visualDistance: 0.81 },
    { code: 'AT-E012', visualDistance: 0.04 },
    { code: 'AT-E013', visualDistance: 0.06 },
  ],
  recognizedPart,
  catalog,
  [...USER_PRODUCTS, ...analyzedProducts],
  4,
);
assert.ok(fastFallback.length > 0, 'A delayed Worker should still return local catalog alternatives.');
assert.deepEqual(
  fastFallback.slice(0, 2).map(row => row.item.code),
  ['AT-E012', 'AT-E013'],
  'Close visual neighbours should lead the fast fallback results.',
);
assert.ok(fastFallback.every(row => row.basis !== 'fast_visual' || row.reason.includes('تأیید نکرده')),
  'Visual fallback candidates must remain explicitly unverified.');
assert.ok(fastFallback.every(row => storefrontCodes.has(row.item.code)),
  'Fast fallback suggestions must resolve to storefront products.');
assert.equal(new Set(fastFallback.map(row => row.item.code)).size, fastFallback.length,
  'Fast fallback must not return duplicate product codes.');

const weakVisualFallback = buildFastCatalogSuggestions(
  [
    { code: 'AT-E001', visualDistance: 0.81 },
    { code: 'AT-E013', visualDistance: 0.76 },
    { code: 'AT-E002', visualDistance: 0.72 },
  ],
  recognizedPart,
  catalog,
  [...USER_PRODUCTS, ...analyzedProducts],
  4,
);
assert.equal(weakVisualFallback.filter(row => row.basis === 'fast_visual').length, 0,
  'Weak local image candidates must not be shown as similar products.');
assert.ok(weakVisualFallback.every(row => row.basis === 'catalog_text'),
  'When visual evidence is weak, only strongly supported text/spec alternatives may be returned.');

const textOnlyFastFallback = buildFastCatalogSuggestions(
  [],
  recognizedPart,
  catalog,
  [...USER_PRODUCTS, ...analyzedProducts],
  4,
);
assert.ok(textOnlyFastFallback.length > 0 && textOnlyFastFallback.every(row => row.basis === 'catalog_text'),
  'When the local image index has no candidates, the fast fallback should use unverified text/spec alternatives.');

const wheelMatches = searchCatalogByRecognition({
  product_name: 'چرخ هدایت کاشی با روکش پلی یورتان نارنجی',
  category: 'کاشی و سرامیک',
  type: 'چرخ',
  material: 'PU',
}, catalog, [...USER_PRODUCTS, ...analyzedProducts], new Set(), 4);
assert.ok(
  wheelMatches.some(match => `${match.item.name} ${match.item.subcategory}`.includes('چرخ')),
  `Expected a polyurethane guide-wheel option; got ${wheelMatches.map(match => match.item.code).join(', ')}`,
);

const unrelatedValveLeverQuery = {
  product_name: 'اهرم شیر توپی آبی برای باز و بسته کردن جریان',
  what_you_see: 'یک دسته اهرمی آبی متصل به شیر توپی',
  detected_part_type: 'اهرم شیر توپی / ball-valve lever handle',
  type: 'اهرم شیر',
  category: 'شیرآلات و قطعات کنترل جریان',
  material: 'فلز رنگ‌شده',
  search_keywords: ['ball valve', 'lever handle', 'اهرم شیر', 'آبی'],
};
const unrelatedValveLeverMatches = searchCatalogByRecognition(
  unrelatedValveLeverQuery,
  catalog,
  [...USER_PRODUCTS, ...analyzedProducts],
  new Set(),
  4,
);
assert.equal(unrelatedValveLeverMatches.length, 0,
  `A ball-valve lever must not be matched to unrelated rollers, pulleys, or color-only catalog rows; got ${unrelatedValveLeverMatches.map(match => match.item.code).join(', ')}`);
const unrelatedFastFallback = buildFastCatalogSuggestions(
  [{ code: 'AT-E492', visualDistance: 0.76 }],
  unrelatedValveLeverQuery,
  catalog,
  [...USER_PRODUCTS, ...analyzedProducts],
  4,
);
assert.equal(unrelatedFastFallback.length, 0,
  'A weak bearing image neighbour and unrelated valve-lever text must yield no fast fallback matches.');

console.log('Catalog search test passed:', matches.map(match => `${match.item.code} (${match.matchedFields.join(', ')})`).join(' | '));
