import React, { useEffect, useState } from "react";
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
// GEO SHORT TAIWAN — Maps-only, 60s, 1080x1920
//
// Sujet : "Cette ile de 36 000 km2 controle l'economie mondiale"
// Angle : dependance economique mondiale envers Taiwan (puces)
//
// 0-60f    (2s)  Hook titre — fond sombre
// 60-360f  (10s) Carte Asie-Pacifique — Taiwan s'allume
// 360-660f (10s) 3 arcs Taiwan -> USA / Europe / Chine (commandes)
// 660-900f (8s)  Comparaison taille Taiwan vs Bretagne
// 900-1200f(10s) Stats live — 92%, 450Mds$, NVIDIA, Apple
// 1200-1500f(10s)Zoom narratif Hsinchu (TSMC) + encart
// 1500-1800f(10s)Outro — recap + CTA
// ============================================================

const W = 1080;
const H = 1920;

// ISO codes pays
const ISO_TAIWAN   = 158;
const ISO_CHINA    = 156;
const ISO_JAPAN    = 392;
const ISO_SKOREA   = 410;
const ISO_USA      = 840;
const ISO_FRANCE   = 250;
const ISO_GERMANY  = 276;
const ISO_NETHER   = 528;
const ISO_RUSSIA   = 643;
const ISO_INDIA    = 356;
const ISO_MONGOLIA = 496;
const ISO_NKOREA   = 408;
const ISO_PHILIPPINE = 608;
const ISO_VIETNAM  = 704;
const ISO_THAILAND = 764;
const ISO_MYANMAR  = 104;
const ISO_LAOS     = 418;
const ISO_CAMBODIA = 116;
const ISO_MALAYSIA = 458;
const ISO_INDONESIA= 360;

// Coordonnees
const COORDS = {
  taiwan:     [121.0, 23.7]  as [number, number],
  hsinchu:    [120.97, 24.80] as [number, number],
  washington: [-77.0, 38.9]  as [number, number],
  newyork:    [-74.0, 40.7]  as [number, number],
  amsterdam:  [4.9,  52.4]   as [number, number],
  beijing:    [116.4, 39.9]  as [number, number],
  tokyo:      [139.7, 35.7]  as [number, number],
  paris:      [2.35, 48.85]  as [number, number],
};

// Palette
const C = {
  ocean:        "#a8d5e8",
  land:         "#d4ccc4",
  landStroke:   "#b0a898",
  taiwan:       "#e05050",
  taiwanStroke: "#a01010",
  china:        "#d4884a",
  chinaStroke:  "#a05020",
  japan:        "#e08080",
  usa:          "#5080e0",
  europe:       "#50b080",
  neutral:      "#c5bc9e",
  red:          "#e03030",
  blue:         "#2060d0",
  gold:         "#f0b000",
  green:        "#30a060",
  white:        "#ffffff",
  dark:         "#0a0a1a",
  darkCard:     "rgba(10,10,26,0.92)",
} as const;

type Topology = Parameters<typeof topojson.feature>[0];

// ============================================================
// HELPERS
// ============================================================

function buildProj(scale: number, cx: number, cy: number, centerLon = 120, centerLat = 25) {
  return d3Geo
    .geoMercator()
    .center([centerLon, centerLat])
    .scale(scale)
    .translate([cx, cy]);
}

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

function bezierPoint(
  t: number,
  x1: number, y1: number,
  cx: number, cy: number,
  x2: number, y2: number
): [number, number] {
  return [
    (1-t)*(1-t)*x1 + 2*(1-t)*t*cx + t*t*x2,
    (1-t)*(1-t)*y1 + 2*(1-t)*t*cy + t*t*y2,
  ];
}

// ============================================================
// COMPOSANT CARTE GENERIQUE
// ============================================================

const GeoBase: React.FC<{
  topology: Topology;
  proj: d3Geo.GeoProjection;
  highlightTaiwan?: boolean;
  highlightChina?: boolean;
  dim?: boolean;
}> = ({ topology, proj, highlightTaiwan, highlightChina, dim }) => {
  const path = d3Geo.geoPath().projection(proj);
  const countries = topojson.feature(topology, (topology as any).objects.countries);
  const features = (countries as any).features as any[];

  function getColor(id: number): string {
    if (id === ISO_TAIWAN) return highlightTaiwan ? C.taiwan : (dim ? "#d4a0a0" : C.taiwan);
    if (id === ISO_CHINA)  return highlightChina  ? C.china  : (dim ? "#d4b898" : C.china);
    switch (id) {
      case ISO_JAPAN:    return "#e8c8c8";
      case ISO_SKOREA:   return "#d4d0c8";
      case ISO_USA:      return dim ? "#c0c8d8" : "#b0c0e0";
      case ISO_PHILIPPINE:
      case ISO_VIETNAM:
      case ISO_THAILAND:
      case ISO_MALAYSIA:
      case ISO_INDONESIA: return C.neutral;
      default:           return C.land;
    }
  }

  function getStroke(id: number): string {
    if (id === ISO_TAIWAN) return C.taiwanStroke;
    if (id === ISO_CHINA)  return C.chinaStroke;
    return C.landStroke;
  }

  function getStrokeW(id: number): number {
    if (id === ISO_TAIWAN || id === ISO_CHINA) return 2.5;
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
      <div style={{
        position: "absolute", top: 680, left: 80, right: 80,
        height: 4, background: `linear-gradient(to right, ${C.taiwan}, ${C.gold})`,
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
          Economie mondiale
        </div>
        <div style={{
          fontSize: 62, color: C.white, fontFamily: "Arial Black, sans-serif",
          fontWeight: 900, textAlign: "center", lineHeight: 1.1, marginBottom: 28,
        }}>
          Cette ile de 36 000 km2 controle votre telephone
        </div>
        <div style={{
          fontSize: 46, color: C.taiwan, fontFamily: "Arial, sans-serif",
          fontWeight: "bold", textAlign: "center",
        }}>
          Taiwan
        </div>
        <div style={{
          fontSize: 24, color: "rgba(255,255,255,0.55)", fontFamily: "Arial, sans-serif",
          marginTop: 28, textAlign: "center",
        }}>
          La reponse en 60 secondes
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 2 : CARTE ASIE-PACIFIQUE — Taiwan s'allume
// ============================================================

const PhaseMapBase: React.FC<{
  topology: Topology;
  frame: number;
  fps: number;
}> = ({ topology, frame, fps }) => {
  // Centrage Asie-Pacifique : lon=130, lat=25, scale=1600
  const proj = buildProj(1600, W / 2, 900, 130, 25);

  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  const taiwanS = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 200 } });
  const chinaS  = spring({ frame: frame - 60, fps, config: { damping: 20, stiffness: 180 } });
  const labelTW = spring({ frame: frame - 25, fps, config: { damping: 20, stiffness: 220 } });
  const labelCN = spring({ frame: frame - 65, fps, config: { damping: 20, stiffness: 220 } });
  const rangeS  = spring({ frame: frame - 110, fps, config: { damping: 18, stiffness: 140 } });

  const pTaiwan  = proj(COORDS.taiwan)  as [number, number];
  const pBeijing = proj(COORDS.beijing) as [number, number];

  // Cercle symbolisant l'influence economique mondiale (~3000km = zone de fabrication critique)
  const influenceRadiusPx = 320;

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={W} height={H}>
        <GeoBase topology={topology} proj={proj} highlightTaiwan highlightChina />

        {/* Cercle d'influence economique Taiwan */}
        {rangeS > 0.01 && (
          <g opacity={rangeS}>
            <circle
              cx={pTaiwan[0]} cy={pTaiwan[1]}
              r={influenceRadiusPx * rangeS}
              fill="rgba(224,80,80,0.06)"
              stroke={C.taiwan}
              strokeWidth={2.5}
              strokeDasharray="12 8"
            />
            <rect
              x={pTaiwan[0] + influenceRadiusPx * rangeS - 10}
              y={pTaiwan[1] - 50}
              width={190} height={36} rx={6} fill={C.dark} opacity={0.88}
            />
            <text
              x={pTaiwan[0] + influenceRadiusPx * rangeS + 85}
              y={pTaiwan[1] - 26}
              fontSize={16} fontWeight="bold" fill={C.taiwan}
              textAnchor="middle" fontFamily="Arial, sans-serif">
              Zone critique mondiale
            </text>
          </g>
        )}

        {/* Pulsation Taiwan */}
        {taiwanS > 0.1 && (
          <>
            <circle cx={pTaiwan[0]} cy={pTaiwan[1]} r={24 * taiwanS}
              fill="none" stroke={C.taiwan} strokeWidth={2.5}
              opacity={(1 - taiwanS) * 0.7} />
            <circle cx={pTaiwan[0]} cy={pTaiwan[1]} r={11}
              fill={C.taiwan} stroke={C.white} strokeWidth={2} opacity={taiwanS} />
          </>
        )}

        {/* Pulsation Chine */}
        {chinaS > 0.1 && (
          <>
            <circle cx={pBeijing[0]} cy={pBeijing[1]} r={30 * chinaS}
              fill="none" stroke={C.china} strokeWidth={2} opacity={(1 - chinaS) * 0.5} />
            <circle cx={pBeijing[0]} cy={pBeijing[1]} r={10}
              fill={C.china} stroke={C.white} strokeWidth={2} opacity={chinaS} />
          </>
        )}

        {/* Label Taiwan */}
        <g opacity={labelTW}>
          <rect x={pTaiwan[0] - 70} y={pTaiwan[1] - 52} width={140} height={36}
            rx={6} fill="rgba(255,255,255,0.92)" />
          <text x={pTaiwan[0]} y={pTaiwan[1] - 28} fontSize={22} fontWeight="bold"
            fill={C.taiwan} textAnchor="middle" fontFamily="Arial, sans-serif">
            TAIWAN
          </text>
        </g>

        {/* Label Chine */}
        <g opacity={labelCN}>
          <rect x={pBeijing[0] - 55} y={pBeijing[1] - 52} width={110} height={36}
            rx={6} fill="rgba(255,255,255,0.92)" />
          <text x={pBeijing[0]} y={pBeijing[1] - 28} fontSize={22} fontWeight="bold"
            fill={C.china} textAnchor="middle" fontFamily="Arial, sans-serif">
            CHINE
          </text>
        </g>
      </svg>

      {/* Titre top */}
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontSize: 36, fontWeight: 900, color: C.dark,
          fontFamily: "Arial Black, sans-serif", display: "inline-block",
          background: "rgba(255,255,255,0.92)", padding: "14px 36px",
          borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}>
          Asie-Pacifique
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 3 : 3 ARCS Taiwan -> USA / Europe / Chine
// ============================================================

const PhaseArcs: React.FC<{
  topology: Topology;
  frame: number;
  fps: number;
}> = ({ topology, frame, fps }) => {
  const proj = buildProj(1600, W / 2, 900, 130, 25);

  const pTaiwan = proj(COORDS.taiwan) as [number, number];

  // Les 3 destinations — USA, Europe (Amsterdam), Chine (Beijing)
  // Note : USA est hors de la carte Asie-Pac visible, on utilise un point symbolique
  // a droite du canvas pour materialiser "direction USA"
  const pUSA     = [W + 80, 400]  as [number, number]; // symbolique (hors ecran droite = Pacifique)
  const pEurope  = [-80, 320]     as [number, number]; // symbolique (hors ecran gauche = Inde/Europe)
  const pChina   = proj(COORDS.beijing) as [number, number];
  const pJapan   = proj(COORDS.tokyo)   as [number, number];

  // Arc 1 : Taiwan -> USA (vers droite, traversee Pacifique)
  const ctrl1X = (pTaiwan[0] + pUSA[0]) / 2;
  const ctrl1Y = Math.min(pTaiwan[1], pUSA[1]) - 300;
  const len1 = bezierLength(pTaiwan[0], pTaiwan[1], ctrl1X, ctrl1Y, pUSA[0], pUSA[1]);

  // Arc 2 : Taiwan -> Europe (vers gauche)
  const ctrl2X = (pTaiwan[0] + pEurope[0]) / 2;
  const ctrl2Y = Math.min(pTaiwan[1], pEurope[1]) - 250;
  const len2 = bezierLength(pTaiwan[0], pTaiwan[1], ctrl2X, ctrl2Y, pEurope[0], pEurope[1]);

  // Arc 3 : Taiwan -> Chine (court, vers nord-ouest)
  const ctrl3X = (pTaiwan[0] + pChina[0]) / 2 - 30;
  const ctrl3Y = Math.min(pTaiwan[1], pChina[1]) - 120;
  const len3 = bezierLength(pTaiwan[0], pTaiwan[1], ctrl3X, ctrl3Y, pChina[0], pChina[1]);

  // Arc 4 : Taiwan -> Japon (court, vers nord-est)
  const ctrl4X = (pTaiwan[0] + pJapan[0]) / 2 + 20;
  const ctrl4Y = Math.min(pTaiwan[1], pJapan[1]) - 80;
  const len4 = bezierLength(pTaiwan[0], pTaiwan[1], ctrl4X, ctrl4Y, pJapan[0], pJapan[1]);

  // Progression des arcs (decales de 40f chacun)
  const arc1P = interpolate(frame, [20, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arc2P = interpolate(frame, [60, 180], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arc3P = interpolate(frame, [100, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const arc4P = interpolate(frame, [130, 210], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Labels destinations apparaissent a la fin de chaque arc
  const label1Op = interpolate(arc1P, [0.85, 1], [0, 1], { extrapolateRight: "clamp" });
  const label2Op = interpolate(arc2P, [0.85, 1], [0, 1], { extrapolateRight: "clamp" });
  const label3Op = interpolate(arc3P, [0.85, 1], [0, 1], { extrapolateRight: "clamp" });
  const label4Op = interpolate(arc4P, [0.85, 1], [0, 1], { extrapolateRight: "clamp" });

  // Encart recap valeur totale
  const recapS = spring({ frame: frame - 220, fps, config: { damping: 18, stiffness: 160 } });

  function arcPath(
    p1: [number, number], ctrl: [number, number], p2: [number, number]
  ) {
    return `M ${p1[0]} ${p1[1]} Q ${ctrl[0]} ${ctrl[1]} ${p2[0]} ${p2[1]}`;
  }

  function headPos(
    progress: number,
    x1: number, y1: number, cx: number, cy: number, x2: number, y2: number
  ): [number, number] {
    const t = Math.min(progress, 0.98);
    return bezierPoint(t, x1, y1, cx, cy, x2, y2);
  }

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={W} height={H}>
        <GeoBase topology={topology} proj={proj} highlightTaiwan highlightChina />

        {/* Arc 1 : Taiwan -> USA (bleu) */}
        {arc1P > 0 && (
          <>
            <path d={arcPath(pTaiwan, [ctrl1X, ctrl1Y], pUSA)}
              fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth={5}
              strokeDasharray={`${len1} ${len1}`}
              strokeDashoffset={len1 * (1 - arc1P) + 3} strokeLinecap="round" />
            <path d={arcPath(pTaiwan, [ctrl1X, ctrl1Y], pUSA)}
              fill="none" stroke={C.usa} strokeWidth={3.5}
              strokeDasharray={`${len1} ${len1}`}
              strokeDashoffset={len1 * (1 - arc1P)} strokeLinecap="round" />
            {arc1P < 0.98 && (() => {
              const [hx, hy] = headPos(arc1P, pTaiwan[0], pTaiwan[1], ctrl1X, ctrl1Y, pUSA[0], pUSA[1]);
              return <circle cx={hx} cy={hy} r={8} fill={C.usa} />;
            })()}
          </>
        )}

        {/* Arc 2 : Taiwan -> Europe (vert) */}
        {arc2P > 0 && (
          <>
            <path d={arcPath(pTaiwan, [ctrl2X, ctrl2Y], pEurope)}
              fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth={5}
              strokeDasharray={`${len2} ${len2}`}
              strokeDashoffset={len2 * (1 - arc2P) + 3} strokeLinecap="round" />
            <path d={arcPath(pTaiwan, [ctrl2X, ctrl2Y], pEurope)}
              fill="none" stroke={C.europe} strokeWidth={3.5}
              strokeDasharray={`${len2} ${len2}`}
              strokeDashoffset={len2 * (1 - arc2P)} strokeLinecap="round" />
            {arc2P < 0.98 && (() => {
              const [hx, hy] = headPos(arc2P, pTaiwan[0], pTaiwan[1], ctrl2X, ctrl2Y, pEurope[0], pEurope[1]);
              return <circle cx={hx} cy={hy} r={8} fill={C.europe} />;
            })()}
          </>
        )}

        {/* Arc 3 : Taiwan -> Chine (orange) */}
        {arc3P > 0 && (
          <>
            <path d={arcPath(pTaiwan, [ctrl3X, ctrl3Y], pChina)}
              fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth={5}
              strokeDasharray={`${len3} ${len3}`}
              strokeDashoffset={len3 * (1 - arc3P) + 3} strokeLinecap="round" />
            <path d={arcPath(pTaiwan, [ctrl3X, ctrl3Y], pChina)}
              fill="none" stroke={C.china} strokeWidth={3.5}
              strokeDasharray={`${len3} ${len3}`}
              strokeDashoffset={len3 * (1 - arc3P)} strokeLinecap="round" />
            {arc3P < 0.98 && (() => {
              const [hx, hy] = headPos(arc3P, pTaiwan[0], pTaiwan[1], ctrl3X, ctrl3Y, pChina[0], pChina[1]);
              return <circle cx={hx} cy={hy} r={8} fill={C.china} />;
            })()}
          </>
        )}

        {/* Arc 4 : Taiwan -> Japon (rouge pale) */}
        {arc4P > 0 && (
          <>
            <path d={arcPath(pTaiwan, [ctrl4X, ctrl4Y], pJapan)}
              fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth={4}
              strokeDasharray={`${len4} ${len4}`}
              strokeDashoffset={len4 * (1 - arc4P) + 3} strokeLinecap="round" />
            <path d={arcPath(pTaiwan, [ctrl4X, ctrl4Y], pJapan)}
              fill="none" stroke="#e08080" strokeWidth={3}
              strokeDasharray={`${len4} ${len4}`}
              strokeDashoffset={len4 * (1 - arc4P)} strokeLinecap="round" />
          </>
        )}

        {/* Point Taiwan (toujours visible) */}
        <circle cx={pTaiwan[0]} cy={pTaiwan[1]} r={12} fill={C.taiwan} stroke={C.white} strokeWidth={2.5} />

        {/* Labels destinations */}
        <g opacity={label1Op}>
          <rect x={W - 220} y={340} width={200} height={50} rx={8} fill={C.dark} opacity={0.92} />
          <text x={W - 120} y={358} fontSize={14} fill="rgba(255,255,255,0.7)"
            textAnchor="middle" fontFamily="Arial, sans-serif">Commandes</text>
          <text x={W - 120} y={380} fontSize={20} fontWeight="bold" fill={C.usa}
            textAnchor="middle" fontFamily="Arial Black, sans-serif">ETATS-UNIS</text>
        </g>

        <g opacity={label2Op}>
          <rect x={20} y={280} width={190} height={50} rx={8} fill={C.dark} opacity={0.92} />
          <text x={115} y={298} fontSize={14} fill="rgba(255,255,255,0.7)"
            textAnchor="middle" fontFamily="Arial, sans-serif">Commandes</text>
          <text x={115} y={320} fontSize={20} fontWeight="bold" fill={C.europe}
            textAnchor="middle" fontFamily="Arial Black, sans-serif">EUROPE</text>
        </g>

        <g opacity={label3Op}>
          <rect x={pChina[0] - 80} y={pChina[1] + 18} width={160} height={50} rx={8}
            fill={C.dark} opacity={0.92} />
          <text x={pChina[0]} y={pChina[1] + 38} fontSize={14} fill="rgba(255,255,255,0.7)"
            textAnchor="middle" fontFamily="Arial, sans-serif">Assemblage</text>
          <text x={pChina[0]} y={pChina[1] + 60} fontSize={20} fontWeight="bold" fill={C.china}
            textAnchor="middle" fontFamily="Arial Black, sans-serif">CHINE</text>
        </g>

        <g opacity={label4Op}>
          <rect x={pJapan[0] + 16} y={pJapan[1] - 30} width={140} height={50} rx={8}
            fill={C.dark} opacity={0.92} />
          <text x={pJapan[0] + 86} y={pJapan[1] - 10} fontSize={14} fill="rgba(255,255,255,0.7)"
            textAnchor="middle" fontFamily="Arial, sans-serif">Composants</text>
          <text x={pJapan[0] + 86} y={pJapan[1] + 12} fontSize={20} fontWeight="bold" fill="#e08080"
            textAnchor="middle" fontFamily="Arial Black, sans-serif">JAPON</text>
        </g>
      </svg>

      {/* Titre */}
      <div style={{
        position: "absolute", top: 50, left: 0, right: 0, textAlign: "center",
        opacity: interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" }),
      }}>
        <div style={{
          fontSize: 38, fontWeight: 900, color: C.dark,
          fontFamily: "Arial Black, sans-serif", display: "inline-block",
          background: "rgba(255,255,255,0.92)", padding: "12px 32px", borderRadius: 10,
        }}>
          Les clients de Taiwan
        </div>
      </div>

      {/* Recap valeur */}
      <div style={{
        position: "absolute", bottom: 80, left: 60, right: 60,
        opacity: recapS,
        transform: `translateY(${interpolate(recapS, [0,1], [20,0])}px)`,
      }}>
        <div style={{
          background: C.darkCard, borderRadius: 16, padding: "24px 32px", textAlign: "center",
          borderTop: `4px solid ${C.taiwan}`,
        }}>
          <div style={{
            fontSize: 44, fontWeight: 900, color: C.gold,
            fontFamily: "Arial Black, sans-serif",
          }}>
            595 milliards $
          </div>
          <div style={{
            fontSize: 22, color: "rgba(255,255,255,0.75)",
            fontFamily: "Arial, sans-serif", marginTop: 8,
          }}>
            Marche mondial des semi-conducteurs 2024
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 4 : COMPARAISON TAILLE Taiwan / Bretagne
// ============================================================

const PhaseSize: React.FC<{
  topology: Topology;
  frame: number;
  fps: number;
}> = ({ topology, frame, fps }) => {
  const fadeIn  = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [210, 240], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Meme echelle : Taiwan ~36 000 km2, Bretagne ~27 000 km2
  // A scale=6000 Taiwan fait ~150px de haut -> bon pour comparaison cote a cote
  const SHARED_SCALE = 6000;

  // Taiwan centre sur son centroide
  const projTaiwan = buildProj(SHARED_SCALE, W * 0.78, H * 0.44, 121.0, 23.7);
  // France entiere pour montrer Taiwan vs Bretagne (region)
  // On centre sur la Bretagne : lon=-3, lat=48
  const projFrance = buildProj(SHARED_SCALE, W * 0.22, H * 0.44, 2, 46.5);

  const pathTaiwan = d3Geo.geoPath().projection(projTaiwan);
  const pathFrance = d3Geo.geoPath().projection(projFrance);

  const countries = topojson.feature(topology, (topology as any).objects.countries);
  const features  = (countries as any).features as any[];

  const franceFeature  = features.find((f: any) => Number(f.id) === ISO_FRANCE);
  const taiwanFeature  = features.find((f: any) => Number(f.id) === ISO_TAIWAN);

  const franceD  = franceFeature  ? pathFrance(franceFeature)  : null;
  const taiwanD  = taiwanFeature  ? pathTaiwan(taiwanFeature)  : null;

  const labelS = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 200 } });
  const statS  = spring({ frame: frame - 60, fps, config: { damping: 18, stiffness: 160 } });
  const statY  = interpolate(statS, [0, 1], [30, 0]);

  return (
    <AbsoluteFill style={{ background: "#f5f0e8", opacity: fadeIn * fadeOut }}>
      <div style={{
        position: "absolute", top: 80, left: 0, right: 0, textAlign: "center",
        opacity: labelS,
      }}>
        <div style={{
          fontSize: 44, fontWeight: 900, color: C.dark,
          fontFamily: "Arial Black, sans-serif", lineHeight: 1.1,
        }}>
          Taiwan = taille de la Bretagne
        </div>
        <div style={{
          fontSize: 28, color: "#666", fontFamily: "Arial, sans-serif", marginTop: 14,
        }}>
          Meme echelle
        </div>
      </div>

      <svg width={W} height={H}>
        {franceD && (
          <path d={franceD} fill="#6ab0e0" stroke="#3070a0" strokeWidth={2} opacity={labelS} />
        )}
        {taiwanD && (
          <path d={taiwanD} fill={C.taiwan} stroke={C.taiwanStroke} strokeWidth={2} opacity={labelS} />
        )}
        <line x1={W/2} y1={200} x2={W/2} y2={H - 400}
          stroke="#cccccc" strokeWidth={2} strokeDasharray="8 6" opacity={labelS * 0.6} />

        <g opacity={labelS}>
          <text x={W * 0.25} y={H * 0.82} fontSize={30} fontWeight="bold"
            fill="#3070a0" textAnchor="middle" fontFamily="Arial, sans-serif">
            France
          </text>
          <text x={W * 0.25} y={H * 0.82 + 34} fontSize={20}
            fill="#666" textAnchor="middle" fontFamily="Arial, sans-serif">
            551 000 km2
          </text>
        </g>
        <g opacity={labelS}>
          <text x={W * 0.75} y={H * 0.82} fontSize={30} fontWeight="bold"
            fill={C.taiwan} textAnchor="middle" fontFamily="Arial, sans-serif">
            Taiwan
          </text>
          <text x={W * 0.75} y={H * 0.82 + 34} fontSize={20}
            fill="#666" textAnchor="middle" fontFamily="Arial, sans-serif">
            36 000 km2
          </text>
        </g>
      </svg>

      <div style={{
        position: "absolute", bottom: 420, left: 60, right: 60,
        transform: `translateY(${statY}px)`,
        opacity: statS,
      }}>
        <div style={{
          background: C.dark, borderRadius: 16, padding: "28px 36px", textAlign: "center",
        }}>
          <div style={{
            fontSize: 34, fontWeight: 900, color: C.taiwan,
            fontFamily: "Arial Black, sans-serif",
          }}>
            15x plus petit que la France
          </div>
          <div style={{
            fontSize: 22, color: "rgba(255,255,255,0.75)",
            fontFamily: "Arial, sans-serif", marginTop: 10,
          }}>
            Et produit 92% des puces avancees mondiales
          </div>
        </div>
      </div>

      <ProximityBar frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 4b : HORLOGE GEOPOLITIQUE — proximite Taiwan/Chine
// Inseree dans PhaseSize apres les cartes
// ============================================================

const ProximityBar: React.FC<{
  frame: number;
  fps: number;
}> = ({ frame, fps }) => {
  // Barre comparative : Taiwan-Chine 180km vs Paris-Bruxelles 265km
  // Apparait a frame 120 dans la phase Size
  const s = spring({ frame: Math.max(0, frame - 120), fps, config: { damping: 20, stiffness: 180 } });

  const BAR_W = W - 120;
  const MAX_KM = 300;
  const tw_w = (180 / MAX_KM) * BAR_W * s;
  const pb_w = (265 / MAX_KM) * BAR_W * s;

  return (
    <div style={{
      position: "absolute", bottom: 60, left: 60, right: 60,
      opacity: s,
      transform: `translateY(${interpolate(s, [0,1], [20,0])}px)`,
    }}>
      <div style={{
        background: "rgba(10,10,26,0.95)", borderRadius: 18,
        padding: "24px 28px",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{
          fontSize: 22, fontWeight: 900, color: C.white,
          fontFamily: "Arial Black, sans-serif", marginBottom: 20, textAlign: "center",
        }}>
          La distance qui inquiete le monde
        </div>

        {/* Barre Taiwan-Chine */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 17, color: C.red, fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
              Taiwan — Chine
            </span>
            <span style={{ fontSize: 17, color: C.red, fontFamily: "Arial Black, sans-serif", fontWeight: 900 }}>
              180 km
            </span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, height: 20, overflow: "hidden" }}>
            <div style={{
              width: tw_w, height: 20, background: C.red,
              borderRadius: 6, transition: "none",
            }} />
          </div>
        </div>

        {/* Barre Paris-Bruxelles */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", fontFamily: "Arial, sans-serif" }}>
              Paris — Bruxelles (ref.)
            </span>
            <span style={{ fontSize: 17, color: "rgba(255,255,255,0.5)", fontFamily: "Arial Black, sans-serif" }}>
              265 km
            </span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 6, height: 20, overflow: "hidden" }}>
            <div style={{
              width: pb_w, height: 20, background: "rgba(255,255,255,0.3)",
              borderRadius: 6,
            }} />
          </div>
        </div>

        <div style={{
          fontSize: 19, color: "rgba(255,255,255,0.65)",
          fontFamily: "Arial, sans-serif", textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16,
        }}>
          Moins loin que Paris-Bruxelles.{" "}
          <span style={{ color: C.taiwan, fontWeight: "bold" }}>
            Et 1 600 missiles pointes sur l&apos;ile.
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// PHASE 5b : SCENARIO CATASTROPHE
// ============================================================

const PhaseCatastrophe: React.FC<{
  topology: Topology;
  frame: number;
  fps: number;
}> = ({ topology, frame, fps }) => {
  const proj = buildProj(1600, W / 2, 900, 130, 25);
  const fadeIn  = interpolate(frame, [0, 25],   [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [270, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Progression du "blackout" — les pays s'eteignent un par un
  // Chaque pays s'assombrit progressivement selon son ordre de dependance
  const blackoutP = interpolate(frame, [40, 220], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Ordre d'extinction : USA, Japon, Coree Sud, Europe, puis tout le monde
  const usaBlack   = interpolate(frame, [50,  110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const japanBlack = interpolate(frame, [80,  130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const koreaBlack = interpolate(frame, [100, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const euBlack    = interpolate(frame, [120, 170], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const path = d3Geo.geoPath().projection(proj);
  const countries = topojson.feature(topology, (topology as any).objects.countries);
  const features = (countries as any).features as any[];

  function getColor(id: number): string {
    // Taiwan reste illuminee (source du probleme)
    if (id === ISO_TAIWAN) return C.taiwan;
    if (id === ISO_CHINA)  return C.china;
    // Pays qui "s'eteignent" — blend vers noir selon blackout
    const mixBlack = (base: string, t: number): string => {
      // t=0 = couleur normale, t=1 = presque noir
      return t > 0.5 ? "#1a1a1a" : base;
    };
    if (id === ISO_USA)    return mixBlack("#b0c0e0", usaBlack);
    if (id === ISO_JAPAN)  return mixBlack("#e8c8c8", japanBlack);
    if (id === ISO_SKOREA) return mixBlack("#d4d0c8", koreaBlack);
    if (id === ISO_GERMANY || id === ISO_NETHER || id === ISO_FRANCE)
      return mixBlack(C.land, euBlack);
    return interpolate(blackoutP, [0.3, 0.8], [0, 1]) > 0.5 ? "#1c1c1c" : C.land;
  }

  // Compteur jours sans puces
  const daysCount = Math.round(interpolate(frame, [180, 260], [0, 180], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }));

  const titleS  = spring({ frame,          fps, config: { damping: 20, stiffness: 160 } });
  const countS  = spring({ frame: frame - 170, fps, config: { damping: 18, stiffness: 140 } });

  // Labels "HORS LIGNE" qui apparaissent sur les pays eteints
  const usaLabel   = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 20, stiffness: 200 } });
  const japanLabel = spring({ frame: Math.max(0, frame - 130), fps, config: { damping: 20, stiffness: 200 } });

  const pUSA_sym   = [W * 0.88, H * 0.22] as [number, number];
  const pJapan     = proj(COORDS.tokyo)   as [number, number];
  const pTaiwan    = proj(COORDS.taiwan)  as [number, number];

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <svg width={W} height={H}>
        {/* Fond noir (monde eteint) */}
        <rect x={0} y={0} width={W} height={H}
          fill={`rgba(0,0,0,${interpolate(blackoutP, [0, 0.8], [0, 0.72])})`}
          style={{ mixBlendMode: "multiply" }}
        />

        {/* Pays avec couleurs dynamiques */}
        {features.map((f: any) => {
          const d = path(f);
          if (!d) return null;
          const id = Number(f.id);
          const color = getColor(id);
          const isKey = [ISO_TAIWAN, ISO_CHINA, ISO_USA, ISO_JAPAN, ISO_SKOREA].includes(id);
          return (
            <path key={f.id} d={d} fill={color}
              stroke={isKey ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.05)"}
              strokeWidth={isKey ? 1.5 : 0.5} />
          );
        })}

        {/* Taiwan toujours illuminee + halo */}
        <circle cx={pTaiwan[0]} cy={pTaiwan[1]} r={40}
          fill="none" stroke={C.taiwan} strokeWidth={2}
          opacity={interpolate(blackoutP, [0.2, 0.6], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
        <circle cx={pTaiwan[0]} cy={pTaiwan[1]} r={14}
          fill={C.taiwan} stroke={C.white} strokeWidth={2.5} />

        {/* Label HORS LIGNE — USA */}
        {usaBlack > 0.5 && (
          <g opacity={usaLabel}>
            <rect x={pUSA_sym[0] - 85} y={pUSA_sym[1] - 20} width={170} height={38}
              rx={6} fill="rgba(200,30,30,0.85)" />
            <text x={pUSA_sym[0]} y={pUSA_sym[1] + 6} fontSize={18} fontWeight="bold"
              fill={C.white} textAnchor="middle" fontFamily="Arial, sans-serif">
              HORS LIGNE
            </text>
          </g>
        )}

        {/* Label HORS LIGNE — Japon */}
        {japanBlack > 0.5 && (
          <g opacity={japanLabel}>
            <rect x={pJapan[0] - 75} y={pJapan[1] - 20} width={150} height={38}
              rx={6} fill="rgba(200,30,30,0.85)" />
            <text x={pJapan[0]} y={pJapan[1] + 6} fontSize={18} fontWeight="bold"
              fill={C.white} textAnchor="middle" fontFamily="Arial, sans-serif">
              HORS LIGNE
            </text>
          </g>
        )}
      </svg>

      {/* Titre alerte */}
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0, textAlign: "center",
        opacity: titleS,
        transform: `translateY(${interpolate(titleS, [0,1], [20,0])}px)`,
      }}>
        <div style={{
          display: "inline-block",
          background: C.red, padding: "12px 36px", borderRadius: 10,
          fontSize: 34, fontWeight: 900, color: C.white,
          fontFamily: "Arial Black, sans-serif",
          boxShadow: `0 0 40px ${C.red}66`,
        }}>
          Et si Taiwan s&apos;arretait ?
        </div>
      </div>

      {/* Compteur jours */}
      <div style={{
        position: "absolute", bottom: 80, left: 60, right: 60,
        opacity: countS,
        transform: `scale(${interpolate(countS, [0,1], [0.9,1])})`,
      }}>
        <div style={{
          background: "rgba(10,10,26,0.96)",
          borderRadius: 18, padding: "28px 32px", textAlign: "center",
          border: `2px solid ${C.red}`,
          boxShadow: `0 0 30px ${C.red}33`,
        }}>
          <div style={{
            fontSize: 18, color: "rgba(255,255,255,0.6)",
            fontFamily: "Arial, sans-serif", marginBottom: 8,
          }}>
            Jours avant rupture de stock mondiale
          </div>
          <div style={{
            fontSize: 72, fontWeight: 900, color: C.red,
            fontFamily: "Arial Black, sans-serif", lineHeight: 1,
          }}>
            {daysCount}
          </div>
          <div style={{
            fontSize: 18, color: "rgba(255,255,255,0.55)",
            fontFamily: "Arial, sans-serif", marginTop: 8,
          }}>
            iPhones, serveurs IA, voitures electriques
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 5 : STATS LIVE
// ============================================================

const PhaseStats: React.FC<{
  topology: Topology;
  frame: number;
  fps: number;
}> = ({ topology, frame, fps }) => {
  const proj = buildProj(1600, W / 2, 900, 130, 25);
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const s1 = spring({ frame: frame - 10, fps, config: { damping: 20, stiffness: 180 } });
  const s2 = spring({ frame: frame - 50, fps, config: { damping: 20, stiffness: 180 } });
  const s3 = spring({ frame: frame - 90, fps, config: { damping: 20, stiffness: 180 } });
  const s4 = spring({ frame: frame - 130, fps, config: { damping: 20, stiffness: 180 } });

  // Compteur anime 92%
  const pctCount = Math.round(interpolate(frame, [30, 120], [0, 92], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  }));

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={W} height={H}>
        <GeoBase topology={topology} proj={proj} highlightTaiwan />
        {(() => {
          const pTW = proj(COORDS.taiwan) as [number, number];
          return <circle cx={pTW[0]} cy={pTW[1]} r={14} fill={C.taiwan} stroke={C.white} strokeWidth={2.5} />;
        })()}
      </svg>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: C.darkCard,
        padding: "36px 48px 60px",
        display: "flex", flexDirection: "column", gap: 22,
      }}>
        {[
          {
            s: s1,
            icon: "💻",
            iconBg: C.taiwan,
            val: `${pctCount}%`,
            label: "Puces avancees (<3nm) mondiales",
          },
          {
            s: s2,
            icon: "📱",
            iconBg: C.blue,
            val: "450 Mds $",
            label: "CA semiconducteurs Taiwan 2024",
          },
          {
            s: s3,
            icon: "🏭",
            iconBg: "#e06000",
            val: "TSMC",
            label: "Client: Apple, NVIDIA, AMD, Intel",
          },
          {
            s: s4,
            icon: "⚡",
            iconBg: C.green,
            val: "60%",
            label: "Du CA de NVIDIA vient de TSMC Taiwan",
          },
        ].map(({ s, icon, iconBg, val, label }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 18,
            opacity: s, transform: `translateX(${interpolate(s, [0,1], [-40,0])}px)`,
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: "50%",
              background: iconBg, display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0, fontSize: 22,
            }}>
              {icon}
            </div>
            <div>
              <div style={{
                fontSize: 36, fontWeight: 900, color: C.gold,
                fontFamily: "Arial Black, sans-serif",
              }}>
                {val}
              </div>
              <div style={{
                fontSize: 18, color: "rgba(255,255,255,0.7)",
                fontFamily: "Arial, sans-serif",
              }}>
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 6 : ZOOM HSINCHU (TSMC)
// ============================================================

const PhaseZoomTSMC: React.FC<{
  topology: Topology;
  frame: number;
  fps: number;
}> = ({ topology, frame, fps }) => {
  const zoomS = spring({ frame, fps, config: { damping: 35, stiffness: 80 } });

  const scale  = interpolate(zoomS, [0, 1], [1600, 5500]);
  const lonC   = interpolate(zoomS, [0, 1], [130, 121.2]);
  const latC   = interpolate(zoomS, [0, 1], [25, 24.0]);
  const transX = interpolate(zoomS, [0, 1], [W / 2, W * 0.5]);
  const transY = interpolate(zoomS, [0, 1], [900, 980]);

  const proj = buildProj(scale, transX, transY, lonC, latC);
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const pHsinchu = proj(COORDS.hsinchu) as [number, number];
  const pTaiwan  = proj(COORDS.taiwan)  as [number, number];

  const pulseFrame = Math.max(0, frame - 60);
  const p1 = interpolate(pulseFrame % 45, [0, 45], [0, 1]);
  const p2 = interpolate((pulseFrame + 15) % 45, [0, 45], [0, 1]);

  const labelS = spring({ frame: frame - 80, fps, config: { damping: 20, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width={W} height={H}>
        <GeoBase topology={topology} proj={proj} highlightTaiwan dim />

        {/* Ondes TSMC */}
        {pulseFrame > 0 && (
          <>
            <circle cx={pHsinchu[0]} cy={pHsinchu[1]} r={70 * p1}
              fill="none" stroke={C.gold} strokeWidth={3} opacity={(1 - p1) * 0.7} />
            <circle cx={pHsinchu[0]} cy={pHsinchu[1]} r={70 * p2}
              fill="none" stroke={C.gold} strokeWidth={2} opacity={(1 - p2) * 0.5} />
            <circle cx={pHsinchu[0]} cy={pHsinchu[1]} r={14} fill={C.gold} stroke={C.white} strokeWidth={2} />
          </>
        )}

        {/* Label TSMC */}
        <g opacity={labelS}>
          {(() => {
            const lw = 240;
            const onRight = pHsinchu[0] < W - lw - 30;
            const lx = onRight ? pHsinchu[0] + 20 : pHsinchu[0] - lw - 20;
            const tx = lx + lw / 2;
            return (
              <>
                <rect x={lx} y={pHsinchu[1] - 46} width={lw} height={86}
                  rx={10} fill={C.dark} opacity={0.95} />
                <text x={tx} y={pHsinchu[1] - 22} fontSize={22} fontWeight="bold"
                  fill={C.gold} textAnchor="middle" fontFamily="Arial, sans-serif">
                  TSMC Hsinchu
                </text>
                <text x={tx} y={pHsinchu[1] + 2} fontSize={15}
                  fill="rgba(255,255,255,0.85)" textAnchor="middle" fontFamily="Arial, sans-serif">
                  Plus grande fonderie au monde
                </text>
                <text x={tx} y={pHsinchu[1] + 24} fontSize={14}
                  fill={C.taiwan} textAnchor="middle" fontFamily="Arial, sans-serif">
                  Puce 2nm en production depuis 2025
                </text>
              </>
            );
          })()}
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
          La fabrique du monde
        </div>
      </div>

      {/* Encart explicatif */}
      <div style={{
        position: "absolute", bottom: 80, left: 60, right: 60,
        opacity: labelS,
        transform: `translateY(${interpolate(labelS, [0,1], [20,0])}px)`,
      }}>
        <div style={{
          background: "rgba(10,10,26,0.93)",
          borderRadius: 16, padding: "28px 32px",
          borderLeft: `5px solid ${C.gold}`,
        }}>
          <div style={{
            fontSize: 30, fontWeight: 900, color: C.gold,
            fontFamily: "Arial Black, sans-serif", marginBottom: 12,
          }}>
            Pourquoi c&apos;est irreplacable
          </div>
          <div style={{
            fontSize: 21, color: "rgba(255,255,255,0.85)",
            fontFamily: "Arial, sans-serif", lineHeight: 1.4,
          }}>
            Construire une usine equivalente prend 10 ans et 40 milliards $.
          </div>
          <div style={{
            fontSize: 19, color: C.taiwan,
            fontFamily: "Arial, sans-serif", marginTop: 14,
          }}>
            Sans Taiwan : pas d&apos;iPhone, pas d&apos;IA, pas de voiture electrique.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// PHASE 7 : OUTRO
// ============================================================

const PhaseOutro: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fadeIn  = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [260, 300], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const s1   = spring({ frame,          fps, config: { damping: 18, stiffness: 160 } });
  const s2   = spring({ frame: frame - 20, fps, config: { damping: 18, stiffness: 160 } });
  const s3   = spring({ frame: frame - 40, fps, config: { damping: 18, stiffness: 160 } });
  const ctaS = spring({ frame: frame - 80, fps, config: { damping: 15, stiffness: 140 } });

  return (
    <AbsoluteFill style={{
      background: C.dark,
      opacity: fadeIn * fadeOut,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 70px", gap: 0,
    }}>
      <div style={{
        fontSize: 50, fontWeight: 900, color: C.white,
        fontFamily: "Arial Black, sans-serif", textAlign: "center",
        lineHeight: 1.1, marginBottom: 48,
        opacity: s1, transform: `translateY(${interpolate(s1, [0,1], [30,0])}px)`,
      }}>
        Taiwan — trop petit pour etre ignore.
      </div>

      <div style={{
        display: "flex", flexDirection: "column", gap: 16,
        width: "100%", marginBottom: 48,
      }}>
        {[
          { num: "92%",       label: "Puces avancees mondiales",  color: C.taiwan,  delay: s1 },
          { num: "595 Mds $", label: "Marche semi-conducteurs",   color: C.gold,    delay: s2 },
          { num: "10 ans",    label: "Pour construire un rival",  color: C.blue,    delay: s3 },
        ].map(({ num, label, color, delay }) => (
          <div key={num} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(255,255,255,0.06)", borderRadius: 12,
            padding: "18px 28px",
            opacity: delay,
            transform: `translateX(${interpolate(delay, [0,1], [-30,0])}px)`,
          }}>
            <div style={{
              fontSize: 38, fontWeight: 900, color,
              fontFamily: "Arial Black, sans-serif",
            }}>{num}</div>
            <div style={{
              fontSize: 20, color: "rgba(255,255,255,0.7)",
              fontFamily: "Arial, sans-serif",
            }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{
        opacity: ctaS,
        transform: `scale(${interpolate(ctaS, [0,1], [0.85,1])})`,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 34, fontWeight: "bold", color: C.gold,
          fontFamily: "Arial, sans-serif", marginBottom: 10,
        }}>
          Suis pour la suite
        </div>
        <div style={{
          fontSize: 21, color: "rgba(255,255,255,0.45)",
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

export const GeoShortTaiwan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [topology, setTopology] = useState<Topology | null>(null);
  const [handle]  = useState(() => delayRender("Loading topology"));

  useEffect(() => {
    fetch(staticFile("assets/peste-pixel/maps/countries-50m.json"))
      .then((r) => r.json())
      .then((data) => {
        setTopology(data as Topology);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);

  if (!topology) return <AbsoluteFill style={{ background: C.dark }} />;

  // Decoupage des phases (frames locales)
  // Total : 2100 frames = 70s (2 phases supplementaires : catastrophe + proximite dans Size)
  const phases = [
    { start: 0,    end: 60   }, // 0 Hook
    { start: 60,   end: 360  }, // 1 MapBase
    { start: 360,  end: 660  }, // 2 Arcs
    { start: 660,  end: 960  }, // 3 Size (+ProximityBar a frame 120 local)
    { start: 960,  end: 1260 }, // 4 Stats
    { start: 1260, end: 1560 }, // 5 Catastrophe
    { start: 1560, end: 1860 }, // 6 ZoomTSMC
    { start: 1860, end: 2160 }, // 7 Outro
  ];

  const localFrame = (i: number) => Math.max(0, frame - phases[i].start);
  const visible    = (i: number) => frame >= phases[i].start && frame < phases[i].end + 30;

  return (
    <AbsoluteFill style={{ background: C.dark, fontFamily: "Arial, sans-serif" }}>
      {visible(0) && <PhaseHook         frame={localFrame(0)} fps={fps} />}
      {visible(1) && <PhaseMapBase      topology={topology} frame={localFrame(1)} fps={fps} />}
      {visible(2) && <PhaseArcs         topology={topology} frame={localFrame(2)} fps={fps} />}
      {visible(3) && <PhaseSize         topology={topology} frame={localFrame(3)} fps={fps} />}
      {visible(4) && <PhaseStats        topology={topology} frame={localFrame(4)} fps={fps} />}
      {visible(5) && <PhaseCatastrophe  topology={topology} frame={localFrame(5)} fps={fps} />}
      {visible(6) && <PhaseZoomTSMC     topology={topology} frame={localFrame(6)} fps={fps} />}
      {visible(7) && <PhaseOutro        frame={localFrame(7)} fps={fps} />}
    </AbsoluteFill>
  );
};
