import type { AspectId, AspectWeights, Suggestion } from './types';
import { ASPECT_IDS, zeroWeights } from './types';
import { ASPECTS } from './aspects';

/**
 * Recommendation engine (blueprint §9.1, §17.2). One primary suggestion shown;
 * score = relevance × ease × contextFit × novelty × desiredAspectBoost ×
 * recentSuccessProbability. Low cognitive load — tiny or light only.
 */

interface TinyAction {
  id: string;
  title: string;
  effort: 'tiny' | 'light';
  reason: string;
  weights: Partial<Record<AspectId, number>>;
}

const TINY_ACTIONS: readonly TinyAction[] = [
  { id: 'water', title: 'Drink a glass of water.', effort: 'tiny', reason: 'Small is still movement.', weights: { grounding: 0.6 } },
  { id: 'step-out', title: 'Step outside for 3 minutes.', effort: 'tiny', reason: 'A little air resets the day.', weights: { grounding: 0.6, agency: 0.3 } },
  { id: 'kind-message', title: 'Send one kind message.', effort: 'tiny', reason: 'Connection travels in small packets.', weights: { connection: 0.7, expression: 0.3 } },
  { id: 'breath', title: 'Take twenty quiet breaths.', effort: 'tiny', reason: 'Attention is a muscle; this is a rep.', weights: { reflection: 0.8 } },
  { id: 'stretch', title: 'Stretch for two minutes.', effort: 'tiny', reason: 'Your body has been waiting politely.', weights: { agency: 0.6, grounding: 0.3 } },
  { id: 'tidy-one', title: 'Put one thing back where it belongs.', effort: 'tiny', reason: 'Order compounds quietly.', weights: { grounding: 0.7 } },
  { id: 'note-idea', title: 'Note one idea in a sentence.', effort: 'tiny', reason: 'Creativity starts with capture.', weights: { creativity: 0.6, expression: 0.3 } },
  { id: 'one-line', title: 'Write one honest sentence.', effort: 'tiny', reason: 'The true thing, kindly, briefly.', weights: { expression: 0.8 } },
  { id: 'look-sky', title: 'Look at the sky for a minute.', effort: 'tiny', reason: 'Perspective is free.', weights: { meaning: 0.6, reflection: 0.3 } },
  { id: 'finish-small', title: 'Finish one two-minute task you avoided.', effort: 'light', reason: 'Momentum loves small victories.', weights: { agency: 0.8 } },
];

export function suggestNextAction(input: {
  aspects: Record<AspectId, { energy: number; momentum: number }>;
  focusAspects: AspectId[];
  recentTitles: string[];
  now?: number;
}): Suggestion | null {
  const { aspects, focusAspects, recentTitles, now = Date.now() } = input;
  if (TINY_ACTIONS.length === 0) return null;

  // Quietest aspect (least recent energy) gets the boost (§12: gentle invitation,
  // never forcing balance — we offer, not require).
  const quietest = [...ASPECT_IDS].sort((a, b) => aspects[a].energy - aspects[b].energy)[0];

  const scored = TINY_ACTIONS.map((action) => {
    const primaryAspect = (Object.entries(action.weights).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      'grounding') as AspectId;

    const relevance = focusAspects.includes(primaryAspect) ? 1.15 : 1;
    const ease = action.effort === 'tiny' ? 1.1 : 0.95;
    const contextFit = 1; // MVP: no time-of-day context yet (Phase 1)
    const novelty = recentTitles.some((t) => t.toLowerCase().includes(action.title.slice(0, 12).toLowerCase()))
      ? 0.6
      : 1;
    const desiredAspectBoost = primaryAspect === quietest ? 1.25 : 1;
    const recentSuccessProbability = 0.9 + 0.2 * clamp01(aspects[primaryAspect].momentum);

    const score =
      relevance * ease * contextFit * novelty * desiredAspectBoost * recentSuccessProbability;

    return { action, primaryAspect, score };
  }).sort((a, b) => b.score - a.score);

  const top = scored[0];
  const def = ASPECTS.find((a) => a.id === top.primaryAspect)!;
  const reason =
    top.primaryAspect === quietest
      ? `${def.name} could use a little attention — and this takes almost no time.`
      : top.action.reason;

  const weights = { ...zeroWeights(), ...top.action.weights };

  return {
    id: `${top.action.id}-${now.toString(36)}`,
    title: top.action.title,
    reason,
    effort: top.action.effort,
    aspectWeights: weights,
  };
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

/** Weekly attention summary lines (§12), warm and non-judgmental. */
export function weeklySummaryLines(
  behaviors: { timestamp: number; aspectWeights: AspectWeights }[],
  now = Date.now(),
): { aspect: AspectId; attention: number; trend: 'warming' | 'steady' | 'quiet' }[] {
  const weekAgo = now - 7 * 86_400_000;
  const inWindow = behaviors.filter((b) => b.timestamp >= weekAgo);
  const lines = ASPECT_IDS.map((aspect) => {
    const attention = inWindow.reduce((sum, b) => sum + b.aspectWeights[aspect], 0);
    return { aspect, attention, trend: 'steady' as const };
  });
  const max = Math.max(0.001, ...lines.map((l) => l.attention));
  return lines
    .map((l) => ({
      ...l,
      trend: (l.attention === 0 ? 'quiet' : l.attention >= max * 0.66 ? 'warming' : 'steady') as
        | 'warming'
        | 'steady'
        | 'quiet',
    }))
    .sort((a, b) => b.attention - a.attention);
}
