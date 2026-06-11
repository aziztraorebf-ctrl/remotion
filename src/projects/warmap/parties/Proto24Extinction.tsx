// PROTO 2.4 — EXTINCTION D'UNE BASE FR ENCERCLÉE (refonte premium P2).
//
// Couche PURE par-dessus la carte du moteur (pattern <PartieX>). Reçoit
// SahelRenderContext (frame + project lon/lat→px). Ne possède PAS la map.
//
// OBJECTIF (Aziz) : refaire en PREMIUM le moment le plus mort de la P2 rejetée.
// Décisions verrouillées :
//   - Marqueurs = SPRITES à ombre portée (base-france.png), PAS d'étoiles SVG.
//   - Front jihadiste = FRONT MOUVANT ORGANIQUE (path bezier morphé), PAS un cercle qui scale.
//   - Lottie SUR-MESURE (extinctionCollapse) sur le moment d'extinction de chaque base.
//   - Caméra serrée qui suit (gérée par getProto24Cam dans le moteur).
//   - "40%" supprimé (la voix le dit).
//
// 5 GARDE-FOUS ANTI-SATURATION (la P2 rejetée saturait — cercles+étoiles+X qui restaient) :
//   1. Le front est UNE nappe qui se DÉPLACE (bord chaud net + arrière sourd opacity 0.15),
//      jamais des taches additives qui s'empilent.
//   2. La caméra (moteur) sort les bases éteintes du cadre → on ne voit pas les 3 morts avant la fin.
//   3. Les Lottie sont des ÉVÉNEMENTS (~75f puis disparaissent), espacés ≥30f, jamais 3 simultanés.
//   4. Quota : max 1 nappe + 1 onde active + 3 sprites. Aucun label flottant, aucun chiffre.
//   5. La désaturation EST l'outil de lisibilité : base morte = grise/plate/opacity basse = "ne regarde plus ici".
//
// Triggers V5 (alignment, ×30fps) : F_ECHEC = 3887 ("dix ans plus tard").

import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig, staticFile, Easing } from "remotion";
import type { SahelRenderContext } from "../engine/SahelContext";

// FX fumée/effondrement — frames PixelLab (animation par prompt, doctrine Gemini/PixelLab 2026-06-11).
// 9 frames top-down sépia, jouées une fois puis maintenues en fond (la base brûle).
const SMOKE_FRAMES = 9;

// ============================================================
// TRIGGERS + GÉOGRAPHIE
// ============================================================
const F_ECHEC = 3887; // "dix ans plus tard" — début du beat 2.4

// Bases FR (triangle du Nord-Mali). coord [lon, lat].
type FrBase = { id: string; name: string; coord: [number, number]; extinctAt: number };
const FR_BASES: FrBase[] = [
  { id: "gao", name: "GAO", coord: [-0.04, 16.27], extinctAt: F_ECHEC + 100 },     // 1re à tomber (push-in T2)
  { id: "menaka", name: "MÉNAKA", coord: [2.40, 15.92], extinctAt: F_ECHEC + 175 }, // PAN est T3a
  { id: "tessalit", name: "TESSALIT", coord: [1.01, 20.20], extinctAt: F_ECHEC + 240 }, // remonte nord T3b
];

// FRONT MOUVANT DÉCHIQUETÉ — généré PROCÉDURALEMENT (pas un ovale lisse).
// Un vrai front grignote : bord irrégulier, croît dans le temps, vibre légèrement.
// Centre = barycentre décalé sud-est (origine Liptako). Rayon de base croissant + bruit
// déterministe par angle (déchiqueté) + ondulation animée (le front "respire" en avançant).
type GeoRing = [number, number][];
const FRONT_CENTER: [number, number] = [0.9, 16.4];     // entre Gao/Ménaka, décalé est
const FRONT_N = 20;                                       // nb de points (plus = plus découpé)
// Rayons lon/lat de base (la zone est plus large en lon qu'en lat), croissants dans le temps.
const FRONT_GROW: { at: number; rLon: number; rLat: number }[] = [
  { at: F_ECHEC, rLon: 2.6, rLat: 2.0 },        // lâche au départ (sud-est)
  { at: F_ECHEC + 90, rLon: 3.6, rLat: 2.8 },   // remonte, enveloppe Gao/Ménaka
  { at: F_ECHEC + 220, rLon: 4.4, rLat: 4.0 },  // étreinte serrée jusqu'à Tessalit
];
// Bruit déterministe par index d'angle (déchiqueture fixe du contour) — pseudo-aléatoire stable.
function jag(i: number): number {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1; // [-1, 1]
}
// Construit l'anneau géo déchiqueté au temps `frame`.
function buildFrontRing(frame: number): GeoRing {
  // rayon de base interpolé (croissance)
  let rLon = FRONT_GROW[FRONT_GROW.length - 1].rLon;
  let rLat = FRONT_GROW[FRONT_GROW.length - 1].rLat;
  if (frame <= FRONT_GROW[0].at) { rLon = FRONT_GROW[0].rLon; rLat = FRONT_GROW[0].rLat; }
  else for (let i = 0; i < FRONT_GROW.length - 1; i++) {
    const a = FRONT_GROW[i], b = FRONT_GROW[i + 1];
    if (frame >= a.at && frame <= b.at) {
      const t = (frame - a.at) / (b.at - a.at);
      const e = t * t * (3 - 2 * t);
      rLon = a.rLon + (b.rLon - a.rLon) * e;
      rLat = a.rLat + (b.rLat - a.rLat) * e;
      break;
    }
  }
  const ring: GeoRing = [];
  for (let i = 0; i < FRONT_N; i++) {
    const ang = (i / FRONT_N) * Math.PI * 2;
    // déchiqueture : ±22% de rayon, modulée par une ondulation animée lente (grignotage)
    const noise = jag(i) * 0.22 + 0.10 * Math.sin(ang * 3 + frame * 0.05);
    const f = 1 + noise;
    ring.push([
      FRONT_CENTER[0] + Math.cos(ang) * rLon * f,
      FRONT_CENTER[1] + Math.sin(ang) * rLat * f,
    ]);
  }
  return ring;
}

// Palette
const RED_INK = "#8B3A3A";     // rouge-brique (front, décision Aziz)
const RED_DEEP = "#5A2424";    // rouge sourd (arrière du front, acquis)
const STEEL = "#5E7FA0";       // bleu-acier (base vivante)

// ============================================================
// HELPERS
// ============================================================
// Path SVG lisse (Catmull-Rom → bezier) fermé, à partir de points écran.
function smoothClosedPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 3) return "";
  const n = pts.length;
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d + "Z";
}

type Props = { ctx: SahelRenderContext | null };

export const Proto24Extinction: React.FC<Props> = ({ ctx }) => {
  const { fps } = useVideoConfig();

  if (!ctx) return null;
  const { frame, width, height, project } = ctx;

  // ── FRONT MOUVANT : anneau géo déchiqueté procédural → projeté → path lisse ──
  const ring = buildFrontRing(frame);
  const ringPx = ring.map(([lon, lat]) => project(lon, lat));
  const frontPath = smoothClosedPath(ringPx);
  // Le front apparaît à F_ECHEC (fade-in court).
  const frontOp = interpolate(frame, [F_ECHEC, F_ECHEC + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Sprites base FR (fortin isométrique Gemini, ombre intégrée) + état d'extinction ──
  // Asset base-fr-td.png = enceinte hesco + tente + bunker + drapeau tricolore (vue 75°).
  // Ratio ~1.9:1 (plus large que haut). Remplace l'ancienne rose-des-vents (= étoile rejetée).
  const baseSprite = staticFile("_shared/sprites/warmap/base-fr-td.png");
  const BASE_RATIO = 0.56; // hauteur / largeur du sprite

  const vmin = Math.min(width, height);
  // ── FX FUMÉE PixelLab : chaque base éteinte émet une fumée qui MONTE puis persiste (la base brûle) ──
  // Doctrine : effet organique = PixelLab animé par prompt (pas de Lottie codé). La séquence joue une
  // fois (montée) au moment de l'extinction puis se fige sur la dernière frame (foyer qui couve).
  const SMOKE_FPS = 12; // cadence de lecture des frames PixelLab
  const smokeFor = (b: FrBase): { idx: number; op: number } | null => {
    const rel = frame - b.extinctAt;
    if (rel < 0) return null;
    const playFrame = Math.floor((rel / fps) * SMOKE_FPS);
    const idx = Math.min(playFrame, SMOKE_FRAMES - 1); // joue une fois puis fige
    const op = interpolate(rel, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { idx, op };
  };

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {/* Dégradé radial du front : bord chaud net → arrière sourd (la nappe se déplace, pas additive) */}
          <radialGradient id="p24-front" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={RED_DEEP} stopOpacity={0.15} />
            <stop offset="72%" stopColor={RED_INK} stopOpacity={0.32} />
            <stop offset="100%" stopColor={RED_INK} stopOpacity={0.5} />
          </radialGradient>
          {/* Hachures de tension sous le bord d'attaque (l'encre seule ne se lit pas — leçon P1) */}
          <pattern id="p24-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke={RED_INK} strokeWidth="1.4" strokeOpacity="0.4" />
          </pattern>
        </defs>

        {/* FRONT MOUVANT — nappe organique (garde-fou #1) */}
        {frontPath && (
          <g opacity={frontOp}>
            <path d={frontPath} fill="url(#p24-front)" />
            <path d={frontPath} fill="url(#p24-hatch)" opacity={0.5} />
            {/* bord d'attaque net (le "front" lui-même) */}
            <path d={frontPath} fill="none" stroke={RED_INK} strokeWidth={2.2} strokeOpacity={0.62} />
          </g>
        )}

        {/* BASES FR — halo d'ancrage acier au SOL (sous le fortin), s'éteint à la mort.
            Le fortin lui-même est rendu en <img> hors-SVG (filtre CSS). (garde-fous #4 #5) */}
        {FR_BASES.map((b) => {
          const p = project(b.coord[0], b.coord[1]);
          const appear = spring({ frame: frame - F_ECHEC, fps, config: { damping: 14 }, durationInFrames: 18 });
          const rel = frame - b.extinctAt;
          const halo = appear * interpolate(rel, [0, 40], [1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
          });
          if (halo <= 0.02) return null;
          const rHalo = 0.078 * vmin;
          // onde de respiration lente du halo (la base "vit" tant qu'elle n'est pas tombée)
          const pulse = 1 + 0.06 * Math.sin((frame - F_ECHEC) * 0.12);
          return (
            <g key={b.id} transform={`translate(${p.x},${p.y})`}>
              <ellipse cx={0} cy={0} rx={rHalo * pulse} ry={rHalo * 0.5 * pulse}
                fill="none" stroke={STEEL} strokeWidth={1.8} strokeOpacity={0.42 * halo} />
            </g>
          );
        })}
      </svg>

      {/* SPRITES base-france en <img> (drop-shadow encre chaude). Hors SVG pour le filtre CSS. */}
      {FR_BASES.map((b) => {
        const p = project(b.coord[0], b.coord[1]);
        const appear = spring({ frame: frame - F_ECHEC, fps, config: { damping: 14 }, durationInFrames: 18 });
        const rel = frame - b.extinctAt;
        const deadT = interpolate(rel, [0, 40], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
        });
        const wBase = 0.22 * vmin;          // largeur du fortin (plus gros = plus lisible, Aziz 2026-06-11)
        const scale = appear * (1 - deadT * 0.14);
        const w = wBase * scale;
        const h = w * BASE_RATIO;
        const op = appear * (1 - deadT * 0.55);
        if (op <= 0.02) return null;
        // ombre légère (le sprite a déjà son ombre intégrée — on ajoute juste un ancrage chaud léger).
        const shadowAlpha = 0.3 * (1 - deadT);
        // désaturation : grayscale monte, légère teinte sépia-mort.
        const grayscale = deadT;
        const brightness = 1 - deadT * 0.22;
        return (
          <img
            key={b.id}
            src={baseSprite}
            style={{
              position: "absolute",
              left: p.x - w / 2,
              top: p.y - h * 0.62, // ancrage au pied du fortin (drapeau dépasse en haut)
              width: w,
              height: h,
              opacity: op,
              filter: `grayscale(${grayscale}) brightness(${brightness}) drop-shadow(0 ${2 * (1 - deadT) + 1}px ${6 * (1 - deadT) + 2}px rgba(80,30,20,${shadowAlpha}))`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* FX FUMÉE PixelLab — chaque base éteinte émet sa fumée (montée puis foyer qui couve).
          Effet organique généré par prompt (doctrine Gemini/PixelLab). Ancré au pied du fortin. */}
      {FR_BASES.map((b) => {
        const sm = smokeFor(b);
        if (!sm) return null;
        const p = project(b.coord[0], b.coord[1]);
        const sw = 0.16 * vmin;           // largeur de la fumée
        const sh = sw;                     // sprite carré 128x128
        return (
          <img
            key={`smoke-${b.id}`}
            src={staticFile(`_shared/sprites/warmap/fx-smoke/${sm.idx}.png`)}
            style={{
              position: "absolute",
              left: p.x - sw / 2,
              top: p.y - sh * 0.82,        // base de la fumée au pied du fortin, panache monte au-dessus
              width: sw,
              height: sh,
              opacity: sm.op,
              imageRendering: "pixelated", // pixel art net (pas de lissage)
              pointerEvents: "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export default Proto24Extinction;
