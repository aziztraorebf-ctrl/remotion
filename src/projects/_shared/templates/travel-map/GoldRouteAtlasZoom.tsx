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

// TEMPLATE "route de l'or" — VARIANTE ZOOM AGRESSIF (16:9 horizontal).
// Caméra serrée qui suit le porteur (comme nos beats Atlas qui suivent un perso),
// + territoires qui se TEINTENT EN OR à son passage (vague qui irradie depuis le sprite,
// PERSISTANTE = continuité d'état Atlas) + liseré/nom de région qui s'allume.
// Réutilise nos briques validées (caravanePositions, AtlasMercator, sprites porteur-mali).

const W = 720;
const H = 1280;

const PARCH_OCEAN = "#dcd2bd";
const PARCH_LAND = "#efe7d4";
const PARCH_STROKE = "#9c8f73";
const INK = "#3a2c18";
const GOLD = "#c79a3b";
const GOLD_DEEP = "#a9791f";

// Régions nommées le long de la route (t = progrès, label affiché au passage).
const REGIONS = [
  { t: 0.02, label: "EMPIRE DU MALI" },
  { t: 0.38, label: "BOUCLE DU NIGER" },
  { t: 0.62, label: "SAHARA CENTRAL" },
  { t: 0.9, label: "MAGHREB" },
];

// Centroïde approximatif d'un path SVG "d" (moyenne des points M/L). Léger mais suffisant.
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

const PorteurSprite: React.FC<{ frame: number; flip: number; size?: number }> = ({
  frame,
  flip,
  size = 80,
}) => {
  const idx = Math.floor(frame / 5) % 6;
  const padded = String(idx).padStart(3, "0");
  return (
    <Img
      src={staticFile(
        `atlas/peste-1347/assets/characters/porteur-mali/animations/walk/east/frame_${padded}.png`
      )}
      style={{
        width: size,
        height: size,
        transform: `scaleX(${flip})`,
        imageRendering: "pixelated",
      }}
    />
  );
};

export const GoldRouteAtlasZoom: React.FC = () => {
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
  const flip = bearing > -90 && bearing < 90 ? 1 : -1;

  // ZOOM AGRESSIF (comme suivi-perso Atlas) : grosse échelle, caméra centrée sur le leader.
  const camScale = interpolate(frame, [0, 40, durationInFrames], [3.2, 4.0, 4.6], {
    extrapolateRight: "clamp",
  });
  const driftX = (W / 2 - leader[0]) * camScale;
  const driftY = (H / 2 - leader[1]) * camScale;

  // Pré-calcul : pour chaque pays, son centroïde + un "t de route" approximé
  // (à quel progrès le porteur est le plus proche de ce pays). On teinte un pays
  // quand le porteur a DÉPASSÉ ce t (vague persistante derrière lui).
  const countries = MERC_LARGE.countries as { iso: string; d: string }[];

  // Échantillonne la route pour trouver, par pays, le t où le porteur en est le plus proche.
  const ROUTE_SAMPLES = 60;
  const routePts: [number, number][] = [];
  for (let s = 0; s <= ROUTE_SAMPLES; s++) {
    routePts.push(caravanePositions(ROUTES_GEO.CARAVANE_OR, s / ROUTE_SAMPLES, 1, 0)[0]);
  }

  const goldFills: { iso: string; d: string; intensity: number }[] = [];
  for (const c of countries) {
    const [cx, cy] = pathCentroid(c.d);
    // distance min du centroïde à la route + le t correspondant
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
    // pays "sur le corridor" seulement (proche de la route) ET déjà dépassé.
    // Rayon resserré (70) pour garder du contraste teinté/non-teinté.
    if (bestDist < 72 && prog >= bestT - 0.01) {
      // intensité = combien le porteur a dépassé ce t (vague qui monte), atténuée par distance
      const passed = interpolate(prog - bestT, [-0.01, 0.05], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const proximity = interpolate(bestDist, [0, 72], [1, 0.3]);
      goldFills.push({ iso: c.iso, d: c.d, intensity: passed * proximity });
    }
  }

  // Trail
  const trailStr = routePts.map((p) => `${p[0]},${p[1]}`).join(" ");
  const trailLen = 1400;
  const dashOffset = trailLen * (1 - prog);

  // Région active (label au passage)
  const activeRegion = [...REGIONS].reverse().find((r) => prog >= r.t) ?? REGIONS[0];
  const regionKey = activeRegion.label;
  // ré-anime le label à chaque changement de région
  const regionStartT = activeRegion.t;
  const regionAppear = interpolate(
    prog,
    [regionStartT, regionStartT + 0.04],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const titleAppear = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const camTransform = `translate(${W / 2 + driftX} ${H / 2 + driftY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`;

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

          {/* TERRITOIRES TEINTÉS OR au passage (persistants) */}
          <g transform={camTransform}>
            {goldFills.map((g) => (
              <g key={`gold-${g.iso}`}>
                <path d={g.d} fill={GOLD} fillOpacity={g.intensity * 0.38} stroke="none" />
                {/* liseré or qui s'allume */}
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

            {/* route */}
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

      {/* Porteur — screen-space pour netteté pixel, au point projeté du leader */}
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
              filter: "drop-shadow(0 4px 4px rgba(40,30,15,0.45))",
            }}
          >
            <PorteurSprite frame={frame} flip={flip} size={140} />
          </div>
        );
      })()}

      {/* Nom de région qui s'allume au passage (bas-centre) */}
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

      {/* Titre éditorial */}
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
