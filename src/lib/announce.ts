/**
 * Polite screen-reader announcements via the #announcer live region in index.html (§22).
 * No-op outside the browser (tests/SSR).
 */
export function announce(message: string): void {
  if (typeof document === 'undefined') return;
  const el = document.getElementById('announcer');
  if (!el) return;
  // Clear-then-set so repeated identical messages are re-read.
  el.textContent = '';
  window.setTimeout(() => {
    el.textContent = message;
  }, 30);
}
