import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ============================================================
// HOOK BLOC D — Choc statistique (3.6s, 108f @30fps)
// Audio : "En deux ans, la moitie de l'Europe allait disparaitre."
//
// Concept : typographie choc sur fond parchemin noir
//   Phase 1 (0-30f)   : "27 000 000" apparait chiffre par chiffre (spring scale-in)
//   Phase 2 (30-70f)  : "de morts" apparait en dessous, plus petit
//   Phase 3 (70-90f)  : ligne de separation + "La moitie de l'Europe" apparait
//   Phase 4 (90-108f) : tout reste a l'ecran, grain + fondu sortant
//
// Style : fond encre profonde, texte parchemin, accent vermillon sur "27 000 000"
// Effet : spring() scale apparition, grain S2, bordure or
// ============================================================

const TOTAL_FRAMES = 168;  // 108f audio + 60f silence = 5.6s total
const NUM_APPEAR = 50;   // chiffres apparaissent jusqu'a f50 (plus lent)
const TEXT_APPEAR = 72;  // "de morts" visible
const LINE_APPEAR = 90;  // separateur + sous-titre
const FADE_START = 148;  // fondu sortant plus tard

const C = {
  ink: "#1A1008",
  inkDeep: "#0D0804",
  parchment: "#F5E6C8",
  parchmentDim: "#C8B080",
  gold: "#C9A227",
  vermillon: "#C1392B",
  vermillonLight: "#E04030",
};

// ============================================================
// GRAIN S2
// ============================================================
function GrainOverlay({ frame }: { frame: number }) {
  const seed = frame % 8;
  return (
    <svg
      width="1920"
      height="1080"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        mixBlendMode: "overlay",
        opacity: 0.07,
        pointerEvents: "none",
      }}
    >
      <defs>
        <filter id={`gD_${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="3" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="1920" height="1080" filter={`url(#gD_${seed})`} />
    </svg>
  );
}

// ============================================================
// CHIFFRE INDIVIDUEL avec spring scale-in
// ============================================================
function DigitSpring({ char, delay, frame, color, fontSize }: {
  char: string;
  delay: number;
  frame: number;
  color: string;
  fontSize: number;
}) {
  const localFrame = Math.max(0, frame - delay);
  const sc = spring({ frame: localFrame, fps: 30, config: { damping: 14, stiffness: 120 } });
  const opacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        display: "inline-block",
        transform: `scale(${sc})`,
        opacity,
        color,
        fontSize,
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontWeight: 900,
        letterSpacing: "0.04em",
        lineHeight: 1,
      }}
    >
      {char}
    </span>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export const HookBlocD: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void fps;

  // "de morts" apparition
  const textOpacity = interpolate(frame, [TEXT_APPEAR, TEXT_APPEAR + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textScale = spring({ frame: Math.max(0, frame - TEXT_APPEAR), fps: 30, config: { damping: 18, stiffness: 90 } });

  // Ligne separatrice
  const lineWidth = interpolate(frame, [LINE_APPEAR, LINE_APPEAR + 18], [0, 680], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sous-titre "La moitie de l'Europe"
  const subtitleOpacity = interpolate(frame, [LINE_APPEAR + 10, LINE_APPEAR + 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fondu noir -> BlocE
  const fadeOut = interpolate(frame, [FADE_START, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Chiffres de "27 000 000" avec delays echelonnes
  // Espaces visuels inclus: "27" + " " + "000" + " " + "000"
  const numberChars = ["2", "7", "\u00a0", "0", "0", "0", "\u00a0", "0", "0", "0"];
  const charDelay = 5; // frames entre chaque chiffre (ralenti pour plus d'impact)

  return (
    <AbsoluteFill style={{ backgroundColor: C.inkDeep, overflow: "hidden" }}>
      <Audio
        src={staticFile("audio/peste-pixel/hook/hook_04_moitie.mp3")}
        startFrom={0}
        volume={1}
      />

      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", top: 0, left: 0 }}>
        {/* Fond encre avec vignette radiale */}
        <defs>
          <radialGradient id="bgD" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#1A1008" stopOpacity={1} />
            <stop offset="100%" stopColor="#080402" stopOpacity={1} />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#bgD)" />

        {/* Bordure or */}
        <rect x="0" y="0" width="1920" height="1080" fill="none" stroke={C.gold} strokeWidth={6} opacity={0.6} />

        {/* Ligne separatrice or */}
        {frame >= LINE_APPEAR && (
          <line
            x1={(1920 - lineWidth) / 2}
            y1="620"
            x2={(1920 + lineWidth) / 2}
            y2="620"
            stroke={C.gold}
            strokeWidth={2.5}
            opacity={0.7}
          />
        )}
      </svg>

      {/* TYPOGRAPHIE — centre absolu */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* "27 000 000" — chiffres animés un par un */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          {numberChars.map((char, i) => (
            <DigitSpring
              key={i}
              char={char}
              delay={i * charDelay}
              frame={frame}
              color={C.vermillon}
              fontSize={220}
            />
          ))}
        </div>

        {/* "de morts" */}
        <div
          style={{
            transform: `scale(${textScale})`,
            opacity: textOpacity,
            color: C.parchment,
            fontSize: 72,
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: 400,
            letterSpacing: "0.18em",
            textTransform: "uppercase" as const,
            marginBottom: 48,
          }}
        >
          de morts
        </div>

        {/* Sous-titre */}
        <div
          style={{
            opacity: subtitleOpacity,
            color: C.parchmentDim,
            fontSize: 42,
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontStyle: "italic",
            letterSpacing: "0.08em",
            marginTop: 32,
          }}
        >
          La moiti&#233; de l&apos;Europe. En deux ans.
        </div>
      </div>

      <GrainOverlay frame={frame} />

      {/* Fondu noir -> BlocE */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#000000",
          opacity: fadeOut,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
