/**
 * SahelWarMapEngine — War-Map Long Format AES (Mali + Burkina Faso + Niger).
 *
 * Adapte de WarMapEngine.tsx (Sudan) pour le Sahel.
 * Differences cles :
 *   - Geographie : Mali + Burkina + Niger, centre lon -1.5 lat 15.5, zoom 4.2
 *   - GeoJSON : sahel-admin1.geojson (32 regions admin-1)
 *   - Factions : etat (bleu) / jnim (rouge) / conteste (or) au lieu de SAF/RSF
 *   - Duree : 13181 frames @30fps = 439.37s (narration-v1 forced-alignment)
 *   - Pas de freeze overlay (War-Map Long = carte permanente, overlays en incrustation)
 *   - 3 jetons-refugies geo-ancres : Djibo / Menaka / Tillaberi
 *   - Icones ressources geo-ancrees : or (Bamako/Ouagadougou), uranium+petrole (Niamey)
 *   - HUD : legende 3 factions + date jalon + label evenement
 *
 * Triggers visuels lies au forced-alignment (TIMING-V1-2026-06-07.md) :
 *   f1198  → JNIM zone rouge apparait
 *   f1471  → Burkina Faso s'allume
 *   f2009  → Niger s'allume
 *   f6798  → Liptako-Gourma pulse or
 *   f7014  → AES nee (overlay date)
 *   f7279  → Kidal s'allume seul
 *   f8683  → drapeau malien sur Kidal
 *   f10294 → jeton Djibo apparait
 *   f10349 → jeton Menaka apparait
 *   f10783 → jeton Tillaberi apparait
 *   f11032 → icone or Mali + Burkina
 *   f11122 → icone petrole Niger
 *   f12183 → "Sahéliens" — icones ressources restent
 *   f13169 → derniere phrase, extinction progressive
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";
import {
  SAHEL_STATES,
  SAHEL_CITIES,
  SAHEL_VEHICLES,
  SAHEL_REFUGEES,
  sahelControlAt,
  sahelJalonAt,
  SAHEL_COLORS,
} from "./SahelControlData";
import type { Vehicle as SchemaVehicle, Refugee as SchemaRefugee, GeoPathPoint } from "../data/schema";

// Helpers d'interpolation geo-path (meme logique que warmapVehicles.ts)
const interpPath = (path: GeoPathPoint[], t: number): [number, number] => {
  const x = Math.max(0, Math.min(1, t));
  if (x <= path[0].t) return [path[0].lon, path[0].lat];
  if (x >= path[path.length - 1].t) return [path[path.length - 1].lon, path[path.length - 1].lat];
  for (let i = 0; i < path.length - 1; i++) {
    if (x >= path[i].t && x <= path[i + 1].t) {
      const f = (x - path[i].t) / (path[i + 1].t - path[i].t);
      return [path[i].lon + (path[i + 1].lon - path[i].lon) * f, path[i].lat + (path[i + 1].lat - path[i].lat) * f];
    }
  }
  return [path[path.length - 1].lon, path[path.length - 1].lat];
};

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const SAHEL_FPS = 30;
// 439.37s narration + 3s fade out + 4s CTA = 446s -> arrondi a 13380 frames
export const SAHEL_DURATION = 13380;

// Bornes de la timeline carte (frames)
const T_START = Math.round(1.8 * SAHEL_FPS); // 54 frames — map pas encore visible, carton titre
const T_END = 13150;                          // ~438s — proche de la derniere syllabe

// ============================================================
// TRIGGERS AUDIO (depuis TIMING-V1-2026-06-07.md)
// ============================================================
const F_JNIM_ZONE     = 1198;  // "JNIM." — zone rouge apparait
const F_BURKINA       = 1471;  // "Faso" — Burkina s'allume
const F_NIGER         = 2009;  // "Niger." — Niger s'allume
const F_AES_NEE       = 7014;  // "née." — AES born overlay
const F_KIDAL_ALONE   = 7279;  // "Kidal." — Kidal s'allume
const F_KIDAL_FLAG    = 8683;  // "flotte" — drapeau malien sur Kidal
const F_REF_DJIBO     = 10294; // "Djibo," — jeton refugie Djibo
const F_REF_MENAKA    = 10349; // "Ménaka" — jeton refugie Menaka (2e occurrence)
const F_REF_TILLABERI = 10783; // "réel." — overlay humanitaire
const F_ICON_OR       = 11032; // "Mali" — icone or Mali + Burkina
const F_ICON_PETRO    = 11122; // "pétrole" — icone petrole Niger
const F_SAHELIENS     = 12183; // "Sahéliens." — phrase finale vision

// Triggers villes additionnels (depuis TIMING-V1)
const F_GAO           = 4056;  // "Gao,"
const F_MENAKA_BASE   = 4082;  // "Ménaka," (base militaire)
const F_NIAMEY_BASE   = 4112;  // "Niamey."
const F_DJIBO_REF     = 10294; // "Djibo," (réfugiés)

// ============================================================
// TRIGGERS HOOK — Acte 1 (depuis forced alignment narration-v1)
// SCRIPT: "Ils ont expulsé" → Mali blanc
// SCRIPT: "Rompu" → Burkina blanc
// SCRIPT: "Quitté" → Niger blanc + CEDEAO clignote
// SCRIPT: "quelque chose de nouveau" → vecteurs capitales → Liptako or
// SCRIPT: "Comment est-ce possible" → FIGÉE 2s
// ============================================================
const F_HOOK_MALI     = 150;   // "expulsé" → Mali s'allume blanc
const F_HOOK_BURKINA  = 231;   // "Rompu" → Burkina s'allume blanc
const F_HOOK_NIGER    = 301;   // "Quitté" → Niger s'allume blanc
const F_HOOK_CEDEAO   = 382;   // "continent." → anneau CEDEAO clignote orange → s'éteint
const F_HOOK_LIPTAKO  = 502;   // "nouveau." → vecteurs capitales + Liptako pulse or
const F_HOOK_FREEZE   = 572;   // "possible" → FIGÉE 2s (60 frames)
const F_HOOK_DRIFT    = 726;   // "répondre" → drift reprend

// Coordonnées pivots hook
const LIPTAKO_CENTER = [-0.5, 14.5] as [number, number]; // Centre zone Liptako-Gourma
const BAMAKO_COORD   = [-7.99, 12.65] as [number, number];
const OUAGA_COORD    = [-1.52, 12.37] as [number, number];
const NIAMEY_COORD   = [2.12, 13.51] as [number, number];

// ============================================================
// VILLES — apparition progressive liee a l'audio
// Chaque ville apparait quand la narration la mentionne pour la premiere fois.
// ============================================================
type CityConfig = { name: string; appearFrame: number };
const CITY_SCHEDULE: CityConfig[] = [
  { name: "Bamako",      appearFrame: T_START },       // present des le debut (capitale Mali)
  { name: "Kidal",       appearFrame: F_KIDAL_ALONE }, // f7279 "Kidal."
  { name: "Gao",         appearFrame: F_GAO },          // f4056 "Gao,"
  { name: "Ménaka",      appearFrame: F_MENAKA_BASE },  // f4082 "Ménaka,"
  { name: "Niamey",      appearFrame: F_NIAMEY_BASE },  // f4112 "Niamey."
  { name: "Djibo",       appearFrame: F_DJIBO_REF },    // f10294 "Djibo,"
  { name: "Ouagadougou", appearFrame: F_BURKINA },      // f1471 "Faso"
  { name: "Tillabéri",   appearFrame: F_ICON_PETRO },   // f11122 avec ressources Niger
];

// micro-wobble papier (signature Atlas)
const paperWobble = (frame: number, seed = 0) =>
  Math.sin((frame + seed) * 0.08) * 0.3;

// ============================================================
// ICONES RESSOURCES geo-ancrees
// ============================================================
type ResourceIcon = {
  id: string;
  kind: "or" | "uranium" | "petrole";
  lon: number;
  lat: number;
  appearFrame: number;
  label: string;
};

const RESOURCE_ICONS: ResourceIcon[] = [
  // or Mali (Bamako)
  { id: "or-mali",  kind: "or",     lon: -8.0,  lat: 12.65, appearFrame: F_ICON_OR,    label: "Or" },
  // or Burkina (Ouagadougou offset leger pour lisibilite)
  { id: "or-bf",    kind: "or",     lon: -0.8,  lat: 12.4,  appearFrame: F_ICON_OR,    label: "Or" },
  // uranium Niger (Agadez) — apparait avec le petrole
  { id: "uranium",  kind: "uranium",lon:  7.99,  lat: 16.97, appearFrame: F_ICON_PETRO, label: "Uranium" },
  // petrole Niger (Agadez region / Diffa region)
  { id: "petrole",  kind: "petrole",lon:  13.0,  lat: 15.3,  appearFrame: F_ICON_PETRO, label: "Pétrole" },
];

// SVG inline pour les icones ressources (top-down, encre parchemin)
const ResourceSVG: React.FC<{ kind: ResourceIcon["kind"]; size?: number }> = ({ kind, size = 40 }) => {
  if (kind === "or") {
    // lingot d'or stylise
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <rect x="7" y="14" width="26" height="14" rx="3" fill="#C99A3A" stroke="#3A2A18" strokeWidth="1.5" />
        <rect x="11" y="10" width="18" height="6" rx="2" fill="#D4A843" stroke="#3A2A18" strokeWidth="1.2" />
        <line x1="14" y1="14" x2="14" y2="28" stroke="#3A2A18" strokeWidth="0.8" opacity="0.4" />
        <line x1="20" y1="14" x2="20" y2="28" stroke="#3A2A18" strokeWidth="0.8" opacity="0.4" />
        <line x1="26" y1="14" x2="26" y2="28" stroke="#3A2A18" strokeWidth="0.8" opacity="0.4" />
      </svg>
    );
  }
  if (kind === "uranium") {
    // cristal hexagonal stylise
    return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <polygon points="20,6 32,13 32,27 20,34 8,27 8,13" fill="#7BB3C4" stroke="#3A2A18" strokeWidth="1.5" />
        <polygon points="20,12 27,16 27,24 20,28 13,24 13,16" fill="#9FCFDF" stroke="#3A2A18" strokeWidth="0.8" />
        <circle cx="20" cy="20" r="4" fill="#D0EAF0" stroke="#3A2A18" strokeWidth="0.8" />
      </svg>
    );
  }
  // petrole : goutte
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path d="M20 8 C20 8 8 22 8 28 A12 12 0 0 0 32 28 C32 22 20 8 20 8Z" fill="#2A2A2A" stroke="#3A2A18" strokeWidth="1.5" />
      <path d="M16 28 A5 5 0 0 1 22 23" stroke="#555" strokeWidth="1.2" fill="none" />
    </svg>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export const SahelWarMapEngine: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() =>
    delayRender("SahelWarMapEngine", { timeoutInMilliseconds: 60000 })
  );
  const [ready, setReady] = useState(false);
  const [cityPx, setCityPx] = useState<{ name: string; x: number; y: number }[]>([]);
  const [vehPx, setVehPx] = useState<{ id: string; x: number; y: number; dx: number; dy: number }[]>([]);
  const [refPx, setRefPx] = useState<{ id: string; x: number; y: number; dx: number; dy: number }[]>([]);
  const [iconPx, setIconPx] = useState<{ id: string; x: number; y: number }[]>([]);
  const [hookPx, setHookPx] = useState<{
    bamako: { x: number; y: number } | null;
    ouaga: { x: number; y: number } | null;
    niamey: { x: number; y: number } | null;
    liptako: { x: number; y: number } | null;
  }>({ bamako: null, ouaga: null, niamey: null, liptako: null });

  // tGlobal : fraction 0..1 sur la duree utile (T_START -> T_END)
  const span = T_END - T_START;
  const local = Math.max(0, Math.min(span, frame - T_START));
  const tGlobal = local / span;

  const { jalon, i: jIndex } = sahelJalonAt(tGlobal);

  // ============================================================
  // INIT MAP
  // ============================================================
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }

    let safety: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      continueRender(handle);
      safety = null;
    }, 45000);

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      // Centre Sahel : entre Mali, Burkina, Niger
      center: [-1.5, 15.5],
      zoom: 4.2,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      projection: { name: "mercator" },
    });
    mapRef.current = map;

    map.on("error", (e) => console.error("[Sahel] error:", e?.error?.message ?? e));

    map.on("style.load", async () => {
      // RESKIN PARCHEMIN (meme traitement que Sudan)
      try {
        const layers = map.getStyle().layers ?? [];
        for (const l of layers) {
          if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
          if (l.id.includes("water") && l.type === "fill") {
            map.setPaintProperty(l.id, "fill-color", SAHEL_COLORS.ocean);
          }
          if (
            l.id === "land" || l.id.includes("landuse") || l.id.includes("landcover") ||
            l.id === "background" || l.id.includes("national-park")
          ) {
            try { map.setPaintProperty(l.id, "background-color", SAHEL_COLORS.land); } catch {}
            try { map.setPaintProperty(l.id, "fill-color", SAHEL_COLORS.land); } catch {}
          }
          if (l.id.includes("admin-0")) {
            map.setPaintProperty(l.id, "line-color", SAHEL_COLORS.outline);
          }
          if (l.id.includes("admin-1")) {
            map.setPaintProperty(l.id, "line-color", "rgba(58,42,24,0.25)");
          }
        }
        if (map.getLayer("background")) {
          map.setPaintProperty("background", "background-color", SAHEL_COLORS.land);
        }
      } catch (e) { console.warn("[Sahel] reskin partial:", e); }

      // Charger sahel-admin1.geojson (32 regions)
      const res = await fetch(staticFile("_shared/geo-data/sahel/sahel-admin1.geojson"));
      const fc = await res.json();
      // Initialiser toutes les regions a ctrl=1 (etat)
      for (const f of fc.features) {
        f.properties.ctrl = 1;
        f.properties.front = 0;
      }
      map.addSource("sahel", { type: "geojson", data: fc });

      // Remplissage data-driven : 0=jnim (rouge), 0.5=conteste (or), 1=etat (bleu)
      map.addLayer({
        id: "sahel-fill",
        type: "fill",
        source: "sahel",
        paint: {
          "fill-color": [
            "interpolate", ["linear"], ["get", "ctrl"],
            0,    SAHEL_COLORS.jnim,
            0.30, SAHEL_COLORS.jnim,
            0.5,  SAHEL_COLORS.contested,
            0.70, SAHEL_COLORS.etat,
            1,    SAHEL_COLORS.etat,
          ],
          "fill-color-transition": { duration: 400, delay: 0 },
          "fill-opacity": 0.82,
        } as any,
      });

      // Glow de front (zones contestees)
      map.addLayer({
        id: "sahel-front-glow",
        type: "line",
        source: "sahel",
        paint: {
          "line-color": SAHEL_COLORS.contested,
          "line-width": ["interpolate", ["linear"], ["get", "front"], 0, 0, 1, 5],
          "line-opacity": ["interpolate", ["linear"], ["get", "front"], 0, 0, 1, 0.9],
          "line-blur": 3,
        },
      });

      // Frontieres inter-regions (attenuees)
      map.addLayer({
        id: "sahel-line",
        type: "line",
        source: "sahel",
        paint: { "line-color": SAHEL_COLORS.outline, "line-width": 0.8, "line-opacity": 0.25 },
      });

      // Contour national epais
      map.addLayer({
        id: "sahel-outline",
        type: "line",
        source: "sahel",
        paint: { "line-color": SAHEL_COLORS.outline, "line-width": 2.6, "line-opacity": 0.9 },
      });

      setReady(true);
      map.once("idle", () => {
        if (safety) { clearTimeout(safety); safety = null; }
        continueRender(handle);
      });
    });

    return () => {
      if (safety) clearTimeout(safety);
      map.remove();
      mapRef.current = null;
    };
  }, [handle]);

  // ============================================================
  // UPDATE PAR FRAME
  // ============================================================
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;

    // Mettre a jour les couleurs de controle
    const src = map.getSource("sahel") as mapboxgl.GeoJSONSource | undefined;
    if (src && (src as any)._data) {
      const data = (src as any)._data;
      for (const f of data.features) {
        const name = f.properties.name as string;
        if (SAHEL_STATES.includes(name)) {
          const c = sahelControlAt(name, tGlobal);
          f.properties.ctrl = c;
          f.properties.front = 1 - 2 * Math.abs(c - 0.5);
        }
      }
      src.setData(data);
    }

    // SCRIPT: caméra hook (Act 1 — 0:00-0:55)
    // Vue globale Sahel stable pendant les 3 éclairs de pays (f0→f502)
    // FIGÉE pendant "Comment est-ce possible?" (f572→f632 = 2s)
    // Drift progressif reprend après f726 "répondre"
    const hookFreeze = frame >= F_HOOK_FREEZE && frame < F_HOOK_FREEZE + 60;
    let camLon: number, camLat: number, camZoom: number;
    if (frame < F_HOOK_FREEZE) {
      // Hook : vue fixe centrée sur le Sahel pour voir les 3 pays s'allumer
      camLon = -1.5;
      camLat = 15.0;
      camZoom = 4.0;
    } else if (hookFreeze) {
      // FIGÉE 2s — carte immobile
      camLon = -1.5;
      camLat = 15.0;
      camZoom = 4.0;
    } else {
      // Drift progressif sur la durée totale
      // Act 1-2 (f632→Act3) : léger pan vers nord-est (zone JNIM)
      // Act 3 : zoom Kidal
      // Act 4-5 : retour global
      const driftStart = F_HOOK_DRIFT;
      const driftProgress = Math.max(0, Math.min(1, (frame - driftStart) / (T_END - driftStart)));
      camLon = interpolate(driftProgress, [0, 0.45, 0.65, 1], [-2.5, 0.5, 1.4, -2.0]);
      camLat = interpolate(driftProgress, [0, 0.45, 0.65, 1], [14.2, 15.8, 18.5, 14.8]);
      camZoom = interpolate(
        frame,
        [driftStart, Math.round(0.45 * span + T_START), Math.round(0.65 * span + T_START), T_END, SAHEL_DURATION],
        [4.1, 4.5, 5.0, 4.4, 4.3],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
    map.jumpTo({ center: [camLon, camLat], zoom: camZoom, pitch: 0, bearing: 0 });

    // Projections pivots hook (capitales + Liptako-Gourma)
    const pBamako  = map.project(BAMAKO_COORD);
    const pOuaga   = map.project(OUAGA_COORD);
    const pNiamey  = map.project(NIAMEY_COORD);
    const pLiptako = map.project(LIPTAKO_CENTER);
    setHookPx({
      bamako:  { x: pBamako.x,  y: pBamako.y  },
      ouaga:   { x: pOuaga.x,   y: pOuaga.y   },
      niamey:  { x: pNiamey.x,  y: pNiamey.y  },
      liptako: { x: pLiptako.x, y: pLiptako.y },
    });

    // Projeter les villes
    const proj = SAHEL_CITIES.map((c) => {
      const p = map.project([c.lon, c.lat]);
      return { name: c.name, x: p.x, y: p.y };
    });
    setCityPx(proj);

    // Projeter les vehicules
    const dt = 0.012;
    const vproj = (SAHEL_VEHICLES as SchemaVehicle[]).map((v) => {
      const [lon, lat] = interpPath(v.path, tGlobal);
      const [lon2, lat2] = interpPath(v.path, Math.max(0, tGlobal - dt));
      const p = map.project([lon, lat]);
      const pPrev = map.project([lon2, lat2]);
      return { id: v.id, x: p.x, y: p.y, dx: p.x - pPrev.x, dy: p.y - pPrev.y };
    });
    setVehPx(vproj);

    // Projeter les refugies
    const rproj = (SAHEL_REFUGEES as SchemaRefugee[]).map((r) => {
      const [lon, lat] = interpPath(r.path, tGlobal);
      const [lon2, lat2] = interpPath(r.path, Math.max(0, tGlobal - dt));
      const p = map.project([lon, lat]);
      const pPrev = map.project([lon2, lat2]);
      return { id: r.id, x: p.x, y: p.y, dx: p.x - pPrev.x, dy: p.y - pPrev.y };
    });
    setRefPx(rproj);

    // Projeter les icones ressources
    const iproj = RESOURCE_ICONS.map((icon) => {
      const p = map.project([icon.lon, icon.lat]);
      return { id: icon.id, x: p.x, y: p.y };
    });
    setIconPx(iproj);

    const h = delayRender(`sahel-frame-${frame}`, { timeoutInMilliseconds: 40000 });
    let done = false;
    const finish = () => { if (!done) { done = true; continueRender(h); } };
    map.once("idle", finish);
    setTimeout(finish, map.areTilesLoaded() ? 300 : 1200);
  }, [frame, ready, tGlobal]);

  // ============================================================
  // LOGIQUE HOOK — ACTE 1 (script-first, tracé phrase par phrase)
  // ============================================================

  // SCRIPT: "Ils ont expulsé leurs partenaires militaires." → Mali blanc (f150)
  const hookMaliOp = interpolate(frame, [F_HOOK_MALI, F_HOOK_MALI + 12, F_HOOK_MALI + 90, F_HOOK_MALI + 120], [0, 0.85, 0.85, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // SCRIPT: "Rompu leurs alliances historiques." → Burkina blanc (f231)
  const hookBurkinaOp = interpolate(frame, [F_HOOK_BURKINA, F_HOOK_BURKINA + 12, F_HOOK_BURKINA + 90, F_HOOK_BURKINA + 120], [0, 0.85, 0.85, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // SCRIPT: "Quitté la principale organisation régionale du continent." → Niger blanc (f301)
  const hookNigerOp = interpolate(frame, [F_HOOK_NIGER, F_HOOK_NIGER + 12, F_HOOK_NIGER + 90, F_HOOK_NIGER + 120], [0, 0.85, 0.85, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // SCRIPT: "continent." → anneau CEDEAO clignote orange puis s'éteint (f382)
  const cedeaoOp = (() => {
    if (frame < F_HOOK_CEDEAO) return 0;
    if (frame > F_HOOK_CEDEAO + 90) return 0;
    // clignote 3 fois sur 90 frames puis s'éteint
    const local = frame - F_HOOK_CEDEAO;
    const blink = Math.sin(local * Math.PI * 3 / 45); // 3 cycles sur 90 frames
    return Math.max(0, blink) * 0.75;
  })();

  // SCRIPT: "quelque chose de nouveau." → vecteurs capitales convergent + Liptako pulse or (f502)
  const liptakoProgress = interpolate(frame, [F_HOOK_LIPTAKO, F_HOOK_LIPTAKO + 45], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const liptakoPulse = (() => {
    if (frame < F_HOOK_LIPTAKO) return 0;
    if (frame > F_HOOK_FREEZE + 120) return 0;
    const localF = frame - F_HOOK_LIPTAKO;
    // pulse régulier tant que la carte est figée, puis disparaît
    const pulse = 0.65 + 0.35 * Math.sin(localF * 0.18);
    if (frame > F_HOOK_FREEZE + 60) {
      return pulse * interpolate(frame, [F_HOOK_FREEZE + 60, F_HOOK_FREEZE + 120], [1, 0], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    return pulse;
  })();

  // SCRIPT: "Comment est-ce possible ?" → FIGÉE 2s (f572 = 19.08s)
  const hookFreezeActive = frame >= F_HOOK_FREEZE && frame < F_HOOK_FREEZE + 60;

  // ============================================================
  // OPACITES HUD
  // ============================================================
  const hudOp = interpolate(frame, [T_START - 2, T_START + 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const introOp = interpolate(frame, [0, 8, T_START - 8, T_START + 4], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const outroOp = interpolate(frame, [SAHEL_DURATION - 24, SAHEL_DURATION], [0, 0.5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // CTA final
  const CTA_START = 13200;
  const CTA_HOLD = 180;

  // Plaque parchemin reutilisable
  const plaque: React.CSSProperties = {
    background: SAHEL_COLORS.cream,
    border: `2px solid ${SAHEL_COLORS.ink}`,
    borderRadius: 6,
    color: SAHEL_COLORS.ink,
    boxShadow: "0 4px 18px rgba(0,0,0,0.28)",
  };

  // ============================================================
  // LOGIQUE KIDAL (s'allume en or a F_KIDAL_ALONE, reste bleu a F_KIDAL_FLAG)
  // Cela se fait via le controle territorial (deja dans le JSON),
  // mais on peut aussi ajouter un highlight visuel supplementaire
  // ============================================================
  const kidalHighlightOp = (() => {
    if (frame < F_KIDAL_ALONE) return 0;
    if (frame < F_KIDAL_FLAG) {
      // pulse or sur Kidal
      return interpolate(frame, [F_KIDAL_ALONE, F_KIDAL_ALONE + 20], [0, 1], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    // apres flag malien, le pulse s'eteint (la couleur carte prend le relais)
    return interpolate(frame, [F_KIDAL_FLAG, F_KIDAL_FLAG + 30], [1, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  })();

  // ============================================================
  // OVERLAY AES NEE (frame ~7014)
  // ============================================================
  const aesOverlayOp = (() => {
    if (frame < F_AES_NEE) return 0;
    const fadeIn = interpolate(frame, [F_AES_NEE, F_AES_NEE + 18], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const fadeOut = interpolate(frame, [F_AES_NEE + 240, F_AES_NEE + 300], [1, 0], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    return Math.min(fadeIn, fadeOut);
  })();

  return (
    <AbsoluteFill style={{ backgroundColor: SAHEL_COLORS.ocean, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <MapboxBrandingHide />

      {/* Narration principale */}
      <Audio src={staticFile("_shared/audio/sahel-warmap/narration-v1.mp3")} />

      {/* Filtre papier sepia */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="paperSahel">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 0 0.78  0 0 0 0.04 0" />
        </filter>
      </svg>

      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* Grain papier */}
      <AbsoluteFill style={{ filter: "url(#paperSahel)", opacity: 0.25, pointerEvents: "none", mixBlendMode: "multiply" }} />

      {/* Vignette parchemin */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 62%, rgba(40,28,16,0.22) 100%)",
        }}
      />

      {/* ======================================================
          HOOK ACTE 1 — Pays qui s'allument + Liptako pulse
          Chaque événement tracé depuis le script V4 phrase par phrase
          ====================================================== */}

      {/* SCRIPT: "Ils ont expulsé" → Mali flash blanc (f150) */}
      {hookMaliOp > 0 && (
        <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
          {/* Flash blanc sur le Mali — overlay centré sur Bamako */}
          <div style={{
            position: "absolute",
            left: hookPx.bamako ? hookPx.bamako.x - 160 : "20%",
            top: hookPx.bamako ? hookPx.bamako.y - 120 : "55%",
            width: 320, height: 240,
            background: "radial-gradient(ellipse, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 70%)",
            opacity: hookMaliOp,
            borderRadius: "50%",
          }} />
        </AbsoluteFill>
      )}

      {/* SCRIPT: "Rompu leurs alliances" → Burkina flash blanc (f231) */}
      {hookBurkinaOp > 0 && (
        <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
          <div style={{
            position: "absolute",
            left: hookPx.ouaga ? hookPx.ouaga.x - 140 : "47%",
            top: hookPx.ouaga ? hookPx.ouaga.y - 110 : "58%",
            width: 280, height: 220,
            background: "radial-gradient(ellipse, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 70%)",
            opacity: hookBurkinaOp,
            borderRadius: "50%",
          }} />
        </AbsoluteFill>
      )}

      {/* SCRIPT: "Quitté la principale organisation" → Niger flash blanc (f301) */}
      {hookNigerOp > 0 && (
        <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
          <div style={{
            position: "absolute",
            left: hookPx.niamey ? hookPx.niamey.x - 130 : "60%",
            top: hookPx.niamey ? hookPx.niamey.y - 110 : "52%",
            width: 260, height: 210,
            background: "radial-gradient(ellipse, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 70%)",
            opacity: hookNigerOp,
            borderRadius: "50%",
          }} />
        </AbsoluteFill>
      )}

      {/* SCRIPT: "continent." → anneau CEDEAO clignote orange (f382) */}
      {cedeaoOp > 0 && ready && hookPx.niamey && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          {/* Cercle englobant les 3 pays — centré sur Liptako */}
          <div style={{
            position: "absolute",
            left: hookPx.liptako ? hookPx.liptako.x - 310 : "38%",
            top: hookPx.liptako ? hookPx.liptako.y - 220 : "35%",
            width: 620, height: 440,
            border: `4px solid rgba(255,140,0,${cedeaoOp})`,
            borderRadius: "50%",
            boxShadow: `0 0 18px 4px rgba(255,140,0,${cedeaoOp * 0.45})`,
          }} />
          <div style={{
            position: "absolute",
            left: hookPx.liptako ? hookPx.liptako.x - 68 : "46%",
            top: hookPx.liptako ? hookPx.liptako.y - 270 : "28%",
            fontSize: 14, fontWeight: 700, letterSpacing: 3,
            color: `rgba(255,140,0,${cedeaoOp})`,
            textTransform: "uppercase" as const,
          }}>CEDEAO</div>
        </AbsoluteFill>
      )}

      {/* SCRIPT: "quelque chose de nouveau." → 3 vecteurs capitales → Liptako + pulse or (f502) */}
      {liptakoProgress > 0 && ready && hookPx.liptako && hookPx.bamako && hookPx.ouaga && hookPx.niamey && (
        <AbsoluteFill style={{ pointerEvents: "none" }}>
          <svg style={{ position: "absolute", width: "100%", height: "100%", overflow: "visible" }}>
            {/* Vecteur Bamako → Liptako */}
            <line
              x1={hookPx.bamako.x} y1={hookPx.bamako.y}
              x2={hookPx.bamako.x + (hookPx.liptako.x - hookPx.bamako.x) * liptakoProgress}
              y2={hookPx.bamako.y + (hookPx.liptako.y - hookPx.bamako.y) * liptakoProgress}
              stroke={SAHEL_COLORS.contested} strokeWidth="2.5"
              strokeDasharray="6 4" opacity="0.85"
            />
            {/* Vecteur Ouagadougou → Liptako */}
            <line
              x1={hookPx.ouaga.x} y1={hookPx.ouaga.y}
              x2={hookPx.ouaga.x + (hookPx.liptako.x - hookPx.ouaga.x) * liptakoProgress}
              y2={hookPx.ouaga.y + (hookPx.liptako.y - hookPx.ouaga.y) * liptakoProgress}
              stroke={SAHEL_COLORS.contested} strokeWidth="2.5"
              strokeDasharray="6 4" opacity="0.85"
            />
            {/* Vecteur Niamey → Liptako */}
            <line
              x1={hookPx.niamey.x} y1={hookPx.niamey.y}
              x2={hookPx.niamey.x + (hookPx.liptako.x - hookPx.niamey.x) * liptakoProgress}
              y2={hookPx.niamey.y + (hookPx.liptako.y - hookPx.niamey.y) * liptakoProgress}
              stroke={SAHEL_COLORS.contested} strokeWidth="2.5"
              strokeDasharray="6 4" opacity="0.85"
            />
          </svg>
          {/* Pulse or Liptako-Gourma */}
          {liptakoPulse > 0 && (
            <div style={{
              position: "absolute",
              left: hookPx.liptako.x - 55,
              top: hookPx.liptako.y - 55,
              width: 110, height: 110,
              background: `radial-gradient(circle, rgba(201,154,58,${liptakoPulse * 0.8}) 0%, rgba(201,154,58,0) 70%)`,
              borderRadius: "50%",
            }} />
          )}
        </AbsoluteFill>
      )}

      {/* SCRIPT: "Comment est-ce possible ?" → carton figé sur la carte (f572, 2s) */}
      {hookFreezeActive && (
        <div style={{
          position: "absolute", bottom: 140, left: 0, right: 0,
          textAlign: "center", pointerEvents: "none",
          opacity: interpolate(frame, [F_HOOK_FREEZE, F_HOOK_FREEZE + 8, F_HOOK_FREEZE + 52, F_HOOK_FREEZE + 60], [0, 1, 1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
        }}>
          <div style={{
            display: "inline-block",
            background: `rgba(245,239,214,0.92)`,
            border: `2px solid ${SAHEL_COLORS.ink}`,
            borderRadius: 6, padding: "14px 32px",
            color: SAHEL_COLORS.ink,
            fontSize: 32, fontWeight: 700,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            letterSpacing: 0.5,
            boxShadow: "0 4px 18px rgba(0,0,0,0.28)",
          }}>
            Comment est-ce possible ?
          </div>
        </div>
      )}

      {/* ======================================================
          VEHICULES (JNIM/EIGS rouge, FAMa bleu, CSP or)
          ====================================================== */}
      {ready &&
        (SAHEL_VEHICLES as SchemaVehicle[]).map((v) => {
          const pos = vehPx.find((p) => p.id === v.id);
          if (!pos) return null;
          // Apparition liee a l'audio : JNIM/EIGS des F_JNIM_ZONE, FAMa des F_KIDAL_ALONE, CSP des F_KIDAL_FLAG
          const fId = v.faction as string;
          const audioTrigger =
            fId === "jnim" || fId === "conteste" && v.id === "eigs-1" ? F_JNIM_ZONE :
            fId === "etat" ? F_KIDAL_ALONE :
            fId === "conteste" ? F_KIDAL_FLAG :
            F_JNIM_ZONE;
          const appear = audioTrigger + (v.delay ?? 0);
          const pop = interpolate(frame, [appear, appear + 20], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 0.9, 0.3, 1),
          });
          if (pop <= 0) return null;
          const mag = Math.hypot(pos.dx, pos.dy);
          const moving = mag > 0.1;
          const ang = Math.atan2(pos.dy, pos.dx);
          const headingDeg = moving ? (ang * 180) / Math.PI + 90 : 0;
          const trailLen = Math.min(38, mag * 6 + 8);
          // couleur de la trainee selon faction
          const factionId = v.faction as string;
          const col =
            factionId === "jnim" ? SAHEL_COLORS.jnim :
            factionId === "etat" ? SAHEL_COLORS.etat :
            SAHEL_COLORS.contested;
          // 16:9 = carte plus grande a l'ecran -> sprites x2.5 vs Sudan vertical
          const vSize = v.size * 2.5;
          return (
            <div key={v.id} style={{ position: "absolute", left: pos.x, top: pos.y,
                transform: `translate(-50%, -50%) scale(${pop})`, opacity: pop, pointerEvents: "none" }}>
              {moving && (
                <div style={{ position: "absolute", left: 0, top: 0, width: trailLen, height: 6,
                  transform: `translate(-100%, -50%) rotate(${(ang * 180) / Math.PI}deg)`,
                  transformOrigin: "100% 50%",
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${col})`,
                  borderRadius: 4, opacity: 0.45 }} />
              )}
              {/* ombre portee */}
              <div style={{ position: "absolute", left: "50%", top: "54%", width: vSize * 0.7, height: vSize * 0.28,
                transform: "translate(-50%,-50%)", background: "rgba(26,18,9,0.22)", borderRadius: "50%", filter: "blur(3px)" }} />
              <img
                src={staticFile(`_shared/sprites/warmap/${v.sprite}.png`)}
                style={{ width: vSize, height: vSize, objectFit: "contain", display: "block",
                  transform: `rotate(${headingDeg}deg)`,
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
              />
            </div>
          );
        })}

      {/* ======================================================
          REFUGIES — jetons-visage geo-ancres (Djibo/Menaka/Tillaberi)
          Chaque jeton a son propre trigger frame audio
          ====================================================== */}
      {ready &&
        (SAHEL_REFUGEES as SchemaRefugee[]).map((r) => {
          const pos = refPx.find((p) => p.id === r.id);
          if (!pos) return null;
          // trigger frame specifique selon le jeton
          const triggerFrame =
            r.id === "ref-djibo"    ? F_REF_DJIBO :
            r.id === "ref-menaka"   ? F_REF_MENAKA :
            F_REF_TILLABERI;
          if (frame < triggerFrame) return null;
          const pop = interpolate(frame, [triggerFrame, triggerFrame + 18], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          if (pop <= 0) return null;
          const mag = Math.hypot(pos.dx, pos.dy);
          const ang = Math.atan2(pos.dy, pos.dx);
          const d = r.size;
          return (
            <div key={r.id} style={{ position: "absolute", left: pos.x, top: pos.y,
                transform: `translate(-50%, -50%) scale(${pop})`, opacity: pop, pointerEvents: "none" }}>
              {/* trainee de deplacement */}
              {mag > 0.1 && (
                <div style={{ position: "absolute", left: 0, top: 0, width: Math.min(30, mag * 6 + 6), height: 5,
                  transform: `translate(-100%, -50%) rotate(${(ang * 180) / Math.PI}deg)`, transformOrigin: "100% 50%",
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${SAHEL_COLORS.ink})`,
                  borderRadius: 4, opacity: 0.28 }} />
              )}
              {/* jeton-visage */}
              <div style={{ width: d, height: d, borderRadius: "50%", background: SAHEL_COLORS.cream,
                border: `3px solid ${SAHEL_COLORS.ink}`,
                boxShadow: `0 2px 7px rgba(0,0,0,0.38), 0 0 0 2px ${SAHEL_COLORS.cream}`,
                overflow: "hidden", position: "relative" }}>
                <img
                  src={staticFile("_shared/sprites/warmap/portrait-civil.png")}
                  style={{ width: "122%", height: "122%", objectFit: "cover",
                    objectPosition: "50% 14%", position: "absolute", left: "-11%", top: "-6%" }}
                />
              </div>
            </div>
          );
        })}

      {/* ======================================================
          ICONES RESSOURCES geo-ancrees
          ====================================================== */}
      {ready &&
        RESOURCE_ICONS.map((icon) => {
          if (frame < icon.appearFrame) return null;
          const pos = iconPx.find((p) => p.id === icon.id);
          if (!pos) return null;
          const pop = interpolate(frame, [icon.appearFrame, icon.appearFrame + 20], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 0.9, 0.3, 1),
          });
          return (
            <div key={icon.id} style={{ position: "absolute", left: pos.x, top: pos.y,
                transform: `translate(-50%, -50%) scale(${pop})`, opacity: pop, pointerEvents: "none" }}>
              {/* ombre */}
              <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)",
                width: 36, height: 8, background: "rgba(26,18,9,0.2)", borderRadius: "50%", filter: "blur(3px)" }} />
              {/* icone */}
              <div style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))" }}>
                <ResourceSVG kind={icon.kind} size={44} />
              </div>
              {/* label */}
              <div style={{ ...plaque, marginTop: 4, padding: "2px 8px", fontSize: 13, fontWeight: 700,
                textAlign: "center", letterSpacing: 0.8, whiteSpace: "nowrap", borderWidth: 1 }}>
                {icon.label}
              </div>
            </div>
          );
        })}

      {/* ======================================================
          VILLES — apparition progressive liee a l'audio
          Chaque ville pop exactement quand la narration la cite.
          ====================================================== */}
      {ready &&
        CITY_SCHEDULE.map(({ name, appearFrame }) => {
          const cityPos = cityPx.find((c) => c.name === name);
          if (!cityPos) return null;
          if (frame < appearFrame) return null;
          const cityOp = interpolate(frame, [appearFrame, appearFrame + 18], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }) * hudOp;
          if (cityOp <= 0) return null;
          return (
            <div key={name} style={{ position: "absolute", left: cityPos.x, top: cityPos.y,
                transform: `translate(-50%, -50%) rotate(${paperWobble(frame, name.length * 7)}deg)`,
                opacity: cityOp, pointerEvents: "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: SAHEL_COLORS.ink,
                margin: "0 auto", border: `2px solid ${SAHEL_COLORS.cream}` }} />
              <div style={{ ...plaque, marginTop: 4, padding: "3px 10px", fontSize: 16, fontWeight: 700,
                letterSpacing: 1.1, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {name}
              </div>
            </div>
          );
        })}

      {/* ======================================================
          HUD PRINCIPAL — legende + date + evenement
          ====================================================== */}
      {/* Legende factions — haut gauche */}
      <div style={{ position: "absolute", top: 40, left: 44, opacity: hudOp,
          transform: `rotate(${paperWobble(frame, 3)}deg)` }}>
        <div style={{ ...plaque, padding: "12px 20px" }}>
          <div style={{ fontSize: 13, letterSpacing: 3, opacity: 0.65, fontWeight: 700,
            textTransform: "uppercase", marginBottom: 10 }}>Contrôle territorial</div>
          <FactionLegend color={SAHEL_COLORS.etat}      label="Forces gouvernementales" />
          <FactionLegend color={SAHEL_COLORS.contested}  label="Contesté / CSP" />
          <FactionLegend color={SAHEL_COLORS.jnim}      label="JNIM / EIGS" />
        </div>
      </div>

      {/* Date + jalon — haut droite */}
      <div style={{ position: "absolute", top: 40, right: 46, opacity: hudOp,
          transform: `rotate(${paperWobble(frame, 11)}deg)` }}>
        <div style={{ ...plaque, padding: "12px 22px", textAlign: "right" }}>
          <div style={{ fontSize: 42, fontWeight: 800, fontVariantNumeric: "tabular-nums",
            letterSpacing: 1, fontFamily: "Georgia, serif" }}>
            {jalon.date.replace(/\./g, "·")}
          </div>
        </div>
      </div>

      {/* Evenement bas */}
      <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, textAlign: "center",
          opacity: hudOp, padding: "0 80px" }}>
        <div style={{ ...plaque, display: "inline-block", padding: "12px 28px", fontSize: 26,
          fontWeight: 600, letterSpacing: 0.3, maxWidth: 960 }}>
          {jalon.label}
        </div>
      </div>

      {/* Source bas droite */}
      <div style={{ position: "absolute", bottom: 20, right: 30, fontSize: 12,
          color: SAHEL_COLORS.cream, opacity: hudOp * 0.65 }}>
        Données estimées · Sources : Wikipedia, ONU, HRW, UNHCR
      </div>

      {/* ======================================================
          OVERLAY AES NEE (frame ~7014)
          ====================================================== */}
      {aesOverlayOp > 0 && (
        <div style={{ position: "absolute", right: 60, top: "40%", transform: "translateY(-50%)",
            opacity: aesOverlayOp, pointerEvents: "none" }}>
          <div style={{ ...plaque, padding: "18px 28px", textAlign: "center", maxWidth: 320,
              borderColor: SAHEL_COLORS.contested, borderWidth: 2 }}>
            <div style={{ fontSize: 14, letterSpacing: 4, fontWeight: 700,
              textTransform: "uppercase", opacity: 0.65, marginBottom: 6 }}>
              16 septembre 2023
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: SAHEL_COLORS.contested, lineHeight: 1.1 }}>
              Alliance des États<br />du Sahel
            </div>
            <div style={{ fontSize: 16, marginTop: 8, opacity: 0.75, fontWeight: 500 }}>
              Charte du Liptako-Gourma
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          CARTON TITRE INTRO
          ====================================================== */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center",
          opacity: introOp, pointerEvents: "none" }}>
        <div style={{ ...plaque, textAlign: "center", padding: "34px 60px",
            transform: `rotate(${paperWobble(frame, 1)}deg)` }}>
          <div style={{ fontSize: 20, letterSpacing: 8, opacity: 0.70, fontWeight: 700,
            textTransform: "uppercase" }}>Sahel</div>
          <div style={{ fontSize: 64, fontWeight: 800, marginTop: 8,
            fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1.08 }}>
            Tout a changé en trois ans
          </div>
          <div style={{ fontSize: 22, opacity: 0.75, marginTop: 10, fontWeight: 600 }}>
            2020 — 2026
          </div>
        </div>
      </AbsoluteFill>

      {/* Fade out final */}
      <AbsoluteFill style={{ background: "#1A1209", opacity: outroOp, pointerEvents: "none" }} />

      {/* ======================================================
          CTA FINAL (apres la narration, ~13200->13380)
          ====================================================== */}
      {(() => {
        const local = frame - CTA_START;
        if (local < 0 || local > CTA_HOLD) return null;
        const op = Math.min(
          interpolate(local, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          interpolate(local, [CTA_HOLD - 14, CTA_HOLD], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        );
        return (
          <AbsoluteFill style={{ opacity: op, justifyContent: "center", alignItems: "center",
              fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            <div style={{ background: `${SAHEL_COLORS.cream}D0`, border: `2px solid ${SAHEL_COLORS.ink}`,
                borderRadius: 10, padding: "22px 40px", textAlign: "center",
                color: SAHEL_COLORS.ink, maxWidth: 820, boxShadow: "0 8px 30px rgba(0,0,0,0.25)" }}>
              <div style={{ fontSize: 16, letterSpacing: 4, fontWeight: 700,
                textTransform: "uppercase", opacity: 0.55, marginBottom: 10 }}>
                Analyse complète
              </div>
              <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.3 }}>
                Le Sahel et l'Alliance des États
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, opacity: 0.75, marginTop: 4 }}>
                sur la chaîne
              </div>
              <div style={{ marginTop: 14, fontSize: 20, fontWeight: 700, letterSpacing: 2, opacity: 0.65 }}>
                @koraetcartes
              </div>
            </div>
          </AbsoluteFill>
        );
      })()}
    </AbsoluteFill>
  );
};

const FactionLegend: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
    <div style={{ width: 16, height: 16, borderRadius: 3, background: color,
      border: "1.5px solid rgba(26,18,9,0.5)", flexShrink: 0 }} />
    <span style={{ fontSize: 15, fontWeight: 600, color: SAHEL_COLORS.ink }}>{label}</span>
  </div>
);
