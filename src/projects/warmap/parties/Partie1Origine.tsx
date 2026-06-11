// Partie 1 — ORIGINE 2012 (canari). Direction SOUSTRACTION (validee DA 3 voix + Aziz).
//
// Couche PURE dessinee par-dessus la carte du moteur. Recoit le contexte
// SahelRenderContext (frame, project lon/lat->px, etat). Ne possede PAS la map.
//
// Beats (recales sur narration-v5-alignment.json @30fps) :
//   1.0 board clearing (jetons Acte 1 -> 0.05, gere par le moteur) + reperes "LIBYE" + "2012"
//   1.1 pulse Libye (effondrement)
//   1.2 trait d'encre Libye->Mali (route reelle Sebha->Salvador->Kidal) + taches Kidal/Gao/Tombouctou
//   1.3 vide d'Etat (chute opacite fill rural) + hachures tensions
//
// REGLE P1 : PAS d'overlay, PAS d'objets (origine 2012 = abstraite, 100% cartographiable).
// Encre/taches en mixBlendMode multiply, palette parchemin. PAS de particules TikTok.

import React from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import type { SahelRenderContext } from "../engine/SahelContext";

// ============================================================
// TRIGGERS V5 (alignment narration-v5-alignment.json, x30fps)
//   "bascule"     f2102  -> board clearing (moteur) + "2012" s'inscrit
//   "Libye"       f2178  -> repere LIBYE
//   "s'effondre"  f2210  / "effondrement" f2272 -> pulse Libye (beat 1.1)
//   "flot"        f2305  / "d'armes" f2311      -> trait + taches (beat 1.2)
//   "absent"      f2743  -> vide d'Etat (beat 1.3)
//   "tensions"    f2844  -> hachures
// ============================================================
const F_2012 = 2102;   // "bascule"
const F_LIBYE = 2178;  // "Libye"
const F_PULSE = 2210;  // "s'effondre" -> pulse Libye (effondrement)

// Encre parchemin (coherence palette Sahel)
const INK = "#3A2A18";
const INK_DEEP = "#2A1C0E";

// Coordonnees geo (lon, lat)
const LIBYE_LABEL_COORD: [number, number] = [16.0, 27.5];   // sud-Libye (label, zone source)
const LIBYE_SOURCE_COORD: [number, number] = [14.4, 27.0];  // Sebha (foyer de l'effondrement / source armes)

type Props = {
  ctx: SahelRenderContext | null;
};

export const Partie1Origine: React.FC<Props> = ({ ctx }) => {
  if (!ctx) return null;
  const { frame, width, height, project } = ctx;

  // -------- BEAT 1.0 : reperes "2012" (encre qui se remplit) + "LIBYE" --------
  // "2012" : apparait au mot "bascule", mask de remplissage gauche->droite (encre).
  const y2012Fill = interpolate(frame, [F_2012, F_2012 + 24], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const y2012Op = interpolate(frame, [F_2012, F_2012 + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // "LIBYE" : repere geo-ancre (texte encre opacity 0.6) qui apparait au nommage.
  const libyeOp = interpolate(frame, [F_LIBYE, F_LIBYE + 18], [0, 0.6], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const pLibye = project(LIBYE_LABEL_COORD[0], LIBYE_LABEL_COORD[1]);

  // -------- BEAT 1.1 : pulse Libye (effondrement) --------
  // Onde-radar lente (3 cercles concentriques opacity decroissante), encre, ~2.5s.
  // Apres le pulse, Libye reste "chaude" (teinte fixe legere) = foyer persistant.
  const pSource = project(LIBYE_SOURCE_COORD[0], LIBYE_SOURCE_COORD[1]);
  const RINGS = [0, 18, 36]; // decalage d'amorce entre les 3 ondes (frames)
  const pulseDur = 75; // ~2.5s
  // teinte "chaude" persistante (monte pendant le pulse, reste ensuite)
  const libyeHeat = interpolate(frame, [F_PULSE, F_PULSE + 40], [0, 0.22], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <defs>
          {/* mask de remplissage pour "2012" (revele gauche->droite) */}
          <clipPath id="p1-2012-fill">
            <rect x={0} y={0} width={width * y2012Fill} height={height} />
          </clipPath>
        </defs>

        {/* BEAT 1.1 — foyer "chaud" persistant sur la Libye (sous les ondes). */}
        {libyeHeat > 0 && (
          <circle
            cx={pSource.x}
            cy={pSource.y}
            r={46}
            fill={INK_DEEP}
            fillOpacity={libyeHeat}
            style={{ mixBlendMode: "multiply", filter: "blur(10px)" }}
          />
        )}

        {/* BEAT 1.1 — onde-radar effondrement (3 cercles concentriques lents). */}
        {frame >= F_PULSE && frame < F_PULSE + pulseDur + 40 && RINGS.map((delay, i) => {
          const t = interpolate(frame, [F_PULSE + delay, F_PULSE + delay + pulseDur], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
          });
          if (t <= 0 || t >= 1) return null;
          const r = 8 + t * 120;
          const op = (1 - t) * 0.5;
          return (
            <circle
              key={`pulse-${i}`}
              cx={pSource.x}
              cy={pSource.y}
              r={r}
              fill="none"
              stroke={INK_DEEP}
              strokeWidth={2.2 - t * 1.4}
              strokeOpacity={op}
              style={{ mixBlendMode: "multiply" }}
            />
          );
        })}

        {/* "2012" — cartouche date en encre, ancre bas-gauche (ou la timeline Acte 1
            etait). Se remplit au mot "bascule". Repere temporel du redemarrage du recit. */}
        {y2012Op > 0 && (
          <g opacity={y2012Op} style={{ mixBlendMode: "multiply" }}>
            {/* trace fantome (toujours visible une fois pose) */}
            <text
              x={120}
              y={height - 70}
              fontFamily="'Cormorant Garamond', Georgia, serif"
              fontSize={64}
              fontWeight={700}
              fill={INK}
              fillOpacity={0.18}
              letterSpacing={4}
            >
              2012
            </text>
            {/* remplissage encre (clip anime) */}
            <text
              x={120}
              y={height - 70}
              fontFamily="'Cormorant Garamond', Georgia, serif"
              fontSize={64}
              fontWeight={700}
              fill={INK_DEEP}
              letterSpacing={4}
              clipPath="url(#p1-2012-fill)"
            >
              2012
            </text>
          </g>
        )}

        {/* "LIBYE" — repere geo-ancre sur la zone sud-libyenne (source). */}
        {libyeOp > 0 && (
          <g opacity={libyeOp} style={{ mixBlendMode: "multiply" }}>
            <text
              x={pLibye.x}
              y={pLibye.y}
              textAnchor="middle"
              fontFamily="'Cormorant Garamond', Georgia, serif"
              fontSize={30}
              fontWeight={700}
              fill={INK_DEEP}
              letterSpacing={6}
            >
              LIBYE
            </text>
            {/* petit tiret de reperage sous le label */}
            <line
              x1={pLibye.x - 26}
              y1={pLibye.y + 10}
              x2={pLibye.x + 26}
              y2={pLibye.y + 10}
              stroke={INK_DEEP}
              strokeWidth={1.5}
              strokeOpacity={0.8}
            />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
