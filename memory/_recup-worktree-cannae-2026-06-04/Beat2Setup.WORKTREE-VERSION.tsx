import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  AtlasMercator,
  AtlasPulseMarker,
  AtlasCartouche,
  AtlasLabel,
} from "../_reference/mansa-moussa-v2/atlas-v2-components";
import { AtlasGeoAntithesis, GeoPath } from "../_shared/AtlasGeoAntithesis";
import {
  greatCircleRoute,
  positionAlongRoute,
  bearingAlongRoute,
} from "../_shared/geoUtils";
import pesteData from "../../../../public/atlas/peste-1347/geo/peste-map-data.json";
import { BEATS, CITIES, PIVOTS, ROUTES } from "./timing";
import { ISO_PLAGUE } from "./mapConfig";

// =============================================================================
// BEAT 2 — SETUP DE LA PROPAGATION (V2, refondue post-playbook 2026-06-04)
// =============================================================================
//
// ROLE NARRATIF : la peste part de Caffa (Crimee), 3 bateaux genois la portent
// vers la Sicile/l'Europe, une vague rouge se propage vers le nord PUIS arrive au
// Sahara qui agit comme BOUCLIER -> punchline "Mais le Sahara est la."
// C'est une ANTITHESE geographique (Europe infectee crimson vs Mali or vivant).
//
// CE QUI CHANGE vs V1 (catalogue stress-test) :
//  - Couche fill : mixHex local + Sahara gold overlay -> AtlasGeoAntithesis
//    (Europe crimson decline cale sur la vague, Mali zone or thrive cale sur la
//    punchline Sahara). §1.4 etats de territoire + §3 "Antithese geographique".
//  - Overlays nus -> TRIADE (§5) : labels villes = AtlasLabel (spring + plaque
//    cream + encre), titre/punchline/EPIDEMIE = AtlasCartouche (wobble + fadeOut).
//  - Bateaux : interpolate ecran-space -> route georeferencee greatCircleRoute +
//    positionAlongRoute + orientation par bearing + scale par zoom (geoUtils,
//    correction #8 du catalogue : objets sur la carte = coords geo, pas ecran).
//  - Vague : cercle brut faible opacite -> dim carte sequentiel + glow radial
//    + cartouche EPIDEMIE (correction #7 dramatiser le moment-cle).
//  - Drift : ramp lineaire -> micro-souffle organique sin/cos (§1, drift Ken Burns
//    permanent quasi imperceptible, PAS un mouvement qui rampe).
//  - globalFadeIn/Out wrapper (§6 continuite inter-beats).
//
// CE QUI EST GARDE (fondation saine) : timing forced-alignment depuis timing.ts,
// palette ATLAS_COLORS via AtlasMercator, geographie (POI + vague clippee Sahara),
// la const OCEAN locale = backgroundColor AbsoluteFill (PAS la carte), les 2 Audio.
//
// PLAFOND SIMULTANEITE (§6) : MAX 2 couches narratives actives. Sequence :
//  Phase A (caffa) : marker+label Caffa + bateaux+routes = 1 couche (la traversee).
//  Phase B (propagation) : vague rouge + markers/labels villes atteintes = la
//    couche "decline Europe" (antithese declineProgress monte) + EPIDEMIE.
//  Phase C (Sahara) : la vague se heurte au Sahara, Mali s'illumine (thrive),
//    cartouche SAHARA + punchline. Les bateaux ont disparu, les villes restent en fond.
// =============================================================================

// ─── PALETTE LOCALE ───────────────────────────────────────────────────────────
// OCEAN = backgroundColor de l'AbsoluteFill UNIQUEMENT (pas la carte). GARDER.
const OCEAN = "#1a2744";
const PLAGUE_RED = "#8b1a1a";
const PLAGUE_RED_BRIGHT = "#cc2222";
const SAHARA_GOLD = "#c8960c";

// Rouge VIF de la peste pour le declin de l'Europe — firebrick [178,34,34].
// VALIDE PAR AZIZ (2026-06-04) pour la peste : pas de crimson sombre/boueux, qui
// se confondait avec le fond ocean et cassait la coherence avec la vague (#cc2222).
const PLAGUE_DECLINE_RGB: [number, number, number] = [178, 34, 34];

// Zone Mali subsaharienne qui PROSPERE (or vivant) — l'autre terme de l'antithese.
const ISO_MALI_ZONE = new Set([
  "MLI", "SEN", "GMB", "GNB", "GIN", "BFA", "NER", "MRT",
]);

const MAX_WAVE_R = 260;
const SAHARA_CLIP_Y = 525; // ligne de barriere : la vague ne franchit pas le Sahara

// ─── HELPER COORD ECRAN ─────────────────────────────────────────────────────
// Convertit une coord SVG brute (espace carte 720x1280) en coord ECRAN, en
// reproduisant le transform de AtlasMercator :
//   transform = translate(cx+driftX, cy+driftY) scale(s) translate(-cx, -cy)
//   => screenX = (poiX - cx) * scale + cx + driftX
const makeMapCoord = (
  W: number,
  H: number,
  scale: number,
  driftX: number,
  driftY: number
) => {
  const cx = W / 2;
  const cy = H / 2;
  return (x: number, y: number): [number, number] => [
    (x - cx) * scale + cx + driftX,
    (y - cy) * scale + cy + driftY,
  ];
};

// ─── BATEAU GEOREFERENCE ──────────────────────────────────────────────────────
// Suit une route maritime great-circle (coords geo reelles), oriente par bearing,
// scale par le zoom camera. mc() applique le transform camera pour l'ecran.
interface SeaBoatProps {
  route: ReturnType<typeof greatCircleRoute>;
  localStart: number;
  localEnd: number;
  localHide: number;
  localF: number;
  camScale: number;
  mc: (x: number, y: number) => [number, number];
}

const SeaBoat: React.FC<SeaBoatProps> = ({
  route,
  localStart,
  localEnd,
  localHide,
  localF,
  camScale,
  mc,
}) => {
  if (localF < localStart || localF > localHide) return null;
  const t = interpolate(localF, [localStart, localEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(
    localF,
    [localStart, localStart + 12, localEnd + 18, localHide - 12, localHide],
    [0, 1, 0.95, 0.95, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Position geo -> SVG -> ecran (herite drift/zoom).
  const [svgX, svgY] = positionAlongRoute(route, t);
  const [x, y] = mc(svgX, svgY);

  // Orientation : le sprite regarde par defaut vers l'est. bearing nord=0, est=90.
  // On oriente la coque le long de la tangente (leger, le sprite reste lisible).
  const bearing = bearingAlongRoute(route, t);
  const tilt = Math.max(-22, Math.min(22, bearing - 90)); // borne : evite renversement

  const baseW = 72;
  const baseH = 54;
  const s = camScale; // grossit avec le zoom carte (objet ancre au sol)
  const w = baseW * s;
  const h = baseH * s;

  return (
    <image
      href={staticFile("atlas/peste-1347/assets/objects/bateau-genois.png")}
      x={-w / 2}
      y={-h / 2}
      width={w}
      height={h}
      opacity={opacity}
      transform={`translate(${x} ${y}) rotate(${tilt})`}
      style={{
        imageRendering: "pixelated",
        filter: "drop-shadow(0px 0px 2px rgba(255,255,255,0.9))",
      }}
    />
  );
};

// ─── TRACE DE ROUTE GEOREFERENCEE ─────────────────────────────────────────────
// Trait pointille qui se dessine le long de la route great-circle, en coords ECRAN.
interface SeaRouteTraceProps {
  route: ReturnType<typeof greatCircleRoute>;
  localStart: number;
  localEnd: number;
  localF: number;
  mc: (x: number, y: number) => [number, number];
}

const SeaRouteTrace: React.FC<SeaRouteTraceProps> = ({
  route,
  localStart,
  localEnd,
  localF,
  mc,
}) => {
  const progress = interpolate(localF, [localStart, localEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (progress <= 0) return null;
  const opacity = interpolate(localF, [localStart, localStart + 10], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Echantillonne la portion [0, progress] de la route en coords ecran.
  const N = 28;
  const last = Math.max(1, Math.round(progress * N));
  const pts: string[] = [];
  for (let i = 0; i <= last; i++) {
    const tt = i / N;
    if (tt > progress + 0.001) break;
    const [sx, sy] = positionAlongRoute(route, Math.min(tt, progress));
    const [px, py] = mc(sx, sy);
    pts.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return (
    <path
      d={pts.join(" ")}
      fill="none"
      stroke="#ff8833"
      strokeWidth={2.5}
      strokeOpacity={opacity}
      strokeDasharray="8 4"
      strokeLinecap="round"
      style={{ filter: "drop-shadow(0px 0px 3px #ff6600)" }}
    />
  );
};

// ─── COMPOSANT ──────────────────────────────────────────────────────────────

export const Beat2Setup: React.FC = () => {
  const frame = useCurrentFrame();
  useVideoConfig();

  const data = pesteData.mercLarge;
  const W = pesteData.width;
  const H = pesteData.height;

  const beatStart = BEATS.SETUP_START;
  const beatEnd = BEATS.SETUP_END;
  const beatDur = beatEnd - beatStart;
  const localF = frame - beatStart;

  // ── Continuite inter-beats (§6) : globalFadeIn [0,15] SEULEMENT.
  // PAS de fadeOut en fin de beat : la convention episode (Beat1Hook ends-on-line,
  // Beat3 mapOpacity fade-IN only) veut que chaque beat finisse a pleine opacite et
  // que le fade-IN du beat suivant assure la continuite. Un fadeOut [T-12,T] ici
  // ENGLOUTISSAIT la punchline SAHARA (spring-in a local 441, fade [437,449]) — le
  // climax geographique du beat n'avait jamais une frame propre. Corrige.
  const globalFade = interpolate(localF, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Micro-souffle organique (§1) — quasi imperceptible, empeche l'image figee.
  // PAS un drift lineaire qui rampe. Caffa (531,450) reste largement dans le cadre.
  const driftX = Math.sin(localF * 0.014) * 10;
  const driftY = Math.cos(localF * 0.011) * 7;
  const camScale = interpolate(localF, [0, beatDur], [1.0, 1.04], {
    extrapolateRight: "clamp",
  });

  const mc = makeMapCoord(W, H, camScale, driftX, driftY);

  // ── POI bruts (espace carte) puis ecran via mc()
  const poi = data.poi as Record<
    string,
    { x: number; y: number; lon: number; lat: number }
  >;
  const caffa = poi["Caffa"];
  const sicile = poi["Sicile"];
  const paris = poi["Paris"];
  const londres = poi["Londres"];
  const stockholm = poi["Stockholm"];
  const propagCenter = data.propagationCenter as { cx: number; cy: number };

  const caffaS = mc(caffa.x, caffa.y);
  const sicileS = mc(sicile.x, sicile.y);
  const parisS = mc(paris.x, paris.y);
  const londresS = mc(londres.x, londres.y);
  const stockholmS = mc(stockholm.x, stockholm.y);
  const [propCx, propCy] = mc(propagCenter.cx, propagCenter.cy);

  // ── ANTITHESE — paths Europe (declin crimson) vs Mali (or vivant)
  const countries = data.countries as GeoPath[];
  const declinePaths = countries.filter((c) =>
    (ISO_PLAGUE as readonly string[]).includes(c.iso)
  );
  const thrivePaths = countries.filter((c) => ISO_MALI_ZONE.has(c.iso));

  // declineProgress : l'Europe vire au crimson au fur et a mesure de la vague.
  // Cale sur la propagation (debut a PROPAGATION_START, plein juste avant le Sahara).
  const declineProgress = interpolate(
    localF,
    [
      ROUTES.PROPAGATION_START - beatStart + 40,
      PIVOTS.SAHARA_BOUCLIER - beatStart,
    ],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // thriveProgress : Mali s'illumine quand on dit "le Sahara est la" (l'autre terme).
  const thriveProgress = interpolate(
    localF,
    [PIVOTS.SAHARA_BOUCLIER - beatStart, PIVOTS.SAHARA_EST_LA - beatStart + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── ROUTES MARITIMES GEOREFERENCEES — Caffa -> 3 ports (Sicile + 2 voisins)
  // Une seule origine Caffa, 3 arcs great-circle vers 3 debarquements distincts.
  const routeSicile = greatCircleRoute(
    { lon: caffa.lon, lat: caffa.lat },
    { lon: sicile.lon, lat: sicile.lat },
    48
  );
  const routeGenes = greatCircleRoute(
    { lon: caffa.lon, lat: caffa.lat },
    { lon: sicile.lon - 4.5, lat: sicile.lat + 3.2 }, // cote ligure (Genes approx)
    48
  );
  const routeConst = greatCircleRoute(
    { lon: caffa.lon, lat: caffa.lat },
    { lon: sicile.lon + 2.2, lat: sicile.lat - 1.5 }, // Mediterranee orientale
    48
  );

  // ── TIMING BATEAUX (local) — 3 bateaux a 20f d'ecart, arrivent AVANT la vague.
  const B1_START = CITIES.SICILE - beatStart; // f104 local
  const B1_END = B1_START + 126;
  const B2_START = B1_START + 20;
  const B2_END = B2_START + 126;
  const B3_START = B1_START + 40;
  const B3_END = B3_START + 126;
  const BOAT_HIDE = B3_END + 40; // f310, avant l'expansion pleine de la vague

  const R1_START = B1_START - 20;
  const R2_START = B2_START - 20;
  const R3_START = B3_START - 20;

  // ── VAGUE DE PROPAGATION — depuis Sicile, clippee au nord du Sahara
  const waveLocalStart = ROUTES.PROPAGATION_START - beatStart;
  const waveStopLocal = PIVOTS.SAHARA_BOUCLIER - beatStart - 50;
  const waveRaw = interpolate(localF, [waveLocalStart, waveStopLocal], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const waveEased = Easing.out(Easing.quad)(waveRaw);
  const waveR = waveEased * MAX_WAVE_R;
  const waveOpacity = interpolate(
    localF,
    [waveLocalStart, waveLocalStart + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── DIM NARRATIF (§3 dramatiser) — la carte s'assombrit legerement pendant que
  // la vague avance, pour faire ressortir l'epidemie. Se leve quand le Sahara
  // bloque (le bouclier "rallume" la zone vivante). Plafond doux (0.22) = lisible.
  const mapDim = interpolate(
    localF,
    [
      waveLocalStart,
      waveLocalStart + 30,
      PIVOTS.SAHARA_BOUCLIER - beatStart,
      PIVOTS.SAHARA_BOUCLIER - beatStart + 30,
    ],
    [0, 0.22, 0.22, 0.08],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Halo radial pulse de la vague (glow doux headless-safe, sans filter:blur)
  const wavePulse = 0.5 + 0.5 * Math.sin(localF * 0.18);

  // ── SAHARA — barriere doree qui apparait quand la vague se heurte ("Sahara")
  const saharaLocalStart = PIVOTS.SAHARA_BOUCLIER - beatStart;
  const saharaOpacity = interpolate(
    localF,
    [saharaLocalStart, saharaLocalStart + 20],
    [0, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const saharaPulse = 0.5 + 0.5 * Math.sin(localF * 0.1);

  // ── Marqueurs villes — apparition synchro-mot (frame ABSOLU depuis timing.ts)
  // offsetX/offsetY decales pour eviter la collision des pills (Paris/Londres
  // sont geographiquement tres proches : on les ecarte de part et d'autre).
  const cityMarkers: Array<{
    key: string;
    coord: [number, number];
    at: number;
    label: string;
    offsetX: number;
    offsetY: number;
  }> = [
    { key: "caffa", coord: caffaS, at: CITIES.CRIMEE, label: "CAFFA", offsetX: 18, offsetY: -30 },
    { key: "sicile", coord: sicileS, at: CITIES.SICILE, label: "SICILE", offsetX: 0, offsetY: -34 },
    { key: "londres", coord: londresS, at: CITIES.LONDRES, label: "LONDRES", offsetX: -46, offsetY: -34 },
    { key: "paris", coord: parisS, at: CITIES.PARIS, label: "PARIS", offsetX: 30, offsetY: 18 },
    { key: "stockholm", coord: stockholmS, at: CITIES.STOCKHOLM, label: "STOCKHOLM", offsetX: 12, offsetY: -32 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: OCEAN }}>
      {/* Narration : enveloppee dans Sequence(from=beatStart) pour que l'Audio
          demarre a f241 ABSOLU de composition tout en lisant le segment 241-690
          du fichier source (startFrom=241, endAt=690). Sans ce wrap, l'Audio nu
          jouait des la frame 0 de composition (startFrom=241 seek file) alors que
          les visuels (localF=frame-beatStart) restaient noirs jusqu'a f241 :
          desync voix/image de 8s sur render isole. Meme fix que Beat3 ("voix absente").
          endAt corrige : V1 avait SETUP_START+SETUP_END=931 (faux, SETUP_END est un
          frame absolu pas une duree) -> beatStart+beatDur=690. */}
      <Sequence from={beatStart}>
        <Audio
          src={staticFile("atlas/peste-1347/audio/narration-v1.mp3")}
          startFrom={beatStart}
          endAt={beatStart + beatDur}
          volume={1}
        />
      </Sequence>
      <Audio
        src={staticFile("atlas/peste-1347/audio/music-c-desert.mp3")}
        startFrom={0}
        volume={0.04}
      />

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ opacity: globalFade }}
      >
        <defs>
          <clipPath id="wave-north-clip">
            <rect x={-W} y={-H} width={W * 3} height={SAHARA_CLIP_Y + H} />
          </clipPath>
          <radialGradient id="wave-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={PLAGUE_RED_BRIGHT} stopOpacity="0.45" />
            <stop offset="55%" stopColor={PLAGUE_RED} stopOpacity="0.22" />
            <stop offset="100%" stopColor={PLAGUE_RED} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x={0} y={0} width={W} height={H} fill={OCEAN} />

        {/* Carte de base (territoires neutres terracotta) */}
        <AtlasMercator
          countries={data.countries}
          driftX={driftX}
          driftY={driftY}
          scale={camScale}
          width={W}
          height={H}
        />

        {/* ANTITHESE — meme transform camera que AtlasMercator (§3) */}
        <g
          transform={`translate(${W / 2 + driftX} ${H / 2 + driftY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`}
        >
          <AtlasGeoAntithesis
            declinePaths={declinePaths}
            thrivePaths={thrivePaths}
            declineProgress={declineProgress}
            thriveProgress={thriveProgress}
            frame={localF}
            declineColorRgb={PLAGUE_DECLINE_RGB}
            thriveColor={SAHARA_GOLD}
          />

          {/* Barriere Sahara doree — souligne le bouclier geographique */}
          {saharaOpacity > 0 && (
            <path
              d={data.saharaPath}
              fill={SAHARA_GOLD}
              fillOpacity={saharaOpacity}
              stroke={SAHARA_GOLD}
              strokeWidth={1.4}
              strokeOpacity={saharaPulse * 0.7}
            />
          )}
        </g>

        {/* DIM narratif — voile sombre qui fait ressortir l'epidemie */}
        {mapDim > 0.01 && (
          <rect x={0} y={0} width={W} height={H} fill="#0a0e1a" opacity={mapDim} />
        )}

        {/* VAGUE rouge clippee au nord du Sahara : glow radial + anneau */}
        {waveR > 0 && (
          <g clipPath="url(#wave-north-clip)">
            <circle
              cx={propCx}
              cy={propCy}
              r={waveR}
              fill="url(#wave-glow)"
              opacity={waveOpacity * (0.8 + 0.2 * wavePulse)}
              style={{ pointerEvents: "none" }}
            />
            <circle
              cx={propCx}
              cy={propCy}
              r={waveR}
              fill="none"
              stroke={PLAGUE_RED_BRIGHT}
              strokeWidth={3}
              strokeOpacity={waveOpacity * (0.65 + 0.2 * wavePulse)}
              style={{ pointerEvents: "none" }}
            />
          </g>
        )}

        {/* Routes maritimes georeferencees (pointilles qui se dessinent) */}
        <SeaRouteTrace route={routeSicile} localStart={R1_START} localEnd={B1_END} localF={localF} mc={mc} />
        <SeaRouteTrace route={routeGenes} localStart={R2_START} localEnd={B2_END} localF={localF} mc={mc} />
        <SeaRouteTrace route={routeConst} localStart={R3_START} localEnd={B3_END} localF={localF} mc={mc} />

        {/* 3 bateaux genois — Caffa -> ports europeens */}
        <SeaBoat route={routeSicile} localStart={B1_START} localEnd={B1_END} localHide={BOAT_HIDE} localF={localF} camScale={camScale} mc={mc} />
        <SeaBoat route={routeGenes} localStart={B2_START} localEnd={B2_END} localHide={BOAT_HIDE} localF={localF} camScale={camScale} mc={mc} />
        <SeaBoat route={routeConst} localStart={B3_START} localEnd={B3_END} localHide={BOAT_HIDE} localF={localF} camScale={camScale} mc={mc} />

        {/* Marqueurs villes — onde radar (apparition synchro-mot) */}
        {cityMarkers.map((m) =>
          localF >= m.at - beatStart ? (
            <AtlasPulseMarker
              key={`pm-${m.key}`}
              coord={m.coord}
              beatStart={m.at}
              color={PLAGUE_RED_BRIGHT}
              ringInner={5}
              ringOuter={24}
            />
          ) : null
        )}

        {/* Labels villes — TRIADE (pill cream + encre + spring), MAJUSCULES (§5) */}
        {cityMarkers.map((m) => (
          <AtlasLabel
            key={`lb-${m.key}`}
            coord={m.coord}
            text={m.label}
            appearAt={m.at}
            offsetX={m.offsetX}
            offsetY={m.offsetY}
            charW={13}
            padding={26}
            fontSize={20}
          />
        ))}

        {/* Cartouche TITRE — chiffre-evenement 1347, en haut (layout y<=320) */}
        <AtlasCartouche
          appearAt={beatStart + 6}
          text="1347"
          subtext="LA PESTE NOIRE"
          x={W / 2}
          y={140}
          fontSize={62}
        />

        {/* Cartouche EPIDEMIE — surgit avec la vague (dramatise le moment-cle #7) */}
        <AtlasCartouche
          appearAt={ROUTES.PROPAGATION_START + 6}
          disappearAt={PIVOTS.SAHARA_BOUCLIER - 4}
          text="L'EPIDEMIE"
          subtext="remonte vers le nord"
          x={W / 2}
          y={272}
          fontSize={40}
        />

        {/* Cartouche SAHARA — le bouclier (spring-pop, remplace le texte nu V1).
            appearAt cale sur SAHARA_BOUCLIER (mot "Sahara", f659) et NON
            SAHARA_EST_LA (mot "la.", f682) : le beat finit a f690, donc ancrer sur
            "la." ne laissait que 8 frames (~0.27s) pour springer+lire la punchline.
            En l'ancrant sur "Sahara" la cartouche est pleinement etablie (~30f) quand
            "est la." est prononce, et tient jusqu'a la fin (plus de fadeOut tail). */}
        <AtlasCartouche
          appearAt={PIVOTS.SAHARA_BOUCLIER}
          text="LE SAHARA"
          subtext="Mais le Sahara est la."
          x={W / 2}
          y={H * 0.84}
          fontSize={48}
        />
      </svg>
    </AbsoluteFill>
  );
};
