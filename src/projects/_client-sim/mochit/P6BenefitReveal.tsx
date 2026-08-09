// Panneau benefice + reveal URL (2.6s/78f, fusion des beats 6+7 du breakdown JSON : 9.6-13.2s
// original). MAKE YOUR PROCESS / WORK FOR YOU en 2 temps, puis un panneau clair remonte depuis le
// bas et revele l'URL -- wipe frame-driven propre (pas de flou de compression comme l'original).
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { MI_COLORS, MI_CLAMP as clamp } from "./theme";

const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);

const T_LINE1 = 4;
const T_LINE2 = 14;
const T_PANEL_RISE = 40;
const T_PANEL_DUR = 16;
const T_URL_IN = 52;

export const P6BenefitReveal: React.FC = () => {
  const frame = useCurrentFrame();

  const line1P = interpolate(frame, [T_LINE1, T_LINE1 + 9], [0, 1], { ...clamp, easing: EXPO_OUT });
  const line1Y = interpolate(line1P, [0, 1], [24, 0]);

  const line2P = interpolate(frame, [T_LINE2, T_LINE2 + 9], [0, 1], { ...clamp, easing: EXPO_OUT });
  const line2Y = interpolate(line2P, [0, 1], [24, 0]);

  const panelP = interpolate(frame, [T_PANEL_RISE, T_PANEL_RISE + T_PANEL_DUR], [0, 1], { ...clamp, easing: EXPO_OUT });
  const panelY = interpolate(panelP, [0, 1], [2460, 1150]);

  const urlP = interpolate(frame, [T_URL_IN, T_URL_IN + 9], [0, 1], { ...clamp, easing: EXPO_OUT });

  return (
    <AbsoluteFill style={{ background: MI_COLORS.navy }}>
      <svg viewBox="0 -270 1080 2460" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="-270" width="1080" height="2460" fill={MI_COLORS.navy} />

        <text
          x="540"
          y="880"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="86"
          fontWeight={400}
          fill={MI_COLORS.whiteWarm}
          textAnchor="middle"
          opacity={line1P}
          transform={`translate(0, ${line1Y})`}
        >
          MAKE YOUR PROCESS
        </text>
        <text
          x="540"
          y="1000"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="92"
          fontWeight={900}
          fill={MI_COLORS.magenta}
          textAnchor="middle"
          opacity={line2P}
          transform={`translate(0, ${line2Y})`}
        >
          WORK FOR YOU
        </text>

        {/* panneau clair qui remonte et revele l'URL -- occupe tout le bas du cadre etire */}
        <g transform={`translate(0, ${panelY})`}>
          <rect x="0" y="0" width="1080" height="1600" fill={MI_COLORS.offWhite} />
          <text
            x="540"
            y="260"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="58"
            fontWeight={900}
            fill={MI_COLORS.magenta}
            textAnchor="middle"
            opacity={urlP}
          >
            WWW.MOCH-IT.COM
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
