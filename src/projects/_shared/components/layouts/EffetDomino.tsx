import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

export interface DominoPilier {
  pays: string;
  code: string;
  nom: string;
  bandes: [string, string, string];
  triggerFrame: number;
}

export interface EffetDominoProps {
  piliers?: DominoPilier[];
  impactText?: string;
  impactSubText?: string;
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const PILIER_W = 80;
const PILIER_H = 200;
const GROUND_Y = 740;
const STANDING_TOP_Y = GROUND_Y - PILIER_H;

const DEFAULT_PILIERS: DominoPilier[] = [
  { pays: "Mali", code: "ML", nom: "MALI", bandes: ["#14B53A", "#FCD116", "#CE1126"], triggerFrame: 30 },
  { pays: "Burkina", code: "BF", nom: "BURKINA", bandes: ["#EF2B2D", "#EF2B2D", "#009A00"], triggerFrame: 57 },
  { pays: "Niger", code: "NE", nom: "NIGER", bandes: ["#E05206", "#FFFFFF", "#009A00"], triggerFrame: 84 },
  { pays: "Gabon", code: "GA", nom: "GABON", bandes: ["#009E60", "#FCD116", "#3A75C4"], triggerFrame: 111 },
  { pays: "Sénégal", code: "SN", nom: "SÉNÉGAL", bandes: ["#00853F", "#FDEF42", "#E31B23"], triggerFrame: 138 },
];

const CENTER_X_BASE = 560;
const SPACING = 160;

export const EffetDomino: React.FC<EffetDominoProps> = ({
  piliers = DEFAULT_PILIERS,
  impactText = "5 COUPS D'ÉTAT EN 3 ANS",
  impactSubText = "Sahel — 2020–2023",
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const totalW = piliers.length * SPACING - (SPACING - PILIER_W);
  const startX = (1920 - totalW) / 2;

  const impactSpring = spring({
    frame: Math.max(0, frame - 165),
    fps,
    config: { damping: 18, stiffness: 150 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        {/* Fond */}
        <rect x={0} y={0} width={1920} height={1080} fill="#1a2535" />

        {/* Ligne de sol */}
        <line x1={0} y1={GROUND_Y} x2={1920} y2={GROUND_Y} stroke="rgba(200,169,81,0.3)" strokeWidth={1} />

        {/* Piliers */}
        {piliers.map((p, i) => {
          const cx = startX + i * SPACING;
          const rotSpring = spring({
            frame: Math.max(0, frame - p.triggerFrame),
            fps,
            config: { damping: 8, stiffness: 120, mass: 1 },
          });
          const rotation = interpolate(rotSpring, [0, 1], [0, 90], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const pivotX = cx;
          const pivotY = GROUND_Y;

          const shadowOp = interpolate(rotation, [0, 90], [0, 0.4], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <g key={i}>
              {/* Ombre */}
              <ellipse
                cx={pivotX + interpolate(rotation, [0, 90], [0, PILIER_H / 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                cy={GROUND_Y + 4}
                rx={interpolate(rotation, [0, 90], [PILIER_W / 2, PILIER_H / 2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                ry={8}
                fill="rgba(0,0,0,0.4)"
                opacity={shadowOp}
              />
              {/* Pilier avec rotation depuis la base */}
              <g transform={`rotate(${rotation}, ${pivotX}, ${pivotY})`}>
                {/* 3 bandes de drapeau */}
                {p.bandes.map((color, bi) => (
                  <rect
                    key={bi}
                    x={cx - PILIER_W / 2 + bi * (PILIER_W / 3)}
                    y={STANDING_TOP_Y}
                    width={PILIER_W / 3}
                    height={PILIER_H}
                    fill={color}
                    rx={bi === 0 ? 3 : bi === 2 ? 3 : 0}
                  />
                ))}
                {/* Contour */}
                <rect
                  x={cx - PILIER_W / 2}
                  y={STANDING_TOP_Y}
                  width={PILIER_W}
                  height={PILIER_H}
                  fill="none"
                  stroke="rgba(242,235,217,0.2)"
                  strokeWidth={1}
                  rx={3}
                />
                {/* Label code pays */}
                <text
                  x={cx} y={STANDING_TOP_Y - 40}
                  textAnchor="middle"
                  style={{ fontFamily: FONT_MONO, fontSize: 22, fontWeight: "700", fill: "#f2ebd9" }}
                >
                  {p.code}
                </text>
                <text
                  x={cx} y={STANDING_TOP_Y - 14}
                  textAnchor="middle"
                  style={{ fontFamily: FONT_MONO, fontSize: 16, fill: "#c8a951" }}
                >
                  {p.nom}
                </text>
              </g>
            </g>
          );
        })}

        {/* Texte d'impact */}
        <g opacity={impactSpring}>
          <text
            x={960} y={420}
            textAnchor="middle"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 64,
              fontWeight: "bold",
              fill: "#e63946",
              letterSpacing: "0.08em",
            }}
          >
            {impactText}
          </text>
          <text
            x={960} y={490}
            textAnchor="middle"
            style={{
              fontFamily: FONT_MONO,
              fontSize: 30,
              fill: "#c8a951",
              letterSpacing: "0.04em",
            }}
          >
            {impactSubText}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
