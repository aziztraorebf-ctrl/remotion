import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  spring,
} from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world110m from "../../../../public/_rnd/vox-repro/countries-110m.json";

export const CARTOGRAM_FRAMES = 300; // 10s

// ---------------------------------------------------------------------------
// PROTO R&D — CARTOGRAMME : redimensionner chaque PAYS REEL selon une valeur.
// Le contour geographique reste vrai ; seule la TAILLE change (scale autour du
// centroide). Choquant/memorable : "le Soudan enfle sous ses deplaces,
// l'UAE enfle sous ses importations d'or".
//
// Deterministe : le scale de chaque pays = f(frame). Aucun Math.random.
// C'est de la CARTO PURE (moitie forte de D3), pas un chart habille.
// ---------------------------------------------------------------------------

const W = 1920;
const H = 1080;

const COL = {
  bg0: "#0b1220",
  bg1: "#131f33",
  ink: "#e8dcc0",
  gold: "#e8b44a",
  danger: "#d6552e",
  land: "#8a7a5a",
  landMuted: "#4a4232",
  stroke: "#2a2418",
  muted: "#6b7d94",
};

// pays de contexte (gris) + les 2 pays qui enflent (data)
const CONTEXT = ["Egypt", "Chad", "Saudi Arabia", "Ethiopia", "Libya"];
// valeur -> facteur d'echelle final (1 = taille reelle ; >1 enfle)
const DATA: Record<string, { scale: number; color: string; label: string; value: string }> = {
  Sudan: { scale: 2.1, color: COL.danger, label: "Soudan", value: "11M deplaces" },
  "United Arab Emirates": { scale: 4.2, color: COL.gold, label: "Emirats", value: "or importe" },
};

export const CartogramProto16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { proj, pathGen, feats, centroids } = useMemo(() => {
    const fc = feature(world110m as any, (world110m as any).objects.countries) as any;
    const names = [...CONTEXT, ...Object.keys(DATA)];
    const feats = names
      .map((n) => fc.features.find((f: any) => f.properties.name === n))
      .filter(Boolean);

    // cadrer la region (Soudan + Peninsule arabique)
    const proj = geoMercator().center([38, 20]).scale(1400).translate([W * 0.46, H * 0.52]);
    const pathGen = geoPath(proj);
    const centroids: Record<string, [number, number]> = {};
    feats.forEach((f: any) => {
      centroids[f.properties.name] = pathGen.centroid(f) as [number, number];
    });
    return { proj, pathGen, feats, centroids };
  }, []);

  // progression d'enflement (spring), echelonnee : Soudan puis UAE
  const grow = (start: number) =>
    spring({
      frame: Math.max(0, frame - start),
      fps,
      config: { mass: 1, damping: 16, stiffness: 55 },
      durationInFrames: 70,
    });

  const growSudan = grow(60);
  const growUae = grow(140);

  return (
    <AbsoluteFill style={{ backgroundColor: COL.bg0 }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 46% 50%, ${COL.bg1} 0%, ${COL.bg0} 74%)`,
        }}
      />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {/* pays de contexte (gris, taille reelle) */}
        {feats
          .filter((f: any) => CONTEXT.includes(f.properties.name))
          .map((f: any, i: number) => (
            <path
              key={i}
              d={pathGen(f) || ""}
              fill={COL.landMuted}
              stroke={COL.stroke}
              strokeWidth={0.8}
            />
          ))}

        {/* pays DATA qui enflent (scale autour du centroide) */}
        {feats
          .filter((f: any) => DATA[f.properties.name])
          .map((f: any) => {
            const name = f.properties.name;
            const cfg = DATA[name];
            const g = name === "Sudan" ? growSudan : growUae;
            const s = 1 + (cfg.scale - 1) * g;
            const [cx, cy] = centroids[name];
            return (
              <g key={name} transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>
                <path
                  d={pathGen(f) || ""}
                  fill={cfg.color}
                  fillOpacity={0.92}
                  stroke={COL.ink}
                  strokeWidth={1 / s}
                  strokeOpacity={0.7}
                />
              </g>
            );
          })}

        {/* labels des pays data (position fixe = centroide, taille constante) */}
        {feats
          .filter((f: any) => DATA[f.properties.name])
          .map((f: any) => {
            const name = f.properties.name;
            const cfg = DATA[name];
            const g = name === "Sudan" ? growSudan : growUae;
            const [cx, cy] = centroids[name];
            if (g < 0.3) return null;
            return (
              <g key={`lbl-${name}`} opacity={interpolate(g, [0.3, 0.7], [0, 1], { extrapolateRight: "clamp" })}>
                <text
                  x={cx}
                  y={cy - (name === "United Arab Emirates" ? 120 : 200)}
                  fill={COL.ink}
                  fontSize={30}
                  fontFamily="Georgia, serif"
                  fontWeight={700}
                  textAnchor="middle"
                >
                  {cfg.label}
                </text>
                <text
                  x={cx}
                  y={cy - (name === "United Arab Emirates" ? 92 : 172)}
                  fill={cfg.color}
                  fontSize={24}
                  fontFamily="Georgia, serif"
                  textAnchor="middle"
                >
                  {cfg.value}
                </text>
              </g>
            );
          })}
      </svg>

      <div style={{ position: "absolute", left: 80, top: 60, color: COL.ink, fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 24, letterSpacing: 3, opacity: 0.7 }}>CARTOGRAMME</div>
        <div style={{ fontSize: 42, fontWeight: 700 }}>La taille dit le poids</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 54,
          textAlign: "center",
          color: COL.ink,
          fontFamily: "Georgia, serif",
          fontSize: 32,
          opacity: interpolate(frame, [210, 250], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        Le petit Emirat pese plus lourd que le pays qu'il alimente.
      </div>
    </AbsoluteFill>
  );
};
