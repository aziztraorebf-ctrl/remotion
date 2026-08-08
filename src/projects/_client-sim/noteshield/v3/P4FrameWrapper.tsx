// P4 (V3) — reprend P3QuatreSignaux (direction-b) tel quel pour la mecanique interne (4 lignes
// convergentes + score par paliers), et ajoute PAR-DESSUS deux couches en overlay :
// 1. Un cadre UI leger (bordure fine, style carte) autour de la zone de convergence pour ancrer
//    visuellement le lien SYSTEM->PRODUCT — cf STORYBOARD-V3-MIX-INCARNE.md § P4.
// 2. REFONTE 2026-08-08 (retour Aziz) : des DELTAS NUMERIQUES par signal ("+4", "+5", "+5",
//    "+4") qui apparaissent a l'endroit ou chaque pulse d'extraction (deja anime dans
//    P3QuatreSignaux) arrive au noeud de convergence, puis se dissolvent vers le compteur --
//    rend le CALCUL visible ("comment chaque signal influence le score"), pas seulement suggere
//    par la convergence geometrique. Wrapper pur (aucune modification du composant interne, deja
//    vivant/valide) -- les deltas sont recales sur les MEMES constantes de timing que le score
//    par paliers de P3QuatreSignaux (T_SCORE_START/SCORE_STEP_DUR, dupliquees ici en lecture
//    seule, jamais divergentes du fichier source).
//
// Coordonnees mesurees dans P3QuatreSignaux : noeud_convergence + score_final centres ~x=1720,
// y=540. Les 4 signaux (appareil/lieu/historique/comportement) sont extraits dans cet ordre et
// arrivent au noeud avec un leger stagger (i*0.18s sur le debut, i*0.05s sur la fin -- meme
// fichier, ExtractionPulse) : les deltas suivent le meme stagger pour rester synchro avec le
// pulse visuel qu'ils accompagnent.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { P3QuatreSignaux } from "../direction-b/P3QuatreSignaux";
import { NS_COLORS } from "../ui/theme";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// Le noeud de convergence apparait a T_CONVERGENCE=9.3s relatif dans P3QuatreSignaux (cf ce
// fichier). Le cadre UI entre juste apres, une fois qu'il y a quelque chose a encadrer.
const T_FRAME_IN_START = 9.5;
const T_FRAME_IN_DUR = 0.7;

const FRAME_X = 1420;
const FRAME_Y = 300;
const FRAME_W = 460;
const FRAME_H = 480;

// --- Deltas par signal (duplique en lecture seule depuis P3QuatreSignaux -- NE PAS diverger) ---
// SCORE_STEPS = [4, 9, 14, 18] -> deltas [+4, +5, +5, +4], un par signal dans l'ordre SIGNALS.
const T_SCORE_START = 9.5;
const T_SCORE_LOCK = 12.0;
const SCORE_STEPS = [4, 9, 14, 18];
const SCORE_STEP_DUR = (T_SCORE_LOCK - T_SCORE_START) / SCORE_STEPS.length;
const SIGNAL_DELTAS = [
  { key: "appareil", label: "APPAREIL", delta: 4, originX: 1440, originY: 330 },
  { key: "lieu", label: "LIEU", delta: 5, originX: 1440, originY: 470 },
  { key: "historique", label: "HISTORIQUE", delta: 5, originX: 1440, originY: 610 },
  { key: "comportement", label: "COMPORTEMENT", delta: 4, originX: 1440, originY: 750 },
] as const;
// ExtractionPulse (P3QuatreSignaux) : tStart = T_EXTRACTION + i*0.18, tEnd = T_CONVERGENCE + i*0.05.
// Origine des deltas = position reelle de chaque ligne juste avant sa convergence geometrique
// (mesuree dans APPAREIL_PTS/LIEU_PTS/HISTORIQUE_PTS/COMPORTEMENT_PTS de P3QuatreSignaux :
// y=330/470/610/750 a x~1420-1470, avant que les 4 lignes ne convergent vers y=540). Le delta
// part donc du MEME endroit que le pulse d'extraction qu'il accompagne, pas d'un point invente.
const T_EXTRACTION = 6.3;
const T_CONVERGENCE = 9.3;
const NODE_X = 1720; // centre du score_final (P3QuatreSignaux)
const NODE_Y = 540;

const SignalDelta: React.FC<{ index: number; label: string; delta: number; originX: number; originY: number }> = ({
  index,
  label,
  delta,
  originX,
  originY,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const tStart = T_EXTRACTION + index * 0.18;
  const tArrive = T_CONVERGENCE + index * 0.05;
  // Le delta suit le pulse visuel du signal correspondant : apparait pres du label, glisse vers
  // le noeud, s'estompe une fois arrive (le score du compteur central prend le relais au meme
  // instant via le palier de P3QuatreSignaux).
  const progress = interpolate(t, [tStart, tArrive], [0, 1], { ...clamp, easing: (x) => x * x });
  const x = originX + (NODE_X - originX) * progress;
  const y = originY + (NODE_Y - originY) * progress;
  const opacity = interpolate(
    t,
    [tStart, tStart + 0.18, tArrive - 0.1, tArrive + 0.22],
    [0, 1, 1, 0],
    clamp,
  );
  if (opacity <= 0) return null;
  const scale = interpolate(t, [tStart, tStart + 0.18], [0.6, 1], clamp);

  return (
    <g opacity={opacity} transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={-46} y={-22} width={92} height={44} rx={10} fill={NS_COLORS.navyDeep} opacity={0.75} />
      <rect x={-46} y={-22} width={92} height={44} rx={10} fill="none" stroke={NS_COLORS.cyan} strokeWidth={1.5} opacity={0.7} />
      <text
        x={0}
        y={7}
        textAnchor="middle"
        fill={NS_COLORS.cyan}
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={22}
        fontWeight={600}
      >
        +{delta}
      </text>
      <text
        x={0}
        y={-30}
        textAnchor="middle"
        fill={NS_COLORS.ivoryMuted}
        fontFamily="'IBM Plex Mono', monospace"
        fontSize={12}
        letterSpacing={1}
        opacity={0.85}
      >
        {label}
      </text>
    </g>
  );
};

export const P4FrameWrapper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const frameOpacity = interpolate(t, [T_FRAME_IN_START, T_FRAME_IN_START + T_FRAME_IN_DUR], [0, 1], clamp);
  // Respiration tres subtile une fois installe -- jamais un plat mort, coherent avec le reste du
  // panneau (regle jury motion : rien de statique >1s).
  const breathe = frameOpacity >= 1 ? Math.sin(t * (Math.PI * 2) / 3.2) * 2 : 0;

  return (
    <AbsoluteFill style={{ background: "#0A1628" }}>
      <P3QuatreSignaux />

      <svg
        viewBox="0 0 1920 1080"
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {SIGNAL_DELTAS.map((sig, i) => (
          <SignalDelta
            key={sig.key}
            index={i}
            label={sig.label}
            delta={sig.delta}
            originX={sig.originX}
            originY={sig.originY}
          />
        ))}

        <g opacity={frameOpacity} transform={`translate(0, ${breathe})`}>
          <rect
            x={FRAME_X}
            y={FRAME_Y}
            width={FRAME_W}
            height={FRAME_H}
            rx={20}
            fill="none"
            stroke={NS_COLORS.cyanDim}
            strokeWidth={1.5}
          />
          <rect
            x={FRAME_X}
            y={FRAME_Y}
            width={FRAME_W}
            height={54}
            rx={20}
            fill={NS_COLORS.navyPanel}
            opacity={0.55}
          />
          <rect x={FRAME_X} y={FRAME_Y + 34} width={FRAME_W} height={20} fill={NS_COLORS.navyPanel} opacity={0.55} />
          <circle cx={FRAME_X + 30} cy={FRAME_Y + 27} r={6} fill={NS_COLORS.cyan} opacity={0.85} />
          <text
            x={FRAME_X + 50}
            y={FRAME_Y + 34}
            fill={NS_COLORS.ivoryMuted}
            fontFamily="'IBM Plex Mono', monospace"
            fontSize={16}
            letterSpacing={1.5}
          >
            NORTHSHIELD — SUIVI EN TEMPS REEL
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
