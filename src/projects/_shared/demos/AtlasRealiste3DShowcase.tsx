/**
 * Showcase Template C — Atlas Réaliste 3D V3 (post-jury Jour 3)
 *
 * Verdict jury 3 LLMs : KEEP Phase C (hillshade seul), REWORK overlay monde gris.
 * Ce showcase expose UNIQUEMENT le pattern validé : satellite + hillshade + pays focus or.
 *
 * 2 phases (180f chacune = 12s total) :
 *
 * Phase A (f0-180)   : Vue continentale Niger
 *   - Camera large sur l'Afrique de l'Ouest, Niger en or
 *   - Pitch 45° pour relief
 *   - Vignetage subtil sur les bords (recommandation Gemini)
 *
 * Phase B (f180-360) : Zoom Mali
 *   - Camera plus rapprochee sur le Mali
 *   - Pitch 50°
 *   - Demonstration que le template fonctionne pour differents pays/zoom
 */

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MapboxBrandingHide } from "../mapbox/MapboxBase";
import { applyAtlasRealiste3D, addCountryFocus, ATLAS3D_PALETTE } from "../mapbox/templates/AtlasRealiste3D";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

const PHASE_DUR = 180;
const FADE = 14;
export const ATLAS_REALISTE_3D_SHOWCASE_FRAMES = PHASE_DUR * 2;

// Camera Niger : vue large Afrique de l'Ouest
const CAM_A = { lon: 6.0, lat: 16.0, zoom: 3.4, pitch: 45, bearing: -8 };
// Camera Mali : zoom plus rapproche
const CAM_B = { lon: -3.5, lat: 17.5, zoom: 3.8, pitch: 50, bearing: 5 };

const PHASE_LABELS = [
  { title: "Niger", sub: "Sahel — vue continentale" },
  { title: "Mali",  sub: "Boucle du Niger — zoom relief" },
];

const phaseOpacity = (frame: number, phaseStart: number): number =>
  interpolate(frame, [phaseStart, phaseStart + FADE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fadeOut = (frame: number, phaseEnd: number): number =>
  interpolate(frame, [phaseEnd - FADE, phaseEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

type MapInstance = { map: mapboxgl.Map; phase: number };

export const AtlasRealiste3DShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const refA = useRef<HTMLDivElement>(null);
  const refB = useRef<HTMLDivElement>(null);
  const mapsRef = useRef<MapInstance[]>([]);
  const [handle] = useState(() => delayRender("AtlasRealiste3DShowcase"));
  const readyCount = useRef(0);

  const phase = Math.min(1, Math.floor(frame / PHASE_DUR));

  const opA = Math.min(phaseOpacity(frame, 0), fadeOut(frame, PHASE_DUR));
  const opB = phaseOpacity(frame, PHASE_DUR);

  useEffect(() => {
    if (!refA.current || !refB.current) return;
    if (mapsRef.current.length > 0) return;
    if (!MAPBOX_TOKEN) { continueRender(handle); return; }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const onReady = () => {
      readyCount.current += 1;
      if (readyCount.current === 2) continueRender(handle);
    };

    const mapA = new mapboxgl.Map({
      container: refA.current!,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [CAM_A.lon, CAM_A.lat],
      zoom: CAM_A.zoom,
      pitch: CAM_A.pitch,
      bearing: CAM_A.bearing,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
    });
    mapA.on("style.load", () => {
      if (typeof (mapA as any).setProjection === "function") (mapA as any).setProjection("mercator");
      applyAtlasRealiste3D(mapA);
      addCountryFocus(mapA, "NER", ATLAS3D_PALETTE.accentOr, 0.62);
      mapsRef.current.push({ map: mapA, phase: 0 });
      onReady();
    });

    const mapB = new mapboxgl.Map({
      container: refB.current!,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [CAM_B.lon, CAM_B.lat],
      zoom: CAM_B.zoom,
      pitch: CAM_B.pitch,
      bearing: CAM_B.bearing,
      interactive: false,
      attributionControl: false,
      preserveDrawingBuffer: true,
    });
    mapB.on("style.load", () => {
      if (typeof (mapB as any).setProjection === "function") (mapB as any).setProjection("mercator");
      applyAtlasRealiste3D(mapB);
      addCountryFocus(mapB, "MLI", ATLAS3D_PALETTE.accentOr, 0.62);
      mapsRef.current.push({ map: mapB, phase: 1 });
      onReady();
    });

    return () => {
      mapsRef.current.forEach(({ map }) => map.remove());
      mapsRef.current = [];
    };
  }, [handle]);

  // Sync camera (jumpTo simple, pas de lerp pour ce showcase)
  useEffect(() => {
    mapsRef.current.forEach(({ map, phase: p }) => {
      const cam = [CAM_A, CAM_B][p];
      map.jumpTo({ center: [cam.lon, cam.lat], zoom: cam.zoom, pitch: cam.pitch, bearing: cam.bearing ?? 0 });
    });
  }, [frame]);

  const label = PHASE_LABELS[phase];
  const labelOpacity = [opA, opB][phase];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <MapboxBrandingHide />

      <div ref={refA} style={{ position: "absolute", inset: 0, width, height, opacity: opA }} />
      <div ref={refB} style={{ position: "absolute", inset: 0, width, height, opacity: opB }} />

      {/* Vignetage bords (recommandation Gemini Jour 3) */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        pointerEvents: "none",
      }} />

      {/* Cartouche label phase */}
      <div style={{
        position: "absolute",
        left: 44,
        top: 80,
        opacity: labelOpacity,
      }}>
        <div style={{
          backgroundColor: ATLAS3D_PALETTE.cartoucheBackground,
          border: `1px solid ${ATLAS3D_PALETTE.cartoucheBorder}`,
          padding: "16px 24px",
          maxWidth: 520,
        }}>
          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 36,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: 0.5,
          }}>
            {label.title}
          </div>
          <div style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: 22,
            color: ATLAS3D_PALETTE.accentOr,
            marginTop: 6,
          }}>
            {label.sub}
          </div>
        </div>
      </div>

      {/* Phase indicator bas */}
      <div style={{
        position: "absolute",
        bottom: 48,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 16,
      }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            width: phase === i ? 32 : 12,
            height: 6,
            borderRadius: 3,
            backgroundColor: phase === i ? ATLAS3D_PALETTE.accentOr : "rgba(255,255,255,0.3)",
          }} />
        ))}
      </div>

      <div style={{
        position: "absolute",
        left: 44,
        bottom: 44,
        fontFamily: "Georgia, serif",
        fontSize: 16,
        color: "rgba(255,255,255,0.45)",
        fontStyle: "italic",
      }}>
        Souverain — Atlas 3D V3
      </div>
    </AbsoluteFill>
  );
};
