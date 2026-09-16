import { ASPECTS } from '@/domain/aspects';
import { STAGES } from '@/lib/color';
import { useEvolve } from '@/state/store';
import { stageForEnergy } from '@/lib/color';

/** Placeholder home: the seven aspects along the body's axis. Replaced/extended in step 4. */
export default function WorldHome({ onNavigate }: { onNavigate: (tab: 'log' | 'me') => void }) {
  const aspects = useEvolve((s) => s.aspects);
  const chakraNames = useEvolve((s) => s.preferences.chakraNames);

  return (
    <div className="screen">
      <header className="stack gap-2">
        <p className="onboarding__eyebrow">Your world</p>
        <h1 className="t-display">Still mostly quiet</h1>
        <p className="t-small t-muted">
          Seven dimensions of your life, resting along the body's axis — from roots at the base to
          sky at the crown. The living world arrives in step 4.
        </p>
      </header>

      <section className="spine-panel" aria-label="Seven life dimensions along the body axis">
        {/* Crown → Root: Meaning at top, Grounding at the base (body metaphor). */}
        <div className="spine">
          <div className="spine__line" aria-hidden="true" />
          {[...ASPECTS].reverse().map((a, idx) => {
            const state = aspects[a.id];
            const stage = stageForEnergy(state.energy);
            const glow = state.momentum > 0 || state.energy > 0;
            const isCrown = idx === 0;
            const isRoot = idx === ASPECTS.length - 1;
            return (
              <div key={a.id} role="listitem" className="spine__row">
                <span
                  aria-hidden="true"
                  className={`spine__orb ${isCrown ? 'spine__orb--crown' : ''} ${
                    isRoot ? 'spine__orb--root' : ''
                  }`}
                  style={{
                    background: `radial-gradient(circle at 32% 30%, hsl(${a.hue}, 34%, 62%), hsl(${a.hue}, 26%, 40%))`,
                    animationDelay: `${idx * 0.45}s`,
                    ['--orb-glow' as string]: glow
                      ? `hsla(${a.hue}, 70%, 60%, 0.5)`
                      : `hsla(${a.hue}, 30%, 45%, 0.12)`,
                  }}
                />
                <div className="spine__labels">
                  <span className="spine__name">{chakraNames ? a.chakraName : a.name}</span>
                  <span className="spine__sub">
                    {chakraNames ? a.name : a.chakraName} · {a.worldElement}
                  </span>
                </div>
                <span className="spine__state grow t-right" style={{ textAlign: 'right' }}>
                  {stage} · {state.energy}/1000
                </span>
              </div>
            );
          })}
        </div>
        <p className="spine__caption">Crown ↑ · axis of attention · ↓ Root</p>
      </section>

      <button className="btn btn--primary btn--lg" onClick={() => onNavigate('log')}>
        ＋ I did something
      </button>
      <button className="btn btn--ghost" onClick={() => onNavigate('me')}>
        Me &amp; history
      </button>
      <p className="t-xs t-faint t-center" style={{ marginBottom: 0 }}>
        {STAGES.join(' → ')}
      </p>
    </div>
  );
}
