/**
 * SudanWarMap — PROTOTYPE premium "day-by-day war map" en code (Remotion + Mapbox).
 *
 * But : prouver que le genre "every day of the war" (mapsinanutshell) est
 * reproductible — et plus rigoureux — avec notre stack frame-driven, sans
 * Google Earth Studio ni After Effects.
 *
 * Pipeline :
 *   - fond satellite Mapbox (satellite-v9), labels off, ocean uniforme
 *   - source GeoJSON des 17 etats du Soudan ; chaque frame on recalcule la
 *     valeur de controle (0=RSF rouge, 1=SAF bleu, 0.5=conteste) et on la pousse
 *     dans la feature-property "ctrl" -> couleur data-driven via expression.
 *   - camera : drift lent + pitch leger (secondary motion, jamais statique).
 *   - overlays DOM frame-driven : compteur date YYYY.MM.DD, horloge cosmetique,
 *     compteur Casualties anime, legende drapeaux, sous-titre evenement, villes,
 *     vignette, carton titre d'intro, disclaimer "estimated".
 *
 * Render : ./scripts/render-mapbox.sh SudanWarMap out/....mp4 (gl=angle).
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
  COLORS,
  JALONS,
  controlAt,
  jalonAt,
} from "./sudanControlData";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const SUDAN_FPS = 30;
export const SUDAN_DURATION = 20 * SUDAN_FPS + 60; // ~20s + petite queue = 660

// Fenetre temporelle de la "marche du front" : on laisse 1.5s d'intro (carton)
// et 1.5s de sortie (climax tenu).
const T_START = Math.round(1.6 * SUDAN_FPS);
const T_END = SUDAN_DURATION - Math.round(2.2 * SUDAN_FPS);

// ---------------------------------------------------------------------------
// Couleur d'un etat selon sa valeur de controle (rouge<->or<->bleu)
// ---------------------------------------------------------------------------
const lerpHex = (a: string, b: string, t: number) => {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
const controlColor = (v: number) => {
  // 0 = RSF rouge, 0.5 = conteste or, 1 = SAF bleu
  if (v < 0.5) return lerpHex(COLORS.rsf, COLORS.contested, v / 0.5);
  return lerpHex(COLORS.contested, COLORS.saf, (v - 0.5) / 0.5);
};

// ---------------------------------------------------------------------------
// Camera : projection geo -> ecran pour positionner les labels villes en DOM
// ---------------------------------------------------------------------------

export const SudanWarMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() =>
    delayRender("SudanWarMap", { timeoutInMilliseconds: 60000 })
  );
  const [ready, setReady] = useState(false);
  const [cityPx, setCityPx] = useState<{ name: string; x: number; y: number }[]>([]);

  // progression globale du front 0..1
  const tGlobal = interpolate(frame, [T_START, T_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });

  const { jalon, i: jIndex, f: jFrac } = jalonAt(tGlobal);

  // -------------------------------------------------------------------------
  // Init map une seule fois
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      console.warn("[SudanWarMap] no MAPBOX_TOKEN");
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
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [30.2, 15.45],
      zoom: 4.55,
      pitch: 18,
      bearing: -6,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      projection: { name: "mercator" },
    });
    mapRef.current = map;

    map.on("error", (e) =>
      console.error("[SudanWarMap] error:", e?.error?.message ?? e)
    );

    map.on("style.load", async () => {
      // ocean uniforme (le satellite-v9 n'a pas de couche water nommee ; on
      // ajoute un fond bleu sous tout via background)
      try {
        if (!map.getLayer("bg-fill")) {
          map.addLayer(
            { id: "bg-fill", type: "background", paint: { "background-color": "#0a1622" } },
            map.getStyle().layers?.[0]?.id
          );
        }
      } catch {}

      // charge le geojson des etats
      const res = await fetch(staticFile("_shared/geo-data/sudan/sudan-states.geojson"));
      const fc = await res.json();
      // injecte une property ctrl initiale
      for (const f of fc.features) f.properties.ctrl = 1;

      map.addSource("sudan", { type: "geojson", data: fc });

      // halo sous les etats (sensation de relief / glow)
      map.addLayer({
        id: "sudan-glow",
        type: "fill",
        source: "sudan",
        paint: {
          "fill-color": [
            "interpolate", ["linear"], ["get", "ctrl"],
            0, COLORS.rsfGlow, 0.5, COLORS.contested, 1, COLORS.safGlow,
          ],
          "fill-opacity": 0.18,
        },
      });

      // remplissage principal data-driven
      map.addLayer({
        id: "sudan-fill",
        type: "fill",
        source: "sudan",
        paint: {
          "fill-color": [
            "interpolate", ["linear"], ["get", "ctrl"],
            0, COLORS.rsf, 0.5, COLORS.contested, 1, COLORS.saf,
          ],
          "fill-opacity": 0.62,
        },
      });

      // frontieres d'etats — fines, pour lire la mosaique
      map.addLayer({
        id: "sudan-line",
        type: "line",
        source: "sudan",
        paint: { "line-color": "#0d1b2a", "line-width": 1.2, "line-opacity": 0.55 },
      });

      // contour national epais
      map.addLayer({
        id: "sudan-outline",
        type: "line",
        source: "sudan",
        paint: { "line-color": "#f4f1de", "line-width": 1.4, "line-opacity": 0.35 },
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

  // -------------------------------------------------------------------------
  // Chaque frame : MAJ controle + camera + positions villes
  // -------------------------------------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;

    // 1) recalcule ctrl par etat et pousse dans la source
    const src = map.getSource("sudan") as mapboxgl.GeoJSONSource | undefined;
    if (src && (src as any)._data) {
      const data = (src as any)._data;
      for (const f of data.features) {
        const name = f.properties.name as string;
        if (SUDAN_STATES.includes(name as any)) {
          f.properties.ctrl = controlAt(name, tGlobal);
        }
      }
      src.setData(data);
    }

    // 2) camera : drift lent vers l'ouest (suit la bascule du Darfour) + pitch
    const camLon = interpolate(tGlobal, [0, 1], [31.4, 28.6]);
    const camLat = interpolate(tGlobal, [0, 1], [15.7, 14.8]);
    const camZoom = interpolate(frame, [0, T_START, T_END, SUDAN_DURATION], [4.2, 4.5, 4.62, 4.7], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
    const camBearing = interpolate(tGlobal, [0, 1], [-7, 2]);
    const camPitch = interpolate(tGlobal, [0, 1], [16, 30]);
    map.jumpTo({ center: [camLon, camLat], zoom: camZoom, pitch: camPitch, bearing: camBearing });

    // 3) projette les villes en pixels pour les labels DOM
    const proj = CITIES.map((c) => {
      const p = map.project([c.lon, c.lat]);
      return { name: c.name, x: p.x, y: p.y };
    });
    setCityPx(proj);

    // 4) attendre que les tuiles satellite soient peintes a CETTE frame
    //    (sinon patches gris/tan quand la camera bouge). delayRender par frame.
    const h = delayRender(`sudan-frame-${frame}`, { timeoutInMilliseconds: 40000 });
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      continueRender(h);
    };
    if (map.areTilesLoaded()) {
      // laisse 1 tick pour le repaint
      map.once("idle", finish);
      // garde-fou si idle deja passe
      setTimeout(finish, 350);
    } else {
      map.once("idle", finish);
      setTimeout(finish, 1500);
    }
  }, [frame, ready, tGlobal]);

  // -------------------------------------------------------------------------
  // Valeurs overlays
  // -------------------------------------------------------------------------
  // Casualties anime entre jalons
  const cas = Math.round(
    JALONS[jIndex].casualties +
      (JALONS[Math.min(JALONS.length - 1, jIndex + 1)].casualties - JALONS[jIndex].casualties) * jFrac
  );
  // horloge cosmetique : tourne en continu (sentiment temps reel)
  // 1 frame -> ~137s : defile vite sans jamais se figer a 00:00:00
  const totalSecondsFake = (frame * 137 + 8 * 3600) % (24 * 3600);
  const hh = String(Math.floor(totalSecondsFake / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSecondsFake % 3600) / 60)).padStart(2, "0");
  const ss = String(Math.floor(totalSecondsFake % 60)).padStart(2, "0");

  // intro carton (fade out a T_START)
  const introOp = interpolate(frame, [0, 6, T_START - 6, T_START + 4], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // overlays d'analyse apparaissent apres l'intro
  const hudOp = interpolate(frame, [T_START - 2, T_START + 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // outro : leger fondu au noir sur la queue
  const outroDark = interpolate(frame, [SUDAN_DURATION - 18, SUDAN_DURATION], [0, 0.35], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const visibleCities = ["Khartoum", "El Fasher", "Port-Soudan"];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a1622", fontFamily: "Inter, Arial, sans-serif" }}>
      <MapboxBrandingHide />
      <Audio src={staticFile("_shared/audio/sudan-warmap/score.mp3")} />
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* Vignette cinematique */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 320px 90px rgba(0,0,0,0.72)",
          background:
            "radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Labels villes (DOM, geo-attaches) */}
      {ready &&
        cityPx
          .filter((c) => visibleCities.includes(c.name))
          .map((c) => (
            <div
              key={c.name}
              style={{
                position: "absolute",
                left: c.x,
                top: c.y,
                transform: "translate(-50%, -50%)",
                opacity: hudOp,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 0 8px rgba(255,255,255,0.9)",
                  margin: "0 auto",
                }}
              />
              <div
                style={{
                  marginTop: 4,
                  color: "#fff",
                  fontSize: 19,
                  fontWeight: 700,
                  textShadow: "0 1px 6px rgba(0,0,0,0.95)",
                  letterSpacing: 0.4,
                  whiteSpace: "nowrap",
                }}
              >
                {c.name}
              </div>
            </div>
          ))}

      {/* Compteur Casualties (haut-gauche) */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 44,
          opacity: hudOp,
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 15, letterSpacing: 2, opacity: 0.75, fontWeight: 600 }}>
          MORTS ESTIMÉS
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            lineHeight: 1.05,
          }}
        >
          {cas.toLocaleString("fr-FR")}
        </div>
        {/* Legende drapeaux/factions */}
        <div style={{ display: "flex", gap: 18, marginTop: 14 }}>
          <Faction color={COLORS.saf} label="Armée (SAF)" />
          <Faction color={COLORS.rsf} label="RSF" />
        </div>
      </div>

      {/* Compteur date + horloge (haut-droite) */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 46,
          textAlign: "right",
          opacity: hudOp,
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: 46,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            letterSpacing: 1,
          }}
        >
          {jalon.date}
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            opacity: 0.82,
            fontVariantNumeric: "tabular-nums",
            textShadow: "0 1px 8px rgba(0,0,0,0.9)",
          }}
        >
          {hh}:{mm}:{ss}
        </div>
      </div>

      {/* Sous-titre evenement (bas) */}
      <div
        style={{
          position: "absolute",
          bottom: 64,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: hudOp,
          padding: "0 80px",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(8,16,28,0.74)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 10,
            padding: "12px 26px",
            color: "#f4f1de",
            fontSize: 27,
            fontWeight: 600,
            letterSpacing: 0.3,
            textShadow: "0 1px 6px rgba(0,0,0,0.9)",
            backdropFilter: "blur(2px)",
          }}
        >
          {jalon.label}
        </div>
      </div>

      {/* Disclaimer (bas-droite, discret — convention du genre) */}
      <div
        style={{
          position: "absolute",
          bottom: 22,
          right: 30,
          fontSize: 13,
          color: "rgba(255,255,255,0.5)",
          opacity: hudOp,
        }}
      >
        Chiffres estimés · Sources OSINT (ISW, ACLED)
      </div>

      {/* Carton titre d'intro */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: introOp,
          pointerEvents: "none",
          background: "rgba(4,9,16,0.55)",
        }}
      >
        <div style={{ textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: 22, letterSpacing: 6, opacity: 0.8, fontWeight: 600 }}>
            SOUDAN
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              marginTop: 10,
              textShadow: "0 4px 24px rgba(0,0,0,0.9)",
            }}
          >
            La guerre, jour après jour
          </div>
          <div style={{ fontSize: 24, opacity: 0.85, marginTop: 14, fontWeight: 500 }}>
            Avril 2023 — Mai 2026
          </div>
        </div>
      </AbsoluteFill>

      {/* Outro fade */}
      <AbsoluteFill style={{ background: "#000", opacity: outroDark, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const Faction: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
    <div
      style={{
        width: 16,
        height: 16,
        borderRadius: 3,
        background: color,
        boxShadow: `0 0 8px ${color}`,
      }}
    />
    <span style={{ fontSize: 16, fontWeight: 600, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
      {label}
    </span>
  </div>
);
