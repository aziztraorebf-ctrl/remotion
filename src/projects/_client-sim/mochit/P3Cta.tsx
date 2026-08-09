// P3 — "Start your transformation. www.moch-it.com" (2.3s/69f).
// REFONTE apres retour Aziz (2026-08-08) : la trace residuelle + noeud magenta n'avait aucun
// referent clair a l'ecran ("on ne comprend pas ce que ca represente") -- retire. L'original EST
// un texte statique simple et lisible, c'est ce qui fonctionne : on garde l'entree en cascade
// courte (0-0.78s) PUIS immobilite totale -- seul point de repos de toute la pub, cf decision
// Aziz validee. URL = WWW.MOCH-IT.COM (fidele au domaine reel de la reference).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { MI_COLORS, MI_CLAMP as clamp } from "./theme";

const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);

const T_START_YOUR = 4;
const T_START_YOUR_DUR = 9;
const T_TRANSFORMATION = 6;
const T_TRANSFORMATION_DUR = 11;
const T_RULE = 14;
const T_RULE_DUR = 8;
const T_URL = 14;
const T_URL_DUR = 9;
const T_STABLE = 23; // 0.78s — plus rien ne bouge apres ce point

export const P3Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, T_STABLE);

  const startP = interpolate(f, [T_START_YOUR, T_START_YOUR + T_START_YOUR_DUR], [0, 1], { ...clamp, easing: EXPO_OUT });
  const startY = interpolate(startP, [0, 1], [22, 0]);

  const transP = interpolate(f, [T_TRANSFORMATION, T_TRANSFORMATION + T_TRANSFORMATION_DUR], [0, 1], { ...clamp, easing: EXPO_OUT });
  const transY = interpolate(transP, [0, 1], [30, 0]);

  const ruleWidth = interpolate(f, [T_RULE, T_RULE + 6, T_RULE + T_RULE_DUR], [0, 146, 140], { ...clamp, easing: EXPO_OUT });

  const urlP = interpolate(f, [T_URL, T_URL + T_URL_DUR], [0, 1], { ...clamp, easing: EXPO_OUT });
  const urlY = interpolate(urlP, [0, 1], [14, 0]);

  return (
    <AbsoluteFill style={{ background: MI_COLORS.offWhite }}>
      <svg viewBox="0 -270 1080 2460" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        {/* texte statique simple -- fidele a l'original, pas de decor sans referent clair */}
        <text
          x="540"
          y="1010"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="64"
          fontWeight={500}
          letterSpacing={14}
          fill={MI_COLORS.darkGray}
          textAnchor="middle"
          opacity={startP}
          transform={`translate(0, ${startY})`}
        >
          START YOUR
        </text>

        <text
          x="540"
          y="1160"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="98"
          fontWeight={800}
          letterSpacing={2}
          fill={MI_COLORS.magenta}
          textAnchor="middle"
          opacity={transP}
          transform={`translate(0, ${transY})`}
        >
          TRANSFORMATION.
        </text>

        <rect x={540 - ruleWidth / 2} y="1240" width={ruleWidth} height="6" rx="3" fill={MI_COLORS.magentaAlt} />

        <text
          x="540"
          y="1700"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="46"
          fontWeight={700}
          letterSpacing={6}
          fill={MI_COLORS.magentaAlt}
          textAnchor="middle"
          opacity={urlP}
          transform={`translate(0, ${urlY})`}
        >
          WWW.MOCH-IT.COM
        </text>
      </svg>
    </AbsoluteFill>
  );
};
