import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, staticFile } from "remotion";
import { INK, PARCH, PARCH_DIM, DATAVIZ_BG } from "../../_shared/svg-library/palette";
import khartoumData from "./data/khartoum-outline.json";

// Beat #5 — 15 avril 2023, matin : la RSF attaque simultanement 3 cibles a Khartoum
// (aeroport international, palais presidentiel, tour TV). Assemblage sequentiel
// (jamais simultane, cf. episodes/warmap-sahel/DECISION-jetons-vs-vehicules.md).
export const PROTO_ASSEMBLAGE_KHARTOUM_BEAT5_FRAMES = 810; // 27s @ 30fps

const RSF = "#3b2558";

type TargetKey = "aeroport" | "palais" | "tourtv";

const TARGETS: Record<TargetKey, { x: number; y: number; label: string; calloutSide: "left" | "right" }> = {
  aeroport: { x: 560, y: 760, label: "AEROPORT INTERNATIONAL", calloutSide: "left" },
  palais: { x: 1120, y: 520, label: "PALAIS PRESIDENTIEL", calloutSide: "right" },
  tourtv: { x: 900, y: 260, label: "TOUR TV — OMDURMAN", calloutSide: "left" },
};

const RSF_START = { x: 1550, y: 880 };

// --- Phases (chacune ~180 frames / 6s), 45f etablissement + 45f resolution ---
const ESTABLISH_END = 45;
const PHASE_LEN = 180;
const PHASE_STARTS: Record<TargetKey, number> = {
  aeroport: ESTABLISH_END,
  palais: ESTABLISH_END + PHASE_LEN,
  tourtv: ESTABLISH_END + PHASE_LEN * 2,
};
const RESOLUTION_START = ESTABLISH_END + PHASE_LEN * 3;

// --- Terrain : contour Khartoum precompute (d3-geo geoMercator, fitExtent 220,180 -> 1700,900) ---

const KhartoumTerrain: React.FC = () => (
  <g>
    <defs>
      <pattern id="hatchTerrain" patternUnits="userSpaceOnUse" width={18} height={18}>
        <path d="M0 18 L18 0" stroke={INK} strokeWidth={1} opacity={0.05} />
      </pattern>
    </defs>

    {Object.values(khartoumData.neighborPaths).map((d, i) => (
      <path key={i} d={d as string} fill={PARCH_DIM} fillOpacity={0.12} stroke={INK} strokeWidth={1.5} opacity={0.35} />
    ))}

    <path d={khartoumData.khartoumPath} fill="#d1b27c" fillOpacity={0.9} stroke={INK} strokeWidth={2.5} />
    <path d={khartoumData.khartoumPath} fill="url(#hatchTerrain)" />

    {/* confluent Nil Bleu / Nil Blanc, stylise */}
    <path
      d="M 700 520 Q 850 480 950 500 Q 1050 520 1150 470"
      fill="none"
      stroke="#596777"
      strokeWidth={18}
      opacity={0.18}
      strokeLinecap="round"
    />
    <path d="M 700 520 Q 850 480 950 500 Q 1050 520 1150 470" fill="none" stroke="#596777" strokeWidth={3} opacity={0.28} />
  </g>
);

// --- Bandeau vignette : cadre parchemin commun pour les 3 cibles (Gemini PNG ou SVG local) ---

const TargetCallout: React.FC<{
  targetKey: TargetKey;
  frame: number;
  revealAt: number;
}> = ({ targetKey, frame, revealAt }) => {
  const t = frame - revealAt;
  if (t < 0) return null;

  const progress = spring({ frame: t, fps: 30, config: { damping: 20, mass: 1 } });
  const target = TARGETS[targetKey];
  const calloutW = 300;
  const calloutH = 168;
  const calloutX = target.calloutSide === "left" ? target.x - calloutW - 90 : target.x + 90;
  const calloutY = target.y - calloutH / 2;

  const lineX2 = target.calloutSide === "left" ? calloutX + calloutW : calloutX;

  return (
    <g opacity={progress}>
      <line
        x1={target.x}
        y1={target.y}
        x2={lineX2}
        y2={target.y}
        stroke={PARCH}
        strokeWidth={2}
        strokeDasharray="6 4"
        opacity={0.7}
      />
      <g transform={`translate(${calloutX} ${calloutY}) scale(${0.85 + progress * 0.15})`} style={{ transformOrigin: `${calloutW / 2}px ${calloutH / 2}px` }}>
        <rect x={-6} y={-6} width={calloutW + 12} height={calloutH + 12} fill="#c9a15a" stroke={INK} strokeWidth={2} />
        <rect x={0} y={0} width={calloutW} height={calloutH} fill="#e8dcc0" stroke={INK} strokeWidth={2} />
        {targetKey === "aeroport" ? (
          <g transform={`translate(${calloutW / 2} ${calloutH / 2}) scale(1.55)`}>
            <AeroportPictogram />
          </g>
        ) : (
          <image
            href={staticFile(
              targetKey === "palais"
                ? "_shared/sprites/soudan-batiments/palais-presidentiel-integre.png"
                : "_shared/sprites/soudan-batiments/station-tv-integre.png"
            )}
            x={10}
            y={10}
            width={calloutW - 20}
            height={calloutH - 20}
            preserveAspectRatio="xMidYMid slice"
          />
        )}
        <rect x={0} y={calloutH - 30} width={calloutW} height={30} fill={INK} opacity={0.85} />
        <text
          x={calloutW / 2}
          y={calloutH - 10}
          textAnchor="middle"
          fill={PARCH}
          fontSize={14}
          fontFamily="Georgia, serif"
          fontWeight="bold"
          letterSpacing={1}
        >
          {target.label}
        </text>
      </g>
    </g>
  );
};

const AeroportPictogram: React.FC = () => (
  <g>
    <rect x="-38" y="-4.2" width="76" height="8.4" fill="#948566" stroke={INK} strokeWidth={0.35} />
    <rect x="-37" y="-3" width="74" height="6" fill="#8a7c5e" stroke={INK} strokeWidth={0.4} />
    <line x1="-34" y1="0" x2="34" y2="0" stroke={INK} strokeWidth={0.35} strokeDasharray="2.2,1.8" />
    <polygon points="-30,14 22,14 27,29 -22,32" fill="#877a5c" stroke={INK} strokeWidth={0.45} />
    <rect x="-19" y="19" width="34" height="7.5" fill="#7a6d53" stroke={INK} strokeWidth={0.45} />
    <rect x="-9" y="26.5" width="3.4" height="7" fill="#7a6d53" stroke={INK} strokeWidth={0.35} />
    <rect x="0" y="26.5" width="3.4" height="7.5" fill="#7a6d53" stroke={INK} strokeWidth={0.35} />
    <rect x="9" y="26.5" width="3.4" height="6.5" fill="#7a6d53" stroke={INK} strokeWidth={0.35} />
  </g>
);

// --- Colonne RSF en mouvement : 3 vehicules stylises glissant vers la cible active ---

const RsfColumn: React.FC<{ x: number; y: number; angle: number }> = ({ x, y, angle }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    {[
      { dx: 10, dy: -15 },
      { dx: 0, dy: 0 },
      { dx: -10, dy: 15 },
    ].map((offset, i) => (
      <g key={i} transform={`translate(${offset.dx} ${offset.dy})`}>
        <line x1={-10} y1={-2} x2={-24} y2={-2} stroke={INK} strokeWidth={1.5} strokeDasharray="5 3" />
        <line x1={-10} y1={2} x2={-22} y2={2} stroke={INK} strokeWidth={1.5} strokeDasharray="5 3" />
        <rect x={-8} y={-4} width={16} height={8} rx={1} fill={RSF} stroke={INK} strokeWidth={2} />
        <rect x={2} y={-3} width={4} height={6} fill={RSF} stroke={INK} strokeWidth={2} />
        <circle cx={4} cy={0} r={1.5} fill={INK} />
        <line x1={4} y1={0} x2={12} y2={0} stroke={INK} strokeWidth={2} />
      </g>
    ))}
  </g>
);

// --- Impact corrige : halo reduit a rayon max ~17 (bug source: rayon ~29, couvrait le batiment) ---

const Impact: React.FC<{ x: number; y: number; frame: number; startFrame: number }> = ({ x, y, frame, startFrame }) => {
  const t = frame - startFrame;
  if (t < 0) return null;

  const haloScale = interpolate(t, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const haloOpacity = interpolate(t, [0, 8, 40], [0, 0.4, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flameOpacity = interpolate(t, [0, 5, 50], [0, 1, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shardOpacity = interpolate(t, [0, 3, 12], [0, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g transform={`translate(${x} ${y})`}>
      {/* halo corrige : rayon max ~17 (vs ~29 original), reste sous le batiment sans le couvrir */}
      <g transform={`scale(${haloScale})`}>
        <path
          d="M -13,1.7 Q -17,-4.6 -11,-11 Q -3.5,-17 5.3,-13.5 Q 13.5,-10 15.8,-2.3 Q 17,6.5 11,12.3 Q 3.5,17 -6.4,13.5 Q -15,10 -13,1.7 Z"
          fill="#8b2a2a"
          fillOpacity={haloOpacity}
          stroke="#5a2c22"
          strokeWidth={1.2}
        />
      </g>
      <g opacity={flameOpacity}>
        <polygon points="0,-9 -4.5,4 4.5,4" fill="#8b2a2a" stroke={INK} strokeWidth={1.2} />
        <polygon points="0,-4 -2,4 2,4" fill={PARCH} stroke={INK} strokeWidth={1} />
      </g>
      <g opacity={shardOpacity}>
        <circle cx={-9} cy={-6} r={1.3} fill={INK} />
        <circle cx={10} cy={-8} r={1.3} fill={INK} />
        <line x1={8} y1={9} x2={12} y2={13} stroke={INK} strokeWidth={1.3} />
      </g>
    </g>
  );
};

// --- Phase d'une cible : lecture -> manoeuvre -> contact ---

const TargetPhase: React.FC<{ targetKey: TargetKey; frame: number; phaseStart: number }> = ({
  targetKey,
  frame,
  phaseStart,
}) => {
  const t = frame - phaseStart;
  if (t < 0) return null;

  const target = TARGETS[targetKey];
  const contactAt = 110;

  const advance = spring({ frame: t, fps: 30, config: { damping: 22, mass: 1.3 } });
  const colX = interpolate(advance, [0, 1], [RSF_START.x, target.x]);
  const colY = interpolate(advance, [0, 1], [RSF_START.y, target.y]);

  const dx = target.x - RSF_START.x;
  const dy = target.y - RSF_START.y;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  const arrowLength = Math.hypot(dx, dy);
  const arrowProgress = spring({ frame: t - 5, fps: 30, config: { damping: 18, mass: 1 } });
  const arrowDashOffset = arrowLength * (1 - arrowProgress);

  const showColumn = t < contactAt + 6;
  // la trace de manoeuvre s'estompe apres le contact pour ne pas encombrer l'ecran
  // une fois les 3 cibles reliees (sinon effet "spaghetti" en phase de resolution)
  const traceOpacity = interpolate(t, [0, contactAt, contactAt + 20], [0.6, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g>
      <path
        d={`M ${RSF_START.x} ${RSF_START.y} L ${target.x} ${target.y}`}
        fill="none"
        stroke={PARCH}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={`${arrowLength} ${arrowLength}`}
        strokeDashoffset={arrowDashOffset}
        opacity={traceOpacity}
      />
      {showColumn && <RsfColumn x={colX} y={colY} angle={angle} />}
      <Impact x={target.x} y={target.y} frame={frame} startFrame={phaseStart + contactAt} />
    </g>
  );
};

export const ProtoAssemblageKhartoumBeat5: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOp = interpolate(frame, [5, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dateOp = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // camera shake au contact de chaque cible
  const contactFrames = (Object.keys(PHASE_STARTS) as TargetKey[]).map((k) => PHASE_STARTS[k] + 110);
  let shakeX = 0;
  let shakeY = 0;
  for (const cf of contactFrames) {
    const local = frame - cf;
    if (local >= 0 && local < 7) {
      shakeX = Math.sin(local * 7) * 4;
      shakeY = Math.cos(local * 9) * 3;
    }
  }

  const revealed: TargetKey[] = [];
  (Object.keys(PHASE_STARTS) as TargetKey[]).forEach((k) => {
    if (frame >= PHASE_STARTS[k] + 105) revealed.push(k);
  });

  const subtitleFor = (): string => {
    if (frame < ESTABLISH_END) return "Khartoum, 15 avril 2023, au matin.";
    if (frame < PHASE_STARTS.palais) return "La RSF frappe l'aeroport international en premier.";
    if (frame < PHASE_STARTS.tourtv) return "Puis la colonne converge vers le palais presidentiel.";
    if (frame < RESOLUTION_START) return "La tour TV d'Omdurman tombe a son tour.";
    return "Trois cibles, une seule matinee. Khartoum bascule dans la guerre.";
  };

  const resolutionOp = interpolate(frame, [RESOLUTION_START, RESOLUTION_START + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: DATAVIZ_BG }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", transform: `translate(${shakeX}px, ${shakeY}px)` }}>
        <KhartoumTerrain />

        <text
          x={960}
          y={80}
          textAnchor="middle"
          fill={PARCH}
          fontSize={34}
          fontFamily="Georgia, serif"
          fontWeight="bold"
          letterSpacing={2}
          opacity={titleOp}
        >
          KHARTOUM — ATTAQUE COORDONNEE DE LA RSF
        </text>
        <text
          x={960}
          y={112}
          textAnchor="middle"
          fill={PARCH_DIM}
          fontSize={20}
          fontFamily="Georgia, serif"
          fontStyle="italic"
          opacity={dateOp}
        >
          15 avril 2023
        </text>

        <TargetPhase targetKey="aeroport" frame={frame} phaseStart={PHASE_STARTS.aeroport} />
        <TargetPhase targetKey="palais" frame={frame} phaseStart={PHASE_STARTS.palais} />
        <TargetPhase targetKey="tourtv" frame={frame} phaseStart={PHASE_STARTS.tourtv} />

        {revealed.includes("aeroport") && (
          <TargetCallout targetKey="aeroport" frame={frame} revealAt={PHASE_STARTS.aeroport + 105} />
        )}
        {revealed.includes("palais") && (
          <TargetCallout targetKey="palais" frame={frame} revealAt={PHASE_STARTS.palais + 105} />
        )}
        {revealed.includes("tourtv") && (
          <TargetCallout targetKey="tourtv" frame={frame} revealAt={PHASE_STARTS.tourtv + 105} />
        )}

        <g opacity={frame < RESOLUTION_START ? 1 : resolutionOp}>
          <rect x={520} y={980} width={880} height={64} fill={DATAVIZ_BG} stroke={PARCH} strokeWidth={1} opacity={0.9} />
          <text x={960} y={1020} textAnchor="middle" fill={PARCH} fontSize={22} fontFamily="Georgia, serif" fontStyle="italic">
            {subtitleFor()}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
