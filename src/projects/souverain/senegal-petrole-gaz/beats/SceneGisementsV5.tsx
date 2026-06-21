/**
 * SceneGisementsV5 — scene "3 gisements" REFAITE sur la CIBLE CANONIQUE CartoSouverainV5 (brique 2).
 *
 * PAS 1 (squelette) : structure narrative + camera (3 modes valides) + 3 gisements en marqueurs SIMPLES.
 *   But = prouver que l'arc (large -> Sangomar -> GTA+flux -> Yakaar) tient sur le BON fond V5.
 *   Effets riches (drapeaux, flux animes, contagion) = PAS encore (pas 2-3 : storyboard LLM puis catalogue).
 *
 * 4 etats (audio segment 52->104s = 1560f @30fps) :
 *   1 TROIS    : vue large flat (situation Afrique Ouest) — 3 marqueurs offshore Dakar
 *   2 SANGOMAR : zoom relief offshore (pitch ~30) — marqueur petrole
 *   3 GTA      : remonte + dezoom (export) — marqueur gaz
 *   4 YAKAAR   : re-zoom suspens — marqueur en attente
 * Doctrine : la cible porte le registre ; ici on ne fait QUE structure + camera + ancrage geo.
 */
import React, { useRef, useState } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type mapboxgl from "mapbox-gl";
import { CartoSouverainV5 } from "../../../_shared/mapbox/CartoSouverainV5";

const AUDIO_START = 52; // s

// Gisements offshore — VRAIES coords (lon, lat)
const SANGOMAR: [number, number] = [-16.95, 14.0];
const GTA: [number, number] = [-17.05, 15.9];
const YAKAAR: [number, number] = [-17.3, 14.9];

const OCRE = "#e7bd78";
const OCRE_DARK = "#bf9442";
const GAZ_TEAL = "#2a9da0";
const SUSPENS = "#a9a9a0";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// frontieres d'etats (sur 1560f)
const E2 = 360, E3 = 840, E4 = 1260;

export const SceneGisementsV5: React.FC = () => {
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [, force] = useState(0);

  // CAMERA : 4 etats, les 3 modes valides (flat -> country-relief -> dezoom -> relief suspens)
  const camKeys = [
    // E1 situation : vue large flat sur l'Afrique de l'Ouest, Senegal visible
    { atProgress: 0.0, cam: { lon: -13.0, lat: 14.5, zoom: 4.6, pitch: 0, bearing: 0 } },
    { atProgress: E2 / 1560, cam: { lon: -16.0, lat: 14.3, zoom: 5.6, pitch: 18, bearing: 0 } },
    // E2 Sangomar : zoom relief offshore Dakar (country-relief, pitch ~32)
    { atProgress: (E2 + 120) / 1560, cam: { lon: -16.7, lat: 14.1, zoom: 7.0, pitch: 34, bearing: 6 } },
    // E3 GTA : remonte au nord puis DEZOOM export (vue large)
    { atProgress: E3 / 1560, cam: { lon: -16.9, lat: 15.6, zoom: 6.6, pitch: 30, bearing: 8 } },
    { atProgress: (E3 + 200) / 1560, cam: { lon: -8.0, lat: 18.0, zoom: 3.2, pitch: 12, bearing: 0 } },
    // E4 Yakaar : re-zoom suspens offshore
    { atProgress: E4 / 1560, cam: { lon: -17.2, lat: 14.7, zoom: 6.8, pitch: 36, bearing: 10 } },
    { atProgress: 1.0, cam: { lon: -17.3, lat: 14.8, zoom: 7.0, pitch: 38, bearing: 14 } },
  ];

  return (
    <AbsoluteFill>
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={AUDIO_START * fps} />
      <CartoSouverainV5
        camKeys={camKeys}
        focusIsos={["SEN"]}
        onMapReady={(m) => { mapRef.current = m; force((n) => n + 1); }}
      >
        <GisementOverlays mapRef={mapRef} />
      </CartoSouverainV5>
    </AbsoluteFill>
  );
};

// Overlays geo-ancres : reprojetes a chaque frame via map.project() (suivent la camera)
const GisementOverlays: React.FC<{ mapRef: React.MutableRefObject<mapboxgl.Map | null> }> = ({ mapRef }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const map = mapRef.current;
  if (!map) return null;

  const proj = (c: [number, number]) => {
    const p = map.project(c as any);
    return [p.x, p.y] as [number, number];
  };
  const s = proj(SANGOMAR);
  const g = proj(GTA);
  const y = proj(YAKAAR);

  // apparition par etat (marqueurs simples — PAS d'effet riche au pas 1)
  const appear = (start: number) => spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 120 }, durationInFrames: 16 });
  const a1 = appear(20), a2 = appear(40), a3 = appear(60);
  // l'actif courant grossit selon l'etat
  const sangActive = interpolate(frame, [E2, E2 + 30], [0.6, 1], clamp);
  const gtaActive = interpolate(frame, [E3, E3 + 30], [0.6, 1], clamp);
  const yakActive = interpolate(frame, [E4, E4 + 30], [0.6, 1], clamp);

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <Marker x={s[0]} y={s[1]} appear={a1} scale={frame >= E2 ? sangActive : 0.7} color={OCRE} ring={OCRE_DARK} />
      <Marker x={g[0]} y={g[1]} appear={a2} scale={frame >= E3 ? gtaActive : 0.7} color={GAZ_TEAL} ring={GAZ_TEAL} />
      <Marker x={y[0]} y={y[1]} appear={a3} scale={frame >= E4 ? yakActive : 0.7} color={SUSPENS} ring={SUSPENS} dashed />
    </svg>
  );
};

const Marker: React.FC<{ x: number; y: number; appear: number; scale: number; color: string; ring: string; dashed?: boolean }> = ({ x, y, appear, scale, color, ring, dashed }) => {
  if (appear <= 0.01) return null;
  const r = 13 * scale * appear;
  return (
    <g opacity={appear}>
      <circle cx={x} cy={y} r={r + 9} fill="none" stroke={ring} strokeWidth={3} opacity={0.4} strokeDasharray={dashed ? "6 5" : undefined} />
      <circle cx={x} cy={y} r={r} fill={color} stroke="#16213a" strokeWidth={2.5} strokeDasharray={dashed ? "6 5" : undefined} />
    </g>
  );
};

export const SCENE_GISEMENTS_V5_FRAMES = 1560;

export default SceneGisementsV5;
