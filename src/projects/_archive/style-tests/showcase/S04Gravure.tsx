import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { W, H, GROUND_Y, enter, exit, StyleTitle, CharLabel } from "./ShowcaseShared";

const PARCHMENT = "#e8dcc8";
const INK       = "#1a1008";
const INK_LIGHT = "#3a2818";

const GravureDefs: React.FC = () => (
  <defs>
    {/* Hatch 45 degrees */}
    <pattern id="s04-h45" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke={INK} strokeWidth="0.9" />
    </pattern>
    {/* Crosshatch */}
    <pattern id="s04-cross" patternUnits="userSpaceOnUse" width="8" height="8">
      <line x1="0" y1="0" x2="0" y2="8" stroke={INK} strokeWidth="0.8" />
      <line x1="0" y1="0" x2="8" y2="0" stroke={INK} strokeWidth="0.8" />
    </pattern>
    {/* Dense hatch */}
    <pattern id="s04-dense" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(30)">
      <line x1="0" y1="0" x2="0" y2="4" stroke={INK} strokeWidth="0.7" />
    </pattern>
    {/* Contour shadow */}
    <filter id="s04-press" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor={INK} floodOpacity="0.35" />
    </filter>
  </defs>
);

// Engraving character built with hatch fills
const GravureChar: React.FC<{
  x: number;
  y: number;
  walkPhase: number;
  type: "bourgeois" | "bourreau";
  armRaise?: number;   // 0..1
  recoil?: number;     // 0..1
}> = ({ x, y, walkPhase, type, armRaise = 0, recoil = 0 }) => {
  const isBourg = type === "bourgeois";
  const bob = Math.abs(Math.sin(walkPhase)) * 4;
  const recoilX = recoil * (isBourg ? 60 : 0);

  const hr = isBourg ? 22 : 26;
  const tw = isBourg ? 54 : 64;
  const th = isBourg ? 78 : 90;
  const ll = isBourg ? 80 : 88;
  const lw = isBourg ? 18 : 22;
  const al = isBourg ? 66 : 72;
  const aw = isBourg ? 14 : 18;

  const headY = y - th - ll - hr * 2 - 4 + bob;
  const torsoY = y - th - ll + bob;
  const hipY = y - ll + bob;

  const legA = Math.sin(walkPhase) * 22;
  const legA2 = Math.sin(walkPhase + Math.PI) * 22;
  const armA = Math.sin(walkPhase + Math.PI) * 16;
  const frontArmA = isBourg ? (Math.sin(walkPhase) * 16 - armRaise * 85)
                              : (Math.sin(walkPhase) * 16 + armRaise * 70);

  return (
    <g transform={`translate(${recoilX}, 0)`} filter="url(#s04-press)">
      {/* Back leg */}
      <g transform={`translate(${x - 12}, ${hipY}) rotate(${legA2}, 0, 0)`}>
        <rect x={-lw / 2} y={0} width={lw} height={ll} rx={0} fill="url(#s04-h45)" stroke={INK} strokeWidth="1.5" />
        <rect x={-lw / 2} y={0} width={lw} height={ll} rx={0} fill="none" stroke={INK} strokeWidth="1.5" />
        <rect x={-11} y={ll - 14} width={24} height={16} rx={2} fill="url(#s04-cross)" stroke={INK} strokeWidth="1.5" />
        <rect x={-11} y={ll - 14} width={24} height={16} rx={2} fill="none" stroke={INK} strokeWidth="1.5" />
      </g>
      {/* Back arm */}
      <g transform={`translate(${x - tw / 2 + 5}, ${torsoY + 14}) rotate(${armA}, 0, 0)`}>
        <rect x={-aw / 2} y={0} width={aw} height={al} rx={0} fill="url(#s04-h45)" stroke={INK} strokeWidth="1.5" />
        <rect x={-aw / 2} y={0} width={aw} height={al} rx={0} fill="none" stroke={INK} strokeWidth="1.5" />
      </g>
      {/* Torso */}
      <rect x={x - tw / 2} y={torsoY} width={tw} height={th} rx={0} fill="url(#s04-cross)" stroke={INK} strokeWidth="2" />
      {/* Clothing lines */}
      <line x1={x} y1={torsoY + 8} x2={x} y2={torsoY + th - 16} stroke={INK} strokeWidth="1.2" opacity="0.6" />
      {isBourg && (
        <>
          <rect x={x - tw / 2} y={torsoY + th * 0.6} width={tw} height={14} rx={0} fill="url(#s04-dense)" stroke={INK} strokeWidth="1.5" />
          <rect x={x - tw / 2} y={torsoY + th * 0.6} width={tw} height={14} rx={0} fill="none" stroke={INK} strokeWidth="1.5" />
        </>
      )}
      {!isBourg && (
        /* Hood / executioner mask */
        <>
          <rect x={x - 28} y={torsoY - 10} width={56} height={40} rx={4} fill="url(#s04-dense)" stroke={INK} strokeWidth="2" />
          <rect x={x - 28} y={torsoY - 10} width={56} height={40} rx={4} fill="none" stroke={INK} strokeWidth="2" />
          <rect x={x - 8} y={torsoY + 4} width={16} height={12} rx={2} fill={PARCHMENT} stroke={INK} strokeWidth="1.5" />
        </>
      )}
      {/* Front arm */}
      <g transform={`translate(${x + tw / 2 - 5}, ${torsoY + 14}) rotate(${frontArmA}, 0, 0)`}>
        <rect x={-aw / 2} y={0} width={aw} height={al} rx={0} fill="url(#s04-h45)" stroke={INK} strokeWidth="1.5" />
        <rect x={-aw / 2} y={0} width={aw} height={al} rx={0} fill="none" stroke={INK} strokeWidth="1.5" />
        {!isBourg && armRaise > 0.1 && (
          /* Weapon / club */
          <rect x={aw / 2} y={al * 0.4} width={8} height={52} rx={3} fill="url(#s04-dense)" stroke={INK} strokeWidth="2" />
        )}
      </g>
      {/* Front leg */}
      <g transform={`translate(${x + 12}, ${hipY}) rotate(${legA}, 0, 0)`}>
        <rect x={-lw / 2} y={0} width={lw} height={ll} rx={0} fill="url(#s04-h45)" stroke={INK} strokeWidth="1.5" />
        <rect x={-lw / 2} y={0} width={lw} height={ll} rx={0} fill="none" stroke={INK} strokeWidth="1.5" />
        <rect x={-11} y={ll - 14} width={24} height={16} rx={2} fill="url(#s04-cross)" stroke={INK} strokeWidth="1.5" />
        <rect x={-11} y={ll - 14} width={24} height={16} rx={2} fill="none" stroke={INK} strokeWidth="1.5" />
      </g>
      {/* Head */}
      {isBourg && (
        <g transform={`translate(${x}, ${headY})`}>
          <ellipse cx={0} cy={hr} rx={hr} ry={hr * 1.12} fill={PARCHMENT} stroke={INK} strokeWidth="2" />
          {/* Hatching on face shadow side */}
          <ellipse cx={10} cy={hr} rx={hr - 6} ry={hr * 0.8} fill="url(#s04-h45)" opacity="0.4" />
          {/* Hat */}
          <rect x={-hr - 4} y={0} width={(hr + 4) * 2} height={10} rx={2} fill={INK} />
          <ellipse cx={0} cy={0} rx={hr + 8} ry={7} fill={INK} />
          {/* Eyes */}
          <circle cx={-9} cy={hr - 2} r={3} fill={INK} />
          <circle cx={9} cy={hr - 2} r={3} fill={INK} />
          {/* Hatched chin beard */}
          <ellipse cx={0} cy={hr * 1.65} rx={12} ry={8} fill="url(#s04-h45)" stroke={INK} strokeWidth="1" />
        </g>
      )}
    </g>
  );
};

export const S04Gravure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = enter(frame, 0, 20);
  const sceneOpacity = frame >= 280 ? exit(frame, 280, 20) : bgOpacity;

  // Bourreau enters from left, menacing
  const bourreauX = interpolate(frame, [25, 90], [180, 680], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalBourreauX = frame >= 90 ? 680 : bourreauX;

  // Bourgeois enters from right, then recoils
  const bourgeoisX = interpolate(frame, [35, 95], [W - 180, 1080], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalBourgeoisX = frame >= 95 ? 1080 : bourgeoisX;

  const bPhase = frame * 0.15;
  const bgPhase = frame * 0.14 + 0.7;

  // Bourreau raises weapon at f130
  const bourreauArm = interpolate(frame, [130, 160], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Bourgeois recoils at f145
  const bourgeoisRecoil = interpolate(frame, [145, 175], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const bourgeoisUnrecoil = interpolate(frame, [220, 250], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalRecoil = frame >= 220 ? bourgeoisRecoil * bourgeoisUnrecoil : bourgeoisRecoil;

  // Threat lines radiating from raised arm
  const threatOpacity = interpolate(frame, [130, 160, 220, 240], [0, 0.7, 0.7, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneOpacity }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <GravureDefs />

        {/* Parchment background */}
        <rect width={W} height={H} fill={PARCHMENT} />

        {/* Fine line texture overlay */}
        {Array.from({ length: 22 }).map((_, i) => (
          <line
            key={i}
            x1={0}
            y1={48 + i * 50}
            x2={W}
            y2={48 + i * 50}
            stroke={INK}
            strokeWidth="0.5"
            opacity="0.07"
          />
        ))}

        {/* Ground — dense hatching */}
        <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill="url(#s04-dense)" />
        <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill="none" stroke={INK} strokeWidth="2" />
        <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y} stroke={INK} strokeWidth={2.5} />

        {/* Background architecture lines */}
        {[200, 700, 1200, 1700].map((bx, i) => (
          <g key={i} opacity="0.35">
            <rect x={bx} y={GROUND_Y - 240} width={90} height={240} fill="url(#s04-h45)" stroke={INK} strokeWidth="1" />
            <polygon points={`${bx},${GROUND_Y - 240} ${bx + 45},${GROUND_Y - 290} ${bx + 90},${GROUND_Y - 240}`} fill="url(#s04-cross)" stroke={INK} strokeWidth="1" />
          </g>
        ))}

        {/* Bourgeois */}
        <GravureChar
          x={finalBourgeoisX}
          y={GROUND_Y}
          walkPhase={frame < 95 ? bgPhase : 0}
          type="bourgeois"
          recoil={finalRecoil}
        />

        {/* Bourreau (executioner) */}
        <GravureChar
          x={finalBourreauX}
          y={GROUND_Y}
          walkPhase={frame < 90 ? bPhase : 0}
          type="bourreau"
          armRaise={bourreauArm}
        />

        {/* Threat radiating lines */}
        {threatOpacity > 0 && (
          <g opacity={threatOpacity}>
            {[-50, -20, 10, 40].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const len = 120;
              return (
                <line
                  key={i}
                  x1={finalBourreauX + 30}
                  y1={GROUND_Y - 220}
                  x2={finalBourreauX + 30 + Math.cos(rad) * len}
                  y2={GROUND_Y - 220 + Math.sin(rad) * len}
                  stroke={INK}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        )}

        {/* Decorative border */}
        <rect x={20} y={20} width={W - 40} height={H - 40} fill="none" stroke={INK} strokeWidth={3} />
        <rect x={28} y={28} width={W - 56} height={H - 56} fill="none" stroke={INK} strokeWidth={1} />

        <CharLabel x={finalBourreauX} y={GROUND_Y + 52} name="Le Bourreau" fill={INK} />
        <CharLabel x={finalBourgeoisX} y={GROUND_Y + 52} name="Le Bourgeois" fill={INK} />
      </svg>

      <StyleTitle
        frame={frame}
        number="04"
        title="Gravure Monochrome SVG"
        subtitle="Hachures croisees — encre et parchemin — style taille-douce"
        textColor={INK}
        bgColor={`${PARCHMENT}F0`}
      />
    </div>
  );
};
