import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// PROTO TYPEWRITER VERSION B — VRAIE video stock (Pexels, macro machine reelle qui tape)
// + notre texte incruste en sync sur la zone haute propre de la feuille.
// La video apporte la vraie mecanique (typebar, chariot) ; on ajoute notre contenu par-dessus.

const W = 1920;
const H = 1080;
const INK = "#2a2a2a";
const GOLD = "#9a7b2e";
const MONO = "IBM Plex Mono, monospace";

const TEXT = "8 000 000 $ / jour.\nLe gouvernement tombe.";
const CPS = 12;

export const ProtoEffect_TypewriterStock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shown = Math.floor((frame / fps) * CPS);
  const visible = TEXT.slice(0, shown);
  const done = shown >= TEXT.length;
  const cursorOn = !done || frame % 16 < 8;
  const lines = visible.split("\n");

  // leger fondu d'entree du texte
  const op = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#1a1410" }}>
      {/* video stock plein cadre (cover) ; demarre un peu plus loin pour voir la frappe */}
      <OffthreadVideo src={staticFile("_proto/typewriter/stock-typewriter.mp4")} startFrom={Math.round(2 * fps)} style={{ width: W, height: H, objectFit: "cover" }} muted />

      {/* voile sombre haut pour poser le texte lisiblement sur la feuille */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,16,12,0.55) 0%, rgba(20,16,12,0) 45%)" }} />

      {/* notre texte tape, zone haute */}
      <div style={{ position: "absolute", left: "50%", top: 130, transform: "translateX(-50%)", width: 1100, textAlign: "center", opacity: op, fontFamily: MONO, fontSize: 56, color: "#f2ebd9", lineHeight: 1.5, whiteSpace: "pre-wrap", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
        {lines.map((ln, i) => (
          <div key={i}>
            {ln}
            {i === lines.length - 1 && cursorOn && <span style={{ color: GOLD }}>▌</span>}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
