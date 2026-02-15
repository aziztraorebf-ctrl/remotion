import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  Img,
  Audio,
} from "remotion";
import { loadFont as loadPressStart2P } from "@remotion/google-fonts/PressStart2P";
import { GridSpritesheetAnimator } from "../components/GridSpritesheetAnimator";
import { AnimatedFire } from "../components/AnimatedFire";

const { fontFamily: pressStart } = loadPressStart2P();

// ============================================================
// PIXEL WORLD DEMO - 8 seconds @ 30fps = 240 frames
// Shows what Remotion ACTUALLY produces:
//   Layer 0: AI-generated background (Nano Banana Pro)
//   Layer 1: Parallax scrolling ground tiles
//   Layer 2: Animated sprites (plague doctor walking, peasants, rats)
//   Layer 3: Animated fire FX
//   Layer 4: Game HUD overlay (hearts, skull counter, level text)
//   Layer 5: CRT/scanline post-process
// ============================================================

const DEMO_FPS = 30;
const DEMO_DURATION = 240; // 8 seconds

// -- Sprite configs --
// Plague doctor: 480x192, 10 cols x 4 rows, 48x48 per frame
// Row 0 = idle (10 frames), Row 1 = walk (10 frames)
const DOCTOR = {
  src: "assets/peste-pixel/sprites/plague-doctor/plague-doctor.png",
  cols: 10,
  rows: 4,
  frameW: 48,
  frameH: 48,
  walkRow: 1,
  idleRow: 0,
  scale: 4, // 48*4 = 192px display
};

// Peasants: 512x384, variable cols per row
// Rows 5-6 seem to have walking animations
const PEASANT = {
  src: "assets/peste-pixel/sprites/peasants/peasants.png",
  cols: 8, // safe estimate
  rows: 8, // 384/48 = 8
  frameW: 64, // 512/8 = 64
  frameH: 48, // 384/8 = 48
  idleRow: 0,
  walkRow: 5,
  scale: 3,
};

// Rats: 160x256, 5 cols x 8 rows, 32x32
const RAT = {
  src: "assets/peste-pixel/sprites/rats/rats.png",
  cols: 5,
  rows: 8,
  frameW: 32,
  frameH: 32,
  runRow: 0,
  scale: 2.5, // 32*2.5 = 80px
};

// Skeleton warrior idle: 896x128, 7 frames horizontal, 128x128
const SKELETON = {
  src: "assets/peste-pixel/sprites/skeletons/warrior/Idle.png",
  cols: 7,
  rows: 1,
  frameW: 128,
  frameH: 128,
  scale: 1.5, // 128*1.5 = 192px
};

// ============================================================
// HUD Component - Game overlay
// ============================================================
const GameHUD: React.FC<{ frame: number }> = ({ frame }) => {
  const hudOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Skull counter animates up
  const skullCount = Math.floor(
    interpolate(frame, [30, 200], [42, 47], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // Hearts - lose one at frame 150
  const hearts = frame < 150 ? [true, true, true, true] : [true, true, true, false];

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background: "rgba(0, 0, 0, 0.75)",
        borderBottom: "2px solid #555",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        opacity: hudOpacity,
        zIndex: 50,
        imageRendering: "pixelated",
      }}
    >
      {/* Hearts */}
      <div style={{ display: "flex", gap: 6 }}>
        {hearts.map((full, i) => (
          <div
            key={i}
            style={{
              width: 28,
              height: 26,
              fontSize: 22,
              color: full ? "#E63946" : "#444",
              fontFamily: pressStart,
              lineHeight: "26px",
              textShadow: full ? "0 0 4px #E63946" : "none",
            }}
          >
            {full ? "\u2665" : "\u2661"}
          </div>
        ))}
      </div>

      {/* Level text */}
      <div
        style={{
          fontFamily: pressStart,
          fontSize: 14,
          color: "#E8D5B5",
          textShadow: "2px 2px 0 #000",
          letterSpacing: 2,
        }}
      >
        LEVEL 3 - LA PESTE
      </div>

      {/* Skull counter */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: pressStart,
          fontSize: 14,
          color: "#E8D5B5",
          textShadow: "2px 2px 0 #000",
        }}
      >
        <span style={{ fontSize: 20 }}>{"\u2620"}</span>
        x{skullCount}
      </div>
    </div>
  );
};

// ============================================================
// Scanline CRT overlay
// ============================================================
const ScanlineOverlay: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 60,
      pointerEvents: "none",
      background:
        "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)",
      mixBlendMode: "multiply",
    }}
  />
);

// ============================================================
// Vignette overlay
// ============================================================
const Vignette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 55,
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
    }}
  />
);

// ============================================================
// Ground layer - scrolling cobblestone tiles
// ============================================================
const ScrollingGround: React.FC<{ frame: number }> = ({ frame }) => {
  // Slow parallax scroll
  const scrollX = -(frame * 1.2) % 192;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "200%",
        height: 180,
        zIndex: 5,
        imageRendering: "pixelated",
        overflow: "hidden",
      }}
    >
      {/* Cobblestone pattern using CSS */}
      <div
        style={{
          width: "200%",
          height: "100%",
          transform: `translateX(${scrollX}px)`,
          background: `
            repeating-linear-gradient(
              90deg,
              #4A3728 0px, #4A3728 30px,
              #3D2E1F 30px, #3D2E1F 32px,
              #5A4738 32px, #5A4738 62px,
              #3D2E1F 62px, #3D2E1F 64px
            )
          `,
        }}
      />
      {/* Top edge - darker stones */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "200%",
          height: 8,
          transform: `translateX(${scrollX}px)`,
          background: `repeating-linear-gradient(90deg, #2A1F14 0px, #2A1F14 14px, #3D2E1F 14px, #3D2E1F 16px)`,
        }}
      />
    </div>
  );
};

// ============================================================
// Walking plague doctor with position animation
// ============================================================
const WalkingDoctor: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Doctor walks from left to center-left
  const x = interpolate(frame, [20, 200], [-200, 350], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Small bob while walking
  const bob = Math.sin(frame * 0.3) * 3;

  const entryOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const displaySize = DOCTOR.frameW * DOCTOR.scale;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: 180 + bob,
        opacity: entryOpacity,
        zIndex: 20,
      }}
    >
      <GridSpritesheetAnimator
        src={DOCTOR.src}
        cols={DOCTOR.cols}
        rows={DOCTOR.rows}
        frameWidth={DOCTOR.frameW}
        frameHeight={DOCTOR.frameH}
        displayWidth={displaySize}
        displayHeight={displaySize}
        startRow={DOCTOR.walkRow}
        frameCount={DOCTOR.cols}
        frameRate={5}
        loop
      />
    </div>
  );
};

// ============================================================
// Idle peasant NPC
// ============================================================
const IdlePeasant: React.FC<{
  x: number;
  frame: number;
  flipX?: boolean;
  delay?: number;
}> = ({ x, frame, flipX = false, delay = 0 }) => {
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle idle bob
  const bob = Math.sin((frame + delay * 7) * 0.15) * 2;

  const displayW = PEASANT.frameW * PEASANT.scale;
  const displayH = PEASANT.frameH * PEASANT.scale;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: 178 + bob,
        opacity,
        zIndex: 18,
      }}
    >
      <GridSpritesheetAnimator
        src={PEASANT.src}
        cols={PEASANT.cols}
        rows={PEASANT.rows}
        frameWidth={PEASANT.frameW}
        frameHeight={PEASANT.frameH}
        displayWidth={displayW}
        displayHeight={displayH}
        startRow={PEASANT.idleRow}
        frameCount={4}
        frameRate={8}
        flipX={flipX}
        loop
      />
    </div>
  );
};

// ============================================================
// Rat running across screen
// ============================================================
const RunningRat: React.FC<{
  startX: number;
  y: number;
  speed: number;
  frame: number;
  delay: number;
  flipX?: boolean;
}> = ({ startX, y, speed, frame, delay, flipX = false }) => {
  const elapsed = Math.max(0, frame - delay);
  if (elapsed <= 0) return null;

  const x = flipX ? startX - elapsed * speed : startX + elapsed * speed;
  const displaySize = RAT.frameW * RAT.scale;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: y,
        zIndex: 12,
      }}
    >
      <GridSpritesheetAnimator
        src={RAT.src}
        cols={RAT.cols}
        rows={RAT.rows}
        frameWidth={RAT.frameW}
        frameHeight={RAT.frameH}
        displayWidth={displaySize}
        displayHeight={displaySize}
        startRow={RAT.runRow}
        frameCount={RAT.cols}
        frameRate={3}
        flipX={flipX}
        loop
      />
    </div>
  );
};

// ============================================================
// Idle skeleton guard
// ============================================================
const IdleSkeleton: React.FC<{ x: number; frame: number }> = ({ x, frame }) => {
  const opacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const displayW = SKELETON.frameW * SKELETON.scale;
  const displayH = SKELETON.frameH * SKELETON.scale;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        bottom: 165,
        opacity,
        zIndex: 15,
      }}
    >
      <GridSpritesheetAnimator
        src={SKELETON.src}
        cols={SKELETON.cols}
        rows={SKELETON.rows}
        frameWidth={SKELETON.frameW}
        frameHeight={SKELETON.frameH}
        displayWidth={displayW}
        displayHeight={displayH}
        startRow={0}
        frameCount={SKELETON.cols}
        frameRate={7}
        loop
      />
    </div>
  );
};

// ============================================================
// Floating text popup (damage numbers / events)
// ============================================================
const FloatingText: React.FC<{
  text: string;
  x: number;
  y: number;
  frame: number;
  triggerFrame: number;
  color?: string;
}> = ({ text, x, y, frame, triggerFrame, color = "#E63946" }) => {
  const elapsed = frame - triggerFrame;
  if (elapsed < 0 || elapsed > 60) return null;

  const floatY = interpolate(elapsed, [0, 60], [0, -80], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(elapsed, [0, 10, 45, 60], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + floatY,
        fontFamily: pressStart,
        fontSize: 16,
        color,
        textShadow: "2px 2px 0 #000, -1px -1px 0 #000",
        opacity,
        zIndex: 40,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

// ============================================================
// MAIN COMPOSITION
// ============================================================
export const PixelWorldDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background: use the AI-generated image
  const bgPath = "assets/peste-pixel/backgrounds/recraft-street-night.png";

  // Fog overlay animation
  const fogX = -(frame * 0.5) % 1920;

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0A0808",
        imageRendering: "auto",
      }}
    >
      {/* LAYER 0: AI Background */}
      <Img
        src={staticFile(bgPath)}
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          objectFit: "cover",
          filter: "brightness(0.7) saturate(0.8)",
          zIndex: 1,
        }}
      />

      {/* LAYER 0.5: Fog overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          opacity: 0.15,
          background: `radial-gradient(ellipse at ${50 + fogX * 0.01}% 60%, rgba(120, 140, 50, 0.4) 0%, transparent 60%)`,
        }}
      />

      {/* LAYER 1: Ground tiles */}
      <ScrollingGround frame={frame} />

      {/* LAYER 2: Animated sprites */}

      {/* Plague Doctor - walks from left */}
      <WalkingDoctor frame={frame} fps={fps} />

      {/* Peasants - idle NPCs */}
      <IdlePeasant x={800} frame={frame} delay={10} />
      <IdlePeasant x={1100} frame={frame} flipX delay={30} />
      <IdlePeasant x={1450} frame={frame} delay={50} />

      {/* Skeleton warrior - guarding right side */}
      <IdleSkeleton x={1650} frame={frame} />

      {/* Rats - scurrying across */}
      <RunningRat startX={-80} y={160} speed={3.5} frame={frame} delay={40} />
      <RunningRat startX={-120} y={140} speed={4.2} frame={frame} delay={55} />
      <RunningRat startX={-60} y={175} speed={3.0} frame={frame} delay={65} />
      <RunningRat
        startX={1920}
        y={155}
        speed={2.8}
        frame={frame}
        delay={90}
        flipX
      />

      {/* LAYER 3: Fire FX */}
      <AnimatedFire x={1750} y={650} startFrame={0} size="large" variant={1} />
      <AnimatedFire x={1680} y={680} startFrame={5} size="medium" variant={2} />
      <AnimatedFire x={600} y={750} startFrame={10} size="small" variant={3} />

      {/* LAYER 3.5: Floating text events */}
      <FloatingText text="-1347 HP" x={500} y={500} frame={frame} triggerFrame={100} />
      <FloatingText
        text="PLAGUE!"
        x={850}
        y={450}
        frame={frame}
        triggerFrame={150}
        color="#FFAA00"
      />

      {/* LAYER 4: Game HUD */}
      <GameHUD frame={frame} />

      {/* LAYER 5: Post-process */}
      <Vignette />
      <ScanlineOverlay />

      {/* Bottom info bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 40,
          background: "rgba(0, 0, 0, 0.8)",
          borderTop: "2px solid #555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          fontFamily: pressStart,
          fontSize: 10,
          color: "#888",
          letterSpacing: 1,
        }}
      >
        REMOTION ENGINE - PESTE 1347 - PIXEL WORLD DEMO
      </div>
    </div>
  );
};
