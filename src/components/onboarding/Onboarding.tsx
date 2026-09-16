import { useEvolve } from '@/state/store';

/**
 * Placeholder for the five-screen onboarding flow (blueprint §3).
 * Replaced in step 3.
 */
export default function Onboarding() {
  const completeOnboarding = useEvolve((s) => s.completeOnboarding);
  return (
    <div className="onboarding">
      <div className="placeholder">
        <p className="t-display" style={{ fontSize: 'var(--text-lg)' }}>
          Your life is already growing. Let’s see where.
        </p>
        <p className="t-small t-faint">Onboarding arrives in step 3.</p>
      </div>
      <button className="btn btn--primary btn--lg" onClick={() =>
          completeOnboarding({ focusAspects: [], rhythm: 'open', chakraNamesShown: false })
        }>
        Peek at the world (dev shortcut)
      </button>
    </div>
  );
}
