import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

export const SPLIT_SCREEN_FRAMES = 300; // 10s

// ---------------------------------------------------------------------------
// PROTO R&D — SPLIT-SCREEN (scene visuelle gauche + explications data droite).
// Reprend la disposition prouvee de CartePanneau16x9 (60/40) mais generalisee :
//  - GAUCHE (60%) = une SCENE (ici SVG maquette : un cargo qui avance sur l'eau,
//    stand-in pour "n'importe quelle scene SVG" — le voyage Chicago, etc.).
//  - DROITE (40%) = panneau data epure (titre, chiffre-cle, liste chrono, barre)
//    qui SE CONSTRUIT en reaction, calé sur des frames (plus tard = la voix off).
// Objectif : prouver que gauche-narratif + droite-analytique cohabitent, epures.
//
// Determinisme total (SVG + interpolate par frame, zero asset externe ici).
// ---------------------------------------------------------------------------

const W = 1920;
const H = 1080;
const SPLIT = W * 0.6; // frontiere gauche/droite

const COL = {
  seaTop: "#1a3a52",
  seaBot: "#0d2536",
  sky: "#2a4a63",
  ink: "#e8dcc0",
  gold: "#e8b44a",
  danger: "#d6552e",
  panelBg: "#0e1626",
  panelLine: "#2a3a52",
  muted: "#6b7d94",
};

// petit cargo SVG (stand-in scene) — coque + conteneurs + cheminee
const CargoSVG: React.FC<{ f: number }> = ({ f }) => {
  const bob = Math.sin(f / 14) * 4; // tangage
  const roll = Math.sin(f / 18) * 1.2;
  return (
    <g transform={`translate(0 ${bob}) rotate(${roll} 0 0)`}>
      {/* coque */}
      <path d="M -150 40 L 160 40 L 130 100 L -120 100 Z" fill="#3a2a2a" stroke="#1a1010" strokeWidth={2} />
      {/* pont */}
      <rect x={-150} y={20} width={310} height={22} fill="#5a4a3a" />
      {/* conteneurs empiles */}
      {[0, 1, 2, 3, 4].map((c) => {
        const cols = ["#c0563a", "#c8a45e", "#3e7c5a", "#5a8fc0", "#c0563a"];
        return (
          <g key={c}>
            <rect x={-140 + c * 56} y={-14} width={50} height={34} fill={cols[c % cols.length]} stroke="#1a1010" strokeWidth={1.5} />
            <rect x={-140 + c * 56} y={-46} width={50} height={30} fill={cols[(c + 2) % cols.length]} stroke="#1a1010" strokeWidth={1.5} opacity={c < 4 ? 1 : 0} />
          </g>
        );
      })}
      {/* superstructure + cheminee */}
      <rect x={100} y={-30} width={44} height={50} fill="#e0d6c0" stroke="#1a1010" strokeWidth={1.5} />
      <rect x={116} y={-58} width={16} height={30} fill="#3a2a2a" />
    </g>
  );
};

export const SplitScreenProto16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // le cargo avance lentement (translation gauche->droite dans son panneau)
  const shipX = interpolate(frame, [0, SPLIT_SCREEN_FRAMES], [SPLIT * 0.25, SPLIT * 0.72]);
  const shipY = H * 0.56;

  // vagues (2 couches sin dephasees)
  const wavePath = (amp: number, len: number, yBase: number, phase: number) => {
    let d = `M 0 ${yBase}`;
    for (let x = 0; x <= SPLIT; x += 20) {
      const y = yBase + Math.sin(x / len + frame / 20 + phase) * amp;
      d += ` L ${x} ${y}`;
    }
    d += ` L ${SPLIT} ${H} L 0 ${H} Z`;
    return d;
  };

  // panneau droit : elements qui se construisent (regle des ~2s ici pour un proto court)
  const el = (start: number) =>
    spring({
      frame: Math.max(0, frame - start),
      fps,
      config: { mass: 1, damping: 15, stiffness: 90 },
      durationInFrames: 22,
    });

  const distProg = interpolate(frame, [90, 150], [0, 9200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const PX = SPLIT + 70; // marge gauche du panneau

  return (
    <AbsoluteFill style={{ backgroundColor: COL.panelBg }}>
      {/* ---------------- GAUCHE : la scene ---------------- */}
      <svg
        width={SPLIT}
        height={H}
        viewBox={`0 0 ${SPLIT} ${H}`}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COL.sky} />
            <stop offset="100%" stopColor="#15304a" />
          </linearGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COL.seaTop} />
            <stop offset="100%" stopColor={COL.seaBot} />
          </linearGradient>
        </defs>
        {/* ciel */}
        <rect x={0} y={0} width={SPLIT} height={H} fill="url(#sky)" />
        {/* soleil doux */}
        <circle cx={SPLIT * 0.72} cy={H * 0.22} r={70} fill={COL.gold} opacity={0.18} />
        <circle cx={SPLIT * 0.72} cy={H * 0.22} r={44} fill={COL.gold} opacity={0.28} />
        {/* mer (2 couches) */}
        <path d={wavePath(10, 120, H * 0.62, 0)} fill="url(#sea)" />
        <path d={wavePath(7, 90, H * 0.66, 1.5)} fill={COL.seaBot} opacity={0.6} />
        {/* le cargo */}
        <g transform={`translate(${shipX} ${shipY})`}>
          <CargoSVG f={frame} />
        </g>
        {/* legende scene */}
        <text x={50} y={H - 60} fill={COL.ink} fontSize={24} fontFamily="Georgia, serif" letterSpacing={3} opacity={0.7}>
          LA ROUTE MARITIME
        </text>
        <text x={50} y={H - 24} fill={COL.ink} fontSize={40} fontFamily="Georgia, serif" fontWeight={700}>
          Le trajet du cargo
        </text>
      </svg>

      {/* separateur */}
      <div style={{ position: "absolute", left: SPLIT - 1, top: 0, width: 2, height: H, background: COL.panelLine }} />

      {/* ---------------- DROITE : le panneau data ---------------- */}
      <div
        style={{
          position: "absolute",
          left: SPLIT,
          top: 0,
          width: W - SPLIT,
          height: H,
          background: COL.panelBg,
          fontFamily: "Georgia, serif",
          color: COL.ink,
        }}
      >
        {/* titre */}
        <div style={{ position: "absolute", left: 70, top: 90, opacity: el(20) }}>
          <div style={{ fontSize: 22, letterSpacing: 3, color: COL.muted }}>ACHEMINEMENT</div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>Ce que transporte la route</div>
        </div>

        {/* chiffre-cle : distance */}
        <div style={{ position: "absolute", left: 70, top: 230, opacity: el(80) }}>
          <span style={{ fontSize: 96, fontWeight: 700, color: COL.gold }}>
            {Math.round(distProg).toLocaleString("fr-FR")}
          </span>
          <span style={{ fontSize: 30, marginLeft: 10 }}>km</span>
          <div style={{ fontSize: 24, color: COL.muted, marginTop: 4 }}>distance parcourue</div>
        </div>

        {/* liste etapes qui s'allument */}
        {[
          { y: 400, s: 120, label: "Depart — port A", on: true },
          { y: 470, s: 160, label: "Detroit strategique", on: true },
          { y: 540, s: 200, label: "Arrivee — port B", on: false },
        ].map((it, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 70,
              top: it.y,
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: el(it.s),
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                background: it.on ? COL.gold : COL.muted,
                boxShadow: it.on ? `0 0 10px ${COL.gold}` : "none",
              }}
            />
            <span style={{ fontSize: 28, color: it.on ? COL.ink : COL.muted }}>{it.label}</span>
          </div>
        ))}

        {/* barre de progression cargaison */}
        <div style={{ position: "absolute", left: 70, top: 660, width: W - SPLIT - 140, opacity: el(230) }}>
          <div style={{ fontSize: 22, letterSpacing: 2, color: COL.muted, marginBottom: 12 }}>
            CHARGEMENT
          </div>
          <div style={{ width: "100%", height: 22, background: "#1a2740", borderRadius: 4, overflow: "hidden" }}>
            <div
              style={{
                width: `${interpolate(frame, [230, 290], [0, 84], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}%`,
                height: "100%",
                background: `linear-gradient(90deg, #a67c2e, ${COL.gold})`,
              }}
            />
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: COL.gold, marginTop: 10 }}>
            84% <span style={{ fontSize: 22, color: COL.ink, fontWeight: 400 }}>de la capacite</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
