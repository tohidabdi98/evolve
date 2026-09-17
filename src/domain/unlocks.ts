import type { EvolveState } from './types';

/**
 * Adaptive complexity (blueprint §4.2): features unlock through meaningful
 * interaction counts — never through days alone, so inactive users are never
 * gated. The app becomes more capable, not more crowded (§4.3).
 */

export interface Unlocks {
  aspectHistory: boolean; // after 3 behaviors
  growthEventBanner: boolean; // after 3 behaviors
  routinesTeaser: boolean; // after ~7
  routinesFull: boolean; // after ~7 + user interest
  traits: boolean; // after ~14
  quests: boolean; // after ~21
  weeklyReflection: boolean; // after ~21
}

const THRESHOLDS = {
  history: 3,
  routines: 7,
  traits: 14,
  quests: 21,
  weekly: 21,
} as const;

export function computeUnlocks(state: Pick<EvolveState, 'behaviors'>): Unlocks {
  const n = state.behaviors.length;
  return {
    aspectHistory: n >= THRESHOLDS.history,
    growthEventBanner: n >= THRESHOLDS.history,
    routinesTeaser: n >= THRESHOLDS.routines,
    routinesFull: n >= THRESHOLDS.routines,
    traits: n >= THRESHOLDS.traits,
    quests: n >= THRESHOLDS.quests,
    weeklyReflection: n >= THRESHOLDS.weekly,
  };
}
