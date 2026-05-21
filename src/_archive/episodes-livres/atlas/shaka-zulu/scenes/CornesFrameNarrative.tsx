// CornesFrameNarrative — version narrative de la signature visuelle
// Aziz a demande : transformer le diagramme tactique geometrique en SCENE narrative.
//
// 3 Shaka warriors (sprites PixelLab) attaquent en formation cornes de buffle :
// - 2 warriors aux pointes des cornes (gauche / droite) qui s'ecartent puis convergent
// - 1 warrior au centre-bas (corps central) qui avance
// - Au milieu : silhouette ennemie (zulu-warrior-static utilise comme "ennemi") qui se fait encercler
//
// Animation :
// 1. Apparition warrior central + ennemi au centre
// 2. Cornes Bezier se dessinent + warriors gauche/droite emergent aux pointes
// 3. Cornes pivotent vers l'interieur, warriors se rapprochent du centre
// 4. Pulsation rouge sur ennemi (encercle)

import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { CornesFrame } from "../components/CornesFrame";
import { SHAKA_PALETTE, SHAKA_FONTS } from "../components/AtlasShakaPalette";

interface CornesFrameNarrativeProps {
  durationFrames: number;
}

const SPRITE = 220; // taille affichage des sprites 128px sources (Kimi: scale 1.5x sprites lateraux)

// Warrior flancs — animations
// Breathing-idle : east (flanc gauche flippe) + west (flanc droit flippe) — 4 frames, lent
// Walk cycle : east (6 frames, rapide) — declenche a 8s quand cornes convergent
const IDLE_EAST = [
  "atlas-shaka-zulu/characters/warrior/animations/animating-f35b625f/east/frame_000.png",
  "atlas-shaka-zulu/characters/warrior/animations/animating-f35b625f/east/frame_001.png",
  "atlas-shaka-zulu/characters/warrior/animations/animating-f35b625f/east/frame_002.png",
  "atlas-shaka-zulu/characters/warrior/animations/animating-f35b625f/east/frame_003.png",
];
const IDLE_WEST = [
  "atlas-shaka-zulu/characters/warrior/animations/animating-f35b625f/west/frame_000.png",
  "atlas-shaka-zulu/characters/warrior/animations/animating-f35b625f/west/frame_001.png",
  "atlas-shaka-zulu/characters/warrior/animations/animating-f35b625f/west/frame_002.png",
  "atlas-shaka-zulu/characters/warrior/animations/animating-f35b625f/west/frame_003.png",
];
const WALK_EAST = [
  "atlas-shaka-zulu/assets/warrior-walk-cycle/east/frame_000.png",
  "atlas-shaka-zulu/assets/warrior-walk-cycle/east/frame_001.png",
  "atlas-shaka-zulu/assets/warrior-walk-cycle/east/frame_002.png",
  "atlas-shaka-zulu/assets/warrior-walk-cycle/east/frame_003.png",
  "atlas-shaka-zulu/assets/warrior-walk-cycle/east/frame_004.png",
  "atlas-shaka-zulu/assets/warrior-walk-cycle/east/frame_005.png",
];
const IDLE_SPEED = 8;  // frames Remotion par sprite idle (lent = respiration)
const WALK_SPEED = 4;  // frames Remotion par sprite walk (rapide)

const SHAKA_SPRITE = "atlas-shaka-zulu/archive/shaka-walk-east/frame_003.png";

export const CornesFrameNarrative: React.FC<CornesFrameNarrativeProps> = ({ durationFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase principale : ouverture (0-30%), maintien encerclement (30-70%), fermeture (70-100%)
  const phase = interpolate(
    frame,
    [0, durationFrames * 0.3, durationFrames * 0.7, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // KIMI FIX : asymetrie cornes (delai 3 frames sur la corne droite pour casser symetrie parfaite)
  // On donne au composant CornesFrame 2 phases differentes
  const phaseLeft = phase;
  const phaseRight = interpolate(
    frame - 3,
    [0, durationFrames * 0.3, durationFrames * 0.7, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Position des warriors aux pointes (suivent les cornes Bezier)
  // Cornes : centerX=540 centerY=1200, scale=1.6 -> reach=220*phase*scale=352*phase, armLength=280*phase*scale=448*phase
  const reachScaledL = 220 * 1.6 * phaseLeft;
  const armLenScaledL = 280 * 1.6 * phaseLeft;
  const reachScaledR = 220 * 1.6 * phaseRight;
  const armLenScaledR = 280 * 1.6 * phaseRight;

  const leftPointX = 540 - reachScaledL * 1.05;
  const leftPointY = 1200 - armLenScaledL;
  const rightPointX = 540 + reachScaledR * 1.05;
  const rightPointY = 1200 - armLenScaledR;

  // Warrior central (Shaka commandant) en bas
  const shakaT = spring({ frame, fps, config: { damping: 18, stiffness: 100 }, from: 0, to: 1 });
  const shakaY = 1200 + 60 + 40 * (1 - shakaT);

  // Shaka reste visible tout le long (pas de fade-out)
  const shakaOpacity = shakaT;

  // Warriors flancs : timing
  const FLANCS_APPEAR = 120; // 4s — apparition simultanee des deux (idle)
  const WALK_START = 240;    // 8s — walk cycle demarre (cornes convergent)

  // Opacite identique pour les deux flancs — base sur frame uniquement, pas sur phase
  const flancsOpacity = interpolate(frame, [FLANCS_APPEAR, FLANCS_APPEAR + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sprite a afficher : idle avant WALK_START, walk apres
  // Flanc gauche : IDLE_EAST (pointe droite, pas de flip necessaire) -> WALK_EAST
  // Flanc droit  : IDLE_WEST (pointe gauche) -> WALK_EAST + scaleX(-1)
  const idxIdle = Math.floor(frame / IDLE_SPEED) % IDLE_EAST.length;
  const idxWalk = Math.floor((frame - WALK_START) / WALK_SPEED) % WALK_EAST.length;
  const spriteFlanqGauche = frame < WALK_START
    ? IDLE_EAST[idxIdle]
    : WALK_EAST[idxWalk];
  const spriteFlanqDroit = frame < WALK_START
    ? IDLE_WEST[idxIdle]
    : WALK_EAST[idxWalk];

  // Ennemi au centre (apparait en premier)
  const enemyT = spring({ frame: frame - 5, fps, config: { damping: 20, stiffness: 140 }, from: 0, to: 1 });

  // Pulsation rouge sur ennemi quand encercle (entre 30% et 70%)
  const encerclementT = interpolate(
    frame,
    [durationFrames * 0.3, durationFrames * 0.5, durationFrames * 0.7],
    [0, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const dangerPulse = 0.5 + 0.5 * Math.sin(frame * 0.4);

  // KIMI FIX : tremblement ennemi a partir de frame 90 (peur)
  const enemyTremor = frame > 90 ? Math.sin(frame * 0.6) * 2 : 0;

  // Sprites statiques (pas de walk cycle disponible pour ces personnages)
  // Compense l'absence d'animation par une legere oscillation verticale (respiration)
  const breathLeft = Math.sin(frame * 0.15) * 3;
  const breathRight = Math.sin(frame * 0.15 + 1.5) * 3;
  const breathShaka = Math.sin(frame * 0.12) * 2;

  // KIMI FIX : typewriter texte final
  const textRevealStart = durationFrames * 0.55;
  const fullText = "L'ennemi encerclé. Plus aucune issue.";
  const charsRevealed = Math.max(0, Math.floor((frame - textRevealStart) / 1.2));
  const visibleText = fullText.slice(0, charsRevealed);

  // Fade in/out general
  const opacity = interpolate(
    frame,
    [0, 8, durationFrames - 10, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg viewBox="0 0 1080 1920" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
        {/* KIMI FIX : gradient radial CARTE_FOND -> NOIR_PROFOND (spotlight naturel) */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="62%" r="65%">
            <stop offset="0%" stopColor="#241810" stopOpacity="1" />
            <stop offset="55%" stopColor="#1A1208" stopOpacity="1" />
            <stop offset="100%" stopColor="#0D0D0D" stopOpacity="1" />
          </radialGradient>
          <filter id="dangerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          {/* KIMI FIX : glow dore sur cornes actives */}
          <filter id="cornesGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="1080" height="1920" fill="url(#centerGlow)" />

        {/* === TITRE === */}
        <text
          x="540" y="220"
          textAnchor="middle"
          fontFamily={SHAKA_FONTS.TITRE}
          fontSize="64"
          fontWeight="900"
          fill={SHAKA_PALETTE.OR}
          letterSpacing="6"
          opacity={shakaT}
        >
          CORNES DE BUFFLE
        </text>
        <text
          x="540" y="266"
          textAnchor="middle"
          fontFamily={SHAKA_FONTS.CORPS}
          fontSize="24"
          fontWeight="500"
          fill={SHAKA_PALETTE.PARCHEMIN}
          letterSpacing="3"
          opacity={shakaT * 0.85}
        >
          TACTIQUE D'ENCERCLEMENT — IMPI ZOULOU
        </text>

        {/* === HALO ROUGE DANGER autour ennemi (KIMI FIX: pulse plus tot et plus sature) === */}
        {(encerclementT > 0.05 || frame < 30) && (
          <>
            {/* Halo bordeaux principal */}
            <circle
              cx="540"
              cy="1200"
              r={90 + 35 * dangerPulse}
              fill="#B91C1C"
              opacity={Math.max(encerclementT * 0.55, frame < 20 ? frame / 30 * 0.3 : 0) * dangerPulse}
              filter="url(#dangerGlow)"
            />
            {/* Glow externe dore */}
            <circle
              cx="540"
              cy="1200"
              r={130 + 40 * dangerPulse}
              fill="none"
              stroke={SHAKA_PALETTE.OR}
              strokeWidth="2"
              opacity={encerclementT * 0.25 * dangerPulse}
              filter="url(#dangerGlow)"
            />
          </>
        )}

        {/* === CORNES BEZIER avec asymetrie + glow === */}
        <g filter="url(#cornesGlow)">
          {/* Corne gauche */}
          <CornesFrame
            durationFrames={durationFrames}
            phaseOverride={phaseLeft}
            centerX={540}
            centerY={1200}
            scale={1.6}
          />
        </g>
      </svg>

      {/* === SPRITES PIXELLAB par-dessus === */}
      {/* Ennemi central (avec tremblement KIMI fix) */}
      <div
        style={{
          position: "absolute",
          left: `${(540 - SPRITE / 2) / 1080 * 100}%`,
          top: `${(1200 - SPRITE / 2) / 1920 * 100}%`,
          width: `${SPRITE / 1080 * 100}%`,
          height: `${SPRITE / 1920 * 100}%`,
          opacity: enemyT,
          transform: `translateX(${enemyTremor}px) scale(${0.75 + 0.25 * enemyT})`,
          imageRendering: "pixelated",
        }}
      >
        <Img
          src={staticFile("atlas-shaka-zulu/assets/zulu-warrior-static.png")}
          style={{
            width: "100%",
            height: "100%",
            imageRendering: "pixelated",
            filter: `hue-rotate(-10deg) saturate(0.7) brightness(${0.75 + 0.25 * (1 - encerclementT)})`,
          }}
        />
      </div>

      {/* Warrior flanc gauche : face droite (vers centre) — idle east 4s-8s, walk east 8s+ */}
      {frame >= FLANCS_APPEAR && (
        <div
          style={{
            position: "absolute",
            left: `${(leftPointX - SPRITE / 2) / 1080 * 100}%`,
            top: `${(leftPointY - SPRITE / 2) / 1920 * 100}%`,
            width: `${SPRITE / 1080 * 100}%`,
            height: `${SPRITE / 1920 * 100}%`,
            opacity: flancsOpacity,
            imageRendering: "pixelated",
          }}
        >
          <Img
            src={staticFile(spriteFlanqGauche)}
            style={{ width: "100%", height: "100%", imageRendering: "pixelated" }}
          />
        </div>
      )}

      {/* Warrior flanc droit : face gauche (vers centre) — idle west 4s-8s, walk east flippe 8s+ */}
      {frame >= FLANCS_APPEAR && (
        <div
          style={{
            position: "absolute",
            left: `${(rightPointX - SPRITE / 2) / 1080 * 100}%`,
            top: `${(rightPointY - SPRITE / 2) / 1920 * 100}%`,
            width: `${SPRITE / 1080 * 100}%`,
            height: `${SPRITE / 1920 * 100}%`,
            opacity: flancsOpacity,
            imageRendering: "pixelated",
            transform: frame >= WALK_START ? "scaleX(-1)" : undefined,
          }}
        >
          <Img
            src={staticFile(spriteFlanqDroit)}
            style={{ width: "100%", height: "100%", imageRendering: "pixelated" }}
          />
        </div>
      )}

      {/* Shaka commandant (sprite statique + fade-out apres 60% par Kimi) */}
      {shakaOpacity > 0.02 && (
        <div
          style={{
            position: "absolute",
            left: `${(540 - SPRITE * 1.15 / 2) / 1080 * 100}%`,
            top: `${(shakaY - SPRITE * 1.15 / 2 + breathShaka) / 1920 * 100}%`,
            width: `${SPRITE * 1.15 / 1080 * 100}%`,
            height: `${SPRITE * 1.15 / 1920 * 100}%`,
            opacity: shakaOpacity,
            imageRendering: "pixelated",
          }}
        >
          <Img
            src={staticFile(SHAKA_SPRITE)}
            style={{ width: "100%", height: "100%", imageRendering: "pixelated" }}
          />
        </div>
      )}

      {/* Legende basse (typewriter Kimi fix) + curseur */}
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <text
          x="540" y="1700"
          textAnchor="middle"
          fontFamily={SHAKA_FONTS.CORPS}
          fontSize="26"
          fontWeight="600"
          fill={SHAKA_PALETTE.PARCHEMIN}
          letterSpacing="2"
          opacity={frame > textRevealStart ? 1 : 0}
          stroke="#0D0D0D"
          strokeWidth="0.5"
        >
          {visibleText}
          {charsRevealed < fullText.length && frame > textRevealStart && (
            <tspan opacity={frame % 10 < 5 ? 1 : 0.3}>|</tspan>
          )}
        </text>
      </svg>
    </AbsoluteFill>
  );
};
