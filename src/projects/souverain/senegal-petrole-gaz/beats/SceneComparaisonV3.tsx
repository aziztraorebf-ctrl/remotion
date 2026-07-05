/**
 * SceneComparaisonV3 — la lecon Norvege / Congo-Brazzaville / Botswana (Senegal Petrole & Gaz, V3-REFONTE, scene 2).
 *
 * Ecrite DEPUIS LA VOIX (force alignment V3 du segment 122->187.5s de narration-v3-VALIDEE.mp3 :
 * out/episodes/senegal-petrole-gaz/_audio-v3/forced-align-v3.json, loss faible — pas de re-Whisper).
 * Workflow : doctrine -> intention -> forme -> briques V5. Reprend l'architecture de Beat10 V1 (1 carte continue,
 * camera voyage Norvege->Congo->Botswana, dots sonar, nom pays + chiffre) et l'ELEVE au niveau V3 :
 *   - DRAPEAUX DRAPES (MapboxCountryFlagDecal) sur chaque pays au lieu d'un aplat uni terne (V1).
 *   - Carte d'OPPOSITION : plaque-verdict deportee (GeoCountryPlaque + leader fleche), couleur semantique
 *     (or = vertueux, rouge sourd = gache, vert = vertueux). 3 destins confrontes, pas juste situes.
 *   - punchline REGLES retravaillee (le mot frappe).
 *
 * INTENTION (1 verbe) : OPPOSER. Meme ressource, presque la meme epoque, 3 destins -> ce qui decide = les REGLES.
 *
 * Cale sur l'audio REEL (frame_scene = (t_abs - 122) * 30) :
 *   123.82 "Avant de juger" f56 · 129.49 "Norvege" f225 · 131.08 "1969" f272 · 135.92 "fonds souverain" f417
 *   143.08 "mille cinq cents milliards" f632 · 146.62 "280 000 $/hab" f739 · 150.34 "Congo-Brazzaville" f850
 *   155.90 "plus endettes" f1017 · 162.24 "Botswana" f1207 · 165.36 "diamants 1966" f1301 · 170.38 "institutions" f1451
 *   176.24 "Meme ressource" f1627 · 179.02 "Trois destins" f1711 · 184.34 "pas la ressource" f1870 · 186.68 "REGLES" f1940
 *
 * Anti-derive : tout overlay geo-ancre = map.project([lon,lat]) RECALCULE chaque frame (useCurrentFrame).
 */
import React, { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring,
  continueRender, delayRender,
} from "remotion";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import type mapboxgl from "mapbox-gl";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { CartoSouverainV5 } from "../../../_shared/mapbox/CartoSouverainV5";
import { GeoCountryPlaque } from "../../../_shared/mapbox/GeoCountryPlaque";
import { MapboxCountryFlagDecal } from "../../../_shared/mapbox/MapboxCountryFlagDecal";
import { drawFlagCanvas } from "../../../_shared/mapbox/flagCanvas";
import { GisementMarker } from "../../../_shared/mapbox/GisementTokens";

const { fontFamily: BEBAS } = loadBebas();

const AUDIO_START = 122; // la scene comparaison commence a 122s dans l'audio de l'episode
const NAVY = "#16213a", GOLD = "#c8a951", IVORY = "#f2efe6";
const ORANGE = "#b5544a"; // Congo — rouge sourd, non accusateur
const GREEN = "#3a8a70";  // Botswana
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920, H = 1080;

// ── coords reelles (point cle par pays) ───────────────────────────────────────
const NORVEGE: [number, number] = [4.50, 61.20];   // territoire (ancre la plaque verdict)
const NORVEGE_OIL: [number, number] = [2.80, 60.30]; // gisement OFFSHORE mer du Nord (le jeton petrole, dans l'eau)
const CONGO: [number, number] = [11.86, -4.80];    // Pointe-Noire (petrole offshore)
const BOTSWANA: [number, number] = [24.73, -24.60];// Jwaneng (mine de diamants Debswana)
// bbox metropolitaine Norvege : Natural Earth "Norway" inclut Svalbard/Jan Mayen (tres au nord)
// -> sans clip, la metropole devient minuscule et le drapeau s'etale sur du vide. Clip sur le continent.
const NOR_BBOX: [number, number, number, number] = [4.0, 57.5, 31.5, 71.5];

// ── frontieres de phase (frames @30fps, segment 122->187.5s = 1965f) ──────────
const END = 1965;
// entrees pays (cale sur la voix)
const F_NOR = 200;   // plongee Norvege commence avant "Norvege" f225
const F_TRANS_AB = 820;  // pull-back, depart sud
const F_COG = 870;   // plongee Congo (voix "Congo" f850)
const F_TRANS_BC = 1180; // depart SE
const F_BWA = 1210;  // plongee Botswana (voix f1207)
// fin : fade vers triple screen apres Botswana (voix "Meme ressource" f1627, "REGLES" f1940)
const F_CRANE = 1600;

// ────────────────────────────────────────────────────────────────────────────
//  brightenMap — eclaircit le fond de carte APRES applyGeoAfriqueV5 (override LOCAL,
//  ne touche pas le composant partage). Aziz : la carte sombre ne saute pas aux yeux
//  en plein jour sur mobile. On releve terres + eau + frontieres, sans changer la carte.
//  Frontieres : line-width pilotee par le ZOOM (anti-bouillie au dezoom).
// ────────────────────────────────────────────────────────────────────────────
const brightenMap = (map: mapboxgl.Map) => {
  const safe = (id: string, prop: string, val: unknown) => {
    try { if (map.getLayer(id)) (map.setPaintProperty as any)(id, prop, val); } catch (_e) {}
  };
  const LAND = "#6f7480";   // terres : gris desature plus CLAIR (etait #4a4a4a)
  const WATER = "#274b73";  // eau : bleu un peu plus clair, contraste terre/eau maintenu (etait #1a3a5c)
  const BORDER = "#eef0f3"; // frontieres : blanc franc (etait #c8c8c8)
  safe("land", "background-color", LAND);
  safe("landuse", "fill-color", LAND);
  safe("national-park", "fill-color", LAND);
  safe("landcover", "fill-color", LAND);
  safe("water", "fill-color", WATER);
  safe("water-shadow", "fill-color", WATER);
  // frontieres : couleur franche + epaisseur croissante au zoom (lisible de loin SANS bouillie de pres)
  safe("admin-0-boundary", "line-color", BORDER);
  safe("admin-0-boundary", "line-width", ["interpolate", ["linear"], ["zoom"], 2, 0.8, 4, 1.6, 6, 2.6]);
  safe("admin-0-boundary", "line-opacity", 0.9);
  safe("admin-0-boundary-disputed", "line-color", BORDER);
  safe("admin-1-boundary", "line-color", "rgba(210,210,210,0.18)");
};

export const SceneComparaisonV3: React.FC = () => {
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [, force] = useState(0);

  // ── Camera : 1 trajectoire continue Norvege -> Congo -> Botswana -> vue large (crane-up) ──
  const camKeys = [
    // Etablissement : Europe du Nord / mer du Nord
    { atProgress: 0.0,          cam: { lon: 6.0, lat: 60.0, zoom: 3.8, pitch: 0, bearing: 0 } },
    // Plongee Norvege (cote mer du Nord)
    { atProgress: F_NOR / END,  cam: { lon: 5.6, lat: 60.2, zoom: 4.4, pitch: 8, bearing: 0 } },
    { atProgress: 360 / END,    cam: { lon: NORVEGE[0] + 0.6, lat: NORVEGE[1] - 0.2, zoom: 5.2, pitch: 32, bearing: -6 } },
    { atProgress: (F_TRANS_AB - 40) / END, cam: { lon: NORVEGE[0] + 0.7, lat: NORVEGE[1] - 0.3, zoom: 5.3, pitch: 32, bearing: -4 } },
    // Pull-back + voyage sud vers Congo (bearing remis a 0 avant le grand trajet)
    { atProgress: F_TRANS_AB / END, cam: { lon: 7.5, lat: 30.0, zoom: 3.4, pitch: 0, bearing: 0 } },
    // Plongee Congo (Pointe-Noire)
    { atProgress: F_COG / END,  cam: { lon: 12.0, lat: -3.5, zoom: 4.4, pitch: 6, bearing: 0 } },
    { atProgress: 1020 / END,   cam: { lon: CONGO[0] + 0.5, lat: CONGO[1] - 0.2, zoom: 5.4, pitch: 30, bearing: 4 } },
    { atProgress: (F_TRANS_BC - 40) / END, cam: { lon: CONGO[0] + 0.55, lat: CONGO[1] - 0.25, zoom: 5.4, pitch: 30, bearing: 6 } },
    // Depart SE vers Botswana
    { atProgress: F_TRANS_BC / END, cam: { lon: 20.0, lat: -14.0, zoom: 3.6, pitch: 0, bearing: 0 } },
    // Plongee Botswana (Jwaneng)
    { atProgress: F_BWA / END,  cam: { lon: 24.0, lat: -23.0, zoom: 4.2, pitch: 6, bearing: 0 } },
    { atProgress: 1400 / END,   cam: { lon: BOTSWANA[0] + 0.5, lat: BOTSWANA[1] - 0.2, zoom: 5.3, pitch: 30, bearing: -5 } },
    { atProgress: (F_CRANE - 20) / END, cam: { lon: BOTSWANA[0] + 0.5, lat: BOTSWANA[1] - 0.2, zoom: 5.3, pitch: 28, bearing: -3 } },
    // Le triple screen final couvre l'ecran a partir de F_CRANE : la carte se voile dessous.
    // Pas de crane-up large necessaire — leger recul doux sur Botswana pendant le fade.
    { atProgress: 1780 / END,   cam: { lon: BOTSWANA[0] + 0.6, lat: BOTSWANA[1], zoom: 4.6, pitch: 14, bearing: 0 } },
    { atProgress: 1.0,          cam: { lon: BOTSWANA[0] + 0.7, lat: BOTSWANA[1] + 0.2, zoom: 4.4, pitch: 8, bearing: 0 } },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      {/* Narration RETARDEE ROUND 2 2026-07-05 (bug silence "decide...vraiment du resultat"), CORRIGE
          (le premier essai avec Sequence from={55} avait une erreur de referentiel : le fichier
          comparaison demarre PHYSIQUEMENT dans le montage a la fin de gisements = 123.90s, pas a
          AUDIO_START=122s. Sequence from={55} retardait donc l'audio de 55/30=1.83s de PLUS apres ce
          point, creant un silence de pres de 2s — signale par Aziz a la reecoute). Fix : Sequence
          from={0} (pas de retard — gisements couvre deja tout jusqu'a 123.90s), startFrom=123.90s pour
          reprendre EXACTEMENT ou gisements s'est arrete (pile sur "avant de juger", zero silence, zero
          repetition). AUDIO_START (122s) INCHANGE, pilote toujours tous les beats visuels
          independamment de cette Audio. */}
      <Audio src={staticFile("souverain/senegal-petrole-gaz/audio/narration-v3-VALIDEE.mp3")} startFrom={Math.round(123.90 * fps)} endAt={Math.round(187.6 * fps)} />
      {/* Musique de fond — meme piste que la scene gisements (continuite sonore), ~5.5%, fade-out 3s a la fin */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={AUDIO_START * fps}
        volume={(f) => {
          const fadeStart = END - 90; // 3s avant la fin
          if (f >= fadeStart) return 0.055 * Math.max(0, 1 - (f - fadeStart) / 90);
          return 0.055;
        }}
      />
      <SceneSFX />
      <CartoSouverainV5 camKeys={camKeys} focusIsos={[]} onMapReady={(m) => { mapRef.current = m; brightenMap(m); force((n) => n + 1); }}>
        {/* DRAPEAUX DRAPES — chaque pays prend son drapeau a son arrivee (carte vivante, pas aplat terne V1) */}
        <AnimatedFlagDecal mapRef={mapRef} iso="NOR" geoNames={["Norway"]} appearAt={F_NOR + 30} maxOpacity={0.72} clipBbox={NOR_BBOX} />
        <AnimatedFlagDecal mapRef={mapRef} iso="COG" geoNames={["Congo"]} appearAt={F_COG + 30} maxOpacity={0.72} />
        <AnimatedFlagDecal mapRef={mapRef} iso="BWA" geoNames={["Botswana"]} appearAt={F_BWA + 30} maxOpacity={0.72} />
        {/* Overlays geo-ancres : dots sonar + leaders + plaques verdict */}
        <Overlays mapRef={mapRef} />
      </CartoSouverainV5>
      {/* Fin = triple screen NU (3 pays cote a cote, zero phrase, la voix porte le recit) */}
      <TripleScreen />
      {/* Vignette tres douce (allegee : ne pas reassombrir les bords — carte lisible en plein jour) */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 60%, rgba(13,21,32,0.22) 100%)",
      }} />
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  Drapeau drape avec opacite ANIMEE (injecte a opacite 0, pilote raster-opacity par frame).
//  Repris du pattern AnimatedFlagDecal de SceneGisementsV3 (prouve).
// ════════════════════════════════════════════════════════════════════════════
const AnimatedFlagDecal: React.FC<{
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  iso: string;
  geoNames: string[];
  appearAt: number;
  maxOpacity?: number;
  clipBbox?: [number, number, number, number];
}> = ({ mapRef, iso, geoNames, appearAt, maxOpacity = 0.72, clipBbox }) => {
  const frame = useCurrentFrame();
  const map = mapRef.current;
  const op = interpolate(frame, [appearAt, appearAt + 30], [0, maxOpacity], clamp);
  if (map) {
    const layerId = `flagdecal-lyr-${iso}`;
    if (map.getLayer(layerId)) {
      try { map.setPaintProperty(layerId, "raster-opacity", op); } catch (_e) { /* layer pas pret */ }
    }
  }
  return <MapboxCountryFlagDecal mapRef={mapRef} iso={iso} geoNames={geoNames} drawFlag={(s) => drawFlagCanvas(iso, s)} opacity={0} clipBbox={clipBbox} />;
};

// ════════════════════════════════════════════════════════════════════════════
//  SFX — cale AU MILLIMETRE via <Sequence from={frame}> (frame-perfect, pas de
//  fenetre montage/demontage imprecise). Timings = forced-align V3 (frame=(t-122)*30).
// ════════════════════════════════════════════════════════════════════════════
const SFX = {
  swoosh: "_shared/sfx/camera/sfx-swoosh-pullback.mp3", // transition entre pays
  stamp:  "_shared/sfx/ui/stamp-dossier.mp3",           // estampe du jeton petrole (decouverte)
  ping:   "_shared/sfx/data/stat-tick.mp3",             // clic d'inscription du chiffre (plaque verdict)
  impact: "_shared/sfx/impact/impact.mp3",              // whoosh+impact au fade triple screen
};
// 1 SFX cale a une frame exacte : Sequence demarre le son pile a `at`, dure `dur` frames.
const Sfx: React.FC<{ at: number; src: string; volume?: number; dur?: number }> = ({ at, src, volume = 0.5, dur = 30 }) => (
  <Sequence from={at} durationInFrames={dur} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);
const SceneSFX: React.FC = () => (
  <>
    {/* stamp jeton petrole offshore Norvege (apparition jeton) */}
    <Sfx at={F_NOR + 30} src={SFX.stamp} volume={0.42} dur={40} />
    {/* ping plaque verdict (le chiffre s'inscrit) — pile a l'apparition de chaque plaque */}
    <Sfx at={F_NOR + 55} src={SFX.ping} volume={0.5} />
    {/* swoosh transition Norvege -> Congo */}
    <Sfx at={F_TRANS_AB} src={SFX.swoosh} volume={0.4} dur={30} />
    <Sfx at={F_COG + 55} src={SFX.ping} volume={0.5} />
    {/* swoosh transition Congo -> Botswana */}
    <Sfx at={F_TRANS_BC} src={SFX.swoosh} volume={0.4} dur={30} />
    <Sfx at={F_BWA + 55} src={SFX.ping} volume={0.5} />
    {/* impact + whoosh au fade vers le triple screen (climax "meme ressource") */}
    <Sfx at={F_CRANE} src={SFX.impact} volume={0.5} dur={50} />
  </>
);

// ════════════════════════════════════════════════════════════════════════════
//  Dot sonar geo-ancre (point cle par pays) — sobre, anneaux qui se propagent (P4)
// ════════════════════════════════════════════════════════════════════════════
const Dot: React.FC<{ x: number; y: number; color: string; appearAt: number; frame: number; fps: number }> = ({ x, y, color, appearAt, frame, fps }) => {
  const lf = frame - appearAt;
  if (lf < 0) return null;
  const p = spring({ frame: lf, fps, config: { damping: 9, stiffness: 320 }, durationInFrames: 24 });
  const scale = interpolate(p, [0, 1], [0.05, 1], clamp);
  const op = interpolate(p, [0, 0.1, 1], [0, 1, 1], clamp);
  const rings = [0, 1, 2].map((i) => {
    const rf = Math.max(0, lf - i * 28);
    const t = (rf % 80) / 80;
    return { r: t * 60, o: interpolate(t, [0, 0.15, 0.65, 1], [0, 0.5, 0.18, 0], clamp) * op };
  });
  return (
    <g>
      {rings.map((r, i) => (
        <circle key={i} cx={x} cy={y} r={r.r} fill="none" stroke={color} strokeWidth={1.5} opacity={r.o} />
      ))}
      <circle cx={x} cy={y} r={10 * scale} fill={color} opacity={op} />
      <circle cx={x} cy={y} r={4 * scale} fill={IVORY} opacity={op} />
    </g>
  );
};

// Leader : ligne or + pointe du point geo vers la plaque deportee (P3 doctrine)
const Leader: React.FC<{ x1: number; y1: number; x2: number; y2: number; op: number }> = ({ x1, y1, x2, y2, op }) => {
  if (op <= 0.01) return null;
  return (
    <g opacity={op}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth={2} strokeLinecap="round" opacity={0.85} />
      <circle cx={x1} cy={y1} r={3} fill={GOLD} />
    </g>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  OVERLAYS — 1 seul SVG plein ecran, positions recalculees chaque frame (anti-derive)
//  + plaques verdict deportees (GeoCountryPlaque mode pos), reliees par leader.
// ════════════════════════════════════════════════════════════════════════════
const Overlays: React.FC<{ mapRef: React.MutableRefObject<mapboxgl.Map | null> }> = ({ mapRef }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const map = mapRef.current;
  if (!map) return null;
  const P = (c: [number, number]) => { const p = map.project(c as any); return { x: p.x, y: p.y }; };
  const zoomNow = map.getZoom();

  const nor = P(NORVEGE);
  const norOil = P(NORVEGE_OIL); // jeton petrole offshore (dans l'eau, contraste sur la mer)
  const cog = P(CONGO);
  const bwa = P(BOTSWANA);

  // plaques deportees : a droite du point (zone libre), reliees par leader.
  // offset fixe ecran (la plaque vit pres du point mais decalee dans le vide).
  // marge laterale = demi-largeur max d'une plaque (pilule nom + stat ~720px, centree via translate(-50%))
  // -> clamp a 380px des bords pour ne jamais deborder.
  const plaqueOffset = (pt: { x: number; y: number }, side: 1 | -1, dx = 240, dy = -150) => ({
    x: Math.max(380, Math.min(W - 380, pt.x + side * dx)),
    y: Math.max(190, Math.min(H - 210, pt.y + dy)),
  });
  // plaque Norvege ancree sur le JETON offshore (le leader part du jeton, comme scene gisements)
  const norP = plaqueOffset(norOil, 1, 250, -40);
  const cogP = plaqueOffset(cog, 1, 250, -60);
  const bwaP = plaqueOffset(bwa, -1, 250, -60);

  // opacite des leaders (suivent la fenetre de la plaque)
  const norLeadOp = interpolate(frame, [F_NOR + 40, F_NOR + 70, F_TRANS_AB - 20, F_TRANS_AB + 10], [0, 1, 1, 0], clamp);
  const cogLeadOp = interpolate(frame, [F_COG + 40, F_COG + 70, F_TRANS_BC - 20, F_TRANS_BC + 10], [0, 1, 1, 0], clamp);
  const bwaLeadOp = interpolate(frame, [F_BWA + 40, F_BWA + 70, F_CRANE - 30, F_CRANE], [0, 1, 1, 0], clamp);

  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
        {/* leaders point -> plaque (Norvege : depuis le JETON offshore, pas le territoire) */}
        {frame >= F_NOR + 40 && frame < F_TRANS_AB + 10 && <Leader x1={norOil.x} y1={norOil.y} x2={norP.x} y2={norP.y} op={norLeadOp} />}
        {frame >= F_COG + 40 && frame < F_TRANS_BC + 10 && <Leader x1={cog.x} y1={cog.y} x2={cogP.x} y2={cogP.y} op={cogLeadOp} />}
        {frame >= F_BWA + 40 && frame < F_CRANE && <Leader x1={bwa.x} y1={bwa.y} x2={bwaP.x} y2={bwaP.y} op={bwaLeadOp} />}
        {/* NORVEGE = jeton petrole offshore (ce qu'ils ont decouvert en mer du Nord, esthetique navy+or
            coherente avec la scene gisements precedente). Congo/Botswana = dot sonar sobre. */}
        {frame >= F_NOR + 30 && frame < F_TRANS_AB + 10 && (
          <GisementMarker
            kind="oil" x={norOil.x} y={norOil.y}
            scale={1.6 * interpolate(spring({ frame: frame - (F_NOR + 30), fps, config: { damping: 11, stiffness: 280 }, durationInFrames: 26 }), [0, 1], [0, 1], clamp)}
            frame={frame} localF={frame - (F_NOR + 30)} appeared={frame - (F_NOR + 30) > 24}
            uid="norvege-oil" zoom={zoomNow}
          />
        )}
        {frame >= F_COG + 30 && frame < F_TRANS_BC + 10 && <Dot x={cog.x} y={cog.y} color={ORANGE} appearAt={F_COG + 30} frame={frame} fps={fps} />}
        {frame >= F_BWA + 30 && frame < F_CRANE && <Dot x={bwa.x} y={bwa.y} color={GREEN} appearAt={F_BWA + 30} frame={frame} fps={fps} />}
      </svg>

      {/* plaques verdict deportees — UN SEUL CHIFFRE FACTUEL par pays (pas de jugement de valeur, decision Aziz).
          Norvege = ce qu'ils ont accumule · Congo = leur dette · Botswana = leur fonds (comme la Norvege). */}
      <GeoCountryPlaque
        frame={frame} name="NORVEGE" color={GOLD}
        stat="1 500 Mds$"
        source="fonds souverain — NBIM 2025"
        appearAt={F_NOR + 55} hideAt={F_TRANS_AB} pos={norP} fadeFrames={14}
      />
      <GeoCountryPlaque
        frame={frame} name="CONGO-BRAZZAVILLE" color={ORANGE}
        stat="dette : 92% du PIB"
        source="2024 — Banque mondiale"
        appearAt={F_COG + 55} hideAt={F_TRANS_BC} pos={cogP} fadeFrames={14}
      />
      <GeoCountryPlaque
        frame={frame} name="BOTSWANA" color={GREEN}
        stat="fonds souverain — Pula Fund"
        source="diamants, dès 1966"
        appearAt={F_BWA + 55} hideAt={F_CRANE} pos={bwaP} fadeFrames={14}
      />
    </>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  TRIPLE SCREEN FINAL — apres Botswana, fade -> 3 pays cote a cote (drapeau + 1 chiffre
//  factuel chacun). ZERO phrase a l'ecran : la voix porte le recit ("meme ressource... ce sont
//  les regles."). Decision Aziz : enlever les 4 lignes redondantes avec la voix.
//  L'opposition se LIT dans le triptyque (3 destins juxtaposes), pas dans du texte.
// ════════════════════════════════════════════════════════════════════════════
type Panel = { iso: string; geoName: string; name: string; stat: string; color: string; clipBbox?: [number, number, number, number] };
const PANELS: Panel[] = [
  // Norvege : clip continental (enleve Svalbard + iles eparses du Grand Nord -> silhouette compacte, taille comparable aux autres)
  { iso: "NOR", geoName: "Norway",   name: "NORVÈGE", stat: "1 500 Mds$",        color: GOLD,   clipBbox: [4.0, 57.8, 31.5, 71.3] },
  { iso: "COG", geoName: "Congo",    name: "CONGO",   stat: "dette : 92% du PIB", color: ORANGE },
  { iso: "BWA", geoName: "Botswana", name: "BOTSWANA",stat: "fonds souverain",   color: GREEN },
];

// filtre les anneaux d'un feature pour ne garder que ceux dont le centre tombe dans une bbox (pays a iles eparses)
const clipFeatureToBbox = (feat: any, bbox: [number, number, number, number]) => {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const inside = (ring: number[][]) => {
    let cx = 0, cy = 0;
    for (const [lon, lat] of ring) { cx += lon; cy += lat; }
    cx /= ring.length; cy /= ring.length;
    return cx >= minLon && cx <= maxLon && cy >= minLat && cy <= maxLat;
  };
  const g = feat.geometry;
  if (g.type === "Polygon") {
    return inside(g.coordinates[0]) ? feat : null;
  }
  if (g.type === "MultiPolygon") {
    const kept = g.coordinates.filter((poly: number[][][]) => inside(poly[0]));
    if (!kept.length) return feat;
    return { ...feat, geometry: { type: "MultiPolygon", coordinates: kept } };
  }
  return feat;
};

// drapeau dessine une fois en dataURL (canvas synchrone)
const flagDataUrl = (iso: string): string => {
  try { return drawFlagCanvas(iso, 1024).toDataURL("image/png"); } catch (_e) { return ""; }
};

// TerritoryFlagPanel — la SILHOUETTE du pays (d3-geo) remplie de son drapeau (decision Aziz :
// chaque ecran = le territoire avec son drapeau projete dessus, comme sur la carte, pas un rectangle).
const TerritoryFlagPanel: React.FC<{ panel: Panel; index: number; topology: any; frame: number; fps: number }> = ({ panel, index, topology, frame, fps }) => {
  const PW = W / 3, PH = H; // dimensions du panneau
  const [flagUrl] = useState(() => flagDataUrl(panel.iso));

  const { pathD, bbox, centroid } = React.useMemo(() => {
    try {
      const fc = feature(topology, topology.objects.countries) as unknown as { features: any[] };
      const feat = fc.features.find((f: any) => f.properties?.name === panel.geoName);
      if (!feat) return { pathD: "", bbox: [[0, 0], [PW, PH]], centroid: [PW / 2, PH / 2] };
      // fitExtent : cale la silhouette dans le panneau (marge ~ pour laisser place au texte en bas)
      const proj = geoMercator().fitExtent([[44, 80], [PW - 44, PH - 230]], feat);
      const gp = geoPath(proj);
      return { pathD: gp(feat) ?? "", bbox: gp.bounds(feat), centroid: gp.centroid(feat) };
    } catch (_e) { return { pathD: "", bbox: [[0, 0], [PW, PH]], centroid: [PW / 2, PH / 2] }; }
  }, [topology, panel.geoName, PW, PH]);

  const appearAt = F_CRANE + 20 + index * 12;
  const p = spring({ frame: frame - appearAt, fps, config: { damping: 18, stiffness: 150 }, durationInFrames: 26 });
  const op = interpolate(p, [0, 1], [0, 1], clamp);
  const y = interpolate(p, [0, 1], [40, 0], clamp);
  const glow = 0.55 + 0.25 * Math.sin((frame - appearAt) / 22);

  const [[bx0, by0], [bx1, by1]] = bbox;
  const clipId = `terr-${panel.iso}`;

  return (
    <div style={{
      flex: 1, height: "100%", position: "relative", overflow: "hidden",
      opacity: op, transform: `translateY(${y}px)`,
      borderLeft: index > 0 ? `2px solid ${GOLD}44` : "none",
      background: "radial-gradient(ellipse at 50% 42%, rgba(40,52,78,0.55) 0%, rgba(13,21,32,0.95) 78%)",
    }}>
      {/* SILHOUETTE territoire + drapeau clippe a la forme */}
      <svg width={PW} height={PH} viewBox={`0 0 ${PW} ${PH}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id={clipId}><path d={pathD} /></clipPath>
        </defs>
        {/* halo couleur derriere la silhouette (paths superposes — PAS de filter:blur, invisible en headless) */}
        <path d={pathD} fill="none" stroke={panel.color} strokeWidth={16} opacity={glow * 0.18} strokeLinejoin="round" />
        <path d={pathD} fill="none" stroke={panel.color} strokeWidth={9}  opacity={glow * 0.32} strokeLinejoin="round" />
        <path d={pathD} fill={panel.color} opacity={0.12} />
        {/* drapeau clippe a la silhouette */}
        {flagUrl && pathD && (
          <image href={flagUrl} x={bx0} y={by0} width={bx1 - bx0} height={by1 - by0}
            preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} opacity={0.92} />
        )}
        {/* liseré net */}
        <path d={pathD} fill="none" stroke={IVORY} strokeWidth={2} opacity={0.7} strokeLinejoin="round" />
      </svg>

      {/* nom + chiffre factuel, en bas du panneau */}
      <div style={{
        position: "absolute", bottom: 70, left: 0, right: 0, textAlign: "center", padding: "0 24px",
      }}>
        <div style={{
          color: IVORY, fontFamily: BEBAS, fontSize: 54, letterSpacing: "0.06em",
          textShadow: "0 3px 20px rgba(0,0,0,0.95)", marginBottom: 14,
        }}>{panel.name}</div>
        <div style={{ width: 60, height: 3, background: panel.color, margin: "0 auto 14px", borderRadius: 2 }} />
        <div style={{
          color: panel.color, fontFamily: BEBAS, fontSize: 40, letterSpacing: "0.03em",
          textShadow: "0 2px 18px rgba(0,0,0,0.95)",
        }}>{panel.stat}</div>
      </div>
    </div>
  );
};

const TripleScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [topo, setTopo] = useState<any>(null);
  const [handle] = useState(() => delayRender("triple-screen-topo"));
  useEffect(() => {
    fetch(staticFile("_shared/geo-data/countries-50m.json"))
      .then((r) => r.json())
      .then((j) => { setTopo(j); continueRender(handle); })
      .catch(() => continueRender(handle));
  }, [handle]);

  if (frame < F_CRANE - 10) return null;
  const veil = interpolate(frame, [F_CRANE - 10, F_CRANE + 30], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundColor: NAVY, opacity: veil }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", opacity: veil }}>
        {topo && PANELS.map((panel, i) => (
          <TerritoryFlagPanel key={panel.iso} panel={panel} index={i} topology={topo} frame={frame} fps={fps} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const SCENE_COMPARAISON_V3_FRAMES = END;
export default SceneComparaisonV3;
