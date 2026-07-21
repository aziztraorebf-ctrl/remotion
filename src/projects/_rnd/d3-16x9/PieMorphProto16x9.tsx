import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { pie as d3pie, arc as d3arc } from "d3-shape";

export const PIE_MORPH_FRAMES = 300; // 10s

// ---------------------------------------------------------------------------
// PROTO R&D — CAMEMBERT/DONUT (d3-shape) anime, frame-driven / deterministe.
// 3 temps :
//  1. le donut se DESSINE (chaque part balayee par angle croissant).
//  2. une part se DETACHE (explode) + son % monte en compteur.
//  3. transition MORPHOLOGIQUE : le donut se "deroule" en barres empilees
//     (les memes valeurs, autre forme) -> prouve le morphing d'une viz a l'autre.
//
// DETERMINISME : d3-shape genere des paths ; les angles/rayons sont fonction de
// la frame. Aucun Math.random, aucune transition live D3.
// ---------------------------------------------------------------------------

const W = 1920;
const H = 1080;

const COL = {
  bg0: "#0b1220",
  bg1: "#131f33",
  ink: "#e8dcc0",
  gold: "#e8b44a",
  danger: "#d6552e",
  steel: "#5a8fc0",
  green: "#3e7c5a",
};

// Donnee-cobaye : d'ou vient l'or (parts %).
const DATA = [
  { label: "Darfour", value: 52, color: COL.gold },
  { label: "Est", value: 26, color: COL.danger },
  { label: "Nord", value: 14, color: COL.steel },
  { label: "Autres", value: 8, color: COL.green },
];

const CX = W * 0.34;
const CY = H * 0.52;
const R_OUT = 260;
const R_IN = 150;

export const PieMorphProto16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // arcs calcules une fois (angles cumules)
  const arcs = useMemo(() => {
    const gen = d3pie<{ label: string; value: number; color: string }>()
      .sort(null)
      .value((d) => d.value)
      .padAngle(0.02);
    return gen(DATA);
  }, []);

  // Phase 1 : le donut se dessine (0 -> ~90f), balayage d'angle global.
  const drawProg = interpolate(frame, [10, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sweepEnd = -Math.PI / 2 + drawProg * Math.PI * 2; // depart en haut

  // Phase 2 : la 1re part (Darfour) se detache a f120.
  const explode = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { mass: 1, damping: 13, stiffness: 90 },
    durationInFrames: 30,
  });

  // Phase 3 : morphing donut -> barres empilees (f200 -> f260).
  const morph = interpolate(frame, [200, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // compteur % de la 1re part
  const pct = Math.round(
    interpolate(frame, [120, 150], [0, DATA[0].value], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );

  // Barres empilees cibles (verticales a droite du centre) — geometrie pour morph.
  const BAR_X = W * 0.34;
  const BAR_W = 150;
  const BAR_TOP = CY - 300;
  const BAR_H = 600;

  return (
    <AbsoluteFill style={{ backgroundColor: COL.bg0 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 40% 45%, ${COL.bg1} 0%, ${COL.bg0} 72%)`,
        }}
      />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {arcs.map((a, i) => {
          // n'afficher la part que si le balayage l'a atteinte
          const partVisible = a.startAngle - Math.PI / -2 <= 0 || a.startAngle <= sweepEnd + Math.PI / 2;
          const endClamped = Math.min(a.endAngle, sweepEnd + Math.PI / 2);
          if (endClamped <= a.startAngle) return null;

          // explode offset (que la 1re part)
          const mid = (a.startAngle + a.endAngle) / 2 - Math.PI / 2;
          const off = i === 0 ? explode * 26 : 0;
          const dx = Math.cos(mid) * off;
          const dy = Math.sin(mid) * off;

          // --- forme DONUT ---
          const arcGen = d3arc()
            .innerRadius(R_IN)
            .outerRadius(R_OUT)
            .startAngle(a.startAngle)
            .endAngle(endClamped);
          const donutPath = arcGen(a as any) || "";

          // --- forme BARRE (cible du morph) : rectangle empile ---
          // hauteur proportionnelle a la valeur
          const total = DATA.reduce((s, d) => s + d.value, 0);
          const hFrac = a.data.value / total;
          const yAcc =
            DATA.slice(0, i).reduce((s, d) => s + d.value, 0) / total;
          const barY = BAR_TOP + yAcc * BAR_H;
          const barH = hFrac * BAR_H;
          const barPath = `M ${BAR_X - BAR_W / 2} ${barY} h ${BAR_W} v ${barH} h ${-BAR_W} Z`;

          return (
            <g key={i} transform={`translate(${dx} ${dy})`}>
              {/* on cross-fade donut -> barre par opacite (morph visuel simple et lisible) */}
              <path
                d={donutPath}
                transform={`translate(${CX} ${CY})`}
                fill={a.data.color}
                opacity={(1 - morph) * (drawProg > 0 ? 1 : 0)}
                stroke={COL.bg0}
                strokeWidth={2}
              />
              <path
                d={barPath}
                fill={a.data.color}
                opacity={morph}
                stroke={COL.bg0}
                strokeWidth={2}
              />
              {/* label de barre (apparait au morph) */}
              {morph > 0.5 && (
                <text
                  x={BAR_X + BAR_W / 2 + 20}
                  y={barY + barH / 2 + 8}
                  fill={COL.ink}
                  fontSize={26}
                  fontFamily="Georgia, serif"
                  opacity={(morph - 0.5) * 2}
                >
                  {a.data.label} — {a.data.value}%
                </text>
              )}
            </g>
          );
        })}

        {/* centre du donut : compteur % (disparait au morph) */}
        <g opacity={1 - morph}>
          <text
            x={CX}
            y={CY - 4}
            fill={COL.gold}
            fontSize={90}
            fontFamily="Georgia, serif"
            fontWeight={700}
            textAnchor="middle"
          >
            {pct}%
          </text>
          <text
            x={CX}
            y={CY + 40}
            fill={COL.ink}
            fontSize={26}
            fontFamily="Georgia, serif"
            textAnchor="middle"
            opacity={0.8}
          >
            Darfour
          </text>
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 70,
          color: COL.ink,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 3, opacity: 0.7 }}>ORIGINE DE L'OR</div>
        <div style={{ fontSize: 44, fontWeight: 700 }}>Ou est extrait le metal</div>
      </div>
    </AbsoluteFill>
  );
};
