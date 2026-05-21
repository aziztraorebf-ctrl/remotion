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
  AUDIO_SEGMENTS,
  NARRATION_BEAT5_V2_PATH,
  MUSIC_PATH,
  BEAT5_V2_DURATION_FRAMES,
  BEAT5_V2_AUDIO_S,
  FPS as PROJECT_FPS,
} from "./timing";
import { BEAT5, PALETTE, PROGRESS_BAR } from "./manifest";

const BEAT_DURATION = BEAT5_V2_DURATION_FRAMES; // 301

const PHASE1_IN = AUDIO_SEGMENTS.afrique_change.startFrame; // ~4
const PHASE1_OUT = AUDIO_SEGMENTS.discretement.startFrame - 12; // ~143
const PHASE2_IN = AUDIO_SEGMENTS.discretement.startFrame; // ~155
const PHASE2_OUT = AUDIO_SEGMENTS.parle.startFrame - 10; // ~216
const PHASE3_IN = AUDIO_SEGMENTS.parle.startFrame; // ~226

function ProgressBar({ frame }: { frame: number }) {
  const totalProjectFrames = 2985;
  const localProgress = frame / BEAT_DURATION;
  const globalStart = 2564 / totalProjectFrames;
  const globalEnd = 2865 / totalProjectFrames;
  const widthPct = (globalStart + localProgress * (globalEnd - globalStart)) * 100;
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

function phaseOpacity(frame: number, inFrame: number, outFrame: number, fadeFrames = 14) {
  const fadeIn = interpolate(frame, [inFrame, inFrame + fadeFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [outFrame, outFrame + fadeFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return fadeIn * fadeOut;
}

// Filigrane Afrique : visible uniquement pendant la Phase 3 ("Sans que personne n'en parle.")
// Apparait en fade-in 24 frames AVANT phase 3 pour pre-evoquer, persiste jusqu'a la fin du beat.
function AfriqueFiligrane({ frame }: { frame: number }) {
  const filigraneStart = PHASE3_IN - 24; // pre-fade in
  const fadeIn = interpolate(frame, [filigraneStart, PHASE3_IN + 6], [0, 0.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [BEAT_DURATION - 24, BEAT_DURATION - 1], [1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;
  if (opacity <= 0) return null;

  // Pulse doux : un seul cycle sur la duree de la phase 3
  const pulsePhase = (frame - PHASE3_IN) / (BEAT_DURATION - PHASE3_IN);
  const pulseScale = 1 + 0.015 * Math.sin(pulsePhase * Math.PI);

  return (
    <Img
      src={staticFile("/souverain/or-africain/backgrounds/afrique-filigrane-v1.png")}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity,
        mixBlendMode: "screen",
        transform: `scale(${pulseScale})`,
        transformOrigin: "center center",
      }}
    />
  );
}

function Phase1Afrique({ frame, fps }: { frame: number; fps: number }) {
  const opacity = phaseOpacity(frame, PHASE1_IN, PHASE1_OUT, 14);
  if (opacity <= 0) return null;

  const localFrame = frame - PHASE1_IN;
  const appear = spring({ fps, frame: localFrame, config: { damping: 200, stiffness: 80 } });
  const letterSpacing = interpolate(localFrame, [0, 18], [8, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `translateY(${(1 - appear) * 14}px)`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Garamond, Georgia, 'Times New Roman', serif",
          fontSize: 78,
          color: PALETTE.blanc,
          fontWeight: 400,
          lineHeight: 1.25,
          letterSpacing: `${letterSpacing}px`,
          textShadow:
            "0 0 24px rgba(245,213,71,0.18), 2px 3px 6px rgba(0,0,0,0.85), -1px -1px 1px rgba(255,255,255,0.06)",
        }}
      >
        L'Afrique commence
        <br />
        à changer les règles
      </div>
      <div
        style={{
          marginTop: 28,
          fontFamily: "Garamond, Georgia, 'Times New Roman', serif",
          fontSize: 64,
          color: PALETTE.blanc,
          fontStyle: "italic",
          fontWeight: 400,
          lineHeight: 1.25,
          letterSpacing: `${letterSpacing * 0.6}px`,
          textShadow:
            "0 0 24px rgba(245,213,71,0.18), 2px 3px 6px rgba(0,0,0,0.85)",
        }}
      >
        de son propre sous-sol.
      </div>
    </div>
  );
}

function Phase2Discretement({ frame, fps }: { frame: number; fps: number }) {
  const opacity = phaseOpacity(frame, PHASE2_IN, PHASE2_OUT, 12);
  if (opacity <= 0) return null;

  const localFrame = frame - PHASE2_IN;
  const appear = spring({ fps, frame: localFrame, config: { damping: 160, stiffness: 110 } });
  const flashIntensity = interpolate(
    localFrame,
    [0, 4, 14],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const r = 255;
  const g = Math.round(255 - 208 * flashIntensity);
  const b = Math.round(255 - 208 * flashIntensity);
  const color = `rgb(${r},${g},${b})`;
  const flashScale = 1 + 0.06 * flashIntensity;
  const letterSpacing = interpolate(localFrame, [0, 16], [12, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `scale(${0.94 + 0.06 * appear}) scale(${flashScale})`,
      }}
    >
      <div
        style={{
          fontFamily: "Garamond, Georgia, 'Times New Roman', serif",
          fontSize: 132,
          color,
          fontWeight: 400,
          fontStyle: "italic",
          letterSpacing: `${letterSpacing}px`,
          textShadow:
            flashIntensity > 0.1
              ? `0 0 ${48 * flashIntensity}px rgba(211,47,47,${0.7 * flashIntensity}), 0 0 24px rgba(245,213,71,0.15), 3px 4px 8px rgba(0,0,0,0.85)`
              : "0 0 28px rgba(245,213,71,0.18), 3px 4px 8px rgba(0,0,0,0.85)",
        }}
      >
        Discrètement.
      </div>
    </div>
  );
}

// Phase 3 v3 : typo dominante (matche Phase 1) + fine ligne or qui se dessine en signature
function Phase3Parle({ frame, fps }: { frame: number; fps: number }) {
  const opacity = phaseOpacity(frame, PHASE3_IN, BEAT_DURATION - 18, 16);
  if (opacity <= 0) return null;

  const localFrame = frame - PHASE3_IN;
  const appear = spring({ fps, frame: localFrame, config: { damping: 200, stiffness: 75 } });
  const letterSpacing = interpolate(localFrame, [0, 22], [8, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fine ligne or qui se dessine sous le texte — apparait apres le texte (signature)
  const lineDraw = interpolate(localFrame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `translateY(${(1 - appear) * 12}px)`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "Garamond, Georgia, 'Times New Roman', serif",
          fontSize: 78,
          color: PALETTE.blanc,
          fontWeight: 400,
          fontStyle: "italic",
          lineHeight: 1.25,
          letterSpacing: `${letterSpacing}px`,
          textShadow:
            "0 0 24px rgba(245,213,71,0.18), 2px 3px 6px rgba(0,0,0,0.85), -1px -1px 1px rgba(255,255,255,0.06)",
        }}
      >
        Sans que personne
        <br />
        n'en parle.
      </div>

      {/* Fine ligne or signature */}
      <div
        style={{
          marginTop: 44,
          width: 320,
          height: 1.5,
          transform: `scaleX(${lineDraw})`,
          transformOrigin: "center",
          background: `linear-gradient(90deg, transparent 0%, ${PALETTE.or} 50%, transparent 100%)`,
          opacity: 0.7,
        }}
      />
    </div>
  );
}

export const Beat5Verdict: React.FC<{ globalMusic?: boolean }> = ({ globalMusic = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clampedRel = Math.max(0, Math.min(frame, BEAT_DURATION - 1));

  return (
    <AbsoluteFill style={{ backgroundColor: BEAT5.fond }}>
      {/* Parchment background — luminosity match Beat 1 */}
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

      {/* Africa filigree — only during Phase 3 */}
      <AfriqueFiligrane frame={clampedRel} />

      {/* Vignette tres legere */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.35) 100%)",
          pointerEvents: "none",
        }}
      />

      <Phase1Afrique frame={clampedRel} fps={fps} />
      <Phase2Discretement frame={clampedRel} fps={fps} />
      <Phase3Parle frame={clampedRel} fps={fps} />

      <ProgressBar frame={clampedRel} />

      <Audio
        src={staticFile(NARRATION_BEAT5_V2_PATH)}
        endAt={Math.round(BEAT5_V2_AUDIO_S * PROJECT_FPS)}
      />

      {/* Music fade-out — skipped when globalMusic is true (handled at Full level) */}
      {!globalMusic && (
        <Audio
          src={staticFile(MUSIC_PATH)}
          startFrom={Math.round(85.46 * PROJECT_FPS)}
          volume={(f) =>
            interpolate(f, [BEAT5.musique.fadeOutStartFrame, BEAT5.musique.fadeOutEndFrame], [0.6, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      )}
    </AbsoluteFill>
  );
};

export const BEAT5_VERDICT_FRAMES = BEAT_DURATION;
