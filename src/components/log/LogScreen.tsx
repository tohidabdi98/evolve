import { useEffect, useMemo, useRef, useState } from 'react';
import { useEvolve } from '@/state/store';import { BEHAVIOR_CATALOG } from '@/domain/behaviorCatalog';import { classifyBehavior, effortFromMinutes, minutesForEffort, parseMinutesFromText } from '@/domain/classifier';
import { ASPECTS } from '@/domain/aspects';
import { aspectColor } from '@/lib/color';
import { timeAgo } from '@/lib/time';
import MappingCard, { type MappingDraft } from './MappingCard';
import { announce } from '@/lib/announce';

/**
 * Logging flow (blueprint §5.1 A+B, §5.3, §18.1, §28):
 * natural-language input with classified mapping shown for confirmation,
 * one-tap catalog quick picks, and a recent history with edit/delete.
 * Structured habits arrive later (§5.1C, Phase 2).
 */

type Draft = MappingDraft & {
  mappingSource: 'classifier' | 'catalog' | 'user';
  needsConfirm: boolean;
};

const UNCERTAIN_BELOW = 0.55; // §18.1: confirm when uncertainty is material

function draftFromText(text: string): Draft {
  const cls = classifyBehavior(text);
  const minutes = parseMinutesFromText(text) ?? minutesForEffort(cls.entry?.defaultEffort ?? 'light');
  return {
    title: cls.title,
    weights: cls.weights,
    effort: effortFromMinutes(minutes),
    durationMinutes: minutes,
    mappingSource: cls.entry ? 'classifier' : 'user',
    needsConfirm: !cls.entry || cls.confidence < UNCERTAIN_BELOW,
  };
}

export default function LogScreen() {
  const behaviors = useEvolve((s) => s.behaviors);
  const logBehavior = useEvolve((s) => s.logBehavior);
  const editBehavior = useEvolve((s) => s.editBehavior);
  const deleteBehavior = useEvolve((s) => s.deleteBehavior);
  const reducedMotion = useEvolve((s) => s.preferences.reducedMotion);

  const [text, setText] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const recent = useMemo(() => behaviors.slice(0, 10), [behaviors]);

  // Bring the mapping card into a comfortable position (never under the tab bar).
  useEffect(() => {
    if (!draft && !editingId) return;
    const prefersReduced =
      reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    mapRef.current?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
  }, [draft, editingId, reducedMotion]);

  const startDraft = (t: string) => {
    const trimmed = t.trim();
    if (!trimmed) return;
    setDraft(draftFromText(trimmed));
    setText('');
  };

  const quickPick = (id: string) => {
    const entry = BEHAVIOR_CATALOG.find((e) => e.id === id);
    if (!entry) return;
    const minutes = minutesForEffort(entry.defaultEffort);
    setDraft({
      title: entry.label,
      weights: entry.weights,
      effort: effortFromMinutes(minutes),
      durationMinutes: minutes,
      mappingSource: 'catalog',
      needsConfirm: false,
    });
  };

  const save = (d: Draft) => {
    logBehavior({
      title: d.title,
      effort: d.effort,
      durationMinutes: d.durationMinutes,
      aspectWeights: d.weights,
      mappingSource: d.mappingSource,
    });
    announce(`Logged ${d.title}. Your world grew a little warmer.`);
    setDraft(null);
  };

  const startEdit = (id: string) => {
    const b = behaviors.find((x) => x.id === id);
    if (!b) return;
    setEditingId(id);
    setEditDraft({
      title: b.title,
      weights: { ...b.aspectWeights },
      effort: b.effort,
      durationMinutes: b.durationMinutes ?? minutesForEffort(b.effort),
      mappingSource: 'user',
      needsConfirm: false,
    });
  };

  const commitEdit = () => {
    if (!editingId || !editDraft) return;
    editBehavior(editingId, {
      title: editDraft.title,
      effort: editDraft.effort,
      durationMinutes: editDraft.durationMinutes,
      aspectWeights: editDraft.weights,
    });
    setEditingId(null);
    setEditDraft(null);
  };

  return (
    <div className="screen">
      <header className="stack gap-2">
        <p className="onboarding__eyebrow">Log</p>
        <h1 className="t-display">What did you do?</h1>
        <p className="t-small t-muted">Your words, your meaning — review the mapping before it saves.</p>
      </header>

      {/* A. Natural-language log (§5.1B) */}
      <form
        className="log-form"
        onSubmit={(e) => {
          e.preventDefault();
          startDraft(text);
        }}
      >
        <textarea
          className="log-form__input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I cooked dinner and talked to my friend…"
          rows={2}
          aria-label="Describe what you did in your own words"
        />
        <button className="btn btn--primary" type="submit" disabled={!text.trim()}>
          Map it
        </button>
      </form>

      {/* B. Quick picks (§5.1A) */}
      <section aria-label="Quick picks">
        <p className="t-xs t-faint" style={{ margin: '0 0 var(--space-2)' }}>OR TAP ONE</p>
        <div className="quick-grid">
          {BEHAVIOR_CATALOG.slice(0, 8).map((e) => (
            <button key={e.id} className="btn btn--ghost quick-grid__btn" onClick={() => quickPick(e.id)}>
              {e.label}
            </button>
          ))}
        </div>
      </section>

      {/* Mapping confirmation (§5.3, §18.1) */}
      <div ref={mapRef}>
        {draft && (
          <MappingCard
            heading={draft.needsConfirm ? 'Does this mapping feel right?' : 'Ready to save'}
            draft={draft}
            onChange={(d) => setDraft((prev) => (prev ? { ...prev, ...d } : { ...d, mappingSource: 'classifier' as const, needsConfirm: false }))}
            onSave={() => save(draft)}
            onCancel={() => setDraft(null)}
            saveLabel="Save to my world"
          />
        )}
      </div>

      {/* Recent history with edit/delete (§28) */}
      <section aria-label="Recent actions" className="stack gap-2">
        <h2 className="t-sm t-faint" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Recent
        </h2>
        {recent.length === 0 && <p className="t-small t-faint">Nothing logged yet — the first one is the hardest.</p>}
        {recent.map((b) =>
          editingId === b.id && editDraft ? (
            <div key={b.id} className="hist-card hist-card--editing">
              <input
                className="hist-card__title-input"
                value={editDraft.title}
                onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })}
                aria-label="Behavior title"
              />
              <MappingCard
                heading="Adjust what it meant"
                draft={editDraft}
                onChange={(d) => setEditDraft((prev) => (prev ? { ...prev, ...d } : { ...d, mappingSource: 'user' as const, needsConfirm: false }))}
                onSave={commitEdit}
                onCancel={() => {
                  setEditingId(null);
                  setEditDraft(null);
                }}
                saveLabel="Save changes"
              />
            </div>
          ) : (
            <div key={b.id} className="hist-card">
              <div className="hist-card__main">
                <span className="hist-card__title">{b.title}</span>
                <span className="hist-card__meta">
                  {b.effort} · {timeAgo(b.timestamp)}
                </span>
              </div>
              <div className="hist-card__dots" aria-hidden="true">
                {ASPECTS.filter((a) => b.aspectWeights[a.id] > 0).map((a) => (
                  <span
                    key={a.id}
                    className="hist-card__dot"
                    style={{ background: aspectColor(a.hue, 0.7), opacity: 0.35 + 0.65 * b.aspectWeights[a.id] }}
                    title={a.name}
                  />
                ))}
              </div>
              <div className="hist-card__actions">
                <button className="btn btn--quiet t-xs" onClick={() => startEdit(b.id)} aria-label={`Edit ${b.title}`}>
                  Edit
                </button>
                <button
                  className="btn btn--quiet t-xs"
                  onClick={() => {
                    deleteBehavior(b.id);
                    announce('Deleted. The world recalculated.');
                  }}
                  aria-label={`Delete ${b.title}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ),
        )}
      </section>
    </div>
  );
}
