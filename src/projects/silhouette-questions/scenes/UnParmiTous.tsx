import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, Audio, staticFile, Sequence } from "remotion";

// L'Un Parmi Tous v4 — 120 secondes (3600f @ 30fps), format vertical 1080x1920
// SVG interne 1920x1080 avec preserveAspectRatio="xMidYMid slice"
// Palette : night-palette-final-v2 (gradient atmo + brume + rim)
// Nouvelles features : foule vivante, bruit foule, yeux centre avant corps,
//   etoiles vivid, eclat cristallin, 6 sous-titres

const W = 1920;
const H = 1080;
const GROUND_Y = H * 0.75;

// Zone safe apres slice (visible = centre 1080px, soit x 420-1500)
const TEXT_LEFT  = 460;
const TEXT_RIGHT = 1460;
const TEXT_CX    = 960;

const BG       = "#050208";
const DARK     = "#0a0610";
const GLOW     = "#c8d0e8";
const BG_HORIZ = "#080d1a";

const TOTAL = 3600;

function ci(f: number, inp: number[], out: number[]): number {
  return interpolate(f, inp, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// ── Timings (frames @ 30fps) ──────────────────────────────────
const T = {
  // Phase 1 : noir + etoiles seules
  stars_appear:      0,
  stars_done:        60,   // 2s

  // Phase 2 : foule apparait + yeux actifs d'emblee
  foule_start:       90,   // 3s
  foule_done:        240,  // 8s
  foule_eyes_start:  240,  // yeux foule visibles des que la foule est placee

  // Phase 3 : sous-titres 1 et 2 (foule vivante avec yeux)
  sub1_in:           255,
  sub1_out:          480,
  osc_start:         300,
  sub2_in:           495,
  sub2_out:          750,

  // Phase 4 : les yeux du centre s'allument AVANT le corps
  center_eye_wake:   780,   // 26s — yeux seulement, imperceptibles
  center_eye_half:   960,   // 32s — yeux visibles
  center_body:       1050,  // 35s — corps commence a briller
  center_peak:       1320,  // 44s — plein eclat

  // Phase 5 : sous-titres 3 + 4 + contamination
  sub3_in:           1340,
  sub3_out:          1620,
  contaminate:       1380,
  crowd_darken:      1640,
  sub4_in:           1650,
  sub4_out:          1980,

  // Phase 6 : foule se tait — ambiance seulement
  foule_hush_end:    2100,  // bruit foule fini ici

  // Phase 7 : metaphore etoiles — sous-titres 5 + 6
  sub5_in:           2040,  // "Les etoiles aussi brillent seules dans le noir."
  sub5_out:          2310,
  sub6_in:           2370,  // "Elles brillent, que la nuit soit pleine ou vide."
  sub6_out:          2640,

  // Phase 8 : etoiles deviennent vivid pendant la metaphore
  stars_vivid_start: 2040,
  stars_vivid_peak:  2400,  // plein eclat

  // Phase 9 : eclat cristallin + titre
  stars_eclat:       2640,  // sfx-etoiles-eclat.mp3 — juste avant titre
  title_in:          2700,
  title_peak:        2760,
  title_hold:        2970,
  fade_start:        3000,
  fade_end:          TOTAL,
};

// ── Composant Sil — copie exacte showcase ────────────────────

const Sil: React.FC<{
  x: number; y: number; h?: number;
  eyeColor?: string; eyeGlow?: number; opacity?: number;
}> = ({ x, y, h = 120, eyeColor = GLOW, eyeGlow = 0, opacity = 1 }) => {
  const w = h * 0.28;
  const headR = h * 0.14;
  const torsoH = h * 0.35;
  const robe = h * 0.5;

  return (
    <g opacity={opacity}>
      {eyeGlow > 0.01 && (
        <circle cx={x} cy={y - h + headR + 10} r={headR * 4}
          fill="url(#upt-glow-white)" opacity={eyeGlow * 0.55} filter="url(#upt-halo)" />
      )}
      <path
        d={`M${x-w},${y-robe} Q${x-w*1.4},${y-10} ${x-w*0.6},${y} L${x+w*0.6},${y} Q${x+w*1.4},${y-10} ${x+w},${y-robe} Z`}
        fill={DARK}
      />
      <rect x={x-w} y={y-robe-torsoH} width={w*2} height={torsoH+10} rx={3} fill={DARK} />
      <path
        d={`M${x-w*1.1},${y-robe-torsoH+10} Q${x-w*1.2},${y-h+headR*2} ${x},${y-h} Q${x+w*1.2},${y-h+headR*2} ${x+w*1.1},${y-robe-torsoH+10} Z`}
        fill={DARK}
      />
      <ellipse cx={x} cy={y-h+headR*2.2} rx={headR*0.8} ry={headR*0.75} fill={BG} opacity={0.88} />
      <circle cx={x-headR*0.35} cy={y-h+headR*2.0} r={headR*0.22}
        fill={eyeColor} opacity={0.45 + eyeGlow*0.55} />
      <circle cx={x+headR*0.35} cy={y-h+headR*2.0} r={headR*0.22}
        fill={eyeColor} opacity={0.45 + eyeGlow*0.55} />
    </g>
  );
};

// ── Etoiles ───────────────────────────────────────────────────

const STARS = [
  { x:0.07, y:0.06, r:2.8, ph:0.0, col:"#ffffff" },
  { x:0.19, y:0.04, r:3.6, ph:1.1, col:"#ffffff" },
  { x:0.33, y:0.08, r:2.4, ph:2.3, col:"#ffffff" },
  { x:0.52, y:0.05, r:3.8, ph:0.7, col:"#ffffff" },
  { x:0.68, y:0.07, r:3.2, ph:3.1, col:"#ffffff" },
  { x:0.84, y:0.04, r:2.6, ph:1.8, col:"#ffffff" },
  { x:0.94, y:0.09, r:2.2, ph:2.9, col:"#ffffff" },
  { x:0.12, y:0.13, r:2.2, ph:2.7, col:"#e8eeff" },
  { x:0.29, y:0.16, r:2.8, ph:0.4, col:"#e8eeff" },
  { x:0.46, y:0.12, r:2.4, ph:1.5, col:"#e8eeff" },
  { x:0.62, y:0.15, r:2.6, ph:3.8, col:"#e8eeff" },
  { x:0.79, y:0.13, r:2.2, ph:2.1, col:"#e8eeff" },
  { x:0.91, y:0.17, r:2.8, ph:0.8, col:"#e8eeff" },
  { x:0.31, y:0.10, r:3.2, ph:1.4, col:"#aaccff" },
  { x:0.57, y:0.06, r:3.4, ph:0.2, col:"#ffe8aa" },
  { x:0.76, y:0.20, r:2.8, ph:2.8, col:"#aaccff" },
  { x:0.04, y:0.14, r:1.8, ph:0.6, col:GLOW },
  { x:0.48, y:0.18, r:2.0, ph:3.2, col:GLOW },
  // Etoiles supplementaires pour phase vivid (moins visibles au debut)
  { x:0.23, y:0.09, r:1.6, ph:4.1, col:"#ffffff" },
  { x:0.71, y:0.11, r:1.8, ph:2.5, col:"#ffffff" },
  { x:0.38, y:0.14, r:1.4, ph:1.9, col:"#e8eeff" },
  { x:0.88, y:0.08, r:2.0, ph:3.7, col:"#ffffff" },
  { x:0.16, y:0.18, r:1.6, ph:0.9, col:GLOW },
  { x:0.55, y:0.19, r:1.4, ph:2.2, col:"#aaccff" },
  { x:0.42, y:0.03, r:2.2, ph:1.3, col:"#ffe8aa" },
  { x:0.73, y:0.16, r:1.8, ph:4.4, col:"#e8eeff" },
];

const StarField: React.FC<{ frame: number; vivid: number }> = ({ frame, vivid }) => {
  const appear = ci(frame, [T.stars_appear, T.stars_done], [0, 1]);
  // Frequence de scintillement acceleree en mode vivid
  const twinkleFreq = 0.055 + vivid * 0.04;

  return (
    <g opacity={appear}>
      {STARS.map((s, i) => {
        const tw = 0.55 + 0.45 * Math.sin(frame * twinkleFreq + s.ph);
        // Rayon augmente en mode vivid, plus fort pour les grandes etoiles
        const vividBoost = s.r >= 3.0 ? 1.8 : 1.3;
        const r = s.r * (1 + vivid * vividBoost);
        // Couleur tend vers blanc pur en mode vivid
        const starOpacity = vivid > 0.7 ? 1.0 : tw * 0.9;
        // Halo plus grand en vivid
        const haloR = s.r * (4 + vivid * 6);
        const haloOp = (s.r >= 3.0 ? 0.16 : 0.08) * (1 + vivid * 1.5);
        return (
          <g key={i}>
            {s.r >= 2.0 && (
              <circle cx={s.x*W} cy={s.y*H} r={haloR}
                fill={s.col} opacity={tw * haloOp} filter="url(#upt-star-halo)" />
            )}
            <circle cx={s.x*W} cy={s.y*H} r={r} fill={vivid > 0.7 ? "#ffffff" : s.col} opacity={starOpacity} />
          </g>
        );
      })}
    </g>
  );
};

// ── Sous-titres ───────────────────────────────────────────────

const SUBS = [
  {
    lines: ["Il y a des jours où on se regarde dans la foule..."],
    inF: T.sub1_in, outF: T.sub1_out,
  },
  {
    lines: ["...et on se demande pourquoi", "on n'arrive pas à être comme eux."],
    inF: T.sub2_in, outF: T.sub2_out,
  },
  {
    lines: ["Ce n'est pas une malédiction."],
    inF: T.sub3_in, outF: T.sub3_out,
  },
  {
    lines: ["C'est juste que tu vois quelque chose", "qu'ils ne voient pas encore."],
    inF: T.sub4_in, outF: T.sub4_out,
  },
  {
    lines: ["Les étoiles aussi brillent seules dans le noir."],
    inF: T.sub5_in, outF: T.sub5_out,
  },
  {
    lines: ["Elles brillent,", "que la nuit soit pleine ou vide."],
    inF: T.sub6_in, outF: T.sub6_out,
  },
];

const Sub: React.FC<{ lines: string[]; inF: number; outF: number; frame: number }> = ({
  lines, inF, outF, frame,
}) => {
  const op = ci(frame, [inF, inF+20, outF-18, outF], [0, 1, 1, 0]);
  if (op < 0.01) return null;
  const lineH = 50;
  const totalH = lines.length * lineH;
  const startY = H * 0.89 - (totalH - lineH) / 2;
  return (
    <g opacity={op}>
      <rect
        x={TEXT_LEFT - 20} y={startY - 38}
        width={TEXT_RIGHT - TEXT_LEFT + 40} height={totalH + 16}
        rx={4} fill={BG} opacity={0.45}
      />
      {lines.map((line, i) => (
        <text key={i}
          x={TEXT_CX} y={startY + i * lineH}
          textAnchor="middle" fill={GLOW}
          fontSize={36} fontFamily="Georgia, serif" fontStyle="italic"
          opacity={0.95}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

// ── Foule ─────────────────────────────────────────────────────

const CROWD: { x: number; y: number; h: number; delay: number }[] = [];
for (let i = 0; i < 8; i++) {
  CROWD.push({ x: 200 + i*215, y: GROUND_Y - 10, h: 95, delay: i*12 });
}
for (let i = 0; i < 9; i++) {
  CROWD.push({ x: 145 + i*210, y: GROUND_Y + 15, h: 105, delay: 6 + i*11 });
}

// Centre = rangee avant index 4 => CROWD[12], x=145+4*210=985
const CENTER_IDX = 12;
const NEIGHBOR_SET = new Set([3, 4, 11, 12, 13]);

// ── Composition ───────────────────────────────────────────────

export const UnParmiTous: React.FC = () => {
  const frame = useCurrentFrame();

  const globalFade = ci(frame, [0, 20, T.fade_start, T.fade_end], [0, 1, 1, 0]);

  // Oscillation collective (respiration foule)
  const oscAmp = ci(frame, [T.osc_start, T.osc_start + 60], [0, 1]);
  const osc = (phase: number) => Math.sin(frame * 0.035 + phase) * 2.8 * oscAmp;

  // Yeux de base de la foule : actifs apres que la foule est placee
  const crowdEyeBase = ci(frame, [T.foule_eyes_start, T.foule_eyes_start + 60], [0, 0.2]);
  const eyePulse = 0.72 + 0.28 * Math.sin(frame * 0.06);

  // Silhouette centrale — yeux AVANT le corps
  const centerEyeGlow = ci(frame,
    [T.center_eye_wake, T.center_eye_half, T.center_peak],
    [0, 0.6, 1.0]
  ) * eyePulse;

  const centerBodyGlow = ci(frame,
    [T.center_body, T.center_peak],
    [0, 1]
  );

  // Halo central : derive du body glow
  const haloR  = ci(frame, [T.center_body, T.center_peak], [20, 280]);
  const haloOp = ci(frame, [T.center_body, T.center_peak], [0.04, 0.55]);
  // Halo oculaire leger des l'eveil des yeux
  const eyeHaloR  = ci(frame, [T.center_eye_wake, T.center_eye_half], [10, 60]);
  const eyeHaloOp = ci(frame, [T.center_eye_wake, T.center_eye_half], [0, 0.12]);

  // Assombrissement foule
  const crowdDarken = ci(frame, [T.crowd_darken, T.crowd_darken + 120], [0, 1]);

  // Etoiles vivid
  const starsVivid = ci(frame,
    [T.stars_vivid_start, T.stars_vivid_peak, T.stars_eclat, T.stars_eclat + 30, T.title_in + 60],
    [0, 0.6, 1.0, 1.0, 0.75]
  );

  // Volume bruit foule : entre apres foule_done, s'estompe avant foule_hush_end
  const fouleVol = (f: number) => ci(f,
    [T.foule_done, T.foule_done + 60, T.foule_hush_end - 90, T.foule_hush_end],
    [0, 0.35, 0.35, 0]
  );

  // Titre
  const titleOp = ci(frame, [T.title_in, T.title_peak, T.title_hold, T.fade_start], [0, 1, 1, 0.3]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <svg
        width="1080" height="1920"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", opacity: globalFade }}
      >
        <defs>
          <linearGradient id="upt-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={BG} />
            <stop offset="100%" stopColor={BG_HORIZ} />
          </linearGradient>
          <linearGradient id="upt-brume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#10182e" stopOpacity="0" />
            <stop offset="100%" stopColor="#10182e" stopOpacity="0.42" />
          </linearGradient>
          <radialGradient id="upt-glow-white" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor={GLOW}    stopOpacity="0" />
          </radialGradient>
          <filter id="upt-halo" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
          <filter id="upt-halo-xl" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="52" />
          </filter>
          <filter id="upt-halo-eye" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id="upt-star-halo" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="upt-blur-sm">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* Ciel gradient atmospherique */}
        <rect width={W} height={H} fill="url(#upt-sky)" />

        {/* Sol */}
        <rect x={0} y={GROUND_Y} width={W} height={H-GROUND_Y} fill="#060810" />

        {/* Brume montante */}
        <rect x={0} y={GROUND_Y-220} width={W} height={220+H-GROUND_Y} fill="url(#upt-brume)" />

        {/* Brouillard bas */}
        <ellipse cx={960} cy={GROUND_Y+30} rx={900} ry={80}
          fill="#0d0820" opacity={0.7} filter="url(#upt-blur-sm)" />

        {/* Etoiles — vivid pendant la metaphore */}
        <StarField frame={frame} vivid={starsVivid} />

        {/* Lune */}
        <circle cx={W*0.85} cy={H*0.12} r={52} fill="#12121e" />
        <circle cx={W*0.85+14} cy={H*0.12-6} r={40} fill={BG} />

        {/* ── Foule ── */}
        {CROWD.map((c, i) => {
          if (i === CENTER_IDX) return null;

          const delay = T.foule_start + c.delay * 1.8;
          const appear = ci(frame, [delay, delay + 35], [0, 1]);

          const isNeighbor = NEIGHBOR_SET.has(i);
          const neighborEyeGl = isNeighbor
            ? ci(frame, [T.contaminate, T.contaminate + 100], [0, 0.35]) * eyePulse
            : 0;

          // Yeux de base actifs des le placement de la silhouette
          const baseEyeGl = Math.max(crowdEyeBase * eyePulse * appear, neighborEyeGl);

          const dimFactor = isNeighbor
            ? 1 - crowdDarken * 0.25
            : 1 - crowdDarken * 0.58;

          return (
            <Sil key={i}
              x={c.x + osc(i*0.65)*0.3}
              y={c.y + osc(i*0.65)}
              h={c.h}
              eyeColor={GLOW}
              eyeGlow={baseEyeGl}
              opacity={appear * dimFactor * 0.55}
            />
          );
        })}

        {/* ── Silhouette centrale ── */}
        {(() => {
          const c = CROWD[CENTER_IDX];
          const delay = T.foule_start + c.delay * 1.8;
          const appear = ci(frame, [delay, delay + 35], [0, 1]);

          return (
            <g>
              {/* Halo oculaire : apparait des l'eveil des yeux */}
              {eyeHaloOp > 0.005 && (
                <circle cx={c.x} cy={c.y - c.h*0.85} r={eyeHaloR}
                  fill="url(#upt-glow-white)" opacity={eyeHaloOp * eyePulse}
                  filter="url(#upt-halo-eye)" />
              )}
              {/* Halo corporel : derive du body glow */}
              {haloOp > 0.01 && (
                <>
                  <circle cx={c.x} cy={c.y - c.h*0.45} r={haloR*1.6}
                    fill="url(#upt-glow-white)" opacity={haloOp*0.4*eyePulse}
                    filter="url(#upt-halo-xl)" />
                  <circle cx={c.x} cy={c.y - c.h*0.45} r={haloR}
                    fill="url(#upt-glow-white)" opacity={haloOp*eyePulse}
                    filter="url(#upt-halo)" />
                </>
              )}

              <Sil
                x={c.x + osc(3.14)*0.3}
                y={c.y + osc(3.14)}
                h={c.h * 1.1}
                eyeColor={GLOW}
                eyeGlow={centerEyeGlow}
                opacity={appear}
              />
            </g>
          );
        })()}

        {/* ── Sous-titres ── */}
        {SUBS.map((s, i) => (
          <Sub key={i} frame={frame} lines={s.lines} inF={s.inF} outF={s.outF} />
        ))}

        {/* ── Titre final ── */}
        <g opacity={titleOp}>
          <text x={TEXT_CX} y={110}
            textAnchor="middle" fill={GLOW}
            fontSize={50} fontFamily="Georgia, serif" letterSpacing={9}
            opacity={0.9}>
            L&apos;UN PARMI TOUS
          </text>
          <line x1={TEXT_LEFT} y1={130} x2={TEXT_RIGHT} y2={130}
            stroke={GLOW} strokeWidth={0.7} opacity={0.25} />
        </g>

      </svg>

      {/* ── Audio ── */}

      {/* Ambiance nocturne : 3 segments enchaines (22s = 660f chacun) */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/silhouette-questions/sfx-nuit-1.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={600}>
        <Audio src={staticFile("audio/silhouette-questions/sfx-nuit-2.mp3")} volume={0.38} />
      </Sequence>
      <Sequence from={1200}>
        <Audio src={staticFile("audio/silhouette-questions/sfx-nuit-3.mp3")} volume={0.36} />
      </Sequence>
      <Sequence from={1800}>
        <Audio src={staticFile("audio/silhouette-questions/sfx-nuit-1.mp3")} volume={0.34} />
      </Sequence>
      <Sequence from={2400}>
        <Audio src={staticFile("audio/silhouette-questions/sfx-nuit-2.mp3")} volume={0.32} />
      </Sequence>
      <Sequence from={3000}>
        <Audio src={staticFile("audio/silhouette-questions/sfx-nuit-3.mp3")} volume={0.30} />
      </Sequence>

      {/* Bruit de foule : entre apres placement, s'estompe avant la metaphore */}
      <Sequence from={T.foule_done}>
        <Audio
          src={staticFile("audio/silhouette-questions/sfx-foule.mp3")}
          volume={(f) => fouleVol(f + T.foule_done)}
        />
      </Sequence>

      {/* Voice over — 6 phrases */}
      <Sequence from={T.sub1_in}>
        <Audio src={staticFile("audio/silhouette-questions/vo-sub1.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={T.sub2_in}>
        <Audio src={staticFile("audio/silhouette-questions/vo-sub2.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={T.sub3_in}>
        <Audio src={staticFile("audio/silhouette-questions/vo-sub3.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={T.sub4_in}>
        <Audio src={staticFile("audio/silhouette-questions/vo-sub4.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={T.sub5_in}>
        <Audio src={staticFile("audio/silhouette-questions/vo-sub5.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={T.sub6_in}>
        <Audio src={staticFile("audio/silhouette-questions/vo-sub6.mp3")} volume={1.0} />
      </Sequence>

      {/* SFX eveil : cloche etheree quand les yeux s'allument */}
      <Sequence from={T.center_eye_wake}>
        <Audio src={staticFile("audio/silhouette-questions/sfx-eveil.mp3")} volume={0.65} />
      </Sequence>

      {/* SFX contamination : shimmer quand les voisins s'eclairent */}
      <Sequence from={T.contaminate}>
        <Audio src={staticFile("audio/silhouette-questions/sfx-contamination.mp3")} volume={0.5} />
      </Sequence>

      {/* SFX eclat cristallin : juste avant le titre */}
      <Sequence from={T.stars_eclat}>
        <Audio src={staticFile("audio/silhouette-questions/sfx-etoiles-eclat.mp3")} volume={0.75} />
      </Sequence>

    </AbsoluteFill>
  );
};
