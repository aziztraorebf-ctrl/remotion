/**
 * SenegalScene1IntroCoin — INTRO scene 1 V3 "LE DUEL DES RECITS" (~25s, REMOTION PUR).
 *
 * Utilise le VRAI template 3D <CoinFlip> (preserve-3d, rotateY, faces custom). Pivot Data-Hero.
 * Face A "LA MALEDICTION" (navire+derrick rouge, mer rouge) <-> Face B "LE MIRACLE" (monument or).
 *
 * ⚠️ TIMING CORRIGE : la piece apparait DES f0 (la voix "ces deux recits" demarre a 23.5s = frame 0).
 * Beats cales sur la narration V3 (frames LOCALES, intro = 23.5s -> 48.5s) :
 *   f0    "ces deux recits"               -> piece Face A apparait immediatement
 *   f30+  (intro)                         -> data greffees etalees pendant que la voix decrit
 *   f355  "multinationales qui pompent"   -> malediction pleine
 *   f476  "de l'autre, une nation..."     -> FLIP (image precede : flip demarre ~f460)
 *   f593  "se joue ailleurs"              -> FISSURE + verdict "DEUX ILLUSIONS"
 *   f740  "teste en direct"               -> sortie vers la carte (gere par le parent)
 */
import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { Landmark, Ship } from "lucide-react";
import { CoinFlip } from "../_shared/components/layouts/CoinFlip";

const W = 1920, H = 1080;
const NAVY = "#16213a", NAVY_DEEP = "#0d1424", OCRE = "#e7bd78", OCRE_DARK = "#bf9442";
const IVORY = "#f2ebd9", CRISIS = "#b23a2e", CRISIS_DARK = "#7d2118", NOIR = "#050505";

const OFFSET = 23.5;
const tl = (s: number) => Math.round((s - OFFSET) * 30);
const F_DATA1   = tl(26.0);
const F_DATA2   = tl(29.5);
const F_DATA3   = tl(33.0);
const F_FLIP_S  = tl(38.6);   // flip demarre (image precede "de l'autre" 39.4s)
const F_FLIP_E  = tl(41.0);   // flip fini
const F_FISSURE = tl(42.8);   // avant "ailleurs" 43.3s
const F_VERDICT = tl(43.8);
const F_OUT     = tl(47.0);
const TOTAL     = tl(48.5);

const DIAM = 620;             // grande piece premium (comme le template)
const CX = W / 2, CY = H * 0.44;

// ── illustration Face A (malediction) : navire + derrick + mer rouge, dans la piece ──
const FaceMalediction: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
    {/* mer rouge bas */}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "46%", background: `linear-gradient(${CRISIS}, ${CRISIS_DARK})` }} />
    <svg viewBox="0 0 620 620" width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      <path d="M0,330 q60,-18 120,0 t120,0 t120,0 t120,0 t120,0" stroke={IVORY} strokeWidth={4} fill="none" opacity={0.35} />
      <path d="M0,360 q60,-16 120,0 t120,0 t120,0 t120,0 t120,0" stroke={CRISIS_DARK} strokeWidth={4} fill="none" opacity={0.6} />
      {/* derrick triangulaire */}
      <g stroke={CRISIS} strokeWidth={6} fill="none" strokeLinecap="round">
        <line x1={370} y1={150} x2={340} y2={300} /><line x1={370} y1={150} x2={400} y2={300} />
        <line x1={370} y1={150} x2={370} y2={300} /><line x1={352} y1={225} x2={388} y2={225} />
      </g>
    </svg>
    {/* navire (Lucide) */}
    <div style={{ position: "absolute", left: "34%", top: "40%" }}><Ship size={96} color={CRISIS} strokeWidth={1.5} /></div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: "Cinzel, serif", fontSize: 30, letterSpacing: "0.2em", color: CRISIS_DARK, fontWeight: 700 }}>MALÉDICTION</div>
  </div>
);

// ── illustration Face B (miracle) : monument souverainete dore ──
const FaceMiracle: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
    <Landmark size={170} color={NAVY} strokeWidth={1.3} />
    <div style={{ width: 200, height: 3, background: NAVY, opacity: 0.5 }} />
    <div style={{ fontFamily: "Cinzel, serif", fontSize: 30, letterSpacing: "0.2em", color: NAVY, fontWeight: 700, opacity: 0.85 }}>SOUVERAINETÉ</div>
  </div>
);

const ease = (p: number) => interpolate(p, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// data label greffe (trait fin)
const DataLabel: React.FC<{ ax: number; ay: number; tx: number; ty: number; lines: string[]; appearF: number; frame: number; fps: number; out: number }>
  = ({ ax, ay, tx, ty, lines, appearF, frame, fps, out }) => {
  const p = spring({ frame: frame - appearF, fps, config: { damping: 20, stiffness: 150 }, durationInFrames: 22 });
  const op = ease(p) * out;
  const draw = interpolate(frame, [appearF, appearF + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <line x1={ax} y1={ay} x2={ax + (tx - ax) * draw} y2={ay + (ty - ay) * draw} stroke="rgba(242,235,217,0.75)" strokeWidth={1.6} />
      <circle cx={tx} cy={ty} r={3.5} fill={CRISIS} opacity={draw} />
      <text x={ax} y={ay} fill={IVORY} fontFamily="'IBM Plex Mono', monospace" fontSize={22} fontWeight={600} textAnchor={ax < CX ? "end" : "start"} letterSpacing="1">
        {lines.map((l, i) => <tspan key={i} x={ax} dy={i === 0 ? 0 : 26} fill={i === 0 ? CRISIS : "rgba(242,235,217,0.7)"}>{l}</tspan>)}
      </text>
    </g>
  );
};

export const SenegalScene1IntroCoin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grainSeed = Math.floor(frame / 18);

  // flip rotateY pilote (spring), sync voix
  const flipP = spring({ frame: frame - F_FLIP_S, fps, config: { damping: 15, stiffness: 90 }, durationInFrames: F_FLIP_E - F_FLIP_S + 10 });
  const rotateY = interpolate(flipP, [0, 1], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showA = rotateY < 90;

  const dataOut = interpolate(frame, [F_FLIP_S - 12, F_FLIP_S + 2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // fissure + shake
  const fissure = interpolate(frame, [F_FISSURE, F_FISSURE + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = frame >= F_FISSURE && frame < F_FISSURE + 16 ? Math.sin(frame * 1.6) * 4 * (1 - (frame - F_FISSURE) / 16) : 0;

  const verdictP = spring({ frame: frame - F_VERDICT, fps, config: { damping: 16, stiffness: 115 }, durationInFrames: 24 });
  const verdictOp = ease(verdictP);
  const verdictScale = interpolate(verdictP, [0, 1], [0.96, 1], { extrapolateRight: "clamp" });

  const outVeil = interpolate(frame, [F_OUT, TOTAL], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // halo couleur (rouge->or au flip)
  const haloGold = ease(interpolate(rotateY, [80, 180], [0, 1]));

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={Math.round(OFFSET * 30)} volume={1} />
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")} startFrom={Math.round(OFFSET * 30)} volume={0.14} />
      <Sequence from={F_FLIP_S} durationInFrames={40}><Audio src={staticFile("souverain/senegal-petrole-gaz/audio/sfx/sfx-whoosh-transition.mp3")} volume={0.4} /></Sequence>
      <Sequence from={F_FISSURE} durationInFrames={40}><Audio src={staticFile("_shared/sfx/warmap/cedeao-snap.mp3")} volume={0.5} /></Sequence>

      {/* fond grain + vignette */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="grainIC"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={grainSeed} stitchTiles="stitch" result="n" /><feColorMatrix in="n" type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer><feComposite operator="over" in2="SourceGraphic" /></filter>
          <radialGradient id="vignIC"><stop offset="55%" stopColor="transparent" /><stop offset="100%" stopColor="rgba(8,12,22,0.55)" /></radialGradient>
        </defs>
        <rect width={W} height={H} fill="#000" filter="url(#grainIC)" opacity={0.4} />
        <rect width={W} height={H} fill="url(#vignIC)" />
        {/* halo derriere la piece */}
        <circle cx={CX} cy={CY} r={DIAM * 0.62} fill={`rgba(${Math.round(178 - haloGold * (178 - 231))},${Math.round(58 + haloGold * (189 - 58))},${Math.round(46 + haloGold * (120 - 46))},0.2)`} style={{ filter: "blur(50px)" }} />
      </svg>

      {/* === LE TEMPLATE COINFLIP 3D, pilote par la voix === */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${shake}px,0)`, top: CY - H / 2 }}>
        <CoinFlip
          rotateYExternal={rotateY}
          diameter={DIAM}
          showDotGrid={false}
          bgColor="transparent"
          faceA={{ icon: "ship", label: "", value: "", custom: <FaceMalediction />, accentColor: OCRE }}
          faceB={{ icon: "landmark", label: "", value: "", custom: <FaceMiracle />, accentColor: OCRE }}
        />
      </div>

      {/* fissure (overlay SVG par-dessus, sur Face B) */}
      {!showA && fissure > 0 && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <path d={`M${CX + 150},${CY - 230} L${CX + 50},${CY - 60} L${CX + 110},${CY + 40} L${CX - 40},${CY + 220}`}
            fill="none" stroke={NOIR} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fissure} />
          <path d={`M${CX + 150},${CY - 230} L${CX + 50},${CY - 60} L${CX + 110},${CY + 40} L${CX - 40},${CY + 220}`}
            fill="none" stroke={IVORY} strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fissure} opacity={0.5} />
        </svg>
      )}

      {/* data greffées Face A (étalées sur la narration d'intro) */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {frame >= F_DATA1 && <DataLabel ax={CX - DIAM * 0.55} ay={CY - 90} tx={CX - 130} ty={CY - 40} lines={["EXTRACTION", "SANS CONTRÔLE"]} appearF={F_DATA1} frame={frame} fps={fps} out={dataOut} />}
        {frame >= F_DATA2 && <DataLabel ax={CX + DIAM * 0.55} ay={CY - 50} tx={CX + 120} ty={CY - 10} lines={["DÉPENDANCE", "ÉCONOMIQUE"]} appearF={F_DATA2} frame={frame} fps={fps} out={dataOut} />}
        {frame >= F_DATA3 && <DataLabel ax={CX - DIAM * 0.5} ay={CY + 170} tx={CX - 100} ty={CY + 110} lines={["COÛT", "ENVIRONNEMENTAL"]} appearF={F_DATA3} frame={frame} fps={fps} out={dataOut} />}
      </svg>

      {/* titre de face */}
      <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.1, textAlign: "center", fontFamily: "Cinzel, serif", pointerEvents: "none" }}>
        <div style={{ fontSize: 22, letterSpacing: "0.35em", color: showA ? CRISIS : OCRE, opacity: 0.8 }}>{showA ? "FACE A" : "FACE B"}</div>
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "0.12em", color: IVORY, marginTop: 6, textShadow: "0 2px 14px #000" }}>
          {showA ? "« LA MALÉDICTION »" : "« LE MIRACLE »"}
        </div>
      </div>

      {/* verdict */}
      {verdictOp > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.8, textAlign: "center", opacity: verdictOp, transform: `scale(${verdictScale})`, pointerEvents: "none",
          fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: 80, fontWeight: 700, color: IVORY, letterSpacing: "0.06em", textShadow: "0 3px 18px #000" }}>
          DEUX ILLUSIONS CONSTRUITES
        </div>
      )}

      {outVeil > 0.01 && <AbsoluteFill style={{ background: NAVY_DEEP, opacity: outVeil }} />}
    </AbsoluteFill>
  );
};

export default SenegalScene1IntroCoin;
