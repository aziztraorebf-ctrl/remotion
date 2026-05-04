// LabPhase1 — Test des 3 couches Atlas (fond / action / HUD)
// Pas de narration, pas de sous-titres. Juste validation lisibilité.
//
// Timeline (300 frames @ 30fps = 10s) :
//   0-60   : Beat A — Carte calme + jauge "Armée: 50000" qui apparaît
//   60-150 : Beat B — Sprite traverse Alpes (placeholder), jauge descend à 26000
//   150-210: Beat C — Focus contextuel zoom+blur sur sprite (test bulle dialogue zone)
//   210-300: Beat D — Retour normal, jauge stabilisée

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { FocusBubble } from "../../_shared/FocusBubble";
import { StatGauge } from "../../_shared/StatGauge";

// Palette Hannibal placeholder (test) — méditerranéen 264 av J.-C.
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

// Fictive Mediterranean map (SVG placeholder geo simple — Phase 1 test seulement)
// Coordonnées approximatives pour viewport 1080x1920 portrait
// Carthage: bottom-center, Alpes: middle, Rome: middle-right
const POI = {
  CARTHAGE: { x: 540, y: 1500 },
  SAGUNTUM: { x: 360, y: 1180 },
  ALPES: { x: 620, y: 850 },
  ROME: { x: 700, y: 1080 },
};

const SPRITE_PATH = "empire-ghana/assets/pixellab/guerrier-almoravide.png";

const MapBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame * 0.012) * 3;
  const driftY = Math.cos(frame * 0.009) * 2;

  return (
    <AbsoluteFill style={{ background: PALETTE.seaDeep, transform: `translate(${driftX}px, ${driftY}px)` }}>
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Background sea gradient */}
        <defs>
          <radialGradient id="seaGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor={PALETTE.sea} />
            <stop offset="100%" stopColor={PALETTE.seaDeep} />
          </radialGradient>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={PALETTE.ink} strokeWidth="0.5" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#seaGrad)" />
        <rect width="1080" height="1920" fill="url(#hatch)" />

        {/* Africa (Carthage) — south landmass */}
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
        {/* Alps */}
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
          opacity="0.7"
        />

        {/* POI markers */}
        <g>
          <circle cx={POI.CARTHAGE.x} cy={POI.CARTHAGE.y} r="6" fill={PALETTE.gold} />
          <text
            x={POI.CARTHAGE.x}
            y={POI.CARTHAGE.y + 30}
            fill={PALETTE.parchment}
            fontSize="22"
            fontFamily="serif"
            textAnchor="middle"
            fontWeight="600"
          >
            Carthage
          </text>
        </g>
        <g>
          <circle cx={POI.ROME.x} cy={POI.ROME.y} r="6" fill="#E8E0F0" />
          <text
            x={POI.ROME.x}
            y={POI.ROME.y + 28}
            fill={PALETTE.parchment}
            fontSize="22"
            fontFamily="serif"
            textAnchor="middle"
            fontWeight="600"
          >
            Rome
          </text>
        </g>
        <g>
          <text
            x={POI.ALPES.x}
            y={POI.ALPES.y - 30}
            fill={PALETTE.ink}
            fontSize="20"
            fontFamily="serif"
            textAnchor="middle"
            fontStyle="italic"
            opacity="0.85"
          >
            Alpes
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const HannibalSprite: React.FC = () => {
  const frame = useCurrentFrame();

  // Trajet : Saguntum (60) -> Alpes (150) -> descente Italie (210)
  const x = interpolate(
    frame,
    [60, 150, 210, 300],
    [POI.SAGUNTUM.x, POI.ALPES.x, POI.ALPES.x + 60, POI.ROME.x - 60],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const y = interpolate(
    frame,
    [60, 150, 210, 300],
    [POI.SAGUNTUM.y, POI.ALPES.y, POI.ALPES.y + 80, POI.ROME.y - 30],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const opacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Walk bob
  const bob = Math.sin(frame * 0.4) * 3;

  return (
    <Img
      src={staticFile(SPRITE_PATH)}
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

const HudLayer: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Jauge Armée — masquée pendant focus dramatique [148, 215] */}
      <StatGauge
        label="Armée"
        icon="⚔"
        fromValue={50000}
        toValue={26000}
        startFrame={20}
        durationFrames={180}
        position={{ top: 100, right: 50 }}
        color="#E6C76E"
        hideRanges={[[148, 215]]}
      />
      {/* Jauge Éléphants — masquée pendant focus dramatique [148, 215] */}
      <StatGauge
        label="Éléphants"
        icon="◊"
        fromValue={37}
        toValue={3}
        startFrame={80}
        durationFrames={140}
        position={{ top: 240, right: 50 }}
        color="#FF8A6B"
        hideRanges={[[148, 215]]}
      />
    </AbsoluteFill>
  );
};

export const LabPhase1: React.FC = () => {
  const frame = useCurrentFrame();

  // Beat C : focus contextuel zoom+blur autour du sprite
  const focusStart = 150;
  const focusEnd = 210;

  // Position approximative du sprite pendant focus
  const focusX = POI.ALPES.x;
  const focusY = POI.ALPES.y + 40;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <FocusBubble
        active={frame >= focusStart && frame < focusEnd}
        startFrame={focusStart}
        endFrame={focusEnd}
        zoomTarget={1.45}
        blurMax={3.5}
        origin={{ x: focusX, y: focusY }}
        background={<MapBackground />}
      >
        <HannibalSprite />
      </FocusBubble>

      {/* HUD : NE doit PAS être affecté par le zoom */}
      <HudLayer />

      {/* SFX : blip TRIMMED juste au déclenchement du focus (frame 148) */}
      <Sequence from={focusStart - 2} durationInFrames={12}>
        <Audio src={staticFile("_lab-hannibal/sfx/blip-bubble-trimmed.mp3")} volume={0.6} />
      </Sequence>
      {/* SFX : tick TRIMMED sur apparition jauge Armée */}
      <Sequence from={20} durationInFrames={8}>
        <Audio src={staticFile("_lab-hannibal/sfx/stat-tick-trimmed.mp3")} volume={0.5} />
      </Sequence>
      {/* SFX : tick TRIMMED sur apparition jauge Éléphants */}
      <Sequence from={80} durationInFrames={8}>
        <Audio src={staticFile("_lab-hannibal/sfx/stat-tick-trimmed.mp3")} volume={0.5} />
      </Sequence>

      {/* Lab marker (top-left, discret) */}
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
        LAB-HANNIBAL · PHASE 1 · 3-LAYERS
      </div>
    </AbsoluteFill>
  );
};
