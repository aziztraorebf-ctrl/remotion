/**
 * SoudanActe5 — ACTE 5 "LE RÉSEAU QUI ARME DANS L'OMBRE" (~80.1s @30fps = 2400 frames).
 *
 * 100% CARTE (0 sortie de carte sur les 5 beats — verdict convergent de 2 exercices
 * creative-director-dual, cf script § MISE EN SCÈNE ACTÉE). Chaîne causale : Émirats financent →
 * relais Libye/Haftar → guerre Darfour/El-Fasher.
 *
 * Réutilise tel quel le stack Acte 3/4 : SoudanWarMapEngine, GeoFlowConnection, SoudanToken,
 * ArrivalLabel, CountryColorLayer/useClipFlags, CountryParchmentMask (générique, réutilisé pour la
 * Libye — geojson `_shared/geo-data/sahel/libya-outline.geojson`, récupéré du pilier Sahel).
 *
 * ⛔ POINT TECHNIQUE NON-NÉGOCIABLE (2 agents convergents) : le trait corridor Kufra→El-Fasher est
 * UNE SEULE trajectoire GeoFlowConnection (waypoints fixes KUFRA→EL_FASHER), dont le `progress` est
 * piloté par le TEMPS ABSOLU de narration — s'arrête en suspens à ~55% en fin de Beat 3, reprend et
 * termine à 100% en Beat 4. PAS deux tracés indépendants (cf doctrine CONTINUITE-SCENE-INTENTION-
 * DABORD.md § "Élément visuel qui traverse une frontière de scène").
 *
 * Densité objets (verdict 4 agents creative-director, cf script) : Beat1/5 épurés (le vide EST le
 * sens) ; Beat2 = MAX 1 seul jeton camp (jamais plusieurs identiques — se lirait comme un compte
 * implicite, violerait la contrainte factuelle "pas de nombre de camps") ; Beat3 = 3 micro-objets
 * synchronisés mot-à-mot (armes/carburant/combattants), apparition→effacement ; Beat4 = sans objet
 * neuf (le trait qui se boucle + glow suffisent, "Résumons" = ZÉRO texte à l'écran, la voix liste déjà
 * les 3 maillons).
 *
 * Script     : memory/projects/soudan-midform-ACTE5-SCRIPT.md (v6 verrouillé)
 * Timing     : ./soudanActe5Timing.ts (dérivé forced-alignment ElevenLabs v1, 198 mots, loss=0.107)
 * Audio      : public/_shared/audio/soudan/acte5-reseau-ombre-p{1..4}.mp3
 *
 * Coordonnées vérifiées WebSearch 2026-07-17 : Kufra 24.18°N/23.28°E, Benghazi 32.11°N/20.07°E,
 * Abou Dabi 24.45°N/54.37°E. El-Fasher = 25.35/13.63 (déjà dans sudan.warmap.json, réutilisé tel quel).
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
import { SoudanWarMapEngine, CamKey } from "../engine/SoudanWarMapEngine";
import { SoudanToken, Pt } from "../engine/soudanActors";
import { GeoFlowConnection } from "../_shared/GeoFlowConnection";
import { useClipFlags, ClipFlag } from "../../_shared/mapbox/useClipFlags";
import { ATLAS } from "../engine/sudanControlData";
import { PART_OFFSETS, BEAT1, BEAT2, BEAT3, BEAT4, BEAT5, TOTAL_FRAMES } from "./soudanActe5Timing";

export const SOUDAN_A5_FPS = 30;

const S1_FRAMES = PART_OFFSETS.p2;                     // beats 1-2 (audio p1, ~30.65s)
const S2_FRAMES = PART_OFFSETS.p3 - PART_OFFSETS.p2;    // beat 3 (audio p2, ~18.25s)
const S3_FRAMES = PART_OFFSETS.p4 - PART_OFFSETS.p3;    // beat 4 (audio p3, ~17.04s)
const S4_FRAMES = TOTAL_FRAMES - PART_OFFSETS.p4;       // beat 5 (audio p4, ~14.16s)
export const SOUDAN_A5_FRAMES = S1_FRAMES + S2_FRAMES + S3_FRAMES + S4_FRAMES;

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ── ANCRAGES GÉO (vérifiés WebSearch 2026-07-17) ──
const EL_FASHER: [number, number] = [25.35, 13.63];  // déjà dans sudan.warmap.json, réutilisé tel quel
const KUFRA: [number, number] = [23.28, 24.18];
const BENGHAZI: [number, number] = [20.07, 32.11];
const ABU_DHABI: [number, number] = [54.37, 24.45];
const LIBYA_CENTER: [number, number] = [17.5, 26.5]; // point de repos caméra sur le territoire libyen

const GOLD = ATLAS.contested;
const LIBYA_INK = "#8A6A3A"; // teinte de contrôle est-libyen (Haftar/LNA), distincte RSF/SAF/EAU

// ── CountryParchmentMask (générique, repris tel quel du pattern Acte 4) ──
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

function LibyaParchmentMask(props: { proj: (c: [number, number]) => { x: number; y: number } | null; frame: number; openAt: number; closeAt: number }) {
  return <CountryParchmentMask {...props} geoPath="_shared/geo-data/sahel/libya-outline.geojson" maskId="libyaShow" />;
}

// ── ArrivalLabel (repris tel quel du pattern Acte 3/4) ──
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

// ── Tampon "preuve documentaire" — registre unique réutilisé 3x (Beat2 presse, Beat3 ONU, Beat5 rappel ONU) ──
const DocumentStamp: React.FC<{ frame: number; appear: number; fadeAt?: number; lines: string[] }> =
  ({ frame, appear, fadeAt, lines }) => {
    const fadeIn = 16;
    const op = fadeAt
      ? interpolate(frame, [appear, appear + fadeIn, fadeAt, fadeAt + 20], [0, 0.92, 0.92, 0], clamp)
      : interpolate(frame, [appear, appear + fadeIn], [0, 0.92], clamp);
    if (op <= 0.01) return null;
    return (
      <div style={{
        position: "absolute", top: 64, right: 64, opacity: op, pointerEvents: "none",
        padding: "10px 18px", background: "rgba(20,14,7,0.6)", borderRadius: 4,
        border: `1.4px solid ${GOLD}`, maxWidth: 380,
      }}>
        {lines.map((l, i) => (
          <div key={i} style={{
            fontFamily: "Georgia, serif", fontSize: i === 0 ? 15 : 13, fontWeight: i === 0 ? 700 : 400,
            color: "#F2E5C8", letterSpacing: 0.3, lineHeight: 1.4,
            textTransform: i === 0 ? "uppercase" : "none",
          }}>{l}</div>
        ))}
      </div>
    );
  };

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT RACINE
// ─────────────────────────────────────────────────────────────────────────────
export const SoudanActe5: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence from={0} durationInFrames={S1_FRAMES} name="beats1-2-golfe-libye">
      <Section1 sectionOffset={0} />
    </Sequence>
    <Sequence from={S1_FRAMES} durationInFrames={S2_FRAMES} name="beat3-haftar-corridor">
      <Section2 sectionOffset={S1_FRAMES} />
    </Sequence>
    <Sequence from={S1_FRAMES + S2_FRAMES} durationInFrames={S3_FRAMES} name="beat4-elfasher-boucle">
      <Section3 sectionOffset={S1_FRAMES + S2_FRAMES} />
    </Sequence>
    <Sequence from={S1_FRAMES + S2_FRAMES + S3_FRAMES} durationInFrames={S4_FRAMES} name="beat5-cloture">
      <Section4 sectionOffset={S1_FRAMES + S2_FRAMES + S3_FRAMES} />
    </Sequence>
  </AbsoluteFill>
);

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 1 — BEAT 1 (pont, dézoom Soudan→Libye) + BEAT 2 (Émirats/enquête/camp) [partie 1]
// ═════════════════════════════════════════════════════════════════════════════
const F1 = {
  start: 0,
  resteImpasse: BEAT1.resteImpasse - PART_OFFSETS.p1,
  circuitExterieur: BEAT1.circuitExterieur - PART_OFFSETS.p1,
  golfeFinance: BEAT1.golfeFinance - PART_OFFSETS.p1,
  installeLibye: BEAT1.installeLibye - PART_OFFSETS.p1,
  b1end: BEAT1.end - PART_OFFSETS.p1,
  b2start: BEAT2.start - PART_OFFSETS.p1,
  emiratsNommes: BEAT2.emiratsNommes - PART_OFFSETS.p1,
  dateEnquete: BEAT2.dateEnquete - PART_OFFSETS.p1,
  sourcesNommees: BEAT2.sourcesNommees - PART_OFFSETS.p1,
  campsEntrainement: BEAT2.campsEntrainement - PART_OFFSETS.p1,
  end: S1_FRAMES,
};

const CAM1_ZOOM_REST = 4.4;   // zoom de repos Soudan (cohérent Acte 4 CAM1_ZOOM_REST)
// ⚠️ R-V5 (sous-dimensionnement récurrent) : 1er essai à 4.6 laissait la Libye noyée dans un cadrage
// panoramique Méditerranée (territoire visible mais PAS isolé comme sujet). Resserré à 5.6 pour que
// la Libye remplisse le cadre comme le fait le Soudan au zoom de repos — cohérent avec le principe
// "territoire actif = la toile", pas juste "visible quelque part dans le cadre".
const CAM1_ZOOM_LIBYA = 5.6;
const WHIP_DUR = 60;          // règle 60f whip pan (DOCTRINE-SOUVERAIN.md)

function whipPan(a: CamKey, b: CamKey, frame: number, from: number, dur: number): CamKey {
  const t = interpolate(frame, [from, from + dur], [0, 1], clamp);
  const te = t * t * (3 - 2 * t); // smoothstep
  const zoomDip = Math.sin(t * Math.PI) * 1.0; // survol : dézoome au milieu du pan
  return {
    f: frame,
    lon: a.lon + (b.lon - a.lon) * te,
    lat: a.lat + (b.lat - a.lat) * te,
    zoom: a.zoom + (b.zoom - a.zoom) * te - zoomDip,
  };
}

// point milieu Libye/Abou Dabi — cadrage large qui montre les deux ensemble (36.9° d'écart, Abou Dabi
// hors-cadre à zoom 5.6 resserré sur la Libye seule — corrigé après vérification par render réel).
const LIBYA_UAE_MID: [number, number] = [35.9, 25.5];
const CAM1_ZOOM_WIDE = 3.4; // Libye + péninsule arabique visibles ensemble

function cam1At(frame: number, f1: typeof F1): CamKey {
  const restSoudan: CamKey = { f: frame, lon: 30, lat: 15.4, zoom: CAM1_ZOOM_REST };
  const onLibya: CamKey = { f: frame, lon: LIBYA_CENTER[0], lat: LIBYA_CENTER[1], zoom: CAM1_ZOOM_LIBYA };
  const onWide: CamKey = { f: frame, lon: LIBYA_UAE_MID[0], lat: LIBYA_UAE_MID[1], zoom: CAM1_ZOOM_WIDE };

  // Phase 0 — repos sur le Soudan (hérité Acte 4) avant "l'impasse"
  if (frame < f1.resteImpasse) return restSoudan;

  // Phase 1 — dézoom/pivot Soudan → Libye (whip pan 60f), territoire libyen entre en cadre
  const whipEnd = f1.resteImpasse + WHIP_DUR;
  if (frame < whipEnd) return whipPan(restSoudan, onLibya, frame, f1.resteImpasse, WHIP_DUR);

  // Phase 2 — stabilisée sur la Libye jusqu'à "Émirats" nommés
  if (frame < f1.emiratsNommes) return onLibya;

  // Phase 3 — dézoom bref vers un cadrage large Libye+Péninsule arabique (montre Abou Dabi, la
  // relation géo financement→relais) le temps du Beat 2, resserre à nouveau juste avant le Beat 3.
  const wideStart = f1.emiratsNommes;
  const wideEnd = f1.campsEntrainement + 40;
  if (frame < wideStart + 30) return whipPan(onLibya, onWide, frame, wideStart, 30);
  if (frame < wideEnd) return onWide;
  return whipPan(onWide, onLibya, frame, wideEnd, 30);
}

const Section1: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const camKeys1 = React.useCallback((f: number) => cam1At(f, F1), []);

  const whipEnd = F1.resteImpasse + WHIP_DUR;

  const flags: ClipFlag[] = [
    { iso: "ae", geoNames: ["United Arab Emirates"], flagFile: "ae.png", at: sectionOffset + F1.emiratsNommes, bgColor: "#00732F" },
  ];
  const { paths } = useClipFlags(mapRef, flags, sectionOffset + frame);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte5-reseau-ombre-p1.mp3")} />

      <Sequence from={F1.resteImpasse} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.45} /></Sequence>
      <Sequence from={F1.emiratsNommes} durationInFrames={20}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.4} /></Sequence>

      <SoudanWarMapEngine camKeys={camKeys1} showNationalBorder stateLineOpacity={0}>
        {(proj, ref) => {
          mapRef.current = ref?.current ?? null;

          return (
            <>
              {/* Beat 1-2 : territoire libyen passe neutre → actif, RESTE ouvert jusqu'à la fin de la
                  section (continuité vers Section2/Beat3, même territoire — pas de fermeture ici, le
                  masque Libye rouvre dès le début de Section2 pour prolonger l'état, cf note jonction). */}
              <LibyaParchmentMask proj={proj} frame={frame} openAt={F1.installeLibye} closeAt={F1.end + 999} />

              {/* Beat 2 : point Abou Dabi qui s'allume à distance (origine du financement) */}
              {frame >= F1.emiratsNommes && (() => {
                const p = proj(ABU_DHABI);
                return p && <ArrivalLabel pos={p} frame={frame} appear={F1.emiratsNommes} label="Abou Dabi" color="#00732F" />;
              })()}

              {/* jeton camp UNIQUE (max 1, jamais plusieurs identiques — cf contrainte factuelle) */}
              {frame >= F1.campsEntrainement && (() => {
                const p = proj([LIBYA_CENTER[0] + 1.2, LIBYA_CENTER[1] - 1.4]);
                return p && <SoudanToken pos={p} faction="civil" frame={frame} appear={F1.campsEntrainement} />;
              })()}

              {/* médaillon presse discret — Beat 2 (Lighthouse Reports / Der Spiegel) */}
              <DocumentStamp frame={frame} appear={F1.sourcesNommees} fadeAt={F1.end - 10}
                lines={["29 juin 2026", "Lighthouse Reports · Der Spiegel"]} />

              {/* drapeau EAU sur Abou Dabi (petit, ancré au point — pas un aplat territorial massif) */}
              {paths.ae && frame >= F1.emiratsNommes && (() => {
                const p = proj(ABU_DHABI);
                if (!p) return null;
                const opFlag = interpolate(frame, [F1.emiratsNommes, F1.emiratsNommes + 20], [0, 0.85], clamp);
                return (
                  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <circle cx={p.x} cy={p.y} r={22} fill="#00732F" opacity={opFlag * 0.3} />
                  </svg>
                );
              })()}
            </>
          );
        }}
      </SoudanWarMapEngine>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 2 — BEAT 3 (Haftar/corridor, armes-carburant-combattants) [partie 2]
// ═════════════════════════════════════════════════════════════════════════════
const F2 = {
  start: 0,
  haftarNomme: BEAT3.haftarNomme - PART_OFFSETS.p2,
  rapportOnu: BEAT3.rapportOnu - PART_OFFSETS.p2,
  dateRapport: BEAT3.dateRapport - PART_OFFSETS.p2,
  corridor: BEAT3.corridor - PART_OFFSETS.p2,
  armes: BEAT3.armes - PART_OFFSETS.p2,
  carburant: BEAT3.carburant - PART_OFFSETS.p2,
  combattants: BEAT3.combattants - PART_OFFSETS.p2,
  end: S2_FRAMES,
};

// trait corridor Kufra→El-Fasher : s'arrête EN SUSPENS à ~55% en fin de Beat 3 (repris intégralement
// en Beat4 avec les MÊMES waypoints — cf note en tête de fichier, point non-négociable).
const CORRIDOR_WAYPOINTS: [number, number][] = [KUFRA, [24.5, 19.5], EL_FASHER];
const CORRIDOR_SUSPEND_T = 0.55;

// hérité de la fin Section1 (cadrage large Libye — cf CAM1_ZOOM_LIBYA) : Section2 REPREND ce cadrage
// et resserre progressivement vers Benghazi, plutôt que de sauter directement en vue resserrée
// (bug de jonction trouvé par render réel — coupure sèche + masque parchemin qui clignotait kaki→crème).
const CAM2_START: CamKey = { f: 0, lon: LIBYA_CENTER[0], lat: LIBYA_CENTER[1], zoom: CAM1_ZOOM_LIBYA };
const CAM2_RESSERRE = 40; // frames de transition douce en ouverture de section

const Section2: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const camKeys2 = React.useCallback((f: number): CamKey => {
    const onBenghazi: CamKey = { f, lon: BENGHAZI[0] - 1, lat: BENGHAZI[1] - 4, zoom: 4.9 };
    if (f >= CAM2_RESSERRE) return onBenghazi;
    const t = interpolate(f, [0, CAM2_RESSERRE], [0, 1], clamp);
    const te = t * t * (3 - 2 * t);
    return {
      f, lon: CAM2_START.lon + (onBenghazi.lon - CAM2_START.lon) * te,
      lat: CAM2_START.lat + (onBenghazi.lat - CAM2_START.lat) * te,
      zoom: CAM2_START.zoom + (onBenghazi.zoom - CAM2_START.zoom) * te,
    };
  }, []);

  const corridorProgress = interpolate(frame, [F2.corridor, F2.end - 20], [0, CORRIDOR_SUSPEND_T], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte5-reseau-ombre-p2.mp3")} />

      <Sequence from={F2.armes} durationInFrames={16}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.4} /></Sequence>
      <Sequence from={F2.carburant} durationInFrames={16}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.4} /></Sequence>
      <Sequence from={F2.combattants} durationInFrames={16}><Audio src={staticFile("_shared/sfx/ui/node-appear.mp3")} volume={0.4} /></Sequence>

      <SoudanWarMapEngine camKeys={camKeys2} showNationalBorder stateLineOpacity={0}>
        {(proj, ref) => {
          mapRef.current = ref?.current ?? null;
          const fakeMap = { project: (c: [number, number]) => proj(c) ?? { x: 0, y: 0 } } as any;

          return (
            <>
              {/* territoire libyen déjà crème depuis Section1 — ouvert dès frame 0, PAS de fade-in
                  (continuité, prolonge l'état hérité au lieu de re-déclencher une apparition) */}
              <LibyaParchmentMask proj={proj} frame={frame} openAt={-10} closeAt={F2.end + 999} />

              {/* teinte de contrôle est-libyen (zone Benghazi/Kufra, Haftar/LNA) */}
              {frame >= F2.haftarNomme && (() => {
                const p = proj(BENGHAZI);
                if (!p) return null;
                const op = interpolate(frame, [F2.haftarNomme, F2.haftarNomme + 24], [0, 0.32], clamp);
                return (
                  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <circle cx={p.x} cy={p.y} r={220} fill={LIBYA_INK} opacity={op}
                      style={{ filter: "blur(30px)" }} />
                  </svg>
                );
              })()}

              {frame >= F2.haftarNomme && (() => {
                const p = proj(BENGHAZI);
                return p && <ArrivalLabel pos={p} frame={frame} appear={F2.haftarNomme} label="Benghazi" color={LIBYA_INK} />;
              })()}

              {/* trait corridor Kufra→El-Fasher — COMMENCE à se tracer, s'arrête en suspens à 55% */}
              {frame >= F2.corridor && (
                <GeoFlowConnection map={fakeMap} waypoints={CORRIDOR_WAYPOINTS} progress={corridorProgress}
                  markerProgress={corridorProgress} lineColor={LIBYA_INK} lineOpacity={0.75} lineWidth={3.2}
                  hideMarker dashOffsetFrame={frame} persistAfterArrival persistOpacity={0.75} />
              )}

              {/* 3 micro-objets synchronisés mot-à-mot : armes / carburant / combattants (apparition→effacement) */}
              <CorridorObject proj={proj} frame={frame} appear={F2.armes} fadeAt={F2.armes + 40} pos={[23.6, 21.5]} kind="tank" />
              <CorridorObject proj={proj} frame={frame} appear={F2.carburant} fadeAt={F2.carburant + 40} pos={[24.0, 20.2]} kind="cargo" />
              <CorridorObject proj={proj} frame={frame} appear={F2.combattants} fadeAt={F2.combattants + 40} pos={[24.4, 18.9]} kind="portrait" />

              {/* tampon ONU discret — même registre que Beat 2 presse */}
              <DocumentStamp frame={frame} appear={F2.rapportOnu} fadeAt={F2.end - 10}
                lines={["Rapport ONU", "Avril 2026 — Panel of Experts on Libya"]} />
            </>
          );
        }}
      </SoudanWarMapEngine>
    </AbsoluteFill>
  );
};

// objet ponctuel synchronisé mot-à-mot (apparaît puis s'efface, pas un jeton permanent).
// kind="portrait" -> SoudanToken (visage RSF, cohérent registre jetons-visages du projet).
// kind="tank"/"cargo" -> petit sprite iso simple (pas de composant SoudanBase, taille trop réduite ici).
const CorridorObject: React.FC<{
  proj: (c: [number, number]) => { x: number; y: number } | null;
  frame: number; appear: number; fadeAt: number; pos: [number, number]; kind: "tank" | "cargo" | "portrait";
}> = ({ proj, frame, appear, fadeAt, pos, kind }) => {
  if (frame < appear) return null;
  const op = interpolate(frame, [appear, appear + 10, fadeAt, fadeAt + 16], [0, 1, 1, 0], clamp);
  if (op <= 0.01) return null;
  const p = proj(pos);
  if (!p) return null;

  if (kind === "portrait") {
    return <div style={{ opacity: op }}><SoudanToken pos={p} faction="rsf" frame={frame} appear={appear} /></div>;
  }
  const sprite = kind === "tank" ? "tech-td-red" : "wagon-cargo-rouge";
  return (
    <div style={{ position: "absolute", left: p.x, top: p.y, transform: "translate(-50%,-50%)", opacity: op, pointerEvents: "none" }}>
      <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
        style={{ width: 46, height: 46 * (768 / 1408), objectFit: "contain",
          filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.5))" }} />
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 3 — BEAT 4 (El-Fasher, la chaîne se boucle) [partie 3]
// ═════════════════════════════════════════════════════════════════════════════
const F3 = {
  start: 0,
  elFasherNomme: BEAT4.elFasherNomme - PART_OFFSETS.p3,
  siegeVille: BEAT4.siegeVille - PART_OFFSETS.p3,
  combattantsRepere: BEAT4.combattantsRepere - PART_OFFSETS.p3,
  resumons: BEAT4.resumons - PART_OFFSETS.p3,
  end: S3_FRAMES,
};

const Section3: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const camKeys3 = React.useCallback((f: number): CamKey => {
    // caméra suiveuse : reprend le trajet Kufra→El-Fasher (cameraFollowsPath-like manuel, resserré)
    const t = interpolate(f, [0, F3.combattantsRepere], [CORRIDOR_SUSPEND_T, 1], clamp);
    const totalSegments = CORRIDOR_WAYPOINTS.length - 1;
    const targetIdx = Math.max(0, Math.min(1, t)) * totalSegments;
    const floorIdx = Math.min(totalSegments - 1, Math.floor(targetIdx));
    const frac = targetIdx - floorIdx;
    const a = CORRIDOR_WAYPOINTS[floorIdx];
    const b = CORRIDOR_WAYPOINTS[floorIdx + 1] ?? a;
    return { f, lon: a[0] + (b[0] - a[0]) * frac, lat: a[1] + (b[1] - a[1]) * frac, zoom: 5.0 };
  }, []);

  // le MÊME trait, MÊMES waypoints, reprend à 55% et termine à 100%
  const corridorProgress = interpolate(frame, [0, F3.combattantsRepere], [CORRIDOR_SUSPEND_T, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte5-reseau-ombre-p3.mp3")} />

      <Sequence from={F3.combattantsRepere} durationInFrames={22}><Audio src={staticFile("_shared/sfx/impact/tension-pulse.mp3")} volume={0.5} /></Sequence>

      <SoudanWarMapEngine camKeys={camKeys3} showNationalBorder stateLineOpacity={0}>
        {(proj, ref) => {
          mapRef.current = ref?.current ?? null;
          const fakeMap = { project: (c: [number, number]) => proj(c) ?? { x: 0, y: 0 } } as any;

          const p1Progress = interpolate(frame, [0, F3.combattantsRepere], [CORRIDOR_SUSPEND_T, 1], clamp);
          const resumonsGlow = interpolate(frame, [F3.resumons, F3.resumons + 30], [0, 1], clamp);

          return (
            <>
              {/* le trait REPREND depuis 55% (fin Beat3) et termine à 100% — 1 seule trajectoire continue */}
              <GeoFlowConnection map={fakeMap} waypoints={CORRIDOR_WAYPOINTS} progress={p1Progress}
                markerProgress={p1Progress} lineColor={LIBYA_INK} lineOpacity={0.75} lineWidth={3.2}
                hideMarker dashOffsetFrame={sectionOffset + frame} persistAfterArrival persistOpacity={0.7} />

              {frame >= F3.elFasherNomme && (() => {
                const p = proj(EL_FASHER);
                return p && <ArrivalLabel pos={p} frame={frame} appear={F3.elFasherNomme} label="El-Fasher" color={ATLAS.rsf} />;
              })()}

              {/* impact discret à l'arrivée (ressaut, pas un nouveau marqueur voyant) */}
              {frame >= F3.combattantsRepere && (() => {
                const p = proj(EL_FASHER);
                if (!p) return null;
                const pulse = interpolate(frame, [F3.combattantsRepere, F3.combattantsRepere + 20, F3.combattantsRepere + 40], [0, 1, 0.4], clamp);
                return (
                  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <circle cx={p.x} cy={p.y} r={10 + pulse * 14} fill="none" stroke={ATLAS.rsf} strokeWidth={2.4} opacity={pulse} />
                  </svg>
                );
              })()}

              {/* "Résumons" — ZÉRO texte, glow synchronisé sur les 3 points déjà posés (Abou Dabi/Kufra/El-Fasher) */}
              {resumonsGlow > 0.01 && [ABU_DHABI, KUFRA, EL_FASHER].map((pt, i) => {
                const p = proj(pt as [number, number]);
                if (!p) return null;
                const delay = i * 8;
                const localGlow = interpolate(frame, [F3.resumons + delay, F3.resumons + delay + 24, F3.resumons + delay + 60], [0, 1, 0.3], clamp);
                return (
                  <svg key={i} width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <circle cx={p.x} cy={p.y} r={18} fill={GOLD} opacity={localGlow * 0.4} style={{ filter: "blur(8px)" }} />
                  </svg>
                );
              })}
            </>
          );
        }}
      </SoudanWarMapEngine>
    </AbsoluteFill>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 4 — BEAT 5 (clôture, "documenté... et pourtant", pont Acte 6) [partie 4]
// ═════════════════════════════════════════════════════════════════════════════
const F4 = {
  start: 0,
  documente: BEAT5.documente - PART_OFFSETS.p4,
  etPourtant: BEAT5.etPourtant - PART_OFFSETS.p4,
  continueFonctionner: BEAT5.continueFonctionner - PART_OFFSETS.p4,
  institutions: BEAT5.institutions - PART_OFFSETS.p4,
  end: S4_FRAMES,
};

const Section4: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const camKeys4 = React.useCallback((): CamKey => ({ f: 0, lon: EL_FASHER[0] - 2, lat: EL_FASHER[1] + 6, zoom: 4.4 }), []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile("_shared/audio/soudan/acte5-reseau-ombre-p4.mp3")} />

      <SoudanWarMapEngine camKeys={camKeys4} showNationalBorder stateLineOpacity={0}>
        {(proj, ref) => {
          mapRef.current = ref?.current ?? null;
          const fakeMap = { project: (c: [number, number]) => proj(c) ?? { x: 0, y: 0 } } as any;

          // trait/points figés, désormais silencieux (echo de "documenté")
          const staticOpacity = 0.55;
          // contraste : SEUL El-Fasher continue de pulser (le "et pourtant" visuel)
          const soleGlow = frame >= F4.etPourtant
            ? 0.4 + 0.25 * Math.sin((frame - F4.etPourtant) * 0.08)
            : 0.3;
          // assombrissement périphérique à "institutions" (pont Acte 6)
          const vignette = interpolate(frame, [F4.institutions, F4.end], [0, 0.35], clamp);

          return (
            <>
              <GeoFlowConnection map={fakeMap} waypoints={CORRIDOR_WAYPOINTS} progress={1}
                markerProgress={1} lineColor={LIBYA_INK} lineOpacity={staticOpacity} lineWidth={3.2}
                hideMarker persistAfterArrival persistOpacity={staticOpacity} />

              {[ABU_DHABI, KUFRA].map((pt, i) => {
                const p = proj(pt as [number, number]);
                if (!p) return null;
                return (
                  <svg key={i} width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <circle cx={p.x} cy={p.y} r={9} fill={GOLD} opacity={staticOpacity * 0.7} />
                  </svg>
                );
              })}

              {/* El-Fasher SEUL continue de pulser — contraste figé/vivant */}
              {(() => {
                const p = proj(EL_FASHER);
                if (!p) return null;
                return (
                  <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <circle cx={p.x} cy={p.y} r={16} fill={ATLAS.rsf} opacity={soleGlow} style={{ filter: "blur(6px)" }} />
                    <circle cx={p.x} cy={p.y} r={7} fill={ATLAS.rsf} opacity={0.9} />
                  </svg>
                );
              })()}

              {/* vignette d'assombrissement périphérique (pont Acte 6, sans changer de monde) */}
              {vignette > 0.01 && (
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: `radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,${vignette}) 100%)`,
                }} />
              )}
            </>
          );
        }}
      </SoudanWarMapEngine>
    </AbsoluteFill>
  );
};

export default SoudanActe5;
