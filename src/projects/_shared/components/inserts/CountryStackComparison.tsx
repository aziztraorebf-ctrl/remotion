/**
 * CountryStackComparison — empile des silhouettes de pays a l'interieur d'une silhouette pivot.
 *
 * Pattern Jacq Adi : "On peut faire rentrer la France 4 fois dans la RDC."
 * On affiche la RDC en fond (contour), puis les pays comparatifs "tombent" dedans
 * (4x France, puis Espagne, Allemagne, Pologne, UK) avec leurs vraies tailles relatives.
 *
 * Implementation : d3-geo `geoEquirectangular` partagee pour TOUTES les silhouettes
 * (donc tailles relatives respectees). Chaque pays comparatif est translate dans le bbox
 * de la RDC selon une grille de placement.
 */

import React, { useMemo } from "react";
import { feature } from "topojson-client";
import { geoMercator, geoPath, geoEquirectangular } from "d3-geo";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

export type StackItem = {
  countryName: string;
  color: string;
  copies?: number; // default 1
  label?: string;
  position?: { dx: number; dy: number }; // grid offset inside main bbox
};

export type CountryStackComparisonProps = {
  topology: unknown;
  mainCountry: string;
  items: StackItem[];
  width: number;
  height: number;
  mainColor?: string;
  stagger?: number; // frames between each item entry
  entryAt?: number;
};

export const CountryStackComparison: React.FC<CountryStackComparisonProps> = ({
  topology,
  mainCountry,
  items,
  width,
  height,
  mainColor = "#ff8c00",
  stagger = 18,
  entryAt = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const relFrame = frame - entryAt;

  const { mainPath, mainBounds, getCountryFeature, projection } = useMemo(() => {
    const fc = feature(topology as any, (topology as any).objects.countries) as unknown as {
      features: any[];
    };
    const mainFeat = fc.features.find((f) => f.properties?.name === mainCountry);

    // Projection equirectangulaire centree sur la RDC, scale a la fenetre
    const proj = geoMercator().fitExtent(
      [[80, 80], [width - 80, height - 80]],
      mainFeat
    );
    const path = geoPath(proj);
    return {
      mainPath: path(mainFeat) ?? "",
      mainBounds: path.bounds(mainFeat),
      getCountryFeature: (name: string) => fc.features.find((f) => f.properties?.name === name),
      projection: proj,
    };
  }, [topology, mainCountry, width, height]);

  const [[mx0, my0], [mx1, my1]] = mainBounds;
  const mainW = mx1 - mx0;
  const mainH = my1 - my0;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      {/* Main country background */}
      <path
        d={mainPath}
        fill="rgba(80,180,80,0.18)"
        stroke={mainColor}
        strokeWidth={5}
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 18px ${mainColor})` }}
      />

      {items.map((item, idx) => {
        const itemEntryFrame = idx * stagger;
        const localFrame = relFrame - itemEntryFrame;
        if (localFrame < 0) return null;

        const itemScale = spring({
          fps,
          frame: Math.max(0, localFrame),
          config: { damping: 14, stiffness: 100, mass: 0.6 },
        });

        const feat = getCountryFeature(item.countryName);
        if (!feat) return null;

        const path = geoPath(projection);
        const featPath = path(feat) ?? "";
        const [[fx0, fy0], [fx1, fy1]] = path.bounds(feat);
        const fcx = (fx0 + fx1) / 2;
        const fcy = (fy0 + fy1) / 2;

        const copies = item.copies ?? 1;
        const elements: React.ReactNode[] = [];

        for (let c = 0; c < copies; c++) {
          // Grid placement inside main bbox: 2 cols x 2 rows
          const col = c % 2;
          const row = Math.floor(c / 2);
          const offsetX = mx0 + mainW * 0.18 + col * mainW * 0.40 + (item.position?.dx ?? 0);
          const offsetY = my0 + mainH * 0.18 + row * mainH * 0.40 + (item.position?.dy ?? 0);

          // translation depuis le centre du feature vers la cellule
          const tx = offsetX - fcx;
          const ty = offsetY - fcy;

          elements.push(
            <g
              key={`${item.countryName}-${c}`}
              transform={`translate(${tx}, ${ty}) scale(${itemScale})`}
              style={{ transformOrigin: `${fcx}px ${fcy}px` }}
            >
              <path
                d={featPath}
                fill={item.color}
                fillOpacity={0.75}
                stroke="white"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
              {item.label && c === 0 && (
                <text
                  x={fcx}
                  y={fcy + 8}
                  textAnchor="middle"
                  style={{
                    fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                    fontSize: 28,
                    fill: "white",
                    letterSpacing: 2,
                    textShadow: "0 2px 8px rgba(0,0,0,0.85)",
                    pointerEvents: "none",
                  }}
                >
                  {item.label}
                </text>
              )}
            </g>
          );
        }

        return <g key={item.countryName}>{elements}</g>;
      })}
    </svg>
  );
};
