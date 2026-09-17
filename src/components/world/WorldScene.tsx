import type { AspectId, UserAspect } from '@/domain/types';
import { ASPECTS } from '@/domain/aspects';
import { aspectColor, aspectGlow, warmthFor } from '@/lib/color';

/**
 * The living world (blueprint §8.2, §7.2, §21.2). One layered SVG scene;
 * each aspect owns a region along the vertical axis — roots at the base,
 * sky at the crown. Every region's presence, saturation and glow are pure
 * functions of that aspect's warmth (recent attention), so a faded aspect
 * looks peaceful and dormant, never broken (§7.3).
 *
 * Sky band   — Meaning (stars, constellation, horizon glow)
 * Ribbons    — Expression (wind)
 * Sun + path — Agency
 * Bridge     — Connection (birds arrive with warmth)
 * Pool       — Reflection (lanterns)
 * Stream     — Creativity (flowers bloom)
 * Ground     — Grounding (stones, roots)
 */

const STARS: readonly (readonly [number, number, number])[] = [
  [40, 38, 1.4], [78, 72, 1.0], [120, 30, 1.7], [160, 58, 1.1], [205, 42, 1.5],
  [248, 78, 1.0], [288, 35, 1.6], [322, 64, 1.2], [60, 95, 1.0], [110, 88, 1.3],
  [180, 15, 1.2], [265, 15, 1.1], [300, 95, 1.0], [350, 45, 1.3],
];

const LANTERNS: readonly (readonly [number, number])[] = [[150, 338], [185, 346], [215, 336]];

const FLOWERS: readonly (readonly [number, number])[] = [
  [70, 462], [105, 470], [150, 474], [250, 468], [290, 460],
];

function warmthMap(aspects: Record<AspectId, UserAspect>): Record<AspectId, number> {
  return Object.fromEntries(
    ASPECTS.map((a) => [a.id, warmthFor(aspects[a.id].energy, aspects[a.id].momentum)]),
  ) as Record<AspectId, number>;
}

export default function WorldScene({
  aspects,
  reducedMotion,
}: {
  aspects: Record<AspectId, UserAspect>;
  reducedMotion: boolean;
}) {
  const w = warmthMap(aspects);
  const presence = (id: AspectId) => 0.12 + 0.88 * w[id]; // dormant stays faintly present

  const starsShown = 4 + Math.round(w.meaning * (STARS.length - 4));
  const flowerScale = (id: number) => 0.45 + 0.55 * w.creativity + id * 0.001;

  return (
    <div className={`scene${reducedMotion ? ' scene--reduced' : ''}`} aria-hidden="true">
      <svg className="scene__svg" viewBox="0 0 360 540" role="presentation" focusable="false">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#141a2e" />
            <stop offset="0.55" stopColor="#1a2033" />
            <stop offset="1" stopColor="#22242e" />
          </linearGradient>
          <radialGradient id="horizonGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={aspectColor(290, w.meaning)} stopOpacity={0.5} />
            <stop offset="1" stopColor={aspectColor(290, w.meaning)} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={aspectColor(46, w.agency)} stopOpacity={aspectGlow(w.agency)} />
            <stop offset="1" stopColor={aspectColor(46, w.agency)} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pathGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={aspectColor(46, w.agency * 0.5)} />
            <stop offset="1" stopColor={aspectColor(46, w.agency)} />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#262b31" />
            <stop offset="1" stopColor="#181c22" />
          </linearGradient>
          <radialGradient id="poolGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={aspectColor(255, 0.35)} stopOpacity="0.55" />
            <stop offset="1" stopColor="#1b2030" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="360" height="540" fill="url(#skyGrad)" />

        {/* Meaning — stars + constellation + horizon glow */}
        <g style={{ opacity: presence('meaning'), transition: 'opacity 700ms var(--ease-soft)' }}>
          <ellipse cx="180" cy="112" rx="190" ry="70" fill="url(#horizonGlow)" />
          {STARS.slice(0, starsShown).map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={aspectColor(290, 0.7)} style={{ transition: 'fill 700ms var(--ease-soft)' }} />
          ))}
          <g stroke={aspectColor(290, 0.5)} strokeWidth="0.6" style={{ opacity: 0.1 + 0.25 * w.meaning }}>
            <line x1="40" y1="38" x2="78" y2="72" />
            <line x1="78" y1="72" x2="120" y2="30" />
            <line x1="120" y1="30" x2="160" y2="58" />
          </g>
        </g>

        {/* Expression — wind ribbons */}
        <g
          className="scene__ribbons"
          style={{ opacity: presence('expression'), transition: 'opacity 700ms var(--ease-soft)' }}
          fill="none"
          strokeLinecap="round"
        >
          <path
            d="M18,128 C80,100 140,156 205,122 S320,132 342,108"
            stroke={aspectColor(210, 0.6)}
            strokeWidth="2.5"
            strokeDasharray="7 9"
          />
          <path
            d="M30,158 C110,132 190,178 260,148 S330,158 344,142"
            stroke={aspectColor(210, 0.4)}
            strokeWidth="1.8"
            strokeDasharray="5 11"
          />
        </g>

        {/* Agency — sun with rays, and a winding path up the hill */}
        <g style={{ opacity: presence('agency'), transition: 'opacity 700ms var(--ease-soft)' }}>
          <circle cx="262" cy="196" r="46" fill="url(#sunGlow)" />
          <circle cx="262" cy="196" r="15" fill={aspectColor(46, 0.85)} style={{ transition: 'fill 700ms var(--ease-soft)' }} />
          <g stroke={aspectColor(46, 0.7)} strokeWidth="1.6" strokeLinecap="round" style={{ opacity: 0.25 + 0.6 * w.agency }}>
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i * Math.PI) / 4;
              return (
                <line
                  key={i}
                  x1={262 + Math.cos(a) * 21}
                  y1={196 + Math.sin(a) * 21}
                  x2={262 + Math.cos(a) * 29}
                  y2={196 + Math.sin(a) * 29}
                />
              );
            })}
          </g>
          <polygon points="288,470 302,470 250,306 236,306" fill="url(#pathGrad)" style={{ transition: 'fill 700ms var(--ease-soft)' }} />
        </g>

        {/* Connection — bridge + birds */}
        <g style={{ opacity: presence('connection'), transition: 'opacity 700ms var(--ease-soft)' }}>
          <g stroke={aspectColor(145, 0.55)} strokeWidth="2.4" fill="none" strokeLinecap="round" style={{ transition: 'stroke 700ms var(--ease-soft)' }}>
            <path d="M52,296 Q180,252 308,296" />
            <path d="M52,286 Q180,242 308,286" strokeWidth="1.4" />
            <line x1="98" y1="268" x2="98" y2="280" strokeWidth="1.2" />
            <line x1="180" y1="256" x2="180" y2="268" strokeWidth="1.2" />
            <line x1="262" y1="268" x2="262" y2="280" strokeWidth="1.2" />
          </g>
          <g
            className="scene__birds"
            stroke={aspectColor(145, 0.8)}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            style={{ opacity: Math.min(1, w.connection * 1.6), transition: 'opacity 700ms var(--ease-soft)' }}
          >
            <path d="M92,236 Q97,231 102,236 M102,236 Q107,231 112,236" />
            <path d="M124,218 Q128,214 132,218 M132,218 Q136,214 140,218" />
          </g>
        </g>

        {/* Reflection — pool with lanterns */}
        <g style={{ opacity: presence('reflection'), transition: 'opacity 700ms var(--ease-soft)' }}>
          <ellipse cx="180" cy="344" rx="92" ry="20" fill="url(#poolGrad)" style={{ transition: 'fill 700ms var(--ease-soft)' }} />
          <ellipse cx="180" cy="342" rx="70" ry="12" fill="none" stroke={aspectColor(255, 0.4)} strokeWidth="0.8" style={{ opacity: 0.3 + 0.4 * w.reflection }} />
          {LANTERNS.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="6" fill={aspectColor(255, 0.8)} opacity={aspectGlow(w.reflection) * 0.9} />
              <circle cx={x} cy={y} r="2.4" fill={aspectColor(255, 0.95)} style={{ transition: 'fill 700ms var(--ease-soft)' }} />
            </g>
          ))}
        </g>

        {/* Creativity — stream + flowers */}
        <g style={{ opacity: presence('creativity'), transition: 'opacity 700ms var(--ease-soft)' }}>
          <path
            d="M-10,500 C80,470 150,510 220,480 S320,500 370,474"
            fill="none"
            stroke={aspectColor(28, 0.25)}
            strokeWidth="10"
            strokeLinecap="round"
            style={{ opacity: 0.35 + 0.45 * w.creativity, transition: 'stroke 700ms var(--ease-soft), opacity 700ms var(--ease-soft)' }}
          />
          {FLOWERS.map(([x, y], i) => {
            const s = flowerScale(i);
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${s})`} style={{ transition: 'transform 700ms var(--ease-soft)' }}>
                <line x1="0" y1="0" x2="0" y2="-9" stroke={aspectColor(145, 0.4)} strokeWidth="1.2" />
                <circle cx="0" cy="-11" r="3.2" fill={aspectColor(28, 0.9)} style={{ transition: 'fill 700ms var(--ease-soft)' }} />
                <circle cx="0" cy="-11" r="1.2" fill="#f6e7c8" />
              </g>
            );
          })}
        </g>

        {/* Grounding — mound, stones, roots (frontmost) */}
        <g style={{ opacity: presence('grounding'), transition: 'opacity 700ms var(--ease-soft)' }}>
          <path d="M0,472 Q60,452 130,460 T270,458 T360,466 L360,540 L0,540 Z" fill="url(#groundGrad)" />
          <ellipse cx="60" cy="492" rx="14" ry="9" fill={aspectColor(4, 0.3)} style={{ transition: 'fill 700ms var(--ease-soft)' }} />
          <ellipse cx="105" cy="500" rx="9" ry="6" fill={aspectColor(4, 0.2)} />
          <ellipse cx="300" cy="494" rx="12" ry="8" fill={aspectColor(4, 0.35)} style={{ transition: 'fill 700ms var(--ease-soft)' }} />
          <g stroke={aspectColor(4, 0.45)} strokeWidth="1.4" fill="none" strokeLinecap="round" style={{ opacity: 0.25 + 0.55 * w.grounding, transition: 'stroke 700ms var(--ease-soft), opacity 700ms var(--ease-soft)' }}>
            <path d="M140,502 C138,518 130,526 124,538" />
            <path d="M180,506 C182,520 190,528 196,538" />
            <path d="M250,504 C246,518 238,526 234,538" />
          </g>
        </g>
      </svg>
    </div>
  );
}
