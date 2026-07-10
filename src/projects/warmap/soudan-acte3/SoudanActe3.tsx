/**
 * SoudanActe3 — ACTE 3 "SUIVRE L'OR" (~126s @30fps ≈ 3779 frames).
 *
 * 100% CARTE (pas de registre INSERT/BLOC comme l'Acte 2 — décision d'origine : "un jeu de flèches
 * simples"). 3 sections calées sur les 3 parties audio (silences 0.7s aux jonctions, cf
 * soudanActe3Timing.ts). Beats 1-2-2bis en section 1, beats 3-4-5 en section 2, beats 5bis-6-7 en
 * section 3.
 *
 * Nouveauté vs Acte 2 : `GeoFlowConnection` (tracé + marqueur qui voyage, transformation de couleur)
 * pour les 3 trajets or/drones/Turquie ; drapeaux pays persistants (`useClipFlags`) pour compenser le
 * voile khaki qui s'aplatit au dézoom large (retour Aziz 2026-07-09).
 *
 * Script v7 : memory/projects/soudan-midform-ACTE3-SCRIPT.md
 * Breakdown : memory/projects/soudan-midform-ACTE3-BREAKDOWN.md
 * Timing    : ./soudanActe3Timing.ts (dérivé whisper-p1/p2/p3.ts)
 */
import React from "react";
import mapboxgl from "mapbox-gl";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  Easing,
  Sequence,
} from "remotion";
import { SoudanWarMapEngine, CamKey, ZoneControl, camAt } from "../engine/SoudanWarMapEngine";
import { SoudanToken, SoudanBase, Pt } from "../engine/soudanActors";
import { GeoFlowConnection } from "../_shared/GeoFlowConnection";
import { useClipFlags, ClipFlag } from "../../_shared/mapbox/useClipFlags";
import { ATLAS } from "../engine/sudanControlData";
import { PART_OFFSETS } from "./soudanActe3Timing";

export const SOUDAN_A3_FPS = 30;

const S1_FRAMES = PART_OFFSETS.p2;                    // beats 1-2-2bis (audio p1, 38.02s)
const S2_FRAMES = PART_OFFSETS.p3 - PART_OFFSETS.p2;  // beats 3-4-5    (audio p2, 50.88s)
const S3_FRAMES = 1064;                                // beats 5bis-6-7 (audio p3, 35.46s + marge)
export const SOUDAN_A3_FRAMES = S1_FRAMES + S2_FRAMES + S3_FRAMES;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── ANCRAGES GÉO PARTAGÉS (vérifiés Tavily, cf breakdown) ──
const DARFUR: [number, number] = [26.0, 14.9];      // jeton RSF/Hemedti — position héritée fin Acte 2
const KHARTOUM: [number, number] = [32.55, 15.6];   // jeton SAF/al-Burhan — position héritée fin Acte 2
const JEBEL_AMER: [number, number] = [23.706, 13.834];
const MINE_2: [number, number] = [24.5, 12.8];
const MINE_3: [number, number] = [22.9, 14.6];
const DUBAI: [number, number] = [55.27, 25.2];
const ANKARA: [number, number] = [32.86, 39.93];
const SUAKIN: [number, number] = [37.33, 19.11];
// Égypte : vecteur de sortie de cadre (pas un point d'arrivée marqué, cf breakdown beat 5bis)
const EGYPT_VECTOR: [number, number][] = [[32, 19], [31, 24], [31.24, 30.04]];

const GOLD = "#D4A574";
const METAL = "#8A8F94";

// ── DRAPEAUX PAYS (état PARTAGÉ entre les 3 sections — corrige le bug "disparaît en section 3") ──
// Chaque entrée porte sa frame absolue d'allumage (frame globale de l'acte, pas relative à la section).
type CountryFlag = { iso: string; geoNames: string[]; color: string; atAbsolute: number };
// Couleurs volontairement DIFFÉRENCIÉES des vraies couleurs nationales quand 2 pays se ressemblent trop
// (Turquie #E30A17 et Égypte #CE1126 sont un rouge quasi identique — confusion visuelle constatée au
// dézoom large où les 2 se touchent presque). Turquie garde le rouge officiel (couleur RSF-adjacente déjà
// utilisée nulle part ailleurs) ; Égypte passe à un ocre/or distinct de la grammaire carte existante,
// cohérent avec son rôle "flux discret" (moins spectaculaire que Turquie/EAU dans le script).
const ALL_COUNTRY_FLAGS: CountryFlag[] = [
  { iso: "ae", geoNames: ["United Arab Emirates"], color: "#00732F", atAbsolute: S1_FRAMES + 773 },   // arrivée or à Dubaï
  { iso: "tr", geoNames: ["Turkey"], color: "#E30A17", atAbsolute: S1_FRAMES + 1234 },                // "en échange" Turquie
  { iso: "eg", geoNames: ["Egypt"], color: "#C9973A", atAbsolute: S1_FRAMES + S2_FRAMES + 211 + 150 }, // mot "Égypte" — ocre, distinct du rouge Turquie
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT RACINE — orchestre les 3 sections
// ─────────────────────────────────────────────────────────────────────────────
export const SoudanActe3: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={0} durationInFrames={S1_FRAMES} name="beats1-2-2bis">
      <Section1 sectionOffset={0} />
    </Sequence>
    <Sequence from={S1_FRAMES} durationInFrames={S2_FRAMES} name="beats3-4-5">
      <Section2 sectionOffset={S1_FRAMES} />
    </Sequence>
    <Sequence from={S1_FRAMES + S2_FRAMES} durationInFrames={S3_FRAMES} name="beats5bis-6-7">
      <Section3 sectionOffset={S1_FRAMES + S2_FRAMES} />
    </Sequence>
  </AbsoluteFill>
);

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 1 — BEATS 1-2-2bis (paradoxe → Darfour, plusieurs mines → Jebel Amer/Hemedti)
// frames RELATIVES à la section (= identiques aux offsets whisper-p1.ts)
// ═════════════════════════════════════════════════════════════════════════════
const F1 = {
  start: 0,
  pourtant: 134,
  quelquUnPaie: 302,
  suivreArgent: 367,
  darfourStart: 523,
  minesOr: 619,
  plusImportante: 667,
  hemedtiNomme: 847,
  miliceTenait: 880,
  devenueProprietaire: 964,
  milliard: 1114,
  end: S1_FRAMES,
};

const CAM1: CamKey[] = [
  { f: F1.start, lon: 32, lat: 16, zoom: 4.2 },      // reprend le cadrage de fin Acte 2, ne coupe pas net
  { f: F1.pourtant, lon: 32, lat: 16, zoom: 3.9 },
  { f: F1.darfourStart - 20, lon: 30, lat: 15.5, zoom: 4.1 }, // fondu-zoom amorcé vers le Darfour
  { f: F1.minesOr, lon: 24, lat: 13.5, zoom: 5.8 },
  { f: F1.end, lon: 24, lat: 13.5, zoom: 5.75 },
];

const Section1: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  // halo Jebel Amer : monte au beat 2bis, sature au mot "milliard"
  const jebelAmerHalo = interpolate(frame, [F1.plusImportante, F1.plusImportante + 60], [0, 0.55], clamp);
  const jebelAmerSature = interpolate(frame, [F1.milliard, F1.milliard + 40], [0, 0.35], clamp); // ajoute au-dessus du halo de base
  const zones: ZoneControl[] = [
    { at: JEBEL_AMER, faction: "rsf", radiusKm: 130, intensity: jebelAmerHalo + jebelAmerSature },
  ];

  // jeton SAF masqué pendant les beats 2/2bis (Darfour/RSF pur) — réapparaît juste avant la fin
  // de section 1 pour préparer le beat 3 (qui reprend les 2 jetons), fade doux pas un pop.
  const safOpacity = interpolate(frame, [F1.minesOr - 20, F1.minesOr, F1.end - 60, F1.end - 20], [1, 0.15, 0.15, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte3-suivre-lor-p1.mp3")} />

      <Sequence from={F1.darfourStart} durationInFrames={26}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.4} /></Sequence>
      <Sequence from={F1.hemedtiNomme} durationInFrames={22}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.35} /></Sequence>

      <SoudanWarMapEngine camKeys={CAM1} zones={zones} showNationalBorder stateLineOpacity={0}>
        {(proj, ref) => {
          mapRef.current = ref?.current ?? null;
          // jetons RSF/SAF déjà en place (continuité fin Acte 2) — visibles dès l'ouverture, reconnaissables
          const rsfPos = proj(DARFUR);
          const safPos = proj(KHARTOUM);
          const jebelPos = proj(JEBEL_AMER);
          const hemedtiPos = proj(JEBEL_AMER); // jeton Hemedti posé À CÔTÉ de la mine (léger décalage ci-dessous)

          return (
            <>
              {/* jetons hérités fin Acte 2 — le viewer reconnaît où on était (beat 1). SAF s'estompe
                  pendant les beats 2/2bis (Darfour/RSF pur), revient en fin de section (prépare beat 3). */}
              {rsfPos && <SoudanToken pos={rsfPos} faction="rsf" frame={frame} appear={0} />}
              {safPos && <div style={{ opacity: safOpacity }}><SoudanToken pos={safPos} faction="saf" frame={frame} appear={0} /></div>}

              {/* 3 lignes de fuite pointillées (beat 1) — suggèrent l'international SANS sortir du cadre */}
              {frame >= F1.pourtant && frame < F1.darfourStart && (
                <FlightLines proj={proj} frame={frame} appear={F1.pourtant} />
              )}

              {/* BEAT 2 — plusieurs mines dispersées (Darfour, contrôle RSF). Halo doré sous chaque
                  sprite pour se détacher du fond crème (mines trop discrètes en v1, corrigé). */}
              {frame >= F1.minesOr && (
                <>
                  {jebelPos && <MineWithHalo pos={jebelPos} frame={frame} appear={F1.minesOr} size={58} />}
                  {(() => { const p = proj(MINE_2); return p && <MineWithHalo pos={p} frame={frame} appear={F1.minesOr + 7} size={52} fade={0.85} />; })()}
                  {(() => { const p = proj(MINE_3); return p && <MineWithHalo pos={p} frame={frame} appear={F1.minesOr + 14} size={50} fade={0.8} />; })()}
                </>
              )}

              {/* BEAT 2bis — Jebel Amer se distingue, jeton Hemedti relié par trait fin */}
              {frame >= F1.hemedtiNomme && hemedtiPos && jebelPos && (
                <>
                  <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
                    <line x1={jebelPos.x} y1={jebelPos.y} x2={hemedtiPos.x - 46} y2={hemedtiPos.y - 46}
                      stroke="#3A2A18" strokeWidth={1.4} opacity={0.5} />
                  </svg>
                  <SoudanToken pos={{ x: hemedtiPos.x - 46, y: hemedtiPos.y - 46 }} faction="rsf" frame={frame} appear={F1.hemedtiNomme} />
                </>
              )}

              <CountryColorLayer mapRef={mapRef} flags={ALL_COUNTRY_FLAGS} absoluteFrame={sectionOffset + frame} />
            </>
          );
        }}
      </SoudanWarMapEngine>

      <WarmVignette />
    </AbsoluteFill>
  );
};

// mine + halo doux (détache le sprite du fond crème, corrige le défaut "quasi invisible" du 1er render)
const MineWithHalo: React.FC<{ pos: Pt; frame: number; appear: number; size: number; fade?: number }> =
  ({ pos, frame, appear, size, fade = 1 }) => {
    const op = interpolate(frame, [appear, appear + 16], [0, fade], clamp);
    if (op <= 0.01) return null;
    return (
      <>
        <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
          <circle cx={pos.x} cy={pos.y} r={size * 0.62} fill="#C99A3A" opacity={op * 0.32} />
          <circle cx={pos.x} cy={pos.y} r={size * 0.4} fill="#8A5A1E" opacity={op * 0.28} />
        </svg>
        <SoudanBase pos={pos} frame={frame} appear={appear} sprite="mine-or-td" size={size} fade={fade} />
      </>
    );
  };

// petites lignes de fuite pointillées grises — beat 1, suggèrent l'international sans quitter la carte
const FlightLines: React.FC<{ proj: (c: [number, number]) => Pt | null; frame: number; appear: number }> = ({ frame, appear }) => {
  const op = interpolate(frame, [appear, appear + 20], [0, 0.25], clamp);
  if (op <= 0.01) return null;
  // 3 directions depuis le centre-cadre : NE (Turquie), E (mer Rouge/Golfe), NO (Libye)
  const cx = 960, cy = 540;
  const dirs = [
    { dx: 420, dy: -260 }, // NE
    { dx: 520, dy: 40 },   // E
    { dx: -420, dy: -220 },// NO
  ];
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {dirs.map((d, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + d.dx} y2={cy + d.dy}
          stroke="#B8A888" strokeWidth={1.2} strokeDasharray="3 6" opacity={op} />
      ))}
    </svg>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 2 — BEATS 3-4-5 (trajet or→Dubaï, retour drones, miroir Turquie/SAF/Suakin)
// ═════════════════════════════════════════════════════════════════════════════
const F2 = {
  start: 0,
  dubaiApparait: 0,
  emiratsMot: 141,
  premierImportateur: 213,
  argentNeRestePas: 368,   // beat 4 start
  revientForme: 436,
  achetentDrones: 523,
  amnesty: 634,
  jetonRsfArrivee: 773,    // "acheminés" fin ~25.76s
  demententEnd: 926,
  autreCoteFront: 977,     // beat 5 start
  fournisseur: 1031,
  turquieBayraktar: 1133,
  enEchange: 1234,
  suakinNomme: 1348,
  end: S2_FRAMES,
};

const CAM2: CamKey[] = [
  { f: F2.start, lon: 24, lat: 13.5, zoom: 5.8 },              // reprend fin section 1
  { f: F2.emiratsMot - 40, lon: 35, lat: 19, zoom: 3.6 },      // dézoom pour révéler le trajet vers Dubaï
  { f: F2.premierImportateur + 60, lon: 40, lat: 21, zoom: 3.3 },
  { f: F2.jetonRsfArrivee, lon: 32, lat: 20, zoom: 3.2 },      // recentre Darfour-Dubaï pour le retour
  { f: F2.autreCoteFront, lon: 33, lat: 24, zoom: 2.9 },       // glisse pour révéler Ankara (nord)
  { f: F2.turquieBayraktar, lon: 33, lat: 27, zoom: 2.8 },
  { f: F2.end, lon: 33, lat: 25, zoom: 2.85 },
];

// waypoints courbés (arc net, cf validation test isolé v2 — 2 points intermédiaires trop proches
// de la droite AB ne suffisent pas, il faut un vrai décalage nord)
const WP_OR_ALLER: [number, number][] = [JEBEL_AMER, [30, 20.5], [38, 24.5], [47, 25.5], DUBAI];
const WP_OR_RETOUR: [number, number][] = [DUBAI, [47, 25.5], [38, 24.5], [30, 20.5], DARFUR];
const WP_TURQUIE: [number, number][] = [ANKARA, [33, 32], [32.7, 24], KHARTOUM];

const Section2: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  const allerT = interpolate(frame, [F2.dubaiApparait + 10, F2.argentNeRestePas], [0, 1], clamp);
  const retourT = interpolate(frame, [F2.revientForme, F2.jetonRsfArrivee], [0, 1], clamp);
  const turquieT = interpolate(frame, [F2.autreCoteFront, F2.suakinNomme], [0, 1], clamp);

  const rsfHalo = interpolate(frame, [F2.jetonRsfArrivee, F2.jetonRsfArrivee + 15, F2.jetonRsfArrivee + 30], [0.3, 0.55, 0.3], clamp);
  const safHalo = interpolate(frame, [F2.suakinNomme - 10, F2.suakinNomme + 15], [0.3, 0.5], clamp);
  const zones: ZoneControl[] = [
    { at: DARFUR, faction: "rsf", radiusKm: 200, intensity: rsfHalo },
    { at: KHARTOUM, faction: "saf", radiusKm: 200, intensity: safHalo },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte3-suivre-lor-p2.mp3")} />

      <Sequence from={F2.jetonRsfArrivee} durationInFrames={20}><Audio src={staticFile("_shared/sfx/impact/tension-pulse.mp3")} volume={0.4} /></Sequence>
      <Sequence from={F2.suakinNomme} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.35} /></Sequence>

      <SoudanWarMapEngine camKeys={CAM2} zones={zones} showNationalBorder stateLineOpacity={0}>
        {(proj, ref) => {
          mapRef.current = ref?.current ?? null;
          const fakeMap = { project: (c: [number, number]) => proj(c) ?? { x: 0, y: 0 } } as any;

          return (
            <>
              {/* Dubaï apparaît EN PREMIER (avant le départ du marqueur — destination comprise avant le voyage) */}
              {frame >= F2.dubaiApparait && (() => { const p = proj(DUBAI); return p && <SoudanBase pos={p} frame={frame} appear={F2.dubaiApparait} sprite="dubai-hub-td" size={84} />; })()}

              {/* BEAT 3-4 : trajet or (aller doré) + retour (drones gris-métal, transformation à Dubaï) */}
              {frame >= F2.dubaiApparait + 8 && (
                <GeoFlowConnection map={fakeMap} waypoints={WP_OR_ALLER} progress={allerT} markerProgress={allerT}
                  lineColor={GOLD} markerColor={GOLD} dashOffsetFrame={frame}
                  persistAfterArrival={frame >= F2.argentNeRestePas} persistOpacity={0.35} markerIcon="dot" />
              )}
              {frame >= F2.revientForme && (
                <GeoFlowConnection map={fakeMap} waypoints={WP_OR_RETOUR} progress={1} markerProgress={retourT}
                  lineColor={METAL} markerColor={METAL}
                  markerColorTransition={{ beforeT: 0.02, colorBefore: GOLD, colorAfter: METAL }}
                  dashOffsetFrame={frame} markerIcon="dot" />
              )}

              {/* jeton RSF (Darfour) — pulse à l'arrivée du marqueur drone */}
              {(() => { const p = proj(DARFUR); return p && <SoudanToken pos={p} faction="rsf" frame={frame} appear={0} />; })()}

              {/* BEAT 5 : trajet Turquie -> SAF, marqueur losange (différencié du rond or/drone) */}
              {frame >= F2.autreCoteFront && (
                <GeoFlowConnection map={fakeMap} waypoints={WP_TURQUIE} progress={turquieT} markerProgress={turquieT}
                  lineColor={ATLAS.saf} markerColor={ATLAS.saf} dashOffsetFrame={frame}
                  persistAfterArrival={frame >= F2.suakinNomme} persistOpacity={0.35} markerIcon="diamond" />
              )}

              {/* jeton SAF (Khartoum) */}
              {(() => { const p = proj(KHARTOUM); return p && <SoudanToken pos={p} faction="saf" frame={frame} appear={0} />; })()}

              {/* Suakin — objet dock, apparaît exactement au mot (règle R-V5) */}
              {frame >= F2.suakinNomme && (() => { const p = proj(SUAKIN); return p && <SoudanBase pos={p} frame={frame} appear={F2.suakinNomme} sprite="suakin-dock-td" size={54} />; })()}

              {/* drapeaux pays persistants (compense le voile khaki qui s'aplatit au dézoom large) —
                  état PARTAGÉ entre sections via ALL_COUNTRY_FLAGS + frame absolue */}
              <CountryColorLayer mapRef={mapRef} flags={ALL_COUNTRY_FLAGS} absoluteFrame={sectionOffset + frame} />
            </>
          );
        }}
      </SoudanWarMapEngine>

      <WarmVignette />
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 3 — BEATS 5bis-6-7 (nuance SAF→Égypte, synthèse système, sortie/pont Acte 4)
// ═════════════════════════════════════════════════════════════════════════════
const F3 = {
  start: 0,
  vendOrHorsCircuit: 97,
  routeNordEgypte: 211,
  ceuxDeuxCamps: 354,      // beat 6 start
  memeOrPaie: 451,
  ceQuiFaitDurer: 599,     // beat 7 start
  dubaiMot: 706,
  ankaraMot: 785,
  pauseAvantQuestion: 903,
  question: 1007,
  end: S3_FRAMES,
};

const CAM3: CamKey[] = [
  { f: F3.start, lon: 33, lat: 25, zoom: 2.85 },           // reprend fin section 2
  { f: F3.routeNordEgypte, lon: 32, lat: 24, zoom: 2.7 },
  { f: F3.ceuxDeuxCamps, lon: 38, lat: 22, zoom: 2.5 },    // cadre les 4 flux ensemble
  { f: F3.ceQuiFaitDurer, lon: 38, lat: 22, zoom: 2.3 },
  { f: F3.pauseAvantQuestion, lon: 38, lat: 22, zoom: 2.0 },     // caméra STABILISÉE ici (figement narratif)
  { f: F3.pauseAvantQuestion + 60, lon: 38, lat: 22, zoom: 2.0 }, // clé quasi-identique = pas de mouvement
  { f: F3.end, lon: 38, lat: 21, zoom: 1.9 },              // dézoom final, pont Acte 4
];

const WP_EGYPTE: [number, number][] = [[32, 19], ...EGYPT_VECTOR];

const Section3: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  const egypteT = interpolate(frame, [F3.routeNordEgypte, F3.routeNordEgypte + 180], [0, 1], clamp);

  const rsfHalo = 0.35;
  const safHalo = 0.35;
  // pulsent en alternance (offset de phase) au beat 6
  const alternPhase = Math.sin(frame * 0.04);
  const zones: ZoneControl[] = [
    { at: DARFUR, faction: "rsf", radiusKm: 200, intensity: rsfHalo + Math.max(0, alternPhase) * 0.15 },
    { at: KHARTOUM, faction: "saf", radiusKm: 200, intensity: safHalo + Math.max(0, -alternPhase) * 0.15 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte3-suivre-lor-p3.mp3")} />

      <Sequence from={F3.ceuxDeuxCamps} durationInFrames={24}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.35} /></Sequence>

      <SoudanWarMapEngine camKeys={CAM3} zones={zones} showNationalBorder stateLineOpacity={0}>
        {(proj, ref) => {
          mapRef.current = ref?.current ?? null;
          const fakeMap = { project: (c: [number, number]) => proj(c) ?? { x: 0, y: 0 } } as any;

          return (
            <>
              {/* BEAT 5bis : flux discret SAF -> Égypte, fin fadeOutAfterT (sortie hors-carte, pas d'arrivée marquée) */}
              {frame >= F3.routeNordEgypte && (
                <GeoFlowConnection map={fakeMap} waypoints={WP_EGYPTE} progress={egypteT} markerProgress={egypteT}
                  lineColor="#C9A76B" lineOpacity={0.5} lineWidth={2} markerColor="#C9A76B" markerSize={5}
                  fadeOutAfterT={0.7} dashOffsetFrame={frame} markerIcon="dot" hideMarker={egypteT > 0.75} />
              )}

              {/* jetons hérités + traces fantômes des trajets précédents (persistAfterArrival, cf section 2) */}
              {(() => { const p = proj(DARFUR); return p && <SoudanToken pos={p} faction="rsf" frame={frame} appear={0} />; })()}
              {(() => { const p = proj(KHARTOUM); return p && <SoudanToken pos={p} faction="saf" frame={frame} appear={0} />; })()}
              <GeoFlowConnection map={fakeMap} waypoints={WP_OR_ALLER} progress={1} markerProgress={1}
                lineColor={GOLD} persistAfterArrival persistOpacity={0.3} hideMarker dashOffsetFrame={frame} />
              <GeoFlowConnection map={fakeMap} waypoints={WP_TURQUIE} progress={1} markerProgress={1}
                lineColor={ATLAS.saf} persistAfterArrival persistOpacity={0.3} hideMarker dashOffsetFrame={frame} />

              {/* BEAT 7 : cercle pointillé large, apparaît en fondu autour du système Soudan-Dubaï-Ankara */}
              {frame >= F3.pauseAvantQuestion && <SystemCircle proj={proj} frame={frame} appear={F3.pauseAvantQuestion} />}

              <CountryColorLayer mapRef={mapRef} flags={ALL_COUNTRY_FLAGS} absoluteFrame={sectionOffset + frame} />
            </>
          );
        }}
      </SoudanWarMapEngine>

      <WarmVignette />
    </AbsoluteFill>
  );
};

// cercle pointillé large englobant le système (beat 7) — simple SVG, pas de composant dédié
const SystemCircle: React.FC<{ proj: (c: [number, number]) => Pt | null; frame: number; appear: number }> = ({ proj, frame, appear }) => {
  const op = interpolate(frame, [appear, appear + 30], [0, 0.4], clamp);
  if (op <= 0.01) return null;
  const center = proj([38, 22]);
  if (!center) return null;
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      <circle cx={center.x} cy={center.y} r={480} fill="none" stroke="#E9C46A" strokeWidth={1.6}
        strokeDasharray="6 10" opacity={op} />
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PARTAGÉ
// ─────────────────────────────────────────────────────────────────────────────

/**
 * CountryColorLayer — aplat de COULEUR NATIONALE dans le contour du pays (pas le drapeau détaillé).
 * Réutilise useClipFlags pour la géométrie projetée (le hook ne s'occupe que du contour, l'image du
 * drapeau n'est jamais rendue ici). Corrige le défaut du drapeau complet à ce niveau de dézoom : à
 * zoom ~2.5-2.9, le contour réel de la Turquie/Égypte occupe une portion énorme de l'écran — un motif
 * de drapeau détaillé à cette échelle écrase la carte. Un simple aplat de couleur reste identifiable
 * sans ce poids visuel (retour Aziz 2026-07-09 : "même sans le drapeau en tant que tel").
 */
const CountryColorLayer: React.FC<{
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  flags: CountryFlag[];
  absoluteFrame: number;
}> = ({ mapRef, flags, absoluteFrame }) => {
  // useClipFlags attend un ClipFlag[] (flagFile requis mais jamais chargé/affiché ici — image ignorée)
  const asClipFlags: ClipFlag[] = flags.map(f => ({ iso: f.iso, geoNames: f.geoNames, flagFile: `${f.iso}.png`, at: f.atAbsolute }));
  const { paths } = useClipFlags(mapRef, asClipFlags, absoluteFrame);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {flags.map(f => {
        const pp = paths[f.iso];
        if (!pp || absoluteFrame < f.atAbsolute) return null;
        const op = Math.min(1, Math.max(0, (absoluteFrame - f.atAbsolute) / 20)) * 0.5;
        return (
          <g key={f.iso}>
            <path d={pp.path} fill={f.color} opacity={op} />
            <path d={pp.path} fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth={1.6} opacity={op * 0.7} />
          </g>
        );
      })}
    </svg>
  );
};

const WarmVignette: React.FC = () => (
  <>
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply",
      background: "radial-gradient(ellipse 74% 70% at 50% 47%, rgba(255,240,210,0.06) 0%, rgba(60,42,18,0.0) 42%, rgba(28,18,8,0.42) 100%)" }} />
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "soft-light",
      background: "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(255,238,200,0.22) 0%, rgba(255,238,200,0) 60%)" }} />
  </>
);

export default SoudanActe3;
