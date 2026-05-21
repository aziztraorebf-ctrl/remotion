// Beat 4 Consequence — Empire du Ghana — v1
// "Ce système a tenu cinq cents ans. Mais en 1076, les Almoravides coupèrent
//  les routes du sel. Sécheresse. Effondrement. Et en 1240, un certain Sundiata
//  Keïta détruit Koumbi Saleh. L'empire du Mali venait de naître sur les
//  cendres de Wagadou."
//
// Frames 2152 → 2788 (636 frames, ~21.2s)
//
// 5 sous-événements + 5 mouvements caméra à essayer (catalogue Atlas) :
//   A. 500 ans         (R0 → R93)    : Pulse empire qui ralentit (calme avant tempête)
//   B. Almoravides     (R93 → R169)  : Whip-pan NW (flash blanc) + camera-track guerrier descend
//   C. Date 1076       (R169 → R222) : Freeze-frame + zoom violent 1.0 → 3.5 sur date plein écran
//   D. Sécheresse +    (R222 → R375) : Dutch tilt 0→6→0° + switch BRUTAL gris frame R256 ("Effondrement")
//      Effondrement
//   E. Mali / cendres  (R375 → R560) : Match-cut conceptuel — flash 3f cendres → territoire Mali OR_VIF

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  ATLAS_COLORS,
  AtlasSubtleStars,
} from "../../_shared/atlas-components";
import { GHANA_PALETTE, GHANA_FONTS } from "../components/GhanaPalette";
import { SEGMENTS } from "../timing";
import { getSpriteFramePath } from "../../shaka-zulu/helpers/spritePlayer";

// Walk cycle PixelLab du guerrier almoravide (6 frames south)
const GUERRIER_WALK = "empire-ghana/characters/guerrier-almoravide/animations/animating-6c924926";
// Sundiata — walk-north stable (custom, épée immobile près du corps)
const SUNDIATA_WALK_NORTH_STABLE = "empire-ghana/characters/sundiata/animations/walking_forward_calmly_holding_sword_still_close_t-70738c80";
const SUNDIATA_WALK_FRAMES = 4;
const SUNDIATA_WAR_CRY = "empire-ghana/characters/sundiata/animations/raising_sword_overhead_in_victorious_war_cry_mouth-6c313619";
// Lancier + Épéiste Mande — walking-6-frames templates
const LANCIER_WALK_NORTH = "empire-ghana/characters/lancier/animations/animating-ae8b3773";
const EPEISTE_WALK_NORTH = "empire-ghana/characters/epeiste/animations/animating-58bffda0";
// Sahelien réutilisé (Beat 3) — walking north
const SAHELIEN_WALK_NORTH = "empire-ghana/characters/sahelien/animations/walking-3848d070";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ghanaData = require("../../../../../data/geo/empire-ghana-data.json");

const BEAT_START = SEGMENTS.S4_CONSEQUENCE.startFrame; // 2152
const TOTAL_FRAMES = SEGMENTS.S4_CONSEQUENCE.durationFrames; // 636

// ─── Timestamps absolus (forced alignment) ───────────────────────────────────
const ABS_CINQ_CENTS_ANS  = Math.round(73.5 * 30);    // ~2205 (estim approchée)
const ABS_ALMORAVIDES     = Math.round(74.839 * 30);  // 2245
const ABS_COUPERENT       = Math.round(75.519 * 30);  // 2266
const ABS_MILLE_SOIXANTE  = Math.round(77.379 * 30);  // 2321
const ABS_SECHERESSE      = Math.round(79.139 * 30);  // 2374
const ABS_EFFONDREMENT    = Math.round(80.259 * 30);  // 2408
const ABS_SUNDIATA        = Math.round(84.239 * 30);  // 2527
const ABS_MALI            = Math.round(88.839 * 30);  // 2665
const ABS_NAITRE          = Math.round(89.619 * 30);  // 2689
const ABS_CENDRES         = Math.round(90.400 * 30);  // 2712

// Frames relatifs au début du beat
const R_500_ANS       = ABS_CINQ_CENTS_ANS  - BEAT_START; // 53
const R_ALMORAVIDES   = ABS_ALMORAVIDES     - BEAT_START; // 93
const R_COUPERENT     = ABS_COUPERENT       - BEAT_START; // 114
const R_1076          = ABS_MILLE_SOIXANTE  - BEAT_START; // 169
// Le guerrier démarre AVANT R_ALMORAVIDES pour avoir le temps de marcher (descente ralentie)
const R_GUERRIER_START = R_ALMORAVIDES - 30; // 63 — sprite apparaît 30f plus tôt
const PHASE_MID = R_GUERRIER_START + Math.round((R_1076 - R_GUERRIER_START) / 2); // 116 (Sijilmassa→Taghaza fini)

const R_SECHERESSE    = ABS_SECHERESSE      - BEAT_START; // 222
const R_EFFONDREMENT  = ABS_EFFONDREMENT    - BEAT_START; // 256
const R_SUNDIATA      = ABS_SUNDIATA        - BEAT_START; // 375
const R_MALI          = ABS_MALI            - BEAT_START; // 513
const R_NAITRE        = ABS_NAITRE          - BEAT_START; // 537
const R_CENDRES       = ABS_CENDRES         - BEAT_START; // 560

// Sundiata + 3 guerriers Mande — montent du sud (Bambouk) vers Koumbi
const R_SUNDIATA_WALK_START = R_SUNDIATA;       // 375 — apparition au mot "Sundiata"
const R_SUNDIATA_CLOSEUP    = R_SUNDIATA + 35;  // 410 — bascule très gros plan 3.5x
const R_SUNDIATA_ARRIVE     = R_SUNDIATA + 75;  // 450 — arrivée Koumbi
const R_SUNDIATA_WAR_CRY    = R_SUNDIATA + 75;  // 450 — début war-cry
const R_SUNDIATA_IMPACT     = R_SUNDIATA + 95;  // 470 — impact / camera shake / ruines
const R_PULL_BACK_START     = R_SUNDIATA + 110; // 485 — pull-back vers vue Mali
const R_MALI_APPEAR_START   = R_SUNDIATA + 125; // 500 — Mali commence à émerger
const R_NIANI_APPEAR        = R_SUNDIATA + 145; // 520 — ville Niani fade-in (ruines fade-out)

// ─── POI coords brutes (SVG 720×1280) ────────────────────────────────────────
const POI = ghanaData.mercSahel.poi;
const SVG_KOUMBI_X = POI.KOUMBI_SALEH.x; // 238.56
const SVG_KOUMBI_Y = POI.KOUMBI_SALEH.y; // 696.95
const SVG_TAGHAZA_X = POI.TAGHAZA.x;     // 322.13
const SVG_TAGHAZA_Y = POI.TAGHAZA.y;     // 517.73
const SVG_BAMBOUK_X = POI.BAMBOUK.x;     // 164.52
const SVG_BAMBOUK_Y = POI.BAMBOUK.y;     // 766.83

// Sijilmassa (capitale Almoravide nord) — VRAIE projection d3-geo mercSahel
// (-4°W, 31.6°N) → (336, 273) via geoMercator().center([-3,18]).scale(1400).translate([360,640])
const SVG_SIJILMASSA_X = 336;
const SVG_SIJILMASSA_Y = 273;

// Empire du Mali en 1300 — frontières issues du dataset academique
// aourednik/historical-basemaps (CC BY-SA 4.0), snapshot annee 1300 (~65 ans
// apres Sundiata). MultiPolygon 52 vertices, projete via geoMercator
// center([-3,18]).scale(1400).translate([360,640]) dans precompute-empire-ghana.mjs.
// Source brute : data/geo/empire-ghana/mali_1300.geojson
// OHM ne contient pas de relation Mali Empire (verifie 2026-05-04).
const MALI_PATH = ghanaData.mercSahel.maliEmpire as string;

// Composition scale
const SVG_W = 720;
const COMP_W = 1080;
const CSS_SCALE = COMP_W / SVG_W; // 1.5

// Sprite guerrier
const GUERRIER_SIZE = 130;
const SUNDIATA_SIZE = 140; // Légèrement plus grand (figure royale)
const SAHELIEN_SIZE = 120; // Plus petit (suit Sundiata)
const SPRITE_FILTER = "drop-shadow(2px 2px 6px rgba(0,0,0,0.7))";

// Point de départ guerriers Mande (sud de Bambouk)
const SVG_MANDE_SPAWN_X = SVG_BAMBOUK_X - 15;
const SVG_MANDE_SPAWN_Y = SVG_BAMBOUK_Y + 60;

// ─── Camera state ────────────────────────────────────────────────────────────
function computeCameraState(localFrame: number) {
  const driftX = Math.sin(localFrame * 0.014) * 4;
  const driftY = Math.cos(localFrame * 0.011) * 3;

  // Position guerrier en temps réel (Sijilmassa → Taghaza → Koumbi)
  // Démarrage R_GUERRIER_START (63), arrivée Koumbi à R_1076 (169) → 106 frames de marche
  // Phase 1 : Sijilmassa → Taghaza sur 50% du temps (53 frames)
  // Phase 2 : Taghaza → Koumbi sur 50% du temps (53 frames) — descente menaçante
  let guerrierX = SVG_SIJILMASSA_X;
  let guerrierY = SVG_SIJILMASSA_Y;
  if (localFrame >= R_GUERRIER_START && localFrame < PHASE_MID) {
    const p = (localFrame - R_GUERRIER_START) / (PHASE_MID - R_GUERRIER_START);
    guerrierX = SVG_SIJILMASSA_X + (SVG_TAGHAZA_X - SVG_SIJILMASSA_X) * p;
    guerrierY = SVG_SIJILMASSA_Y + (SVG_TAGHAZA_Y - SVG_SIJILMASSA_Y) * p;
  } else if (localFrame >= PHASE_MID && localFrame < R_1076) {
    const p = (localFrame - PHASE_MID) / (R_1076 - PHASE_MID);
    guerrierX = SVG_TAGHAZA_X + (SVG_KOUMBI_X - SVG_TAGHAZA_X) * p;
    guerrierY = SVG_TAGHAZA_Y + (SVG_KOUMBI_Y - SVG_TAGHAZA_Y) * p;
  } else if (localFrame >= R_1076) {
    guerrierX = SVG_KOUMBI_X;
    guerrierY = SVG_KOUMBI_Y;
  }

  // ─── Formation Mande : Sundiata (leader) + 3 guerriers (lancier/épéiste/sahelien) ──
  // Helper : position d'un membre de la formation avec retard temporel + offset spatial
  function mandePosition(spawnDX: number, spawnDY: number, arriveDX: number, arriveDY: number, frameOffset: number) {
    const offsetFrame = localFrame - frameOffset;
    const sx = SVG_MANDE_SPAWN_X + spawnDX;
    const sy = SVG_MANDE_SPAWN_Y + spawnDY;
    const ax = SVG_KOUMBI_X + arriveDX;
    const ay = SVG_KOUMBI_Y + arriveDY;
    if (offsetFrame < R_SUNDIATA_WALK_START) return { x: sx, y: sy };
    if (offsetFrame >= R_SUNDIATA_ARRIVE) return { x: ax, y: ay };
    const p = (offsetFrame - R_SUNDIATA_WALK_START) / (R_SUNDIATA_ARRIVE - R_SUNDIATA_WALK_START);
    return { x: sx + (ax - sx) * p, y: sy + (ay - sy) * p };
  }

  // Sundiata leader — devant, centre
  const sundiataPos = mandePosition(0, 0, 0, 0, 0);
  const sundiataX = sundiataPos.x;
  const sundiataY = sundiataPos.y;

  // Lancier — ligne 1 gauche de Sundiata, retard 10 frames
  const lancierPos = mandePosition(-22, 0, -28, 8, 10);
  // Épéiste — ligne 1 droite de Sundiata, retard 10 frames
  const epeistePos = mandePosition(22, 0, 28, 8, 10);
  // Sahelien (porteur) — ligne 2 derrière, retard 22 frames
  const sahelienPos = mandePosition(0, 22, 0, 35, 22);
  const sahelienX = sahelienPos.x;
  const sahelienY = sahelienPos.y;

  // ─── ZOOM + FOCUS dynamique ────────────────────────────────────────────────
  let camFocusX = SVG_KOUMBI_X;
  let camFocusY = SVG_KOUMBI_Y;
  let camZoom = 1.0;

  // A. 500 ans (0 → R_GUERRIER_START-10) : zoom continuité Beat 3 (~1.0, focus Wagadou)
  if (localFrame < R_GUERRIER_START - 10) {
    camZoom = 1.0;
    camFocusX = SVG_KOUMBI_X;
    camFocusY = SVG_KOUMBI_Y;
  }
  // B1. PAN CONTINU vers Sijilmassa pour intercepter le guerrier (10 frames)
  // Pas de flash — mouvement de caméra agressif suffit
  else if (localFrame < R_GUERRIER_START) {
    const p = (localFrame - (R_GUERRIER_START - 10)) / 10;
    camFocusX = SVG_KOUMBI_X + (SVG_SIJILMASSA_X - SVG_KOUMBI_X) * p;
    camFocusY = SVG_KOUMBI_Y + (SVG_SIJILMASSA_Y - SVG_KOUMBI_Y) * p;
    camZoom = interpolate(p, [0, 1], [1.0, 1.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  // B2. Camera-track guerrier (R_GUERRIER_START → R_1076)
  else if (localFrame < R_1076) {
    camFocusX = guerrierX;
    camFocusY = guerrierY;
    // Zoom 1.7 → 2.4 (gros plan menaçant pendant la descente)
    camZoom = interpolate(localFrame, [R_GUERRIER_START, R_1076], [1.7, 2.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  // C. FREEZE-FRAME + zoom violent (R_1076 → R_SECHERESSE-15)
  // Géré séparément en overlay plein écran — caméra reste sur Koumbi
  else if (localFrame < R_SECHERESSE - 15) {
    camFocusX = SVG_KOUMBI_X;
    camFocusY = SVG_KOUMBI_Y;
    camZoom = 2.4;
  }
  // D. Sécheresse + Effondrement (R_SECHERESSE-15 → R_SUNDIATA)
  // Pull-back vers vue empire pour voir la désaturation
  else if (localFrame < R_SUNDIATA) {
    camFocusX = SVG_KOUMBI_X;
    camFocusY = SVG_KOUMBI_Y - 20; // léger décalage pour voir empire complet
    camZoom = interpolate(localFrame, [R_SECHERESSE - 15, R_SUNDIATA], [2.4, 1.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  // E. Sundiata + Sahelien attaque + Mali émerge (R_SUNDIATA → fin)
  // E1. Walk Bambouk → Koumbi : camera-track Sundiata, zoom 1.6 → 2.5
  else if (localFrame < R_SUNDIATA_CLOSEUP) {
    camFocusX = sundiataX;
    camFocusY = sundiataY;
    camZoom = interpolate(localFrame, [R_SUNDIATA, R_SUNDIATA_CLOSEUP], [1.6, 2.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  // E2. TRÈS GROS PLAN intime — zoom 3.5x sur Sundiata (R_CLOSEUP → R_ARRIVE)
  else if (localFrame < R_SUNDIATA_ARRIVE) {
    camFocusX = sundiataX;
    camFocusY = sundiataY;
    camZoom = interpolate(localFrame, [R_SUNDIATA_CLOSEUP, R_SUNDIATA_ARRIVE - 5], [2.5, 3.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  // E3. War-cry impact (R_ARRIVE → R_PULL_BACK_START)
  else if (localFrame < R_PULL_BACK_START) {
    camFocusX = SVG_KOUMBI_X;
    camFocusY = SVG_KOUMBI_Y;
    camZoom = 3.2; // gros plan sur l'impact
  }
  // E4. Pull-back vers vue Mali (R_PULL_BACK_START → R_MALI_APPEAR_START + 50)
  else if (localFrame < R_MALI_APPEAR_START + 50) {
    const p = interpolate(localFrame, [R_PULL_BACK_START, R_MALI_APPEAR_START + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    camFocusX = SVG_KOUMBI_X + 30 * p;
    camFocusY = SVG_KOUMBI_Y + 20 * p;
    camZoom = interpolate(p, [0, 1], [3.2, 1.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  // E5. Vue Mali stable (R_MALI_APPEAR_START + 50 → fin)
  else {
    camFocusX = SVG_KOUMBI_X + 30;
    camFocusY = SVG_KOUMBI_Y + 20;
    camZoom = interpolate(localFrame, [R_MALI_APPEAR_START + 50, TOTAL_FRAMES], [1.25, 1.10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  // ─── Dutch tilt (sur Effondrement) ─────────────────────────────────────────
  // Monte 0→6° sur "Sécheresse" (R_SECHERESSE → R_EFFONDREMENT, 34 frames)
  // Redescend 6→0° sur 30 frames après Effondrement
  let dutchAngle = 0;
  if (localFrame >= R_SECHERESSE && localFrame < R_EFFONDREMENT) {
    dutchAngle = interpolate(localFrame, [R_SECHERESSE, R_EFFONDREMENT], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (localFrame >= R_EFFONDREMENT && localFrame < R_EFFONDREMENT + 30) {
    dutchAngle = interpolate(localFrame, [R_EFFONDREMENT, R_EFFONDREMENT + 30], [6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  // ─── Camera shake sur impact war-cry (R_SUNDIATA_IMPACT → +12) ─────────────
  let shakeX = 0;
  let shakeY = 0;
  if (localFrame >= R_SUNDIATA_IMPACT && localFrame < R_SUNDIATA_IMPACT + 12) {
    const decay = 1 - (localFrame - R_SUNDIATA_IMPACT) / 12;
    shakeX = (Math.random() - 0.5) * 12 * decay;
    shakeY = (Math.random() - 0.5) * 12 * decay;
  }

  // ─── Tilt classique (skewX axonométrique) ────────────────────────────────
  const tiltBase = 18 + Math.sin(localFrame * 0.04) * 2;
  // Annulé pendant zooms forts (>1.9) et pendant dutch tilt
  const effectiveTilt = (camZoom > 1.9 || Math.abs(dutchAngle) > 0.5)
    ? interpolate(camZoom, [1.9, 2.4], [tiltBase, 4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : tiltBase;
  const skewX = effectiveTilt * 0.15;
  const scaleY = 1 - effectiveTilt * 0.008;

  return {
    driftX: driftX + shakeX,
    driftY: driftY + shakeY,
    camFocusX, camFocusY,
    camZoom, skewX, scaleY,
    dutchAngle,
    guerrierX, guerrierY,
    sundiataX, sundiataY,
    sahelienX, sahelienY,
    lancierX: lancierPos.x, lancierY: lancierPos.y,
    epeisteX: epeistePos.x, epeisteY: epeistePos.y,
  };
}

// SVG → composition (1080×1920) tenant compte de la caméra
function svgToCompWithCam(
  svgX: number, svgY: number,
  cam: ReturnType<typeof computeCameraState>,
): { x: number; y: number } {
  const screenSvgX = (svgX - cam.camFocusX) * cam.camZoom + 360 + cam.driftX;
  const screenSvgY = (svgY - cam.camFocusY) * cam.camZoom * cam.scaleY + 640 + cam.driftY;
  return { x: screenSvgX * CSS_SCALE, y: screenSvgY * CSS_SCALE };
}

// ─── Component principal ─────────────────────────────────────────────────────
export const Beat4Consequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = computeCameraState(frame);

  // ─── E. Switch BRUTAL gris cendre sur "Effondrement" ────────────────────────
  // Avant frame R_EFFONDREMENT : empire OR_VIF / palette normale
  // Après frame R_EFFONDREMENT : empire gris cendre
  const isCollapsed = frame >= R_EFFONDREMENT;

  // ─── E. Mali emerge — démarre pendant pull-back (après war-cry impact) ────
  const maliAppearT = spring({
    frame: frame - R_MALI_APPEAR_START,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: GHANA_PALETTE.NOIR_PROFOND,
      transform: `rotate(${cam.dutchAngle}deg)`,
      transformOrigin: "center center",
    }}>
      <Audio
        src={staticFile("audio/atlas-empire-ghana/narration-v1.mp3")}
        startFrom={SEGMENTS.S4_CONSEQUENCE.startFrame}
      />
      <Audio
        src={staticFile("audio/atlas-empire-ghana/music/v1-B-marche-or.mp3")}
        volume={0.07}
        startFrom={SEGMENTS.S4_CONSEQUENCE.startFrame}
      />
      {/* SFX 3 RETIRÉ — war-cry réservé à Sundiata uniquement (Aziz validation) */}
      {/* SFX 4 — Impact deep boom sur freeze-frame 1076 (R_1076 = 169) */}
      <Sequence from={R_1076} durationInFrames={30}>
        <Audio
          src={staticFile("audio/atlas-empire-ghana/sfx/04-beat4-1076-impact.mp3")}
          volume={0.25}
        />
      </Sequence>
      {/* SFX 5 — War-cry triomphant Sundiata (R_SUNDIATA_WAR_CRY = 450) */}
      <Sequence from={R_SUNDIATA_WAR_CRY} durationInFrames={45}>
        <Audio
          src={staticFile("audio/atlas-empire-ghana/sfx/05-beat4-sundiata-warcry.mp3")}
          volume={0.25}
        />
      </Sequence>
      {/* SFX 6 — Shimmer doré ascendant apparition Niani (R_NIANI_APPEAR = 520) */}
      <Sequence from={R_NIANI_APPEAR} durationInFrames={30}>
        <Audio
          src={staticFile("audio/atlas-empire-ghana/sfx/06-beat4-niani-shimmer.mp3")}
          volume={0.15}
        />
      </Sequence>

      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block", position: "absolute", top: 0, left: 0 }}
      >
        <Beat4Defs />
        <Beat4MapContent
          localFrame={frame}
          fps={fps}
          cam={cam}
          isCollapsed={isCollapsed}
          maliAppearT={maliAppearT}
        />
      </svg>

      <Beat4Sprites localFrame={frame} cam={cam} isCollapsed={isCollapsed} />

      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block", position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <Beat4Overlays localFrame={frame} fps={fps} />
      </svg>

      {/* Freeze-frame "1076" plein écran ornemental — seul flash gardé (impact maximum) */}
      <FreezeFrame1076 localFrame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

export const BEAT4_CONSEQUENCE_FRAMES = TOTAL_FRAMES;

// ─── DEFS ────────────────────────────────────────────────────────────────────
const Beat4Defs: React.FC = () => (
  <defs>
    <radialGradient id="b4BgGrad" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stopColor={GHANA_PALETTE.SEPIA_FOND} />
      <stop offset="100%" stopColor={GHANA_PALETTE.NOIR_PROFOND} />
    </radialGradient>
    <radialGradient id="b4Vignette" cx="50%" cy="50%" r="65%">
      <stop offset="55%" stopColor="#000" stopOpacity="0" />
      <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
    </radialGradient>
    <pattern id="b4WagadouHatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke={GHANA_PALETTE.OR} strokeWidth="2.5" opacity="0.85" />
      <line x1="4" y1="0" x2="4" y2="8" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5" opacity="0.7" />
    </pattern>
    {/* Hachures grises pour empire effondré */}
    <pattern id="b4WagadouHatchGris" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="#7a7068" strokeWidth="2.5" opacity="0.65" />
      <line x1="4" y1="0" x2="4" y2="8" stroke="#4a4540" strokeWidth="1.5" opacity="0.55" />
    </pattern>
    {/* Hachures Mali — vertes/or */}
    <pattern id="b4MaliHatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke={GHANA_PALETTE.OR_VIF} strokeWidth="2.5" opacity="0.85" />
      <line x1="4" y1="0" x2="4" y2="8" stroke="#3d6b2f" strokeWidth="1.5" opacity="0.7" />
    </pattern>
  </defs>
);

// ─── MAP CONTENT ─────────────────────────────────────────────────────────────
const Beat4MapContent: React.FC<{
  localFrame: number;
  fps: number;
  cam: ReturnType<typeof computeCameraState>;
  isCollapsed: boolean;
  maliAppearT: number;
}> = ({ localFrame, fps, cam, isCollapsed, maliAppearT }) => {
  const countries = ghanaData.mercSahel.countries;

  const globalFadeIn  = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalFadeOut = interpolate(localFrame, [TOTAL_FRAMES - 12, TOTAL_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ─── A. Pulse empire qui RALENTIT ───────────────────────────────────────────
  // Frequency descend de 0.10 → 0.04 (visible mais qui s'apaise — calme avant tempête)
  const pulseFreq = interpolate(localFrame, [0, R_GUERRIER_START], [0.10, 0.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const empirePulse = !isCollapsed
    ? 0.5 + 0.5 * Math.sin(localFrame * pulseFreq)
    : 0;

  // ─── B. Routes du sel qui rougissent (R_COUPERENT → R_1076) ────────────────
  const routesRedT = interpolate(localFrame, [R_COUPERENT, R_1076], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ─── D. Hachures Wagadou qui s'effacent après effondrement ─────────────────
  const hatchOpacity = isCollapsed
    ? interpolate(localFrame, [R_EFFONDREMENT, R_EFFONDREMENT + 60], [0.75, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0.75;

  return (
    <g opacity={globalFadeIn * globalFadeOut}>
      <rect x="0" y="0" width="720" height="1280" fill="url(#b4BgGrad)" />
      <AtlasSubtleStars opacity={0.4} />

      <g transform={`
        translate(${360 + cam.driftX} ${640 + cam.driftY})
        scale(${cam.camZoom} ${cam.camZoom * cam.scaleY})
        skewX(${cam.skewX})
        translate(${-cam.camFocusX} ${-cam.camFocusY})
      `}>
        <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.ocean} />
        {countries.map((c: { iso: string; d: string }) => (
          <path key={c.iso} d={c.d} fill={ATLAS_COLORS.land} stroke={ATLAS_COLORS.landStroke} strokeWidth="0.8" strokeOpacity="0.8" />
        ))}

        {/* ─── Empire Wagadou ─────────────────────────────────────────────── */}
        {/* Fill base (parchemin) */}
        <path
          d={ghanaData.mercSahel.wagadouEmpire}
          fill={isCollapsed ? "#5a5048" : GHANA_PALETTE.PARCHEMIN}
          fillOpacity={isCollapsed ? 0.10 : 0.18}
          stroke="none"
        />
        {/* Hachures or (avant) ou grises (après effondrement) */}
        <path
          d={ghanaData.mercSahel.wagadouEmpire}
          fill={isCollapsed ? "url(#b4WagadouHatchGris)" : "url(#b4WagadouHatch)"}
          fillOpacity={hatchOpacity}
          stroke={isCollapsed ? "#5a5048" : ATLAS_COLORS.empireOutlineDark}
          strokeWidth="3" strokeOpacity={isCollapsed ? 0.5 : 0.9}
          strokeLinejoin="round"
          strokeDasharray="10 5"
        />
        {/* Empire glow OR pendant A (héritage Beat 3) — fort jusqu'au guerrier */}
        {!isCollapsed && localFrame < R_GUERRIER_START + 5 && (
          <>
            {/* Fill OR_VIF dominant — empire qui rayonne */}
            <path
              d={ghanaData.mercSahel.wagadouEmpire}
              fill={GHANA_PALETTE.OR_VIF}
              fillOpacity={(0.40 + empirePulse * 0.20) * interpolate(localFrame, [0, R_GUERRIER_START - 10, R_GUERRIER_START + 5], [1, 1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              stroke="none"
            />
            {/* Outline gold épais qui pulse */}
            <path
              d={ghanaData.mercSahel.wagadouEmpire}
              fill="none"
              stroke={GHANA_PALETTE.OR_VIF}
              strokeWidth={5 + empirePulse * 5}
              strokeOpacity={(0.85 + empirePulse * 0.15) * interpolate(localFrame, [0, R_GUERRIER_START - 10, R_GUERRIER_START + 5], [1, 1, 0.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              strokeLinejoin="round"
            />
            {/* Halo extérieur (glow) — rayonnement large */}
            <path
              d={ghanaData.mercSahel.wagadouEmpire}
              fill="none"
              stroke={GHANA_PALETTE.OR_VIF}
              strokeWidth={14 + empirePulse * 8}
              strokeOpacity={(0.25 + empirePulse * 0.15) * interpolate(localFrame, [0, R_GUERRIER_START - 10, R_GUERRIER_START + 5], [1, 1, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
              strokeLinejoin="round"
            />
          </>
        )}

        {/* ─── Nouveau territoire MALI (apparaît après match-cut cendres) ───── */}
        {maliAppearT > 0.01 && (
          <>
            <path
              d={MALI_PATH}
              fill={GHANA_PALETTE.OR_VIF}
              fillOpacity={maliAppearT * 0.30}
              stroke="none"
            />
            <path
              d={MALI_PATH}
              fill="url(#b4MaliHatch)"
              fillOpacity={maliAppearT * 0.85}
              stroke={GHANA_PALETTE.OR_VIF}
              strokeWidth={2 + maliAppearT * 4}
              strokeOpacity={maliAppearT}
              strokeLinejoin="round"
              strokeDasharray="8 4"
            />
            {/* Glow pulse sur Mali frais */}
            <path
              d={MALI_PATH}
              fill="none"
              stroke={GHANA_PALETTE.OR_VIF}
              strokeWidth={6 + Math.sin(localFrame * 0.12) * 3}
              strokeOpacity={maliAppearT * 0.4}
            />
          </>
        )}

        {/* ─── Routes commerciales ───────────────────────────────────────────── */}
        {/* Route SEL (Taghaza → Koumbi) — rougit pendant invasion, casse après */}
        <path
          d={ghanaData.mercSahel.routes.sel}
          stroke={isCollapsed ? "#7a4a40" : (routesRedT > 0.01 ? `rgb(${Math.round(220 - 60 * routesRedT)}, ${Math.round(220 - 180 * routesRedT)}, ${Math.round(180 - 160 * routesRedT)})` : GHANA_PALETTE.BLANC_SEL)}
          strokeWidth="2"
          fill="none"
          strokeDasharray={isCollapsed ? "3 8" : "6 4"}
          opacity={isCollapsed ? 0.3 : 0.85}
        />
        {/* Route OR (Bambouk → Koumbi) */}
        <path
          d={ghanaData.mercSahel.routes.or}
          stroke={isCollapsed ? "#5a4a3a" : GHANA_PALETTE.OR_VIF}
          strokeWidth="2"
          fill="none"
          strokeDasharray={isCollapsed ? "3 8" : "6 4"}
          opacity={isCollapsed ? 0.3 : 0.7}
        />

        {/* ─── POI ─────────────────────────────────────────────────────────── */}
        {/* Taghaza */}
        <circle cx={SVG_TAGHAZA_X} cy={SVG_TAGHAZA_Y} r="5"
          fill={isCollapsed ? "#6a6058" : GHANA_PALETTE.BLANC_SEL}
          stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5"
          opacity={isCollapsed ? 0.5 : 1}
        />
        <text x={SVG_TAGHAZA_X} y={SVG_TAGHAZA_Y - 10} textAnchor="middle"
          fill={isCollapsed ? "#7a7068" : ATLAS_COLORS.textInk}
          fontSize="11" fontFamily={GHANA_FONTS.SERIF} letterSpacing="1.5" fontWeight="600"
          opacity={isCollapsed ? 0.5 : 1}
        >TAGHAZA</text>

        {/* Bambouk */}
        <circle cx={SVG_BAMBOUK_X} cy={SVG_BAMBOUK_Y} r="5"
          fill={GHANA_PALETTE.OR}
          stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5"
        />
        <text x={SVG_BAMBOUK_X + 10} y={SVG_BAMBOUK_Y + 16} textAnchor="start"
          fill={ATLAS_COLORS.textInk}
          fontSize="11" fontFamily={GHANA_FONTS.SERIF} letterSpacing="1.5" fontWeight="600"
        >BAMBOUK</text>

        {/* Koumbi Saleh — change d'aspect après effondrement */}
        <circle cx={SVG_KOUMBI_X} cy={SVG_KOUMBI_Y} r={isCollapsed ? 4 : 6}
          fill={isCollapsed ? "#5a5048" : GHANA_PALETTE.OR_VIF}
          stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5"
          opacity={isCollapsed ? 0.55 : 1}
        />
        <text x={SVG_KOUMBI_X + 11} y={SVG_KOUMBI_Y - 7} textAnchor="start"
          fill={isCollapsed ? "#6a6058" : ATLAS_COLORS.textInk}
          fontSize="11" fontFamily={GHANA_FONTS.SERIF} fontWeight="700" letterSpacing="1.5"
          opacity={isCollapsed ? 0.55 : 1}
        >{isCollapsed ? "KOUMBI SALEH †" : "KOUMBI SALEH"}</text>

        {/* Sijilmassa — apparaît pendant le pan + descente */}
        {localFrame >= R_GUERRIER_START - 12 && localFrame < PHASE_MID + 10 && (
          <g opacity={interpolate(localFrame, [R_GUERRIER_START - 12, R_GUERRIER_START - 4, PHASE_MID, PHASE_MID + 10], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <circle cx={SVG_SIJILMASSA_X} cy={SVG_SIJILMASSA_Y} r="5"
              fill="#8b3a3a" stroke="#3a1818" strokeWidth="1.5"
            />
            <text x={SVG_SIJILMASSA_X} y={SVG_SIJILMASSA_Y - 12} textAnchor="middle"
              fill="#8b3a3a" fontSize="12" fontFamily={GHANA_FONTS.SERIF}
              letterSpacing="1.5" fontWeight="700"
            >SIJILMASSA</text>
          </g>
        )}
      </g>
    </g>
  );
};

// ─── SPRITES (guerrier almoravide + ruines + cendres flash) ──────────────────
const Beat4Sprites: React.FC<{
  localFrame: number;
  cam: ReturnType<typeof computeCameraState>;
  isCollapsed: boolean;
}> = ({ localFrame, cam, isCollapsed }) => {
  // ─── Guerrier almoravide ─────────────────────────────────────────────────
  // Visible R_GUERRIER_START → R_1076
  const guerrierVisible = localFrame >= R_GUERRIER_START && localFrame < R_1076;
  const guerrierPos = svgToCompWithCam(cam.guerrierX, cam.guerrierY, cam);

  // Bobbing vertical (simule marche) — sync sur frequency walk cycle
  const bobbing = guerrierVisible ? Math.sin((localFrame - R_GUERRIER_START) * 0.6) * 3 : 0;

  // Apparition fade-in 8 frames
  const guerrierOpacity = interpolate(
    localFrame,
    [R_GUERRIER_START - 2, R_GUERRIER_START + 6, R_1076 - 8, R_1076],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Taille suit zoom caméra (référence 1.7 = zoom moyen)
  const guerrierSize = GUERRIER_SIZE * (cam.camZoom / 1.7);

  // ─── Ruines Banco — apparaissent au moment de l'IMPACT war-cry (pas avant) ─
  const ruinesVisible = localFrame >= R_SUNDIATA_IMPACT;
  const ruinesPos = svgToCompWithCam(SVG_KOUMBI_X, SVG_KOUMBI_Y, cam);
  const ruinesOpacity = interpolate(
    localFrame,
    [R_SUNDIATA_IMPACT, R_SUNDIATA_IMPACT + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Taille AUGMENTÉE 90 → 180 pour visibilité claire
  const ruinesSize = 180 * (cam.camZoom / 1.15);

  // ─── Helper formation sprite ─────────────────────────────────────────────
  // Calcule src/opacity/bobbing pour un membre de la formation Mande
  function formationSprite(walkBasePath: string, walkTotalFrames: number, frameOffset: number) {
    const localStart = R_SUNDIATA_WALK_START + frameOffset;
    const visible = localFrame >= localStart && localFrame < R_PULL_BACK_START + 30;
    const src = visible && localFrame < R_SUNDIATA_ARRIVE
      ? staticFile(getSpriteFramePath(localFrame - localStart, {
          basePath: walkBasePath,
          direction: "north",
          totalFrames: walkTotalFrames,
          framesPerSpriteFrame: 4,
        }))
      : (visible ? staticFile(getSpriteFramePath(R_SUNDIATA_ARRIVE - 1 - localStart, {
          basePath: walkBasePath,
          direction: "north",
          totalFrames: walkTotalFrames,
          framesPerSpriteFrame: 4,
        })) : "");
    const opacity = interpolate(
      localFrame,
      [localStart - 3, localStart + 6, R_PULL_BACK_START + 20, R_PULL_BACK_START + 30],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const bobbing = (localFrame >= localStart && localFrame < R_SUNDIATA_ARRIVE)
      ? Math.sin((localFrame - localStart) * 0.5 + frameOffset * 0.3) * 3
      : 0;
    return { src, opacity, bobbing, visible };
  }

  // ─── Sundiata sprite (walk-north stable Bambouk → Koumbi puis war-cry south)
  const sundiataPos = svgToCompWithCam(cam.sundiataX, cam.sundiataY, cam);
  const sundiataVisible = localFrame >= R_SUNDIATA_WALK_START && localFrame < R_PULL_BACK_START + 30;

  let sundiataSrc = "";
  if (sundiataVisible) {
    if (localFrame < R_SUNDIATA_ARRIVE) {
      // Walking north stable (custom anim, épée immobile près du corps)
      sundiataSrc = staticFile(getSpriteFramePath(localFrame - R_SUNDIATA_WALK_START, {
        basePath: SUNDIATA_WALK_NORTH_STABLE,
        direction: "north",
        totalFrames: SUNDIATA_WALK_FRAMES,
        framesPerSpriteFrame: 4,
      }));
    } else {
      // War-cry south (4 frames custom — sprite se retourne face caméra à l'arrivée)
      sundiataSrc = staticFile(getSpriteFramePath(localFrame - R_SUNDIATA_ARRIVE, {
        basePath: SUNDIATA_WAR_CRY,
        direction: "south",
        totalFrames: 4,
        framesPerSpriteFrame: 5,
      }));
    }
  }
  const sundiataOpacity = interpolate(
    localFrame,
    [R_SUNDIATA_WALK_START - 3, R_SUNDIATA_WALK_START + 6, R_PULL_BACK_START + 20, R_PULL_BACK_START + 30],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const sundiataSize = SUNDIATA_SIZE * (cam.camZoom / 2.0);
  const sundiataBobbing = (localFrame >= R_SUNDIATA_WALK_START && localFrame < R_SUNDIATA_ARRIVE)
    ? Math.sin((localFrame - R_SUNDIATA_WALK_START) * 0.5) * 3
    : 0;

  // ─── 3 guerriers Mande (lancier, épéiste, sahelien) ──────────────────────
  const lancier = formationSprite(LANCIER_WALK_NORTH, 6, 10);
  const epeiste = formationSprite(EPEISTE_WALK_NORTH, 6, 10);
  const sahelien = formationSprite(SAHELIEN_WALK_NORTH, 6, 22);

  const lancierPosComp = svgToCompWithCam(cam.lancierX, cam.lancierY, cam);
  const epeistePosComp = svgToCompWithCam(cam.epeisteX, cam.epeisteY, cam);
  const sahelienPos = svgToCompWithCam(cam.sahelienX, cam.sahelienY, cam);
  const guerrierMandeSize = 110 * (cam.camZoom / 2.0);

  // ─── Ville Niani-Mali — apparaît quand ruines fade-out (transition magique) ─
  const nianiVisible = localFrame >= R_NIANI_APPEAR;
  const nianiOpacity = interpolate(
    localFrame,
    [R_NIANI_APPEAR, R_NIANI_APPEAR + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const nianiSize = 200 * (cam.camZoom / 1.25);
  const nianiPos = svgToCompWithCam(SVG_KOUMBI_X, SVG_KOUMBI_Y, cam);
  // Ruines fade-out au moment où Niani fade-in (cross-fade)
  const ruinesFadeOut = interpolate(
    localFrame,
    [R_NIANI_APPEAR, R_NIANI_APPEAR + 18],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <>
      {/* Guerrier almoravide — walk cycle PixelLab 6 frames south, cadence rapide */}
      {guerrierVisible && (
        <Img
          src={staticFile(getSpriteFramePath(localFrame - R_GUERRIER_START, {
            basePath: GUERRIER_WALK,
            direction: "south",
            totalFrames: 6,
            framesPerSpriteFrame: 3,
          }))}
          style={{
            position: "absolute",
            left: guerrierPos.x - guerrierSize / 2,
            top: guerrierPos.y - guerrierSize / 2 - 30 + bobbing,
            width: guerrierSize,
            height: guerrierSize,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: SPRITE_FILTER,
            opacity: guerrierOpacity,
            zIndex: 8,
          }}
        />
      )}

      {/* Sahelien (porteur) — ligne 2 derrière */}
      {sahelien.visible && sahelien.src && (
        <Img
          src={sahelien.src}
          style={{
            position: "absolute",
            left: sahelienPos.x - guerrierMandeSize / 2,
            top: sahelienPos.y - guerrierMandeSize / 2 - 25 + sahelien.bobbing,
            width: guerrierMandeSize,
            height: guerrierMandeSize,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: SPRITE_FILTER,
            opacity: sahelien.opacity,
            zIndex: 4,
          }}
        />
      )}

      {/* Lancier Mande — ligne 1 gauche */}
      {lancier.visible && lancier.src && (
        <Img
          src={lancier.src}
          style={{
            position: "absolute",
            left: lancierPosComp.x - guerrierMandeSize / 2,
            top: lancierPosComp.y - guerrierMandeSize / 2 - 25 + lancier.bobbing,
            width: guerrierMandeSize,
            height: guerrierMandeSize,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: SPRITE_FILTER,
            opacity: lancier.opacity,
            zIndex: 5,
          }}
        />
      )}

      {/* Épéiste Mande — ligne 1 droite */}
      {epeiste.visible && epeiste.src && (
        <Img
          src={epeiste.src}
          style={{
            position: "absolute",
            left: epeistePosComp.x - guerrierMandeSize / 2,
            top: epeistePosComp.y - guerrierMandeSize / 2 - 25 + epeiste.bobbing,
            width: guerrierMandeSize,
            height: guerrierMandeSize,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: SPRITE_FILTER,
            opacity: epeiste.opacity,
            zIndex: 5,
          }}
        />
      )}

      {/* Sundiata — leader Mande, robes royales rouge/or, devant la formation */}
      {sundiataVisible && sundiataSrc && (
        <Img
          src={sundiataSrc}
          style={{
            position: "absolute",
            left: sundiataPos.x - sundiataSize / 2,
            top: sundiataPos.y - sundiataSize / 2 - 30 + sundiataBobbing,
            width: sundiataSize,
            height: sundiataSize,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: SPRITE_FILTER + " drop-shadow(0 0 8px rgba(212, 165, 86, 0.5))",
            opacity: sundiataOpacity,
            zIndex: 10,
          }}
        />
      )}

      {/* Ruines Banco — apparaissent à l'IMPACT war-cry, fade-out quand Niani arrive */}
      {ruinesVisible && (
        <Img
          src={staticFile("empire-ghana/assets/pixellab/ruines-banco.png")}
          style={{
            position: "absolute",
            left: ruinesPos.x - ruinesSize / 2,
            top: ruinesPos.y - ruinesSize / 2 - 25,
            width: ruinesSize,
            height: ruinesSize,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.8)) grayscale(0.5)",
            opacity: ruinesOpacity * ruinesFadeOut,
            zIndex: 3,
          }}
        />
      )}

      {/* Ville Niani — naît sur les cendres, fade-in sur ruines fade-out */}
      {nianiVisible && (
        <Img
          src={staticFile("empire-ghana/assets/pixellab/niani-mali.png")}
          style={{
            position: "absolute",
            left: nianiPos.x - nianiSize / 2,
            top: nianiPos.y - nianiSize / 2 - 25,
            width: nianiSize,
            height: nianiSize,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: "drop-shadow(2px 2px 8px rgba(212, 165, 86, 0.6))",
            opacity: nianiOpacity,
            zIndex: 6,
          }}
        />
      )}
    </>
  );
};

// ─── OVERLAYS (cartouches + vignette) ─────────────────────────────────────────
const Beat4Overlays: React.FC<{
  localFrame: number;
  fps: number;
}> = ({ localFrame, fps }) => {
  const globalFadeIn  = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalFadeOut = interpolate(localFrame, [TOTAL_FRAMES - 12, TOTAL_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vignetteOpacity = 0.65 + 0.15 * Math.sin(localFrame * 0.025);

  // Cartouche A : "500 ANS — VIIIᵉ → XIIIᵉ S."
  const cart500T = spring({ frame: localFrame - R_500_ANS, fps, config: { damping: 14, stiffness: 180 } });
  const cart500Opacity = interpolate(
    localFrame,
    [R_500_ANS, R_500_ANS + 12, R_ALMORAVIDES - 14, R_ALMORAVIDES - 4],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Cartouche E : "MALI — SUNDIATA KEÏTA — 1240"
  const cartMaliT = spring({ frame: localFrame - (R_NAITRE - 10), fps, config: { damping: 14, stiffness: 180 } });
  const cartMaliOpacity = interpolate(
    localFrame,
    [R_NAITRE - 10, R_NAITRE + 5, TOTAL_FRAMES - 15, TOTAL_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <g opacity={globalFadeIn * globalFadeOut}>
      {/* A. Cartouche "500 ANS" */}
      {localFrame >= R_500_ANS && cart500Opacity > 0.01 && (
        <g transform={`translate(360 200) scale(${0.85 + 0.15 * cart500T})`} opacity={cart500Opacity}>
          <rect x="-240" y="-50" width="480" height="100" fill={GHANA_PALETTE.PARCHEMIN} stroke={GHANA_PALETTE.OR} strokeWidth="3" rx="6" />
          <rect x="-232" y="-42" width="464" height="84" fill="none" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1" rx="3" opacity="0.7" />
          <text x="0" y="-2" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="38" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} letterSpacing="6">500 ANS</text>
          <text x="0" y="28" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="16" fontStyle="italic" fill={GHANA_PALETTE.OR_TERNI} letterSpacing="3" opacity="0.95">VIIIᵉ — XIIIᵉ siècle</text>
        </g>
      )}

      {/* E. Cartouche "MALI — SUNDIATA KEÏTA — 1240" */}
      {localFrame >= R_NAITRE - 10 && cartMaliOpacity > 0.01 && (
        <g transform={`translate(360 220) scale(${0.85 + 0.15 * cartMaliT})`} opacity={cartMaliOpacity}>
          <rect x="-260" y="-55" width="520" height="110" fill={GHANA_PALETTE.PARCHEMIN} stroke={GHANA_PALETTE.OR_VIF} strokeWidth="3" rx="6" />
          <rect x="-252" y="-47" width="504" height="94" fill="none" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1" rx="3" opacity="0.7" />
          <text x="0" y="-12" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="36" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} letterSpacing="6">MALI</text>
          <text x="0" y="14" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="14" fontStyle="italic" fill={GHANA_PALETTE.OR_TERNI} letterSpacing="2">Sundiata Keïta</text>
          <text x="0" y="36" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="18" fontWeight="700" fill={GHANA_PALETTE.OR_VIF} letterSpacing="4">1240</text>
        </g>
      )}

      <rect x="0" y="0" width="720" height="1280" fill="url(#b4Vignette)" opacity={vignetteOpacity} />
    </g>
  );
};

// ─── Freeze-frame "1076" plein écran ornemental ──────────────────────────────
const FreezeFrame1076: React.FC<{
  localFrame: number;
  fps: number;
}> = ({ localFrame, fps }) => {
  // Apparaît R_1076, dure ~50 frames (jusqu'à R_SECHERESSE-15)
  const startFrame = R_1076;
  const endFrame = R_SECHERESSE - 15; // 207
  const visible = localFrame >= startFrame && localFrame < endFrame;
  if (!visible) return null;

  // Zoom violent : 0 → 1 sur 8 frames
  const zoomT = interpolate(
    localFrame,
    [startFrame, startFrame + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  // Scale 0.3 → 1.15 → 1.0 (overshoot)
  const scale = spring({
    frame: localFrame - startFrame,
    fps,
    config: { damping: 12, stiffness: 110 },
  }) * 1.0 + 0.0;

  // Fade out sur les 12 dernières frames
  const opacity = interpolate(
    localFrame,
    [startFrame, startFrame + 6, endFrame - 12, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Background dim noir/sépia
  const dimOpacity = zoomT * 0.85;

  return (
    <div style={{
      position: "absolute",
      top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none",
    }}>
      {/* Dim background */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        backgroundColor: GHANA_PALETTE.NOIR_PROFOND,
        opacity: dimOpacity,
      }} />
      {/* Date 1076 plein écran */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        textAlign: "center",
        fontFamily: GHANA_FONTS.TITRE,
        color: GHANA_PALETTE.OR_VIF,
        textShadow: "0 0 30px rgba(180, 60, 50, 0.8), 0 0 60px rgba(212, 165, 86, 0.5)",
      }}>
        <div style={{
          fontSize: 36,
          fontWeight: 600,
          color: GHANA_PALETTE.PARCHEMIN,
          letterSpacing: 8,
          marginBottom: 18,
          opacity: 0.85,
        }}>
          ALMORAVIDES
        </div>
        <div style={{
          fontSize: 280,
          fontWeight: 900,
          letterSpacing: 12,
          lineHeight: 1,
          color: GHANA_PALETTE.OR_VIF,
        }}>
          1076
        </div>
        <div style={{
          fontSize: 28,
          fontStyle: "italic",
          color: GHANA_PALETTE.PARCHEMIN,
          letterSpacing: 4,
          marginTop: 18,
          opacity: 0.75,
        }}>
          les routes du sel coupées
        </div>
      </div>
    </div>
  );
};
