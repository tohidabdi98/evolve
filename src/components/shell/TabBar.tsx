import type { Tab } from '@/App';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'world', label: 'World', icon: '🌱' },
  { id: 'log', label: 'Log', icon: '＋' },
  { id: 'me', label: 'Me', icon: '☾' },
];

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

/** Minimal navigation (§20). Labels always accompany icons — no color-only meaning (§22). */
export default function TabBar({ active, onChange }: Props) {
  return (
    <nav aria-label="Main" className="tabbar">
      <div role="tablist" aria-label="Sections" className="tabbar__list">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            aria-controls={t.id === 'world' ? 'main' : undefined}
            className={`tabbar__tab ${active === t.id ? 'tabbar__tab--active' : ''}`}
            onClick={() => onChange(t.id)}
          >
            <span aria-hidden="true" className="tabbar__icon">
              {t.icon}
            </span>
            <span className="tabbar__label">{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
