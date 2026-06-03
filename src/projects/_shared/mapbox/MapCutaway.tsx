/**
 * MapCutaway — INSERT reutilisable : la carte est COUPEE par un interstitiel plein ecran
 * pendant quelques secondes, puis RETOUR fluide sur la carte (avec target lock optionnel).
 *
 * Pattern identifie par Aziz a partir de RapidFireCountries + ClassifiedRedactReveal :
 * "au lieu d'etre 100% sur la carte, on coupe vers une image/donnee/revelation quelques
 * secondes, puis on revient sur la carte". = le 'cutaway' des grandes chaines.
 *
 * 4 MODES de contenu (prop `mode`) :
 *   - "image"  : illustration/photo stylisee plein cadre + titre + sous-texte
 *   - "stat"   : chiffre geant + label (donnee choc)
 *   - "reveal" : texte fort / citation plein ecran (dramatique)
 *   - "flag"   : drapeau plein cadre + nom pays (facon RapidFire)
 *
 * Structure temporelle :
 *   0 → inAt           : carte seule (drift)
 *   inAt → outAt       : interstitiel plein ecran (entree punch, contenu, sortie)
 *   outAt → fin        : retour carte + target lock sur focusIso
 *
 * Carte Mapbox : drift fluide continu dessous (jamais coupee techniquement, juste masquee
 * par l'overlay) → pas de rechargement de tuiles au retour.
 *
 * Usage :
 *   <MapCutaway center={[-14.5,14.5]} baseZoom={5.4} focusIso="SEN"
 *     mode="stat" bigText="2,4 MDS $" subText="PRODUCTION ANNUELLE"
 *     inAt={20} outAt={70} />
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
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { applyGeoAfriqueV5, MapboxBrandingHide, COUNTRY_CENTERS } from "./MapboxBase";
import { TypewriterText } from "../components/TypewriterText";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";
const GOLD = "#c8a951";
const IVORY = "#f2ebd9";
const NAVY = "#16213a";

export type CutawayMode = "image" | "stat" | "reveal" | "flag";

export interface MapCutawayProps {
  center: [number, number];
  baseZoom?: number;
  focusIso?: string;
  mode: CutawayMode;
  /** image : chemin staticFile · flag : ignore (utilise flagCode) */
  image?: string;
  /** flag : ISO-2 flagcdn */
  flagCode?: string;
  /** stat : gros chiffre · reveal : phrase · image/flag : titre */
  bigText?: string;
  /** sous-texte / label */
  subText?: string;
  /** frame d'entree de l'interstitiel */
  inAt?: number;
  /** frame de sortie de l'interstitiel (retour carte) */
  outAt?: number;
  accentColor?: string;
  driftAmplitude?: number;
  durationFrames?: number;
  /** afficher le target lock au retour. Defaut true si focusIso. */
  targetLock?: boolean;
}

const backOut = (t: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export const MapCutaway: React.FC<MapCutawayProps> = ({
  center,
  baseZoom = 5.0,
  focusIso,
  mode,
  image,
  flagCode,
  bigText,
  subText,
  inAt = 18,
  outAt = 68,
  accentColor = GOLD,
  driftAmplitude = 0,
  durationFrames = 120,
  targetLock = true,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const isVertical = height > width;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [handle] = useState(() => delayRender("MapCutaway init"));
  const [ready, setReady] = useState(false);
  const [focusPos, setFocusPos] = useState<{ x: number; y: number } | null>(null);

  const effZoom = baseZoom + (isVertical ? 0 : -0.4);
  const fillId = `cut-fill-${focusIso}`;
  const lineId = `cut-line-${focusIso}`;

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
    const driftBearing = interpolate(frame, [0, durationFrames], [-2, 2]);
    const driftZoom = effZoom + interpolate(frame, [0, durationFrames], [0, 0.12]);
    const driftLat = isVertical ? interpolate(frame, [0, durationFrames], [-1, 1]) * driftAmplitude : 0;
    const driftLon = !isVertical ? interpolate(frame, [0, durationFrames], [-1, 1]) * driftAmplitude : 0;
    map.jumpTo({
      center: [center[0] + driftLon, center[1] + driftLat],
      zoom: driftZoom,
      bearing: driftBearing,
      pitch: 0,
    });

    if (focusIso) {
      // le pays s'allume au RETOUR (apres outAt)
      const rel = frame - outAt;
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
      if (COUNTRY_CENTERS[focusIso]) {
        const s = map.project(COUNTRY_CENTERS[focusIso]);
        setFocusPos({ x: s.x, y: s.y });
      }
    }
  }, [frame, ready, center, effZoom, durationFrames, outAt, focusIso, isVertical, driftAmplitude, fillId, lineId]);

  // ── Etat de l'interstitiel ──────────────────────────────────────────────────
  // entree : inAt → inAt+8 (slide/scale in) · sortie : outAt-8 → outAt (slide out)
  const enterT = interpolate(frame, [inAt, inAt + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitT = interpolate(frame, [outAt - 8, outAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const interVisible = frame >= inAt && frame < outAt;
  // panneau : entre par le bas (vertical) ou par cote, sort par l'oppose
  const panelShift = (1 - backOut(enterT)) * height * 0.5 + backOut(exitT) * -height * 0.6;
  const interOpacity = Math.min(enterT, 1 - exitT);

  const globalOpacity = interpolate(
    frame,
    [durationFrames - 10, durationFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // target lock au retour
  const lockOpacity = interpolate(frame - (outAt + 6), [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lockPulse = 1 + 0.06 * Math.sin(frame * 0.2);

  const bigSize = mode === "stat" ? (isVertical ? 150 : 180) : isVertical ? 64 : 72;
  const subSize = isVertical ? 36 : 40;

  // Les textes s'ecrivent (typewriter) apres l'entree de l'overlay
  const titleStartAt = inAt + 8;
  // vitesse de frappe selon mode (stat = plus rapide car court, reveal = pose)
  const titleSpeed = mode === "stat" ? 1.2 : 1.5;
  // sous-texte commence quand le titre est ~fini
  const subStartAt = (txt: string) => titleStartAt + (txt ? txt.length * titleSpeed : 0) + 4;

  return (
    <AbsoluteFill style={{ background: NAVY, opacity: globalOpacity }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0, width, height }} />
      <MapboxBrandingHide />

      {/* Target lock au retour sur la carte */}
      {focusPos && targetLock && lockOpacity > 0.01 && (
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <g transform={`translate(${focusPos.x} ${focusPos.y}) scale(${lockPulse})`} opacity={lockOpacity}>
            <rect x={-46} y={-46} width={92} height={92} fill="none" stroke={accentColor} strokeWidth={1.5} opacity={0.6} />
            {[[-46, -46, 1, 1], [46, -46, -1, 1], [-46, 46, 1, -1], [46, 46, -1, -1]].map((c, k) => (
              <g key={k}>
                <line x1={c[0]} y1={c[1]} x2={c[0] + 16 * (c[2] as number)} y2={c[1]} stroke={accentColor} strokeWidth={4} />
                <line x1={c[0]} y1={c[1]} x2={c[0]} y2={c[1] + 16 * (c[3] as number)} stroke={accentColor} strokeWidth={4} />
              </g>
            ))}
            <circle cx={0} cy={0} r={3} fill={accentColor} />
          </g>
        </svg>
      )}

      {/* INTERSTITIEL plein ecran */}
      {interVisible && interOpacity > 0.01 && (
        <AbsoluteFill
          style={{
            background: mode === "image" || mode === "flag" ? "rgba(22,33,58,0.9)" : NAVY,
            opacity: interOpacity,
            transform: `translateY(${panelShift}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {/* MODE IMAGE */}
          {mode === "image" && image && (
            <>
              <img
                src={staticFile(image)}
                style={{
                  width: isVertical ? "82%" : "auto",
                  height: isVertical ? "auto" : "62%",
                  maxHeight: isVertical ? "56%" : "62%",
                  objectFit: "cover",
                  border: `3px solid ${accentColor}`,
                  boxShadow: "0 16px 60px rgba(0,0,0,0.6)",
                }}
              />
              {bigText && (
                <TypewriterText text={bigText} startAt={titleStartAt} speed={titleSpeed} style={{ color: IVORY, fontSize: bigSize, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Bebas Neue','Impact',sans-serif", textShadow: `0 0 24px ${accentColor}` }} />
              )}
              {subText && (
                <TypewriterText text={subText} startAt={subStartAt(bigText ?? "")} speed={1.5} cursorColor={accentColor} style={{ color: accentColor, fontSize: subSize, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono',monospace" }} />
              )}
            </>
          )}

          {/* MODE FLAG */}
          {mode === "flag" && flagCode && (
            <>
              <img
                src={`https://flagcdn.com/w1280/${flagCode}.png`}
                style={{ width: isVertical ? "84%" : "auto", height: isVertical ? "auto" : "44%", objectFit: "cover", border: `3px solid ${accentColor}`, boxShadow: "0 16px 60px rgba(0,0,0,0.6)" }}
              />
              {bigText && (
                <TypewriterText text={bigText} startAt={titleStartAt} speed={2} style={{ color: IVORY, fontSize: isVertical ? 100 : 120, fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase", fontFamily: "'Bebas Neue','Impact',sans-serif", textShadow: `0 0 28px ${accentColor}` }} />
              )}
            </>
          )}

          {/* MODE STAT */}
          {mode === "stat" && (
            <>
              <div style={{ width: 64, height: 3, background: accentColor }} />
              {bigText && (
                <TypewriterText text={bigText} startAt={titleStartAt} speed={titleSpeed} as="div" style={{ color: GOLD, fontSize: bigSize, fontWeight: 900, lineHeight: 1, letterSpacing: "0.02em", fontFamily: "'Bebas Neue','Impact',sans-serif", textShadow: `0 0 40px rgba(200,169,81,0.4)` }} />
              )}
              {subText && (
                <TypewriterText text={subText} startAt={subStartAt(bigText ?? "")} speed={1.5} as="div" style={{ color: IVORY, fontSize: subSize, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono',monospace", opacity: 0.85 }} />
              )}
            </>
          )}

          {/* MODE REVEAL */}
          {mode === "reveal" && (
            <div style={{ padding: "0 10%", textAlign: "center" }}>
              {bigText && (
                <TypewriterText text={bigText} startAt={titleStartAt} speed={1.5} as="div" style={{ color: IVORY, fontSize: isVertical ? 64 : 72, fontWeight: 700, lineHeight: 1.1, letterSpacing: "0.02em", textTransform: "uppercase", fontFamily: "'Bebas Neue','Impact',sans-serif", textShadow: "0 4px 30px rgba(0,0,0,0.8)" }} />
              )}
              {subText && (
                <div style={{ marginTop: 24 }}>
                  <TypewriterText text={subText} startAt={subStartAt(bigText ?? "")} speed={1.5} cursorColor={accentColor} as="div" style={{ color: accentColor, fontSize: subSize, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono',monospace" }} />
                </div>
              )}
            </div>
          )}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default MapCutaway;
