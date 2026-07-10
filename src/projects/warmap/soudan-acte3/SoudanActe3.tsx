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
import { SoudanWarMapEngine, CamKey, ZoneControl, camAt, cameraFollowsPath } from "../engine/SoudanWarMapEngine";
import { SoudanToken, SoudanBase, Pt } from "../engine/soudanActors";
import { GeoFlowConnection } from "../_shared/GeoFlowConnection";
import { useClipFlags, ClipFlag } from "../../_shared/mapbox/useClipFlags";
import { ATLAS } from "../engine/sudanControlData";
import { PART_OFFSETS } from "./soudanActe3Timing";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";

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
// Repositionnées (retour Aziz v5 : les 3 points étaient quasi alignés en diagonale parfaite, lisait
// comme un patron géométrique artificiel plutôt que 3 mines dispersées) — vraie dispersion Darfour.
const MINE_2: [number, number] = [21.9, 12.4];
const MINE_3: [number, number] = [23.4, 15.5];
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

// Retour Aziz (2026-07-10, v5) : 0-20s quasi figé, seulement 2 clés espacées → caméra qui bouge à peine
// avant les mines. Dérive CONTINUE (Ken Burns lent) sur toute la fenêtre d'attente, jamais 2 positions
// figées avec un saut — occupe le silence visuel sans rien ajouter de narrativement prématuré.
// ⭐⭐ Retour Aziz v7 (croisement Gemini+Kimi, convergence forte) : le zoom 4.2 de départ restait une
// vue "presque tout le Soudan" — pas un vrai close-up. Les 2 modèles indépendamment : "commence direct
// sur les 2 portraits en vue SERRÉE, pas de dézoom". Zoom resserré ~5.3 dès frame 0 (cohérent zoom mines
// 5.8), centré sur le point médian RSF/SAF. Transition Darfour (F1.darfourStart) MARQUÉE, pas un fondu mou.
const A1_CENTER_LON = (DARFUR[0] + KHARTOUM[0]) / 2;
const A1_CENTER_LAT = (DARFUR[1] + KHARTOUM[1]) / 2;
const CAM1: CamKey[] = [
  { f: F1.start, lon: A1_CENTER_LON, lat: A1_CENTER_LAT, zoom: 5.3 },       // serré sur les 2 portraits dès l'ouverture
  { f: F1.pourtant, lon: A1_CENTER_LON - 0.3, lat: A1_CENTER_LAT + 0.1, zoom: 5.2 }, // dérive lente continue
  { f: F1.quelquUnPaie, lon: A1_CENTER_LON - 0.7, lat: A1_CENTER_LAT, zoom: 5.15 },
  { f: F1.suivreArgent, lon: A1_CENTER_LON - 1.0, lat: A1_CENTER_LAT - 0.1, zoom: 5.2 },
  { f: F1.darfourStart, lon: 24, lat: 13.5, zoom: 5.8 },       // transition MARQUÉE vers Darfour, pas un fondu mou
  { f: F1.minesOr, lon: 24, lat: 13.5, zoom: 5.8 },
  { f: F1.end, lon: 24, lat: 13.5, zoom: 5.75 },
];

const Section1: React.FC<{ sectionOffset: number }> = ({ sectionOffset }) => {
  const frame = useCurrentFrame();
  const mapRef = React.useRef<mapboxgl.Map | null>(null);

  // halo Jebel Amer : monte au beat 2bis, sature au mot "milliard"
  const jebelAmerHalo = interpolate(frame, [F1.plusImportante, F1.plusImportante + 60], [0, 0.55], clamp);
  const jebelAmerSature = interpolate(frame, [F1.milliard, F1.milliard + 40], [0, 0.35], clamp); // ajoute au-dessus du halo de base
  // ⭐ Retour v7 (Gemini+Kimi) : "le Soudan reste vide 15-18s" — halos doux pulsants sur RSF/SAF DÈS
  // l'ouverture (avant que les mines n'entrent en jeu), montrent que la carte est vivante immédiatement.
  const openingPulse = 0.16 + 0.08 * Math.sin(frame * 0.05);
  const openingFade = interpolate(frame, [F1.darfourStart - 30, F1.darfourStart], [1, 0], clamp);
  const zones: ZoneControl[] = [
    { at: JEBEL_AMER, faction: "rsf", radiusKm: 130, intensity: jebelAmerHalo + jebelAmerSature },
    { at: DARFUR, faction: "rsf", radiusKm: 110, intensity: openingPulse * openingFade },
    { at: KHARTOUM, faction: "saf", radiusKm: 110, intensity: openingPulse * openingFade },
  ];

  // jeton SAF masqué pendant les beats 2/2bis (Darfour/RSF pur) — réapparaît juste avant la fin
  // de section 1 pour préparer le beat 3 (qui reprend les 2 jetons), fade doux pas un pop.
  const safOpacity = interpolate(frame, [F1.minesOr - 20, F1.minesOr, F1.end - 60, F1.end - 20], [1, 0.15, 0.15, 1], clamp);
  // jeton RSF "hérité front" (DARFUR) : s'ESTOMPE au moment où le jeton Hemedti dédié apparaît près de
  // Jebel Amer (retour Aziz v5 : les 2 étaient visibles simultanément = même personnage à 2 endroits,
  // ambigu). Un seul jeton RSF actif à la fois — celui du front cède la place à celui d'Hemedti/sa mine.
  const rsfHeritedOpacity = interpolate(frame, [F1.hemedtiNomme - 20, F1.hemedtiNomme], [1, 0], clamp);

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
                  pendant les beats 2/2bis (Darfour/RSF pur), revient en fin de section (prépare beat 3).
                  RSF hérité s'estompe AUSSI dès que le jeton Hemedti dédié apparaît (jamais 2 jetons RSF
                  identiques actifs simultanément — ambiguïté corrigée, retour Aziz v5). */}
              {rsfPos && <div style={{ opacity: rsfHeritedOpacity }}><SoudanToken pos={rsfPos} faction="rsf" frame={frame} appear={0} /></div>}
              {safPos && <div style={{ opacity: safOpacity }}><SoudanToken pos={safPos} faction="saf" frame={frame} appear={0} /></div>}

              {/* 3 lignes de fuite pointillées (beat 1) — suggèrent l'international SANS sortir du cadre */}
              {frame >= F1.pourtant && frame < F1.darfourStart && (
                <FlightLines proj={proj} frame={frame} appear={F1.pourtant} />
              )}

              {/* BEAT 2 — plusieurs mines dispersées (Darfour, contrôle RSF). Halo doré sous chaque
                  sprite pour se détacher du fond crème (mines trop discrètes en v1, corrigé). */}
              {frame >= F1.minesOr && (
                <>
                  {/* tailles augmentées (retour v7 Gemini+Kimi : "quasi imperceptibles") */}
                  {jebelPos && <MineWithHalo pos={jebelPos} frame={frame} appear={F1.minesOr} size={72} />}
                  {(() => { const p = proj(MINE_2); return p && <MineWithHalo pos={p} frame={frame} appear={F1.minesOr + 7} size={64} fade={0.9} />; })()}
                  {(() => { const p = proj(MINE_3); return p && <MineWithHalo pos={p} frame={frame} appear={F1.minesOr + 14} size={62} fade={0.85} />; })()}
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
/**
 * MineWithHalo v7 — retour Aziz (croisement Gemini+Kimi, convergence forte) : "les mines ressemblent à
 * de petits cercles flous, quasi imperceptibles". 2 fixes : (1) size augmentée à l'appel (58->70 env.),
 * (2) apparition en POP (scale overshoot 0->1.15->1, pas un simple fade) + ONDE DE CHOC (anneau SVG qui
 * s'élargit et s'estompe, frame-driven pur — PAS de glow/blur CSS, headless-safe).
 */
const MineWithHalo: React.FC<{ pos: Pt; frame: number; appear: number; size: number; fade?: number }> =
  ({ pos, frame, appear, size, fade = 1 }) => {
    const op = interpolate(frame, [appear, appear + 16], [0, fade], clamp);
    if (op <= 0.01) return null;
    // pop : scale 0 -> 1.15 -> 1 (overshoot doux, spring-like sans utiliser spring() ici pour rester
    // synchrone avec le halo/onde de choc ci-dessous)
    const popScale = frame < appear + 14
      ? interpolate(frame, [appear, appear + 9, appear + 14], [0, 1.15, 1], clamp)
      : 1;
    // onde de choc : anneau qui part du centre et s'élargit en s'estompant, ~20 frames
    const shockT = interpolate(frame, [appear, appear + 20], [0, 1], clamp);
    const shockR = size * (0.5 + shockT * 1.4);
    const shockOp = (1 - shockT) * 0.5 * fade;
    return (
      <>
        <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
          <circle cx={pos.x} cy={pos.y} r={size * 0.62} fill="#C99A3A" opacity={op * 0.32} />
          <circle cx={pos.x} cy={pos.y} r={size * 0.4} fill="#8A5A1E" opacity={op * 0.28} />
          {shockOp > 0.01 && (
            <circle cx={pos.x} cy={pos.y} r={shockR} fill="none" stroke="#C99A3A" strokeWidth={2.4} opacity={shockOp} />
          )}
        </svg>
        <div style={{ position: "absolute", left: pos.x, top: pos.y, width: 0, height: 0 }}>
          <div style={{ position: "relative", transform: `scale(${popScale})`, transformOrigin: "0 0" }}>
            <SoudanBase pos={{ x: 0, y: 0 }} frame={frame} appear={appear} sprite="mine-or-td" size={size} fade={fade} />
          </div>
        </div>
      </>
    );
  };

// petites lignes de fuite pointillées grises — beat 1, suggèrent l'international sans quitter la carte
const FlightLines: React.FC<{ proj: (c: [number, number]) => Pt | null; frame: number; appear: number }> = ({ frame, appear }) => {
  const op = interpolate(frame, [appear, appear + 20], [0, 0.28], clamp);
  if (op <= 0.01) return null;
  // 3 directions depuis le centre-cadre : NE (Turquie), E (mer Rouge/Golfe), NO (Libye)
  const cx = 960, cy = 540;
  const dirs = [
    { dx: 420, dy: -260 }, // NE
    { dx: 520, dy: 40 },   // E
    { dx: -420, dy: -220 },// NO
  ];
  // marching ants lent (occupe le silence visuel du beat 1, retour Aziz — jamais statique)
  const dashOffset = -(frame * 0.35) % 18;
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      {dirs.map((d, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + d.dx} y2={cy + d.dy}
          stroke="#B8A888" strokeWidth={1.2} strokeDasharray="3 6" strokeDashoffset={dashOffset} opacity={op} />
      ))}
    </svg>
  );
};

/**
 * ImpactPictogram — feedback nommé à CHAQUE arrivée de marqueur (révision v2, Décision 2-3).
 * Pictogramme SVG simple (2-4 paths, style encre), apparaît 2-3s puis DISPARAÎT — jamais de widget
 * permanent (décision Aziz explicite). Formes géométriques à la main, pas d'appel GLM (sur-ingénierie
 * inutile pour un lingot/triangle+2 ailes).
 */
// Formes générées via GLM-5.2 (reasoning_effort=high), registre parchemin/encre Soudan — remplacent les
// formes maison v1 (jugées peu lisibles/pauvres, retour Aziz). Centrées (0,0), rayon ~24, échelle 0.9 à l'usage.
const PICTO_GOLD = (
  <g>
    <polygon points="-14,-8 14,-8 20,10 -20,10" fill={GOLD} stroke="#3A2A18" strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M -10 -3 L 10 -3" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
  </g>
);
const dronePicto = (color: string) => (
  <g>
    <line x1={20} y1={-8} x2={20} y2={8} stroke="#3A2A18" strokeWidth={2} strokeLinecap="round" />
    <path d="M -18,-3 Q -5,-4 5,-2 L 20,0 L 5,2 Q -5,4 -18,3 Z" fill={color} stroke="#3A2A18" strokeWidth={2} strokeLinejoin="round" />
    <path d="M -4,-3 L -18,-16 L -10,-3 Z" fill={color} stroke="#3A2A18" strokeWidth={2} strokeLinejoin="round" />
    <path d="M -4,3 L -18,16 L -10,3 Z" fill={color} stroke="#3A2A18" strokeWidth={2} strokeLinejoin="round" />
    <path d="M -18,-2 L -24,-10 L -14,-2 Z" fill={color} stroke="#3A2A18" strokeWidth={2} strokeLinejoin="round" />
  </g>
);

/**
 * ArrivalLabel — point plein + label texte à l'arrivée d'un marqueur (remplace l'objet isométrique
 * Dubaï/Suakin, retour Aziz v5 : un sprite iso à taille fixe devient anecdotique/illisible au dézoom
 * large des beats 3-5, ~zoom 2.8-3.6). Pattern copié EXACT de la référence `_incoming/silk road 2.mov`
 * (cercle plein doré + label texte à côté, jamais d'objet 3D/iso pour une simple destination nommée) —
 * PERMANENT une fois apparu (pas de fade-out, contrairement à ImpactPictogram qui est éphémère).
 */
const ArrivalLabel: React.FC<{ pos: Pt; frame: number; appear: number; label: string; color?: string }> =
  ({ pos, frame, appear, label, color = GOLD }) => {
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

/**
 * DroneMarker — sprite PNG (pas SVG, retour Aziz v5 : "un SVG, ça ne fonctionnera jamais vraiment pour un
 * drone, ça ressemble plus à des avions") posé à la position courante d'un trajet géo, orienté dans le
 * sens du vol. Remplace `markerIcon="drone"` de GeoFlowConnection (SVG, gardé en fallback ailleurs mais
 * plus utilisé dans cet acte). Position calculée via `cameraFollowsPath` (même fonction que la caméra
 * suiveuse, juste utilisée ici pour un OBJET plutôt qu'une caméra).
 */
const DroneMarker: React.FC<{
  waypoints: [number, number][]; t: number; proj: (c: [number, number]) => Pt | null;
  faction: "rsf" | "saf"; frame: number; size?: number;
}> = ({ waypoints, t, proj, faction, frame, size = 46 }) => {
  if (t <= 0 || t >= 1) return null; // masqué avant départ / après arrivée (ImpactPictogram prend le relais)
  const cam = cameraFollowsPath(waypoints, t, 1); // zoom ignoré, on ne veut que lon/lat
  const pos = proj([cam.lon, cam.lat]);
  if (!pos) return null;
  // bearing vers le point juste après (pour orienter le sprite dans le sens du vol)
  const camAhead = cameraFollowsPath(waypoints, Math.min(1, t + 0.01), 1);
  const posAhead = proj([camAhead.lon, camAhead.lat]);
  const angle = posAhead ? Math.atan2(posAhead.y - pos.y, posAhead.x - pos.x) * (180 / Math.PI) : 0;
  return (
    <div style={{ position: "absolute", left: pos.x, top: pos.y,
      transform: `translate(-50%,-50%) rotate(${angle + 90}deg)`, pointerEvents: "none" }}>
      <img src={staticFile(`_shared/sprites/warmap/drone-${faction}-td.png`)}
        style={{ width: size, height: size, objectFit: "contain", display: "block",
          filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))" }} />
    </div>
  );
};

/**
 * DroneConvoy — retour v7 (Kimi) : "remplace le pop final par un convoi. Des icônes de drones apparaissent
 * le long de toute la trajectoire, pas seulement à l'arrivée" — effet "ligne d'approvisionnement" continue
 * plutôt qu'un aller-retour isolé. 3 DroneMarker échelonnés (offsets de `t` fixes), plus dynamique et
 * cohérent avec "chaque seconde doit avoir un événement" (les 2 avis convergent sur ce diagnostic rythme).
 */
const DRONE_CONVOY_OFFSETS = [0, -0.09, -0.18]; // décalage vers l'arrière (traîne le convoi)
const DroneConvoy: React.FC<{
  waypoints: [number, number][]; t: number; proj: (c: [number, number]) => Pt | null;
  faction: "rsf" | "saf"; frame: number;
}> = ({ waypoints, t, proj, faction, frame }) => (
  <>
    {DRONE_CONVOY_OFFSETS.map((off, i) => (
      <DroneMarker key={i} waypoints={waypoints} t={t + off} proj={proj} faction={faction} frame={frame}
        size={i === 0 ? 46 : 34 - i * 4} />
    ))}
  </>
);

const ImpactPictogram: React.FC<{
  pos: Pt; frame: number; appear: number; kind: "gold" | "drone-rsf" | "drone-saf"; holdFrames?: number;
}> = ({ pos, frame, appear, kind, holdFrames = 70 }) => {
  const fadeIn = 10, fadeOut = 16;
  const op = interpolate(
    frame,
    [appear, appear + fadeIn, appear + holdFrames - fadeOut, appear + holdFrames],
    [0, 1, 1, 0],
    clamp
  );
  if (op <= 0.01) return null;
  const lift = interpolate(frame, [appear, appear + fadeIn], [8, 0], clamp); // léger flottement d'apparition
  const scale = interpolate(frame, [appear, appear + fadeIn], [0.7, 1], clamp); // léger grossissement à l'apparition
  const y = pos.y - 52 + lift;
  const color = kind === "gold" ? GOLD : kind === "drone-rsf" ? ATLAS.rsf : ATLAS.saf;
  const shape = kind === "gold" ? PICTO_GOLD : dronePicto(color);

  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} width={1920} height={1080}>
      <g transform={`translate(${pos.x} ${y}) scale(${scale})`} opacity={op}>
        <circle r={22} fill={color} opacity={0.16} />
        {shape}
      </g>
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

// ⭐⭐ CAMÉRA SUIVEUSE (révision v2, Décision 1+1bis) — remplace le dézoom qui recule du v3.
// Zoom JAMAIS mondial (borne dure zoom>=3.0 tout l'acte, cf breakdown). La caméra ACCOMPAGNE le marqueur
// en mouvement (cameraFollowsPath) pendant chaque trajet, et RE-RESSERRE sur le Soudan/la destination
// entre chaque connexion (Kimi : "revenir sur le Soudan entre chaque connexion, ne pas laisser le
// spectateur perdu") — jamais de vue d'ensemble Soudan+Dubaï+Ankara simultanée avant le beat 6.
const CAM2_ZOOM_FOLLOW = 5.2; // zoom resserré permanent pendant le suivi (calibré impression Silk Road 2)
const CAM2_ZOOM_REST = 4.6;   // zoom légèrement plus large aux points de repos (Jebel Amer / Dubaï / Darfour)

// waypoints courbés (arc net, cf validation test isolé v2 — 2 points intermédiaires trop proches
// de la droite AB ne suffisent pas, il faut un vrai décalage nord)
const WP_OR_ALLER: [number, number][] = [JEBEL_AMER, [30, 20.5], [38, 24.5], [47, 25.5], DUBAI];
const WP_OR_RETOUR: [number, number][] = [DUBAI, [47, 25.5], [38, 24.5], [30, 20.5], DARFUR];
const WP_TURQUIE: [number, number][] = [ANKARA, [33, 32], [32.7, 24], KHARTOUM];

// fondu court entre 2 CamKey (lisse les bascules suivi<->repos, jamais de saut de zoom instantané)
const CAM_BLEND = 18; // frames
function blendCam(a: CamKey, b: CamKey, frame: number, from: number, to: number): CamKey {
  const t = interpolate(frame, [from, to], [0, 1], clamp);
  return {
    f: frame,
    lon: a.lon + (b.lon - a.lon) * t,
    lat: a.lat + (b.lat - a.lat) * t,
    zoom: a.zoom + (b.zoom - a.zoom) * t,
  };
}

function cam2At(frame: number): CamKey {
  const restJebel: CamKey = { f: 0, lon: JEBEL_AMER[0], lat: JEBEL_AMER[1], zoom: CAM2_ZOOM_REST };
  const restDubai: CamKey = { f: 0, lon: DUBAI[0], lat: DUBAI[1], zoom: CAM2_ZOOM_REST };
  const restDarfur: CamKey = { f: 0, lon: DARFUR[0], lat: DARFUR[1], zoom: CAM2_ZOOM_REST };

  // Phase 0 — repos initial sur Jebel Amer
  if (frame < F2.dubaiApparait + 8) return restJebel;

  // Phase 1 — suit le marqueur ALLER (Jebel Amer -> Dubaï), fondu d'entrée depuis le repos
  if (frame < F2.argentNeRestePas) {
    const t = interpolate(frame, [F2.dubaiApparait + 8, F2.argentNeRestePas], [0, 1], clamp);
    const follow = cameraFollowsPath(WP_OR_ALLER, t, CAM2_ZOOM_FOLLOW);
    const startF = F2.dubaiApparait + 8;
    return frame < startF + CAM_BLEND ? blendCam(restJebel, follow, frame, startF, startF + CAM_BLEND) : follow;
  }
  // Phase 2 — re-resserre sur Dubaï (transaction, transformation or->drones)
  if (frame < F2.revientForme) {
    return blendCam(cameraFollowsPath(WP_OR_ALLER, 1, CAM2_ZOOM_FOLLOW), restDubai, frame, F2.argentNeRestePas, F2.argentNeRestePas + CAM_BLEND);
  }
  // Phase 3 — suit le marqueur RETOUR (Dubaï -> Darfour, drones gris-métal)
  if (frame < F2.jetonRsfArrivee) {
    const t = interpolate(frame, [F2.revientForme, F2.jetonRsfArrivee], [0, 1], clamp);
    const follow = cameraFollowsPath(WP_OR_RETOUR, t, CAM2_ZOOM_FOLLOW);
    return frame < F2.revientForme + CAM_BLEND ? blendCam(restDubai, follow, frame, F2.revientForme, F2.revientForme + CAM_BLEND) : follow;
  }
  // Phase 4 — re-resserre sur le Soudan (ancre chaque flèche dans son point de départ soudanais)
  if (frame < F2.autreCoteFront) {
    return blendCam(cameraFollowsPath(WP_OR_RETOUR, 1, CAM2_ZOOM_FOLLOW), restDarfur, frame, F2.jetonRsfArrivee, F2.jetonRsfArrivee + CAM_BLEND);
  }
  // Phase 5a — ARRÊT dédié sur la Turquie (retour Aziz v5 : le changement de caméra vers la Turquie était
  // trop rapide, "s'attarder au moins 1.5s" avant de repartir) — 45 frames de repos serré sur Ankara.
  const TURKEY_PAUSE = 45;
  if (frame < F2.autreCoteFront + TURKEY_PAUSE) {
    const restAnkara: CamKey = { f: frame, lon: ANKARA[0], lat: ANKARA[1], zoom: CAM2_ZOOM_REST };
    return frame < F2.autreCoteFront + CAM_BLEND ? blendCam(restDarfur, restAnkara, frame, F2.autreCoteFront, F2.autreCoteFront + CAM_BLEND) : restAnkara;
  }
  // Phase 5b — suit le marqueur miroir (Ankara -> jeton SAF), après la pause
  if (frame < F2.suakinNomme) {
    const t = interpolate(frame, [F2.autreCoteFront + TURKEY_PAUSE, F2.suakinNomme], [0, 1], clamp);
    const follow = cameraFollowsPath(WP_TURQUIE, t, CAM2_ZOOM_FOLLOW);
    const restAnkara: CamKey = { f: frame, lon: ANKARA[0], lat: ANKARA[1], zoom: CAM2_ZOOM_REST };
    return frame < F2.autreCoteFront + TURKEY_PAUSE + CAM_BLEND
      ? blendCam(restAnkara, follow, frame, F2.autreCoteFront + TURKEY_PAUSE, F2.autreCoteFront + TURKEY_PAUSE + CAM_BLEND)
      : follow;
  }
  // Phase 6 — repos final : glisse vers Khartoum/Suakin (prépare la transition section 3)
  const t = interpolate(frame, [F2.suakinNomme, F2.end], [0, 1], clamp);
  const restKhartoum: CamKey = {
    f: frame,
    lon: KHARTOUM[0] + (SUAKIN[0] - KHARTOUM[0]) * 0.4 * t,
    lat: KHARTOUM[1] + (SUAKIN[1] - KHARTOUM[1]) * 0.4 * t,
    zoom: CAM2_ZOOM_REST - 0.3 * t,
  };
  return frame < F2.suakinNomme + CAM_BLEND
    ? blendCam(cameraFollowsPath(WP_TURQUIE, 1, CAM2_ZOOM_FOLLOW), restKhartoum, frame, F2.suakinNomme, F2.suakinNomme + CAM_BLEND)
    : restKhartoum;
}

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

      <SoudanWarMapEngine camKeys={cam2At} zones={zones} showNationalBorder stateLineOpacity={0}>
        {(proj, ref) => {
          mapRef.current = ref?.current ?? null;
          const fakeMap = { project: (c: [number, number]) => proj(c) ?? { x: 0, y: 0 } } as any;

          return (
            <>
              {/* Dubaï apparaît EN PREMIER (avant le départ du marqueur — destination comprise avant le voyage).
                  Point+label (pattern Silk Road 2), remplace l'objet isométrique illisible au dézoom large. */}
              {frame >= F2.dubaiApparait && (() => { const p = proj(DUBAI); return p && <ArrivalLabel pos={p} frame={frame} appear={F2.dubaiApparait} label="Dubaï" />; })()}

              {/* Feedback nommé arrivée or à Dubaï (fin beat 3) — pictogramme lingots, 2-3s puis disparaît */}
              {frame >= F2.argentNeRestePas && (() => { const p = proj(DUBAI); return p && <ImpactPictogram pos={p} frame={frame} appear={F2.argentNeRestePas} kind="gold" />; })()}

              {/* BEAT 3-4 : trajet or (aller doré) + retour (drones gris-métal, transformation à Dubaï) */}
              {frame >= F2.dubaiApparait + 8 && (
                <GeoFlowConnection map={fakeMap} waypoints={WP_OR_ALLER} progress={allerT} markerProgress={allerT}
                  lineColor={GOLD} markerColor={GOLD} dashOffsetFrame={frame} lineWidth={5}
                  persistAfterArrival={frame >= F2.argentNeRestePas} persistOpacity={0.35} markerIcon="dot" markerSize={9} />
              )}
              {frame >= F2.revientForme && (
                <GeoFlowConnection map={fakeMap} waypoints={WP_OR_RETOUR} progress={1} markerProgress={retourT}
                  lineColor={METAL} markerColor={METAL} lineWidth={5}
                  markerColorTransition={{ beforeT: 0.02, colorBefore: GOLD, colorAfter: METAL }}
                  dashOffsetFrame={frame} hideMarker />
              )}
              {/* CONVOI de sprites PNG drones (retour v7, Kimi : "convoi le long de toute la trajectoire"
                  plutôt qu'un aller-retour isolé — remplace le simple pop à l'arrivée jugé "enfantin") */}
              {frame >= F2.revientForme && <DroneConvoy waypoints={WP_OR_RETOUR} t={retourT} proj={proj} faction="rsf" frame={frame} />}

              {/* jeton RSF (Darfour) — pulse à l'arrivée du marqueur drone */}
              {(() => { const p = proj(DARFUR); return p && <SoudanToken pos={p} faction="rsf" frame={frame} appear={0} />; })()}

              {/* Feedback nommé arrivée drone sur jeton RSF (fin beat 4) — pictogramme drone rouge, 2-3s */}
              {frame >= F2.jetonRsfArrivee && (() => { const p = proj(DARFUR); return p && <ImpactPictogram pos={p} frame={frame} appear={F2.jetonRsfArrivee} kind="drone-rsf" />; })()}

              {/* BEAT 5 : trajet Turquie -> SAF, sprite PNG drone (véhicule réel, glisse en crédible — règle
                  doctrine "seuls les véhicules glissent") orienté dans le sens du vol */}
              {frame >= F2.autreCoteFront && (
                <GeoFlowConnection map={fakeMap} waypoints={WP_TURQUIE} progress={turquieT} markerProgress={turquieT}
                  lineColor={ATLAS.saf} markerColor={ATLAS.saf} dashOffsetFrame={frame} lineWidth={5}
                  persistAfterArrival={frame >= F2.suakinNomme} persistOpacity={0.35} hideMarker />
              )}
              {frame >= F2.autreCoteFront && <DroneConvoy waypoints={WP_TURQUIE} t={turquieT} proj={proj} faction="saf" frame={frame} />}

              {/* jeton SAF (Khartoum) */}
              {(() => { const p = proj(KHARTOUM); return p && <SoudanToken pos={p} faction="saf" frame={frame} appear={0} />; })()}

              {/* Feedback nommé arrivée drone sur jeton SAF en provenance d'Ankara (beat 5) — pictogramme drone bleu, 2-3s */}
              {frame >= F2.suakinNomme && (() => { const p = proj(KHARTOUM); return p && <ImpactPictogram pos={p} frame={frame} appear={F2.suakinNomme} kind="drone-saf" />; })()}

              {/* Suakin — point+label (pattern Silk Road 2), apparaît exactement au mot (règle R-V5) */}
              {frame >= F2.suakinNomme && (() => { const p = proj(SUAKIN); return p && <ArrivalLabel pos={p} frame={frame} appear={F2.suakinNomme} label="Suakin" color={ATLAS.saf} />; })()}

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

// ⭐ Retour Aziz v5 : le CAM3 v1 dézoomait jusqu'à une vue quasi mondiale (zoom 1.9) — résidu de l'ancienne
// mise en scène, jamais retouché contrairement à cam2At. Beat 5bis (Égypte) doit SUIVRE le trajet de près
// (comme les beats 3/5), pas montrer d'emblée tout le cadrage large. Le dézoom vers zoom~2.3-2.5 (cadrer
// les 4 flux ensemble) reste voulu au beat 6 SEULEMENT (texte "le même or paie les deux côtés" = intention
// narrative de vue d'ensemble à CE moment précis, pas avant, pas au-delà de 2.3).
const CAM3_ZOOM_FOLLOW = 4.6;
const WP_EGYPTE: [number, number][] = [[32, 19], ...EGYPT_VECTOR];

function cam3At(frame: number): CamKey {
  // Phase 0 — repos sur la zone SAF/Nil avant le départ du trajet Égypte (reprend fin section 2)
  if (frame < F3.routeNordEgypte) {
    return { f: frame, lon: KHARTOUM[0], lat: KHARTOUM[1] + 2, zoom: CAM3_ZOOM_FOLLOW };
  }
  // Phase 1 — suit le marqueur SAF -> Égypte (même grammaire que cam2At beats 3/5)
  if (frame < F3.ceuxDeuxCamps) {
    const t = interpolate(frame, [F3.routeNordEgypte, F3.routeNordEgypte + 180], [0, 1], clamp);
    return cameraFollowsPath(WP_EGYPTE, t, CAM3_ZOOM_FOLLOW);
  }
  // Phase 2 — beat 6 : dézoom VOULU pour cadrer les 4 flux ensemble ("le même or paie les 2 côtés"),
  // borné à 2.3 (jamais mondial).
  if (frame < F3.pauseAvantQuestion) {
    const t = interpolate(frame, [F3.ceuxDeuxCamps, F3.ceQuiFaitDurer], [0, 1], clamp);
    return { f: frame, lon: 34 + 4 * t, lat: 23 - t, zoom: 4.0 - 1.7 * t }; // 4.0 -> 2.3
  }
  // Phase 3 — beat 7 : caméra STABILISÉE (figement narratif), split-screen prend le relais visuellement
  return { f: frame, lon: 38, lat: 22, zoom: 2.3 };
}

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

      <SoudanWarMapEngine camKeys={cam3At} zones={zones} showNationalBorder stateLineOpacity={0}>
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

              <CountryColorLayer mapRef={mapRef} flags={ALL_COUNTRY_FLAGS} absoluteFrame={sectionOffset + frame} />
            </>
          );
        }}
      </SoudanWarMapEngine>

      <WarmVignette />

      {/* BEAT 7 (révision v2, Décision 4) : rupture de registre climax — volets EAU/Turquie glissent
          par-dessus la carte Soudan (qui reste plein écran en fond), remplace le cercle pointillé v3. */}
      <Acte3SideFlags frame={frame} appear={F3.ceQuiFaitDurer} />
    </AbsoluteFill>
  );
};

/**
 * BEAT 7 — révision v2, Décision 4 : registre RUPTURE pour le climax (remplace le cercle pointillé du v3,
 * point le plus faible identifié jury+Aziz). PAS WarMapSplitScreen (redimensionner la vraie Mapbox Soudan
 * dans un panel 1/3 casserait tous les overlays enfants câblés 1920x1080 — testé, écarté). À la place :
 * la carte Soudan reste PLEIN ÉCRAN (fond, rien ne change), et 2 volets EAU/Turquie glissent depuis les
 * bords gauche/droite et RECOUVRENT le tiers correspondant — même effet de split visuel à l'écran, sans
 * dupliquer Mapbox. Pattern des panneaux repris de `TerritoryFlagPanel` (SceneComparaisonV3.tsx, Sénégal) :
 * silhouette pays (d3-geo) remplie du drapeau clippé à sa forme.
 */
// Retour Aziz v5 : retirer le nom du pays en bas (redondant, la silhouette+drapeau suffit) — remplacer
// par une géoplaque FACTUELLE courte (pas une paraphrase du texte, un fait qui enrichit visuellement).
// Faits repris tels quels du script v7 (déjà fact-checkés, cf soudan-midform-ACTE3-JURY-VERDICTS.md).
// Retour v7 (Gemini+Kimi, convergence forte) : "les panneaux latéraux sont trop vides" — ajout d'une
// icône (réutilise PICTO_GOLD/dronePicto déjà définis pour ImpactPictogram, cohérence visuelle) + 2e fait.
type SidePanel = { iso: string; geoName: string; icon: "gold" | "drone"; fact: string; fact2: string };
const SIDE_PANELS: SidePanel[] = [
  { iso: "ae", geoName: "United Arab Emirates", icon: "gold",
    fact: "1er importateur d'or africain au monde", fact2: "Financement indirect des RSF" },
  { iso: "tr", geoName: "Turkey", icon: "drone",
    fact: "Drones Bayraktar", fact2: "Point d'ancrage à Suakin, mer Rouge" },
];

const SidePanelTerritory: React.FC<{
  panel: SidePanel; side: "left" | "right"; topology: any; frame: number; appear: number; panelW: number;
}> = ({ panel, side, topology, frame, appear, panelW }) => {
  const H = 1080;
  // même fichier PNG que ALL_COUNTRY_FLAGS/useClipFlags (public/_shared/flags/) — cohérent, déjà validé
  const flagUrl = staticFile(`_shared/flags/${panel.iso}.png`);

  const { pathD, bbox } = React.useMemo(() => {
    try {
      const fc = feature(topology, topology.objects.countries) as unknown as { features: any[] };
      const feat = fc.features.find((f: any) => f.properties?.name === panel.geoName);
      if (!feat) return { pathD: "", bbox: [[0, 0], [panelW, H]] as [[number, number], [number, number]] };
      const proj = geoMercator().fitExtent([[40, 90], [panelW - 40, H - 220]], feat);
      const gp = geoPath(proj);
      return { pathD: gp(feat) ?? "", bbox: gp.bounds(feat) as [[number, number], [number, number]] };
    } catch { return { pathD: "", bbox: [[0, 0], [panelW, H]] as [[number, number], [number, number]] }; }
  }, [topology, panel.geoName, panelW]);

  const op = interpolate(frame, [appear, appear + 22], [0, 1], clamp);
  const slide = interpolate(frame, [appear, appear + 26], [side === "left" ? -panelW * 0.4 : panelW * 0.4, 0], clamp);
  if (op <= 0.01) return null;
  const [[bx0, by0], [bx1, by1]] = bbox;
  const clipId = `a3-side-${panel.iso}`;

  // Contour qui se DESSINE progressivement (retour Aziz v5 : apparaissait d'un coup, "un peu vide/fade")
  // — draw-in via pathLength normalisé, cohérent grammaire "on nomme -> ça se trace" du reste de l'acte.
  const drawFrames = 34;
  const drawT = interpolate(frame, [appear + 4, appear + 4 + drawFrames], [0, 1], clamp);
  const flagFillOp = interpolate(frame, [appear + 4 + drawFrames - 10, appear + 4 + drawFrames + 10], [0, 0.9], clamp);
  const iconOp = interpolate(frame, [appear + 4 + drawFrames, appear + 4 + drawFrames + 16], [0, 1], clamp);
  const factOp = interpolate(frame, [appear + 4 + drawFrames + 10, appear + 4 + drawFrames + 30], [0, 1], clamp);
  const fact2Op = interpolate(frame, [appear + 4 + drawFrames + 34, appear + 4 + drawFrames + 54], [0, 1], clamp);

  return (
    <div style={{
      position: "absolute", top: 0, [side]: 0, width: panelW, height: H, overflow: "hidden",
      opacity: op, transform: `translateX(${slide}px)`,
      background: "radial-gradient(ellipse at 50% 42%, rgba(58,42,24,0.55) 0%, rgba(20,14,7,0.92) 78%)", // dégradé transparent (Aziz a préféré vs noir solide testé)
      boxShadow: side === "left" ? "8px 0 30px rgba(0,0,0,0.5)" : "-8px 0 30px rgba(0,0,0,0.5)",
    }}>
      <svg width={panelW} height={H} viewBox={`0 0 ${panelW} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs><clipPath id={clipId}><path d={pathD} /></clipPath></defs>
        <path d={pathD} fill="none" stroke={GOLD} strokeWidth={14} opacity={0.18 * flagFillOp} strokeLinejoin="round" />
        {flagUrl && pathD && (
          <image href={flagUrl} x={bx0} y={by0} width={bx1 - bx0} height={by1 - by0}
            preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} opacity={flagFillOp} />
        )}
        {/* contour encre net qui se trace (pathLength=1 normalise la longueur, indépendant de la géométrie réelle) */}
        <path d={pathD} fill="none" stroke={ATLAS.cream} strokeWidth={2.4} opacity={0.85}
          strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawT} />
      </svg>
      {/* icône (retour v7 : panneau enrichi, plus juste texte) */}
      <svg width={panelW} height={H} viewBox={`0 0 ${panelW} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <g transform={`translate(${panelW / 2} 118) scale(1.6)`} opacity={iconOp}>
          <circle r={20} fill={GOLD} opacity={0.14} />
          {panel.icon === "gold" ? PICTO_GOLD : dronePicto(GOLD)}
        </g>
      </svg>
      {/* géoplaques factuelles courtes (2, remplacent le nom du pays — redondant avec silhouette+drapeau) */}
      <div style={{ position: "absolute", bottom: 44, left: 20, right: 20, textAlign: "center" }}>
        <div style={{ width: 40, height: 2.4, background: GOLD, margin: "0 auto 12px", borderRadius: 2, opacity: factOp }} />
        <div style={{ color: ATLAS.cream, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 20,
          lineHeight: 1.3, letterSpacing: "0.01em", textShadow: "0 2px 10px rgba(0,0,0,0.9)", opacity: factOp,
          marginBottom: 10 }}>{panel.fact}</div>
        <div style={{ color: GOLD, fontFamily: "Georgia, serif", fontWeight: 600, fontSize: 16,
          lineHeight: 1.3, letterSpacing: "0.01em", textShadow: "0 2px 8px rgba(0,0,0,0.9)", opacity: fact2Op }}>{panel.fact2}</div>
      </div>
    </div>
  );
};

const Acte3SideFlags: React.FC<{ frame: number; appear: number }> = ({ frame, appear }) => {
  const [topo, setTopo] = React.useState<any>(null);
  React.useEffect(() => {
    fetch(staticFile("_shared/geo-data/countries-50m.json")).then((r) => r.json()).then(setTopo).catch(() => {});
  }, []);
  if (!topo || frame < appear - 2) return null;
  const panelW = 1920 * 0.27; // volets latéraux modestes — le Soudan (centre) reste le sujet, pas noyé
  return (
    <>
      <SidePanelTerritory panel={SIDE_PANELS[0]} side="left" topology={topo} frame={frame} appear={appear} panelW={panelW} />
      <SidePanelTerritory panel={SIDE_PANELS[1]} side="right" topology={topo} frame={frame} appear={appear + 10} panelW={panelW} />
    </>
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
