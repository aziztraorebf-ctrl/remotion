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

import { applyGeoAfriqueV5, MapboxBrandingHide, removeLabels } from "../../_shared/mapbox/MapboxBase";
import {
  getZambiaGeo,
  volontairesA,
  W,
  H,
  ZAMBIA_GEOJSON,
  type ZambiaFeatureCollection,
  type ZambiaGeo,
} from "./zambiaGeo";

export const ZAMBIA_CONCEPT_B_FRAMES = 240; // 8 s a 30 fps

const TOKEN = process.env.REMOTION_MAPBOX_TOKEN || process.env.MAPBOX_TOKEN || "";

const OR = "#e2b33c";
const VERT = "#4e7e45";      // MESURE sur la case storyboard : RGB(78,126,69)
const OR_BORD = "#f0c014";   // liseré or lumineux du storyboard
const TEXTE = "#f2ede3";

// Cadrages, tires du breakdown : continent large -> medium LARGE sur la Zambie.
// ⭐ zoom d'arrivee volontairement BAS (4.35) : c'est lui qui garde le collier de contexte.
const CAM_DEBUT = { lon: 21.0, lat: -6.0, zoom: 3.5, pitch: 16 };
const CAM_FIN = { lon: 27.6, lat: -13.1, zoom: 5.9, pitch: 38 };

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
  // Le pitch monte avec la descente : c'est lui qui donne le relief "presque 3D" du storyboard.
  const pitch = CAM_DEBUT.pitch + (CAM_FIN.pitch - CAM_DEBUT.pitch) * tDesc;

  useEffect(() => {
    if (!ref.current) return;
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [CAM_DEBUT.lon, CAM_DEBUT.lat],
      zoom: CAM_DEBUT.zoom,
      pitch: CAM_DEBUT.pitch,
      interactive: false,
      preserveDrawingBuffer: true,
      attributionControl: false,
      // ⛔⛔ MERCATOR FORCE. Mapbox v3 bascule TOUT SEUL en projection globe sous zoom ~5 :
      // a zoom 2.35 on obtenait un disque sur fond noir (mesure : 4/4 coins noirs) alors que
      // la case storyboard de Grok est une CARTE PLATE plein cadre (0/4 coins noirs).
      // Le globe appartient au concept A (Gemini) ; il n'a jamais rien eu a faire ici.
      projection: { name: "mercator" },
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
        paint: { "fill-color": VERT, "fill-opacity": 0.82 },
      });
      map.addLayer({
        id: "zm-halo",
        type: "line",
        source: "zm",
        filter: ["get", "inBrief"],
        paint: {
          "line-color": "#ffd000",
          "line-width": 9,
          "line-opacity": 0.34,
          "line-blur": 7,
        },
      });
      map.addLayer({
        id: "zm-ligne",
        type: "line",
        source: "zm",
        filter: ["get", "inBrief"],
        // liseré or epais + halo : c'est lui qui detache la Zambie du fond (absent du 1er rendu)
        paint: {
          "line-color": OR_BORD,
          "line-width": 2.6,
          "line-opacity": 0.92,
          "line-blur": 0.6,
        },
      });

      // ⛔ Doctrine : zero label Mapbox sur nos cartes. Helper maison, pas une reimplementation.
      removeLabels(map);

      // ⭐ Palette GeoAfrique V5 (water #1a3a5c). MESURE : le fond du storyboard Grok est
      // RGB(21,53,82) — soit EXACTEMENT cette couleur. Le dark-v11 nu donnait RGB(9,9,9),
      // un noir qui ecrasait tout : c'est la cause du "trop sombre, pas la meme couleur".
      // Grok avait dessine NOTRE propre palette maison, il fallait juste l'appliquer.
      applyGeoAfriqueV5(map);

      // RELIEF — l'effet "presque 3D" du storyboard vient du terrain ombre, pas du seul tilt.
      // Exaggeration MODEREE (1.4) : la Zambie est un plateau, pas une chaine de montagnes.
      // Un client "NatGeo" verrait le mensonge d'un relief pousse (teste a 8.0 : spectaculaire
      // mais faux).
      if (!map.getSource("dem")) {
        map.addSource("dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
      }
      map.setTerrain({ source: "dem", exaggeration: 1.4 });

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
    if (m) m.jumpTo({ center: [lon, lat], zoom, pitch });
  }, [lon, lat, zoom, pitch]);

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
            <defs>
              <radialGradient id="billeCoeur" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fffdf0" stopOpacity="1" />
                <stop offset="45%" stopColor="#f6e16a" stopOpacity="1" />
                <stop offset="100%" stopColor="#f6e16a" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="billeTrainee" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f6e16a" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#f6e16a" stopOpacity="0" />
              </linearGradient>
              <filter id="billeGlow" x="-160%" y="-160%" width="420%" height="420%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
            </defs>

            {geo.briefProvinces.map((prov) => {
              const t0 = T_MARQUEURS[prov.name];
              if (t0 == null || frame < t0) return null;
              const m = mapRef.current;
              if (!m) return null;
              // Reprojection CHAQUE frame : sans ca, le marqueur derive de la carte.
              const p = m.project([prov.centroidLon, prov.centroidLat]);
              const localF = frame - t0;

              // MESURE sur la case storyboard : coeur RGB(246,225,106), halo RGB(198,179,68),
              // rayon ~1,1 % de la largeur du cadre. Ce ne sont PAS des jetons hexagonaux
              // (ceux-la sont notre registre Souverain) ni des points noirs : ce sont des
              // BILLES LUMINEUSES avec une trainee verticale, comme une epingle de lumiere
              // plantee dans le sol. Entierement faisable en SVG — aucun After Effects.
              const R = W * 0.0072; // halo reduit : a 0.011 il mangeait le vert des provinces
              const naissance = Math.max(0, Math.min(1, localF / 14));
              const pop = 1 + 0.55 * Math.max(0, 1 - localF / 10); // petit sursaut a l'allumage
              const respire = 1 + 0.07 * Math.sin((frame - t0) / 9);
              const r = R * naissance * pop * respire;
              if (r <= 0.2) return null;

              return (
                <g key={prov.name} opacity={naissance}>
                  {/* trainee : le cone qui descend vers le sol */}
                  <path
                    d={`M ${p.x - r * 0.42} ${p.y} L ${p.x + r * 0.42} ${p.y} L ${p.x} ${p.y + r * 4.2} Z`}
                    fill="url(#billeTrainee)"
                  />
                  {/* halo large et flou, deborde sur le territoire */}
                  <circle cx={p.x} cy={p.y} r={r * 2.2} fill="#c6b344" opacity={0.26} filter="url(#billeGlow)" />
                  {/* coeur */}
                  <circle cx={p.x} cy={p.y} r={r * 1.5} fill="url(#billeCoeur)" />
                  <circle cx={p.x} cy={p.y} r={r * 0.52} fill="#fffdf0" />
                </g>
              );
            })}
          </svg>

          {/* Cartouche VOLONTAIRES — reduit apres mesure : il pesait 3,8x l'ensemble des
              7 billes et volait le regard. Le sujet du plan, ce sont les foyers qui
              s'allument, pas le chiffre. Contraste baisse pour la meme raison. */}
          {/* ANNEE — releve par GPT-5.5 : sans elle, le plan dit "220 volontaires quelque part"
              sans jamais dire QUAND. Vrai manque narratif.
              ⚠️ GPT l'attribue au storyboard, a tort : la case de Grok ne porte qu'un timecode.
              Point applique parce qu'il est JUSTE, pas parce qu'un modele l'a dit. */}
          <div
            style={{
              position: "absolute",
              left: 96,
              top: 92,
              color: TEXTE,
              fontSize: 46,
              fontFamily: "Source Sans 3, sans-serif",
              fontWeight: 700,
              letterSpacing: 3,
              opacity: 0.9,
            }}
          >
            {frame < T_MARQUEURS.Northern ? 1995 : Math.round(1995 + 10 * progression)}
          </div>

          <div style={{ position: "absolute", left: 96, bottom: 84, opacity: 0.78 }}>
            <div
              style={{
                color: OR,
                fontSize: 58,
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
                fontSize: 18,
                fontFamily: "Source Sans 3, sans-serif",
                letterSpacing: 3,
                marginTop: 8,
                opacity: 0.62,
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
