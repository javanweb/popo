export interface VisualEvidenceCandidate {
  visualDistance?: number;
  embSim?: number;
}

// These gates separate a plausible local alternative from evidence strong
// enough to call an image an exact catalog match.
export const MAX_RELIABLE_VISUAL_DISTANCE = 0.22;
export const MIN_RELIABLE_EMBEDDING_SIMILARITY = 0.9;
export const MAX_EXACT_VISUAL_DISTANCE = 0.07;
export const MIN_EXACT_EMBEDDING_SIMILARITY = 0.97;

export function isReliableVisualCandidate(candidate: VisualEvidenceCandidate): boolean {
  return (typeof candidate.visualDistance === 'number' && candidate.visualDistance <= MAX_RELIABLE_VISUAL_DISTANCE) ||
    (typeof candidate.embSim === 'number' && candidate.embSim >= MIN_RELIABLE_EMBEDDING_SIMILARITY);
}

export function hasExactVisualEvidence(candidate?: VisualEvidenceCandidate | null): boolean {
  return Boolean(candidate && (
    (typeof candidate.visualDistance === 'number' && candidate.visualDistance <= MAX_EXACT_VISUAL_DISTANCE) ||
    (typeof candidate.embSim === 'number' && candidate.embSim >= MIN_EXACT_EMBEDDING_SIMILARITY)
  ));
}
