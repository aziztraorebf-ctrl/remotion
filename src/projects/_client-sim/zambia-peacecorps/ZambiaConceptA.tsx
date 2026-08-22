/**
 * ZambiaConceptA — DEMO CLIENT, concept A : « le globe, la descente, la propagation ».
 *
 * MOTEUR: D3 — geometrie projetee. Le beat va d'une vue GLOBE a une vue PAYS sans rupture :
 *         une seule projection orthographique dont on fait varier l'echelle et le centre.
 *         Mapbox aurait impose un raccord entre deux moteurs (le concept B tient ce registre).
 *
 * Origine : storyboard Gemini v2 (concept 1 panneaux 1-2 pour l'ouverture, 3-4 pour le corps)
 * fusionne avec les arcs de son concept 2. Fusion arbitree par Aziz.
 * Breakdown : memory/client-sim-tests/zambia-peacecorps/breakdowns/breakdown-A-gemini.md
 *
 * ⛔ Ecart ASSUME avec le breakdown : Gemini demandait un FONDU entre un globe 3D et une carte
 * plate. Un fondu entre deux moteurs est fragile (deux geometries a synchroniser au pixel).
 * Ici la meme projection ortho porte tout le plan : le zoom continu fait le meme travail
 * sans raccord. Le globe s'aplatit naturellement quand l'echelle monte.
 */
import React, { useEffect, useState } from "react";
import { geoOrthographic, geoPath, geoGraticule10 } from "d3-geo";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { feature } from "topojson-client";

import {
  getZambiaGeo,
  ordreDepuisOrigine,
  REPARTITION,
  semisGeo,
  volontairesA,
  ORIGINE,
  W,
  H,
  ZAMBIA_GEOJSON,
  type ProvincePath,
  type ZambiaFeatureCollection,
  type ZambiaGeo,
} from "./zambiaGeo";

export const ZAMBIA_CONCEPT_A_FRAMES = 240; // 8 s a 30 fps (duree du breakdown)

const FOND = "#0a1020";
const OCEAN = "#132741";
const TERRE = "#c2cbd1"; // mesure storyboard RGB(194,203,209)
const TERRE_LIGNE = "#8fa3b5";
const OR = "#e2b33c";
const OR_CLAIR = "#f5d98a";

// --- Palette de la VUE TERRITOIRE (mesuree sur les cases 3-4 du storyboard Gemini) ---
// ⚠️ Distincte de celle du globe : le storyboard CHANGE de registre a l'arrivee. Mesures :
//   fond gris clair RGB(142,143,145) · provinces actives tan RGB(232,190,132)
//   provinces inactives gris moyen RGB(90,90,90)
// Mon 1er rendu gardait le bleu marine du globe partout — c'est ce qu'Aziz a signale par
// "les territoires sont beaucoup differents, le background semble different".
const TERR_FOND = "#8e8f91";
const TERR_ACTIVE = "#e8be84";
const TERR_INACTIVE = "#5a5a5a";
const TERR_TRAIT = "#f2f2f2";
const CYAN = "#5fe0e8"; // balise de destination pendant la descente (storyboard panneaux 1-2)
const TEXTE = "#f2ede3";

// Centre geographique de la Zambie (moyenne des centroides du brief).
const ZM_LON = 27.6;
const ZM_LAT = -13.2;

// Rayon de reference du globe a scaleMul = 1.
const R0 = Math.round((H * 0.78) / 2);

// Chronologie (30 fps), calee sur le breakdown Gemini.
const F_GLOBE = 0;
const F_DESCENTE = 45;
const F_ARRIVEE = 105;
const F_ARCS = 135;
const F_FIN = 240;

type World = { land: GeoJSON.GeoJsonObject; countries: GeoJSON.GeoJsonObject };

/** Forme minimale du TopoJSON monde, suffisante pour extraire land + countries. */
type WorldTopo = Parameters<typeof feature>[0] & {
  objects: Record<string, Parameters<typeof feature>[1]>;
};

export const ZambiaConceptA: React.FC = () => {
  const frame = useCurrentFrame();
  const [geo, setGeo] = useState<ZambiaGeo | null>(null);
  const [world, setWorld] = useState<World | null>(null);
  const [handle] = useState(() => delayRender("ZambiaA: geo"));

  useEffect(() => {
    Promise.all([
      fetch(staticFile(ZAMBIA_GEOJSON)).then((r) => r.json()),
      fetch(staticFile("_shared/geo-data/countries-50m.json")).then((r) => r.json()),
    ])
      .then(([zmRaw, topoRaw]) => {
        const zm = zmRaw as ZambiaFeatureCollection;
        const topo = topoRaw as WorldTopo;
        setGeo(getZambiaGeo(zm));
        setWorld({
          land: feature(topo, topo.objects.land) as unknown as GeoJSON.GeoJsonObject,
          countries: feature(topo, topo.objects.countries) as unknown as GeoJSON.GeoJsonObject,
        });
        continueRender(handle);
      })
      .catch((e) => {
        console.error("ZambiaA: chargement geo impossible", e);
        continueRender(handle);
      });
  }, [handle]);

  if (!geo || !world) return <AbsoluteFill style={{ backgroundColor: FOND }} />;

  // --- CAMERA : un seul mouvement continu, jamais d'arret intermediaire ---
  // ⛔ Piege connu (3 iterations perdues sur le Gazoduc) : des keyframes enchainees avec un
  // easeInOut PAR SEGMENT ont une derivee nulle a chaque extremite -> la camera s'ARRETE a
  // chaque point de passage. Ici : UNE seule interpolation monotone sur toute la duree, plus
  // un creep residuel qui ne retombe jamais a zero avant la derniere frame.
  const zoomBrut = interpolate(frame, [F_GLOBE, F_ARRIVEE], [1, 10.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t), // smoothstep unique, pas par segment
  });
  // creep : la camera continue d'avancer tres lentement apres l'arrivee (jamais figee)
  const creep = interpolate(frame, [F_ARRIVEE, F_FIN], [0, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scaleMul = zoomBrut + creep;

  // La rotation amene le centre du globe sur la Zambie. Depart legerement decale pour que
  // l'Afrique entiere soit lisible avant la descente.
  const lon = interpolate(frame, [F_GLOBE, F_ARRIVEE], [14, ZM_LON], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t),
  });
  const lat = interpolate(frame, [F_GLOBE, F_ARRIVEE], [-4, ZM_LAT], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t),
  });

  const globeR = R0 * scaleMul;
  const proj = geoOrthographic()
    .scale(globeR)
    .translate([W / 2, H / 2])
    .rotate([-lon, -lat])
    .clipAngle(90);
  const path = geoPath(proj);

  // ⛔ Tout ce qui doit suivre le zoom se calcule a partir de globeR, JAMAIS de R0 :
  // une seule constante brute oubliee fige la silhouette pendant que l'interieur bouge.
  const grat = geoGraticule10();

  // Progression de la propagation (0 -> 1) sur la fenetre des arcs.
  const propagation = interpolate(frame, [F_ARCS, F_FIN - 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cibles = ordreDepuisOrigine(geo);
  const origine = geo.briefProvinces.find((p) => p.name === ORIGINE);

  // Les provinces sont projetees par NOTRE projection courante, pas par celle du module
  // (qui cadre en fitExtent pour une vue fixe). On reprojette donc a la volee.
  const projProvince = (p: ProvincePath) => {
    const q = proj([p.centroidLon, p.centroidLat] as [number, number]);
    return q ? { x: q[0], y: q[1] } : null;
  };

  // Opacite des couches : la carte-monde s'efface quand on arrive au pays, les provinces
  // prennent le relais. Pas un fondu entre 2 moteurs — juste 2 calques d'une meme projection.
  const opaMonde = interpolate(frame, [F_DESCENTE, F_ARRIVEE], [1, 0.72], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opaProvinces = interpolate(frame, [F_DESCENTE + 20, F_ARRIVEE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const annee = Math.round(interpolate(frame, [F_ARCS, F_FIN - 30], [1995, 2005], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: melange(FOND, TERR_FOND, opaProvinces) }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="hazeA" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor={OCEAN} stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
          </radialGradient>
          <filter id="glowA" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* L'ocean = le disque du globe. Son rayon SUIT globeR (piege n2). */}
        <circle cx={W / 2} cy={H / 2} r={globeR} fill={melange(OCEAN, TERR_FOND, opaProvinces)} />

        <g opacity={opaMonde}>
          <path d={path(grat as never) || ""} fill="none" stroke={TERRE_LIGNE} strokeWidth={0.5} opacity={0.28} />
          <path d={path(world.land as never) || ""} fill={melange(TERRE, TERR_INACTIVE, opaProvinces)} stroke="none" />
          <path d={path(world.countries as never) || ""} fill="none" stroke={TERRE_LIGNE} strokeWidth={0.7} opacity={0.55} />
        </g>

        {/* BALISE CYAN — dit OU on va pendant la descente (storyboard panneaux 1-2).
            Absente du 1er rendu : le comparatif l'a relevee, et sans elle la descente
            n'a pas de cible lisible. S'eteint a l'arrivee, quand les provinces prennent le relais. */}
        {(() => {
          const q = proj([ZM_LON, ZM_LAT] as [number, number]);
          if (!q) return null;
          const opa = interpolate(frame, [F_GLOBE, 20, F_ARRIVEE - 25, F_ARRIVEE], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          if (opa <= 0) return null;
          const pulse = 1 + 0.16 * Math.sin(frame / 8);
          const rBase = Math.max(14, globeR * 0.055);
          return (
            <g opacity={opa}>
              <circle cx={q[0]} cy={q[1]} r={rBase * 2.1 * pulse} fill={CYAN} opacity={0.16} filter="url(#glowA)" />
              <circle cx={q[0]} cy={q[1]} r={rBase * pulse} fill={CYAN} opacity={0.55} filter="url(#glowA)" />
              <circle cx={q[0]} cy={q[1]} r={rBase * 0.35} fill="#ffffff" opacity={0.9} />
            </g>
          );
        })()}

        {/* Les 3 provinces HORS brief : fond neutre, jamais un accent. Sans elles, le pays
            apparait TROUE en son centre sous une camera mobile (defaut du 1er rendu). */}
        <g opacity={opaProvinces}>
          {geo.horsBriefRings.map((rings, i) => (
            <path
              key={`hb-${i}`}
              d={ringsToPath(rings, proj)}
              fill={TERR_INACTIVE}
              fillOpacity={0.92}
              stroke={TERR_TRAIT}
              strokeWidth={1.1}
              strokeOpacity={0.5}
            />
          ))}
        </g>

        {/* Les 7 provinces du brief. */}
        <g opacity={opaProvinces}>
          {geo.briefProvinces.map((prov) => {
            const estOrigine = prov.name === ORIGINE;
            const rang = cibles.findIndex((c) => c.name === prov.name);
            const seuil = estOrigine ? 0 : rang / cibles.length;
            const allume = estOrigine
              ? frame >= F_ARCS - 20
              : propagation > seuil;
            const intensite = allume
              ? interpolate(
                  propagation,
                  [seuil, Math.min(1, seuil + 0.22)],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                )
              : 0;
            return (
              <path
                key={prov.name}
                d={reprojectProvince(prov, proj)}
                fill={intensite > 0 ? TERR_ACTIVE : TERR_INACTIVE}
                fillOpacity={0.55 + intensite * 0.42}
                stroke={TERR_TRAIT}
                strokeWidth={intensite > 0 ? 1.8 : 1.0}
                strokeOpacity={0.45 + intensite * 0.45}
              />
            );
          })}
        </g>

        {/* GRAPPES DE VOLONTAIRES — le storyboard en montre dans chaque province active.
            Totalement absentes du 1er rendu (releve par le comparatif). Semees en lon/lat
            puis reprojetees chaque frame : elles restent clouees au sol quand la camera bouge. */}
        <g opacity={opaProvinces}>
          {geo.briefProvinces.map((prov) => {
            const estOrigine = prov.name === ORIGINE;
            const rang = cibles.findIndex((c) => c.name === prov.name);
            const seuil = estOrigine ? 0 : rang / cibles.length;
            const t = estOrigine
              ? interpolate(frame, [F_ARCS - 20, F_ARCS + 10], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : interpolate(propagation, [seuil, Math.min(1, seuil + 0.24)], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                });
            if (t <= 0) return null;
            const cible = REPARTITION[2005][prov.name] ?? 0;
            const nb = Math.max(1, Math.round(cible * 0.42));
            const pts = semisGeo(prov, nb);
            return (
              <g key={`dots-${prov.name}`}>
                {pts.map(([lo, la], k) => {
                  const q = proj([lo, la] as [number, number]);
                  if (!q) return null;
                  const retard = (k / Math.max(1, nb)) * 0.35;
                  const a = Math.max(0, Math.min(1, (t - retard) / 0.35));
                  if (a <= 0) return null;
                  return (
                    <circle
                      key={k}
                      cx={q[0]}
                      cy={q[1]}
                      r={2.6}
                      fill="#ffffff"
                      opacity={a * 0.82}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* ARCS : une seule origine (Luapula) vers N destinations — propagation, pas maillage. */}
        <g opacity={opaProvinces}>
          {origine &&
            cibles.map((cible, i) => {
              const a = projProvince(origine);
              const b = projProvince(cible);
              if (!a || !b) return null;
              const seuil = i / cibles.length;
              const t = interpolate(
                propagation,
                [seuil, Math.min(1, seuil + 0.26)],
                [0, 1],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              if (t <= 0) return null;

              // arc parabolique : point de controle perpendiculaire au segment
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const len = Math.hypot(dx, dy) || 1;
              const bulge = Math.min(120, len * 0.32);
              const cx = mx - (dy / len) * bulge;
              const cy = my + (dx / len) * bulge;
              const d = `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;

              // le trace se dessine puis reste en trainee fine (breakdown : ~30 % d'opacite)
              const total = len * 1.35;
              return (
                <g key={cible.name}>
                  <path
                    d={d}
                    fill="none"
                    stroke={OR}
                    strokeWidth={1.4}
                    opacity={t >= 1 ? 0.3 : 0}
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke={OR_CLAIR}
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeDasharray={`${total} ${total}`}
                    strokeDashoffset={total * (1 - t)}
                    opacity={t < 1 ? 0.95 : 0}
                    filter="url(#glowA)"
                  />
                </g>
              );
            })}
        </g>

        {/* Halo d'origine : Luapula, le point de depart de 1995. */}
        {origine && opaProvinces > 0.2 && (() => {
          const p = projProvince(origine);
          if (!p) return null;
          const pulse = 1 + 0.12 * Math.sin((frame - F_ARCS) / 7);
          return (
            <circle
              cx={p.x}
              cy={p.y}
              r={7 * pulse}
              fill={OR_CLAIR}
              opacity={opaProvinces * 0.95}
              filter="url(#glowA)"
            />
          );
        })()}

        <circle cx={W / 2} cy={H / 2} r={globeR} fill="url(#hazeA)" pointerEvents="none" />
      </svg>

      {/* Cartouche : annee + total. Toute valeur intermediaire est une INTERPOLATION. */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div style={{ position: "absolute", left: 110, top: 150, opacity: opaProvinces }}>
          <div
            style={{
              color: OR,
              fontSize: 124,
              fontFamily: "Source Sans 3, sans-serif",
              fontWeight: 700,
              letterSpacing: 4,
              lineHeight: 1,
            }}
          >
            {annee}
          </div>
          <div
            style={{
              color: TEXTE,
              fontSize: 30,
              fontFamily: "Source Sans 3, sans-serif",
              letterSpacing: 3,
              marginTop: 16,
              opacity: 0.86,
            }}
          >
            {volontairesA(propagation)} VOLONTAIRES
          </div>
          <div style={{ width: 92, height: 3, backgroundColor: OR, marginTop: 20, opacity: 0.75 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Reprojette le polygone d'une province avec la projection courante du plan. */
function reprojectProvince(
  prov: ProvincePath,
  proj: ReturnType<typeof geoOrthographic>
): string {
  return ringsToPath(prov.ringsLonLat, proj);
}

/** Reprojette des anneaux lon/lat en un path SVG sous la projection courante. */
function ringsToPath(
  rings: [number, number][][],
  proj: ReturnType<typeof geoOrthographic>
): string {
  const parts: string[] = [];
  for (const ring of rings) {
    const pts: string[] = [];
    for (const [lon, lat] of ring) {
      const q = proj([lon, lat] as [number, number]);
      if (!q) continue;
      pts.push(`${q[0].toFixed(2)},${q[1].toFixed(2)}`);
    }
    if (pts.length > 2) parts.push(`M ${pts.join(" L ")} Z`);
  }
  return parts.join(" ");
}

/** Interpole 2 couleurs hex : sert a passer de la palette GLOBE a la palette TERRITOIRE. */
function melange(a: string, b: string, t: number): string {
  const k = Math.max(0, Math.min(1, t));
  const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * k);
  return `rgb(${m(r1, r2)}, ${m(g1, g2)}, ${m(b1, b2)})`;
}
