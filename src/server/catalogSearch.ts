export interface CatalogSearchRecord {
  code: string;
  forzaCode?: string;
  name?: string;
  nameEn?: string;
  brand?: string;
  categorySlug?: string;
  categoryName?: string;
  subcategory?: string;
  description?: string;
  tags?: string[];
  specs?: Array<{ key?: string; value?: string }>;
  technicalSpecs?: Array<{ key?: string; value?: string }>;
}

export interface CatalogTextSuggestion<T extends CatalogSearchRecord = CatalogSearchRecord> {
  item: T;
  score: number;
  matchedFields: string[];
}

const STOP_WORDS = new Set([
  'یک', 'این', 'آن', 'و', 'یا', 'با', 'برای', 'از', 'به', 'در', 'که', 'است', 'هست',
  'دارای', 'میباشد', 'میباشد', 'شود', 'میشود', 'روی', 'درون', 'بیرونی', 'داخلی',
  'قطعه', 'قطعات', 'صنعتی', 'محصول', 'مدل', 'نوع', 'جنس', 'مقطع', 'بدنه', 'سطح',
  'خارجی', 'ساده', 'مشابه', 'مناسب', 'تصویر', 'عکس', 'احتمالا', 'احتمالاً',
  'red', 'orange', 'amber', 'blue', 'black', 'white', 'green', 'قرمز', 'نارنجی', 'عسلی', 'آبی', 'مشکی', 'سفید', 'سبز',
  'star', 'shaped', 'shape', 'star-shaped', 'رنگ', 'رنگی', 'ظاهر', 'شکل',
  'باز', 'بسته', 'کردن', 'جریان', 'بازوبسته', 'open', 'close', 'flow',
  'ball', 'valve', 'valves', 'lever', 'handle', 'اهرم', 'بازو',
]);

function flattenValue(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(flattenValue).filter(Boolean).join(' ');
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([key, entry]) => `${key} ${flattenValue(entry)}`)
      .join(' ');
  }
  return '';
}

function normalizeText(value: unknown): string {
  return flattenValue(value)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[ۀة]/g, 'ه')
    .replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[^a-z0-9\u0600-\u06ff]+/gi, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function normalizeCode(value: unknown): string {
  return normalizeText(value).replace(/[^a-z0-9]/g, '');
}

function containsAny(text: string, terms: string[]): boolean {
  return terms.some(term => {
    const normalized = normalizeText(term);
    if (!normalized) return false;
    // English terms need token boundaries (notably "PU" must not match "pulley").
    if (/^[a-z0-9 ]+$/.test(normalized)) return ` ${text} `.includes(` ${normalized} `);
    return text.includes(normalized);
  });
}

function firstNormalized(...values: unknown[]): string {
  for (const value of values) {
    const normalized = normalizeText(value);
    if (normalized) return normalized;
  }
  return '';
}

function getSpecText(item: CatalogSearchRecord): string {
  return normalizeText([item.specs, item.technicalSpecs]);
}

function getTagText(item: CatalogSearchRecord): string {
  return normalizeText(item.tags);
}

function itemSearchFields(item: CatalogSearchRecord, detail?: CatalogSearchRecord) {
  const name = normalizeText([item.name, item.nameEn, detail?.name, detail?.nameEn]);
  const taxonomy = normalizeText([
    item.categorySlug, item.categoryName, item.subcategory,
    detail?.categorySlug, detail?.categoryName, detail?.subcategory,
  ]);
  const specs = getSpecText(item) + ' ' + getSpecText(detail || {} as CatalogSearchRecord);
  const tags = getTagText(item) + ' ' + getTagText(detail || {} as CatalogSearchRecord);
  const description = normalizeText([item.description, detail?.description]);
  const brand = normalizeText([item.brand, detail?.brand]);
  const codes = normalizeText([item.code, item.forzaCode, detail?.code, detail?.forzaCode]);
  return {
    name,
    taxonomy,
    specs,
    tags,
    description,
    brand,
    codes,
    all: normalizeText([name, taxonomy, specs, tags, description, brand, codes]),
  };
}

function recognizedQuery(parsed: Record<string, unknown>) {
  const name = firstNormalized(
    parsed.productName,
    parsed.product_name,
    parsed.name,
    parsed.productTitle,
    parsed.product_title,
  );
  const brand = firstNormalized(parsed.brand, parsed.manufacturer);
  const model = firstNormalized(parsed.model, parsed.suggestedForzaCode, parsed.forzaCode, parsed.modelCode, parsed.model_code);
  const category = firstNormalized(parsed.category, parsed.partFamilyFarsi, parsed.part_family_farsi);
  const type = firstNormalized(parsed.type, parsed.detectedProfile, parsed.detectedPartType, parsed.detected_part_type);
  const material = firstNormalized(parsed.material, parsed.materialType, parsed.material_type);
  const size = firstNormalized(
    parsed.size,
    parsed.standard,
    parsed.dimensions,
    [parsed.length, parsed.width, parsed.pitch].filter(Boolean).join(' '),
  );
  const identityText = normalizeText([
    parsed.productName, parsed.product_name, parsed.name, parsed.productTitle, parsed.product_title,
    parsed.whatYouSee, parsed.what_you_see,
    parsed.detectedPartType, parsed.detected_part_type, parsed.partFamilyFarsi, parsed.part_family_farsi,
    parsed.detectedProfile, parsed.detected_profile, parsed.type, parsed.category,
    parsed.brand, parsed.manufacturer, parsed.model, parsed.modelCode, parsed.model_code,
    parsed.material, parsed.materialType, parsed.material_type, parsed.size, parsed.standard, parsed.dimensions,
    parsed.length, parsed.width, parsed.pitch, parsed.searchKeywords, parsed.search_keywords,
    parsed.technicalSpecs, parsed.technical_specs, parsed.visualAnalysis, parsed.visual_analysis,
  ]);
  const entire = normalizeText([
    identityText,
    parsed.application, parsed.useCase, parsed.use_case, parsed.features,
  ]);
  // Do not let generic usage advice, scene text, or colors act like product
  // identity. Those may help only as weak context, never as a product anchor.
  const tokens = [...new Set(identityText.split(/\s+/).filter(token => token.length >= 2 && !STOP_WORDS.has(token)))];
  const contextTokens = [...new Set(normalizeText([parsed.application, parsed.useCase, parsed.use_case, parsed.features])
    .split(/\s+/).filter(token => token.length >= 3 && !STOP_WORDS.has(token)))];
  const hasPolyurethane = containsAny(identityText, [
    'pu', 'polyurethane', 'poly urethane', 'پلی یورتان', 'پلی اورتان', 'الاستومر', 'الاستومری',
  ]);
  const hasBushing = containsAny(identityText, [
    'bushing', 'bush', 'بوش', 'بوشینگ', 'کوپلینگ', 'coupling', 'ضربه گیر', 'ضربه گیر لاستیکی',
  ]);
  const hasRoundForm = containsAny(identityText, [
    'ring', 'annular', 'حلقه', 'حلقوی', 'رینگ', 'غلاف', 'استوانه', 'استوانه ای', 'حفره', 'سوراخ مرکزی',
  ]);
  const hasValveControl = containsAny(identityText, [
    'handwheel', 'valve handle', 'valve wheel', 'control knob', 'knob', 'valve control',
    'دسته شیر', 'دسته فلکه', 'دستگیره شیر', 'فلکه', 'شیر فلکه', 'چرخ شیر', 'فرمان شیر', 'ولوم شیر',
  ]);
  const hasWheel = !hasValveControl && containsAny(identityText, [
    'wheel', 'roller', 'roller wheel', 'چرخ', 'هرزگرد', 'غلتک', 'رولیک', 'رولر', 'هدایت',
  ]);
  const hasCeramicUse = containsAny(identityText, ['ceramic', 'tile', 'کاشی', 'سرامیک', 'لعاب']);
  const hasWarmColor = containsAny(identityText, ['orange', 'amber', 'red', 'نارنجی', 'قرمز', 'عسلی']);

  return { name, brand, model, category, type, material, size, entire, tokens, contextTokens, hasPolyurethane, hasBushing, hasRoundForm, hasWheel, hasValveControl, hasCeramicUse, hasWarmColor };
}

/**
 * Search the server-side catalog by the recognized code, brand/model, name,
 * type/category, material/specification, and size. Semantic hints only create
 * *suggestions*; they never turn a catalog candidate into a confirmed match.
 */
export function searchCatalogByRecognition<T extends CatalogSearchRecord>(
  parsed: Record<string, unknown>,
  catalog: T[],
  richProducts: CatalogSearchRecord[] = [],
  excludeCodes: Set<string> = new Set(),
  limit = 4,
): CatalogTextSuggestion<T>[] {
  if (!Array.isArray(catalog) || catalog.length === 0 || !parsed || typeof parsed !== 'object') return [];
  const query = recognizedQuery(parsed);
  if (!query.entire) return [];

  const detailsByCode = new Map<string, CatalogSearchRecord>();
  for (const product of richProducts) {
    const key = normalizeCode(product.code);
    if (key) detailsByCode.set(key, product);
  }

  const ranked: CatalogTextSuggestion<T>[] = [];
  for (const item of catalog) {
    if (excludeCodes.has(normalizeCode(item.code))) continue;
    const detail = detailsByCode.get(normalizeCode(item.code));
    const fields = itemSearchFields(item, detail);
    let score = 0;
    let nameTokenMatches = 0;
    let taxonomyTokenMatches = 0;
    let specTokenMatches = 0;
    const matchedFields = new Set<string>();

    // Required priority: exact code is resolved by the caller; then brand/model,
    // product name, category/type, technical specs, and dimensions.
    const brandMatch = Boolean(query.brand && fields.brand.includes(query.brand));
    const modelMatch = Boolean(query.model && query.model.length >= 3 && fields.codes.includes(query.model));
    if (brandMatch && modelMatch) {
      score += 10000;
      matchedFields.add('برند و مدل');
    } else if (brandMatch) {
      score += 500;
      matchedFields.add('برند');
    }
    if (modelMatch) {
      score += 2500;
      matchedFields.add('مدل');
    }

    const exactNameMatch = Boolean(query.name && fields.name === query.name);
    const partialNameMatch = Boolean(query.name && (fields.name.includes(query.name) || query.name.includes(fields.name)));
    const categoryMatch = Boolean(query.category && fields.taxonomy.includes(query.category));
    const typeMatch = Boolean(query.type && (fields.taxonomy.includes(query.type) || fields.name.includes(query.type)));
    const sizeMatch = Boolean(query.size && fields.specs.includes(query.size));
    if (exactNameMatch) {
      score += 5000;
      matchedFields.add('نام کالا');
    } else if (partialNameMatch) {
      score += 2200;
      matchedFields.add('نام کالا');
    }

    if (categoryMatch) {
      score += 1200;
      matchedFields.add('دسته‌بندی');
    }
    if (typeMatch) {
      score += 1000;
      matchedFields.add('نوع قطعه');
    }
    if (query.material && fields.all.includes(query.material)) {
      score += 400;
      matchedFields.add('جنس');
    }
    if (sizeMatch) {
      score += 700;
      matchedFields.add('ابعاد/استاندارد');
    }

    for (const token of query.tokens) {
      if (fields.name.includes(token)) {
        score += 65;
        nameTokenMatches += 1;
        matchedFields.add('نام/مدل');
      } else if (fields.taxonomy.includes(token)) {
        score += 45;
        taxonomyTokenMatches += 1;
        matchedFields.add('نوع/دسته');
      } else if (fields.specs.includes(token)) {
        score += 35;
        specTokenMatches += 1;
        matchedFields.add('مشخصات فنی');
      } else if (fields.tags.includes(token) || fields.description.includes(token)) {
        score += 20;
        matchedFields.add('توضیحات/کلیدواژه‌ها');
      }
    }
    for (const token of query.contextTokens) {
      if (fields.specs.includes(token) || fields.tags.includes(token) || fields.description.includes(token)) {
        score += 8;
        matchedFields.add('کاربرد/ویژگی واردشده');
      }
    }

    // Controlled family-level fallback for visually described parts whose
    // model uses a different name (e.g. calls a PU ring a bushing, while the
    // catalog indexes it as a coated guide wheel). These remain suggestions.
    const isPolyurethaneItem = containsAny(fields.all, [
      'pu', 'polyurethane', 'poly urethane', 'پلی یورتان', 'پلی اورتان', 'الاستومر', 'الاستومری',
    ]);
    const isBushingItem = containsAny(normalizeText([fields.name, fields.taxonomy, fields.description, fields.tags]), [
      'bushing', 'bush', 'بوش', 'کوپلینگ', 'coupling', 'غلاف',
    ]);
    const isWheelItem = containsAny(normalizeText([fields.name, fields.taxonomy, fields.description, fields.tags]), [
      'wheel', 'roller', 'چرخ', 'غلتک', 'رولیک', 'هرزگرد', 'رولر',
    ]);
    const isCeramicItem = containsAny(normalizeText([fields.taxonomy, fields.description, fields.tags]), [
      'ceramic', 'tile', 'کاشی', 'سرامیک', 'لعاب',
    ]) || item.categorySlug === 'ceramic-tiles';
    const isWarmColorItem = containsAny(normalizeText([fields.name, fields.description, fields.specs, fields.tags]), [
      'orange', 'amber', 'red', 'نارنجی', 'قرمز', 'عسلی',
    ]);

    if (query.hasPolyurethane && isPolyurethaneItem) {
      score += 35;
      matchedFields.add('جنس پلی‌یورتان');
    }
    if (query.hasBushing && isBushingItem) {
      score += 90;
      matchedFields.add('خانواده بوش/کوپلینگ');
    }
    if (query.hasWheel && isWheelItem) {
      score += 90;
      matchedFields.add('خانواده چرخ/رولر');
    }
    if (query.hasRoundForm && (isBushingItem || isWheelItem)) {
      score += 45;
      matchedFields.add('فرم حلقوی/غلتکی');
    }
    if (query.hasPolyurethane && query.hasBushing && isWheelItem && isPolyurethaneItem) {
      score += 110;
      matchedFields.add('گزینه جایگزین PU');
    }
    if (query.hasCeramicUse && isCeramicItem) {
      score += 70;
      matchedFields.add('کاربرد کاشی/سرامیک');
    }
    if (query.hasWarmColor && isWarmColorItem) {
      score += 12;
      matchedFields.add('رنگ ظاهری');
    }

    const semanticEvidenceCount = [
      query.hasPolyurethane && isPolyurethaneItem,
      query.hasBushing && isBushingItem,
      query.hasWheel && isWheelItem,
      query.hasRoundForm && (isBushingItem || isWheelItem),
      query.hasCeramicUse && isCeramicItem,
    ].filter(Boolean).length;
    const identityTokenMatches = nameTokenMatches + taxonomyTokenMatches;
    const hasStrongTextEvidence = Boolean(
      modelMatch || exactNameMatch || partialNameMatch ||
      (brandMatch && (modelMatch || identityTokenMatches >= 1)) ||
      (categoryMatch && (typeMatch || identityTokenMatches >= 1)) ||
      (sizeMatch && (identityTokenMatches >= 1 || modelMatch)) ||
      (identityTokenMatches >= 2 && score >= 120) ||
      (specTokenMatches >= 2 && identityTokenMatches >= 1)
    );
    const hasStrongSemanticEvidence = semanticEvidenceCount >= 2 && score >= 130;

    // Never emit a product based only on color, one generic word (for example
    // "wheel"), or a single broad material/category hint. If the recognized
    // type is absent from the catalog, return no match rather than an unrelated item.
    if (hasStrongTextEvidence || hasStrongSemanticEvidence) {
      ranked.push({ item, score, matchedFields: [...matchedFields] });
    }
  }

  ranked.sort((a, b) => b.score - a.score || a.item.code.localeCompare(b.item.code));

  // Suppress duplicate catalog rows that share a single Forza part number.
  const seenCodes = new Set<string>();
  const seenModels = new Set<string>();
  const suggestions: CatalogTextSuggestion<T>[] = [];
  for (const suggestion of ranked) {
    const codeKey = normalizeCode(suggestion.item.code);
    const modelKey = normalizeCode(suggestion.item.forzaCode || '');
    if (codeKey && seenCodes.has(codeKey)) continue;
    if (modelKey && seenModels.has(modelKey)) continue;
    if (codeKey) seenCodes.add(codeKey);
    if (modelKey) seenModels.add(modelKey);
    suggestions.push(suggestion);
    if (suggestions.length >= Math.max(1, limit)) break;
  }

  return suggestions;
}
