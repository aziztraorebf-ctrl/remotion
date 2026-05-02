// S2 A3 Cornes — Atlas Shaka Zulu
// Carte plein ecran + warriors qui marchent en formation cornes (Kimi Q2)
// Duree : 13.5s (frames 1493 -> 1899 globale, 0 -> 406 local)
//
// VAGUE 1 : version simplifiee. Carte = fond brun. Warriors = sprites qui se deplacent
// le long de bezier paths SVG (gauche flanc + droite flanc + centre fixe).

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";
import { getSpriteFramePath } from "../helpers/spritePlayer";

export interface AtlasShakaS2A3CornesProps {
  durationFrames: number;
}

// Path SVG pour les flancs : courbe partant des cotes de l'ecran vers l'arriere du centre
const FLANK_LEFT_PATH = "M 100,540 Q 600,200 960,500";
const FLANK_RIGHT_PATH = "M 1820,540 Q 1320,200 960,500";

// Position le long d'un path approximatif (fonction sin pour simuler bezier)
function pointAlongCurve(
  t: number,
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number }
): { x: number; y: number } {
  const x = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * control.x + t * t * end.x;
  const y = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * control.y + t * t * end.y;
  return { x, y };
}

const FLANK_LEFT = {
  start: { x: 100, y: 540 },
  control: { x: 600, y: 200 },
  end: { x: 960, y: 500 },
};
const FLANK_RIGHT = {
  start: { x: 1820, y: 540 },
  control: { x: 1320, y: 200 },
  end: { x: 960, y: 500 },
};

interface WarriorSpriteProps {
  frame: number;
  position: { x: number; y: number };
  direction: "south" | "east" | "north" | "west";
  scale?: number;
}

const WarriorSprite: React.FC<WarriorSpriteProps> = ({ frame, position, direction, scale = 1.5 }) => {
  const spritePath = getSpriteFramePath(frame, {
    basePath: "atlas-shaka-zulu/characters/warrior/animations/walking-38346bae",
    direction,
    totalFrames: 6,
    framesPerSpriteFrame: 4,
  });
  return (
    <Img
      src={staticFile(spritePath)}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: 96 * scale,
        height: 96 * scale,
        transform: "translate(-50%, -50%)",
        imageRendering: "pixelated",
      }}
    />
  );
};

export const AtlasShakaS2A3Cornes: React.FC<AtlasShakaS2A3CornesProps> = ({ durationFrames }) => {
  const frame = useCurrentFrame();

  // Animation : 0 -> 1 sur 200 frames (de frame 60 a 260)
  const t = interpolate(frame, [60, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Centre : 4 warriors fixes au centre, alignes face caméra (south)
  const centerWarriors = [
    { x: 880, y: 510 },
    { x: 940, y: 530 },
    { x: 1000, y: 510 },
    { x: 920, y: 480 },
  ];

  // Flanc gauche : 3 warriors qui suivent la courbe vers l'arriere
  const flankLeftWarriors = [0.0, 0.3, 0.6].map((offset) =>
    pointAlongCurve(t * (1 - offset * 0.3), FLANK_LEFT.start, FLANK_LEFT.control, FLANK_LEFT.end)
  );

  // Flanc droit : pareil
  const flankRightWarriors = [0.0, 0.3, 0.6].map((offset) =>
    pointAlongCurve(t * (1 - offset * 0.3), FLANK_RIGHT.start, FLANK_RIGHT.control, FLANK_RIGHT.end)
  );

  // Ennemis points gris au centre (encerclement progressif)
  const enemyDots = [
    { x: 940, y: 460 },
    { x: 920, y: 470 },
    { x: 970, y: 475 },
    { x: 950, y: 490 },
    { x: 925, y: 485 },
    { x: 965, y: 465 },
  ];

  // Fade
  const opacity = interpolate(
    frame,
    [0, 12, durationFrames - 12, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Path SVG drawn (effet "dessin au trait" Kimi Q3)
  const pathDrawProgress = interpolate(frame, [40, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: SHAKA_PALETTE.CARTE_FOND, opacity }}>
      {/* Texture carte fake : gradient subtil */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, ${SHAKA_PALETTE.CARTE_FOND} 0%, #0A0805 100%)`,
        }}
      />

      {/* SVG paths pour les flancs */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      >
        {/* Flanc gauche path */}
        <path
          d={FLANK_LEFT_PATH}
          stroke={SHAKA_PALETTE.BORDEAUX}
          strokeWidth={3}
          strokeDasharray={1500}
          strokeDashoffset={1500 - 1500 * pathDrawProgress}
          fill="none"
          opacity={0.5}
        />
        {/* Flanc droit path */}
        <path
          d={FLANK_RIGHT_PATH}
          stroke={SHAKA_PALETTE.BORDEAUX}
          strokeWidth={3}
          strokeDasharray={1500}
          strokeDashoffset={1500 - 1500 * pathDrawProgress}
          fill="none"
          opacity={0.5}
        />
      </svg>

      {/* Ennemis (points gris au centre) */}
      {enemyDots.map((dot, i) => (
        <div
          key={`enemy-${i}`}
          style={{
            position: "absolute",
            left: dot.x,
            top: dot.y,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: SHAKA_PALETTE.GRIS_ENNEMI,
            transform: "translate(-50%, -50%)",
            opacity: 0.7,
          }}
        />
      ))}

      {/* Centre : warriors fixes (apparaissent direct) */}
      {frame > 30 && centerWarriors.map((pos, i) => (
        <WarriorSprite key={`center-${i}`} frame={frame} position={pos} direction="north" />
      ))}

      {/* Flanc gauche : warriors marchent (apparaissent frame 60) */}
      {frame > 60 && flankLeftWarriors.map((pos, i) => (
        <WarriorSprite key={`left-${i}`} frame={frame} position={pos} direction="east" />
      ))}

      {/* Flanc droit : warriors marchent */}
      {frame > 60 && flankRightWarriors.map((pos, i) => (
        <WarriorSprite key={`right-${i}`} frame={frame} position={pos} direction="west" />
      ))}

      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 56,
          fontWeight: 900,
          fontFamily: SHAKA_FONTS.TITRE,
          color: SHAKA_PALETTE.OR,
          letterSpacing: "0.05em",
          textShadow: "0 4px 20px rgba(0,0,0,0.9)",
        }}
      >
        Formation des cornes de buffle
      </div>
    </AbsoluteFill>
  );
};
