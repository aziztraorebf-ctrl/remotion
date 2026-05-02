import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { W, H, GROUND_Y, enter, exit, StyleTitle, CharLabel } from "./ShowcaseShared";

const PARCH  = "#f4e4c1";
const BEIGE  = "#e8d4a0";
const BROWN  = "#8B6914";
const INK    = "#3a2000";
const SHADOW = "rgba(60, 30, 0, 0.18)";
const SKIN   = "#d4a76a";
const SKIN_D = "#b8864e";
const LINEN  = "#e0ccaa";
const BLUE   = "#2a5a8a";
const RED    = "#9a2a1a";
const GREEN  = "#2a5a30";

const PaperDefs: React.FC = () => (
  <defs>
    <filter id="s07-shadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="3" dy="3" stdDeviation="4" floodColor={SHADOW} />
    </filter>
    <filter id="s07-softshadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="4" dy="5" stdDeviation="6" floodColor="rgba(60,30,0,0.14)" />
    </filter>
    <filter id="s07-noise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="5" result="n" />
      <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" result="t" />
      <feComposite in="t" in2="SourceGraphic" operator="over" />
    </filter>
    <pattern id="s07-lines" patternUnits="userSpaceOnUse" width="1920" height="64">
      <line x1="0" y1="63" x2="1920" y2="63" stroke="#c9a97a" strokeWidth="1" opacity="0.3" />
    </pattern>
  </defs>
);

// Pivot-based limb (same technique as StyleCutout.tsx)
const Limb: React.FC<{
  pivotX: number;
  pivotY: number;
  angle: number;
  w: number;
  h: number;
  fill: string;
  sleeveColor?: string;
  isArm?: boolean;
  hasFoot?: boolean;
}> = ({ pivotX, pivotY, angle, w, h, fill, sleeveColor, isArm, hasFoot }) => (
  <g transform={`translate(${pivotX}, ${pivotY}) rotate(${angle}, 0, 0)`} filter="url(#s07-shadow)">
    {/* Limb body */}
    <rect x={-w / 2} y={0} width={w} height={h} rx={w / 2} fill={fill} stroke={INK} strokeWidth="1.8" filter="url(#s07-noise)" />
    {/* Sleeve overlay if arm */}
    {isArm && sleeveColor && (
      <rect x={-w / 2} y={0} width={w} height={h * 0.52} rx={w / 2} fill={sleeveColor} stroke={INK} strokeWidth="1.5" filter="url(#s07-noise)" />
    )}
    {/* Hand if arm */}
    {isArm && (
      <circle cx={0} cy={h} r={w * 0.45} fill={SKIN} stroke={INK} strokeWidth="1.5" />
    )}
    {/* Foot if leg */}
    {hasFoot && (
      <rect x={-w / 2 - 4} y={h - 10} width={w + 12} height={14} rx={7} fill={INK} />
    )}
  </g>
);

// Bourgeois paper cutout character
const BourgeoisCutout: React.FC<{
  x: number;
  y: number;
  walkCycle: number;
  entrySpring: number;
  handshake?: number;  // 0..1 extends right arm toward center
}> = ({ x, y, walkCycle, entrySpring, handshake = 0 }) => {
  const s = Math.min(entrySpring, 1);
  const bob = Math.abs(Math.sin(walkCycle)) * 4;

  const HR = 50; const TW = 78; const TH = 118;
  const LL = 108; const LW = 24;
  const AL = 88; const AW = 20;

  const headY = y - TH - LL - HR * 2 - 4 + bob;
  const torsoY = y - TH - LL + bob;
  const hipY = y - LL + bob;
  const shoulderY = torsoY + 20;

  const lLegA = Math.sin(walkCycle + Math.PI) * 28;
  const rLegA = Math.sin(walkCycle) * 28;
  const lArmA = Math.sin(walkCycle) * 22;
  const rArmA = -(handshake * 52) + Math.sin(walkCycle + Math.PI) * 22;

  return (
    <g transform={`translate(${x}, 0) scale(${s}, ${s}) translate(${-x}, 0)`}>
      {/* Back leg */}
      <Limb pivotX={x - 18} pivotY={hipY} angle={lLegA} w={LW} h={LL} fill={BLUE} hasFoot />
      {/* Back arm */}
      <Limb pivotX={x - TW / 2 + 6} pivotY={shoulderY} angle={lArmA} w={AW} h={AL} fill={SKIN} isArm sleeveColor={RED} />
      {/* Torso */}
      <g transform={`translate(${x}, ${torsoY})`} filter="url(#s07-softshadow)">
        <rect x={-TW / 2} y={0} width={TW} height={TH} rx={14} fill={RED} stroke={INK} strokeWidth="2.2" filter="url(#s07-noise)" />
        {/* Gold trim collar */}
        <rect x={-TW / 2 + 8} y={2} width={TW - 16} height={24} rx={8} fill={BEIGE} stroke={INK} strokeWidth="1.5" />
        {/* Belt */}
        <rect x={-TW / 2} y={TH * 0.64} width={TW} height={14} rx={5} fill={INK} opacity="0.75" />
        <rect x={-8} y={TH * 0.64 + 3} width={16} height={8} rx={2} fill="#c8a020" stroke={INK} strokeWidth="1" />
      </g>
      {/* Front arm */}
      <Limb pivotX={x + TW / 2 - 6} pivotY={shoulderY} angle={rArmA} w={AW} h={AL} fill={SKIN} isArm sleeveColor={RED} />
      {/* Front leg */}
      <Limb pivotX={x + 18} pivotY={hipY} angle={rLegA} w={LW} h={LL} fill={BLUE} hasFoot />
      {/* Neck */}
      <rect x={x - 14} y={torsoY - 16} width={28} height={20} rx={10} fill={SKIN} stroke={INK} strokeWidth="1.8" filter="url(#s07-shadow)" />
      {/* Head */}
      <g transform={`translate(${x}, ${headY})`} filter="url(#s07-softshadow)">
        <ellipse cx={0} cy={HR} rx={HR} ry={HR * 1.1} fill={SKIN} stroke={INK} strokeWidth="2.2" filter="url(#s07-noise)" />
        {/* Hat */}
        <ellipse cx={0} cy={6} rx={HR + 12} ry={9} fill={INK} />
        <rect x={-HR + 4} y={-24} width={(HR - 4) * 2} height={32} rx={4} fill={INK} />
        {/* Hair */}
        <ellipse cx={0} cy={HR * 0.5} rx={HR + 2} ry={HR * 0.72} fill={SKIN_D} opacity="0.35" />
        {/* Eyes */}
        <circle cx={-18} cy={HR} r={7} fill="white" stroke={INK} strokeWidth="1.5" />
        <circle cx={18} cy={HR} r={7} fill="white" stroke={INK} strokeWidth="1.5" />
        <circle cx={-17} cy={HR + 1} r={3.5} fill={INK} />
        <circle cx={19} cy={HR + 1} r={3.5} fill={INK} />
        {/* Monocle */}
        <circle cx={18} cy={HR} r={10} fill="none" stroke={INK} strokeWidth="1.5" />
        <line x1={28} y1={HR + 6} x2={32} y2={HR + 18} stroke={INK} strokeWidth="1.5" />
        {/* Mustache */}
        <path d="M-14,${HR + 14} Q-4,${HR + 20} 0,${HR + 15} Q4,${HR + 20} 14,${HR + 14}" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Smile */}
        <path d={`M-12,${HR + 22} Q0,${HR + 32} 12,${HR + 22}`} stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

// Child paper cutout character
const EnfantCutout: React.FC<{
  x: number;
  y: number;
  walkCycle: number;
  entrySpring: number;
  handshake?: number;
}> = ({ x, y, walkCycle, entrySpring, handshake = 0 }) => {
  const s = Math.min(entrySpring, 1);
  const bob = Math.abs(Math.sin(walkCycle)) * 5;

  const HR = 38; const TW = 60; const TH = 86;
  const LL = 80; const LW = 18;
  const AL = 66; const AW = 15;

  const headY = y - TH - LL - HR * 2 - 4 + bob;
  const torsoY = y - TH - LL + bob;
  const hipY = y - LL + bob;
  const shoulderY = torsoY + 16;

  const lLegA = Math.sin(walkCycle + Math.PI) * 30;
  const rLegA = Math.sin(walkCycle) * 30;
  const lArmA = handshake * (-48) + Math.sin(walkCycle) * 25;
  const rArmA = Math.sin(walkCycle + Math.PI) * 25;

  return (
    <g transform={`translate(${x}, 0) scale(${s}, ${s}) translate(${-x}, 0)`}>
      {/* Back leg */}
      <Limb pivotX={x - 13} pivotY={hipY} angle={lLegA} w={LW} h={LL} fill={GREEN} hasFoot />
      {/* Back arm */}
      <Limb pivotX={x - TW / 2 + 4} pivotY={shoulderY} angle={rArmA} w={AW} h={AL} fill={SKIN} isArm sleeveColor={LINEN} />
      {/* Torso */}
      <g transform={`translate(${x}, ${torsoY})`} filter="url(#s07-softshadow)">
        <rect x={-TW / 2} y={0} width={TW} height={TH} rx={14} fill={LINEN} stroke={INK} strokeWidth="2" filter="url(#s07-noise)" />
        {/* Apron detail */}
        <rect x={-TW / 2 + 8} y={TH * 0.3} width={TW - 16} height={TH * 0.55} rx={6} fill={BEIGE} stroke={INK} strokeWidth="1.5" filter="url(#s07-noise)" />
      </g>
      {/* Front arm (handshake side) */}
      <Limb pivotX={x + TW / 2 - 4} pivotY={shoulderY} angle={lArmA} w={AW} h={AL} fill={SKIN} isArm sleeveColor={LINEN} />
      {/* Front leg */}
      <Limb pivotX={x + 13} pivotY={hipY} angle={rLegA} w={LW} h={LL} fill={GREEN} hasFoot />
      {/* Neck */}
      <rect x={x - 10} y={torsoY - 14} width={20} height={18} rx={8} fill={SKIN} stroke={INK} strokeWidth="1.5" filter="url(#s07-shadow)" />
      {/* Head */}
      <g transform={`translate(${x}, ${headY})`} filter="url(#s07-softshadow)">
        <ellipse cx={0} cy={HR} rx={HR} ry={HR * 1.08} fill={SKIN} stroke={INK} strokeWidth="2" filter="url(#s07-noise)" />
        {/* Hair — curly mop */}
        <ellipse cx={0} cy={HR * 0.22} rx={HR + 6} ry={HR * 0.65} fill={BROWN} stroke={INK} strokeWidth="1.8" />
        {[- 22, -10, 2, 14].map((hx, i) => (
          <ellipse key={i} cx={hx} cy={HR * 0.14} rx={8} ry={10} fill={BROWN} stroke={INK} strokeWidth="1" />
        ))}
        {/* Eyes — big and round */}
        <circle cx={-14} cy={HR + 2} r={8} fill="white" stroke={INK} strokeWidth="1.5" />
        <circle cx={14} cy={HR + 2} r={8} fill="white" stroke={INK} strokeWidth="1.5" />
        <circle cx={-13} cy={HR + 3} r={4} fill={INK} />
        <circle cx={15} cy={HR + 3} r={4} fill={INK} />
        {/* Freckles */}
        {[-20, -16, 16, 20].map((fx, i) => (
          <circle key={i} cx={fx} cy={HR + 12} r={2} fill={SKIN_D} opacity="0.5" />
        ))}
        {/* Smile */}
        <path d={`M-10,${HR + 20} Q0,${HR + 30} 10,${HR + 20}`} stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Bow in hair */}
        <polygon points="-6,-4 6,-4 0,8" fill={RED} stroke={INK} strokeWidth="1" transform="translate(0,-4)" />
      </g>
    </g>
  );
};

export const S07PaperCutout: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = enter(frame, 0, 20);
  const sceneOpacity = frame >= 280 ? exit(frame, 280, 20) : bgOpacity;

  const walkCycle = frame / 8;

  // Bourgeois enters from left
  const bourgEntry = spring({ frame: frame - 18, fps, config: { damping: 14, stiffness: 140 }, durationInFrames: 30 });
  const bourgX = interpolate(frame, [18, 80], [200, 660], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalBourgX = frame >= 80 ? 660 : bourgX;

  // Child enters from right
  const enfantEntry = spring({ frame: frame - 32, fps, config: { damping: 14, stiffness: 140 }, durationInFrames: 30 });
  const enfantX = interpolate(frame, [32, 92], [W - 200, 1130], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalEnfantX = frame >= 92 ? 1130 : enfantX;

  const bourgWalking = frame < 80;
  const enfantWalking = frame < 92;

  // Handshake at f145
  const handshakeIn = interpolate(frame, [140, 168], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const handshakeOut = interpolate(frame, [225, 250], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const handshake = frame >= 225 ? handshakeIn * handshakeOut : handshakeIn;

  // Paper bow appears between them at handshake peak
  const bowSpring = spring({ frame: frame - 155, fps, config: { damping: 10 }, durationInFrames: 20 });
  const bowVisible = frame >= 155 && frame < 235;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneOpacity }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <PaperDefs />

        {/* Parchment background */}
        <rect width={W} height={H} fill={PARCH} />
        <rect width={W} height={H} fill="none" filter="url(#s07-noise)" />
        <rect width={W} height={H} fill="url(#s07-lines)" />

        {/* Ground */}
        <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill={BEIGE} stroke={INK} strokeWidth="2" />

        {/* Ground paper strips */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={i}
            x={i * 170 - 20}
            y={GROUND_Y + 4}
            width={160}
            height={22}
            rx={4}
            fill={PARCH}
            stroke={INK}
            strokeWidth="1"
            opacity="0.5"
            filter="url(#s07-shadow)"
          />
        ))}

        {/* Background paper buildings */}
        {[120, 520, 1050, 1500].map((bx, i) => {
          const bh = [180, 220, 190, 160][i];
          const bw = [100, 130, 110, 90][i];
          const col = [LINEN, BEIGE, PARCH, LINEN][i];
          return (
            <g key={i} filter="url(#s07-softshadow)" opacity="0.7">
              <rect x={bx} y={GROUND_Y - bh} width={bw} height={bh} rx={4} fill={col} stroke={INK} strokeWidth="1.5" />
              <polygon
                points={`${bx - 8},${GROUND_Y - bh} ${bx + bw / 2},${GROUND_Y - bh - 60} ${bx + bw + 8},${GROUND_Y - bh}`}
                fill={BROWN}
                stroke={INK}
                strokeWidth="1.5"
              />
              <rect x={bx + bw / 2 - 12} y={GROUND_Y - bh + 30} width={24} height={32} rx={4} fill={BROWN} opacity="0.4" stroke={INK} strokeWidth="1" />
            </g>
          );
        })}

        {/* Child */}
        <EnfantCutout
          x={finalEnfantX}
          y={GROUND_Y}
          walkCycle={enfantWalking ? walkCycle : 0}
          entrySpring={Math.min(enfantEntry, 1)}
          handshake={handshake}
        />

        {/* Bourgeois */}
        <BourgeoisCutout
          x={finalBourgX}
          y={GROUND_Y}
          walkCycle={bourgWalking ? walkCycle : 0}
          entrySpring={Math.min(bourgEntry, 1)}
          handshake={handshake}
        />

        {/* Paper bow at meeting point */}
        {bowVisible && (() => {
          const bx = (finalBourgX + finalEnfantX) / 2;
          const by = GROUND_Y - 240;
          const bs = Math.min(bowSpring, 1);
          return (
            <g transform={`translate(${bx}, ${by}) scale(${bs}, ${bs}) translate(${-bx}, ${-by})`}>
              <polygon points={`${bx - 24},${by - 14} ${bx},${by} ${bx - 24},${by + 14}`} fill={RED} stroke={INK} strokeWidth="1.5" filter="url(#s07-shadow)" />
              <polygon points={`${bx + 24},${by - 14} ${bx},${by} ${bx + 24},${by + 14}`} fill={RED} stroke={INK} strokeWidth="1.5" filter="url(#s07-shadow)" />
              <circle cx={bx} cy={by} r={8} fill={BEIGE} stroke={INK} strokeWidth="1.5" />
            </g>
          );
        })()}

        {/* Outer border */}
        <rect x={18} y={18} width={W - 36} height={H - 36} fill="none" stroke={INK} strokeWidth={2.5} />

        <CharLabel x={finalBourgX} y={GROUND_Y + 52} name="Le Bourgeois" fill={INK} />
        <CharLabel x={finalEnfantX} y={GROUND_Y + 52} name="L'Enfant" fill={INK} />
      </svg>

      <StyleTitle
        frame={frame}
        number="07"
        title="SVG Papier Decoupe"
        subtitle="Pieces pivotantes, ombres portees, texture papier"
        textColor={INK}
        bgColor={`${PARCH}F0`}
      />
    </div>
  );
};
