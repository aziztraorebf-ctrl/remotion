import React from "react";
import { useCurrentFrame, AbsoluteFill } from "remotion";

const SKIN_COLOR = "#d4a76a";
const TUNIC_COLOR = "#8B6914";
const HAIR_COLOR = "#4a2c00";
const PARCHMENT_BG = "#f4e4c1";
const SHADOW_COLOR = "rgba(60, 30, 0, 0.18)";
const STROKE_COLOR = "#3a2000";

const StyleCutout: React.FC = () => {
  const frame = useCurrentFrame();

  // Walking oscillation - each limb independent
  const walkCycle = frame / 8;
  const leftArmAngle = Math.sin(walkCycle) * 30;
  const rightArmAngle = Math.sin(walkCycle + Math.PI) * 30;
  const leftLegAngle = Math.sin(walkCycle + Math.PI) * 30;
  const rightLegAngle = Math.sin(walkCycle) * 30;

  // Subtle body bob
  const bodyBobY = Math.abs(Math.sin(walkCycle)) * 4;

  // Center of canvas (1920x1080)
  const cx = 960;
  const cy = 540;

  // Character measurements
  const headR = 52;
  const headCy = cy - 180 + bodyBobY;
  const neckY = headCy + headR;
  const torsoTop = neckY + 6;
  const torsoH = 120;
  const torsoW = 80;
  const torsoBottom = torsoTop + torsoH;
  const hipY = torsoBottom;

  // Arm pivot at shoulder
  const shoulderY = torsoTop + 22;
  const armLength = 90;
  const armW = 22;

  // Leg pivot at hip
  const legLength = 110;
  const legW = 26;

  // Foot dimensions
  const footW = 38;
  const footH = 16;

  return (
    <AbsoluteFill style={{ background: PARCHMENT_BG, overflow: "hidden" }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Parchment texture filter */}
          <filter id="parchment-noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="4"
              seed="2"
              result="noise"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.82
                      0 0 0 0 0.68
                      0 0 0 0 0.44
                      0 0 0 0.18 0"
              result="coloredNoise"
            />
            <feComposite in="coloredNoise" in2="SourceGraphic" operator="over" />
          </filter>

          {/* Paper edge shadow for cutout effect */}
          <filter id="cutout-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="3" dy="3" stdDeviation="4" floodColor={SHADOW_COLOR} />
          </filter>

          {/* Slight paper texture for character pieces */}
          <filter id="piece-texture" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="7" result="pnoise" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0.08 0"
              result="pcolor"
            />
            <feComposite in="pcolor" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>

        {/* Parchment background rectangle with texture */}
        <rect width="1920" height="1080" fill={PARCHMENT_BG} />
        <rect width="1920" height="1080" fill="none" filter="url(#parchment-noise)" />

        {/* Horizontal lines to reinforce parchment feel */}
        {Array.from({ length: 14 }, (_, i) => (
          <line
            key={i}
            x1="60"
            y1={120 + i * 64}
            x2="1860"
            y2={120 + i * 64}
            stroke="#c9a97a"
            strokeWidth="1"
            opacity="0.35"
          />
        ))}

        {/* Ground shadow ellipse */}
        <ellipse
          cx={cx}
          cy={hipY + legLength + footH - 8 + bodyBobY}
          rx={60}
          ry={10}
          fill="rgba(60, 30, 0, 0.12)"
        />

        {/* CHARACTER - rendered as separate paper cutout pieces */}

        {/* LEFT LEG (back, rendered first) */}
        <g
          transform={`translate(${cx - 18}, ${hipY + bodyBobY}) rotate(${leftLegAngle}, 0, 0)`}
          filter="url(#cutout-shadow)"
        >
          {/* Thigh + shin */}
          <rect
            x={-legW / 2}
            y={0}
            width={legW}
            height={legLength}
            rx={legW / 2}
            fill={TUNIC_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth="2"
            filter="url(#piece-texture)"
          />
          {/* Foot */}
          <rect
            x={-legW / 2 - 4}
            y={legLength - footH / 2}
            width={footW}
            height={footH}
            rx={footH / 2}
            fill={STROKE_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth="1.5"
          />
        </g>

        {/* LEFT ARM (back) */}
        <g
          transform={`translate(${cx - torsoW / 2 + 6}, ${shoulderY + bodyBobY}) rotate(${leftArmAngle}, 0, 0)`}
          filter="url(#cutout-shadow)"
        >
          <rect
            x={-armW / 2}
            y={0}
            width={armW}
            height={armLength}
            rx={armW / 2}
            fill={SKIN_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth="2"
            filter="url(#piece-texture)"
          />
          {/* Cuff sleeve detail */}
          <rect
            x={-armW / 2}
            y={0}
            width={armW}
            height={armLength * 0.55}
            rx={armW / 2}
            fill={TUNIC_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth="1.5"
            filter="url(#piece-texture)"
          />
        </g>

        {/* TORSO */}
        <g transform={`translate(${cx}, ${torsoTop + bodyBobY})`} filter="url(#cutout-shadow)">
          {/* Main tunic body */}
          <rect
            x={-torsoW / 2}
            y={0}
            width={torsoW}
            height={torsoH}
            rx={14}
            fill={TUNIC_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth="2.5"
            filter="url(#piece-texture)"
          />
          {/* Vertical seam line */}
          <line
            x1={0}
            y1={10}
            x2={0}
            y2={torsoH - 20}
            stroke={STROKE_COLOR}
            strokeWidth="1.5"
            opacity="0.5"
          />
          {/* Belt */}
          <rect
            x={-torsoW / 2}
            y={torsoH * 0.62}
            width={torsoW}
            height={14}
            rx={5}
            fill={STROKE_COLOR}
            opacity="0.75"
          />
          {/* Belt buckle */}
          <rect
            x={-8}
            y={torsoH * 0.62 + 3}
            width={16}
            height={8}
            rx={2}
            fill="#c8a020"
            stroke={STROKE_COLOR}
            strokeWidth="1"
          />
        </g>

        {/* RIGHT LEG (front) */}
        <g
          transform={`translate(${cx + 18}, ${hipY + bodyBobY}) rotate(${rightLegAngle}, 0, 0)`}
          filter="url(#cutout-shadow)"
        >
          <rect
            x={-legW / 2}
            y={0}
            width={legW}
            height={legLength}
            rx={legW / 2}
            fill={TUNIC_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth="2"
            filter="url(#piece-texture)"
          />
          <rect
            x={-legW / 2 - 4}
            y={legLength - footH / 2}
            width={footW}
            height={footH}
            rx={footH / 2}
            fill={STROKE_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth="1.5"
          />
        </g>

        {/* RIGHT ARM (front) */}
        <g
          transform={`translate(${cx + torsoW / 2 - 6}, ${shoulderY + bodyBobY}) rotate(${rightArmAngle}, 0, 0)`}
          filter="url(#cutout-shadow)"
        >
          <rect
            x={-armW / 2}
            y={0}
            width={armW}
            height={armLength}
            rx={armW / 2}
            fill={SKIN_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth="2"
            filter="url(#piece-texture)"
          />
          <rect
            x={-armW / 2}
            y={0}
            width={armW}
            height={armLength * 0.55}
            rx={armW / 2}
            fill={TUNIC_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth="1.5"
            filter="url(#piece-texture)"
          />
        </g>

        {/* NECK */}
        <rect
          x={cx - 14}
          y={neckY + bodyBobY - 2}
          width={28}
          height={18}
          rx={8}
          fill={SKIN_COLOR}
          stroke={STROKE_COLOR}
          strokeWidth="2"
          filter="url(#cutout-shadow)"
        />

        {/* HEAD */}
        <g transform={`translate(${cx}, ${headCy})`} filter="url(#cutout-shadow)">
          {/* Head base */}
          <ellipse
            cx={0}
            cy={0}
            rx={headR}
            ry={headR * 1.1}
            fill={SKIN_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth="2.5"
            filter="url(#piece-texture)"
          />
          {/* Hair - separate cutout piece on top */}
          <ellipse
            cx={0}
            cy={-headR * 0.55}
            rx={headR + 4}
            ry={headR * 0.65}
            fill={HAIR_COLOR}
            stroke={STROKE_COLOR}
            strokeWidth="2"
          />
          {/* Hair detail lines */}
          <line x1={-20} y1={-headR * 0.9} x2={-16} y2={-headR * 0.2} stroke="#2a1500" strokeWidth="1.5" opacity="0.6" />
          <line x1={0}   y1={-headR * 1.0} x2={0}   y2={-headR * 0.25} stroke="#2a1500" strokeWidth="1.5" opacity="0.6" />
          <line x1={20}  y1={-headR * 0.9} x2={16}  y2={-headR * 0.2} stroke="#2a1500" strokeWidth="1.5" opacity="0.6" />
          {/* Eyes */}
          <circle cx={-18} cy={4} r={6} fill="white" stroke={STROKE_COLOR} strokeWidth="1.5" />
          <circle cx={18}  cy={4} r={6} fill="white" stroke={STROKE_COLOR} strokeWidth="1.5" />
          <circle cx={-18} cy={5} r={3} fill={STROKE_COLOR} />
          <circle cx={18}  cy={5} r={3} fill={STROKE_COLOR} />
          {/* Nose - simple triangle cutout */}
          <polygon
            points="0,-4 -6,10 6,10"
            fill="#c49060"
            stroke={STROKE_COLOR}
            strokeWidth="1"
          />
          {/* Mouth */}
          <path
            d="M -12 22 Q 0 30 12 22"
            stroke={STROKE_COLOR}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Beard / chin shadow */}
          <ellipse cx={0} cy={headR * 0.72} rx={28} ry={12} fill={HAIR_COLOR} stroke={STROKE_COLOR} strokeWidth="1.5" />
        </g>

        {/* TITLE LABEL - decorative parchment style */}
        <g transform="translate(960, 920)">
          <rect x={-200} y={-30} width={400} height={54} rx={8} fill="#e8d4a0" stroke="#8B6914" strokeWidth="2" opacity="0.88" />
          <text
            x={0}
            y={10}
            textAnchor="middle"
            fontSize={26}
            fontFamily="serif"
            fill={STROKE_COLOR}
            fontStyle="italic"
          >
            Style 2 - Papier Decoupe Medieval
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export default StyleCutout;
