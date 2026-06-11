// Beat4Climax — "Le Bouclier du Sahara" v6 (2026-05-17)
// v6 : route pointillée animée (remplace bateau), caravane corrigée dans le Sahara,
//      tailles uniformisées, flèche de direction, Phase G overlay texte.

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AtlasMercator, AtlasPulseMarker } from "../_shared/atlas-components";
import { BEATS, STATS, ROUTES, PIVOTS } from "./timing";
import {
  WIDTH as W,
  HEIGHT as H,
  STATIONS,
  INHERITED_FROM_BEAT2,
  PALETTE,
  cameraTo,
  makeMapCoord,
  MERC_LARGE,
  ISO_PLAGUE,
} from "./mapConfig";

const {
  OCEAN, MALI_GOLD, PLAGUE_RED, PLAGUE_RED_BRIGHT,
  PARCHMENT, PARCHMENT_DARK, PARCHMENT_INK,
} = PALETTE;

const ISO_MALI_ZONE = new Set([
  "MLI", "SEN", "GMB", "GNB", "GIN", "BFA", "NER", "MRT",
  "GHA", "CIV", "TGO", "BEN", "NGA",
]);

const ISO_SUBSAHARAN_SAFE = new Set([
  "MLI", "SEN", "GMB", "GNB", "GIN", "BFA", "NER", "MRT",
  "GHA", "CIV", "TGO", "BEN", "NGA", "CMR", "CAF", "TCD",
  "SDN", "ETH", "ERI", "DJI", "SOM", "KEN", "UGA", "TZA",
  "RWA", "BDI", "MOZ", "ZMB", "ZWE", "BWA", "NAM", "ZAF",
  "AGO", "COD", "COG", "GAB", "GNQ",
]);

const ISO_SAHARA = ["DZA", "LBY", "TUN", "MAR", "ESH", "MRT", "MLI", "NER", "TCD", "SDN"];

// Frontière contrastée sur les zones or (le stroke MALI_GOLD se fondait dans le fill).
const GOLD_BORDER = "#7a4e10";

const PLAGUE_PROPAGATION_ORDER = [
  "UKR", "GRC", "ITA", "ESP", "PRT", "FRA",
  "BEL", "NLD", "GBR", "IRL", "DEU", "DNK",
  "SWE", "NOR", "POL", "AUT", "CHE",
];

// ─── STAT PARCHEMIN ──────────────────────────────────────────────────────────

interface StatParchmentProps {
  x: number; y: number;
  bigText: string; subText: string;
  appearAt: number; hideAt: number; localF: number;
  accent?: string; width?: number; height?: number; bigSize?: number;
}

const StatParchment: React.FC<StatParchmentProps> = ({
  x, y, bigText, subText, appearAt, hideAt, localF,
  accent = PLAGUE_RED, width = 205, height = 84, bigSize = 42,
}) => {
  if (localF < appearAt - 5 || localF > hideAt + 18) return null;
  const slideIn = interpolate(localF, [appearAt, appearAt + 15], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeIn  = interpolate(localF, [appearAt, appearAt + 15], [0, 1],  { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(localF, [hideAt, hideAt + 18], [1, 0],      { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);
  const glow    = interpolate(localF, [appearAt, appearAt + 6, appearAt + 18], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g transform={`translate(${x} ${y + slideIn})`} opacity={opacity}>
      <rect x={-4} y={-4} width={width + 8} height={height + 8} fill={accent} fillOpacity={glow * 0.35} rx={6} />
      <rect x={0} y={0} width={width} height={height} fill={PARCHMENT_INK} rx={3} />
      <rect x={2} y={2} width={width - 4} height={height - 4} fill={PARCHMENT} rx={2} />
      <g opacity={0.08}>
        {[...Array(7)].map((_, i) => (
          <line key={i} x1={i * 30} y1={0} x2={i * 30 - 40} y2={height} stroke={PARCHMENT_INK} strokeWidth={0.5} />
        ))}
      </g>
      <line x1={10} y1={8} x2={width - 10} y2={8} stroke={PARCHMENT_DARK} strokeWidth={0.8} />
      <line x1={10} y1={height - 8} x2={width - 10} y2={height - 8} stroke={PARCHMENT_DARK} strokeWidth={0.8} />
      <text x={width / 2} y={height * 0.58} textAnchor="middle" fill={accent} fontSize={bigSize}
            fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700}>{bigText}</text>
      <text x={width / 2} y={height - 14} textAnchor="middle" fill={PARCHMENT_INK} fontSize={11}
            fontFamily="Georgia, 'Times New Roman', serif" letterSpacing={1.5} fontWeight={600}>{subText}</text>
    </g>
  );
};

// ─── ROUTE POINTILLÉE ANIMÉE ─────────────────────────────────────────────────
// Se dessine progressivement d'un point à un autre (coords écran)

interface AnimatedRouteProps {
  fromX: number; fromY: number;
  toX: number; toY: number;
  startAt: number; endAt: number; localF: number;
  color?: string; dashArray?: string; strokeWidth?: number;
  glowColor?: string;
}

const AnimatedRoute: React.FC<AnimatedRouteProps> = ({
  fromX, fromY, toX, toY,
  startAt, endAt, localF,
  color = "#e8823a", dashArray = "10 5", strokeWidth = 3.5,
  glowColor,
}) => {
  if (localF < startAt - 3 || localF > endAt + 20) return null;
  const progress = interpolate(localF, [startAt, endAt], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  if (progress <= 0) return null;
  const ex = fromX + (toX - fromX) * progress;
  const ey = fromY + (toY - fromY) * progress;
  const opacity = interpolate(localF, [startAt, startAt + 10, endAt - 10, endAt + 20], [0, 0.85, 0.85, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const gc = glowColor ?? color;
  return (
    <g opacity={opacity}>
      {/* Lueur */}
      <line x1={fromX} y1={fromY} x2={ex} y2={ey}
            stroke={gc} strokeWidth={strokeWidth + 4} strokeOpacity={0.25}
            strokeDasharray={dashArray} />
      {/* Ligne principale */}
      <line x1={fromX} y1={fromY} x2={ex} y2={ey}
            stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            style={{ filter: `drop-shadow(0px 0px 3px ${gc})` }} />
      {/* Pointe de flèche à l'extrémité */}
      {progress > 0.1 && (() => {
        const angle = Math.atan2(ey - fromY, ex - fromX) * 180 / Math.PI;
        return (
          <polygon
            points="-7,-4 6,0 -7,4"
            transform={`translate(${ex} ${ey}) rotate(${angle})`}
            fill={color}
            opacity={Math.min(1, progress * 5)}
          />
        );
      })()}
    </g>
  );
};

// ─── RAT EN MOUVEMENT ────────────────────────────────────────────────────────

interface RatMovingProps {
  startX: number; startY: number;
  endX: number; endY: number;
  appearAt: number; hideAt: number; localF: number;
  walkPhaseOffset?: number; lateralOffset?: number;
}

const RAT_FRAMES = 4;
const RAT_TICK   = 5;

const RatMoving: React.FC<RatMovingProps> = ({
  startX, startY, endX, endY,
  appearAt, hideAt, localF,
  walkPhaseOffset = 0, lateralOffset = 0,
}) => {
  if (localF < appearAt - 3 || localF > hideAt + 12) return null;
  const lf = Math.max(0, localF - appearAt);

  const spriteScale = interpolate(lf, [0, 10, 35], [0, 2.4, 1.5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const progress = interpolate(localF, [appearAt, hideAt], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const px = startX + (endX - startX) * progress;
  const py = startY + (endY - startY) * progress + lateralOffset;
  const hop = Math.abs(Math.sin(localF * 0.38 + walkPhaseOffset)) * 5 * Math.min(1, progress * 8);

  const fadeIn  = interpolate(lf, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(localF, [hideAt - 8, hideAt + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);

  const frameIdx = Math.floor(Math.max(0, localF + walkPhaseOffset * 3) / RAT_TICK) % RAT_FRAMES;
  const frameStr = String(frameIdx).padStart(3, "0");
  const W_RAT = 44, H_RAT = 32;

  return (
    <g transform={`translate(${px} ${py - hop})`} opacity={opacity}>
      <image
        href={staticFile(`atlas/peste-1347/assets/objects/rat-anim/frame_${frameStr}.png`)}
        x={-W_RAT * spriteScale / 2}
        y={-H_RAT * spriteScale}
        width={W_RAT * spriteScale}
        height={H_RAT * spriteScale}
        style={{ imageRendering: "pixelated" }}
      />
    </g>
  );
};

// ─── SPRITE WALK GÉNÉRIQUE ───────────────────────────────────────────────────

interface WalkSpriteProps {
  basePath: string;
  frameCount: number;
  x: number; y: number;
  spriteW: number; spriteH: number;
  scale: number;
  localF: number;
  tickRate?: number;
  phaseOffset?: number;
  opacity?: number;
}

const WalkSprite: React.FC<WalkSpriteProps> = ({
  basePath, frameCount, x, y, spriteW, spriteH, scale,
  localF, tickRate = 5, phaseOffset = 0, opacity = 1,
}) => {
  const frameIdx = Math.floor(Math.max(0, localF + phaseOffset) / tickRate) % frameCount;
  const frameStr = String(frameIdx).padStart(3, "0");
  const hop = Math.abs(Math.sin((localF + phaseOffset) * 0.25)) * 2.5;
  return (
    <g transform={`translate(${x} ${y - hop})`} opacity={opacity}>
      <image
        href={staticFile(`${basePath}/frame_${frameStr}.png`)}
        x={-spriteW * scale / 2}
        y={-spriteH * scale}
        width={spriteW * scale}
        height={spriteH * scale}
        style={{ imageRendering: "pixelated" }}
      />
    </g>
  );
};

// ─── CARAVANE — file en mouvement sur le Sahara ──────────────────────────────
// Taille unitaire : tous les membres normalisés à ~32px de hauteur finale (scale * spriteH ≈ 32)
// Traversée : ouest du Sahara → est, en espace SVG (avant mc())

// Normalisation : chameaux et personnages à hauteur finale comparable
// berbère: h=40 * scale=2.8 = 112px
// chameau: h=40 * scale=1.8 = 72px (chameaux plus larges mais similaires visuellement)
const SCALE_PERSO   = 2.8;
const SCALE_CHAMEAU = 1.8;

const CARAVANE_MEMBERS = [
  {
    path: "empire-ghana/characters/berbere/animations/walking-b8b230ef/east",
    frames: 6, w: 24, h: 40, tick: 5, phase: 0, scale: SCALE_PERSO,
  },
  {
    path: "empire-ghana/assets/pixellab/chameau/walking/east",
    frames: 4, w: 48, h: 40, tick: 7, phase: 0, scale: SCALE_CHAMEAU,
  },
  {
    path: "empire-ghana/characters/sahelien/animations/walking-3848d070/east",
    frames: 6, w: 22, h: 38, tick: 5, phase: 9, scale: SCALE_PERSO,
  },
  {
    path: "empire-ghana/assets/pixellab/chameau/walking/east",
    frames: 4, w: 48, h: 40, tick: 7, phase: 6, scale: SCALE_CHAMEAU,
  },
] as const;

const CARAVANE_GAP = 48; // pixels entre membres (espace écran)

interface CaravaneProps {
  // Coords en espace ÉCRAN (après mc())
  startScreenX: number; endScreenX: number; screenY: number;
  appearAt: number; hideAt: number; localF: number;
}

const Caravane: React.FC<CaravaneProps> = ({
  startScreenX, endScreenX, screenY, appearAt, hideAt, localF,
}) => {
  if (localF < appearAt - 5 || localF > hideAt + 20) return null;

  // Easing ease-in-out : départ lent (la caravane s'ébranle), glisse, ralentit à l'arrivée.
  // Mouvement naturel d'une marche (retour : éviter la vitesse linéaire robotique).
  const progress = interpolate(localF, [appearAt, hideAt], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.6, 1),
  });
  const baseX = startScreenX + (endScreenX - startScreenX) * progress;

  const fadeIn  = interpolate(localF, [appearAt, appearAt + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(localF, [hideAt - 15, hideAt + 15], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);

  // TRACE DE PROGRESSION — chemin doré qui se dessine du DÉPART à la position courante.
  // Remplace le triangle (trop géométrique) : la caravane "trace" sa route dans le sable.
  // Dégradé d'opacité = la trace s'estompe vers le départ (sable qui efface les pas).
  const tailX = startScreenX - 4.5 * CARAVANE_GAP; // derrière le dernier membre
  const traceHeadX = baseX - 8;                      // juste derrière la tête de file
  const traceLen = Math.max(1, traceHeadX - tailX);

  return (
    <g opacity={opacity}>
      <defs>
        <linearGradient id="caravaneTrail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={MALI_GOLD} stopOpacity={0} />
          <stop offset="70%" stopColor={MALI_GOLD} stopOpacity={0.4} />
          <stop offset="100%" stopColor="#ffe7a0" stopOpacity={0.85} />
        </linearGradient>
      </defs>
      {/* Trace parcourue : trait dégradé qui s'efface vers le départ */}
      <rect
        x={tailX} y={screenY + 1}
        width={traceLen} height={2.5}
        rx={1.25}
        fill="url(#caravaneTrail)"
        opacity={opacity * 0.8}
      />
      {/* Petits points de halte le long du chemin (pas dans le sable) */}
      {[0.3, 0.55, 0.8].map((t, i) => (
        <circle key={i}
          cx={tailX + traceLen * t} cy={screenY + 2}
          r={1.6}
          fill={MALI_GOLD}
          opacity={opacity * 0.5}
        />
      ))}

      {/* Membres de la file */}
      {CARAVANE_MEMBERS.map((m, i) => (
        <WalkSprite
          key={i}
          basePath={m.path}
          frameCount={m.frames}
          x={baseX - i * CARAVANE_GAP}
          y={screenY}
          spriteW={m.w}
          spriteH={m.h}
          scale={m.scale}
          localF={localF}
          tickRate={m.tick}
          phaseOffset={m.phase}
          opacity={1}
        />
      ))}
    </g>
  );
};

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────

export const Beat4Climax: React.FC = () => {
  const frame = useCurrentFrame();

  const beatStart = BEATS.CLIMAX_START;
  const beatEnd   = BEATS.CLIMAX_END;
  const beatDur   = beatEnd - beatStart;
  const localF    = frame;

  // ── Frames locales ────────────────────────────────────────────────────────
  const F_RATS      = 0;
  const F_ROUTES    = ROUTES.ROUTES_MARITIMES - beatStart;   // 124
  const F_VOICI     = PIVOTS.VOICI - beatStart;              // 193
  const F_TRAVERSER = STATS.TRAVERSER - beatStart;           // 261
  const F_DEUX_SIX  = STATS.DEUX_SIX_JOURS - beatStart;     // 464
  const F_CARAVANE_START = F_TRAVERSER;                      // 261
  const F_CARAVANE_END   = 720;
  const F_AU_SUD    = 855;
  const F_UN_DESERT = 1016;
  const F_MALI_APPEAR = F_AU_SUD;

  // ── CAMÉRA — 4 phases ────────────────────────────────────────────────────
  // Helper : viser un point SVG BRUT (pas une station nommée) à un zoom donné.
  // Reproduit la formule cameraTo : driftX = (CENTER.x - pointX) * scale.
  const CAM_CENTER_X = 360, CAM_CENTER_Y = 640;
  const camToPoint = (px: number, py: number, scale: number, dx = 0, dy = 0) => ({
    scale,
    driftX: (CAM_CENTER_X - px) * scale + dx,
    driftY: (CAM_CENTER_Y - py) * scale + dy,
  });

  const camMed       = cameraTo("SICILE", 1.20, { dx: -30, dy: 20 });
  const camSahara    = cameraTo("MAGHREB", 1.45, { dx: 10, dy: -50 });
  // ZOOM AGRESSIF sur la caravane : centré sur le trajet (y=630), zoom 2.5.
  // La caméra SUIT la caravane : cible le point d'ENTRÉE en début de traversée,
  // le point de SORTIE en fin → translation horizontale = sensation de marche.
  const CARAVANE_Y_CAM = 630;
  const camCaravaneIn  = camToPoint(295, CARAVANE_Y_CAM, 2.5);   // début traversée (ouest)
  const camCaravaneOut = camToPoint(415, CARAVANE_Y_CAM, 2.5);   // fin traversée (est)
  const camContraste = { scale: 0.95, driftX: 0, driftY: 30 };

  const camFrames = [
    0, 30,
    F_VOICI, F_VOICI + 60,
    F_CARAVANE_START, F_CARAVANE_START + 60,
    F_CARAVANE_END, F_CARAVANE_END + 60,
    beatDur,
  ];
  const camScaleVals = [
    INHERITED_FROM_BEAT2.scale, camMed.scale,
    camMed.scale, camSahara.scale,
    camSahara.scale, camCaravaneIn.scale,
    camCaravaneOut.scale, camContraste.scale,
    camContraste.scale,
  ];
  const driftXVals = [
    INHERITED_FROM_BEAT2.driftX, camMed.driftX,
    camMed.driftX, camSahara.driftX,
    camSahara.driftX, camCaravaneIn.driftX,
    camCaravaneOut.driftX, camContraste.driftX,
    camContraste.driftX,
  ];
  const driftYVals = [
    INHERITED_FROM_BEAT2.driftY, camMed.driftY,
    camMed.driftY, camSahara.driftY,
    camSahara.driftY, camCaravaneIn.driftY,
    camCaravaneOut.driftY, camContraste.driftY,
    camContraste.driftY,
  ];

  const camScale = interpolate(localF, camFrames, camScaleVals, { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const driftX   = interpolate(localF, camFrames, driftXVals,   { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const driftY   = interpolate(localF, camFrames, driftYVals,   { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const mc = makeMapCoord(camScale, driftX, driftY);

  // ── Coords POI en espace écran ───────────────────────────────────────────
  const [sicileX, sicileY]   = mc(STATIONS.SICILE.x, STATIONS.SICILE.y);
  const [caffaX, caffaY]     = mc(STATIONS.CAFFA.x, STATIONS.CAFFA.y);
  const [maghrebX, maghrebY] = mc(STATIONS.MAGHREB.x, STATIONS.MAGHREB.y);

  // ── Routes maritimes — coords écran (points SVG fixes → transformés par mc) ─
  // Segment 1 : Caffa → Sicile
  // Segment 2 : Sicile → Maghreb  (commence à F_ROUTES)
  const routeSeg1Start = F_RATS + 5;
  const routeSeg1End   = F_ROUTES;
  const routeSeg2Start = F_ROUTES;
  const routeSeg2End   = F_VOICI - 10;

  // ── Caravane — coordonnées en espace SVG brut, transformées par mc() ─────
  // Départ : côte atlantique marocaine (x=165, y=570 dans SVG 720×1280)
  // Arrivée : Libye/Tunisie (x=390, y=572) — traversée horizontale du Sahara
  // Y légèrement en dessous du Maghreb (y=556) pour rester dans le désert
  // Sahara central — coordonnées SVG brutes (espace 720×1280 non transformé)
  // Maghreb est à x=235, y=556. Le Sahara central est à droite et en dessous.
  // Algérie centrale ≈ (300, 620), Niger ≈ (390, 660)
  // La caravane part d'Algérie ouest et traverse vers l'est
  const SVG_CARAVANE_WEST_X = 250;
  const SVG_CARAVANE_EAST_X = 460;
  const SVG_CARAVANE_Y      = 630; // Sahara central, entre Maghreb et Sahel

  const [caravaneStartX, caravaneStartY] = mc(SVG_CARAVANE_WEST_X, SVG_CARAVANE_Y);
  const [caravaneEndX]                   = mc(SVG_CARAVANE_EAST_X, SVG_CARAVANE_Y);

  // ── Propagation progressive de la Peste ──────────────────────────────────
  const PROP_INTERVAL = 14;
  const plagueOpacities: Record<string, number> = {};
  PLAGUE_PROPAGATION_ORDER.forEach((iso, i) => {
    const startF = F_RATS + i * PROP_INTERVAL;
    plagueOpacities[iso] = interpolate(localF, [startF, startF + 25], [0, 0.65], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });
  });

  // Phase G — Europe pulsante (bat comme un cœur malade)
  const europeBase = interpolate(localF, [F_AU_SUD, F_AU_SUD + 45], [0, 0.55], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const europePulse = europeBase > 0.01
    ? europeBase * (Math.sin(localF / 8) * 0.18 + 0.82)
    : 0;

  // Mali — or stable, immobile (contraste intentionnel)
  const maliGlowOpacity = interpolate(localF, [F_MALI_APPEAR, F_MALI_APPEAR + 45], [0, 0.65], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Sahara highlight or
  const saharaOpacity = interpolate(localF,
    [F_TRAVERSER, F_TRAVERSER + 40, F_CARAVANE_END + 60, beatDur],
    [0, 0.70, 0.70, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );


  // ── Highlights Mali de base ───────────────────────────────────────────────
  const highlightFills: Record<string, string> = {};
  ISO_MALI_ZONE.forEach((iso) => { highlightFills[iso] = MALI_GOLD; });

  // ── Slots cartouches ──────────────────────────────────────────────────────
  const CARD_X = Math.max(20, Math.min(W - 220, maghrebX - 105));
  const CARD_Y = Math.max(60, Math.min(H - 110, maghrebY - 160));

  // ── CERCLE DE PROPAGATION — Phase G finale ───────────────────────────────
  // Démarre après la caravane disparue, centré sur Sicile (point d'entrée historique)
  // Clippé au nord du Sahara — monte vers l'Europe uniquement
  // Math précalculée : distances en espace écran avec camContraste (scale=0.95, driftY=30)
  const F_WAVE_START = F_CARAVANE_END + 60; // 780
  const WAVE_DUR     = 180;                 // 6s
  const R_MAX        = 280;                 // plus grand que Beat2 (260) — caméra plus dézoomée
  // Clip à y=565 en espace écran (entre Sicile=554.7 et Maghreb=590.2)
  // Reproduit le comportement Beat2 : clip ~21px sous le centre Sicile
  // => demi-cercle descend jusqu'à la côte méditerranéenne / frontière Sahara
  const SAHARA_CLIP_SCREEN_Y = 576;

  const waveRaw = interpolate(localF, [F_WAVE_START, F_WAVE_START + WAVE_DUR], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Easing easeOut pour expansion rapide au début puis ralentit
  const waveEased = 1 - Math.pow(1 - waveRaw, 2);
  const waveR = waveEased * R_MAX;
  const waveOpacity = interpolate(localF,
    [F_WAVE_START, F_WAVE_START + 20, F_UN_DESERT - 30, F_UN_DESERT],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Coords écran des villes (avec caméra courante — suit le camContraste)
  const [parisX, parisY]       = mc(STATIONS.PARIS.x, STATIONS.PARIS.y);
  const [londresX, londresY]   = mc(STATIONS.LONDRES.x, STATIONS.LONDRES.y);
  const [stockholmX, stockholmY] = mc(STATIONS.STOCKHOLM.x, STATIONS.STOCKHOLM.y);

  // Distance Sicile→ville en espace écran (camContraste: scale=0.95, driftY=30)
  // Précalculé : Paris=128.7, Londres=162.2, Stockholm=231.0
  // Proportions conservées sur R_MAX=280 (normalisé par 231)
  const CITY_DISTANCES: Record<string, number> = {
    paris: 128.7,
    londres: 162.2,
    stockholm: 231.0,
  };

  // Ville s'allume quand le cercle la touche : cityOpacity = 1 dès waveR >= dist
  const cityAppearOpacity = (cityKey: string) => {
    const d = CITY_DISTANCES[cityKey];
    const touchF = F_WAVE_START + (d / R_MAX) * WAVE_DUR;
    return interpolate(localF, [touchF, touchF + 15], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    }) * waveOpacity;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: OCEAN }}>
      {/* Narration */}
      <Audio
        src={staticFile("atlas/peste-1347/audio/narration-v1.mp3")}
        startFrom={beatStart} trimAfter={beatStart + beatDur} volume={1}
      />

      {/* Musique tension */}
      {/* Musique retirée : posée en 1 piste continue au concat final. */}

      {/* SFX */}
      <Sequence from={ROUTES.ROUTES_MARITIMES - 3} durationInFrames={20}>
        <Audio src={staticFile("atlas/peste-1347/audio/sfx-c-inkdraw.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={STATS.TRAVERSER - 3} durationInFrames={20}>
        <Audio src={staticFile("atlas/peste-1347/audio/sfx-d-thud.mp3")} volume={1.5} />
      </Sequence>
      <Sequence from={STATS.DEUX_SIX_JOURS - 3} durationInFrames={20}>
        <Audio src={staticFile("atlas/peste-1347/audio/sfx-d-thud.mp3")} volume={1.5} />
      </Sequence>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          {/* Clip : cercle limité au nord du Sahara (ne descend pas vers l'Afrique) */}
          <clipPath id="b4-wave-clip">
            <rect x={-W} y={-H * 2} width={W * 3} height={SAHARA_CLIP_SCREEN_Y + H * 2} />
          </clipPath>
          <clipPath id="europeClipB4">
            <rect x={118} y={236} width={470} height={328} />
          </clipPath>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill={OCEAN} />

        {/* Carte base */}
        <AtlasMercator
          countries={MERC_LARGE.countries}
          highlightFills={highlightFills}
          driftX={driftX} driftY={driftY} scale={camScale}
          width={W} height={H}
        />

        {/* Propagation rouge séquencée — clippée à l'Europe continentale
            (FRA/NOR/NLD/PRT ont des territoires lointains qui rougissaient en pleine mer) */}
        <g transform={`translate(${W / 2 + driftX} ${H / 2 + driftY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`}
           clipPath="url(#europeClipB4)">
          {(MERC_LARGE.countries as Array<{ iso: string; d: string }>)
            .filter((c) => PLAGUE_PROPAGATION_ORDER.includes(c.iso))
            .map((c) => {
              const op = plagueOpacities[c.iso] ?? 0;
              if (op <= 0.01) return null;
              return (
                <path key={c.iso} d={c.d}
                      fill={PLAGUE_RED} fillOpacity={op}
                      stroke={PLAGUE_RED_BRIGHT} strokeOpacity={op * 0.4} strokeWidth={0.5} />
              );
            })
          }
        </g>

        {/* Phase G — Europe pulsante — même clip continental */}
        {europePulse > 0.01 && (
          <g transform={`translate(${W / 2 + driftX} ${H / 2 + driftY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`}
             clipPath="url(#europeClipB4)">
            {(MERC_LARGE.countries as Array<{ iso: string; d: string }>)
              .filter((c) => PLAGUE_PROPAGATION_ORDER.includes(c.iso))
              .map((c) => (
                <path key={c.iso} d={c.d} fill="#0d0000" fillOpacity={europePulse} />
              ))
            }
          </g>
        )}

        {/* Sahara highlight or */}
        {saharaOpacity > 0.01 && (
          <g transform={`translate(${W / 2 + driftX} ${H / 2 + driftY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`}>
            {(MERC_LARGE.countries as Array<{ iso: string; d: string }>)
              .filter((c) => ISO_SAHARA.includes(c.iso))
              .map((c) => (
                <path key={c.iso} d={c.d}
                      fill={MALI_GOLD} fillOpacity={saharaOpacity * 0.82}
                      stroke={GOLD_BORDER} strokeOpacity={saharaOpacity * 0.9} strokeWidth={0.9} />
              ))
            }
          </g>
        )}

        {/* Phase G — Mali subsahara stable */}
        {maliGlowOpacity > 0.01 && (
          <g transform={`translate(${W / 2 + driftX} ${H / 2 + driftY}) scale(${camScale}) translate(${-W / 2} ${-H / 2})`}>
            {(MERC_LARGE.countries as Array<{ iso: string; d: string }>)
              .filter((c) => ISO_SUBSAHARAN_SAFE.has(c.iso))
              .map((c) => (
                <path key={c.iso} d={c.d}
                      fill={MALI_GOLD} fillOpacity={maliGlowOpacity * 0.48}
                      stroke={GOLD_BORDER} strokeOpacity={maliGlowOpacity * 0.7} strokeWidth={0.7} />
              ))
            }
          </g>
        )}

        {/* ── ROUTES MARITIMES — lignes pointillées animées ────────────────── */}
        {/* Segment 1 : Caffa → Sicile (rouge, se dessine avec les rats) */}
        <AnimatedRoute
          fromX={caffaX} fromY={caffaY}
          toX={sicileX} toY={sicileY}
          startAt={routeSeg1Start} endAt={routeSeg1End}
          localF={localF}
          color="#cc4422" glowColor="#ff6633" dashArray="10 5" strokeWidth={3.5}
        />
        {/* Segment 2 : Sicile → Maghreb (orange, se dessine après F_ROUTES) */}
        <AnimatedRoute
          fromX={sicileX} fromY={sicileY}
          toX={maghrebX} toY={maghrebY}
          startAt={routeSeg2Start} endAt={routeSeg2End}
          localF={localF}
          color="#e8823a" glowColor="#ffaa44" dashArray="10 5" strokeWidth={3.5}
        />

        {/* ── RATS x3 — même trajet Caffa→Maghreb, décalés latéralement ────── */}
        <RatMoving
          startX={caffaX} startY={caffaY}
          endX={maghrebX + 10} endY={maghrebY - 20}
          appearAt={F_RATS} hideAt={F_VOICI}
          localF={localF} walkPhaseOffset={0} lateralOffset={0}
        />
        <RatMoving
          startX={caffaX + 5} startY={caffaY - 16}
          endX={maghrebX + 20} endY={maghrebY - 36}
          appearAt={F_RATS} hideAt={F_VOICI}
          localF={localF} walkPhaseOffset={2} lateralOffset={0}
        />
        <RatMoving
          startX={caffaX - 5} startY={caffaY + 16}
          endX={maghrebX - 5} endY={maghrebY - 5}
          appearAt={F_RATS} hideAt={F_VOICI}
          localF={localF} walkPhaseOffset={4} lateralOffset={0}
        />

        {/* Pulse marker Caffa */}
        {localF < F_VOICI + 30 && (
          <AtlasPulseMarker
            coord={[caffaX, caffaY]}
            beatStart={beatStart}
            color={PLAGUE_RED_BRIGHT}
            ringInner={3} ringOuter={18}
          />
        )}

        {/* ── CARAVANE — traverse le Sahara ouest→est ──────────────────────── */}
        <Caravane
          startScreenX={caravaneStartX}
          endScreenX={caravaneEndX}
          screenY={caravaneStartY}
          appearAt={F_CARAVANE_START}
          hideAt={F_CARAVANE_END}
          localF={localF}
        />

        {/* ── CARTOUCHES — 2 uniquement ─────────────────────────────────────── */}
        <StatParchment
          x={CARD_X} y={CARD_Y}
          bigText="60–90 j" subText="À DOS DE CHAMEAU"
          appearAt={F_TRAVERSER} hideAt={F_DEUX_SIX - 10}
          localF={localF} accent={MALI_GOLD}
          width={210} height={82} bigSize={36}
        />
        <StatParchment
          x={CARD_X} y={CARD_Y}
          bigText="2–6 j" subText="AVANT LA MORT"
          appearAt={F_DEUX_SIX} hideAt={F_CARAVANE_START + 60}
          localF={localF} accent={PLAGUE_RED_BRIGHT}
          width={210} height={82} bigSize={42}
        />

        {/* ── CERCLE PROPAGATION — depuis Sicile, clippé au Sahara ────────── */}
        {waveR > 0.5 && waveOpacity > 0.01 && (
          <g clipPath="url(#b4-wave-clip)">
            {/* Remplissage rouge semi-transparent */}
            <circle
              cx={sicileX} cy={sicileY} r={waveR}
              fill={PLAGUE_RED} fillOpacity={waveOpacity * 0.22}
              stroke="none"
            />
            {/* Contour parchemin — visible sur toutes les couleurs sous-jacentes */}
            <circle
              cx={sicileX} cy={sicileY} r={waveR}
              fill="none"
              stroke={PARCHMENT} strokeWidth={3}
              strokeOpacity={waveOpacity * 0.90}
            />
          </g>
        )}

        {/* ── VILLES — s'allument quand le cercle les atteint ──────────────── */}
        {/* Paris — offset vers le bas-droite pour ne pas superposer Londres */}
        {cityAppearOpacity("paris") > 0.01 && (
          <g transform={`translate(${parisX + 20} ${parisY + 10})`} opacity={cityAppearOpacity("paris")}>
            <image
              href={staticFile("atlas/peste-1347/assets/objects/cities-v2/paris/static.png")}
              x={-32} y={-64} width={64} height={64}
              style={{ imageRendering: "pixelated" }}
            />
            <text x={0} y={8} textAnchor="middle" fill={PARCHMENT} fontSize={10}
                  fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700} letterSpacing={1}
                  style={{ filter: "drop-shadow(0px 1px 2px #000)" }}>
              PARIS
            </text>
          </g>
        )}
        {/* Londres — offset vers le haut-gauche */}
        {cityAppearOpacity("londres") > 0.01 && (
          <g transform={`translate(${londresX - 20} ${londresY - 10})`} opacity={cityAppearOpacity("londres")}>
            <image
              href={staticFile("atlas/peste-1347/assets/objects/cities-v2/londres/static.png")}
              x={-32} y={-64} width={64} height={64}
              style={{ imageRendering: "pixelated" }}
            />
            <text x={0} y={8} textAnchor="middle" fill={PLAGUE_RED_BRIGHT} fontSize={10}
                  fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700} letterSpacing={1}>
              LONDRES
            </text>
          </g>
        )}
        {/* Stockholm — décalée +15px à droite pour rester sur terre ferme */}
        {cityAppearOpacity("stockholm") > 0.01 && (
          <g transform={`translate(${stockholmX + 15} ${Math.max(72, stockholmY)})`} opacity={cityAppearOpacity("stockholm")}>
            <image
              href={staticFile("atlas/peste-1347/assets/objects/cities-v2/stockholm/static.png")}
              x={-32} y={-64} width={64} height={64}
              style={{ imageRendering: "pixelated" }}
            />
            <text x={0} y={8} textAnchor="middle" fill={PLAGUE_RED_BRIGHT} fontSize={10}
                  fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700} letterSpacing={1}>
              STOCKHOLM
            </text>
          </g>
        )}


      </svg>

      {/* ── SOURCE — apparaît phase F (puce vectrice), reste jusqu'à la fin ── */}
      {localF >= 527 && (() => {
        const srcOpacity = interpolate(localF, [527, 542], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <div style={{
            position: "absolute",
            bottom: 28,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: srcOpacity,
            pointerEvents: "none",
          }}>
            <div style={{
              background: PARCHMENT,
              borderTop: `1.5px solid ${PARCHMENT_DARK}`,
              borderBottom: `1.5px solid ${PARCHMENT_DARK}`,
              padding: "3px 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: 11,
                color: PARCHMENT_INK,
                letterSpacing: "0.04em",
                fontWeight: 600,
              }}>
                Parasites &amp; Vectors, 2011 · Johns Hopkins University
              </span>
            </div>
          </div>
        );
      })()}

    </AbsoluteFill>
  );
};
