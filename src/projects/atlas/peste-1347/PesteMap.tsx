import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { interpolate } from "remotion";
import { AtlasMercator, AtlasPulseMarker, AtlasEmpire } from "../_shared/atlas-components";
import pesteData from "../../../../public/atlas/peste-1347/geo/peste-map-data.json";

// Palette medievale Peste 1347 (distincte de Mansa Moussa)
const PESTE_COLORS = {
  ocean:        "#1a2744",   // bleu nuit profond
  land:         "#c4a882",   // parchemin chaud
  landStroke:   "#8b6914",   // brun dore
  europeFill:   "#a0614a",   // terracotta Europe (zone touchee Peste)
  maliFill:     "#c8960c",   // or Mali (vivant)
  saharaFill:   "#d4b896",   // sable Sahara (plus clair que land)
  pesteFill:    "#8B0000",   // rouge sang — highlight pays touches
  pesteOpacity: 0.45,
};

// ISO pays touches par la Peste (pour highlight rouge)
const ISO_PESTE = new Set([
  "GBR", "IRL", "FRA", "ESP", "PRT", "ITA", "CHE", "AUT", "DEU", "BEL",
  "NLD", "DNK", "SWE", "NOR", "POL", "CZE", "HUN", "ROU", "BGR", "HRV",
  "SRB", "GRC", "SVN", "UKR", "TUR",
]);

// ISO pays Mali + proches (zone protegee)
const ISO_MALI_ZONE = new Set([
  "MLI", "SEN", "GMB", "GNB", "GIN", "BFA", "NER", "MRT",
]);

const highlightFills: Record<string, string> = {};
ISO_PESTE.forEach(iso => { highlightFills[iso] = PESTE_COLORS.europeFill; });
ISO_MALI_ZONE.forEach(iso => { highlightFills[iso] = "#b8860b"; });
highlightFills["EGY"] = "#cc6633";  // Caire — touche mais limite

// ─── VUE PREVIEW : mercLarge (vue principale) ────────────────────────────────
const data = pesteData.mercLarge;
const W = pesteData.width;
const H = pesteData.height;

export const PesteMapPreview: React.FC = () => {
  const frame = useCurrentFrame();

  // Leger drift pour montrer que c'est vivant
  const driftX = interpolate(frame, [0, 150], [0, 8], { extrapolateRight: "clamp" });
  const driftY = interpolate(frame, [0, 150], [0, -4], { extrapolateRight: "clamp" });

  const poi = data.poi;

  return (
    <AbsoluteFill style={{ backgroundColor: PESTE_COLORS.ocean }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {/* Ocean */}
        <rect x={0} y={0} width={W} height={H} fill={PESTE_COLORS.ocean} />

        {/* Carte pays */}
        <AtlasMercator
          countries={data.countries}
          highlightFills={highlightFills}
          driftX={driftX}
          driftY={driftY}
          width={W}
          height={H}
        />

        {/* Empire Mali 1300 (overlay or semi-transparent) */}
        {data.maliEmpire1300 && (
          <AtlasEmpire pathD={data.maliEmpire1300} outlineDark={false} hatchOpacity={0.5} />
        )}

        {/* Markers villes route Peste */}
        <AtlasPulseMarker coord={[poi.Caffa.x,     poi.Caffa.y]}     color={PESTE_COLORS.pesteFill} beatStart={0} />
        <AtlasPulseMarker coord={[poi.Sicile.x,    poi.Sicile.y]}    color={PESTE_COLORS.pesteFill} beatStart={0} />
        <AtlasPulseMarker coord={[poi.Paris.x,     poi.Paris.y]}     color={PESTE_COLORS.pesteFill} beatStart={0} />
        <AtlasPulseMarker coord={[poi.Londres.x,   poi.Londres.y]}   color={PESTE_COLORS.pesteFill} beatStart={0} />
        <AtlasPulseMarker coord={[poi.Stockholm.x, poi.Stockholm.y]} color={PESTE_COLORS.pesteFill} beatStart={0} />
        <AtlasPulseMarker coord={[poi.LeCaire.x,   poi.LeCaire.y]}   color="#cc4400"                beatStart={0} />

        {/* Markers villes Mali */}
        <AtlasPulseMarker coord={[poi.Tombouctou.x, poi.Tombouctou.y]} color={PESTE_COLORS.maliFill} beatStart={0} />
        <AtlasPulseMarker coord={[poi.Niani.x,      poi.Niani.y]}      color={PESTE_COLORS.maliFill} beatStart={0} />

        {/* Labels villes SVG directs */}
        {([
          { label: "Caffa",       x: poi.Caffa.x + 12,      y: poi.Caffa.y - 8,       fill: "#ffcccc" },
          { label: "Sicile",      x: poi.Sicile.x + 12,     y: poi.Sicile.y - 8,      fill: "#ffcccc" },
          { label: "Paris",       x: poi.Paris.x + 10,      y: poi.Paris.y - 8,       fill: "#ffcccc" },
          { label: "Londres",     x: poi.Londres.x - 70,    y: poi.Londres.y - 8,     fill: "#ffcccc" },
          { label: "Stockholm",   x: poi.Stockholm.x + 10,  y: poi.Stockholm.y - 8,   fill: "#ffcccc" },
          { label: "Le Caire",    x: poi.LeCaire.x + 12,    y: poi.LeCaire.y - 8,     fill: "#ffaa88" },
          { label: "Tombouctou",  x: poi.Tombouctou.x + 12, y: poi.Tombouctou.y - 8,  fill: "#ffd700" },
          { label: "Niani",       x: poi.Niani.x + 12,      y: poi.Niani.y - 8,       fill: "#ffd700" },
        ] as { label: string; x: number; y: number; fill: string }[]).map(({ label, x, y, fill }) => (
          <text key={label} x={x} y={y} fill={fill} fontSize={14} fontFamily="serif" fontWeight="bold">
            {label}
          </text>
        ))}

        {/* Label SAHARA au centre */}
        <text
          x={W / 2 + 20}
          y={H * 0.52}
          textAnchor="middle"
          fill="#d4b896"
          fillOpacity={0.7}
          fontSize={22}
          fontFamily="serif"
          letterSpacing={6}
        >
          SAHARA
        </text>

        {/* Titre preview */}
        <text x={W / 2} y={60} textAnchor="middle" fill="#f5e6c8" fontSize={28} fontFamily="serif" letterSpacing={2}>
          La Peste et le Sahara — 1347
        </text>
        <text x={W / 2} y={90} textAnchor="middle" fill="#c4a882" fontSize={16} fontFamily="serif">
          Vue principale · mercLarge
        </text>
      </svg>
    </AbsoluteFill>
  );
};
