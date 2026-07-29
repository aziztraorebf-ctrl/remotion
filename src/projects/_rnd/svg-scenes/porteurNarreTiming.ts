// =============================================================================================
// TIMINGS DERIVES DU FORCED-ALIGN — "Le porteur", version narree (2026-07-29)
//
// ⛔ AUCUNE DE CES VALEURS N'EST CHOISIE. Toutes sortent de scripts/tools/forced-align.py
// (moteur ElevenLabs — le quota OpenAI/whisper est epuise, cf. NEXT-ACTION) applique a
// public/_rnd/porteur-narre/narration.mp3 + script.txt.
//   Commande : python3 scripts/tools/forced-align.py <audio> <script> avance grossit stagnent
//              raccourcit avancer --fps 30
//   Resultat : 66 mots alignes, loss = 0.0989, fin de VO a 22.36s = frame 671.
//
// LA DIFFERENCE AVEC LA VERSION PRECEDENTE : le porteur s'arretait a la frame 570 parce que
// quelqu'un avait ecrit 19 secondes. Ici il s'arrete a la frame 652 parce que la VOIX dit
// "avancer" dans "on ne peut plus avancer du tout". Le geste ne suit plus une horloge : il
// repond a un mot.
//
// ⚠️ SI LA NARRATION EST REGENEREE, CE FICHIER EST PERIME : relancer le forced-align et
// recopier les valeurs. Ne jamais "ajuster a l'oeil" un de ces nombres — ce serait rompre le
// lien avec la voix, qui est tout l'objet de cette version.
// =============================================================================================

export const PORTEUR_NARRE_FPS = 30;

// --- Frames BRUTES du forced-align (ne pas modifier a la main) --------------------------------
export const MOTS = {
  /** "...et l'economie avance."  -> il marche d'un pas ample, charge legere */
  avance: 124,
  /** "...la charge grossit un peu plus." -> la croissance de la charge s'accelere */
  grossit: 266,
  /** "Ses recettes stagnent." -> le corps cesse de compenser, il subit */
  stagnent: 414,
  /** "Alors le pas se raccourcit." -> le pas raccourcit AU MOMENT ou la voix le dit */
  raccourcit: 475,
  /** "...on ne peut plus avancer du tout." -> l'ARRET tombe sur ce mot */
  avancer: 652,
} as const;

/** Fin de la voix (dernier mot aligne). La scene garde une courte queue apres. */
export const FIN_VO = 671;

/** Duree totale : la fin de VO + ~1.6s de respiration (la charge continue de grossir). */
export const PORTEUR_NARRE_FRAMES = FIN_VO + 48;

// --- Reperes DERIVES (calcules a partir des mots, jamais saisis) -------------------------------
//
// L'entree du personnage : il doit deja marcher quand la 1re phrase commence, sinon il "attend"
// le texte. On le fait entrer 1s avant le 1er mot-repere.
export const ENTREE = Math.max(0, MOTS.avance - 30);

// La charge commence a grossir des l'entree, mais son ACCELERATION est calee sur "grossit".
export const CHARGE_ACCEL = MOTS.grossit;

// "stagnent" : le corps cesse de compenser. C'est la que lean/hipDrop montent franchement.
export const SUBIT = MOTS.stagnent;

// "raccourcit" : le pas raccourcit. Le mot DIT ce que l'image FAIT, au meme instant.
export const PAS_COURT = MOTS.raccourcit;

// L'arret : il tombe sur "avancer". On l'amorce legerement AVANT le mot pour que l'immobilite
// soit acquise QUAND le mot tombe (un arret qui commence sur le mot se lit en retard).
export const ARRET_DEBUT = MOTS.avancer - 24;
export const ARRET_FIN = MOTS.avancer + 6;
