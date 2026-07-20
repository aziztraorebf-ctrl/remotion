import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  staticFile,
  continueRender,
  delayRender,
  cancelRender,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadSourceSans } from "@remotion/google-fonts/SourceSans3";

const { fontFamily: cinzel } = loadFont();
const { fontFamily: sourceSans } = loadSourceSans();

export const PROTO_ATLAS_MONDE_GRIS_SVG_FRAMES = 360;

// Direction retenue par Aziz (2026-07-03) apres comparaison sur pieces avec un
// vrai Mapbox stylise GeoAfrique V5 (voir ProtoMapboxMondeGrisTest) : GARDER
// le SVG (flexibilite objets/sprites/transitions custom que Mapbox n'offre pas
// nativement), mais adopter la palette grise/sobre "plus serieuse" plutot que
// le terracotta sature du Palimpseste Mondial. Zero hachures (juge non
// necessaires par Aziz). Camera reprend le pattern corrige de
// ProtoAtlasMondeCameraTest (focusTx/focusTy — le point cible reste centre a
// tout niveau de zoom), SANS le blur CSS du whip pan (juge "bizarre" par Aziz,
// retire — pas de tuiles a recharger a cacher sur une seule carte SVG).

const COLORS = {
  ocean: "#dfe6ea", // meme teinte que le proto Mapbox gris clair
  land: "#e4e1d8",
  landActive: "#d9c9a8", // pays "actif" (route/zoom en cours) monte en contraste
  afrique: "#cbb896", // Afrique = sujet, legerement plus chaud/pose que le reste
  encre: "#3A2A18",
  frontiere: "#8a8578",
  frontiereActive: "#5C4A36",
  cream: "#2f261c",
};

type GeoCountry = { id: string; name: string; isAfrica: boolean; d: string };
type MapData = { width: number; height: number; sphereD: string; countries: GeoCountry[] };

const GHANA_ID = "288";
const NIGERIA_ID = "566";
// Centroides precalcules (meme fitExtent que scripts/atlas/precompute-atlas-monde-palimpseste.mjs).
const GHANA_CENTER = { x: 888.4, y: 479.2 };
const NIGERIA_CENTER = { x: 939.1, y: 467.3 };

export const ProtoAtlasMondeGrisSVG: React.FC = () => {
  const frame = useCurrentFrame();
  const [mapData, setMapData] = useState<MapData | null>(null);

  useEffect(() => {
    const handle = delayRender("Loading world-equalearth-africa-focus.json");
    fetch(staticFile("_shared/geo-data/world/world-equalearth-africa-focus.json"))
      .then((r) => r.json())
      .then((data: MapData) => {
        setMapData(data);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, []);

  if (!mapData) {
    return <AbsoluteFill style={{ background: COLORS.ocean }} />;
  }

  const W = mapData.width;
  const H = mapData.height;
  const centerX = W / 2;
  const centerY = H / 2;
  const focusTx = (px: number, s: number) => centerX - px * s;
  const focusTy = (py: number, s: number) => centerY - py * s;

  // ─── SEQUENCE 1 (0-130f) : Dolly In vue monde -> Ghana ───
  const dollyProgress = interpolate(frame, [0, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dollyScale = interpolate(dollyProgress, [0, 1], [1, 14]);
  const dollyTx = focusTx(GHANA_CENTER.x, dollyScale);
  const dollyTy = focusTy(GHANA_CENTER.y, dollyScale);
  const ghanaActiveOpacity = interpolate(frame, [40, 100, 130, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── SEQUENCE 2 (150-210f, 60f) : Whip Pan Ghana -> Nigeria (SANS blur) ───
  const whipStart = 150;
  const whipProgress = interpolate(frame, [whipStart, whipStart + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const whipScale = interpolate(whipProgress, [0, 1], [14, 20]);
  const whipFocusX = interpolate(whipProgress, [0, 1], [GHANA_CENTER.x, NIGERIA_CENTER.x]);
  const whipFocusY = interpolate(whipProgress, [0, 1], [GHANA_CENTER.y, NIGERIA_CENTER.y]);
  const whipTx = focusTx(whipFocusX, whipScale);
  const whipTy = focusTy(whipFocusY, whipScale);
  const nigeriaActiveOpacity = interpolate(frame, [whipStart + 20, whipStart + 55, 270, 285], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── SEQUENCE 3 (270-330f, 60f) : Pull Back Reveal -> vue monde ───
  const pullBackStart = 270;
  const pullBackProgress = interpolate(frame, [pullBackStart, pullBackStart + 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pullBackScale = interpolate(pullBackProgress, [0, 1], [20, 1]);
  const pullBackFocusX = interpolate(pullBackProgress, [0, 1], [NIGERIA_CENTER.x, centerX]);
  const pullBackFocusY = interpolate(pullBackProgress, [0, 1], [NIGERIA_CENTER.y, centerY]);
  const pullBackTx = focusTx(pullBackFocusX, pullBackScale);
  const pullBackTy = focusTy(pullBackFocusY, pullBackScale);

  let camScale = 1;
  let camTx = 0;
  let camTy = 0;
  let phaseLabel = "Vue monde";
  if (frame < whipStart) {
    camScale = dollyScale;
    camTx = dollyTx;
    camTy = dollyTy;
    phaseLabel = "Dolly In -> Ghana";
  } else if (frame < pullBackStart) {
    camScale = whipScale;
    camTx = whipTx;
    camTy = whipTy;
    phaseLabel = "Whip Pan -> Nigeria";
  } else {
    camScale = pullBackScale;
    camTx = pullBackTx;
    camTy = pullBackTy;
    phaseLabel = "Pull Back Reveal -> vue monde";
  }

  const titleOpacity = interpolate(camScale, [1, 3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const africaCountries = mapData.countries.filter((c) => c.isAfrica);
  const restCountries = mapData.countries.filter((c) => !c.isAfrica);
  const africaCombinedD = africaCountries.map((c) => c.d).join(" ");

  return (
    <AbsoluteFill style={{ background: COLORS.ocean, overflow: "hidden" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }}>
        <rect x={0} y={0} width={W} height={H} fill={COLORS.ocean} />

        <g transform={`translate(${camTx} ${camTy}) scale(${camScale})`}>
          {/* Graticule discret, disparait au zoom */}
          <g opacity={Math.max(0, 1 - camScale / 3) * 0.12} stroke={COLORS.encre} strokeWidth={0.6 / camScale} fill="none">
            {Array.from({ length: 12 }, (_, i) => {
              const x = (W / 12) * i;
              return <line key={`v${i}`} x1={x} y1={0} x2={x} y2={H} />;
            })}
            {Array.from({ length: 7 }, (_, i) => {
              const y = (H / 7) * i;
              return <line key={`h${i}`} x1={0} y1={y} x2={W} y2={y} />;
            })}
          </g>

          {/* Reste du monde : gris clair sobre */}
          <g>
            {restCountries.map((c) => (
              <path key={c.id} d={c.d} fill={COLORS.land} stroke="none" />
            ))}
          </g>
          <g fill="none">
            {restCountries.map((c) => (
              <path
                key={`border-${c.id}`}
                d={c.d}
                stroke={COLORS.frontiere}
                strokeWidth={0.6}
                opacity={0.5}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          {/* Afrique : sujet, teinte legerement plus chaude que le reste (sans terracotta sature) */}
          <path d={africaCombinedD} fill={COLORS.encre} opacity={0.1} transform="translate(2 2)" />
          <g>
            {africaCountries.map((c) => {
              const isGhana = c.id === GHANA_ID;
              const isNigeria = c.id === NIGERIA_ID;
              const fill = isGhana
                ? interpolateColor(COLORS.afrique, COLORS.landActive, ghanaActiveOpacity)
                : isNigeria
                  ? interpolateColor(COLORS.afrique, COLORS.landActive, nigeriaActiveOpacity)
                  : COLORS.afrique;
              return (
                <path
                  key={c.id}
                  d={c.d}
                  fill={fill}
                  stroke={COLORS.encre}
                  strokeWidth={1}
                  opacity={0.9}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>
        </g>

        <text
          x={W / 2}
          y={90}
          textAnchor="middle"
          fill={COLORS.cream}
          fontSize={38}
          fontFamily={cinzel}
          fontWeight="bold"
          letterSpacing={4}
          opacity={titleOpacity}
          style={{ fontVariant: "small-caps" }}
        >
          Atlas Monde — Registre Gris
        </text>

        <text
          x={W / 2}
          y={H - 40}
          textAnchor="middle"
          fill={COLORS.encre}
          fontSize={18}
          fontFamily={sourceSans}
          opacity={0.85}
        >
          {phaseLabel}
        </text>
      </svg>
    </AbsoluteFill>
  );
};

function interpolateColor(from: string, to: string, t: number): string {
  const f = hexToRgb(from);
  const tRgb = hexToRgb(to);
  const r = Math.round(f.r + (tRgb.r - f.r) * t);
  const g = Math.round(f.g + (tRgb.g - f.g) * t);
  const b = Math.round(f.b + (tRgb.b - f.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}
