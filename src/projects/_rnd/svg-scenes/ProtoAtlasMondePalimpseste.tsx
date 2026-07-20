import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  continueRender,
  delayRender,
  cancelRender,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadSourceSans } from "@remotion/google-fonts/SourceSans3";

const { fontFamily: cinzel } = loadFont();
const { fontFamily: sourceSans } = loadSourceSans();

export const PROTO_ATLAS_MONDE_PALIMPSESTE_FRAMES = 300;

// V2 — direction "Le Palimpseste Mondial" (Kimi K2.5), corrigee suite a la
// double review GPT-5.5 + Gemini 3.1 Pro (2026-07-03), qui convergent sur :
// - le monde ne doit pas etre "efface" (zone morte) mais rechauffe/vivant
// - frontieres CONTINUES fines sepia, jamais pointillees quasi-transparentes
//   (lu par les deux comme "carte incomplete")
// - vector-effect="non-scaling-stroke" obligatoire (sinon murs noirs au zoom)
// - ombre portee Afrique = duplication de path decalee (pas de feGaussianBlur)
// - graticule discret (signature atlas)
// - hachures Afrique dont l'opacite depend du zoom (anti-moire au mouvement)
// - typo labels : Source Sans 3 (PAS Space Grotesk, rejete par les 2 modeles
//   comme rupture "tech/sci-fi" avec l'esthetique parchemin)
// + systeme d'etats a 3 niveaux propose par GPT : l'Afrique reste sujet
//   permanent, les autres continents montent en contraste quand une route
//   les implique (demo ici : route Afrique -> Europe).

const COLORS = {
  ocean: "#C8D7DC",
  oceanLight: "#D7E2E4",
  oceanDark: "#B8CAD1",
  restDuMonde: "#C3BDAF",
  restDuMondeActif: "#D9C9A8", // continent "monte en contraste" quand implique dans une route
  afriqueBase: "#9E4F2E",
  afriqueMid: "#C46A35",
  afriqueEdge: "#DFA34A",
  encre: "#3A2A18",
  fontiereMonde: "#8B8172",
  fontiereMondeActif: "#5C4A36",
  cream: "#F2E5C8",
  ombre: "#3A2A18",
};

type GeoCountry = { id: string; name: string; isAfrica: boolean; d: string };
type MapData = { width: number; height: number; sphereD: string; countries: GeoCountry[] };

// Pays europeens impliques dans la route de demonstration (Afrique -> Europe) :
// ils passent en etat "actif" (contraste monte) pendant la sequence route.
const ROUTE_ACTIVE_IDS = new Set(["250", "620", "724", "380"]); // France, Portugal, Espagne, Italie

export const ProtoAtlasMondePalimpseste: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

  const titleOp = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase route : a partir du frame 150, les pays impliques dans la route
  // Afrique->Europe montent en contraste (etat "actif" du systeme 3 niveaux).
  const routeActiveProgress = interpolate(frame, [150, 190], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hachures Afrique : opacite pleine en vue monde, prevue pour descendre au
  // zoom (ici simulee par un simple fade-in, le vrai zoom sera cable plus tard).
  const hachureOpacity = spring({ frame: frame - 20, fps, config: { damping: 20 } }) * 0.32;

  const glowShift = interpolate(frame, [0, 120], [30, 50], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  if (!mapData) {
    return <AbsoluteFill style={{ background: COLORS.ocean }} />;
  }

  const africaCountries = mapData.countries.filter((c) => c.isAfrica);
  const restCountries = mapData.countries.filter((c) => !c.isAfrica);
  const africaCombinedD = africaCountries.map((c) => c.d).join(" ");

  return (
    <AbsoluteFill style={{ background: COLORS.ocean }}>
      <svg viewBox={`0 0 ${mapData.width} ${mapData.height}`} style={{ width: "100%", height: "100%" }}>
        <defs>
          <radialGradient id="oceanGradient" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor={COLORS.oceanLight} />
            <stop offset="60%" stopColor={COLORS.ocean} />
            <stop offset="100%" stopColor={COLORS.oceanDark} />
          </radialGradient>

          <linearGradient id="afriqueGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.afriqueBase} />
            <stop offset={`${glowShift}%`} stopColor={COLORS.afriqueMid} />
            <stop offset="100%" stopColor={COLORS.afriqueEdge} />
          </linearGradient>

          <pattern id="hachuresAfrique" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke={COLORS.encre} strokeWidth={1.5} />
          </pattern>
        </defs>

        {/* Ocean : degrade radial doux (remplace l'aplat uni) */}
        <rect x={0} y={0} width={mapData.width} height={mapData.height} fill="url(#oceanGradient)" />

        {/* Graticule discret — signature atlas, sous les continents */}
        <g opacity={0.16} stroke={COLORS.encre} strokeWidth={0.6} fill="none">
          {Array.from({ length: 12 }, (_, i) => {
            const x = (mapData.width / 12) * i;
            return <line key={`v${i}`} x1={x} y1={0} x2={x} y2={mapData.height} />;
          })}
          {Array.from({ length: 7 }, (_, i) => {
            const y = (mapData.height / 7) * i;
            return <line key={`h${i}`} x1={0} y1={y} x2={mapData.width} y2={y} />;
          })}
        </g>

        {/* Reste du monde : rechauffe (plus "zone morte"), etat actif possible */}
        <g>
          {restCountries.map((c) => {
            const isActive = ROUTE_ACTIVE_IDS.has(c.id);
            const fill = isActive
              ? interpolateColor(COLORS.restDuMonde, COLORS.restDuMondeActif, routeActiveProgress)
              : COLORS.restDuMonde;
            return <path key={c.id} d={c.d} fill={fill} stroke="none" />;
          })}
        </g>
        {/* Frontieres monde : CONTINUES fines sepia (jamais pointillees fantomes) */}
        <g fill="none">
          {restCountries.map((c) => {
            const isActive = ROUTE_ACTIVE_IDS.has(c.id);
            const stroke = isActive
              ? interpolateColor(COLORS.fontiereMonde, COLORS.fontiereMondeActif, routeActiveProgress)
              : COLORS.fontiereMonde;
            const strokeWidth = 0.55 + (isActive ? routeActiveProgress * 0.35 : 0);
            const opacity = 0.35 + (isActive ? routeActiveProgress * 0.4 : 0);
            return (
              <path
                key={`border-${c.id}`}
                d={c.d}
                stroke={stroke}
                strokeWidth={strokeWidth}
                opacity={opacity}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>

        {/* Ombre portee Afrique : duplication de path decalee (pas de blur) */}
        <path d={africaCombinedD} fill={COLORS.ombre} opacity={0.18} transform="translate(3 3)" />

        {/* Afrique : sujet permanent — degrade + contour net + hachures */}
        <g>
          {africaCountries.map((c) => (
            <path
              key={c.id}
              d={c.d}
              fill="url(#afriqueGradient)"
              stroke={COLORS.encre}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        <g opacity={hachureOpacity} style={{ mixBlendMode: "multiply" }}>
          {africaCountries.map((c) => (
            <path key={`hatch-${c.id}`} d={c.d} fill="url(#hachuresAfrique)" stroke="none" />
          ))}
        </g>

        <text
          x={mapData.width / 2}
          y={90}
          textAnchor="middle"
          fill={COLORS.cream}
          fontSize={38}
          fontFamily={cinzel}
          fontWeight="bold"
          letterSpacing={4}
          opacity={titleOp}
          style={{ fontVariant: "small-caps" }}
        >
          Le Palimpseste Mondial
        </text>

        <text
          x={mapData.width / 2}
          y={mapData.height - 40}
          textAnchor="middle"
          fill={COLORS.encre}
          fontSize={16}
          fontFamily={sourceSans}
          opacity={interpolate(frame, [150, 175], [0, 0.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        >
          Route active : France · Espagne · Portugal · Italie
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
