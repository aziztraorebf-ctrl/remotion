/**
 * TokenShowcaseV5 — SCENE DE TEST JETABLE (session 2026-06-21).
 *
 * But : juger les 5 variantes de jeton geo-ancre cote a cote, sur la cible V5, avec la camera-plonge.
 * PAS d'audio. 100% premium, juste pour voir le rendu + le mouvement. A SUPPRIMER apres jugement.
 *
 * 5 jetons sur 5 points offshore Senegal :
 *   sonar (temoin) · gas (SVG natif flamme) · oil (image Gemini LUMINEUSE) · flag (drapeau SN) · seal (sceau evenement)
 * La camera etablit la vue large puis PLONGE en relief successivement sur chaque point.
 */
import React, { useRef, useState } from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig, spring } from "remotion";
import type mapboxgl from "mapbox-gl";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { CartoSouverainV5 } from "../CartoSouverainV5";
import { GeoCountryPlaque } from "../GeoCountryPlaque";
import { GisementMarker, type GisementKind } from "../GisementTokens";
import { drawFlagCanvas } from "../flagCanvas";
import { MapboxCountryFlagDecal } from "../MapboxCountryFlagDecal";

const { fontFamily: BEBAS } = loadBebas();
const IVORY = "#f2efe6";

const DUR = 600; // 20s

// 5 points offshore Senegal (lon, lat) bien espaces
type Pt = { name: string; coord: [number, number]; kind: GisementKind; start: number; plaqueY: number; label: string };
const PTS: Pt[] = [
  { name: "P1", coord: [-17.4, 14.2], kind: "sonar", start: 20,  plaqueY: 120, label: "SONAR (temoin)" },
  { name: "P2", coord: [-17.55, 14.9], kind: "gas",  start: 60,  plaqueY: 260, label: "GAZ (SVG natif)" },
  { name: "P3", coord: [-17.7, 15.6], kind: "oil",   start: 100, plaqueY: 400, label: "PETROLE (image)" },
  { name: "P4", coord: [-17.45, 13.6], kind: "flag", start: 140, plaqueY: 540, label: "DRAPEAU (War-Map)" },
  { name: "P5", coord: [-17.85, 14.5], kind: "seal", start: 180, plaqueY: 680, label: "SCEAU (evenement)" },
];
const OIL_IMG = "souverain/senegal-petrole-gaz/scene-gisements/jeton-petrole-bright-square.png";
const FLAG_SN = "_shared/flags/sn.png";
const PLAQUE_X = 250;

export const TokenShowcaseV5: React.FC = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [, force] = useState(0);

  // camera : vue large, puis plongee relief sur chaque point (spring entre les 5)
  const dive = (c: [number, number], bearing: number) => ({ lon: c[0] + 0.02, lat: c[1] - 0.22, zoom: 7.6, pitch: 40, bearing });
  const camKeys = [
    { atProgress: 0,        cam: { lon: -17.6, lat: 14.6, zoom: 6.0, pitch: 4, bearing: 0 } },
    { atProgress: 70 / DUR, cam: { lon: -17.6, lat: 14.6, zoom: 6.1, pitch: 6, bearing: 0 } },
    { atProgress: 120 / DUR, cam: dive(PTS[0].coord, -6) },
    { atProgress: 170 / DUR, cam: dive(PTS[0].coord, -6) },
    { atProgress: 220 / DUR, cam: dive(PTS[1].coord, 5) },
    { atProgress: 265 / DUR, cam: dive(PTS[1].coord, 5) },
    { atProgress: 315 / DUR, cam: dive(PTS[2].coord, -4) },
    { atProgress: 360 / DUR, cam: dive(PTS[2].coord, -4) },
    { atProgress: 410 / DUR, cam: dive(PTS[3].coord, 7) },
    { atProgress: 455 / DUR, cam: dive(PTS[3].coord, 7) },
    { atProgress: 505 / DUR, cam: dive(PTS[4].coord, 0) },
    { atProgress: 550 / DUR, cam: dive(PTS[4].coord, 0) },
    // pull back final : revoir les 5 ensemble
    { atProgress: 1.0,      cam: { lon: -17.55, lat: 14.6, zoom: 6.0, pitch: 8, bearing: 0 } },
  ];

  return (
    <AbsoluteFill>
      <CartoSouverainV5
        camKeys={camKeys}
        focusIsos={[]}
        onMapReady={(m) => { mapRef.current = m; force((n) => n + 1); }}
      >
        <Overlay mapRef={mapRef} />
      </CartoSouverainV5>
    </AbsoluteFill>
  );
};

const Overlay: React.FC<{ mapRef: React.MutableRefObject<mapboxgl.Map | null> }> = ({ mapRef }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const map = mapRef.current;
  if (!map) return null;
  const P = (c: [number, number]) => { const p = map.project(c as any); return [p.x, p.y] as [number, number]; };
  const zoom = map.getZoom();

  return (
    <>
      {/* SOLUTION DEFINITIVE : drapeau-decal (source image Mapbox, decoupe a la silhouette).
          Suit le terrain au pitch (pas de derive) + pas de carrelage au dezoom. */}
      <MapboxCountryFlagDecal mapRef={mapRef} iso="SEN" geoNames={["Senegal"]} drawFlag={(s) => drawFlagCanvas("SEN", s)} />
      {/* Brique "couleurs nationales" (pays secondaire evoque) : le Mali voisin colore aux couleurs
          de son drapeau (vert/jaune/rouge, sans embleme). Carte vivante, hierarchie : SEN=heros, MLI=secondaire. */}
      <MapboxCountryFlagDecal mapRef={mapRef} iso="MLI" geoNames={["Mali"]} drawFlag={(s) => drawFlagCanvas("MLI", s)} opacity={0.78} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {/* titre */}
        <text x={42} y={64} fontFamily={BEBAS} fontSize={48} letterSpacing={1.5} fill={IVORY} opacity={0.9}>
          JETONS — 5 VARIANTES
        </text>
        {/* leaders + jetons */}
        {PTS.map((pt) => {
          const [x, y] = P(pt.coord);
          const t = frame - pt.start;
          if (t < -2) return null;
          const scale = spring({ frame: t, fps, config: { damping: 16, mass: 0.8 } });
          const appeared = t > 44;
          return (
            <g key={pt.name}>
              <Leader x1={x} y1={y} x2={PLAQUE_X + 10} y2={pt.plaqueY + 30} op={Math.min(0.85, Math.max(0, (t - 10) / 20))} />
              <GisementMarker
                kind={pt.kind}
                x={x}
                y={y}
                scale={scale}
                frame={frame}
                localF={t}
                appeared={appeared}
                uid={pt.name}
                zoom={zoom}
                oilImgSrc={staticFile(OIL_IMG)}
                flagSrc={staticFile(FLAG_SN)}
              />
            </g>
          );
        })}
      </svg>
      {/* plaques label deportees */}
      {PTS.map((pt) => {
        const t = frame - pt.start;
        if (t < 10) return null;
        return (
          <GeoCountryPlaque
            key={pt.name}
            frame={frame}
            name={pt.label}
            color="#c8a951"
            appearAt={pt.start + 10}
            hideAt={DUR}
            pos={{ x: PLAQUE_X, y: pt.plaqueY }}
          />
        );
      })}
    </>
  );
};

const Leader: React.FC<{ x1: number; y1: number; x2: number; y2: number; op: number }> = ({ x1, y1, x2, y2, op }) => {
  if (op <= 0.01) return null;
  return (
    <g opacity={op}>
      <line x1={x2} y1={y2} x2={x1} y2={y1} stroke="#c8a951" strokeWidth={2} strokeLinecap="round" />
      <circle cx={x1} cy={y1} r={3} fill="#c8a951" />
    </g>
  );
};

export const TOKEN_SHOWCASE_V5_FRAMES = DUR;
export default TokenShowcaseV5;
