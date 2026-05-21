import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Pays du script Or africain avec leurs centres
const COUNTRIES = [
  { iso: "GHA", name: "GHANA",   lon: -1.0232, lat: 7.9465,  color: "#D4AF37", label: "5% → 12% royalties" },
  { iso: "MLI", name: "MALI",    lon: -2.0000, lat: 17.5707, color: "#E8A020", label: "$430M saisis à Barrick" },
  { iso: "BFA", name: "BURKINA", lon: -1.5616, lat: 12.3641, color: "#CC7722", label: "Code minier révisé" },
  { iso: "NER", name: "NIGER",   lon: 8.0817,  lat: 17.6078, color: "#B05A1A", label: "Mine nationalisée" },
  { iso: "GIN", name: "GUINÉE",  lon: -11.3069, lat: 11.0, color: "#9B4410", label: "Nouveau contrat minier" },
];

// Phases caméra — chaque pays a son propre mouvement
const PHASE_FRAMES = 60; // frames par pays
const INTRO_FRAMES = 90; // vue large Afrique de l'Ouest

type CamState = { lon: number; lat: number; zoom: number; pitch: number; bearing: number };

const INTRO_CAM: CamState = { lon: 0, lat: 10, zoom: 1.5, pitch: 0, bearing: 0 };

// Caméras par pays — mouvements variés
const COUNTRY_CAMS: CamState[] = [
  { lon: -1.0232, lat: 7.9465,  zoom: 5.5, pitch: 45,  bearing: -5  }, // Ghana — plongée
  { lon: -2.0,    lat: 17.5,    zoom: 4.8, pitch: 30,  bearing: 15  }, // Mali — légère rotation
  { lon: -1.5,    lat: 12.3,    zoom: 5.2, pitch: 55,  bearing: 0   }, // Burkina — forte inclinaison
  { lon: 8.0,     lat: 17.6,    zoom: 4.5, pitch: 20,  bearing: -20 }, // Niger — bearing négatif
  { lon: -11.3,   lat: 11.0,    zoom: 5.0, pitch: 40,  bearing: 10  }, // Guinée
];

// Vue finale — Afrique de l'Ouest complète avec tous les pays allumés
const OUTRO_CAM: CamState = { lon: -2.0, lat: 12.0, zoom: 3.8, pitch: 25, bearing: 0 };
const OUTRO_FRAMES = 90;

const TOTAL_FRAMES = INTRO_FRAMES + COUNTRIES.length * PHASE_FRAMES + OUTRO_FRAMES;

const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const lerpCam = (a: CamState, b: CamState, t: number): CamState => {
  const e = ease(Math.max(0, Math.min(1, t)));
  return {
    lon: a.lon + (b.lon - a.lon) * e,
    lat: a.lat + (b.lat - a.lat) * e,
    zoom: a.zoom + (b.zoom - a.zoom) * e,
    pitch: a.pitch + (b.pitch - a.pitch) * e,
    bearing: a.bearing + (b.bearing - a.bearing) * e,
  };
};

const getCam = (frame: number): CamState => {
  if (frame < INTRO_FRAMES) {
    return lerpCam(INTRO_CAM, COUNTRY_CAMS[0], frame / INTRO_FRAMES);
  }
  const afterIntro = frame - INTRO_FRAMES;
  const phaseIdx = Math.floor(afterIntro / PHASE_FRAMES);
  const phaseT = (afterIntro % PHASE_FRAMES) / PHASE_FRAMES;

  if (phaseIdx >= COUNTRIES.length) {
    const outroT = (frame - INTRO_FRAMES - COUNTRIES.length * PHASE_FRAMES) / OUTRO_FRAMES;
    return lerpCam(COUNTRY_CAMS[COUNTRIES.length - 1], OUTRO_CAM, outroT);
  }
  if (phaseIdx === 0) {
    return COUNTRY_CAMS[0];
  }
  return lerpCam(COUNTRY_CAMS[phaseIdx - 1], COUNTRY_CAMS[phaseIdx], phaseT);
};

export const MapboxAfricaMulti: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Mapbox Africa Multi"));
  const [ready, setReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  // Quel pays est actif
  const afterIntro = Math.max(0, frame - INTRO_FRAMES);
  const activeIdx = Math.min(
    Math.floor(afterIntro / PHASE_FRAMES),
    COUNTRIES.length - 1
  );
  const isOutro = frame >= INTRO_FRAMES + COUNTRIES.length * PHASE_FRAMES;

  // Label du pays actif
  const labelFrame = frame - INTRO_FRAMES - activeIdx * PHASE_FRAMES;
  const labelOpacity = interpolate(labelFrame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelScale = spring({ frame: labelFrame, fps, config: { damping: 80, stiffness: 300 } });

  // Titre final "5 pays. Même mouvement."
  const outroFrame = frame - (INTRO_FRAMES + COUNTRIES.length * PHASE_FRAMES);
  const outroOpacity = interpolate(outroFrame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!MAPBOX_TOKEN) {
      continueRender(handle);
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [INTRO_CAM.lon, INTRO_CAM.lat],
      zoom: INTRO_CAM.zoom,
      pitch: INTRO_CAM.pitch,
      bearing: INTRO_CAM.bearing,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      // Supprimer labels
      const layers = map.getStyle().layers ?? [];
      for (const layer of layers) {
        if (layer.type === "symbol") {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }

      // Ajouter une couche par pays (tous invisibles au départ)
      COUNTRIES.forEach((country, i) => {
        if (!map.getLayer(`fill-${country.iso}`)) map.addLayer({
          id: `fill-${country.iso}`,
          type: "fill",
          source: {
            type: "vector",
            url: "mapbox://mapbox.country-boundaries-v1",
          },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], country.iso],
          paint: {
            "fill-color": country.color,
            "fill-opacity": 0,
          },
        });

        if (!map.getLayer(`border-${country.iso}`)) map.addLayer({
          id: `border-${country.iso}`,
          type: "line",
          source: {
            type: "vector",
            url: "mapbox://mapbox.country-boundaries-v1",
          },
          "source-layer": "country_boundaries",
          filter: ["==", ["get", "iso_3166_1_alpha_3"], country.iso],
          paint: {
            "line-color": country.color,
            "line-width": 2,
            "line-opacity": 0,
          },
        });
      });

      setReady(true);
      continueRender(handle);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [handle]);

  // Mise à jour caméra + opacités à chaque frame
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const cam = getCam(frame);

    map.jumpTo({
      center: [cam.lon, cam.lat],
      zoom: cam.zoom,
      pitch: cam.pitch,
      bearing: cam.bearing,
    });

    // Mettre à jour les opacités de chaque pays
    const currentVisible = isOutro
      ? COUNTRIES.length
      : Math.min(activeIdx + 1, COUNTRIES.length);

    COUNTRIES.forEach((country, i) => {
      const visible = i < currentVisible;
      const opacity = visible ? 0.65 : 0;
      const lineOpacity = visible ? 0.9 : 0;
      try {
        map.setPaintProperty(`fill-${country.iso}`, "fill-opacity", opacity);
        map.setPaintProperty(`border-${country.iso}`, "line-opacity", lineOpacity);
      } catch {}
    });
  }, [frame, ready, activeIdx, isOutro]);

  const activeCountry = COUNTRIES[Math.min(activeIdx, COUNTRIES.length - 1)];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <div ref={containerRef} style={{ width, height, position: "absolute" }} />

      {/* Label pays actif */}
      {!isOutro && frame >= INTRO_FRAMES && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 80,
            pointerEvents: "none",
            opacity: labelOpacity,
          }}
        >
          <div
            style={{
              transform: `scale(${labelScale})`,
              backgroundColor: "rgba(0,0,0,0.82)",
              border: `2px solid ${activeCountry.color}`,
              borderRadius: 8,
              padding: "12px 28px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 38,
                fontWeight: 900,
                fontFamily: "Arial Black, sans-serif",
                color: activeCountry.color,
                letterSpacing: "0.1em",
              }}
            >
              {activeCountry.name}
            </div>
            <div
              style={{
                fontSize: 18,
                fontFamily: "Arial, sans-serif",
                color: "rgba(255,255,255,0.75)",
                marginTop: 4,
              }}
            >
              {activeCountry.label}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Outro — "5 pays. Même mouvement." */}
      {isOutro && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            opacity: outroOpacity,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(0,0,0,0.88)",
              border: "2px solid #D4AF37",
              borderRadius: 8,
              padding: "20px 48px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 900,
                fontFamily: "Arial Black, sans-serif",
                color: "#D4AF37",
                letterSpacing: "0.06em",
              }}
            >
              5 PAYS.
            </div>
            <div
              style={{
                fontSize: 32,
                fontFamily: "Arial, sans-serif",
                color: "rgba(255,255,255,0.85)",
                marginTop: 8,
                letterSpacing: "0.04em",
              }}
            >
              MÊME MOUVEMENT.
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const MAPBOX_AFRICA_MULTI_FRAMES = TOTAL_FRAMES;
