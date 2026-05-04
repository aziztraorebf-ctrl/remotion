// LabPhase2 — Test patterns RPG narratifs Atlas
// 1. Bulle dialogue pixel ("Ad portas Romae")
// 2. Object states éléphant (vivant → épuisé → mort)
//
// Timeline (300 frames @ 30fps = 10s) :
//   0-60    : Hannibal + éléphant vivant marchent vers Alpes (Saguntum → approche)
//   60-120  : Approche Alpes (object state stay alive, snow starting)
//   120-180 : FOCUS DRAMATIQUE — bulle dialogue Hannibal sur Alpes
//   180-240 : Object state crossfade : alive → exhausted
//   240-300 : Object state crossfade : exhausted → dead (frozen)

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { FocusBubble } from "../../_shared/FocusBubble";
import { StatGauge } from "../../_shared/StatGauge";
import { DialogBubble } from "../components/DialogBubble";
import { SpriteSheetAnimation } from "../components/SpriteSheetAnimation";

// Palette Hannibal — méditerranéen 218 av J.-C. (validée Phase 1.5)
const PALETTE = {
  sea: "#1B3A52",
  seaDeep: "#0F2538",
  carthage: "#A8623A",
  rome: "#5B4A6E",
  alps: "#D9E4ED",
  alpsShadow: "#8FA3B5",
  parchment: "#F2E2BD",
  ink: "#2A1810",
  gold: "#E6C76E",
};

// POI pour viewport portrait 1080×1920 (mêmes coordonnées Phase 1)
const POI = {
  CARTHAGE: { x: 540, y: 1500 },
  SAGUNTUM: { x: 360, y: 1180 },
  ALPES: { x: 620, y: 850 },
  ALPES_PEAK: { x: 600, y: 800 },
  ALPES_DESCENT: { x: 680, y: 950 },
  ROME: { x: 700, y: 1080 },
};

const HANNIBAL_BASE = "_lab-hannibal/sprites/hannibal";
const ELEPHANT_DYING_SHEET = "_lab-hannibal/sprites/elephant-dying-sheet.png";
// Spritesheet : 2080×120, 13 frames de 160×120 (alive → exhausted → frozen dead)
const ELEPHANT_FRAME_WIDTH = 160;
const ELEPHANT_FRAME_HEIGHT = 120;
const ELEPHANT_TOTAL_FRAMES = 13;

const MapBackground: React.FC<{ snowAmount?: number }> = ({ snowAmount = 0 }) => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame * 0.012) * 3;
  const driftY = Math.cos(frame * 0.009) * 2;

  return (
    <AbsoluteFill
      style={{
        background: PALETTE.seaDeep,
        transform: `translate(${driftX}px, ${driftY}px)`,
      }}
    >
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <radialGradient id="seaGrad2" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={PALETTE.sea} />
            <stop offset="100%" stopColor={PALETTE.seaDeep} />
          </radialGradient>
          <pattern id="hatch2" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={PALETTE.ink} strokeWidth="0.5" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#seaGrad2)" />
        <rect width="1080" height="1920" fill="url(#hatch2)" />

        {/* Africa (Carthage) */}
        <path
          d="M 0 1700 L 200 1620 L 380 1580 L 600 1540 L 780 1560 L 1080 1620 L 1080 1920 L 0 1920 Z"
          fill={PALETTE.carthage}
          opacity="0.85"
        />
        {/* Iberian peninsula */}
        <path
          d="M 80 1200 L 280 1150 L 420 1180 L 460 1280 L 380 1380 L 200 1400 L 80 1340 Z"
          fill={PALETTE.carthage}
          opacity="0.7"
        />
        {/* Italian peninsula */}
        <path
          d="M 620 950 L 700 980 L 760 1100 L 820 1280 L 780 1360 L 720 1320 L 680 1180 L 640 1080 Z"
          fill={PALETTE.rome}
          opacity="0.75"
        />
        {/* Alps base */}
        <path
          d="M 480 800 L 580 760 L 680 780 L 760 820 L 720 880 L 600 900 L 500 870 Z"
          fill={PALETTE.alpsShadow}
        />
        <path
          d="M 500 810 L 580 780 L 660 795 L 730 825 L 700 855 L 600 870 L 520 850 Z"
          fill={PALETTE.alps}
        />
        <path
          d="M 540 790 L 580 770 L 620 785 L 600 810 Z M 640 800 L 680 785 L 700 810 L 670 825 Z"
          fill="#FFFFFF"
          opacity={0.7 + snowAmount * 0.3}
        />

        {/* Snow overlay (intensifies as scene progresses) */}
        {snowAmount > 0 && (
          <rect
            width="1080"
            height="1920"
            fill="#FFFFFF"
            opacity={snowAmount * 0.08}
          />
        )}

        {/* POI labels */}
        <g>
          <circle cx={POI.CARTHAGE.x} cy={POI.CARTHAGE.y} r="6" fill={PALETTE.gold} />
          <text x={POI.CARTHAGE.x} y={POI.CARTHAGE.y + 30} fill={PALETTE.parchment} fontSize="22" fontFamily="serif" textAnchor="middle" fontWeight="600">Carthage</text>
        </g>
        <g>
          <circle cx={POI.ROME.x} cy={POI.ROME.y} r="6" fill="#E8E0F0" />
          <text x={POI.ROME.x} y={POI.ROME.y + 28} fill={PALETTE.parchment} fontSize="22" fontFamily="serif" textAnchor="middle" fontWeight="600">Rome</text>
        </g>
        <g>
          <text x={POI.ALPES.x} y={POI.ALPES.y - 30} fill={PALETTE.ink} fontSize="20" fontFamily="serif" textAnchor="middle" fontStyle="italic" opacity="0.85">Alpes</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// Hannibal sprite — change direction selon trajectoire
const HannibalSprite: React.FC = () => {
  const frame = useCurrentFrame();

  // Trajectoire : Saguntum → Alpes → descente Italie
  const x = interpolate(
    frame,
    [0, 60, 120, 180, 240, 300],
    [
      POI.SAGUNTUM.x - 40,
      POI.SAGUNTUM.x + 60,
      POI.ALPES.x - 60,
      POI.ALPES.x,
      POI.ALPES_DESCENT.x,
      POI.ROME.x - 80,
    ],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const y = interpolate(
    frame,
    [0, 60, 120, 180, 240, 300],
    [
      POI.SAGUNTUM.y,
      POI.SAGUNTUM.y - 60,
      POI.ALPES.y + 60,
      POI.ALPES.y,
      POI.ALPES_DESCENT.y,
      POI.ROME.y - 60,
    ],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Sélection direction selon vecteur de mouvement
  const direction = (() => {
    if (frame < 60) return "north-east"; // Saguntum vers Alpes (NE)
    if (frame < 180) return "north-east"; // Approche Alpes
    return "south-east"; // Descente vers Rome (SE)
  })();

  const bob = Math.sin(frame * 0.3) * 2;
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <Img
      src={staticFile(`${HANNIBAL_BASE}/${direction}.png`)}
      style={{
        position: "absolute",
        left: x - 60,
        top: y - 60 + bob,
        width: 120,
        height: 120,
        imageRendering: "pixelated",
        opacity,
        filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.6))",
      }}
    />
  );
};

// Éléphant suit Hannibal légèrement en arrière
// Animation 13 frames spritesheet : alive (f0) → exhausted (f6-f8) → frozen dead (f12)
// L'animation joue progressivement sur 280 frames (sauf 0-20 où il est encore vivant statique)
const ElephantTrail: React.FC = () => {
  const frame = useCurrentFrame();

  // Position décalée derrière Hannibal (offset frame -20)
  const offsetFrame = Math.max(0, frame - 20);
  const x = interpolate(
    offsetFrame,
    [0, 60, 120, 180, 240, 300],
    [
      POI.SAGUNTUM.x - 100,
      POI.SAGUNTUM.x + 20,
      POI.ALPES.x - 100,
      POI.ALPES.x - 40,
      POI.ALPES_DESCENT.x - 40,
      POI.ROME.x - 120,
    ],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const y = interpolate(
    offsetFrame,
    [0, 60, 120, 180, 240, 300],
    [
      POI.SAGUNTUM.y + 20,
      POI.SAGUNTUM.y - 40,
      POI.ALPES.y + 80,
      POI.ALPES.y + 20,
      POI.ALPES_DESCENT.y + 20,
      POI.ROME.y - 40,
    ],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Léger bob vivant qui s'éteint à mesure que l'animation progresse
  const lifeProgress = interpolate(frame, [0, 280], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bob = Math.sin(frame * 0.18) * 3 * lifeProgress;

  // Animation de mort progressive : démarre frame 60 (approche Alpes), finit frame 290
  // L'éléphant reste sur frame 0 (vivant) jusque-là, puis dégrade lentement
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + bob,
        transform: "translate(-50%, -50%)",
      }}
    >
      <SpriteSheetAnimation
        src={ELEPHANT_DYING_SHEET}
        frameWidth={ELEPHANT_FRAME_WIDTH}
        frameHeight={ELEPHANT_FRAME_HEIGHT}
        totalFrames={ELEPHANT_TOTAL_FRAMES}
        startFrame={60}
        durationFrames={230}
        position={{ x: 75, y: 65 }}
        displaySize={{ width: 150, height: 130 }}
        filter="drop-shadow(2px 4px 6px rgba(0,0,0,0.6))"
      />
    </div>
  );
};

const HudLayer: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <StatGauge
        label="Armée"
        icon="⚔"
        fromValue={50000}
        toValue={26000}
        startFrame={20}
        durationFrames={260}
        position={{ top: 100, right: 50 }}
        color="#E6C76E"
        hideRanges={[[120, 188]]}
      />
      <StatGauge
        label="Éléphants"
        icon="◊"
        fromValue={37}
        toValue={1}
        startFrame={80}
        durationFrames={200}
        position={{ top: 240, right: 50 }}
        color="#FF8A6B"
        hideRanges={[[120, 188]]}
      />
    </AbsoluteFill>
  );
};

export const LabPhase2: React.FC = () => {
  const frame = useCurrentFrame();

  const focusStart = 120;
  const focusEnd = 188;
  const focusX = POI.ALPES.x;
  const focusY = POI.ALPES.y + 20;

  // Snow intensifies after frame 60 (approche Alpes)
  const snowAmount = interpolate(frame, [60, 180, 300], [0, 0.6, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <FocusBubble
        active={frame >= focusStart && frame < focusEnd}
        startFrame={focusStart}
        endFrame={focusEnd}
        zoomTarget={1.45}
        blurMax={3.5}
        origin={{ x: focusX, y: focusY }}
        background={
          <>
            <MapBackground snowAmount={snowAmount} />
            <ElephantTrail />
          </>
        }
      >
        <HannibalSprite />
      </FocusBubble>

      {/* Dialog bubble — only during focus, pointing to Hannibal */}
      <DialogBubble
        text="Ad portas Romae"
        startFrame={focusStart + 10}
        durationFrames={focusEnd - focusStart - 15}
        pointTo={{ x: focusX, y: focusY }}
        offsetY={130}
      />

      {/* HUD */}
      <HudLayer />

      {/* SFX blip on bubble entry */}
      <Sequence from={focusStart - 2} durationInFrames={12}>
        <Audio src={staticFile("_lab-hannibal/sfx/blip-bubble-trimmed.mp3")} volume={0.6} />
      </Sequence>
      <Sequence from={20} durationInFrames={8}>
        <Audio src={staticFile("_lab-hannibal/sfx/stat-tick-trimmed.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={80} durationInFrames={8}>
        <Audio src={staticFile("_lab-hannibal/sfx/stat-tick-trimmed.mp3")} volume={0.5} />
      </Sequence>

      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          fontSize: 12,
          fontFamily: "monospace",
          color: "rgba(245, 233, 201, 0.5)",
          letterSpacing: 1,
        }}
      >
        LAB-HANNIBAL · PHASE 2 · DIALOG + OBJECT-STATES
      </div>
    </AbsoluteFill>
  );
};
