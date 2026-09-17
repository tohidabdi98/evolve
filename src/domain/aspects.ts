import type { AspectId } from './types';

/**
 * The seven dimensions (blueprint §1.1, §36). Human language first, chakra name second.
 * These are design metaphors — never medical or scientific claims (§16.2).
 */

export interface AspectDef {
  id: AspectId;
  /** Modern, human name — the default voice (§36). */
  name: string;
  /** Adjective voice used on onboarding choice cards (§3.1 screen 2). */
  focusName: string;
  chakraName: string;
  /** Short poetic quality used on cards and onboarding. */
  essence: string;
  /** One-sentence plain-language description (§22). */
  description: string;
  /** Base hue in degrees (§7.1). */
  hue: number;
  /** World-region metaphor (§8.2), kept contemporary and abstract. */
  worldElement: string;
}

export const ASPECTS: readonly AspectDef[] = [
  {
    id: 'grounding',
    name: 'Grounding',
    focusName: 'Grounded',
    chakraName: 'Muladhara',
    essence: 'Steady, rested, resourced',
    description: 'Sleep, food, money, home base, and the routines that hold you up.',
    hue: 4,
    worldElement: 'roots and stones',
  },
  {
    id: 'creativity',
    name: 'Creativity',
    focusName: 'Creative',
    chakraName: 'Svadhisthana',
    essence: 'Playful, flowing, alive',
    description: 'Play, art, music, and making things without a scoreboard.',
    hue: 28,
    worldElement: 'flowers and streams',
  },
  {
    id: 'agency',
    name: 'Agency',
    focusName: 'Driven',
    chakraName: 'Manipura',
    essence: 'Capable, moving, ignited',
    description: 'Exercise, finishing things, starting the thing you postponed.',
    hue: 46,
    worldElement: 'sunlit paths',
  },
  {
    id: 'connection',
    name: 'Connection',
    focusName: 'Connected',
    chakraName: 'Anahata',
    essence: 'Warm, open, together',
    description: 'People, kindness, gratitude, quality time, being shown up for.',
    hue: 145,
    worldElement: 'bridges and birds',
  },
  {
    id: 'expression',
    name: 'Expression',
    focusName: 'Expressive',
    chakraName: 'Vishuddha',
    essence: 'Honest, clear, heard',
    description: 'Saying the true thing, writing, speaking, listening well.',
    hue: 210,
    worldElement: 'wind and ribbons',
  },
  {
    id: 'reflection',
    name: 'Reflection',
    focusName: 'Clear-minded',
    chakraName: 'Ajna',
    essence: 'Clear-minded, aware',
    description: 'Attention, meditation, reading, and pauses without a screen.',
    hue: 255,
    worldElement: 'pools and lanterns',
  },
  {
    id: 'meaning',
    name: 'Meaning',
    focusName: 'Purposeful',
    chakraName: 'Sahasrara',
    essence: 'Purposeful, spacious',
    description: 'Values, perspective, and the long view of what matters.',
    hue: 290,
    worldElement: 'sky and constellations',
  },
];

export const ASPECT_MAP: Record<AspectId, AspectDef> = Object.fromEntries(
  ASPECTS.map((a) => [a.id, a]),
) as Record<AspectId, AspectDef>;

export function aspectName(id: AspectId, chakraNames: boolean): string {
  return chakraNames ? ASPECT_MAP[id].chakraName : ASPECT_MAP[id].name;
}
