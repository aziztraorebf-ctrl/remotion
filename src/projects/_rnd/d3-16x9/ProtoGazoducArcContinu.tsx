// PROTO — Arc geographique continu sur globe D3, camera JAMAIS figee (Gazoduc AAGP vs TSGP, Acte 1 hook).
//
// Objectif (brief Aziz, ref video GEOlayers "Easy Guide: Earth Rotation Map", 0-30s) : le globe tourne
// ET zoome en continu vers l'avant PENDANT qu'un arc dore se trace en S entre 2 territoires colores,
// le tout bougeant comme un seul bloc rigide (jamais de desync sphere/contenu/arc). Ce proto isole ce
// SEUL mouvement (8s, ~240f) avant de l'integrer a GazoducActe1Hook.tsx (qu'on NE TOUCHE PAS ici).
//
// Reutilise le socle Soudan (globeGeo/globeCamera/geoArc) + THEMES/BorderPulse (SoudanActe3GlobeProto16x9)
// — cf memoire projet : ne jamais reinventer une palette/mecanisme de contour "similaire".
//
// BUG CONNU A NE PAS REPRODUIRE (cf CLAUDE.md/brief) : un seul cercle SVG de la sphere (clip, atmosphere,
// ocean, ombre de nuit, contour) qui utilise GLOBE_R brut au lieu de `globeR` (= GLOBE_R * scaleMul) fige
// la sphere a taille constante alors que le contenu bouge => bug invisible au code, visible au rendu.
// AUCUNE occurrence de GLOBE_R en dehors du calcul de `globeR` lui-meme dans ce fichier (verifie par grep).
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, staticFile } from "remotion";
import { GLOBE_R, GRATICULE, worldFeatures, featureByName, orthoAt, pathOf, isVisible as isVisibleGeo } from "./globeGeo";
import { arcPathD, pointAlongArc, projectPoint, type LonLat } from "./geoArc";
import { camAt, type CamKey } from "./globeCamera";
import { THEMES, BorderPulse } from "./SoudanActe3GlobeProto16x9";

const W = 1920;
const H = 1080;

export const PROTO_GAZODUC_ARC_FRAMES = 240; // 8s @30fps

const clampB = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// --- Geo du proto (Nigeria -> Europe du Sud, cf GAZODUC_GEO du vrai episode) -------------------
const NIGERIA: LonLat = [7.99, 9.54];
const EUROPE_SUD: LonLat = [-3.5, 40.0];
// Centre de camera "carrefour" entre les 2 points (permet de garder les 2 sur la face visible tot).
const MIDPOINT: LonLat = [(NIGERIA[0] + EUROPE_SUD[0]) / 2, (NIGERIA[1] + EUROPE_SUD[1]) / 2];

// --- Camera CONTINUE : 4 keyframes, pivot + zoom en avant permanent, amplitude façon Soudan ----
// (jamais timide : 4.4 -> 1.5 -> 2.6 -> 4.8, cf grep scaleMul reel du projet [1.22..4.6]).
const CAM: CamKey[] = [
  // depart : tres zoome sur le Nigeria (le "hook" part serre sur la source du gaz).
  { frame: 0, lon: NIGERIA[0], lat: NIGERIA[1] + 4, scaleMul: 4.4 },
  // pivot large : le globe recule et tourne pour reveler les 2 territoires + la courbure.
  { frame: 90, lon: MIDPOINT[0], lat: MIDPOINT[1] - 6, scaleMul: 1.5 },
  // on repart en avant vers l'Europe pendant que l'arc continue de se tracer (jamais figé).
  { frame: 165, lon: MIDPOINT[0] - 4, lat: MIDPOINT[1] + 4, scaleMul: 2.6 },
  // arrivee : zoom serre final sur l'Europe du Sud (clot le mouvement, courbure qui s'aplatit).
  { frame: 239, lon: EUROPE_SUD[0] + 2, lat: EUROPE_SUD[1] - 2, scaleMul: 4.8 },
];

const t = THEMES.mixte;

export const ProtoGazoducArcContinu: React.FC = () => {
  const frame = useCurrentFrame();

  // ===== CAMERA CONTINUE (jamais figee) =====
  const cam = camAt(CAM, frame);
  const rotLambda = -cam.lon;
  const rotLat = -cam.lat;
  const globeR = GLOBE_R * cam.scaleMul; // SEULE variable de rayon utilisee pour TOUT dessin de sphere.
  const proj = orthoAt(rotLambda, rotLat).scale(globeR);
  const path = pathOf(proj);
  const visible = (ll: LonLat) => isVisibleGeo(ll, rotLambda, rotLat);

  const sphere = path({ type: "Sphere" } as any) || "";
  const grat = path(GRATICULE as any) || "";
  const feats = worldFeatures();
  const nigeria = featureByName("Nigeria");
  // Espagne = feature reelle la plus proche du point symbolique EUROPE_SUD (peninsule iberique).
  const espagne = featureByName("Spain");

  // ===== ARC lumineux Nigeria -> Europe du Sud, se trace PENDANT le pivot/zoom (jamais apres) =====
  // reveal 0->1 sur toute la duree du pivot (30..220) : l'arc grandit EN MEME TEMPS que la camera bouge,
  // jamais une fois la camera arretee (contrairement au piege identifie dans le brief).
  const arcReveal = interpolate(frame, [30, 220], [0, 1], clampB);
  const arcD = arcPathD(proj, path, NIGERIA, EUROPE_SUD, arcReveal, 96);
  const travelT = interpolate(frame, [30, 220], [0, 1], clampB);
  const marker = frame >= 30 && frame <= 220 ? pointAlongArc(proj, NIGERIA, EUROPE_SUD, travelT, visible) : null;

  // reaction territoire cible (Europe) : s'illumine quand l'arc approche/arrive.
  const targetGlow = interpolate(frame, [190, 225], [0, 1], clampB);
  // pulse de frontiere Nigeria au depart, Espagne a l'arrivee (BorderPulse, brique reutilisee).
  const nigeriaPulse = interpolate(frame, [0, 26], [1, 0], clampB); // souffle sortant des la 1ere frame
  const espagnePulse = interpolate(frame, [195, 230], [0, 1], clampB);

  const pNigeria = projectPoint(proj, NIGERIA, visible);
  const pEurope = projectPoint(proj, EUROPE_SUD, visible);

  const fadeIn = interpolate(frame, [0, 12], [0, 1], clampB);

  return (
    <AbsoluteFill style={{ background: t.bg }}>
      <AbsoluteFill style={{ opacity: fadeIn }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <radialGradient id="pgAtmo" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stopColor={t.atmoColor} stopOpacity="0" />
              <stop offset="93%" stopColor={t.atmoColor} stopOpacity={t.atmoOpacity + 0.15} />
              <stop offset="100%" stopColor={t.atmoColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="pgOcean" cx="42%" cy="38%" r="70%">
              <stop offset="0%" stopColor={t.oceanInner} />
              <stop offset="70%" stopColor={t.oceanMid} />
              <stop offset="100%" stopColor={t.oceanOuter} />
            </radialGradient>
            <radialGradient id="pgShade" gradientUnits="userSpaceOnUse"
              cx={W / 2 - globeR * 0.24} cy={H / 2 - globeR * 0.3} r={globeR * 1.35}>
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="58%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#05070d" stopOpacity="0.5" />
            </radialGradient>
            <clipPath id="pgSphereClip"><path d={sphere} /></clipPath>
          </defs>

          {/* halo atmospherique + ocean + graticule — tous derives de globeR (jamais GLOBE_R brut) */}
          <circle cx={W / 2} cy={H / 2} r={globeR + 34} fill="url(#pgAtmo)" />
          <path d={sphere} fill="url(#pgOcean)" stroke={t.sphereStroke} strokeWidth={1.5} strokeOpacity={0.55} />
          <path d={grat} fill="none" stroke={t.grat} strokeWidth={0.8} strokeOpacity={t.gratOpacity} />

          {/* pays neutres */}
          {feats.map((f, i) => {
            const name = f.properties.name;
            if (name === "Nigeria" || name === "Spain") return null;
            const d = path(f as any);
            if (!d) return null;
            return <path key={i} d={d} fill={t.land} stroke={t.landStroke} strokeWidth={t.borderWidth} strokeOpacity={t.borderOpacity} />;
          })}

          {/* NIGERIA — territoire SOURCE, colore (kaki clair source, comme Soudan dans le socle) */}
          {nigeria && (() => {
            const d = path(nigeria as any);
            if (!d) return null;
            return (
              <g>
                <path d={d} fill={t.sudanFill} fillOpacity={0.95} stroke={t.sudanStroke} strokeWidth={1.6} />
                <BorderPulse d={d} pulse={nigeriaPulse} color={t.flowGold} />
              </g>
            );
          })()}

          {/* ESPAGNE — territoire CIBLE, s'illumine a l'arrivee de l'arc (kaki chauffe + contour dore) */}
          {espagne && (() => {
            const d = path(espagne as any);
            if (!d) return null;
            const fill = targetGlow > 0.01
              ? interpolateColor(t.land, t.landActive, targetGlow)
              : t.land;
            return (
              <g>
                <path d={d} fill={fill} stroke={t.landActiveStroke} strokeWidth={t.borderWidth + 1.2 * targetGlow}
                  strokeOpacity={t.borderOpacity + 0.4 * targetGlow} />
                <BorderPulse d={d} pulse={espagnePulse} color={t.flowGold} />
              </g>
            );
          })()}

          {/* ARC lumineux Nigeria -> Europe, en S le long de la courbure (grand cercle, clip natif) */}
          {arcD && (
            <>
              <path d={arcD} fill="none" stroke="rgba(10,14,22,0.55)" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
              <path d={arcD} fill="none" stroke={t.flowGold} strokeWidth={11} strokeLinecap="round" opacity={0.18} />
              <path d={arcD} fill="none" stroke={t.flowGold} strokeWidth={4.4} strokeLinecap="round" />
              <path d={arcD} fill="none" stroke="#fff" strokeWidth={1.5} strokeLinecap="round"
                strokeDasharray="7 12" strokeDashoffset={-(frame * 0.9) % 19} opacity={0.55} />
            </>
          )}
          {/* marqueur voyageur dore le long de l'arc */}
          {marker && (
            <g transform={`translate(${marker.x} ${marker.y})`}>
              <circle r={18} fill={t.flowGold} opacity={0.22} />
              <circle r={11} fill={t.flowGold} opacity={0.35} />
              <circle r={8.5} fill={t.flowGold} stroke="#fff" strokeWidth={2} />
            </g>
          )}

          {/* points-source/cible discrets (repere geo, pas de texte — proto isole sur le mouvement) */}
          {pNigeria && <circle cx={pNigeria.x} cy={pNigeria.y} r={5} fill={t.flowGold} stroke={t.landStroke} strokeWidth={1.5} />}
          {pEurope && <circle cx={pEurope.x} cy={pEurope.y} r={5} fill={t.flowGold} stroke={t.landStroke} strokeWidth={1.5} />}

          {/* ombre spherique (volume), clippee a la sphere courante */}
          <rect x={0} y={0} width={W} height={H} fill="url(#pgShade)" clipPath="url(#pgSphereClip)" pointerEvents="none" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// lerp hex simple (evite color-mix CSS, non garanti en headless — meme recette que SoudanActe6Globe).
function interpolateColor(a: string, b: string, p: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * p).toString(16).padStart(2, "0"));
  return `#${c.join("")}`;
}

export default ProtoGazoducArcContinu;
