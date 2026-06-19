/**
 * SenegalScene1IntroCoin — INTRO scene 1 V3 "LE DUEL DES RECITS" en COIN-FLIP (~25s, REMOTION PUR).
 *
 * Storyboard Gemini (multi-planche) + breakdown GPT-5.5. Concept (valide Aziz) : une PIECE biface = le
 * pivot Data-Hero. Face A "LA MALEDICTION" (derrick/navire rouge) <-> Face B "LE MIRACLE" (monument or).
 * Le FLIP = le geste de retourner le recit. Puis FISSURE -> les 2 lectures sont des illusions.
 *
 * Cale sur l'audio V3 (forced alignment) :
 *   f0   (23.5s) "ces deux recits"            -> Face A apparait
 *   f355 (35.3s) "multinationales qui pompent" -> Face A + data greffees (malediction)
 *   f476 (39.4s) "de l'autre, une nation..."   -> FLIP vers Face B (miracle)
 *   f593 (43.3s) "se joue ailleurs"            -> FISSURE + verdict "DEUX ILLUSIONS"
 *   f740 (48.2s) "teste en direct"             -> fin (sortie vers la carte Mapbox, gere par le parent)
 *
 * Tout codable SVG (zero asset) : pièce = cercles+gradients+dents, derrick/monument = paths/Lucide,
 * fissure = strokeDashoffset (comme le hook). Charte navy/or/ivoire/crisis. Spring partout, grain anime.
 */
import React from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Sequence } from "remotion";
import { Landmark, Ship } from "lucide-react";

const W = 1920, H = 1080;
const NAVY = "#16213a", NAVY_DEEP = "#0d1424", OCRE = "#e7bd78", OCRE_DARK = "#bf9442";
const IVORY = "#f2ebd9", CRISIS = "#b23a2e", CRISIS_DARK = "#7d2118", NOIR = "#050505";

const OFFSET = 23.5;
const tl = (s: number) => Math.round((s - OFFSET) * 30);
const F_FACEA   = tl(34.8);   // Face A se charge en malediction (avant "multinationales")
const F_DATA    = tl(35.6);   // data greffees
const F_FLIP    = tl(38.9);   // FLIP (avant "de l'autre" 39.4s : image precede)
const F_FACEB   = tl(41.2);   // Face B revelee
const F_FISSURE = tl(42.8);   // fissure (avant "ailleurs" 43.3s)
const F_VERDICT = tl(43.8);   // "DEUX ILLUSIONS"
const F_OUT     = tl(47.0);   // sortie vers carte
const TOTAL     = tl(48.5);

const CX = W / 2, CY = H * 0.46, R = 230;

const ease = (p: number) => interpolate(p, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// ---- une face de la piece (contenu custom) ----
const FaceA: React.FC<{ frame: number }> = ({ frame }) => {
  const reveal = ease(interpolate(frame, [F_FACEA, F_FACEA + 20], [0, 1]));
  return (
    <g opacity={reveal}>
      {/* mer rouge (bas de la piece) */}
      <clipPath id="coinClipA"><circle cx={CX} cy={CY} r={R - 14} /></clipPath>
      <g clipPath="url(#coinClipA)">
        <rect x={CX - R} y={CY + 20} width={R * 2} height={R} fill={CRISIS} opacity={0.85} />
        <path d={`M${CX - R},${CY + 30} q40,-14 80,0 t80,0 t80,0 t80,0 t80,0`} stroke={IVORY} strokeWidth={3} fill="none" opacity={0.4} />
        <path d={`M${CX - R},${CY + 55} q40,-12 80,0 t80,0 t80,0 t80,0 t80,0`} stroke={CRISIS_DARK} strokeWidth={3} fill="none" opacity={0.6} />
      </g>
      {/* navire + derrick (Lucide Ship en rouge sur l'eau) */}
      <g transform={`translate(${CX - 36},${CY - 60})`} opacity={reveal}>
        <Ship size={72} color={CRISIS} strokeWidth={1.6} />
      </g>
      {/* derrick triangulaire (extraction) */}
      <g stroke={CRISIS} strokeWidth={4} fill="none" strokeLinecap="round" opacity={reveal}>
        <line x1={CX + 60} y1={CY - 90} x2={CX + 40} y2={CY + 10} />
        <line x1={CX + 60} y1={CY - 90} x2={CX + 80} y2={CY + 10} />
        <line x1={CX + 60} y1={CY - 90} x2={CX + 60} y2={CY + 10} />
        <line x1={CX + 48} y1={CY - 40} x2={CX + 72} y2={CY - 40} />
      </g>
    </g>
  );
};

const FaceB: React.FC<{ frame: number }> = ({ frame }) => {
  const reveal = ease(interpolate(frame, [F_FACEB, F_FACEB + 18], [0, 1]));
  return (
    <g opacity={reveal}>
      {/* monument souverainete (Lucide Landmark dore) */}
      <g transform={`translate(${CX - 52},${CY - 56})`}>
        <Landmark size={104} color={OCRE} strokeWidth={1.4} />
      </g>
      {/* socle + lignes "developpement" */}
      <line x1={CX - 80} y1={CY + 70} x2={CX + 80} y2={CY + 70} stroke={OCRE} strokeWidth={3} opacity={0.7} />
      <line x1={CX - 55} y1={CY + 85} x2={CX + 55} y2={CY + 85} stroke={OCRE} strokeWidth={2} opacity={0.4} />
    </g>
  );
};

// label greffe avec trait fin (Data-Hero)
const DataLabel: React.FC<{ x: number; y: number; tx: number; ty: number; lines: string[]; appearF: number; frame: number; fps: number; out: number }>
  = ({ x, y, tx, ty, lines, appearF, frame, fps, out }) => {
  const p = spring({ frame: frame - appearF, fps, config: { damping: 20, stiffness: 150 }, durationInFrames: 22 });
  const op = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" }) * out;
  const draw = interpolate(frame, [appearF, appearF + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <line x1={x} y1={y} x2={x + (tx - x) * draw} y2={y + (ty - y) * draw} stroke="rgba(242,235,217,0.7)" strokeWidth={1.4} />
      <circle cx={tx} cy={ty} r={3} fill={CRISIS} opacity={draw} />
      <text x={x} y={y} fill={IVORY} fontFamily="'IBM Plex Mono', monospace" fontSize={20} fontWeight={600}
        textAnchor={x < CX ? "end" : "start"} letterSpacing="1">
        {lines.map((l, i) => <tspan key={i} x={x} dy={i === 0 ? 0 : 24} fill={i === 0 ? CRISIS : "rgba(242,235,217,0.65)"}>{l}</tspan>)}
      </text>
    </g>
  );
};

export const SenegalScene1IntroCoin: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grainSeed = Math.floor(frame / 18);

  // pop-in pièce
  const popIn = spring({ frame: frame - F_FACEA, fps, config: { damping: 18, stiffness: 120 }, durationInFrames: 18 });
  const coinScale = interpolate(popIn, [0, 1], [0.72, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const coinOp = interpolate(popIn, [0, 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // flip rotateY 0->180 (spring)
  const flipP = spring({ frame: frame - F_FLIP, fps, config: { damping: 14, stiffness: 105 }, durationInFrames: 55 });
  const rotateY = interpolate(flipP, [0, 1], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const showA = rotateY < 90;
  // tranche visible autour de 90deg
  const trancheK = interpolate(Math.abs(rotateY - 90), [0, 35], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // motion blur léger au pic de vitesse
  const flipSpeed = Math.abs(rotateY - 90) < 45 ? interpolate(Math.abs(rotateY - 90), [0, 45], [3, 0]) : 0;

  // data labels sortent (out) au flip
  const dataOut = interpolate(frame, [F_FLIP - 10, F_FLIP + 5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // fissure
  const fissure = interpolate(frame, [F_FISSURE, F_FISSURE + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shake = frame >= F_FISSURE && frame < F_FISSURE + 16 ? Math.sin(frame * 1.6) * 4 * (1 - (frame - F_FISSURE) / 16) : 0;

  // verdict
  const verdictP = spring({ frame: frame - F_VERDICT, fps, config: { damping: 16, stiffness: 115 }, durationInFrames: 24 });
  const verdictOp = interpolate(verdictP, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const verdictScale = interpolate(verdictP, [0, 1], [0.96, 1], { extrapolateRight: "clamp" });

  // halo : rouge (malediction) -> or (miracle)
  const haloGold = ease(interpolate(rotateY, [90, 180], [0, 1]));
  const haloColor = `rgba(${Math.round(178 - haloGold * (178 - 231))},${Math.round(58 + haloGold * (189 - 58))},${Math.round(46 + haloGold * (120 - 46))},`;

  // sortie : fade navy (la faille devient la mer, bascule carte dans le parent)
  const outVeil = interpolate(frame, [F_OUT, TOTAL], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={Math.round(OFFSET * 30)} volume={1} />
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")} startFrom={Math.round(OFFSET * 30)} volume={0.14} />
      <Sequence from={F_FLIP} durationInFrames={40}><Audio src={staticFile("souverain/senegal-petrole-gaz/audio/sfx/sfx-whoosh-transition.mp3")} volume={0.4} /></Sequence>
      <Sequence from={F_FISSURE} durationInFrames={40}><Audio src={staticFile("_shared/sfx/warmap/cedeao-snap.mp3")} volume={0.5} /></Sequence>

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="coinGrad" cx="40%" cy="38%"><stop offset="0%" stopColor="#f6e2b0" /><stop offset="55%" stopColor={OCRE} /><stop offset="100%" stopColor={OCRE_DARK} /></radialGradient>
          <filter id="grainI"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={grainSeed} stitchTiles="stitch" result="n" /><feColorMatrix in="n" type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer><feComposite operator="over" in2="SourceGraphic" /></filter>
        </defs>
        {/* fond grain + vignette */}
        <rect width={W} height={H} fill="#000" filter="url(#grainI)" opacity={0.4} />
        <rect width={W} height={H} fill="url(#coinGrad)" opacity={0} />
        <radialGradient id="vign"><stop offset="55%" stopColor="transparent" /><stop offset="100%" stopColor="rgba(8,12,22,0.5)" /></radialGradient>
        <rect width={W} height={H} fill="url(#vign)" />

        {/* halo derriere la piece */}
        <circle cx={CX} cy={CY} r={R * 1.35} fill={`${haloColor}${0.18 * coinOp})`} style={{ filter: "blur(40px)" }} />

        {/* === PIECE === */}
        <g transform={`translate(${shake},0)`} opacity={coinOp} style={{ filter: flipSpeed > 0 ? `blur(${flipSpeed}px)` : "none" }}>
          {/* simulation flip : scaleX = cos(rotateY) */}
          <g transform={`translate(${CX},${CY}) scale(${Math.max(0.04, Math.abs(Math.cos(rotateY * Math.PI / 180))) * coinScale}, ${coinScale}) translate(${-CX},${-CY})`}>
            {/* disque or */}
            <circle cx={CX} cy={CY} r={R} fill="url(#coinGrad)" stroke={IVORY} strokeWidth={2} />
            <circle cx={CX} cy={CY} r={R - 8} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
            <circle cx={CX} cy={CY} r={R - 20} fill="none" stroke={OCRE_DARK} strokeWidth={1} opacity={0.5} />
            {/* perles du bord */}
            {Array.from({ length: 60 }).map((_, i) => {
              const a = (i / 60) * Math.PI * 2;
              return <circle key={i} cx={CX + Math.cos(a) * (R - 4)} cy={CY + Math.sin(a) * (R - 4)} r={1.6} fill={OCRE_DARK} opacity={0.5} />;
            })}
            {/* contenu face A ou B */}
            {showA ? <FaceA frame={frame} /> : <FaceB frame={frame} />}
            {/* fissure sur Face B */}
            {!showA && fissure > 0 && (
              <>
                <path d={`M${CX + 120},${CY - 170} L${CX + 40},${CY - 40} L${CX + 90},${CY + 30} L${CX - 30},${CY + 160}`}
                  fill="none" stroke={NOIR} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"
                  pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fissure} />
                <path d={`M${CX + 120},${CY - 170} L${CX + 40},${CY - 40} L${CX + 90},${CY + 30} L${CX - 30},${CY + 160}`}
                  fill="none" stroke={IVORY} strokeWidth={1.5} strokeLinecap="round"
                  pathLength={1} strokeDasharray={1} strokeDashoffset={1 - fissure} opacity={0.5} />
              </>
            )}
          </g>
          {/* tranche crénelée (au milieu du flip) */}
          {trancheK > 0.05 && (
            <g opacity={trancheK}>
              <rect x={CX - 22 * trancheK} y={CY - R} width={44 * trancheK} height={R * 2} rx={8} fill={OCRE} />
              {Array.from({ length: 26 }).map((_, i) => (
                <rect key={i} x={CX - 22 * trancheK} y={CY - R + i * (R * 2 / 26)} width={44 * trancheK} height={3} fill={OCRE_DARK} opacity={0.6} />
              ))}
            </g>
          )}
        </g>

        {/* data greffées Face A (malediction) */}
        {frame >= F_DATA && (
          <>
            <DataLabel x={CX - R - 90} y={CY - 70} tx={CX - 60} ty={CY - 30} lines={["EXTRACTION", "SANS CONTRÔLE"]} appearF={F_DATA} frame={frame} fps={fps} out={dataOut} />
            <DataLabel x={CX + R + 90} y={CY - 40} tx={CX + 50} ty={CY - 10} lines={["DÉPENDANCE", "ÉCONOMIQUE"]} appearF={F_DATA + 12} frame={frame} fps={fps} out={dataOut} />
            <DataLabel x={CX - R - 70} y={CY + 120} tx={CX - 40} ty={CY + 70} lines={["COÛT", "ENVIRONNEMENTAL"]} appearF={F_DATA + 24} frame={frame} fps={fps} out={dataOut} />
          </>
        )}
      </svg>

      {/* titre de face (HTML) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.13, textAlign: "center", opacity: coinOp, fontFamily: "Cinzel, serif", pointerEvents: "none" }}>
        <div style={{ fontSize: 22, letterSpacing: "0.35em", color: showA ? CRISIS : OCRE, opacity: 0.8 }}>{showA ? "FACE A" : "FACE B"}</div>
        <div style={{ fontSize: 54, fontWeight: 700, letterSpacing: "0.12em", color: IVORY, marginTop: 6, textShadow: "0 2px 14px #000" }}>
          {showA ? "« LA MALÉDICTION »" : "« LE MIRACLE »"}
        </div>
      </div>

      {/* verdict final */}
      {verdictOp > 0.01 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.74, textAlign: "center", opacity: verdictOp, transform: `scale(${verdictScale})`, pointerEvents: "none",
          fontFamily: "'Bebas Neue','Impact',sans-serif", fontSize: 76, fontWeight: 700, color: IVORY, letterSpacing: "0.06em", textShadow: "0 3px 18px #000" }}>
          DEUX ILLUSIONS CONSTRUITES
        </div>
      )}

      {outVeil > 0.01 && <AbsoluteFill style={{ background: NAVY_DEEP, opacity: outVeil }} />}
    </AbsoluteFill>
  );
};

export default SenegalScene1IntroCoin;
