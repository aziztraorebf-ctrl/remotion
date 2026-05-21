import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import { FPS, SCENES } from "./timing-soundjata";

// ============================================================
// Soundjata - Acte VIII : Close (signature serie)
// Duree : 6.40s (192 frames @ 30fps)
// Format : 1080x1920 (vertical Short)
//
// Narration window (from narration-full.mp3):
//   enfantRampait  122.70s - 126.26s  "Un enfant qui rampait..."
//   close          126.56s - 129.10s  "Et pourtant, l'histoire..."
//
// Design:
//   Split vertical with spring-based reveal
//   Left: Soundjata enfant rampant (VIDEO from acte3-iron-bar-v1.mp4)
//   Right: Soundjata guerrier a cheval (VIDEO from acte4-clip2-lion-revient-v1.mp4)
//   Text overlay: "SOUNDJATA KEITA" + fade to black
// ============================================================

// Asset paths — VIDEO clips for movement
const CHILD_VIDEO =
  "assets/library/geoafrique/heros-oublies/soundjata/clips-validated/acte3-iron-bar-v1.mp4";
const WARRIOR_VIDEO =
  "assets/library/geoafrique/heros-oublies/soundjata/clips-validated/acte4-clip2-lion-revient-v1.mp4";
const NARRATION_FULL =
  "assets/library/geoafrique/heros-oublies/soundjata/audio/narration-full.mp3";

// Narration offsets (absolute in narration-full.mp3)
const NARRATION_START_S = 122.70;
const NARRATION_END_S = 129.10;

// Total duration from timing.ts scenes
export const SOUNDJATA_CLOSE_FRAMES =
  SCENES.close.end - SCENES.enfantRampait.start; // 192 frames

// Internal timings (frames relative to composition start)
const TEXT_APPEAR_FRAME = Math.round(3.5 * FPS); // 105
const FADE_TO_BLACK_START = SOUNDJATA_CLOSE_FRAMES - Math.round(1.2 * FPS); // last 1.2s

export const SoundjataClose: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Spring for split reveal — left half slides in from left, right from right
  const splitProgress = spring({
    frame,
    fps,
    config: { damping: 80, stiffness: 100, mass: 0.8 },
    durationInFrames: Math.round(2.0 * fps),
  });

  // Left half: child slides in from left
  const leftX = interpolate(splitProgress, [0, 1], [-width / 2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Right half: warrior slides in from right
  const rightX = interpolate(splitProgress, [0, 1], [width / 2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text overlay spring
  const textProgress = spring({
    frame: Math.max(0, frame - TEXT_APPEAR_FRAME),
    fps,
    config: { damping: 60, stiffness: 120 },
    durationInFrames: Math.round(1.5 * fps),
  });

  const textOpacity = interpolate(textProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textY = interpolate(textProgress, [0, 1], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade to black at the end
  const fadeOpacity = interpolate(
    frame,
    [FADE_TO_BLACK_START, SOUNDJATA_CLOSE_FRAMES],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Vertical divider line opacity (appears with split reveal)
  const dividerOpacity = interpolate(splitProgress, [0.5, 1], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const halfWidth = width / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* LEFT HALF — Soundjata enfant rampant (video) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: halfWidth,
          height,
          overflow: "hidden",
          transform: `translateX(${leftX}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile(CHILD_VIDEO)}
          muted
          style={{
            width: halfWidth * 2,
            height,
            objectFit: "cover",
            objectPosition: "center center",
            marginLeft: -halfWidth / 2,
            filter: "sepia(0.15) brightness(0.85)",
          }}
        />
      </div>

      {/* RIGHT HALF — Soundjata guerrier a cheval (video) */}
      <div
        style={{
          position: "absolute",
          left: halfWidth,
          top: 0,
          width: halfWidth,
          height,
          overflow: "hidden",
          transform: `translateX(${rightX}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile(WARRIOR_VIDEO)}
          muted
          style={{
            width: halfWidth * 2,
            height,
            objectFit: "cover",
            objectPosition: "center center",
            marginLeft: -halfWidth / 2,
            filter: "brightness(1.05) saturate(1.1)",
          }}
        />
      </div>

      {/* VERTICAL DIVIDER LINE */}
      <div
        style={{
          position: "absolute",
          left: halfWidth - 1,
          top: 0,
          width: 2,
          height,
          backgroundColor: `rgba(255, 215, 140, ${dividerOpacity})`,
          boxShadow: `0 0 12px rgba(255, 215, 140, ${dividerOpacity * 0.5})`,
        }}
      />

      {/* TEXT OVERLAY */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontFamily: "Georgia, serif",
            fontWeight: "bold",
            color: "#FFD78C",
            textShadow: "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)",
            letterSpacing: 8,
            textTransform: "uppercase",
          }}
        >
          Soundjata
        </div>
        <div
          style={{
            fontSize: 36,
            fontFamily: "Georgia, serif",
            color: "#FFD78C",
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            letterSpacing: 12,
            marginTop: 8,
            textTransform: "uppercase",
          }}
        >
          Keita
        </div>
      </div>

      {/* FADE TO BLACK */}
      <AbsoluteFill
        style={{
          backgroundColor: `rgba(0, 0, 0, ${fadeOpacity})`,
        }}
      />

      {/* NARRATION — slice from master audio */}
      <Sequence
        from={0}
        durationInFrames={SOUNDJATA_CLOSE_FRAMES}
        premountFor={1 * FPS}
      >
        <Audio
          src={staticFile(NARRATION_FULL)}
          startFrom={Math.round(NARRATION_START_S * FPS)}
          endAt={Math.round(NARRATION_END_S * FPS)}
          volume={1.0}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
