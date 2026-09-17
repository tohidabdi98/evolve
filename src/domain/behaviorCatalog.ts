import type { AspectWeights, Effort } from './types';
import { zeroWeights } from './types';

/**
 * The 20 natively-recognized behaviors (blueprint §34) with interpretable
 * weighted aspect vectors (§5.3). Any behavior can nourish several dimensions.
 */

export interface CatalogEntry {
  /** Stable id, e.g. 'walked-outside'. */
  id: string;
  label: string;
  defaultEffort: Effort;
  /** Optional duration minutes for entries where it matters. */
  defaultDurationMinutes?: number;
  weights: AspectWeights;
  /** Keywords used by the natural-language classifier. */
  keywords: string[];
}

function w(partial: Partial<AspectWeights>): AspectWeights {
  return { ...zeroWeights(), ...partial };
}

export const BEHAVIOR_CATALOG: readonly CatalogEntry[] = [
  {
    id: 'walked-outside',
    label: 'Walked outside',
    defaultEffort: 'light',
    defaultDurationMinutes: 20,
    weights: w({ grounding: 0.7, agency: 0.4, reflection: 0.1 }),
    keywords: ['walk', 'walked', 'walking', 'stroll', 'outside', 'steps'],
  },
  {
    id: 'exercised',
    label: 'Exercised',
    defaultEffort: 'moderate',
    weights: w({ agency: 0.9, grounding: 0.3 }),
    keywords: ['exercise', 'exercised', 'workout', 'gym', 'run', 'ran', 'lift', 'training', 'yoga'],
  },
  {
    id: 'slept-on-time',
    label: 'Slept on time',
    defaultEffort: 'light',
    weights: w({ grounding: 1.0 }),
    keywords: ['sleep', 'slept', 'bedtime', 'bed early', 'rest'],
  },
  {
    id: 'cooked-meal',
    label: 'Cooked a meal',
    defaultEffort: 'moderate',
    weights: w({ grounding: 0.8, agency: 0.4, creativity: 0.3 }),
    keywords: ['cook', 'cooked', 'cooking', 'meal', 'dinner', 'lunch', 'breakfast', 'baked'],
  },
  {
    id: 'drank-water',
    label: 'Drank water',
    defaultEffort: 'tiny',
    weights: w({ grounding: 0.6 }),
    keywords: ['water', 'hydrated', 'drank', 'drink'],
  },
  {
    id: 'tidied-space',
    label: 'Tidied a space',
    defaultEffort: 'light',
    weights: w({ grounding: 0.9, agency: 0.4 }),
    keywords: ['tidied', 'tidy', 'cleaned', 'cleaning', 'organized', 'desk', 'room', 'dishes'],
  },
  {
    id: 'completed-task',
    label: 'Completed an important task',
    defaultEffort: 'moderate',
    weights: w({ agency: 1.0 }),
    keywords: ['finished', 'completed', 'task', 'done', 'shipped', 'deadline'],
  },
  {
    id: 'started-postponed',
    label: 'Started something postponed',
    defaultEffort: 'light',
    weights: w({ agency: 0.9, meaning: 0.2 }),
    keywords: ['postponed', 'procrastinated', 'finally started', 'avoided', 'put off'],
  },
  {
    id: 'set-boundary',
    label: 'Set a boundary',
    defaultEffort: 'moderate',
    weights: w({ agency: 0.6, expression: 0.5, grounding: 0.3 }),
    keywords: ['boundary', 'said no', 'declined', 'no to', 'protected my time'],
  },
  {
    id: 'did-creative',
    label: 'Did something creative',
    defaultEffort: 'light',
    weights: w({ creativity: 1.0, reflection: 0.1 }),
    keywords: ['creative', 'painted', 'drew', 'drawing', 'art', 'wrote', 'writing', 'made', 'built', 'craft'],
  },
  {
    id: 'played-music',
    label: 'Played music',
    defaultEffort: 'light',
    weights: w({ creativity: 0.9, expression: 0.3 }),
    keywords: ['music', 'played', 'guitar', 'piano', 'sang', 'singing', 'instrument'],
  },
  {
    id: 'quality-time',
    label: 'Spent quality time with someone',
    defaultEffort: 'light',
    weights: w({ connection: 1.0, creativity: 0.1 }),
    keywords: ['quality time', 'time with', 'met', 'visited', 'dinner with', 'family', 'friend'],
  },
  {
    id: 'helped-someone',
    label: 'Helped someone',
    defaultEffort: 'light',
    weights: w({ connection: 0.8, agency: 0.3, meaning: 0.3 }),
    keywords: ['helped', 'helping', 'favored', 'supported', 'assisted'],
  },
  {
    id: 'called-someone',
    label: 'Called or messaged someone',
    defaultEffort: 'tiny',
    weights: w({ connection: 0.9, expression: 0.4 }),
    keywords: ['called', 'phone', 'messaged', 'texted', 'text', 'talked to', 'reached out'],
  },
  {
    id: 'honest-conversation',
    label: 'Had an honest conversation',
    defaultEffort: 'moderate',
    weights: w({ expression: 0.9, connection: 0.5 }),
    keywords: ['honest', 'truth', 'opened up', 'heart to heart', 'difficult conversation', 'apologized'],
  },
  {
    id: 'journaled',
    label: 'Journaled',
    defaultEffort: 'light',
    weights: w({ reflection: 0.8, expression: 0.6 }),
    keywords: ['journal', 'journaled', 'diary', 'journaling', 'wrote down my'],
  },
  {
    id: 'read',
    label: 'Read',
    defaultEffort: 'light',
    weights: w({ reflection: 0.8, meaning: 0.2 }),
    keywords: ['read', 'reading', 'book', 'chapter', 'pages'],
  },
  {
    id: 'meditated',
    label: 'Meditated',
    defaultEffort: 'light',
    weights: w({ reflection: 1.0, meaning: 0.2 }),
    keywords: ['meditat', 'breathing', 'breathwork', 'sat quietly', 'mindful'],
  },
  {
    id: 'screen-break',
    label: 'Took a screen break',
    defaultEffort: 'tiny',
    weights: w({ reflection: 0.8, grounding: 0.3 }),
    keywords: ['screen break', 'phone off', 'screen-free', 'digital detox', 'no phone', 'unplugged'],
  },
  {
    id: 'reflected-values',
    label: 'Reflected on values or purpose',
    defaultEffort: 'light',
    weights: w({ meaning: 1.0, reflection: 0.4 }),
    keywords: ['values', 'purpose', 'what matters', 'why i', 'meaning of', 'grateful', 'gratitude'],
  },
];

export const CATALOG_MAP: Record<string, CatalogEntry> = Object.fromEntries(
  BEHAVIOR_CATALOG.map((e) => [e.id, e]),
);
