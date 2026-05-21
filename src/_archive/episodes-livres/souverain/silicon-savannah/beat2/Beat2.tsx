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
import { loadFont } from "@remotion/google-fonts/Cinzel";
import { AUDIO, BG, SEG, SEG23_ANTENNA, SEG23_NOKIA } from "./manifest";
import { SubtitleBar } from "../SubtitleBar";

const SUBTITLES = [
  { text: "Tout commence en deux mille sept.",                   start:   0, end:  24 },
  { text: "Safaricom lance M-Pesa.",                             start:  51, end: 112 },
  { text: "Un service de paiement par SMS.",                     start: 120, end: 170 },
  { text: "Pas de smartphone. Pas d'appli. Pas de banque.",      start: 218, end: 254 },
  { text: "Juste un réseau et un vieux Nokia.",                  start: 314, end: 360 },
];

const { fontFamily: cinzelFamily } = loadFont();

const SEG_22A_END = 180;

function useFadeOut(endFrame: number, duration = 12) {
  const frame = useCurrentFrame();
  return interpolate(frame, [endFrame - duration, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Segment 2.1 — "2007" + slow zoom + pop-in dynamique
function Seg21() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popIn = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const fadeOut = useFadeOut(SEG.mpesa, 8);
  const combined = Math.min(popIn, fadeOut);

  // Slow zoom : 1.0 → 1.05 sur toute la durée du segment
  const slowZoom = interpolate(frame, [0, SEG.mpesa], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      className="items-center justify-center"
      style={{ opacity: combined }}
    >
      <span
        className="text-gold"
        style={{
          fontSize: 320,
          lineHeight: 1,
          fontWeight: 700,
          fontFamily: cinzelFamily,
          transform: `scale(${slowZoom * popIn})`,
          display: "inline-block",
        }}
      >
        2007
      </span>
    </AbsoluteFill>
  );
}

// Segment 2.2a — M-PESA + icônes SMS + flottaison + glow pulsant
function Seg22a() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame: frame - SEG.mpesa,
    fps,
    config: { damping: 80, stiffness: 60 },
  });

  const fadeOut = useFadeOut(SEG_22A_END, 10);

  const iconSpring = spring({
    frame: frame - SEG.mpesa - 8,
    fps,
    config: { damping: 70, stiffness: 80 },
  });

  // Glow pulsant sur M-PESA
  const glowIntensity = interpolate(Math.sin((frame - SEG.mpesa) / 8), [-1, 1], [6, 18]);

  if (frame < SEG.mpesa) return null;

  return (
    <AbsoluteFill
      className="items-center justify-center flex-col"
      style={{ opacity: Math.min(opacity, fadeOut), gap: 32 }}
    >
      {/* Icônes SMS + pièces avec flottaison asynchrone */}
      <div
        style={{
          display: "flex",
          gap: 40,
          transform: `scale(${iconSpring})`,
          transformOrigin: "center bottom",
          alignItems: "center",
        }}
      >
        {/* Enveloppe SMS — flottaison propre */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            transform: `translateY(${Math.sin((frame - SEG.mpesa) / 12) * 6}px)`,
          }}
        >
          <svg width="140" height="110" viewBox="0 0 90 70" fill="none">
            <rect x="2" y="2" width="86" height="66" rx="6" stroke="#FFB800" strokeWidth="3" />
            <polyline points="2,2 45,42 88,2" stroke="#FFB800" strokeWidth="3" fill="none" />
          </svg>
          <span
            className="font-mono text-gold"
            style={{ fontSize: 32, letterSpacing: "0.2em" }}
          >
            SMS
          </span>
        </div>

        {/* Devises — pop-in séquentiel + flottaison asynchrone */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {["€", "$", "KSh"].map((symbol, i) => (
            <div
              key={symbol}
              className="font-mono text-gold"
              style={{
                fontSize: 52,
                opacity: interpolate(frame, [SEG.mpesa + 10 + i * 8, SEG.mpesa + 22 + i * 8], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
                transform: `translateY(${Math.sin((frame - SEG.mpesa) / 10 + i * 1.5) * 5}px)`,
              }}
            >
              {symbol}
            </div>
          ))}
        </div>
      </div>

      {/* M-PESA avec glow pulsant */}
      <div
        className="text-gold"
        style={{
          fontSize: 160,
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: "0.05em",
          fontFamily: cinzelFamily,
          filter: `drop-shadow(0 0 ${glowIntensity}px rgba(255, 184, 0, 0.55))`,
        }}
      >
        M-PESA
      </div>
    </AbsoluteFill>
  );
}

// Segment 2.2b — "PAS D'APP / PAS DE SMARTPHONE" barré
function Seg22b() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame: frame - SEG_22A_END,
    fps,
    config: { damping: 80, stiffness: 60 },
  });

  const fadeOut = useFadeOut(SEG.nokia, 10);

  const line1Spring = spring({
    frame: frame - SEG_22A_END,
    fps,
    config: { damping: 80, stiffness: 60 },
  });

  const line2Spring = spring({
    frame: frame - SEG_22A_END - 12,
    fps,
    config: { damping: 80, stiffness: 60 },
  });

  const ratureWidth = interpolate(
    frame,
    [SEG_22A_END + 20, SEG_22A_END + 45],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  if (frame < SEG_22A_END) return null;

  return (
    <AbsoluteFill
      className="items-center justify-center flex-col"
      style={{ opacity: Math.min(opacity, fadeOut), display: "flex", flexDirection: "column", gap: 40 }}
    >
      {/* Ligne 1 — scale back + slide */}
      <div
        className="text-gold"
        style={{
          fontSize: 110,
          fontWeight: 700,
          letterSpacing: "0.06em",
          fontFamily: cinzelFamily,
          transform: `translateY(${interpolate(line1Spring, [0, 1], [40, 0])}px) scale(${interpolate(line1Spring, [0, 1], [1.08, 1])})`,
        }}
      >
        PAS D&apos;APP
      </div>

      {/* Ligne 2 + rature animée */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <div
          className="text-ivory"
          style={{
            fontSize: 80,
            fontWeight: 600,
            letterSpacing: "0.04em",
            fontFamily: cinzelFamily,
            transform: `translateY(${interpolate(line2Spring, [0, 1], [40, 0])}px)`,
          }}
        >
          PAS DE SMARTPHONE
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            height: 5,
            backgroundColor: "#FFB800",
            width: `${ratureWidth}%`,
            transform: "translateY(-50%)",
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
}

// Segment 2.3 — Split antenne / Nokia — fond split + ondes loop + Nokia vibration
function Seg23() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftSpring = spring({
    frame: frame - SEG.nokia,
    fps,
    config: { damping: 80, stiffness: 55 },
  });

  const rightSpring = spring({
    frame: frame - SEG.nokia - 10,
    fps,
    config: { damping: 80, stiffness: 55 },
  });

  if (frame < SEG.nokia) return null;

  // Nokia vibration au milieu du segment (~frame 380, soit 67f après SEG.nokia)
  const vibrateZone = interpolate(frame, [SEG.nokia + 55, SEG.nokia + 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vibrateOut = interpolate(frame, [SEG.nokia + 75, SEG.nokia + 85], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const vibrateOpacity = vibrateZone * vibrateOut;
  const vibrationAngle = Math.sin((frame - SEG.nokia - 55) * 2.5) * 2.5 * vibrateOpacity;

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "row" }}>
      {/* Gauche — antenne image Gemini + pulse overlay */}
      <div
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: "#0A1016",
          transform: `translateX(${interpolate(leftSpring, [0, 1], [-60, 0])}px)`,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(SEG23_ANTENNA)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Pulse lumineux pulsant sur les ondes */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 55% 35% at 30% 42%, rgba(255,184,0,${interpolate(Math.sin((frame - SEG.nokia) / 8), [-1, 1], [0.0, 0.14])}) 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Droite — Nokia image Gemini + vibration */}
      <div
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: "#161D26",
          transform: `translateX(${interpolate(rightSpring, [0, 1], [60, 0])}px) rotate(${vibrationAngle}deg)`,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile(SEG23_NOKIA)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </AbsoluteFill>
  );
}

export const Beat2: React.FC<{ globalAudio?: boolean }> = ({ globalAudio = false }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d1420" }}>
      {/* Background texture — masqué sur Seg23 (fond flat split) */}
      {frame < SEG.nokia && (
        <Img
          src={staticFile(BG)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35,
          }}
        />
      )}

      {!globalAudio && <Audio src={staticFile(AUDIO)} />}

      {frame < SEG_22A_END && <Seg21 />}
      {frame >= SEG.mpesa && frame < SEG.nokia && <Seg22a />}
      {frame >= SEG_22A_END && frame < SEG.nokia && <Seg22b />}
      {frame >= SEG.nokia && <Seg23 />}

      <SubtitleBar lines={SUBTITLES} />
    </AbsoluteFill>
  );
};
