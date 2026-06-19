/**
 * IntroProtoA — "DEUX FORCES TYPOGRAPHIQUES QUI S'AFFRONTENT" (PAS de carte).
 * 2 mots-mondes geants entrent en collision : MALEDICTION (petrole noir visqueux, vient de gauche)
 * vs MIRACLE (or aveuglant, vient de droite). Ils se percutent au centre, se poussent, puis sur
 * "ailleurs" sont PULVERISES -> ecran nu navy. Continuite = grain + charte navy/or, PAS la carte.
 * Proto mecanique (~9s), sans audio. Frames @30fps.
 */
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const NAVY_DEEP = "#0d1424", OCRE = "#e7bd78", CRISIS = "#b23a2e", IVORY = "#f2ebd9";

const F_MAL = 20;     // malediction entre
const F_MIR = 80;     // miracle entre
const F_CLASH = 130;  // collision
const F_PULV = 200;   // pulverisation ("ailleurs")

export const IntroProtoA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grainSeed = Math.floor(frame / 18);

  // MALEDICTION : slide depuis la gauche, s'arrete au clash
  const malP = spring({ frame: frame - F_MAL, fps, config: { damping: 14, stiffness: 70 } });
  const malX = interpolate(malP, [0, 1], [-1100, -260], { extrapolateRight: "clamp" });
  // pousse au clash puis recule un peu (lutte)
  const malPush = interpolate(frame, [F_CLASH, F_CLASH + 25, F_PULV], [0, 60, 30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // MIRACLE : slide depuis la droite
  const mirP = spring({ frame: frame - F_MIR, fps, config: { damping: 14, stiffness: 70 } });
  const mirX = interpolate(mirP, [0, 1], [1100, 260], { extrapolateRight: "clamp" });
  const mirPush = interpolate(frame, [F_CLASH, F_CLASH + 25, F_PULV], [0, -60, -30], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // CLASH : flash + secousse
  const clash = spring({ frame: frame - F_CLASH, fps, config: { damping: 8, stiffness: 200 } });
  const shake = frame > F_CLASH && frame < F_PULV ? Math.sin(frame * 1.3) * 4 * (1 - (frame - F_CLASH) / (F_PULV - F_CLASH)) : 0;
  const flash = interpolate(frame, [F_CLASH, F_CLASH + 6, F_CLASH + 20], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // PULVERISATION : les 2 mots explosent (scale + opacity + eclats)
  const pulv = spring({ frame: frame - F_PULV, fps, config: { damping: 12, stiffness: 90 } });
  const wordsOp = interpolate(pulv, [0, 0.6], [1, 0], { extrapolateRight: "clamp" });
  const wordsScale = 1 + pulv * 0.4;

  const navyBg = interpolate(frame, [F_PULV, F_PULV + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bg = `rgb(${Math.round(13 + (1 - navyBg) * 30)},${Math.round(20 + (1 - navyBg) * 25)},${Math.round(36 + (1 - navyBg) * 20)})`;

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="grainA"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={grainSeed} stitchTiles="stitch" result="n" /><feColorMatrix in="n" type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer><feComposite operator="over" in2="SourceGraphic" /></filter>
          <linearGradient id="oilGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a2a1a" /><stop offset="100%" stopColor="#0a0805" /></linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fbe9b8" /><stop offset="100%" stopColor={OCRE} /></linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="#000" filter="url(#grainA)" opacity={0.5} />
      </svg>

      {/* MALEDICTION (petrole, gauche) */}
      <div style={{ position: "absolute", left: 960 + malX + malPush + shake, top: 440, transform: `scale(${wordsScale})`, opacity: wordsOp,
        fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: 130, lineHeight: 0.9, letterSpacing: "2px",
        color: "#1a1410", textShadow: `0 0 30px ${CRISIS}99, 2px 2px 0 #000`, WebkitTextStroke: `1px ${CRISIS}` }}>
        MALÉDICTION
      </div>
      {/* MIRACLE (or, droite) */}
      <div style={{ position: "absolute", right: 960 - mirX + mirPush - shake, top: 440, transform: `scale(${wordsScale})`, opacity: wordsOp, textAlign: "right",
        fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: 130, lineHeight: 0.9, letterSpacing: "2px",
        color: OCRE, textShadow: `0 0 40px ${OCRE}, 0 2px 0 #fff8e6` }}>
        MIRACLE
      </div>

      {/* flash collision */}
      <AbsoluteFill style={{ background: IVORY, opacity: flash, mixBlendMode: "overlay" }} />
      {/* eclats a la pulverisation */}
      {frame >= F_PULV && pulv < 0.9 && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2, d = pulv * 600;
            return <circle key={i} cx={960 + Math.cos(a) * d} cy={500 + Math.sin(a) * d} r={interpolate(pulv, [0, 1], [8, 0])} fill={i % 2 ? OCRE : CRISIS} opacity={1 - pulv} />;
          })}
        </svg>
      )}
    </AbsoluteFill>
  );
};
export default IntroProtoA;
