/**
 * IntroProtoB — "DEUX MENSONGES QUI SE CONSTRUISENT PUIS S'EFFONDRENT" (PAS de carte).
 * Chaque recit se batit comme une "preuve" : barres/fleches/slogans qui s'empilent en faveur de chaque these
 * (gauche = malediction, droite = miracle) jusqu'a saturation. Sur "ailleurs", TOUT l'echafaudage des DEUX
 * s'effondre d'un coup (chute gravite) -> ecran nu. Continuite = grain + charte. Proto ~9s sans audio.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const NAVY = "#16213a", NAVY_DEEP = "#0d1424", OCRE = "#e7bd78", CRISIS = "#b23a2e", IVORY = "#f2ebd9";

const F_MAL = 15;
const F_MIR = 75;
const F_SAT = 150;     // saturation (les 2 echafaudages pleins)
const F_COLLAPSE = 200; // effondrement ("ailleurs")

// un "bloc de preuve" qui monte
const ProofBar: React.FC<{ x: number; baseY: number; w: number; targetH: number; appearF: number; color: string; frame: number; fps: number; collapseF: number }>
  = ({ x, baseY, w, targetH, appearF, color, frame, fps, collapseF }) => {
  const p = spring({ frame: frame - appearF, fps, config: { damping: 16, stiffness: 120 } });
  const grow = interpolate(p, [0, 1], [0, targetH], { extrapolateRight: "clamp" });
  // effondrement : chute + rotation
  const cP = spring({ frame: frame - collapseF, fps, config: { damping: 9, stiffness: 50 } });
  const fallY = interpolate(cP, [0, 1], [0, 900], { extrapolateRight: "clamp" });
  const rot = interpolate(cP, [0, 1], [0, (x > 960 ? 1 : -1) * 40], { extrapolateRight: "clamp" });
  const op = interpolate(cP, [0.4, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g transform={`translate(${x},${baseY + fallY}) rotate(${rot})`} opacity={op}>
      <rect x={-w / 2} y={-grow} width={w} height={grow} fill={color} opacity={0.85} rx={3} />
      <rect x={-w / 2} y={-grow} width={w} height={grow} fill="none" stroke={color} strokeWidth={2} rx={3} />
    </g>
  );
};

export const IntroProtoB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grainSeed = Math.floor(frame / 18);

  const labelMalOp = interpolate(frame, [F_MAL, F_MAL + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * interpolate(frame, [F_COLLAPSE, F_COLLAPSE + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const labelMirOp = interpolate(frame, [F_MIR, F_MIR + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * interpolate(frame, [F_COLLAPSE, F_COLLAPSE + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // barres gauche (malediction, crisis) et droite (miracle, ocre)
  const malBars = [{ x: 360, h: 280, f: F_MAL + 8 }, { x: 470, h: 420, f: F_MAL + 20 }, { x: 580, h: 340, f: F_MAL + 32 }, { x: 690, h: 500, f: F_MAL + 44 }];
  const mirBars = [{ x: 1230, h: 300, f: F_MIR + 8 }, { x: 1340, h: 450, f: F_MIR + 20 }, { x: 1450, h: 360, f: F_MIR + 32 }, { x: 1560, h: 520, f: F_MIR + 44 }];
  const baseY = 820;

  return (
    <AbsoluteFill style={{ background: NAVY_DEEP, overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="grainB"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={grainSeed} stitchTiles="stitch" result="n" /><feColorMatrix in="n" type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer><feComposite operator="over" in2="SourceGraphic" /></filter>
        </defs>
        <rect width={1920} height={1080} fill="#000" filter="url(#grainB)" opacity={0.4} />
        {/* ligne de sol */}
        <line x1={0} y1={baseY} x2={1920} y2={baseY} stroke={OCRE} strokeWidth={1.5} opacity={0.25} />
        {malBars.map((b, i) => <ProofBar key={`m${i}`} x={b.x} baseY={baseY} w={70} targetH={b.h} appearF={b.f} color={CRISIS} frame={frame} fps={fps} collapseF={F_COLLAPSE + i * 3} />)}
        {mirBars.map((b, i) => <ProofBar key={`r${i}`} x={b.x} baseY={baseY} w={70} targetH={b.h} appearF={b.f} color={OCRE} frame={frame} fps={fps} collapseF={F_COLLAPSE + i * 3} />)}
      </svg>

      {/* labels */}
      <div style={{ position: "absolute", left: 360, top: 150, opacity: labelMalOp, fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: 80, color: CRISIS, letterSpacing: "3px", textShadow: "0 2px 12px #000" }}>« LA MALÉDICTION »</div>
      <div style={{ position: "absolute", right: 360, top: 150, opacity: labelMirOp, textAlign: "right", fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: 80, color: OCRE, letterSpacing: "3px", textShadow: "0 2px 12px #000" }}>« LE MIRACLE »</div>
    </AbsoluteFill>
  );
};
export default IntroProtoB;
