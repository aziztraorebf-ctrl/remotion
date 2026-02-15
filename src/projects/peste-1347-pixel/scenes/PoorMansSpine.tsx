import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  staticFile,
  useVideoConfig,
} from "remotion";

const BACKGROUND = staticFile(
  "assets/peste-pixel/backgrounds/style-B-stylise.png"
);

// Character layers - pre-cut from fal.ai generated illustration
const LAYER_HEAD = staticFile(
  "assets/peste-pixel/characters/spine-doctor/head.png"
);
const LAYER_TORSO = staticFile(
  "assets/peste-pixel/characters/spine-doctor/torso.png"
);
const LAYER_LEFT_ARM = staticFile(
  "assets/peste-pixel/characters/spine-doctor/left_arm.png"
);
const LAYER_RIGHT_ARM = staticFile(
  "assets/peste-pixel/characters/spine-doctor/right_arm.png"
);
const LAYER_LOWER = staticFile(
  "assets/peste-pixel/characters/spine-doctor/lower.png"
);

// Original character image: 768x1024
// Display scale to fit nicely in 1080p frame
const CHAR_SCALE = 0.65;
const CHAR_W = 768 * CHAR_SCALE; // ~499px
const CHAR_H = 1024 * CHAR_SCALE; // ~666px

// Character position on screen (centered, bottom-aligned)
const CHAR_LEFT = 1920 / 2 - CHAR_W / 2 + 50; // slightly right of center
const CHAR_TOP = 1080 - CHAR_H - 20; // near bottom

// Animation layer: renders a character part with independent transform
const AnimLayer: React.FC<{
  src: string;
  rotation: number;
  translateX: number;
  translateY: number;
  originX: string;
  originY: string;
  zIndex: number;
}> = ({ src, rotation, translateX, translateY, originX, originY, zIndex }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: CHAR_LEFT,
        top: CHAR_TOP,
        width: CHAR_W,
        height: CHAR_H,
        transformOrigin: `${originX} ${originY}`,
        transform: `rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`,
        zIndex,
        pointerEvents: "none",
      }}
    >
      <Img
        src={src}
        style={{
          width: CHAR_W,
          height: CHAR_H,
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export const PoorMansSpine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === BACKGROUND ANIMATION ===
  const bgScale = interpolate(frame, [0, 150], [1.0, 1.06], {
    extrapolateRight: "clamp",
  });
  const bgX = interpolate(frame, [0, 150], [0, -15], {
    extrapolateRight: "clamp",
  });

  // === CHARACTER LAYER ANIMATIONS ===
  // All animations are subtle - the goal is "alive", not "dancing"

  // Breathing cycle (~3 second period)
  const breathPhase = (frame / fps) * Math.PI * 2 * 0.33;

  // Head: gentle nod + slight turn
  const headRotation = Math.sin(breathPhase * 0.7) * 1.2;
  const headY = Math.sin(breathPhase) * -2;

  // Torso: breathing (subtle vertical scale simulated via translateY)
  const torsoY = Math.sin(breathPhase) * 1.5;

  // Left arm: slight pendulum sway (hanging arm)
  const leftArmRotation = Math.sin(breathPhase * 0.5 + 0.5) * 1.5;
  const leftArmY = Math.sin(breathPhase) * 1;

  // Right arm + staff: very slight movement (holding staff = more stable)
  const rightArmRotation = Math.sin(breathPhase * 0.4) * 0.8;

  // Lower body: almost static, tiny sway
  const lowerY = Math.sin(breathPhase) * 0.5;

  // === LANTERN GLOW ===
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.25, 0.55]
  );

  // === DATA OVERLAY ===
  const dataOpacity = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const deathCount = Math.floor(
    interpolate(frame, [30, 120], [0, 24867], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // === SILHOUETTES ===
  const silhouetteOpacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sway1 = Math.sin(frame * 0.03) * 2;
  const sway2 = Math.sin(frame * 0.04 + 1) * 1.5;
  const sway3 = Math.sin(frame * 0.025 + 2) * 2.5;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a12" }}>
      {/* LAYER 1: Background with Ken Burns */}
      <AbsoluteFill
        style={{
          transform: `scale(${bgScale}) translateX(${bgX}px)`,
        }}
      >
        <Img
          src={BACKGROUND}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </AbsoluteFill>

      {/* LAYER 1.5: Color grading */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(20,10,5,0.2) 0%, rgba(10,5,2,0.4) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* LAYER 1.6: Lantern glow (matching character's left side) */}
      <div
        style={{
          position: "absolute",
          left: CHAR_LEFT - 50,
          top: CHAR_TOP + 80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,180,60,${glowIntensity}) 0%, rgba(255,140,20,${glowIntensity * 0.3}) 40%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* LAYER 2A: Background silhouettes */}
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <defs>
          <filter id="silBlur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
        <SilhouetteGroup
          opacity={silhouetteOpacity}
          sway1={sway1}
          sway2={sway2}
          sway3={sway3}
        />
      </svg>

      {/* LAYER 2B: Animated character (Poor Man's Spine) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
        {/* Lower body first (behind everything) */}
        <AnimLayer
          src={LAYER_LOWER}
          rotation={0}
          translateX={0}
          translateY={lowerY}
          originX="50%"
          originY="100%"
          zIndex={1}
        />
        {/* Left arm (hanging arm - behind torso) */}
        <AnimLayer
          src={LAYER_LEFT_ARM}
          rotation={leftArmRotation}
          translateX={0}
          translateY={leftArmY}
          originX="80%"
          originY="5%"
          zIndex={2}
        />
        {/* Torso (center layer) */}
        <AnimLayer
          src={LAYER_TORSO}
          rotation={0}
          translateX={0}
          translateY={torsoY}
          originX="50%"
          originY="80%"
          zIndex={3}
        />
        {/* Right arm with staff (in front) */}
        <AnimLayer
          src={LAYER_RIGHT_ARM}
          rotation={rightArmRotation}
          translateX={0}
          translateY={0}
          originX="20%"
          originY="5%"
          zIndex={4}
        />
        {/* Head on top */}
        <AnimLayer
          src={LAYER_HEAD}
          rotation={headRotation}
          translateX={0}
          translateY={headY}
          originX="50%"
          originY="90%"
          zIndex={5}
        />
      </div>

      {/* LAYER 2.5: Ground fog */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          background:
            "linear-gradient(0deg, rgba(12,15,25,0.75) 0%, rgba(12,15,25,0.3) 50%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 15,
        }}
      />

      {/* LAYER 3: Death counter */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 60,
          opacity: dataOpacity,
          zIndex: 20,
        }}
      >
        <div
          style={{
            background: "rgba(25,20,15,0.88)",
            border: "2px solid rgba(100,80,50,0.5)",
            padding: "14px 24px",
          }}
        >
          <div
            style={{
              color: "rgba(160,140,100,0.6)",
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontFamily: "monospace",
              marginBottom: 4,
            }}
          >
            Morts recenses
          </div>
          <div
            style={{
              color: "#c4392f",
              fontSize: 40,
              fontWeight: "bold",
              fontFamily: "monospace",
              letterSpacing: 2,
            }}
          >
            {deathCount.toLocaleString("fr-FR")}
          </div>
          <div
            style={{
              color: "rgba(140,120,80,0.4)",
              fontSize: 11,
              fontFamily: "monospace",
              marginTop: 4,
            }}
          >
            Marseille, 1347
          </div>
        </div>
      </div>

      {/* LAYER 3.5: Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: "50%",
          transform: "translateX(-50%)",
          opacity: dataOpacity,
          zIndex: 20,
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.65)",
            padding: "10px 28px",
            color: "rgba(220,210,190,0.9)",
            fontSize: 24,
            fontFamily: "Georgia, serif",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          {"Les rats ne tuent pas... c'est la PEUR qui tue en premier."}
        </div>
      </div>

      {/* LAYER 4: Post-process effects */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
          zIndex: 30,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' seed='${frame}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
          pointerEvents: "none",
          zIndex: 31,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.03,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
          pointerEvents: "none",
          zIndex: 32,
        }}
      />
    </AbsoluteFill>
  );
};

// Background silhouette group (same as HD2DMockup)
const SilhouetteGroup: React.FC<{
  opacity: number;
  sway1: number;
  sway2: number;
  sway3: number;
}> = ({ opacity, sway1, sway2, sway3 }) => {
  const paths: Record<string, string> = {
    standing:
      "M24,0 C28,0 32,4 32,10 C32,14 30,17 27,18 L30,35 C31,38 30,42 28,44 L28,58 L32,70 L28,72 L24,60 L20,72 L16,70 L20,58 L20,44 C18,42 17,38 18,35 L21,18 C18,17 16,14 16,10 C16,4 20,0 24,0 Z",
    hunched:
      "M20,4 C24,2 28,4 30,8 C32,12 30,16 28,18 L32,32 C34,36 32,40 28,42 L26,56 L30,68 L26,70 L22,58 L18,70 L14,68 L18,56 L16,42 C12,40 10,36 12,32 L16,18 C14,14 14,10 16,6 C17,4 18,4 20,4 Z",
    hooded:
      "M24,0 C30,0 34,6 34,12 C34,16 32,18 30,20 L28,22 C28,22 32,24 32,28 L34,38 C35,42 33,46 30,48 L28,60 L32,72 L28,74 L24,62 L20,74 L16,72 L20,60 L18,48 C15,46 13,42 14,38 L16,28 C16,24 20,22 20,22 L18,20 C16,18 14,16 14,12 C14,6 18,0 24,0 Z",
  };

  const figures: {
    x: number;
    y: number;
    scale: number;
    opMul: number;
    variant: string;
    flip?: boolean;
    sway: number;
  }[] = [
    { x: 200, y: 600, scale: 5, opMul: 0.5, variant: "hunched", sway: sway2 },
    { x: 280, y: 610, scale: 4.5, opMul: 0.45, variant: "hooded", flip: true, sway: sway1 },
    { x: 1400, y: 590, scale: 5.5, opMul: 0.4, variant: "hunched", flip: true, sway: sway3 },
    { x: 1480, y: 605, scale: 4.8, opMul: 0.35, variant: "standing", sway: sway1 },
    { x: 750, y: 520, scale: 3.5, opMul: 0.3, variant: "hooded", sway: sway1 },
    { x: 820, y: 525, scale: 3.2, opMul: 0.25, variant: "hunched", flip: true, sway: sway2 },
  ];

  return (
    <>
      {figures.map((f, i) => (
        <g
          key={i}
          transform={`translate(${f.x + f.sway}, ${f.y}) scale(${f.flip ? -f.scale : f.scale}, ${f.scale})`}
          opacity={opacity * f.opMul}
        >
          <path
            d={paths[f.variant]}
            fill="rgba(5,5,10,0.85)"
            filter="url(#silBlur)"
          />
        </g>
      ))}
    </>
  );
};
