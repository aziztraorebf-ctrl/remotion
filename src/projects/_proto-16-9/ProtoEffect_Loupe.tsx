import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";

// PROTO EFFET LOUPE (magnifier) — prouve : cercle qui suit une trajectoire et
// agrandit le contenu dessous (clip-path circulaire + 2e couche texte scale).
// Pas de vraie refraction WebGL — c'est un cercle zoome, comme la demo de ref.

const W = 1920;
const H = 1080;
const NAVY = "#16213a";
const IVORY = "#f2ebd9";
const GOLD = "#c8a951";
const DISPLAY = "Cinzel, serif";

const LINES = ["LE SÉNÉGAL EXPORTE", "SON PREMIER BARIL", "DE PÉTROLE"];

const TextBlock: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 18,
      transform: `scale(${scale})`,
      transformOrigin: "center center",
    }}
  >
    {LINES.map((l, i) => (
      <div key={i} style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 700, color: i === 1 ? GOLD : IVORY, letterSpacing: "2px" }}>
        {l}
      </div>
    ))}
  </div>
);

export const ProtoEffect_Loupe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // trajectoire de la loupe : balaye de gauche a droite en passant sur "PREMIER BARIL"
  const t = spring({ fps, frame, config: { damping: 30, stiffness: 18 } });
  const lensX = interpolate(t, [0, 1], [W * 0.28, W * 0.72]);
  const lensY = interpolate(frame, [0, 60, 120, 180], [H * 0.46, H * 0.52, H * 0.48, H * 0.52], { extrapolateRight: "clamp" });
  const R = 190; // rayon loupe
  const MAG = 1.8; // grossissement

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* couche de base, taille normale */}
      <TextBlock scale={1} />

      {/* couche grossie, clippee dans le cercle de la loupe.
          Astuce : on agrandit autour du centre de la loupe pour que ca "zoome" sous le verre */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `circle(${R}px at ${lensX}px ${lensY}px)`,
          WebkitClipPath: `circle(${R}px at ${lensX}px ${lensY}px)`,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: NAVY }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate(${lensX - W / 2}px, ${lensY - H / 2}px) scale(${MAG}) translate(${-(lensX - W / 2) / MAG}px, ${-(lensY - H / 2) / MAG}px)`,
            transformOrigin: "center center",
          }}
        >
          <TextBlock scale={1} />
        </div>
      </div>

      {/* monture de la loupe (SVG) */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <defs>
          <radialGradient id="glass" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {/* reflet verre */}
        <circle cx={lensX} cy={lensY} r={R} fill="url(#glass)" />
        {/* anneau metal */}
        <circle cx={lensX} cy={lensY} r={R} fill="none" stroke="#3a3f4a" strokeWidth={14} />
        <circle cx={lensX} cy={lensY} r={R} fill="none" stroke={GOLD} strokeWidth={4} opacity={0.6} />
        {/* manche */}
        <line
          x1={lensX + Math.cos(Math.PI / 4) * R}
          y1={lensY + Math.sin(Math.PI / 4) * R}
          x2={lensX + Math.cos(Math.PI / 4) * (R + 150)}
          y2={lensY + Math.sin(Math.PI / 4) * (R + 150)}
          stroke="#3a3f4a"
          strokeWidth={26}
          strokeLinecap="round"
        />
      </svg>
    </AbsoluteFill>
  );
};
