import { ASPECTS } from '@/domain/aspects';
import { STAGES, STAGE_THRESHOLDS, stageForEnergy, aspectColor } from '@/lib/color';
import { useEvolve } from '@/state/store';
import WorldScene from './WorldScene';
import DevPanel from './DevPanel';

/**
 * Home: the living world (blueprint §8). The scene carries the emotion;
 * a compact aspect list keeps the numbers legible beneath it.
 */
export default function WorldHome({ onNavigate }: { onNavigate: (tab: 'log' | 'me') => void }) {
  const aspects = useEvolve((s) => s.aspects);
  const chakraNames = useEvolve((s) => s.preferences.chakraNames);
  const reducedMotion = useEvolve((s) => s.preferences.reducedMotion);
  const events = useEvolve((s) => s.evolutionEvents);
  const markEventsSeen = useEvolve((s) => s.markEventsSeen);

  const unseen = events.filter((e) => !e.seen).slice(0, 3);
  const totalEnergy = ASPECTS.reduce((sum, a) => sum + aspects[a.id].energy, 0);
  const title = totalEnergy === 0 ? 'Still mostly quiet' : totalEnergy < 150 ? 'Warming up' : 'Alive and growing';

  return (
    <div className="screen">
      <header className="stack gap-2">
        <p className="onboarding__eyebrow">Your world</p>
        <h1 className="t-display">{title}</h1>
      </header>

      <WorldScene aspects={aspects} reducedMotion={reducedMotion} />

      {unseen.length > 0 && (
        <div className="discovery" role="status">
          <span className="discovery__spark" aria-hidden="true">✦</span>
          <div className="stack gap-1" style={{ flex: 1 }}>
            {unseen.map((e) => (
              <p key={e.id} className="t-sm" style={{ margin: 0 }}>
                Something changed here — {e.message}
              </p>
            ))}
          </div>
          <button className="btn btn--quiet t-xs" onClick={markEventsSeen}>
            I saw it
          </button>
        </div>
      )}

      <section className="spine-panel" aria-label="Seven life dimensions">
        <div className="spine">
          {[...ASPECTS].reverse().map((a) => {
            const state = aspects[a.id];
            const stage = stageForEnergy(state.energy);
            return (
              <div key={a.id} role="listitem" className="spine__row">
                <span
                  aria-hidden="true"
                  className="spine__orb spine__orb--small"
                  style={{
                    background: aspectColor(a.hue, Math.min(1, 0.2 + state.energy / 1000)),
                    boxShadow: `0 0 ${6 + 14 * (state.energy / 1000)}px ${aspectColor(a.hue, Math.min(1, state.energy / 1000 + 0.3))}`,
                  }}
                />
                <div className="spine__labels">
                  <span className="spine__name">{chakraNames ? a.chakraName : a.name}</span>
                  <span className="spine__sub">{a.worldElement}</span>
                </div>
                <span className="spine__state t-right">
                  {stage} · {Math.round(state.energy)}/1000
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <DevPanel />

      <button className="btn btn--primary btn--lg" onClick={() => onNavigate('log')}>
        ＋ I did something
      </button>
      <button className="btn btn--ghost" onClick={() => onNavigate('me')}>
        Me &amp; history
      </button>

      <p className="ladder" aria-label="Evolution stages">
        {STAGES.map((s, i) => (
          <span key={s} className="ladder__chip">
            <span
              className="ladder__dot"
              style={{ background: `hsl(42, 30%, ${25 + i * 12}%)` }}
              aria-hidden="true"
            />
            {i < STAGES.length - 1 ? (
              <>
                <b>{s}</b> at {STAGE_THRESHOLDS[i]}
              </>
            ) : (
              <b>{s}</b>
            )}
          </span>
        ))}
      </p>
    </div>
  );
}
