import type { AspectWeights, Effort } from './types';
import { ASPECT_IDS, zeroWeights } from './types';
import { BEHAVIOR_CATALOG, type CatalogEntry } from './behaviorCatalog';

/**
 * Natural-language behavior → aspect mapping (blueprint §5.1B, §18.1).
 * Keyword scoring against the native catalog; always returns a best guess
 * plus alternatives so the user stays the authority on meaning (§37.11).
 */

export interface Classification {
  /** Best-matching catalog entry, if any. */
  entry: CatalogEntry | null;
  title: string;
  weights: AspectWeights;
  /** 0..1 — below ~0.3 the UI should ask the user to confirm the mapping (§18.1). */
  confidence: number;
  alternatives: CatalogEntry[];
  matchedKeywords: string[];
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
}

export function classifyBehavior(text: string): Classification {
  const norm = normalize(text);
  const scored = BEHAVIOR_CATALOG.map((entry) => {
    let score = 0;
    const matched: string[] = [];
    for (const kw of entry.keywords) {
      if (norm.includes(kw)) {
        // Longer keyword matches are stronger evidence.
        score += kw.includes(' ') ? 2 : 1;
        matched.push(kw);
      }
    }
    return { entry, score, matched };
  }).filter((s) => s.score > 0);

  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return {
      entry: null,
      title: text.trim(),
      weights: zeroWeights(),
      confidence: 0,
      alternatives: [],
      matchedKeywords: [],
    };
  }

  const best = scored[0];
  const runnerUp = scored[1];
  // Confidence: match strength vs. the next candidate, softened.
  const margin = runnerUp ? (best.score - runnerUp.score) / best.score : 1;
  const confidence = Math.min(0.95, 0.4 + 0.2 * (best.score - 1) + 0.25 * margin);

  // Blend top matches' weights so a sentence like "cooked dinner and called
  // my sister" nourishes several dimensions (§1.2).
  const blended = zeroWeights();
  const total = scored.slice(0, 2).reduce((sum, s) => sum + s.score, 0);
  for (const s of scored.slice(0, 2)) {
    const share = s.score / total;
    for (const aspect of ASPECT_IDS) {
      blended[aspect] = Math.min(1, blended[aspect] + s.entry.weights[aspect] * share);
    }
  }

  return {
    entry: best.entry,
    title: text.trim(),
    weights: blended,
    confidence,
    alternatives: scored.slice(1, 4).map((s) => s.entry),
    matchedKeywords: best.matched,
  };
}

/**
 * Effort from time spent — the only effort signal the UI asks for (§6.2).
 * The user says *what* they did and *about how long*; the engine handles
 * everything else. Sub-linear bands: bigger time helps more, but not linearly.
 */
export function effortFromMinutes(minutes?: number): Effort {
  if (minutes == null || Number.isNaN(minutes) || minutes <= 0) return 'light';
  if (minutes < 5) return 'tiny';
  if (minutes < 15) return 'light';
  if (minutes < 40) return 'moderate';
  return 'substantial';
}

/** Prefill a sensible duration for catalog quick picks (inverse of the bands). */
export function minutesForEffort(effort: Effort): number {
  switch (effort) {
    case 'tiny':
      return 3;
    case 'light':
      return 10;
    case 'moderate':
      return 25;
    case 'substantial':
      return 60;
  }
}

/** Pull "20 min", "an hour", "half an hour" etc. out of free text. */
export function parseMinutesFromText(text: string): number | undefined {
  const norm = normalize(text);
  const mins = norm.match(/(\d+)\s*(?:mins?|minutes?)\b/);
  if (mins) return Number(mins[1]);
  const hrs = norm.match(/(\d+(?:\.\d+)?)\s*(?:h|hrs?|hours?)\b/);
  if (hrs) return Math.round(Number(hrs[1]) * 60);
  if (/\bhalf (?:an )?hour\b/.test(norm)) return 30;
  if (/\b(?:an|one) hour\b/.test(norm)) return 60;
  return undefined;
}
