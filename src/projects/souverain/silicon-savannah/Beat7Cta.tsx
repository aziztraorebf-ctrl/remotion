import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { SEG, DURATION_FRAMES, AUDIO } from "./beat7/manifest";

const { fontFamily: bebas } = loadBebas();

const MUSIC_PATH       = "souverain/silicon-savannah/audio/music/music-A.mp3";
const MUSIC_START_FROM = 3489; // global startFrame Beat7
const NARRATION_END    = 173;  // dernière frame audio narration
const OUTRO_FRAMES     = 75;   // 2.5s de respiration post-narration

// Beat 7 — CTA (standalone, frame 0 = début du beat)
// Layout :
//   f0        → "Et dans ton pays —"
//   f103      → "une entreprise privée" / "OU L'ÉTAT ?" (2 sous-lignes)
//   f138      → trait gold horizontal glisse gauche→droite (15f)
//   f140      → "Réponds en commentaire." scale up
export const BEAT7_DURATION = DURATION_FRAMES; // 173

const GOLD  = "#c8a951";
const IVORY = "#f0e8d8";
const DARK  = "#0d1420";

export function Beat7Cta({ globalMusic = false, globalAudio = false }: { globalMusic?: boolean; globalAudio?: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ligne 1 : "Et dans ton pays —" (f0)
  const p1 = spring({ frame, fps, config: { damping: 90, stiffness: 55 } });
  const l1Op = interpolate(p1, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const l1Y  = interpolate(p1, [0, 1], [30, 0], { extrapolateRight: "clamp" });

  // Ligne 2a : "une entreprise privée" (f103)
  const p2a = spring({ frame: frame - SEG.etat, fps, config: { damping: 90, stiffness: 55 } });
  const l2aOp = interpolate(p2a, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const l2aY  = interpolate(p2a, [0, 1], [28, 0], { extrapolateRight: "clamp" });

  // Ligne 2b : "OU L'ÉTAT ?" (f118 — légère cascade après 2a)
  const p2b = spring({ frame: frame - (SEG.etat + 15), fps, config: { damping: 80, stiffness: 50 } });
  const l2bOp    = interpolate(p2b, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const l2bScale = interpolate(p2b, [0, 1], [0.88, 1], { extrapolateRight: "clamp" });

  // Séparateur : trait gold glisse gauche→droite (f138, durée 15f)
  const SEP_START = 138;
  const sepProgress = interpolate(frame, [SEP_START, SEP_START + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sepWidth = `${sepProgress * 200}px`;
  const sepOp = interpolate(frame, [SEP_START, SEP_START + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ligne 3 : "Réponds en commentaire." (f140)
  const p3 = spring({ frame: frame - SEG.reponds, fps, config: { damping: 80, stiffness: 50 } });
  const l3Op    = interpolate(p3, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const l3Scale = interpolate(p3, [0, 1], [0.85, 1], { extrapolateRight: "clamp" });

  // Curseur clignotant — disparaît quand tout est affiché
  const cursorOp = frame >= SEG.reponds + 15
    ? 0
    : Math.floor(frame / 12) % 2 === 0 ? 0.8 : 0;

  // Fade-out musique sur les 75 dernières frames (post-narration)
  const musicVolume = interpolate(
    frame,
    [NARRATION_END, NARRATION_END + OUTRO_FRAMES],
    [0.07, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Fade-out vidéo : noir progressif sur les 30 dernières frames
  const screenFadeOp = interpolate(
    frame,
    [NARRATION_END + OUTRO_FRAMES - 30, NARRATION_END + OUTRO_FRAMES],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: DARK }}>
      {!globalAudio && <Audio src={staticFile(AUDIO)} />}
      {!globalMusic && <Audio src={staticFile(MUSIC_PATH)} startFrom={MUSIC_START_FROM} volume={musicVolume} />}

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          transform: "translateY(-58%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        {/* Ligne 1 */}
        <div
          style={{
            fontFamily: bebas,
            fontSize: 72,
            color: IVORY,
            letterSpacing: "0.06em",
            lineHeight: 1.25,
            opacity: l1Op,
            transform: `translateY(${l1Y}px)`,
          }}
        >
          Et dans ton pays —
        </div>

        {/* Ligne 2a */}
        <div
          style={{
            fontFamily: bebas,
            fontSize: 72,
            color: IVORY,
            letterSpacing: "0.06em",
            lineHeight: 1.2,
            opacity: l2aOp,
            transform: `translateY(${l2aY}px)`,
            marginTop: 6,
          }}
        >
          une entreprise privée
        </div>

        {/* Ligne 2b — "OU L'ÉTAT ?" plus grand, gold */}
        <div
          style={{
            fontFamily: bebas,
            fontSize: 104,
            color: GOLD,
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            opacity: l2bOp,
            transform: `scale(${l2bScale})`,
            marginTop: 2,
            filter: l2bOp > 0.1
              ? `drop-shadow(0px 0px 16px rgba(200,169,81,0.5))`
              : "none",
          }}
        >
          ou l'État ?
        </div>

        {/* Séparateur gold */}
        <div
          style={{
            width: sepWidth,
            height: 2,
            background: GOLD,
            marginTop: 24,
            opacity: sepOp,
            transition: "none",
          }}
        />

        {/* Ligne 3 — CTA */}
        <div
          style={{
            fontFamily: bebas,
            fontSize: 88,
            color: GOLD,
            letterSpacing: "0.05em",
            lineHeight: 1.2,
            opacity: l3Op,
            transform: `scale(${l3Scale})`,
            marginTop: 20,
            filter: l3Op > 0.1
              ? `drop-shadow(0px 0px 18px rgba(200,169,81,0.65))`
              : "none",
          }}
        >
          Réponds en commentaire
          <span style={{ color: IVORY }}>.</span>
        </div>

        {/* Curseur */}
        <div
          style={{
            width: 4,
            height: 64,
            background: GOLD,
            marginTop: 10,
            opacity: cursorOp,
          }}
        />
      </div>

      {/* Fade-out noir progressif en fin de beat */}
      <AbsoluteFill
        style={{
          background: "#000000",
          opacity: screenFadeOp,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
}
