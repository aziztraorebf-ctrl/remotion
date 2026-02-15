import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ParallaxBackground } from "../components/ParallaxBackground";
import { RETRO_COLORS } from "../config/theme";
import { loadFont } from "@remotion/google-fonts/PressStart2P";

const { fontFamily } = loadFont();

const BG_LAYERS = [
  {
    src: "assets/retro-explainer/backgrounds/skyline-a.png",
    speed: 0.1,
  },
  {
    src: "assets/retro-explainer/backgrounds/buildings-bg.png",
    speed: 0.3,
  },
  {
    src: "assets/retro-explainer/backgrounds/near-buildings-bg.png",
    speed: 0.6,
  },
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // "ALERTE" flash in first 30 frames
  const alertFlash =
    frame < 40 ? interpolate(Math.sin(frame * 0.8), [-1, 1], [0, 0.4]) : 0;

  // Main question text
  const questionScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  // Counter that starts at 340000 and jumps to 612000
  const counterActive = frame >= 70;
  const counterValue = counterActive
    ? Math.round(
        interpolate(frame, [70, 140], [340000, 612000], {
          extrapolateRight: "clamp",
        })
      )
    : 0;

  // "x1.8" multiplier appearance
  const multiplierScale = spring({
    frame: frame - 145,
    fps,
    config: { damping: 8, mass: 0.4 },
  });

  // Screen shake during counter
  const shakeActive = frame >= 90 && frame <= 145;
  const shakeX = shakeActive ? Math.sin(frame * 5) * 3 : 0;
  const shakeY = shakeActive ? Math.cos(frame * 4) * 2 : 0;

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        backgroundColor: RETRO_COLORS.bgDark,
      }}
    >
      <ParallaxBackground layers={BG_LAYERS} baseSpeed={0.3} />

      {/* Red alert flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: RETRO_COLORS.uiRed,
          opacity: alertFlash,
          zIndex: 5,
        }}
      />

      {/* ALERTE text */}
      {frame < 50 && frame > 5 && (
        <div
          style={{
            position: "absolute",
            top: "30%",
            width: "100%",
            textAlign: "center",
            fontFamily,
            fontSize: 48,
            color: RETRO_COLORS.uiRed,
            textShadow: `0 0 20px ${RETRO_COLORS.uiRed}`,
            opacity: interpolate(frame, [5, 15, 40, 50], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            letterSpacing: 12,
            zIndex: 10,
          }}
        >
          ! ALERTE !
        </div>
      )}

      {/* Main question */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          width: "100%",
          textAlign: "center",
          fontFamily,
          zIndex: 10,
          transform: `scale(${questionScale})`,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: RETRO_COLORS.uiYellow,
            textShadow: `0 0 10px ${RETRO_COLORS.uiYellow}`,
            lineHeight: 2.2,
            padding: "0 100px",
          }}
        >
          TON CREDIT IMMOBILIER
        </div>
        <div
          style={{
            fontSize: 16,
            color: RETRO_COLORS.textSecondary,
            marginTop: 10,
          }}
        >
          te coute presque le DOUBLE
        </div>
      </div>

      {/* Counter display */}
      {counterActive && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            width: "100%",
            textAlign: "center",
            fontFamily,
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 56,
              color:
                counterValue > 500000
                  ? RETRO_COLORS.uiRed
                  : RETRO_COLORS.uiGreen,
              textShadow: `0 0 20px ${counterValue > 500000 ? RETRO_COLORS.uiRed : RETRO_COLORS.uiGreen}`,
              letterSpacing: 4,
            }}
          >
            {counterValue.toLocaleString("fr-FR")} EUR
          </div>

          {/* Progress bar underneath */}
          <div
            style={{
              margin: "20px auto",
              width: 500,
              height: 20,
              backgroundColor: RETRO_COLORS.bgMedium,
              border: `2px solid ${RETRO_COLORS.uiGreen}`,
            }}
          >
            <div
              style={{
                width: `${interpolate(counterValue, [340000, 612000], [55, 100], { extrapolateRight: "clamp" })}%`,
                height: "100%",
                backgroundColor:
                  counterValue > 500000
                    ? RETRO_COLORS.uiRed
                    : RETRO_COLORS.uiGreen,
                transition: "background-color 0.2s",
                boxShadow: `0 0 8px ${counterValue > 500000 ? RETRO_COLORS.uiRed : RETRO_COLORS.uiGreen}`,
              }}
            />
          </div>
        </div>
      )}

      {/* x1.8 multiplier */}
      {frame >= 145 && (
        <div
          style={{
            position: "absolute",
            top: "72%",
            width: "100%",
            textAlign: "center",
            fontFamily,
            fontSize: 36,
            color: RETRO_COLORS.uiRed,
            textShadow: `0 0 25px ${RETRO_COLORS.uiRed}`,
            transform: `scale(${multiplierScale})`,
            zIndex: 10,
          }}
        >
          x 1.8
        </div>
      )}
    </div>
  );
};
