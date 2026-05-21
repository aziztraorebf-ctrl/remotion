import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";
import {
  NARRATION_CTA_PATH,
  CTA_DURATION_FRAMES,
  CTA_AUDIO_S,
  FPS as PROJECT_FPS,
} from "./timing";
import { CTA, PALETTE, PROGRESS_BAR } from "./manifest";

const CTA_FRAMES = CTA_DURATION_FRAMES; // 120

function ProgressBar({ frame }: { frame: number }) {
  const totalProjectFrames = 2985;
  const localProgress = frame / CTA_FRAMES;
  const globalStart = 2865 / totalProjectFrames;
  const widthPct = (globalStart + localProgress * (1 - globalStart)) * 100;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: PROGRESS_BAR.y,
        width: `${widthPct}%`,
        height: PROGRESS_BAR.height,
        backgroundColor: PROGRESS_BAR.color,
        opacity: PROGRESS_BAR.opacity,
      }}
    />
  );
}

function GoldRule({ frame }: { frame: number }) {
  const drawProgress = interpolate(frame, [10, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 700,
        transform: `translateX(-50%) scaleX(${drawProgress})`,
        transformOrigin: "left center",
        width: 380,
        height: 1.5,
        background: `linear-gradient(90deg, transparent 0%, ${PALETTE.or} 50%, transparent 100%)`,
        opacity: 0.75,
      }}
    />
  );
}

function ScintillementFinal({ frame }: { frame: number }) {
  const sStart = CTA_FRAMES - 26;
  if (frame < sStart) return null;
  const phase = (frame - sStart) / 26;
  const intensity = Math.sin(phase * Math.PI) * 0.26;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 56%, rgba(245,213,71,${intensity}) 0%, transparent 60%)`,
        pointerEvents: "none",
      }}
    />
  );
}

export const OrAfricainCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clampedRel = Math.max(0, Math.min(frame, CTA_FRAMES - 1));

  // Ligne 1 : 72px Garamond — match Beat 5 standard
  const line1Opacity = interpolate(clampedRel, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line1Spring = spring({ fps, frame: clampedRel, config: { damping: 200 } });
  const line1LetterSpacing = interpolate(clampedRel, [0, 24], [8, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ligne 2 : 96px or — climax
  const line2Start = 40; // ~1.33s
  const line2RelFrame = clampedRel - line2Start;
  const line2Opacity = interpolate(line2RelFrame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line2Spring = spring({
    fps,
    frame: Math.max(0, line2RelFrame),
    config: { damping: 170, stiffness: 100 },
  });
  const line2LetterSpacing = interpolate(line2RelFrame, [0, 22], [12, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tiret pulse 5 frames before line 2
  const dashPulse = interpolate(clampedRel, [line2Start - 6, line2Start], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.fond }}>
      {/* Continuite parchemin avec Beat 5 */}
      <Img
        src={staticFile("/souverain/or-africain/backgrounds/beat1-bg-v4-parchemin-modern.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 1,
        }}
      />

      {/* Vignette douce */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
          pointerEvents: "none",
        }}
      />

      <GoldRule frame={clampedRel} />

      {/* Ligne 1 — typo dominante 72px */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 800,
          textAlign: "center",
          opacity: line1Opacity,
          transform: `translateY(${(1 - line1Spring) * 14}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Garamond, Georgia, 'Times New Roman', serif",
            fontSize: 72,
            color: PALETTE.blanc,
            fontWeight: 400,
            lineHeight: 1.3,
            letterSpacing: `${line1LetterSpacing}px`,
            textShadow:
              "0 0 22px rgba(245,213,71,0.15), 2px 3px 6px rgba(0,0,0,0.8)",
          }}
        >
          Si la vidéo t'a plu —
          <br />
          like, commente,
          <br />
          abonne-toi.
        </div>
      </div>

      {/* Ligne 2 — abonne-toi 96px or italique gras */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 1240,
          textAlign: "center",
          opacity: line2Opacity,
          transform: `translateY(${(1 - line2Spring) * 16}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Garamond, Georgia, 'Times New Roman', serif",
            fontSize: 96,
            color: PALETTE.or,
            fontWeight: 700,
            fontStyle: "italic",
            letterSpacing: `${line2LetterSpacing}px`,
            textShadow:
              "0 0 28px rgba(245,213,71,0.55), 0 0 60px rgba(245,213,71,0.28), 0 2px 6px rgba(0,0,0,0.85)",
          }}
        >
          Le lien de la newsletter
          <br />
          est en description.
        </div>
      </div>

      <ScintillementFinal frame={clampedRel} />
      <ProgressBar frame={clampedRel} />

      <Audio
        src={staticFile(NARRATION_CTA_PATH)}
        endAt={Math.round(CTA_AUDIO_S * PROJECT_FPS)}
      />
    </AbsoluteFill>
  );
};

export const OR_AFRICAIN_CTA_FRAMES = CTA_FRAMES;
