import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import { AtlasMercator } from "../../../atlas/_shared/atlas-components";
import {
  caravanePositions,
  bearingAlongRoute,
  ROUTES_GEO,
} from "../../../atlas/_shared/geoUtils";
import { MERC_LARGE } from "../../../atlas/peste-1347/mapConfig";

// TEMPLATE "route de l'or" — VARIANTE 8 DIRECTIONS (16:9 zoom).
// Le marchand caravanier (PixelLab 8 dir custom) s'oriente VRAIMENT selon la courbe
// de la route : fini la marche "de côté". Combine zoom agressif + territoires teintés or.
// = la version "complète" du concept (manque juste l'animation de marche, sprites statiques 8 dir).

const W = 720;
const H = 1280;

const PARCH_OCEAN = "#dcd2bd";
const PARCH_LAND = "#efe7d4";
const PARCH_STROKE = "#9c8f73";
const INK = "#3a2c18";
const GOLD = "#c79a3b";
const GOLD_DEEP = "#a9791f";

const REGIONS = [
  { t: 0.02, label: "EMPIRE DU MALI" },
  { t: 0.38, label: "BOUCLE DU NIGER" },
  { t: 0.62, label: "SAHARA CENTRAL" },
  { t: 0.9, label: "MAGHREB" },
];

// bearing (deg, 0=est, +y vers le bas comme en SVG) -> nom de direction PixelLab.
// SVG: +x=est, +y=sud. atan2(dy,dx): 0=E, 90=S, 180/-180=O, -90=N.
const DIRS = [
  { name: "east", center: 0 },
  { name: "south-east", center: 45 },
  { name: "south", center: 90 },
  { name: "south-west", center: 135 },
  { name: "west", center: 180 },
  { name: "north-west", center: -135 },
  { name: "north", center: -90 },
  { name: "north-east", center: -45 },
];
const dirForBearing = (b: number): string => {
  let best = DIRS[0];
  let bestDiff = 999;
  for (const d of DIRS) {
    let diff = Math.abs(((b - d.center + 540) % 360) - 180);
    diff = 180 - diff; // closeness
    const angular = Math.abs(((b - d.center + 540) % 360) - 180);
    if (angular < bestDiff) {
      bestDiff = angular;
      best = d;
    }
  }
  return best.name;
};

const pathCentroid = (d: string): [number, number] => {
  const nums = d.match(/-?\d+\.?\d*/g);
  if (!nums || nums.length < 2) return [0, 0];
  let sx = 0,
    sy = 0,
    n = 0;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    sx += parseFloat(nums[i]);
    sy += parseFloat(nums[i + 1]);
    n++;
  }
  return [sx / n, sy / n];
};

export const GoldRoute8Dir: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const travelEnd = durationInFrames - 24;
  const prog = interpolate(frame, [16, travelEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => x * x * (3 - 2 * x),
  });

  const leader = caravanePositions(ROUTES_GEO.CARAVANE_OR, prog, 1, 0)[0];
  const bearing = bearingAlongRoute(ROUTES_GEO.CARAVANE_OR, prog);
  const dirName = dirForBearing(bearing);

  const camScale = interpolate(frame, [0, 40, durationInFrames], [3.2, 4.0, 4.6], {
    extrapolateRight: "clamp",
  });
  const driftX = (W / 2 - leader[0]) * camScale;
  const driftY = (H / 2 - leader[1]) * camScale;

  const countries = MERC_LARGE.countries as { iso: string; d: string }[];

  const ROUTE_SAMPLES = 60;
  const routePts: [number, number][] = [];
  for (let s = 0; s <= ROUTE_SAMPLES; s++) {
    routePts.push(caravanePositions(ROUTES_GEO.CARAVANE_OR, s / ROUTE_SAMPLES, 1, 0)[0]);
  }

  const goldFills: { iso: string; d: string; intensity: number }[] = [];
  for (const c of countries) {
    const [cx, cy] = pathCentroid(c.d);
    let bestDist = Infinity;
    let bestT = 1;
    for (let s = 0; s <= ROUTE_SAMPLES; s++) {
      const [rx, ry] = routePts[s];
      const dist = Math.hypot(cx - rx, cy - ry);
      if (dist < bestDist) {
        bestDist = dist;
        bestT = s / ROUTE_SAMPLES;
      }
    }
    if (bestDist < 72 && prog >= bestT - 0.01) {
      const passed = interpolate(prog - bestT, [-0.01, 0.05], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const proximity = interpolate(bestDist, [0, 72], [1, 0.3]);
      goldFills.push({ iso: c.iso, d: c.d, intensity: passed * proximity });
    }
  }

  const trailStr = routePts.map((p) => `${p[0]},${p[1]}`).join(" ");
  const trailLen = 1400;
  const dashOffset = trailLen * (1 - prog);

  const activeRegion = [...REGIONS].reverse().find((r) => prog >= r.t) ?? REGIONS[0];
  const regionKey = activeRegion.label;
  const regionAppear = interpolate(
    prog,
    [activeRegion.t, activeRegion.t + 0.04],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const titleAppear = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const camTransform = `translate(${W / 2 + driftX} ${H / 2 + driftY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`;

  // Frame de marche : 6 frames, cadence ~8fps (1 frame tous les ~4 frames vidéo).
  const walkFrame = String(Math.floor(frame / 4) % 6).padStart(3, "0");

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH_OCEAN, overflow: "hidden" }}>
      <AbsoluteFill>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
        >
          <AtlasMercator
            countries={countries}
            driftX={driftX}
            driftY={driftY}
            scale={camScale}
            oceanColor={PARCH_OCEAN}
            landColor={PARCH_LAND}
            strokeColor={PARCH_STROKE}
          />
          <g transform={camTransform}>
            {goldFills.map((g) => (
              <g key={`gold-${g.iso}`}>
                <path d={g.d} fill={GOLD} fillOpacity={g.intensity * 0.38} stroke="none" />
                <path
                  d={g.d}
                  fill="none"
                  stroke={GOLD_DEEP}
                  strokeOpacity={g.intensity * 0.85}
                  strokeWidth={1.4 / camScale}
                  strokeLinejoin="round"
                />
              </g>
            ))}
            <polyline
              points={trailStr}
              fill="none"
              stroke={INK}
              strokeOpacity={0.3}
              strokeWidth={1.2 / camScale}
              strokeDasharray="2 5"
            />
            <polyline
              points={trailStr}
              fill="none"
              stroke={GOLD}
              strokeWidth={2.6 / camScale}
              strokeLinecap="round"
              strokeDasharray={trailLen}
              strokeDashoffset={dashOffset}
            />
          </g>
        </svg>
      </AbsoluteFill>

      {/* Marchand 8 directions — sprite choisi selon le bearing réel de la route */}
      {(() => {
        const sx = (leader[0] - W / 2) * camScale + W / 2 + driftX;
        const sy = (leader[1] - H / 2) * camScale + H / 2 + driftY;
        return (
          <div
            style={{
              position: "absolute",
              left: `${(sx / W) * 100}%`,
              top: `${(sy / H) * 100}%`,
              transform: "translate(-50%, -85%)",
              filter: "drop-shadow(0 5px 5px rgba(40,30,15,0.45))",
            }}
          >
            <Img
              src={staticFile(
                `templates/travel-map/gold-trader-walk/${dirName}/frame_${walkFrame}.png`
              )}
              style={{ width: 150, height: 150, imageRendering: "pixelated" }}
            />
          </div>
        );
      })()}

      <div
        key={regionKey}
        style={{
          position: "absolute",
          left: "50%",
          bottom: 80,
          transform: `translateX(-50%) translateY(${(1 - regionAppear) * 14}px)`,
          opacity: regionAppear,
          fontFamily: "Georgia, serif",
          color: GOLD_DEEP,
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: 4,
          textShadow: "0 2px 8px rgba(60,40,15,0.4)",
        }}
      >
        {regionKey}
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          top: 80,
          opacity: titleAppear,
          transform: `translateY(${(1 - titleAppear) * 16}px)`,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ color: GOLD, fontSize: 22, letterSpacing: 4, fontWeight: 700 }}>
          ROUTE DE L'OR · XIVᵉ SIÈCLE
        </div>
        <div style={{ color: INK, fontSize: 50, fontWeight: 700, marginTop: 4 }}>
          L'or trace l'empire
        </div>
      </div>

      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 280px rgba(90,70,40,0.5)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
