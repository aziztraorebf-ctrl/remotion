import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import {
  NEON_DEFS,
  NEON_FOND,
  NEON_GRILLE,
  NEON_ECRAN,
  NEON_FLUX_PATHS,
  NEON_FLUX_LABELS,
  NEON_NODES,
  NEON_ALERT_TARGETS,
  NEON_ALERT_STATIC,
  NEON_HUD,
  NEON_TITRES,
} from "./neonGroups";

export const NEON_TERMINAL_FRAMES = 300; // 10s

// ---------------------------------------------------------------------------
// SCENE NEON/DATA-TERMINAL animee. Matiere = Fable 5 (statique, groupes nommes).
// Vie = code React par frame (doctrine SVG : LLM=matiere, code=vie).
// Gestes : grille qui s'etablit, ecran fade-in, noeuds qui pulsent, flux qui
// circulent (dash defile), anneaux sonar d'alerte, scanline qui balaie.
// ---------------------------------------------------------------------------

const W = 1920;
const H = 1080;

// helper injection : wrapper <g> anime + contenu statique injecte
const Inject: React.FC<{ html: string; opacity?: number; transform?: string }> = ({
  html,
  opacity = 1,
  transform,
}) => <g opacity={opacity} transform={transform} dangerouslySetInnerHTML={{ __html: html }} />;

export const NeonTerminalAnime16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const grilleIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const ecranIn = interpolate(frame, [15, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titreIn = interpolate(frame, [5, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // scanline verticale qui balaie l'ecran
  const scanY = interpolate(frame % 120, [0, 120], [150, 850]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05080f" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs dangerouslySetInnerHTML={{ __html: NEON_DEFS }} />

        <Inject html={NEON_FOND} />
        <Inject html={NEON_GRILLE} opacity={grilleIn} />
        <Inject html={NEON_ECRAN} opacity={ecranIn} />

        {/* FLUX qui se tracent puis circulent (dash defile) */}
        {NEON_FLUX_PATHS.map((f, i) => {
          const start = 50 + i * 18;
          const draw = interpolate(frame, [start, start + 40], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (draw <= 0.01) return null;
          const flow = (frame * 2.5) % 28;
          return (
            <g key={i} opacity={draw}>
              {/* trait de base */}
              <path d={f.d} fill="none" stroke={f.color} strokeWidth={f.w} opacity={0.35} />
              {/* gouttes qui circulent (visible une fois trace) */}
              <path
                d={f.d}
                fill="none"
                stroke={f.color}
                strokeWidth={f.w}
                strokeDasharray="16 12"
                strokeDashoffset={draw >= 1 ? -flow : 0}
                markerEnd={`url(#${f.marker})`}
                filter="url(#glow-soft)"
                opacity={0.95}
              />
            </g>
          );
        })}
        <Inject html={NEON_FLUX_LABELS} opacity={ecranIn} />

        {/* NOEUDS : apparition echelonnee + pulse permanent pour ceux marques */}
        {NEON_NODES.map((n, i) => {
          const app = spring({
            frame: Math.max(0, frame - (40 + i * 10)),
            fps,
            config: { mass: 1, damping: 13, stiffness: 100 },
            durationInFrames: 24,
          });
          if (app <= 0.01) return null;
          const pulse = n.pulse ? 1 + 0.06 * Math.sin(frame / 9 + i) : 1;
          return (
            <g
              key={n.id}
              opacity={app}
              transform={`translate(${n.cx} ${n.cy}) scale(${pulse}) translate(${-n.cx} ${-n.cy})`}
              dangerouslySetInnerHTML={{ __html: n.content }}
            />
          );
        })}

        {/* ANNEAUX SONAR d'alerte : r qui grandit + opacite qui decroit, en boucle */}
        {NEON_ALERT_TARGETS.map((t, i) => {
          const cycle = (frame + i * 30) % 60;
          const r = interpolate(cycle, [0, 60], [30, 90]);
          const op = interpolate(cycle, [0, 60], [0.8, 0]);
          const appear = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <circle
              key={i}
              cx={t.cx}
              cy={t.cy}
              r={r}
              fill="none"
              stroke="#ffb020"
              strokeWidth={2}
              opacity={op * appear}
            />
          );
        })}
        <Inject html={NEON_ALERT_STATIC} opacity={interpolate(frame, [95, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

        <Inject html={NEON_HUD} opacity={grilleIn} />
        <Inject html={NEON_TITRES} opacity={titreIn} />

        {/* SCANLINE qui balaie l'ecran central */}
        <rect x={430} y={scanY} width={1060} height={2.5} fill="#9fd8ff" opacity={0.14 * ecranIn} />
        {/* REC clignotant */}
        <g opacity={Math.sin(frame / 8) > -0.3 ? 1 : 0.25}>
          <circle cx={152} cy={72} r={6} fill="#5affa0" filter="url(#glow-soft)" />
          <text x={170} y={78} fontFamily="Menlo, Consolas, monospace" fontSize={15} fill="#5affa0" letterSpacing={2}>REC</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
