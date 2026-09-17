import { useEffect, useState } from 'react';
import { useEvolve } from '@/state/store';
import { ASPECTS } from '@/domain/aspects';
import type { AspectId, AspectWeights, Rhythm } from '@/domain/types';
import { zeroWeights } from '@/domain/types';
import { announce } from '@/lib/announce';
import { aspectColor } from '@/lib/color';

/**
 * Five-screen onboarding (blueprint §3.1). Target: under 90 seconds.
 * Screen 4's "first action" is completed *inside* onboarding so screen 5's
 * world reveal already carries the first visible warmth (§3.1 screen 5).
 */

const STEPS = ['Welcome', 'What matters', 'Rhythm', 'First action', 'Reveal'] as const;

/** Three easy cross-dimension starters (§3.1 screen 4). */
const FIRST_ACTIONS: { id: string; title: string; sub: string; weights: Partial<AspectWeights> }[] = [
  { id: 'water', title: 'Drink a glass of water', sub: 'Grounding · takes 30 seconds', weights: { grounding: 0.6 } },
  { id: 'step-out', title: 'Step outside for 3 minutes', sub: 'Grounding + Agency · a little air', weights: { grounding: 0.6, agency: 0.3 } },
  { id: 'kind-message', title: 'Send one kind message', sub: 'Connection · small packets travel far', weights: { connection: 0.7, expression: 0.3 } },
];

export default function Onboarding() {
  const completeOnboarding = useEvolve((s) => s.completeOnboarding);
  const logBehavior = useEvolve((s) => s.logBehavior);

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<AspectId[]>([]);
  const [rhythm, setRhythm] = useState<Rhythm>('light');
  const [chosenAction, setChosenAction] = useState<string | null>(null);

  useEffect(() => {
    announce(`Onboarding step ${step + 1} of 5: ${STEPS[step]}`);
  }, [step]);

  const toggleAspect = (id: AspectId) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : prev.length >= 3 ? prev : [...prev, id],
    );

  const pickAction = (actionId: string) => {
    const action = FIRST_ACTIONS.find((a) => a.id === actionId);
    if (action) {
      logBehavior({
        title: action.title,
        effort: 'tiny',
        aspectWeights: { ...zeroWeights(), ...action.weights } as AspectWeights,
        mappingSource: 'catalog',
        source: 'system_suggestion',
      });
    }
    setChosenAction(actionId);
    setStep(4);
  };

  return (
    <div className="onboarding">
      <div className="onboarding__progress" aria-hidden="true">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`onboarding__progress-dot${i <= step ? ' onboarding__progress-dot--done' : ''}`}
          />
        ))}
      </div>

      {step === 0 && (
        <div className="onboarding__body">
          <p className="onboarding__eyebrow">Welcome</p>
          <h1 className="onboarding__title">Your life is already growing. Let&rsquo;s see where.</h1>
          <p className="t-mid">
            Evolve is a quiet companion for noticing what you already do — and letting small,
            real actions warm seven parts of your life.
          </p>
          <p className="t-small t-faint">Nothing to configure. Two minutes, no accounts.</p>
        </div>
      )}

      {step === 1 && (
        <div className="onboarding__body">
          <p className="onboarding__eyebrow">Choose what matters</p>
          <h1 className="onboarding__title">Pick 1–3 areas to follow closely</h1>
          <p className="t-small t-mid">
            The other dimensions stay part of your world — everything you do still counts
            everywhere. This only decides where we look first.
          </p>
          <div className="aspect-grid" role="group" aria-label="Life dimensions">
            {ASPECTS.map((a) => {
              const isSel = selected.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  className={`aspect-card${isSel ? ' aspect-card--selected' : ''}`}
                  aria-pressed={isSel}
                  onClick={() => toggleAspect(a.id)}
                >
                  <span
                    className="aspect-card__dot"
                    style={{
                      background: aspectColor(a.hue, 0.55),
                      boxShadow: isSel ? `0 0 12px ${aspectColor(a.hue, 0.9)}` : undefined,
                    }}
                  />
                  <span className="aspect-card__name">{a.focusName}</span>
                  <span className="aspect-card__chakra">{a.chakraName}</span>
                  <span className="aspect-card__essence">{a.essence}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="onboarding__body">
          <p className="onboarding__eyebrow">Pick a starting rhythm</p>
          <h1 className="onboarding__title">How big should the first steps be?</h1>
          <div className="option-list" role="radiogroup" aria-label="Starting rhythm">
            {(
              [
                { id: 'tiny', title: 'Tiny — 2 minutes', sub: 'Smallest possible actions. Momentum first.' },
                { id: 'light', title: 'Light — 10 minutes', sub: 'A gentle but visible effort.' },
                { id: 'open', title: 'Open-ended — I’ll log naturally', sub: 'No size expectations at all.' },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={rhythm === o.id}
                className={`option${rhythm === o.id ? ' option--selected' : ''}`}
                onClick={() => setRhythm(o.id)}
              >
                <span className="option__title">{o.title}</span>
                <span className="option__sub">{o.sub}</span>
              </button>
            ))}
          </div>
          <p className="t-xs t-faint">You can change this anytime. Rhythm shapes suggestions, never rules.</p>
        </div>
      )}

      {step === 3 && (
        <div className="onboarding__body">
          <p className="onboarding__eyebrow">First action</p>
          <h1 className="onboarding__title">One tiny thing, right now</h1>
          <p className="t-small t-mid">
            Pick one and do it — your world warms the moment you return. Or skip; the world
            waits kindly either way.
          </p>
          <div className="option-list">
            {FIRST_ACTIONS.map((a) => (
              <button key={a.id} type="button" className="option" onClick={() => pickAction(a.id)}>
                <span className="option__title">{a.title}</span>
                <span className="option__sub">{a.sub}</span>
              </button>
            ))}
          </div>
          <button type="button" className="btn btn--quiet t-sm" onClick={() => setStep(4)}>
            I’ll start later
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="onboarding__body onboarding__body--center">
          <p className="onboarding__eyebrow">Reveal</p>
          <h1 className="onboarding__title">
            {chosenAction ? 'First warmth planted' : 'Your world is waiting'}
          </h1>
          <p className="t-mid">
            {chosenAction
              ? 'Your seven dimensions are quiet, but one is already glowing. Small and real beats big and someday.'
              : 'Seven dimensions, mostly muted for now. Everything you log next will warm them.'}
          </p>
          {selected.length > 0 && (
            <p className="t-xs t-faint">
              We’ll watch {selected.length === 1 ? 'one area' : `${selected.length} areas`} a little
              more closely — the rest stay in the world too.
            </p>
          )}
        </div>
      )}

      <div className="onboarding__actions">
        {step === 0 && (
          <button className="btn btn--primary btn--lg" onClick={() => setStep(1)}>
            Begin
          </button>
        )}
        {step === 1 && (
          <>
            <button
              className="btn btn--primary btn--lg"
              disabled={selected.length === 0}
              onClick={() => setStep(2)}
            >
              {selected.length === 0 ? 'Choose at least one' : `Continue (${selected.length} chosen)`}
            </button>
            <button className="btn btn--quiet" onClick={() => setStep(0)}>
              Back
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <button className="btn btn--primary btn--lg" onClick={() => setStep(3)}>
              Continue
            </button>
            <button className="btn btn--quiet" onClick={() => setStep(1)}>
              Back
            </button>
          </>
        )}
        {step === 3 && (
          <button className="btn btn--quiet" onClick={() => setStep(2)}>
            Back
          </button>
        )}
        {step === 4 && (
          <button
            className="btn btn--primary btn--lg"
            onClick={() => completeOnboarding({ focusAspects: selected, rhythm })}
          >
            Enter your world
          </button>
        )}
      </div>
    </div>
  );
}
