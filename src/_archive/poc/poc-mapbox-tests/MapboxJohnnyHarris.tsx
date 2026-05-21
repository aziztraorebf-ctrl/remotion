/**
 * MapboxJohnnyHarris — style documentaire YouTube cartographique
 *
 * Technique : identique à Vox / Johnny Harris / ces vidéos Croatie
 *   - Fond Mapbox satellite (pas de style vectoriel)
 *   - SVG overlay via map.project([lon, lat]) → coordonnées pixel
 *   - Assets 2D surdimensionnés (drapeaux, icônes, highlight pays)
 *   - Zoom cinématique Mapbox calé sur frames Remotion
 *
 * Scène : Ghana — 6 secondes
 *   0–40f   : vue large Afrique de l'Ouest, satellite, aucun asset
 *   40–80f  : zoom-in vers Ghana, frontière s'allume
 *   80–120f : drapeau Ghana apparaît (pop + wave)
 *   120–180f: icône bâtiment apparaît sur Kumasi + label
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
import { MapboxBrandingHide } from "../_shared/mapbox/MapboxBase";

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN ?? "";

export const MAPBOX_JOHNNY_HARRIS_FRAMES = 180; // 6s @ 30fps

// ---------------------------------------------------------------------------
// Points géo
// ---------------------------------------------------------------------------
const GHANA_CENTER  = { lon: -1.023,  lat:  7.947 };
const KUMASI        = { lon: -1.6236, lat:  6.6885 };
const ACCRA         = { lon: -0.187,  lat:  5.603  };
const AFRICA_CENTER = { lon: -2.0,    lat: 11.0    };

// ---------------------------------------------------------------------------
// Caméra — keyframes
// ---------------------------------------------------------------------------
// Phase 1 : vue large
const CAM_WIDE  = { center: [AFRICA_CENTER.lon, AFRICA_CENTER.lat] as [number,number], zoom: 3.5, pitch: 0,  bearing: 0  };
// Phase 2 : zoom Ghana
const CAM_GHANA = { center: [GHANA_CENTER.lon,  GHANA_CENTER.lat]  as [number,number], zoom: 6.5, pitch: 30, bearing: -5 };
// Phase 3 : vue Kumasi rapprochée
const CAM_CLOSE = { center: [KUMASI.lon,         KUMASI.lat]        as [number,number], zoom: 9.5, pitch: 45, bearing: 10 };

const KF = { ZOOM_START: 40, ZOOM_END: 80, FLAG_START: 80, ICON_START: 120 };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function lerpVal(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

// ---------------------------------------------------------------------------
// SVG — Drapeau Ghana surdimensionné avec mât
// Style exact "Johnny Harris" : grand, lisible, avec wave animation
// ---------------------------------------------------------------------------
const DrapeauGhana: React.FC<{ progress: number; frame: number }> = ({ progress, frame }) => {
  const scale = spring({
    frame: Math.max(0, progress * 20),
    fps: 30,
    config: { damping: 12, stiffness: 100 },
  });
  const opacity = interpolate(progress, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });

  // Wave effect — ondulation du drapeau sur l'axe X
  const wave = Math.sin(frame * 0.15) * 4;
  const wave2 = Math.sin(frame * 0.15 + 1) * 3;

  const W = 120; // largeur drapeau
  const H = 80;  // hauteur drapeau
  const MAT = 140; // hauteur du mât

  return (
    <g opacity={opacity} style={{ transform: `scale(${scale})`, transformOrigin: "0px 0px" }}>
      {/* Mât */}
      <line
        x1={0} y1={0}
        x2={0} y2={-MAT}
        stroke="#8B4513"
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Ombre mât */}
      <line
        x1={2} y1={0}
        x2={2} y2={-MAT}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={3}
        strokeLinecap="round"
      />

      {/* Drapeau — 3 bandes + étoile noire (flag Ghana) avec wave */}
      <g transform={`translate(0, ${-MAT})`}>
        {/* Bande rouge (haut) — légèrement déformée pour l'ondulation */}
        <path
          d={`M 0,0 Q ${W/2},${wave} ${W},${wave2} L ${W},${H/3} Q ${W/2},${H/3+wave} 0,${H/3} Z`}
          fill="#CE1126"
        />
        {/* Bande or (milieu) */}
        <path
          d={`M 0,${H/3} Q ${W/2},${H/3+wave} ${W},${H/3+wave2} L ${W},${2*H/3} Q ${W/2},${2*H/3+wave} 0,${2*H/3} Z`}
          fill="#FCD116"
        />
        {/* Bande verte (bas) */}
        <path
          d={`M 0,${2*H/3} Q ${W/2},${2*H/3+wave} ${W},${2*H/3+wave2} L ${W},${H} Q ${W/2},${H+wave} 0,${H} Z`}
          fill="#006B3F"
        />
        {/* Étoile noire centrale */}
        <text
          x={W/2 + wave/2}
          y={H/2 + 9}
          textAnchor="middle"
          fontSize={32}
          fill="#000"
        >
          ★
        </text>
        {/* Contour du drapeau */}
        <rect x={0} y={0} width={W} height={H} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
      </g>

      {/* Label GHANA sous le mât */}
      <text
        x={W / 2}
        y={24}
        textAnchor="middle"
        fill="#FCD116"
        fontSize={20}
        fontFamily="Impact, Arial Black, sans-serif"
        fontWeight="900"
        letterSpacing={3}
        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
      >
        GHANA
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// SVG — Icône bâtiment / monument (style cartoon YouTube)
// Représente Kumasi — capitale Ashanti
// ---------------------------------------------------------------------------
const IconeMonument: React.FC<{ progress: number }> = ({ progress }) => {
  const scale = spring({
    frame: Math.max(0, progress * 20),
    fps: 30,
    config: { damping: 8, stiffness: 120 },
  });
  const opacity = interpolate(progress, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g opacity={opacity} style={{ transform: `scale(${scale})`, transformOrigin: "0px 0px" }}>
      {/* Base du bâtiment */}
      <rect x={-22} y={-55} width={44} height={40} rx={3} fill="#D4AF37" stroke="#8B6914" strokeWidth={2} />
      {/* Colonnes */}
      {[-14, -5, 4, 13].map((x) => (
        <rect key={x} x={x} y={-52} width={5} height={34} rx={1} fill="#C4A027" />
      ))}
      {/* Toit triangulaire */}
      <polygon points="0,-70 -28,-18 28,-18" fill="#CE1126" stroke="#8B0000" strokeWidth={1.5} />
      {/* Sommet — dôme */}
      <circle cx={0} cy={-72} r={6} fill="#FCD116" stroke="#8B6914" strokeWidth={1.5} />
      {/* Escalier */}
      <rect x={-18} y={-15} width={36} height={5} rx={1} fill="#B8960A" />
      <rect x={-14} y={-10} width={28} height={4} rx={1} fill="#B8960A" />
      {/* Point d'ancrage */}
      <circle cx={0} cy={10} r={4} fill="#CE1126" />
      <line x1={0} y1={6} x2={0} y2={0} stroke="#CE1126" strokeWidth={2} />
      {/* Label */}
      <text
        x={0} y={28}
        textAnchor="middle"
        fill="#FCD116"
        fontSize={14}
        fontFamily="Impact, Arial Black, sans-serif"
        fontWeight="900"
        letterSpacing={2}
      >
        KUMASI
      </text>
      <text
        x={0} y={44}
        textAnchor="middle"
        fill="rgba(255,255,255,0.8)"
        fontSize={10}
        fontFamily="Arial, sans-serif"
      >
        Capitale Ashanti
      </text>
    </g>
  );
};

// ---------------------------------------------------------------------------
// SVG — Highlight pays (contour lumineux pulsant)
// Cercle géant semi-transparent pour simuler le highlight de frontière
// ---------------------------------------------------------------------------
const HighlightPays: React.FC<{ progress: number; frame: number; screenW: number; screenH: number }> = ({
  progress, frame, screenW, screenH,
}) => {
  const opacity = interpolate(progress, [0, 0.4], [0, 0.35], { extrapolateRight: "clamp" });
  // Pulsation lente
  const pulse = 1 + Math.sin(frame * 0.08) * 0.03;

  return (
    <g opacity={opacity}>
      {/* Vignette colorée Ghana — zone approximative */}
      <ellipse
        cx={screenW * 0.42}
        cy={screenH * 0.62}
        rx={screenW * 0.18 * pulse}
        ry={screenH * 0.22 * pulse}
        fill="rgba(252, 209, 22, 0.15)"
        stroke="#FCD116"
        strokeWidth={2}
        strokeDasharray="8 4"
      />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Hook — projeter coordonnées géo → pixels écran via Mapbox
// ---------------------------------------------------------------------------
function useProjection(map: mapboxgl.Map | null, pts: Array<{lon: number; lat: number}>) {
  const [pos, setPos] = useState<Array<{x: number; y: number} | null>>(pts.map(() => null));

  useEffect(() => {
    if (!map) return;
    const update = () => {
      setPos(pts.map(({ lon, lat }) => {
        const p = map.project([lon, lat]);
        return { x: p.x, y: p.y };
      }));
    };
    map.on("render", update);
    update();
    return () => { map.off("render", update); };
  }, [map]);

  return pos;
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------
export const MapboxJohnnyHarris: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("mapbox-johnny-harris"));

  // Init carte
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      // Satellite — exactement comme les vidéos YouTube cartographiques
      style: "mapbox://styles/mapbox/satellite-v9",
      center: CAM_WIDE.center,
      zoom: CAM_WIDE.zoom,
      pitch: CAM_WIDE.pitch,
      bearing: CAM_WIDE.bearing,
      interactive: false,
      preserveDrawingBuffer: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      setReady(true);
      continueRender(handle);
    });

    map.on("error", (e) => {
      console.error("[JohnnyHarris] Map error:", e.error);
      continueRender(handle);
    });

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Animation caméra calée sur frames
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (frame < KF.ZOOM_START) {
      // Phase 1 — vue large
      map.jumpTo({ center: CAM_WIDE.center, zoom: CAM_WIDE.zoom, pitch: CAM_WIDE.pitch, bearing: CAM_WIDE.bearing });

    } else if (frame < KF.ZOOM_END) {
      // Phase 2 — zoom vers Ghana
      const t = easeInOut((frame - KF.ZOOM_START) / (KF.ZOOM_END - KF.ZOOM_START));
      map.jumpTo({
        center: [
          lerpVal(CAM_WIDE.center[0], CAM_GHANA.center[0], t),
          lerpVal(CAM_WIDE.center[1], CAM_GHANA.center[1], t),
        ],
        zoom:    lerpVal(CAM_WIDE.zoom,    CAM_GHANA.zoom,    t),
        pitch:   lerpVal(CAM_WIDE.pitch,   CAM_GHANA.pitch,   t),
        bearing: lerpVal(CAM_WIDE.bearing, CAM_GHANA.bearing, t),
      });

    } else if (frame < KF.ICON_START) {
      // Phase 3 — maintien vue Ghana avec drapeau
      map.jumpTo({ center: CAM_GHANA.center, zoom: CAM_GHANA.zoom, pitch: CAM_GHANA.pitch, bearing: CAM_GHANA.bearing });

    } else {
      // Phase 4 — zoom rapproché Kumasi
      const t = easeInOut((frame - KF.ICON_START) / (durationInFrames - KF.ICON_START));
      map.jumpTo({
        center: [
          lerpVal(CAM_GHANA.center[0], CAM_CLOSE.center[0], t),
          lerpVal(CAM_GHANA.center[1], CAM_CLOSE.center[1], t),
        ],
        zoom:    lerpVal(CAM_GHANA.zoom,    CAM_CLOSE.zoom,    t),
        pitch:   lerpVal(CAM_GHANA.pitch,   CAM_CLOSE.pitch,   t),
        bearing: lerpVal(CAM_GHANA.bearing, CAM_CLOSE.bearing, t),
      });
    }
  }, [frame, durationInFrames]);

  // Projeter les points géo → pixels
  const [posAccra, posKumasi, posGhanaCenter] = useProjection(mapRef.current, [
    ACCRA,
    KUMASI,
    GHANA_CENTER,
  ]);

  // Progress par phase
  const flagProgress  = Math.max(0, Math.min(1, (frame - KF.FLAG_START)  / 30));
  const iconProgress  = Math.max(0, Math.min(1, (frame - KF.ICON_START)  / 30));
  const hlProgress    = Math.max(0, Math.min(1, (frame - KF.ZOOM_END)    / 20));

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MapboxBrandingHide />

      {/* Carte Mapbox satellite */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />

      {/* Overlay SVG — tous les assets 2D */}
      {ready && (
        <svg
          style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
          width={width}
          height={height}
        >
          {/* Highlight Ghana — ellipse pulsante */}
          {hlProgress > 0 && (
            <HighlightPays
              progress={hlProgress}
              frame={frame}
              screenW={width}
              screenH={height}
            />
          )}

          {/* Drapeau Ghana — ancré sur le centre du pays */}
          {posGhanaCenter && flagProgress > 0 && (
            <g transform={`translate(${posGhanaCenter.x}, ${posGhanaCenter.y})`}>
              <DrapeauGhana progress={flagProgress} frame={frame} />
            </g>
          )}

          {/* Icône monument — ancré sur Kumasi */}
          {posKumasi && iconProgress > 0 && (
            <g transform={`translate(${posKumasi.x}, ${posKumasi.y})`}>
              <IconeMonument progress={iconProgress} />
            </g>
          )}

          {/* Point Accra — petite épingle discrète */}
          {posAccra && hlProgress > 0 && (
            <g transform={`translate(${posAccra.x}, ${posAccra.y})`} opacity={interpolate(hlProgress, [0.5, 1], [0, 1], { extrapolateRight: "clamp" })}>
              <circle r={5} fill="#CE1126" stroke="#fff" strokeWidth={1.5} />
              <text x={8} y={4} fill="#fff" fontSize={11} fontFamily="Arial, sans-serif" fontWeight="bold">Accra</text>
            </g>
          )}
        </svg>
      )}

      {/* Label phase — debug discret */}
      <div style={{
        position: "absolute", bottom: 16, left: 16,
        background: "rgba(0,0,0,0.6)", color: "#fff",
        fontFamily: "monospace", fontSize: 12, padding: "4px 10px", borderRadius: 3,
      }}>
        {frame < KF.ZOOM_START  ? "Vue large Afrique" :
         frame < KF.ZOOM_END    ? "Zoom → Ghana" :
         frame < KF.FLAG_START  ? "Ghana en vue" :
         frame < KF.ICON_START  ? "Drapeau apparu" :
                                  "Zoom Kumasi"}
        {" "}| f{frame}
      </div>
    </AbsoluteFill>
  );
};
