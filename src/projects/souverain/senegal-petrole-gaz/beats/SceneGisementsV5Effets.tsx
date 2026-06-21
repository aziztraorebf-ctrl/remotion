/**
 * SceneGisementsV5Effets — scene "3 gisements" sur la cible V5 AVEC les effets (brique 2, pas 3).
 *
 * Tous les effets sont des OVERLAYS SVG enfants geo-ancres sur UNE seule carte (CartoSouverainV5).
 * Position = map.project([lon,lat]) RECALCULE CHAQUE FRAME (useCurrentFrame) — anti-derive prouve.
 * Source : breakdown JSON GPT-5.5 (verdict+props+style_exact+timing) valide sur storyboard. Direction = GPT-5.5+Gemini.
 *
 * 4 etats (1560f @30fps, audio 52->104s) : E1 COMPTER (sonar) · E2 CONCRETISER (isolate+jauge 18%) ·
 * E3 PROJETER (flux divergents+gaz russe coupe) · E4 SUSPENDRE (pointille+popup vide+lignes qui s'arretent).
 *
 * Couche overlay composable : s'inspire de la logique des composants catalogue (IsolateZone/Popup/Flow)
 * mais en enfants poses sur la map partagee (le catalogue autonome = extraction separee, chantier documente).
 */
import React, { useRef, useState } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type mapboxgl from "mapbox-gl";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { CartoSouverainV5 } from "../../../_shared/mapbox/CartoSouverainV5";
import { GeoCountryPlaque } from "../../../_shared/mapbox/GeoCountryPlaque";

const { fontFamily: BEBAS } = loadBebas();

const AUDIO_START = 52;
const NAVY = "#16213a", GOLD = "#c8a951", GREY = "#4a4a4a", IVORY = "#f2efe6";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// coords reelles
const SANGOMAR: [number, number] = [-16.95, 14.0];
const GTA: [number, number] = [-17.05, 15.9];
const YAKAAR: [number, number] = [-17.3, 14.9];
// centroides approx des destinations flux (= ce que turf.centroid donnerait ; endpoint sur la bonne masse)
const EUROPE: [number, number] = [1.5, 46.5];   // ~ union FRA/ESP
const ASIA: [number, number] = [79.0, 22.0];    // ~ Inde
const RUSSIA: [number, number] = [55.0, 56.0];  // ~ Russie europeenne

// frontieres d'etats
const E1 = 0, E2 = 360, E3 = 840, E4 = 1260;

export const SceneGisementsV5Effets: React.FC = () => {
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [, force] = useState(0);

  const camKeys = [
    // E1 cadre offshore Dakar (zoom 5.9) pour que les 3 gisements RESPIRENT et soient distincts/lisibles.
    { atProgress: 0.0, cam: { lon: -16.6, lat: 14.7, zoom: 5.9, pitch: 0, bearing: 0 } },
    { atProgress: 300 / 1560, cam: { lon: -16.7, lat: 14.6, zoom: 6.0, pitch: 8, bearing: 0 } },
    { atProgress: E2 / 1560, cam: { lon: -16.82, lat: 14.28, zoom: 6.72, pitch: 34, bearing: 0 } },
    { atProgress: 840 / 1560, cam: { lon: -16.82, lat: 14.28, zoom: 6.72, pitch: 34, bearing: 0 } },
    { atProgress: 960 / 1560, cam: { lon: -16.95, lat: 15.55, zoom: 5.42, pitch: 14, bearing: 0 } },
    { atProgress: 1080 / 1560, cam: { lon: 15, lat: 29, zoom: 2.05, pitch: 0, bearing: 0 } },
    { atProgress: 1260 / 1560, cam: { lon: 15, lat: 29, zoom: 2.05, pitch: 0, bearing: 0 } },
    { atProgress: 1344 / 1560, cam: { lon: -16.92, lat: 14.9, zoom: 6.18, pitch: 24, bearing: 0 } },
    { atProgress: 1.0, cam: { lon: -16.92, lat: 14.9, zoom: 6.18, pitch: 24, bearing: 0 } },
  ];

  return (
    <AbsoluteFill>
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={AUDIO_START * fps} />
      <CartoSouverainV5 camKeys={camKeys} focusIsos={["SEN"]} onMapReady={(m) => { mapRef.current = m; force((n) => n + 1); }}>
        <Effets mapRef={mapRef} />
      </CartoSouverainV5>
    </AbsoluteFill>
  );
};

// E1 : plaques DEPORTEES dans l'ocean (a gauche) + leader fleche vers le point. dy = etage vertical.
const E1_FIELDS: { name: string; coord: [number, number]; start: number; num: string; plaqueY: number }[] = [
  { name: "GTA", coord: GTA, start: 114, num: "02", plaqueY: 220 },
  { name: "YAKAAR", coord: YAKAAR, start: 192, num: "03", plaqueY: 430 },
  { name: "SANGOMAR", coord: SANGOMAR, start: 36, num: "01", plaqueY: 640 },
];
const PLAQUE_X = 250; // colonne ocean a gauche

const Effets: React.FC<{ mapRef: React.MutableRefObject<mapboxgl.Map | null> }> = ({ mapRef }) => {
  const frame = useCurrentFrame();
  const map = mapRef.current;
  if (!map) return null;
  const P = (c: [number, number]) => { const p = map.project(c as any); return [p.x, p.y] as [number, number]; };

  const showE1 = frame < E2 + 30;

  return (
    <>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {/* ════ E1 — marqueurs sonar (plus gros, pulse rapide) + leaders fleches vers plaques deportees ════ */}
        {showE1 && E1_FIELDS.map((f) => {
          const [x, y] = P(f.coord);
          const t = frame - f.start;
          if (t < -2) return null;
          const leadOp = interpolate(frame, [f.start + 26, f.start + 44, 330, 360], [0, 0.9, 0.9, 0], clamp);
          return (
            <g key={f.name}>
              {/* leader fleche : du point (geo) vers la plaque deportee (P3) */}
              {leadOp > 0.01 && <Leader x1={x} y1={y} x2={PLAQUE_X + 10} y2={f.plaqueY + 44} op={leadOp} />}
              {/* sonar rings — plus gros (r jusqu'a 52), pulse RAPIDE (P4) */}
              {[0, 1, 2].map((i) => {
                const d = i * 7;
                const r = interpolate(t - d, [0, 34], [6, 52], clamp);
                const op = interpolate(t - d, [0, 22, 34], [0, 0.55, 0], clamp);
                return op > 0.01 ? <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={IVORY} strokeWidth={1.6} opacity={op} /> : null;
              })}
              {/* ring statique + pulse rapide */}
              {t > 44 && <circle cx={x} cy={y} r={22} fill="none" stroke={GOLD} strokeWidth={1.4} opacity={0.3 + 0.18 * Math.sin((frame - f.start - 44) / 9)} />}
              <circle cx={x} cy={y} r={8} fill={GOLD} stroke={NAVY} strokeWidth={1.5} />
            </g>
          );
        })}
      </svg>

      {/* plaques deportees (HTML) — geoplaque, pas de texte nu (P1+P2) */}
      {showE1 && E1_FIELDS.map((f) => (
        <GeoCountryPlaque
          key={f.name}
          frame={frame}
          name={`${f.num}  ${f.name}`}
          color={GOLD}
          appearAt={f.start + 26}
          hideAt={360}
          pos={{ x: PLAQUE_X, y: f.plaqueY + 120 }}
        />
      ))}

      {/* titres ecran (coin — exception P1, ce n'est pas un label de lieu) */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <ScreenTitle frame={frame} show={[0, 360]} parts={["THREE FIELDS"]} />
        <ScreenTitle frame={frame} show={[372, 840]} parts={["SANGOMAR", " / oil"]} />
        <ScreenTitle frame={frame} show={[852, 1260]} parts={["GTA", " / export"]} />
        <ScreenTitle frame={frame} show={[1272, 1560]} parts={["YAKAAR", " / suspense"]} />
      </svg>
    </>
  );
};

// leader avec pointe de fleche, du point geo vers la plaque
const Leader: React.FC<{ x1: number; y1: number; x2: number; y2: number; op: number }> = ({ x1, y1, x2, y2, op }) => {
  const ang = Math.atan2(y1 - y2, x1 - x2);
  const ax = x1 - 13 * Math.cos(ang), ay = y1 - 13 * Math.sin(ang);
  return (
    <g opacity={op}>
      <line x1={x2} y1={y2} x2={x1} y2={y1} stroke={GOLD} strokeWidth={2} strokeLinecap="round" />
      {/* pointe sur le point geo */}
      <path d={`M ${x1} ${y1} L ${ax - 6 * Math.sin(ang)} ${ay + 6 * Math.cos(ang)} L ${ax + 6 * Math.sin(ang)} ${ay - 6 * Math.cos(ang)} Z`} fill={GOLD} />
    </g>
  );
};

// ─── titre ecran ───────────────────────────────────────────────────────────
const ScreenTitle: React.FC<{ frame: number; show: [number, number]; parts: string[] }> = ({ frame, show, parts }) => {
  const [a, b] = show;
  const op = interpolate(frame, [a, a + 18, b - 30, b], [0, 0.96, 0.96, 0], clamp);
  if (op <= 0.01) return null;
  return (
    <text x={42} y={64} fontFamily={BEBAS} fontSize={54} letterSpacing={1.5} opacity={op}>
      <tspan fill={IVORY}>{parts[0]}</tspan>
      {parts[1] && <tspan fill={IVORY} opacity={0.82}>{parts[1]}</tspan>}
    </text>
  );
};

export const SCENE_GISEMENTS_V5_EFFETS_FRAMES = 1560;
export default SceneGisementsV5Effets;
