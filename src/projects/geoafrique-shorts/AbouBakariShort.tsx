import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Audio,
  Video,
  OffthreadVideo,
  staticFile,
  Sequence,
} from "remotion";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";
import { delayRender, continueRender } from "remotion";
import { BEATS, FPS, TOTAL_FRAMES, TOTAL_FRAMES_WITH_CTA } from "./timing";

// ============================================================
// ABOU BAKARI II — Short 54s / 1620 frames
// Format : 1080x1920 (9:16 vertical)
// Style  : dark background + or/gold, carte Afrique de l'Ouest
// Audio  : public/audio/abou-bakari/abou-bakari-v4-organic.mp3
// Architecture : AbsoluteFill par beat (Option B) — 2026-03-10
// ============================================================

const W = 1080;
const H = 1920;

const PAL = {
  bg:          "#0a0a0f",
  ocean:       "#0a1628",
  land:        "#1a1a2a",
  landStroke:  "#2a2a3a",
  mali:        "#c8820a",
  maliStroke:  "#d4af37",
  gold:        "#d4af37",
  goldLight:   "#f0d060",
  amber:       "#c8820a",
  cream:       "#f5e6c8",
  dimCream:    "#a09070",
  red:         "#8b1a1a",
  blue:        "#1a3a6a",
} as const;

// Pays de l'empire du Mali (ISO numeriques)
const ISO_MALI        = 466;
const ISO_SENEGAL     = 686;
const ISO_GUINEA      = 324;
const ISO_GAMBIA      = 270;
const ISO_MAURITANIA  = 478;
const ISO_BURKINA     = 854;
const ISO_NIGER       = 562;

const MALI_EMPIRE_ISOS = new Set([
  ISO_MALI, ISO_SENEGAL, ISO_GUINEA, ISO_GAMBIA,
  ISO_MAURITANIA, ISO_BURKINA, ISO_NIGER,
]);

interface CountryFeature { id: number; path: string; centroid: [number, number] | null; }

// Projection centree sur Afrique de l'Ouest
function makeProj(center: [number, number], scale: number) {
  return d3Geo.geoMercator().center(center).scale(scale).translate([W / 2, H * 0.45]);
}
const PROJ_BASE = makeProj([-10, 15], 2200);

// Hook chargement carte
function useMapData() {
  const [countries, setCountries] = React.useState<CountryFeature[]>([]);
  const [handle] = React.useState(() => delayRender("AbouBakari map"));

  React.useEffect(() => {
    fetch(staticFile("assets/peste-pixel/maps/countries-50m.json"))
      .then((r) => r.json())
      .then((topo) => {
        const geo = topojson.feature(
          topo,
          topo.objects.countries
        ) as unknown as GeoJSON.FeatureCollection;
        const pathGen = d3Geo.geoPath().projection(PROJ_BASE);
        const features: CountryFeature[] = geo.features
          .map((f) => {
            const id = Number((f as { id?: unknown }).id ?? 0);
            const path = pathGen(f) ?? "";
            const cent = pathGen.centroid(f);
            return {
              id,
              path,
              centroid: (cent && !isNaN(cent[0]) ? cent : null) as [number, number] | null,
            };
          })
          .filter((f) => f.path);
        setCountries(features);
        continueRender(handle);
      });
  }, [handle]);

  return countries;
}

// Helpers animation
function clampI(v: number): number {
  return interpolate(v, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

const XFADE = 20;

// fadeIn depuis un frame local (0-based) — delayFrames = quand commencer le fade
function fadeIn(localFrame: number, delayFrames = 0, duration = XFADE): number {
  if (duration <= 0) return localFrame >= delayFrames ? 1 : 0;
  return clampI(interpolate(localFrame, [delayFrames, delayFrames + duration], [0, 1]));
}

// fadeInOut pour un beat — dur = duree totale du beat en frames locaux
function beatFade(localFrame: number, dur: number, fadeInDur = XFADE, fadeOutDur = XFADE): number {
  const fi = fadeInDur <= 0 ? 1 : clampI(interpolate(localFrame, [0, fadeInDur], [0, 1]));
  const fo = clampI(interpolate(localFrame, [dur - fadeOutDur, dur], [1, 0]));
  return Math.min(fi, fo);
}

// Composant carte de base
function AfricaMap({
  countries,
  highlightMali,
  mapOpacity = 1,
}: {
  countries: CountryFeature[];
  highlightMali: number;
  mapOpacity?: number;
}) {
  return (
    <g style={{ opacity: mapOpacity }}>
      {countries.map((c) => {
        const isMali = MALI_EMPIRE_ISOS.has(c.id);
        const stroke = isMali && highlightMali > 0.5 ? PAL.maliStroke : PAL.landStroke;
        const strokeW = isMali && highlightMali > 0.5 ? 1.5 : 0.5;
        return (
          <g key={c.id}>
            <path d={c.path} fill={PAL.land} stroke={stroke} strokeWidth={strokeW} />
            {isMali && (
              <path d={c.path} fill={PAL.mali} stroke={PAL.maliStroke} strokeWidth={1.5} opacity={highlightMali} />
            )}
          </g>
        );
      })}
    </g>
  );
}

// Texte centre — SVG natif (jamais foreignObject en headless)
function GeoText({
  text,
  y,
  size = 52,
  color = PAL.cream,
  weight = "400",
  opacity = 1,
  letterSpacing = 0,
}: {
  text: string;
  y: number;
  size?: number;
  color?: string;
  weight?: string;
  opacity?: number;
  letterSpacing?: number;
}) {
  return (
    <text
      x={W / 2}
      y={y}
      textAnchor="middle"
      fill={color}
      fontSize={size}
      fontWeight={weight}
      fontFamily="'Playfair Display', 'Georgia', serif"
      opacity={opacity}
      letterSpacing={letterSpacing}
    >
      {text}
    </text>
  );
}

// ============================================================
// BEAT 01 : Ocean — Kling V5 clip + "1311" spring overlay
// Frames 0 → 197 (6.56s @ 30fps)
// Architecture : <Video muted> + SVG texte par-dessus
// Source clip : public/assets/geoafrique/beat01-v5-kling.mp4
// ============================================================
function Beat01Ocean() {
  const localFrame = useCurrentFrame();
  const beatDur = BEATS.ocean.end - BEATS.ocean.start;
  const op = beatFade(localFrame, beatDur, 0, XFADE);
  const localF = localFrame;

  // "1311" — spring pop entree, puis fade out a ~3s (frame 90)
  const spr = spring({ frame: localF, fps: FPS, config: { damping: 8, stiffness: 120 } });
  const fadeInOp = clampI(interpolate(localF, [0, 8], [0, 1]));
  const fadeOutOp = clampI(interpolate(localF, [70, 100], [1, 0]));
  const textOpacity = fadeInOp * fadeOutOp;
  const textScale = spr;

  // Gradient dore pour le "1311"
  const gradId = "beat01-goldGrad";

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208", opacity: op }}>
      {/* Clip Kling O3 pan ouest — zone ciel statique en haut = zone texte stable */}
      <OffthreadVideo
        src={staticFile("assets/geoafrique/beat01-o3-pan-B-14s.mp4")}
        startFrom={0}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Overlay SVG — "1311" ancre dans le ciel (top 18%) que Kling ne bouge pas */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F0D060" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#A07820" />
          </linearGradient>
          <filter id="beat01-textGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* "1311" — spring pop, fade out a ~3s (frame 70-100), zone ciel y=18% */}
        <text
          x={W / 2}
          y={H * 0.18}
          textAnchor="middle"
          fill={`url(#${gradId})`}
          fontSize={220}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="bold"
          opacity={textOpacity}
          filter="url(#beat01-textGlow)"
          transform={`translate(${W / 2},${H * 0.18}) scale(${textScale}) translate(${-W / 2},${-H * 0.18})`}
        >
          1311
        </text>
      </svg>
    </AbsoluteFill>
  );
}

// ============================================================
// BEAT 02 : Roi sur trone — Kling O3 zoom-in + pivot tete gauche
// Frames s(15.76) → s(28.80) = 473 → 864 (13s, 391 frames)
// Clip : beat02-o3-zoomin-v1.mp4 (10s, O3 start+end frame)
// Overlay : "ABOU BAKARI II" + "Mansa du Mali" fade in/out 0-3s (fond noir haut)
// ============================================================
function Beat02Empire() {
  const localFrame = useCurrentFrame();
  const beatDur = BEATS.empire.end - BEATS.empire.start;
  const fi = clampI(interpolate(localFrame, [0, XFADE], [0, 1]));
  const fo = clampI(interpolate(localFrame, [beatDur - XFADE, beatDur], [1, 0]));
  const op = Math.min(fi, fo);

  // Texte overlay : apparait frames 0-15, disparait frames 60-90 (avant orbit camera)
  const titleSpr = spring({ frame: localFrame, fps: FPS, config: { damping: 14, stiffness: 120 } });
  const subtitleOp = clampI(interpolate(localFrame, [15, 35], [0, 1]));
  const textFadeOut = clampI(interpolate(localFrame, [60, 90], [1, 0]));
  const titleOp = titleSpr * textFadeOut;
  const subOp = subtitleOp * textFadeOut;

  const gradId = "beat02-nameGrad";

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208", opacity: op }}>
      <OffthreadVideo
        src={staticFile("assets/geoafrique/beat02-o3-westlook-v1.mp4")}
        startFrom={0}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Overlay SVG — nom du roi ancre dans le fond noir du haut */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F0D060" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#A07820" />
          </linearGradient>
          <filter id="beat02-nameGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* "ABOU BAKARI II" — spring pop, disparait a 3s */}
        <text
          x={W / 2}
          y={H * 0.10}
          textAnchor="middle"
          fill={`url(#${gradId})`}
          fontSize={Math.round(titleSpr * 72)}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="bold"
          letterSpacing={6}
          opacity={titleOp}
          filter="url(#beat02-nameGlow)"
        >
          ABOU BAKARI II
        </text>

        {/* "Mansa du Mali — Roi des Rois" — fade in leger, disparait avant camera */}
        <text
          x={W / 2}
          y={H * 0.15}
          textAnchor="middle"
          fill={PAL.cream}
          fontSize={40}
          fontFamily="'Playfair Display', Georgia, serif"
          fontStyle="italic"
          opacity={subOp}
        >
          Mansa du Mali — Roi des Rois
        </text>
      </svg>
    </AbsoluteFill>
  );
}

// Centroides des 24 bateaux B2-GROUPED (espace SVG 2048x1152)
const BOAT_CENTROIDS_B2 = [
  {cx: 1920, cy: 190}, {cx: 1630, cy: 300}, {cx: 1300, cy: 400},
  {cx: 1930, cy: 400}, {cx: 1030, cy: 570}, {cx: 1630, cy: 560},
  {cx: 1950, cy: 590}, {cx: 730,  cy: 660}, {cx: 1310, cy: 640},
  {cx: 1080, cy: 810}, {cx: 1720, cy: 780}, {cx: 1350, cy: 840},
  {cx: 330,  cy: 840}, {cx: 650,  cy: 940}, {cx: 820,  cy: 1040},
  {cx: 1090, cy: 970}, {cx: 1840, cy: 940}, {cx: 1470, cy: 980},
  {cx: 370,  cy: 1030},{cx: 1240, cy: 1120},{cx: 520,  cy: 1120},
  {cx: 1590, cy: 1100},{cx: 1880, cy: 1100},{cx: 1980, cy: 1100},
];

// ============================================================
// BEAT 03 : Flotte — Kling O3 start+end frame (flotte -> pirogue solitaire)
// Frames BEATS.fleet.start -> BEATS.fleet.end (13.2s, 396 frames)
// Clip : beat03-o3-fleet-v3.mp4 (13s, O3 cfg_scale 0.4) — transition flotte->pirogue a 5s
// Overlay : "2 000 pirogues" disparait a 5s, "Un seul revient." spring a 8s
// ============================================================
function Beat03Fleet() {
  const localFrame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beatDur = BEATS.fleet.end - BEATS.fleet.start;
  const fi = clampI(interpolate(localFrame, [0, XFADE], [0, 1]));
  const fo = clampI(interpolate(localFrame, [beatDur - XFADE, beatDur], [1, 0]));
  const op = Math.min(fi, fo);

  // "2 000 pirogues" — fade in rapide, disparait a 5s avant la transition
  const fleetOp =
    clampI(interpolate(localFrame, [0, 20], [0, 1])) *
    clampI(interpolate(localFrame, [120, 150], [1, 0]));

  // "Un seul revient." — spring dramatique, arrive a ~8s avec la pirogue solitaire
  const spr1 = spring({ frame: Math.max(0, localFrame - 240), fps, config: { damping: 8, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208", opacity: op }}>
      <OffthreadVideo
        src={staticFile("assets/geoafrique/beat03-o3-fleet-v3.mp4")}
        startFrom={0}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* "2 000 pirogues" — zone ciel haut, disparait avant la transition */}
        <text
          x={W / 2}
          y={H * 0.12}
          textAnchor="middle"
          fill="#D4AF37"
          fontSize={72}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          opacity={fleetOp}
        >2 000 pirogues</text>

        {/* "Un seul revient." — spring rouge, arrive avec la pirogue solitaire */}
        <text
          x={W / 2}
          y={H * 0.88}
          textAnchor="middle"
          fill="#8B1A1A"
          fontSize={Math.round(spr1 * 68)}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          opacity={spr1}
        >Un seul revient.</text>
      </svg>
    </AbsoluteFill>
  );
}

// ============================================================
// BEAT 04 : Depart — Abou Bakari mene sa flotte vers l'ouest
// Frames BEATS.name.start -> BEATS.name.end (14.4s, 432 frames)
// Clip : beat04-kling-v2.mp4 (15s, O3 multi-shot, dolly out lent)
// Pas d'overlay texte — le clip se suffit
// ============================================================
function Beat04Name() {
  const localFrame = useCurrentFrame();
  const beatDur = BEATS.name.end - BEATS.name.start;
  const fi = clampI(interpolate(localFrame, [0, XFADE], [0, 1]));
  const fo = clampI(interpolate(localFrame, [beatDur - XFADE, beatDur], [1, 0]));
  const op = Math.min(fi, fo);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208", opacity: op }}>
      <OffthreadVideo
        src={staticFile("assets/geoafrique/beat04-kling-v2.mp4")}
        startFrom={0}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
}

// ============================================================
// BEAT 05 : Abdication — Mansa Moussa + Caravane de l'or
// Frames BEATS.abdication.start → BEATS.abdication.end (13.4s = 402 frames)
// Plan 1 (0-210f / 7s)  : beat05-moussa-grandeur-v3.mp4  — Dolly Out V3 Pro
// Plan 2 (210-402f / 6.4s) : beat05-plan2-caravan-v3.mp4  — Dolly In O3 cfg 0.3, 10s propres
// Overlay Plan 2 : "400 milliards de dollars" spring dans ciel sombre
// ============================================================
function Beat05Abdication() {
  const localF = useCurrentFrame();
  const beatDur = BEATS.abdication.end - BEATS.abdication.start; // 402 frames

  // Fade in/out global du beat
  const fi = clampI(interpolate(localF, [0, XFADE], [0, 1]));
  const fo = clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));
  const op = Math.min(fi, fo);

  // Plan 1 : frames 0-210 (7s)
  const plan1Dur = 210;
  const plan1FadeOut = clampI(interpolate(localF, [plan1Dur - XFADE, plan1Dur], [1, 0]));

  // Plan 2 : cross-fade avec Plan 1 — demarre a frame 190 (overlap 20f avec fade out Plan 1)
  const plan2Start = 190;
  const plan2Dur = 212; // jusqu'a la fin du beat (190+212=402)
  // Fade in Plan 2 pendant que Plan 1 fait son fade out (frames 190-210)
  const plan2FadeIn = clampI(interpolate(localF, [190, 210], [0, 1]));
  // Fade out plan 2 dans les 12 dernieres frames
  const plan2FadeOut = clampI(interpolate(localF, [390, 402], [1, 0]));
  const plan2Op = plan2FadeIn * plan2FadeOut;

  // Overlay "400 milliards" — apparait a ~2s dans Plan 2 (frame 270 beat global = frame 60 local)
  const overlayDelay = plan2Start + 60;
  const overlaySpr = spring({
    frame: Math.max(0, localF - overlayDelay),
    fps: FPS,
    config: { damping: 14, stiffness: 80 },
  });
  const overlayFadeOut = clampI(interpolate(localF, [390, 402], [1, 0]));
  const overlayOp = overlaySpr * overlayFadeOut;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208", opacity: op }}>
      {/* Plan 1 — Mansa Moussa sur le trone — Dolly Out */}
      <AbsoluteFill style={{ opacity: plan1FadeOut }}>
        <OffthreadVideo
          src={staticFile("assets/geoafrique/beat05-moussa-grandeur-v3.mp4")}
          startFrom={0}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Plan 2 — Caravane de l'or — Dolly In, demarre a frame 210 du beat */}
      <Sequence from={plan2Start} durationInFrames={plan2Dur}>
        <AbsoluteFill style={{ opacity: plan2Op }}>
          <OffthreadVideo
            src={staticFile("assets/geoafrique/beat05-plan2-caravan-v3.mp4")}
            startFrom={0}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Overlay "400 milliards de dollars" — ancre dans le ciel sombre en haut */}
          <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="beat05-goldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F0D060" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#A07820" />
              </linearGradient>
              <filter id="beat05-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ligne 1 : chiffre principal */}
            <text
              x={W / 2}
              y={H * 0.10}
              textAnchor="middle"
              fill="url(#beat05-goldGrad)"
              fontSize={Math.round(overlaySpr * 96)}
              fontFamily="'Playfair Display', Georgia, serif"
              fontWeight="bold"
              opacity={overlayOp}
              filter="url(#beat05-glow)"
            >
              400 milliards
            </text>

            {/* Ligne 2 : sous-titre */}
            <text
              x={W / 2}
              y={H * 0.16}
              textAnchor="middle"
              fill={PAL.cream}
              fontSize={Math.round(overlaySpr * 44)}
              fontFamily="'Playfair Display', Georgia, serif"
              fontStyle="italic"
              opacity={overlayOp * 0.85}
            >
              de dollars
            </text>
          </svg>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}

// ============================================================
// BEAT 06 : Obsession — silhouette roi regarde l'ouest
// Frames BEATS.obsession.start → BEATS.obsession.end (6.0s = 180 frames)
// Clip Kling V3 Standard locked (5s) + fade hold sur derniere seconde
// Overlay Remotion : mot "OUEST" + texte obsession
// ============================================================
function Beat06Obsession() {
  const localF = useCurrentFrame();
  const beatDur = BEATS.obsession.end - BEATS.obsession.start; // 180 frames

  // Fade in/out global
  const fi = clampI(interpolate(localF, [0, XFADE], [0, 1]));
  const fo = clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));
  const op = Math.min(fi, fo);

  // Clip Kling 5s (150f) — on le freeze sur la derniere frame pour les 30f restantes
  // durationInFrames=150 + le clip reste visible jusqu'a beatDur via le fade out
  const clipOp = clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));

  // Overlay "OUEST" — apparait a ~1.5s (frame 45), grandit lentement en opacite
  const ouestOp = clampI(interpolate(localF, [45, 90], [0, 0.18]));

  // Overlay texte narratif — apparait a ~2s (frame 60)
  const textSpr = spring({
    frame: Math.max(0, localF - 60),
    fps: FPS,
    config: { damping: 20, stiffness: 80 },
  });
  const textFadeOut = clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));
  const textOp = textSpr * textFadeOut;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208", opacity: op }}>
      {/* Clip Kling — silhouette roi + vagues interieures animees */}
      <AbsoluteFill style={{ opacity: clipOp }}>
        <Sequence from={0} durationInFrames={150}>
          <OffthreadVideo
            src={staticFile("assets/geoafrique/beat06-obsession-v1.mp4")}
            startFrom={0}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      </AbsoluteFill>

      {/* Overlay SVG */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {/* "OUEST" fantome — dans le ciel etoile en haut a gauche */}
        <text
          x={W * 0.38}
          y={H * 0.22}
          textAnchor="middle"
          fill={PAL.gold}
          fontSize={120}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          opacity={ouestOp}
          letterSpacing={12}
        >
          OUEST
        </text>
      </svg>
    </AbsoluteFill>
  );
}

// ============================================================
// BEAT 07 : Colomb — caravelle froide + overlays
// Frames BEATS.colomb.start → BEATS.colomb.end (6.4s = 192 frames)
// Clip Kling V3 Standard dolly in (5s) + overlays texte Remotion
// ============================================================
function Beat07Colomb() {
  const localF = useCurrentFrame();
  const beatDur = BEATS.colomb.end - BEATS.colomb.start; // 192 frames

  const fi = clampI(interpolate(localF, [0, XFADE], [0, 1]));
  const fo = clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));
  const op = Math.min(fi, fo);

  // Clip 5s (150f), freeze sur derniere frame pour les 42f restantes
  const clipOp = clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));

  // "181 ANS PLUS TARD" — apparait a frame 20, spring
  const titre181Spr = spring({ frame: Math.max(0, localF - 20), fps: FPS, config: { damping: 200 } });
  const titre181Op = titre181Spr * clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));

  // "Christophe Colomb" — apparait a frame 60
  const colombOp = clampI(interpolate(localF, [60, 90], [0, 1])) *
    clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));

  // "le decouvreur." — apparait a frame 110, ironique
  const decouvOp = clampI(interpolate(localF, [110, 140], [0, 1])) *
    clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));

  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1f2a", opacity: op }}>
      {/* Clip Kling — caravelle froide dolly in */}
      <AbsoluteFill style={{ opacity: clipOp }}>
        <Sequence from={0} durationInFrames={150}>
          <OffthreadVideo
            src={staticFile("assets/geoafrique/beat07-colomb-v1.mp4")}
            startFrom={0}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      </AbsoluteFill>

      {/* Overlays SVG */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {/* "181 ANS PLUS TARD" — grand, sobre, en haut */}
        <text
          x={W / 2}
          y={H * 0.14}
          textAnchor="middle"
          fill={PAL.cream}
          fontSize={Math.round(titre181Spr * 72)}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="400"
          fontStyle="italic"
          opacity={titre181Op * 0.85}
        >
          181 ans plus tard
        </text>

        {/* "Christophe Colomb" — milieu, froid */}
        <text
          x={W / 2}
          y={H * 0.86}
          textAnchor="middle"
          fill={PAL.cream}
          fontSize={54}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="600"
          opacity={colombOp}
        >
          Christophe Colomb
        </text>

        {/* "le decouvreur." — ironique, or froid */}
        <text
          x={W / 2}
          y={H * 0.92}
          textAnchor="middle"
          fill="#8090b0"
          fontSize={48}
          fontFamily="'Playfair Display', Georgia, serif"
          fontStyle="italic"
          opacity={decouvOp}
        >
          le "decouvreur".
        </text>
      </svg>
    </AbsoluteFill>
  );
}

// ============================================================
// BEAT 08 : Split Screen — Abou Bakari vs Colomb
// Frames BEATS.close.start → BEATS.close.end (4s = 120 frames)
// Gauche : silhouette roi (beat06 clip) — Droite : caravelle (beat07 clip)
// Ligne dorée verticale — dates — question finale
// ============================================================
function Beat08Close() {
  const localF = useCurrentFrame();
  const beatDur = BEATS.close.end - BEATS.close.start; // 120 frames

  const fi = clampI(interpolate(localF, [0, XFADE], [0, 1]));
  const fo = clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));
  const op = Math.min(fi, fo);

  // Ligne dorée — apparait en premier, rapide
  const lineOp = clampI(interpolate(localF, [0, 20], [0, 1]));

  // Dates — apparaissent a frame 15
  const datesOp = clampI(interpolate(localF, [15, 35], [0, 1])) *
    clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));

  // Question centrale — spring a frame 40
  const questionSpr = spring({
    frame: Math.max(0, localF - 40),
    fps: FPS,
    config: { damping: 14, stiffness: 80 },
  });
  const questionOp = questionSpr * clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));

  const HALF = W / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208", opacity: op }}>
      {/* Gauche — silhouette Abou Bakari (moitie droite du clip Beat06 = la silhouette) */}
      <div style={{ position: "absolute", top: 0, left: 0, width: HALF, height: H, overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("assets/geoafrique/beat06-obsession-v1.mp4")}
          startFrom={0}
          muted
          style={{ position: "absolute", top: 0, left: -HALF, width: W, height: H, objectFit: "cover" }}
        />
      </div>

      {/* Droite — caravelle Colomb (clip Beat07) */}
      <div style={{ position: "absolute", top: 0, left: HALF, width: HALF, height: H, overflow: "hidden" }}>
        <OffthreadVideo
          src={staticFile("assets/geoafrique/beat07-colomb-v1.mp4")}
          startFrom={0}
          muted
          style={{ position: "absolute", top: 0, left: -HALF, width: W, height: H, objectFit: "cover" }}
        />
      </div>

      {/* Overlays SVG */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {/* Ligne dorée verticale au centre */}
        <line
          x1={HALF}
          y1={0}
          x2={HALF}
          y2={H}
          stroke={PAL.gold}
          strokeWidth={2}
          opacity={lineOp}
        />

        {/* Date gauche — 1311 */}
        <text
          x={HALF * 0.5}
          y={H * 0.88}
          textAnchor="middle"
          fill={PAL.amber}
          fontSize={56}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          opacity={datesOp}
        >
          1311
        </text>

        {/* Date droite — 1492 */}
        <text
          x={HALF + HALF * 0.5}
          y={H * 0.88}
          textAnchor="middle"
          fill="#8090b0"
          fontSize={56}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          opacity={datesOp}
        >
          1492
        </text>

        {/* Question finale — a cheval sur la ligne */}
        <text
          x={HALF}
          y={H * 0.50}
          textAnchor="middle"
          fill={PAL.cream}
          fontSize={Math.round(questionSpr * 52)}
          fontFamily="'Playfair Display', Georgia, serif"
          fontStyle="italic"
          opacity={questionOp}
        >
          Qui a traverse en premier ?
        </text>
      </svg>
    </AbsoluteFill>
  );
}

// ============================================================
// BEAT 09 : CTA — Call to Action
// Frames BEATS.cta.start → BEATS.cta.end (5.76s = 173 frames)
// Fond amber/or, texte spring, audio beat09-cta.mp3
// ============================================================
function Beat09CTA() {
  const localF = useCurrentFrame();
  const beatDur = BEATS.cta.end - BEATS.cta.start; // 173 frames

  const fi = clampI(interpolate(localF, [0, XFADE], [0, 1]));
  const fo = clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));
  const op = Math.min(fi, fo);

  // Ligne decorative — apparait a frame 10
  const lineOp = clampI(interpolate(localF, [10, 30], [0, 1]));

  // Ligne 1 : "Si cette histoire t'a surpris" — spring frame 20
  const line1Spr = spring({ frame: Math.max(0, localF - 20), fps: FPS, config: { damping: 18, stiffness: 90 } });
  const line1Op = line1Spr * clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));

  // Ligne 2 : "laisse un commentaire" — spring frame 45
  const line2Spr = spring({ frame: Math.max(0, localF - 45), fps: FPS, config: { damping: 18, stiffness: 90 } });
  const line2Op = line2Spr * clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));

  // Ligne 3 : "abonne-toi" — spring frame 80
  const line3Spr = spring({ frame: Math.max(0, localF - 80), fps: FPS, config: { damping: 18, stiffness: 90 } });
  const line3Op = line3Spr * clampI(interpolate(localF, [beatDur - XFADE, beatDur], [1, 0]));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0804", opacity: op }}>
      {/* Audio CTA */}
      <Audio src={staticFile("audio/abou-bakari/beat09-cta.mp3")} />

      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* Fond amber tres sombre */}
        <rect x={0} y={0} width={W} height={H} fill="#0a0804" />

        {/* Ligne decorative horizontale */}
        <line
          x1={100} y1={H * 0.38}
          x2={W - 100} y2={H * 0.38}
          stroke={PAL.gold}
          strokeWidth={1.5}
          opacity={lineOp * 0.5}
        />
        <line
          x1={100} y1={H * 0.62}
          x2={W - 100} y2={H * 0.62}
          stroke={PAL.gold}
          strokeWidth={1.5}
          opacity={lineOp * 0.5}
        />

        {/* Ligne 1 */}
        <text
          x={W / 2}
          y={H * 0.44}
          textAnchor="middle"
          fill={PAL.cream}
          fontSize={Math.round(line1Spr * 48)}
          fontFamily="'Playfair Display', Georgia, serif"
          fontStyle="italic"
          opacity={line1Op * 0.9}
        >
          Si cette histoire t'a surpris,
        </text>

        {/* Ligne 2 */}
        <text
          x={W / 2}
          y={H * 0.50}
          textAnchor="middle"
          fill={PAL.gold}
          fontSize={Math.round(line2Spr * 56)}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          opacity={line2Op}
        >
          laisse un commentaire.
        </text>

        {/* Separateur */}
        <text
          x={W / 2}
          y={H * 0.565}
          textAnchor="middle"
          fill={PAL.amber}
          fontSize={32}
          fontFamily="'Playfair Display', Georgia, serif"
          opacity={line2Op * 0.6}
        >
          — et —
        </text>

        {/* Ligne 3 */}
        <text
          x={W / 2}
          y={H * 0.615}
          textAnchor="middle"
          fill={PAL.gold}
          fontSize={Math.round(line3Spr * 64)}
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          opacity={line3Op}
        >
          abonne-toi.
        </text>
      </svg>
    </AbsoluteFill>
  );
}

// ============================================================
// Composant Principal — Option B : AbsoluteFill par beat
// Tous les beats sont superposés, chacun gère sa propre opacité
// ============================================================
// "Et toi ? Tu savais ca ?" commence a 81.08s = frame 2432
// Fade out sur 20 frames (81.08s -> 81.75s) pour muter proprement
const MUTE_START = Math.round(80.60 * FPS); // 2418 — juste avant "Et toi"
const MUTE_END = Math.round(80.60 * FPS) + 15; // 2433 — fade rapide

export const AbouBakariShort: React.FC = () => {
  const countries = useMapData();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050208" }}>
      <Sequence from={0} premountFor={30}>
        <Audio
          src={staticFile("audio/abou-bakari/abou-bakari-v5-full.mp3")}
          volume={(f) => interpolate(f, [MUTE_START, MUTE_END], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      </Sequence>
      <Sequence from={BEATS.ocean.start}>
        <Beat01Ocean />
      </Sequence>
      <Sequence from={BEATS.empire.start}>
        <Beat02Empire />
      </Sequence>
      <Sequence from={BEATS.fleet.start}>
        <Beat03Fleet />
      </Sequence>
      <Sequence from={BEATS.name.start}>
        <Beat04Name />
      </Sequence>
      <Sequence from={BEATS.abdication.start}>
        <Beat05Abdication />
      </Sequence>
      <Sequence from={BEATS.obsession.start}>
        <Beat06Obsession />
      </Sequence>
      <Sequence from={BEATS.colomb.start}>
        <Beat07Colomb />
      </Sequence>
      <Sequence from={BEATS.close.start}>
        <Beat08Close />
      </Sequence>
      <Sequence from={BEATS.cta.start}>
        <Beat09CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
