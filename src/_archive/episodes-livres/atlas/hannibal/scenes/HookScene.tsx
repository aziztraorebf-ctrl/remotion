// Hook — Hannibal : Traversée des Alpes
// Deux versions : A (fond noir textuel) + B (carte sombre + chiffres)
// Durée : DURATIONS.hook = 223 frames ~7.4s

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { HANNIBAL_PALETTE, HANNIBAL_FONTS, HANNIBAL_TYPO, HANNIBAL_LETTERSPACING } from "../components/HannibalPalette";
import { BEATS, DURATIONS, FPS } from "../timing";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const hannibalData = require("../../../../../data/geo/hannibal-data.json");

const W = 1080;
const H = 1920;
const countries = hannibalData.views.context.countries as { iso: string; d: string }[];

// Timings internes (frames relatifs au début du Hook)
const LINE1_IN = 8;   // "Quarante-six mille soldats entrent dans les Alpes."
const LINE2_IN = 60;  // "Vingt mille en ressortent."
const LINE3_IN = 130; // "Quinze jours."
const FADE_OUT = 195; // début fade-out général

// === VERSION A — Fond noir textuel ===
export const HookVersionA: React.FC = () => {
  const frame = useCurrentFrame();

  const line1Opacity = interpolate(frame, [LINE1_IN, LINE1_IN + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line2Opacity = interpolate(frame, [LINE2_IN, LINE2_IN + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Opacity = interpolate(frame, [LINE3_IN, LINE3_IN + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalFade   = interpolate(frame, [FADE_OUT, DURATIONS.hook], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: HANNIBAL_PALETTE.NOIR_GUERRE, justifyContent: "center", alignItems: "center", opacity: globalFade }}>
      <div style={{ textAlign: "center", padding: "0 80px" }}>
        {/* Ligne 1 — nombre choc, blanc */}
        <div style={{
          fontFamily: HANNIBAL_FONTS.TITRE,
          fontSize: HANNIBAL_TYPO.HOOK,
          color: HANNIBAL_PALETTE.IVOIRE,
          letterSpacing: HANNIBAL_LETTERSPACING.TITRE,
          lineHeight: 1.15,
          opacity: line1Opacity,
          marginBottom: 24,
        }}>
          Quarante-six mille soldats
        </div>

        {/* Ligne 2 — rouge mort */}
        <div style={{
          fontFamily: HANNIBAL_FONTS.TITRE,
          fontSize: HANNIBAL_TYPO.HOOK,
          color: HANNIBAL_PALETTE.ROUGE_MORT,
          letterSpacing: HANNIBAL_LETTERSPACING.TITRE,
          lineHeight: 1.15,
          opacity: line2Opacity,
          marginBottom: 24,
        }}>
          Vingt mille en ressortent.
        </div>

        {/* Ligne 3 — gris froid, sobre */}
        <div style={{
          fontFamily: HANNIBAL_FONTS.TITRE,
          fontSize: 64,
          color: HANNIBAL_PALETTE.METAL_FROID,
          letterSpacing: HANNIBAL_LETTERSPACING.TITRE,
          lineHeight: 1.15,
          opacity: line3Opacity,
        }}>
          Quinze jours.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// === VERSION B — Carte sombre + compteur ===
export const HookVersionB: React.FC = () => {
  const frame = useCurrentFrame();

  // Ken Burns subtil
  const driftX = Math.sin(frame * 0.014) * 4;
  const driftY = Math.cos(frame * 0.011) * 3;
  const mapScale = interpolate(frame, [0, DURATIONS.hook], [1.0, 1.03], { extrapolateRight: "clamp" });

  // Compteur : 46 000 → swap → 20 000
  const show46  = interpolate(frame, [LINE1_IN, LINE1_IN + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const show20  = interpolate(frame, [LINE2_IN, LINE2_IN + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const show15  = interpolate(frame, [LINE3_IN, LINE3_IN + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalFade = interpolate(frame, [FADE_OUT, DURATIONS.hook], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: HANNIBAL_PALETTE.NOIR_GUERRE, opacity: globalFade }}>
      {/* Carte en fond, assombrie */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0.35,
          transformOrigin: "center center",
          transform: `scale(${mapScale}) translate(${driftX}px, ${driftY}px)`,
        }}
      >
        <rect x={0} y={0} width={W} height={H} fill={HANNIBAL_PALETTE.MER} />
        {countries.map((c: { iso: string; d: string }) => {
          const zoneNarrative = ["ESP", "FRA", "ITA", "CHE"].includes(c.iso);
          return (
            <path
              key={c.iso}
              d={c.d}
              fill={zoneNarrative ? "#D4C8B0" : "#B8A882"}
              stroke="#6A5E4A"
              strokeWidth={0.7}
              strokeOpacity={0.8}
            />
          );
        })}
      </svg>

      {/* Texte centré par-dessus */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", padding: "0 80px" }}>
          <div style={{
            fontFamily: HANNIBAL_FONTS.MONO,
            fontSize: HANNIBAL_TYPO.COMPTEUR,
            color: HANNIBAL_PALETTE.OR_SOLDAT,
            fontWeight: 700,
            letterSpacing: HANNIBAL_LETTERSPACING.MONO,
            opacity: show46 * (1 - show20 * 0.8),
            marginBottom: 16,
          }}>
            46 000
          </div>

          <div style={{
            fontFamily: HANNIBAL_FONTS.MONO,
            fontSize: HANNIBAL_TYPO.COMPTEUR,
            color: HANNIBAL_PALETTE.ROUGE_MORT,
            fontWeight: 700,
            letterSpacing: HANNIBAL_LETTERSPACING.MONO,
            opacity: show20,
            marginBottom: 16,
          }}>
            20 000
          </div>

          <div style={{
            fontFamily: HANNIBAL_FONTS.TITRE,
            fontSize: 56,
            color: HANNIBAL_PALETTE.METAL_FROID,
            letterSpacing: HANNIBAL_LETTERSPACING.TITRE,
            opacity: show15,
          }}>
            Quinze jours.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// === WRAPPER — inclut l'audio, expose les deux versions ===
export const HookWithAudio: React.FC<{ version?: "A" | "B" }> = ({ version = "A" }) => (
  <AbsoluteFill>
    <Audio
      src={staticFile("hannibal/audio/narration-v2.mp3")}
      startFrom={BEATS.hook}
      endAt={BEATS.beat1}
    />
    <Audio
      src={staticFile("hannibal/audio/music/v1-A-marche-punique.mp3")}
      volume={(f) => interpolate(f, [0, FPS * 2], [0, 0.15], { extrapolateRight: "clamp" })}
    />
    {version === "A" ? <HookVersionA /> : <HookVersionB />}
  </AbsoluteFill>
);

export const HOOK_FRAMES = DURATIONS.hook; // 223
