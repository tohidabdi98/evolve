import { useRef, useState } from 'react';
import type { AspectId, AspectWeights, Effort } from '@/domain/types';
import { ASPECTS } from '@/domain/aspects';
import { aspectColor } from '@/lib/color';
import { effortFromMinutes } from '@/domain/classifier';

/**
 * Mapping confirmation (§5.3, §18.1) — redesigned per user feedback:
 * the user never sets abstract factor values between 0 and 1. They say
 * *what* they did and *about how long*; the engine derives everything else.
 * The card shows what each aspect will receive (read-only) and lets them
 * tick aspects off if the classifier guessed the mix wrong. Effort follows
 * the minutes automatically; an override hides under "Adjust mix…".
 */

export interface MappingDraft {
  title: string;
  weights: AspectWeights;
  effort: Effort;
  durationMinutes?: number;
}

const EFFORTS: readonly { id: Effort; label: string }[] = [
  { id: 'tiny', label: 'Tiny' },
  { id: 'light', label: 'Light' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'substantial', label: 'Substantial' },
];

export default function MappingCard({
  heading,
  draft,
  onChange,
  onSave,
  onCancel,
  saveLabel,
}: {
  heading: string;
  draft: MappingDraft;
  onChange: (d: MappingDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel: string;
}) {
  const [showTweaks, setShowTweaks] = useState(false);
  const [removed, setRemoved] = useState<ReadonlySet<AspectId>>(new Set());
  // Weights the classifier suggested, so removing a chip can restore it later.
  const originalWeights = useRef<AspectWeights>({ ...draft.weights });

  const toggleAspect = (id: AspectId) => {
    const next = new Set(removed);
    const isRemoving = !next.has(id);
    if (isRemoving) next.add(id);
    else next.delete(id);
    setRemoved(next);
    const restore = originalWeights.current[id] || 0.5;
    onChange({ ...draft, weights: { ...draft.weights, [id]: isRemoving ? 0 : restore } });
  };

  const addAspect = (id: AspectId) => {
    const next = new Set(removed);
    next.delete(id);
    setRemoved(next);
    const restore = originalWeights.current[id] || 0.5;
    onChange({ ...draft, weights: { ...draft.weights, [id]: restore } });
  };

  const activeAspects = ASPECTS.filter((a) => (draft.weights[a.id] ?? 0) > 0);
  const totalWeight = activeAspects.reduce((sum, a) => sum + (draft.weights[a.id] ?? 0), 0);

  // Whether the user has manually pinned effort (kept across re-renders).
  const [overridden, setOverridden] = useState(false);
  const overriddenRef = useRef(overridden);
  overriddenRef.current = overridden;

  const setMinutes = (m: number) => {
    const clamped = Math.max(1, Math.min(240, Math.round(m)));
    // Time spent is the effort signal (§6.2) — re-derive unless overridden.
    const effort = overriddenRef.current ? draft.effort : effortFromMinutes(clamped);
    onChange({ ...draft, durationMinutes: clamped, effort });
  };

  return (
    <section className="card mapping" aria-label="Aspect mapping">
      <p className="t-sm" style={{ margin: 0, fontWeight: 700 }}>{heading}</p>
      <p className="mapping__title t-mid">{draft.title}</p>

      {/* Time spent — the only size input (§6.2). Effort follows automatically. */}
      <div className="mapping__time">
        <label className="mapping__time-label" htmlFor="mapping-minutes">
          About how long?
        </label>
        <div className="mapping__stepper" role="group" aria-label="Time spent in minutes">
          <button
            type="button"
            className="mapping__step"
            onClick={() => setMinutes((draft.durationMinutes ?? 15) - 5)}
            aria-label="5 minutes less"
          >
            −
          </button>
          <input
            id="mapping-minutes"
            className="mapping__minutes"
            type="number"
            inputMode="numeric"
            min={1}
            max={240}
            value={draft.durationMinutes ?? ''}
            placeholder="15"
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
          <span className="mapping__unit" aria-hidden="true">min</span>
          <button
            type="button"
            className="mapping__step"
            onClick={() => setMinutes((draft.durationMinutes ?? 15) + 5)}
            aria-label="5 minutes more"
          >
            +
          </button>
        </div>
      </div>

      {/* What it nourishes — shown, not tuned. Ticks replace 0..1 sliders. */}
      <div className="mapping__nourish" aria-label="What this nourishes">
        <p className="t-xs t-faint" style={{ margin: 0 }}>WILL WARM</p>
        {activeAspects.length === 0 ? (
          <p className="t-small t-faint" style={{ margin: 0 }}>
            Tick what this gave you below — that becomes personalization (§5.3).
          </p>
        ) : (
          <div className="mapping__chips">
            {activeAspects.map((a) => {
              const share = totalWeight > 0 ? (draft.weights[a.id] ?? 0) / totalWeight : 0;
              return (
                <button
                  key={a.id}
                  type="button"
                  className="mapping__chip mapping__chip--on"
                  aria-pressed
                  onClick={() => toggleAspect(a.id)}
                  title="Tap to remove from the mix"
                >
                  <span className="mapping__hue" style={{ background: aspectColor(a.hue, 0.8) }} aria-hidden="true" />
                  {a.name}
                  <span className="mapping__share">{Math.round(share * 100)}%</span>
                </button>
              );
            })}
          </div>
        )}
        {showTweaks && (
          <div className="mapping__alloptions" role="group" aria-label="Add an aspect">
            {ASPECTS.filter((a) => (draft.weights[a.id] ?? 0) === 0).map((a) => (
              <button key={a.id} type="button" className="mapping__chip" onClick={() => addAspect(a.id)}>
                <span className="mapping__hue" style={{ background: aspectColor(a.hue, 0.5) }} aria-hidden="true" />
                + {a.name}
              </button>
            ))}
          </div>
        )}
        <button type="button" className="mapping__tweak" onClick={() => setShowTweaks((v) => !v)}>
          {showTweaks ? 'Hide adjustments' : 'Adjust mix…'}
        </button>
      </div>

      {/* Effort is derived from minutes; override only for the rare case where
          time doesn't tell the whole story. */}
      {showTweaks && (
        <div className="mapping__efforts" role="group" aria-label="Effort override">
          <p className="t-xs t-faint" style={{ margin: 0, flexBasis: '100%' }}>
            EFFORT — USUALLY AUTOMATIC FROM TIME
          </p>
          {EFFORTS.map((ef) => (
            <button
              key={ef.id}
              type="button"
              className={`btn btn--ghost t-xs mapping__effort${draft.effort === ef.id ? ' mapping__effort--on' : ''}`}
              aria-pressed={draft.effort === ef.id}
              onClick={() => {
                setOverridden(true);
                onChange({ ...draft, effort: ef.id });
              }}
            >
              {ef.label}
            </button>
          ))}
        </div>
      )}

      <div className="mapping__actions">
        <button className="btn btn--primary" onClick={onSave}>
          {saveLabel}
        </button>
        <button className="btn btn--quiet" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </section>
  );
}
