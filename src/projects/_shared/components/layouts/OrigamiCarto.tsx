import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export interface OrigamiCartoProps {
  title?: string;
  labels?: string[];
  bgColor?: string;
}

const FONT_MONO = '"IBM Plex Mono", monospace';

const PANELS = [
  { id: "q1", ox: 0,   oy: 0,   w: 960, h: 540, tx: 480, ty: 270,  start: 0,  end: 40,  scaleDir: "tl" },
  { id: "q2", ox: 960, oy: 0,   w: 960, h: 540, tx: 1440, ty: 270, start: 10, end: 50,  scaleDir: "tr" },
  { id: "q3", ox: 0,   oy: 540, w: 960, h: 540, tx: 480, ty: 810,  start: 20, end: 60,  scaleDir: "bl" },
  { id: "q4", ox: 960, oy: 540, w: 960, h: 540, tx: 1440, ty: 810, start: 30, end: 70,  scaleDir: "br" },
];

const GRID_COLS = [120, 240, 360, 480, 600, 720, 840];
const GRID_ROWS = [108, 216, 324, 432];

export const OrigamiCarto: React.FC<OrigamiCartoProps> = ({
  title = "CARTOGRAPHIE DES ENJEUX",
  labels = [
    "NORD-OUEST | RESSOURCES",
    "NORD-EST | POPULATIONS",
    "SUD-OUEST | CLIMAT",
    "SUD-EST | DEVELOPPEMENT",
  ],
  bgColor = "transparent",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelSprings = PANELS.map((p) =>
    spring({
      frame: Math.max(0, frame - p.start),
      fps,
      config: { damping: 14, stiffness: 120, mass: 1 },
    })
  );

  const foldOp = interpolate(frame, [60, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <defs>
          {PANELS.map((p) => (
            <clipPath key={`clip-${p.id}`} id={`clip-${p.id}`}>
              <rect x={p.ox} y={p.oy} width={p.w} height={p.h} />
            </clipPath>
          ))}
        </defs>

        {/* 4 volets */}
        {PANELS.map((panel, i) => {
          const sc = panelSprings[i] ?? 0;
          const op = interpolate(frame, [panel.start, panel.start + 15], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          // scaleX depuis le bord intérieur (960,540)
          const scaleX = sc;
          const scaleY = sc;
          const anchorX = 960;
          const anchorY = 540;

          return (
            <g
              key={panel.id}
              opacity={op}
              clipPath={`url(#clip-${panel.id})`}
              transform={`translate(${anchorX},${anchorY}) scale(${scaleX},${scaleY}) translate(${-anchorX},${-anchorY})`}
            >
              {/* Fond volet */}
              <rect
                x={panel.ox} y={panel.oy}
                width={panel.w} height={panel.h}
                fill="#1a2535"
              />
              {/* Grille géo intérieure */}
              {GRID_COLS.map((cx) => (
                <line
                  key={`col-${cx}`}
                  x1={panel.ox + (cx % panel.w)}
                  y1={panel.oy}
                  x2={panel.ox + (cx % panel.w)}
                  y2={panel.oy + panel.h}
                  stroke="#f2ebd9"
                  strokeWidth={0.5}
                  opacity={0.08}
                />
              ))}
              {GRID_ROWS.map((ry) => (
                <line
                  key={`row-${ry}`}
                  x1={panel.ox}
                  y1={panel.oy + (ry % panel.h)}
                  x2={panel.ox + panel.w}
                  y2={panel.oy + (ry % panel.h)}
                  stroke="#f2ebd9"
                  strokeWidth={0.5}
                  opacity={0.08}
                />
              ))}
              {/* Bordure volet */}
              <rect
                x={panel.ox + 2} y={panel.oy + 2}
                width={panel.w - 4} height={panel.h - 4}
                fill="none"
                stroke="#4a9eff"
                strokeWidth={1}
                opacity={0.25}
              />
              {/* Label volet */}
              <text
                x={panel.tx} y={panel.ty}
                textAnchor="middle"
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 20,
                  fill: "#f2ebd9",
                  letterSpacing: 2,
                  opacity: 0.7,
                }}
              >
                {labels[i] ?? ""}
              </text>
              {/* Point cardinal coin */}
              <circle
                cx={panel.ox + (i % 2 === 0 ? panel.w - 30 : 30)}
                cy={panel.oy + (i < 2 ? panel.h - 30 : 30)}
                r={4}
                fill="#c8a951"
                opacity={0.6}
              />
            </g>
          );
        })}

        {/* Croix de pliure gold */}
        <g opacity={foldOp}>
          <line x1={960} y1={0} x2={960} y2={1080} stroke="#c8a951" strokeWidth={2} />
          <line x1={0} y1={540} x2={1920} y2={540} stroke="#c8a951" strokeWidth={2} />
          {/* Point central */}
          <circle cx={960} cy={540} r={6} fill="#c8a951" />
        </g>

        {/* Titre global — apparaît après déploiement */}
        {title && (
          <text
            x={960} y={60}
            textAnchor="middle"
            opacity={interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
            style={{
              fontFamily: FONT_MONO,
              fontSize: 28,
              fontWeight: "bold",
              fill: "#f2ebd9",
              letterSpacing: 6,
            }}
          >
            {title}
          </text>
        )}
      </svg>
    </AbsoluteFill>
  );
};
