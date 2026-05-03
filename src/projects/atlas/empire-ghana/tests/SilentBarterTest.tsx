// Silent Barter Test V2 — vrais marchands PixelLab + crouching pour deposer
//
// Sahelien (sud, apporte l'OR) : empire-ghana/characters/sahelien
// Berbere/Touareg (nord, apporte le SEL) : empire-ghana/characters/berbere
// Sacs = SVG simples (sel blanc, or dore)
// Balance = Lottie genere par Claude
//
// Timing (210 frames @ 30fps = 7s) :
// 0-50    : Berbere walk depuis NORD (south direction = de dos vers nous, descend)
// 50-65   : Berbere crouching frame 4 (depose sel)
// 65      : SAC SEL apparait (RESTE pour toujours)
// 65-105  : Berbere walk inverse, sort par le nord (north direction = de face)
// 105-130 : Scene fixe — sac sel seul, balance Lottie pulse au-dessus
// 130-170 : Sahelien walk depuis SUD (north direction = de face, monte)
// 170-185 : Sahelien crouching frame 4 (depose or)
// 185     : SAC OR apparait (RESTE)
// 185-210 : Sahelien walk inverse, sort par le sud (south direction = de dos)

import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Lottie } from "@remotion/lottie";
import { getSpriteFramePath } from "../../shaka-zulu/helpers/spritePlayer";
import { GHANA_PALETTE, GHANA_FONTS, GHANA_LETTERSPACING } from "../components/GhanaPalette";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const balanceData = require("./balance.json");

export const SILENT_BARTER_TEST_FRAMES = 210;

// Position centre carte Wagadou
const CENTER_X = 540;
const CENTER_Y = 960;
const SAC_SEL_X = CENTER_X - 70;
const SAC_OR_X = CENTER_X + 70;
const SAC_Y = CENTER_Y + 100;  // sacs en bas du marchand qui depose

// Bases pour sprite player
const BERBERE_WALK = "empire-ghana/characters/berbere/animations/walking-b8b230ef";
const BERBERE_CROUCH = "empire-ghana/characters/berbere/animations/crouching-22bab130";
const SAHELIEN_WALK = "empire-ghana/characters/sahelien/animations/walking-3848d070";
const SAHELIEN_CROUCH = "empire-ghana/characters/sahelien/animations/crouching-7ca15898";

const SPRITE_SIZE = 200;

export const SilentBarterTest: React.FC = () => {
  const frame = useCurrentFrame();

  // ─── BERBERE (nord, depose le SEL) ─────────────────────────────────────────
  // Frame 0-50 : descend depuis le nord (direction south = vers nous)
  // Frame 50-65 : crouching south
  // Frame 65-105 : remonte vers le nord (direction north = de dos)
  const berbereVisible = frame < 105;
  const berbereStartY = CENTER_Y - 500;
  const berbereDeposeY = CENTER_Y - 60;

  let berbereY = berbereStartY;
  let berbereSrc = "";

  if (frame < 50) {
    // Walk south (vers nous) depuis le nord
    berbereY = interpolate(frame, [0, 50], [berbereStartY, berbereDeposeY], { extrapolateRight: "clamp" });
    berbereSrc = staticFile(getSpriteFramePath(frame, {
      basePath: BERBERE_WALK,
      direction: "south",
      totalFrames: 6,
      framesPerSpriteFrame: 6,
    }));
  } else if (frame < 65) {
    // Crouching south (depose le sel)
    berbereY = berbereDeposeY;
    berbereSrc = staticFile(getSpriteFramePath(frame - 50, {
      basePath: BERBERE_CROUCH,
      direction: "south",
      totalFrames: 5,
      framesPerSpriteFrame: 3,  // 5 frames * 3 = 15 frames pour la pose
    }));
  } else {
    // Walk north (de dos) — repart vers le nord
    berbereY = interpolate(frame, [65, 105], [berbereDeposeY, berbereStartY], { extrapolateRight: "clamp" });
    berbereSrc = staticFile(getSpriteFramePath(frame - 65, {
      basePath: BERBERE_WALK,
      direction: "north",
      totalFrames: 6,
      framesPerSpriteFrame: 6,
    }));
  }

  // ─── SAHELIEN (sud, depose l'OR) ───────────────────────────────────────────
  // Frame 130-170 : monte depuis le sud (direction north = de dos)
  // Frame 170-185 : crouching north
  // Frame 185-210 : redescend vers le sud (direction south = vers nous)
  const sahelienVisible = frame >= 130;
  const sahelienStartY = CENTER_Y + 500;
  const sahelienDeposeY = CENTER_Y + 60;

  let sahelienY = sahelienStartY;
  let sahelienSrc = "";

  if (frame < 130) {
    // Pas encore visible
    sahelienSrc = "";
  } else if (frame < 170) {
    // Walk north (de dos) depuis le sud — monte
    sahelienY = interpolate(frame, [130, 170], [sahelienStartY, sahelienDeposeY], { extrapolateRight: "clamp" });
    sahelienSrc = staticFile(getSpriteFramePath(frame - 130, {
      basePath: SAHELIEN_WALK,
      direction: "north",
      totalFrames: 6,
      framesPerSpriteFrame: 6,
    }));
  } else if (frame < 185) {
    // Crouching north (depose l'or)
    sahelienY = sahelienDeposeY;
    sahelienSrc = staticFile(getSpriteFramePath(frame - 170, {
      basePath: SAHELIEN_CROUCH,
      direction: "north",
      totalFrames: 5,
      framesPerSpriteFrame: 3,
    }));
  } else {
    // Walk south (vers nous) — repart vers le sud
    sahelienY = interpolate(frame, [185, 210], [sahelienDeposeY, sahelienStartY], { extrapolateRight: "clamp" });
    sahelienSrc = staticFile(getSpriteFramePath(frame - 185, {
      basePath: SAHELIEN_WALK,
      direction: "south",
      totalFrames: 6,
      framesPerSpriteFrame: 6,
    }));
  }

  // ─── SACS persistants ──────────────────────────────────────────────────────
  // SAC SEL apparait apres crouching berbere (frame 65)
  const sacSelVisible = frame >= 65;
  const sacSelOpacity = interpolate(frame, [65, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // SAC OR apparait apres crouching sahelien (frame 185)
  const sacOrVisible = frame >= 185;
  const sacOrOpacity = interpolate(frame, [185, 195], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ─── BALANCE LOTTIE — apparait apres pose du sel, equilibre quand or arrive ─
  const balanceVisible = frame >= 105;
  const balanceOpacity = interpolate(frame, [105, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: GHANA_PALETTE.NOIR_PROFOND }}>
      {/* Carte Wagadou — placeholder ellipse sepia (sera remplacee par d3-geo en V1) */}
      <AbsoluteFill>
        <svg width="1080" height="1920" viewBox="0 0 1080 1920">
          <ellipse cx="540" cy="960" rx="380" ry="440" fill={GHANA_PALETTE.SABLE_DESERT} stroke={GHANA_PALETTE.OR_TERNI} strokeWidth="2" />
          <ellipse cx="540" cy="960" rx="280" ry="320" fill={GHANA_PALETTE.SABLE_NUIT} stroke={GHANA_PALETTE.OR_TERNI} strokeWidth="1" opacity="0.6" />

          {/* Label Koumbi Saleh */}
          <text x="540" y="1400" textAnchor="middle" fill={GHANA_PALETTE.OR_TERNI} fontSize="22" fontFamily={GHANA_FONTS.SERIF} letterSpacing="3" opacity="0.7">
            KOUMBI SALEH
          </text>
        </svg>
      </AbsoluteFill>

      {/* SAC SEL — blanc */}
      {sacSelVisible && (
        <div style={{
          position: "absolute",
          left: SAC_SEL_X - 25,
          top: SAC_Y - 25,
          opacity: sacSelOpacity,
        }}>
          <svg width="50" height="60" viewBox="0 0 50 60">
            <path d="M 12 18 Q 12 8, 25 8 Q 38 8, 38 18 L 42 52 Q 42 58, 36 58 L 14 58 Q 8 58, 8 52 Z"
                  fill={GHANA_PALETTE.BLANC_SEL} stroke={GHANA_PALETTE.OR_TERNI} strokeWidth="1.5" />
            <line x1="14" y1="14" x2="36" y2="14" stroke={GHANA_PALETTE.BORDEAUX_PROFOND} strokeWidth="2" />
            <text x="25" y="40" textAnchor="middle" fill={GHANA_PALETTE.BORDEAUX_PROFOND} fontSize="9" fontWeight="bold" fontFamily={GHANA_FONTS.SERIF}>SEL</text>
          </svg>
        </div>
      )}

      {/* SAC OR — dore */}
      {sacOrVisible && (
        <div style={{
          position: "absolute",
          left: SAC_OR_X - 25,
          top: SAC_Y - 25,
          opacity: sacOrOpacity,
        }}>
          <svg width="50" height="60" viewBox="0 0 50 60">
            <path d="M 12 18 Q 12 8, 25 8 Q 38 8, 38 18 L 42 52 Q 42 58, 36 58 L 14 58 Q 8 58, 8 52 Z"
                  fill={GHANA_PALETTE.OR} stroke={GHANA_PALETTE.OR_TERNI} strokeWidth="1.5" />
            <line x1="14" y1="14" x2="36" y2="14" stroke={GHANA_PALETTE.NOIR_PROFOND} strokeWidth="2" />
            <text x="25" y="40" textAnchor="middle" fill={GHANA_PALETTE.NOIR_PROFOND} fontSize="9" fontWeight="bold" fontFamily={GHANA_FONTS.SERIF}>OR</text>
          </svg>
        </div>
      )}

      {/* BALANCE LOTTIE — au-dessus des sacs */}
      {balanceVisible && (
        <div style={{
          position: "absolute",
          left: CENTER_X - 100,
          top: SAC_Y - 200,
          opacity: balanceOpacity,
        }}>
          <Lottie animationData={balanceData} loop style={{ width: 200, height: 120 }} />
        </div>
      )}

      {/* BERBERE — vient du nord */}
      {berbereVisible && berbereSrc && (
        <Img
          src={berbereSrc}
          style={{
            position: "absolute",
            left: CENTER_X - SPRITE_SIZE / 2 - 70,
            top: berbereY - SPRITE_SIZE / 2,
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            imageRendering: "pixelated",
            objectFit: "contain",
          }}
        />
      )}

      {/* SAHELIEN — vient du sud */}
      {sahelienVisible && sahelienSrc && (
        <Img
          src={sahelienSrc}
          style={{
            position: "absolute",
            left: CENTER_X - SPRITE_SIZE / 2 + 70,
            top: sahelienY - SPRITE_SIZE / 2,
            width: SPRITE_SIZE,
            height: SPRITE_SIZE,
            imageRendering: "pixelated",
            objectFit: "contain",
          }}
        />
      )}

      {/* DEBUG frame counter */}
      <div style={{ position: "absolute", bottom: 60, right: 60, color: GHANA_PALETTE.OR_TERNI, fontSize: 16, fontFamily: GHANA_FONTS.MONO }}>
        f{frame} / {SILENT_BARTER_TEST_FRAMES}
      </div>
    </AbsoluteFill>
  );
};
