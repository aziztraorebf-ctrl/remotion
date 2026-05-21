// Beat 2 Density — Empire du Ghana — v3
// "À Taghaza, au nord... d'or, de sel, et d'esclaves."
// Frames 676 → 1462 (786 frames, ~26.2s)
//
// Narrative triggers (all frames = absolute, relative to start of narration-v1.mp3):
//   frame 705  — "Taghaza" : sprite bloc-sel-mine apparait + label + pulse marker
//   frame 855  — "quatre-vingt-dix" : spotlight #1 "90 KG / BLOC"
//   frame 960  — "Bambouk" : sprite pieces-or + label + pulse marker
//   frame 1170 — "Koumbi Saleh" : re-zoom + sprite koumbi-saleh-sheet animé
//   frame 1230 — "vingt mille" : spotlight #2 "20 000 HABITANTS"
//   frame 1321 — "caravane" : 2 chameaux animés (spritesheet 4 frames) Taghaza→Koumbi
//   frame 1350 — "taxait" : triade OR · SEL · ESCLAVES (en haut)
//
// Camera pan: Taghaza (large) → Bambouk (snap) → re-zoom Koumbi Saleh (spring)
// Caravane: 2 chameaux staggered, walk east, apparaissent exactement au mot "caravane"

import React from "react";
import {
  AbsoluteFill,
  Audio,
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
import { SEGMENTS, KEY_WORDS } from "../timing";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ghanaData = require("../../../../../data/geo/empire-ghana-data.json");

const SNAP_CONFIG = { damping: 80, stiffness: 400 };
const SPRING_SOFT = { damping: 14, stiffness: 90 };

// ─── Triggers locaux (frame absolu → offset relatif au début du beat = startFrame 676) ──
const BEAT_START = SEGMENTS.S2_DENSITY.startFrame; // 676

// Frames absolues (depuis start audio narration-v1.mp3)
const ABS_TAGHAZA       = KEY_WORDS.TAGHAZA.frame;          // 705
const ABS_90KG          = KEY_WORDS.QUATRE_VINGT_DIX.frame; // 855
const ABS_90KG_OUT      = ABS_90KG + 85;                    // 940
const ABS_BAMBOUK       = KEY_WORDS.BAMBOUK.frame;          // 960
// "caravane" = 44.02s → alignment exact (ghana-alignment.ts ligne 188)
const ABS_CARAVANE      = Math.round(44.02 * 30);           // 1321 — mot "caravane"
const ABS_KOUMBI        = KEY_WORDS.KOUMBI_SALEH.frame;     // 1170
const ABS_20K           = KEY_WORDS.VINGT_MILLE.frame;      // 1230
const ABS_20K_OUT       = ABS_20K + 80;                     // 1310
const ABS_TRIADE        = KEY_WORDS.TAXAIT.frame;           // 1350
const ABS_BEAT_END      = SEGMENTS.S2_DENSITY.endFrame;     // 1462

// Frames relatives au début de la composition (localFrame = 0 au frame absolu 676)
const R_TAGHAZA    = ABS_TAGHAZA   - BEAT_START; // 29
const R_90KG       = ABS_90KG      - BEAT_START; // 179
const R_90KG_OUT   = ABS_90KG_OUT  - BEAT_START; // 264
const R_BAMBOUK    = ABS_BAMBOUK   - BEAT_START; // 284
const R_CARAVANE   = ABS_CARAVANE  - BEAT_START; // 645 — localFrame 21.5s, mot "caravane"
const R_KOUMBI     = ABS_KOUMBI    - BEAT_START; // 494
const R_20K        = ABS_20K       - BEAT_START; // 554
const R_20K_OUT    = ABS_20K_OUT   - BEAT_START; // 634
const R_TRIADE     = ABS_TRIADE    - BEAT_START; // 674
const TOTAL_FRAMES = SEGMENTS.S2_DENSITY.durationFrames; // 786

// ─── POI coords (mercSahel projection) ─────────────────────────────────────
const TAGHAZA_X = 322.13;
const TAGHAZA_Y = 517.73;
const BAMBOUK_X = 164.52;
const BAMBOUK_Y = 766.83;
const KOUMBI_X  = 238.56;
const KOUMBI_Y  = 696.95;

export const Beat2Density: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: GHANA_PALETTE.NOIR_PROFOND }}>
      <Audio
        src={staticFile("audio/atlas-empire-ghana/narration-v1.mp3")}
        startFrom={SEGMENTS.S2_DENSITY.startFrame}
      />
      <Audio
        src={staticFile("audio/atlas-empire-ghana/music/v1-B-marche-or.mp3")}
        volume={0.07}
        startFrom={SEGMENTS.S2_DENSITY.startFrame}
      />

      <svg
        viewBox="0 0 720 1280"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <Beat2Defs />
        <Beat2Content localFrame={frame} fps={fps} />
      </svg>
    </AbsoluteFill>
  );
};

export const BEAT2_DENSITY_FRAMES = TOTAL_FRAMES;

// ─── Defs ───────────────────────────────────────────────────────────────────
const Beat2Defs: React.FC = () => (
  <defs>
    <radialGradient id="b2BgGrad" cx="50%" cy="50%" r="80%">
      <stop offset="0%" stopColor={GHANA_PALETTE.SEPIA_FOND} />
      <stop offset="100%" stopColor={GHANA_PALETTE.NOIR_PROFOND} />
    </radialGradient>
    <radialGradient id="b2Vignette" cx="50%" cy="50%" r="65%">
      <stop offset="55%" stopColor="#000" stopOpacity="0" />
      <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
    </radialGradient>
    <pattern
      id="b2WagadouHatch"
      patternUnits="userSpaceOnUse"
      width="8"
      height="8"
      patternTransform="rotate(45)"
    >
      <line x1="0" y1="0" x2="0" y2="8" stroke={GHANA_PALETTE.OR} strokeWidth="2.5" opacity="0.85" />
      <line x1="4" y1="0" x2="4" y2="8" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5" opacity="0.7" />
    </pattern>
    <radialGradient id="b2SpotlightGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={GHANA_PALETTE.OR_VIF} stopOpacity="0.5" />
      <stop offset="70%" stopColor={GHANA_PALETTE.OR} stopOpacity="0.15" />
      <stop offset="100%" stopColor="transparent" />
    </radialGradient>
    <radialGradient id="b2PoiHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={GHANA_PALETTE.OR_VIF} stopOpacity="0.65" />
      <stop offset="60%" stopColor={GHANA_PALETTE.OR} stopOpacity="0.2" />
      <stop offset="100%" stopColor="transparent" />
    </radialGradient>
    <radialGradient id="b2KoumbiHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={GHANA_PALETTE.OR_VIF} stopOpacity="0.7" />
      <stop offset="60%" stopColor={GHANA_PALETTE.OR} stopOpacity="0.25" />
      <stop offset="100%" stopColor="transparent" />
    </radialGradient>
  </defs>
);

// ─── Content ─────────────────────────────────────────────────────────────────
const Beat2Content: React.FC<{ localFrame: number; fps: number }> = ({ localFrame, fps }) => {
  const countries = ghanaData.mercSahel.countries;

  // ── Ken Burns drift (continu, identique Beat 1) ────────────────────────────
  const driftX = Math.sin(localFrame * 0.014) * 10;
  const driftY = Math.cos(localFrame * 0.011) * 7;
  const fgDriftX = Math.sin(localFrame * 0.014) * 13;
  const fgDriftY = Math.cos(localFrame * 0.011) * 9;
  const parallaxX = fgDriftX - driftX;
  const parallaxY = fgDriftY - driftY;

  // ── Tilt breathing (forkée Beat 1, commencé dès le début du beat) ─────────
  const tiltBreath = Math.sin(localFrame * 0.04) * 2;
  const skewX = (18 + tiltBreath) * 0.15;
  const scaleY = 1 - (18 + tiltBreath) * 0.008;

  // ── Camera pan 3 POI ─────────────────────────────────────────────────────
  // Phase 1 : Taghaza (frames 0 → R_BAMBOUK-1) — camera large sur Sahara nord
  // Phase 2 : snap vers Bambouk (R_BAMBOUK → R_KOUMBI-1)
  // Phase 3 : re-zoom resserré sur Koumbi Saleh (R_KOUMBI → fin)

  // Cible caméra X
  const camTargetX = (() => {
    if (localFrame < R_BAMBOUK) {
      // Phase 1 : Taghaza (vue large, légèrement décentrée)
      return (TAGHAZA_X - 360) * 0.5;
    }
    if (localFrame < R_KOUMBI) {
      // Phase 2 : snap spring vers Bambouk
      const t = spring({ frame: localFrame - R_BAMBOUK, fps, config: SNAP_CONFIG });
      const taghazaOff = (TAGHAZA_X - 360) * 0.5;
      const bamboukOff = (BAMBOUK_X - 360) * 0.6;
      return taghazaOff + (bamboukOff - taghazaOff) * t;
    }
    // Phase 3 : re-zoom sur Koumbi
    const t = spring({ frame: localFrame - R_KOUMBI, fps, config: SNAP_CONFIG });
    const bamboukOff = (BAMBOUK_X - 360) * 0.6;
    const koumbiOff = (KOUMBI_X - 360) * 0.7;
    return bamboukOff + (koumbiOff - bamboukOff) * t;
  })();

  // Cible caméra Y
  const camTargetY = (() => {
    if (localFrame < R_BAMBOUK) {
      return (TAGHAZA_Y - 640) * 0.5;
    }
    if (localFrame < R_KOUMBI) {
      const t = spring({ frame: localFrame - R_BAMBOUK, fps, config: SNAP_CONFIG });
      const taghazaOff = (TAGHAZA_Y - 640) * 0.5;
      const bamboukOff = (BAMBOUK_Y - 640) * 0.6;
      return taghazaOff + (bamboukOff - taghazaOff) * t;
    }
    const t = spring({ frame: localFrame - R_KOUMBI, fps, config: SNAP_CONFIG });
    const bamboukOff = (BAMBOUK_Y - 640) * 0.6;
    const koumbiOff = (KOUMBI_Y - 640) * 0.7;
    return bamboukOff + (koumbiOff - bamboukOff) * t;
  })();

  // Scale caméra : large au nord → re-zoom sur Koumbi
  const camScale = (() => {
    if (localFrame < R_KOUMBI) {
      // Push-in lent sur phase 1-2
      return interpolate(localFrame, [0, R_BAMBOUK, R_KOUMBI - 1], [1.3, 1.4, 1.45], {
        extrapolateLeft: "clamp", extrapolateRight: "clamp",
      });
    }
    // Re-zoom rapide (spring) sur Koumbi
    const t = spring({ frame: localFrame - R_KOUMBI, fps, config: SNAP_CONFIG });
    return 1.45 + t * 0.25; // 1.45 → 1.70
  })();

  // ── Vignette respiration ─────────────────────────────────────────────────
  const vignetteOpacity = 0.65 + 0.15 * Math.sin(localFrame * 0.025);

  // ── Fade-out final ────────────────────────────────────────────────────────
  const globalOpacity = interpolate(
    localFrame,
    [TOTAL_FRAMES - 12, TOTAL_FRAMES],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Fade-in initial (transition douce depuis Beat 1) ─────────────────────
  const globalFadeIn = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // ── Sprites POI ──────────────────────────────────────────────────────────
  // Taghaza — bloc-sel-mine
  const taghazaT = spring({ frame: localFrame - R_TAGHAZA, fps, config: SPRING_SOFT });
  const taghazaBreath = 1 + 0.035 * Math.sin(localFrame * 0.09);

  // Bambouk — pieces-or-dinars
  const bamboukT = spring({ frame: localFrame - R_BAMBOUK, fps, config: SPRING_SOFT });
  const bamboukBreath = 1 + 0.035 * Math.sin(localFrame * 0.085 + 1.2);

  // Koumbi — spritesheet animé (réutilisé de Beat 1)
  const koumbiT = spring({ frame: localFrame - R_KOUMBI, fps, config: SPRING_SOFT });
  const koumbiBreath = 1 + 0.04 * Math.sin(localFrame * 0.08);
  const koumbiAnimFrame = localFrame >= R_KOUMBI
    ? Math.floor((localFrame - R_KOUMBI) / 5) % 4
    : 0;

  // ── Pulse markers (anneaux d'onde) ───────────────────────────────────────
  const pulseTaghaza = localFrame >= R_TAGHAZA
    ? ((localFrame - R_TAGHAZA) % 45) / 45
    : 0;
  const pulseBambouk = localFrame >= R_BAMBOUK
    ? ((localFrame - R_BAMBOUK) % 48) / 48
    : 0;
  const pulseKoumbi = localFrame >= R_KOUMBI
    ? ((localFrame - R_KOUMBI) % 42) / 42
    : 0;

  // ── Spotlight #1 — 90 KG / BLOC ──────────────────────────────────────────
  const spot1Spring = spring({ frame: localFrame - R_90KG, fps, config: { damping: 16, stiffness: 100 } });
  const spot1Opacity = interpolate(
    localFrame,
    [R_90KG, R_90KG + 8, R_90KG_OUT - 12, R_90KG_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const dim1Opacity = interpolate(
    localFrame,
    [R_90KG, R_90KG + 12, R_90KG_OUT - 12, R_90KG_OUT],
    [0, 0.55, 0.55, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Spotlight #2 — 20 000 HABITANTS ──────────────────────────────────────
  const spot2Spring = spring({ frame: localFrame - R_20K, fps, config: { damping: 16, stiffness: 100 } });
  const spot2Opacity = interpolate(
    localFrame,
    [R_20K, R_20K + 8, R_20K_OUT - 12, R_20K_OUT],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const dim2Opacity = interpolate(
    localFrame,
    [R_20K, R_20K + 12, R_20K_OUT - 12, R_20K_OUT],
    [0, 0.55, 0.55, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Triade cartouche OR · SEL · ESCLAVES (y=170, top half) ──────────────
  const triadeT = spring({ frame: localFrame - R_TRIADE, fps, config: { damping: 14, stiffness: 200 } });
  const triadeOpacity = interpolate(
    localFrame,
    [R_TRIADE, R_TRIADE + 10, TOTAL_FRAMES - 15, TOTAL_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Caravane chameau × 2 — file indienne, apparaît au mot "caravane" ─────
  // Stratégie : même trajectoire pour les 2, chameau 2 = même position que chameau 1
  // mais avec un retard temporel de 35 frames (~1.2s) → file indienne visible
  const selRoute = ghanaData.mercSahel.routes.sel as string;
  const CHAMEAU_FRAMES = 4;
  const CHAMEAU_FPS_REMOTION = 5;
  const CHAMEAU_DISPLAY = 56;
  const CHAMEAU_SHEET_W = CHAMEAU_DISPLAY * CHAMEAU_FRAMES;

  // Trajectoire commune : Taghaza → Koumbi (chemin partagé)
  const getChameauPos = (progress: number) => ({
    x: interpolate(progress, [0, 0.5, 1], [TAGHAZA_X + 8, (TAGHAZA_X + KOUMBI_X) / 2, KOUMBI_X + 18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    y: interpolate(progress, [0, 0.5, 1], [TAGHAZA_Y + 8, (TAGHAZA_Y + KOUMBI_Y) / 2 + 18, KOUMBI_Y - 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  });

  // Chameau 1 — leader
  const cham1Progress = interpolate(localFrame, [R_CARAVANE, TOTAL_FRAMES - 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const { x: cham1X, y: cham1Y } = getChameauPos(cham1Progress);
  const cham1AnimFrame = localFrame >= R_CARAVANE ? Math.floor((localFrame - R_CARAVANE) / CHAMEAU_FPS_REMOTION) % CHAMEAU_FRAMES : 0;
  const cham1Opacity = interpolate(cham1Progress, [0, 0.04, 0.92, 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Chameau 2 — suit exactement 50 frames derrière (file indienne bien espacée)
  const CHAM2_DELAY = 50;
  const cham2Progress = interpolate(localFrame, [R_CARAVANE + CHAM2_DELAY, TOTAL_FRAMES - 15 + CHAM2_DELAY], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const { x: cham2X, y: cham2Y } = getChameauPos(cham2Progress);
  const cham2AnimFrame = localFrame >= R_CARAVANE + CHAM2_DELAY ? Math.floor((localFrame - R_CARAVANE - CHAM2_DELAY) / CHAMEAU_FPS_REMOTION) % CHAMEAU_FRAMES : 0;
  const cham2Opacity = localFrame >= R_CARAVANE + CHAM2_DELAY
    ? interpolate(cham2Progress, [0, 0.04, 0.92, 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  const caravaneVisible = localFrame >= R_CARAVANE;

  return (
    <g opacity={globalOpacity * globalFadeIn}>
      <rect x="0" y="0" width="720" height="1280" fill="url(#b2BgGrad)" />
      <AtlasSubtleStars opacity={0.4} />

      {/* ── CARTE (caméra pan 3 POI) ─────────────────────────────────────── */}
      <g
        transform={`
          translate(${360 + driftX - camTargetX} ${640 + driftY - camTargetY})
          scale(${camScale} ${camScale * scaleY})
          skewX(${skewX})
          translate(${-360} ${-640})
        `}
      >
        {/* Ocean */}
        <rect x="-300" y="-300" width="1320" height="1880" fill={ATLAS_COLORS.ocean} />

        {/* Pays */}
        {countries.map((c: { iso: string; d: string }) => (
          <path
            key={c.iso}
            d={c.d}
            fill={ATLAS_COLORS.land}
            stroke={ATLAS_COLORS.landStroke}
            strokeWidth="0.8"
            strokeOpacity="0.8"
          />
        ))}

        {/* FOREGROUND — routes + sprites + labels */}
        <g transform={`translate(${parallaxX} ${parallaxY})`}>

          {/* Empire Wagadou (hachures + outline) */}
          <path
            d={ghanaData.mercSahel.wagadouEmpire}
            fill={GHANA_PALETTE.PARCHEMIN}
            fillOpacity="0.18"
            stroke="none"
          />
          <path
            d={ghanaData.mercSahel.wagadouEmpire}
            fill="url(#b2WagadouHatch)"
            fillOpacity="0.75"
            stroke={ATLAS_COLORS.empireOutlineDark}
            strokeWidth="3"
            strokeOpacity="0.9"
            strokeLinejoin="round"
            strokeDasharray="10 5"
          />

          {/* Route sel (Taghaza → Koumbi) — tracé pointillé */}
          <path
            d={selRoute}
            fill="none"
            stroke={GHANA_PALETTE.PARCHEMIN}
            strokeWidth="2.5"
            strokeDasharray="8 5"
            opacity={interpolate(localFrame, [R_CARAVANE, R_CARAVANE + 20], [0, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          />

          {/* Route or (Bambouk → Koumbi) — tracé pointillé */}
          <path
            d={ghanaData.mercSahel.routes.or as string}
            fill="none"
            stroke={GHANA_PALETTE.OR}
            strokeWidth="2.5"
            strokeDasharray="8 5"
            opacity={interpolate(localFrame, [R_BAMBOUK, R_BAMBOUK + 20], [0, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          />

          {/* ── SPRITE Taghaza — bloc-sel-mine ─────────────────────────── */}
          {localFrame >= R_TAGHAZA && taghazaT > 0.05 && (
            <g
              transform={`translate(${TAGHAZA_X} ${TAGHAZA_Y}) scale(${taghazaT * taghazaBreath})`}
              opacity={taghazaT}
            >
              {/* Pulse marker */}
              <circle
                cx="0" cy="0"
                r={15 + pulseTaghaza * 35}
                fill="none"
                stroke={GHANA_PALETTE.PARCHEMIN}
                strokeWidth="2"
                opacity={(1 - pulseTaghaza) * 0.7}
              />
              <circle cx="0" cy="0" r="30" fill="url(#b2PoiHalo)" />
              <image
                href={staticFile("empire-ghana/assets/pixellab/bloc-sel-mine.png")}
                x="-36"
                y="-40"
                width="72"
                height="72"
                preserveAspectRatio="xMidYMid meet"
                style={{ imageRendering: "pixelated" }}
              />
            </g>
          )}

          {/* ── Label TAGHAZA ─────────────────────────────────────────── */}
          {localFrame >= R_TAGHAZA && taghazaT > 0.05 && (
            <g opacity={taghazaT}>
              <rect
                x={TAGHAZA_X - 65}
                y={TAGHAZA_Y - 88}
                width="130"
                height="34"
                fill={GHANA_PALETTE.PARCHEMIN}
                stroke={GHANA_PALETTE.OR}
                strokeWidth="1.5"
                rx="4"
                opacity="0.92"
              />
              <text
                x={TAGHAZA_X}
                y={TAGHAZA_Y - 65}
                textAnchor="middle"
                fontFamily={GHANA_FONTS.TITRE}
                fontSize="18"
                fontWeight="700"
                fill={GHANA_PALETTE.BORDEAUX_PROFOND}
                letterSpacing="2"
              >
                TAGHAZA
              </text>
            </g>
          )}

          {/* ── SPRITE Bambouk — pieces-or-dinars ──────────────────────── */}
          {localFrame >= R_BAMBOUK && bamboukT > 0.05 && (
            <g
              transform={`translate(${BAMBOUK_X} ${BAMBOUK_Y}) scale(${bamboukT * bamboukBreath})`}
              opacity={bamboukT}
            >
              <circle
                cx="0" cy="0"
                r={15 + pulseBambouk * 35}
                fill="none"
                stroke={GHANA_PALETTE.OR_VIF}
                strokeWidth="2"
                opacity={(1 - pulseBambouk) * 0.7}
              />
              <circle cx="0" cy="0" r="32" fill="url(#b2PoiHalo)" />
              <image
                href={staticFile("empire-ghana/assets/pixellab/pieces-or-dinars.png")}
                x="-38"
                y="-42"
                width="76"
                height="76"
                preserveAspectRatio="xMidYMid meet"
                style={{ imageRendering: "pixelated" }}
              />
            </g>
          )}

          {/* ── Label BAMBOUK ─────────────────────────────────────────── */}
          {/* Fade-out quand caméra re-zoom sur Koumbi pour éviter débordement gauche */}
          {localFrame >= R_BAMBOUK && bamboukT > 0.05 && localFrame < R_KOUMBI + 60 && (
            <g opacity={bamboukT * interpolate(localFrame, [R_KOUMBI, R_KOUMBI + 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
              <rect
                x={BAMBOUK_X - 65}
                y={BAMBOUK_Y - 88}
                width="130"
                height="34"
                fill={GHANA_PALETTE.PARCHEMIN}
                stroke={GHANA_PALETTE.OR}
                strokeWidth="1.5"
                rx="4"
                opacity="0.92"
              />
              <text
                x={BAMBOUK_X}
                y={BAMBOUK_Y - 65}
                textAnchor="middle"
                fontFamily={GHANA_FONTS.TITRE}
                fontSize="18"
                fontWeight="700"
                fill={GHANA_PALETTE.BORDEAUX_PROFOND}
                letterSpacing="2"
              >
                BAMBOUK
              </text>
            </g>
          )}

          {/* ── SPRITE Koumbi Saleh — spritesheet animé (4 frames) ─────── */}
          {localFrame >= R_KOUMBI && koumbiT > 0.05 && (() => {
            const SPRITE_SIZE = 112;
            const DISPLAY_SIZE = 88;
            const clipId = `b2KoumbiClip-${koumbiAnimFrame}`;
            return (
              <g
                transform={`translate(${KOUMBI_X} ${KOUMBI_Y}) scale(${koumbiT * koumbiBreath})`}
                opacity={koumbiT}
              >
                <circle
                  cx="0" cy="0"
                  r={15 + pulseKoumbi * 38}
                  fill="none"
                  stroke={GHANA_PALETTE.OR}
                  strokeWidth="2.5"
                  opacity={(1 - pulseKoumbi) * 0.75}
                />
                <circle cx="0" cy="0" r="55" fill="url(#b2KoumbiHalo)" />
                <defs>
                  <clipPath id={clipId}>
                    <rect x={-DISPLAY_SIZE / 2} y={-DISPLAY_SIZE / 2} width={DISPLAY_SIZE} height={DISPLAY_SIZE} />
                  </clipPath>
                </defs>
                <g clipPath={`url(#${clipId})`}>
                  <image
                    href={staticFile("empire-ghana/assets/pixellab/koumbi-saleh-sheet.png")}
                    x={-DISPLAY_SIZE / 2 - koumbiAnimFrame * DISPLAY_SIZE}
                    y={-DISPLAY_SIZE / 2}
                    width={DISPLAY_SIZE * 4}
                    height={DISPLAY_SIZE}
                    preserveAspectRatio="none"
                    style={{ imageRendering: "pixelated" }}
                  />
                </g>
              </g>
            );
          })()}

          {/* ── Label KOUMBI SALEH ────────────────────────────────────── */}
          {localFrame >= R_KOUMBI && koumbiT > 0.05 && (
            <g opacity={koumbiT}>
              <rect
                x={KOUMBI_X - 80}
                y={KOUMBI_Y - 92}
                width="160"
                height="34"
                fill={GHANA_PALETTE.PARCHEMIN}
                stroke={GHANA_PALETTE.OR}
                strokeWidth="1.5"
                rx="4"
                opacity="0.92"
              />
              <text
                x={KOUMBI_X}
                y={KOUMBI_Y - 69}
                textAnchor="middle"
                fontFamily={GHANA_FONTS.TITRE}
                fontSize="17"
                fontWeight="700"
                fill={GHANA_PALETTE.BORDEAUX_PROFOND}
                letterSpacing="1.5"
              >
                KOUMBI SALEH
              </text>
            </g>
          )}

          {/* ── Caravane chameaux × 2 (spritesheet animée) ────────────── */}
          {/* Apparaissent exactement au mot "caravane" (localFrame 645 = 21.5s) */}
          {caravaneVisible && (() => {
            const clipId1 = `b2Cham1Clip-${cham1AnimFrame}`;
            const clipId2 = `b2Cham2Clip-${cham2AnimFrame}`;
            return (
              <>
                <defs>
                  <clipPath id={clipId1}>
                    <rect x={-CHAMEAU_DISPLAY / 2} y={-CHAMEAU_DISPLAY / 2} width={CHAMEAU_DISPLAY} height={CHAMEAU_DISPLAY} />
                  </clipPath>
                  <clipPath id={clipId2}>
                    <rect x={-CHAMEAU_DISPLAY / 2} y={-CHAMEAU_DISPLAY / 2} width={CHAMEAU_DISPLAY} height={CHAMEAU_DISPLAY} />
                  </clipPath>
                </defs>
                {/* Chameau 1 (leader) */}
                <g transform={`translate(${cham1X} ${cham1Y})`} opacity={cham1Opacity}>
                  <g clipPath={`url(#${clipId1})`}>
                    <image
                      href={staticFile("empire-ghana/assets/pixellab/chameau-walk-sheet.png")}
                      x={-CHAMEAU_DISPLAY / 2 - cham1AnimFrame * CHAMEAU_DISPLAY}
                      y={-CHAMEAU_DISPLAY / 2}
                      width={CHAMEAU_SHEET_W}
                      height={CHAMEAU_DISPLAY}
                      preserveAspectRatio="none"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </g>
                </g>
                {/* Chameau 2 (suiveur, décalé +18 frames) */}
                {localFrame >= R_CARAVANE + CHAM2_DELAY && (
                  <g transform={`translate(${cham2X} ${cham2Y})`} opacity={cham2Opacity}>
                    <g clipPath={`url(#${clipId2})`}>
                      <image
                        href={staticFile("empire-ghana/assets/pixellab/chameau-walk-sheet.png")}
                        x={-CHAMEAU_DISPLAY / 2 - cham2AnimFrame * CHAMEAU_DISPLAY}
                        y={-CHAMEAU_DISPLAY / 2}
                        width={CHAMEAU_SHEET_W}
                        height={CHAMEAU_DISPLAY}
                        preserveAspectRatio="none"
                        style={{ imageRendering: "pixelated" }}
                      />
                    </g>
                  </g>
                )}
              </>
            );
          })()}

        </g>{/* /foreground parallax */}
      </g>{/* /camera pan */}

      {/* ══ CARTOUCHES TOP HALF (règle absolue y < 640) ═══════════════════ */}

      {/* Triade OR · SEL · ESCLAVES — y=170, apparait au mot "taxait" */}
      {localFrame >= R_TRIADE && triadeOpacity > 0.01 && (
        <g
          transform={`translate(360 170) scale(${0.85 + 0.15 * triadeT})`}
          opacity={triadeOpacity}
        >
          <rect x="-265" y="-50" width="530" height="100" fill={GHANA_PALETTE.PARCHEMIN} stroke={GHANA_PALETTE.OR} strokeWidth="3" rx="6" />
          <rect x="-257" y="-42" width="514" height="84" fill="none" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1" rx="3" opacity="0.7" />
          <text x="-160" y="14" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="34" fontWeight="700" fill={GHANA_PALETTE.OR_VIF} letterSpacing="4">OR</text>
          <text x="-75" y="14" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="34" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} opacity="0.5">·</text>
          <text x="0" y="14" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="34" fontWeight="700" fill={GHANA_PALETTE.OR} letterSpacing="4">SEL</text>
          <text x="75" y="14" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="34" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} opacity="0.5">·</text>
          <text x="160" y="14" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="34" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} letterSpacing="3">ESCLAVES</text>
          <text x="0" y="40" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="16" fontStyle="italic" fill={GHANA_PALETTE.OR_TERNI} letterSpacing="2" opacity="0.9">les trois piliers du commerce sahélien</text>
        </g>
      )}

      {/* ══ SPOTLIGHT #1 — 90 KG / BLOC ════════════════════════════════════ */}
      {localFrame >= R_90KG && spot1Opacity > 0.01 && (
        <>
          <rect x="0" y="0" width="720" height="1280" fill={GHANA_PALETTE.NOIR_PROFOND} opacity={dim1Opacity} pointerEvents="none" />
          <g
            transform={`translate(360 640) scale(${0.85 + 0.15 * spot1Spring})`}
            opacity={spot1Opacity}
          >
            <circle cx="0" cy="0" r="280" fill="url(#b2SpotlightGlow)" />
            <rect x="-260" y="-165" width="520" height="330" fill={GHANA_PALETTE.PARCHEMIN} stroke={GHANA_PALETTE.OR} strokeWidth="4" rx="10" />
            <rect x="-252" y="-157" width="504" height="314" fill="none" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5" rx="6" opacity="0.75" />
            {/* Sprite bloc de sel */}
            <image
              href={staticFile("empire-ghana/assets/pixellab/bloc-sel-mine.png")}
              x="-80"
              y="-130"
              width="160"
              height="160"
              preserveAspectRatio="xMidYMid meet"
              style={{ imageRendering: "pixelated" }}
            />
            {/* Chiffre choc */}
            <text x="0" y="55" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="80" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} letterSpacing="2">90 KG</text>
            <text x="0" y="100" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="28" fontWeight="600" fill={GHANA_PALETTE.OR} letterSpacing="5">PAR BLOC</text>
            <text x="0" y="135" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="18" fontStyle="italic" fill={GHANA_PALETTE.OR_TERNI} letterSpacing="1.5">sel gemme de Taghaza, Sahara</text>
          </g>
        </>
      )}

      {/* ══ SPOTLIGHT #2 — 20 000 HABITANTS ════════════════════════════════ */}
      {localFrame >= R_20K && spot2Opacity > 0.01 && (
        <>
          <rect x="0" y="0" width="720" height="1280" fill={GHANA_PALETTE.NOIR_PROFOND} opacity={dim2Opacity} pointerEvents="none" />
          <g
            transform={`translate(360 640) scale(${0.85 + 0.15 * spot2Spring})`}
            opacity={spot2Opacity}
          >
            <circle cx="0" cy="0" r="280" fill="url(#b2SpotlightGlow)" />
            <rect x="-260" y="-165" width="520" height="330" fill={GHANA_PALETTE.PARCHEMIN} stroke={GHANA_PALETTE.OR} strokeWidth="4" rx="10" />
            <rect x="-252" y="-157" width="504" height="314" fill="none" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5" rx="6" opacity="0.75" />
            {/* Sprite Koumbi (statique pour ce spotlight) */}
            <image
              href={staticFile("empire-ghana/assets/pixellab/koumbi-saleh.png")}
              x="-75"
              y="-130"
              width="150"
              height="150"
              preserveAspectRatio="xMidYMid meet"
              style={{ imageRendering: "pixelated" }}
            />
            {/* Chiffre choc */}
            <text x="0" y="55" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="64" fontWeight="700" fill={GHANA_PALETTE.BORDEAUX_PROFOND} letterSpacing="2">20 000</text>
            <text x="0" y="100" textAnchor="middle" fontFamily={GHANA_FONTS.TITRE} fontSize="28" fontWeight="600" fill={GHANA_PALETTE.OR} letterSpacing="4">HABITANTS</text>
            <text x="0" y="135" textAnchor="middle" fontFamily={GHANA_FONTS.SERIF} fontSize="18" fontStyle="italic" fill={GHANA_PALETTE.OR_TERNI} letterSpacing="1.5">Koumbi Saleh — capitale de Wagadou</text>
          </g>
        </>
      )}

      {/* Vignette globale */}
      <rect x="0" y="0" width="720" height="1280" fill="url(#b2Vignette)" opacity={vignetteOpacity} pointerEvents="none" />
    </g>
  );
};
