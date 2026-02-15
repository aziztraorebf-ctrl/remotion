import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SpritesheetAnimator } from "./SpriteAnimator";
import { RETRO_COLORS } from "../config/theme";
import { loadFont } from "@remotion/google-fonts/PressStart2P";

const { fontFamily } = loadFont();

// Mage boss spritesheets (all 64x64 per frame)
const MAGE_IDLE = {
  src: "assets/retro-explainer/platformer-game-kit/boss-monsters-pixel-art/1 Mage/Mage_boss.png",
  frameCount: 1,
  frameWidth: 64,
  frameHeight: 64,
};

const MAGE_SNEER = {
  src: "assets/retro-explainer/platformer-game-kit/boss-monsters-pixel-art/1 Mage/Mage_boss_sneer.png",
  frameCount: 6,
  frameWidth: 64,
  frameHeight: 64,
};

const MAGE_ATTACK = {
  src: "assets/retro-explainer/platformer-game-kit/boss-monsters-pixel-art/1 Mage/Mage_boss_attack1.png",
  frameCount: 6,
  frameWidth: 64,
  frameHeight: 64,
};

// Lightning magic effect: 720x72 (10 frames of 72x72)
const LIGHTNING = {
  src: "assets/retro-explainer/platformer-game-kit/10-magic-sprite-sheet-effects-pixel-art/1 Lightning/Lightning.png",
  frameCount: 10,
  frameWidth: 72,
  frameHeight: 72,
};

// Fire wall magic effect: 720x72 (10 frames of 72x72)
const FIRE_WALL = {
  src: "assets/retro-explainer/platformer-game-kit/10-magic-sprite-sheet-effects-pixel-art/7 Fire wall/Fire-wall.png",
  frameCount: 10,
  frameWidth: 72,
  frameHeight: 72,
};

interface BossRevealProps {
  bossName: string;
  bossSubtitle?: string;
}

export const BossReveal: React.FC<BossRevealProps> = ({
  bossName,
  bossSubtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Warning flash
  const flashPhase = frame < 30;
  const flashOpacity = flashPhase
    ? interpolate(Math.sin(frame * 1.5), [-1, 1], [0, 0.3])
    : 0;

  // "WARNING" text
  const warningVisible = frame >= 5;
  const warningScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 8, mass: 0.4 },
  });

  // Boss name reveal
  const bossNameScale = spring({
    frame: frame - 35,
    fps,
    config: { damping: 12, mass: 0.6 },
  });

  // Health bar appearance
  const healthBarOpacity = interpolate(frame, [45, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Boss sprite scale-in
  const bossScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 10, mass: 0.8 },
  });

  // Floating animation for boss
  const bossFloat = frame > 30 ? Math.sin((frame - 30) * 0.08) * 10 : 0;

  // Boss animation phases: idle -> sneer -> attack
  const isAttacking = frame >= 100;
  const isSneering = frame >= 60 && frame < 100;

  const currentSprite = isAttacking
    ? MAGE_ATTACK
    : isSneering
      ? MAGE_SNEER
      : MAGE_IDLE;

  // Magic effects appear during attack
  const showLightning = frame >= 110 && frame < 150;
  const showFireWall = frame >= 130;

  const bossDisplaySize = 320;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: RETRO_COLORS.bgDark,
        position: "relative",
        overflow: "hidden",
        fontFamily,
      }}
    >
      {/* Red flash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: RETRO_COLORS.bossRed,
          opacity: flashOpacity,
        }}
      />

      {/* WARNING text */}
      {warningVisible && (
        <div
          style={{
            position: "absolute",
            top: 80,
            width: "100%",
            textAlign: "center",
            fontSize: 36,
            color: RETRO_COLORS.uiRed,
            textShadow: `0 0 20px ${RETRO_COLORS.uiRed}`,
            transform: `scale(${warningScale})`,
            letterSpacing: 12,
            opacity: frame > 35 ? interpolate(frame, [35, 45], [1, 0.6], { extrapolateRight: "clamp" }) : 1,
            zIndex: 10,
          }}
        >
          ! WARNING !
        </div>
      )}

      {/* Boss sprite */}
      {frame >= 30 && (
        <div
          style={{
            position: "absolute",
            top: "22%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${bossScale}) translateY(${bossFloat}px)`,
            zIndex: 5,
          }}
        >
          <SpritesheetAnimator
            src={currentSprite.src}
            frameCount={currentSprite.frameCount}
            frameWidth={currentSprite.frameWidth}
            frameHeight={currentSprite.frameHeight}
            displayWidth={bossDisplaySize}
            displayHeight={bossDisplaySize}
            frameRate={currentSprite.frameCount === 1 ? 999 : 5}
          />
        </div>
      )}

      {/* Lightning effect */}
      {showLightning && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            zIndex: 8,
          }}
        >
          <SpritesheetAnimator
            src={LIGHTNING.src}
            frameCount={LIGHTNING.frameCount}
            frameWidth={LIGHTNING.frameWidth}
            frameHeight={LIGHTNING.frameHeight}
            displayWidth={280}
            displayHeight={280}
            frameRate={3}
          />
        </div>
      )}

      {/* Fire wall effect */}
      {showFireWall && (
        <div
          style={{
            position: "absolute",
            bottom: "15%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 8,
          }}
        >
          <SpritesheetAnimator
            src={FIRE_WALL.src}
            frameCount={FIRE_WALL.frameCount}
            frameWidth={FIRE_WALL.frameWidth}
            frameHeight={FIRE_WALL.frameHeight}
            displayWidth={400}
            displayHeight={400}
            frameRate={3}
          />
        </div>
      )}

      {/* Boss name */}
      {frame >= 35 && (
        <div
          style={{
            position: "absolute",
            top: "58%",
            width: "100%",
            textAlign: "center",
            transform: `scale(${bossNameScale})`,
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: RETRO_COLORS.uiRed,
              textShadow: `0 0 20px ${RETRO_COLORS.uiRed}, 0 4px 0 #8b0000`,
              letterSpacing: 4,
            }}
          >
            {bossName}
          </div>
          {bossSubtitle && (
            <div
              style={{
                fontSize: 14,
                color: RETRO_COLORS.uiOrange,
                marginTop: 12,
                letterSpacing: 2,
              }}
            >
              {bossSubtitle}
            </div>
          )}
        </div>
      )}

      {/* Boss health bar */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: healthBarOpacity,
          width: 500,
          zIndex: 10,
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: 10,
            color: RETRO_COLORS.uiRed,
            marginBottom: 6,
          }}
        >
          BOSS HP
        </div>
        <div
          style={{
            width: "100%",
            height: 20,
            backgroundColor: RETRO_COLORS.bgMedium,
            border: `2px solid ${RETRO_COLORS.uiRed}`,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: RETRO_COLORS.uiRed,
              boxShadow: `0 0 10px ${RETRO_COLORS.uiRed}`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
