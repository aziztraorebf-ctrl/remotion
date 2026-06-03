/**
 * ClassifiedRedactReveal — HOOK : ecran "dossier confidentiel" (barres de censure noires +
 * mentions CLASSIFIED/TOP SECRET) qui glissent violemment hors cadre pour REVELER la carte.
 *
 * Idee Gemini #4 (Chantier HOOK). Ton investigation/thriller geopolitique. Punch = les blocs
 * de censure qui degagent a des vitesses differentes (easing sec) sur une carte deja en drift.
 *
 * Mecanique (@30fps) :
 *   0-1s   : ecran obstrue par barres navy/noires + texte "CLASSIFIED" gold + lignes redaction
 *   1-1.5s : les blocs glissent (gauche/droite/haut/bas) a vitesses differentes (back.out)
 *   1.5s+  : carte revelee (deja en drift) + target lock sur le pays focus qui s'allume
 *
 * Carte Mapbox : drift fluide continu dessous. Tout l'overlay censure = Remotion/SVG.
 *
 * Usage :
 *   <ClassifiedRedactReveal center={[-14.5,14.5]} baseZoom={5.4} focusIso="SEN"
 *     stampText="CLASSIFIED" teaseText="CE QU'ON VOUS CACHE" revealAt={30} />
 *
 * IMPORTANT : render via scripts/render-mapbox.sh (WebGL headless).
 */

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
import { applyGeoAfriqueV5, MapboxBrandingHide, COUNTRY_CENTERS } from "./MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY = "#16213a";

export interface ClassifiedRedactRevealProps {
  center: [number, number];
  baseZoom?: number;
  focusIso?: string;
  /** Tampon (ex: "CLASSIFIED", "TOP SECRET") */
  stampText?: string;
  /** Accroche apres reveal (ex: "CE QU'ON VOUS CACHE") */
  teaseText?: string;
  accentColor?: string;
  /** Frame ou les blocs commencent a degager */
  revealAt?: number;
  durationFrames?: number;
}

// easing "sec" type back.out (overshoot leger)
const backOut = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const ClassifiedRedactReveal: React.FC<ClassifiedRedactRevealProps> = ({
  center,
  baseZoom = 5.4,
  focusIso,
  stampText = "CLASSIFIED",
  teaseText,
  accentColor = GOLD,
  revealAt = 30,
  durationFrames = 130,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("Redact init"));
  const [ready, setReady] = useState(false);
  const [focusPos, setFocusPos] = useState<{ x: number; y: number } | null>(null);

  const effZoom = baseZoom + (isVertical ? 0 : -0.4);
  const fillId = `rd-fill-${focusIso}`;
  const lineId = `rd-line-${focusIso}`;

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
      center,
      zoom: effZoom,
      pitch: 0,
      bearing: 0,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
    });
    mapRef.current = map;
    map.on("style.load", () => {
      try {
        (map as mapboxgl.Map & { setProjection?: (p: string) => void }).setProjection?.(
          "mercator"
        );
      } catch {}
      applyGeoAfriqueV5(map);
      if (focusIso) {
        if (!map.getSource("cb-source")) {
          map.addSource("cb-source", {
            type: "vector",
            url: "mapbox://mapbox.country-boundaries-v1",
          });
        }
        if (!map.getLayer(fillId)) {
          map.addLayer({
            id: fillId,
            type: "fill",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], focusIso],
            paint: { "fill-color": accentColor, "fill-opacity": 0 },
          });
        }
        if (!map.getLayer(lineId)) {
          map.addLayer({
            id: lineId,
            type: "line",
            source: "cb-source",
            "source-layer": "country_boundaries",
            filter: ["==", ["get", "iso_3166_1_alpha_3"], focusIso],
            paint: { "line-color": accentColor, "line-width": 2.5, "line-opacity": 0 },
          });
        }
      }
      setReady(true);
      continueRender(handle);
    });
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const map = mapRef.current;
    const driftBearing = interpolate(frame, [0, durationFrames], [-3, 3]);
    const driftZoom = effZoom + interpolate(frame, [0, durationFrames], [0, 0.14]);
    map.jumpTo({ center, zoom: driftZoom, bearing: driftBearing, pitch: 0 });

    const rel = frame - (revealAt + 14);
    const fillOp = interpolate(rel, [0, 14], [0, 0.45], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const lineOp = interpolate(rel, [0, 12], [0, 0.95], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    try {
      map.setPaintProperty(fillId, "fill-opacity", fillOp);
      map.setPaintProperty(lineId, "line-opacity", lineOp);
    } catch {}

    if (focusIso && COUNTRY_CENTERS[focusIso]) {
      const s = map.project(COUNTRY_CENTERS[focusIso]);
      setFocusPos({ x: s.x, y: s.y });
    }
  }, [frame, ready, center, effZoom, durationFrames, revealAt, focusIso, fillId, lineId]);

  // Progression du degagement des blocs (0→1)
  const clearT = interpolate(frame - revealAt, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cleared = backOut(clearT);

  // Bandes de censure : 5 bandes horizontales qui glissent alternativement G/D
  const N = isVertical ? 6 : 5;
  const bandH = height / N;

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 10, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Tampon CLASSIFIED : visible avant le degagement, part avec
  const stampSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 9, stiffness: 200 },
    durationInFrames: 14,
  });
  const stampOpacity = interpolate(frame - revealAt, [0, 8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampRot = -8;

  // Target lock sur le focus apres reveal
  const lockOpacity = interpolate(frame - (revealAt + 16), [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lockPulse = 1 + 0.06 * Math.sin(frame * 0.2);

  const teaseOpacity = interpolate(frame - (revealAt + 14), [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: NAVY, opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* Bandes de censure qui glissent */}
      {cleared < 1 &&
        Array.from({ length: N }).map((_, i) => {
          const dir = i % 2 === 0 ? -1 : 1;
          // vitesse legerement differente par bande
          const speed = 1 + (i % 3) * 0.25;
          const shift = cleared * dir * width * 1.2 * speed;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: i * bandH,
                left: 0,
                width,
                height: bandH + 1,
                background: i % 2 === 0 ? "#0e1626" : "#1a2740",
                transform: `translateX(${shift}px)`,
                borderTop: "1px solid rgba(200,169,81,0.15)",
                display: "flex",
                alignItems: "center",
                paddingLeft: 40,
                overflow: "hidden",
              }}
            >
              {/* fausses lignes de texte caviarde */}
              <div style={{ display: "flex", gap: 16, opacity: 0.5 }}>
                {Array.from({ length: 5 }).map((__, j) => (
                  <div
                    key={j}
                    style={{
                      width: 60 + ((i * 7 + j * 13) % 90),
                      height: 10,
                      background: "rgba(242,235,217,0.25)",
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}

      {/* Tampon CLASSIFIED */}
      {stampOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%,-50%) rotate(${stampRot}deg) scale(${stampSpring})`,
            opacity: stampOpacity,
            border: `6px solid ${accentColor}`,
            borderRadius: 8,
            padding: isVertical ? "16px 36px" : "18px 48px",
          }}
        >
          <span
            style={{
              color: accentColor,
              fontSize: isVertical ? 64 : 80,
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
            }}
          >
            {stampText}
          </span>
        </div>
      )}

      {/* Target lock sur le focus */}
      {focusPos && lockOpacity > 0.01 && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <g
            transform={`translate(${focusPos.x} ${focusPos.y}) scale(${lockPulse})`}
            opacity={lockOpacity}
          >
            <rect x={-50} y={-50} width={100} height={100} fill="none" stroke={accentColor} strokeWidth={2} />
            {/* coins */}
            {[[-50, -50, 1, 1], [50, -50, -1, 1], [-50, 50, 1, -1], [50, 50, -1, -1]].map((c, k) => (
              <g key={k}>
                <line x1={c[0]} y1={c[1]} x2={c[0] + 18 * (c[2] as number)} y2={c[1]} stroke={accentColor} strokeWidth={4} />
                <line x1={c[0]} y1={c[1]} x2={c[0]} y2={c[1] + 18 * (c[3] as number)} stroke={accentColor} strokeWidth={4} />
              </g>
            ))}
            <circle cx={0} cy={0} r={3} fill={accentColor} />
          </g>
        </svg>
      )}

      {/* Accroche tease */}
      {teaseText && (
        <div
          style={{
            position: "absolute",
            bottom: isVertical ? height * 0.14 : height * 0.1,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: teaseOpacity,
          }}
        >
          <span
            style={{
              color: IVORY,
              fontSize: isVertical ? 50 : 44,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "'Bebas Neue', 'Impact', sans-serif",
              textShadow: "0 4px 24px rgba(0,0,0,0.85)",
            }}
          >
            {teaseText}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

export default ClassifiedRedactReveal;
