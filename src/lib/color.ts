/**
 * Warmth → visual properties (blueprint §7.2). Pure math so UI and tests share one model.
 * Warmth means "recent attention", never worth or virtue (§7.3):
 * a faded aspect looks peaceful and dormant, not broken or bad.
 */

export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

/**
 * Interpolate an aspect hue between dormant (desaturated, cool-muted) and
 * flourishing (saturated, luminous) using the token ranges.
 */
export function aspectHsl(hue: number, warmth: number): Hsl {
  const w = clamp01(warmth);
  const s = 26 + (78 - 26) * w; // --sat-floor → --sat-ceiling
  const l = 66 - (66 - 46) * w; // bright-muted at low warmth → vivid at high
  return { h: hue, s, l };
}

export function hslCss({ h, s, l }: Hsl): string {
  return `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`;
}

export function aspectColor(hue: number, warmth: number): string {
  return hslCss(aspectHsl(hue, warmth));
}

/** Glow strength for shadows/gradients, 0..1 alpha-ish multiplier. */
export function aspectGlow(warmth: number): number {
  const w = clamp01(warmth);
  return 0.08 + (0.55 - 0.08) * w; // --glow-alpha-floor → --glow-alpha-ceiling
}

/**
 * Secondary tone for gradients/leaves: hue drifts toward warm amber as an
 * aspect flourishes (§7.2 "warmer, richer"). Pure function of hue + warmth.
 */
export function aspectColorRich(hue: number, warmth: number): string {
  const w = clamp01(warmth);
  const drifted = hue + 18 * w;
  const { s, l } = aspectHsl(hue, Math.min(1, w * 1.15));
  return `hsl(${drifted.toFixed(1)}, ${(s + 6).toFixed(1)}%, ${(l - 8).toFixed(1)}%)`;
}

/** Six evolution stages (§8.3). Index derived from energy. */
export const STAGES = [
  'Dormant',
  'Seed',
  'Sprout',
  'Established',
  'Flourishing',
  'Radiant',
] as const;

export type Stage = (typeof STAGES)[number];

/**
 * Stage thresholds on 0..1000 energy (§8.3, §6.1). Stage changes should be
 * infrequent and memorable, so thresholds are spaced toward the top.
 */
export const STAGE_THRESHOLDS: readonly number[] = [0, 60, 180, 380, 620, 850];

export function stageForEnergy(energy: number): Stage {
  const e = Math.min(1000, Math.max(0, energy));
  let idx = 0;
  for (let i = 0; i < STAGE_THRESHOLDS.length; i++) {
    if (e >= STAGE_THRESHOLDS[i]) idx = i;
  }
  return STAGES[idx];
}

export function stageIndex(stage: Stage): number {
  return STAGES.indexOf(stage);
}

/**
 * Warmth (0..1) from energy + momentum (§6.3):
 * recent energy drives saturation; long-term energy keeps a soft base tint.
 */
export function warmthFor(energy: number, momentum: number): number {
  const e = clamp01(energy / 1000);
  const m = clamp01(momentum);
  return clamp01(0.25 * e + 0.6 * m + 0.15 * e * m);
}
