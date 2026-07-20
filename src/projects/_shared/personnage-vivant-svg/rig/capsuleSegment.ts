/**
 * capsuleSegment.ts — helper de rendu VOLUMETRIQUE pour un segment de membre (bras/jambe).
 * R&D 2026-07-02, suite a breakdown GPT-5.5 sur la planche "planteur-cacao-charsheet-GPT.png"
 * (registre plus developpe que StickRig actuel : contours fermes tapered, pas des lignes strokeWidth).
 *
 * Recommandation GPT : "cutout puppet volumetrique" — chaque segment devient un <path> ferme
 * tapered (largeur A a l'extremite proximale, largeur B a l'extremite distale), PAS un morphing
 * de path par pose. La cinematique (computePose) ne change pas — seul le RENDU du segment change.
 *
 * ✅ STATUT (2026-07-02) : INTEGRE a StickRig.tsx via le prop `volumetric?: boolean` (defaut false =
 * rendu ligne d'origine, zero regression). Jambes (2 segments + pied) + bras avant (2 segments avec
 * coude explicite) valides visuellement sur 3 poses (debout/marche/bras tendu) — voir
 * `_rnd/svg-scenes/ProtoCapsuleLimb.tsx` (compo Root `RND-ProtoCapsuleLimb`).
 * Reste a faire avant adoption large : torse/bottes/chapeau en formes rigides groupees (actuellement
 * seul le torse-polygone existant est reutilise tel quel), verification en 8-directions
 * (StickRigMultiDir), fix mineur decrochage visuel cheville/pied observe sur la pose marche.
 */

export type CapsuleParams = {
  ax: number; ay: number; // extremite proximale (ex: epaule, hanche)
  bx: number; by: number; // extremite distale (ex: coude/main, genou/pied)
  widthA: number;         // largeur a l'extremite proximale
  widthB: number;         // largeur a l'extremite distale (< widthA = tapered vers l'extremite)
};

/**
 * Genere un <path> ferme representant un segment de membre tapered (capsule a largeur variable),
 * avec des bouts arrondis (demi-cercle) aux 2 extremites — evite les coins vifs, coherent avec le
 * registre "ink-line cartoon" (cf. planche GPT : bouts de manches/jambes de pantalon arrondis).
 */
export function capsulePath({ ax, ay, bx, by, widthA, widthB }: CapsuleParams): string {
  const dx = bx - ax, dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // perpendiculaire unitaire a l'axe du segment
  const px = -dy / len, py = dx / len;

  const rA = widthA / 2, rB = widthB / 2;

  // 4 points du contour tapered (avant les arrondis) : proximal-gauche, distal-gauche, distal-droite, proximal-droite
  const aLx = ax + px * rA, aLy = ay + py * rA;
  const aRx = ax - px * rA, aRy = ay - py * rA;
  const bLx = bx + px * rB, bLy = by + py * rB;
  const bRx = bx - px * rB, bRy = by - py * rB;

  // arcs arrondis aux 2 bouts (demi-cercle rayon r, dans le sens du contour)
  return [
    `M ${aLx} ${aLy}`,
    `A ${rA} ${rA} 0 0 1 ${aRx} ${aRy}`, // arrondi bout proximal
    `L ${bRx} ${bRy}`,
    `A ${rB} ${rB} 0 0 1 ${bLx} ${bLy}`, // arrondi bout distal
    `L ${aLx} ${aLy}`,
    "Z",
  ].join(" ");
}

/** Variante 2-segments (ex: bras epaule->coude->main) : 2 capsules tapered chainees, largeur commune au coude/genou. */
export function twoSegmentCapsulePath(
  shoulder: { x: number; y: number },
  joint: { x: number; y: number },
  end: { x: number; y: number },
  widthShoulder: number,
  widthJoint: number,
  widthEnd: number
): { upper: string; lower: string } {
  return {
    upper: capsulePath({ ax: shoulder.x, ay: shoulder.y, bx: joint.x, by: joint.y, widthA: widthShoulder, widthB: widthJoint }),
    lower: capsulePath({ ax: joint.x, ay: joint.y, bx: end.x, by: end.y, widthA: widthJoint, widthB: widthEnd }),
  };
}
