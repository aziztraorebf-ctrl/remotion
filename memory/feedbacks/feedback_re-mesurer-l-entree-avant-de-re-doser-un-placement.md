# Re-mesurer L'ENTRÉE avant de re-doser un placement

> Migré depuis auto-memory le 2026-08-31 (contenu original absent du repo).

**Vécu 2026-08-20** (plan combiné H3 + Remotion). **Coût : 3 rendus perdus.**

## Ce qui s'est passé

Un bloc Remotion (une pile de documents) devait se poser sur le plateau d'un bureau, dans une
image de fond. Il se posait à côté. J'ai corrigé **trois fois de suite** en re-dosant l'offset.

Chaque correction était **arithmétiquement cohérente** — avec une origine fausse. J'avais relevé,
par scan de pixels, le **haut du MONITEUR** en croyant relever le **plateau du BUREAU**. Chaque
itération semblait donc « presque bonne », ce qui est exactement l'illusion du dosage.

Aggravant : j'avais écrit dans le code un gros avertissement sur `objectFit: 'cover'`, en
l'accusant de décaler l'axe vertical. **Cet avertissement était faux** — sur 1080/768 le ratio vaut
exactement 1,40625, soit le scale cover lui-même : l'axe Y n'est pas affecté, seul X l'est (−30 px).
Un commentaire faux, écrit de ma main, a détourné le diagnostic pendant trois tours.

Cause racine trouvée en une passe par un agent dédié — délégué à la 3e tentative, alors que le
protocole exige la 2e.

## La règle

⛔ **Devant un défaut de PLACEMENT, avant de re-doser un offset : RE-MESURER l'entrée elle-même.**

- Un scan de pixels trouve **UNE transition horizontale**, pas forcément **LA BONNE**. Cropper la
  zone trouvée et **la REGARDER** avant d'en dériver quoi que ce soit.
- Si un commentaire de code explique le phénomène, **le vérifier avant de raisonner dessus** — un
  commentaire est une hypothèse écrite, pas une mesure.
- Signal de délégation : **si ma 2e tentative est un AJUSTEMENT DE VALEUR de la 1re**, c'est le
  moment de déléguer. Pas la 3e.

**Pourquoi ce feedback existe séparément** : trois voisins traitent des pièges proches mais aucun ne
couvre celui-ci — [[feedback_camera-a-coups-easeinout-par-segment-pas-un-dosage]] (structure vs
dosage), [[feedback_biais-chercher-la-cause-dans-le-fond]] (fond vs forme),
[[feedback_commentaire-justifiant-contournement]] (le commentaire comme signal). Le piège propre à
ce cas est qu'une **entrée fausse rend toute la chaîne aval cohérente**, donc invisible à la relecture.

**Gravé aussi** dans `memory/fiches/FICHE-CAMERA.md` § MESURER AVANT DE RETOUCHER (fiche
auto-injectée au moment de coder un mouvement).
