// P2 — "We design smart workflows that cut through the noise." (3.8s/114f, etendu de 24f apres
// suppression du panneau P4WeDesignIntro doublon).
// V4 (2026-08-08, diagnostic verifie contre l'original) : rx reduit (rectangles a coins LEGEREMENT
// arrondis, pas des pilules completes -- l'original a des rectangles nets, "systeme" pas "chatbot"
// selon le retour), easing expo-out sur toutes les entrees, timing etale sur les 24f
// supplementaires liberees par la suppression du doublon "WE DESIGN".
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MI_COLORS, MI_CLAMP as clamp } from "./theme";

const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const CAPSULE_RX = 16; // coins legerement arrondis (pas rx=h/2 -- corrige l'effet "pilule/chatbot")

// 4 rectangles, positions en escalier descendant (fidele a l'original), chacune porte un morceau
// de la phrase "WE DESIGN / SMART WORKFLOWS / THAT CUT / THROUGH NOISE". Timeline etalee sur 114f.
const CAPSULES = [
  { text: "WE DESIGN", x: 100, y: 480, w: 460, h: 130, fontSize: 56, bold: false, start: 4 },
  { text: "SMART WORKFLOWS", x: 340, y: 690, w: 640, h: 160, fontSize: 62, bold: true, start: 26 },
  { text: "THAT CUT", x: 80, y: 940, w: 420, h: 130, fontSize: 56, bold: true, start: 52 },
  { text: "THROUGH NOISE", x: 260, y: 1150, w: 600, h: 130, fontSize: 56, bold: false, start: 76 },
];

// Connecteurs en L entre capsules consecutives (dessines par draw-on, pas un cut).
const CONNECTORS = [
  { d: "M330,610 V650 H560", start: 18 },
  { d: "M340,850 V895 H290", start: 44 },
  { d: "M290,1070 V1105 H460", start: 68 },
];

export const P2Workflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const capsuleAnim = (start: number) => {
    const sp = spring({ frame: frame - start, fps, config: { damping: 15, stiffness: 200, mass: 0.8 }, durationInFrames: 13 });
    return { opacity: sp, scale: interpolate(sp, [0, 1], [0.85, 1]) };
  };

  const connectorDraw = (start: number) => interpolate(frame, [start, start + 12], [0, 1], { ...clamp, easing: EXPO_OUT });

  return (
    <AbsoluteFill style={{ background: MI_COLORS.slate }}>
      <svg viewBox="0 -270 1080 2460" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="-270" width="1080" height="2460" fill={MI_COLORS.slate} />

        {CONNECTORS.map((c, i) => (
          <path
            key={i}
            d={c.d}
            fill="none"
            stroke={MI_COLORS.magenta}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={400}
            strokeDashoffset={400 * (1 - connectorDraw(c.start))}
          />
        ))}

        {CAPSULES.map((c, i) => {
          const a = capsuleAnim(c.start);
          const cx = c.x + c.w / 2;
          const cy = c.y + c.h / 2;
          return (
            <g key={i} opacity={a.opacity} transform={`scale(${a.scale})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
              <rect x={c.x} y={c.y} width={c.w} height={c.h} rx={CAPSULE_RX} fill={MI_COLORS.cardLight} stroke={MI_COLORS.magenta} strokeWidth={5} />
              <text
                x={cx}
                y={cy + c.fontSize * 0.34}
                fontFamily="Arial, Helvetica, sans-serif"
                fontSize={c.fontSize}
                fontWeight={c.bold ? 900 : 400}
                fill={MI_COLORS.charcoal}
                textAnchor="middle"
              >
                {c.text}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
