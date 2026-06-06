/**
 * WarMapEngine — variante FLAT TOP-DOWN PARCHEMIN (style Mansa Moussa / Ghana).
 *
 * Decision Aziz 2026-06-05 : le satellite 3D incline se bat contre la donnee.
 * Flat top-down parchemin = le fond se tait, la donnee parle + plan carte = plan
 * sprite (prepare la couche vehicules top-down de l'Etape B).
 *
 * Confirme par ATLAS-PLAYBOOK : "Atlas profite PLUS de Map Animation... friction
 * de projection nulle (vs pitch 3D qui rend les sprites top-view faux)".
 *
 * Cette version = ETAPE A : carte seule, zero sprite. Valide le skin.
 * Moteur : Mapbox light-v11 reskinne parchemin, pitch 0. (La version production
 * basculerait sur d3-geo pur, socle Atlas — mais on reutilise ici le code
 * polygones data-driven deja ecrit.)
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
  SUDAN_STATES,
  CITIES,
  ATLAS,
  JALONS,
  controlAt,
  jalonAt,
} from "./sudanControlData";
import { VEHICLES, vehiclePos, REFUGEES, refugeePos } from "./warmapVehicles";
import { WarMapDataOverlay } from "./WarMapDataOverlay";
import { WarMapOverlayExplicatif } from "../_shared/WarMapOverlayExplicatif";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const SUDAN_FPS = 30;
export const SUDAN_FLAT_DURATION = 20 * SUDAN_FPS + 60; // 660
export const SUDAN_OVERLAY_DURATION = SUDAN_FLAT_DURATION + 300; // +10s freeze overlay

const T_START = Math.round(1.6 * SUDAN_FPS);
const T_END = SUDAN_FLAT_DURATION - Math.round(2.2 * SUDAN_FPS);

// ===========================================================================
// MODE EPIC — culmination 60s combinant tout le stack (Aziz, test ultime).
// Timeline = carte qui avance + 3 fenetres "freeze" (overlay deplaces, figure
// civile, overlay famine). La carte gele pendant chaque fenetre puis reprend.
// ===========================================================================
export const SUDAN_EPIC_DURATION = 60 * SUDAN_FPS; // 1800 frames = 60s
// fenetres de pause (start, hold, type). start = frame absolu dans le 60s.
type EpicWindow = { start: number; hold: number; kind: "overlay" | "figure" | "explicatif"; data: any };
// 2 freezes :
// 1. ~24s : overlay EXPLICATIF "L'exode" + portrait civil (fige l'action, centre,
//    introduit le visage avant qu'il apparaisse sur la carte comme jeton-refugie).
// 2. ~50s : overlay DONNEE famine 25M (sans equivalent carto -> plein ecran justifie).
export const EPIC_WINDOWS: EpicWindow[] = [
  {
    start: 24 * SUDAN_FPS, hold: 8 * SUDAN_FPS, kind: "explicatif",
    data: { title: "L'exode", text: "Des millions fuient vers les frontières", portrait: "portrait-civil",
            source: "Source : OCHA / HCR Soudan 2023" },
  },
  { start: 50 * SUDAN_FPS, hold: 7 * SUDAN_FPS, kind: "overlay", data: { variant: "famine" } },
];
// REFUGEE_TEXT conserve pour compatibilite (inutilise desormais : l'action explicatif
// est maintenant geree via EPIC_WINDOWS avec freeze)
const REFUGEE_TEXT_START = 999999; // desactive
const REFUGEE_TEXT_HOLD = 0;
const EPIC_FREEZE_TOTAL = EPIC_WINDOWS.reduce((a, w) => a + w.hold, 0);
// duree "carte qui bouge" = 60s - somme des freezes. La carte progresse 0->1 sur ce span.
const EPIC_MAP_SPAN = SUDAN_EPIC_DURATION - EPIC_FREEZE_TOTAL;
const EPIC_T_START = Math.round(1.6 * SUDAN_FPS);
const EPIC_T_END = EPIC_MAP_SPAN - Math.round(2.0 * SUDAN_FPS);

// frame "carte" effectif en mode epic : on retire le temps gele cumule.
const epicMapFrame = (frame: number): number => {
  let f = frame;
  for (const w of EPIC_WINDOWS) {
    if (frame >= w.start + w.hold) f -= w.hold;           // fenetre entierement passee
    else if (frame >= w.start) return w.start - cumulFreezeBefore(w);  // dans la fenetre : gele
  }
  return f;
};
const cumulFreezeBefore = (win: EpicWindow): number => {
  let s = 0;
  for (const w of EPIC_WINDOWS) { if (w === win) break; s += w.hold; }
  return s;
};

const lerpHex = (a: string, b: string, t: number) => {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

// micro-wobble papier permanent (signature Atlas)
const paperWobble = (frame: number, seed = 0) =>
  Math.sin((frame + seed) * 0.08) * 0.4;

export type WarMapEngineProps = {
  // "vehicle" = sprites char/technical (defaut) ; "token" = jetons ronds portraits
  unitStyle?: "vehicle" | "token";
  // si true : a l'apogee RSF, la carte se FIGE + overlay data premium ~10s
  withOverlay?: boolean;
  // si true : mode CULMINATION 60s (acte1 + overlays + figure + acte2 + climax)
  epic?: boolean;
};

// fenetre overlay (si withOverlay) : debut + duree (frames @30fps)
const OVERLAY_START = 230;
const OVERLAY_HOLD = 300; // ~10s

export const WarMapEngine: React.FC<WarMapEngineProps> = ({ unitStyle = "vehicle", withOverlay = false, epic = false }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  // PORTRAIT auto-detecte (9:16) -> camera + boxing HUD adaptes. Meme source.
  const portrait = height > width;
  // bornes timeline carte selon mode
  const tStart = epic ? EPIC_T_START : T_START;
  const tEnd = epic ? EPIC_T_END : T_END;
  // FREEZE : le temps de la carte se fige pendant chaque fenetre overlay/figure.
  const effFrame = epic
    ? epicMapFrame(frame)
    : !withOverlay
      ? frame
      : frame < OVERLAY_START
        ? frame
        : frame < OVERLAY_START + OVERLAY_HOLD
          ? OVERLAY_START
          : frame - OVERLAY_HOLD;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() =>
    delayRender("WarMapEngine", { timeoutInMilliseconds: 60000 })
  );
  const [ready, setReady] = useState(false);
  const [cityPx, setCityPx] = useState<{ name: string; x: number; y: number }[]>([]);
  const [vehPx, setVehPx] = useState<{ id: string; x: number; y: number; dx: number; dy: number }[]>([]);
  const [refPx, setRefPx] = useState<{ id: string; x: number; y: number; dx: number; dy: number }[]>([]);

  // AMELIORATION 1 — ralentissement narratif par jalon (dwell + ease).
  // Au lieu d'un defilement lineaire, on DWELL sur chaque jalon (le bandeau a le
  // temps de se lire) puis on EASE-IN-OUT vers le suivant. Le segment 2025
  // (contre-attaque, jalon 3->4) recoit un dwell + une duree plus longs pour
  // laisser voir les chars bleus repousser les pick-ups rouges.
  const N = JALONS.length; // 6 jalons -> 5 transitions
  // poids de duree par transition (relatif). Plus = plus lent/long.
  const segWeights = [1.0, 1.15, 1.1, 1.7, 1.25]; // [0->1,1->2,2->3,3->4,4->5]
  const dwellFrac = 0.32; // part de chaque segment passee en pause sur le jalon de depart
  const tGlobal = (() => {
    const totalW = segWeights.reduce((a, b) => a + b, 0);
    const span = tEnd - tStart;
    const local = Math.max(0, Math.min(span, effFrame - tStart));
    // position en "unites de poids" le long de la timeline
    let acc = 0;
    for (let s = 0; s < N - 1; s++) {
      const segFrames = (segWeights[s] / totalW) * span;
      if (local <= acc + segFrames || s === N - 2) {
        const within = Math.max(0, Math.min(1, (local - acc) / segFrames));
        // dwell : reste sur le jalon s pendant dwellFrac, puis ease vers s+1
        let move = 0;
        if (within > dwellFrac) {
          const m = (within - dwellFrac) / (1 - dwellFrac);
          // ease-in-out cubique
          move = m < 0.5 ? 4 * m * m * m : 1 - Math.pow(-2 * m + 2, 3) / 2;
        }
        return (s + move) / (N - 1);
      }
      acc += segFrames;
    }
    return 1;
  })();

  const { jalon, i: jIndex, f: jFrac } = jalonAt(tGlobal);

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
      center: [30.2, 15.45],
      zoom: 4.7,
      pitch: 0,        // TOP-DOWN PUR
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      projection: { name: "mercator" },
    });
    mapRef.current = map;

    map.on("error", (e) => console.error("[Flat] error:", e?.error?.message ?? e));

    map.on("style.load", async () => {
      // RESKIN PARCHEMIN : on neutralise light-v11 -> cream + ocean sourd
      try {
        const layers = map.getStyle().layers ?? [];
        for (const l of layers) {
          if (l.type === "symbol") map.setLayoutProperty(l.id, "visibility", "none");
          // eau
          if (l.id.includes("water")) {
            if (l.type === "fill") map.setPaintProperty(l.id, "fill-color", ATLAS.ocean);
          }
          // terres / landuse / fond -> cream
          if (
            l.id === "land" || l.id.includes("landuse") || l.id.includes("landcover") ||
            l.id === "background" || l.id.includes("national-park")
          ) {
            try { map.setPaintProperty(l.id, "background-color", ATLAS.land); } catch {}
            try { map.setPaintProperty(l.id, "fill-color", ATLAS.land); } catch {}
          }
          // frontieres admin pays -> encre
          if (l.id.includes("admin-0")) {
            map.setPaintProperty(l.id, "line-color", ATLAS.outline);
          }
          if (l.id.includes("admin-1")) {
            map.setPaintProperty(l.id, "line-color", "rgba(58,42,24,0.25)");
          }
        }
        if (map.getLayer("background")) {
          map.setPaintProperty("background", "background-color", ATLAS.land);
        }
      } catch (e) { console.warn("[Flat] reskin partial:", e); }

      const res = await fetch(staticFile("_shared/geo-data/sudan/sudan-states.geojson"));
      const fc = await res.json();
      for (const f of fc.features) f.properties.ctrl = 1;
      map.addSource("sudan", { type: "geojson", data: fc });

      // remplissage data-driven (parchemin : couleurs faction sourdes, opacite plus haute)
      map.addLayer({
        id: "sudan-fill",
        type: "fill",
        source: "sudan",
        paint: {
          // AMELIORATION 2 — fondu DOUX : on elargit la zone or pour un crossfade
          // progressif rouge->or->bleu (evite la cassure brutale). + transition
          // Mapbox 400ms sur la couleur pour lisser tout saut residuel.
          "fill-color": [
            "interpolate", ["linear"], ["get", "ctrl"],
            0,    ATLAS.rsf,
            0.30, ATLAS.rsf,
            0.5,  ATLAS.contested,
            0.70, ATLAS.saf,
            1,    ATLAS.saf,
          ],
          "fill-color-transition": { duration: 400, delay: 0 },
          "fill-opacity": 0.8,
        } as any,
      });

      // GLOW DE FRONT : surligne les etats EN BASCULE (ctrl proche de 0.5).
      // "front" = property 0..1 calculee par frame = 1 - 2*|ctrl-0.5|.
      map.addLayer({
        id: "sudan-front-glow",
        type: "line",
        source: "sudan",
        paint: {
          "line-color": "#E8B84B",
          "line-width": ["interpolate", ["linear"], ["get", "front"], 0, 0, 1, 5],
          "line-opacity": ["interpolate", ["linear"], ["get", "front"], 0, 0, 1, 0.9],
          "line-blur": 3,
        },
      });

      // frontieres etats — encre fine, ATTENUEE entre etats de meme camp
      // (line-opacity baisse quand les 2 cotes partagent le controle -> moins mosaique)
      map.addLayer({
        id: "sudan-line",
        type: "line",
        source: "sudan",
        paint: { "line-color": ATLAS.outline, "line-width": 0.8, "line-opacity": 0.28 },
      });
      // contour national epais encre (signature parchemin)
      map.addLayer({
        id: "sudan-outline",
        type: "line",
        source: "sudan",
        paint: { "line-color": ATLAS.outline, "line-width": 2.4, "line-opacity": 0.85 },
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

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;

    const src = map.getSource("sudan") as mapboxgl.GeoJSONSource | undefined;
    if (src && (src as any)._data) {
      const data = (src as any)._data;
      for (const f of data.features) {
        const name = f.properties.name as string;
        if (SUDAN_STATES.includes(name as any)) {
          const c = controlAt(name, tGlobal);
          f.properties.ctrl = c;
          // intensite de front : 1 quand conteste (0.5), 0 quand acquis (0 ou 1)
          f.properties.front = 1 - 2 * Math.abs(c - 0.5);
        }
      }
      src.setData(data);
    }

    // camera : drift TOP-DOWN doux (pas de pitch) — leger pan ouest + zoom subtil
    // PORTRAIT : recentrer sur l'axe Khartoum-Darfour + zoomer plus (la carte
    // remplit la largeur etroite ; l'action occupe le tiers central vertical).
    const camLon = portrait
      ? interpolate(tGlobal, [0, 1], [29.6, 28.2])
      : interpolate(tGlobal, [0, 1], [30.8, 29.4]);
    const camLat = portrait
      ? interpolate(tGlobal, [0, 1], [15.0, 14.6])   // centre la carte entre les 2 bandes HUD
      : interpolate(tGlobal, [0, 1], [15.6, 15.0]);
    const camZoom = portrait
      ? interpolate(effFrame, [0, tStart, tEnd, epic ? EPIC_MAP_SPAN : SUDAN_FLAT_DURATION], [4.75, 4.95, 5.05, 5.12], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        })
      : interpolate(effFrame, [0, tStart, tEnd, epic ? EPIC_MAP_SPAN : SUDAN_FLAT_DURATION], [4.55, 4.72, 4.82, 4.9], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
    map.jumpTo({ center: [camLon, camLat], zoom: camZoom, pitch: 0, bearing: 0 });

    const proj = CITIES.map((c) => {
      const p = map.project([c.lon, c.lat]);
      return { name: c.name, x: p.x, y: p.y };
    });
    setCityPx(proj);

    // vehicules : projette pos + delta (pour la trainee directionnelle)
    const dt = 0.012;
    const vproj = VEHICLES.map((v) => {
      const [lon, lat] = vehiclePos(v, tGlobal);
      const [lon2, lat2] = vehiclePos(v, Math.max(0, tGlobal - dt));
      const p = map.project([lon, lat]);
      const pPrev = map.project([lon2, lat2]);
      return { id: v.id, x: p.x, y: p.y, dx: p.x - pPrev.x, dy: p.y - pPrev.y };
    });
    setVehPx(vproj);

    // refugies (mode epic) : jetons-visage qui se deplacent sur la carte
    if (epic) {
      const rproj = REFUGEES.map((r) => {
        const [lon, lat] = refugeePos(r, tGlobal);
        const [lon2, lat2] = refugeePos(r, Math.max(0, tGlobal - dt));
        const p = map.project([lon, lat]);
        const pPrev = map.project([lon2, lat2]);
        return { id: r.id, x: p.x, y: p.y, dx: p.x - pPrev.x, dy: p.y - pPrev.y };
      });
      setRefPx(rproj);
    }

    const h = delayRender(`flat-frame-${frame}`, { timeoutInMilliseconds: 40000 });
    let done = false;
    const finish = () => { if (!done) { done = true; continueRender(h); } };
    map.once("idle", finish);
    setTimeout(finish, map.areTilesLoaded() ? 300 : 1200);
  }, [frame, effFrame, ready, tGlobal, epic]);

  const cas = Math.round(
    JALONS[jIndex].casualties +
      (JALONS[Math.min(JALONS.length - 1, jIndex + 1)].casualties - JALONS[jIndex].casualties) * jFrac
  );
  // JOUR N depuis le debut de la guerre (15 avril 2023 = JOUR 1).
  // Interpole entre les jalons pour un compteur qui monte en continu.
  const WAR_START_DAYS = [0, 108, 247, 535, 711, 1112]; // jours depuis 2023-04-15 par jalon
  const jourN = Math.round(
    WAR_START_DAYS[jIndex] +
    (((WAR_START_DAYS[Math.min(JALONS.length - 1, jIndex + 1)] ?? WAR_START_DAYS[jIndex]) - WAR_START_DAYS[jIndex]) * jFrac)
  ) + 1; // JOUR 1 au lieu de JOUR 0

  const introOp = interpolate(frame, [0, 6, T_START - 6, T_START + 4], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const hudOp = interpolate(frame, [T_START - 2, T_START + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const _endDur = epic ? SUDAN_EPIC_DURATION : SUDAN_FLAT_DURATION;
  const outroDark = interpolate(frame, [_endDur - 18, _endDur], [0, 0.3], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const visibleCities = ["Khartoum", "El Fasher", "Port-Soudan"];

  // plaque parchemin reutilisable
  const plaque: React.CSSProperties = {
    background: ATLAS.cream,
    border: `2px solid ${ATLAS.ink}`,
    borderRadius: 6,
    color: ATLAS.ink,
    boxShadow: "0 4px 18px rgba(0,0,0,0.28)",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS.ocean, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
      <MapboxBrandingHide />
      <Audio src={staticFile(`_shared/audio/sudan-warmap/${epic ? "score-epic" : withOverlay ? "score-long" : "score"}.mp3`)} />
      {/* filtre papier sepia subtil */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="paperFlat">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 0 0.78  0 0 0 0.04 0" />
        </filter>
      </svg>
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* grain papier overlay — ALLEGE (Aziz : carte trop sombre). multiply 0.5->0.28 */}
      <AbsoluteFill style={{ filter: "url(#paperFlat)", opacity: 0.28, pointerEvents: "none", mixBlendMode: "multiply" }} />

      {/* vignette douce parchemin — ADOUCIE (0.32->0.20, bord plus tardif) */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 66%, rgba(40,28,16,0.20) 100%)",
        }}
      />

      {/* VEHICULES (Etape B — variante PRESENTS). Entre carte et HUD. */}
      {ready &&
        VEHICLES.map((v) => {
          const pos = vehPx.find((p) => p.id === v.id);
          if (!pos) return null;
          const appear = (v.delay ?? 0) + T_START;
          const pop = interpolate(frame, [appear, appear + 14], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
            easing: Easing.bezier(0.2, 0.9, 0.3, 1),
          });
          if (pop <= 0) return null;
          const mag = Math.hypot(pos.dx, pos.dy);
          const moving = mag > 0.12;
          // cap : le symbole pointe vers le HAUT par defaut (-90deg = vers le haut
          // dans le repere atan2). On oriente selon le sens de marche.
          const headingDeg = moving ? (Math.atan2(pos.dy, pos.dx) * 180) / Math.PI + 90 : 0;
          const ang = Math.atan2(pos.dy, pos.dx);
          const trailLen = Math.min(40, mag * 6 + 10);
          const col = v.faction === "rsf" ? ATLAS.rsf : ATLAS.saf;
          // chars/technicals AGRANDIS (Aziz 2026-06-05 : +45% = action plus lisible)
          const vSize = v.size * 1.45;
          return (
            <div
              key={v.id}
              style={{
                position: "absolute", left: pos.x, top: pos.y,
                transform: `translate(-50%, -50%) scale(${pop})`,
                opacity: pop, pointerEvents: "none",
              }}
            >
              {/* trainee directionnelle */}
              {moving && (
                <div
                  style={{
                    position: "absolute", left: 0, top: 0,
                    width: trailLen, height: 7,
                    transform: `translate(-100%, -50%) rotate(${(ang * 180) / Math.PI}deg)`,
                    transformOrigin: "100% 50%",
                    background: `linear-gradient(90deg, rgba(0,0,0,0), ${col})`,
                    borderRadius: 4, opacity: 0.42,
                  }}
                />
              )}
              {/* ombre portee douce (ancrage sol) */}
              <div
                style={{
                  position: "absolute", left: "50%", top: "54%",
                  width: (unitStyle === "token" ? v.size : vSize) * 0.7,
                  height: (unitStyle === "token" ? v.size : vSize) * 0.28,
                  transform: "translate(-50%,-50%)",
                  background: "rgba(26,18,9,0.26)", borderRadius: "50%", filter: "blur(3px)",
                }}
              />
              {unitStyle === "token" ? (
                // JETON ROND portrait (variante cercles-personnages). Pas de rotation
                // (un visage ne tourne pas) : le sens est porte par la trainee seule.
                (() => {
                  const d = v.size * 1.7; // jetons plus gros : visage lisible
                  return (
                    <div
                      style={{
                        width: d, height: d, borderRadius: "50%",
                        background: ATLAS.cream,
                        border: `3px solid ${col}`,
                        boxShadow: `0 2px 8px rgba(0,0,0,0.4), 0 0 0 2px ${ATLAS.cream}`,
                        overflow: "hidden", position: "relative",
                      }}
                    >
                      <img
                        src={staticFile(`_shared/sprites/warmap/${v.faction === "rsf" ? "portrait-rsf" : "portrait-saf"}.png`)}
                        style={{
                          width: "118%", height: "118%", objectFit: "cover",
                          objectPosition: "50% 18%", // cadre le visage
                          position: "absolute", left: "-9%", top: "-6%",
                        }}
                      />
                      {/* liseré teinté faction en bas du jeton */}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "26%", background: `linear-gradient(transparent, ${col}cc)` }} />
                    </div>
                  );
                })()
              ) : (
                // sprite Gemini top-down oriente selon le cap (AGRANDI)
                <img
                  src={staticFile(`_shared/sprites/warmap/${v.sprite}.png`)}
                  style={{
                    width: vSize, height: vSize, objectFit: "contain", display: "block",
                    transform: `rotate(${headingDeg}deg)`,
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                  }}
                />
              )}
            </div>
          );
        })}

      {/* REFUGIES (mode epic) — jetons-visage qui se deplacent sur la carte */}
      {ready && epic &&
        REFUGEES.map((r) => {
          const pos = refPx.find((p) => p.id === r.id);
          if (!pos) return null;
          const pop = interpolate(tGlobal, [r.appearT - 0.02, r.appearT + 0.04], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          if (pop <= 0) return null;
          const mag = Math.hypot(pos.dx, pos.dy);
          const ang = Math.atan2(pos.dy, pos.dx);
          const d = r.size;
          return (
            <div key={r.id} style={{ position: "absolute", left: pos.x, top: pos.y, transform: `translate(-50%, -50%) scale(${pop})`, opacity: pop, pointerEvents: "none" }}>
              {/* trainee de fuite */}
              {mag > 0.1 && (
                <div style={{ position: "absolute", left: 0, top: 0, width: Math.min(34, mag * 6 + 8), height: 6,
                  transform: `translate(-100%, -50%) rotate(${(ang * 180) / Math.PI}deg)`, transformOrigin: "100% 50%",
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${ATLAS.ink})`, borderRadius: 4, opacity: 0.3 }} />
              )}
              {/* jeton-visage rond (encre = registre civil, pas faction) */}
              <div style={{ width: d, height: d, borderRadius: "50%", background: ATLAS.cream, border: `3px solid ${ATLAS.ink}`,
                boxShadow: `0 2px 7px rgba(0,0,0,0.4), 0 0 0 2px ${ATLAS.cream}`, overflow: "hidden", position: "relative" }}>
                <img src={staticFile("_shared/sprites/warmap/portrait-civil.png")}
                  style={{ width: "122%", height: "122%", objectFit: "cover", objectPosition: "50% 14%", position: "absolute", left: "-11%", top: "-6%" }} />
              </div>
            </div>
          );
        })}

      {/* TEXTE-REFUGIES sur la carte (mode epic) — WarMapOverlayExplicatif (composant
          generique, extrait vers _shared/). R2 semi-transparent, R4 pas de voile noir. */}
      {/* Villes — plaques parchemin (signature Atlas : MAJUSCULES sur plaque) */}
      {ready &&
        cityPx
          .filter((c) => visibleCities.includes(c.name))
          .map((c) => (
            <div
              key={c.name}
              style={{
                position: "absolute", left: c.x, top: c.y,
                transform: `translate(-50%, -50%) rotate(${paperWobble(frame, c.name.length * 7)}deg)`,
                opacity: hudOp, pointerEvents: "none",
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: ATLAS.ink, margin: "0 auto", border: `2px solid ${ATLAS.cream}` }} />
              <div style={{ ...plaque, marginTop: 5, padding: "3px 10px", fontSize: 17, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {c.name}
              </div>
            </div>
          ))}

      {/* ====== HUD : boxing different selon orientation ====== */}
      {portrait ? (
        <>
          {/* PORTRAIT — date/horloge en haut (safe zone ~6%), centre */}
          <div style={{ position: "absolute", top: 130, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: hudOp }}>
            <div style={{ ...plaque, padding: "14px 30px", textAlign: "center", transform: `rotate(${paperWobble(frame, 11)}deg)` }}>
              <div style={{ fontSize: 58, fontWeight: 800, fontVariantNumeric: "tabular-nums", letterSpacing: 1, fontFamily: "Georgia, serif", lineHeight: 1 }}>
                {jalon.date}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.65, letterSpacing: 3, fontFamily: "Georgia, serif", marginTop: 6, textTransform: "uppercase" }}>
                JOUR {jourN}
              </div>
            </div>
          </div>

          {/* PORTRAIT — bas : morts + legende + evenement empiles (safe zone ~14%) */}
          <div style={{ position: "absolute", bottom: 290, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: hudOp, padding: "0 50px" }}>
            <div style={{ ...plaque, padding: "12px 30px", textAlign: "center", transform: `rotate(${paperWobble(frame, 3)}deg)` }}>
              <div style={{ fontSize: 18, letterSpacing: 3, opacity: 0.7, fontWeight: 700, textTransform: "uppercase" }}>Morts estimés</div>
              <div style={{ fontSize: 58, fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1.05, fontFamily: "Georgia, serif" }}>
                {cas.toLocaleString("fr-FR")}
              </div>
              <div style={{ display: "flex", gap: 22, marginTop: 10, justifyContent: "center" }}>
                <Faction color={ATLAS.saf} label="Armée (SAF)" />
                <Faction color={ATLAS.rsf} label="RSF" />
              </div>
            </div>
            <div style={{ ...plaque, padding: "13px 26px", fontSize: 30, fontWeight: 600, letterSpacing: 0.3, textAlign: "center", maxWidth: 900 }}>
              {jalon.label}
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 250, left: 0, right: 0, textAlign: "center", fontSize: 14, color: ATLAS.cream, opacity: hudOp * 0.7 }}>
            Chiffres estimés · Sources OSINT (ISW, ACLED)
          </div>
        </>
      ) : (
        <>
          {/* LANDSCAPE — Casualties haut-gauche */}
          <div style={{ position: "absolute", top: 40, left: 44, opacity: hudOp, transform: `rotate(${paperWobble(frame, 3)}deg)` }}>
            <div style={{ ...plaque, padding: "14px 22px" }}>
              <div style={{ fontSize: 16, letterSpacing: 3, opacity: 0.7, fontWeight: 700, textTransform: "uppercase" }}>Morts estimés</div>
              <div style={{ fontSize: 50, fontWeight: 800, fontVariantNumeric: "tabular-nums", lineHeight: 1.05, fontFamily: "Georgia, serif" }}>
                {cas.toLocaleString("fr-FR")}
              </div>
              <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
                <Faction color={ATLAS.saf} label="Armée (SAF)" />
                <Faction color={ATLAS.rsf} label="RSF" />
              </div>
            </div>
          </div>

          {/* LANDSCAPE — Date + horloge haut-droite */}
          <div style={{ position: "absolute", top: 40, right: 46, opacity: hudOp, transform: `rotate(${paperWobble(frame, 11)}deg)` }}>
            <div style={{ ...plaque, padding: "12px 22px", textAlign: "right" }}>
              <div style={{ fontSize: 44, fontWeight: 800, fontVariantNumeric: "tabular-nums", letterSpacing: 1, fontFamily: "Georgia, serif" }}>
                {jalon.date}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.65, letterSpacing: 3, fontFamily: "Georgia, serif", marginTop: 4, textTransform: "uppercase" }}>
                JOUR {jourN}
              </div>
            </div>
          </div>

          {/* LANDSCAPE — evenement bas */}
          <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center", opacity: hudOp, padding: "0 80px" }}>
            <div style={{ ...plaque, display: "inline-block", padding: "12px 28px", fontSize: 30, fontWeight: 600, letterSpacing: 0.3 }}>
              {jalon.label}
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 24, right: 30, fontSize: 13, color: ATLAS.cream, opacity: hudOp * 0.7 }}>
            Chiffres estimés · Sources OSINT (ISW, ACLED)
          </div>
        </>
      )}

      {/* Carton titre intro (parchemin) */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: introOp, pointerEvents: "none" }}>
        <div style={{ ...plaque, textAlign: "center", padding: portrait ? "30px 40px" : "34px 60px", transform: `rotate(${paperWobble(frame, 1)}deg)`, maxWidth: portrait ? 920 : undefined }}>
          <div style={{ fontSize: 22, letterSpacing: 8, opacity: 0.75, fontWeight: 700, textTransform: "uppercase" }}>Soudan</div>
          <div style={{ fontSize: portrait ? 60 : 66, fontWeight: 800, marginTop: 8, fontFamily: "'Cormorant Garamond', Georgia, serif", lineHeight: 1.08 }}>
            La guerre, jour après jour
          </div>
          <div style={{ fontSize: 24, opacity: 0.8, marginTop: 10, fontWeight: 600 }}>Avril 2023 — Mai 2026</div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: "#1A1209", opacity: outroDark, pointerEvents: "none" }} />

      {/* OVERLAY data premium (l'action se fige) */}
      {withOverlay && (
        <WarMapDataOverlay startFrame={OVERLAY_START} holdFrames={OVERLAY_HOLD} fps={SUDAN_FPS} />
      )}

      {/* MODE EPIC : overlays par type (explicatif avec portrait, ou donnee) */}
      {epic &&
        EPIC_WINDOWS.map((w, i) => {
          if (w.kind === "explicatif") {
            return (
              <WarMapOverlayExplicatif
                key={i}
                startFrame={w.start}
                holdFrames={w.hold}
                title={w.data.title}
                text={w.data.text}
                portrait={w.data.portrait}
                source={w.data.source}
              />
            );
          }
          return (
            <WarMapDataOverlay key={i} startFrame={w.start} holdFrames={w.hold} fps={SUDAN_FPS} variant={w.data.variant} />
          );
        })}
    </AbsoluteFill>
  );
};

const Faction: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
    <div style={{ width: 15, height: 15, borderRadius: 3, background: color, border: "1.5px solid rgba(26,18,9,0.5)" }} />
    <span style={{ fontSize: 16, fontWeight: 700, color: "#3A2A18" }}>{label}</span>
  </div>
);
