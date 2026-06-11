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

// TEMPLATE "travel map" — VERSION NOTRE STACK (pas une imitation Fiverr).
// Même JOB que le travel-map d'animonpro (objet qui voyage + HUD vivant + carte vivante),
// mais 100% dans notre langage validé :
//  - carte parchemin Atlas (AtlasMercator mode tactique light, countries pré-projetés du JSON Peste)
//  - caravane porteur-mali animée sur la VRAIE route historique de l'or (ROUTES_GEO.CARAVANE_OR)
//  - bearing + file indienne (caravanePositions) — nos helpers éprouvés
//  - HUD éditorial parchemin (distance / valeur cargo / jours de marche)
// Zéro asset peint, zéro Google Earth : que des briques que nous maîtrisons et rendons en headless.

const W = 720;
const H = 1280;

// Parchemin Atlas (mode "diagramme tactique light")
const PARCH_OCEAN = "#dcd2bd";
const PARCH_LAND = "#efe7d4";
const PARCH_STROKE = "#9c8f73";
const INK = "#3a2c18";
const GOLD = "#c79a3b";
const RED_ROUTE = "#9c4322";

// Sprite caravane = porteur-mali walk east, cadence découplée (réutilise nos assets).
const PorteurSprite: React.FC<{ frame: number; flip: number; size?: number }> = ({
  frame,
  flip,
  size = 46,
}) => {
  const FRAMES = 6;
  const idx = Math.floor(frame / 5) % FRAMES;
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

const HudCard: React.FC<{
  label: string;
  value: string;
  appear: number;
  top: number;
}> = ({ label, value, appear, top }) => (
  <div
    style={{
      position: "absolute",
      right: 70,
      top,
      opacity: appear,
      transform: `translateX(${(1 - appear) * 26}px)`,
      textAlign: "right",
      fontFamily: "Georgia, 'Times New Roman', serif",
    }}
  >
    <div
      style={{
        color: "rgba(58,44,24,0.7)",
        fontSize: 22,
        letterSpacing: 2,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
    <div style={{ color: INK, fontSize: 46, fontWeight: 700 }}>{value}</div>
  </div>
);

export const GoldRouteAtlas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Progress du leader sur la route de l'or (Niani -> Tombouctou -> Sahara -> Maghreb).
  const travelEnd = durationInFrames - 20;
  const prog = interpolate(frame, [16, travelEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => x * x * (3 - 2 * x),
  });

  // File de 4 porteurs sur la route courbe + bearing.
  const COUNT = 4;
  const SPACING_KM = 90;
  const positions = caravanePositions(
    ROUTES_GEO.CARAVANE_OR,
    prog,
    COUNT,
    SPACING_KM
  );
  const bearing = bearingAlongRoute(ROUTES_GEO.CARAVANE_OR, prog);
  const flip = bearing > -90 && bearing < 90 ? 1 : -1;

  // Caméra : track le leader (driftX/Y pour le garder cadré) + léger zoom in.
  const leader = positions[0];
  const camScale = interpolate(frame, [0, durationInFrames], [1.7, 2.05]);
  // centre la map sur le leader
  const driftX = (W / 2 - leader[0]) * camScale;
  const driftY = (H / 2 - leader[1]) * camScale;

  // Route tracée (polyline échantillonnée le long de CARAVANE_OR, projetée).
  const trailPts: string[] = [];
  for (let s = 0; s <= 120; s++) {
    const p = caravanePositions(ROUTES_GEO.CARAVANE_OR, s / 120, 1, 0)[0];
    trailPts.push(`${p[0]},${p[1]}`);
  }
  const trailStr = trailPts.join(" ");
  const trailLen = 1400;
  const dashOffset = trailLen * (1 - prog);

  // HUD éditorial — chiffres dérivés du progrès.
  const totalKm = 2800; // ordre de grandeur Niani->Maghreb
  const kmDone = Math.round(prog * totalKm);
  const kmLeft = totalKm - kmDone;
  const cargoVal = Math.round(interpolate(prog, [0, 1], [0, 8]) * 10) / 10; // tonnes d'or symbolique
  const days = Math.round(interpolate(prog, [0, 1], [0, 74]));

  const hud = (d: number) =>
    spring({ frame: frame - d, fps, config: { damping: 200 } });
  const titleAppear = spring({ frame: frame - 8, fps, config: { damping: 200 } });

  // Stations nommées qui s'allument au passage.
  const STOPS = [
    { key: "NIANI", t: 0.0, label: "Niani" },
    { key: "TOMBOUCTOU", t: 0.34, label: "Tombouctou" },
    { key: "MAGHREB", t: 1.0, label: "Sijilmassa" },
  ];
  const activeStop =
    [...STOPS].reverse().find((s) => prog >= s.t) ?? STOPS[0];

  return (
    <AbsoluteFill style={{ backgroundColor: PARCH_OCEAN, overflow: "hidden" }}>
      {/* CARTE PARCHEMIN ATLAS — notre vraie carte vivante, frame-driven */}
      <AbsoluteFill>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid slice"
        >
          <AtlasMercator
            countries={MERC_LARGE.countries as { iso: string; d: string }[]}
            driftX={driftX}
            driftY={driftY}
            scale={camScale}
            oceanColor={PARCH_OCEAN}
            landColor={PARCH_LAND}
            strokeColor={PARCH_STROKE}
          />

          {/* Route + caravane dans le même repère caméra que la carte */}
          <g
            transform={`translate(${W / 2 + driftX} ${H / 2 + driftY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`}
          >
            {/* route complète, pointillé encre */}
            <polyline
              points={trailStr}
              fill="none"
              stroke={INK}
              strokeOpacity={0.3}
              strokeWidth={1.2 / 1}
              strokeDasharray="2 5"
              strokeLinecap="round"
            />
            {/* portion parcourue, or */}
            <polyline
              points={trailStr}
              fill="none"
              stroke={GOLD}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={trailLen}
              strokeDashoffset={dashOffset}
            />
            {/* stations dots */}
            {STOPS.map((s, i) => {
              const p = caravanePositions(
                ROUTES_GEO.CARAVANE_OR,
                s.t,
                1,
                0
              )[0];
              return (
                <circle
                  key={i}
                  cx={p[0]}
                  cy={p[1]}
                  r={prog >= s.t ? 4 : 2.6}
                  fill={prog >= s.t ? GOLD : PARCH_LAND}
                  stroke={INK}
                  strokeWidth={0.8}
                />
              );
            })}
          </g>
        </svg>
      </AbsoluteFill>

      {/* Caravane sprites — posés en screen-space au point projeté (sortie du repère SVG
          pour garder la netteté pixel). On reconvertit la position map -> écran. */}
      {positions.map((pos, i) => {
        // map coords -> screen (même transform que la carte)
        const sx = (pos[0] - W / 2) * camScale + W / 2 + driftX;
        const sy = (pos[1] - H / 2) * camScale + H / 2 + driftY;
        // map viewBox 720x1280 -> écran 1920x1080 via slice : on passe en %
        const leftPct = (sx / W) * 100;
        const topPct = (sy / H) * 100;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${leftPct}%`,
              top: `${topPct}%`,
              transform: "translate(-50%, -85%)",
              filter: "drop-shadow(0 3px 3px rgba(40,30,15,0.4))",
            }}
          >
            <PorteurSprite frame={frame + i * 7} flip={flip} size={58} />
          </div>
        );
      })}

      {/* TITRE éditorial parchemin */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 90,
          opacity: titleAppear,
          transform: `translateY(${(1 - titleAppear) * 16}px)`,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ color: GOLD, fontSize: 22, letterSpacing: 4, fontWeight: 700 }}>
          ROUTE DE L'OR · XIVᵉ SIÈCLE
        </div>
        <div style={{ color: INK, fontSize: 64, fontWeight: 700, marginTop: 4 }}>
          {activeStop.label}
        </div>
        <div style={{ color: RED_ROUTE, fontSize: 26, fontStyle: "italic", marginTop: 2 }}>
          Empire du Mali → Maghreb
        </div>
      </div>

      {/* HUD éditorial droite */}
      <HudCard label="Distance restante" value={`${kmLeft} km`} appear={hud(28)} top={120} />
      <HudCard label="Cargaison" value={`${cargoVal} t d'or`} appear={hud(40)} top={250} />
      <HudCard label="Jours de marche" value={`${days} j`} appear={hud(52)} top={380} />

      {/* Vignette parchemin */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 300px rgba(90,70,40,0.5)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
