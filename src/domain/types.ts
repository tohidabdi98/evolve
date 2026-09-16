/**
 * Core domain types (blueprint §19). UI-free and deterministic.
 */

export type AspectId =
  | 'grounding'
  | 'creativity'
  | 'agency'
  | 'connection'
  | 'expression'
  | 'reflection'
  | 'meaning';

export const ASPECT_IDS: readonly AspectId[] = [
  'grounding',
  'creativity',
  'agency',
  'connection',
  'expression',
  'reflection',
  'meaning',
];

/** Weighted aspect vector (§5.3) — one entry per aspect, 0..1. */
export type AspectWeights = Record<AspectId, number>;

export function zeroWeights(): AspectWeights {
  return {
    grounding: 0,
    creativity: 0,
    agency: 0,
    connection: 0,
    expression: 0,
    reflection: 0,
    meaning: 0,
  };
}

export type Effort = 'tiny' | 'light' | 'moderate' | 'substantial';

export const EFFORTS: readonly Effort[] = ['tiny', 'light', 'moderate', 'substantial'];

/** Where a behavior came from (§5.2). */
export type BehaviorSource = 'manual' | 'recurring' | 'imported' | 'system_suggestion';

export interface Behavior {
  id: string;
  /** Free title; may come from catalog labels or the user's own words. */
  title: string;
  notes?: string;
  source: BehaviorSource;
  /** Epoch ms. */
  timestamp: number;
  durationMinutes?: number;
  effort: Effort;
  /** Weighted mapping shown to the user and editable before save (§5.3). */
  aspectWeights: AspectWeights;
  /** How the mapping was produced. */
  mappingSource: 'catalog' | 'classifier' | 'user' | 'mixed';
  /** User has reviewed/confirmed the mapping (§18.1: user confirms ambiguity). */
  userConfirmed: boolean;
  /** Optional daily reflection attachment. */
  reflectionPrompt?: string;
  reflectionResponse?: string;
  createdAt: number;
}

export interface UserAspect {
  energy: number; // 0..1000 (§6.1)
  momentum: number; // 0..1 recent engagement (§6.4)
  lifetimeActions: number;
  lastActivityAt: number | null;
}

/** Onboarding rhythm choice (§3.1 screen 3). */
export type Rhythm = 'tiny' | 'light' | 'open';

export interface OnboardingState {
  completed: boolean;
  focusAspects: AspectId[]; // 1–3 chosen (§3.1 screen 2)
  rhythm: Rhythm;
  chakraNamesShown: boolean; // §36 toggle, default follows onboarding interest
}

export type ReflectionPromptId =
  | 'energy'
  | 'meaning'
  | 'courage'
  | 'connection'
  | 'tomorrow';

export interface Reflection {
  id: string;
  /** Local day key the reflection belongs to, e.g. 2026-09-17. */
  day: string;
  promptId: ReflectionPromptId;
  prompt: string;
  response: string;
  timestamp: number;
}

export interface Routine {
  id: string;
  title: string;
  cue: string;
  /** Simple daily recurrence in MVP (§10). */
  preferredTimeOfDay: 'morning' | 'midday' | 'evening' | 'anytime';
  effort: Effort;
  aspectWeights: AspectWeights;
  active: boolean;
  createdAt: number;
  /** Times completed, for routine evolution stages (§10.3). */
  completions: number;
  lastCompletedAt: number | null;
}

export interface Trait {
  id: string;
  title: string;
  description: string;
  aspectId: AspectId;
  discoveredAt: number;
  active: boolean;
}

/** Milestones surfaced as "Something changed here." (§8.4). */
export interface EvolutionEvent {
  id: string;
  aspectId: AspectId;
  kind: 'stage_change' | 'first_warmth' | 'trait' | 'pattern';
  /** Short guide-voice line (§16.1). */
  message: string;
  createdAt: number;
  seen: boolean;
}

export interface Preferences {
  chakraNames: boolean;
  reducedMotion: boolean; // null-ish default: respect OS via CSS; explicit override here
  soundEnabled: boolean; // §21.4 all sound optional
  notificationIntensity: 'quiet' | 'balanced' | 'frequent'; // §13
}

export interface Suggestion {
  id: string;
  title: string;
  /** Why the engine picked it, in guide voice. */
  reason: string;
  effort: Effort;
  aspectWeights: AspectWeights;
}

/** Root persisted state shape (§19 User + related, local-first). */
export interface EvolveState {
  version: number;
  onboarding: OnboardingState;
  behaviors: Behavior[];
  aspects: Record<AspectId, UserAspect>;
  reflections: Reflection[];
  routines: Routine[];
  traits: Trait[];
  evolutionEvents: EvolutionEvent[];
  preferences: Preferences;
  /** Derived-free counters used by adaptive unlocks (§4.2). */
  suggestionStats: { shown: number; accepted: number };
  createdAt: number;
}
