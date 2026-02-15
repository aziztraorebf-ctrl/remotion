import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ParallaxBackground } from "../components/ParallaxBackground";
import { SpritesheetAnimator } from "../components/SpriteAnimator";
import { PixelCounter } from "../components/PixelCounter";
import { RETRO_COLORS } from "../config/theme";
import { loadFont } from "@remotion/google-fonts/PressStart2P";

const { fontFamily } = loadFont();

// Warped City backgrounds for dramatic reveal
const BG_LAYERS = [
  { src: "assets/retro-explainer/backgrounds/skyline-b.png", speed: 0.05 },
  { src: "assets/retro-explainer/backgrounds/city1plan.png", speed: 0.1 },
  { src: "assets/retro-explainer/backgrounds/city2plan.png", speed: 0.2 },
  { src: "assets/retro-explainer/backgrounds/city3plan.png", speed: 0.35 },
  { src: "assets/retro-explainer/backgrounds/city4plan.png", speed: 0.5 },
];

// Explosion effect: 720x72 (10 frames of 72x72)
const EXPLOSION = {
  src: "assets/retro-explainer/platformer-game-kit/10-magic-sprite-sheet-effects-pixel-art/5 Explosion/Explosion.png",
  frameCount: 10,
  frameWidth: 72,
  frameHeight: 72,
};

// Mage boss hurt sprite (player fights back visually)
const MAGE_HURT = {
  src: "assets/retro-explainer/platformer-game-kit/boss-monsters-pixel-art/1 Mage/Mage_boss_hurt.png",
  frameCount: 4,
  frameWidth: 64,
  frameHeight: 64,
};

export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Screen shake when big number hits
  const shakePhase = frame >= 40 && frame <= 70;
  const shakeX = shakePhase ? Math.sin(frame * 6) * 4 : 0;
  const shakeY = shakePhase ? Math.cos(frame * 5) * 3 : 0;

  // Comparison arrows
  const arrowOpacity = interpolate(frame, [70, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Difference reveal
  const diffScale = spring({
    frame: frame - 80,
    fps,
    config: { damping: 10, mass: 0.5 },
  });

  // Show hurt boss at reveal moment
  const showHurtBoss = frame >= 80;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <ParallaxBackground layers={BG_LAYERS} baseSpeed={0.6} />

      {/* Dark overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(15, 14, 23, 0.7)",
          zIndex: 1,
        }}
      />

      {/* Left: Original amount */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "15%",
          textAlign: "center",
          fontFamily,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: RETRO_COLORS.textSecondary,
            marginBottom: 10,
            letterSpacing: 2,
          }}
        >
          EMPRUNTE
        </div>
        <div
          style={{
            fontSize: 32,
            color: RETRO_COLORS.uiGreen,
            textShadow: `0 0 10px ${RETRO_COLORS.uiGreen}`,
          }}
        >
          340 000 EUR
        </div>
      </div>

      {/* Arrow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily,
          fontSize: 36,
          color: RETRO_COLORS.uiRed,
          opacity: arrowOpacity,
          textShadow: `0 0 15px ${RETRO_COLORS.uiRed}`,
          zIndex: 10,
        }}
      >
        &#8594;
      </div>

      {/* Right: Real cost - counter */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          right: "15%",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: RETRO_COLORS.textSecondary,
            marginBottom: 10,
            letterSpacing: 2,
            fontFamily,
            textAlign: "center",
          }}
        >
          REMBOURSE
        </div>
        <PixelCounter
          startValue={340000}
          endValue={612000}
          startFrame={10}
          durationFrames={50}
          suffix=" EUR"
          color={RETRO_COLORS.uiRed}
          fontSize={32}
        />
      </div>

      {/* Difference callout */}
      {frame >= 80 && (
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${diffScale})`,
            textAlign: "center",
            fontFamily,
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: RETRO_COLORS.uiOrange,
              marginBottom: 12,
            }}
          >
            COUT TOTAL DES INTERETS
          </div>
          <div
            style={{
              fontSize: 48,
              color: RETRO_COLORS.uiRed,
              textShadow: `0 0 30px ${RETRO_COLORS.uiRed}, 0 4px 0 #8b0000`,
            }}
          >
            +272 000 EUR
          </div>
          <div
            style={{
              fontSize: 14,
              color: RETRO_COLORS.uiYellow,
              marginTop: 16,
            }}
          >
            80% DU MONTANT INITIAL
          </div>
        </div>
      )}

      {/* Hurt boss sprite in corner after reveal */}
      {showHurtBoss && (
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            right: "8%",
            zIndex: 10,
            opacity: interpolate(frame, [80, 90], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <SpritesheetAnimator
            src={MAGE_HURT.src}
            frameCount={MAGE_HURT.frameCount}
            frameWidth={MAGE_HURT.frameWidth}
            frameHeight={MAGE_HURT.frameHeight}
            displayWidth={160}
            displayHeight={160}
            frameRate={6}
          />
        </div>
      )}

      {/* Explosion effects during shake */}
      {frame >= 45 && frame < 75 &&
        [0, 1, 2].map((i) => {
          const startF = 45 + i * 10;
          const relF = frame - startF;
          if (relF < 0 || relF > 25) return null;
          const positions = [
            { x: "25%", y: "45%" },
            { x: "55%", y: "35%" },
            { x: "75%", y: "50%" },
          ];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: positions[i].x,
                top: positions[i].y,
                transform: "translate(-50%, -50%)",
                zIndex: 8,
                opacity: interpolate(relF, [0, 5, 20, 25], [0, 1, 1, 0]),
              }}
            >
              <SpritesheetAnimator
                src={EXPLOSION.src}
                frameCount={EXPLOSION.frameCount}
                frameWidth={EXPLOSION.frameWidth}
                frameHeight={EXPLOSION.frameHeight}
                displayWidth={200}
                displayHeight={200}
                frameRate={3}
                loop={false}
              />
            </div>
          );
        })}

      {/* Damage numbers floating up (like RPG hits) */}
      {frame >= 40 &&
        Array.from({ length: 5 }, (_, i) => {
          const startF = 40 + i * 8;
          const relF = frame - startF;
          if (relF < 0 || relF > 30) return null;
          const x = width / 2 + (i - 2) * 120 + Math.sin(i * 3) * 50;
          const y = interpolate(relF, [0, 30], [height * 0.5, height * 0.3]);
          const opacity = interpolate(relF, [0, 10, 25, 30], [0, 1, 1, 0]);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                fontFamily,
                fontSize: 20,
                color: RETRO_COLORS.uiRed,
                textShadow: `0 0 8px ${RETRO_COLORS.uiRed}`,
                opacity,
                zIndex: 10,
              }}
            >
              -{(10000 + i * 12000).toLocaleString("fr-FR")}
            </div>
          );
        })}
    </div>
  );
};
