/**
 * SceneCoulissesV3 — "les coulisses / Yakaar" (Senegal Petrole & Gaz, V3-REFONTE, scene 5, MAPBOX -> encart navy+or).
 *
 * 1er test du systeme agentique sur du MAPBOX. Ecrite DEPUIS LA VOIX (forced-align V3 reel,
 * segment 288.7s -> 344.46s de narration-v3-VALIDEE.mp3 : out/.../_audio-v3/forced-align-v3.json).
 * Plan valide Aziz : V3-REFONTE/PLAN-SCENE-5.md (3 arbitrages : bascule Option A, acteurs en libelle texte +
 * drapeaux pour les Etats seulement, coeur partie 2 = DUEL DE JAUGES).
 *
 * INTENTION (1 verbe) : BASCULER. Le dernier champ (Yakaar-Teranga, loin de Dakar) attend sa decision
 * d'investissement. L'Occident ralentit (climat), Pekin observe. La video quitte le Senegal pour un rapport
 * de force en suspens : "qui prend leur place... et a quel prix ?". 3e et DERNIER terrain (continuite 3/3).
 *
 * FORME : un seul fichier, 2 registres, bascule franche au milieu (f1130 "Pourquoi ca compte ?").
 *  - PARTIE 1 (carte Mapbox vivante, f0->~1130) : reprend la grammaire de SceneComparaisonV3 (sc.2 FINAL) :
 *    CartoSouverainV5 (1 Map continue, camKeys frame-driven, drift), GisementMarker (jeton gaz offshore),
 *    GeoCountryPlaque (plaques acteurs deportees + leaders), brightenMap, SFX en <Sequence>.
 *  - BASCULE (Option A validee Aziz) : veil navy montant + le jeton Yakaar reste ancre et migre vers le centre
 *    de l'encart, grille or derriere. Whip-pan + impact sourd. Continuite d'objet (pas un cut brutal).
 *  - PARTIE 2 (encart navy+or, f1130->1673) : reprend la grammaire data-viz de SceneDetteV3/SceneContratV3
 *    (GridBackground grille or qui respire, BebasNeue). DUEL DE JAUGES : EUROPE (or) RECULE sous pression
 *    climatique / CHINE (rouge) MONTE vers Yakaar. Le jeton Yakaar reste le point d'ancrage central. Question
 *    finale en 2 temps : "QUI PREND LEUR PLACE ?" / "ET A QUEL PRIX ?".
 *
 * REGISTRE (continuite V3 NON negociable) : navy #16213a + grille or + BebasNeue. PAS le kraft V1 Beat13.
 * Drapeaux : Etats seulement (Chine cn.png, Europe = cercle d'etoiles UE stylise). Societes = libelle texte.
 * Anti-derive : tout overlay geo-ancre = map.project([lon,lat]) RECALCULE chaque frame (useCurrentFrame).
 */
import React, { useRef, useState } from "react";
import {
  AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring,
} from "remotion";
import type mapboxgl from "mapbox-gl";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { CartoSouverainV5 } from "../../../_shared/mapbox/CartoSouverainV5";
import { GisementMarker } from "../../../_shared/mapbox/GisementTokens";
import { MapboxCountryFlagDecal } from "../../../_shared/mapbox/MapboxCountryFlagDecal";
import { drawFlagCanvas } from "../../../_shared/mapbox/flagCanvas";

const { fontFamily: BEBAS } = loadBebas();

// Narration : MP3 DEDIE a la scene 5 (segment 288.7->344.46 de l'episode AVEC 0.7s de silence insere entre
// "...et a quel prix ?" et "Voila ou en est le Senegal" — retour Aziz : laisser respirer avant la conclusion).
// Le fichier commence a 0, donc startFrom=0. Genere via ffmpeg (concat segment+silence+segment).
const NARRATION_SCENE5 = "souverain/senegal-petrole-gaz/audio/narration-v3-scene5-silence.mp3";
const NAVY = "#16213a", GOLD = "#c8a951", GOLD_HI = "#e8c472", IVORY = "#f2efe6";
const RED_CN = "#b5544a"; // Chine — rouge sourd, non criard (coherent sc.2)
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const W = 1920, H = 1080;

// ── coords reelles ───────────────────────────────────────────────────────────
const DAKAR: [number, number] = [-17.45, 14.69];
const YAKAAR: [number, number] = [-18.00, 14.20]; // gazier offshore, au large, "loin de Dakar"

// ── frontieres de phase (frames RELATIVES @30, confirmees forced-align reel) ──
const END = 1695; // 56.49s @30 (= segment 55.77s + 0.7s de silence insere avant "Voila ou en est le Senegal")
// PARTIE 1 (carte)
const F_DERNIER  = 26;   // "Reste le dernier terrain"
const F_DAKAR    = 52;   // "...loin de Dakar"
const F_SOUVENEZ = 138;  // "Souvenez-vous du troisieme champ"
const F_YAKAAR   = 209;  // "Yakaar-Teranga, celui qui attendait" (jeton apparait)
const F_CONTRAT  = 374;  // "deja sous contrat entre Kosmos..."
const F_BP       = 452;
const F_PETROSEN = 482;
const F_DECISION = 569;  // "decision finale d'investir n'est pas prise"
const F_ATTEND   = 664;  // "Le champ attend toujours"
const F_PAIERA   = 763;  // "qui paiera son developpement" (pull-back)
const F_CHINOIS  = 914;  // "discussions chinoises rapportees" (sert encore au cadrage camera, partie 1)
// BASCULE
const F_VEIL     = 1095; // amorce du veil (avant "Pourquoi")
const F_BASCULE  = 1130; // "Pourquoi ca compte ?"
// PARTIE 2 (encart)
const F_EUROPE   = 1221; // "Parce que l'Europe, sous pression climatique, ralentit..."
const F_RECULENT = 1394; // "Si les Occidentaux reculent sur Yakaar-Teranga"
const F_QUESTION = 1431; // "une question se posera tres vite"
const F_PLACE    = 1572; // "qui prend leur place..."
const F_PRIX     = 1617; // "et a quel prix ? Voila ou en est le Senegal."

// ────────────────────────────────────────────────────────────────────────────
//  brightenMap — eclaircit le fond de carte (repris VERBATIM de SceneComparaisonV3, override LOCAL).
// ────────────────────────────────────────────────────────────────────────────
const brightenMap = (map: mapboxgl.Map) => {
  const safe = (id: string, prop: string, val: unknown) => {
    try { if (map.getLayer(id)) (map.setPaintProperty as any)(id, prop, val); } catch (_e) {}
  };
  const LAND = "#6f7480", WATER = "#274b73", BORDER = "#eef0f3";
  safe("land", "background-color", LAND);
  safe("landuse", "fill-color", LAND);
  safe("national-park", "fill-color", LAND);
  safe("landcover", "fill-color", LAND);
  safe("water", "fill-color", WATER);
  safe("water-shadow", "fill-color", WATER);
  safe("admin-0-boundary", "line-color", BORDER);
  safe("admin-0-boundary", "line-width", ["interpolate", ["linear"], ["zoom"], 2, 0.8, 4, 1.6, 6, 2.6]);
  safe("admin-0-boundary", "line-opacity", 0.9);
  safe("admin-0-boundary-disputed", "line-color", BORDER);
  safe("admin-1-boundary", "line-color", "rgba(210,210,210,0.18)");
};

export const SceneCoulissesV3: React.FC = () => {
  const { fps } = useVideoConfig();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [, force] = useState(0);

  // ── Camera : 1 trajectoire continue (vue large -> Dakar -> offshore Yakaar -> pull-back) ──
  const camKeys = [
    // vue large Atlantique / Afrique de l'Ouest
    { atProgress: 0.0,            cam: { lon: -15.0, lat: 14.5, zoom: 4.2, pitch: 0, bearing: 0 } },
    // amorce plongee vers Dakar
    { atProgress: F_DAKAR / END,  cam: { lon: -16.6, lat: 14.6, zoom: 5.0, pitch: 12, bearing: -4 } },
    // glissement vers l'offshore (loin de Dakar)
    { atProgress: F_SOUVENEZ / END, cam: { lon: -17.6, lat: 14.4, zoom: 5.8, pitch: 24, bearing: -6 } },
    // plongee sur Yakaar (relief signature)
    { atProgress: F_YAKAAR / END, cam: { lon: YAKAAR[0] + 0.05, lat: YAKAAR[1] - 0.12, zoom: 6.6, pitch: 32, bearing: -4 } },
    // tenue sur Yakaar pendant acteurs + decision
    { atProgress: F_ATTEND / END, cam: { lon: YAKAAR[0] + 0.05, lat: YAKAAR[1] - 0.12, zoom: 6.7, pitch: 32, bearing: -2 } },
    // pull-back "qui paiera" (enjeu plus large) — bearing remis vers 0
    { atProgress: F_PAIERA / END, cam: { lon: -17.2, lat: 14.0, zoom: 5.6, pitch: 18, bearing: 0 } },
    // discussions Chine : leger pull-back de plus, on garde Yakaar a l'image
    { atProgress: F_CHINOIS / END, cam: { lon: -16.6, lat: 13.7, zoom: 5.2, pitch: 12, bearing: 3 } },
    // avant la bascule, tenue
    { atProgress: F_VEIL / END,   cam: { lon: -16.5, lat: 13.7, zoom: 5.2, pitch: 10, bearing: 3 } },
    { atProgress: 1.0,            cam: { lon: -16.5, lat: 13.7, zoom: 5.2, pitch: 10, bearing: 3 } },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: NAVY }}>
      <Audio src={staticFile(NARRATION_SCENE5)} />
      {/* Musique de fond — CONTINUITE sc.4 : la sc.4 a REDEMARRE la piste a startFrom=0 (la portion 243s+
          s'emballe et concurrence la voix — decision Aziz). La sc.5 enchaine sur la MEME portion calme du
          debut : startFrom=0 + on demarre plus loin dans la piste qu'a la sc.4 pour eviter une coupure nette.
          La sc.4 occupe ~45s de la piste (0->45s), donc on reprend a ~45s pour la continuite. ~5.5%, fade-out 3s. */}
      <Audio
        src={staticFile("souverain/senegal-petrole-gaz/audio/music-A-ambient-souverain.mp3")}
        startFrom={Math.round(45.4 * fps)}
        volume={(f) => {
          const fadeIn = interpolate(f, [0, 30], [0, 1], clamp);
          const fadeStart = END - 90;
          const fadeOut = f >= fadeStart ? Math.max(0, 1 - (f - fadeStart) / 90) : 1;
          return 0.055 * fadeIn * fadeOut;
        }}
      />
      <SceneSFX />

      {/* ── PARTIE 1 : CARTE MAPBOX ── (visible jusqu'a la bascule, voilee par le veil) */}
      <MapPart mapRef={mapRef} camKeys={camKeys} force={force} />

      {/* ── BASCULE + PARTIE 2 : ENCART NAVY+OR ── (par-dessus, apparait au veil) */}
      <EncartPart />
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  PARTIE 1 — CARTE MAPBOX (jeton Yakaar + acteurs + discussions Chine)
// ════════════════════════════════════════════════════════════════════════════
const MapPart: React.FC<{
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  camKeys: { atProgress: number; cam: any }[];
  force: React.Dispatch<React.SetStateAction<number>>;
}> = ({ mapRef, camKeys, force }) => {
  const frame = useCurrentFrame();
  const [mapReady, setMapReady] = useState(false);
  // la carte se voile pendant la bascule puis disparait (perf : on garde monte mais opacite 0)
  const mapOpacity = interpolate(frame, [F_VEIL, F_BASCULE + 10], [1, 0], clamp);
  if (frame > F_BASCULE + 30) return null; // au-dela, l'encart couvre tout
  return (
    <AbsoluteFill style={{ opacity: mapOpacity }}>
      {/* CHANTIER 8 (passe finition 2026-07-04) : driftScale=0.3 (au lieu du defaut 1) — le drift continu
          standard a une amplitude trop visible au zoom bas de cette scene (4.2-5.0, fenetre F_DAKAR),
          cause le tremblement du point Dakar (retour Aziz). Reduit ICI seulement (prop optionnelle,
          defaut inchange partout ailleurs — sc.2/gisements gardent leur comportement valide). */}
      <CartoSouverainV5 camKeys={camKeys} focusIsos={[]} driftScale={0.3} onMapReady={(m) => { mapRef.current = m; brightenMap(m); force((n) => n + 1); setMapReady(true); }}>
        {/* Territoire Senegal DRAPE de son DRAPEAU (FlagFill), PAS un aplat or — coherence avec sc.2
            (drapeaux drapes) et la doctrine "carte vivante = drapeau dans le polygone". Decision Aziz. */}
        <SenegalFlagDecal mapRef={mapRef} />
        <MapOverlays mapRef={mapRef} />
      </CartoSouverainV5>
      {/* Titre haut : indicateur 3/3 — DERNIER TERRAIN (continuite sc.3=1/3, sc.4=2/3) */}
      <TerrainsIndicator />
      {/* vignette tres douce (carte lisible en plein jour) */}
      <AbsoluteFill style={{
        pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 60%, rgba(13,21,32,0.22) 100%)",
      }} />
      {/* CHANTIER 5 (passe finition 2026-07-04) : voile navy qui masque le flash gris Mapbox pendant le
          chargement du style/tuiles (onMapReady pas encore appele). Fade-out rapide une fois pret ; sur les
          premieres frames avant meme le montage de CartoSouverainV5, le voile est plein opaque (pas de flash
          au tout premier rendu). */}
      {!mapReady && <AbsoluteFill style={{ backgroundColor: NAVY, pointerEvents: "none" }} />}
    </AbsoluteFill>
  );
};

// Drapeau Senegal drape sur le territoire (FlagFill) — repris du pattern AnimatedFlagDecal de sc.2.
// Apparait des l'approche (F_DERNIER), reste tout le long de la partie carte, se voile a la bascule.
const SenegalFlagDecal: React.FC<{ mapRef: React.MutableRefObject<mapboxgl.Map | null> }> = ({ mapRef }) => {
  const frame = useCurrentFrame();
  const map = mapRef.current;
  const op = Math.min(
    interpolate(frame, [F_DERNIER, F_DERNIER + 36], [0, 0.74], clamp),
    interpolate(frame, [F_VEIL, F_BASCULE], [1, 0], clamp),
  );
  if (map) {
    const layerId = "flagdecal-lyr-SEN";
    if (map.getLayer(layerId)) {
      try { map.setPaintProperty(layerId, "raster-opacity", op); } catch (_e) { /* layer pas pret */ }
    }
  }
  return <MapboxCountryFlagDecal mapRef={mapRef} iso="SEN" geoNames={["Senegal"]} drawFlag={(s) => drawFlagCanvas("SEN", s)} opacity={0} />;
};

// indicateur 3/3 terrains (haut centre)
const TerrainsIndicator: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [F_DERNIER, F_DERNIER + 24, F_PAIERA, F_PAIERA + 40], [0, 1, 1, 0], clamp);
  if (op <= 0.01) return null;
  return (
    <div style={{ position: "absolute", top: 56, width: "100%", textAlign: "center", opacity: op, pointerEvents: "none" }}>
      <div style={{ display: "inline-flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 34, height: 4, borderRadius: 2, background: GOLD, opacity: 0.95 }} />
        ))}
      </div>
      <div style={{ color: IVORY, fontFamily: BEBAS, fontSize: 34, letterSpacing: "0.16em", marginTop: 10, textShadow: "0 2px 14px rgba(0,0,0,0.8)" }}>
        3 / 3 — DERNIER TERRAIN
      </div>
    </div>
  );
};

// ── Overlays geo-ancres (jeton Yakaar + dot Dakar + leaders acteurs + leader Chine pointille) ──
const MapOverlays: React.FC<{ mapRef: React.MutableRefObject<mapboxgl.Map | null> }> = ({ mapRef }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const map = mapRef.current;
  if (!map) return null;
  const P = (c: [number, number]) => { const p = map.project(c as any); return { x: p.x, y: p.y }; };
  const zoomNow = map.getZoom();

  const yak = P(YAKAAR);
  const dak = P(DAKAR);

  // jeton Yakaar (apparait f209, spring)
  const yakScale = 1.5 * interpolate(
    spring({ frame: frame - F_YAKAAR, fps, config: { damping: 11, stiffness: 280 }, durationInFrames: 28 }),
    [0, 1], [0, 1], clamp,
  );
  // "le champ attend" = pulse lent supplementaire apres f569 (veille)
  const veillePulse = frame > F_DECISION ? 1 + 0.05 * Math.sin((frame - F_DECISION) / 14) : 1;

  // plaque label Yakaar (a droite du jeton)
  const yakLabelOp = interpolate(frame, [F_YAKAAR + 24, F_YAKAAR + 50, F_VEIL, F_BASCULE], [0, 1, 1, 0], clamp);

  // dot Dakar (reference geographique, evite carte "nue" pendant le glissement offshore)
  const dakOp = interpolate(frame, [F_DAKAR, F_DAKAR + 24, F_YAKAAR + 40, F_YAKAAR + 80], [0, 1, 1, 0.35], clamp);

  // leaders acteurs : 3 plaques deportees, reliees au jeton
  const actorLeadOp = interpolate(frame, [F_CONTRAT, F_CONTRAT + 30, F_DECISION + 30, F_DECISION + 70], [0, 1, 1, 0], clamp);
  // points d'arrivee des plaques (zone libre autour du jeton)
  const kosmosP = { x: Math.max(360, yak.x - 360), y: Math.max(220, yak.y - 200) };
  const bpP =     { x: Math.max(360, yak.x - 360), y: yak.y - 80 };
  const petroP =  { x: Math.min(W - 360, yak.x + 360), y: Math.max(220, yak.y - 200) };

  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
        {/* dot Dakar reference */}
        {dakOp > 0.01 && (
          <g opacity={dakOp}>
            <circle cx={dak.x} cy={dak.y} r={6} fill={IVORY} />
            <circle cx={dak.x} cy={dak.y} r={11} fill="none" stroke={IVORY} strokeWidth={1.4} opacity={0.5} />
            <text x={dak.x + 16} y={dak.y + 5} fontFamily={BEBAS} fontSize={26} fill={IVORY} opacity={0.85} letterSpacing="0.08em">DAKAR</text>
          </g>
        )}

        {/* leaders acteurs -> jeton */}
        {actorLeadOp > 0.01 && (
          <g opacity={actorLeadOp}>
            <Leader x1={yak.x} y1={yak.y} x2={kosmosP.x} y2={kosmosP.y} />
            {frame >= F_BP && <Leader x1={yak.x} y1={yak.y} x2={bpP.x} y2={bpP.y} />}
            {frame >= F_PETROSEN && <Leader x1={yak.x} y1={yak.y} x2={petroP.x} y2={petroP.y} />}
          </g>
        )}

        {/* jeton gaz Yakaar offshore */}
        {frame >= F_YAKAAR && (
          <g transform={`scale(${veillePulse})`} style={{ transformOrigin: `${yak.x}px ${yak.y}px` }}>
            <GisementMarker
              kind="gas" x={yak.x} y={yak.y} scale={yakScale}
              frame={frame} localF={frame - F_YAKAAR} appeared={frame - F_YAKAAR > 26}
              uid="yakaar-gas" zoom={zoomNow}
            />
          </g>
        )}

        {/* label Yakaar — fond navy translucide + bord or pour la LISIBILITE (retour Aziz : texte
            sombre sur mer navy = illisible). Plaque ancree a droite du jeton. */}
        {yakLabelOp > 0.01 && (
          <g opacity={yakLabelOp}>
            <rect x={yak.x + 52} y={yak.y - 30} width={258} height={62} rx={8}
              fill="rgba(13,21,32,0.82)" stroke={GOLD} strokeWidth={1.5} />
            <text x={yak.x + 68} y={yak.y - 2} fontFamily={BEBAS} fontSize={32} fill={GOLD_HI} letterSpacing="0.08em">YAKAAR-TERANGA</text>
            <text x={yak.x + 68} y={yak.y + 24} fontFamily={BEBAS} fontSize={19} fill={IVORY} opacity={0.8} letterSpacing="0.1em">GAZIER OFFSHORE</text>
          </g>
        )}
      </svg>

      {/* plaques acteurs (libelles TEXTE, societes — pas de drapeau, decision Aziz) */}
      <ActorPlaque frame={frame} label="KOSMOS" sub="operateur — US" appearAt={F_CONTRAT} hideAt={F_DECISION + 60} pos={kosmosP} color={GOLD} />
      <ActorPlaque frame={frame} label="BP" sub="Royaume-Uni" appearAt={F_BP} hideAt={F_DECISION + 60} pos={bpP} color={GOLD} />
      <ActorPlaque frame={frame} label="PETROSEN" sub="Etat senegalais" appearAt={F_PETROSEN} hideAt={F_DECISION + 60} pos={petroP} color={"#3a8a70"} />

      {/* (retire : bandeau "DECISION FINALE — EN ATTENTE" = redondant avec la voix, retour Aziz.)
          La CHINE n'apparait PLUS en partie 1 ; le rapport de forces est traite en partie 2. */}
    </>
  );
};

// Leader : ligne or du jeton vers la plaque
const Leader: React.FC<{ x1: number; y1: number; x2: number; y2: number }> = ({ x1, y1, x2, y2 }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth={2} strokeLinecap="round" opacity={0.8} />
    <circle cx={x1} cy={y1} r={3} fill={GOLD} />
  </g>
);

// Plaque acteur (libelle texte, navy translucide + bordure couleur)
const ActorPlaque: React.FC<{
  frame: number; label: string; sub: string; appearAt: number; hideAt: number;
  pos: { x: number; y: number }; color: string;
}> = ({ frame, label, sub, appearAt, hideAt, pos, color }) => {
  if (frame < appearAt || frame >= hideAt) return null;
  const op = Math.min(
    interpolate(frame, [appearAt, appearAt + 14], [0, 1], clamp),
    interpolate(frame, [hideAt - 16, hideAt], [1, 0], clamp),
  );
  return (
    <div style={{
      position: "absolute", left: pos.x, top: pos.y, transform: "translate(-50%, -50%)",
      opacity: op, pointerEvents: "none", textAlign: "center",
    }}>
      <div style={{
        display: "inline-block", background: "rgba(13,21,32,0.82)", border: `2px solid ${color}`,
        borderRadius: 8, padding: "8px 22px", boxShadow: `0 0 18px ${color}40`,
      }}>
        <div style={{ color: IVORY, fontFamily: BEBAS, fontSize: 34, letterSpacing: "0.1em" }}>{label}</div>
        <div style={{ color: "rgba(242,239,230,0.7)", fontFamily: BEBAS, fontSize: 17, letterSpacing: "0.12em" }}>{sub}</div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  BASCULE + PARTIE 2 — ENCART NAVY+OR (duel de jauges + question finale)
// ════════════════════════════════════════════════════════════════════════════
const EncartPart: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < F_VEIL) return null;

  // veil navy montant (la carte se voile) — Option A bascule
  const veil = interpolate(frame, [F_VEIL, F_BASCULE + 6], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* couche navy + grille or (n'est PLEINE qu'apres le veil) */}
      <AbsoluteFill style={{ opacity: veil }}>
        <GridBackground />
      </AbsoluteFill>

      {/* contenu encart (apparait avec le veil). Aziz : LAISSER LE GRAPHISME PARLER — pas de titre
          "Pourquoi ca compte" (la voix le dit), pas de labels. Seule la question finale reste (punchline). */}
      <AbsoluteFill style={{ opacity: veil }}>
        <RapportDeForces />
        <AnchorToken />
        <FinalQuestion />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Fond navy + grille or qui respire (repris VERBATIM de SceneDetteV3/SceneContratV3)
const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const tension = interpolate(frame, [F_RECULENT, F_PRIX], [0, 1], clamp);
  const breath = 0.08 + 0.03 * Math.sin(frame / 60) + 0.03 * tension * Math.abs(Math.sin(frame / 9));
  const shiftY = (frame * (0.12 + tension * 0.3)) % 60;
  return (
    <AbsoluteFill style={{
      backgroundColor: NAVY,
      backgroundImage:
        `linear-gradient(rgba(200,169,81,${breath}) 1px, transparent 1px),` +
        `linear-gradient(90deg, rgba(200,169,81,${breath}) 1px, transparent 1px)`,
      backgroundSize: "60px 60px, 60px 60px",
      backgroundPosition: `0px ${shiftY}px, 0px 0px`,
    }} />
  );
};

// RAPPORT DE FORCES (hybride storyboard validé Aziz) : deux POLES d'influence autour du champ Yakaar
// convoité au centre. EUROPE (or, GAUCHE) se RETRACTE (pression climatique) — ses lignes de champ palissent
// et se retirent. CHINE (rouge, DROITE) AVANCE — ses lignes de tension penetrent vers le centre. Le jeton
// Yakaar (AnchorToken, rendu a part) est le centre de gravite. Sobriete navy + lignes de champ = "vivant".
const RapportDeForces: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < F_EUROPE - 20) return null;

  const op = interpolate(frame, [F_EUROPE - 10, F_EUROPE + 16, F_PRIX + 40, F_PRIX + 90], [0, 1, 1, 0.7], clamp);

  // GRAPHISME AGRANDI ~+50% encore (retour Aziz v7 : "encore 40-50% plus grand") + AUCUN texte.
  const cx = W / 2, cy = 400; // centre remonte pour aerer la question finale
  const euX = W / 2 - 840, euY = cy;   // pole Europe — ecarté davantage (840 vs 660 = +27% distance)
  const cnX = W / 2 + 840, cnY = cy;   // pole Chine

  // EUROPE : pleine au depart -> se RETRACTE a "Occidentaux reculent" (s'eloigne + palit)
  const euAppear = spring({ frame: frame - F_EUROPE, fps, config: { damping: 18, stiffness: 110 }, durationInFrames: 26 });
  const euPresence = interpolate(euAppear, [0, 1], [0, 1], clamp);
  const euRetreat = interpolate(frame, [F_RECULENT, F_RECULENT + 110], [0, 1], clamp);
  const euForce = euPresence * (1 - 0.85 * euRetreat);
  const euShift = -160 * euRetreat; // s'eloigne vers la gauche

  // CHINE : entre apres, AVANCE vers le centre a mesure que l'Europe recule
  const cnAppear = spring({ frame: frame - (F_EUROPE + 50), fps, config: { damping: 18, stiffness: 110 }, durationInFrames: 26 });
  const cnPresence = interpolate(cnAppear, [0, 1], [0, 1], clamp);
  const cnAdvance = interpolate(frame, [F_RECULENT - 10, F_PLACE], [0.18, 1], clamp);
  const cnForce = cnPresence * cnAdvance;
  const cnShift = -210 * Math.max(0, cnAdvance - 0.2); // se rapproche fort du centre

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: op, overflow: "visible" }}>
      <defs>
        {/* glow pour rendre les flux LUMINEUX (retour Aziz : "plus colore/vivant, moins opaque") */}
        <filter id="rf-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="rf-eu-halo"><stop offset="0%" stopColor={GOLD_HI} stopOpacity="0.5" /><stop offset="100%" stopColor={GOLD} stopOpacity="0" /></radialGradient>
        <radialGradient id="rf-cn-halo"><stop offset="0%" stopColor="#d4604f" stopOpacity="0.55" /><stop offset="100%" stopColor={RED_CN} stopOpacity="0" /></radialGradient>
      </defs>

      {/* ── flux EUROPE -> centre (or lumineux, palit en se retirant) ── */}
      <ForceField poleX={euX + euShift} poleY={euY} cx={cx} cy={cy} color={GOLD} colorHi={GOLD_HI}
        strength={euForce} frame={frame} dir={1} count={6} />
      {/* ── flux CHINE -> centre (rouge lumineux, se renforce en avançant) ── */}
      <ForceField poleX={cnX + cnShift} poleY={cnY} cx={cx} cy={cy} color={RED_CN} colorHi="#d4604f"
        strength={cnForce} frame={frame} dir={-1} count={6} />

      {/* ── POLE EUROPE (icone agrandie +50%, halo radial, AUCUN texte) ── */}
      <g opacity={Math.max(0.22, euForce)} transform={`translate(${euShift}, 0)`}>
        <circle cx={euX} cy={euY} r={160 + 36 * euForce} fill="url(#rf-eu-halo)" opacity={euForce} />
        <UEFlagBadge cx={euX} cy={euY} r={70} />
      </g>

      {/* ── POLE CHINE (icone agrandie +50%, halo radial qui s'intensifie, AUCUN texte) ── */}
      <g opacity={Math.max(0.22, cnForce)} transform={`translate(${cnShift}, 0)`}>
        <circle cx={cnX} cy={cnY} r={140 + 60 * cnForce} fill="url(#rf-cn-halo)" opacity={cnForce} />
        <FlagDiscSvg cx={cnX} cy={cnY} r={70} iso="cn" />
      </g>
    </svg>
  );
};

// Lignes de champ courbes pole -> centre. LUMINEUSES (glow) + particules de flux qui filent (vivant).
// strength 0->1 ; dir = sens du flux ; colorHi = teinte claire pour le glow.
const ForceField: React.FC<{
  poleX: number; poleY: number; cx: number; cy: number; color: string; colorHi: string;
  strength: number; frame: number; dir: number; count: number;
}> = ({ poleX, poleY, cx, cy, color, colorHi, strength, frame, dir, count }) => {
  if (strength < 0.02) return null;
  const paths = Array.from({ length: count }, (_, i) => {
    const spread = (i - (count - 1) / 2) * 64; // ecartement vertical
    const mx = (poleX + cx) / 2;
    const my = (poleY + cy) / 2 + spread + 34 * Math.sin(frame / 20 + i * 0.7);
    return `M ${poleX} ${poleY + spread * 0.28} Q ${mx} ${my} ${cx - dir * 96} ${cy + spread * 0.16}`;
  });
  return (
    <g opacity={strength} filter="url(#rf-glow)">
      {paths.map((d, i) => (
        <g key={i}>
          {/* trait de fond colore (plus net/present qu'avant) */}
          <path d={d} fill="none" stroke={color} strokeWidth={2.5} opacity={0.4 + 0.3 * strength} />
          {/* flux clair anime qui FILE vers le centre (la force qui pousse) */}
          <path d={d} fill="none" stroke={colorHi} strokeWidth={3.2} strokeLinecap="round"
            strokeDasharray="6 26" strokeDashoffset={dir * frame * 2.2} opacity={0.85 * strength} />
        </g>
      ))}
    </g>
  );
};

// Badge drapeau UE stylise (cercle d'etoiles or sur navy) — pas de eu.png (decision Aziz)
const UEFlagBadge: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const a = (Math.PI / 6) * i - Math.PI / 2;
    return { x: cx + (r * 0.62) * Math.cos(a), y: cy + (r * 0.62) * Math.sin(a) };
  });
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#0a1a3a" stroke={IVORY} strokeWidth={2} />
      {stars.map((s, i) => (
        <text key={i} x={s.x} y={s.y + 4} textAnchor="middle" fontFamily="serif" fontSize={Math.round(r * 0.155)} fill={GOLD}>★</text>
      ))}
    </g>
  );
};

// Pastille drapeau ronde EN SVG (pour usage dans <svg>) via foreignObject simple <image>
const FlagDiscSvg: React.FC<{ cx: number; cy: number; r: number; iso: string }> = ({ cx, cy, r, iso }) => {
  const clipId = `flagdisc-${iso}`;
  return (
    <g>
      <defs><clipPath id={clipId}><circle cx={cx} cy={cy} r={r} /></clipPath></defs>
      <image href={staticFile(`_shared/flags/${iso}.png`)} x={cx - r} y={cy - r} width={r * 2} height={r * 2}
        preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={IVORY} strokeWidth={1.5} />
    </g>
  );
};

// Le jeton Yakaar reste le point d'ancrage central (continuite d'objet de la bascule)
// Apparait APRES que le titre "POURQUOI CA COMPTE" ait migre en haut (sinon collision avec le titre geant).
const TOKEN_APPEAR = F_EUROPE - 30; // ~f1191, le titre est deja remonte
const AnchorToken: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < TOKEN_APPEAR) return null;
  // apparait au centre (point d'ancrage qui a migre de la carte), petit, en haut du duel
  const op = interpolate(frame, [TOKEN_APPEAR, TOKEN_APPEAR + 20], [0, 1], clamp);
  const cx = W / 2, cy = 400; // aligne avec les poles RapportDeForces (remonte pour aerer la question)
  // pulse de tension qui s'intensifie a "reculent" (l'enjeu convoite)
  const tension = interpolate(frame, [F_RECULENT, F_PLACE], [0, 1], clamp);
  const pulse = 1 + (0.04 + 0.06 * tension) * Math.sin(frame / 10);
  // halo or qui respire derriere le jeton (centre de gravite convoite) — agrandi, pulse avec la tension
  const haloR = 180 + 28 * Math.sin(frame / 16) + 46 * tension;
  // AUCUN label texte (Aziz : laisser le graphisme parler). Jeton AGRANDI (scale 3.7).
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: op, overflow: "visible" }}>
      <circle cx={cx} cy={cy} r={haloR} fill={GOLD} opacity={0.08 + 0.07 * tension} />
      <g transform={`scale(${pulse})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
        <GisementMarker
          kind="gas" x={cx} y={cy} scale={3.7}
          frame={frame} localF={frame - TOKEN_APPEAR} appeared uid="yakaar-anchor"
        />
      </g>
    </svg>
  );
};

// Question finale en 2 temps (typewriter BebasNeue)
const FinalQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < F_PLACE - 10) return null;
  const l1 = typewriter("QUI PREND LEUR PLACE ?", frame - F_PLACE, 2);
  const l2 = frame > F_PRIX ? typewriter("ET À QUEL PRIX ?", frame - F_PRIX, 2) : "";
  const op = interpolate(frame, [F_PLACE - 10, F_PLACE + 10], [0, 1], clamp);
  return (
    <div style={{
      position: "absolute", top: 660, left: 0, right: 0, textAlign: "center", opacity: op,
    }}>
      <div style={{ color: GOLD, fontFamily: BEBAS, fontSize: 72, letterSpacing: "0.06em", textShadow: `0 0 32px ${GOLD}60`, minHeight: 86 }}>
        {l1}
      </div>
      <div style={{ color: IVORY, fontFamily: BEBAS, fontSize: 58, letterSpacing: "0.06em", marginTop: 10, minHeight: 68 }}>
        {l2}
      </div>
    </div>
  );
};

function typewriter(text: string, frame: number, speed = 2): string {
  if (frame < 0) return "";
  return text.slice(0, Math.floor(frame / speed));
}

// ════════════════════════════════════════════════════════════════════════════
//  SFX — frame-perfect via <Sequence from={f}> (timings = forced-align reel)
// ════════════════════════════════════════════════════════════════════════════
const SFX = {
  stamp:   "_shared/sfx/ui/stamp-dossier.mp3",
  ping:    "_shared/sfx/data/stat-tick.mp3",
  swoosh:  "_shared/sfx/camera/sfx-swoosh-pullback.mp3",
  node:    "_shared/sfx/ui/node-appear.mp3",
  whip:    "_shared/sfx/camera/sfx-whip-pan-1.mp3",
  impact:  "_shared/sfx/impact/impact.mp3",
  tension: "_shared/sfx/impact/tension-pulse.mp3",
  tick:    "_shared/sfx/data/tick-counter.mp3",
};
const Sfx: React.FC<{ at: number; src: string; volume?: number; dur?: number }> = ({ at, src, volume = 0.5, dur = 30 }) => (
  <Sequence from={at} durationInFrames={dur} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);
const SceneSFX: React.FC = () => (
  <>
    {/* (retire : le "bruit de zoom"/stamp a l'arrivee sur Yakaar — non necessaire, retour Aziz) */}
    <Sfx at={F_CONTRAT} src={SFX.ping} volume={0.48} />
    <Sfx at={F_BP} src={SFX.ping} volume={0.48} />
    <Sfx at={F_PETROSEN} src={SFX.ping} volume={0.48} />
    {/* SFX swoosh (pull-back "qui paiera") RETIRE ici (chantier 7 passe finition 2026-07-04, retour Aziz :
        SFX whoosh/zoom ~5min26 qui n'apporte rien). */}
    {/* BASCULE : swoosh + boom RETIRES (retour Aziz : ils font "sortir" de la scene, inutiles).
        Le veil + le changement de registre visuel suffisent a marquer la bascule. */}
    {/* "Occidentaux reculent" */}
    <Sfx at={F_RECULENT} src={SFX.tension} volume={0.4} dur={50} />
    {/* question finale */}
    <Sfx at={F_PLACE} src={SFX.tick} volume={0.35} />
    <Sfx at={F_PRIX} src={SFX.tick} volume={0.35} />
  </>
);

export const SCENE_COULISSES_V3_FRAMES = END;
export default SceneCoulissesV3;
