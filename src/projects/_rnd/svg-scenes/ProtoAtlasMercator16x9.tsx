import React, { useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  continueRender,
  delayRender,
  cancelRender,
} from "remotion";
import { geoMercator } from "d3-geo";
import { AtlasMercator, ATLAS_COLORS } from "../../atlas/_shared/atlas-components";
import { AtlasAttackArrow } from "../../atlas/_shared/AtlasAttackArrow";
import type { Projection } from "../../atlas/_shared/geoUtils";

export const PROTO_ATLAS_MERCATOR_16X9_FRAMES = 240;

// Reprend le composant carte canonique Atlas (celui de Mansa Moussa / Empire du
// Ghana / peste-1347) — vraies frontieres Natural Earth-derivees, meme mecanique
// caméra (drift/scale), simplement en format 16:9 au lieu du 720x1280 vertical.

type GeoCountry = { name: string; d: string };
type MapData = { width: number; height: number; countries: GeoCountry[] };

// Ancrage geographique identique a celui utilise dans le script de precompute
// (scripts/atlas/precompute-atlas-16x9-sahel.mjs) — necessaire pour que la
// fleche AtlasAttackArrow tombe exactement sur les memes pixels que les pays.
const FIT_BOUNDS: [[number, number], [number, number]] = [
  [140, 100],
  [1780, 980],
];

export const ProtoAtlasMercator16x9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [mapData, setMapData] = useState<MapData | null>(null);
  const [ggwGeoJson, setGgwGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    const handle = delayRender("Loading sahel-16x9-mercator.json");
    Promise.all([
      fetch(staticFile("_shared/geo-data/sahel/sahel-16x9-mercator.json")).then((r) => r.json()),
      fetch(staticFile("_shared/geo-data/ggw/ggw-countries.geojson")).then((r) => r.json()),
    ])
      .then(([data, geojson]) => {
        setMapData(data);
        setGgwGeoJson(geojson);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, []);

  // Meme projection que le precompute, pour que AtlasAttackArrow (qui prend des
  // lon/lat) tombe exactement aux memes pixels que les pays precalcules.
  const projection: Projection | null = useMemo(() => {
    if (!ggwGeoJson) return null;
    const proj = geoMercator().fitExtent(FIT_BOUNDS, ggwGeoJson);
    return (lon: number, lat: number) => proj([lon, lat]) as [number, number];
  }, [ggwGeoJson]);

  // Mouvement camera : dezoom lent depuis un cadrage serre sur le Sahel central
  // vers la vue large (11 pays), pour prouver qu'on peut se deplacer/zoomer sur
  // une vraie carte comme sur les episodes Atlas actuels.
  const zoomOutProgress = interpolate(frame, [30, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(zoomOutProgress, [0, 1], [1.8, 1]);
  const driftX = interpolate(zoomOutProgress, [0, 1], [-260, 0]);
  const driftY = interpolate(zoomOutProgress, [0, 1], [90, 0]);

  const titleOp = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fleche demo : Dakar -> Niamey (traverse plusieurs pays, visible au dezoom)
  const arrowProgress = interpolate(frame, [160, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowOpacity = interpolate(frame, [155, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  if (!mapData || !projection) {
    return <AbsoluteFill style={{ background: ATLAS_COLORS.bgTop }} />;
  }

  return (
    <AbsoluteFill style={{ background: ATLAS_COLORS.bgTop }}>
      <svg viewBox={`0 0 ${mapData.width} ${mapData.height}`} style={{ width: "100%", height: "100%" }}>
        <AtlasMercator
          countries={mapData.countries.map((c) => ({ iso: c.name, d: c.d }))}
          width={mapData.width}
          height={mapData.height}
          driftX={driftX}
          driftY={driftY}
          scale={scale}
        />
        <g
          transform={`translate(${mapData.width / 2 + driftX} ${mapData.height / 2 + driftY}) scale(${scale}) translate(${-mapData.width / 2} ${-mapData.height / 2})`}
        >
          <AtlasAttackArrow
            waypoints={[
              { lon: -17.44, lat: 14.69 }, // Dakar
              { lon: 2.12, lat: 13.51 }, // Niamey
            ]}
            progress={arrowProgress}
            opacity={arrowOpacity}
            marchingFrame={frame}
            color={ATLAS_COLORS.textGold}
            projection={projection}
          />
        </g>

        <text
          x={mapData.width / 2}
          y={90}
          textAnchor="middle"
          fill={ATLAS_COLORS.cream}
          fontSize={38}
          fontFamily="Georgia, serif"
          fontWeight="bold"
          letterSpacing={3}
          opacity={titleOp}
        >
          BANDE SAHÉLIENNE — VRAIES FRONTIÈRES, FORMAT 16:9
        </text>
      </svg>
    </AbsoluteFill>
  );
};
