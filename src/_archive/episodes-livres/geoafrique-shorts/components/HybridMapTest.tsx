import React from "react";
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";

// ============================================================
// HybridMapTest — Gemini parchment background + d3-geo borders overlay
// Mini test : 5s (150 frames) — empire coloring only
// ============================================================

const W = 1080;
const H = 1920;

const PAL = {
  gold: "#D4AF37",
  empireGold: "rgba(212, 175, 55, 0.35)",
  empireBorder: "#C9A227",
  text: "#2C1810",
  textBg: "rgba(245, 230, 200, 0.90)",
} as const;

// ISO codes Empire du Mali
const EMPIRE_MALI_ISO = [466, 686, 324, 270];
const WEST_AFRICA_ISO = new Set([
  466, 562, 854, 288, 384, 694, 430, 624, 270, 324,
  686, 478, 768, 204, 566, 132, 180, 120, 140, 148,
]);

// Projection calibree pour s'aligner sur la carte Gemini V4
function makeProjection() {
  return d3Geo
    .geoMercator()
    .center([-8, 14])
    .scale(1900)
    .translate([W * 0.42, H * 0.38]);
}

interface CountryFeature {
  id: number;
  path: string;
}

function useMapData() {
  const [countries, setCountries] = React.useState<CountryFeature[]>([]);
  const [handle] = React.useState(() => delayRender("HybridMap load"));

  React.useEffect(() => {
    fetch(staticFile("_shared/geo-data/countries-50m.json"))
      .then((r) => r.json())
      .then((topo) => {
        const geo = topojson.feature(
          topo,
          topo.objects.countries
        ) as unknown as GeoJSON.FeatureCollection;

        const proj = makeProjection();
        const pathGen = d3Geo.geoPath().projection(proj);

        const features: CountryFeature[] = geo.features
          .map((f) => {
            const d = pathGen(f);
            if (!d) return null;
            return { id: Number(f.id), path: d };
          })
          .filter(Boolean) as CountryFeature[];

        setCountries(features);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);

  return countries;
}

export const HybridMapTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const countries = useMapData();

  // Empire coloring : chaque pays se colore en sequence
  const empireColors = EMPIRE_MALI_ISO.map((_, i) => {
    return spring({
      frame: frame - 30 - i * 15,
      fps,
      config: { damping: 20, stiffness: 100 },
    });
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#c8d0d8" }}>
      {/* Couche 1 : carte Gemini parchment en fond */}
      <Img
        src={staticFile("assets/geoafrique/maps/west-africa-map-v4-parchment.png")}
        style={{ width: W, height: H, objectFit: "cover", position: "absolute" }}
      />

      {/* Couche 2 : d3-geo polygones TRANSPARENTS sauf empire colore */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {countries.map((c) => {
          const empireIdx = EMPIRE_MALI_ISO.indexOf(c.id);
          if (empireIdx < 0) return null;

          const colorProgress = empireColors[empireIdx];
          if (colorProgress <= 0) return null;

          return (
            <React.Fragment key={c.id}>
              {/* Fill dore semi-transparent */}
              <path
                d={c.path}
                fill={PAL.empireGold}
                stroke="none"
                opacity={colorProgress * 0.8}
              />
              {/* Bordure doree */}
              <path
                d={c.path}
                fill="none"
                stroke={PAL.empireBorder}
                strokeWidth={2.5}
                opacity={colorProgress}
              />
            </React.Fragment>
          );
        })}

        {/* Label test */}
        <g opacity={1} transform={`translate(${W * 0.5}, ${H * 0.75})`}>
          <rect x={-160} y={-20} width={320} height={40} rx={6}
            fill={PAL.textBg} stroke={PAL.empireBorder} strokeWidth={2}
          />
          <text x={0} y={8} fontFamily="Georgia, serif" fontSize={22}
            fontWeight="bold" fill={PAL.text} textAnchor="middle"
          >Hybride : Gemini + d3-geo borders</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
