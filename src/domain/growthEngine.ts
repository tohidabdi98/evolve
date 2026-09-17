import type {
  AspectId,
  AspectWeights,
  Behavior,
  EvolutionEvent,
  UserAspect,
} from './types';
import { ASPECT_IDS } from './types';
import { stageForEnergy } from '@/lib/color';

/**
 * Growth Energy engine (blueprint §6, §30). Pure and deterministic — UI never
 * computes scores itself.
 *
 *   raw_gain = base × effort × consistency × relevance × novelty
 *   energy_t = clamp(energy_{t-1} + raw_gain·weight − gentle_decay, 0, 1000)
 *
 * Tiny actions always move something. Bigger actions help more, but
 * sub-linearly. Consistency beats heroics. Missed days fade gently —
 * never punish (§6.3, §15).
 */

/** Base gain per logged behavior for its primary (highest-weight) aspect. */
export const BASE_GAIN = 40;

/** Effort multipliers (§6.2: bigger actions help more, but not proportionally). */
export const EFFORT_MULTIPLIER: Record<Behavior['effort'], number> = {
  tiny: 0.45,
  light: 0.75,
  moderate: 1.0,
  substantial: 1.3,
};

/** Diminishing returns: the Nth action for the same aspect in one day is worth less. */
export function dailyFrequencyFactor(countBeforeToday: number): number {
  return 1 / (1 + 0.35 * Math.max(0, countBeforeToday));
}

/**
 * Consistency bonus from momentum (0..1): a warm streak amplifies gains,
 * resting periods do not zero them.
 */
export function consistencyBonus(momentum: number): number {
  return 0.85 + 0.3 * clamp01(momentum);
}

/**
 * Novelty factor: first-ever actions in an aspect feel momentous; very recent
 * repetition fades slightly (diminishing returns without grinding, §28).
 */
export function noveltyFactor(userAspect: UserAspect, now: number): number {
  if (userAspect.lifetimeActions === 0) return 1.15;
  const days = (now - (userAspect.lastActivityAt ?? now)) / 86_400_000;
  if (days < 0.5) return 0.9; // same-day repetition
  if (days > 3) return 1.05; // returning after a pause
  return 1;
}

/** Personal relevance: focus aspects from onboarding get a gentle boost (§3.1). */
export function relevanceFactor(aspectId: AspectId, focusAspects: AspectId[]): number {
  return focusAspects.includes(aspectId) ? 1.1 : 1;
}

/**
 * Gentle daily decay (§6.3). A few missed days cool the world slightly;
 * nothing is ever "lost" — level persists, momentum fades (§6.4).
 */
export function gentleDecay(daysSinceLastActivity: number): number {
  if (daysSinceLastActivity <= 0) return 0;
  const weeks = daysSinceLastActivity / 7;
  return Math.min(90, 6 * weeks + (weeks > 0.5 ? 4 : 0));
}

export function clampEnergy(x: number): number {
  return Math.min(1000, Math.max(0, x));
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

/** Momentum update: recent activity raises it, time cools it (§6.4). */
export function updateMomentum(current: number, now: number, lastActivityAt: number | null): number {
  const days = lastActivityAt == null ? 999 : (now - lastActivityAt) / 86_400_000;
  const cooled = current * Math.exp(-days / 6); // ~6-day half-life-ish smoothing
  return clamp01(Math.min(1, cooled + 0.25));
}

export interface GainBreakdown {
  aspect: AspectId;
  weight: number;
  gain: number;
}

/**
 * Compute per-aspect gains for one behavior, before decay is applied.
 * Gains scale with the mapping weight (§5.3 weighted vector).
 */
export function computeGains(input: {
  aspectWeights: AspectWeights;
  effort: Behavior['effort'];
  momentumByAspect: Record<AspectId, number>;
  lifetimeActionsByAspect: Record<AspectId, number>;
  todayCountByAspect: Record<AspectId, number>;
  focusAspects: AspectId[];
  now: number;
}): GainBreakdown[] {
  const {
    aspectWeights,
    effort,
    momentumByAspect,
    lifetimeActionsByAspect,
    todayCountByAspect,
    focusAspects,
    now,
  } = input;

  const gains: GainBreakdown[] = [];
  for (const aspect of ASPECT_IDS) {
    const weight = aspectWeights[aspect];
    if (weight <= 0) continue;
    const ua: UserAspect = {
      energy: 0,
      momentum: momentumByAspect[aspect],
      lifetimeActions: lifetimeActionsByAspect[aspect],
      lastActivityAt: null,
    };
    const raw =
      BASE_GAIN *
      EFFORT_MULTIPLIER[effort] *
      consistencyBonus(momentumByAspect[aspect]) *
      relevanceFactor(aspect, focusAspects) *
      noveltyFactor(ua, now) *
      dailyFrequencyFactor(todayCountByAspect[aspect]);

    gains.push({ aspect, weight, gain: raw * weight });
  }
  return gains;
}

export interface ApplyResult {
  aspects: Record<AspectId, UserAspect>;
  events: EvolutionEvent[];
}

function makeId(prefix: string, now: number): string {
  return `${prefix}-${now.toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

/**
 * Apply one behavior's gains + gentle decay to all aspects, then detect
 * evolution events (§8.3 stage changes, §8.4 "something changed here").
 * Deterministic given inputs (ids aside).
 */
export function applyBehavior(input: {
  aspects: Record<AspectId, UserAspect>;
  aspectWeights: AspectWeights;
  effort: Behavior['effort'];
  behaviorTimestamp: number;
  focusAspects: AspectId[];
  previousAspects?: Record<AspectId, UserAspect>;
}): ApplyResult {
  const { aspectWeights, effort, behaviorTimestamp, focusAspects } = input;
  const before = input.previousAspects ?? input.aspects;

  const todayCountByAspect = Object.fromEntries(ASPECT_IDS.map((id) => [id, 0])) as Record<
    AspectId,
    number
  >;
  const momentumByAspect = Object.fromEntries(
    ASPECT_IDS.map((id) => [id, before[id].momentum]),
  ) as Record<AspectId, number>;
  const lifetimeByAspect = Object.fromEntries(
    ASPECT_IDS.map((id) => [id, before[id].lifetimeActions]),
  ) as Record<AspectId, number>;

  const gains = computeGains({
    aspectWeights,
    effort,
    momentumByAspect,
    lifetimeActionsByAspect: lifetimeByAspect,
    todayCountByAspect,
    focusAspects,
    now: behaviorTimestamp,
  });

  const events: EvolutionEvent[] = [];
  const next: Record<AspectId, UserAspect> = {} as Record<AspectId, UserAspect>;

  for (const aspect of ASPECT_IDS) {
    const prev = before[aspect];
    const daysSince = prev.lastActivityAt
      ? (behaviorTimestamp - prev.lastActivityAt) / 86_400_000
      : prev.lifetimeActions > 0
        ? (behaviorTimestamp - prev.lastActivityAt!) / 86_400_000
        : 0;

    const gain = gains.find((g) => g.aspect === aspect)?.gain ?? 0;
    const decay = gentleDecay(prev.lifetimeActions > 0 ? daysSince : 0);

    const energy = clampEnergy(prev.energy + gain - decay);
    const momentum = updateMomentum(prev.momentum, behaviorTimestamp, prev.lastActivityAt);
    const lifetimeActions = prev.lifetimeActions + (gain > 0 ? 1 : 0);

    // Stage-change discovery events (§8.3, §8.4).
    const prevStage = stageForEnergy(prev.energy);
    const nextStage = stageForEnergy(energy);
    if (prevStage !== nextStage && gain > 0) {
      events.push({
        id: makeId('evo', behaviorTimestamp),
        aspectId: aspect,
        kind: 'stage_change',
        message: stageChangeMessage(aspect, nextStage),
        createdAt: behaviorTimestamp,
        seen: false,
      });
    }

    next[aspect] = { energy, momentum, lifetimeActions, lastActivityAt: gain > 0 ? behaviorTimestamp : prev.lastActivityAt };
  }

  return { aspects: next, events };
}

function stageChangeMessage(aspect: AspectId, stage: ReturnType<typeof stageForEnergy>): string {
  const lines: Record<AspectId, Partial<Record<string, string>>> = {
    grounding: { Sprout: 'Your roots are settling in.', Established: 'The ground beneath you holds.' },
    creativity: { Sprout: 'Something wants to bloom here.', Established: 'Color is returning to the streams.' },
    agency: { Sprout: 'A path is clearing.', Established: 'Your fires are easier to light now.' },
    connection: { Sprout: 'A thread of warmth between you and others.', Established: 'The bridges are carrying weight.' },
    expression: { Sprout: 'Your voice found a breeze.', Established: 'Ribbons of words move freely now.' },
    reflection: { Sprout: 'A quiet pool is forming.', Established: 'The lanterns burn steady.' },
    meaning: { Sprout: 'The sky feels a little closer.', Established: 'Constellations are taking shape.' },
  };
  return lines[aspect][stage] ?? `${aspect[0].toUpperCase()}${aspect.slice(1)} entered ${stage} — a quiet shift.`;
}
