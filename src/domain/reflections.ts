import type { ReflectionPromptId } from './types';

/**
 * Daily reflection (blueprint §9.3): one question only, rotating.
 */

export const REFLECTION_PROMPTS: { id: ReflectionPromptId; text: string }[] = [
  { id: 'energy', text: 'What gave you energy today?' },
  { id: 'meaning', text: 'What felt meaningful?' },
  { id: 'courage', text: 'Where did you show courage?' },
  { id: 'connection', text: 'What helped you feel connected?' },
  { id: 'tomorrow', text: 'What would make tomorrow 1% easier?' },
];

/** Local-time day key, e.g. '2026-09-17' — timezone-safe day identity (§32). */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Stable rotation: each day gets the same prompt all day, then it moves on. */
export function promptForDay(key: string = dayKey()): { id: ReflectionPromptId; text: string } {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return REFLECTION_PROMPTS[hash % REFLECTION_PROMPTS.length];
}
