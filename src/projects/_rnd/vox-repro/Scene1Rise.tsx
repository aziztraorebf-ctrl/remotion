/**
 * Scene1Rise — reproduction du prompt 2 de la reference :
 * "camera starts on full world map, zooms into [pays A] and holds. [Pays A] gets a white
 * glowing outline, then a solid red circle pops up. Transparent silhouette rises out of the
 * circle like a hole in the ground, ease-out. Ends with a fast pan landing on [pays B]."
 *
 * Sujet neutre : Mali (au lieu du pays reel de la reference) — meme mecanique.
 */
import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import {
  useWorldCountries,
  useProjection,
  NAVY_OCEAN,
  LAND_FILL,
  LAND_STROKE,
  WIDTH,
  HEIGHT,
  CamKeyframe,
} from "./VoxReproScene";

// Mali — centre approx, coordonnees [lon, lat] (convention d3-geo : lon,lat comme geoMercator().center())
const MALI_CENTER: [number, number] = [-3.5, 17.5];
const NIGER_CENTER: [number, number] = [8.0, 17.6]; // pays B, ou la scene 2 prendra le relai

// BUG INVESTIGUE 2026-07-07 : le pan Mali->Niger semblait fige a l'ecran malgre un calcul
// center/scale mathematiquement correct (verifie point par point : centroide Mali passe bien
// de x=960 a x=679, soit -280px). Cause reelle (PAS un bug) : a seulement 11.5deg de longitude
// d'ecart et scale=1400, le deplacement de 280px/1920px est trop DISCRET pour se lire comme un
// vrai "fast pan" cinematographique — noye par le fait que Mali/Niger sont visuellement proches
// a cette echelle. Teste avec une valeur extreme (80deg) : le pan fonctionne parfaitement.
// Fix : dezoomer legerement pendant le pan (scale 1400->900) pour rendre le mouvement LISIBLE,
// comme un vrai pan cinema plutot qu'un micro-glissement imperceptible.
const CAM: CamKeyframe[] = [
  { f: 0, center: [10, 20], scale: 160 },       // monde entier
  { f: 60, center: MALI_CENTER, scale: 1400 },  // zoom serre sur Mali, holds
  { f: 210, center: MALI_CENTER, scale: 1400 }, // hold
  { f: 240, center: NIGER_CENTER, scale: 900 }, // pan final + leger dezoom -> mouvement lisible
];

const GLOW_START = 60;
const GLOW_DUR = 20;
const CIRCLE_START = 85;
const CIRCLE_DUR = 12;
const RISE_START = 100;
const RISE_DUR = 30;

export const SCENE1_FRAMES = 240;
export const SCENE1_FPS = 30;

export const Scene1Rise: React.FC = () => {
  const frame = useCurrentFrame();
  const countries = useWorldCountries();
  const { path } = useProjection(CAM, frame);

  const mali = countries?.find((c) => c.properties.name === "Mali");

  // Glow blanc du contour — draw-in via stroke-dasharray/dashoffset (meme mecanique que nos
  // protos Mapbox, appliquee ici a un path d3-geo au lieu d'un path Mapbox).
  const glowT = interpolate(frame, [GLOW_START, GLOW_START + GLOW_DUR], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });

  // Cercle rouge qui pop
  const circleScale = interpolate(frame, [CIRCLE_START, CIRCLE_START + CIRCLE_DUR], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)),
  });

  // Silhouette qui rise — ease-out, translateY + opacity (meme pattern que nos protos precedents,
  // ici avec un asset genere Gemini au lieu d'un cutout Trump).
  const riseT = interpolate(frame, [RISE_START, RISE_START + RISE_DUR], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  const riseY = interpolate(riseT, [0, 1], [70, -20]);
  const riseOpacity = interpolate(frame, [RISE_START, RISE_START + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Point projete du centre Mali pour ancrer cercle + silhouette (recalcule chaque frame,
  // synchrone — meme discipline anti-drift que sur les protos Mapbox).
  const projMali = path.centroid((mali as any) ?? { type: "Point", coordinates: MALI_CENTER });

  let maliPathLen = 0;
  let maliD = "";
  if (mali) {
    maliD = path(mali as any) || "";
    // Approximation de longueur : nombre de commandes * facteur — suffisant pour un draw-in visuel,
    // pas besoin de precision pixel-perfect ici (contrairement au verify-trajectory des protos
    // precedents qui verifiait une TRAJECTOIRE, pas juste un effet de reveal).
    maliPathLen = (maliD.match(/[ML]/g)?.length ?? 50) * 40;
  }

  return (
    <AbsoluteFill style={{ background: NAVY_OCEAN }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {/* Vignette bords assombris — "darken at the edges" du prompt 1 */}
        <defs>
          <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
            <stop offset="60%" stopColor="#000" stopOpacity={0} />
            <stop offset="100%" stopColor="#000" stopOpacity={0.55} />
          </radialGradient>
        </defs>

        {/* Tous les pays, fond gris clair */}
        {countries?.map((c, i) => (
          <path key={i} d={path(c as any) || ""} fill={LAND_FILL} stroke={LAND_STROKE} strokeWidth={0.6} />
        ))}

        {/* Glow blanc contour Mali — draw-in */}
        {mali && glowT > 0.01 && (
          <path
            d={maliD}
            fill="none"
            stroke="#ffffff"
            strokeWidth={4}
            strokeOpacity={0.9}
            strokeDasharray={maliPathLen}
            strokeDashoffset={maliPathLen * (1 - glowT)}
            style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" }}
          />
        )}

        {/* Vignette par-dessus la carte */}
        <rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="url(#vignette)" />
      </svg>

      {/* Cercle rouge — overlay DOM 2D ancre au centroid projete */}
      {circleScale > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: projMali[0] - 60,
            top: projMali[1] - 60,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,30,30,0.9) 0%, rgba(200,30,30,0.5) 70%, transparent 100%)",
            transform: `scale(${circleScale})`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Silhouette qui rise depuis le cercle */}
      {riseOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: projMali[0] - 90,
            top: projMali[1] - 260 + riseY,
            width: 180,
            height: 280,
            opacity: riseOpacity,
            pointerEvents: "none",
            filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.6))",
          }}
        >
          <img
            src={staticFile("_rnd/vox-repro/silhouette-cutout.png")}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};

export default Scene1Rise;
