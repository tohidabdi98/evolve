/** Placeholder for the Me tab — profile, history, settings (§9.1, §23). Replaced in step 7. */
export default function MeScreen() {
  return (
    <div className="screen">
      <header className="stack gap-2">
        <p className="onboarding__eyebrow">Me</p>
        <h1 className="t-display">Your journey</h1>
        <p className="t-small t-muted">History, settings, and data controls arrive in step 7.</p>
      </header>
      <div className="placeholder">
        <p>Nothing recorded yet. Your world is still here.</p>
      </div>
    </div>
  );
}
