// La Nouvelle-France — Atlas POC — d3-geo Natural Earth
// Territoire 1712 : 10 000 000 km² sur fond de carte reelle
// Format : 1920x1080 (16:9), 18s, 30fps = 540 frames

import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from "remotion";

export const NOUVELLE_FRANCE_FRAMES = 540;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const geoData = require("../../../../data/geo/nouvelle-france-data.json");
// Path: src/projects/atlas/quebec-poc/ -> ../../../../ = src/ -> data/geo/

const C = {
  ocean: "#0f1f3d",
  oceanLight: "#162840",
  land: "#2a3528",
  landStroke: "#1e271c",
  nouvelleFrance: "#c49a2a",
  nouvelleFranceStroke: "#e8c96a",
  coloniesAnglaises: "#6a1a1a",
  saintLaurent: "#1a4a7a",
  gold: "#c9a84c",
  goldLight: "#e8c96a",
  cartouche: "#0d1520",
  text: "#f0e6c8",
  cityDot: "#e8c96a",
  coureur: "#c87840",
};

const T = {
  mapReveal: 0,        // 0-40 : fond carte apparait
  territoriesIn: 60,   // 2s : Nouvelle-France se colore
  coloniesIn: 130,     // 4.3s : colonies anglaises
  riverIn: 180,        // 6s : Saint-Laurent
  coureurIn: 220,      // 7.3s : sprite coureur des bois
  citiesIn: 260,       // 8.7s : villes apparaissent
  cartouche1In: 320,   // 10.7s : "10 000 000 km²"
  cartouche2In: 400,   // 13.3s : comparaison
  holdEnd: 540,        // 18s
};

function fadeIn(frame: number, start: number, dur = 25) {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function Cartouche({
  x, y, w, h, opacity, children,
}: { x: number; y: number; w: number; h: number; opacity: number; children?: React.ReactNode }) {
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={w} height={h} fill={C.cartouche} rx={5} opacity={0.93} />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={C.gold} strokeWidth={2.5} rx={5} />
      <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16}
        fill="none" stroke={C.gold} strokeWidth={0.7} rx={3} opacity={0.35} />
      {[
        [x + 7, y + 7], [x + w - 7, y + 7],
        [x + 7, y + h - 7], [x + w - 7, y + h - 7],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={4.5} fill={C.gold} opacity={0.65} />
          <circle cx={cx} cy={cy} r={2} fill={C.goldLight} />
        </g>
      ))}
      {children}
    </g>
  );
}

// Sprite coureur des bois (pixel art SVG inline, ~32px)
function CoureurDesBoiSprite({ x, y, opacity, frame }: { x: number; y: number; opacity: number; frame: number }) {
  const hop = Math.abs(Math.sin(frame * 0.12)) * 4;
  return (
    <g transform={`translate(${x - 16}, ${y - 32 - hop})`} opacity={opacity}>
      {/* Corps */}
      <rect x={8} y={14} width={16} height={14} fill="#8B4513" rx={2} />
      {/* Tete */}
      <rect x={10} y={6} width={12} height={10} fill="#D2996A" rx={2} />
      {/* Chapeau */}
      <rect x={8} y={4} width={16} height={4} fill="#3d2a1a" rx={1} />
      <rect x={6} y={6} width={20} height={2} fill="#3d2a1a" rx={1} />
      {/* Jambes */}
      <rect x={9} y={28} width={5} height={8} fill="#5c3d1e" rx={1} />
      <rect x={18} y={28} width={5} height={8} fill="#5c3d1e" rx={1} />
      {/* Pagaie */}
      <line x1={24} y1={14} x2={30} y2={30} stroke="#8B6914" strokeWidth={2} strokeLinecap="round" />
      <ellipse cx={30} cy={31} rx={4} ry={2} fill="#8B6914" />
      {/* Canot */}
      <path d="M0,34 Q16,40 32,34" fill="none" stroke="#5c3d1e" strokeWidth={3} strokeLinecap="round" />
      <path d="M2,34 Q16,38 30,34 L30,36 Q16,40 2,36 Z" fill="#7a4e28" opacity={0.8} />
    </g>
  );
}

export function NouvelleFrance() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mapOpacity = fadeIn(frame, T.mapReveal, 45);

  // Territoire Nouvelle-France : apparition progressive (fill + stroke)
  const nfOpacity = fadeIn(frame, T.territoriesIn, 40);
  const nfFillOpacity = interpolate(frame, [T.territoriesIn, T.territoriesIn + 60], [0, 0.45], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Colonies anglaises
  const colOpacity = fadeIn(frame, T.coloniesIn, 30);
  const colFillOpacity = interpolate(frame, [T.coloniesIn, T.coloniesIn + 40], [0, 0.5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Saint-Laurent : trait qui se dessine
  const riverProgress = interpolate(frame, [T.riverIn, T.riverIn + 50], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const riverDash = 2000;
  const riverOffset = riverDash * (1 - riverProgress);

  // Coureur des bois
  const coureurOpacity = fadeIn(frame, T.coureurIn, 20);

  // Villes
  const citiesOpacity = fadeIn(frame, T.citiesIn, 25);

  // Cartouche 1 : superficie
  const c1Opacity = fadeIn(frame, T.cartouche1In, 30);
  // Zoom sur chiffre (spring bounce)
  const c1Scale = spring({ frame: frame - T.cartouche1In, fps, config: { damping: 10, stiffness: 120 } });
  const c1ScaleClamped = Math.min(c1Scale, 1.0);

  // Cartouche 2 : comparaison
  const c2Opacity = fadeIn(frame, T.cartouche2In, 30);

  // Legerement drift la carte apres reveal (camera pan tres doux vers l'est)
  const cameraDrift = interpolate(frame, [T.citiesIn, T.holdEnd], [0, -18], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Pulse sur Quebec
  const pulseR = 8 + 3 * Math.sin(frame * 0.14);
  const pulseOpacity = 0.5 + 0.25 * Math.sin(frame * 0.14);

  return (
    <AbsoluteFill style={{ background: C.ocean }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080"
        style={{ position: "absolute", top: 0, left: 0 }}>

        <defs>
          <linearGradient id="oceanG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.oceanLight} />
            <stop offset="100%" stopColor={C.ocean} />
          </linearGradient>
          <filter id="softglow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ocean */}
        <rect width="1920" height="1080" fill="url(#oceanG)" opacity={mapOpacity} />

        {/* Carte du monde — pays d'Amerique du Nord */}
        <g opacity={mapOpacity} transform={`translate(${cameraDrift}, 0)`}>

          {/* Pays fond */}
          {geoData.countries.map((c: { iso: string; d: string }) => (
            <path
              key={c.iso}
              d={c.d}
              fill={C.land}
              stroke={C.landStroke}
              strokeWidth={0.8}
            />
          ))}

          {/* Territoire Nouvelle-France */}
          <path
            d={geoData.nouvelleFrancePath}
            fill={C.nouvelleFrance}
            fillOpacity={nfFillOpacity}
            stroke={C.nouvelleFranceStroke}
            strokeWidth={2.5}
            strokeOpacity={nfOpacity}
            filter="url(#softglow)"
          />

          {/* Colonies anglaises */}
          <path
            d={geoData.coloniesAnglaisePath}
            fill={C.coloniesAnglaises}
            fillOpacity={colFillOpacity}
            stroke="#aa3333"
            strokeWidth={1.5}
            strokeOpacity={colOpacity}
          />

          {/* Saint-Laurent / Mississippi */}
          <path
            d={geoData.saintLaurentPath}
            fill="none"
            stroke={C.saintLaurent}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={riverDash}
            strokeDashoffset={riverOffset}
            opacity={0.85}
          />

          {/* Villes */}
          {geoData.cities.map((city: { name: string; x: number; y: number }) => (
            <g key={city.name} opacity={citiesOpacity}>
              <circle cx={city.x} cy={city.y} r={5} fill={C.cityDot} />
              <circle cx={city.x} cy={city.y} r={2.5} fill="white" opacity={0.9} />
              <text
                x={city.x + 9}
                y={city.y + 4}
                fill={C.text}
                fontSize={14}
                fontFamily="Georgia, serif"
                fontStyle="italic"
                opacity={0.9}
              >
                {city.name}
              </text>
            </g>
          ))}

          {/* Pulse Quebec */}
          <circle
            cx={geoData.cities[0].x}
            cy={geoData.cities[0].y}
            r={pulseR}
            fill={C.gold}
            opacity={pulseOpacity * citiesOpacity}
          />

          {/* Coureur des bois */}
          <CoureurDesBoiSprite
            x={geoData.coureurPosition.x}
            y={geoData.coureurPosition.y}
            opacity={coureurOpacity}
            frame={frame}
          />

          {/* Labels territoire */}
          <text
            x={1050} y={520}
            fill={C.goldLight}
            fontSize={22}
            fontFamily="Georgia, serif"
            fontStyle="italic"
            textAnchor="middle"
            opacity={nfOpacity * 0.7}
            letterSpacing="2"
          >
            NOUVELLE-FRANCE
          </text>
          <text
            x={1330} y={700}
            fill="#cc8888"
            fontSize={16}
            fontFamily="Georgia, serif"
            fontStyle="italic"
            textAnchor="middle"
            opacity={colOpacity * 0.8}
          >
            Colonies anglaises
          </text>
        </g>

        {/* Cartouche 1 — 10 000 000 km² */}
        <Cartouche x={60} y={60} w={380} h={155} opacity={c1Opacity}>
          <text x={250} y={100} fill={C.gold} fontSize={12}
            fontFamily="Georgia, serif" textAnchor="middle"
            opacity={0.7} letterSpacing="3">
            APOGÉE 1712
          </text>
          <text x={250} y={138}
            fill={C.goldLight}
            fontSize={42}
            fontFamily="Georgia, serif"
            fontWeight="bold"
            textAnchor="middle"
            transform={`scale(${c1ScaleClamped}) translate(${250 * (1 - c1ScaleClamped)}, ${138 * (1 - c1ScaleClamped)})`}
          >
            10 000 000 km²
          </text>
          <text x={250} y={160} fill={C.text} fontSize={14}
            fontFamily="Georgia, serif" textAnchor="middle" opacity={0.8}>
            Plus grand empire de France
          </text>
          <text x={250} y={178} fill={C.text} fontSize={12}
            fontFamily="Georgia, serif" textAnchor="middle" opacity={0.6}>
            de l'Atlantique aux Rocheuses
          </text>
        </Cartouche>

        {/* Cartouche 2 — comparaison demographique */}
        <Cartouche x={1480} y={60} w={400} h={155} opacity={c2Opacity}>
          <text x={1680} y={100} fill={C.gold} fontSize={12}
            fontFamily="Georgia, serif" textAnchor="middle"
            opacity={0.7} letterSpacing="3">
            POPULATION 1760
          </text>
          <text x={1680} y={132}
            fill={C.nouvelleFranceStroke}
            fontSize={26}
            fontFamily="Georgia, serif"
            fontWeight="bold"
            textAnchor="middle"
          >
            70 000 Français
          </text>
          <text x={1680} y={152} fill={C.text} fontSize={13}
            fontFamily="Georgia, serif" textAnchor="middle" opacity={0.7}>
            contre
          </text>
          <text x={1680} y={175}
            fill="#cc6666"
            fontSize={26}
            fontFamily="Georgia, serif"
            fontWeight="bold"
            textAnchor="middle"
          >
            1 500 000 Anglais
          </text>
        </Cartouche>

        {/* Titre bas de page */}
        <text x={960} y={1055} fill={C.gold} fontSize={14}
          fontFamily="Georgia, serif" textAnchor="middle"
          opacity={mapOpacity * 0.45} letterSpacing="4">
          LA NOUVELLE-FRANCE · 1534 – 1763 · L'EMPIRE OUBLIÉ
        </text>
      </svg>
    </AbsoluteFill>
  );
}
