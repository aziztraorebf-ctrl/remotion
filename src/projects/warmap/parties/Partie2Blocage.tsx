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

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={width} height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>

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
          return (
            <g key={`frbase-${i}`}>
              {/* halo d'ancrage discret */}
              <circle cx={p.x} cy={p.y} r={rO * 1.5} fill={FR_STEEL} fillOpacity={0.10 * t} />
              {/* étoile militaire (rigide, contour encre) */}
              <path d={starPath(p.x, p.y, rO, rI)} fill={FR_STEEL} fillOpacity={0.92 * t}
                stroke={INK} strokeWidth={1.4} strokeOpacity={0.85 * t} strokeLinejoin="round" />
              {/* label base (encre + halo réserve parchemin) */}
              <text x={p.x} y={p.y + base.dy} textAnchor="middle"
                fontFamily="'Cormorant Garamond', Georgia, serif" fontSize={16} fontWeight={700}
                letterSpacing={1.5} fill={INK} fillOpacity={t}
                stroke={SAHEL_LAND} strokeWidth={3} strokeOpacity={0.7 * t} paintOrder="stroke">
                {base.name}
              </text>
            </g>
          );
        })}

        {/* BEAT 2.1 — repère "2013" (encre, bas-gauche, comme "2012" en P1). */}
        {an2013 > 0 && (
          <text x={120} y={height - 70} opacity={an2013} style={{ mixBlendMode: "multiply" }}
            fontFamily="'Cormorant Garamond', Georgia, serif" fontSize={56} fontWeight={700}
            fill={INK} letterSpacing={4}>
            2013
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};
