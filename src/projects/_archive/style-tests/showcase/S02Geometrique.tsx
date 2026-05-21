import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { W, H, GROUND_Y, enter, exit, StyleTitle, CharLabel } from "./ShowcaseShared";

// Palette bold Bauhaus
const RED    = "#E63946";
const ORANGE = "#F4A261";
const BLUE   = "#2D3A8C";
const NAVY   = "#1a1a2e";
const YELLOW = "#FFD60A";
const TEAL   = "#2a9d8f";
const WHITE  = "#F8F7F2";

// Geometric hero: circles + rects, no outlines
const HeroineGeo: React.FC<{
  x: number;
  y: number;
  walkPhase: number;
  entrySpring: number;
  armRaisedLeft?: number;
}> = ({ x, y, walkPhase, entrySpring, armRaisedLeft = 0 }) => {
  const scale = entrySpring;
  const bob = Math.sin(walkPhase * 2) * 5;

  const headR = 28;
  const torsoW = 52;
  const torsoH = 62;
  const armW = 18;
  const armH = 52;
  const legW = 20;
  const legH = 58;

  const headY = y - torsoH - headR * 2 - legH + bob;
  const torsoY = y - torsoH - legH + bob;
  const hipY = y - legH + bob;

  const leftArmAngle = Math.sin(walkPhase + Math.PI) * 28 - armRaisedLeft * 70;
  const rightArmAngle = Math.sin(walkPhase) * 28;
  const leftLegAngle = Math.sin(walkPhase + Math.PI) * 25;
  const rightLegAngle = Math.sin(walkPhase) * 25;

  return (
    <g transform={`translate(${x}, 0) scale(${scale}, ${scale}) translate(${-x}, 0)`}>
      {/* Left leg */}
      <g transform={`translate(${x - 14}, ${hipY}) rotate(${leftLegAngle}, 0, 0)`}>
        <rect x={-legW / 2} y={0} width={legW} height={legH} rx={legW / 2} fill={RED} />
        <rect x={-10} y={legH - 8} width={22} height={12} rx={6} fill={NAVY} />
      </g>
      {/* Right leg */}
      <g transform={`translate(${x + 14}, ${hipY}) rotate(${rightLegAngle}, 0, 0)`}>
        <rect x={-legW / 2} y={0} width={legW} height={legH} rx={legW / 2} fill={RED} />
        <rect x={-10} y={legH - 8} width={22} height={12} rx={6} fill={NAVY} />
      </g>
      {/* Left arm */}
      <g transform={`translate(${x - torsoW / 2 + 4}, ${torsoY + 12}) rotate(${leftArmAngle}, 0, 0)`}>
        <rect x={-armW / 2} y={0} width={armW} height={armH} rx={armW / 2} fill={ORANGE} />
      </g>
      {/* Right arm */}
      <g transform={`translate(${x + torsoW / 2 - 4}, ${torsoY + 12}) rotate(${rightArmAngle}, 0, 0)`}>
        <rect x={-armW / 2} y={0} width={armW} height={armH} rx={armW / 2} fill={ORANGE} />
      </g>
      {/* Torso */}
      <rect x={x - torsoW / 2} y={torsoY} width={torsoW} height={torsoH} rx={14} fill={RED} />
      {/* Belt */}
      <rect x={x - torsoW / 2} y={torsoY + torsoH * 0.62} width={torsoW} height={12} rx={4} fill={NAVY} />
      {/* Head */}
      <circle cx={x} cy={headY + headR} r={headR} fill={ORANGE} />
      {/* Eyes */}
      <circle cx={x - 10} cy={headY + headR - 2} r={7} fill={WHITE} />
      <circle cx={x + 10} cy={headY + headR - 2} r={7} fill={WHITE} />
      <circle cx={x - 10} cy={headY + headR - 1} r={3.5} fill={NAVY} />
      <circle cx={x + 10} cy={headY + headR - 1} r={3.5} fill={NAVY} />
      {/* Hair = triangle */}
      <polygon
        points={`${x - headR - 4},${headY + 8} ${x},${headY - 14} ${x + headR + 4},${headY + 8}`}
        fill={NAVY}
      />
    </g>
  );
};

// Antagoniste: pointy geometric shapes
const AntagonistGeo: React.FC<{
  x: number;
  y: number;
  walkPhase: number;
  entrySpring: number;
  armRaisedRight?: number;
}> = ({ x, y, walkPhase, entrySpring, armRaisedRight = 0 }) => {
  const scale = entrySpring;
  const bob = Math.sin(walkPhase * 2 + 0.5) * 5;

  const legH = 64;
  const torsoH = 68;
  const torsoW = 48;
  const headR = 24;
  const armH = 54;

  const hipY = y - legH + bob;
  const torsoY = y - torsoH - legH + bob;
  const headY = torsoY - headR * 2 - 2;

  const leftLegAngle = Math.sin(walkPhase) * 26;
  const rightLegAngle = Math.sin(walkPhase + Math.PI) * 26;
  const leftArmAngle = Math.sin(walkPhase) * 30;
  const rightArmAngle = Math.sin(walkPhase + Math.PI) * 30 - armRaisedRight * 72;

  return (
    <g transform={`translate(${x}, 0) scale(${scale}, ${scale}) translate(${-x}, 0)`}>
      {/* Left leg */}
      <g transform={`translate(${x - 12}, ${hipY}) rotate(${leftLegAngle}, 0, 0)`}>
        <rect x={-10} y={0} width={20} height={legH} rx={0} fill={BLUE} />
        <polygon points={`-14,${legH} 0,${legH - 10} 14,${legH}`} fill={NAVY} />
      </g>
      {/* Right leg */}
      <g transform={`translate(${x + 12}, ${hipY}) rotate(${rightLegAngle}, 0, 0)`}>
        <rect x={-10} y={0} width={20} height={legH} rx={0} fill={BLUE} />
        <polygon points={`-14,${legH} 0,${legH - 10} 14,${legH}`} fill={NAVY} />
      </g>
      {/* Left arm */}
      <g transform={`translate(${x - torsoW / 2 + 2}, ${torsoY + 10}) rotate(${leftArmAngle}, 0, 0)`}>
        <rect x={-9} y={0} width={18} height={armH} rx={0} fill={TEAL} />
      </g>
      {/* Right arm */}
      <g transform={`translate(${x + torsoW / 2 - 2}, ${torsoY + 10}) rotate(${rightArmAngle}, 0, 0)`}>
        <rect x={-9} y={0} width={18} height={armH} rx={0} fill={TEAL} />
      </g>
      {/* Torso: inverted triangle */}
      <polygon
        points={`${x - torsoW / 2},${torsoY} ${x + torsoW / 2},${torsoY} ${x},${torsoY + torsoH}`}
        fill={BLUE}
      />
      {/* Head: diamond */}
      <polygon
        points={`${x},${headY} ${x + headR},${headY + headR} ${x},${headY + headR * 2} ${x - headR},${headY + headR}`}
        fill={NAVY}
      />
      {/* Eyes */}
      <circle cx={x - 8} cy={headY + headR} r={5} fill={YELLOW} />
      <circle cx={x + 8} cy={headY + headR} r={5} fill={YELLOW} />
      {/* Angled eyebrows = menacing */}
      <line x1={x - 14} y1={headY + headR - 10} x2={x - 2} y2={headY + headR - 6} stroke={YELLOW} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={x + 2} y1={headY + headR - 6} x2={x + 14} y2={headY + headR - 10} stroke={YELLOW} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
};

export const S02Geometrique: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = enter(frame, 0, 20);
  const sceneOpacity = frame >= 280 ? exit(frame, 280, 20) : bgOpacity;

  // Hero enters from left
  const heroEntry = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 160 }, durationInFrames: 30 });
  const heroX = interpolate(frame, [20, 80], [200, 640], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalHeroX = frame >= 80 ? 640 : heroX;

  // Antagonist enters from right
  const antEntry = spring({ frame: frame - 35, fps, config: { damping: 12, stiffness: 160 }, durationInFrames: 30 });
  const antX = interpolate(frame, [35, 90], [W - 200, 1100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const finalAntX = frame >= 90 ? 1100 : antX;

  const heroWalking = frame < 80;
  const antWalking = frame < 90;
  const heroPhase = frame * 0.17;
  const antPhase = frame * 0.15 + 0.8;

  // High-five: hero raises left arm, antagonist raises right arm
  const heroArmRaise = interpolate(frame, [130, 160], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const antArmRaise = interpolate(frame, [138, 165], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Lower after high-five
  const heroLower = interpolate(frame, [200, 225], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const antLower = interpolate(frame, [205, 228], [1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const heroFinalArm = frame >= 200 ? heroArmRaise * heroLower : heroArmRaise;
  const antFinalArm = frame >= 205 ? antArmRaise * antLower : antArmRaise;

  // High-five spark between them at f150-180
  const sparkOpacity = interpolate(frame, [145, 165, 190, 200], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const midX = (finalHeroX + finalAntX) / 2;

  return (
    <div style={{ position: "absolute", inset: 0, opacity: sceneOpacity }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        {/* Bold color blocks background */}
        <rect width={W} height={H * 0.52} fill={YELLOW} />
        <rect y={H * 0.52} width={W} height={H * 0.48} fill={NAVY} />

        {/* Geometric ground elements */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={i}
            x={100 + i * 230}
            y={H * 0.52 - 18}
            width={90}
            height={36}
            fill={BLUE}
            opacity={0.6}
          />
        ))}

        {/* Antagonist */}
        <AntagonistGeo
          x={finalAntX}
          y={GROUND_Y}
          walkPhase={antWalking ? antPhase : 0}
          entrySpring={Math.min(antEntry, 1)}
          armRaisedRight={antFinalArm}
        />

        {/* Hero */}
        <HeroineGeo
          x={finalHeroX}
          y={GROUND_Y}
          walkPhase={heroWalking ? heroPhase : 0}
          entrySpring={Math.min(heroEntry, 1)}
          armRaisedLeft={heroFinalArm}
        />

        {/* High-five spark */}
        {sparkOpacity > 0 && (
          <g opacity={sparkOpacity}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (i / 6) * Math.PI * 2;
              const r = 28 + Math.sin(frame * 0.5) * 8;
              return (
                <rect
                  key={i}
                  x={(midX + Math.cos(a) * r) - 5}
                  y={(GROUND_Y - 180 + Math.sin(a) * r) - 5}
                  width={10}
                  height={10}
                  fill={i % 2 === 0 ? RED : ORANGE}
                  transform={`rotate(${frame * 4 + i * 60}, ${midX + Math.cos(a) * r}, ${GROUND_Y - 180 + Math.sin(a) * r})`}
                />
              );
            })}
            <circle cx={midX} cy={GROUND_Y - 180} r={18} fill={YELLOW} opacity={0.9} />
          </g>
        )}

        <CharLabel x={finalHeroX} y={GROUND_Y + 52} name="Heroine" fill={WHITE} />
        <CharLabel x={finalAntX} y={GROUND_Y + 52} name="Antagoniste" fill={YELLOW} />
      </svg>

      <StyleTitle
        frame={frame}
        number="02"
        title="SVG Geometrique / Bauhaus"
        subtitle="Formes pures, pas d'outline, couleurs blocs"
        textColor={NAVY}
        bgColor={`${YELLOW}DD`}
      />
    </div>
  );
};
