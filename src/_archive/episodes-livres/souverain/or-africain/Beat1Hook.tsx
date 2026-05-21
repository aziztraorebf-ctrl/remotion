import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence, staticFile } from "remotion";
import { BEATS, AUDIO_SEGMENTS, NARRATION_PATH, MUSIC_PATH } from "./timing";
import { BEAT1, PALETTE, PROGRESS_BAR } from "./manifest";
import { Subtitles } from "../../geoafrique-shorts/Subtitles";
import { OR_AFRICAIN_WORDS } from "./whisper-words-or-africain";

const BEAT_START = BEATS.beat1.startFrame;
const BEAT_END = BEATS.beat1.endFrame;
const BEAT_DURATION = BEAT_END - BEAT_START;
const BEAT_START_S = BEATS.beat1.startSec;
const BEAT_END_S = BEATS.beat1.endSec;

const COMPTEUR_FONT_SIZE = 240;
const COMPTEUR_LABEL_FONT_SIZE = 32;
const COMPTEUR_LABEL_COLOR = "#9a9a9a";

function ProgressBar({ frame }: { frame: number }) {
  const progress = frame / BEAT_DURATION;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: PROGRESS_BAR.y,
        width: `${progress * 100}%`,
        height: PROGRESS_BAR.height,
        backgroundColor: PROGRESS_BAR.color,
        opacity: PROGRESS_BAR.opacity,
      }}
    />
  );
}

function CounterDisplay({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();

  const countProgress = interpolate(
    frame,
    [0, BEAT_DURATION * 0.7],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const rawValue = BEAT1.compteur.startValue + countProgress * (BEAT1.compteur.endValue - BEAT1.compteur.startValue);
  const displayValue = Math.round(rawValue);

  const glowIntensity = BEAT1.compteur.glowIntensity * (displayValue / BEAT1.compteur.endValue);

  // Micro-vibration at tick frames
  const isTick = BEAT1.compteur.tickFrames.some((tf) => frame >= tf && frame < tf + 3);
  const vibX = isTick ? Math.sin(frame * 40) * 2 : 0;
  const vibY = isTick ? Math.cos(frame * 40) * 1 : 0;

  const scaleIn = spring({ fps, frame, config: { damping: 200 } });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 780,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${scaleIn}) translate(${vibX}px, ${vibY}px)`,
      }}
    >
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: COMPTEUR_FONT_SIZE,
          fontWeight: 800,
          color: BEAT1.compteur.color,
          letterSpacing: "-6px",
          textShadow: `0 0 ${50 * glowIntensity}px ${BEAT1.compteur.glowColor}, 0 0 ${100 * glowIntensity}px ${BEAT1.compteur.glowColor}`,
          lineHeight: 1,
        }}
      >
        ${displayValue.toLocaleString("en-US")}
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: COMPTEUR_LABEL_FONT_SIZE,
          color: COMPTEUR_LABEL_COLOR,
          letterSpacing: "8px",
          marginTop: 36,
          textShadow: "0 0 8px rgba(0,0,0,0.6)",
        }}
      >
        {BEAT1.compteur.label}  ·  {BEAT1.compteur.unit}
      </div>
    </div>
  );
}

function RecordStamp({ frame }: { frame: number }) {
  const { fps } = useVideoConfig();
  const relFrame = frame - BEAT1.recordBadge.appearsAtFrame;
  if (relFrame < 0) return null;

  const appear = spring({ fps, frame: relFrame, config: { damping: 200 } });

  // Subtle pulse instead of harsh blink
  const pulsePhase = relFrame - 10;
  const pulseOpacity = pulsePhase >= 0 && pulsePhase < BEAT1.recordBadge.blinkDurationFrames
    ? 0.85 + 0.15 * Math.sin((pulsePhase / 8) * Math.PI)
    : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 380,
        transform: `translateX(-50%) scale(${appear}) rotate(-3deg)`,
        opacity: pulseOpacity,
      }}
    >
      <div
        style={{
          color: PALETTE.blanc,
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
          fontSize: 52,
          fontWeight: 900,
          letterSpacing: "10px",
          padding: "14px 36px",
          border: `3px solid ${PALETTE.rouge}`,
          borderRadius: 4,
          WebkitTextStroke: `1px ${PALETTE.rouge}`,
          textShadow: `0 0 12px rgba(211,47,47,0.45), 1px 1px 0 rgba(0,0,0,0.6)`,
          whiteSpace: "nowrap",
          background: "rgba(0,0,0,0.25)",
        }}
      >
        {BEAT1.recordBadge.text}
      </div>
    </div>
  );
}

export const Beat1Hook: React.FC<{ globalMusic?: boolean }> = ({ globalMusic = false }) => {
  const frame = useCurrentFrame();
  const relFrame = frame - BEAT_START;
  const clampedRel = Math.max(0, Math.min(relFrame, BEAT_DURATION - 1));

  return (
    <AbsoluteFill style={{ backgroundColor: BEAT1.fond }}>
      {/* Premium parchment background */}
      <Img
        src={staticFile("/souverain/or-africain/backgrounds/beat1-bg-v4-parchemin-modern.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.95,
        }}
      />

      {/* Subtle vignette to focus attention on center */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      <RecordStamp frame={clampedRel} />
      <CounterDisplay frame={clampedRel} />
      <ProgressBar frame={clampedRel} />

      {/* TikTok karaoke subtitles — replaces the 3 textLines */}
      <Subtitles
        sceneStartS={BEAT_START_S}
        sceneEndS={BEAT_END_S}
        highlightColor="#f5d547"
        fontSize={58}
        bottomOffset={480}
        words={OR_AFRICAIN_WORDS}
      />

      {/* Narration */}
      <Audio src={staticFile(NARRATION_PATH)} startFrom={BEAT_START} endAt={BEAT_END} />

      {/* Music fade-in at frame 90 — skipped when globalMusic is true (handled at Full level) */}
      {!globalMusic && (
        <Sequence from={BEAT1.musique.fadeInStartFrame}>
          <Audio
            src={staticFile(MUSIC_PATH)}
            volume={(f) =>
              interpolate(
                f,
                [0, BEAT1.musique.fadeInEndFrame - BEAT1.musique.fadeInStartFrame],
                [0, BEAT1.musique.targetVolume],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              )
            }
          />
        </Sequence>
      )}

      {/* SFX ticks at compteur milestones */}
      {BEAT1.compteur.tickFrames.map((tf) => (
        <Sequence key={tf} from={tf} durationInFrames={10}>
          <Audio src={staticFile(BEAT1.sfx.tick)} volume={BEAT1.sfx.tickVolume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const BEAT1_HOOK_FRAMES = BEAT_DURATION;
