Après plusieurs itérations sur un même chantier (v1→v2→v3...), ne jamais annoncer un point "résolu" sur
la seule base d'un diff relatif ("plus resserré qu'avant", "le drapeau apparaît maintenant") — toujours
reconfronter le résultat ABSOLU au brief d'origine et à toute référence visuelle citée par l'utilisateur
(vidéo, capture, exemple concret) avant de le présenter comme un fix.

**Why :** Sur Soudan Acte 3 (session 2026-07-10), 3 itérations successives (v5→v6→v7) ont chacune amélioré
un problème *relativement* à la version précédente (zoom un peu plus serré, drapeau qui se colorie un
peu). Chaque tour a été présenté comme corrigé. En fin de session, une comparaison directe frame-par-frame
avec la référence que l'utilisateur avait donnée dès le départ (`silk road 2.mov`) a révélé que le zoom
restait très loin du close-up demandé, et qu'un aplat de couleur unie avait été confondu avec "le
drapeau" alors que l'utilisateur redemandait explicitement le motif complet. Le problème n'était pas
qu'aucun progrès n'avait été fait — c'est que le progrès relatif masquait l'écart absolu au brief, et
personne (ni l'agent, ni une relecture) n'avait refait cette comparaison directe avant de déclarer
victoire à chaque tour.

**How to apply :**
- Quand une référence externe existe (vidéo, exemple, capture), l'extraire/regarder à NOUVEAU avant
  chaque présentation de fix, pas seulement au premier tour où le problème a été diagnostiqué.
- Formuler le test comme "est-ce que ça correspond à [référence citée] ?", pas "est-ce mieux qu'avant ?".
- Si l'utilisateur redemande la même chose 2-3 fois dans des mots différents ("la couleur du drapeau",
  "pas juste une couleur"), c'est un signal fort que le fix précédent n'a pas traité le VRAI problème —
  arrêter d'itérer sur la même implémentation et vérifier si l'implémentation elle-même part sur une
  mauvaise piste (ex: aplat de couleur au lieu du composant `useClipFlags` qui existait déjà).
- Une note de code héritée d'une session précédente ("retour Aziz : même sans le drapeau complet") peut
  devenir obsolète si l'utilisateur exprime un avis différent dans la session courante — ne pas la traiter
  comme une contrainte figée sans la re-vérifier explicitement avec lui.
- Quand plusieurs changements interagissent (ex: caméra + drapeaux + pictogrammes + split-screen modifiés
  ensemble), valider avec UN render complet assemblé plutôt qu'une série de mini-renders isolés par
  changement — c'est l'INTERACTION entre les changements qui doit être jugée, pas chaque changement pris
  séparément. Un mini-render par fix peut cacher qu'un ajustement casse ou masque un autre.

**Extension (2026-08-04, Gazoduc Acte 2)** : la même dérive existe pour une idée créative venue d'une
review externe (Gemini/GPT relayée par l'utilisateur) — l'appliquer sur son mérite esthétique seul, sans
la reconfronter au TEXTE NARRÉ exact de la scène, peut créer un contresens. Vécu : une idée "papier
terminé / tuyau pas terminé" (signature manuscrite + sceau) semblait enrichir la scène financement, mais
le texte narré dit explicitement qu'aucune décision d'investissement n'a été prise et que rien n'est
signé — la scène montrait donc l'inverse de ce que le texte affirme. Détecté seulement après montage,
pas avant. **Règle** : toute idée créative externe (review, brainstorm, suggestion) doit être vérifiée
contre la source de vérité texte-narré-exact avant implémentation, pas seulement contre l'esthétique ou
la référence visuelle citée.

**Extension (2026-08-23, candidature Upwork chill-meter) — travailler sur un RÉSUMÉ de la source
alors que la source existe.** Variante distincte des deux précédentes : ici il n'y avait pas
d'itération, mais une source primaire (le PDF du brief client) jamais lue, remplacée par ce qu'une
note de mémoire en avait retenu. J'ai rédigé une candidature complète — titre, lettre, réponses —
sur la base du STATUS. Quand Aziz a fourni le PDF, **2 erreurs sont apparues d'un coup** :
(1) j'avais rédigé un TITRE alors que le formulaire Upwork n'a pas de champ titre ; (2) le brief
demande des effets sonores dans CHAQUE section, un pan entier ignoré en silence par notre démo
muette et par la lettre. Une 3e nuance aussi : la référence visuelle était SON image fournie, pas
un dessin libre — « I built the meter » était donc trop large.

**Le signal manqué** : le STATUS disait lui-même « 2 pièges dans son questionnaire » — un résumé
qui annonce compter les pièges d'une source est l'aveu que la source contient plus que le résumé.
J'aurais dû demander le PDF AVANT d'écrire une ligne, pas après avoir tout rédigé.

**Règle** : avant de produire un livrable qui sera JUGÉ contre une source externe (candidature,
réponse à appel d'offres, travail sur cahier des charges), vérifier que la source primaire est sur
disque et la LIRE. Si elle est absente, le dire et la demander avant de rédiger — pas rédiger
d'abord « en attendant ». Un résumé de brief est une aide à la navigation, jamais un substitut au
brief. Corollaire : c'est le même réflexe que « vérifier CODE + VISUEL avant de réutiliser une
brique » (CLAUDE.md), appliqué aux sources externes plutôt qu'à nos propres livrables.
