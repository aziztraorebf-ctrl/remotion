/**
 * IntroProtoC — "LE FAUX DEBAT / DEUX PLAQUES DE PROPAGANDE" (PAS de carte).
 * 2 affiches/plaques opposees (slogan style propagande) se disputent l'ecran : elles entrent, se
 * chevauchent, "crient" (scale pulse) l'une plus fort que l'autre a tour de role. Sur "ailleurs",
 * une force les ECARTE/DECHIRE pour reveler que la verite est DERRIERE (vide navy). Continuite = grain+charte.
 * Proto ~9s sans audio.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const NAVY = "#16213a", NAVY_DEEP = "#0d1424", OCRE = "#e7bd78", CRISIS = "#b23a2e", IVORY = "#f2ebd9", PARCH = "#e4ddca";

const F_MAL = 18;
const F_MIR = 70;
const F_FIGHT = 130;  // les 2 se disputent (pulse alterne)
const F_TEAR = 200;   // dechirure ("ailleurs")

const Plaque: React.FC<{ side: "L" | "R"; title: string; sub: string; color: string; appearF: number; frame: number; fps: number; tearF: number; loud: boolean }>
  = ({ side, title, sub, color, appearF, frame, fps, tearF, loud }) => {
  const p = spring({ frame: frame - appearF, fps, config: { damping: 15, stiffness: 80 } });
  const fromX = side === "L" ? -700 : 700;
  const restX = side === "L" ? -230 : 230;
  const x = interpolate(p, [0, 1], [fromX, restX], { extrapolateRight: "clamp" });
  // "crie" : pulse de scale quand c'est son tour
  const shout = loud ? 1 + 0.05 * Math.max(0, Math.sin((frame - F_FIGHT) * 0.4)) : 1;
  // dechirure : la plaque part vers son cote en se dechirant
  const tP = spring({ frame: frame - tearF, fps, config: { damping: 11, stiffness: 55 } });
  const tearX = interpolate(tP, [0, 1], [0, side === "L" ? -1100 : 1100], { extrapolateRight: "clamp" });
  const rot = interpolate(tP, [0, 1], [0, side === "L" ? -12 : 12], { extrapolateRight: "clamp" });
  const op = interpolate(tP, [0.5, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 960 + x + tearX, top: 360, transform: `translateX(-50%) rotate(${rot}deg) scale(${shout})`, opacity: op,
      width: 560, padding: "40px 44px", background: NAVY, border: `3px solid ${color}`, boxShadow: `0 12px 50px #000a, 0 0 40px ${color}44` }}>
      <div style={{ fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: 72, color, letterSpacing: "2px", lineHeight: 0.95 }}>{title}</div>
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 20, color: IVORY, opacity: 0.7, letterSpacing: "0.1em", marginTop: 14, textTransform: "uppercase" }}>{sub}</div>
    </div>
  );
};

export const IntroProtoC: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grainSeed = Math.floor(frame / 18);
  // qui crie : alternance
  const malLoud = frame >= F_FIGHT && Math.floor((frame - F_FIGHT) / 22) % 2 === 0;
  const mirLoud = frame >= F_FIGHT && !malLoud;

  // fente centrale qui s'ouvre a la dechirure (revele le vide)
  const tP = spring({ frame: frame - F_TEAR, fps, config: { damping: 12, stiffness: 55 } });
  const slit = interpolate(tP, [0, 1], [0, 1920], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NAVY_DEEP, overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs><filter id="grainC"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={grainSeed} stitchTiles="stitch" result="n" /><feColorMatrix in="n" type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer><feComposite operator="over" in2="SourceGraphic" /></filter></defs>
        <rect width={1920} height={1080} fill="#000" filter="url(#grainC)" opacity={0.4} />
      </svg>

      <Plaque side="L" title="« LA MALÉDICTION »" sub="Ils pompent et repartent" color={CRISIS} appearF={F_MAL} frame={frame} fps={fps} tearF={F_TEAR} loud={malLoud} />
      <Plaque side="R" title="« LE MIRACLE »" sub="La souveraineté retrouvée" color={OCRE} appearF={F_MIR} frame={frame} fps={fps} tearF={F_TEAR} loud={mirLoud} />

      {/* fente lumineuse centrale qui s'ouvre (la verite derriere) */}
      {frame >= F_TEAR && (
        <div style={{ position: "absolute", left: 960 - slit / 2, top: 0, width: slit, height: 1080,
          background: `linear-gradient(90deg, transparent, ${IVORY}22 48%, ${IVORY}44 50%, ${IVORY}22 52%, transparent)` }} />
      )}
    </AbsoluteFill>
  );
};
export default IntroProtoC;
