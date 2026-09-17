import { describe, it, expect } from 'vitest';
import {
  applyBehavior,
  BASE_GAIN,
  EFFORT_MULTIPLIER,
  computeGains,
  gentleDecay,
  updateMomentum,
  clampEnergy,
  noveltyFactor,
  dailyFrequencyFactor,
} from './growthEngine';
import { zeroWeights, ASPECT_IDS } from './types';
import { stageForEnergy } from '@/lib/color';

function freshAspects() {
  return Object.fromEntries(
    ASPECT_IDS.map((id) => [
      id,
      { energy: 0, momentum: 0, lifetimeActions: 0, lastActivityAt: null },
    ]),
  ) as Record<(typeof ASPECT_IDS)[number], ReturnType<typeof freshUserAspect>>;
}

function freshUserAspect() {
  return { energy: 0, momentum: 0, lifetimeActions: 0, lastActivityAt: null as number | null };
}

const T0 = 1_700_000_000_000;
const DAY = 86_400_000;

describe('growth engine determinism', () => {
  it('produces identical states for identical inputs (ignoring ids)', () => {
    const a = applyBehavior({
      aspects: freshAspects(),
      aspectWeights: { ...zeroWeights(), grounding: 1 },
      effort: 'light',
      behaviorTimestamp: T0,
      focusAspects: [],
    });
    const b = applyBehavior({
      aspects: freshAspects(),
      aspectWeights: { ...zeroWeights(), grounding: 1 },
      effort: 'light',
      behaviorTimestamp: T0,
      focusAspects: [],
    });
    const strip = (r: typeof a) =>
      JSON.stringify({ ...r, events: r.events.map((e) => ({ ...e, id: '' })) });
    expect(strip(a)).toBe(strip(b));
  });
});

describe('gain model (§6.2)', () => {
  it('tiny actions always produce some progress', () => {
    const gains = computeGains({
      aspectWeights: { ...zeroWeights(), grounding: 0.6 },
      effort: 'tiny',
      momentumByAspect: { ...Object.fromEntries(ASPECT_IDS.map((i) => [i, 0])) } as never,
      lifetimeActionsByAspect: Object.fromEntries(ASPECT_IDS.map((i) => [i, 0])) as never,
      todayCountByAspect: Object.fromEntries(ASPECT_IDS.map((i) => [i, 0])) as never,
      focusAspects: [],
      now: T0,
    });
    expect(gains[0].gain).toBeGreaterThan(0);
  });

  it('larger efforts produce more, but sub-linearly', () => {
    // substantial ≈ 6× the time of tiny but < 3× the gain (§6.2)
    expect(EFFORT_MULTIPLIER.substantial).toBeLessThan(3 * EFFORT_MULTIPLIER.tiny);
    expect(EFFORT_MULTIPLIER.moderate).toBeLessThan(2.5 * EFFORT_MULTIPLIER.tiny);
  });

  it('weights scale gains (§5.3)', () => {
    const hi = computeGains({
      aspectWeights: { ...zeroWeights(), grounding: 1 },
      effort: 'light',
      momentumByAspect: zeroMomentum(),
      lifetimeActionsByAspect: zeroCounts(),
      todayCountByAspect: zeroCounts(),
      focusAspects: [],
      now: T0,
    });
    const lo = computeGains({
      aspectWeights: { ...zeroWeights(), grounding: 0.25 },
      effort: 'light',
      momentumByAspect: zeroMomentum(),
      lifetimeActionsByAspect: zeroCounts(),
      todayCountByAspect: zeroCounts(),
      focusAspects: [],
      now: T0,
    });
    expect(hi[0].gain).toBeGreaterThan(lo[0].gain * 3);
  });

  it('diminishing returns curb same-day grinding (§28)', () => {
    expect(dailyFrequencyFactor(3)).toBeLessThan(dailyFrequencyFactor(0));
    expect(dailyFrequencyFactor(0)).toBe(1);
  });

  it('novelty rewards first actions and returns after pauses', () => {
    const first = noveltyFactor({ energy: 0, momentum: 0, lifetimeActions: 0, lastActivityAt: null }, T0);
    expect(first).toBeGreaterThan(1);
  });
});

describe('decay & momentum (§6.3, §6.4)', () => {
  it('one missed day barely decays', () => {
    expect(gentleDecay(1)).toBeLessThanOrEqual(6);
  });

  it('a week away cools gently, never wipes', () => {
    const d = gentleDecay(7);
    expect(d).toBeGreaterThan(0);
    expect(d).toBeLessThanOrEqual(90);
  });

  it('level persists — decay never applies when no activity ever happened', () => {
    expect(gentleDecay(0)).toBe(0);
  });

  it('momentum rises with activity and cools over days', () => {
    const afterAction = updateMomentum(0.5, T0, T0 - 0.5 * DAY);
    const afterWeek = updateMomentum(0.5, T0, T0 - 7 * DAY);
    expect(afterAction).toBeGreaterThan(afterWeek);
    expect(afterAction).toBeLessThanOrEqual(1);
  });
});

describe('applyBehavior (§30)', () => {
  it('raises the mapped aspect, leaves others untouched, respects clamp', () => {
    const aspects = freshAspects();
    aspects.grounding = { energy: 995, momentum: 0.9, lifetimeActions: 40, lastActivityAt: T0 - DAY };
    const res = applyBehavior({
      aspects,
      aspectWeights: { ...zeroWeights(), grounding: 1 },
      effort: 'substantial',
      behaviorTimestamp: T0,
      focusAspects: [],
    });
    expect(res.aspects.grounding.energy).toBe(1000);
    expect(res.aspects.creativity.energy).toBe(0);
  });

  it('emits a stage-change event when crossing a threshold (§8.3)', () => {
    const res = applyBehavior({
      aspects: freshAspects(),
      aspectWeights: { ...zeroWeights(), creativity: 1 },
      effort: 'substantial',
      behaviorTimestamp: T0,
      focusAspects: [],
    });
    const crossed = stageForEnergy(res.aspects.creativity.energy);
    const eventsForAspect = res.events.filter((e) => e.aspectId === 'creativity');
    if (crossed !== 'Dormant') {
      expect(eventsForAspect.length).toBeGreaterThan(0);
    }
  });

  it('supports multi-aspect nourishment from one behavior (§1.2)', () => {
    const res = applyBehavior({
      aspects: freshAspects(),
      aspectWeights: { ...zeroWeights(), connection: 0.9, expression: 0.4 },
      effort: 'light',
      behaviorTimestamp: T0,
      focusAspects: [],
    });
    expect(res.aspects.connection.energy).toBeGreaterThan(0);
    expect(res.aspects.expression.energy).toBeGreaterThan(0);
  });

  it('applies gentle decay after a pause, preserving most energy', () => {
    const aspects = freshAspects();
    aspects.grounding = { energy: 400, momentum: 0.8, lifetimeActions: 10, lastActivityAt: T0 - 10 * DAY };
    const res = applyBehavior({
      aspects,
      aspectWeights: { ...zeroWeights(), grounding: 1 },
      effort: 'tiny',
      behaviorTimestamp: T0,
      focusAspects: [],
    });
    // tiny gain minus 10-day decay still leaves the bulk of 400 intact
    expect(res.aspects.grounding.energy).toBeGreaterThan(300);
  });

  it('never lets energy go negative', () => {
    const aspects = freshAspects();
    aspects.meaning = { energy: 5, momentum: 0, lifetimeActions: 2, lastActivityAt: T0 - 60 * DAY };
    const res = applyBehavior({
      aspects,
      aspectWeights: { ...zeroWeights(), meaning: 1 },
      effort: 'tiny',
      behaviorTimestamp: T0,
      focusAspects: [],
    });
    expect(res.aspects.meaning.energy).toBeGreaterThanOrEqual(0);
  });
});

function zeroMomentum() {
  return Object.fromEntries(ASPECT_IDS.map((i) => [i, 0])) as never;
}
function zeroCounts() {
  return Object.fromEntries(ASPECT_IDS.map((i) => [i, 0])) as never;
}

describe('sanity', () => {
  it('base gain constant is meaningful', () => {
    expect(BASE_GAIN).toBeGreaterThan(0);
    expect(clampEnergy(-5)).toBe(0);
    expect(clampEnergy(1200)).toBe(1000);
  });
});
