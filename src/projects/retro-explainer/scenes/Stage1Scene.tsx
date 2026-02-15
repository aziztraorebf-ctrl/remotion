import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ParallaxBackground } from "../components/ParallaxBackground";
import { SpritesheetAnimator } from "../components/SpriteAnimator";
import { RetroHUD } from "../components/RetroHUD";
import { DialogueBox } from "../components/DialogueBox";
import { PixelProgressBar } from "../components/PixelProgressBar";
import { RETRO_COLORS } from "../config/theme";
import { loadFont } from "@remotion/google-fonts/PressStart2P";

const { fontFamily } = loadFont();

// Platformer tileset backgrounds (8 parallax layers, 576x324 each)
const BG_LAYERS = [
  { src: "assets/retro-explainer/platformer-game-kit/platformer-pixel-art-tileset/Background/Layers/1.png", speed: 0 },
  { src: "assets/retro-explainer/platformer-game-kit/platformer-pixel-art-tileset/Background/Layers/2.png", speed: 0.05 },
  { src: "assets/retro-explainer/platformer-game-kit/platformer-pixel-art-tileset/Background/Layers/3.png", speed: 0.1 },
  { src: "assets/retro-explainer/platformer-game-kit/platformer-pixel-art-tileset/Background/Layers/4.png", speed: 0.2 },
  { src: "assets/retro-explainer/platformer-game-kit/platformer-pixel-art-tileset/Background/Layers/5.png", speed: 0.3 },
  { src: "assets/retro-explainer/platformer-game-kit/platformer-pixel-art-tileset/Background/Layers/6.png", speed: 0.4 },
  { src: "assets/retro-explainer/platformer-game-kit/platformer-pixel-art-tileset/Background/Layers/7.png", speed: 0.5 },
  { src: "assets/retro-explainer/platformer-game-kit/platformer-pixel-art-tileset/Background/Layers/8.png", speed: 0.6 },
];

// warped-player spritesheet: walk = 1136x67 (16 frames of 71x67)
const PLAYER_WALK = {
  src: "assets/retro-explainer/characters/warped-player/walk.png",
  frameCount: 16,
  frameWidth: 71,
  frameHeight: 67,
};

// warped-player idle = 284x67 (4 frames of 71x67)
const PLAYER_IDLE = {
  src: "assets/retro-explainer/characters/warped-player/idle.png",
  frameCount: 4,
  frameWidth: 71,
  frameHeight: 67,
};

// Coin spritesheet: 256x32 (8 frames of 32x32)
const COIN = {
  src: "assets/retro-explainer/platformer-game-kit/platformer-pixel-art-tileset/Objects_Animated/Coin.png",
  frameCount: 8,
  frameWidth: 32,
  frameHeight: 32,
};

export const Stage1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Character walks in then stops
  const isWalking = frame < 50;
  const characterX = interpolate(frame, [0, 50], [-100, 350], {
    extrapolateRight: "clamp",
  });

  // Loan amount appearing
  const loanOpacity = interpolate(frame, [55, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Coin float animation
  const coinFloat = Math.sin(frame * 0.1) * 5;

  const playerSprite = isWalking ? PLAYER_WALK : PLAYER_IDLE;
  const displayScale = 3;

  return (
    <div style={{ width, height, position: "relative" }}>
      <ParallaxBackground layers={BG_LAYERS} baseSpeed={0.4} />

      {/* HUD */}
      <RetroHUD
        playerName="EMPRUNTEUR"
        level={1}
        levelName="L'EMPRUNT"
        health={100}
        xp={10}
        score={340000}
      />

      {/* Animated character sprite */}
      <div
        style={{
          position: "absolute",
          bottom: "22%",
          left: characterX,
          zIndex: 10,
        }}
      >
        <SpritesheetAnimator
          src={playerSprite.src}
          frameCount={playerSprite.frameCount}
          frameWidth={playerSprite.frameWidth}
          frameHeight={playerSprite.frameHeight}
          displayWidth={playerSprite.frameWidth * displayScale}
          displayHeight={playerSprite.frameHeight * displayScale}
          frameRate={isWalking ? 3 : 6}
        />
      </div>

      {/* Floating coin next to loan amount */}
      {frame >= 55 && (
        <div
          style={{
            position: "absolute",
            top: `calc(38% + ${coinFloat}px)`,
            left: "38%",
            zIndex: 15,
          }}
        >
          <SpritesheetAnimator
            src={COIN.src}
            frameCount={COIN.frameCount}
            frameWidth={COIN.frameWidth}
            frameHeight={COIN.frameHeight}
            displayWidth={64}
            displayHeight={64}
            frameRate={4}
          />
        </div>
      )}

      {/* Loan amount display */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translateX(-40%)",
          opacity: loanOpacity,
          textAlign: "center",
          fontFamily,
          zIndex: 15,
        }}
      >
        <div
          style={{
            fontSize: 14,
            color: RETRO_COLORS.textSecondary,
            marginBottom: 8,
          }}
        >
          MONTANT EMPRUNTE
        </div>
        <div
          style={{
            fontSize: 40,
            color: RETRO_COLORS.uiGreen,
            textShadow: `0 0 15px ${RETRO_COLORS.uiGreen}`,
          }}
        >
          340 000 EUR
        </div>
      </div>

      {/* Remboursement progress */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 15,
        }}
      >
        <PixelProgressBar
          progress={55}
          startFrame={80}
          durationFrames={40}
          width={500}
          label="REMBOURSEMENT"
          color={RETRO_COLORS.uiGreen}
        />
      </div>

      {/* Dialogue box */}
      <DialogueBox
        text="Tu empruntes 340 000 EUR sur 25 ans. Ca a l'air simple, non ?"
        speakerName="BANQUIER"
        startFrame={90}
        accentColor={RETRO_COLORS.uiGreen}
      />
    </div>
  );
};
