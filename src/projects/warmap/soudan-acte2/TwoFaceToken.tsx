/**
 * TwoFaceToken — SYMBOLE SIGNATURE de l'Acte 2 "Blocage".
 *
 * Un seul jeton circulaire (parchemin), ligne verticale OR au milieu, deux DEMI-visages nets :
 *   gauche = Hemedti (bordure rouge RSF) · droite = al-Burhan (bordure bleue SAF).
 * PAS un visage chimère — deux moitiés distinctes séparées par la faille dorée.
 *
 * L'objet raconte tout l'arc alliance -> scission via les frames (frame-driven) :
 *   - MERGE  (les 2 jetons Acte 1 convergent puis se soudent en un disque : la faille est fine, l'or pulse)
 *   - FEND   (la faille s'élargit et vibre : "qui commande l'autre ?")
 *   - SPLIT  (les 2 moitiés s'écartent physiquement -> redeviennent 2 jetons ronds distincts)
 *
 * STRUCTURE (corrige le bug "2 demi-jetons accolés") :
 *   - un conteneur racine centré, taille D x D, scale(ap).
 *   - DANS ce conteneur, UN SEUL disque D x D (borderRadius 50%, overflow hidden, fond CREAM) qui contient
 *     les 2 demi-visages cote a cote SANS gap au régime soudé. Chaque demi = une fenetre D/2 en overflow
 *     hidden contenant l'image entiere décalée pour centrer le visage sur SA moitié.
 *   - la bordure soudée = UN SEUL anneau SVG (viewBox = D x D pour éviter tout décalage d'échelle),
 *     arc gauche rouge / arc droit bleu, parfaitement circulaire et continu (aucune arete a la couture).
 *   - au SPLIT : les 2 moitiés s'écartent (translate) et se reconstituent chacune en jeton rond COMPLET
 *     (reveal 0->1) avec sa propre bordure ronde pleine ; l'anneau unique s'efface.
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

  // écart entre les 2 moitiés : 0 tant qu'on est soudé, léger a partir du fend, grand au split.
  const gap = interpolate(frame, [fendAt, fendAt + 40, splitAt, splitAt + 42],
    [0, 4, 8, splitGap], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const halfShift = gap / 2;
  const vibrate = frame >= fendAt && frame < splitAt + 10
    ? Math.sin((frame - fendAt) * 0.9) * interpolate(frame, [fendAt, fendAt + 20, splitAt], [0, 2.6, 0], clamp) : 0;

  // reconstitution : chaque moitié redevient un disque rond plein (0 = demi soudée, 1 = rond complet)
  const reveal = interpolate(frame, [splitAt + 4, splitAt + 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

  // l'or de la ligne : discret quand soudé (fine ligne de partage), s'illumine au fend, s'éteint au split
  const goldPulse = 0.5 + 0.5 * Math.sin(frame * 0.13);
  const goldGlow = interpolate(frame, [fendAt, fendAt + 20, splitAt, splitAt + 24], [0.25, 1, 1, 0], clamp);
  const goldW = interpolate(frame, [fendAt, fendAt + 30], [2, 6], clamp);

  const BW = D * 0.055;                    // épaisseur de bordure

  // Cadrage du visage (identique au jeton solo Acte 1, réglé visuellement) : l'image remplit un bloc D x D
  // et le visage est bien centré/cadré dedans. On réutilise ce meme bloc partout (soudé + reconstitué).
  const IMG_SCALE = 1.18;                  // l'image fait 118% du bloc (comme le solo)
  const faceImg = (sprite: string) => (
    <img src={staticFile(`_shared/sprites/warmap/${sprite}.png`)}
      style={{
        position: "absolute", top: "50%", left: "50%",
        width: `${IMG_SCALE * 100}%`, height: `${IMG_SCALE * 100}%`,
        transform: "translate(-50%, -46%)",           // visage un peu haut dans le sprite -> remonte le centre
        objectFit: "cover", objectPosition: "center top", display: "block",
      }} />
  );

  // --- une DEMI-fenetre (régime soudé) : fenetre D/2 en overflow hidden ; DEDANS un bloc-visage D x D
  // dont le CENTRE est aligné sur le milieu de la demi-fenetre (D/4). Left local = D/4 - D/2 = -D/4 (les 2). ---
  const halfWindow = (side: "left" | "right") => {
    const dir = side === "left" ? -1 : 1;
    const shift = dir * halfShift + vibrate * dir;
    return (
      <div style={{
        position: "absolute", top: 0, height: D, width: D / 2,
        left: side === "left" ? 0 : D / 2,
        transform: `translateX(${shift}px)`,
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: -D / 4, width: D, height: D, overflow: "hidden" }}>
          {faceImg(side === "left" ? "portrait-hemeti" : "portrait-burhan")}
        </div>
      </div>
    );
  };

  // --- un DEMI reconstitué en ROND plein (régime split) : chaque moitié devient son propre jeton ---
  // Apparait progressivement (reveal). Positionné a +/- (halfShift) du centre, avec sa bordure ronde pleine.
  const soloHalf = (side: "left" | "right") => {
    const dir = side === "left" ? -1 : 1;
    const shift = dir * halfShift + vibrate * dir;
    const border = side === "left" ? RSF : SAF;
    return (
      <div style={{
        position: "absolute", top: 0, left: 0, width: D, height: D,
        transform: `translateX(${shift}px)`, opacity: reveal,
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: CREAM,
          // LOT 4.1 : anneau blanc net + ombre renforcée (cohérent avec le disque soudé)
          boxShadow: "0 0 0 2.5px #FFFFFF, 0 0 0 3.8px rgba(20,14,6,0.5), 0 6px 16px rgba(0,0,0,0.55)",
        }}>
          {faceImg(side === "left" ? "portrait-hemeti" : "portrait-burhan")}
        </div>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: `${BW}px solid ${border}`, boxSizing: "border-box",
        }} />
      </div>
    );
  };

  // --- ANNEAU UNIQUE (soudé) : un seul cercle, arc gauche rouge / arc droit bleu, CONTINU ---
  // viewBox = D x D pour éviter tout décalage d'échelle. r = D/2 - BW/2, centré cx=cy=D/2.
  const r = D / 2 - BW / 2;
  const circ = 2 * Math.PI * r;
  const ringOp = interpolate(reveal, [0, 0.45], [1, 0], clamp);

  // le disque soudé (fenetres + anneau) glisse en s'écartant au fend/split ; il s'efface au reveal.
  const weldedOp = interpolate(reveal, [0, 0.55], [1, 0], clamp);

  return (
    <div style={{ position: "absolute", left: pos.x, top: pos.y,
      transform: `translate(-50%,-50%) scale(${ap})`, opacity: fadeIn, pointerEvents: "none" }}>
      {/* ombre portée commune (ancre au sol) */}
      <div style={{ position: "absolute", left: "50%", top: "68%", width: D * 0.9, height: D * 0.24,
        transform: "translate(-50%,-50%)", background: "rgba(40,27,8,0.4)", borderRadius: "50%", filter: "blur(7px)" }} />

      {/* --- DISQUE SOUDÉ : un seul rond, 2 demi-visages cote a cote, anneau bicolore continu --- */}
      {weldedOp > 0.01 && (
        <div style={{ position: "absolute", left: "50%", top: "50%", width: D, height: D,
          transform: "translate(-50%,-50%)", opacity: weldedOp }}>
          {/* le disque lui-meme (clip rond commun) — LOT 4.1 : anneau blanc net + ombre renforcée
              (l'anneau bicolore SVG se pose par-dessus, le blanc reste visible en liseré externe) */}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden",
            background: CREAM, boxShadow: "0 0 0 3px #FFFFFF, 0 0 0 4.4px rgba(20,14,6,0.5), 0 6px 17px rgba(0,0,0,0.55)" }}>
            {halfWindow("left")}
            {halfWindow("right")}
          </div>
          {/* anneau bicolore UNIQUE par-dessus (viewBox = D x D) */}
          <svg width={D} height={D} viewBox={`0 0 ${D} ${D}`}
            style={{ position: "absolute", inset: 0, opacity: ringOp, overflow: "visible" }}>
            {/* arc droit (bleu SAF) : demi-cercle droit */}
            <circle cx={D / 2} cy={D / 2} r={r} fill="none" stroke={SAF} strokeWidth={BW}
              strokeDasharray={`${circ / 2} ${circ / 2}`} strokeDashoffset={0}
              transform={`rotate(-90 ${D / 2} ${D / 2})`} strokeLinecap="butt" />
            {/* arc gauche (rouge RSF) : demi-cercle gauche */}
            <circle cx={D / 2} cy={D / 2} r={r} fill="none" stroke={RSF} strokeWidth={BW}
              strokeDasharray={`${circ / 2} ${circ / 2}`} strokeDashoffset={-circ / 2}
              transform={`rotate(-90 ${D / 2} ${D / 2})`} strokeLinecap="butt" />
          </svg>
        </div>
      )}

      {/* --- RECONSTITUTION : 2 jetons ronds pleins qui s'écartent (régime split) --- */}
      {reveal > 0.01 && (
        <div style={{ position: "absolute", left: "50%", top: "50%", width: D, height: D,
          transform: "translate(-50%,-50%)" }}>
          {soloHalf("left")}
          {soloHalf("right")}
        </div>
      )}

      {/* --- LIGNE DE PARTAGE / FAILLE dorée : fine ligne quand soudé, s'ouvre et s'illumine au fend/split --- */}
      {goldGlow > 0.01 && (
        <div style={{ position: "absolute", left: "50%", top: "50%",
          transform: `translate(calc(-50% + ${vibrate}px),-50%)`, width: goldW, height: D * 1.0,
          background: `linear-gradient(180deg, rgba(233,196,106,0) 0%, ${GOLD} 18%, #FFF2CC 50%, ${GOLD} 82%, rgba(233,196,106,0) 100%)`,
          opacity: goldGlow * (0.7 + goldPulse * 0.3),
          boxShadow: `0 0 ${6 + goldPulse * 10}px ${goldGlow * goldPulse * 6}px rgba(233,196,106,${goldGlow * 0.5})`,
          borderRadius: 2 }} />
      )}
    </div>
  );
};

export default TwoFaceToken;
