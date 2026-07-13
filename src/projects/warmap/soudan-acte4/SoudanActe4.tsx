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
import { useClipFlags, ClipFlag } from "../../_shared/mapbox/useClipFlags";
import { ATLAS } from "../engine/sudanControlData";
import { SmokeColumn } from "../_shared/warmapChoc";
import { HookDisplacementBurst } from "../../_shared/hooks-lib/HookEffects";
import { PART_OFFSETS, BEAT1, BEAT2, BEAT3, BEAT4, BEAT5, BEAT6 } from "./soudanActe4Timing";

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
// ⭐ v2 (session 10, 2026-07-12, retour Aziz) : le drapeau Égypte plein cadre (92% opacité) écrase le
// masque parchemin temporaire (Section3) et rendrait les jetons/tracés posés dessus peu lisibles — retiré
// SEULEMENT pour Section3 (le motif Nil reste 100% parchemin, comme la Russie Beat 1). L'Égypte réapparaît
// en drapeau au Beat 6 (synthèse 4 puissances, ALL_COUNTRY_FLAGS intact) où le registre est différent
// (dézoom large, mosaïque de pays, pas un motif isolé sur un territoire).
const SECTION3_FLAGS = ALL_COUNTRY_FLAGS.filter((f) => f.iso !== "eg");

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

// ⭐ v4 (session 10, 2026-07-12, retour Aziz) : correction de 2 défauts constatés sur v3 —
// (1) zoom Moscou beaucoup trop serré (6.4 = échelle "ville"), le territoire russe filtré
// (mainlandBox lon 19-100/lat 41-78, cf ALL_COUNTRY_FLAGS) se lisait comme un vide autour d'un point
// perdu. Dézoomé à l'échelle "pays continental" (cohérent avec CAM1_ZOOM_REST, le zoom de repos Soudan).
// (2) caméra saccadée à la bascule 2024 : v3 faisait un whip pan RETOUR vers un point de repos Soudan
// PUIS repartait aussitôt vers Khartoum via cameraFollowsPath — 2 mouvements de nature différente
// perçus comme un aller-retour hésitant. Fusionné en UN SEUL mouvement Moscou -> Khartoum, la caméra
// reste fixe sur Moscou jusqu'à "volteFace2024" puis part directement (pas de repos intermédiaire).
const CAM1_ZOOM_MOSCOW = 3.6;   // territoire russe filtré visible dans son ensemble, pas un point isolé
const CAM1_ZOOM_FOLLOW = 5.2;
const CAM1_ZOOM_REST = 4.4;
const WP_RUSSIA_SAF: [number, number][] = [MOSCOW, [34, 35], [32.7, 24], KHARTOUM];
const CAM1_BLEND = 16;
const WHIP_DUR = 60; // règle 60f whip pan (DOCTRINE-SOUVERAIN.md) — au-delà ça mollit, en-deçà ça saccade

// whip pan = trajectoire directe + survol du zoom (dézoome au milieu du trajet, comme un vrai pan caméra
// qui recule pour balayer la distance, puis se resserre à l'arrivée) — pas un simple lerp linéaire plat.
function whipPan(a: CamKey, b: CamKey, frame: number, from: number, dur: number): CamKey {
  const t = interpolate(frame, [from, from + dur], [0, 1], clamp);
  const te = t * t * (3 - 2 * t); // smoothstep, easing doux aux extrémités
  const zoomDip = Math.sin(t * Math.PI) * 1.2; // survol : dézoome au milieu du pan
  return {
    f: frame,
    lon: a.lon + (b.lon - a.lon) * te,
    lat: a.lat + (b.lat - a.lat) * te,
    zoom: a.zoom + (b.zoom - a.zoom) * te - zoomDip,
  };
}

function cam1At(frame: number, f1: typeof F1): CamKey {
  const restStart: CamKey = { f: frame, lon: 30, lat: 20, zoom: CAM1_ZOOM_REST };
  const onMoscow: CamKey = { f: frame, lon: MOSCOW[0], lat: MOSCOW[1], zoom: CAM1_ZOOM_MOSCOW };

  // Phase 0 — repos large avant le mot "troisième pays"
  if (frame < f1.troisiemePays) return restStart;

  // Phase 1 — WHIP PAN Soudan -> Moscou (60f actives), atterrissage large sur le territoire russe.
  const whipEnd = f1.troisiemePays + WHIP_DUR;
  if (frame < whipEnd) return whipPan(restStart, onMoscow, frame, f1.troisiemePays, WHIP_DUR);

  // Phase 2 — STABILISÉE sur Moscou : tout le flux Wagner/or (wagnerArmait) se joue caméra FIXE sur le
  // territoire russe (régime parchemin temporaire, cf Section1 RussiaParchmentMask). Reste fixe jusqu'à
  // volteFace2024 — aucun repos intermédiaire, un seul mouvement suivra directement.
  if (frame < f1.volteFace2024) return onMoscow;

  // Phase 3 — UN SEUL mouvement Moscou -> Khartoum à la bascule 2024 (cameraFollowsPath, la caméra suit
  // le trait SAF qui se trace) — plus de retour-puis-repart, directement depuis Moscou.
  const t2 = interpolate(frame, [f1.volteFace2024, f1.end - 20], [0, 1], clamp);
  return cameraFollowsPath(WP_RUSSIA_SAF, t2, CAM1_ZOOM_FOLLOW);
}

// ⭐ MASQUE PARCHEMIN TEMPORAIRE (session 10, 2026-07-12) — extension ponctuelle du principe "CONTOUR
// PERMANENT + INTÉRIEUR VIDE" (grammaire AES, cf SoudanWarMapEngine.tsx) à un pays voisin le temps d'un
// beat. Le voile kaki qui assombrit tout ce qui n'est pas le Soudan est troué le temps du beat sur le
// territoire concerné (ici la Russie), avec un fondu d'ouverture/fermeture — PAS un état binaire figé,
// pour que le territoire redevienne kaki en douceur une fois le beat terminé (retour à la grammaire
// normale du reste de l'acte, aucun résidu visuel après la scène).
// ⭐ v2 (session 10, 2026-07-12) généralisé — même mécanisme réutilisé pour l'Égypte (Beat 3-4), pas
// seulement la Russie. `geoPath` paramétrable, `lonFilter` optionnel (utile pour un pays transcontinental
// comme la Russie qui traverse l'antiméridien — inutile pour l'Égypte, taille raisonnable).
function CountryParchmentMask({
  proj, frame, openAt, closeAt, geoPath, lonFilter, width = 1920, height = 1080, maskId,
}: {
  proj: (c: [number, number]) => { x: number; y: number } | null; frame: number; openAt: number; closeAt: number;
  geoPath: string; lonFilter?: (lon: number) => boolean; width?: number; height?: number; maskId: string;
}) {
  const [geo, setGeo] = React.useState<any>(null);
  React.useEffect(() => {
    fetch(staticFile(geoPath)).then((r) => r.json()).then(setGeo).catch(() => {});
  }, [geoPath]);
  const openT = interpolate(frame, [openAt, openAt + 20], [0, 1], clamp);
  const closeT = interpolate(frame, [closeAt, closeAt + 24], [1, 0], clamp);
  const op = Math.min(openT, closeT);
  if (!geo || op <= 0.01) return null;

  const rings: [number, number][][] = [];
  for (const f of geo.features) {
    const g = f.geometry;
    const polys = g.type === "MultiPolygon" ? g.coordinates : [g.coordinates];
    for (const poly of polys) rings.push(poly[0] as [number, number][]);
  }
  const paths = rings.map((ring) => {
    let d = "";
    let started = false;
    for (const [lon, lat] of ring) {
      if (lonFilter && !lonFilter(lon)) { started = false; continue; }
      const p = proj([lon, lat]);
      if (!p) { started = false; continue; }
      d += (!started ? "M" : "L") + p.x.toFixed(1) + " " + p.y.toFixed(1);
      started = true;
    }
    return d + "Z";
  }).filter((d) => d.length > 3);
  if (!paths.length) return null;

  return (
    <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
      {/* Le voile kaki NATIF du moteur (SoudanWarMapEngine, troué uniquement sur le Soudan) reste plein
          sur le pays voisin — CE calque pose un patch crème PAR-DESSUS pour simuler le "trou" temporaire,
          au lieu de tenter de re-trouer le voile natif (inaccessible depuis ce composant enfant). */}
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width={width} height={height} fill="black" />
          {paths.map((d, i) => <path key={i} d={d} fill="white" fillOpacity={op} />)}
        </mask>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill={ATLAS.land} fillOpacity={op} mask={`url(#${maskId})`} />
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={ATLAS.outline} strokeWidth={2.4} opacity={op * 0.85} />
      ))}
    </svg>
  );
}

// filtre la partie orientale (au-delà de ~100°E) qui traverse l'antiméridien — seule la Russie
// européenne/occidentale est visible dans le cadrage Moscou de ce beat (cf mainlandBox ALL_COUNTRY_FLAGS).
const russiaLonFilter = (lon: number) => lon <= 100 && lon >= -20;

function RussiaParchmentMask(props: { proj: (c: [number, number]) => { x: number; y: number } | null; frame: number; openAt: number; closeAt: number }) {
  return <CountryParchmentMask {...props} geoPath="_shared/geo-data/world/russia-outline.geojson" lonFilter={russiaLonFilter} maskId="russiaShow" />;
}

function EgyptParchmentMask(props: { proj: (c: [number, number]) => { x: number; y: number } | null; frame: number; openAt: number; closeAt: number }) {
  return <CountryParchmentMask {...props} geoPath="_shared/geo-data/world/egypt-outline.geojson" maskId="egyptShow" />;
}

// Point placeholder pour les acteurs posés sur le territoire russe pendant la stabilisation (proche
// Moscou, dans le cadrage du whip pan) — à remplacer par de vrais assets (jeton Wagner/Africa Corps)
// une fois le principe validé Aziz.
const WAGNER_SITE: [number, number] = [MOSCOW[0] + 1.2, MOSCOW[1] - 1.6];

const Section1: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const camKeys1 = React.useCallback((f: number) => cam1At(f, F1), []);

  const whipEnd = F1.troisiemePays + WHIP_DUR;

  // flux ARMES (Moscou/Wagner -> RSF) qui se trace à l'atterrissage sur Moscou, jusqu'à s'estomper à
  // la bascule 2024. flux OR (RSF -> Moscou/Wagner, retour) — le troc du script (armes contre or) rendu
  // visible comme un aller-retour, pas un simple flux à sens unique.
  const armesTraitProgress = interpolate(frame, [whipEnd, whipEnd + 30], [0, 1], clamp);
  const armesTraitOpacity = interpolate(frame, [whipEnd, whipEnd + 16, F1.volteFace2024, F1.volteFace2024 + 30], [0, 0.6, 0.6, 0.1], clamp);
  const orTraitProgress = interpolate(frame, [F1.wagnerArmait + 10, F1.wagnerArmait + 42], [0, 1], clamp);
  const orTraitOpacity = interpolate(frame, [F1.wagnerArmait + 10, F1.wagnerArmait + 26, F1.volteFace2024, F1.volteFace2024 + 30], [0, 0.55, 0.55, 0.08], clamp);

  const safTraitOpacity = interpolate(frame, [F1.volteFace2024, F1.volteFace2024 + 24], [0, 0.7], clamp);
  const safTraitProgress = interpolate(frame, [F1.volteFace2024, F1.volteFace2024 + 30], [0, 1], clamp);

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
              {/* masque parchemin temporaire — territoire russe éclairé le temps du beat, referme en kaki
                  au whip pan retour (cam1At phase 3) */}
              <RussiaParchmentMask proj={proj} frame={frame} openAt={F1.troisiemePays + 10} closeAt={F1.volteFace2024 - CAM1_BLEND} />

              {/* repère Moscou — reste affiché tant que le territoire russe est ouvert */}
              {frame >= F1.troisiemePays && (() => { const p = proj(MOSCOW); return p && <ArrivalLabel pos={p} frame={frame} appear={F1.troisiemePays} label="Moscou" color={RUSSIA_RED} />; })()}

              {/* placeholder acteur Wagner sur le territoire russe (jeton générique — à remplacer par
                  asset dédié une fois le principe validé) */}
              {frame >= whipEnd && (() => { const p = proj(WAGNER_SITE); return p && <SoudanToken pos={p} faction="rsf" frame={frame} appear={whipEnd} />; })()}
              {/* géoplaque Wagner/Africa Corps — le mot est prononcé mais jamais défini visuellement,
                  1 ligne factuelle courte reliée au jeton (pattern NileFactPlaque, Beat 4) */}
              <WagnerFactPlaque frame={frame} appear={F1.wagnerArmait} fadeAt={F1.volteFace2024} />

              {/* flux ARMES Moscou/Wagner -> RSF (descend) */}
              {frame >= whipEnd && (
                <GeoFlowConnection map={fakeMap} waypoints={[WAGNER_SITE, [34, 35], [30, 25], DARFUR]} progress={armesTraitProgress} markerProgress={armesTraitProgress}
                  lineColor={RUSSIA_RED} lineOpacity={armesTraitOpacity} lineWidth={3} hideMarker dashOffsetFrame={frame} />
              )}
              {/* flux OR — retour RSF -> Moscou/Wagner (le troc du script, aller-retour) */}
              {frame >= F1.wagnerArmait + 10 && (
                <GeoFlowConnection map={fakeMap} waypoints={[DARFUR, [30, 25], [34, 35], WAGNER_SITE]} progress={orTraitProgress} markerProgress={orTraitProgress}
                  lineColor={ATLAS.gold} lineOpacity={orTraitOpacity} lineWidth={2.4} hideMarker dashOffsetFrame={frame} />
              )}
              {/* trait nouveau Moscou->SAF (2024, net et actif) — 2e voyage caméra (cam1At phase 4) */}
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

    </AbsoluteFill>
  );
};

const WagnerFactPlaque: React.FC<{ frame: number; appear: number; fadeAt: number }> = ({ frame, appear, fadeAt }) => {
  const op = interpolate(frame, [appear, appear + 20, fadeAt, fadeAt + 20], [0, 1, 1, 0], clamp);
  if (op <= 0.01) return null;
  return (
    <div style={{
      position: "absolute", bottom: 90, left: 0, right: 0, textAlign: "center", opacity: op, pointerEvents: "none",
    }}>
      <div style={{ display: "inline-block", padding: "10px 22px", background: "rgba(20,14,7,0.55)", borderRadius: 6 }}>
        <span style={{ color: ATLAS.gold, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 22,
          letterSpacing: "0.02em", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
          Wagner : groupe paramilitaire russe, sanctionné par l&apos;UE en 2023 pour son commerce d&apos;or au Soudan
        </span>
      </div>
    </div>
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

// ⭐⭐ v4 (session 10, 2026-07-12, retour Aziz) : Section2 REVIENT à la carte — l'insert SVG plein écran
// (PortSoudanNegociationScene, v3) est abandonné. Motif : la refonte du Beat 1 (whip pan + zoom large sur
// un territoire complet) a changé la grammaire de l'acte — sortir de la carte pour un insert juste après
// casse la continuité tout juste construite. Retour au jeton posé sur la carte (pattern Sénégal, comme le
// Beat 1 Wagner) : objet iso/topdown "base navale en construction" généré GPT-5.6 Sol (validé Aziz après
// comparaison sur la vraie carte, cf 2 propositions testées dans _rnd/PortSoudanJetonCompare.tsx),
// AGRANDI +50% (140->210px) suite retour Aziz — sous-dimensionnement récurrent identifié sur l'acte
// (même défaut déjà corrigé Beat 4 Nil, Beat 5 drone Kosti).
const PORT_SOUDAN: [number, number] = [37.22, 19.62];

const CAM2: CamKey[] = [
  { f: F2.start, lon: 32.5, lat: 17, zoom: 4.8 },
  { f: F2.portSoudanNomme, lon: PORT_SOUDAN[0], lat: PORT_SOUDAN[1], zoom: 6.6 },
  { f: F2.end, lon: PORT_SOUDAN[0], lat: PORT_SOUDAN[1], zoom: 6.6 },
];

const Section2: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  const jetonOp = interpolate(frame, [F2.portSoudanNomme, F2.portSoudanNomme + 20], [0, 1], clamp);
  // pulsation sonar douce (négociation en cours, pas un fait accompli) — ondes concentriques
  const sonarT = ((frame - F2.portSoudanNomme) % 60) / 60;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte4-voisins-aspires-p2.mp3")} />

      <Sequence from={F2.portSoudanNomme} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.5} /></Sequence>

      <SoudanWarMapEngine camKeys={CAM2} zones={[]} showNationalBorder stateLineOpacity={0}>
        {(proj, ref) => {
          mapRef.current = ref?.current ?? null;
          const p = proj(PORT_SOUDAN);

          return (
            <>
              {p && frame >= F2.portSoudanNomme && (
                <>
                  {/* ondes sonar concentriques — négociation EN COURS, pas un fait accompli (DA-brief
                      Kimi, retenu) */}
                  <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
                    {[0, 0.5].map((offset) => {
                      const t = (sonarT + offset) % 1;
                      const r = 20 + t * 90;
                      const op = (1 - t) * 0.4;
                      return <circle key={offset} cx={p.x} cy={p.y} r={r} fill="none" stroke={RUSSIA_RED} strokeWidth={2} opacity={op} />;
                    })}
                  </svg>
                  <div style={{ position: "absolute", left: p.x, top: p.y, transform: "translate(-50%,-60%)", opacity: jetonOp, pointerEvents: "none" }}>
                    <img src={staticFile("_shared/sprites/warmap/port-soudan-navale-td.png")}
                      style={{ width: 210, height: 210, objectFit: "contain",
                        filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.5))" }} />
                  </div>
                  <ArrivalLabel pos={p} frame={frame} appear={F2.portSoudanNomme} label="Port-Soudan" color={RUSSIA_RED} />
                </>
              )}

              <CountryColorLayer mapRef={mapRef} flags={SECTION3_FLAGS} absoluteFrame={sectionOffset + frame} />
            </>
          );
        }}
      </SoudanWarMapEngine>

      <PortSoudanFactPlaques frame={frame} f2={F2} />
    </AbsoluteFill>
  );
};

// géoplaques factuelles séquentielles (25 ans, 300 soldats, 4 navires, propulsion nucléaire, pas signé) —
// pattern réutilisé de WagnerFactPlaque/NileFactPlaque, 1 ligne courte à la fois, jamais toutes ensemble.
const PortSoudanFactPlaques: React.FC<{ frame: number; f2: typeof F2 }> = ({ frame, f2 }) => {
  const items: { appear: number; fadeAt: number; text: string }[] = [
    { appear: f2.vingtCinqAns, fadeAt: f2.troisCentsSoldats, text: "Accord proposé : 25 ans" },
    { appear: f2.troisCentsSoldats, fadeAt: f2.quatreNavires, text: "Jusqu'à 300 soldats russes" },
    { appear: f2.quatreNavires, fadeAt: f2.propulsionNucleaire, text: "4 navires de guerre" },
    { appear: f2.propulsionNucleaire, fadeAt: f2.soudanPasSigne, text: "Dont des bâtiments à propulsion nucléaire" },
    { appear: f2.soudanPasSigne, fadeAt: f2.end, text: "Le Soudan n'a encore rien signé" },
  ];
  return (
    <>
      {items.map((it, i) => {
        const op = interpolate(frame, [it.appear, it.appear + 16, it.fadeAt, it.fadeAt + 16], [0, 1, 1, 0], clamp);
        if (op <= 0.01) return null;
        return (
          <div key={i} style={{ position: "absolute", bottom: 90, left: 0, right: 0, textAlign: "center", opacity: op, pointerEvents: "none" }}>
            <div style={{ display: "inline-block", padding: "10px 22px", background: "rgba(20,14,7,0.55)", borderRadius: 6 }}>
              <span style={{ color: ATLAS.gold, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 22,
                letterSpacing: "0.02em", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
                {it.text}
              </span>
            </div>
          </div>
        );
      })}
    </>
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

// ⭐ v2 (session 10, 2026-07-12, retour Aziz) : zoom RESSERRÉ (4.0-4.6 -> 5.2-5.8) — le dézoom large
// précédent noyait le motif Nil dans un cadrage trop lointain ("nuit plus qu'autre chose"), cohérent
// avec la correction Beat 1 (zoom adapté au sujet, pas un dézoom systématique par défaut).
const CAM3: CamKey[] = [
  { f: F3.start, lon: 30, lat: 22, zoom: 5.2 },
  { f: F3.egypteNommee, lon: CAIRO[0], lat: (CAIRO[1] + KHARTOUM[1]) / 2, zoom: 5.4 },
  { f: F3.motifStart, lon: 31.5, lat: 23, zoom: 5.8 }, // caméra resserrée pour le motif (contraste voulu, cf script)
  { f: F3.end, lon: 31.5, lat: 23, zoom: 5.8 },
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

  // BEAT 4 — le Nil, v3 SIMPLIFIÉ (session 10, 2026-07-12, retour Aziz) : le fond de carte dessine DÉJÀ
  // nativement le Nil (SoudanWarMapEngine, rivières en rgba(90,120,140,0.45)) — inutile de superposer un
  // tracé custom (GradientPathReveal, abandonné) quand le sujet est déjà visible à l'écran. Remplacé par
  // un simple ÉCLAIRCISSEMENT du tracé natif (assombrir le reste, faire "ressortir" le Nil existant en
  // quasi fluorescent) — un seul trait qui s'intensifie en opacité/largeur, pas de dégradé segmenté.
  const nilGlowT = interpolate(frame, [F3.nilNomme, F3.nilNomme + 40], [0, 1], clamp);
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
              {/* territoire égyptien en régime parchemin temporaire (même mécanisme que la Russie Beat 1)
                  pendant tout le motif Nil — referme en kaki à la fin de la section */}
              <EgyptParchmentMask proj={proj} frame={frame} openAt={F3.egypteNommee + 10} closeAt={F3.end - 30} />

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

              {/* BEAT 4 — le Nil, v3 simplifié : éclaircissement du tracé NATIF (déjà dessiné par le fond
                  de carte) plutôt qu'un tracé custom superposé — le sujet est déjà visible à l'écran.
                  Flash net à "profondeur stratégique". */}
              {frame >= F3.nilNomme && (() => {
                const pts = NILE_WAYPOINTS.map((c) => proj(c)).filter(Boolean) as { x: number; y: number }[];
                if (pts.length < 2) return null;
                const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
                const glowOp = nilGlowT * 0.75 + nilFlashT * 0.25;
                const glowWidth = 4 + nilGlowT * 5;
                return (
                  <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
                    {/* halo diffus dessous, pour un effet "quasi fluorescent" sans changer le tracé lui-même */}
                    <path d={d} fill="none" stroke={ATLAS.saf} strokeWidth={glowWidth * 2.4} strokeLinecap="round" opacity={glowOp * 0.3} />
                    <path d={d} fill="none" stroke={ATLAS.saf} strokeWidth={glowWidth} strokeLinecap="round" opacity={glowOp} />
                    {nilFlashT > 0.01 && (
                      <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={glowWidth * 1.4} strokeLinecap="round" opacity={nilFlashT * 0.8} />
                    )}
                  </svg>
                );
              })()}

              {(() => { const p = proj(DARFUR); return p && <SoudanToken pos={p} faction="rsf" frame={frame} appear={0} />; })()}
              {(() => { const p = proj(KHARTOUM); return p && <SoudanToken pos={p} faction="saf" frame={frame} appear={0} />; })()}

              <CountryColorLayer mapRef={mapRef} flags={SECTION3_FLAGS} absoluteFrame={sectionOffset + frame} />
            </>
          );
        }}
      </SoudanWarMapEngine>

      {/* géoplaque factuelle courte — le Nil seul montre un FAIT géo, pas l'ARGUMENT stratégique
          (cf vigilance script + agents R&D) : ce chiffre porte le raisonnement que le geste seul ne peut pas */}
      <NileFactPlaque frame={frame} appear={F3.redouteInfluence} />

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

// Caméra : dézoom léger puis resserre progressivement sur Kosti (close-up pour la vue top-down).
// ⭐ v2 (session 10) : léger zoom-in supplémentaire pendant l'approche du drone (8.5 -> 9.1), la caméra
// "accompagne" le mobile au lieu de rester figée — 4e levier du pattern MapAnimation ("camera pans along
// with the jet"). Décroché de F4.droneFrappe (approche démarre 60f avant, cf approachAt dans Section4).
const CAM4: CamKey[] = [
  { f: F4.start, lon: 31.5, lat: 20, zoom: 4.5 },
  { f: F4.kostiNomme, lon: KOSTI[0], lat: KOSTI[1], zoom: 8.5 },
  { f: F4.droneFrappe - 60, lon: KOSTI[0], lat: KOSTI[1], zoom: 8.5 },
  { f: F4.droneFrappe + 6, lon: KOSTI[0], lat: KOSTI[1], zoom: 9.1 },
  { f: F4.end, lon: KOSTI[0], lat: KOSTI[1], zoom: 9.1 },
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
 *
 * ⭐ v2 (session 10, 2026-07-12, retour Aziz + rapport MapAnimation) : diagnostic frame-par-frame du v6
 * confirmé — drone à 40px fixe, trajectoire courte (272px), zéro contraste avec le fond crème = invisible
 * à l'écran (moins d'1s de visibilité nette). Catalogue MapAnimation (templates B-2/bomber/Shahed)
 * confirme 4 leviers systématiques, absents ici : sprite proportionné au cadre (pas une taille absolue),
 * trajectoire longue en diagonale qui traverse l'écran, traînée (comet trail) qui accentue le mouvement,
 * contraste fort avec le fond (halo sombre sous le sprite clair). Appliqués ci-dessous.
 */
const DroneStrikeImpact: React.FC<{ pos: Pt; frame: number; approachAt: number; impactAt: number }> =
  ({ pos, frame, approachAt, impactAt }) => {
    if (frame < approachAt) return null;

    // phase approche : trajectoire longue en diagonale (traverse une bonne partie de l'écran, pas un
    // déplacement local) — coin haut-droit du cadre jusqu'au point d'impact.
    const approachT = interpolate(frame, [approachAt, impactAt], [0, 1], clamp);
    const droneStartOffset = { dx: 620, dy: -420 };
    const droneX = pos.x + droneStartOffset.dx * (1 - approachT);
    const droneY = pos.y + droneStartOffset.dy * (1 - approachT);
    const droneOpacity = interpolate(frame, [approachAt, approachAt + 8, impactAt - 4, impactAt], [0, 1, 1, 0], clamp);
    const droneAngle = Math.atan2(-droneStartOffset.dy, -droneStartOffset.dx) * (180 / Math.PI);

    // traînée (comet trail) — quelques points échelonnés derrière le drone sur sa trajectoire, accentue
    // la vitesse/le mouvement (pattern "curved arc flight path with comet trail", catalogue MapAnimation).
    const trailSteps = [0.06, 0.12, 0.19, 0.27];

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
        {/* traînée — points décroissants derrière le drone sur sa trajectoire, avant le sprite lui-même
            pour rester dessous visuellement */}
        {droneOpacity > 0.01 && trailSteps.map((t, i) => {
          const tt = Math.max(0, approachT - t);
          const tx = pos.x + droneStartOffset.dx * (1 - tt);
          const ty = pos.y + droneStartOffset.dy * (1 - tt);
          const trailOp = droneOpacity * (1 - i / trailSteps.length) * 0.35;
          return (
            <div key={i} style={{ position: "absolute", left: tx, top: ty, transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
              <div style={{ width: 14 - i * 2, height: 14 - i * 2, borderRadius: "50%",
                background: RUSSIA_RED, opacity: trailOp, filter: "blur(1px)" }} />
            </div>
          );
        })}

        {/* drone qui approche, vu de dessus — agrandi (95px) + halo de contraste sombre sous le sprite
            pour qu'il ressorte nettement du fond crème (levier "contraste fort" du catalogue MapAnimation) */}
        {droneOpacity > 0.01 && (
          <div style={{ position: "absolute", left: droneX, top: droneY, transform: `translate(-50%,-50%) rotate(${droneAngle + 90}deg)`, pointerEvents: "none" }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 130, height: 130,
              transform: "translate(-50%,-50%)", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(20,14,7,0.5) 0%, rgba(20,14,7,0) 68%)", opacity: droneOpacity }} />
            <img src={staticFile("_shared/sprites/warmap/drone-rsf-td.png")}
              style={{ position: "relative", width: 95, height: 95, objectFit: "contain", opacity: droneOpacity,
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6)) drop-shadow(0 0 10px rgba(20,14,7,0.5))" }} />
          </div>
        )}

        {/* explosion one-shot au point d'impact */}
        {showExplosion && (
          <div style={{ position: "absolute", left: pos.x, top: pos.y, transform: "translate(-50%,-50%)", pointerEvents: "none" }}>
            <img src={staticFile(`_shared/sprites/warmap/fx-explosion/${explosionIdx}.png`)}
              style={{ width: 110, height: 110, objectFit: "contain", opacity: explosionOpacity }} />
          </div>
        )}

        {/* fumée persistante après l'impact — la conséquence qui reste à l'écran */}
        {showSmoke && (
          <div style={{ position: "absolute", left: pos.x, top: pos.y - 30, transform: "translate(-50%,-70%)", pointerEvents: "none" }}>
            <img src={staticFile(`_shared/sprites/warmap/fx-smoke/${smokeIdx}.png`)}
              style={{ width: 90, height: 90, objectFit: "contain", opacity: smokeFadeIn * 0.85 }} />
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

  // impact calé sur "frappent avec un drone" (droneFrappe) — approche démarre 2s avant (allongée depuis
  // 1.2s, session 10 : le drone doit traverser l'écran assez lentement pour être vu, pas juste traversé).
  const approachAt = F4.droneFrappe - 60;
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

// géo des 2 puissances "nouvelles" au beat 6 (EAU, Turquie — Russie/Égypte déjà définies plus haut)
const DUBAI: [number, number] = [55.27, 25.2];
// décalé au nord du vrai Ankara (35.5, 39.93 -> 35, 40.5) — le point réel est trop proche du bord sud du
// pays, son label ArrivalLabel se faisait recouvrir par le drapeau turc qui se colorie juste en dessous.
const ANKARA: [number, number] = [35, 40.8];

// ⭐ v2 (session 10, 2026-07-12, retour Kimi via Aziz) : SÉQUENÇAGE TEMPOREL remplace les 4 panneaux fixes
// (~40% d'écran occupé en permanence, la carte devenait un fond décoratif). La voix ne nomme les 4
// puissances qu'UNE FOIS ("quatre puissances étrangères", pas une par une) — le séquençage est donc un
// choix de MONTAGE PUR après ce mot-déclencheur, pas une synchro vocale phrase par phrase. Chaque
// puissance apparaît l'une après l'autre (flux qui se trace + label), puis convergence finale où les 4
// flux "respirent" en phase (pression coordonnée, cf note Kimi "pas un chaos").
type PowerFlow = { key: string; waypoints: [number, number][]; color: string; label: string; fact: string };
const POWER_FLOWS: PowerFlow[] = [
  { key: "ru", waypoints: [MOSCOW, KHARTOUM], color: RUSSIA_RED, label: "Russie", fact: "Base navale en négociation" },
  { key: "ae", waypoints: [DUBAI, [47, 25.5], [38, 24.5], DARFUR], color: ATLAS.gold, label: "Émirats", fact: "Or et drones vers les RSF" },
  { key: "tr", waypoints: [ANKARA, [33, 32], [32.7, 24], KHARTOUM], color: ATLAS.saf, label: "Turquie", fact: "Drones Bayraktar vers le SAF" },
  { key: "eg", waypoints: [CAIRO, KHARTOUM], color: "#C9973A", label: "Égypte", fact: "Renseignement, profondeur stratégique" },
];
const FLOW_STAGGER = 26; // ~0.87s entre chaque puissance — assez pour lire, pas assez pour traîner
const FLOW_DRAW = 22; // durée du tracé lui-même

const Section5: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  const flowStartAt = (i: number) => F5.quatrePuissances + i * FLOW_STAGGER;
  const convergeAt = flowStartAt(POWER_FLOWS.length - 1) + FLOW_DRAW + 20; // après la dernière puissance

  // convergence finale : les 4 flux "respirent" ensemble en phase (sinus commun), pas un chaos
  const breathPhase = (Math.sin((frame - convergeAt) * 0.08) + 1) / 2; // 0..1
  const convergeT = interpolate(frame, [convergeAt, convergeAt + 20], [0, 1], clamp);

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
              {POWER_FLOWS.map((f, i) => {
                const startAt = flowStartAt(i);
                if (frame < startAt) return null;
                const drawProgress = interpolate(frame, [startAt, startAt + FLOW_DRAW], [0, 1], clamp);
                // avant convergence : chaque flux à opacité pleine dès qu'il apparaît. Après convergence :
                // les 4 respirent ensemble (même fonction sinus) pour figurer la pression coordonnée.
                const baseOp = interpolate(frame, [startAt, startAt + 14], [0, 0.55], clamp);
                const op = frame >= convergeAt ? 0.4 + breathPhase * 0.3 : baseOp;
                const startPt = proj(f.waypoints[0]);
                return (
                  <React.Fragment key={f.key}>
                    <GeoFlowConnection map={fakeMap} waypoints={f.waypoints} progress={drawProgress} markerProgress={drawProgress}
                      lineColor={f.color} lineOpacity={op} hideMarker persistAfterArrival persistOpacity={op} dashOffsetFrame={frame} />
                    {startPt && (
                      <ArrivalLabel pos={startPt} frame={frame} appear={startAt} label={f.label} color={f.color} />
                    )}
                  </React.Fragment>
                );
              })}

              {/* halo central de convergence — le moment fort désigné par Kimi, où le système global se lit.
                  ⭐ v2 (renforcé, diagnostic frame réelle) : anneau simple trop discret (stroke 2px), passé
                  à 3 anneaux échelonnés + flash net au pic d'entrée pour que le moment soit VRAIMENT visible. */}
              {convergeT > 0.01 && (() => {
                const centerPt = proj([32, 20]);
                if (!centerPt) return null;
                const entryFlash = interpolate(frame, [convergeAt, convergeAt + 6, convergeAt + 26], [0, 1, 0], clamp);
                return (
                  <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
                    {[0, 0.33, 0.66].map((offset) => {
                      const t = (breathPhase + offset) % 1;
                      const r = 30 + t * 90;
                      const op = (1 - t) * convergeT * 0.55;
                      return <circle key={offset} cx={centerPt.x} cy={centerPt.y} r={r} fill="none" stroke={ATLAS.gold} strokeWidth={3} opacity={op} />;
                    })}
                    {entryFlash > 0.01 && (
                      <circle cx={centerPt.x} cy={centerPt.y} r={70} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={entryFlash * 0.7} />
                    )}
                  </svg>
                );
              })()}

              {(() => { const p = proj(DARFUR); return p && <SoudanToken pos={p} faction="rsf" frame={frame} appear={0} />; })()}
              {(() => { const p = proj(KHARTOUM); return p && <SoudanToken pos={p} faction="saf" frame={frame} appear={0} />; })()}

              <CountryColorLayer mapRef={mapRef} flags={ALL_COUNTRY_FLAGS} absoluteFrame={sectionOffset + frame} />
            </>
          );
        }}
      </SoudanWarMapEngine>

      {/* géoplaque factuelle séquentielle — 1 fait à la fois, synchronisée avec l'apparition de chaque
          flux (remplace les 4 panneaux fixes qui occupaient ~40% de l'écran en permanence) */}
      {POWER_FLOWS.map((f, i) => {
        const startAt = flowStartAt(i);
        const nextAt = i < POWER_FLOWS.length - 1 ? flowStartAt(i + 1) : convergeAt;
        return <SinglePowerFact key={f.key} frame={frame} appear={startAt + 8} fadeAt={nextAt} label={f.label} fact={f.fact} color={f.color} />;
      })}
    </AbsoluteFill>
  );
};

const SinglePowerFact: React.FC<{ frame: number; appear: number; fadeAt: number; label: string; fact: string; color: string }> =
  ({ frame, appear, fadeAt, label, fact, color }) => {
  const op = interpolate(frame, [appear, appear + 14, fadeAt, fadeAt + 14], [0, 1, 1, 0], clamp);
  if (op <= 0.01) return null;
  return (
    <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, textAlign: "center", opacity: op, pointerEvents: "none" }}>
      <div style={{ display: "inline-block", padding: "10px 22px", background: "rgba(20,14,7,0.55)", borderRadius: 6, borderLeft: `4px solid ${color}` }}>
        <span style={{ color: ATLAS.gold, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 20,
          letterSpacing: "0.02em", textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
          {label} — {fact}
        </span>
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

// WarmVignette retiré (session 10, 2026-07-12) — le halo lumineux central ("lampe de bureau") devenait
// un effet massif et distrayant sur les cadrages serrés (whip pan Moscou), disproportionné par rapport
// au reste de l'acte où il passait inaperçu sur des cadrages plus larges. Retiré sur les 5 sections.

export default SoudanActe4;
