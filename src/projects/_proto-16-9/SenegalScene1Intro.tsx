/**
 * SenegalScene1Intro — INTRO scene 1 V3 "LE DUEL DES RECITS" (~25s, REMOTION PUR, 0 carte Mapbox).
 *
 * Parti-pris G1 "Invasion / Refoulement" (DA Gemini+Kimi, valide Aziz) : la carte du Senegal (continuite
 * stricte du hook scene 0, meme parchemin/grille/grain/charte) devient le TERRAIN du duel.
 *   1. MALEDICTION : depuis l'ocean (ouest), des traits sombres+rouge crise penetrent la cote, des gouttes
 *      "pompent" le pays, fleches sortantes (extraction). Le pays s'assombrit, vide de sa substance.
 *   2. MIRACLE : depuis Dakar (centre-ouest), une onde OCRE grandit (clip radial), nettoie les parasites,
 *      ramene le parchemin clair, fait pulser un bouclier dore. Trop parfait = suspect (le mythe).
 *   3. AILLEURS (~f548 local) : les 2 illusions se FRACTURENT (reutilise le geste fracturePath du hook),
 *      les 2 moities s'ecartent, on zoome dans la faille (espace negatif navy) -> bascule vers la mer.
 *
 * Continuite hook : PARCH/GRID/OCRE/NAVY/CRISIS, grain papier ANIME (anti filtre-Instagram), spring partout,
 * l'image precede la voix ~0.5s. Audio : narration V3 depuis 23.5s.
 *
 * Frames LOCALES @30fps. Intro demarre a abs 23.5s. tl(absSec) = round((absSec - 23.5) * 30).
 */
import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { SENEGAL_PATH, SENEGAL_PATH_LEN, SENEGAL_CENTROID } from "./senegalPath";

const W = 1920, H = 1080;
// charte hook (identique)
const PARCH = "#e4ddca", PARCH_DARK = "#d6cdb4", GRID = "#c2a96a";
const OCRE = "#e7bd78", OCRE_MID = "#d2ad66", OCRE_DARK = "#bf9442";
const NAVY = "#16213a", NAVY_DEEP = "#0d1424", CRISIS = "#b23a2e", CRISIS_DARK = "#7d2118";

const MAP_SCALE = 1.2;
const MAP_X = W / 2 - (900 * MAP_SCALE) / 2;
const MAP_Y = H / 2 - (700 * MAP_SCALE) / 2 - 40;
const GRID_STEP = 185, GRID_OFFSET_X = 40, GRID_OFFSET_Y = 28;

const INTRO_OFFSET = 23.5;
const tl = (absSec: number) => Math.round((absSec - INTRO_OFFSET) * 30);

// beats (frames locales)
const F_MALEDICTION = tl(34.0);   // l'invasion commence (avant "multinationales" 36s)
const F_MIRACLE     = tl(38.4);   // l'onde ocre (avant "nation" 39.4s)
const F_AILLEURS    = tl(42.0);   // la fracture (avant "ailleurs" 43.3s)
const F_DIRECT      = tl(47.5);   // fin : zoom dans la faille -> carte
const TOTAL         = tl(48.5);

const centerX = MAP_X + SENEGAL_CENTROID[0] * MAP_SCALE;
const centerY = MAP_Y + SENEGAL_CENTROID[1] * MAP_SCALE;
// Dakar approx (pointe ouest) dans le repere carte
const dakarX = MAP_X + 70 * MAP_SCALE;
const dakarY = MAP_Y + 330 * MAP_SCALE;

// random deterministe (pour la fracture + jitter)
const rand = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return ((h >>> 0) % 1000) / 1000; };

function fracturePath(): string {
  const x0 = MAP_X + 200 * MAP_SCALE, y0 = MAP_Y + 60 * MAP_SCALE;
  const x1 = MAP_X + 700 * MAP_SCALE, y1 = MAP_Y + 640 * MAP_SCALE;
  const segs = 9;
  let d = `M ${x0} ${y0}`;
  for (let i = 1; i <= segs; i++) {
    const t = i / segs;
    const bx = x0 + (x1 - x0) * t, by = y0 + (y1 - y0) * t;
    const jitter = (rand(`frac-${i}`) - 0.5) * 120;
    const perpX = -(y1 - y0), perpY = x1 - x0;
    const len = Math.hypot(perpX, perpY);
    d += ` L ${bx + (perpX / len) * jitter} ${by + (perpY / len) * jitter}`;
  }
  return d;
}
const FRAC = fracturePath();

export const SenegalScene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // grain anime (seed change toutes les 20f) — anti filtre-Instagram (note DA)
  const grainSeed = Math.floor(frame / 20);

  // --- phase malediction : intensite 0->1 ---
  const malK = interpolate(frame, [F_MALEDICTION, F_MALEDICTION + 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // --- phase miracle : onde ocre depuis Dakar (clip radial) ---
  const miracleP = spring({ frame: frame - F_MIRACLE, fps, config: { damping: 13, stiffness: 60 } });
  const miracleR = interpolate(miracleP, [0, 1], [0, 1400], { extrapolateRight: "clamp" });
  // le miracle "nettoie" la malediction (la crise recule quand l'onde passe)
  const cleanK = interpolate(miracleR, [200, 900], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const crisisVisible = malK * (1 - cleanK);

  // --- fracture (reutilise le geste hook) ---
  const fracDraw = interpolate(frame, [F_AILLEURS, F_AILLEURS + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const split = spring({ frame: frame - F_AILLEURS - 6, fps, config: { damping: 16, stiffness: 45 } });
  const splitX = interpolate(split, [0, 1], [0, 130], { extrapolateRight: "clamp" });

  // --- zoom final dans la faille -> bascule carte ---
  const zoomP = spring({ frame: frame - F_DIRECT, fps, config: { damping: 22, stiffness: 40 } });
  const zoomScale = interpolate(zoomP, [0, 1], [1, 9], { extrapolateRight: "clamp" });
  const navyVeil = interpolate(frame, [F_DIRECT + 4, TOTAL], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // fond : parchemin -> s'assombrit avec la malediction, re-eclairci par le miracle
  const darkK = crisisVisible;
  const bgColor = `rgb(${Math.round(228 - darkK * 200)},${Math.round(221 - darkK * 180)},${Math.round(202 - darkK * 160)})`;

  const gridV = Array.from({ length: Math.ceil(W / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_X + i * GRID_STEP);
  const gridH = Array.from({ length: Math.ceil(H / GRID_STEP) + 1 }, (_, i) => GRID_OFFSET_Y + i * GRID_STEP);

  // gouttes qui "pompent" (malediction) : depuis l'ocean vers le pays
  const drops = [0, 1, 2, 3].map((i) => {
    const t = ((frame - F_MALEDICTION - i * 12) % 70) / 70;
    return { i, t: t < 0 ? 0 : t, on: frame > F_MALEDICTION + i * 12 };
  });
  // fleches sortantes (extraction)
  const arrowOp = malK * (1 - cleanK);

  return (
    <AbsoluteFill style={{ background: bgColor }}>
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={Math.round(INTRO_OFFSET * 30)} volume={1} />
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")} startFrom={Math.round(INTRO_OFFSET * 30)} volume={0.14} />
      {/* SFX */}
      <Sequence from={F_MALEDICTION} durationInFrames={70}><Audio src={staticFile("_shared/sfx/warmap/tension-drone.mp3")} volume={0.35} /></Sequence>
      <Sequence from={F_MIRACLE} durationInFrames={40}><Audio src={staticFile("souverain/senegal-petrole-gaz/audio/sfx/sfx-whoosh-transition.mp3")} volume={0.4} /></Sequence>
      <Sequence from={F_AILLEURS} durationInFrames={40}><Audio src={staticFile("_shared/sfx/warmap/cedeao-snap.mp3")} volume={0.5} /></Sequence>

      <div style={{ transform: `scale(${zoomScale})`, transformOrigin: `${centerX}px ${centerY}px`, width: W, height: H }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="ocreFillI" x1="0" y1="0" x2="0.25" y2="1">
              <stop offset="0%" stopColor={OCRE} /><stop offset="55%" stopColor={OCRE_MID} /><stop offset="100%" stopColor={OCRE_DARK} />
            </linearGradient>
            <filter id="grainI">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={grainSeed} stitchTiles="stitch" result="n" />
              <feColorMatrix in="n" type="saturate" values="0" />
              <feComponentTransfer><feFuncA type="linear" slope="0.06" /></feComponentTransfer>
              <feComposite operator="over" in2="SourceGraphic" />
            </filter>
            <radialGradient id="miracleGrad">
              <stop offset="0%" stopColor={OCRE} stopOpacity="0.0" />
              <stop offset="70%" stopColor={OCRE} stopOpacity="0.0" />
              <stop offset="92%" stopColor="#fff3d6" stopOpacity="0.55" />
              <stop offset="100%" stopColor={OCRE} stopOpacity="0" />
            </radialGradient>
            {/* clip : onde miracle (cercle qui grandit depuis Dakar) */}
            <clipPath id="miracleClip"><circle cx={dakarX} cy={dakarY} r={miracleR} /></clipPath>
            <clipPath id="fracLeft"><rect x={0} y={0} width={centerX} height={H} /></clipPath>
            <clipPath id="fracRight"><rect x={centerX} y={0} width={W - centerX} height={H} /></clipPath>
          </defs>

          {/* fond papier grain */}
          <rect width={W} height={H} fill={PARCH_DARK} filter="url(#grainI)" opacity={0.5 * (1 - darkK * 0.5)} />
          {/* grille (vire bleu-nuit avec la crise) */}
          <g stroke={crisisVisible > 0.3 ? "#3a4a6e" : GRID} strokeWidth={1.6} opacity={0.55}>
            {gridV.map((x) => <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />)}
            {gridH.map((y) => <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />)}
          </g>

          {/* === LE PAYS (2 moities qui se fracturent a la fin) === */}
          {[{ clip: "fracLeft", dx: -splitX }, { clip: "fracRight", dx: splitX }].map((half, hi) => (
            <g key={hi} clipPath={`url(#${half.clip})`} transform={`translate(${half.dx},0)`}>
              <g transform={`translate(${MAP_X},${MAP_Y}) scale(${MAP_SCALE})`}>
                {/* remplissage ocre de base */}
                <path d={SENEGAL_PATH} fill="url(#ocreFillI)" filter="url(#grainI)" />
                {/* voile sombre crise (malediction) PAR-DESSUS */}
                <path d={SENEGAL_PATH} fill={CRISIS_DARK} opacity={crisisVisible * 0.55} />
                <path d={SENEGAL_PATH} fill={NAVY_DEEP} opacity={crisisVisible * 0.35} />
                {/* contour navy */}
                <path d={SENEGAL_PATH} fill="none" stroke={NAVY} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" />
              </g>
            </g>
          ))}

          {/* onde MIRACLE : halo lumineux qui balaie (revele le parchemin clair sous le clip) */}
          {frame >= F_MIRACLE && miracleR > 0 && miracleR < 1300 && (
            <circle cx={dakarX} cy={dakarY} r={miracleR} fill="none" stroke="#fff3d6" strokeWidth={6} opacity={0.5 * (1 - cleanK)} />
          )}

          {/* MALEDICTION : gouttes qui pompent depuis l'ocean (gauche) vers le pays + fleches sortantes */}
          {arrowOp > 0.02 && (
            <g opacity={arrowOp}>
              {drops.map((d) => d.on && (
                <g key={d.i}>
                  {/* goutte qui va de l'ocean vers le centre du pays */}
                  <circle
                    cx={interpolate(d.t, [0, 1], [MAP_X - 40, centerX])}
                    cy={dakarY + (d.i - 1.5) * 70}
                    r={interpolate(d.t, [0, 1], [7, 2])}
                    fill={CRISIS} opacity={interpolate(d.t, [0, 0.2, 1], [0, 0.9, 0])} />
                </g>
              ))}
              {/* 3 fleches sortantes (extraction vers l'ocean) */}
              {[0, 1, 2].map((i) => {
                const ay = centerY - 60 + i * 60;
                const prog = (frame % 50) / 50;
                const ax = interpolate(prog, [0, 1], [centerX, MAP_X - 80]);
                return (
                  <g key={i} stroke={CRISIS} strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round">
                    <line x1={ax + 30} y1={ay} x2={ax} y2={ay} />
                    <line x1={ax + 10} y1={ay - 7} x2={ax} y2={ay} />
                    <line x1={ax + 10} y1={ay + 7} x2={ax} y2={ay} />
                  </g>
                );
              })}
            </g>
          )}

          {/* bouclier MIRACLE (dore) qui pulse au centre quand l'onde a nettoye */}
          {cleanK > 0.2 && fracDraw < 0.1 && (
            <g opacity={cleanK * (1 - fracDraw)} transform={`translate(${centerX},${centerY})`}>
              <path d="M0,-46 L40,-30 L40,10 Q40,44 0,58 Q-40,44 -40,10 L-40,-30 Z"
                fill="none" stroke={OCRE} strokeWidth={4} opacity={0.85}
                style={{ transform: `scale(${1 + 0.04 * Math.sin(frame * 0.15)})` }} />
            </g>
          )}

          {/* trait de FRACTURE (apparait sur "ailleurs") */}
          {fracDraw > 0 && (
            <path d={FRAC} fill="none" stroke={NAVY_DEEP} strokeWidth={7}
              strokeDasharray={2200} strokeDashoffset={2200 * (1 - fracDraw)} opacity={0.9} />
          )}
        </svg>
      </div>

      {/* voile navy final : la faille devient la mer (bascule vers la carte Mapbox dans le composant parent) */}
      {navyVeil > 0.01 && <AbsoluteFill style={{ background: NAVY_DEEP, opacity: navyVeil }} />}
    </AbsoluteFill>
  );
};

export default SenegalScene1Intro;
