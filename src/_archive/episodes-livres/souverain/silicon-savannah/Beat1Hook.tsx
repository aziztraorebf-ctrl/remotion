import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SEG, AUDIO_PATH } from "./manifest";

const DURATION = SEG.hook_kenya.end + 30;

// Ratio photo/texte — 55% photo en haut, 45% zone texte sombre en bas
const PHOTO_RATIO = 0.55;
const PHOTO_H = Math.round(1920 * PHOTO_RATIO); // 1056px
const TEXT_H = 1920 - PHOTO_H;                   // 864px
const BG = "#0a0a0a";
const BG_KENYA = staticFile("souverain/silicon-savannah/bg-kenya.png");

// Timestamps calés sur alignment ElevenLabs v2 (narration-v3-alignment-v2.json)
// "En deux mille vingt-cinq" → f=2
// "un pays africain"         → f=39
// "a la plus forte"          → f=76
// "de paiements mobiles"     → f=128
// "Pas la Chine."            → f=178
// "Pas les États-Unis."      → f=231
// "Le Kenya."                → f=282
const LINES: (string | null)[] = [
  "En 2025, un pays africain",      // f=2
  "a la plus forte pénétration",    // f=76
  "de paiements mobiles au monde.", // f=128
  null,
  "Pas la Chine.",                  // f=178
  "Pas les États-Unis.",            // f=231
];
const LINE_TRIGGERS = [2, 76, 128, -1, 178, 231];
const ACCENT_LINE = "LE KENYA.";
const ACCENT_TRIGGER = SEG.hook_kenya.start; // f=282

const MUSIC_PATH = "souverain/silicon-savannah/audio/music/music-A.mp3";

export const Beat1Hook: React.FC<{ globalMusic?: boolean; globalAudio?: boolean }> = ({ globalMusic = false, globalAudio = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns diagonal : zoom 1.0 → 1.15 + drift droite → gauche
  // Tout se passe dans le conteneur overflow:hidden — rien ne déborde
  const kbScale = interpolate(frame, [0, DURATION], [1.0, 1.15], {
    extrapolateRight: "clamp",
  });
  // Drift latéral : démarre centré (0%) et glisse vers la gauche (-4% de largeur)
  const kbX = interpolate(frame, [0, DURATION], [0, -1080 * 0.04], {
    extrapolateRight: "clamp",
  });
  // Légère montée verticale pour accompagner le zoom
  const kbY = interpolate(frame, [0, DURATION], [0, -PHOTO_H * 0.03], {
    extrapolateRight: "clamp",
  });


  // Zone texte slide up
  const textReveal = spring({
    frame: frame - 8,
    fps,
    config: { damping: 120, stiffness: 60 },
    durationInFrames: 35,
  });
  const textY = interpolate(textReveal, [0, 1], [60, 0], { extrapolateRight: "clamp" });
  const textOpacity = interpolate(textReveal, [0, 1], [0, 1], { extrapolateRight: "clamp" });

  // Tag "KENYA · M-PESA" en haut
  const tagProgress = spring({
    frame: frame - 4,
    fps,
    config: { damping: 200, stiffness: 120 },
    durationInFrames: 20,
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {!globalAudio && <Audio src={staticFile(AUDIO_PATH)} startFrom={0} endAt={314} />}

      {!globalMusic && <Audio src={staticFile(MUSIC_PATH)} startFrom={0} volume={0.12} />}

      {/* Background graphite Kenya — couche de base */}
      <Img
        src={BG_KENYA}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* ── Zone photo — Ken Burns diagonal, tout dans overflow:hidden ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: PHOTO_H,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("souverain/silicon-savannah/assets/nairobi-illustration-v2.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${kbScale}) translate(${kbX}px, ${kbY}px)`,
            transformOrigin: "center center",
          }}
        />

        {/* Gradient bas photo → fond sombre */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 220,
            background: `linear-gradient(to bottom, transparent, ${BG})`,
          }}
        />
      </div>

      {/* ── Tag en haut ── */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 0,
          background: "#FFB800",
          color: "#0a0a0a",
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
          fontSize: 32,
          letterSpacing: "0.25em",
          padding: "10px 40px 8px 40px",
          opacity: tagProgress,
        }}
      >
        KENYA · M-PESA
      </div>

      {/* ── Zone texte — bas de l'écran, fond sombre propre ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: TEXT_H,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 60px 60px 60px",
          gap: 0,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          overflow: "hidden",
        }}
      >
        {/* Lignes narration — calées sur timestamps audio */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {LINES.map((line, i) => {
            if (line === null) return <div key={i} style={{ height: 16 }} />;
            return (
              <TypeLine
                key={i}
                text={line}
                triggerFrame={LINE_TRIGGERS[i]}
                frame={frame}
                fps={fps}
              />
            );
          })}
        </div>

        {/* Accent — calé sur hook_kenya f=282 */}
        <AccentLine
          text={ACCENT_LINE}
          triggerFrame={ACCENT_TRIGGER}
          frame={frame}
          fps={fps}
        />

        {/* Barre dorée signature */}
        <SubBar frame={frame} fps={fps} triggerFrame={ACCENT_TRIGGER + 10} />

        {/* Source discrète */}
        <SubLabel frame={frame} fps={fps} />
      </div>
    </AbsoluteFill>
  );
};

// ── Ligne typée mot par mot (narration) ──
const TypeLine: React.FC<{
  text: string;
  triggerFrame: number;
  frame: number;
  fps: number;
}> = ({ text, triggerFrame, frame, fps }) => {
  const words = text.split(" ");
  // 9f/mot ≈ 0.3s/mot — rythme naturel calé sur la narration française
  const wordsVisible = Math.floor(Math.max(0, frame - triggerFrame) / 9);

  const entryP = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 120, stiffness: 90 },
    durationInFrames: 18,
  });
  const opacity = interpolate(entryP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(entryP, [0, 1], [14, 0], { extrapolateRight: "clamp" });

  if (frame < triggerFrame) return null;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: "'Inter', 'Arial', sans-serif",
        fontSize: 60,
        color: "#ffffff",
        fontWeight: 400,
        letterSpacing: "0.01em",
        lineHeight: 1.15,
      }}
    >
      {words.slice(0, wordsVisible).join(" ")}
    </div>
  );
};

// ── Ligne accent Bebas Neue — même style que BrutalHeadline ──
const AccentLine: React.FC<{
  text: string;
  triggerFrame: number;
  frame: number;
  fps: number;
}> = ({ text, triggerFrame, frame, fps }) => {
  const p = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 120, stiffness: 80 },
    durationInFrames: 30,
  });
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(p, [0, 1], [40, 0], { extrapolateRight: "clamp" });

  if (frame < triggerFrame) return null;

  return (
    <div
      style={{
        color: "#FFB800",
        fontFamily: "'Bebas Neue', 'Impact', 'Arial Black', sans-serif",
        fontSize: 128,
        lineHeight: 0.92,
        letterSpacing: "0.01em",
        textTransform: "uppercase",
        transform: `translateY(${translateY}px)`,
        opacity,
        marginTop: 8,
      }}
    >
      {text}
    </div>
  );
};

// ── Barre dorée sous le texte accent ──
const SubBar: React.FC<{ frame: number; fps: number; triggerFrame: number }> = ({ frame, fps, triggerFrame }) => {
  const p = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 200, stiffness: 120 },
    durationInFrames: 20,
  });
  const scaleX = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        width: 80,
        height: 6,
        background: "#FFB800",
        marginTop: 24,
        transformOrigin: "left center",
        transform: `scaleX(${scaleX})`,
      }}
    />
  );
};

// ── Source discrète ──
const SubLabel: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const p = spring({
    frame: frame - 240,
    fps,
    config: { damping: 120, stiffness: 60 },
    durationInFrames: 25,
  });
  const opacity = interpolate(p, [0, 1], [0, 0.5], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        marginTop: 20,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 22,
        color: "#ffffff",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        opacity,
      }}
    >
      GSMA · WORLD BANK 2025
    </div>
  );
};

export default Beat1Hook;
