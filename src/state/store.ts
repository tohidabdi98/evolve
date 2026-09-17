import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AspectId,
  AspectWeights,
  Behavior,
  Effort,
  EvolutionEvent,
  EvolveState,
  Preferences,
  Reflection,
  Rhythm,
  Trait,
} from '@/domain/types';
import { ASPECT_IDS, zeroWeights } from '@/domain/types';
import { applyBehavior, clampEnergy, updateMomentum } from '@/domain/growthEngine';

function freshAspects(): Record<
  AspectId,
  { energy: number; momentum: number; lifetimeActions: number; lastActivityAt: number | null }
> {
  return Object.fromEntries(
    ASPECT_IDS.map((id) => [
      id,
      { energy: 0, momentum: 0, lifetimeActions: 0, lastActivityAt: null },
    ]),
  ) as Record<
    AspectId,
    { energy: number; momentum: number; lifetimeActions: number; lastActivityAt: number | null }
  >;
}

export const INITIAL_STATE: EvolveState = {
  version: 1,
  onboarding: {
    completed: false,
    focusAspects: [],
    rhythm: 'light',
    chakraNamesShown: false,
  },
  behaviors: [],
  aspects: freshAspects(),
  reflections: [],
  routines: [],
  traits: [],
  evolutionEvents: [],
  preferences: {
    chakraNames: false,
    reducedMotion: false,
    soundEnabled: false,
    notificationIntensity: 'quiet',
  },
  suggestionStats: { shown: 0, accepted: 0 },
  createdAt: Date.now(),
};

export interface LogBehaviorInput {
  title: string;
  notes?: string;
  effort: Effort;
  aspectWeights: AspectWeights;
  mappingSource: Behavior['mappingSource'];
  source?: Behavior['source'];
  durationMinutes?: number;
  /** Optional reflection to attach in the same motion. */
  reflectionPromptId?: string;
  reflectionPrompt?: string;
  reflectionResponse?: string;
}

export interface EvolveStore extends EvolveState {
  completeOnboarding: (input: {
    focusAspects: AspectId[];
    rhythm: Rhythm;
    chakraNamesShown?: boolean;
  }) => void;
  setPreferences: (patch: Partial<Preferences>) => void;
  /** Log a behavior through the growth engine (§30). */
  logBehavior: (input: LogBehaviorInput) => void;
  /** Edit an existing behavior; the whole world is recalculated deterministically (§28). */
  editBehavior: (id: string, patch: Partial<Pick<Behavior, 'title' | 'effort' | 'aspectWeights' | 'notes'>>) => void;
  /** Delete a behavior and remove its contribution (§28, §32). */
  deleteBehavior: (id: string) => void;
  saveReflection: (promptId: string, prompt: string, response: string) => void;
  markEventsSeen: () => void;
  recordSuggestionShown: () => void;
  recordSuggestionAccepted: () => void;
  resetAll: () => void;
}

/**
 * Deterministic recalculation (§28): replay all behaviors chronologically from
 * zero. Editing or deleting rewrites downstream state cleanly.
 */
function recalculateAll(behaviors: Behavior[], focusAspects: AspectId[]) {
  const chronological = [...behaviors].sort((a, b) => a.timestamp - b.timestamp);
  let aspects = freshAspects();
  const events: EvolutionEvent[] = [];
  const traits: Trait[] = [];
  for (const b of chronological) {
    const res = applyBehavior({
      aspects,
      aspectWeights: b.aspectWeights,
      effort: b.effort,
      behaviorTimestamp: b.timestamp,
      focusAspects,
    });
    aspects = res.aspects;
    events.push(...res.events);
  }
  return { aspects, events, traits };
}

export const useEvolve = create<EvolveStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      completeOnboarding: ({ focusAspects, rhythm, chakraNamesShown }) =>
        set((s) => ({
          onboarding: {
            completed: true,
            focusAspects: focusAspects.slice(0, 3),
            rhythm,
            chakraNamesShown: chakraNamesShown ?? s.onboarding.chakraNamesShown,
          },
          preferences: {
            ...s.preferences,
            chakraNames: chakraNamesShown ?? s.preferences.chakraNames,
          },
        })),

      setPreferences: (patch) => set((s) => ({ preferences: { ...s.preferences, ...patch } })),

      logBehavior: (input) => {
        const now = Date.now();
        const behavior: Behavior = {
          id: `b-${now.toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          title: input.title.trim() || 'Something real',
          notes: input.notes,
          source: input.source ?? 'manual',
          timestamp: now,
          durationMinutes: input.durationMinutes,
          effort: input.effort,
          aspectWeights: input.aspectWeights,
          mappingSource: input.mappingSource,
          userConfirmed: true,
          createdAt: now,
        };

        set((s) => {
          const res = applyBehavior({
            aspects: s.aspects,
            aspectWeights: behavior.aspectWeights,
            effort: behavior.effort,
            behaviorTimestamp: behavior.timestamp,
            focusAspects: s.onboarding.focusAspects,
          });

          const reflections = [...s.reflections];
          if (input.reflectionPrompt && input.reflectionResponse?.trim()) {
            const reflection: Reflection = {
              id: `r-${now.toString(36)}`,
              day: new Date(now).toISOString().slice(0, 10),
              promptId: (input.reflectionPromptId ?? 'custom') as Reflection['promptId'],
              prompt: input.reflectionPrompt,
              response: input.reflectionResponse.trim(),
              timestamp: now,
            };
            reflections.unshift(reflection);
          }

          return {
            behaviors: [behavior, ...s.behaviors],
            aspects: res.aspects,
            evolutionEvents: [...res.events, ...s.evolutionEvents].slice(0, 100),
            reflections,
          };
        });
      },

      editBehavior: (id, patch) => {
        set((s) => {
          const behaviors = s.behaviors.map((b) => (b.id === id ? { ...b, ...patch } : b));
          const { aspects, events } = recalculateAll(behaviors, s.onboarding.focusAspects);
          return { behaviors, aspects, evolutionEvents: [...events, ...s.evolutionEvents].slice(0, 100) };
        });
      },

      deleteBehavior: (id) => {
        set((s) => {
          const behaviors = s.behaviors.filter((b) => b.id !== id);
          const { aspects, events } = recalculateAll(behaviors, s.onboarding.focusAspects);
          return { behaviors, aspects, evolutionEvents: [...events, ...s.evolutionEvents].slice(0, 100) };
        });
      },

      saveReflection: (promptId, prompt, response) => {
        const now = Date.now();
        const reflection: Reflection = {
          id: `r-${now.toString(36)}`,
          day: new Date(now).toISOString().slice(0, 10),
          promptId: promptId as Reflection['promptId'],
          prompt,
          response: response.trim(),
          timestamp: now,
        };
        set((s) => ({ reflections: [reflection, ...s.reflections] }));
      },

      markEventsSeen: () =>
        set((s) => ({
          evolutionEvents: s.evolutionEvents.map((e) => (e.seen ? e : { ...e, seen: true })),
        })),

      recordSuggestionShown: () =>
        set((s) => ({ suggestionStats: { ...s.suggestionStats, shown: s.suggestionStats.shown + 1 } })),

      recordSuggestionAccepted: () =>
        set((s) => ({
          suggestionStats: { ...s.suggestionStats, accepted: s.suggestionStats.accepted + 1 },
        })),

      resetAll: () => set({ ...INITIAL_STATE, createdAt: Date.now() }),
    }),
    {
      name: 'evolve-store-v1',
      partialize: (state) => {
        // Persist data only — actions are recreated on load.
        const {
          completeOnboarding: _c,
          setPreferences: _p,
          logBehavior: _l,
          editBehavior: _e,
          deleteBehavior: _d,
          saveReflection: _r,
          markEventsSeen: _m,
          recordSuggestionShown: _s1,
          recordSuggestionAccepted: _s2,
          resetAll: _x,
          ...data
        } = state;
        void _c;
        void _p;
        void _l;
        void _e;
        void _d;
        void _r;
        void _m;
        void _s1;
        void _s2;
        void _x;
        return data as EvolveState;
      },
    },
  ),
);

// Re-export for UI/tests convenience.
export { clampEnergy, updateMomentum, zeroWeights };
