# Un filtre SVG qui marche sur une zone claire-sur-sombre peut casser une zone sombre-sur-claire

**Date** : 2026-09-06 · **Chantier** : chill-meter (contrat Upwork Abigail)

## Le fait

Trois elements du meme chassis devaient "s'allumer en bleu" au 75 % : le titre "MAX CHILL
DETECTION", 5 icones de boutons, et le bandeau "AbiGirl Reacts". Un filtre SVG
(`feComponentTransfer`) a ete ecrit pour le titre — texte CLAIR grave sur fond metal SOMBRE —
puis copie tel quel (memes types de table, meme logique "plancher a 0, seul le clair remonte")
pour corriger un defaut similaire sur le bandeau.

Resultat : la plaque du bandeau, qui est un metal CLAIR avec le texte grave en CREUX SOMBRE
(polarite INVERSE du titre), est devenue entierement noire au rendu. Le filtre assombrissait
la plaque (qui est claire chez lui) au lieu du texte (qui est sombre chez lui) — l'exact
inverse de l'effet voulu. Defaut repere par Aziz au visionnage d'une video, pas detecte par
Claude qui avait valide le fix sur le mauvais etat de la composition (`ChillMeter-Idle`, ou
`bandeauOn` vaut 0 — le calque incrimine ne s'appliquait meme pas dans ce rendu).

## Pourquoi

Deux elements graves dans la MEME image peuvent avoir des polarites opposees (texte clair sur
fond sombre / texte sombre sur fond clair) selon la fabrication du design (relief eclaire vs
creux ombre). Un filtre `feComponentTransfer` qui manipule "le clair" et "le sombre" n'est PAS
transposable d'un element a l'autre sans re-mesurer — meme s'il produit un resultat "bleu qui
s'allume" dans les deux cas, le sens de l'effet peut s'inverser silencieusement.

## Comment appliquer

- Avant de reutiliser un filtre de recoloration sur un 2e element grave/texture, MESURER sa
  polarite (`luminance moyenne du fond` vs `luminance du texte`) plutot que supposer qu'elle
  est la meme parce que "c'est le meme chassis" ou "le meme effet demande".
- Un filtre qui pousse le CLAIR vers une couleur et ecrase le SOMBRE ne peut fonctionner que
  sur du texte clair/fond sombre. Sur l'inverse, ecrire la table symetrique (pousser le SOMBRE,
  preserver le CLAIR) — jamais copier-coller les valeurs.
- Valider un correctif sur l'ETAT ou l'effet est reellement actif (ici : `bandeauOn > 0`,
  donc `ChillMeter-Fill75` en fin de clip, pas `ChillMeter-Idle`) — un rendu qui ne declenche
  jamais le calque incrimine ne peut rien prouver dessus. Voisin de
  [[frame-0-etat-etabli-mesurer-texture]] (deja dans key-learnings) : ici c'est le meme
  principe applique a un ETAT logique (`bandeauOn`) plutot qu'a une frame.
- Sur une texture organique (metal grunge, rouille), un seuil de luminance global pour isoler
  "le texte" est fragile — l'histogramme n'a souvent pas de coude net entre texture et
  gravure. Preferer un masque construit depuis la GEOMETRIE connue (position/police/taille du
  texte d'origine) plutot qu'une segmentation par valeur de pixel, quand la texture est bruitee.
