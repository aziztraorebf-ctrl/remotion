// Beat 3 Barter — Empire du Ghana — v3
// "Mais le moment qui marque l'histoire... presque au poids égal."
// Frames 1462 → 2152 (690 frames, ~23s)
//
// Changements v3 :
//   - Camera-track sprite (zoom 2.0x suit berbere puis sahelien) — pattern S3 Mansa Moussa
//   - Sacs apparaissent EXACTEMENT au pied du sprite quand il s'accroupit
//   - Balance = PixelLab PNG (pas Lottie SVG, plus visible)
//   - Dolly-out final dramatique avec routes Taghaza→Koumbi→Bambouk qui s'illuminent
//   - Empire Wagadou qui pulse pendant le pull-back ("tout cet empire reposait sur ce silence")

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ghanaData = require("../../../../../data/geo/empire-ghana-data.json");

const SPRING_SOFT = { damping: 14, stiffness: 90 };

const BEAT_START = SEGMENTS.S3_BARTER.startFrame; // 1462
const TOTAL_FRAMES = SEGMENTS.S3_BARTER.durationFrames; // 690

// Timestamps exacts
const ABS_MARCHES       = Math.round(52.219 * 30); // 1567
const ABS_DEPOSAIENT    = Math.round(54.020 * 30); // 1621
const ABS_ELOIGNAIENT   = Math.round(56.819 * 30); // 1705
const ABS_ACHETEURS     = Math.round(58.599 * 30); // 1758
const ABS_POSAIENT_OR   = Math.round(60.840 * 30); // 1825
const ABS_SANS_MOT      = Math.round(63.239 * 30); // 1897
const ABS_SILENT_BARTER = Math.round(65.379 * 30); // 1961
const ABS_SEL_CONTRE_OR = Math.round(67.619 * 30); // 2029
const ABS_POIDS_EGAL    = Math.round(69.099 * 30); // 2073

const R_MARCHES       = ABS_MARCHES       - BEAT_START; // 105
const R_DEPOSAIENT    = ABS_DEPOSAIENT    - BEAT_START; // 159
const R_ELOIGNAIENT   = ABS_ELOIGNAIENT   - BEAT_START; // 243
const R_ACHETEURS     = ABS_ACHETEURS     - BEAT_START; // 296
const R_POSAIENT_OR   = ABS_POSAIENT_OR   - BEAT_START; // 363
const R_SANS_MOT      = ABS_SANS_MOT      - BEAT_START; // 435
const R_SILENT_BARTER = ABS_SILENT_BARTER - BEAT_START; // 499
const R_SEL_CONTRE_OR = ABS_SEL_CONTRE_OR - BEAT_START; // 567
const R_POIDS_EGAL    = ABS_POIDS_EGAL    - BEAT_START; // 611

// POI coords brutes (SVG 720×1280)
const POI = ghanaData.mercSahel.poi;
const SVG_KOUMBI_X = POI.KOUMBI_SALEH.x; // 238.56
const SVG_KOUMBI_Y = POI.KOUMBI_SALEH.y; // 696.95
const SVG_TAGHAZA_X = POI.TAGHAZA.x;     // 322.13
const SVG_TAGHAZA_Y = POI.TAGHAZA.y;     // 517.73
const SVG_BAMBOUK_X = POI.BAMBOUK.x;     // 164.52
const SVG_BAMBOUK_Y = POI.BAMBOUK.y;     // 766.83

// Drop point (où le berbere s'accroupit) — légèrement au nord-ouest de Koumbi
const SVG_DROP_SEL_X = SVG_KOUMBI_X - 28;
const SVG_DROP_SEL_Y = SVG_KOUMBI_Y - 18;
// Drop point or — sud-est de Koumbi
const SVG_DROP_OR_X  = SVG_KOUMBI_X + 28;
const SVG_DROP_OR_Y  = SVG_KOUMBI_Y + 18;

// Composition scale
const SVG_W = 720;
const COMP_W = 1080;
const CSS_SCALE = COMP_W / SVG_W; // 1.5

// Sprites paths
const BERBERE_WALK    = "empire-ghana/characters/berbere/animations/walking-b8b230ef";
const BERBERE_CROUCH  = "empire-ghana/characters/berbere/animations/crouching-22bab130";
const SAHELIEN_WALK   = "empire-ghana/characters/sahelien/animations/walking-3848d070";
const SAHELIEN_CROUCH = "empire-ghana/characters/sahelien/animations/crouching-7ca15898";
const SPRITE_SIZE = 140;
const SPRITE_FILTER = "drop-shadow(2px 2px 6px rgba(0,0,0,0.6))";

// Phases temporelles
const BERBERE_START         = R_DEPOSAIENT - 60;  // 99
const BERBERE_CROUCH_START  = R_DEPOSAIENT;       // 159
const BERBERE_CROUCH_END    = R_DEPOSAIENT + 20;  // 179
const BERBERE_END           = R_ELOIGNAIENT + 30; // 273
const SAHELIEN_START        = R_ACHETEURS;        // 296
const SAHELIEN_CROUCH_START = R_POSAIENT_OR;      // 363
const SAHELIEN_CROUCH_END   = R_POSAIENT_OR + 20; // 383
const SAHELIEN_END          = R_POSAIENT_OR + 80; // 443

// ─── Camera state — calculé une fois, partagé entre SVG et CSS ────────────────
function computeCameraState(localFrame: number) {
  const driftX = Math.sin(localFrame * 0.014) * 4;
  const driftY = Math.cos(localFrame * 0.011) * 3;

  // Position berbere en temps réel
  let berbereX = SVG_TAGHAZA_X;
  let berbereY = SVG_TAGHAZA_Y;
  if (localFrame >= BERBERE_START && localFrame < BERBERE_CROUCH_START) {
    const p = (localFrame - BERBERE_START) / (BERBERE_CROUCH_START - BERBERE_START);
    berbereX = SVG_TAGHAZA_X + (SVG_DROP_SEL_X - SVG_TAGHAZA_X) * p;
    berbereY = SVG_TAGHAZA_Y + (SVG_DROP_SEL_Y - SVG_TAGHAZA_Y) * p;
  } else if (localFrame >= BERBERE_CROUCH_START && localFrame < BERBERE_CROUCH_END) {
    berbereX = SVG_DROP_SEL_X;
    berbereY = SVG_DROP_SEL_Y;
  } else if (localFrame >= BERBERE_CROUCH_END && localFrame < BERBERE_END) {
    const p = (localFrame - BERBERE_CROUCH_END) / (BERBERE_END - BERBERE_CROUCH_END);
    berbereX = SVG_DROP_SEL_X + (SVG_TAGHAZA_X - SVG_DROP_SEL_X) * p;
    berbereY = SVG_DROP_SEL_Y + (SVG_TAGHAZA_Y - SVG_DROP_SEL_Y) * p;
  }

  // Position sahelien en temps réel
  let sahelienX = SVG_BAMBOUK_X;
  let sahelienY = SVG_BAMBOUK_Y;
  if (localFrame >= SAHELIEN_START && localFrame < SAHELIEN_CROUCH_START) {
    const p = (localFrame - SAHELIEN_START) / (SAHELIEN_CROUCH_START - SAHELIEN_START);
    sahelienX = SVG_BAMBOUK_X + (SVG_DROP_OR_X - SVG_BAMBOUK_X) * p;
    sahelienY = SVG_BAMBOUK_Y + (SVG_DROP_OR_Y - SVG_BAMBOUK_Y) * p;
  } else if (localFrame >= SAHELIEN_CROUCH_START && localFrame < SAHELIEN_CROUCH_END) {
    sahelienX = SVG_DROP_OR_X;
    sahelienY = SVG_DROP_OR_Y;
  } else if (localFrame >= SAHELIEN_CROUCH_END && localFrame < SAHELIEN_END) {
    const p = (localFrame - SAHELIEN_CROUCH_END) / (SAHELIEN_END - SAHELIEN_CROUCH_END);
    sahelienX = SVG_DROP_OR_X + (SVG_BAMBOUK_X - SVG_DROP_OR_X) * p;
    sahelienY = SVG_DROP_OR_Y + (SVG_BAMBOUK_Y - SVG_DROP_OR_Y) * p;
  }

  // Camera focus point (suit le sprite actif)
  let camFocusX = SVG_KOUMBI_X;
  let camFocusY = SVG_KOUMBI_Y;

  // Pendant berbere walk : focus sur berbere
  if (localFrame >= BERBERE_START && localFrame < BERBERE_END) {
    camFocusX = berbereX;
    camFocusY = berbereY;
  }
  // Entre berbere fini et sahelien start : focus marché Koumbi
  else if (localFrame >= BERBERE_END && localFrame < SAHELIEN_START) {
    const p = interpolate(localFrame, [BERBERE_END, SAHELIEN_START], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    camFocusX = berbereX + (SVG_KOUMBI_X - berbereX) * p;
    camFocusY = berbereY + (SVG_KOUMBI_Y - berbereY) * p;
  }
  // Pendant sahelien walk : focus sur sahelien
  else if (localFrame >= SAHELIEN_START && localFrame < SAHELIEN_END) {
    camFocusX = sahelienX;
    camFocusY = sahelienY;
  }
  // Après sahelien : focus marché Koumbi
  else if (localFrame >= SAHELIEN_END) {
    camFocusX = SVG_KOUMBI_X;
    camFocusY = SVG_KOUMBI_Y;
  }

  // Zoom dynamique :
  //  - Phase intro (0-30) : zoom in 1.7→2.0
  //  - Berbere walk : zoom 2.0
  //  - Berbere crouch : 2.2 (insert détail)
  //  - Inter-walk (BERBERE_END → SAHELIEN_START) : pull-back 2.0→1.5 (re-frame marché)
  //  - Sahelien walk : zoom 2.0
  //  - Sahelien crouch : 2.2
  //  - Sans un mot (R_SANS_MOT) : maintien 2.0
  //  - Dolly-out final (R_POIDS_EGAL → fin) : pull-back dramatique 2.0 → 1.10
  // Zoom amplifié pour vraiment "voir" les personnages
  let camZoom = 1.85;
  if (localFrame < 30) {
    camZoom = interpolate(localFrame, [0, 30], [1.70, 2.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (localFrame < BERBERE_START) {
    camZoom = interpolate(localFrame, [30, BERBERE_START], [2.2, 2.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (localFrame < BERBERE_CROUCH_START) {
    camZoom = 2.8; // gros plan walk
  } else if (localFrame < BERBERE_CROUCH_END) {
    camZoom = 3.2; // insert détail crouch
  } else if (localFrame < BERBERE_END) {
    camZoom = 2.8;
  } else if (localFrame < SAHELIEN_START) {
    camZoom = interpolate(localFrame, [BERBERE_END, SAHELIEN_START], [2.8, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (localFrame < SAHELIEN_CROUCH_START) {
    camZoom = interpolate(localFrame, [SAHELIEN_START, SAHELIEN_CROUCH_START], [1.6, 2.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (localFrame < SAHELIEN_CROUCH_END) {
    camZoom = 3.2;
  } else if (localFrame < SAHELIEN_END) {
    camZoom = 2.8;
  } else if (localFrame < R_POIDS_EGAL) {
    camZoom = interpolate(localFrame, [SAHELIEN_END, R_POIDS_EGAL], [2.8, 2.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else {
    // Dolly-out dramatique : 2.4 → 1.0
    camZoom = interpolate(localFrame, [R_POIDS_EGAL, R_POIDS_EGAL + 60, TOTAL_FRAMES], [2.4, 1.10, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  // Tilt : annulé pendant les zooms forts
  const tiltBase = 18 + Math.sin(localFrame * 0.04) * 2;
  const effectiveTilt = camZoom > 1.9 ? interpolate(camZoom, [1.9, 2.2], [tiltBase, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : tiltBase;
  const skewX = effectiveTilt * 0.15;
  const scaleY = 1 - effectiveTilt * 0.008;

  return {
    driftX, driftY,
    camFocusX, camFocusY,
    camZoom, skewX, scaleY,
    berbereX, berbereY,
    sahelienX, sahelienY,
  };
}

// Convertit coordonnées SVG → coordonnées composition (1080×1920)
function svgToCompWithCam(
  svgX: number, svgY: number,
  cam: ReturnType<typeof computeCameraState>,
): { x: number; y: number } {
  // Transform SVG : translate(360+drift-cam, 640+drift-cam) scale(zoom) skewX translate(-360,-640)
  // Mais ici on track sur camFocus, donc :
  // translate(360+drift, 640+drift) scale(zoom) translate(-camFocusX, -camFocusY)
  // → screenSvgX = (svgX - camFocusX) * zoom + 360 + drift
  const screenSvgX = (svgX - cam.camFocusX) * cam.camZoom + 360 + cam.driftX;
  const screenSvgY = (svgY - cam.camFocusY) * cam.camZoom * cam.scaleY + 640 + cam.driftY;
  return { x: screenSvgX * CSS_SCALE, y: screenSvgY * CSS_SCALE };
}

export const Beat3Barter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = computeCameraState(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: GHANA_PALETTE.NOIR_PROFOND }}>
      <Audio
        src={staticFile("audio/atlas-empire-ghana/narration-v1.mp3")}
        startFrom={SEGMENTS.S3_BARTER.startFrame}
      />
      <Audio
        src={staticFile("audio/atlas-empire-ghana/music/v1-B-marche-or.mp3")}
        volume={0.07}
        startFrom={SEGMENTS.S3_BARTER.startFrame}
      />

      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block", position: "absolute", top: 0, left: 0 }}
      >
        <Beat3Defs />
        <Beat3MapContent localFrame={frame} fps={fps} cam={cam} />
      </svg>

      <Beat3Sprites localFrame={frame} cam={cam} />

      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block", position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        <Beat3Overlays localFrame={frame} fps={fps} />
      </svg>
    </AbsoluteFill>
  );
};

export const BEAT3_BARTER_FRAMES = TOTAL_FRAMES;

const Beat3Defs: React.FC = () => (
  <defs>
    <radialGradient id="b3BgGrad" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stopColor={GHANA_PALETTE.SEPIA_FOND} />
      <stop offset="100%" stopColor={GHANA_PALETTE.NOIR_PROFOND} />
    </radialGradient>
    <radialGradient id="b3Vignette" cx="50%" cy="50%" r="65%">
      <stop offset="55%" stopColor="#000" stopOpacity="0" />
      <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
    </radialGradient>
    <pattern id="b3WagadouHatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke={GHANA_PALETTE.OR} strokeWidth="2.5" opacity="0.85" />
      <line x1="4" y1="0" x2="4" y2="8" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5" opacity="0.7" />
    </pattern>
    <radialGradient id="b3MarketGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={GHANA_PALETTE.OR_VIF} stopOpacity="0.5" />
      <stop offset="60%" stopColor={GHANA_PALETTE.OR} stopOpacity="0.15" />
      <stop offset="100%" stopColor="transparent" />
    </radialGradient>
    <radialGradient id="b3EmpireGlow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stopColor={GHANA_PALETTE.OR_VIF} stopOpacity="0.3" />
      <stop offset="100%" stopColor="transparent" />
    </radialGradient>
  </defs>
);

const Beat3MapContent: React.FC<{
  localFrame: number;
  fps: number;
  cam: ReturnType<typeof computeCameraState>;
}> = ({ localFrame, fps, cam }) => {
  const countries = ghanaData.mercSahel.countries;

  const globalFadeIn  = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalFadeOut = interpolate(localFrame, [TOTAL_FRAMES - 12, TOTAL_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const marcheT = spring({ frame: localFrame - R_MARCHES, fps, config: SPRING_SOFT });
  const pulseMarche = localFrame >= R_MARCHES ? ((localFrame - R_MARCHES) % 50) / 50 : 0;

  // ── DOLLY-OUT FINAL : routes qui s'illuminent + empire qui pulse ────────────
  const dollyT = interpolate(localFrame, [R_POIDS_EGAL, R_POIDS_EGAL + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const empirePulse = localFrame >= R_POIDS_EGAL ? 0.5 + 0.5 * Math.sin((localFrame - R_POIDS_EGAL) * 0.1) : 0;

  return (
    <g opacity={globalFadeIn * globalFadeOut}>
      <rect x="0" y="0" width="720" height="1280" fill="url(#b3BgGrad)" />
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

        {/* Empire Wagadou — fill + hachures */}
        <path d={ghanaData.mercSahel.wagadouEmpire} fill={GHANA_PALETTE.PARCHEMIN} fillOpacity="0.18" stroke="none" />
        <path
          d={ghanaData.mercSahel.wagadouEmpire}
          fill="url(#b3WagadouHatch)" fillOpacity="0.75"
          stroke={ATLAS_COLORS.empireOutlineDark} strokeWidth="3" strokeOpacity="0.9"
          strokeLinejoin="round" strokeDasharray="10 5"
        />
        {/* Empire glow OR pendant dolly-out — overlay direct OR_VIF (visible) */}
        {dollyT > 0.01 && (
          <>
            <path
              d={ghanaData.mercSahel.wagadouEmpire}
              fill={GHANA_PALETTE.OR_VIF}
              fillOpacity={dollyT * (0.25 + empirePulse * 0.25)}
              stroke="none"
            />
            {/* Outline gold qui pulse */}
            <path
              d={ghanaData.mercSahel.wagadouEmpire}
              fill="none"
              stroke={GHANA_PALETTE.OR_VIF}
              strokeWidth={3 + dollyT * 4 + empirePulse * 2}
              strokeOpacity={dollyT * (0.7 + empirePulse * 0.3)}
              strokeLinejoin="round"
            />
          </>
        )}

        {/* Routes commerciales PAR-DESSUS l'empire — visibles pendant dolly-out */}
        <path
          d={ghanaData.mercSahel.routes.sel}
          stroke={GHANA_PALETTE.BLANC_SEL}
          strokeWidth={2 + dollyT * 3}
          fill="none"
          strokeDasharray="6 4"
          opacity={0.5 + dollyT * 0.5}
        />
        <path
          d={ghanaData.mercSahel.routes.or}
          stroke={GHANA_PALETTE.OR_VIF}
          strokeWidth={2 + dollyT * 3}
          fill="none"
          strokeDasharray="6 4"
          opacity={0.5 + dollyT * 0.5}
        />
        {/* Glow stroke sur les routes pendant dolly-out (effet illumination) */}
        {dollyT > 0.01 && (
          <>
            <path
              d={ghanaData.mercSahel.routes.sel}
              stroke={GHANA_PALETTE.BLANC_SEL}
              strokeWidth={8 + empirePulse * 4}
              fill="none"
              opacity={dollyT * 0.35}
            />
            <path
              d={ghanaData.mercSahel.routes.or}
              stroke={GHANA_PALETTE.OR_VIF}
              strokeWidth={8 + empirePulse * 4}
              fill="none"
              opacity={dollyT * 0.45}
            />
          </>
        )}

        {/* POI Taghaza */}
        <circle cx={SVG_TAGHAZA_X} cy={SVG_TAGHAZA_Y} r="5" fill={GHANA_PALETTE.BLANC_SEL} stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5" />
        <text x={SVG_TAGHAZA_X} y={SVG_TAGHAZA_Y - 10} textAnchor="middle" fill={ATLAS_COLORS.textInk} fontSize="11" fontFamily={GHANA_FONTS.SERIF} letterSpacing="1.5" fontWeight="600">TAGHAZA</text>

        {/* POI Bambouk */}
        <circle cx={SVG_BAMBOUK_X} cy={SVG_BAMBOUK_Y} r="5" fill={GHANA_PALETTE.OR} stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5" />
        <text x={SVG_BAMBOUK_X + 10} y={SVG_BAMBOUK_Y + 16} textAnchor="start" fill={ATLAS_COLORS.textInk} fontSize="11" fontFamily={GHANA_FONTS.SERIF} letterSpacing="1.5" fontWeight="600">BAMBOUK</text>

        {/* POI Koumbi Saleh — pulse */}
        {localFrame >= R_MARCHES && marcheT > 0.05 && (
          <g transform={`translate(${SVG_KOUMBI_X} ${SVG_KOUMBI_Y})`} opacity={marcheT}>
            <circle cx="0" cy="0" r={10 + pulseMarche * 22} fill="none" stroke={GHANA_PALETTE.OR_VIF} strokeWidth="2" opacity={(1 - pulseMarche) * 0.8} />
            <circle cx="0" cy="0" r="35" fill="url(#b3MarketGlow)" />
            <circle cx="0" cy="0" r="6" fill={GHANA_PALETTE.OR_VIF} stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5" />
            <text x="11" y="-7" textAnchor="start" fill={ATLAS_COLORS.textInk} fontSize="11" fontFamily={GHANA_FONTS.SERIF} fontWeight="700" letterSpacing="1.5">KOUMBI SALEH</text>
          </g>
        )}
      </g>
    </g>
  );
};

const Beat3Sprites: React.FC<{
  localFrame: number;
  cam: ReturnType<typeof computeCameraState>;
}> = ({ localFrame, cam }) => {
  // Position drop sel/or projetée — utilisée pour les sacs et la balance
  const dropSelComp = svgToCompWithCam(SVG_DROP_SEL_X, SVG_DROP_SEL_Y, cam);
  const dropOrComp  = svgToCompWithCam(SVG_DROP_OR_X, SVG_DROP_OR_Y, cam);
  const koumbi = svgToCompWithCam(SVG_KOUMBI_X, SVG_KOUMBI_Y, cam);

  // ── BERBERE sprite ──────────────────────────────────────────────────────────
  const berbereVisible = localFrame >= BERBERE_START && localFrame < BERBERE_END;
  let berbereSrc = "";
  if (berbereVisible) {
    if (localFrame < BERBERE_CROUCH_START) {
      berbereSrc = staticFile(getSpriteFramePath(localFrame - BERBERE_START, { basePath: BERBERE_WALK, direction: "south", totalFrames: 6, framesPerSpriteFrame: 6 }));
    } else if (localFrame < BERBERE_CROUCH_END) {
      berbereSrc = staticFile(getSpriteFramePath(localFrame - BERBERE_CROUCH_START, { basePath: BERBERE_CROUCH, direction: "south", totalFrames: 5, framesPerSpriteFrame: 4 }));
    } else {
      berbereSrc = staticFile(getSpriteFramePath(localFrame - BERBERE_CROUCH_END, { basePath: BERBERE_WALK, direction: "north", totalFrames: 6, framesPerSpriteFrame: 6 }));
    }
  }
  const berberePos = svgToCompWithCam(cam.berbereX, cam.berbereY, cam);

  // ── SAHELIEN sprite ─────────────────────────────────────────────────────────
  const sahelienVisible = localFrame >= SAHELIEN_START && localFrame < SAHELIEN_END;
  let sahelienSrc = "";
  if (sahelienVisible) {
    if (localFrame < SAHELIEN_CROUCH_START) {
      sahelienSrc = staticFile(getSpriteFramePath(localFrame - SAHELIEN_START, { basePath: SAHELIEN_WALK, direction: "east", totalFrames: 6, framesPerSpriteFrame: 6 }));
    } else if (localFrame < SAHELIEN_CROUCH_END) {
      sahelienSrc = staticFile(getSpriteFramePath(localFrame - SAHELIEN_CROUCH_START, { basePath: SAHELIEN_CROUCH, direction: "east", totalFrames: 5, framesPerSpriteFrame: 4 }));
    } else {
      sahelienSrc = staticFile(getSpriteFramePath(localFrame - SAHELIEN_CROUCH_END, { basePath: SAHELIEN_WALK, direction: "west", totalFrames: 6, framesPerSpriteFrame: 6 }));
    }
  }
  const sahelienPos = svgToCompWithCam(cam.sahelienX, cam.sahelienY, cam);

  // ── SACS persistants ────────────────────────────────────────────────────────
  const sacSelVisible = localFrame >= BERBERE_CROUCH_END;
  const sacSelOpacity = interpolate(localFrame, [BERBERE_CROUCH_END, BERBERE_CROUCH_END + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const sacOrVisible = localFrame >= SAHELIEN_CROUCH_END;
  const sacOrOpacity = interpolate(localFrame, [SAHELIEN_CROUCH_END, SAHELIEN_CROUCH_END + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Taille sacs : suit le zoom caméra (visible quand on dolly-out)
  const sacSize = 60 * (cam.camZoom / 1.85);

  // ── BALANCE PixelLab PNG (entre les sacs, au-dessus) ────────────────────────
  const balanceVisible = localFrame >= R_SEL_CONTRE_OR;
  const balanceOpacity = interpolate(localFrame, [R_SEL_CONTRE_OR, R_SEL_CONTRE_OR + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const balanceTilt = (() => {
    if (localFrame < R_SEL_CONTRE_OR) return 0;
    if (localFrame < R_POIDS_EGAL) {
      return interpolate(localFrame, [R_SEL_CONTRE_OR, R_POIDS_EGAL], [-10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    }
    return Math.sin((localFrame - R_POIDS_EGAL) * 0.12) * 2.5;
  })();

  const balanceSize = 140 * (cam.camZoom / 1.85);
  const balancePos = svgToCompWithCam(SVG_KOUMBI_X, SVG_KOUMBI_Y - 30, cam);

  return (
    <>
      {/* Sac sel — au pied du berbere quand il s'accroupit */}
      {sacSelVisible && (
        <div style={{
          position: "absolute",
          left: dropSelComp.x - sacSize / 2,
          top: dropSelComp.y - sacSize / 2,
          width: sacSize,
          opacity: sacSelOpacity,
          filter: SPRITE_FILTER,
          pointerEvents: "none",
        }}>
          <img
            src={staticFile("empire-ghana/assets/pixellab/sac-sel.png")}
            style={{ width: sacSize, height: sacSize, imageRendering: "pixelated", display: "block" }}
            alt=""
          />
        </div>
      )}

      {/* Sac or — au pied du sahelien quand il s'accroupit */}
      {sacOrVisible && (
        <div style={{
          position: "absolute",
          left: dropOrComp.x - sacSize / 2,
          top: dropOrComp.y - sacSize / 2,
          width: sacSize,
          opacity: sacOrOpacity,
          filter: SPRITE_FILTER,
          pointerEvents: "none",
        }}>
          <img
            src={staticFile("empire-ghana/assets/pixellab/sac-or.png")}
            style={{ width: sacSize, height: sacSize, imageRendering: "pixelated", display: "block" }}
            alt=""
          />
        </div>
      )}

      {/* Balance PixelLab PNG — entre les sacs, au-dessus de Koumbi */}
      {balanceVisible && (
        <div style={{
          position: "absolute",
          left: balancePos.x - balanceSize / 2,
          top: balancePos.y - balanceSize - 20,
          width: balanceSize,
          height: balanceSize,
          opacity: balanceOpacity,
          transform: `rotate(${balanceTilt}deg)`,
          transformOrigin: "center center",
          filter: SPRITE_FILTER,
          pointerEvents: "none",
        }}>
          <img
            src={staticFile("empire-ghana/assets/pixellab/balance-commerciale.png")}
            style={{ width: balanceSize, height: balanceSize, imageRendering: "pixelated", display: "block" }}
            alt=""
          />
        </div>
      )}

      {/* Berbere */}
      {berbereVisible && berbereSrc && (
        <Img
          src={berbereSrc}
          style={{
            position: "absolute",
            left: berberePos.x - SPRITE_SIZE / 2,
            top: berberePos.y - SPRITE_SIZE / 2 - 30,
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: SPRITE_FILTER,
          }}
        />
      )}

      {/* Sahelien */}
      {sahelienVisible && sahelienSrc && (
        <Img
          src={sahelienSrc}
          style={{
            position: "absolute",
            left: sahelienPos.x - SPRITE_SIZE / 2,
            top: sahelienPos.y - SPRITE_SIZE / 2 - 30,
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: SPRITE_FILTER,
          }}
        />
      )}
    </>
  );
};

const Beat3Overlays: React.FC<{ localFrame: number; fps: number }> = ({ localFrame, fps }) => {
  const globalFadeIn  = interpolate(localFrame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const globalFadeOut = interpolate(localFrame, [TOTAL_FRAMES - 12, TOTAL_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vignetteOpacity = 0.65 + 0.15 * Math.sin(localFrame * 0.025);

  const dimSilence = interpolate(
    localFrame,
    [R_SANS_MOT, R_SANS_MOT + 15, R_SILENT_BARTER - 10, R_SILENT_BARTER],
    [0, 0.3, 0.3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const silentBarterT = spring({ frame: localFrame - R_SILENT_BARTER, fps, config: { damping: 14, stiffness: 200 } });
  const silentBarterOpacity = interpolate(
    localFrame,
    [R_SILENT_BARTER, R_SILENT_BARTER + 10, TOTAL_FRAMES - 15, TOTAL_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Cartouche "5 SIÈCLES DE COMMERCE" pendant le dolly-out
  const cinqSieclesT = spring({ frame: localFrame - (R_POIDS_EGAL + 25), fps, config: { damping: 14, stiffness: 180 } });
  const cinqSieclesOpacity = interpolate(
    localFrame,
    [R_POIDS_EGAL + 25, R_POIDS_EGAL + 40, TOTAL_FRAMES - 15, TOTAL_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <g opacity={globalFadeIn * globalFadeOut}>
      {dimSilence > 0.01 && (
        <rect x="0" y="0" width="720" height="1280" fill={GHANA_PALETTE.NOIR_PROFOND} opacity={dimSilence} />
      )}

      {/* "LE SILENT BARTER" — top half */}
      {localFrame >= R_SILENT_BARTER && silentBarterOpacity > 0.01 && localFrame < R_POIDS_EGAL + 20 && (
        <g transform={`translate(360 180) scale(${0.85 + 0.15 * silentBarterT})`} opacity={silentBarterOpacity}>
          <rect x="-230" y="-45" width="460" height="90" fill={GHANA_PALETTE.PARCHEMIN} stroke={GHANA_PALETTE.OR} strokeWidth="3" rx="6" />
          <rect x="-222" y="-37" width="444" height="74" fill="none" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1" rx="3" opacity="0.7" />
          <text x="0" y="8" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="30" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} letterSpacing="5">LE SILENT BARTER</text>
          <text x="0" y="34" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="15" fontStyle="italic" fill={GHANA_PALETTE.OR_TERNI} letterSpacing="2" opacity="0.9">commerce sans parole, sans confiance aveugle</text>
        </g>
      )}

      {/* Cartouche dolly-out : "5 SIÈCLES DE COMMERCE" */}
      {localFrame >= R_POIDS_EGAL + 25 && cinqSieclesOpacity > 0.01 && (
        <g transform={`translate(360 220) scale(${0.85 + 0.15 * cinqSieclesT})`} opacity={cinqSieclesOpacity}>
          <rect x="-260" y="-50" width="520" height="100" fill={GHANA_PALETTE.PARCHEMIN} stroke={GHANA_PALETTE.OR} strokeWidth="3" rx="6" />
          <rect x="-252" y="-42" width="504" height="84" fill="none" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1" rx="3" opacity="0.7" />
          <text x="0" y="-2" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="36" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} letterSpacing="6">5 SIÈCLES</text>
          <text x="0" y="28" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="16" fontStyle="italic" fill={GHANA_PALETTE.OR_TERNI} letterSpacing="2" opacity="0.95">de commerce mondial sur ce silence</text>
        </g>
      )}

      <rect x="0" y="0" width="720" height="1280" fill="url(#b3Vignette)" opacity={vignetteOpacity} />
    </g>
  );
};
