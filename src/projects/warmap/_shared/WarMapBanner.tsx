// WarMapBanner — banniere/drapeau REEL qui se PLANTE sur une capitale + ondule (flat, sepia-friendly).
//
// Decode Castile (2026-06-18) : leur force = drapeaux flottants. Transpose a NOTRE registre flat.
// Intention (doctrine intention->forme) : un pays s'allume = il PLANTE son etendard = souverainete affirmee
// ("ils batissent quelque chose de nouveau" — hook AES). Le drapeau remplace le simple anneau.
//
// Drapeau REEL (public/_shared/flags/*.png), JAMAIS drawFlagCanvas (regle gravee).
// Ondulation FLAT ROBUSTE (headless) : le tissu = N bandes verticales, chacune affiche une TRANCHE du
// drapeau (background-position) et recoit un translateY sinusoidal dephase (vague). PAS de clipPath SVG
// (fragile en rendu headless) — 100% DOM/CSS. Mat fixe, amplitude croissante du mat vers le bord libre.
//
// Plantage one-shot : le mat "pousse" du sol + le tissu se deploie, puis ondule en continu doux.
// Geo-ancre : recoit pos {x,y} (deja projete par le moteur).

import React from "react";
import { staticFile, interpolate } from "remotion";

export interface WarMapBannerProps {
  frame: number;
  fps: number;
  pos: { x: number; y: number };
  flag: string;            // chemin staticFile, ex "_shared/flags/ml.png"
  appearAt: number;        // frame de plantage (= allumage du pays)
  hideAt?: number;         // frame de retrait (fade-out) — le drapeau cede la place a la couche tactique
  fadeFrames?: number;     // duree du fade-out avant hideAt
  accent: string;          // couleur pays (mat/pommeau) — coherence
  poleH?: number;          // hauteur du mat
  flagW?: number;
  flagH?: number;
  opacity?: number;
  yOffset?: number;        // decalage vertical du pied du mat (degager la plaque de nom)
}

export const WarMapBanner: React.FC<WarMapBannerProps> = ({
  frame, fps, pos, flag, appearAt, hideAt, fadeFrames = 24, accent, poleH = 92, flagW = 78, flagH = 50, opacity = 1, yOffset = -10,
}) => {
  const lf = frame - appearAt;
  if (lf < 0) return null;
  if (hideAt != null && frame >= hideAt) return null;
  const t = lf / fps;
  // fade-out a l'approche de hideAt (le drapeau s'efface quand la couche tactique prend le relais)
  const hideOp = hideAt != null
    ? interpolate(frame, [hideAt - fadeFrames, hideAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  // Plantage one-shot — effet PLANTÉ DANS LE SOL (Aziz) : le mât s'enfonce avec un petit rebond sec,
  // pas un simple fade flottant. overshoot puis settle.
  const plant = interpolate(lf, [0, 7, 12], [poleH, -4, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = plant;
  const op = interpolate(lf, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * opacity * hideOp;
  const unfurlW = interpolate(lf, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }); // largeur deployee

  const STRIPS = 16;
  const stripW = flagW / STRIPS;
  const waveSpeed = 2.6, waveFreq = 1.8, ampMax = 4.5;
  const url = staticFile(flag);

  return (
    <div style={{ position: "absolute", left: pos.x, top: pos.y, opacity: op, pointerEvents: "none",
      transform: `translate(0, ${-poleH + yOffset}px)` }}>
      {/* Mat (couleur pays) */}
      <div style={{ position: "absolute", left: 0, top: rise, width: 3, height: poleH, background: accent,
        borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.45)" }} />
      {/* Pommeau */}
      <div style={{ position: "absolute", left: -1.5, top: rise - 4, width: 6, height: 6, borderRadius: "50%",
        background: accent, border: "1px solid rgba(0,0,0,0.45)" }} />
      {/* Tissu : bandes verticales, chacune une tranche du drapeau, ondulation translateY sinusoidale */}
      <div style={{ position: "absolute", left: 3, top: rise + 1, height: flagH, width: flagW * unfurlW, overflow: "visible" }}>
        {/* PLAQUE DE FOND (lisibilite) : un fond creme + liseré sombre derriere le tissu, pour qu'aucun
            drapeau ne se confonde avec le contour du pays (cas Niger sarcelle). */}
        <div style={{ position: "absolute", left: -2, top: -2, width: flagW * unfurlW + 4, height: flagH + 4,
          background: "rgba(245,239,214,0.55)", border: "1px solid rgba(26,18,9,0.35)", borderRadius: 2 }} />
        {Array.from({ length: STRIPS }, (_, i) => {
          const fx = (i + 0.5) / STRIPS;            // 0 (mat) -> 1 (bord)
          const amp = ampMax * fx * unfurlW;
          const dy = Math.sin(fx * waveFreq * Math.PI * 2 - t * waveSpeed) * amp;
          // ombre + assombrissement leger des creux (volume)
          const shade = 0.82 + 0.18 * ((Math.cos(fx * waveFreq * Math.PI * 2 - t * waveSpeed) + 1) / 2);
          if (i / STRIPS > unfurlW) return null;
          return (
            <div key={i} style={{
              position: "absolute", left: i * stripW, top: dy, width: stripW + 0.6, height: flagH,
              backgroundImage: `url(${url})`,
              backgroundSize: `${flagW}px ${flagH}px`,
              backgroundPosition: `${-i * stripW}px 0px`,
              filter: `brightness(${shade.toFixed(2)})`,
              boxShadow: i === 0 ? "none" : "none",
            }} />
          );
        })}
        {/* contour bas (ombre du tissu) */}
        <div style={{ position: "absolute", left: 0, top: flagH, width: flagW * unfurlW, height: 3,
          background: "rgba(0,0,0,0.16)", filter: "blur(2px)" }} />
      </div>
    </div>
  );
};

export default WarMapBanner;
