/**
 * ZambiaConceptB — DEMO CLIENT, concept B : « le continent, la descente, la constellation ».
 *
 * MOTEUR: Mapbox — territoire reel. Le beat s'ouvre sur l'AFRIQUE ENTIERE et descend sur la
 *         Zambie sans jamais couper : c'est la carte du monde qui porte le plan, pas une
 *         geometrie calculee (registre tenu par le concept A). Une seule Map continue.
 *
 * Origine : storyboard Grok v2 (concept 2 panneau 1 pour l'ouverture continentale, concept 1
 * panneaux 2-4 pour les marqueurs) — fusion arbitree par Aziz.
 * Breakdown : memory/client-sim-tests/zambia-peacecorps/breakdowns/breakdown-B-grok.md
 *
 * ⭐ CORRECTION EXPLICITE d'Aziz reprise du breakdown : le cadrage final reste LARGE.
 * La Zambie ne remplit jamais le cadre — le collier de contexte (RDC, Tanganyika, Malawi,
 * Kariba, Angola) doit rester visible. C'est la correction des planches trop serrees.
 *
 * ⛔ Render obligatoire via scripts/render-mapbox.sh (WebGL headless).
 */
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

import { GisementMarker } from "../../_shared/mapbox/GisementTokens";
import { MapboxBrandingHide, removeLabels } from "../../_shared/mapbox/MapboxBase";
import {
  getZambiaGeo,
  volontairesA,
  ORIGINE,
  W,
  H,
  ZAMBIA_GEOJSON,
  type ZambiaFeatureCollection,
  type ZambiaGeo,
} from "./zambiaGeo";

export const ZAMBIA_CONCEPT_B_FRAMES = 240; // 8 s a 30 fps

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN || process.env.MAPBOX_TOKEN || "";

const OR = "#e2b33c";
const TEXTE = "#f2ede3";

// Cadrages, tires du breakdown : continent large -> medium LARGE sur la Zambie.
// ⭐ zoom d'arrivee volontairement BAS (4.35) : c'est lui qui garde le collier de contexte.
const CAM_DEBUT = { lon: 19.5, lat: -3.0, zoom: 2.35 };
const CAM_FIN = { lon: 27.6, lat: -13.4, zoom: 4.35 };

// Chronologie (30 fps), calee sur le breakdown Grok.
const F_DESCENTE = 12;
const F_ARRIVEE = 120;
const F_FIN = 240;

// Ordre d'allumage en secondes (breakdown Grok), converti en frames.
const T_MARQUEURS: Record<string, number> = {
  Luapula: 69,
  Northern: 99,
  "North-Western": 114,
  Eastern: 132,
  Western: 147,
  Southern: 165,
  Lusaka: 186,
};

export const ZambiaConceptB: React.FC = () => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [geo, setGeo] = useState<ZambiaGeo | null>(null);
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("ZambiaB: map + geo"));

  // --- CAMERA : un seul mouvement continu, jamais d'arret intermediaire ---
  // ⛔ Piege paye 3 iterations sur le Gazoduc : des keyframes avec easeInOut PAR SEGMENT ont
  // une derivee nulle a chaque extremite -> arret complet a chaque point de passage.
  // Ici : UNE interpolation monotone, plus un creep qui ne retombe jamais a zero.
  const tDesc = interpolate(frame, [F_DESCENTE, F_ARRIVEE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * t * (3 - 2 * t),
  });
  const creep = interpolate(frame, [F_ARRIVEE, F_FIN], [0, 0.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = CAM_DEBUT.zoom + (CAM_FIN.zoom - CAM_DEBUT.zoom) * tDesc + creep;
  const lon = CAM_DEBUT.lon + (CAM_FIN.lon - CAM_DEBUT.lon) * tDesc;
  const lat = CAM_DEBUT.lat + (CAM_FIN.lat - CAM_DEBUT.lat) * tDesc;

  useEffect(() => {
    if (!ref.current) return;
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [CAM_DEBUT.lon, CAM_DEBUT.lat],
      zoom: CAM_DEBUT.zoom,
      interactive: false,
      preserveDrawingBuffer: true,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on("load", async () => {
      // Les provinces : chargees comme source pour pouvoir teinter les 7 du brief.
      const fc: ZambiaFeatureCollection = await fetch(staticFile(ZAMBIA_GEOJSON)).then((r) =>
        r.json()
      );
      setGeo(getZambiaGeo(fc));

      map.addSource("zm", { type: "geojson", data: fc as never });

      // Les 3 provinces hors brief restent au fond neutre : presentes comme territoire,
      // jamais comme sujet. Filtre porte par la DONNEE (inBrief), pas par une liste en dur.
      map.addLayer({
        id: "zm-hors",
        type: "fill",
        source: "zm",
        filter: ["!", ["get", "inBrief"]],
        paint: { "fill-color": "#2b3550", "fill-opacity": 0.28 },
      });
      map.addLayer({
        id: "zm-brief",
        type: "fill",
        source: "zm",
        filter: ["get", "inBrief"],
        paint: { "fill-color": OR, "fill-opacity": 0.16 },
      });
      map.addLayer({
        id: "zm-ligne",
        type: "line",
        source: "zm",
        filter: ["get", "inBrief"],
        paint: { "line-color": OR, "line-width": 1.1, "line-opacity": 0.5 },
      });

      // ⛔ Doctrine : zero label Mapbox sur nos cartes. Helper maison, pas une reimplementation.
      removeLabels(map);

      map.once("idle", () => {
        setReady(true);
        continueRender(handle);
      });
    });

    return () => map.remove();
  }, [handle]);

  // Mapbox frame-driven : jumpTo uniquement (flyTo/easeTo sont incompatibles headless).
  useEffect(() => {
    const m = mapRef.current;
    if (m) m.jumpTo({ center: [lon, lat], zoom });
  }, [lon, lat, zoom]);

  const progression = interpolate(frame, [T_MARQUEURS.Luapula, F_FIN - 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b1220" }}>
      <div ref={ref} style={{ width: W, height: H }} />
      <MapboxBrandingHide />

      {ready && geo && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            {geo.briefProvinces.map((prov) => {
              const t0 = T_MARQUEURS[prov.name];
              if (t0 == null || frame < t0) return null;
              const m = mapRef.current;
              if (!m) return null;
              // Reprojection CHAQUE frame : sans ca, le marqueur derive de la carte.
              const p = m.project([prov.centroidLon, prov.centroidLat]);
              const localF = frame - t0;
              return (
                <g key={prov.name}>
                  <GisementMarker
                    kind={prov.name === ORIGINE ? "seal" : "sonar"}
                    x={p.x}
                    y={p.y}
                    scale={1.15}
                    frame={frame}
                    localF={localF}
                    appeared={localF > 12}
                    uid={`zm-${prov.name}`}
                    zoom={zoom}
                  />
                </g>
              );
            })}
          </svg>

          <div style={{ position: "absolute", left: 96, bottom: 96 }}>
            <div
              style={{
                color: OR,
                fontSize: 96,
                fontFamily: "Source Sans 3, sans-serif",
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: 2,
              }}
            >
              {volontairesA(progression)}
            </div>
            <div
              style={{
                color: TEXTE,
                fontSize: 27,
                fontFamily: "Source Sans 3, sans-serif",
                letterSpacing: 3,
                marginTop: 12,
                opacity: 0.85,
              }}
            >
              VOLONTAIRES
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
