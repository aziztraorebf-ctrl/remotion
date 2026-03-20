import React, { useEffect, useState, useRef } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  delayRender,
  continueRender,
  staticFile,
} from "remotion";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";

// ============================================================
// GEO SHORT V2 — Maps-only, 60s, 1080x1920
//
// Version sans personnages, pure carte + data.
// Sujet : "Pourquoi Israel peut frapper l'Iran depuis si loin"
//
// 0-60f    (2s)  Hook titre — fond sombre
// 60-360f  (10s) Carte Moyen-Orient — Israel + Iran s'allument
// 360-660f (10s) Zoom Israel + arc animé Tel Aviv -> Natanz
// 660-900f (8s)  Encart comparaison Israel / France (taille)
// 900-1200f(10s) Stats live — portee F-35I, distances
// 1200-1500f(10s)Zoom narratif Natanz + pulsation
// 1500-1800f(10s)Outro — recap chiffres + CTA
// ============================================================

const W = 1080;
const H = 1920;

// ISO codes pays
const ISO_IRAN    = 364;
const ISO_ISRAEL  = 376;
const ISO_SAUDI   = 682;
const ISO_IRAQ    = 368;
const ISO_TURKEY  = 792;
const ISO_EGYPT   = 818;
const ISO_JORDAN  = 400;
const ISO_LEBANON = 422;
const ISO_SYRIA   = 760;
const ISO_FRANCE  = 250;

// Coordonnees geographiques (lon, lat)
const COORDS = {
  telaviv:   [34.78, 32.09] as [number, number],
  natanz:    [51.72, 33.72] as [number, number],
  tehran:    [51.42, 35.69] as [number, number],
  jerusalem: [35.21, 31.77] as [number, number],
  paris:     [2.35, 48.85]  as [number, number],
};

// Palette GeoGlobeTales coloree + lisible
const C = {
  ocean:        "#a8d5e8",
  land:         "#d4ccc4",
  landStroke:   "#b0a898",
  iran:         "#e07040",
  iranStroke:   "#a04010",
  israel:       "#5080e0",
  israelStroke: "#2050b0",
  saudi:        "#c5bc9e",
  iraq:         "#c5bc9e",
  turkey:       "#d4ccc4",
  egypt:        "#c5bc9e",
  jordan:       "#d4ccc4",
  lebanon:      "#d4ccc4",
  syria:        "#d4ccc4",
  france:       "#6ab0e0",
  red:          "#e03030",
  blue:         "#2060d0",
  gold:         "#f0b000",
  white:        "#ffffff",
  dark:         "#0a0a1a",
  darkCard:     "rgba(10,10,26,0.92)",
  textDark:     "#111111",
} as const;

type Topology = Parameters<typeof topojson.feature>[0];

// ============================================================
// HELPERS PROJECTION
// ============================================================

function buildProj(scale: number, cx: number, cy: number, centerLon = 44, centerLat = 30) {
  return d3Geo
    .geoMercator()
    .center([centerLon, centerLat])
    .scale(scale)
    .translate([cx, cy]);
}

// Calcule la longueur approximative d'un path SVG bezier
function bezierLength(
  x1: number, y1: number,
  cx: number, cy: number,
  x2: number, y2: number,
  steps = 100
): number {
  let len = 0;
  let px = x1, py = y1;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const nx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    const ny = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
    len += Math.sqrt((nx - px) ** 2 + (ny - py) ** 2);
    px = nx; py = ny;
  }
  return len;
}

// ============================================================
// COMPOSANT CARTE GENERIQUE
// ============================================================

const GeoBase: React.FC<{
  topology: Topology;
  proj: d3Geo.GeoProjection;
  highlightIsrael?: boolean;
  highlightIran?: boolean;
  highlightFrance?: boolean;
  dim?: boolean;
}> = ({ topology, proj, highlightIsrael, highlightIran, highlightFrance, dim }) => {
  const path = d3Geo.geoPath().projection(proj);
  const countries = topojson.feature(topology, (topology as any).objects.countries);
  const features = (countries as any).features as any[];

  function getColor(id: number): string {
    if (id === ISO_IRAN && highlightIran)    return C.iran;
    if (id === ISO_ISRAEL && highlightIsrael) return C.israel;
    if (id === ISO_FRANCE && highlightFrance) return C.france;
    switch (id) {
      case ISO_IRAN:    return dim ? "#d4b898" : C.iran;
      case ISO_ISRAEL:  return dim ? "#a0b0d4" : C.israel;
      case ISO_SAUDI:   return C.saudi;
      case ISO_IRAQ:    return C.iraq;
      case ISO_TURKEY:  return C.turkey;
      case ISO_EGYPT:   return C.egypt;
      case ISO_JORDAN:  return C.jordan;
      case ISO_LEBANON: return C.lebanon;
      case ISO_SYRIA:   return C.syria;
      default:          return C.land;
    }
  }

  function getStroke(id: number): string {
    if (id === ISO_IRAN)   return C.iranStroke;
    if (id === ISO_ISRAEL) return C.israelStroke;
    if (id === ISO_FRANCE) return "#3070a0";
    return C.landStroke;
  }

  function getStrokeW(id: number): number {
    if (id === ISO_IRAN || id === ISO_ISRAEL || id === ISO_FRANCE) return 2.5;
    return 0.8;
  }

  return (
    <>
      <rect x={0} y={0} width={W} height={H} fill={C.ocean} />
      {features.map((f: any) => {
        const d = path(f);
        if (!d) return null;
        const id = Number(f.id);
        return (
          <path
            key={f.id}
            d={d}
            fill={getColor(id)}
            stroke={getStroke(id)}
            strokeWidth={getStrokeW(id)}
          />
        );
      })}
    </>
  );
};

// ============================================================
// PHASE 1 : HOOK TITRE
// ============================================================

const PhaseHook: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });
  const titleY = interpolate(s, [0, 1], [60, 0]);
  const fadeIn  = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [45, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: C.dark, opacity: fadeIn * fadeOut }}>
      {/* Ligne gradient rouge-or */}
      <div style={{
        position: "absolute", top: 680, left: 80, right: 80,
        height: 4, background: `linear-gradient(to right, ${C.red}, ${C.gold})`,
        borderRadius: 2,
      }} />

      <div style={{
        position: "absolute", top: 700, left: 0, right: 0,
        transform: `translateY(${titleY}px)`,
        display: "flex", flexDirection: "column", alignItems: "center", padding: "0 70px",
      }}>
        <div style={{
          fontSize: 26, color: C.gold, fontFamily: "Arial, sans-serif",
          fontWeight: "bold", textTransform: "uppercase", letterSpacing: 5, marginBottom: 20,
        }}>
          Geopolitique
        </div>
        <div style={{
          fontSize: 68, color: C.white, fontFamily: "Arial Black, sans-serif",
          fontWeight: 900, textAlign: "center", lineHeight: 1.1, marginBottom: 28,
        }}>
          Comment Israel frappe l&apos;Iran
        </div>
        <div style={{
          fontSize: 52, color: C.red, fontFamily: "Arial, sans-serif",
          fontWeight: "bold", textAlign: "center",
        }}>
          a 1 800 km
        </div>
        <div style={{
          fontSize: 26, color: "rgba(255,255,255,0.55)", fontFamily: "Arial, sans-serif",
          marginTop: 28, textAlign: "center",
        }}>
          La reponse en 60 secondes
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 2 : CARTE MOYEN-ORIENT — Israel + Iran s'allument
// ============================================================

const PhaseMapBase: React.FC<{
  topology: Topology;
  frame: number; // frame locale
  fps: number;
}> = ({ topology, frame, fps }) => {
  const proj = buildProj(2400, W / 2, 900);

  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  // Israel s'allume a frame 20
  const israelS = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 200 } });
  const israelScale = interpolate(israelS, [0, 1], [0.9, 1]);

  // Iran s'allume a frame 50
  const iranS = spring({ frame: frame - 50, fps, config: { damping: 20, stiffness: 200 } });

  // Labels spring
  const labelIsrael = spring({ frame: frame - 25, fps, config: { damping: 20, stiffness: 220 } });
  const labelIran = spring({ frame: frame - 55, fps, config: { damping: 20, stiffness: 220 } });

  // Cercle de portee 2000km — apparait apres Iran frame 100
  const rangeS = spring({ frame: frame - 100, fps, config: { damping: 18, stiffness: 140 } });

  const pTelAviv = proj(COORDS.telaviv) as [number, number];
  const pTehran  = proj(COORDS.tehran)  as [number, number];

  // Rayon en pixels correspondant a 2000 km a cette echelle
  // Mercator scale=2400 : 1 degre lon ~ 2400/360 * 2pi px ~ 41.9 px
  // 2000 km ~ 18 degres lon a lat=32 -> 18 * 41.9 * cos(32deg) ~ 18 * 41.9 * 0.848 ~ 640 px
  const rangeRadiusPx = 640;

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={W} height={H}>
        <GeoBase topology={topology} proj={proj} highlightIsrael highlightIran />

        {/* Pulsation Israel */}
        {israelS > 0.1 && (
          <>
            <circle cx={pTelAviv[0]} cy={pTelAviv[1]} r={22 * israelS} fill="none"
              stroke={C.israel} strokeWidth={2} opacity={(1 - israelS) * 0.6} />
            <circle cx={pTelAviv[0]} cy={pTelAviv[1]} r={10} fill={C.israel}
              stroke={C.white} strokeWidth={2} opacity={israelS} />
          </>
        )}

        {/* Pulsation Iran */}
        {iranS > 0.1 && (
          <>
            <circle cx={pTehran[0]} cy={pTehran[1]} r={28 * iranS} fill="none"
              stroke={C.iran} strokeWidth={2} opacity={(1 - iranS) * 0.6} />
            <circle cx={pTehran[0]} cy={pTehran[1]} r={12} fill={C.iran}
              stroke={C.white} strokeWidth={2} opacity={iranS} />
          </>
        )}

        {/* Cercle de portee F-35I : 2000 km depuis Tel Aviv */}
        {rangeS > 0.01 && (
          <g opacity={rangeS}>
            <circle
              cx={pTelAviv[0]} cy={pTelAviv[1]}
              r={rangeRadiusPx * rangeS}
              fill="rgba(80,128,224,0.07)"
              stroke={C.israel}
              strokeWidth={2.5}
              strokeDasharray="12 8"
            />
            <rect x={pTelAviv[0] + rangeRadiusPx * rangeS - 10} y={pTelAviv[1] - 52}
              width={148} height={36} rx={6} fill={C.dark} opacity={0.88} />
            <text
              x={pTelAviv[0] + rangeRadiusPx * rangeS + 64}
              y={pTelAviv[1] - 28}
              fontSize={17} fontWeight="bold" fill={C.israel}
              textAnchor="middle" fontFamily="Arial, sans-serif">
              Portee : 2 000 km
            </text>
          </g>
        )}

        {/* Label Israel */}
        <g opacity={labelIsrael}>
          <rect x={pTelAviv[0] - 75} y={pTelAviv[1] - 48} width={150} height={36}
            rx={6} fill="rgba(255,255,255,0.92)" />
          <text x={pTelAviv[0]} y={pTelAviv[1] - 24} fontSize={22} fontWeight="bold"
            fill={C.israel} textAnchor="middle" fontFamily="Arial, sans-serif">
            ISRAEL
          </text>
        </g>

        {/* Label Iran */}
        <g opacity={labelIran}>
          <rect x={pTehran[0] - 60} y={pTehran[1] - 48} width={120} height={36}
            rx={6} fill="rgba(255,255,255,0.92)" />
          <text x={pTehran[0]} y={pTehran[1] - 24} fontSize={22} fontWeight="bold"
            fill={C.iran} textAnchor="middle" fontFamily="Arial, sans-serif">
            IRAN
          </text>
        </g>
      </svg>

      {/* Titre top */}
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontSize: 38, fontWeight: 900, color: C.dark,
          fontFamily: "Arial Black, sans-serif", display: "inline-block",
          background: "rgba(255,255,255,0.92)", padding: "14px 36px",
          borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}>
          Moyen-Orient
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 3 : ZOOM ISRAEL + ARC ANIMÉ
// ============================================================

const PhaseArc: React.FC<{
  topology: Topology;
  frame: number;
  fps: number;
}> = ({ topology, frame, fps }) => {
  // Zoom modere — centrer sur milieu Israel-Iran, Israel visible a gauche
  const zoomS = spring({ frame, fps, config: { damping: 30, stiffness: 100 } });
  const scale = interpolate(zoomS, [0, 1], [2400, 3200]);
  const cx    = interpolate(zoomS, [0, 1], [W / 2, W * 0.42]);
  const cy    = interpolate(zoomS, [0, 1], [900, 920]);
  const lonC  = interpolate(zoomS, [0, 1], [44, 42]);
  const latC  = interpolate(zoomS, [0, 1], [30, 31]);

  const proj = buildProj(scale, cx, cy, lonC, latC);

  const pTelAviv = proj(COORDS.telaviv) as [number, number];
  const pNatanz  = proj(COORDS.natanz)  as [number, number];

  // Point de controle bezier (courbure vers le haut-nord)
  const ctrlX = (pTelAviv[0] + pNatanz[0]) / 2 - 60;
  const ctrlY = Math.min(pTelAviv[1], pNatanz[1]) - 350;

  // Longueur reelle de l'arc
  const arcLen = bezierLength(
    pTelAviv[0], pTelAviv[1],
    ctrlX, ctrlY,
    pNatanz[0], pNatanz[1]
  );

  // Arc progress — commence a frame 60 (2s apres le zoom)
  const arcProgress = interpolate(frame, [60, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dashOffset = arcLen * (1 - arcProgress);
  const arcPath = `M ${pTelAviv[0]} ${pTelAviv[1]} Q ${ctrlX} ${ctrlY} ${pNatanz[0]} ${pNatanz[1]}`;

  // Position de la "tete" du missile le long de l'arc
  const t = arcProgress;
  const headX = (1-t)*(1-t)*pTelAviv[0] + 2*(1-t)*t*ctrlX + t*t*pNatanz[0];
  const headY = (1-t)*(1-t)*pTelAviv[1] + 2*(1-t)*t*ctrlY + t*t*pNatanz[1];

  // Badge distance apparait quand arc > 50%
  const badgeOp = interpolate(arcProgress, [0.5, 0.7], [0, 1], { extrapolateRight: "clamp" });

  // Label Natanz apparait quand arc arrive
  const natanzOp = interpolate(arcProgress, [0.85, 1], [0, 1], { extrapolateRight: "clamp" });

  // Timer de vol : 0h00 -> 2h28 synchronise avec arcProgress
  const totalMinutes = 148; // 2h28
  const elapsedMinutes = Math.round(arcProgress * totalMinutes);
  const timerH = Math.floor(elapsedMinutes / 60);
  const timerM = elapsedMinutes % 60;
  const timerStr = `${timerH}h${String(timerM).padStart(2, "0")}`;
  const timerOp = interpolate(arcProgress, [0.05, 0.2], [0, 1], { extrapolateRight: "clamp" });

  // Waypoints espace aerien le long de l'arc (t = position 0->1)
  // t~0.30 = survol Jordanie, t~0.50 = Irak, t~0.72 = approche Iran
  const waypoints = [
    { t: 0.28, label: "Espace aerien jordanien" },
    { t: 0.52, label: "Survol Irak" },
    { t: 0.74, label: "Entree Iran" },
  ];

  function bezierPoint(t: number): [number, number] {
    return [
      (1-t)*(1-t)*pTelAviv[0] + 2*(1-t)*t*ctrlX + t*t*pNatanz[0],
      (1-t)*(1-t)*pTelAviv[1] + 2*(1-t)*t*ctrlY + t*t*pNatanz[1],
    ];
  }

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Pulsation sur Natanz apres arrivee
  const pulseFrame = Math.max(0, frame - 210);
  const pulseR = interpolate(pulseFrame % 60, [0, 60], [8, 35]);
  const pulseOp = interpolate(pulseFrame % 60, [0, 40, 60], [0.8, 0.2, 0]);

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={W} height={H}>
        <GeoBase topology={topology} proj={proj} highlightIsrael highlightIran />

        {/* Ombre arc */}
        {arcProgress > 0 && (
          <path d={arcPath} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={6}
            strokeDasharray={`${arcLen} ${arcLen}`}
            strokeDashoffset={dashOffset + 3} strokeLinecap="round" />
        )}

        {/* Arc principal rouge */}
        {arcProgress > 0 && (
          <path d={arcPath} fill="none" stroke={C.red} strokeWidth={4}
            strokeDasharray={`${arcLen} ${arcLen}`}
            strokeDashoffset={dashOffset} strokeLinecap="round" />
        )}

        {/* Tete du missile (boule rouge mobile) */}
        {arcProgress > 0 && arcProgress < 0.98 && (
          <circle cx={headX} cy={headY} r={9} fill={C.red} />
        )}

        {/* Pulsation Natanz apres impact */}
        {arcProgress >= 0.98 && pulseFrame < 180 && (
          <>
            <circle cx={pNatanz[0]} cy={pNatanz[1]} r={pulseR}
              fill="none" stroke={C.red} strokeWidth={2.5} opacity={pulseOp} />
            <circle cx={pNatanz[0]} cy={pNatanz[1]} r={10} fill={C.red} />
          </>
        )}

        {/* Point Tel Aviv */}
        <circle cx={pTelAviv[0]} cy={pTelAviv[1]} r={9} fill={C.israel}
          stroke={C.white} strokeWidth={2} />
        <text x={pTelAviv[0] - 10} y={pTelAviv[1] - 18} fontSize={18} fontWeight="bold"
          fill={C.israel} fontFamily="Arial, sans-serif">
          Tel Aviv
        </text>

        {/* Label Natanz — position adaptative (gauche si proche bord droit) */}
        {(() => {
          const labelW = 170;
          const labelH = 56;
          const onRight = pNatanz[0] < W - labelW - 30;
          const lx = onRight ? pNatanz[0] + 16 : pNatanz[0] - labelW - 16;
          const textAnchorX = lx + labelW / 2;
          return (
            <g opacity={natanzOp}>
              <rect x={lx} y={pNatanz[1] - 28} width={labelW} height={labelH}
                rx={8} fill={C.dark} opacity={0.9} />
              <text x={textAnchorX} y={pNatanz[1] - 6} fontSize={17} fontWeight="bold"
                fill={C.gold} textAnchor="middle" fontFamily="Arial, sans-serif">
                Natanz
              </text>
              <text x={textAnchorX} y={pNatanz[1] + 16} fontSize={13}
                fill={C.white} textAnchor="middle" fontFamily="Arial, sans-serif" opacity={0.8}>
                Site nucleaire
              </text>
            </g>
          );
        })()}

        {/* Waypoints espace aerien — apparaissent quand le missile les depasse */}
        {waypoints.map(({ t, label }) => {
          const wpOp = interpolate(arcProgress, [t - 0.02, t + 0.08], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          const fadeOut = interpolate(arcProgress, [t + 0.28, t + 0.38], [1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          if (wpOp <= 0) return null;
          const [wx, wy] = bezierPoint(t);
          const side = wx > W / 2 ? -1 : 1;
          const lw = 220;
          const lx = side === 1 ? wx + 14 : wx - lw - 14;
          return (
            <g key={label} opacity={wpOp * fadeOut}>
              <circle cx={wx} cy={wy} r={5} fill={C.white} opacity={0.7} />
              <line x1={wx} y1={wy} x2={side === 1 ? wx + 12 : wx - 12} y2={wy}
                stroke={C.white} strokeWidth={1.5} opacity={0.5} />
              <rect x={lx} y={wy - 22} width={lw} height={34} rx={6}
                fill="rgba(10,10,26,0.82)" />
              <text x={lx + lw / 2} y={wy + 1} fontSize={15} fill="rgba(255,255,255,0.85)"
                textAnchor="middle" fontFamily="Arial, sans-serif">
                {label}
              </text>
            </g>
          );
        })}

        {/* Timer de vol — coin haut gauche */}
        <g opacity={timerOp}>
          <rect x={50} y={120} width={200} height={72} rx={10} fill={C.dark} opacity={0.92} />
          <text x={150} y={148} fontSize={14} fill="rgba(255,255,255,0.6)"
            textAnchor="middle" fontFamily="Arial, sans-serif">
            Temps de vol
          </text>
          <text x={150} y={180} fontSize={34} fontWeight="bold" fill={C.gold}
            textAnchor="middle" fontFamily="Arial Black, sans-serif">
            {timerStr}
          </text>
        </g>

        {/* Badge distance au milieu de l'arc */}
        <g transform={`translate(${ctrlX + 20}, ${ctrlY - 10})`} opacity={badgeOp}>
          <rect x={-75} y={-28} width={150} height={56} rx={10} fill={C.dark} opacity={0.95} />
          <text x={0} y={-6} fontSize={24} fontWeight="bold" fill={C.gold}
            textAnchor="middle" fontFamily="Arial, sans-serif">
            1 800 km
          </text>
          <text x={0} y={16} fontSize={13} fill={C.white} textAnchor="middle"
            fontFamily="Arial, sans-serif" opacity={0.75}>
            Tel Aviv → Natanz
          </text>
        </g>
      </svg>

      {/* Titre */}
      <div style={{
        position: "absolute", top: 50, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontSize: 40, fontWeight: 900, color: C.dark, fontFamily: "Arial Black, sans-serif",
          display: "inline-block", background: "rgba(255,255,255,0.92)",
          padding: "12px 32px", borderRadius: 10,
        }}>
          La frappe
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 4 : COMPARAISON TAILLE ISRAEL / FRANCE
// ============================================================

const PhaseSize: React.FC<{
  topology: Topology;
  frame: number;
  fps: number;
}> = ({ topology, frame, fps }) => {
  const fadeIn  = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Deux cartes cote a cote : France a gauche, Israel a droite (meme echelle)
  // France centree sur Paris, Israel centre sur Jerusalem — echelle identique
  // Echelle calculee pour que la France tienne dans sa demi-largeur (~540px)
  // France : ~950km N-S, ~1050km E-O. A scale=3500, ~540px largeur -> OK
  const SHARED_SCALE = 3500;

  const projFrance  = buildProj(SHARED_SCALE, W * 0.22, H * 0.46, 2, 46.5);
  const projIsrael  = buildProj(SHARED_SCALE, W * 0.78, H * 0.46, 35.2, 31.5);

  const pathFrance = d3Geo.geoPath().projection(projFrance);
  const pathIsrael = d3Geo.geoPath().projection(projIsrael);

  const countries = topojson.feature(topology, (topology as any).objects.countries);
  const features  = (countries as any).features as any[];

  const franceFeature = features.find((f: any) => Number(f.id) === ISO_FRANCE);
  const israelFeature = features.find((f: any) => Number(f.id) === ISO_ISRAEL);

  const franceD  = franceFeature  ? pathFrance(franceFeature)  : null;
  const israelD  = israelFeature  ? pathIsrael(israelFeature)  : null;

  // Labels spring
  const labelS = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 200 } });
  const statS  = spring({ frame: frame - 60, fps, config: { damping: 18, stiffness: 160 } });
  const statY  = interpolate(statS, [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{
      background: "#f5f0e8",
      opacity: fadeIn * fadeOut,
    }}>
      {/* Titre */}
      <div style={{
        position: "absolute", top: 80, left: 0, right: 0, textAlign: "center",
        opacity: labelS,
      }}>
        <div style={{
          fontSize: 46, fontWeight: 900, color: C.dark,
          fontFamily: "Arial Black, sans-serif", lineHeight: 1.1,
        }}>
          Israel = taille de la Bretagne
        </div>
        <div style={{
          fontSize: 30, color: "#666", fontFamily: "Arial, sans-serif",
          marginTop: 14,
        }}>
          Meme echelle
        </div>
      </div>

      {/* Cartes */}
      <svg width={W} height={H}>
        {/* France */}
        {franceD && (
          <path d={franceD} fill={C.france} stroke="#3070a0" strokeWidth={2}
            opacity={labelS} />
        )}

        {/* Israel */}
        {israelD && (
          <path d={israelD} fill={C.israel} stroke={C.israelStroke} strokeWidth={2}
            opacity={labelS} />
        )}

        {/* Ligne separatrice */}
        <line x1={W/2} y1={200} x2={W/2} y2={H - 400}
          stroke="#cccccc" strokeWidth={2} strokeDasharray="8 6" opacity={labelS * 0.6} />

        {/* Labels cartes */}
        <g opacity={labelS}>
          <text x={W * 0.25} y={H * 0.82} fontSize={32} fontWeight="bold"
            fill={C.france} textAnchor="middle" fontFamily="Arial, sans-serif">
            France
          </text>
          <text x={W * 0.25} y={H * 0.82 + 36} fontSize={22}
            fill="#666" textAnchor="middle" fontFamily="Arial, sans-serif">
            551 000 km²
          </text>
        </g>
        <g opacity={labelS}>
          <text x={W * 0.75} y={H * 0.82} fontSize={32} fontWeight="bold"
            fill={C.israel} textAnchor="middle" fontFamily="Arial, sans-serif">
            Israel
          </text>
          <text x={W * 0.75} y={H * 0.82 + 36} fontSize={22}
            fill="#666" textAnchor="middle" fontFamily="Arial, sans-serif">
            22 000 km²
          </text>
        </g>
      </svg>

      {/* Stat en bas */}
      <div style={{
        position: "absolute", bottom: 220, left: 60, right: 60,
        transform: `translateY(${statY}px)`,
        opacity: statS,
      }}>
        <div style={{
          background: C.dark, borderRadius: 16, padding: "28px 36px", textAlign: "center",
        }}>
          <div style={{
            fontSize: 36, fontWeight: 900, color: C.red,
            fontFamily: "Arial Black, sans-serif",
          }}>
            25x plus petit que la France
          </div>
          <div style={{
            fontSize: 24, color: "rgba(255,255,255,0.75)",
            fontFamily: "Arial, sans-serif", marginTop: 10,
          }}>
            Et peut frapper a 1 800 km
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 5 : STATS LIVE — portee missiles, distances
// ============================================================

const PhaseStats: React.FC<{
  topology: Topology;
  frame: number;
  fps: number;
}> = ({ topology, frame, fps }) => {
  const proj = buildProj(2400, W / 2, 900);

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Stats qui apparaissent une par une
  const s1 = spring({ frame: frame - 10, fps, config: { damping: 20, stiffness: 180 } });
  const s2 = spring({ frame: frame - 50, fps, config: { damping: 20, stiffness: 180 } });
  const s3 = spring({ frame: frame - 90, fps, config: { damping: 20, stiffness: 180 } });

  // Compteur anime portee F-35I
  const rangeCount = Math.round(interpolate(frame, [50, 140], [0, 2000], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }));

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={W} height={H}>
        <GeoBase topology={topology} proj={proj} highlightIsrael highlightIran />

        {/* Arc fixe */}
        {(() => {
          const pTA = proj(COORDS.telaviv) as [number, number];
          const pNa = proj(COORDS.natanz)  as [number, number];
          const cX  = (pTA[0] + pNa[0]) / 2 - 40;
          const cY  = Math.min(pTA[1], pNa[1]) - 220;
          const len = bezierLength(pTA[0], pTA[1], cX, cY, pNa[0], pNa[1]);
          return (
            <>
              <path
                d={`M ${pTA[0]} ${pTA[1]} Q ${cX} ${cY} ${pNa[0]} ${pNa[1]}`}
                fill="none" stroke={C.red} strokeWidth={3}
                strokeDasharray={`${len} ${len}`} strokeDashoffset={0}
                strokeLinecap="round" opacity={0.7}
              />
              <circle cx={pNa[0]} cy={pNa[1]} r={8} fill={C.red} />
              <circle cx={pTA[0]} cy={pTA[1]} r={8} fill={C.israel} stroke={C.white} strokeWidth={2} />
            </>
          );
        })()}
      </svg>

      {/* Stats overlay */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: C.darkCard,
        padding: "36px 48px 60px",
        display: "flex", flexDirection: "column", gap: 24,
      }}>
        {/* Stat 1 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 18,
          opacity: s1, transform: `translateX(${interpolate(s1, [0,1], [-40,0])}px)`,
        }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%",
            background: C.red, display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0, fontSize: 22 }}>
            ✈
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.gold,
              fontFamily: "Arial Black, sans-serif" }}>
              {rangeCount.toLocaleString("fr-FR")} km
            </div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.7)",
              fontFamily: "Arial, sans-serif" }}>
              Portee F-35I (ravitaille)
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 18,
          opacity: s2, transform: `translateX(${interpolate(s2, [0,1], [-40,0])}px)`,
        }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%",
            background: C.blue, display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0, fontSize: 22 }}>
            🚀
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.gold,
              fontFamily: "Arial Black, sans-serif" }}>
              1 800 km
            </div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.7)",
              fontFamily: "Arial, sans-serif" }}>
              Tel Aviv → Site de Natanz
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div style={{
          display: "flex", alignItems: "center", gap: 18,
          opacity: s3, transform: `translateX(${interpolate(s3, [0,1], [-40,0])}px)`,
        }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%",
            background: "#e06000", display: "flex", alignItems: "center",
            justifyContent: "center", flexShrink: 0, fontSize: 22 }}>
            ⏱
          </div>
          <div>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.gold,
              fontFamily: "Arial Black, sans-serif" }}>
              ~2h30
            </div>
            <div style={{ fontSize: 20, color: "rgba(255,255,255,0.7)",
              fontFamily: "Arial, sans-serif" }}>
              Temps de vol estime
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 6 : ZOOM NARRATIF NATANZ
// ============================================================

const PhaseZoomNatanz: React.FC<{
  topology: Topology;
  frame: number;
  fps: number;
}> = ({ topology, frame, fps }) => {
  const zoomS = spring({ frame, fps, config: { damping: 35, stiffness: 80 } });

  // Zoom reduit : garder le contexte geographique visible (Iran + pays voisins)
  const scale  = interpolate(zoomS, [0, 1], [2400, 5000]);
  const lonC   = interpolate(zoomS, [0, 1], [44, 50.5]);
  const latC   = interpolate(zoomS, [0, 1], [30, 33.0]);
  const transX = interpolate(zoomS, [0, 1], [W / 2, W * 0.42]);
  const transY = interpolate(zoomS, [0, 1], [900, 960]);

  const proj = buildProj(scale, transX, transY, lonC, latC);
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const pNatanz = proj(COORDS.natanz) as [number, number];
  const pTehran = proj(COORDS.tehran) as [number, number];

  // Pulsation d'alerte sur Natanz
  const pulseFrame = Math.max(0, frame - 60);
  const p1 = interpolate(pulseFrame % 45, [0, 45], [0, 1]);
  const p2 = interpolate((pulseFrame + 15) % 45, [0, 45], [0, 1]);

  const labelS = spring({ frame: frame - 80, fps, config: { damping: 20, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={W} height={H}>
        <GeoBase topology={topology} proj={proj} highlightIran dim />

        {/* Ondes d'alerte Natanz */}
        {pulseFrame > 0 && (
          <>
            <circle cx={pNatanz[0]} cy={pNatanz[1]} r={60 * p1}
              fill="none" stroke={C.red} strokeWidth={3} opacity={(1 - p1) * 0.7} />
            <circle cx={pNatanz[0]} cy={pNatanz[1]} r={60 * p2}
              fill="none" stroke={C.red} strokeWidth={2} opacity={(1 - p2) * 0.5} />
            <circle cx={pNatanz[0]} cy={pNatanz[1]} r={12} fill={C.red} />
          </>
        )}

        {/* Point Tehran */}
        <circle cx={pTehran[0]} cy={pTehran[1]} r={8} fill={C.iran}
          stroke={C.white} strokeWidth={2} opacity={labelS} />

        {/* Label Natanz */}
        <g opacity={labelS}>
          <rect x={pNatanz[0] + 20} y={pNatanz[1] - 38} width={200} height={74}
            rx={10} fill={C.dark} opacity={0.95} />
          <text x={pNatanz[0] + 120} y={pNatanz[1] - 14} fontSize={20} fontWeight="bold"
            fill={C.red} textAnchor="middle" fontFamily="Arial, sans-serif">
            NATANZ
          </text>
          <text x={pNatanz[0] + 120} y={pNatanz[1] + 10} fontSize={15}
            fill="rgba(255,255,255,0.8)" textAnchor="middle" fontFamily="Arial, sans-serif">
            Enrichissement uranium
          </text>
          <text x={pNatanz[0] + 120} y={pNatanz[1] + 30} fontSize={14}
            fill={C.gold} textAnchor="middle" fontFamily="Arial, sans-serif">
            Profondeur : 8m sous terre
          </text>
        </g>

        {/* Label Tehran */}
        <g opacity={labelS}>
          <text x={pTehran[0] + 14} y={pTehran[1] - 14} fontSize={18} fontWeight="bold"
            fill={C.iran} fontFamily="Arial, sans-serif">
            Tehran
          </text>
        </g>
      </svg>

      {/* Titre */}
      <div style={{
        position: "absolute", top: 50, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontSize: 38, fontWeight: 900, color: C.white,
          fontFamily: "Arial Black, sans-serif", display: "inline-block",
          background: C.dark, padding: "12px 32px", borderRadius: 10,
        }}>
          La cible
        </div>
      </div>

      {/* Encart explicatif — apparait avec le label */}
      <div style={{
        position: "absolute", bottom: 80, left: 60, right: 60,
        opacity: labelS,
        transform: `translateY(${interpolate(labelS, [0,1], [20,0])}px)`,
      }}>
        <div style={{
          background: "rgba(10,10,26,0.93)",
          borderRadius: 16,
          padding: "28px 32px",
          borderLeft: `5px solid ${C.red}`,
        }}>
          <div style={{
            fontSize: 32, fontWeight: 900, color: C.red,
            fontFamily: "Arial Black, sans-serif", marginBottom: 12,
          }}>
            Natanz — Site nucleaire
          </div>
          <div style={{
            fontSize: 22, color: "rgba(255,255,255,0.85)",
            fontFamily: "Arial, sans-serif", lineHeight: 1.4,
          }}>
            Centre d&apos;enrichissement d&apos;uranium.
            Enfoui a 8 metres sous terre.
          </div>
          <div style={{
            fontSize: 20, color: C.gold,
            fontFamily: "Arial, sans-serif", marginTop: 14,
          }}>
            A portee directe du F-35I israelien.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 7 : OUTRO
// ============================================================

const PhaseOutro: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  const fadeIn  = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [260, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const s1 = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });
  const s2 = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 160 } });
  const s3 = spring({ frame: frame - 40, fps, config: { damping: 18, stiffness: 160 } });
  const ctaS = spring({ frame: frame - 80, fps, config: { damping: 15, stiffness: 140 } });

  return (
    <AbsoluteFill style={{
      background: C.dark,
      opacity: fadeIn * fadeOut,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 70px",
      gap: 0,
    }}>
      {/* Titre recap */}
      <div style={{
        fontSize: 52, fontWeight: 900, color: C.white,
        fontFamily: "Arial Black, sans-serif", textAlign: "center",
        lineHeight: 1.1, marginBottom: 48,
        opacity: s1, transform: `translateY(${interpolate(s1, [0,1], [30,0])}px)`,
      }}>
        Israel peut frapper l&apos;Iran.
      </div>

      {/* 3 stats recap */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 16,
        width: "100%", marginBottom: 48,
      }}>
        {[
          { num: "1 800 km", label: "La distance", color: C.red, delay: s1 },
          { num: "2 000 km", label: "Portee du F-35I", color: C.blue, delay: s2 },
          { num: "2h30",     label: "Temps de vol", color: C.gold, delay: s3 },
        ].map(({ num, label, color, delay }) => (
          <div key={num} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(255,255,255,0.06)", borderRadius: 12,
            padding: "18px 28px",
            opacity: delay,
            transform: `translateX(${interpolate(delay, [0,1], [-30,0])}px)`,
          }}>
            <div style={{ fontSize: 38, fontWeight: 900, color,
              fontFamily: "Arial Black, sans-serif" }}>{num}</div>
            <div style={{ fontSize: 22, color: "rgba(255,255,255,0.7)",
              fontFamily: "Arial, sans-serif" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        opacity: ctaS,
        transform: `scale(${interpolate(ctaS, [0,1], [0.85,1])})`,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 36, fontWeight: "bold", color: C.gold,
          fontFamily: "Arial, sans-serif", marginBottom: 10,
        }}>
          Suis pour la suite
        </div>
        <div style={{
          fontSize: 22, color: "rgba(255,255,255,0.45)",
          fontFamily: "Arial, sans-serif",
        }}>
          Geopolitique expliquee en 60s
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export const GeoShortV2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [topology, setTopology] = useState<Topology | null>(null);
  const handleRef = useRef<number | null>(null);

  useEffect(() => {
    handleRef.current = delayRender("Loading topology");
    fetch(staticFile("assets/peste-pixel/maps/countries-50m.json"))
      .then((r) => r.json())
      .then((data) => {
        setTopology(data);
        if (handleRef.current !== null) continueRender(handleRef.current);
      })
      .catch(() => {
        if (handleRef.current !== null) continueRender(handleRef.current);
      });
    return () => {};
  }, []);

  if (!topology) return null;

  // Timing des phases (frames)
  const T = {
    hook:     { start: 0,    dur: 60  },
    mapBase:  { start: 60,   dur: 300 },
    arc:      { start: 360,  dur: 300 },
    size:     { start: 660,  dur: 240 },
    stats:    { start: 900,  dur: 300 },
    natanz:   { start: 1200, dur: 300 },
    outro:    { start: 1500, dur: 300 },
  };

  const local = (key: keyof typeof T) => frame - T[key].start;
  const active = (key: keyof typeof T, buffer = 30) =>
    frame >= T[key].start && frame < T[key].start + T[key].dur + buffer;

  return (
    <AbsoluteFill style={{ background: C.dark }}>
      {active("hook")    && <PhaseHook     frame={local("hook")}    fps={fps} />}
      {active("mapBase") && <PhaseMapBase  topology={topology} frame={local("mapBase")} fps={fps} />}
      {active("arc")     && <PhaseArc      topology={topology} frame={local("arc")}     fps={fps} />}
      {active("size")    && <PhaseSize     topology={topology} frame={local("size")}     fps={fps} />}
      {active("stats")   && <PhaseStats    topology={topology} frame={local("stats")}   fps={fps} />}
      {active("natanz")  && <PhaseZoomNatanz topology={topology} frame={local("natanz")} fps={fps} />}
      {active("outro")   && <PhaseOutro    frame={local("outro")}   fps={fps} />}
    </AbsoluteFill>
  );
};
