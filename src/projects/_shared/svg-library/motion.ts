/**
 * Briques de mouvement/parallaxe pour scenes SVG narratives 16:9 — extraites de
 * CargoVoyage16x9_LibreInspire.tsx (2026-07-03, showcase valide Aziz du pivot 9:16->16:9).
 *
 * Doctrine complete (pourquoi ces formes, bugs corriges) : svg-library/techniques/parallaxe-camAt-horizon.md
 */

/** Interpole lineairement entre 2 couleurs hex ("#rrggbb"). t=0 -> a, t=1 -> b. */
export const lerpHex = (a: string, b: string, t: number) => {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

/**
 * Moteur de parallaxe : renvoie un transform SVG "translate(x 0)" qui derive avec la frame.
 * p = profondeur du calque (0..1, generalement 1 — garde pour compat signature historique),
 * speed = vitesse de defilement (fond ~0.05-0.15, 1er plan ~0.9-1.3).
 */
export const camAt = (frame: number, p: number, speed: number) => {
  const driftX = -frame * speed * p;
  return `translate(${driftX} 0)`;
};

export type HorizonSpec = {
  /** points de controle X, FIXES (partages entre les 2 silhouettes A/B) */
  x: number[];
  /** Y de la silhouette A (etat de depart) */
  yA: number[];
  /** Y de la silhouette B (etat d'arrivee) */
  yB: number[];
};

/**
 * Construit le path SVG d'un horizon parametrique qui interpole entre 2 silhouettes
 * (ex. dunes/cacaoyers -> pics enneiges) selon t (0=A, 1=B).
 *
 * viewBoxWidth/overflow : le polygone DOIT deborder du cadre visible pour survivre au drift
 * de la camera parallaxe — sans marge, le bord du polygone (x=0 et x=viewBoxWidth) se decouvre
 * et dessine une ligne verticale/triangle parasite au bord de l'ecran (bug corrige 2026-07-03).
 * overflow par defaut = 300px de chaque cote, suffisant pour les vitesses de drift habituelles
 * (speed <= 0.15 sur une duree de scene <= 30s). Augmenter si un drift plus rapide est utilise.
 */
export const buildHorizonPath = (spec: HorizonSpec, t: number, viewBoxWidth: number, viewBoxHeight: number, overflow = 300) => {
  const pts = spec.x.map((x, i) => {
    const y = spec.yA[i] + (spec.yB[i] - spec.yA[i]) * t;
    return { x, y };
  });
  const d = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const yFirst = pts[0].y;
  const yLast = pts[pts.length - 1].y;
  return `M ${-overflow} ${yFirst} ${d.slice(d.indexOf(" ") + 1)} L ${viewBoxWidth + overflow} ${yLast} L ${viewBoxWidth + overflow} ${viewBoxHeight} L ${-overflow} ${viewBoxHeight} Z`;
};

/**
 * Sequencage STRICT de 2 elements mutuellement exclusifs (ex. soleil/lune, jour/nuit).
 * Regle : ne jamais avoir opacityA>0 ET opacityB>0 en meme temps — l'element B doit etre
 * COMPLETEMENT invisible avant que l'element A commence a apparaitre (sinon lu comme "2
 * soleils/lunes empiles", bug reel corrige 2026-07-03 sur CargoVoyage16x9_LibreInspire).
 *
 * transitionProgress = 0..1 (ex. nightFade). outThreshold = point ou A doit etre a 0 avant
 * que B commence (defaut 0.85 -> A finit de disparaitre a 0.85, B apparait entre 0.85 et 1).
 */
export const sequenceExclusive = (transitionProgress: number, outThreshold = 0.85) => {
  const opacityA = Math.max(0, 1 - transitionProgress / outThreshold);
  const opacityB = transitionProgress <= outThreshold ? 0 : (transitionProgress - outThreshold) / (1 - outThreshold);
  return { opacityA, opacityB };
};

/**
 * Calcule le Y du vrai bas d'un objet pose (bateau, vehicule) pour caler le split
 * fond/1er-plan d'un decor qui defile (ex. vagues) sur la silhouette REELLE de l'objet,
 * pas sa position de reference. objectRefY = Y du point de reference dans le code (ex. cargoY),
 * hullOffset = decalage vertical entre ce point de reference et le vrai bas visuel dans le
 * repere local du SVG de l'objet (a mesurer une fois sur le composant, ex. 23px pour
 * CargoShipUnified). Bug corrige 2026-07-03 : comparer au ref seul faisait dessiner le decor
 * "1er plan" par-dessus une portion qui tombe visuellement DANS l'objet.
 */
export const objectVisualBottom = (objectRefY: number, hullOffset: number) => objectRefY + hullOffset;

/**
 * Fenetre a bords adoucis : 0 hors de [a,b], 1 au coeur, avec une rampe smoothstep de largeur `ramp`
 * a l'entree ET a la sortie.
 *
 * ⛔ POURQUOI (bug reel, 2026-08-18, scene PlageFableAnimee) : une enveloppe d'effet ecrite en
 * ESCALIER (`u >= a && u < b ? 1 : 0`) allume et eteint l'effet d'un coup. Sur une secousse ajoutee
 * au buste ET aux mains d'un personnage, tout le haut du corps sautait d'un cran a chaque bascule.
 * ⭐ REGLE : une enveloppe d'effet ne s'allume JAMAIS en escalier — elle monte et redescend.
 * ⚠️ Corollaire : adoucir les BORDS ne suffit pas — verifier aussi la VARIATION PAR FRAME au coeur
 * de la fenetre (2.17 deg/frame mesures = vibration, pas geste).
 */
export const smoothWindow = (u: number, a: number, b: number, ramp: number): number => {
  const ss = (t: number) => {
    const c = Math.min(1, Math.max(0, t));
    return c * c * (3 - 2 * c);
  };
  return ss((u - a) / ramp) * ss((b - u) / ramp);
};
