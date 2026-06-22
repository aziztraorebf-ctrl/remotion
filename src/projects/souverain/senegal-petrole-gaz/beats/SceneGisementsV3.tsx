/**
 * SceneGisementsV3 — la VRAIE scene gisements (Senegal Petrole & Gaz, V3-REFONTE).
 *
 * Ecrite DEPUIS LA VOIX (force alignment Whisper du segment 52->104s de narration-v3-VALIDEE.mp3),
 * pas depuis un decoupage d'effets herite. Workflow : doctrine -> intention -> forme -> briques V5.
 * Cf. memory/doctrines/CARTO-OVERLAYS-PRINCIPES.md + CONTINUITE-SCENE-INTENTION-DABORD.md.
 *
 * UN SEUL MONDE qui se transforme (continuite §2) : la carte Mapbox V5 du Senegal offshore, drapeau SEN
 * drape des le debut (MapboxCountryFlagDecal, colorie la carte). On PLONGE de champ en champ, on enrichit.
 *
 * 3 ACTES (un par champ decouvert), cales sur la voix :
 *   ACTE 1 SANGOMAR  f0-500   "trois... Sangomar, petrole brut, Woodside, Petrosen 18%"
 *                             -> jeton oil + plaque deportee Woodside + overlay 18/82 (style Hera, entre/frappe/sort)
 *   ACTE 2 GTA       f500-1090 "GTA, gaz, frontiere Mauritanie, BP, cargaisons Europe/Asie, remplacer gaz russe"
 *                             -> jeton gas + dezoom + flux GTA->Europe/Asie qui s'allument + RUSSIE grisee/coupee
 *   ACTE 3 YAKAAR    f1090-1560 "Yakaar-Teranga, personne n'a decide, il attend, plusieurs capitales le regardent"
 *                             -> jeton qui pulse + fleches de convoitise + drapeaux des pays touches
 *
 * Drapeau SEN = HEROS, drape toute la scene (opacite dosee). Europe/Asie = couleurs nationales qui
 * s'allument (destinations positives). Russie = NEGATIVE (on la remplace) -> grisee puis coupee.
 *
 * Anti-derive : tout overlay geo-ancre = map.project([lon,lat]) RECALCULE chaque frame (useCurrentFrame).
 */
import React, { useRef, useState } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import type mapboxgl from "mapbox-gl";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { CartoSouverainV5 } from "../../../_shared/mapbox/CartoSouverainV5";
import { GeoCountryPlaque } from "../../../_shared/mapbox/GeoCountryPlaque";
import { GisementMarker } from "../../../_shared/mapbox/GisementTokens";
import { MapboxCountryFlagDecal } from "../../../_shared/mapbox/MapboxCountryFlagDecal";
import { drawFlagCanvas } from "../../../_shared/mapbox/flagCanvas";

const { fontFamily: BEBAS } = loadBebas();

const AUDIO_START = 52; // la scene gisements commence a 52s dans l'audio de l'episode
const NAVY = "#16213a", GOLD = "#c8a951", GREY = "#5a5a5a", IVORY = "#f2efe6";
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920, H = 1080;

// ── coords reelles (offshore Senegal + destinations export) ──────────────────
const SANGOMAR: [number, number] = [-16.95, 14.0];   // petrole, au large de Dakar/Sine-Saloum
const GTA: [number, number] = [-17.05, 15.9];        // gaz, frontiere SN/MR
const YAKAAR: [number, number] = [-17.3, 14.9];      // gaz, au large
const EUROPE: [number, number] = [2.2, 46.2];        // ~ France (destination, visible dans le cadre resserre)
const ASIA: [number, number] = [78.0, 22.0];         // ~ Inde (le flux or doit atteindre le drapeau indien affiche a droite)
const RUSSIA: [number, number] = [38.0, 56.0];       // ~ Russie europeenne (concurrent evince, bord nord-est)

// ── frontieres d'actes (frames @30fps, segment 52->104s = 1560f) ─────────────
// Cales sur le force alignment Whisper : Sangomar f106, "18" f404, GTA f501, cargaisons f751,
// Yakaar f1155, "attend" f1345, "reviendra" f1431.
const A1 = 0;     // SANGOMAR
const A2 = 500;   // GTA (la voix dit "le deuxieme c'est GTA" ~f470-501)
const A3 = 1090;  // YAKAAR (la voix dit "un troisieme champ, Yakaar" ~f1090-1155)
const END = 1560;

export const SceneGisementsV3: React.FC = () => {
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [, force] = useState(0);

  // ── Cinematographie "etablir puis plonger", relief successif sur chaque champ ──
  // Vue large -> plongee Sangomar -> remontee/transition -> plongee GTA -> dezoom monde (flux)
  // -> retour Senegal large (climax Yakaar + fleches de convoitise).
  const camKeys = [
    // ACTE 1 — etablir puis plonger sur SANGOMAR
    { atProgress: 0.0,         cam: { lon: -16.6,  lat: 14.6,  zoom: 5.75, pitch: 0,  bearing: 0 } },
    { atProgress: 70 / END,    cam: { lon: -16.6,  lat: 14.6,  zoom: 5.85, pitch: 6,  bearing: 0 } },
    { atProgress: 150 / END,   cam: { lon: SANGOMAR[0] - 0.05, lat: SANGOMAR[1] - 0.18, zoom: 7.3, pitch: 40, bearing: -7 } },
    { atProgress: 430 / END,   cam: { lon: SANGOMAR[0] - 0.05, lat: SANGOMAR[1] - 0.16, zoom: 7.35, pitch: 40, bearing: -4 } },
    // ACTE 2 — remonter, plonger GTA (frontiere nord), puis DEZOOM MONDE (flux export)
    { atProgress: A2 / END,    cam: { lon: -16.9,  lat: 15.2,  zoom: 6.4,  pitch: 30, bearing: 0 } },
    { atProgress: 640 / END,   cam: { lon: GTA[0] - 0.04, lat: GTA[1] - 0.18, zoom: 7.3, pitch: 40, bearing: 5 } },
    // bearing remis a 0 AVANT le dezoom (evite la rotation qui fait zigzaguer leader+carte)
    { atProgress: 730 / END,   cam: { lon: GTA[0] - 0.04, lat: GTA[1] - 0.16, zoom: 7.1, pitch: 36, bearing: 0 } },
    // dezoom pour les flux (cargaisons vers Europe/Asie) — resserre sur Atlantique/Afrique/Europe.
    // Trajet cam DROIT (pas de bearing) : le dezoom recule sans pivoter.
    { atProgress: 880 / END,   cam: { lon: 8, lat: 30, zoom: 2.5, pitch: 0, bearing: 0 } },
    { atProgress: A3 / END,    cam: { lon: 8, lat: 30, zoom: 2.5, pitch: 0, bearing: 0 } },
    // ACTE 3 — retour Senegal large pour le climax Yakaar + convoitise
    { atProgress: 1190 / END,  cam: { lon: -16.6, lat: 14.7, zoom: 5.6, pitch: 12, bearing: 0 } },
    { atProgress: 1300 / END,  cam: { lon: -16.7, lat: 14.85, zoom: 6.05, pitch: 22, bearing: 0 } },
    { atProgress: 1.0,         cam: { lon: -16.7, lat: 14.85, zoom: 6.05, pitch: 22, bearing: 0 } },
  ];

  return (
    <AbsoluteFill>
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={AUDIO_START * fps} />
      <CartoSouverainV5 camKeys={camKeys} focusIsos={["SEN"]} onMapReady={(m) => { mapRef.current = m; force((n) => n + 1); }}>
        {/* DRAPEAU SEN drape des le debut (heros, colorie la carte) — opacite dosee */}
        <MapboxCountryFlagDecal mapRef={mapRef} iso="SEN" geoNames={["Senegal"]} drawFlag={(s) => drawFlagCanvas("SEN", s)} opacity={0.5} />
        {/* Drapeaux des pays convoiteurs — apparaissent pendant le DEZOOM monde (acte 2, f880-1090),
            quand Europe/Asie/Russie sont dans le cadre et que les flux les relient. La couleur est
            posee la (carte vivante, pas du gris), avant le retour Senegal pour le climax Yakaar.
            Europe + Asie = destinations (positives) · Russie = concurrent evince mais on l'affiche
            aussi (le spectateur voit QUI on remplace). */}
        {/* France : clipBbox metropolitaine (sinon Natural Earth inclut Guadeloupe..Reunion → metropole minuscule, drapeau blanc) */}
        <AnimatedFlagDecal mapRef={mapRef} iso="FRA" geoNames={["France"]} appearAt={905} maxOpacity={1} clipBbox={[-5.5, 41.0, 9.8, 51.5]} />
        <AnimatedFlagDecal mapRef={mapRef} iso="IND" geoNames={["India"]} appearAt={950} maxOpacity={0.9} />
        <AnimatedFlagDecal mapRef={mapRef} iso="RUS" geoNames={["Russia"]} appearAt={905} maxOpacity={0.5} fadeOutAt={1000} />
        <Effets mapRef={mapRef} />
      </CartoSouverainV5>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  Drapeau drape avec opacite ANIMEE (etend MapboxCountryFlagDecal mono-injection :
//  on injecte a opacite 0 puis on pilote raster-opacity par frame). Pour les pays
//  destinations qui s'allument quand une fleche les touche (acte 3).
// ════════════════════════════════════════════════════════════════════════════
const AnimatedFlagDecal: React.FC<{
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  iso: string;
  geoNames: string[];
  appearAt: number;
  maxOpacity?: number;
  /** si fourni, le drapeau s'estompe a partir de fadeOutAt (ex: Russie = concurrent evince). */
  fadeOutAt?: number;
  /** bbox metropolitaine pour les pays a DOM-TOM (ex: France). */
  clipBbox?: [number, number, number, number];
}> = ({ mapRef, iso, geoNames, appearAt, maxOpacity = 0.7, fadeOutAt, clipBbox }) => {
  const frame = useCurrentFrame();
  const map = mapRef.current;
  const op = fadeOutAt != null
    ? interpolate(frame, [appearAt, appearAt + 26, fadeOutAt, fadeOutAt + 40], [0, maxOpacity, maxOpacity, maxOpacity * 0.18], clamp)
    : interpolate(frame, [appearAt, appearAt + 26], [0, maxOpacity], clamp);
  // piloter l'opacite du layer une fois injecte
  if (map) {
    const layerId = `flagdecal-lyr-${iso}`;
    if (map.getLayer(layerId)) {
      try { map.setPaintProperty(layerId, "raster-opacity", op); } catch (_e) { /* layer pas pret */ }
    }
  }
  // injecte a opacite 0 (le pilotage ci-dessus prend le relais)
  return <MapboxCountryFlagDecal mapRef={mapRef} iso={iso} geoNames={geoNames} drawFlag={(s) => drawFlagCanvas(iso, s)} opacity={0} clipBbox={clipBbox} />;
};

// ════════════════════════════════════════════════════════════════════════════
//  Utilitaires courbe (reutilises du systeme V5 — flux Bezier avec pointe)
// ════════════════════════════════════════════════════════════════════════════
function bezierSamples(x0: number, y0: number, cpX: number, cpY: number, x1: number, y1: number, steps: number) {
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
function bezierPointAtLength(pts: [number, number][], targetLen: number) {
  let cum = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1];
    const seg = Math.sqrt(dx * dx + dy * dy);
    if (cum + seg >= targetLen || i === pts.length - 1) {
      const frac = seg > 0 ? Math.min(1, (targetLen - cum) / seg) : 0;
      return { x: pts[i - 1][0] + frac * dx, y: pts[i - 1][1] + frac * dy, angle: Math.atan2(dy, dx) };
    }
    cum += seg;
  }
  const last = pts[pts.length - 1], prev = pts[pts.length - 2];
  return { x: last[0], y: last[1], angle: Math.atan2(last[1] - prev[1], last[0] - prev[0]) };
}

const BezierFlow: React.FC<{
  x0: number; y0: number; cpX: number; cpY: number; x1: number; y1: number;
  progress: number; stroke: string; strokeWidth?: number; opacity?: number; arrowSize?: number;
}> = ({ x0, y0, cpX, cpY, x1, y1, progress, stroke, strokeWidth = 3, opacity = 1, arrowSize = 13 }) => {
  if (progress <= 0.005) return null;
  const STEPS = 60;
  const { pts, totalLen } = bezierSamples(x0, y0, cpX, cpY, x1, y1, STEPS);
  const drawn = progress * totalLen;
  const { x: arX, y: arY, angle: arAng } = bezierPointAtLength(pts, drawn);
  const AS = arrowSize;
  const ax1 = arX - AS * Math.cos(arAng - 0.4), ay1 = arY - AS * Math.sin(arAng - 0.4);
  const ax2 = arX - AS * Math.cos(arAng + 0.4), ay2 = arY - AS * Math.sin(arAng + 0.4);
  const d = `M ${x0} ${y0} Q ${cpX} ${cpY} ${x1} ${y1}`;
  return (
    <g opacity={opacity}>
      <path d={d} fill="none" stroke={NAVY} strokeWidth={strokeWidth + 2.5} opacity={0.55} strokeDasharray={`${drawn} ${totalLen}`} strokeLinecap="round" />
      <path d={d} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeDasharray={`${drawn} ${totalLen}`} strokeLinecap="round" />
      {progress > 0.02 && <path d={`M ${arX} ${arY} L ${ax1} ${ay1} L ${ax2} ${ay2} Z`} fill={stroke} stroke={NAVY} strokeWidth={0.6} />}
    </g>
  );
};

// Leader : ligne + pointe du point geo vers la plaque deportee
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

// ════════════════════════════════════════════════════════════════════════════
//  EFFETS — overlays SVG geo-ancres (1 seul SVG plein ecran, positions recalculees chaque frame)
// ════════════════════════════════════════════════════════════════════════════
const Effets: React.FC<{ mapRef: React.MutableRefObject<mapboxgl.Map | null> }> = ({ mapRef }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const map = mapRef.current;
  if (!map) return null;
  const P = (c: [number, number]) => { const p = map.project(c as any); return [p.x, p.y] as [number, number]; };
  const zoom = map.getZoom();

  const [sx, sy] = P(SANGOMAR);
  const [gx, gy] = P(GTA);
  const [yx, yy] = P(YAKAAR);
  const [ex, ey] = P(EUROPE);
  const [asx, asy] = P(ASIA);
  // (RUSSIA n'a plus de flux projete — drapeau-decal seul)

  // ── ACTE 1 — SANGOMAR : jeton oil + leader + plaque deportee ───────────────
  const a1MarkerStart = 150;
  const a1Scale = spring({ frame: frame - a1MarkerStart, fps, config: { damping: 16, mass: 0.8 } });
  const a1MarkerOp = interpolate(frame, [a1MarkerStart, a1MarkerStart + 20, A2 - 20, A2], [0, 1, 1, 0], clamp);
  const a1PlaqueOp = interpolate(frame, [230, 256, A2 - 30, A2], [0, 1, 1, 0], clamp);

  // ── ACTE 2 — GTA : jeton gas frontiere + flux Europe/Asie + Russie coupee ──
  const a2MarkerStart = 560;
  const a2Scale = spring({ frame: frame - a2MarkerStart, fps, config: { damping: 16, mass: 0.8 } });
  // jeton + plaque + leader GTA s'eteignent AVANT le dezoom (f730) — sinon le leader balaie
  // l'ecran en suivant le point GTA qui s'eloigne tres vite (le "zigzag" repere par Aziz).
  const a2MarkerOp = interpolate(frame, [a2MarkerStart, a2MarkerStart + 20, 700, 722], [0, 1, 1, 0], clamp);
  const a2PlaqueOp = interpolate(frame, [600, 626, 700, 722], [0, 1, 1, 0], clamp);

  // flux GTA -> Europe (ivoire) + GTA -> Asie (or), pendant le dezoom monde (f880-1090)
  const flowEuropeProg = interpolate(frame, [905, 1010], [0, 1], clamp);
  const flowEuropeOp = interpolate(frame, [905, 925, 1060, 1090], [0, 0.95, 0.95, 0], clamp);
  const flowAsiaProg = interpolate(frame, [950, 1060], [0, 1], clamp);
  const flowAsiaOp = interpolate(frame, [950, 970, 1060, 1090], [0, 0.95, 0.95, 0], clamp);

  // (Russie : plus de flux propre — elle reste affichee comme drapeau qui s'estompe, le concurrent
  //  qu'on remplace, mais sans fleche partant d'elle, cf. retour Aziz "melangeant".)

  // control points flux
  const eurCp: [number, number] = [(gx + ex) / 2 + 80, (gy + ey) / 2 - 220];
  const asiaCp: [number, number] = [(gx + asx) / 2 + 200, (gy + asy) / 2 - 160];

  // ── ACTE 3 — YAKAAR : jeton qui pulse + fleches de convoitise ──────────────
  const a3MarkerStart = 1150;
  const a3Scale = spring({ frame: frame - a3MarkerStart, fps, config: { damping: 18, mass: 0.7 } });
  const a3Op = interpolate(frame, [a3MarkerStart, a3MarkerStart + 24], [0, 1], clamp);
  // fleches de convoitise : convergent vers Yakaar SANS toucher (gap permanent).
  // Origines cote OCEAN (gauche/haut-gauche/bas-gauche) — les convoiteurs viennent du large,
  // les fleches ne traversent pas le continent (qui est a droite du point Yakaar).
  const convoiteOrigins: [number, number][] = [
    [0, H * 0.12], [0, H * 0.34], [0, H * 0.56], [0, H * 0.80],
    [W * 0.18, 0], [W * 0.32, 0], [W * 0.20, H], [W * 0.36, H],
  ];

  const PLAQUE_X = 360; // colonne ocean gauche — assez a droite pour que les longs libelles ne debordent pas (plaque centree sur ce x)

  return (
    <>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {/* (overlay 18% retire — redondant avec la voix, trop bref, posait sur le continent.
            La plaque Sangomar "Petrole brut / Woodside" porte deja l'info.) */}

        {/* ═══ ACTE 1 — SANGOMAR ═══ */}
        {frame < A2 + 10 && a1MarkerOp > 0.01 && (
          <>
            <Leader x1={sx} y1={sy} x2={PLAQUE_X + 10} y2={560 + 44} op={a1PlaqueOp} />
            <GisementMarker kind="oil" x={sx} y={sy} scale={a1Scale} frame={frame} localF={frame - a1MarkerStart} appeared={frame - a1MarkerStart > 24} uid="sangomar" zoom={zoom} oilImgSrc={staticFile(OIL_IMG)} />
          </>
        )}

        {/* ═══ ACTE 2 — GTA ═══ */}
        {frame >= A2 - 20 && frame < 900 && a2MarkerOp > 0.01 && (
          <>
            <Leader x1={gx} y1={gy} x2={PLAQUE_X + 10} y2={380 + 44} op={a2PlaqueOp} />
            <g transform={`translate(${gx}, ${gy})`} opacity={a2MarkerOp}>
              <g transform={`scale(${a2Scale})`}>
                {/* barre frontiere SN/MR sous le jeton */}
                <line x1={0} y1={-30} x2={0} y2={30} stroke={IVORY} strokeWidth={1.2} opacity={0.5} />
              </g>
            </g>
            <GisementMarker kind="gas" x={gx} y={gy} scale={a2Scale} frame={frame} localF={frame - a2MarkerStart} appeared={frame - a2MarkerStart > 24} uid="gta" zoom={zoom} />
          </>
        )}

        {/* ACTE 2 — flux export (dezoom monde) : SEULEMENT les destinations (clients).
            Pas de fleche partant de la Russie (melangeant) — la Russie reste affichee comme
            drapeau qui s'estompe (le concurrent qu'on remplace), mais sans fleche propre. */}
        {frame >= 895 && frame < A3 + 10 && (
          <>
            {/* GTA -> Europe (ivoire, positif) */}
            {flowEuropeOp > 0.01 && (
              <BezierFlow x0={gx} y0={gy} cpX={eurCp[0]} cpY={eurCp[1]} x1={ex} y1={ey} progress={flowEuropeProg} stroke={IVORY} strokeWidth={3.4} opacity={flowEuropeOp} />
            )}
            {/* GTA -> Asie (or, positif) */}
            {flowAsiaOp > 0.01 && (
              <BezierFlow x0={gx} y0={gy} cpX={asiaCp[0]} cpY={asiaCp[1]} x1={asx} y1={asy} progress={flowAsiaProg} stroke={GOLD} strokeWidth={3.4} opacity={flowAsiaOp} />
            )}
          </>
        )}

        {/* ═══ ACTE 3 — YAKAAR : convoitise ═══ */}
        {frame >= A3 && (
          <>
            {/* fleches de convoitise : tracees vers Yakaar, s'arretent 56px avant (gap = suspense) */}
            {convoiteOrigins.map(([ox, oy], i) => {
              const drawProg = interpolate(frame, [1240 + i * 8, 1330 + i * 8], [0, 1], clamp);
              if (drawProg <= 0.005) return null;
              const dx = yx - ox, dy = yy - oy;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 1) return null;
              const endFrac = Math.max(0, (dist - 56) / dist);
              const curX = ox + drawProg * endFrac * dx;
              const curY = oy + drawProg * endFrac * dy;
              return (
                <g key={i}>
                  <line x1={ox} y1={oy} x2={curX} y2={curY} stroke={IVORY} strokeWidth={1.4} opacity={0.4} />
                  {drawProg > 0.9 && <circle cx={curX} cy={curY} r={3} fill={GOLD} opacity={0.6} />}
                </g>
              );
            })}
            {/* jeton Yakaar : anneau pointille qui RESPIRE (en attente) */}
            {a3Op > 0.01 && (
              <g transform={`translate(${yx}, ${yy})`} opacity={a3Op}>
                <g transform={`scale(${a3Scale})`}>
                  <circle r={26 + 4 * Math.sin((frame - a3MarkerStart) / 36)} fill="none" stroke={GOLD} strokeWidth={2.2} strokeDasharray="3 6" opacity={0.78 + 0.16 * Math.sin((frame - a3MarkerStart) / 36)} />
                  <circle r={38} fill="none" stroke={IVORY} strokeWidth={1} strokeDasharray="2 8" opacity={0.3} />
                  <circle r={6} fill={GOLD} />
                </g>
              </g>
            )}
          </>
        )}
      </svg>

      {/* ── ACTE 1 — plaque SANGOMAR deportee (ocean gauche) ──────────────────── */}
      {frame < A2 && a1PlaqueOp > 0.01 && (
        <GeoCountryPlaque frame={frame} name="SANGOMAR" color={GOLD} stat="Pétrole brut" source="Opérateur : Woodside (Australie)" appearAt={230} hideAt={A2} pos={{ x: PLAQUE_X, y: 560 }} />
      )}

      {/* ── ACTE 2 — plaque GTA deportee (ocean gauche) ──────────────────────── */}
      {frame >= A2 - 10 && frame < 730 && a2PlaqueOp > 0.01 && (
        <GeoCountryPlaque frame={frame} name="GTA" color={GOLD} stat="Gaz, depuis 2025" source="Opérateur : BP (Royaume-Uni)" appearAt={600} hideAt={724} pos={{ x: PLAQUE_X, y: 380 }} />
      )}

      {/* ── ACTE 3 — plaque YAKAAR deportee (ocean gauche) ───────────────────── */}
      {frame >= A3 + 60 && (
        <GeoCountryPlaque frame={frame} name="YAKAAR-TERANGA" color={GOLD} stat="Gaz, non attribué" source="Opérateur : à décider" appearAt={1180} hideAt={END} pos={{ x: PLAQUE_X, y: 470 }} />
      )}
    </>
  );
};

const OIL_IMG = "souverain/senegal-petrole-gaz/scene-gisements/jeton-petrole-offshore-square.png";

export const SCENE_GISEMENTS_V3_FRAMES = END;
export default SceneGisementsV3;
