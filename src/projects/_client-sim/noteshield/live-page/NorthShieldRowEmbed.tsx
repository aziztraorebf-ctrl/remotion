// MOTEUR: capture-UI (shotcraft) — plaque de page reelle + decoupes par ligne
/**
 * NorthShieldRowEmbed — TEST du pipeline video-shotcraft applique a NorthShield.
 *
 * Recette adaptee de 2 fiches shotcraft :
 *   - ui-entrance/row-embed  : les lignes descendent, rotateX se remet a plat, une couture
 *                              accent s'ouvre au moment de l'encastrement.
 *   - ui-entrance/list-reveal: 2 couches de mouvement decouplees (derive du conteneur vs
 *                              entree par ligne) pour qu'aucune frame ne soit figee.
 *
 * Point cle du pipeline (fiche row-embed, "flying body") : la ligne qui vole est un
 * DECOUPAGE de la capture pleine page (backgroundPosition negatif), PAS un redessin.
 * Un redessin aurait un rendu de police different de la plaque a l'oeil nu.
 *
 * Source des assets : capture Puppeteer de src/projects/_client-sim/noteshield/live-page/
 * index.html (script adapte de assets/scripts/capture-template.mjs), coords reelles dans
 * live-layout.json. deviceScaleFactor 2 => la plaque fait 3840x2160 pour une page 1920x1080.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import layout from "./live-layout.json";

export const NS_ROWEMBED_FPS = 30;
export const NS_ROWEMBED_FRAMES = 150; // 5s

const PAGE_W = 1920;
const PAGE_H = 1080;

const ROWS = layout.dashboard.boxes.rows;
const FLAGGED_INDEX = ROWS.length - 1; // la ligne Sarah M. / Berlin / 82

// Cadence (fiche row-embed) : cue = 12 + i*9, vol de 12f. Derniere ligne posee a 12+6*9+12 = 78f,
// couture fermee a ~86f — le budget de 150f laisse la revelation du risque respirer ensuite.
const CUE_0 = 12;
const CUE_STEP = 9;
const FLIGHT = 12;
const SEAM_DUR = 5; // fiche: ouverture 5f puis fondu 8f — 13f faisait trainer la couture

const ACCENT_RED = "#FF4D5E";
const NAVY_DEEP = "#0A1628";

function seg(frame: number, start: number, dur: number): number {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

const FlyingRow: React.FC<{ index: number; frame: number }> = ({ index, frame }) => {
  const box = ROWS[index];
  const cue = CUE_0 + index * CUE_STEP;

  // air : 1 = encore en vol, 0 = encastre.
  const p = seg(frame, cue, FLIGHT);
  const eased = Easing.out(Easing.cubic)(p);
  const air = 1 - eased;

  // press-bounce de 4f apres la pose (fiche : scale 1.06 -> 0.995 -> 1).
  const bounce = interpolate(frame, [cue + FLIGHT, cue + FLIGHT + 4], [0.995, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = air > 0 ? 1.06 * air + 1 * (1 - air) : bounce;

  // La couture accent ne s'ouvre qu'a l'encastrement, sur le bord bas uniquement.
  const seam = seg(frame, cue + FLIGHT, SEAM_DUR);
  const seamW = interpolate(Easing.out(Easing.cubic)(Math.min(seam * 2, 1)), [0, 1], [0, 40]); // 40% centres: >60% se lit comme un separateur qui defile, pas une couture
  const seamOpacity = interpolate(seam, [0.35, 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isFlagged = index === FLAGGED_INDEX;
  const seamColor = isFlagged ? ACCENT_RED : "#00D9FF";

  if (frame < cue) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        transform: `perspective(900px) translateY(${-120 * air}px) rotateX(${16 * air}deg) scale(${scale})`,
        transformOrigin: "center bottom",
        opacity: Math.min(1, p * 2.6),
      }}
    >
      {/* Corps volant = decoupe de la plaque pleine page, jamais un redessin. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${staticFile("_client-sim/noteshield/live/dashboard-full.png")})`,
          backgroundSize: `${PAGE_W}px ${PAGE_H}px`,
          backgroundPosition: `${-box.x}px ${-box.y}px`,
        }}
      />
      {/* Couture d'encastrement : bord bas, une seule fois. */}
      <div
        style={{
          position: "absolute",
          left: `${(100 - seamW) / 2}%`,
          bottom: 0,
          width: `${seamW}%`,
          height: 2,
          background: seamColor,
          boxShadow: `0 0 6px ${seamColor}`,
          opacity: seamOpacity,
        }}
      />
    </div>
  );
};

export const NorthShieldRowEmbed: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / (NS_ROWEMBED_FRAMES - 1);

  // Couche 2 (list-reveal) : derive lente du conteneur, decouplee de l'entree par ligne.
  const drift = interpolate(t, [0, 1], [10, -10]);

  // Halo de risque sur la derniere ligne, une fois posee.
  const flaggedCue = CUE_0 + FLAGGED_INDEX * CUE_STEP + FLIGHT;
  const riskGlow = interpolate(frame, [flaggedCue + 6, flaggedCue + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flaggedBox = ROWS[FLAGGED_INDEX];

  return (
    <AbsoluteFill style={{ background: NAVY_DEEP }}>
      <AbsoluteFill style={{ transform: `translateY(${drift}px)` }}>
        {/* Plaque vide : page reelle sans les lignes (hideForEmptyPlate). */}
        <Img
          src={staticFile("_client-sim/noteshield/live/dashboard-empty.png")}
          style={{ width: PAGE_W, height: PAGE_H }}
        />

        {ROWS.map((_, i) => (
          <FlyingRow key={i} index={i} frame={frame} />
        ))}

        {/* Le risque se declare apres l'encastrement : halo rouge sur la ligne signalee. */}
        <div
          style={{
            position: "absolute",
            left: flaggedBox.x,
            top: flaggedBox.y,
            width: flaggedBox.w,
            height: flaggedBox.h,
            borderRadius: 16,
            boxShadow: `0 0 ${40 * riskGlow}px ${ACCENT_RED}`,
            border: `1px solid ${ACCENT_RED}${riskGlow > 0.5 ? "88" : "22"}`,
            opacity: riskGlow,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
