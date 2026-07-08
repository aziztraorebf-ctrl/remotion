/**
 * TwoFaceToken — SYMBOLE SIGNATURE de l'Acte 2 "Blocage".
 *
 * Un seul jeton circulaire (parchemin), ligne verticale OR au milieu, deux DEMI-visages nets :
 *   gauche = Hemedti (bordure rouge RSF) · droite = al-Burhan (bordure bleue SAF).
 * PAS un visage chimère — deux moitiés distinctes séparées par la faille dorée.
 *
 * L'objet raconte tout l'arc alliance -> scission via `phase` (0..1 continu, frame-driven) :
 *   - MERGE  (les 2 jetons Acte 1 convergent puis se soudent en un disque : la faille est fine, l'or pulse)
 *   - FEND   (la faille s'élargit et vibre : "qui commande l'autre ?")
 *   - SPLIT  (les 2 moitiés s'écartent physiquement -> redeviennent 2 jetons ronds distincts)
 *
 * ⛔ NO breathe : spring d'apparition puis scale FIGÉ (un scale oscillant sur portrait raster = flou
 * sub-pixel, rejeté Aziz Acte 1). Les seuls mouvements continus sont vectoriels (faille, halo).
 */
import React from "react";
import { interpolate, staticFile, Easing } from "remotion";

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const RSF = "#B14B3C";
const SAF = "#3E6E9E";
const GOLD = "#E9C46A";
const CREAM = "#F2E5C8";

export type Pt = { x: number; y: number };

/**
 * @param pos      centre écran du jeton fusionné
 * @param frame    frame courante
 * @param mergeAt  frame où les 2 moitiés sont soudées (fusion terminée)
 * @param fendAt   frame où la faille commence à s'élargir/vibrer
 * @param splitAt  frame où les 2 moitiés s'écartent physiquement
 * @param splitGap écart final (px) entre les 2 moitiés au SPLIT
 * @param D        diamètre du jeton (px écran fixe)
 */
export const TwoFaceToken: React.FC<{
  pos: Pt; frame: number; mergeAt: number; fendAt: number; splitAt: number;
  splitGap?: number; D?: number; appearFrom?: number;
}> = ({ pos, frame, mergeAt, fendAt, splitAt, splitGap = 150, D = 118, appearFrom = mergeAt - 26 }) => {
  // apparition (spring) PUIS scale figé
  const ap = interpolate(frame, [appearFrom, appearFrom + 14, appearFrom + 24], [0, 1.1, 1],
    { ...clamp, easing: Easing.out(Easing.cubic) });
  const fadeIn = interpolate(frame, [appearFrom, appearFrom + 12], [0, 1], clamp);

  // faille : fine à la fusion, s'élargit + vibre au FEND, devient l'écart au SPLIT
  const fendW = interpolate(frame, [fendAt, fendAt + 40], [0, 8], clamp);       // largeur de la fissure
  const vibrate = frame >= fendAt && frame < splitAt
    ? Math.sin((frame - fendAt) * 0.9) * interpolate(frame, [fendAt, fendAt + 20], [0, 2.4], clamp) : 0;
  const gap = interpolate(frame, [splitAt, splitAt + 40], [0, splitGap],
    { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const halfShift = fendW / 2 + gap / 2;        // décalage horizontal de chaque moitié
  // RECONSTITUTION au SPLIT : chaque demi-conteneur s'élargit de D/2 -> D (le visage complet réapparaît
  // en glissant vers sa zone). 0 = demi (fusion) · 1 = disque rond complet (retour état Acte 1).
  const reveal = interpolate(frame, [splitAt + 6, splitAt + 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

  // l'or de la faille pulse à la fusion (vivant), rougit/s'éteint au split
  const goldPulse = 0.55 + 0.45 * Math.sin(frame * 0.13);
  const goldOp = interpolate(frame, [splitAt, splitAt + 30], [1, 0], clamp);

  // une demi-face = un conteneur de largeur D/2 (UNE seule moitié du disque), overflow hidden,
  // collé à la fente et écarté de halfShift+vibrate. À l'intérieur : le DISQUE COMPLET (D×D, bordure
  // + portrait centré SANS décalage), positionné à left:0 (moitié gauche) ou left:-D/2 (moitié droite).
  // Le portrait est centré (objectPosition center) -> chaque moitié montre bien le centre du visage.
  const HalfFace = (side: "left" | "right", sprite: string, border: string) => {
    const dir = side === "left" ? -1 : 1;
    const edgeShift = dir * halfShift + vibrate * dir;
    const contW = D / 2 + (D / 2) * reveal;           // D/2 (demi) -> D (rond complet) pendant le split
    // le disque interne reste ancré du côté FENTE ; le conteneur s'élargit vers l'extérieur en dévoilant
    // le reste du visage. Gauche : disque collé à droite du conteneur. Droite : collé à gauche.
    const innerLeft = side === "left" ? contW - D : 0;
    return (
      <div style={{ position: "absolute", left: "50%", top: "50%",
        transform: `translate(calc(${side === "left" ? "-100%" : "0%"} + ${edgeShift}px), -50%)`,
        width: contW, height: D, overflow: "hidden" }}>
        {/* disque circulaire complet ; l'overflow du conteneur ne dévoile qu'une portion, croissante au split */}
        <div style={{ position: "absolute", top: 0, left: innerLeft, width: D, height: D,
          borderRadius: "50%", overflow: "hidden", background: CREAM,
          border: `${D * 0.05}px solid ${border}`, boxSizing: "border-box" }}>
          <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
            style={{ position: "absolute", top: "50%", left: "50%",
              width: "112%", height: "112%", transform: "translate(-50%,-48%)",
              objectFit: "cover", objectPosition: "top center", display: "block" }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "absolute", left: pos.x, top: pos.y,
      transform: `translate(-50%,-50%) scale(${ap})`, opacity: fadeIn, pointerEvents: "none" }}>
      {/* ombre portée commune (ancre au sol) */}
      <div style={{ position: "absolute", left: "50%", top: "68%", width: D * 0.9, height: D * 0.24,
        transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.4)", borderRadius: "50%", filter: "blur(7px)" }} />

      {HalfFace("left", "portrait-hemeti", RSF)}
      {HalfFace("right", "portrait-burhan", SAF)}

      {/* FAILLE dorée au centre : trait vertical (la ligne de fracture pré-inscrite) */}
      {goldOp > 0.01 && (
        <div style={{ position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%)", width: Math.max(2, fendW), height: D * 1.02,
          background: `linear-gradient(180deg, rgba(233,196,106,0) 0%, ${GOLD} 18%, #FFF2CC 50%, ${GOLD} 82%, rgba(233,196,106,0) 100%)`,
          opacity: goldOp * (0.7 + goldPulse * 0.3),
          boxShadow: `0 0 ${8 + goldPulse * 10}px ${goldPulse * 6}px rgba(233,196,106,${goldOp * 0.5})`,
          borderRadius: 2 }} />
      )}
    </div>
  );
};

export default TwoFaceToken;
