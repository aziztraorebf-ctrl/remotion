/**
 * SoudanWarMapEngine — SOCLE carte War-Map Soudan, adapté du moteur AES (SahelWarMapEngine).
 *
 * Reprend le SOCLE GÉNÉRIQUE validé sur la vidéo AES (référence : warmap-sahel-aes-FINAL.mp4) :
 *   - 1 seule Map Mapbox continue, frame-driven (jumpTo + interpolation manuelle des camKeys ;
 *     JAMAIS flyTo/easeTo, incompatibles headless).
 *   - reskin PARCHEMIN à la volée (land crème uni, symboles/labels masqués, eau sourde).
 *   - projection lon/lat -> écran via map.project() pour poser des overlays SVG/DOM par-dessus.
 *
 * ⭐⭐ PRINCIPE CENTRAL (Aziz, "les parties les plus importantes") — cf. WARMAP-GRAMMAIRE :
 *   CONTOUR PERMANENT + INTÉRIEUR VIDE. Le territoire actif (le Soudan) a un CONTOUR coloré
 *   TOUJOURS présent (squelette permanent). Son INTÉRIEUR reste crème UNI, transparent, sans
 *   remplissage ni label parasite = la TOILE sur laquelle se pose l'action (jetons, flèches,
 *   teintes). Une teinte de faction (SAF bleu / RSF rouge) ne remplit un état QUE lorsqu'un camp
 *   le prend (bascule causale via controlAt) — jamais par défaut. Les voisins = assombris (kaki).
 *
 * Adaptations Soudan vs Sahel :
 *   - géo : public/_shared/geo-data/sudan/{sudan-states,sudan-outline}.geojson (17 états + enveloppe).
 *   - couleurs : ATLAS/COLORS de sudanControlData.ts (SAF bleu, RSF rouge, contesté or).
 *   - données de contrôle : controlAt() (déjà branché sur sudan.warmap.json).
 *   - 1 SEUL pays -> pas de découpage multi-pays (fusion byCountry / contour par pays neutralisés).
 *   - caméra : serrée sur le Soudan (bbox lon 21.8..38.6 / lat 8.7..22.2, centre ~[30,15]).
 *
 * Ce fichier est un SOCLE : il rend la carte "vide" propre + la teinte de contrôle. Les acteurs
 * (jetons, flèches, overlays plein écran) s'ajouteront beat par beat par-dessus, en réutilisant
 * les composants génériques _shared/ (SahelAttackArrow, WarMapBanner, WarMapDimmedOverlay, ...).
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
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";
import { ATLAS } from "./sudanControlData";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const SOUDAN_FPS = 30;

// ── GÉO ──
const STATES_GEOJSON = "_shared/geo-data/sudan/sudan-states.geojson";
const OUTLINE_GEOJSON = "_shared/geo-data/sudan/sudan-outline.geojson";

// ── COULEURS (registre parchemin ATLAS + factions) ──
const SUDAN_COLORS = {
  land: ATLAS.land,        // crème parchemin (intérieur des états au repos)
  ocean: ATLAS.ocean,      // eau sourde
  outline: ATLAS.outline,  // contour national permanent (encre)
  saf: ATLAS.saf,          // bleu armée
  rsf: ATLAS.rsf,          // rouge brique RSF
  contested: ATLAS.contested, // or contesté
} as const;

// ── CAMÉRA : vue serrée sur le Soudan (Ken Burns lent, jamais figée) ──
// Le Soudan remplit l'écran ; les voisins ne sont visibles que par les bords (assombris).
export type CamKey = { f: number; lon: number; lat: number; zoom: number };

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** interpole la caméra entre keyframes (smoothstep), clampée aux bornes. */
export function camAt(keys: CamKey[], frame: number): CamKey {
  if (frame <= keys[0].f) return keys[0];
  if (frame >= keys[keys.length - 1].f) return keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (frame >= a.f && frame < b.f) {
      const t = smoothstep((frame - a.f) / (b.f - a.f));
      return {
        f: frame,
        lon: a.lon + (b.lon - a.lon) * t,
        lat: a.lat + (b.lat - a.lat) * t,
        zoom: a.zoom + (b.zoom - a.zoom) * t,
      };
    }
  }
  return keys[keys.length - 1];
}

// caméra socle par défaut : le Soudan plein cadre + léger drift (démo du socle)
const DEFAULT_CAM: CamKey[] = [
  { f: 0, lon: 29.6, lat: 15.4, zoom: 5.05 },
  { f: 150, lon: 30.4, lat: 15.2, zoom: 5.0 },
  { f: 300, lon: 30.0, lat: 15.3, zoom: 5.02 },
];

// les 5 états du Darfour (ouest, cœur RSF)
export const DARFUR_STATES = [
  "North Darfur", "Western Darfur", "Central Darfur", "Southern Darfur", "Eastern Darfur",
];

/**
 * ZoneControl — un HALO de faction qui RAYONNE localement autour d'un point (JAMAIS un aplat plein).
 * Le rouge RSF s'étend depuis Hemeti, le bleu SAF depuis al-Burhan. Dégradé radial diffus, sans bord net.
 * `radius` en pixels écran (à la caméra de référence). `intensity` 0..1 pilote l'opacité (apparition douce).
 */
export type ZoneControl = {
  at: [number, number];   // ancrage lon/lat (centre du halo)
  faction: "rsf" | "saf" | "contested";
  radiusKm?: number;      // rayon approx en km (converti en px selon le zoom) — défaut 320
  intensity: number;      // 0..1 (monte à l'apparition, jamais 1 plein sur toute la carte)
};

/**
 * StateHighlight — "on nomme → ça se trace". Au mot exact, le CONTOUR d'un état se DESSINE (draw-in)
 * dans la couleur de la faction qui le tient, puis s'estompe. Intérieur reste crème vide (pas d'aplat).
 * Les états non nommés restent invisibles (repos = grand bloc vide, look AES).
 */
export type StateHighlight = {
  state: string;                       // name exact du geojson (ex. "North Darfur")
  faction: "rsf" | "saf" | "contested";
  drawAt: number;                      // frame de début du tracé
  drawFrames?: number;                 // durée du tracé (défaut 26)
  holdFrames?: number;                 // maintien après tracé (défaut 60) ; puis fade
  fadeFrames?: number;                 // durée du fade de sortie (défaut 24) ; 0 = reste
};

export type SoudanEngineProps = {
  /** keyframes caméra (défaut = Soudan plein cadre) */
  camKeys?: CamKey[];
  /** halos de contrôle locaux (rayonnent autour d'un point). JAMAIS d'aplat plein d'état. */
  zones?: ZoneControl[];
  /** "on nomme → ça se trace" : contour d'état coloré qui se dessine au mot, puis s'estompe. */
  highlights?: StateHighlight[];
  /** montre le contour national permanent (défaut true = principe "contour toujours présent") */
  showNationalBorder?: boolean;
  /** opacité des liserés d'états internes : 0 = grand bloc vide (look AES) ; ~0.15 = états très pâles */
  stateLineOpacity?: number;
  /** overlays enfants (jetons, flèches, plaques) posés PAR-DESSUS la carte, reçoivent le projecteur
   * + le mapRef (accès à l'instance mapboxgl.Map, ex. pour useClipFlags qui a besoin d'un vrai MutableRefObject
   * et pas juste d'une fonction de projection). */
  children?: (
    proj: (c: [number, number]) => { x: number; y: number } | null,
    mapRef?: React.MutableRefObject<mapboxgl.Map | null>
  ) => React.ReactNode;
};

const ZONE_COLORS = { rsf: ATLAS.rsf, saf: ATLAS.saf, contested: ATLAS.contested } as const;

export const SoudanWarMapEngine: React.FC<SoudanEngineProps> = ({
  camKeys = DEFAULT_CAM,
  zones = [],
  highlights = [],
  showNationalBorder = true,
  stateLineOpacity = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Soudan engine init"));
  const [ready, setReady] = useState(false);
  const projRef = useRef<((c: [number, number]) => { x: number; y: number }) | null>(null);
  // contour(s) du Soudan (polygones lon/lat) pour le masque du voile sombre (reprojeté par frame)
  const outlineRingsRef = useRef<[number, number][][]>([]);
  const [soudanPaths, setSoudanPaths] = useState<string[]>([]);
  const [, force] = useState(0);

  // ── INIT MAP (une seule fois) ──
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    let safety: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      continueRender(handle); safety = null;
    }, 45000);

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [camKeys[0].lon, camKeys[0].lat],
      zoom: camKeys[0].zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      projection: { name: "mercator" },
    });
    mapRef.current = map;
    map.on("error", (e) => console.error("[Soudan] error:", (e as any)?.error?.message ?? e));

    // RESKIN PARCHEMIN (repris du moteur AES) : land crème uni, labels masqués, eau sourde.
    // Réappliqué sur sourcedata (throttle) pour couvrir les tuiles chargées tardivement.
    const reskinMap = () => {
      try {
        const layers = map.getStyle().layers ?? [];
        for (const l of layers) {
          if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
          // MASQUER les ROUTES / transports / bâti (source du "réticulé" qui charge la carte, look AES clean)
          if (
            l.id.includes("road") || l.id.includes("bridge") || l.id.includes("tunnel") ||
            l.id.includes("transit") || l.id.includes("aeroway") || l.id.includes("building") ||
            l.id.includes("path") || l.id.includes("rail") || l.id.includes("ferry")
          ) {
            try { map.setLayoutProperty(l.id, "visibility", "none"); } catch {}
            continue;
          }
          // EAU / RIVIÈRES : garder le Nil DISCRET (pâle, fin) — repère géo sans charger.
          if (l.id.includes("water") || l.id.includes("waterway") || l.id.includes("river")) {
            if (l.type === "fill") {
              try { map.setPaintProperty(l.id, "fill-color", SUDAN_COLORS.ocean); } catch {}
            }
            if (l.type === "line") {
              // rivières (dont le Nil) : trait fin et pâle (discret mais présent)
              try { map.setPaintProperty(l.id, "line-color", "rgba(90,120,140,0.45)"); } catch {}
              try { map.setPaintProperty(l.id, "line-width", 0.9); } catch {}
            }
          }
          if (
            l.id === "land" || l.id.includes("landuse") || l.id.includes("landcover") ||
            l.id === "background" || l.id.includes("national-park")
          ) {
            try { map.setPaintProperty(l.id, "background-color", SUDAN_COLORS.land); } catch {}
            try { map.setPaintProperty(l.id, "fill-color", SUDAN_COLORS.land); } catch {}
          }
          if (l.id.includes("admin-0")) {
            try { map.setPaintProperty(l.id, "line-opacity", (l.id.includes("-bg") || l.id.includes("-disputed")) ? 0 : 1); } catch {}
            try { map.setPaintProperty(l.id, "line-color", SUDAN_COLORS.outline); } catch {}
          }
          // admin-1 NATIF Mapbox (sous-régions des voisins ET du Soudan) : ÉTEINDRE — on ne veut
          // que NOS liserés d'états (couche sudan-line, pilotée par stateLineOpacity).
          if (l.id.includes("admin-1")) {
            try { map.setPaintProperty(l.id, "line-opacity", 0); } catch {}
          }
        }
        if (map.getLayer("background")) {
          map.setPaintProperty("background", "background-color", SUDAN_COLORS.land);
        }
      } catch (e) { console.warn("[Soudan] reskin partial:", e); }
    };

    let reskinPending = false;
    map.on("sourcedata", () => {
      if (reskinPending) return;
      reskinPending = true;
      Promise.resolve().then(() => { reskinPending = false; reskinMap(); });
    });

    map.on("style.load", async () => {
      reskinMap();
      try {
        // 1. ÉTATS du Soudan (source du fill de contrôle). Intérieur VIDE par défaut (fill-opacity 0).
        const res = await fetch(staticFile(STATES_GEOJSON));
        const fc = await res.json();
        for (const f of fc.features) f.properties.ctrl = 1; // SAF nominal, mais opacité 0 au repos
        map.addSource("sudan", { type: "geojson", data: fc });

        // fill data-driven : 0=RSF (rouge), 0.5=contesté (or), 1=SAF (bleu).
        // fill-opacity piloté par la prop `showFill` (0 au repos = INTÉRIEUR VIDE ; monte à la bascule).
        map.addLayer({
          id: "sudan-fill",
          type: "fill",
          source: "sudan",
          paint: {
            "fill-color": [
              "interpolate", ["linear"], ["get", "ctrl"],
              0, SUDAN_COLORS.rsf,
              0.30, SUDAN_COLORS.rsf,
              0.5, SUDAN_COLORS.contested,
              0.70, SUDAN_COLORS.saf,
              1, SUDAN_COLORS.saf,
            ],
            "fill-color-transition": { duration: 400, delay: 0 },
            "fill-opacity": ["coalesce", ["get", "fillOp"], 0], // 0 = vide ; posé par frame
          } as any,
        });

        // liserés inter-états — opacité pilotée par stateLineOpacity (0 = bloc vide look AES).
        map.addLayer({
          id: "sudan-line",
          type: "line",
          source: "sudan",
          paint: { "line-color": SUDAN_COLORS.outline, "line-width": 0.9, "line-opacity": stateLineOpacity },
        });

        // HIGHLIGHT "on nomme → ça se trace" : contour d'état coloré qui se DESSINE (draw-in) puis RESTE.
        // 3 paires de couches (une par faction) → plusieurs régions de couleurs différentes peuvent
        // rester allumées EN MÊME TEMPS. Filtre par liste d'états (mis à jour par frame).
        const FACTIONS: Array<["rsf" | "saf" | "contested", string]> = [
          ["rsf", SUDAN_COLORS.rsf], ["saf", SUDAN_COLORS.saf], ["contested", SUDAN_COLORS.contested],
        ];
        for (const [fac, col] of FACTIONS) {
          map.addLayer({
            id: `sudan-hl-glow-${fac}`, type: "line", source: "sudan",
            filter: ["in", ["get", "name"], ["literal", []]] as any,
            paint: { "line-color": col, "line-width": 8, "line-opacity": 0, "line-blur": 4 },
          });
          map.addLayer({
            id: `sudan-hl-${fac}`, type: "line", source: "sudan",
            filter: ["in", ["get", "name"], ["literal", []]] as any,
            paint: { "line-color": col, "line-width": 3.2, "line-opacity": 0 },
          });
        }

        // 2. CONTOUR NATIONAL PERMANENT (le squelette toujours présent). Enveloppe dissoute.
        const resO = await fetch(staticFile(OUTLINE_GEOJSON));
        const fcO = await resO.json();
        map.addSource("sudan-outline", { type: "geojson", data: fcO });
        // extraire les rings (lon,lat) de l'enveloppe -> masque du voile sombre (le "trou" AES)
        const rings: [number, number][][] = [];
        for (const f of fcO.features) {
          const g = f.geometry;
          const polys = g.type === "MultiPolygon" ? g.coordinates : [g.coordinates];
          for (const poly of polys) rings.push(poly[0] as [number, number][]); // anneau extérieur
        }
        outlineRingsRef.current = rings;
        if (showNationalBorder) {
          map.addLayer({
            id: "sudan-border",
            type: "line",
            source: "sudan-outline",
            paint: { "line-color": SUDAN_COLORS.outline, "line-width": 3.2, "line-opacity": 0.92 },
          });
        }

        setReady(true);
        map.once("idle", () => { if (safety) { clearTimeout(safety); safety = null; } continueRender(handle); });
      } catch (e) {
        console.warn("[Soudan] geojson skipped:", e);
        setReady(true);
        if (safety) { clearTimeout(safety); safety = null; }
        continueRender(handle);
      }
    });

    return () => { if (safety) clearTimeout(safety); map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

  // ── UPDATE PAR FRAME : caméra + teinte de contrôle + projecteur ──
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;

    // caméra frame-driven
    const cam = camAt(camKeys, frame);
    map.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom, pitch: 0, bearing: 0 });

    // NB : PAS d'aplat de faction plein (anti-pattern). L'intérieur reste crème+contours.
    // Le contrôle territorial est montré par des HALOS locaux (rendus en SVG, cf. plus bas).
    // La couche `sudan-fill` reste à opacité 0 (réservée à une éventuelle bascule brève d'un seul état).

    // HIGHLIGHTS "on nomme → ça se trace + RESTE allumé" : contour d'état coloré en draw-in.
    // Regroupés PAR FACTION (3 couches) → plusieurs régions de couleurs différentes restent allumées.
    if (map.getLayer("sudan-hl-rsf")) {
      const byFac: Record<string, { states: string[]; op: number; drawP: number }> =
        { rsf: { states: [], op: 0, drawP: 1 }, saf: { states: [], op: 0, drawP: 1 }, contested: { states: [], op: 0, drawP: 1 } };
      for (const h of highlights) {
        const drawFrames = h.drawFrames ?? 26;
        const holdFrames = h.holdFrames ?? 60;
        const fadeFrames = h.fadeFrames ?? 0; // 0 = RESTE allumé (défaut de ce test)
        const t0 = h.drawAt;
        const tDraw = t0 + drawFrames;
        const tHold = tDraw + holdFrames;
        const tEnd = tHold + fadeFrames;
        if (frame < t0 || (fadeFrames > 0 && frame >= tEnd)) continue;
        const drawP = Math.min(1, Math.max(0, (frame - t0) / drawFrames));
        let op = 1;
        if (frame < tDraw) op = drawP;
        else if (fadeFrames > 0 && frame > tHold) op = Math.max(0, 1 - (frame - tHold) / fadeFrames);
        const b = byFac[h.faction];
        b.states.push(h.state);
        b.op = Math.max(b.op, op);          // opacité = la plus avancée du groupe
        b.drawP = Math.min(b.drawP, drawP); // draw-in = le plus récent du groupe
      }
      for (const fac of ["rsf", "saf", "contested"]) {
        const b = byFac[fac];
        const filter = b.states.length
          ? (["in", ["get", "name"], ["literal", b.states]] as any)
          : (["in", ["get", "name"], ["literal", []]] as any);
        map.setFilter(`sudan-hl-${fac}`, filter);
        map.setFilter(`sudan-hl-glow-${fac}`, filter);
        map.setPaintProperty(`sudan-hl-${fac}`, "line-opacity", b.op);
        map.setPaintProperty(`sudan-hl-glow-${fac}`, "line-opacity", b.op * 0.5);
        // draw-in : dash qui se remplit (subtil, cohérent avec le mini-test validé)
        const L = 2400;
        const drawn = L * b.drawP;
        map.setPaintProperty(`sudan-hl-${fac}`, "line-dasharray", [drawn / 8, (L - drawn) / 8] as any);
      }
    }

    // projecteur lon/lat -> écran (pour les overlays enfants)
    projRef.current = (c: [number, number]) => {
      const p = map.project(c);
      return { x: p.x, y: p.y };
    };

    // reprojeter le contour du Soudan -> paths SVG (le "trou" du voile sombre, suit la caméra)
    const rings = outlineRingsRef.current;
    if (rings.length) {
      const paths = rings.map((ring) => {
        let d = "";
        for (let i = 0; i < ring.length; i++) {
          const p = map.project(ring[i]);
          d += (i === 0 ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1);
        }
        return d + "Z";
      });
      setSoudanPaths(paths);
    }

    force((n) => n + 1);
  }, [ready, frame, camKeys, highlights]);

  const proj = projRef.current;

  return (
    <AbsoluteFill style={{ backgroundColor: SUDAN_COLORS.land }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />

      {/* ⭐⭐ VOILE KHAKI TROUÉ À LA FORME DU SOUDAN (grammaire AES) — assombrit TOUT ce qui n'est
          PAS le Soudan (les voisins passent en kaki/sépia sombre), le Soudan seul reste crème lumineux.
          Le trou suit la caméra frame par frame (rings reprojetés). C'est ce contraste crème/sombre qui
          isole le territoire actif — PAS un simple "tout en crème". */}
      {soudanPaths.length > 0 && (
        <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
          <defs>
            <mask id="soudanHole">
              <rect x="0" y="0" width={width} height={height} fill="white" />
              {soudanPaths.map((d, i) => (
                <path key={i} d={d} fill="black" />
              ))}
            </mask>
          </defs>
          {/* voile sépia sombre (kaki), troué sur le Soudan */}
          <rect x="0" y="0" width={width} height={height} fill="#241809" fillOpacity={0.5} mask="url(#soudanHole)" />
        </svg>
      )}

      {/* ⭐⭐ HALOS DE CONTRÔLE — la couleur de faction RAYONNE localement autour d'un point (JAMAIS
          un aplat d'état plein). Dégradé radial doux, ancré carte (suit la caméra), sans bord net. */}
      {proj && zones.length > 0 && (() => {
        const halos = zones.map((z, i) => {
          const c = proj(z.at);
          if (!c) return null;
          // rayon px : projeter un 2e point décalé de ~radiusKm vers l'est (1° lon ≈ 111km * cos(lat))
          const km = z.radiusKm ?? 320;
          const dLon = km / (111 * Math.cos((z.at[1] * Math.PI) / 180));
          const edge = proj([z.at[0] + dLon, z.at[1]]);
          const rPx = edge ? Math.abs(edge.x - c.x) : 120;
          return { i, x: c.x, y: c.y, r: Math.max(60, rPx), color: ZONE_COLORS[z.faction], op: z.intensity };
        }).filter(Boolean) as { i: number; x: number; y: number; r: number; color: string; op: number }[];
        return (
          <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <defs>
              {halos.map((h) => (
                <radialGradient key={`g${h.i}`} id={`zoneGrad${h.i}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={h.color} stopOpacity={0.42 * h.op} />
                  <stop offset="55%" stopColor={h.color} stopOpacity={0.24 * h.op} />
                  <stop offset="100%" stopColor={h.color} stopOpacity={0} />
                </radialGradient>
              ))}
            </defs>
            {halos.map((h) => (
              <circle key={h.i} cx={h.x} cy={h.y} r={h.r} fill={`url(#zoneGrad${h.i})`} style={{ mixBlendMode: "multiply" }} />
            ))}
          </svg>
        );
      })()}

      {/* VIGNETTE CINÉMA légère (coins) par-dessus, concentre l'œil */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 80% 80% at 50% 48%, rgba(0,0,0,0) 62%, rgba(20,14,6,0.35) 100%)",
        }}
      />
      {/* overlays enfants (jetons, flèches, plaques) — reçoivent le projecteur */}
      {proj && children && children(proj, mapRef)}
      <MapboxBrandingHide />
    </AbsoluteFill>
  );
};

export default SoudanWarMapEngine;
