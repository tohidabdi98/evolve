import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AspectId,
  AspectWeights,
  Behavior,
  EvolveState,
  Preferences,
  Rhythm,
} from '@/domain/types';
import { ASPECT_IDS, zeroWeights } from '@/domain/types';

function freshAspects(): Record<AspectId, { energy: number; momentum: number; lifetimeActions: number; lastActivityAt: number | null }> {
  return Object.fromEntries(
    ASPECT_IDS.map((id) => [id, { energy: 0, momentum: 0, lifetimeActions: 0, lastActivityAt: null }]),
  ) as Record<AspectId, { energy: number; momentum: number; lifetimeActions: number; lastActivityAt: number | null }>;
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

export interface EvolveStore extends EvolveState {
  /** Onboarding §3: focus aspects (1–3), rhythm, chakra-name preference. */
  completeOnboarding: (input: {
    focusAspects: AspectId[];
    rhythm: Rhythm;
    chakraNamesShown?: boolean;
  }) => void;
  setPreferences: (patch: Partial<Preferences>) => void;
  /** Stub until the growth engine lands in step 2. */
  addBehaviorStub: (input: {
    title: string;
    effort: Behavior['effort'];
    aspectWeights: AspectWeights;
  }) => void;
  resetAll: () => void;
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
          preferences: { ...s.preferences, chakraNames: chakraNamesShown ?? s.preferences.chakraNames },
        })),

      setPreferences: (patch) => set((s) => ({ preferences: { ...s.preferences, ...patch } })),

      addBehaviorStub: ({ title, effort, aspectWeights }) =>
        set((s) => {
          const now = Date.now();
          const behavior: Behavior = {
            id: `b-${now}-${Math.random().toString(36).slice(2, 7)}`,
            title,
            effort,
            aspectWeights: aspectWeights ?? zeroWeights(),
            source: 'manual',
            timestamp: now,
            mappingSource: 'user',
            userConfirmed: true,
            createdAt: now,
          };
          return { behaviors: [behavior, ...s.behaviors] };
        }),

      resetAll: () => set({ ...INITIAL_STATE, createdAt: Date.now() }),
    }),
    {
      name: 'evolve-store-v1',
      partialize: (state) => {
        // Persist data only — actions are recreated on load.
        const { completeOnboarding: _c, setPreferences: _p, addBehaviorStub: _a, resetAll: _r, ...data } =
          state;
        void _c;
        void _p;
        void _a;
        void _r;
        return data as EvolveState;
      },
    },
  ),
);
