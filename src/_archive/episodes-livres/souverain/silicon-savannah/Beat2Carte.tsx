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
import { MapboxBrandingHide } from "../../_shared/mapbox/MapboxBase";
import {
  applyCartoCaspian,
  CartoCaspianOverlay,
  CASPIAN_SEPIA,
} from "../../_shared/mapbox/templates/CartoCaspian";
import { SEG } from "./manifest";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

// Durée du beat : f=314 → f=754, mais comme composition standalone f=0 → f=440
const BEAT_DURATION = SEG.situer_nokia.end - SEG.situer_debut.start; // 410f
export const BEAT2_DURATION = BEAT_DURATION + 30; // + 30f overlap

// Caméra : Afrique entière → zoom Kenya
const CAM_START = { lat: 0, lon: 20, zoom: 2.0 };
const CAM_END   = { lat: 0.023, lon: 37.906, zoom: 5.0 };

// Labels apparaissent à des frames relatives au beat (offset = 314)
const OFFSET = SEG.situer_debut.start;
const NAIROBI_REL  = SEG.situer_mpesa.start - OFFSET;  // f=50
const MOMBASA_REL  = 136;                               // +86f après Nairobi
const KISUMU_REL   = 216;                               // +80f après Mombasa

// SplitFlap overlay apparaît dès Nairobi (f=50 relatif)
const FLAP_APPEAR  = NAIROBI_REL;
const FLAP_HIDE    = SEG.situer_nokia.end - OFFSET;     // f=410

export const Beat2Carte: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [handle] = useState(() => delayRender("beat2-carte-map"));

  const zoom = interpolate(frame, [0, BEAT_DURATION], [CAM_START.zoom, CAM_END.zoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lon = interpolate(frame, [0, BEAT_DURATION], [CAM_START.lon, CAM_END.lon], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lat = interpolate(frame, [0, BEAT_DURATION], [CAM_START.lat, CAM_END.lat], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pitch = interpolate(frame, [0, BEAT_DURATION], [0, 15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mapOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [CAM_START.lon, CAM_START.lat],
      zoom: CAM_START.zoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      applyCartoCaspian(map, CASPIAN_SEPIA);

      // Highlight Kenya
      map.addSource("country-highlights", {
        type: "vector",
        url: "mapbox://mapbox.country-boundaries-v1",
      });

      map.addLayer({
        id: "kenya-fill",
        type: "fill",
        source: "country-highlights",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "KEN"],
        paint: {
          "fill-color": "#FFB800",
          "fill-opacity": 0.35,
        },
      });

      map.addLayer({
        id: "kenya-border",
        type: "line",
        source: "country-highlights",
        "source-layer": "country_boundaries",
        filter: ["==", ["get", "iso_3166_1_alpha_3"], "KEN"],
        paint: {
          "line-color": "#FFB800",
          "line-width": 2.5,
          "line-opacity": 0.9,
        },
      });

      continueRender(handle);
    });
  }, [handle]);

  // Mise à jour caméra chaque frame
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setCenter([lon, lat]);
    mapRef.current.setZoom(zoom);
    mapRef.current.setPitch(pitch);
  }, [frame, lon, lat, zoom, pitch]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#a8c2d4" }}>
      <MapboxBrandingHide />

      {/* Carte Mapbox */}
      <div
        ref={containerRef}
        style={{ position: "absolute", inset: 0, opacity: mapOpacity }}
      />

      <CartoCaspianOverlay opacity={0.06} />

      {/* Labels villes */}
      <CityLabel name="NAIROBI"  lat={-1.286} lon={36.818} appearsAt={NAIROBI_REL}  frame={frame} fps={fps} map={mapRef.current} zoom={zoom} />
      <CityLabel name="MOMBASA" lat={-4.043}  lon={39.668} appearsAt={MOMBASA_REL}  frame={frame} fps={fps} map={mapRef.current} zoom={zoom} />
      <CityLabel name="KISUMU"  lat={-0.102}  lon={34.762} appearsAt={KISUMU_REL}   frame={frame} fps={fps} map={mapRef.current} zoom={zoom} />

      {/* SplitFlap overlay M-PESA / 6 MARS 2007 */}
      <FlapOverlay frame={frame} fps={fps} appearsAt={FLAP_APPEAR} hidesAt={FLAP_HIDE} />

      {/* Caption Nokia */}
      <CaptionNokia frame={frame} />
    </AbsoluteFill>
  );
};

// ── Label ville ──
interface CityLabelProps {
  name: string;
  lat: number;
  lon: number;
  appearsAt: number;
  frame: number;
  fps: number;
  map: mapboxgl.Map | null;
  zoom: number;
}

const CityLabel: React.FC<CityLabelProps> = ({
  name, appearsAt, frame, fps
}) => {
  const p = spring({
    frame: frame - appearsAt,
    fps,
    config: { damping: 100, stiffness: 80 },
    durationInFrames: 20,
  });
  const opacity = interpolate(p, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  const scale   = interpolate(p, [0, 1], [0.7, 1], { extrapolateRight: "clamp" });

  if (frame < appearsAt) return null;

  // Position approximative CSS en overlay — pas de map.project() car pas dispo en render
  // Les labels sont positionnés fixes, approximation acceptable pour mini-render
  const positions: Record<string, { top: string; left: string }> = {
    NAIROBI:  { top: "52%", left: "62%" },
    MOMBASA:  { top: "60%", left: "66%" },
    KISUMU:   { top: "50%", left: "52%" },
  };
  const pos = positions[name] ?? { top: "50%", left: "50%" };

  return (
    <div
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#FFB800", boxShadow: "0 0 8px rgba(255,184,0,0.8)" }} />
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 26,
          color: "#f5efe0",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          textShadow: "0 1px 4px rgba(0,0,0,0.7)",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
    </div>
  );
};

// ── Overlay SplitFlap minimal M-PESA / 6 MARS 2007 ──
interface FlapOverlayProps {
  frame: number;
  fps: number;
  appearsAt: number;
  hidesAt: number;
}

const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .-";

const FlapOverlay: React.FC<FlapOverlayProps> = ({ frame, fps, appearsAt, hidesAt }) => {
  const ROWS = ["M-PESA", "6 MARS 2007"];
  const ROLL_DUR = 20;

  const entryP = spring({
    frame: frame - appearsAt,
    fps,
    config: { damping: 120, stiffness: 80 },
    durationInFrames: 25,
  });
  const exitP = interpolate(frame, [hidesAt - 20, hidesAt], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(entryP, [0, 1], [0, 1], { extrapolateRight: "clamp" }) * exitP;
  const translateY = interpolate(entryP, [0, 1], [40, 0], { extrapolateRight: "clamp" });

  if (frame < appearsAt) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 140,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: "none",
      }}
    >
      {ROWS.map((text, rowIdx) => {
        const rowStart = appearsAt + rowIdx * 30;
        const chars = text.split("");
        const cellSize = rowIdx === 0 ? 88 : 66;
        const cellFontSize = rowIdx === 0 ? 36 : 28;

        return (
          <div key={rowIdx} style={{ display: "flex", flexDirection: "row", gap: 6 }}>
            {chars.map((ch, colIdx) => {
              if (ch === " ") return <div key={colIdx} style={{ width: cellSize * 0.5 }} />;

              const cellStart = rowStart + colIdx * 4;
              const localF = frame - cellStart;
              const isLocked = localF >= ROLL_DUR;
              const isRolling = localF >= 0 && !isLocked;

              const displayChar = isRolling
                ? FLAP_CHARS[(frame * 3 + colIdx * 7 + rowIdx * 13) % FLAP_CHARS.length]
                : isLocked
                ? ch
                : " ";

              return (
                <div
                  key={colIdx}
                  style={{
                    width: cellSize,
                    height: Math.round(cellSize * 1.2),
                    backgroundColor: "#0a1628",
                    border: "1.5px solid rgba(255,184,0,0.45)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: cellFontSize,
                      fontWeight: 700,
                      color: isLocked ? "#f2ebd9" : "#FFB800",
                      letterSpacing: "0.05em",
                      lineHeight: 1,
                    }}
                  >
                    {displayChar}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// ── Caption "Nokia" discret ──
const CaptionNokia: React.FC<{ frame: number }> = ({ frame }) => {
  const NOKIA_REL = SEG.situer_nokia.start - OFFSET; // f=313
  const opacity = interpolate(frame, [NOKIA_REL, NOKIA_REL + 15, SEG.situer_nokia.end - OFFSET - 10, SEG.situer_nokia.end - OFFSET], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < NOKIA_REL) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 24,
          color: "rgba(245,239,224,0.6)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          textShadow: "0 1px 3px rgba(0,0,0,0.8)",
        }}
      >
        UN MODÈLE QUE LA BANQUE MONDIALE CITERA COMME RÉFÉRENCE
      </span>
    </div>
  );
};

export default Beat2Carte;
