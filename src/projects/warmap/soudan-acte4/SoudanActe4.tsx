/**
 * SoudanActe4 — ACTE 4 "MÊME LES VOISINS SONT ASPIRÉS" (~131s @30fps ≈ 3931 frames).
 *
 * 100% CARTE (comme l'Acte 3). 5 sections calées sur les 5 parties audio (concat BRUTE, aucun silence de
 * jonction ajouté par generate-narration-expressive.py — contrairement à l'Acte 3, ne pas chercher de +0.7s).
 * Beat 1 en section 1 (p1), beat 2 en section 2 (p2), beats 3-4 en section 3 (p3), beat 5 en section 4 (p4),
 * beat 6 en section 5 (p5).
 *
 * Réutilise tel quel le stack Acte 3 : SoudanWarMapEngine, GeoFlowConnection, SoudanToken, ArrivalLabel,
 * CountryColorLayer (useClipFlags), cameraFollowsPath. Nouveauté : DroneStrikeImpact (beat 5, Kosti) —
 * vue top-down avec sprite drone qui approche + explosion/fumée à l'impact (assets fx-explosion/fx-smoke
 * déjà en stock, réutilisés de warmapPremiumKit.ts/Partie2Blocage.tsx, cf note storyboard dans le script).
 *
 * Script v5quinquies : memory/projects/soudan-midform-ACTE4-SCRIPT.md
 * Timing    : ./soudanActe4Timing.ts (dérivé whisper-p1..p5.ts)
 *
 * ⚠️ BEAT 4 (motif égyptien) — RÉ-ÉVALUÉ (2026-07-11) : le "Nil qui pulse" (marqueur ponctuel) s'est
 * avéré invisible sur render réel (v3, diff pixel quasi nul). Corrigé via DA-brief upstream (Gemini+Kimi+
 * DeepSeek, convergence 3/3) : `GradientPathReveal` — le Nil devient une MASSE qui se teinte
 * progressivement (front qui avance, pas un point qui voyage), flash net à "profondeur stratégique".
 * Synthèse tracée : memory/episodes/soudan-midform/PLAN-ACTE4.md.
 */
import React from "react";
import mapboxgl from "mapbox-gl";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  Sequence,
} from "remotion";
import { SoudanWarMapEngine, CamKey, ZoneControl, StateHighlight, cameraFollowsPath } from "../engine/SoudanWarMapEngine";
import { SoudanToken, Pt } from "../engine/soudanActors";
import { GeoFlowConnection } from "../_shared/GeoFlowConnection";
import { GradientPathReveal } from "../_shared/GradientPathReveal";
import { useClipFlags, ClipFlag } from "../../_shared/mapbox/useClipFlags";
import { ATLAS } from "../engine/sudanControlData";
import { SmokeColumn } from "../_shared/warmapChoc";
import { HookDisplacementBurst } from "../../_shared/hooks-lib/HookEffects";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import { PART_OFFSETS, BEAT1, BEAT2, BEAT3, BEAT4, BEAT5, BEAT6 } from "./soudanActe4Timing";
import { PortSoudanNegociationScene } from "./PortSoudanNegociationScene";

export const SOUDAN_A4_FPS = 30;

const S1_FRAMES = PART_OFFSETS.p2;                    // beat 1 (audio p1, ~24.85s)
const S2_FRAMES = PART_OFFSETS.p3 - PART_OFFSETS.p2;   // beat 2 (audio p2, ~22.24s)
const S3_FRAMES = PART_OFFSETS.p4 - PART_OFFSETS.p3;   // beats 3-4 (audio p3, ~34.50s)
const S4_FRAMES = PART_OFFSETS.p5 - PART_OFFSETS.p4;   // beat 5 (audio p4, ~25.54s)
const S5_FRAMES = BEAT6.end - PART_OFFSETS.p5 + 30;    // beat 6 (audio p5, ~23.78s + marge sortie)
export const SOUDAN_A4_FRAMES = S1_FRAMES + S2_FRAMES + S3_FRAMES + S4_FRAMES + S5_FRAMES;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── ANCRAGES GÉO PARTAGÉS ──
// Jetons hérités Acte 3 (positions identiques, continuité) :
const DARFUR: [number, number] = [26.0, 14.9];      // jeton RSF
const KHARTOUM: [number, number] = [32.55, 15.6];   // jeton SAF
// Nouveaux points Acte 4 :
const MOSCOW: [number, number] = [37.62, 55.75];
const CAIRO: [number, number] = [31.24, 30.04];
const NILE_DELTA: [number, number] = [31.0, 31.2];   // repère "delta du Nil" pour le tracé qui pulse
// ⭐ v2 (agent R&D densité, 2026-07-11) : tracé SINUEUX du Nil (Khartoum -> Atbara -> Assouan -> delta),
// pas une ligne droite — la ligne droite précédente ne coïncidait pas avec le vrai fleuve dessiné par le
// fond de carte, donc illisible comme "c'est le Nil qui s'illumine". Points de contrôle approximatifs du
// cours réel, cohérents avec la géographie (pas une géo inventée).
const NILE_WAYPOINTS: [number, number][] = [KHARTOUM, [33.2, 17.2], [32.9, 19.8], [32.55, 23.97], [30.6, 27.2], NILE_DELTA];
// Kosti — vérifié Wikipédia (13°10'N 32°40'E), rive ouest du Nil Blanc, État du Nil Blanc.
const KOSTI: [number, number] = [32.667, 13.167];

const RUSSIA_RED = "#8A5A3A"; // gris-froid russe (distinct RSF/SAF, cohérent registre parchemin)

// ── DRAPEAUX PAYS (état partagé entre sections, cf pattern Acte 3 CountryColorLayer) ──
type CountryFlag = { iso: string; geoNames: string[]; color: string; atAbsolute: number; mainlandBox?: [number, number, number, number] };
const ALL_COUNTRY_FLAGS: CountryFlag[] = [
  // mainlandBox : la Russie s'étend jusqu'au Pacifique — sans filtre, le clip couvre toute la silhouette
  // (bbox géante) et déborde/artefacte au bord du cadre au dézoom du beat 6. On ne garde que la partie
  // occidentale/européenne, seule visible dans le cadrage Soudan-Égypte-Turquie de cet acte.
  { iso: "ru", geoNames: ["Russia"], color: "#8A5A3A", atAbsolute: BEAT1.changeDeCamp, mainlandBox: [19, 41, 100, 78] },
  { iso: "eg", geoNames: ["Egypt"], color: "#C9973A", atAbsolute: S1_FRAMES + S2_FRAMES + (BEAT3.egypteNommee - PART_OFFSETS.p3) },
  // v2 : EAU+Turquie ajoutées pour le beat 6 (4 puissances, cf agents R&D densité) — apparaissent au dézoom.
  { iso: "ae", geoNames: ["United Arab Emirates"], color: "#00732F", atAbsolute: S1_FRAMES + S2_FRAMES + S3_FRAMES + S4_FRAMES + (BEAT6.quatrePuissances - PART_OFFSETS.p5) },
  { iso: "tr", geoNames: ["Turkey"], color: "#E30A17", atAbsolute: S1_FRAMES + S2_FRAMES + S3_FRAMES + S4_FRAMES + (BEAT6.quatrePuissances - PART_OFFSETS.p5) },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT RACINE
// ─────────────────────────────────────────────────────────────────────────────
export const SoudanActe4: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={0} durationInFrames={S1_FRAMES} name="beat1-russie">
      <Section1 sectionOffset={0} />
    </Sequence>
    <Sequence from={S1_FRAMES} durationInFrames={S2_FRAMES} name="beat2-base-navale">
      <Section2 sectionOffset={S1_FRAMES} />
    </Sequence>
    <Sequence from={S1_FRAMES + S2_FRAMES} durationInFrames={S3_FRAMES} name="beats3-4-egypte">
      <Section3 sectionOffset={S1_FRAMES + S2_FRAMES} />
    </Sequence>
    <Sequence from={S1_FRAMES + S2_FRAMES + S3_FRAMES} durationInFrames={S4_FRAMES} name="beat5-kosti">
      <Section4 sectionOffset={S1_FRAMES + S2_FRAMES + S3_FRAMES} />
    </Sequence>
    <Sequence from={S1_FRAMES + S2_FRAMES + S3_FRAMES + S4_FRAMES} durationInFrames={S5_FRAMES} name="beat6-synthese">
      <Section5 sectionOffset={S1_FRAMES + S2_FRAMES + S3_FRAMES + S4_FRAMES} />
    </Sequence>
  </AbsoluteFill>
);

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 1 — BEAT 1 (pont Acte 3 + retournement russe) [partie 1]
// frames RELATIVES à la section
// ═════════════════════════════════════════════════════════════════════════════
const F1 = {
  start: 0,
  troisiemePays: BEAT1.troisiemePays - PART_OFFSETS.p1,
  changeDeCamp: BEAT1.changeDeCamp - PART_OFFSETS.p1,
  wagnerArmait: BEAT1.wagnerArmait - PART_OFFSETS.p1,
  volteFace2024: BEAT1.volteFace2024 - PART_OFFSETS.p1,
  end: S1_FRAMES,
};

// ⭐ v2 (agent R&D caméra, 2026-07-11) : CAM1 REMPLACE un cadrage fixe par un vrai voyage caméra
// Moscou->Soudan en 2 temps (cf pattern cameraFollowsPath/cam2At déjà prouvé Acte 3 beats 3-5) — la
// caméra redescend physiquement de Moscou vers le Soudan au lieu de rester posée pendant que des
// traits SVG bougent seuls en arrière-plan. Phase 1 (Wagner/RSF, ancien) : voyage bref et qui s'estompe.
// Pause dédiée resserrée sur le Soudan à la bascule 2024. Phase 2 (Moscou-SAF, net) : second voyage.
const CAM1_ZOOM_FOLLOW = 5.2;
const CAM1_ZOOM_REST = 4.4;
const WP_RUSSIA_RSF: [number, number][] = [MOSCOW, [34, 35], [30, 25], DARFUR];
const WP_RUSSIA_SAF: [number, number][] = [MOSCOW, [34, 35], [32.7, 24], KHARTOUM];
const CAM1_BLEND = 16;

function blendCamSimple(a: CamKey, b: CamKey, frame: number, from: number, to: number): CamKey {
  const t = interpolate(frame, [from, to], [0, 1], clamp);
  return { f: frame, lon: a.lon + (b.lon - a.lon) * t, lat: a.lat + (b.lat - a.lat) * t, zoom: a.zoom + (b.zoom - a.zoom) * t };
}

function cam1At(frame: number, f1: typeof F1): CamKey {
  const restSoudan: CamKey = { f: frame, lon: 30, lat: 18, zoom: CAM1_ZOOM_REST };
  // Phase 0 — repos large avant le mot "troisième pays"
  if (frame < f1.troisiemePays) return { f: frame, lon: 30, lat: 20, zoom: CAM1_ZOOM_REST };
  // Phase 1 — voyage Moscou->RSF (Wagner, ancien flux)
  if (frame < f1.volteFace2024) {
    const t = interpolate(frame, [f1.troisiemePays, f1.volteFace2024 - CAM1_BLEND], [0, 1], clamp);
    const follow = cameraFollowsPath(WP_RUSSIA_RSF, t, CAM1_ZOOM_FOLLOW);
    return frame < f1.troisiemePays + CAM1_BLEND
      ? blendCamSimple({ f: frame, lon: 30, lat: 20, zoom: CAM1_ZOOM_REST }, follow, frame, f1.troisiemePays, f1.troisiemePays + CAM1_BLEND)
      : follow;
  }
  // Phase 2 — pause dédiée resserrée sur le Soudan à la bascule (le spectateur "atterrit" avant le 2e voyage)
  const PAUSE = 20;
  if (frame < f1.volteFace2024 + PAUSE) {
    return blendCamSimple(cameraFollowsPath(WP_RUSSIA_RSF, 1, CAM1_ZOOM_FOLLOW), restSoudan, frame, f1.volteFace2024, f1.volteFace2024 + CAM1_BLEND);
  }
  // Phase 3 — second voyage Moscou->SAF (2024, net et actif)
  const t2 = interpolate(frame, [f1.volteFace2024 + PAUSE, f1.end - 20], [0, 1], clamp);
  const follow2 = cameraFollowsPath(WP_RUSSIA_SAF, t2, CAM1_ZOOM_FOLLOW);
  return frame < f1.volteFace2024 + PAUSE + CAM1_BLEND
    ? blendCamSimple(restSoudan, follow2, frame, f1.volteFace2024 + PAUSE, f1.volteFace2024 + PAUSE + CAM1_BLEND)
    : follow2;
}

const Section1: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const camKeys1 = React.useCallback((f: number) => cam1At(f, F1), []);

  // trait RSF (ancien, Wagner) qui s'estompe ; trait SAF (nouveau, 2024) qui apparaît net
  const rsfTraitOpacity = interpolate(frame, [F1.troisiemePays, F1.troisiemePays + 20, F1.volteFace2024, F1.volteFace2024 + 30], [0, 0.55, 0.55, 0.12], clamp);
  const safTraitOpacity = interpolate(frame, [F1.volteFace2024, F1.volteFace2024 + 24], [0, 0.7], clamp);
  const safTraitProgress = interpolate(frame, [F1.volteFace2024, F1.volteFace2024 + 30], [0, 1], clamp);
  const rsfTraitProgress = interpolate(frame, [F1.troisiemePays, F1.troisiemePays + 26], [0, 1], clamp);

  const rsfHalo = 0.3;
  const safHalo = interpolate(frame, [F1.volteFace2024, F1.volteFace2024 + 30], [0.3, 0.42], clamp);
  const zones: ZoneControl[] = [
    { at: DARFUR, faction: "rsf", radiusKm: 200, intensity: rsfHalo },
    { at: KHARTOUM, faction: "saf", radiusKm: 200, intensity: safHalo },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p1.mp3")} />

      <Sequence from={F1.troisiemePays} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.5} /></Sequence>
      <Sequence from={F1.volteFace2024} durationInFrames={22}><Audio src={staticFile("_shared/sfx/impact/tension-pulse.mp3")} volume={0.5} /></Sequence>

      <SoudanWarMapEngine camKeys={camKeys1} zones={zones} showNationalBorder stateLineOpacity={0}>
        {(proj, ref) => {
          mapRef.current = ref?.current ?? null;
          const fakeMap = { project: (c: [number, number]) => proj(c) ?? { x: 0, y: 0 } } as any;

          return (
            <>
              {/* repère Moscou (hors-cadre nord, label seul) */}
              {frame >= F1.troisiemePays && (() => { const p = proj(MOSCOW); return p && <ArrivalLabel pos={p} frame={frame} appear={F1.troisiemePays} label="Moscou" color={RUSSIA_RED} />; })()}

              {/* trait ancien Moscou->RSF (Wagner, s'estompe) — la caméra VOYAGE avec ce trait (cam1At phase 1) */}
              {frame >= F1.troisiemePays && (
                <GeoFlowConnection map={fakeMap} waypoints={WP_RUSSIA_RSF} progress={rsfTraitProgress} markerProgress={rsfTraitProgress}
                  lineColor={RUSSIA_RED} lineOpacity={rsfTraitOpacity} lineWidth={3} hideMarker dashOffsetFrame={frame} />
              )}
              {/* trait nouveau Moscou->SAF (2024, net et actif) — 2e voyage caméra (cam1At phase 3) */}
              {frame >= F1.volteFace2024 && (
                <GeoFlowConnection map={fakeMap} waypoints={WP_RUSSIA_SAF} progress={safTraitProgress} markerProgress={safTraitProgress}
                  lineColor={RUSSIA_RED} lineOpacity={safTraitOpacity} lineWidth={4} hideMarker dashOffsetFrame={frame} />
              )}

              {(() => { const p = proj(DARFUR); return p && <SoudanToken pos={p} faction="rsf" frame={frame} appear={0} />; })()}
              {(() => { const p = proj(KHARTOUM); return p && <SoudanToken pos={p} faction="saf" frame={frame} appear={0} />; })()}

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
// SECTION 2 — BEAT 2 (base navale Port-Soudan, chiffrée) [partie 2]
// ═════════════════════════════════════════════════════════════════════════════
const F2 = {
  start: 0,
  portSoudanNomme: BEAT2.portSoudanNomme - PART_OFFSETS.p2,
  vingtCinqAns: BEAT2.vingtCinqAns - PART_OFFSETS.p2,
  troisCentsSoldats: BEAT2.troisCentsSoldats - PART_OFFSETS.p2,
  quatreNavires: BEAT2.quatreNavires - PART_OFFSETS.p2,
  propulsionNucleaire: BEAT2.propulsionNucleaire - PART_OFFSETS.p2,
  soudanPasSigne: BEAT2.soudanPasSigne - PART_OFFSETS.p2,
  end: S2_FRAMES,
};

// ⭐⭐ v3 (2026-07-12, retour Aziz+Gemini+Kimi croisé) : Section2 REMPLACÉE par un insert SVG plein
// écran (PortSoudanNegociationScene) — le beat "base navale/négociation" est un fait institutionnel
// sans mouvement spatial fort, exactement le type de contenu que la grammaire du projet (Sahel AES,
// Actes 2-3 Soudan) réserve au régime "plein écran" plutôt qu'à la carte Mapbox continue. La carte
// réapparaît normalement au beat 3 (Section3). Cf memory/episodes/soudan-midform/STATUS.md pour le
// diagnostic complet (comparaison frame-par-frame avec les épisodes de référence).
const Section2: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  void sectionOffset;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p2.mp3")} />

      <PortSoudanNegociationScene
        frame={frame}
        portSoudanNomme={F2.portSoudanNomme}
        vingtCinqAns={F2.vingtCinqAns}
        troisCentsSoldats={F2.troisCentsSoldats}
        quatreNavires={F2.quatreNavires}
        propulsionNucleaire={F2.propulsionNucleaire}
        soudanPasSigne={F2.soudanPasSigne}
        end={F2.end}
      />
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 3 — BEATS 3-4 (miroir égyptien : mode d'action + motif/Nil) [partie 3]
// ⚠️ Beat 4 = candidat le + à risque de forcer un concept abstrait, cf note script — codé tel que
// spécifié, à RE-ÉVALUER une fois vu.
// ═════════════════════════════════════════════════════════════════════════════
const F3 = {
  start: 0,
  egypteNommee: BEAT3.egypteNommee - PART_OFFSETS.p3,
  renseignement: BEAT3.renseignement - PART_OFFSETS.p3,
  coordonne: BEAT3.coordonne - PART_OFFSETS.p3,
  motifStart: BEAT4.start - PART_OFFSETS.p3,
  nilNomme: BEAT4.nilNomme - PART_OFFSETS.p3,
  redouteInfluence: BEAT4.redouteInfluence - PART_OFFSETS.p3,
  profondeurStrategique: BEAT4.profondeurStrategique - PART_OFFSETS.p3,
  end: S3_FRAMES,
};

const CAM3: CamKey[] = [
  { f: F3.start, lon: 30, lat: 22, zoom: 4.6 },
  { f: F3.egypteNommee, lon: CAIRO[0], lat: (CAIRO[1] + KHARTOUM[1]) / 2, zoom: 4.2 },
  { f: F3.motifStart, lon: 31.5, lat: 23, zoom: 4.0 }, // caméra stabilisée pour le motif (contraste voulu, cf script)
  { f: F3.end, lon: 31.5, lat: 23, zoom: 4.0 },
];

const Section3: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  const safHaloBoost = interpolate(frame, [F3.egypteNommee, F3.egypteNommee + 30], [0.3, 0.5], clamp);
  const zones: ZoneControl[] = [
    { at: DARFUR, faction: "rsf", radiusKm: 200, intensity: 0.3 },
    { at: KHARTOUM, faction: "saf", radiusKm: 200, intensity: safHaloBoost },
  ];

  const egypteTraitProgress = interpolate(frame, [F3.egypteNommee, F3.egypteNommee + 26], [0, 1], clamp);
  const egypteTraitOpacity = interpolate(frame, [F3.egypteNommee, F3.egypteNommee + 20], [0, 0.55], clamp);
  // onde de choc au contact (DA-brief Gemini, retenu vs icône Eye Kimi) — le halo SAF ne fait pas que
  // grossir, il émet une conséquence visible : cercle qui s'étend et fade à l'arrivée du soutien égyptien.
  const egypteShockT = interpolate(frame, [F3.egypteNommee, F3.egypteNommee + 40], [0, 1], clamp);

  // BEAT 4 — le Nil comme MASSE qui se teinte (DA-brief upstream, convergence 3/3 Gemini/Kimi/DeepSeek) :
  // remplace le marqueur ponctuel (invisible sur render réel, diff pixel quasi nul) par un front qui
  // avance le long du tracé (déjà dans le sens Soudan->Égypte, cf NILE_WAYPOINTS Khartoum->delta),
  // épaississant et teintant le trait à mesure qu'il progresse. Flash net à "profondeur stratégique".
  // ⚠️ CORRECTIF (2026-07-12, diagnostic frames réelles) : le fill se figeait à ~2s sur un beat de ~15s
  // (invisible entre nilNomme+80 et le flash) — étalé jusqu'à juste avant le flash pour une vraie
  // progression continue sur toute la durée du beat, synchronisée avec "profondeur stratégique".
  const nilFillProgress = interpolate(frame, [F3.nilNomme, F3.profondeurStrategique - 10], [0, 1], clamp);
  const nilFlashT = interpolate(frame, [F3.profondeurStrategique, F3.profondeurStrategique + 8, F3.profondeurStrategique + 34], [0, 1, 0], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p3.mp3")} />

      <Sequence from={F3.egypteNommee} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.5} /></Sequence>
      <Sequence from={F3.nilNomme} durationInFrames={22}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.4} /></Sequence>

      <SoudanWarMapEngine camKeys={CAM3} zones={zones} showNationalBorder stateLineOpacity={0}>
        {(proj, ref) => {
          mapRef.current = ref?.current ?? null;
          const fakeMap = { project: (c: [number, number]) => proj(c) ?? { x: 0, y: 0 } } as any;

          return (
            <>
              {/* BEAT 3 — trait Égypte->SAF, pas d'objet qui voyage (support direct, cf script) */}
              {frame >= F3.egypteNommee && (
                <GeoFlowConnection map={fakeMap} waypoints={[CAIRO, KHARTOUM]} progress={egypteTraitProgress} markerProgress={egypteTraitProgress}
                  lineColor={ATLAS.saf} lineOpacity={egypteTraitOpacity} lineWidth={3} hideMarker dashOffsetFrame={frame} />
              )}
              {frame >= F3.egypteNommee && (() => { const p = proj(CAIRO); return p && <ArrivalLabel pos={p} frame={frame} appear={F3.egypteNommee} label="Égypte" color={ATLAS.saf} />; })()}
              {/* onde de choc au contact (DA-brief Gemini, retenu) — le halo SAF renforcé émet une
                  conséquence visible : un cercle unique qui s'étend et fade, pas juste un grossissement. */}
              {frame >= F3.egypteNommee && egypteShockT < 1 && (() => {
                const p = proj(KHARTOUM);
                if (!p) return null;
                const shockR = 14 + egypteShockT * 76;
                const shockOp = (1 - egypteShockT) * 0.55;
                return (
                  <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
                    <circle cx={p.x} cy={p.y} r={shockR} fill="none" stroke={ATLAS.saf} strokeWidth={2.5} opacity={shockOp} />
                  </svg>
                );
              })()}

              {/* BEAT 4 — le Nil comme MASSE qui se teinte : un front avance dans le sens réel du courant
                  (Khartoum -> delta = Soudan -> Égypte), le trait s'épaissit et se colore à son passage,
                  flash net à "profondeur stratégique" (DA-brief upstream, convergence 3/3 modèles). */}
              {frame >= F3.nilNomme && (
                <GradientPathReveal map={fakeMap} waypoints={NILE_WAYPOINTS} fillProgress={nilFillProgress}
                  colorBefore={ATLAS.gold} colorAfter={ATLAS.saf} strokeWidthBefore={2} strokeWidthAfter={11}
                  flashT={nilFlashT} baseOpacity={0.65} dashOffsetFrame={frame} />
              )}

              {(() => { const p = proj(DARFUR); return p && <SoudanToken pos={p} faction="rsf" frame={frame} appear={0} />; })()}
              {(() => { const p = proj(KHARTOUM); return p && <SoudanToken pos={p} faction="saf" frame={frame} appear={0} />; })()}

              <CountryColorLayer mapRef={mapRef} flags={ALL_COUNTRY_FLAGS} absoluteFrame={sectionOffset + frame} />
            </>
          );
        }}
      </SoudanWarMapEngine>

      {/* géoplaque factuelle courte — le Nil seul montre un FAIT géo, pas l'ARGUMENT stratégique
          (cf vigilance script + agents R&D) : ce chiffre porte le raisonnement que le geste seul ne peut pas */}
      <NileFactPlaque frame={frame} appear={F3.redouteInfluence} />

      <WarmVignette />
    </AbsoluteFill>
  );
};

const NileFactPlaque: React.FC<{ frame: number; appear: number }> = ({ frame, appear }) => {
  const op = interpolate(frame, [appear, appear + 20], [0, 1], clamp);
  if (op <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", bottom: 90, left: 0, right: 0, textAlign: "center", opacity: op, pointerEvents: "none",
    }}>
      <div style={{ display: "inline-block", padding: "10px 22px", background: "rgba(20,14,7,0.55)", borderRadius: 6 }}>
        <span style={{ color: ATLAS.gold, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 22,
          letterSpacing: "0.02em", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
          Le Nil fournit 90% de l&apos;eau de l&apos;Égypte
        </span>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 4 — BEAT 5 (Kosti : frappe de drone, vue top-down + explosion/fumée) [partie 4]
// ═════════════════════════════════════════════════════════════════════════════
const F4 = {
  start: 0,
  consequencesReelles: BEAT5.consequencesReelles - PART_OFFSETS.p4,
  kostiNomme: BEAT5.kostiNomme - PART_OFFSETS.p4,
  date21Juin: BEAT5.date21Juin - PART_OFFSETS.p4,
  droneFrappe: BEAT5.droneFrappe - PART_OFFSETS.p4,
  stationService: BEAT5.stationService - PART_OFFSETS.p4,
  civilsEssence: BEAT5.civilsEssence - PART_OFFSETS.p4,
  pasCibleMilitaire: BEAT5.pasCibleMilitaire - PART_OFFSETS.p4,
  memesArmes: BEAT5.memesArmes - PART_OFFSETS.p4,
  civilsPayentPrix: BEAT5.civilsPayentPrix - PART_OFFSETS.p4,
  end: S4_FRAMES,
};

// Caméra : dézoom léger puis resserre progressivement sur Kosti (close-up pour la vue top-down)
const CAM4: CamKey[] = [
  { f: F4.start, lon: 31.5, lat: 20, zoom: 4.5 },
  { f: F4.kostiNomme, lon: KOSTI[0], lat: KOSTI[1], zoom: 8.5 },
  { f: F4.end, lon: KOSTI[0], lat: KOSTI[1], zoom: 8.5 },
];

const EXPLOSION_FRAMES = 9; // 0.png..8.png
const SMOKE_FRAMES = 9;

/**
 * DroneStrikeImpact — beat Kosti, piste créative Aziz (cf note storyboard dans le script).
 * Vue top-down : sprite drone qui approche depuis un bord, explosion one-shot à l'impact (9 frames,
 * fx-explosion/), puis fumée qui se dégage en boucle (smokePingPong-like, fx-smoke/). Assets déjà en
 * stock (public/_shared/sprites/warmap/fx-explosion|fx-smoke/), aucun nouvel appel payant.
 * Registre : montrer la CONSÉQUENCE (fumée après coup) plutôt que le spectacle de l'explosion elle-même
 * — cohérent "coût civil", pas "action militaire" (cf vigilance script).
 */
const DroneStrikeImpact: React.FC<{ pos: Pt; frame: number; approachAt: number; impactAt: number }> =
  ({ pos, frame, approachAt, impactAt }) => {
    if (frame < approachAt) return null;

    // phase approche : drone glisse depuis le coin haut-droit vers le point d'impact
    const approachT = interpolate(frame, [approachAt, impactAt], [0, 1], clamp);
    const droneStartOffset = { dx: 220, dy: -160 };
    const droneX = pos.x + droneStartOffset.dx * (1 - approachT);
    const droneY = pos.y + droneStartOffset.dy * (1 - approachT);
    const droneOpacity = interpolate(frame, [approachAt, approachAt + 10, impactAt - 4, impactAt], [0, 1, 1, 0], clamp);

    // explosion one-shot : joue 0->8 une fois, ~18 frames (2x par frame index, cohérent smokePingPong fps)
    const explosionRel = frame - impactAt;
    const explosionIdx = Math.min(EXPLOSION_FRAMES - 1, Math.max(0, Math.floor(explosionRel / 2)));
    const explosionOpacity = interpolate(explosionRel, [0, 4, 24, 36], [0, 1, 1, 0], clamp);
    const showExplosion = explosionRel >= 0 && explosionRel < 36;

    // fumée : démarre après l'explosion, boucle ping-pong lente, persiste (conséquence, pas spectacle)
    const smokeStartRel = 20;
    const smokeRel = frame - impactAt - smokeStartRel;
    const smokeFadeIn = interpolate(smokeRel, [0, 20], [0, 1], clamp);
    const smokePingpong = SMOKE_FRAMES > 1 ? (SMOKE_FRAMES - 1) * 2 : 1;
    const smokePlayFrame = smokeRel >= 0 ? Math.floor(smokeRel / 3) : 0;
    const smokePhase = smokePlayFrame % smokePingpong;
    const smokeIdx = smokePhase < SMOKE_FRAMES ? smokePhase : smokePingpong - smokePhase;
    const showSmoke = smokeRel >= 0;

    return (
      <>
        {/* drone qui approche, vu de dessus */}
        {droneOpacity > 0.01 && (
          <div style={{ position: "absolute", left: droneX, top: droneY, transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
            <img src={staticFile("_shared/sprites/warmap/drone-rsf-td.png")}
              style={{ width: 40, height: 40, objectFit: "contain", opacity: droneOpacity,
                filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))" }} />
          </div>
        )}

        {/* explosion one-shot au point d'impact */}
        {showExplosion && (
          <div style={{ position: "absolute", left: pos.x, top: pos.y, transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
            <img src={staticFile(`_shared/sprites/warmap/fx-explosion/${explosionIdx}.png`)}
              style={{ width: 90, height: 90, objectFit: "contain", opacity: explosionOpacity }} />
          </div>
        )}

        {/* fumée persistante après l'impact — la conséquence qui reste à l'écran */}
        {showSmoke && (
          <div style={{ position: "absolute", left: pos.x, top: pos.y - 30, transform: "translate(-50%,-70%)", pointerEvents: "none" }}>
            <img src={staticFile(`_shared/sprites/warmap/fx-smoke/${smokeIdx}.png`)}
              style={{ width: 80, height: 80, objectFit: "contain", opacity: smokeFadeIn * 0.85 }} />
          </div>
        )}
      </>
    );
  };

const Section4: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  const zones: ZoneControl[] = [
    { at: DARFUR, faction: "rsf", radiusKm: 200, intensity: 0.25 },
    { at: KHARTOUM, faction: "saf", radiusKm: 200, intensity: 0.25 },
  ];

  // impact calé sur "frappent avec un drone" (droneFrappe) — approche démarre ~1.2s avant
  const approachAt = F4.droneFrappe - 36;
  const impactAt = F4.droneFrappe + 6;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p4.mp3")} />

      <Sequence from={F4.kostiNomme} durationInFrames={22}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.45} /></Sequence>
      <Sequence from={impactAt} durationInFrames={24}><Audio src={staticFile("_shared/sfx/impact/impact.mp3")} volume={0.55} /></Sequence>

      {/* ⭐ v2 (agent R&D synthèse, 2026-07-11) : la CARTE ELLE-MÊME encaisse le choc à l'impact — jamais
          utilisé dans la série Soudan (Actes 1-3), réservé au seul pic émotionnel de tout l'Acte 4. */}
      <HookDisplacementBurst at={impactAt} dur={22} scale={22}>
        <SoudanWarMapEngine camKeys={CAM4} zones={zones} showNationalBorder stateLineOpacity={0}>
          {(proj, ref) => {
            mapRef.current = ref?.current ?? null;

            const kostiPos = proj(KOSTI);

            return (
              <>
                {kostiPos && <ArrivalLabel pos={kostiPos} frame={frame} appear={F4.kostiNomme} label="Kosti" color={RUSSIA_RED} />}
                {kostiPos && <DroneStrikeImpact pos={kostiPos} frame={frame} approachAt={approachAt} impactAt={impactAt} />}

                {(() => { const p = proj(DARFUR); return p && <SoudanToken pos={p} faction="rsf" frame={frame} appear={0} />; })()}
                {(() => { const p = proj(KHARTOUM); return p && <SoudanToken pos={p} faction="saf" frame={frame} appear={0} />; })()}

                <CountryColorLayer mapRef={mapRef} flags={ALL_COUNTRY_FLAGS} absoluteFrame={sectionOffset + frame} />
              </>
            );
          }}
        </SoudanWarMapEngine>
      </HookDisplacementBurst>

      <WarmVignette />
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 5 — BEAT 6 (synthèse : 4 puissances, pont vers Acte 5) [partie 5]
// ═════════════════════════════════════════════════════════════════════════════
const F5 = {
  start: 0,
  quatrePuissances: BEAT6.quatrePuissances - PART_OFFSETS.p5,
  peserIssue: BEAT6.peserIssue - PART_OFFSETS.p5,
  pontActe5: BEAT6.pontActe5 - PART_OFFSETS.p5,
  resteInactive: BEAT6.resteInactive - PART_OFFSETS.p5,
  end: S5_FRAMES,
};

const CAM5: CamKey[] = [
  { f: F5.start, lon: 33, lat: 22, zoom: 4.0 },
  { f: F5.quatrePuissances, lon: 33, lat: 24, zoom: 2.6 }, // dézoom pour cadrer les 4 flèches ensemble
  { f: F5.end, lon: 33, lat: 24, zoom: 2.5 },
];

// ⭐ v2 (agents R&D densité+synthèse, 2026-07-11) : le texte dit "quatre puissances" mais seules 2
// flèches (Russie/Égypte) étaient dessinées — EAU et Turquie (établies Acte 3) manquaient, laissant un
// dézoom large sur une carte majoritairement vide. Fix : 4 flèches + 4 mini-volets territoire empilés
// par paire (gauche: EAU+Turquie, droite: Russie+Égypte) — pattern SidePanelTerritory/ConvergingConnector
// de l'Acte 3, étendu. NE PAS réduire le zoom (le système global doit se lire d'un coup d'œil, cf agents).
const DUBAI: [number, number] = [55.27, 25.2];
const ANKARA: [number, number] = [32.86, 39.93];
type Beat6Panel = { iso: string; geoName: string; color: string; fact: string };
const BEAT6_PANELS_LEFT: Beat6Panel[] = [
  { iso: "ae", geoName: "United Arab Emirates", color: ATLAS.gold, fact: "Or et drones vers les RSF" },
  { iso: "tr", geoName: "Turkey", color: ATLAS.saf, fact: "Drones Bayraktar vers le SAF" },
];
const BEAT6_PANELS_RIGHT: Beat6Panel[] = [
  { iso: "ru", geoName: "Russia", color: RUSSIA_RED, fact: "Base navale en négociation" },
  { iso: "eg", geoName: "Egypt", color: "#C9973A", fact: "Renseignement, profondeur stratégique" },
];

const Section5: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  const flechesOpacity = interpolate(frame, [F5.quatrePuissances, F5.quatrePuissances + 30], [0, 0.5], clamp);

  const alternPhase = Math.sin(frame * 0.04);
  const zones: ZoneControl[] = [
    { at: DARFUR, faction: "rsf", radiusKm: 200, intensity: 0.3 + Math.max(0, alternPhase) * 0.12 },
    { at: KHARTOUM, faction: "saf", radiusKm: 200, intensity: 0.3 + Math.max(0, -alternPhase) * 0.12 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p5.mp3")} />

      <Sequence from={F5.quatrePuissances} durationInFrames={24}><Audio src={staticFile("_shared/sfx/warmap/ink-spread.mp3")} volume={0.5} /></Sequence>

      <SoudanWarMapEngine camKeys={CAM5} zones={zones} showNationalBorder stateLineOpacity={0}>
        {(proj, ref) => {
          mapRef.current = ref?.current ?? null;
          const fakeMap = { project: (c: [number, number]) => proj(c) ?? { x: 0, y: 0 } } as any;

          return (
            <>
              {/* 4 flèches externes visibles ensemble (EAU, Turquie, Russie, Égypte) — traces fantômes,
                  reprend les trajets déjà établis Acte 3 (or/drones Turquie) + Acte 4 (Russie/Égypte) */}
              {frame >= F5.quatrePuissances && (
                <>
                  <GeoFlowConnection map={fakeMap} waypoints={[MOSCOW, KHARTOUM]} progress={1} markerProgress={1}
                    lineColor={RUSSIA_RED} lineOpacity={flechesOpacity} hideMarker persistAfterArrival persistOpacity={flechesOpacity} dashOffsetFrame={frame} />
                  <GeoFlowConnection map={fakeMap} waypoints={[CAIRO, KHARTOUM]} progress={1} markerProgress={1}
                    lineColor={ATLAS.saf} lineOpacity={flechesOpacity} hideMarker persistAfterArrival persistOpacity={flechesOpacity} dashOffsetFrame={frame} />
                  <GeoFlowConnection map={fakeMap} waypoints={[DUBAI, [47, 25.5], [38, 24.5], DARFUR]} progress={1} markerProgress={1}
                    lineColor={ATLAS.gold} lineOpacity={flechesOpacity} hideMarker persistAfterArrival persistOpacity={flechesOpacity} dashOffsetFrame={frame} />
                  <GeoFlowConnection map={fakeMap} waypoints={[ANKARA, [33, 32], [32.7, 24], KHARTOUM]} progress={1} markerProgress={1}
                    lineColor={ATLAS.saf} lineOpacity={flechesOpacity} hideMarker persistAfterArrival persistOpacity={flechesOpacity} dashOffsetFrame={frame} />
                </>
              )}

              {(() => { const p = proj(DARFUR); return p && <SoudanToken pos={p} faction="rsf" frame={frame} appear={0} />; })()}
              {(() => { const p = proj(KHARTOUM); return p && <SoudanToken pos={p} faction="saf" frame={frame} appear={0} />; })()}

              <CountryColorLayer mapRef={mapRef} flags={ALL_COUNTRY_FLAGS} absoluteFrame={sectionOffset + frame} />
            </>
          );
        }}
      </SoudanWarMapEngine>

      {/* 4 mini-volets territoire empilés par paire — meublent le dézoom avec les 4 puissances réelles */}
      <Beat6PowerPanels frame={frame} appear={F5.quatrePuissances + 10} />

      <WarmVignette />
    </AbsoluteFill>
  );
};

const Beat6PowerPanels: React.FC<{ frame: number; appear: number }> = ({ frame, appear }) => {
  const [topo, setTopo] = React.useState<any>(null);
  React.useEffect(() => {
    fetch(staticFile("_shared/geo-data/countries-50m.json")).then((r) => r.json()).then(setTopo).catch(() => {});
  }, []);
  if (!topo || frame < appear - 2) return null;
  const panelW = 1920 * 0.16;
  const panelH = 1080 * 0.42;
  return (
    <>
      {BEAT6_PANELS_LEFT.map((p, i) => (
        <MiniPowerPanel key={p.iso} panel={p} side="left" row={i} topology={topo} frame={frame}
          appear={appear + i * 8} panelW={panelW} panelH={panelH} />
      ))}
      {BEAT6_PANELS_RIGHT.map((p, i) => (
        <MiniPowerPanel key={p.iso} panel={p} side="right" row={i} topology={topo} frame={frame}
          appear={appear + 16 + i * 8} panelW={panelW} panelH={panelH} />
      ))}
    </>
  );
};

const MiniPowerPanel: React.FC<{
  panel: Beat6Panel; side: "left" | "right"; row: number; topology: any; frame: number; appear: number;
  panelW: number; panelH: number;
}> = ({ panel, side, row, topology, frame, appear, panelW, panelH }) => {
  const flagUrl = staticFile(`_shared/flags/${panel.iso}.png`);
  const { pathD, bbox } = React.useMemo(() => {
    try {
      const fc = feature(topology, topology.objects.countries) as unknown as { features: any[] };
      const feat = fc.features.find((f: any) => f.properties?.name === panel.geoName);
      if (!feat) return { pathD: "", bbox: [[0, 0], [panelW, panelH]] as [[number, number], [number, number]] };
      const proj = geoMercator().fitExtent([[16, 16], [panelW - 16, panelH - 60]], feat);
      const gp = geoPath(proj);
      return { pathD: gp(feat) ?? "", bbox: gp.bounds(feat) as [[number, number], [number, number]] };
    } catch { return { pathD: "", bbox: [[0, 0], [panelW, panelH]] as [[number, number], [number, number]] }; }
  }, [topology, panel.geoName, panelW, panelH]);

  const op = interpolate(frame, [appear, appear + 20], [0, 1], clamp);
  const slideIn = interpolate(frame, [appear, appear + 22], [side === "left" ? -panelW * 0.4 : panelW * 0.4, 0], clamp);
  if (op <= 0.01) return null;
  const [[bx0, by0], [bx1, by1]] = bbox;
  const clipId = `a4-mini-${panel.iso}`;
  const top = 90 + row * (panelH + 12);

  return (
    <div style={{
      position: "absolute", top, [side]: 14, width: panelW, height: panelH, overflow: "hidden",
      opacity: op, transform: `translateX(${slideIn}px)`, borderRadius: 8,
      background: "radial-gradient(ellipse at 50% 42%, rgba(58,42,24,0.5) 0%, rgba(20,14,7,0.85) 78%)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    }}>
      <svg width={panelW} height={panelH} viewBox={`0 0 ${panelW} ${panelH}`} style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id={clipId}><path d={pathD} /></clipPath></defs>
        {flagUrl && pathD && (
          <image href={flagUrl} x={bx0} y={by0} width={bx1 - bx0} height={by1 - by0}
            preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} opacity={0.92} />
        )}
        <path d={pathD} fill="none" stroke={ATLAS.cream} strokeWidth={1.6} opacity={0.7} />
      </svg>
      <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, textAlign: "center" }}>
        <div style={{ color: ATLAS.cream, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 13,
          lineHeight: 1.2, textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}>{panel.fact}</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PARTAGÉ (repris tel quel du pattern Acte 3)
// ─────────────────────────────────────────────────────────────────────────────

const ArrivalLabel: React.FC<{ pos: Pt; frame: number; appear: number; label: string; color?: string }> =
  ({ pos, frame, appear, label, color = ATLAS.gold }) => {
    const fadeIn = 14;
    const op = interpolate(frame, [appear, appear + fadeIn], [0, 1], clamp);
    if (op <= 0.01) return null;
    const scale = interpolate(frame, [appear, appear + fadeIn], [0.4, 1], clamp);
    return (
      <>
        <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
          <g transform={`translate(${pos.x} ${pos.y}) scale(${scale})`} opacity={op}>
            <circle r={14} fill={color} opacity={0.22} />
            <circle r={7} fill={color} stroke="#fff" strokeWidth={1.6} />
          </g>
        </svg>
        <div style={{
          position: "absolute", left: pos.x + 16, top: pos.y - 14, opacity: op,
          fontFamily: "Georgia, serif", fontWeight: 800, fontSize: 22, letterSpacing: "0.02em",
          color: "#F2E5C8", textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.6)",
          whiteSpace: "nowrap", pointerEvents: "none",
        }}>{label}</div>
      </>
    );
  };

const CountryColorLayer: React.FC<{
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  flags: CountryFlag[];
  absoluteFrame: number;
}> = ({ mapRef, flags, absoluteFrame }) => {
  const asClipFlags: ClipFlag[] = flags.map(f => ({ iso: f.iso, geoNames: f.geoNames, flagFile: `${f.iso}.png`, at: f.atAbsolute, bgColor: f.color, mainlandBox: f.mainlandBox }));
  const { paths } = useClipFlags(mapRef, asClipFlags, absoluteFrame);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        {flags.map(f => {
          const pp = paths[f.iso];
          return pp ? <clipPath key={f.iso} id={`ccl4-${f.iso}`}><path d={pp.path} /></clipPath> : null;
        })}
      </defs>
      {flags.map(f => {
        const pp = paths[f.iso];
        if (!pp || absoluteFrame < f.atAbsolute) return null;
        const opFlag = Math.min(1, Math.max(0, (absoluteFrame - f.atAbsolute) / 20)) * 0.92;
        return (
          <g key={f.iso}>
            <path d={pp.path} fill={f.color} opacity={opFlag * 0.85} />
            <image href={pp.url} x={pp.bbox.x} y={pp.bbox.y} width={pp.bbox.w} height={pp.bbox.h}
              preserveAspectRatio="xMidYMid meet" clipPath={`url(#ccl4-${f.iso})`} opacity={opFlag} />
            <path d={pp.path} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={1.6} opacity={opFlag * 0.7} />
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

export default SoudanActe4;
