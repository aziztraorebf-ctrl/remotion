// Silent Barter Test V3 — PRODUCTION-READY
// Vraie carte d3-geo Sahel + vrais marchands sahelien/berbere + balance Lottie + positions POI reelles
// Verifie que la stack fonctionne en conditions reelles AVANT d'engager production complete
//
// Sahel (vue principale Wagadou):
//   - Carte mercator Afrique de l'Ouest + Sahara
//   - Wagadou empire en or
//   - POI : Taghaza (nord), Bambouk (sud-ouest), Koumbi Saleh (centre)
//   - Routes commerciales sel + or
//
// Silent barter centre sur Koumbi Saleh:
//   Berbere depuis Taghaza (nord) -> walk south -> crouch south -> walk north (sortie)
//   Sahelien depuis Bambouk (sud-ouest) -> walk north -> crouch north -> walk south (sortie)
//   Sacs sel + or persistent au point Koumbi Saleh
//   Balance Lottie equilibre

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Lottie } from "@remotion/lottie";
import { getSpriteFramePath } from "../../shaka-zulu/helpers/spritePlayer";
import { GHANA_PALETTE, GHANA_FONTS, GHANA_LETTERSPACING, ATLAS_COLORS } from "../components/GhanaPalette";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const balanceData = require("./balance.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ghanaData = require("../../../../../data/geo/empire-ghana-data.json");

export const SILENT_BARTER_V3_FRAMES = 240;

// Dimensions composition vs viewBox SVG
// SVG est 720x1280 (config precompute) → on scale uniformement vers 1080x1920
const SVG_W = 720;
const SVG_H = 1280;
const COMP_W = 1080;
const COMP_H = 1920;
const SCALE = COMP_W / SVG_W; // 1.5

// POI projetes (depuis empire-ghana-data.json mercSahel)
const POI = ghanaData.mercSahel.poi;
const KOUMBI_X = POI.KOUMBI_SALEH.x * SCALE;
const KOUMBI_Y = POI.KOUMBI_SALEH.y * SCALE;
const TAGHAZA_X = POI.TAGHAZA.x * SCALE;
const TAGHAZA_Y = POI.TAGHAZA.y * SCALE;
const BAMBOUK_X = POI.BAMBOUK.x * SCALE;
const BAMBOUK_Y = POI.BAMBOUK.y * SCALE;

const SPRITE_SIZE = 140;

// Paths sprites
const BERBERE_WALK = "empire-ghana/characters/berbere/animations/walking-b8b230ef";
const BERBERE_CROUCH = "empire-ghana/characters/berbere/animations/crouching-22bab130";
const SAHELIEN_WALK = "empire-ghana/characters/sahelien/animations/walking-3848d070";
const SAHELIEN_CROUCH = "empire-ghana/characters/sahelien/animations/crouching-7ca15898";

export const SilentBarterTestV3: React.FC = () => {
  const frame = useCurrentFrame();

  // ─── BERBERE depuis TAGHAZA (nord) → KOUMBI SALEH (centre) ───────────────
  // 0-60 : walk south (de Taghaza vers Koumbi)
  // 60-80 : crouch south (depose le sel pres de Koumbi)
  // 80-130 : walk north (repart vers Taghaza)
  const berbereVisible = frame < 130;
  let berbereSrc = "";
  let berbereX = TAGHAZA_X;
  let berbereY = TAGHAZA_Y;

  if (frame < 60) {
    berbereX = interpolate(frame, [0, 60], [TAGHAZA_X, KOUMBI_X - 50], { extrapolateRight: "clamp" });
    berbereY = interpolate(frame, [0, 60], [TAGHAZA_Y, KOUMBI_Y - 30], { extrapolateRight: "clamp" });
    berbereSrc = staticFile(getSpriteFramePath(frame, {
      basePath: BERBERE_WALK, direction: "south", totalFrames: 6, framesPerSpriteFrame: 6,
    }));
  } else if (frame < 80) {
    berbereX = KOUMBI_X - 50;
    berbereY = KOUMBI_Y - 30;
    berbereSrc = staticFile(getSpriteFramePath(frame - 60, {
      basePath: BERBERE_CROUCH, direction: "south", totalFrames: 5, framesPerSpriteFrame: 4,
    }));
  } else {
    berbereX = interpolate(frame, [80, 130], [KOUMBI_X - 50, TAGHAZA_X], { extrapolateRight: "clamp" });
    berbereY = interpolate(frame, [80, 130], [KOUMBI_Y - 30, TAGHAZA_Y], { extrapolateRight: "clamp" });
    berbereSrc = staticFile(getSpriteFramePath(frame - 80, {
      basePath: BERBERE_WALK, direction: "north", totalFrames: 6, framesPerSpriteFrame: 6,
    }));
  }

  // ─── SAHELIEN depuis BAMBOUK (sud-ouest) → KOUMBI SALEH ─────────────────
  // 130-200 : walk vers nord-est (de Bambouk vers Koumbi)
  // 200-220 : crouch (depose l'or)
  // 220-240 : walk inverse vers Bambouk
  const sahelienVisible = frame >= 130;
  let sahelienSrc = "";
  let sahelienX = BAMBOUK_X;
  let sahelienY = BAMBOUK_Y;

  if (frame < 130) {
    sahelienSrc = "";
  } else if (frame < 200) {
    sahelienX = interpolate(frame, [130, 200], [BAMBOUK_X, KOUMBI_X + 50], { extrapolateRight: "clamp" });
    sahelienY = interpolate(frame, [130, 200], [BAMBOUK_Y, KOUMBI_Y + 30], { extrapolateRight: "clamp" });
    // Direction east car va de gauche vers droite
    sahelienSrc = staticFile(getSpriteFramePath(frame - 130, {
      basePath: SAHELIEN_WALK, direction: "east", totalFrames: 6, framesPerSpriteFrame: 6,
    }));
  } else if (frame < 220) {
    sahelienX = KOUMBI_X + 50;
    sahelienY = KOUMBI_Y + 30;
    sahelienSrc = staticFile(getSpriteFramePath(frame - 200, {
      basePath: SAHELIEN_CROUCH, direction: "east", totalFrames: 5, framesPerSpriteFrame: 4,
    }));
  } else {
    sahelienX = interpolate(frame, [220, 240], [KOUMBI_X + 50, BAMBOUK_X], { extrapolateRight: "clamp" });
    sahelienY = interpolate(frame, [220, 240], [KOUMBI_Y + 30, BAMBOUK_Y], { extrapolateRight: "clamp" });
    sahelienSrc = staticFile(getSpriteFramePath(frame - 220, {
      basePath: SAHELIEN_WALK, direction: "west", totalFrames: 6, framesPerSpriteFrame: 6,
    }));
  }

  // ─── SACS persistants ────────────────────────────────────────────────────
  const sacSelVisible = frame >= 80;
  const sacSelOpacity = interpolate(frame, [80, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const sacOrVisible = frame >= 220;
  const sacOrOpacity = interpolate(frame, [220, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ─── BALANCE LOTTIE ──────────────────────────────────────────────────────
  const balanceVisible = frame >= 130;
  const balanceOpacity = interpolate(frame, [130, 145], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ─── DROP-SHADOW pour sprites (recommandation Pass 2 Gemini) ─────────────
  const spriteFilter = "drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.6))";

  return (
    <AbsoluteFill style={{ backgroundColor: ATLAS_COLORS.bgTop }}>
      {/* CARTE d3-geo Sahel — palette ATLAS_COLORS pour coherence Mansa Moussa V2 */}
      <svg width={COMP_W} height={COMP_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ position: "absolute", top: 0, left: 0 }}>
        {/* Fond ocean bleu canard */}
        <rect x="0" y="0" width={SVG_W} height={SVG_H} fill={ATLAS_COLORS.oceanDeep} />

        {/* Pays Afrique de l'Ouest + Sahara — terracotta sable */}
        <g>
          {ghanaData.mercSahel.countries.map((c: { iso: string; d: string }) => (
            <path
              key={c.iso}
              d={c.d}
              fill={ATLAS_COLORS.land}
              stroke={ATLAS_COLORS.landStroke}
              strokeWidth="0.6"
              strokeOpacity="0.7"
            />
          ))}
        </g>

        {/* Empire Wagadou — fill cream + outline gold */}
        <path
          d={ghanaData.mercSahel.wagadouEmpire}
          fill={ATLAS_COLORS.empireFillCream}
          fillOpacity="0.6"
          stroke={ATLAS_COLORS.empireGold}
          strokeWidth="2.5"
        />

        {/* Routes commerciales (bordeaux profond — identite Empire Ghana) */}
        <path d={ghanaData.mercSahel.routes.sel} stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="2" fill="none" strokeDasharray="6 4" opacity="0.8" />
        <path d={ghanaData.mercSahel.routes.or} stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="2" fill="none" strokeDasharray="6 4" opacity="0.8" />

        {/* POI markers */}
        <circle cx={POI.TAGHAZA.x} cy={POI.TAGHAZA.y} r="6" fill={GHANA_PALETTE.BLANC_SEL} stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5" />
        <circle cx={POI.BAMBOUK.x} cy={POI.BAMBOUK.y} r="6" fill={ATLAS_COLORS.empireGold} stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="1.5" />
        <circle cx={POI.KOUMBI_SALEH.x} cy={POI.KOUMBI_SALEH.y} r="9" fill={ATLAS_COLORS.empireGold} stroke={GHANA_PALETTE.BORDEAUX} strokeWidth="2.5" />

        {/* Labels POI — typo serif sur fond carte clair */}
        <text x={POI.TAGHAZA.x} y={POI.TAGHAZA.y - 12} textAnchor="middle" fill={ATLAS_COLORS.textInk} fontSize="14" fontFamily={GHANA_FONTS.SERIF} letterSpacing="1.5" fontWeight="600">TAGHAZA</text>
        <text x={POI.TAGHAZA.x} y={POI.TAGHAZA.y - 24} textAnchor="middle" fill={ATLAS_COLORS.textInk} fontSize="9" fontFamily={GHANA_FONTS.MONO} opacity="0.7">(sel)</text>

        <text x={POI.BAMBOUK.x} y={POI.BAMBOUK.y + 22} textAnchor="middle" fill={ATLAS_COLORS.textInk} fontSize="14" fontFamily={GHANA_FONTS.SERIF} letterSpacing="1.5" fontWeight="600">BAMBOUK</text>
        <text x={POI.BAMBOUK.x} y={POI.BAMBOUK.y + 34} textAnchor="middle" fill={ATLAS_COLORS.textInk} fontSize="9" fontFamily={GHANA_FONTS.MONO} opacity="0.7">(or)</text>

        <text x={POI.KOUMBI_SALEH.x + 12} y={POI.KOUMBI_SALEH.y - 4} textAnchor="start" fill={ATLAS_COLORS.textInk} fontSize="16" fontFamily={GHANA_FONTS.SERIF} letterSpacing="2" fontWeight="700">KOUMBI SALEH</text>
        <text x={POI.KOUMBI_SALEH.x + 12} y={POI.KOUMBI_SALEH.y + 10} textAnchor="start" fill={ATLAS_COLORS.textInk} fontSize="10" fontFamily={GHANA_FONTS.MONO} opacity="0.8">capitale Wagadou</text>
      </svg>

      {/* DEMO POP-UP LABEL (style notification UI moderne — idee 5 Top 7) */}
      {/* Affiche pendant tout le test pour evaluer le rendu visuel */}
      <div style={{
        position: "absolute",
        left: 110,
        top: 540,
        background: GHANA_PALETTE.PARCHEMIN,
        border: `2px solid ${ATLAS_COLORS.empireGold}`,
        borderRadius: 6,
        padding: "10px 16px",
        fontFamily: GHANA_FONTS.MONO,
        fontSize: 22,
        color: ATLAS_COLORS.textInk,
        fontWeight: 700,
        letterSpacing: "0.05em",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}>
        90 kg <span style={{ fontSize: 14, fontWeight: 400, color: GHANA_PALETTE.OR_TERNI, marginLeft: 6 }}>par bloc</span>
      </div>

      <div style={{
        position: "absolute",
        right: 110,
        bottom: 580,
        background: GHANA_PALETTE.PARCHEMIN,
        border: `2px solid ${ATLAS_COLORS.empireGold}`,
        borderRadius: 6,
        padding: "10px 16px",
        fontFamily: GHANA_FONTS.MONO,
        fontSize: 22,
        color: ATLAS_COLORS.textInk,
        fontWeight: 700,
        letterSpacing: "0.05em",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      }}>
        20 000 <span style={{ fontSize: 14, fontWeight: 400, color: GHANA_PALETTE.OR_TERNI, marginLeft: 6 }}>habitants</span>
      </div>

      {/* SAC SEL — apparait au point Koumbi Saleh */}
      {sacSelVisible && (
        <div style={{
          position: "absolute",
          left: KOUMBI_X - 30,
          top: KOUMBI_Y + 25,
          opacity: sacSelOpacity,
        }}>
          <svg width="40" height="48" viewBox="0 0 50 60">
            <path d="M 12 18 Q 12 8, 25 8 Q 38 8, 38 18 L 42 52 Q 42 58, 36 58 L 14 58 Q 8 58, 8 52 Z"
                  fill={GHANA_PALETTE.BLANC_SEL} stroke={GHANA_PALETTE.OR_TERNI} strokeWidth="1.5" />
            <line x1="14" y1="14" x2="36" y2="14" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="2" />
            <text x="25" y="40" textAnchor="middle" fill={GHANA_PALETTE.BORDEAUX_PROFOND} fontSize="9" fontWeight="bold" fontFamily={GHANA_FONTS.SERIF}>SEL</text>
          </svg>
        </div>
      )}

      {/* SAC OR */}
      {sacOrVisible && (
        <div style={{
          position: "absolute",
          left: KOUMBI_X - 10,
          top: KOUMBI_Y + 25,
          opacity: sacOrOpacity,
        }}>
          <svg width="40" height="48" viewBox="0 0 50 60">
            <path d="M 12 18 Q 12 8, 25 8 Q 38 8, 38 18 L 42 52 Q 42 58, 36 58 L 14 58 Q 8 58, 8 52 Z"
                  fill={GHANA_PALETTE.OR} stroke={GHANA_PALETTE.OR_TERNI} strokeWidth="1.5" />
            <line x1="14" y1="14" x2="36" y2="14" stroke={GHANA_PALETTE.NOIR_PROFOND} strokeWidth="2" />
            <text x="25" y="40" textAnchor="middle" fill={GHANA_PALETTE.NOIR_PROFOND} fontSize="9" fontWeight="bold" fontFamily={GHANA_FONTS.SERIF}>OR</text>
          </svg>
        </div>
      )}

      {/* BALANCE LOTTIE — au-dessus de Koumbi Saleh */}
      {balanceVisible && (
        <div style={{
          position: "absolute",
          left: KOUMBI_X - 80,
          top: KOUMBI_Y - 130,
          opacity: balanceOpacity,
        }}>
          <Lottie animationData={balanceData} loop style={{ width: 160, height: 96 }} />
        </div>
      )}

      {/* BERBERE sprite */}
      {berbereVisible && berbereSrc && (
        <Img
          src={berbereSrc}
          style={{
            position: "absolute",
            left: berbereX - SPRITE_SIZE / 2,
            top: berbereY - SPRITE_SIZE / 2 - 30,  // offset car sprite anchor pied
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: spriteFilter,
          }}
        />
      )}

      {/* SAHELIEN sprite */}
      {sahelienVisible && sahelienSrc && (
        <Img
          src={sahelienSrc}
          style={{
            position: "absolute",
            left: sahelienX - SPRITE_SIZE / 2,
            top: sahelienY - SPRITE_SIZE / 2 - 30,
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            imageRendering: "pixelated",
            objectFit: "contain",
            filter: spriteFilter,
          }}
        />
      )}

      {/* DEBUG */}
      <div style={{ position: "absolute", bottom: 60, right: 60, color: GHANA_PALETTE.OR_TERNI, fontSize: 14, fontFamily: GHANA_FONTS.MONO }}>
        f{frame} / {SILENT_BARTER_V3_FRAMES}
      </div>
    </AbsoluteFill>
  );
};
