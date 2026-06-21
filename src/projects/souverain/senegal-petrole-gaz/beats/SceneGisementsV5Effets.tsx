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
import { GisementMarker, type GisementKind } from "../../../_shared/mapbox/GisementTokens";

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

// Dimensions composition canonique
const W = 1920, H = 1080;

// Points de depart fixes pour les 9 lignes de convoitise E4 (px dans 1920x1080)
const E4_LINE_ORIGINS: [number, number][] = [
  [0,          H * 0.12],
  [0,          H * 0.28],
  [0,          H * 0.46],
  [0,          H * 0.64],
  [0,          H * 0.82],
  [W * 0.28,   0],
  [W * 0.44,   0],
  [W * 0.72,   0],
  [W * 0.86,   H],
];

export const SceneGisementsV5Effets: React.FC = () => {
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [, force] = useState(0);

  const camKeys = [
    // ── E1 "ETABLIR PUIS PLONGER" (idee Aziz) : on pose les 3 gisements en vue large,
    //    puis la camera PLONGE en relief successivement sur chaque point (jamais statique).
    //    Chaque point tient ~84f (2.8s) en relief => l'animation des jetons respire plusieurs cycles.
    // 0-66 : vue large, les 3 marqueurs apparaissent (THREE FIELDS etabli)
    { atProgress: 0.0,        cam: { lon: -16.7,  lat: 14.85, zoom: 5.85, pitch: 0,  bearing: 0 } },
    { atProgress: 60 / 1560,  cam: { lon: -16.7,  lat: 14.85, zoom: 5.9,  pitch: 4,  bearing: 0 } },
    // 66-150 : PLONGEE relief sur SANGOMAR (sud)
    { atProgress: 120 / 1560, cam: { lon: SANGOMAR[0] - 0.05, lat: SANGOMAR[1] - 0.18, zoom: 7.4, pitch: 38, bearing: -6 } },
    { atProgress: 150 / 1560, cam: { lon: SANGOMAR[0] - 0.05, lat: SANGOMAR[1] - 0.18, zoom: 7.4, pitch: 38, bearing: -6 } },
    // 150-234 : spring vers GTA (nord, sur la frontiere)
    { atProgress: 210 / 1560, cam: { lon: GTA[0] - 0.05, lat: GTA[1] - 0.2, zoom: 7.4, pitch: 38, bearing: 6 } },
    { atProgress: 234 / 1560, cam: { lon: GTA[0] - 0.05, lat: GTA[1] - 0.2, zoom: 7.4, pitch: 38, bearing: 6 } },
    // 234-318 : spring vers YAKAAR (centre)
    { atProgress: 294 / 1560, cam: { lon: YAKAAR[0] - 0.05, lat: YAKAAR[1] - 0.2, zoom: 7.4, pitch: 38, bearing: 0 } },
    { atProgress: 318 / 1560, cam: { lon: YAKAAR[0] - 0.05, lat: YAKAAR[1] - 0.2, zoom: 7.4, pitch: 38, bearing: 0 } },
    // 318-360 : remontee large -> raccord E2
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
// `kind` = variante de jeton testee (session 2026-06-21) : sonar=temoin, gas=SVG natif, oil=image Gemini.
const E1_FIELDS: { name: string; coord: [number, number]; start: number; num: string; plaqueY: number; kind: GisementKind }[] = [
  { name: "GTA",     coord: GTA,     start: 114, num: "02", plaqueY: 220, kind: "gas" },
  { name: "YAKAAR",  coord: YAKAAR,  start: 192, num: "03", plaqueY: 430, kind: "oil" },
  { name: "SANGOMAR",coord: SANGOMAR,start: 36,  num: "01", plaqueY: 640, kind: "sonar" },
];
const OIL_IMG = "souverain/senegal-petrole-gaz/scene-gisements/jeton-petrole-offshore-square.png";
const PLAQUE_X = 250; // colonne ocean a gauche

// Utilitaire : calcule longueur approx + points echantillonnes sur une courbe quadratique Bezier
function bezierSamples(
  x0: number, y0: number,
  cpX: number, cpY: number,
  x1: number, y1: number,
  steps: number
): { pts: [number, number][]; totalLen: number } {
  const pts: [number, number][] = [[x0, y0]];
  let totalLen = 0;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const bx = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cpX + t * t * x1;
    const by = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cpY + t * t * y1;
    const dx = bx - pts[i - 1][0], dy = by - pts[i - 1][1];
    totalLen += Math.sqrt(dx * dx + dy * dy);
    pts.push([bx, by]);
  }
  return { pts, totalLen };
}

// Utilitaire : trouve l'endpoint et l'angle a une longueur donnee sur les echantillons
function bezierPointAtLength(
  pts: [number, number][],
  targetLen: number
): { x: number; y: number; angle: number } {
  let cum = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
    const seg = Math.sqrt(dx * dx + dy * dy);
    if (cum + seg >= targetLen || i === pts.length - 1) {
      const frac = seg > 0 ? Math.min(1, (targetLen - cum) / seg) : 0;
      return {
        x: pts[i - 1][0] + frac * dx,
        y: pts[i - 1][1] + frac * dy,
        angle: Math.atan2(dy, dx),
      };
    }
    cum += seg;
  }
  const last = pts[pts.length - 1];
  const prev = pts[pts.length - 2];
  return { x: last[0], y: last[1], angle: Math.atan2(last[1] - prev[1], last[0] - prev[0]) };
}

// Composant flux Bezier anime avec pointe de fleche
const BezierFlow: React.FC<{
  x0: number; y0: number;
  cpX: number; cpY: number;
  x1: number; y1: number;
  progress: number; // 0..1 longueur dessinee
  stroke: string;
  strokeWidth?: number;
  opacity?: number;
  dashArray?: string;
  arrowSize?: number;
}> = ({ x0, y0, cpX, cpY, x1, y1, progress, stroke, strokeWidth = 1.6, opacity = 1, dashArray = "2 8", arrowSize = 8 }) => {
  if (progress <= 0.005) return null;
  const STEPS = 60;
  const { pts, totalLen } = bezierSamples(x0, y0, cpX, cpY, x1, y1, STEPS);
  const drawn = progress * totalLen;
  const { x: arX, y: arY, angle: arAng } = bezierPointAtLength(pts, drawn);
  const AS = arrowSize;
  const ax1 = arX - AS * Math.cos(arAng - 0.4), ay1 = arY - AS * Math.sin(arAng - 0.4);
  const ax2 = arX - AS * Math.cos(arAng + 0.4), ay2 = arY - AS * Math.sin(arAng + 0.4);
  // trait revele (dash = [longueur dessinee, reste]) + halo navy dessous pour lisibilite sur la carte
  const d = `M ${x0} ${y0} Q ${cpX} ${cpY} ${x1} ${y1}`;
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={NAVY} strokeWidth={strokeWidth + 2.5} opacity={0.55}
        strokeDasharray={`${drawn} ${totalLen}`} strokeLinecap="round" />
      <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth + 1}
        strokeDasharray={`${drawn} ${totalLen}`} strokeLinecap="round" />
      {progress > 0.02 && (
        <path d={`M ${arX} ${arY} L ${ax1} ${ay1} L ${ax2} ${ay2} Z`} fill={stroke} stroke={NAVY} strokeWidth={0.6} />
      )}
    </g>
  );
};

// Composant ligne droite animee avec dasharray progress (pour gaz russe)
const DashedLineProgress: React.FC<{
  x0: number; y0: number;
  cpX: number; cpY: number;
  x1: number; y1: number;
  progress: number;
  stroke: string;
  strokeWidth?: number;
  opacity?: number;
}> = ({ x0, y0, cpX, cpY, x1, y1, progress, stroke, strokeWidth = 2, opacity = 1 }) => {
  if (progress <= 0.005) return null;
  const STEPS = 40;
  const { pts, totalLen } = bezierSamples(x0, y0, cpX, cpY, x1, y1, STEPS);
  const drawn = progress * totalLen;
  // ligne fantome pointillee revelee : on coupe le path a `drawn` (sous-ensemble des points),
  // et on applique un dash "10 10" sur ce sous-path. Robuste (pas de pathLength/offset geant).
  let cum = 0; const sub: [number, number][] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
    const seg = Math.sqrt(dx * dx + dy * dy);
    if (cum + seg <= drawn) { sub.push(pts[i]); cum += seg; }
    else { const f = (drawn - cum) / seg; sub.push([pts[i - 1][0] + f * dx, pts[i - 1][1] + f * dy]); break; }
  }
  const dSub = "M " + sub.map((p) => `${p[0]} ${p[1]}`).join(" L ");
  return <path d={dSub} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray="10 10" opacity={opacity} />;
};

const Effets: React.FC<{ mapRef: React.MutableRefObject<mapboxgl.Map | null> }> = ({ mapRef }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const map = mapRef.current;
  if (!map) return null;
  const P = (c: [number, number]) => { const p = map.project(c as any); return [p.x, p.y] as [number, number]; };

  const showE1 = frame < E2 + 30;

  // ── positions geo recalculees chaque frame ─────────────────────────────────
  const [sx, sy] = P(SANGOMAR);
  const [gx, gy] = P(GTA);
  const [yx2, yy2] = P(YAKAAR);
  const [ex, ey] = P(EUROPE);
  const [ax2, ay2] = P(ASIA);
  const [rx, ry] = P(RUSSIA);

  // ── E2 SANGOMAR : isolement + hachures + jauge 18% + plaque deportee ───────
  const dimE2 = interpolate(frame, [380, 430, 820, 840], [0, 0.52, 0.52, 0], clamp);
  const gaugeOp = interpolate(frame, [430, 446, 820, 840], [0, 1, 1, 0], clamp);
  const gaugeValue = interpolate(frame, [430, 610], [0, 0.18], clamp);
  const label18Op = interpolate(frame, [600, 620, 820, 840], [0, 1, 1, 0], clamp);
  const plaqueE2Op = interpolate(frame, [470, 490, 810, 840], [0, 1, 1, 0], clamp);
  const GAUGE_R = 78;
  const GAUGE_CIRC = 2 * Math.PI * GAUGE_R;

  // ── E3 GTA : marqueur frontiere + ligne gaz russe coupe + flux + plaque ────
  const gtaMarkerScale = spring({ frame: frame - 900, fps, config: { damping: 18, mass: 0.7 } });
  const gtaMarkerOp = interpolate(frame, [900, 916, 1230, 1260], [0, 1, 1, 0], clamp);

  // Ligne gaz russe : dessin frames 900-960, coupure 990-1040 (reste bloque a 38%)
  const russiaDrawProg = interpolate(frame, [900, 960], [0, 1], clamp);
  const russiaCutProg = interpolate(frame, [990, 1040], [1, 0.38], clamp);
  const russiaProgress = frame < 990 ? russiaDrawProg : Math.min(russiaDrawProg, russiaCutProg);
  const russiaLineOp = interpolate(frame, [900, 916, 990, 1040], [0, 0.95, 0.95, 0.42], clamp);

  // Control point ligne gaz russe (passant par le nord de l'Europe)
  const russiaCpX = (rx + ex) / 2;
  const russiaCpY = Math.min(ry, ey) - 100;

  // Flux GTA → Europe (ivoire, frames 1050-1170)
  const flowEuropeProgress = interpolate(frame, [1050, 1170], [0, 1], clamp);
  const flowEuropeOp = interpolate(frame, [1050, 1066, 1230, 1260], [0, 0.92, 0.92, 0], clamp);
  const europeCpX = (gx + ex) / 2 + 120, europeCpY = (gy + ey) / 2 - 280;

  // Flux GTA → Asie (or, frames 1070-1205)
  const flowAsiaProgress = interpolate(frame, [1070, 1205], [0, 1], clamp);
  const flowAsiaOp = interpolate(frame, [1070, 1086, 1230, 1260], [0, 0.92, 0.92, 0], clamp);
  const asiaCpX = (gx + ax2) / 2 + 360, asiaCpY = (gy + ay2) / 2 - 210;

  const plaqueGTAOp = interpolate(frame, [930, 950, 1230, 1260], [0, 1, 1, 0], clamp);

  // ── E4 YAKAAR : isolement extreme + anneau pointille + popup clignotant + lignes ──
  const ghostOp = interpolate(frame, [1320, 1344], [0, 0.6], clamp);
  const yakaarScale = spring({ frame: frame - 1320, fps, config: { damping: 18, mass: 0.7 } });
  const yakaarOp = interpolate(frame, [1320, 1344], [0, 1], clamp);
  const popupOp = interpolate(frame, [1350, 1380], [0, 1], clamp);
  const cursorVisible = frame % 30 < 15;

  return (
    <>
      {/* ════ SVG overlay principal (plein ecran, position absolute) ════════════ */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {/* defs SVG : gradients et clipPaths (toujours presents pour eviter references mortes) */}
        <defs>
          {/* gradient radial E2 : trou transparent autour de Sangomar */}
          <radialGradient id="spotE2" cx={sx / W} cy={sy / H} r={0.22} gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor={NAVY} stopOpacity={0} />
            <stop offset="65%"  stopColor={NAVY} stopOpacity={0} />
            <stop offset="100%" stopColor={NAVY} stopOpacity={1} />
          </radialGradient>
          {/* clipPath E2 : cercle autour de Sangomar pour les hachures */}
          <clipPath id="circleHatch">
            <circle cx={sx} cy={sy} r={95} />
          </clipPath>
        </defs>

        {/* ── E1 — leaders fleches (les jetons eux-memes sont rendus plus bas, voir bloc HTML/Img) ── */}
        {showE1 && E1_FIELDS.map((f) => {
          const [x, y] = P(f.coord);
          const t = frame - f.start;
          if (t < -2) return null;
          const leadOp = interpolate(frame, [f.start + 26, f.start + 44, 330, 360], [0, 0.9, 0.9, 0], clamp);
          return leadOp > 0.01 ? (
            <Leader key={f.name} x1={x} y1={y} x2={PLAQUE_X + 10} y2={f.plaqueY + 44} op={leadOp} />
          ) : null;
        })}

        {/* ── E1 — jetons de gisement (3 variantes a tester : sonar/gas/oil) ─── */}
        {showE1 && E1_FIELDS.map((f) => {
          const [x, y] = P(f.coord);
          const t = frame - f.start;
          if (t < -2) return null;
          // spring d'apparition lent et propre (pop du cadre)
          const scale = spring({ frame: t, fps, config: { damping: 16, mass: 0.8 } });
          const appeared = t > 44;
          return (
            <GisementMarker
              key={f.name}
              kind={f.kind}
              x={x}
              y={y}
              scale={scale}
              frame={frame}
              localF={t}
              appeared={appeared}
              oilImgSrc={staticFile(OIL_IMG)}
            />
          );
        })}

        {/* ── E2 — voile assombrissement navy avec trou radial autour de Sangomar ── */}
        {frame >= E2 && frame < E3 && dimE2 > 0.01 && (
          <>
            <rect x={0} y={0} width={W} height={H} fill={NAVY} opacity={dimE2} />
            <rect x={0} y={0} width={W} height={H} fill="url(#spotE2)" opacity={dimE2} />
          </>
        )}

        {/* ── E2 — zone offshore hachures or autour de Sangomar ──────────────── */}
        {frame >= E2 && frame < E3 && gaugeOp > 0.01 && (() => {
          const hatchOp = interpolate(frame, [430, 446, 820, 840], [0, 0.55, 0.55, 0], clamp);
          const HR = 95; // rayon approximatif de la zone en px ecran
          const lines = [];
          for (let d = -HR * 2; d < HR * 2; d += 8) {
            lines.push(
              <line key={d}
                x1={sx - HR} y1={sy + d + HR}
                x2={sx + HR} y2={sy + d - HR}
                stroke={GOLD} strokeWidth={1} opacity={hatchOp}
              />
            );
          }
          return (
            <g>
              <g clipPath="url(#circleHatch)">{lines}</g>
              <circle cx={sx} cy={sy} r={HR} fill="none" stroke={GOLD} strokeWidth={1.2} opacity={hatchOp} />
            </g>
          );
        })()}

        {/* ── E2 — jauge circulaire Petrosen 18% geo-ancree a Sangomar ──────── */}
        {frame >= E2 && frame < E3 && gaugeOp > 0.01 && (
          <g opacity={gaugeOp} transform={`translate(${sx}, ${sy})`}>
            {/* cercles fins decoratifs */}
            <circle r={96} fill="none" stroke={IVORY} strokeWidth={1} opacity={0.18} />
            <circle r={62} fill="none" stroke={IVORY} strokeWidth={1} opacity={0.18} />
            {/* arc fond ivoire complet */}
            <circle
              r={GAUGE_R}
              fill="none"
              stroke={IVORY}
              strokeWidth={12}
              strokeOpacity={0.22}
              transform="rotate(-90)"
            />
            {/* arc valeur or — remplit de 0 a 18% */}
            <circle
              r={GAUGE_R}
              fill="none"
              stroke={GOLD}
              strokeWidth={12}
              strokeLinecap="butt"
              strokeDasharray={`${gaugeValue * GAUGE_CIRC} ${GAUGE_CIRC}`}
              transform="rotate(-90)"
            />
            {/* centre */}
            <circle r={6} fill={GOLD} />
            {/* label "18%" apparait a frame 610 */}
            {label18Op > 0.01 && (
              <text
                x={0} y={8}
                textAnchor="middle"
                fontFamily={BEBAS}
                fontSize={28}
                letterSpacing={0.8}
                fill={IVORY}
                opacity={label18Op}
              >
                18%
              </text>
            )}
          </g>
        )}

        {/* ── E2 — leader fleche Sangomar → plaque deportee ──────────────────── */}
        {frame >= E2 && frame < E3 && plaqueE2Op > 0.01 && (
          <Leader x1={sx} y1={sy} x2={PLAQUE_X + 10} y2={580 + 44} op={plaqueE2Op} />
        )}

        {/* ── E3 — marqueur GTA a cheval sur la frontiere SN/MR ──────────────── */}
        {frame >= E3 && frame < E4 && gtaMarkerOp > 0.01 && (
          <g transform={`translate(${gx}, ${gy})`} opacity={gtaMarkerOp}>
            <g transform={`scale(${gtaMarkerScale})`}>
              <circle r={5} fill={GOLD} />
              <circle r={13} fill="none" stroke={IVORY} strokeWidth={1.4} opacity={0.8} />
              {/* barre verticale symbolisant la frontiere */}
              <line x1={0} y1={-16} x2={0} y2={16} stroke={IVORY} strokeWidth={1} opacity={0.55} />
            </g>
          </g>
        )}

        {/* ── E3 — ligne gaz russe (Russie → Europe) qui se coupe ─────────────── */}
        {frame >= E3 && frame < E4 && russiaLineOp > 0.01 && (
          <DashedLineProgress
            x0={rx} y0={ry}
            cpX={russiaCpX} cpY={russiaCpY}
            x1={ex} y1={ey}
            progress={russiaProgress}
            stroke={GREY}
            strokeWidth={2}
            opacity={russiaLineOp}
          />
        )}

        {/* ── E3 — flux GTA → Europe (ivoire pointille) ──────────────────────── */}
        {frame >= E3 && frame < E4 && flowEuropeOp > 0.01 && (
          <BezierFlow
            x0={gx} y0={gy}
            cpX={europeCpX} cpY={europeCpY}
            x1={ex} y1={ey}
            progress={flowEuropeProgress}
            stroke={IVORY}
            strokeWidth={3}
            opacity={flowEuropeOp}
            dashArray="2 8"
            arrowSize={13}
          />
        )}

        {/* ── E3 — flux GTA → Asie (or pointille) ────────────────────────────── */}
        {frame >= E3 && frame < E4 && flowAsiaOp > 0.01 && (
          <BezierFlow
            x0={gx} y0={gy}
            cpX={asiaCpX} cpY={asiaCpY}
            x1={ax2} y1={ay2}
            progress={flowAsiaProgress}
            stroke={GOLD}
            strokeWidth={3}
            opacity={flowAsiaOp}
            dashArray="2 8"
            arrowSize={13}
          />
        )}

        {/* ── E3 — leader GTA → plaque deportee ──────────────────────────────── */}
        {frame >= E3 && frame < E4 && plaqueGTAOp > 0.01 && (
          <Leader x1={gx} y1={gy} x2={PLAQUE_X + 10} y2={400 + 44} op={plaqueGTAOp} />
        )}

        {/* ── E4 — fantômes Sangomar et GTA en gris ──────────────────────────── */}
        {frame >= E4 && ghostOp > 0.01 && (
          <>
            <circle cx={sx} cy={sy} r={4} fill={GREY} opacity={ghostOp} />
            <circle cx={sx} cy={sy} r={13} fill="none" stroke={IVORY} strokeWidth={1} opacity={ghostOp * 0.3} />
            <circle cx={gx} cy={gy} r={4} fill={GREY} opacity={ghostOp} />
            <circle cx={gx} cy={gy} r={13} fill="none" stroke={IVORY} strokeWidth={1} opacity={ghostOp * 0.3} />
          </>
        )}

        {/* ── E4 — marqueur Yakaar : anneau pointille en respiration lente ────── */}
        {frame >= E4 && yakaarOp > 0.01 && (
          <g transform={`translate(${yx2}, ${yy2})`} opacity={yakaarOp}>
            <g transform={`scale(${yakaarScale})`}>
              {/* anneau pointille principal — pulse respiratoire lent */}
              <circle
                r={22 + 3 * Math.sin((frame - 1320) / 38)}
                fill="none"
                stroke={GOLD}
                strokeWidth={2}
                strokeDasharray="3 6"
                opacity={0.75 + 0.15 * Math.sin((frame - 1320) / 38)}
              />
              {/* anneau secondaire fin */}
              <circle
                r={32}
                fill="none"
                stroke={IVORY}
                strokeWidth={1}
                strokeDasharray="2 8"
                opacity={0.32}
              />
              {/* point central */}
              <circle r={6} fill={GOLD} />
            </g>
          </g>
        )}

        {/* ── E4 — popup "Opérateur : _" geo-ancree a Yakaar ─────────────────── */}
        {frame >= E4 && popupOp > 0.01 && (() => {
          const popW = 250, popH = 64, popR = 8;
          // position : decalee a droite et au-dessus de Yakaar
          const popX = yx2 + 78, popY = yy2 - 54;
          // connecteur depuis bord gauche du rect vers le point geo
          const connX1 = popX, connY1 = popY + popH / 2;
          const connX2 = yx2 + 28, connY2 = yy2;
          return (
            <g opacity={popupOp}>
              {/* ligne connecteur fine ivoire */}
              <line x1={connX1} y1={connY1} x2={connX2} y2={connY2}
                stroke={IVORY} strokeWidth={1} opacity={0.34} />
              {/* fond rect */}
              <rect x={popX} y={popY} width={popW} height={popH} rx={popR} ry={popR}
                fill={NAVY} fillOpacity={0.66}
                stroke={IVORY} strokeWidth={1} strokeOpacity={0.42}
              />
              {/* texte */}
              <text
                x={popX + 14} y={popY + 40}
                fontFamily={BEBAS}
                fontSize={32}
                letterSpacing={0.5}
                fill={IVORY}
              >
                {"Opérateur : "}
                {cursorVisible && <tspan fill={GOLD}>_</tspan>}
              </text>
            </g>
          );
        })()}

        {/* ── E4 — 9 lignes de convoitise : convergent vers Yakaar, gap 42px ─── */}
        {frame >= E4 && E4_LINE_ORIGINS.map(([ox, oy], i) => {
          const drawProg = interpolate(frame, [1370 + i * 5, 1435 + i * 5], [0, 1], clamp);
          if (drawProg <= 0.005) return null;
          // vecteur start → Yakaar
          const dx = yx2 - ox, dy = yy2 - oy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1) return null;
          // endpoint : s'arrete 42px avant Yakaar (gap permanent)
          const endFrac = Math.max(0, (dist - 42) / dist);
          const endX = ox + endFrac * dx;
          const endY = oy + endFrac * dy;
          // point courant selon drawProg
          const curX = ox + drawProg * (endX - ox);
          const curY = oy + drawProg * (endY - oy);
          const isCenter = i >= 2 && i <= 4;
          return (
            <line
              key={i}
              x1={ox} y1={oy}
              x2={curX} y2={curY}
              stroke={IVORY}
              strokeWidth={1}
              strokeLinecap="butt"
              opacity={isCenter ? 0.34 : 0.26}
            />
          );
        })}

        {/* ── titres ecran (coin haut gauche — pas des labels geo, exception P1) ── */}
        <ScreenTitle frame={frame} show={[0,    360]}  parts={["THREE FIELDS"]}          />
        <ScreenTitle frame={frame} show={[372,  840]}  parts={["SANGOMAR", " / oil"]}    />
        <ScreenTitle frame={frame} show={[852,  1260]} parts={["GTA", " / export"]}      />
        <ScreenTitle frame={frame} show={[1272, 1560]} parts={["YAKAAR", " / suspense"]} />
      </svg>

      {/* ── E1 — plaques deportees HTML (geoplaque, pas de texte nu) ─────────── */}
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

      {/* ── E2 — plaque SANGOMAR deportee (ocean gauche) — P1+P2+P3 ─────────── */}
      {frame >= E2 && frame < E3 && plaqueE2Op > 0.01 && (
        <GeoCountryPlaque
          frame={frame}
          name="SANGOMAR"
          color={GOLD}
          stat="Pétrole · Petrosen 18%"
          source="Opérateur : Woodside"
          appearAt={470}
          hideAt={840}
          pos={{ x: PLAQUE_X, y: 580 }}
        />
      )}

      {/* ── E3 — plaque GTA deportee (ocean gauche) — P1+P2+P3 ──────────────── */}
      {frame >= E3 && frame < E4 && plaqueGTAOp > 0.01 && (
        <GeoCountryPlaque
          frame={frame}
          name="GTA"
          color={GOLD}
          stat="Gaz · BP"
          source="depuis 2025"
          appearAt={930}
          hideAt={1260}
          pos={{ x: PLAQUE_X, y: 400 }}
        />
      )}
    </>
  );
};

// ── Leader : ligne + pointe de fleche du point geo vers la plaque deportee ──
const Leader: React.FC<{ x1: number; y1: number; x2: number; y2: number; op: number }> = ({ x1, y1, x2, y2, op }) => {
  const ang = Math.atan2(y1 - y2, x1 - x2);
  const ax = x1 - 13 * Math.cos(ang), ay = y1 - 13 * Math.sin(ang);
  return (
    <g opacity={op}>
      <line x1={x2} y1={y2} x2={x1} y2={y1} stroke={GOLD} strokeWidth={2} strokeLinecap="round" />
      <path d={`M ${x1} ${y1} L ${ax - 6 * Math.sin(ang)} ${ay + 6 * Math.cos(ang)} L ${ax + 6 * Math.sin(ang)} ${ay - 6 * Math.cos(ang)} Z`} fill={GOLD} />
    </g>
  );
};

// ── Titre ecran (coin haut gauche — pas un label geo) ─────────────────────
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
