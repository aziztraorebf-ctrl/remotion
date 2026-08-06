// Camera virtuelle pour scenes SVG pures. Reprend le pattern focusTx/focusTy valide
// (ProtoAtlasMondeCameraTest.tsx, vocabulaire Dolly In / Whip Pan / Pull Back Reveal de
// DOCTRINE-SOUVERAIN.md §3.4/3.5) -- pas de helper Mapbox transposable (getCam est specifique
// map.jumpTo), donc extraction du pattern SVG existant en fichier partage + ajout shake continu
// (absent de la reference, necessaire ici pour l'exigence "jamais figee").
//
// NOTE ORDRE MATRICIEL : le scale s'applique EN PREMIER sur les coordonnees du contenu -- pour
// garder un point (px,py) CENTRE a l'ecran quel que soit le zoom courant, il faut
// tx = centerX - px*scale (pas centerX - px). D'ou focusTx/focusTy ci-dessous.

const W = 1920;
const H = 1080;
const centerX = W / 2;
const centerY = H / 2;

export const focusTx = (px: number, s: number) => centerX - px * s;
export const focusTy = (py: number, s: number) => centerY - py * s;

/** Shake continu (camera "handheld"), amplitude qui decroit sur decayFrames. Additionner
 * a tx/ty apres le calcul du point focal (le shake est un bruit ecran, pas un decalage carte). */
export function cameraShake(localFrame: number, amplitude: number, decayFrames: number) {
  if (amplitude <= 0) return { x: 0, y: 0 };
  const decay = Math.max(0.08, 1 - localFrame / Math.max(1, decayFrames));
  return {
    x: Math.sin(localFrame / 4.3) * amplitude * decay,
    y: Math.cos(localFrame / 5.1) * amplitude * 0.7 * decay,
  };
}

/** Derive individuelle par element (rotation + micro-flottement propres), pour que rien ne
 * bouge en bloc de facon synchronisee. `seed` = index/id de l'element (deterministe). */
export function elementDrift(frame: number, seed: number) {
  const speed = 0.08 + (seed % 7) * 0.03;
  const rotate = frame * speed * (seed % 2 === 0 ? 1 : -1);
  const floatX = Math.sin(frame / (14 + (seed % 5) * 3) + seed) * (1.5 + (seed % 4));
  const floatY = Math.cos(frame / (17 + (seed % 4) * 3) + seed * 1.7) * (1.5 + (seed % 3));
  return { rotate, floatX, floatY };
}
