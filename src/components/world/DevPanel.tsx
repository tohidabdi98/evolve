import { useEvolve } from '@/state/store';
import { CATALOG_MAP } from '@/domain/behaviorCatalog';
import { suggestEffort } from '@/domain/classifier';

const SAMPLES: { catalogId: string; label: string }[] = [
  { catalogId: 'walked-outside', label: 'Walked 20 min' },
  { catalogId: 'called-someone', label: 'Called my sister' },
  { catalogId: 'journaled', label: 'Journaled' },
  { catalogId: 'cooked-meal', label: 'Cooked dinner' },
  { catalogId: 'meditated', label: 'Meditated' },
  { catalogId: 'drank-water', label: 'Drank water' },
  { catalogId: 'did-creative', label: 'Painted for 20 min' },
  { catalogId: 'tidied-space', label: 'Cleaned my desk' },
  { catalogId: 'completed-task', label: 'Finished a task' },
  { catalogId: 'read', label: 'Read a chapter' },
];

/**
 * Step-2 preview: drive the growth engine from sample behaviors and watch the
 * aspect states respond. Removed in step 4 when real logging lands.
 */
export default function DevPanel() {
  const logBehavior = useEvolve((s) => s.logBehavior);
  const resetAll = useEvolve((s) => s.resetAll);
  const count = useEvolve((s) => s.behaviors.length);

  return (
    <section className="card card--quiet" aria-label="Developer preview panel">
      <p className="t-xs t-faint" style={{ marginBottom: 'var(--space-2)' }}>
        DEV PREVIEW — tap to log a sample behavior through the real growth engine ({count} logged)
      </p>
      <div className="devpanel__grid">
        {SAMPLES.map((s) => {
          const entry = CATALOG_MAP[s.catalogId];
          return (
            <button
              key={s.catalogId}
              className="btn btn--ghost devpanel__btn"
              onClick={() =>
                logBehavior({
                  title: s.label,
                  effort: suggestEffort(s.label, entry.defaultEffort),
                  aspectWeights: entry.weights,
                  mappingSource: 'catalog',
                })
              }
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <button className="btn btn--quiet t-xs" onClick={() => resetAll()}>
        Reset all data
      </button>
    </section>
  );
}
