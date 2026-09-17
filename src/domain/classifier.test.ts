import { describe, it, expect } from 'vitest';
import { classifyBehavior, effortFromMinutes } from './classifier';
import { suggestNextAction, weeklySummaryLines } from './recommendations';
import { ASPECT_IDS, zeroWeights } from './types';

describe('classifier (§5.1B)', () => {
  it('maps "I cooked dinner and talked to my friend" to multiple aspects', () => {
    const c = classifyBehavior('I cooked dinner and talked to my friend');
    expect(c.entry).not.toBeNull();
    const touched = ASPECT_IDS.filter((a) => c.weights[a] > 0);
    expect(touched.length).toBeGreaterThanOrEqual(1);
  });

  it('recognizes walking with grounding dominant', () => {
    const c = classifyBehavior('went for a 30 minute walk');
    expect(c.entry?.id).toBe('walked-outside');
    expect(c.weights.grounding).toBeGreaterThan(0);
  });

  it('returns zero confidence for unknown text and empty weights', () => {
    const c = classifyBehavior('did the quantum flibber flabber');
    expect(c.entry).toBeNull();
    expect(c.confidence).toBe(0);
    expect(ASPECT_IDS.every((a) => c.weights[a] === 0)).toBe(true);
  });

  it('derives effort from time spent (§6.2 bands)', () => {
    expect(effortFromMinutes(3)).toBe('tiny');
    expect(effortFromMinutes(10)).toBe('light');
    expect(effortFromMinutes(30)).toBe('moderate');
    expect(effortFromMinutes(90)).toBe('substantial');
    expect(effortFromMinutes(undefined)).toBe('light');
  });
});

describe('recommendations (§17.2)', () => {
  const aspects = Object.fromEntries(
    ASPECT_IDS.map((id) => [id, { energy: 100, momentum: 0.2 }]),
  ) as never;

  it('returns exactly one primary suggestion', () => {
    const s = suggestNextAction({ aspects, focusAspects: [], recentTitles: [] });
    expect(s).not.toBeNull();
    expect(s!.title.length).toBeGreaterThan(0);
    expect(s!.reason.length).toBeGreaterThan(0);
  });

  it('boosts the quietest aspect gently (§12 offer-not-require)', () => {
    const skewed = Object.fromEntries(
      ASPECT_IDS.map((id) => [id, { energy: id === 'expression' ? 0 : 500, momentum: 0.2 }]),
    ) as never;
    const s = suggestNextAction({ aspects: skewed, focusAspects: [], recentTitles: [] });
    expect(s!.aspectWeights.expression).toBeGreaterThan(0);
  });
});

describe('weekly summary (§12)', () => {
  it('marks untouched aspects as quiet, active ones as warming', () => {
    const now = Date.now();
    const lines = weeklySummaryLines(
      [
        { timestamp: now - DAY, aspectWeights: { ...zeroWeights(), grounding: 1 } },
        { timestamp: now - 2 * DAY, aspectWeights: { ...zeroWeights(), grounding: 1, agency: 0.4 } },
      ],
      now,
    );
    const grounding = lines.find((l) => l.aspect === 'grounding')!;
    const meaning = lines.find((l) => l.aspect === 'meaning')!;
    expect(grounding.trend).toBe('warming');
    expect(meaning.trend).toBe('quiet');
    expect(grounding.attention).toBeGreaterThan(meaning.attention);
  });
});

const DAY = 86_400_000;
