import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { SpritesheetAnimator } from "./SpriteAnimator";
import { RETRO_COLORS } from "../config/theme";
import { loadFont } from "@remotion/google-fonts/PressStart2P";

const { fontFamily } = loadFont();

// Coin spritesheet: 256x32 (8 frames of 32x32)
const COIN = {
  src: "assets/retro-explainer/platformer-game-kit/platformer-pixel-art-tileset/Objects_Animated/Coin.png",
  frameCount: 8,
  frameWidth: 32,
  frameHeight: 32,
};

// Flag spritesheet: 256x32 (8 frames of 32x32)
const FLAG = {
  src: "assets/retro-explainer/platformer-game-kit/platformer-pixel-art-tileset/Objects_Animated/Flag.png",
  frameCount: 8,
  frameWidth: 32,
  frameHeight: 32,
};

// Pink Monster jump: 256x32 (8 frames of 32x32)
const HERO_JUMP = {
  src: "assets/retro-explainer/platformer-game-kit/pixel-art-tiny-hero-sprites/1 Pink_Monster/Pink_Monster_Jump_8.png",
  frameCount: 8,
  frameWidth: 32,
  frameHeight: 32,
};

// Mage boss death: 384x64 (6 frames of 64x64)
const BOSS_DEATH = {
  src: "assets/retro-explainer/platformer-game-kit/boss-monsters-pixel-art/1 Mage/Mage_boss_death.png",
  frameCount: 6,
  frameWidth: 64,
  frameHeight: 64,
};

interface VictoryScreenProps {
  mainText: string;
  subText?: string;
  ctaText?: string;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  mainText,
  subText,
  ctaText,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Main text scale
  const textScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 10, mass: 0.5 },
  });

  // Sub text
  const subOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CTA blink
  const ctaVisible = frame > 50 && Math.floor(frame / 20) % 2 === 0;

  // Hero bounce
  const heroBounce = frame > 10 ? Math.abs(Math.sin(frame * 0.12)) * 20 : 0;

  // Coin positions (falling animated coins)
  const coinPositions = Array.from({ length: 12 }, (_, i) => {
    const startX = (i * 167.3) % width;
    const speed = 1.2 + (i % 4) * 0.4;
    const y = ((frame - 10) * speed + i * 80) % (height + 100) - 60;
    return { x: startX, y };
  });

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
      {/* Gold gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, ${RETRO_COLORS.uiGold}15 0%, transparent 60%)`,
        }}
      />

      {/* Falling animated coins */}
      {frame > 10 &&
        coinPositions.map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              zIndex: 2,
            }}
          >
            <SpritesheetAnimator
              src={COIN.src}
              frameCount={COIN.frameCount}
              frameWidth={COIN.frameWidth}
              frameHeight={COIN.frameHeight}
              displayWidth={32 + (i % 3) * 8}
              displayHeight={32 + (i % 3) * 8}
              frameRate={4}
            />
          </div>
        ))}

      {/* Defeated boss in bottom-left */}
      {frame > 5 && (
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "10%",
            zIndex: 5,
            opacity: interpolate(frame, [5, 15], [0, 0.8], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <SpritesheetAnimator
            src={BOSS_DEATH.src}
            frameCount={BOSS_DEATH.frameCount}
            frameWidth={BOSS_DEATH.frameWidth}
            frameHeight={BOSS_DEATH.frameHeight}
            displayWidth={192}
            displayHeight={192}
            frameRate={8}
            loop={false}
          />
        </div>
      )}

      {/* Victorious hero jumping */}
      {frame > 10 && (
        <div
          style={{
            position: "absolute",
            bottom: `calc(10% + ${heroBounce}px)`,
            right: "15%",
            zIndex: 5,
          }}
        >
          <SpritesheetAnimator
            src={HERO_JUMP.src}
            frameCount={HERO_JUMP.frameCount}
            frameWidth={HERO_JUMP.frameWidth}
            frameHeight={HERO_JUMP.frameHeight}
            displayWidth={128}
            displayHeight={128}
            frameRate={4}
          />
        </div>
      )}

      {/* Victory flags */}
      {frame > 15 && (
        <>
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "5%",
              zIndex: 5,
            }}
          >
            <SpritesheetAnimator
              src={FLAG.src}
              frameCount={FLAG.frameCount}
              frameWidth={FLAG.frameWidth}
              frameHeight={FLAG.frameHeight}
              displayWidth={96}
              displayHeight={96}
              frameRate={4}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "15%",
              right: "5%",
              zIndex: 5,
            }}
          >
            <SpritesheetAnimator
              src={FLAG.src}
              frameCount={FLAG.frameCount}
              frameWidth={FLAG.frameWidth}
              frameHeight={FLAG.frameHeight}
              displayWidth={96}
              displayHeight={96}
              frameRate={4}
              flipX
            />
          </div>
        </>
      )}

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {/* Main victory text */}
        <div
          style={{
            fontSize: 48,
            color: RETRO_COLORS.uiGold,
            textShadow: `0 0 30px ${RETRO_COLORS.uiGold}, 0 4px 0 #b8860b`,
            transform: `scale(${textScale})`,
            letterSpacing: 6,
          }}
        >
          {mainText}
        </div>

        {/* Sub text */}
        {subText && (
          <div
            style={{
              fontSize: 16,
              color: RETRO_COLORS.uiGreen,
              marginTop: 30,
              opacity: subOpacity,
              lineHeight: 2,
              letterSpacing: 2,
            }}
          >
            {subText}
          </div>
        )}

        {/* CTA */}
        {ctaText && ctaVisible && (
          <div
            style={{
              fontSize: 14,
              color: RETRO_COLORS.uiYellow,
              marginTop: 50,
              letterSpacing: 3,
              textShadow: `0 0 10px ${RETRO_COLORS.uiYellow}`,
            }}
          >
            {ctaText}
          </div>
        )}
      </div>
    </div>
  );
};
