// Partie 2 — LE BLOCAGE (intervention FR/ONU qui echoue sur 10 ans).
//
// Couche PURE par-dessus la carte du moteur (pattern <PartieX>, voir Partie1Origine).
// Recoit SahelRenderContext. Ne possede PAS la map.
//
// OSSATURE VISUELLE (DA upstream 3 voix convergent — SYNTHESE-DA-UPSTREAM-P2.md) :
//   POINTS RIGIDES (FR/ONU = geometrie nette fixe) SUR SURFACES FLUIDES (jihadisme = paths
//   organiques rouge qui s'infiltrent). Distinction par MORPHOLOGIE, pas couleur.
//   EXTINCTION = REACTION a l'encerclement : le rouge coule SOUS les bases, les entoure ->
//   elles s'eteignent (cage refermee, pas defaite). "effort massif / echec" sans un mot.
//   Beat 2.4 SEQUENCE (pas simultane). Anti-biais : extinction analytique, jamais pathos.
//
// Beats (triggers V5 alignment, x30fps) :
//   2.1 Serval/Barkhane  f3196/f3268  bases FR (Gao/Menaka/Tessalit), etoiles, "2013"
//   2.2 presence FR      f3419/f3443  overlay GeoConvergence (lignes fines convergent), SOBRE
//   2.3 MINUSMA          f3660        points bleu-ONU (Kidal/Tombouctou/Mopti)
//   2.4 echec 10 ans     f3887        timeline 2013->2022 + rouge s'etend + bases s'eteignent 1 a 1
//   2.5 villes/campagnes f4384/f4421  villes = points tenus ; rouge progresse dans le rural
//   2.6 Burkina deborde  f4955/f4976  rouge franchit Mali->Burkina, "2015", "40%"
//   (fin) Niger/CEDEAO   f5380/f5639  Niamey bascule, anneau CEDEAO (pont Partie 3)

import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import type { SahelRenderContext } from "../engine/SahelContext";

// ============================================================
// TRIGGERS V5 (alignment, x30fps)
// ============================================================
const F_SERVAL = 3196;
const F_BARKHANE = 3268;
const F_PRESENTE = 3419;
const F_AUTOUR = 3443;
const F_MINUSMA = 3660;
const F_ECHEC = 3887;     // "dix" ans plus tard
const F_VILLES = 4384;
const F_CAMPAGNES = 4421;
const F_DEBORDENT = 4955;
const F_BURKINA = 4976;
const F_NIGER = 5380;
const F_CEDEAO = 5639;

// Palette (decisions Aziz)
const INK = "#2A1C0E";
const FR_STEEL = "#4A6B8A";  // bleu-acier vieilli (bases FR Serval/Barkhane)
const UN_BLUE = "#6E8FB0";   // bleu-ONU plus clair (MINUSMA, distinct des bases FR)
const RED = "#8B3A3A";       // rouge-violence (jihadisme, surfaces fluides)
const SAHEL_LAND = "#F5EFD6"; // parchemin (halo reserve labels)
const STEEL_DEAD = "#9A9387"; // bleu-acier désaturé (base éteinte)

// BEAT 2.4 — surfaces rouges DÉDIÉES P2 (jihadisme = fluide qui s'infiltre). Foyers
// organiques qui grandissent pendant l'échec 10 ans, "encerclent" les bases FR.
const RED_BLOBS: { coord: [number, number]; rMax: number; growDelay: number }[] = [
  { coord: [0.3, 16.5], rMax: 100, growDelay: 0 },   // entre Gao et Ménaka (coeur)
  { coord: [1.2, 19.2], rMax: 75, growDelay: 90 },   // remonte vers Tessalit (nord)
  { coord: [-2.0, 15.4], rMax: 85, growDelay: 55 },  // ouest (vers centre/Mopti)
];
// Extinction des bases : delay après F_ECHEC (quand le rouge l'a encerclée). Staggered.
const BASE_EXTINCTION: Record<string, number> = {
  GAO: 130, MENAKA: 175, TESSALIT: 230,
};

// Bases FR (geometrie rigide). appear = frame d'apparition (apres le mot, decale +12).
const FR_BASES: { coord: [number, number]; name: string; appear: number; dy: number }[] = [
  { coord: [-0.04, 16.27], name: "GAO", appear: F_SERVAL + 12, dy: 28 },
  { coord: [2.40, 15.92], name: "MENAKA", appear: F_SERVAL + 30, dy: 28 },
  { coord: [1.01, 20.20], name: "TESSALIT", appear: F_BARKHANE + 12, dy: -22 },
];
// Points MINUSMA (ONU). Teinte bleu-ONU, apparaissent au beat 2.3.
const MINUSMA_PTS: { coord: [number, number]; name: string; delay: number }[] = [
  { coord: [1.44, 18.43], name: "KIDAL", delay: 0 },
  { coord: [-3.01, 16.79], name: "TOMBOUCTOU", delay: 12 },
  { coord: [-4.20, 14.49], name: "MOPTI", delay: 24 },
];
// BEAT 2.2 — convergence régionale (présence FR pré-positionnée TOUT AUTOUR). Lignes fines
// pointillées depuis les voisins vers un point central Mali. Origines = pays limitrophes.
const MALI_CENTER: [number, number] = [-1.5, 16.5];
const CONVERGENCE_FROM: { coord: [number, number]; delay: number }[] = [
  { coord: [-7.5, 21.0], delay: 0 },   // Mauritanie (NO)
  { coord: [3.0, 23.0], delay: 8 },    // Algérie (N)
  { coord: [8.5, 17.5], delay: 16 },   // Niger (E)
  { coord: [-2.0, 12.5], delay: 24 },  // Burkina (S)
  { coord: [-8.0, 13.0], delay: 32 },  // Sénégal/ouest (O)
];

// Helper : interpolation linéaire entre 2 couleurs hex (#rrggbb).
function lerpHex(a: string, b: string, t: number): string {
  const ah = a.replace("#", ""), bh = b.replace("#", "");
  const ar = parseInt(ah.slice(0, 2), 16), ag = parseInt(ah.slice(2, 4), 16), ab = parseInt(ah.slice(4, 6), 16);
  const br = parseInt(bh.slice(0, 2), 16), bg = parseInt(bh.slice(2, 4), 16), bb = parseInt(bh.slice(4, 6), 16);
  const r = Math.round(ar + (br - ar) * t), g = Math.round(ag + (bg - ag) * t), bl = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl.toString(16).padStart(2, "0")}`;
}

// Helper : path d'une étoile à N branches (marqueur militaire rigide), centrée (cx,cy).
function starPath(cx: number, cy: number, rOuter: number, rInner: number, points = 5): string {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    d += (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
  }
  return d + "Z";
}

type Props = {
  ctx: SahelRenderContext | null;
};

export const Partie2Blocage: React.FC<Props> = ({ ctx }) => {
  if (!ctx) return null;
  const { frame, width, height, project } = ctx;

  // -------- BEAT 2.1 : bases FR Serval/Barkhane (géométrie rigide, bleu-acier) --------
  // Étoiles militaires qui "frappent" la carte (scale overshoot), staggered Gao→Ménaka→Tessalit.
  // Repère "2013" (encre). Les bases sont FIXES (l'ordre, l'institution).
  const an2013 = interpolate(frame, [F_SERVAL, F_SERVAL + 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // -------- BEAT 2.2 : convergence régionale (présence FR pré-positionnée) --------
  // Lignes fines pointillées depuis les voisins vers le centre Mali (tracé état-major).
  // SOBRE (DA) : encre 50%, stroke-dashoffset, fade-out à l'arrivée. Idée abstraite -> overlay OK.
  const pCenter = project(MALI_CENTER[0], MALI_CENTER[1]);
  const convFade = interpolate(frame, [F_PRESENTE, F_PRESENTE + 20, F_MINUSMA - 40, F_MINUSMA], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // -------- BEAT 2.3 : MINUSMA (points bleu-ONU) --------
  // board clearing léger déjà géré moteur. Points ONU distincts des bases FR (bleu plus clair).

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={width} height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>

        {/* BEAT 2.4 — surfaces rouges (jihadisme fluide) qui s'infiltrent. SOUS les bases
            (z-index : le rouge coule sous, les bases dessus -> on voit l'encerclement). */}
        {frame >= F_ECHEC && RED_BLOBS.map((blob, i) => {
          const c = project(blob.coord[0], blob.coord[1]);
          // croissance organique (pulsation lente), démarrée à F_ECHEC + growDelay
          const start = F_ECHEC + blob.growDelay;
          const g = interpolate(frame, [start, start + 220], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
          });
          if (g <= 0) return null;
          const breath = 1 + 0.04 * Math.sin((frame - start) * 0.06);
          const r = blob.rMax * g * breath;
          return (
            <g key={`blob-${i}`} style={{ mixBlendMode: "multiply" }}>
              <circle cx={c.x} cy={c.y} r={r * 1.25} fill={RED} fillOpacity={0.12 * g}
                style={{ filter: "blur(8px)" }} />
              <circle cx={c.x} cy={c.y} r={r} fill={RED} fillOpacity={0.30 * g} />
            </g>
          );
        })}

        {/* BEAT 2.2 — convergence régionale (lignes pointillées état-major, SOBRE).
            Trace pointillée (dash 2/5) qui se DESSINE du voisin vers le centre via un point
            d'avancée (le "head"), puis fade-out. Idée abstraite (présence pré-positionnée). */}
        {convFade > 0 && CONVERGENCE_FROM.map((src, i) => {
          const p0 = project(src.coord[0], src.coord[1]);
          const t = interpolate(frame, [F_PRESENTE + src.delay, F_PRESENTE + src.delay + 40], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
          });
          if (t <= 0) return null;
          // point d'avancée (head) interpolé du voisin vers le centre
          const hx = p0.x + (pCenter.x - p0.x) * t;
          const hy = p0.y + (pCenter.y - p0.y) * t;
          return (
            <g key={`conv-${i}`} style={{ mixBlendMode: "multiply" }}>
              {/* trace pointillée parcourue (du voisin au head) */}
              <line x1={p0.x} y1={p0.y} x2={hx} y2={hy}
                stroke={INK} strokeWidth={1.2} strokeOpacity={0.45 * convFade}
                strokeLinecap="round" strokeDasharray="2 5" />
              {/* petit point d'avancée */}
              <circle cx={hx} cy={hy} r={2.2} fill={INK} fillOpacity={0.55 * convFade} />
            </g>
          );
        })}

        {/* BEAT 2.3 — points MINUSMA (bleu-ONU, distincts des bases FR). */}
        {frame >= F_MINUSMA && MINUSMA_PTS.map((pt, i) => {
          const p = project(pt.coord[0], pt.coord[1]);
          const t = interpolate(frame, [F_MINUSMA + pt.delay, F_MINUSMA + pt.delay + 16], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
          });
          if (t <= 0) return null;
          return (
            <g key={`un-${i}`}>
              {/* halo ONU doux */}
              <circle cx={p.x} cy={p.y} r={18} fill={UN_BLUE} fillOpacity={0.10 * t} />
              {/* double anneau ONU (béret bleu) + point */}
              <circle cx={p.x} cy={p.y} r={12} fill="none" stroke={UN_BLUE}
                strokeWidth={2.4} strokeOpacity={0.9 * t} />
              <circle cx={p.x} cy={p.y} r={6} fill={UN_BLUE} fillOpacity={0.95 * t}
                stroke={INK} strokeWidth={1} strokeOpacity={0.7 * t} />
            </g>
          );
        })}

        {/* BEAT 2.1 — bases FR (étoiles bleu-acier rigides, "frappent" la carte). */}
        {FR_BASES.map((base, i) => {
          if (frame < base.appear) return null;
          const p = project(base.coord[0], base.coord[1]);
          // overshoot d'apparition (la base "frappe")
          const t = interpolate(frame, [base.appear, base.appear + 14], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)),
          });
          if (t <= 0) return null;
          const rO = 13 * Math.min(1.12, t);
          const rI = rO * 0.42;
          // BEAT 2.4 — EXTINCTION : quand le rouge a encerclé la base (F_ECHEC + delay),
          // désaturation (steel -> gris mort) + opacity baisse + petit "×" (analytique, pas pathos).
          const extStart = F_ECHEC + (BASE_EXTINCTION[base.name] ?? 999999);
          const ext = interpolate(frame, [extStart, extStart + 40], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
          });
          const fillCol = lerpHex(FR_STEEL, STEEL_DEAD, ext);
          const aliveOp = (1 - 0.6 * ext); // opacity 1 -> 0.4
          return (
            <g key={`frbase-${i}`}>
              {/* halo d'ancrage (disparaît à l'extinction) */}
              <circle cx={p.x} cy={p.y} r={rO * 1.5} fill={FR_STEEL} fillOpacity={0.10 * t * (1 - ext)} />
              {/* étoile militaire (désature + s'efface à l'extinction) */}
              <path d={starPath(p.x, p.y, rO, rI)} fill={fillCol} fillOpacity={0.92 * t * aliveOp}
                stroke={INK} strokeWidth={1.4} strokeOpacity={0.85 * t * aliveOp} strokeLinejoin="round" />
              {/* petit "×" de retrait (apparaît à l'extinction) */}
              {ext > 0.3 && (
                <g stroke={INK} strokeWidth={2} strokeOpacity={0.8 * ext} strokeLinecap="round">
                  <line x1={p.x - 6} y1={p.y - 6} x2={p.x + 6} y2={p.y + 6} />
                  <line x1={p.x - 6} y1={p.y + 6} x2={p.x + 6} y2={p.y - 6} />
                </g>
              )}
              {/* label base (s'estompe aussi à l'extinction) */}
              <text x={p.x} y={p.y + base.dy} textAnchor="middle"
                fontFamily="'Cormorant Garamond', Georgia, serif" fontSize={16} fontWeight={700}
                letterSpacing={1.5} fill={INK} fillOpacity={t * (1 - 0.5 * ext)}
                stroke={SAHEL_LAND} strokeWidth={3} strokeOpacity={0.7 * t * (1 - 0.5 * ext)} paintOrder="stroke">
                {base.name}
              </text>
            </g>
          );
        })}

        {/* BEAT 2.1+2.4 — repère temporel bas-gauche. "2013" fixe à l'installation, PUIS
            l'année DÉFILE 2013->2022 pendant l'échec 10 ans (timeline filigrane). */}
        {an2013 > 0 && (() => {
          // année courante : 2013 jusqu'à F_ECHEC, puis défile vers 2022 sur ~250 frames
          const yearF = interpolate(frame, [F_ECHEC, F_ECHEC + 250], [2013, 2022], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const year = Math.round(yearF);
          return (
            <text x={120} y={height - 70} opacity={an2013} style={{ mixBlendMode: "multiply" }}
              fontFamily="'Cormorant Garamond', Georgia, serif" fontSize={56} fontWeight={700}
              fill={INK} letterSpacing={4}>
              {year}
            </text>
          );
        })()}
      </svg>
    </AbsoluteFill>
  );
};
