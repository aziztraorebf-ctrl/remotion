import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { W, H, GROUND_Y, enter, exit, StyleTitle, CharLabel } from "./ShowcaseShared";

// Stick figure walker: joints animated with sin/cos
const StickChar: React.FC<{
  x: number;
  y: number;
  phase: number;           // walk cycle phase offset
  color: string;
  scale?: number;
  facing?: "right" | "left";
  bowing?: number;         // 0..1, how much the figure bows its head
  armRaised?: number;      // 0..1, right arm raised up
}> = ({ x, y, phase, color, scale = 1, facing = "right", bowing = 0, armRaised = 0 }) => {
  const dir = facing === "right" ? 1 : -1;
  const legLen = 38 * scale;
  const armLen = 28 * scale;
  const bodyH = 55 * scale;
  const headR = 16 * scale;

  const hipY = y;
  const shoulderY = y - bodyH;
  const headCy = shoulderY - headR - 4 * scale;

  // Head bow
  const headOffsetY = bowing * 12 * scale;

  // Leg angles
  const leftLeg = Math.sin(phase) * 0.55;
  const rightLeg = Math.sin(phase + Math.PI) * 0.55;

  // Arm angles (counter-phase of legs)
  const leftArm = Math.sin(phase + Math.PI) * 0.4;
  // Right arm raises toward interaction target
  const rightArmAngle = Math.sin(phase) * 0.4 - armRaised * 1.4;

  const lLx = x + Math.sin(leftLeg) * legLen * dir;
  const lLy = hipY + Math.cos(Math.abs(leftLeg)) * legLen;
  const rLx = x + Math.sin(rightLeg) * legLen * dir;
  const rLy = hipY + Math.cos(Math.abs(rightLeg)) * legLen;

  const lAx = x + Math.sin(leftArm) * armLen * dir;
  const lAy = shoulderY + Math.cos(Math.abs(leftArm)) * armLen;
  const rAx = x + Math.sin(rightArmAngle) * armLen * dir;
  const rAy = shoulderY + Math.cos(Math.abs(rightArmAngle)) * armLen;

  return (
    <g>
      {/* Head */}
      <circle cx={x} cy={headCy + headOffsetY} r={headR} fill={color} />
      {/* Body */}
      <line x1={x} y1={shoulderY} x2={x} y2={hipY} stroke={color} strokeWidth={3 * scale} strokeLinecap="round" />
      {/* Arms */}
      <line x1={x} y1={shoulderY + 8 * scale} x2={lAx} y2={lAy} stroke={color} strokeWidth={2.5 * scale} strokeLinecap="round" />
      <line x1={x} y1={shoulderY + 8 * scale} x2={rAx} y2={rAy} stroke={color} strokeWidth={2.5 * scale} strokeLinecap="round" />
      {/* Legs */}
      <line x1={x} y1={hipY} x2={lLx} y2={lLy} stroke={color} strokeWidth={3 * scale} strokeLinecap="round" />
      <line x1={x} y1={hipY} x2={rLx} y2={rLy} stroke={color} strokeWidth={3 * scale} strokeLinecap="round" />
    </g>
  );
};

export const S01StickFigure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = enter(frame, 0, 25);

  // === TIMING ===
  // 0-30   : scene fade in
  // 30-90  : noble walks from left, servant walks from right, approach center
  // 90-110 : both stop, face each other
  // 110-180: noble raises arm to greet, servant bows
  // 180-250: they "converse" — arms animate, heads bob
  // 250-280: wave goodbye, separate
  // 280-300: fade out

  // Noble walks in from left
  const nobleX = interpolate(
    frame,
    [30, 95],
    [160, 680],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Servant walks in from right
  const servantX = interpolate(
    frame,
    [45, 100],
    [W - 160, 1060],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const walkPhaseNoble = frame * 0.18;
  const walkPhaseServant = frame * 0.16 + 1.2;

  // While walking, legs animated. After stop, frozen.
  const nobleWalking = frame < 95;
  const servantWalking = frame < 100;
  const noblePhase = nobleWalking ? walkPhaseNoble : walkPhaseNoble;
  const servantPhase = servantWalking ? walkPhaseServant : walkPhaseServant;

  // Noble raises arm to greet
  const nobleArmRaised = interpolate(frame, [110, 140], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Servant bows
  const servantBow = interpolate(frame, [115, 145], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Un-bow for conversation
  const servantUnbow = interpolate(frame, [160, 180], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const bowAmount = frame < 160 ? servantBow : servantBow * servantUnbow;

  // Farewell: separate after f250
  const nobleExitX = interpolate(frame, [255, 295], [680, 300], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const servantExitX = interpolate(frame, [260, 295], [1060, W - 300], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const finalNobleX = frame >= 255 ? nobleExitX : nobleX;
  const finalServantX = frame >= 260 ? servantExitX : servantX;

  // Facing directions after stop
  const nobleFacing = frame >= 95 ? "right" : "right";
  const servantFacing = frame >= 100 ? "left" : "left";

  const sceneOpacity = frame >= 280
    ? exit(frame, 280, 20)
    : bgOpacity;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneOpacity }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id="s01-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8f0e0" />
            <stop offset="100%" stopColor="#f8f4e8" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width={W} height={H} fill="url(#s01-sky)" />

        {/* Ground */}
        <rect x={0} y={GROUND_Y} width={W} height={H - GROUND_Y} fill="#c8b898" />
        <line x1={0} y1={GROUND_Y} x2={W} y2={GROUND_Y} stroke="#9a8868" strokeWidth={2} />

        {/* Horizon line hint */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={i}
            x1={i * 200}
            y1={GROUND_Y}
            x2={i * 200 + 140}
            y2={GROUND_Y}
            stroke="#a89878"
            strokeWidth={1.5}
            opacity={0.4}
          />
        ))}

        {/* Noble (left) */}
        <StickChar
          x={finalNobleX}
          y={GROUND_Y}
          phase={nobleWalking ? walkPhaseNoble : 0}
          color="#2a3a6a"
          scale={1.3}
          facing={nobleFacing}
          armRaised={nobleArmRaised}
        />

        {/* Servant (right) */}
        <StickChar
          x={finalServantX}
          y={GROUND_Y}
          phase={servantWalking ? walkPhaseServant : 0.2}
          color="#8a3a1a"
          scale={1.0}
          facing={servantFacing}
          bowing={bowAmount}
        />

        {/* Interaction spark: a small star when they greet */}
        {frame >= 120 && frame <= 160 && (
          <g>
            {[0, 1, 2, 3].map((i) => {
              const a = (i / 4) * Math.PI * 2 + frame * 0.08;
              const r = 18 + Math.sin(frame * 0.3) * 4;
              return (
                <line
                  key={i}
                  x1={(finalNobleX + finalServantX) / 2}
                  y1={GROUND_Y - 100}
                  x2={(finalNobleX + finalServantX) / 2 + Math.cos(a) * r}
                  y2={GROUND_Y - 100 + Math.sin(a) * r}
                  stroke="#c8a040"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              );
            })}
            <circle
              cx={(finalNobleX + finalServantX) / 2}
              cy={GROUND_Y - 100}
              r={5}
              fill="#c8a040"
            />
          </g>
        )}

        <CharLabel x={finalNobleX} y={GROUND_Y + 50} name="Le Noble" fill="#2a3a6a" />
        <CharLabel x={finalServantX} y={GROUND_Y + 50} name="Le Serf" fill="#8a3a1a" />
      </svg>

      <StyleTitle
        frame={frame}
        number="01"
        title="Stick Figure SVG"
        subtitle="Lignes pures — lisibilite maximale — joints articules"
        textColor="#1a1008"
        bgColor="rgba(248,244,232,0.88)"
      />
    </div>
  );
};
