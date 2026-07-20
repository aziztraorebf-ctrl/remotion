import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, continueRender, delayRender, cancelRender } from "remotion";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";

export const PROTO_MAP2D_ENCRE_FRAMES = 210;

const BG = "#0f1a2e";
const GRID = "#1e2d47";
const INK = "#2b2117";
const PARCH = "#e8dcc0";
const PARCH_DIM = "#b0a58a";
const HIGHLIGHT = "#e07a5f";

const GridBackground: React.FC = () => {
  const stepSmall = 30;
  const stepLarge = 150;
  const lines: React.ReactNode[] = [];

  for (let x = 0; x <= 1920; x += stepSmall) {
    const isLarge = x % stepLarge === 0;
    lines.push(
      <line key={`v${x}`} x1={x} y1={0} x2={x} y2={1080}
        stroke={GRID} strokeWidth={isLarge ? 1 : 0.5} opacity={isLarge ? 0.6 : 0.3} />
    );
  }
  for (let y = 0; y <= 1080; y += stepSmall) {
    const isLarge = y % stepLarge === 0;
    lines.push(
      <line key={`h${y}`} x1={0} y1={y} x2={1920} y2={y}
        stroke={GRID} strokeWidth={isLarge ? 1 : 0.5} opacity={isLarge ? 0.6 : 0.3} />
    );
  }

  return <g>{lines}</g>;
};

const HIGHLIGHTED_COUNTRY = "Mali";

export const ProtoMap2dEncre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    const [handle] = [delayRender("Loading sahel-countries.geojson")];
    fetch(staticFile("_shared/geo-data/sahel/sahel-countries.geojson"))
      .then((res) => res.json())
      .then((data: FeatureCollection) => {
        setGeoData(data);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, []);

  const pathFor = useMemo(() => {
    if (!geoData) return null;
    const proj = geoMercator().fitExtent(
      [
        [260, 160],
        [1660, 920],
      ],
      geoData
    );
    return geoPath(proj);
  }, [geoData]);

  const titleOp = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const revealProgress = spring({ frame: frame - 40, fps, config: { damping: 20, mass: 1.2 } });

  const statOp = interpolate(frame, [140, 165], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  if (!geoData || !pathFor) {
    return <AbsoluteFill style={{ background: BG }} />;
  }

  const features = geoData.features;

  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <GridBackground />

        <text
          x={960}
          y={90}
          textAnchor="middle"
          fill={PARCH}
          fontSize={38}
          fontFamily="Georgia, serif"
          fontWeight="bold"
          letterSpacing={3}
          opacity={titleOp}
        >
          SAHEL — TROIS PAYS, UNE RUPTURE
        </text>
        <line x1={660} y1={108} x2={1260} y2={108} stroke={PARCH_DIM} strokeWidth={1} opacity={titleOp * 0.5} />

        {features.map((feat) => {
          const countryName = feat.properties?.name as string | undefined;
          const isHighlighted = countryName === HIGHLIGHTED_COUNTRY;
          const d = pathFor(feat as never);
          if (!d) return null;

          const fillColor = isHighlighted
            ? interpolateColor(PARCH_DIM, HIGHLIGHT, revealProgress)
            : PARCH_DIM;

          return (
            <path
              key={countryName}
              d={d}
              fill={fillColor}
              fillOpacity={isHighlighted ? 0.35 + revealProgress * 0.35 : 0.18}
              stroke={INK}
              strokeWidth={2}
            />
          );
        })}

        <g opacity={statOp}>
          <rect x={1360} y={780} width={440} height={180} fill={BG} stroke={PARCH_DIM} strokeWidth={1} opacity={0.85} />
          <text x={1580} y={840} textAnchor="middle" fill={PARCH} fontSize={54} fontFamily="Georgia, serif" fontWeight="bold">
            +20M
          </text>
          <text x={1580} y={875} textAnchor="middle" fill={PARCH_DIM} fontSize={18} fontFamily="Georgia, serif" fontStyle="italic">
            habitants au Mali
          </text>
          <text x={1580} y={930} textAnchor="middle" fill={PARCH_DIM} fontSize={14} fontFamily="Georgia, serif" fontStyle="italic">
            Source : ONU, 2024
          </text>
        </g>
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
