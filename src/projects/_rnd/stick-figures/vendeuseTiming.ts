// ============================================================================================
// TIMING DERIVE DE LA VOIX — "LA VENDEUSE" (2026-07-28)
// ============================================================================================
//
// 2e scene pilotee par la voix. La chaine (script -> narration -> forced-align -> frames) est
// reprise telle quelle de `marcheInformelTiming.ts` : elle avait fonctionne. Ce qui change, c'est
// CE QU'ELLE PILOTE.
//
// ⭐ LECON DE LA SCENE PRECEDENTE (verdict d'Aziz) : "le declencheur ne semblait pas vraiment
// envoyer grand chose". La chaine etait juste, mais elle pilotait des evenements MINUSCULES (une
// opacite qui monte, un passant de plus au fond, un bras leve de 30px). Un declencheur ne vaut
// que par l'AMPLEUR de ce qu'il declenche.
// -> Ici, 4 declencheurs seulement, chacun portant un geste AMPLE et lisible du corps entier :
//    marcher / s'asseoir / se relever et heler / repartir.

import alignment from "../../../../public/_rnd/stick-figures/vendeuse/narration.alignment.json";

export const FPS = 30;

type AlignWord = { word?: string; text?: string; start: number; end?: number };
const WORDS: AlignWord[] = (alignment as { words: AlignWord[] }).words;

const norm = (s: string): string =>
  s.normalize("NFD").toLowerCase().split("").filter((c) => /[a-z]/.test(c)).join("");

/** "n'existe" -> "existe" (le JSON garde l'elision collee au mot). */
const sansElision = (brut: string): string => norm(brut.split(/['’]/).pop() ?? brut);

/** ⛔ Leve si le mot manque : un declencheur absent doit CASSER, jamais retomber sur 0. */
export const frameDuMot = (cible: string, occurrence = 0): number => {
  const c = norm(cible);
  const hits = WORDS.filter((w) => {
    const brut = w.word ?? w.text ?? "";
    return norm(brut) === c || sansElision(brut) === c;
  });
  if (hits.length <= occurrence) {
    throw new Error(`[vendeuseTiming] mot "${cible}" (occ ${occurrence}) absent — ${hits.length} trouve(s).`);
  }
  return Math.round(hits[occurrence].start * FPS);
};

const finVoix = Math.round(Math.max(...WORDS.map((w) => w.end ?? w.start)) * FPS);

/**
 * ⭐ AMORCE AVANT LA VOIX — corrige un defaut trouve PAR LE CALCUL, avant tout rendu.
 *
 * Mon 1er decoupage faisait DEMARRER sa marche sur le mot "arrive" (f8) pour l'arreter sur
 * "attend" (f88) : 2,7 s pour traverser l'ecran. Aucune vitesse credible ne le permet (il aurait
 * fallu 4,7 a 11,8 pas/s — elle aurait COURU), et raccourcir le trajet la faisait a peine bouger
 * (96 a 137 px, un pietinement).
 *
 * ⛔ Le defaut n'etait pas le reglage, c'etait MON DECOUPAGE : "Elle arrive avant tout le monde"
 * ne dit pas qu'elle traverse le cadre, ca dit qu'elle EST DEJA LA. Rien n'oblige la scene a
 * commencer avec la voix.
 * -> La scene demarre AVANT la narration : elle marche deja quand la voix parle, et le mot
 * "arrive" ponctue la FIN de son entree au lieu d'en etre le depart. Le geste garde son ampleur
 * ET sa vitesse humaine.
 *
 * ⚠️ UNE SEULE constante : elle a ete brievement dupliquee (AMORCE + AMORCE_F). Deux litteraux a
 * garder en phase = un calage voix/image qui se casse en silence a la premiere divergence.
 */
export const AMORCE = 7 * FPS;

// ============================================================================================
// LES 4 DECLENCHEURS — un geste ample chacun, ~5s pour se deployer
// ============================================================================================
// ⚠️ Toutes les frames publiees INCLUENT l'amorce : ce sont des frames de la COMPOSITION,
// directement utilisables par la scene. C'est le SEUL endroit ou le decalage est applique — la
// scene n'a jamais a y penser, donc elle ne peut pas l'oublier sur un beat.
export const T = {
  /** "Elle ARRIVE avant tout le monde" -> ponctue la FIN de son entree (elle marche deja) */
  arrive: AMORCE + frameDuMot("arrive"),
  /** "Elle ATTEND. Six heures. Douze heures." -> elle s'assied (geste ample, valide vague A) */
  attend: AMORCE + frameDuMot("attend"),
  /** "Elle VEND." -> elle se releve et hele */
  vend: AMORCE + frameDuMot("vend"),
  /** "Ce marche ne FERME jamais" -> elle repart, le marche reste */
  ferme: AMORCE + frameDuMot("ferme"),
} as const;

export const RESPIRATION_FIN = 2 * FPS;
export const VENDEUSE_FRAMES = AMORCE + finVoix + RESPIRATION_FIN;

// garde-fou d'ordre : une reecriture du script qui inverse deux phrases doit CASSER, pas
// produire des beats joues dans le desordre.
const ORDRE: (keyof typeof T)[] = ["arrive", "attend", "vend", "ferme"];
ORDRE.forEach((k, i) => {
  if (i > 0 && T[k] <= T[ORDRE[i - 1]]) {
    throw new Error(`[vendeuseTiming] ordre casse : ${k} (f${T[k]}) <= ${ORDRE[i - 1]} (f${T[ORDRE[i - 1]]})`);
  }
});
