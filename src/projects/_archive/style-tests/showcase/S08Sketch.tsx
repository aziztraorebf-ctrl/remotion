import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { W, H, GROUND_Y, enter, exit, StyleTitle, CharLabel } from "./ShowcaseShared";

const BG    = "#faf0e6";
const INK   = "#2c1810";
const INK_L = "#4a2820";

// Draw-on hook: strokeDashoffset from pathLength -> 0
function useDrawOn(pathLength: number, startFrame: number, endFrame: number): number {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return pathLength * (1 - progress);
}

// Organic wobble on a coordinate — pencil jitter
function wobble(base: number, frame: number, seed: number, amp = 1.2): number {
  return base + Math.sin(frame * 0.08 + seed * 1.7) * amp + Math.sin(frame * 0.19 + seed * 3.1) * (amp * 0.4);
}

const SketchDefs: React.FC = () => (
  <defs>
    <filter id="s08-pencil" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="turbulence" baseFrequency="0.82" numOctaves="2" seed="14" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
);

// Sketch scholar — drawn via paths with draw-on effect
const SketchSavant: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const frame = useCurrentFrame();

  // Head: draws on 0-40
  const headLen = 110;
  const headOffset = useDrawOn(headLen, 10, 50);

  // Body: 40-80
  const bodyLen = 260;
  const bodyOffset = useDrawOn(bodyLen, 45, 82);

  // Legs: 75-110
  const legLen = 180;
  const legOffset = useDrawOn(legLen, 75, 110);

  // Arms: 105-140
  const armLen = 200;
  const armOffset = useDrawOn(armLen, 100, 140);

  // Robe/cloak: 130-160
  const robeLen = 320;
  const robeOffset = useDrawOn(robeLen, 126, 165);

  // Hat: 158-180
  const hatLen = 180;
  const hatOffset = useDrawOn(hatLen, 156, 180);

  // Organic wobble on drawing
  const w = (base: number, seed: number, amp = 1.2) => wobble(base, frame, seed, amp);

  // Walk/idle oscillation (subtle after draw)
  const drawn = frame > 140;
  const idle = drawn ? Math.sin(frame * 0.04) * 3 : 0;
  const headBob = drawn ? Math.sin(frame * 0.04) * 2 : 0;

  const hx = cx;
  const hy = cy - 240 + headBob;
  const tx = cx;
  const ty = cy - 160 + idle;
  const hipY = cy - 40 + idle;

  // Pointing arm animation (f190+)
  const pointProgress = interpolate(frame, [190, 220], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const armEndX = cx + 90 + pointProgress * 80;
  const armEndY = (ty + 40) - pointProgress * 30;

  return (
    <g filter="url(#s08-pencil)">
      {/* Robe */}
      <path
        d={`M${w(tx - 28, 20)},${w(ty + 10, 21)} Q${w(tx - 38, 22)},${w(ty + 80, 23)} ${w(tx - 22, 24)},${w(cy, 25)} L${w(tx + 22, 26)},${w(cy, 27)} Q${w(tx + 38, 28)},${w(ty + 80, 29)} ${w(tx + 28, 30)},${w(ty + 10, 31)} Z`}
        fill={BG}
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={robeLen}
        strokeDashoffset={robeOffset}
      />

      {/* Body */}
      <path
        d={`M${w(tx - 22, 1)},${w(ty, 2)} L${w(tx + 22, 3)},${w(ty, 4)} L${w(tx + 22, 5)},${w(ty + 100, 6)} L${w(tx - 22, 7)},${w(ty + 100, 8)} Z`}
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={bodyLen}
        strokeDashoffset={bodyOffset}
      />

      {/* Legs */}
      <path
        d={`M${w(cx - 14, 40)},${w(hipY, 41)} L${w(cx - 16, 42)},${w(cy, 43)} M${w(cx + 14, 44)},${w(hipY, 45)} L${w(cx + 16, 46)},${w(cy, 47)}`}
        fill="none"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray={legLen}
        strokeDashoffset={legOffset}
      />

      {/* Back arm */}
      <path
        d={`M${w(tx - 22, 10)},${w(ty + 20, 11)} Q${w(tx - 46, 12)},${w(ty + 60, 13)} ${w(tx - 36, 14)},${w(ty + 90, 15)}`}
        fill="none"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={armLen / 2}
        strokeDashoffset={armOffset}
      />

      {/* Front arm (pointing) */}
      <path
        d={`M${w(tx + 22, 16)},${w(ty + 20, 17)} Q${w((tx + 22 + armEndX) / 2 + 10, 18)},${w(ty + 50, 19)} ${w(armEndX, 50)},${w(armEndY, 51)}`}
        fill="none"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={armLen / 2}
        strokeDashoffset={armOffset}
      />

      {/* Head */}
      <ellipse
        cx={w(hx, 60)}
        cy={w(hy - 8, 61)}
        rx={24}
        ry={28}
        fill={BG}
        stroke={INK}
        strokeWidth="2.4"
        strokeDasharray={headLen}
        strokeDashoffset={headOffset}
      />

      {/* Hat (scholar) */}
      <path
        d={`M${w(hx - 28, 70)},${w(hy - 30, 71)} L${w(hx - 18, 72)},${w(hy - 56, 73)} L${w(hx + 18, 74)},${w(hy - 56, 75)} L${w(hx + 28, 76)},${w(hy - 30, 77)}`}
        fill="none"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={hatLen / 2}
        strokeDashoffset={hatOffset}
      />
      <path
        d={`M${w(hx - 32, 78)},${w(hy - 28, 79)} L${w(hx + 32, 80)},${w(hy - 28, 81)}`}
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={hatLen / 2}
        strokeDashoffset={hatOffset}
      />

      {/* Face features (appear after head drawn) */}
      {frame > 55 && (
        <>
          <circle cx={w(hx - 9, 90)} cy={w(hy - 4, 91)} r={3} fill={INK} opacity={enter(frame, 55, 10)} />
          <circle cx={w(hx + 9, 92)} cy={w(hy - 4, 93)} r={3} fill={INK} opacity={enter(frame, 55, 10)} />
          <path
            d={`M${w(hx - 7, 94)},${w(hy + 8, 95)} Q${w(hx, 96)},${w(hy + 14, 97)} ${w(hx + 7, 98)},${w(hy + 8, 99)}`}
            stroke={INK}
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
            opacity={enter(frame, 55, 10)}
          />
          {/* Glasses */}
          <circle cx={w(hx - 9, 85)} cy={w(hy - 4, 86)} r={7} fill="none" stroke={INK} strokeWidth="1.2" opacity={enter(frame, 70, 12) * 0.7} />
          <circle cx={w(hx + 9, 87)} cy={w(hy - 4, 88)} r={7} fill="none" stroke={INK} strokeWidth="1.2" opacity={enter(frame, 70, 12) * 0.7} />
          <line x1={w(hx - 2, 89)} y1={w(hy - 4, 84)} x2={w(hx + 2, 83)} y2={w(hy - 4, 82)} stroke={INK} strokeWidth="1.2" opacity={enter(frame, 70, 12) * 0.7} />
        </>
      )}

      {/* Lightbulb above head at pointing */}
      {frame >= 190 && (
        <g opacity={interpolate(frame, [190, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <circle cx={hx} cy={hy - 80} r={14} fill="none" stroke={INK} strokeWidth="1.8" />
          <line x1={hx - 6} y1={hy - 66} x2={hx + 6} y2={hy - 66} stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
          {/* Glow rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={hx + Math.cos(rad) * 18}
                y1={hy - 80 + Math.sin(rad) * 18}
                x2={hx + Math.cos(rad) * 26}
                y2={hy - 80 + Math.sin(rad) * 26}
                stroke={INK}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
              />
            );
          })}
        </g>
      )}
    </g>
  );
};

// Sketch scribe — drawn later
const SketchScribe: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const frame = useCurrentFrame();

  const headLen = 100;
  const headOffset = useDrawOn(headLen, 68, 104);
  const bodyLen = 260;
  const bodyOffset = useDrawOn(bodyLen, 100, 135);
  const legLen = 160;
  const legOffset = useDrawOn(legLen, 128, 160);
  const armLen = 190;
  const armOffset = useDrawOn(armLen, 152, 183);

  const w = (base: number, seed: number, amp = 1.2) => wobble(base, frame, seed + 30, amp);

  const drawn = frame > 175;
  const idle = drawn ? Math.sin(frame * 0.04 + 0.9) * 3 : 0;
  const headBob = drawn ? Math.sin(frame * 0.04 + 0.9) * 2 : 0;

  const tx = cx; const ty = cy - 160 + idle;
  const hipY = cy - 40 + idle;
  const hx = cx; const hy = cy - 240 + headBob;

  // Look up toward savant at f190
  const lookUp = interpolate(frame, [190, 215], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const eyeOffsetY = -lookUp * 6;

  return (
    <g filter="url(#s08-pencil)">
      {/* Body */}
      <path
        d={`M${w(tx - 24, 101)},${w(ty, 102)} L${w(tx + 24, 103)},${w(ty, 104)} L${w(tx + 26, 105)},${w(ty + 110, 106)} L${w(tx - 26, 107)},${w(ty + 110, 108)} Z`}
        fill="none"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={bodyLen}
        strokeDashoffset={bodyOffset}
      />
      {/* Legs */}
      <path
        d={`M${w(cx - 14, 110)},${w(hipY, 111)} L${w(cx - 12, 112)},${w(cy, 113)} M${w(cx + 14, 114)},${w(hipY, 115)} L${w(cx + 12, 116)},${w(cy, 117)}`}
        fill="none"
        stroke={INK}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray={legLen}
        strokeDashoffset={legOffset}
      />
      {/* Arms */}
      <path
        d={`M${w(tx - 24, 120)},${w(ty + 22, 121)} Q${w(tx - 50, 122)},${w(ty + 70, 123)} ${w(tx - 38, 124)},${w(ty + 96, 125)} M${w(tx + 24, 126)},${w(ty + 22, 127)} Q${w(tx + 52, 128)},${w(ty + 68, 129)} ${w(tx + 40, 130)},${w(ty + 96, 131)}`}
        fill="none"
        stroke={INK}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray={armLen}
        strokeDashoffset={armOffset}
      />
      {/* Scroll in hand */}
      {frame > 168 && (
        <g opacity={enter(frame, 168, 15)}>
          <rect x={tx + 32} y={ty + 78} width={40} height={52} rx={4} fill={BG} stroke={INK} strokeWidth="1.8" />
          {[8, 16, 24, 32].map((ly, i) => (
            <line key={i} x1={tx + 38} y1={ty + 78 + ly} x2={tx + 66} y2={ty + 78 + ly} stroke={INK} strokeWidth="1" opacity="0.45" />
          ))}
        </g>
      )}
      {/* Head */}
      <ellipse
        cx={w(hx, 140)}
        cy={w(hy - 8, 141)}
        rx={22}
        ry={26}
        fill={BG}
        stroke={INK}
        strokeWidth="2.2"
        strokeDasharray={headLen}
        strokeDashoffset={headOffset}
      />
      {/* Head covering */}
      <path
        d={`M${w(hx - 26, 150)},${w(hy - 18, 151)} Q${w(hx, 152)},${w(hy - 46, 153)} ${w(hx + 26, 154)},${w(hy - 18, 155)}`}
        fill="none"
        stroke={INK}
        strokeWidth="2"
        strokeLinecap="round"
        opacity={interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {/* Face */}
      {frame > 80 && (
        <>
          <circle cx={w(hx - 8, 160)} cy={w(hy - 3 + eyeOffsetY, 161)} r={2.8} fill={INK} opacity={enter(frame, 80, 12)} />
          <circle cx={w(hx + 8, 162)} cy={w(hy - 3 + eyeOffsetY, 163)} r={2.8} fill={INK} opacity={enter(frame, 80, 12)} />
          <path
            d={`M${w(hx - 6, 164)},${w(hy + 9, 165)} Q${w(hx, 166)},${w(hy + 14, 167)} ${w(hx + 6, 168)},${w(hy + 9, 169)}`}
            stroke={INK}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            opacity={enter(frame, 80, 12)}
          />
        </>
      )}
    </g>
  );
};

export const S08Sketch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = enter(frame, 0, 15);
  const sceneOpacity = frame >= 280 ? exit(frame, 280, 20) : bgOpacity;

  // Ground draws on
  const groundLen = W;
  const groundOffset = useDrawOn(groundLen, 0, 18);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneOpacity }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: BG,
          boxShadow: "inset 0 0 80px rgba(44,24,16,0.07)",
        }}
      />
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <SketchDefs />

        {/* Ground line */}
        <line
          x1={0}
          y1={GROUND_Y}
          x2={W}
          y2={GROUND_Y}
          stroke={INK}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={groundLen}
          strokeDashoffset={groundOffset}
        />

        {/* Background sketch lines / horizon */}
        {frame > 8 && (
          <g opacity={enter(frame, 8, 20) * 0.2}>
            {Array.from({ length: 6 }).map((_, i) => (
              <line
                key={i}
                x1={0}
                y1={GROUND_Y - 120 - i * 80}
                x2={W}
                y2={GROUND_Y - 120 - i * 80}
                stroke={INK}
                strokeWidth="0.8"
              />
            ))}
          </g>
        )}

        {/* Savant (left) — drawn first */}
        <SketchSavant cx={620} cy={GROUND_Y} />

        {/* Scribe (right) — drawn after */}
        <SketchScribe cx={1160} cy={GROUND_Y} />

        {/* Character labels appear after drawn */}
        <text
          x={620}
          y={GROUND_Y + 48}
          textAnchor="middle"
          fontSize={18}
          fontFamily="Georgia, serif"
          fill={INK}
          opacity={interpolate(frame, [140, 155], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          fontStyle="italic"
        >
          Le Savant
        </text>
        <text
          x={1160}
          y={GROUND_Y + 48}
          textAnchor="middle"
          fontSize={18}
          fontFamily="Georgia, serif"
          fill={INK}
          opacity={interpolate(frame, [180, 195], [0, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          fontStyle="italic"
        >
          Le Scribe
        </text>
      </svg>

      <StyleTitle
        frame={frame}
        number="08"
        title="SVG Croquis / Dessin au Trait"
        subtitle="Effect draw-on, jitter organique, encre sur papier"
        textColor={INK}
        bgColor={`${BG}F0`}
      />
    </div>
  );
};
