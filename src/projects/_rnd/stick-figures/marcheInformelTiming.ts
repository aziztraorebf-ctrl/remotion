// ============================================================================================
// TIMING DERIVE DE LA VOIX — "LE MARCHE QUI N'EXISTE PAS" (2026-07-28)
// ============================================================================================
//
// ⛔ REGLE REMOTION NON-NEGOCIABLE : audio-derived timing, JAMAIS de frame codee a la main.
// Toutes les valeurs de ce fichier sont LUES depuis narration.alignment.json, produit par
// scripts/tools/forced-align.py (moteur ElevenLabs) sur la narration reellement generee.
//
// C'est LA difference avec les 6 scenes R&D precedentes, ou les timings etaient choisis a la
// main (`T = { marcheIn0: 40, ... }`). Ici, un personnage n'entre plus "a la frame 60" : il
// entre QUAND LA VOIX LE NOMME. Si on regenere la narration, les frames suivent toutes seules.
//
// ⚠️ PIEGE VECU A L'ALIGNEMENT : les mots du JSON portent leur PONCTUATION collee ("n'existe",
// "Elle,", "statistiques."). Une recherche par egalite stricte echoue silencieusement (mon
// premier passage a rendu "existe -> INTROUVABLE" alors que le mot etait bien prononce).
// D'ou la normalisation ci-dessous : on compare sur les lettres seules, accents retires.

import alignment from "../../../../public/_rnd/stick-figures/marche-informel/narration.alignment.json";

export const FPS = 30;

type AlignWord = { word?: string; text?: string; start: number; end?: number };

const WORDS: AlignWord[] = (alignment as { words: AlignWord[] }).words;

/** Lettres seules, minuscules, sans accent ni ponctuation. */
const norm = (s: string): string =>
  s
    .normalize("NFD")
    .toLowerCase()
    .split("")
    .filter((c) => /[a-z]/.test(c))
    .join("");

/**
 * Le mot, debarrasse d'une ELISION eventuelle ("n'existe" -> "existe", "l'emploi" -> "emploi").
 * ⚠️ Ne PAS remplacer par une simple inclusion : "elle" serait alors trouve dans "celle" ou
 * "quelle", et le declencheur tomberait sur le mauvais mot sans erreur visible.
 */
const sansElision = (brut: string): string => {
  const apres = brut.split(/['’]/).pop() ?? brut;
  return norm(apres);
};

/**
 * Frame du n-ieme mot dont la forme normalisee vaut `cible`.
 * ⛔ Leve si le mot est absent : un declencheur manquant doit CASSER LE BUILD, jamais retomber
 * silencieusement sur 0 (une scene qui joue tout a la frame 0 est un bug invisible au code et
 * evident au rendu — on veut l'inverse).
 */
export const frameDuMot = (cible: string, occurrence = 0): number => {
  const c = norm(cible);
  const hits = WORDS.filter((w) => {
    const brut = w.word ?? w.text ?? "";
    return norm(brut) === c || sansElision(brut) === c;
  });
  if (hits.length <= occurrence) {
    throw new Error(
      `[marcheInformelTiming] mot "${cible}" (occurrence ${occurrence}) absent de l'alignement. ` +
        `Trouve ${hits.length} occurrence(s).`
    );
  }
  return Math.round(hits[occurrence].start * FPS);
};

/** Derniere frame prononcee = fin reelle de la voix. */
const finVoix = Math.round(
  Math.max(...WORDS.map((w) => w.end ?? w.start)) * FPS
);

// ============================================================================================
// LES 6 DECLENCHEURS — chacun est un MOT, pas un nombre
// ============================================================================================
export const T = {
  /** "et ce marche N'EXISTE pas" -> le decor s'ecrit trait par trait */
  marcheSecrit: frameDuMot("existe"),
  /** "Pas OFFICIELLEMENT." -> fin du trace, le marche est la */
  marchePose: frameDuMot("officiellement"),
  /** "Aucune de ces FEMMES" -> les marchandes de face se mettent a heler */
  marchandsHelent: frameDuMot("femmes"),
  /** "ELLE, elle vend des tomates" -> la commercante se dessine puis marche */
  elleEntre: frameDuMot("elle"),
  /** "LUI, il achete ce soir" -> l'acheteur entre par la droite */
  luiEntre: frameDuMot("lui"),
  /** "Ils sont des MILLIONS" -> la foule se peuple derriere */
  fouleArrive: frameDuMot("millions"),
  /** "presque rien dans les STATISTIQUES" -> les silhouettes s'effacent, le marche reste */
  effacement: frameDuMot("statistiques"),
} as const;

/** Duree de la composition : la voix + une respiration finale pour laisser l'effacement finir. */
export const RESPIRATION_FIN = 2 * FPS;
export const MARCHE_INFORMEL_FRAMES = finVoix + RESPIRATION_FIN;

// ============================================================================================
// GARDE-FOU — l'ordre des declencheurs est une propriete du SCRIPT, on la verifie
// ============================================================================================
// Si une reecriture du script inverse deux phrases, la scene jouerait ses beats dans le
// desordre sans qu'aucun type ne s'en plaigne. On l'attrape ici, au chargement du module.
const ORDRE: (keyof typeof T)[] = [
  "marcheSecrit",
  "marchePose",
  "marchandsHelent",
  "elleEntre",
  "luiEntre",
  "fouleArrive",
  "effacement",
];
ORDRE.forEach((k, i) => {
  if (i > 0 && T[k] <= T[ORDRE[i - 1]]) {
    throw new Error(
      `[marcheInformelTiming] ordre casse : ${k} (f${T[k]}) <= ${ORDRE[i - 1]} (f${T[ORDRE[i - 1]]})`
    );
  }
});
